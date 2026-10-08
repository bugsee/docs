#!/usr/bin/env node

/**
 * Mirrors the SDK-setup skills from bugsee/bugsee-for-ai into
 * docs/ai/agent-skills/sdk/**, so that bugsee-for-ai is the only place a skill
 * is edited and the copies served at docs.bugsee.com/ai/agent-skills/... can
 * never drift from it.
 *
 *   node scripts/mirror-skills.mjs            regenerate from the pinned commit
 *   node scripts/mirror-skills.mjs --update   move the pin to bugsee-for-ai main, regenerate
 *   node scripts/mirror-skills.mjs --check    fail if any generated file differs from a
 *                                             regeneration at the pinned commit (hand edits)
 *   --source <dir>                            use a local bugsee-for-ai checkout instead of
 *                                             fetching (never touches the pin; for testing)
 *
 * Inputs:  scripts/skills-map.json     which plugin skill feeds which docs path
 *          scripts/skills-source.json  the bugsee-for-ai commit the copies were built from
 * Output:  docs/ai/agent-skills/<dest>/SKILL.md  (each carries `generated_from` in its frontmatter)
 *
 * Files listed under "docsOwned" in the map are not generated and are left alone.
 * The existing scripts/sync-skills.mjs then copies the result to static/ for `curl`.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPTS = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPTS, '..');
const OUT_ROOT = join(ROOT, 'docs', 'ai', 'agent-skills');
const MAP_PATH = join(SCRIPTS, 'skills-map.json');
const PIN_PATH = join(SCRIPTS, 'skills-source.json');

/** Frontmatter keys carried over from the plugin skill. Plugin-only keys (`parent`,
 *  `disable-model-invocation`, `allowed-tools`) are dropped on purpose: the docs copies are
 *  fetched by hand, and must not pre-approve tools on someone's machine. */
const KEEP_FROM_SOURCE = ['name', 'description', 'license', 'category'];

/** Parse a SKILL.md into { fm, body }. Only single-line `key: value` frontmatter is supported;
 *  anything else throws, so a new frontmatter shape fails loudly instead of being mangled. */
export function parseSkill(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error('SKILL.md has no frontmatter');
  const fm = {};
  for (const line of m[1].split('\n')) {
    if (!line.trim()) continue;
    if (/^\s/.test(line)) throw new Error(`multi-line frontmatter value is not supported: "${line.trim().slice(0, 60)}"`);
    const i = line.indexOf(':');
    if (i === -1) throw new Error(`unparseable frontmatter line: "${line.slice(0, 60)}"`);
    fm[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { fm, body: text.slice(m[0].length) };
}

/** YAML-safe scalar: plain when that is unambiguous, otherwise a JSON (= YAML double-quoted) string. */
export function yamlScalar(v) {
  const unwrapped = v.replace(/^"(.*)"$/s, '$1');
  const risky = /(^[-?:,\[\]{}#&*!|>'"%@`])|(: )|( #)|(\s$)/.test(unwrapped) || unwrapped === '';
  return risky ? JSON.stringify(unwrapped) : unwrapped;
}

/**
 * Turn one plugin SKILL.md into its docs copy.
 * `mirrored` maps plugin skill name -> docs dest, so links between mirrored skills stay on the site.
 */
export function transformSkill(sourceText, entry, mirrored, cfg) {
  const { fm, body } = parseSkill(sourceText);
  for (const k of KEEP_FROM_SOURCE) if (!fm[k]) throw new Error(`${entry.plugin}: frontmatter is missing "${k}"`);
  if (fm.name !== entry.plugin) throw new Error(`${entry.plugin}: frontmatter name is "${fm.name}"`);

  // The first body line is the plugin's navigation breadcrumb; it points at files that only
  // exist inside the plugin repo.
  let out = body.replace(/^\n*> \[All Skills\]\([^\n]*\n\n?/, '');

  const docsBase = cfg.source.docsBase;
  out = out.replace(/\]\(\.\.\/(bugsee-[a-z0-9-]+)\/SKILL\.md(#[^)]*)?\)/g, (_, name, anchor = '') => {
    const dest = mirrored.get(name);
    return dest
      ? `](${docsBase}/ai/agent-skills/${dest}/SKILL.md${anchor})`
      : `](${cfg.source.blobBase}/skills/${name}/SKILL.md${anchor})`;
  });
  out = out.replace(/\]\(\.\.\/\.\.\/SKILL_TREE\.md(#[^)]*)?\)/g, (_, anchor = '') => `](${cfg.source.blobBase}/SKILL_TREE.md${anchor})`);

  const left = out.match(/\]\(\.{1,2}\/[^)]*\)/);
  if (left) throw new Error(`${entry.plugin}: unhandled relative link ${left[0]} — extend transformSkill()`);

  const lines = [
    '---',
    `title: ${yamlScalar(entry.title)}`,
    `name: ${yamlScalar(fm.name)}`,
    `description: ${yamlScalar(fm.description)}`,
    `sidebar_label: ${yamlScalar(entry.label)}`,
    `sidebar_position: ${entry.position}`,
    `slug: "/ai/agent-skills/${entry.dest}/SKILL"`,
    `license: ${yamlScalar(fm.license)}`,
    `category: ${yamlScalar(fm.category)}`,
    `generated_from: bugsee-for-ai/skills/${entry.plugin}/SKILL.md`,
    '---',
    '',
    '',
  ];
  // Exactly one blank line between the frontmatter and the body, whether or not a breadcrumb was stripped.
  return lines.join('\n') + out.replace(/^\n+/, '');
}

/** Build every generated file as { absolutePath -> content } from a bugsee-for-ai checkout. */
export function buildAll(sourceDir, cfg) {
  const mirrored = new Map(cfg.skills.map((s) => [s.plugin, s.dest]));
  const files = new Map();
  for (const entry of cfg.skills) {
    const src = join(sourceDir, 'skills', entry.plugin, 'SKILL.md');
    if (!existsSync(src)) throw new Error(`${entry.plugin}: ${src} does not exist in the source checkout`);
    files.set(join(OUT_ROOT, entry.dest, 'SKILL.md'), transformSkill(readFileSync(src, 'utf8'), entry, mirrored, cfg));
  }
  return files;
}

/** Previously generated files that the map no longer produces (a skill was removed or renamed). */
function findOrphans(files, cfg) {
  const owned = new Set(cfg.docsOwned.map((d) => join(OUT_ROOT, d, 'SKILL.md')));
  const orphans = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === 'SKILL.md' && !files.has(p) && !owned.has(p) && /^generated_from:/m.test(readFileSync(p, 'utf8'))) orphans.push(p);
    }
  };
  if (existsSync(join(OUT_ROOT, 'sdk'))) walk(join(OUT_ROOT, 'sdk'));
  return orphans;
}

function git(args, opts = {}) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim();
}

/** Fetch exactly one commit of bugsee-for-ai into a temp dir. */
function fetchSource(repo, ref) {
  const dir = mkdtempSync(join(tmpdir(), 'bugsee-for-ai-'));
  git(['init', '-q'], { cwd: dir });
  git(['fetch', '-q', '--depth', '1', repo, ref], { cwd: dir });
  git(['checkout', '-q', 'FETCH_HEAD'], { cwd: dir });
  return dir;
}

function main() {
  const args = process.argv.slice(2);
  const flag = (n) => args.includes(n);
  const sourceIdx = args.indexOf('--source');
  const localSource = sourceIdx !== -1 ? args[sourceIdx + 1] : null;
  const cfg = JSON.parse(readFileSync(MAP_PATH, 'utf8'));

  let ref;
  if (localSource) {
    ref = 'local';
  } else if (flag('--update')) {
    ref = git(['ls-remote', cfg.source.repo, 'refs/heads/main']).split(/\s+/)[0];
    if (!/^[0-9a-f]{40}$/.test(ref)) throw new Error(`could not resolve bugsee-for-ai main (got "${ref}")`);
  } else {
    ref = JSON.parse(readFileSync(PIN_PATH, 'utf8')).ref;
  }

  const tmp = localSource ? null : fetchSource(cfg.source.repo, ref);
  let files;
  try {
    files = buildAll(localSource ?? tmp, cfg);
  } finally {
    if (tmp) rmSync(tmp, { recursive: true, force: true });
  }
  const orphans = findOrphans(files, cfg);

  if (flag('--check')) {
    const stale = [...files].filter(([p, c]) => !existsSync(p) || readFileSync(p, 'utf8') !== c).map(([p]) => p);
    const bad = [...stale, ...orphans].map((p) => p.replace(ROOT + '/', ''));
    if (bad.length) {
      console.error(`These generated skill files differ from bugsee-for-ai@${ref.slice(0, 7)}:\n  ${bad.join('\n  ')}`);
      console.error('Do not edit them by hand. Change the skill in bugsee/bugsee-for-ai, or run `npm run mirror-skills`.');
      process.exit(1);
    }
    console.log(`OK — ${files.size} mirrored skills match bugsee-for-ai@${ref.slice(0, 7)}`);
    return;
  }

  let changed = 0;
  for (const [p, c] of files) {
    if (existsSync(p) && readFileSync(p, 'utf8') === c) continue;
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, c);
    changed++;
  }
  for (const p of orphans) { rmSync(p); changed++; }
  // Move the pin only when the generated output actually changed. The older pin stays valid (it
  // produces identical files), and a bugsee-for-ai commit that touches no skill content (CI,
  // README, ...) must not open a sync PR whose only change is the pin.
  const pinned = JSON.parse(readFileSync(PIN_PATH, 'utf8')).ref;
  const updating = !localSource && flag('--update');
  if (updating && changed > 0) writeFileSync(PIN_PATH, JSON.stringify({ ref }, null, 2) + '\n');
  const kept = updating && changed === 0 && ref !== pinned;
  console.log(`Mirrored ${files.size} skills from bugsee-for-ai@${ref.slice(0, 7)}; ${changed} file${changed === 1 ? '' : 's'} changed.` +
    (kept ? ` No skill content changed since @${pinned.slice(0, 7)}; pin kept.` : ''));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
