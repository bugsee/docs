#!/usr/bin/env node

/**
 * MkDocs to Docusaurus content migration script.
 *
 * Reads mkdocs.yml, transforms all markdown files, and writes them
 * to docusaurus/docs/ with proper front matter, converted tabs,
 * converted admonitions, and corrected code fence languages.
 *
 * Also generates sidebars.ts from the mkdocs.yml nav structure.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const MKDOCS_DOCS = path.join(PROJECT_ROOT, 'docs');
const DOCUSAURUS_ROOT = path.resolve(__dirname, '..');
const DOCUSAURUS_DOCS = path.join(DOCUSAURUS_ROOT, 'docs');

// ===== YAML parser (minimal, handles mkdocs.yml nav structure) =====

function parseMkdocsYaml(content) {
  const lines = content.split('\n');
  const nav = [];
  let inNav = false;
  let navLines = [];

  for (const line of lines) {
    if (line.match(/^nav\s*:/)) {
      inNav = true;
      continue;
    }
    if (inNav) {
      // A new top-level YAML key (not a list item) ends the nav section
      if (line.match(/^[a-zA-Z_]/) && !line.match(/^\s/) && !line.startsWith('-')) {
        break;
      }
      navLines.push(line);
    }
  }

  return parseNavItems(navLines, 0);
}

function parseNavItems(lines, baseIndent) {
  const items = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '' || line.trim().startsWith('#')) {
      i++;
      continue;
    }

    const indent = line.search(/\S/);
    if (indent < baseIndent) break;
    if (indent > baseIndent) {
      i++;
      continue;
    }

    const trimmed = line.trim();

    // Check if it's "- Label: 'path.md'" or "- Label: path.md"
    const leafMatch = trimmed.match(/^-\s+(.+?):\s+['"]*([^'"]+\.md)['"]*\s*$/);
    if (leafMatch) {
      items.push({ label: leafMatch[1].trim(), path: leafMatch[2].trim() });
      i++;
      continue;
    }

    // Check if it's "- Label:" (category with children)
    const catMatch = trimmed.match(/^-\s+(.+?):\s*$/);
    if (catMatch) {
      const label = catMatch[1].trim();
      // Collect child lines
      const childLines = [];
      i++;
      while (i < lines.length) {
        const childLine = lines[i];
        if (childLine.trim() === '') {
          i++;
          continue;
        }
        const childIndent = childLine.search(/\S/);
        if (childIndent <= indent) break;
        childLines.push(childLine);
        i++;
      }
      const children = parseNavItems(childLines, indent + 2);
      items.push({ label, children });
      continue;
    }

    i++;
  }

  return items;
}

// ===== Sidebar generation =====

function generateSidebarItem(item, position) {
  if (item.path) {
    // Leaf doc
    let docId = item.path.replace(/\.md$/, '');
    // index.md files: keep as-is, Docusaurus handles them
    return `{type: 'doc', id: '${docId}', label: '${escapeSingleQuote(item.label)}'}`;
  }
  if (item.children) {
    const childItems = item.children.map((child, idx) => generateSidebarItem(child, idx));
    return `{
      type: 'category',
      label: '${escapeSingleQuote(item.label)}',
      collapsed: true,
      items: [
        ${childItems.join(',\n        ')}
      ],
    }`;
  }
  return '';
}

function escapeSingleQuote(s) {
  return s.replace(/'/g, "\\'");
}

function generateSidebarsTs(navItems) {
  const items = navItems.map((item, idx) => generateSidebarItem(item, idx));

  return `import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    ${items.join(',\n    ')}
  ],
};

export default sidebars;
`;
}

// ===== Content transformations =====

/**
 * Extract title from first # heading and remove it from content.
 */
function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  if (match) {
    const title = match[1].trim();
    const newContent = content.replace(/^#\s+.+$/m, '').replace(/^\n+/, '');
    return { title, content: newContent };
  }
  return { title: null, content };
}

/**
 * Convert **!LanguageName** + code block groups to Docusaurus Tabs.
 * Returns { content, hasTabs }.
 */
function convertTabs(content) {
  // Pattern: **!LangName** followed by a code block
  const tabPattern = /^\*\*!(.+?)\*\*$/;
  const codeBlockStart = /^```(\S*)/;
  const codeBlockEnd = /^```\s*$/;

  const lines = content.split('\n');
  const result = [];
  let hasTabs = false;
  let i = 0;

  while (i < lines.length) {
    // Check if current line is a tab marker
    const tabMatch = lines[i].match(tabPattern);
    if (!tabMatch) {
      result.push(lines[i]);
      i++;
      continue;
    }

    // Check if previous line was also a tab marker's code block
    // We need to find the start of a tab group (first tab marker)
    // Collect consecutive tab+code pairs
    const tabGroup = [];
    while (i < lines.length) {
      const tm = lines[i].match(tabPattern);
      if (!tm) break;

      const tabLabel = tm[1];
      i++; // move past tab marker

      // Skip blank lines between tab marker and code block
      while (i < lines.length && lines[i].trim() === '') i++;

      // Expect a code block
      const codeStart = lines[i] && lines[i].match(codeBlockStart);
      if (!codeStart) {
        // Not a code block, put back the tab marker as text
        result.push(`**!${tabLabel}**`);
        break;
      }

      const lang = codeStart[1] || '';
      const codeLines = [lines[i]];
      i++;

      // Collect until end of code block
      while (i < lines.length && !lines[i].match(codeBlockEnd)) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) {
        codeLines.push(lines[i]); // closing ```
        i++;
      }

      tabGroup.push({ label: tabLabel, code: codeLines.join('\n') });

      // Skip blank lines before next potential tab
      while (i < lines.length && lines[i].trim() === '') i++;
    }

    if (tabGroup.length > 1) {
      hasTabs = true;
      // Determine groupId based on tab labels
      const groupId = determineGroupId(tabGroup.map(t => t.label));

      result.push('');
      result.push(`<Tabs groupId="${groupId}">`);
      for (const tab of tabGroup) {
        const value = tab.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        result.push(`  <TabItem value="${value}" label="${tab.label}">`);
        result.push('');
        result.push(tab.code);
        result.push('');
        result.push('  </TabItem>');
      }
      result.push('</Tabs>');
      result.push('');
    } else if (tabGroup.length === 1) {
      // Single tab, just output code block directly
      result.push(tabGroup[0].code);
    }
  }

  return { content: result.join('\n'), hasTabs };
}

function determineGroupId(labels) {
  const normalized = labels.map(l => l.toLowerCase());
  if (normalized.includes('objective-c') || normalized.includes('swift')) return 'lang-ios';
  if (normalized.includes('java') && normalized.includes('kotlin')) return 'lang-android';
  if (normalized.includes('groovy') && normalized.includes('kts')) return 'lang-gradle';
  if (normalized.includes('ios') && normalized.includes('android')) return 'platform';
  if (normalized.includes('spm') || normalized.includes('non-spm installation')) return 'install-method';
  return 'code-tabs';
}

/**
 * Convert warning-box HTML divs to Docusaurus admonition syntax.
 */
function convertWarningBoxes(content) {
  // Single-line warning boxes
  content = content.replace(
    /<div class="warning-box standalone">([\s\S]*?)<\/div>/g,
    (match, inner) => {
      const converted = htmlToMarkdown(inner.trim());
      return `:::warning\n${converted}\n:::`;
    }
  );
  return content;
}

/**
 * Convert tip-block HTML divs to Docusaurus admonition syntax.
 */
function convertTipBlocks(content) {
  // Multi-line tip blocks with <span>
  content = content.replace(
    /<div class="tip-block">\s*<span>([\s\S]*?)<\/span>\s*<\/div>/g,
    (match, inner) => {
      const converted = htmlToMarkdown(inner.trim());
      return `:::info\n${converted}\n:::`;
    }
  );
  // Multi-line tip blocks without <span>
  content = content.replace(
    /<div class="tip-block">\s*([\s\S]*?)\s*<\/div>/g,
    (match, inner) => {
      const converted = htmlToMarkdown(inner.trim());
      return `:::info\n${converted}\n:::`;
    }
  );
  // Single-line tip blocks with <span>
  content = content.replace(
    /<div class="tip-block"><span>([\s\S]*?)<\/span><\/div>/g,
    (match, inner) => {
      const converted = htmlToMarkdown(inner.trim());
      return `:::info\n${converted}\n:::`;
    }
  );
  return content;
}

/**
 * Convert basic HTML tags to markdown equivalents.
 */
function htmlToMarkdown(html) {
  let result = html;
  // Convert <a href="...">text</a> to [text](...)
  result = result.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)');
  // Convert <i>text</i> to *text*
  result = result.replace(/<i>([\s\S]*?)<\/i>/g, '*$1*');
  // Convert <em>text</em> to *text*
  result = result.replace(/<em>([\s\S]*?)<\/em>/g, '*$1*');
  // Convert <strong>text</strong> to **text**
  result = result.replace(/<strong>([\s\S]*?)<\/strong>/g, '**$1**');
  // Convert <code>text</code> to `text`
  result = result.replace(/<code>([\s\S]*?)<\/code>/g, '`$1`');
  // Convert <br> / <br/> to newline
  result = result.replace(/<br\s*\/?>/g, '\n');
  return result;
}

/**
 * Escape HTML-like tags in prose for MDX compatibility.
 * Wraps bare <tagName\> or <tagName> patterns in backticks
 * but only outside of code fences and JSX component tags.
 */
function escapeMdxProseHtml(content) {
  // Replace <word\> patterns (MkDocs escaped tags) with backtick-wrapped version
  content = content.replace(/<(\w+)\\>/g, '`<$1>`');
  return content;
}

/**
 * Escape ${...} template literals in prose for MDX compatibility.
 * MDX interprets ${...} as JavaScript expressions.
 * Only escapes in prose, not in code fences.
 */
function escapeMdxTemplateExpressions(content) {
  const lines = content.split('\n');
  const result = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.match(/^```/)) {
      inCodeBlock = !inCodeBlock;
      result.push(line);
      continue;
    }
    if (inCodeBlock) {
      result.push(line);
      continue;
    }
    // Escape ${...} in prose
    result.push(line.replace(/\$\{([^}]+)\}/g, "{'{\\${$1}'}"));
  }
  return result.join('\n');
}

/**
 * Fix code fence language identifiers for Prism.js compatibility.
 */
function fixLanguageIds(content) {
  // objective-c -> objectivec
  content = content.replace(/^```objective-c$/gm, '```objectivec');
  // Normalize case
  content = content.replace(/^```JSON$/gm, '```json');
  return content;
}

/**
 * Remove blank lines inside HTML block-level elements (like <table>).
 * CommonMark terminates HTML blocks on blank lines, breaking rendering.
 */
function fixHtmlBlocks(content) {
  return content.replace(/<table[\s\S]*?<\/table>/g, (match) => {
    return match.replace(/^\s*$/gm, '').replace(/\n{2,}/g, '\n');
  });
}

/**
 * Generate slug from file path to match current MkDocs URLs.
 */
function generateSlug(filePath) {
  let slug = '/' + filePath.replace(/\.md$/, '');
  // index.md -> parent directory path
  if (slug.endsWith('/index')) {
    slug = slug.replace(/\/index$/, '');
  }
  if (slug === '') slug = '/';
  return slug;
}

// ===== File operations =====

function collectAllFiles(navItems, parentPath = '') {
  const files = [];
  for (const item of navItems) {
    if (item.path) {
      files.push(item.path);
    }
    if (item.children) {
      files.push(...collectAllFiles(item.children, parentPath));
    }
  }
  return files;
}

function collectAllFilePaths(navItems, result = new Map()) {
  let position = 0;
  for (const item of navItems) {
    if (item.path) {
      result.set(item.path, { label: item.label, position });
      position++;
    }
    if (item.children) {
      collectAllFilePaths(item.children, result);
      position++;
    }
  }
  return result;
}

function copyImageFiles(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyImageFiles(srcPath, destPath);
    } else if (!entry.name.endsWith('.md')) {
      // Copy all non-markdown files (images, icons, etc.)
      fs.cpSync(srcPath, destPath);
    }
  }
}

// ===== Main =====

function main() {
  console.log('Reading mkdocs.yml...');
  const mkdocsContent = fs.readFileSync(path.join(PROJECT_ROOT, 'mkdocs.yml'), 'utf8');
  const navItems = parseMkdocsYaml(mkdocsContent);

  console.log(`Found ${navItems.length} top-level nav items`);

  // Generate sidebars.ts
  console.log('Generating sidebars.ts...');
  const sidebarsContent = generateSidebarsTs(navItems);
  fs.writeFileSync(path.join(DOCUSAURUS_ROOT, 'sidebars.ts'), sidebarsContent);
  console.log('  -> sidebars.ts written');

  // Collect all file paths with metadata
  const fileMeta = collectAllFilePaths(navItems);
  const allFiles = collectAllFiles(navItems);

  console.log(`\nMigrating ${allFiles.length} markdown files...`);

  let tabFileCount = 0;
  let warningCount = 0;
  let tipCount = 0;
  let errors = [];

  for (const filePath of allFiles) {
    const srcPath = path.join(MKDOCS_DOCS, filePath);

    if (!fs.existsSync(srcPath)) {
      errors.push(`File not found: ${srcPath}`);
      continue;
    }

    let content = fs.readFileSync(srcPath, 'utf8');
    const meta = fileMeta.get(filePath) || { label: '', position: 0 };

    // 1. Extract title
    const { title, content: contentWithoutTitle } = extractTitle(content);
    content = contentWithoutTitle;

    // 2. Convert warning boxes
    const beforeWarning = (content.match(/<div class="warning-box/g) || []).length;
    content = convertWarningBoxes(content);
    warningCount += beforeWarning;

    // 3. Convert tip blocks
    const beforeTip = (content.match(/<div class="tip-block/g) || []).length;
    content = convertTipBlocks(content);
    tipCount += beforeTip;

    // 4. Convert tabs
    const { content: contentWithTabs, hasTabs } = convertTabs(content);
    content = contentWithTabs;
    if (hasTabs) tabFileCount++;

    // 5. Fix language identifiers
    content = fixLanguageIds(content);

    // 5b. Escape problematic HTML in prose for MDX files
    content = escapeMdxProseHtml(content);

    // 5c. Escape ${...} template expressions in MDX prose
    content = escapeMdxTemplateExpressions(content);

    // 5d. Fix blank lines inside HTML blocks (CommonMark compatibility)
    content = fixHtmlBlocks(content);

    // 6. Generate front matter
    const slug = generateSlug(filePath);
    const frontMatterTitle = (title || meta.label || '').replace(/"/g, '\\"');
    let frontMatter = `---\ntitle: "${frontMatterTitle}"\nsidebar_position: ${meta.position}\nslug: "${slug}"\n---\n\n`;

    // 7. Add Tabs import for .mdx files
    if (hasTabs) {
      frontMatter += `import Tabs from '@theme/Tabs';\nimport TabItem from '@theme/TabItem';\n\n`;
    }

    // 8. Determine output extension
    const ext = hasTabs ? '.mdx' : '.md';
    const outputPath = path.join(DOCUSAURUS_DOCS, filePath.replace(/\.md$/, ext));

    // 9. Write file
    const outputDir = path.dirname(outputPath);
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, frontMatter + content);

    const status = hasTabs ? '[MDX]' : '[MD] ';
    console.log(`  ${status} ${filePath}`);
  }

  // Copy image files from docs/ (excluding .md files)
  console.log('\nCopying image files...');
  copyImageFiles(MKDOCS_DOCS, DOCUSAURUS_DOCS);
  console.log('  -> Image files copied');

  // Summary
  console.log('\n===== Migration Summary =====');
  console.log(`Total files migrated: ${allFiles.length}`);
  console.log(`Files with tabs (.mdx): ${tabFileCount}`);
  console.log(`Warning boxes converted: ${warningCount}`);
  console.log(`Tip blocks converted: ${tipCount}`);

  if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`);
    errors.forEach(e => console.log(`  - ${e}`));
  }

  console.log('\nMigration complete!');
}

main();
