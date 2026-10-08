import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSkill, transformSkill, yamlScalar } from './mirror-skills.mjs';

const cfg = {
  source: { blobBase: 'https://github.com/bugsee/bugsee-for-ai/blob/main', docsBase: 'https://docs.bugsee.com' },
};
const entry = { plugin: 'bugsee-flutter-sdk', dest: 'sdk/flutter', title: 'Bugsee Flutter SDK', label: 'Flutter', position: 3 };
const mirrored = new Map([
  ['bugsee-flutter-sdk', 'sdk/flutter'],
  ['bugsee-android-sdk', 'sdk/android/v7'],
]);

const source = (body, extraFm = '') => `---
name: bugsee-flutter-sdk
description: Full Bugsee SDK setup for Flutter. Use when asked to add Bugsee.
license: MIT
category: sdk-setup
parent: bugsee-sdk-setup
disable-model-invocation: true
allowed-tools: Bash, Read
${extraFm}---

${body}`;

test('keeps spec fields, adds docusaurus fields, drops plugin-only keys', () => {
  const out = transformSkill(source('# Flutter\n'), entry, mirrored, cfg);
  const { fm } = parseSkill(out);
  assert.equal(fm.name, 'bugsee-flutter-sdk');
  assert.equal(fm.title, 'Bugsee Flutter SDK');
  assert.equal(fm.sidebar_position, '3');
  assert.equal(fm.slug, '"/ai/agent-skills/sdk/flutter/SKILL"');
  assert.equal(fm.license, 'MIT');
  assert.equal(fm.generated_from, 'bugsee-for-ai/skills/bugsee-flutter-sdk/SKILL.md');
  for (const dropped of ['parent', 'disable-model-invocation', 'allowed-tools']) assert.ok(!(dropped in fm), dropped);
});

test('strips the plugin breadcrumb', () => {
  const out = transformSkill(source('> [All Skills](../../SKILL_TREE.md) > [SDK Setup](../bugsee-sdk-setup/SKILL.md) > Flutter SDK\n\n# Flutter\n'), entry, mirrored, cfg);
  assert.ok(!out.includes('All Skills'));
  assert.match(out, /---\n\n# Flutter\n$/);
});

test('links between mirrored skills stay on docs.bugsee.com; others go to GitHub', () => {
  const out = transformSkill(
    source('See [Android](../bugsee-android-sdk/SKILL.md#phase-2), [CLI](../bugsee-cli/SKILL.md) and [tree](../../SKILL_TREE.md).\n'),
    entry, mirrored, cfg);
  assert.match(out, /\]\(https:\/\/docs\.bugsee\.com\/ai\/agent-skills\/sdk\/android\/v7\/SKILL\.md#phase-2\)/);
  assert.match(out, /\]\(https:\/\/github\.com\/bugsee\/bugsee-for-ai\/blob\/main\/skills\/bugsee-cli\/SKILL\.md\)/);
  assert.match(out, /\]\(https:\/\/github\.com\/bugsee\/bugsee-for-ai\/blob\/main\/SKILL_TREE\.md\)/);
});

test('an unhandled relative link fails loudly instead of shipping a dead link', () => {
  assert.throws(() => transformSkill(source('[x](./references/foo.md)\n'), entry, mirrored, cfg), /unhandled relative link/);
});

test('a skill whose frontmatter name does not match the map is rejected', () => {
  assert.throws(() => transformSkill(source('x\n'), { ...entry, plugin: 'bugsee-other-sdk' }, mirrored, cfg), /frontmatter name/);
});

test('multi-line frontmatter values are rejected rather than mangled', () => {
  assert.throws(() => parseSkill('---\nname: a\ndescription: >\n  folded\n---\nbody'), /multi-line/);
});

test('yamlScalar quotes only when YAML would misread the value', () => {
  assert.equal(yamlScalar('Plain text, with comma.'), 'Plain text, with comma.');
  assert.equal(yamlScalar('has: colon'), '"has: colon"');
  assert.equal(yamlScalar('# starts with hash'), '"# starts with hash"');
  assert.equal(yamlScalar('"already quoted"'), 'already quoted');
});

test('output is deterministic', () => {
  const a = transformSkill(source('# Flutter\n'), entry, mirrored, cfg);
  const b = transformSkill(source('# Flutter\n'), entry, mirrored, cfg);
  assert.equal(a, b);
});
