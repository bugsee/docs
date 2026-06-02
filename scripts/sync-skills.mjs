#!/usr/bin/env node

/**
 * Syncs agent-skill and agent-skills navigation files from docs/ to static/.
 *
 * Source of truth: every *.md file under docs/ai/agent-skills/
 * Output:          matching path under static/ai/agent-skills/
 *
 * Path mapping follows Docusaurus routing + aiPageActions.js (which appends
 * `.md` to `window.location.pathname` with the trailing slash stripped):
 *
 *   docs/ai/agent-skills/index.md
 *     → static/ai/agent-skills.md
 *       (route `/ai/agent-skills/` → fetches `/ai/agent-skills.md`)
 *
 *   docs/ai/agent-skills/sdk/<platform>/SKILL.md
 *     → static/ai/agent-skills/sdk/<platform>/SKILL.md
 *
 *   docs/ai/agent-skills/sdk/<platform>/<version>/SKILL.md
 *     → static/ai/agent-skills/sdk/<platform>/<version>/SKILL.md
 *
 * Transform rules:
 *   - SKILL.md files have their frontmatter stripped to Agent Skills spec
 *     fields only (so AI agents that curl the URL get clean output).
 *   - Any other *.md file (e.g. index.md) is copied as-is.
 */

import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { join, dirname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = join(__dirname, '..');
const DOCS_ROOT = join(PROJECT_DIR, 'docs', 'ai', 'agent-skills');
const STATIC_ROOT = join(PROJECT_DIR, 'static', 'ai', 'agent-skills');

/** Fields kept when rewriting frontmatter for SKILL.md files. */
const AGENT_SKILLS_FIELDS = [
  'name',
  'description',
  'license',
  'category',
  'compatibility',
  'metadata',
  'allowed-tools',
];

/** Recursively list every *.md file under `dir`. */
async function listMarkdownFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(full)));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Map a source path under DOCS_ROOT to its destination path under STATIC_ROOT,
 * collapsing `index.md` up one level so `<parent>/index.md` becomes
 * `<parent>.md`.
 */
function mapDestination(srcPath) {
  const rel = relative(DOCS_ROOT, srcPath); // e.g. "sdk/android/SKILL.md" or "index.md"
  if (basename(rel) === 'index.md') {
    const parent = dirname(rel); // "." when rel is "index.md"
    if (parent === '.' || parent === '') {
      // docs/ai/agent-skills/index.md → static/ai/agent-skills.md
      return `${STATIC_ROOT}.md`;
    }
    // docs/ai/agent-skills/foo/bar/index.md → static/ai/agent-skills/foo/bar.md
    return join(STATIC_ROOT, `${parent}.md`);
  }
  return join(STATIC_ROOT, rel);
}

/**
 * Rewrite a SKILL.md's frontmatter to keep only Agent Skills spec fields.
 * Returns the transformed file content. If the file has no frontmatter,
 * returns `content` unchanged.
 */
function stripSkillFrontmatter(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fmMatch) return content;

  const fmBlock = fmMatch[1];
  const body = content.slice(fmMatch[0].length);

  const agentLines = [];
  for (const line of fmBlock.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    if (!AGENT_SKILLS_FIELDS.includes(key)) continue;
    // Strip quotes from single-line scalar values for cleaner output.
    const rawValue = line.slice(colonIdx + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, '');
    agentLines.push(`${key}: ${value}`);
  }

  return `---\n${agentLines.join('\n')}\n---\n${body}`;
}

async function syncSkills() {
  try {
    await stat(DOCS_ROOT);
  } catch {
    console.error(`No agent-skills directory found at ${DOCS_ROOT}`);
    process.exit(1);
  }

  const files = await listMarkdownFiles(DOCS_ROOT);
  let count = 0;

  for (const srcPath of files) {
    const destPath = mapDestination(srcPath);
    const content = await readFile(srcPath, 'utf-8');

    const output =
      basename(srcPath) === 'SKILL.md' ? stripSkillFrontmatter(content) : content;

    await mkdir(dirname(destPath), { recursive: true });
    await writeFile(destPath, output);
    count++;
  }

  console.log(`Synced ${count} agent-skills file${count === 1 ? '' : 's'} to static/ai/agent-skills/`);
}

syncSkills();
