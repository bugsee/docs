#!/usr/bin/env node

/**
 * Post-build script: copies raw Markdown files into build/ so AI agents
 * can fetch them alongside the HTML pages.
 *
 * - .md files are copied as-is
 * - .mdx files are converted to plain Markdown (JSX stripped)
 *
 * URL mapping:
 *   docs/sdk/ios/installation.md  → build/sdk/ios/installation.md
 *   docs/sdk/android/config.mdx   → build/sdk/android/config.md
 */

import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { join, relative, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = join(__dirname, '..');
const DOCS_DIR = join(PROJECT_DIR, 'docs');
const BUILD_DIR = join(PROJECT_DIR, 'build');
const BASE_URL = 'https://docs.bugsee.com';

/**
 * Simplify front matter: keep only title, description, and add url.
 * Derives url from the slug field before removing it.
 */
function simplifyFrontMatter(content, destRel) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fmMatch) return content;

  const fm = fmMatch[1];
  const body = content.slice(fmMatch[0].length);

  let title = '';
  const titleMatch = fm.match(/title:\s*(?:"([^"\n]*)"|'([^'\n]*)'|([^\n]+))/);
  if (titleMatch) title = titleMatch[1] || titleMatch[2] || titleMatch[3] || '';
  title = title.trim();

  let description = '';
  const descMatch = fm.match(/description:\s*(?:"([^"\n]*)"|'([^'\n]*)'|([^\n]+))/);
  if (descMatch) description = descMatch[1] || descMatch[2] || descMatch[3] || '';
  description = description.trim();

  let urlPath = destRel.replace(/\.md$/, '');
  if (urlPath === 'index') {
    urlPath = '';
  } else {
    urlPath = urlPath + '/';
  }
  const url = `${BASE_URL}/${urlPath}`;

  let newFm = `---\ntitle: "${title}"`;
  if (description) newFm += `\ndescription: "${description}"`;
  newFm += `\nurl: "${url}"`;
  newFm += `\n---\n`;

  return newFm + body;
}

/**
 * Convert MDX content to plain Markdown by stripping JSX components.
 */
function mdxToMarkdown(content) {
  const lines = content.split('\n');
  const output = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Strip import statements
    if (trimmed.startsWith('import ') && trimmed.includes(' from ')) {
      continue;
    }

    // Convert <TabItem value="java" label="Java"> → **Java**
    const tabItemMatch = trimmed.match(/<TabItem\s[^>]*label="([^"]+)"[^>]*>/);
    if (tabItemMatch) {
      output.push(`**${tabItemMatch[1]}**`);
      output.push('');
      continue;
    }

    // Strip <Tabs ...>, </Tabs>, </TabItem>
    if (/^<Tabs[\s>]/.test(trimmed) || trimmed === '</Tabs>' || trimmed === '</TabItem>') {
      continue;
    }

    output.push(line);
  }

  return output.join('\n');
}

/**
 * Recursively collect all .md and .mdx files.
 */
async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(fullPath));
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  const files = await collectFiles(DOCS_DIR);
  let copied = 0;

  for (const srcPath of files) {
    if (srcPath.endsWith('SKILL.md')) {
      continue;
    }

    let content = await readFile(srcPath, 'utf-8');
    const ext = extname(srcPath);

    // Strip JSX from .mdx files
    if (ext === '.mdx') {
      content = mdxToMarkdown(content);
    }

    const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
    let slug = '';
    if (fmMatch) {
      const slugMatch = fmMatch[1].match(/slug:\s*(?:"([^"\n]*)"|'([^'\n]*)'|([^\n]+))/);
      if (slugMatch) slug = slugMatch[1] || slugMatch[2] || slugMatch[3] || '';
      slug = slug.trim();
    }

    const rel = relative(DOCS_DIR, srcPath);
    let destRel;

    if (slug) {
      destRel = slug.replace(/^\/+/, '') + '.md';
    } else {
      destRel = rel.replace(/\.mdx$/, '.md');
      if (destRel.endsWith('/index.md')) {
        destRel = destRel.replace(/\/index\.md$/, '.md');
      }
    }

    const destPath = join(BUILD_DIR, destRel);

    // Ensure destination directory exists
    await mkdir(dirname(destPath), { recursive: true });

    // Simplify front matter: keep only title, description, url
    content = simplifyFrontMatter(content, destRel);

    await writeFile(destPath, content);

    copied++;
  }

  console.log(`Copied ${copied} raw Markdown files to build/`);
}

main().catch((err) => {
  console.error('Error copying raw Markdown:', err);
  process.exit(1);
});
