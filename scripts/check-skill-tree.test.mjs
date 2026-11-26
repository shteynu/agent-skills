import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  checkTree,
  findCycle,
  findForbiddenWords,
  findRelativeLinks,
  findUnmappedSections,
  parseFrontmatter,
  readDependencies,
} from './check-skill-tree.mjs';

function skill({ name, code, deps, sections = ['Rules'], map, extra = '' }) {
  const meta = [`  tree-code: ${code}`, deps ? `  depends-on: ${deps}` : null].filter(Boolean).join('\n');
  const readingMap = map ?? `Always in force: ${sections.map((s) => `\`${s}\``).join(', ')}.`;
  return [
    '---',
    `name: ${name}`,
    `description: Test skill ${name}.`,
    'metadata:',
    meta,
    '---',
    '',
    `# ${name}`,
    '',
    '## How to read this skill',
    '',
    readingMap,
    '',
    ...sections.flatMap((s) => [`## ${s}`, '', 'Body.', '']),
    extra,
  ].join('\n');
}

function tree(skills, extraFiles = {}) {
  const files = { ...extraFiles };
  for (const s of skills) files[`${s.name}/SKILL.md`] = skill(s);
  return files;
}

const A = { name: 'alpha', code: 'U1' };
const B = { name: 'beta', code: 'U2', deps: 'alpha' };

test('parses frontmatter with nested metadata', () => {
  const fm = parseFrontmatter(skill({ name: 'x', code: 'E3', deps: 'a, b' }));
  assert.equal(fm.name, 'x');
  assert.equal(fm.metadata['tree-code'], 'E3');
  assert.deepEqual(readDependencies(fm), ['a', 'b']);
  assert.equal(parseFrontmatter('no frontmatter'), null);
});

test('a well-formed tree passes', () => {
  const { errors, skills } = checkTree(['alpha', 'beta'], tree([A, B]), ['./alpha', './beta']);
  assert.deepEqual(errors, []);
  assert.equal(skills, 2);
});

test('name must match directory and tree-code must be valid and unique', () => {
  const files = tree([A, { name: 'beta', code: 'U1' }]);
  files['gamma/SKILL.md'] = skill({ name: 'other', code: 'X9' });
  const { errors } = checkTree(['alpha', 'beta', 'gamma'], files, null);
  assert.ok(errors.some((e) => e.includes('tree-code U1 is already used')));
  assert.ok(errors.some((e) => e.includes('does not match directory `gamma`')));
  assert.ok(errors.some((e) => e.includes('gamma/SKILL.md: `metadata.tree-code`')));
});

test('a directory without SKILL.md is refused', () => {
  const { errors } = checkTree(['alpha', 'empty'], tree([A]), null);
  assert.ok(errors.some((e) => e.startsWith('empty/: no SKILL.md')));
});

test('missing dependency and cycles are caught', () => {
  const missing = checkTree(['beta'], tree([B]), null);
  assert.ok(missing.errors.some((e) => e.includes('depends on `alpha`')));

  const cyclic = tree([
    { name: 'alpha', code: 'U1', deps: 'beta' },
    { name: 'beta', code: 'U2', deps: 'alpha' },
  ]);
  const { errors } = checkTree(['alpha', 'beta'], cyclic, null);
  assert.ok(errors.some((e) => e.startsWith('dependency cycle')));
  assert.equal(findCycle(new Map([['a', ['b']], ['b', []]])), null);
});

test('every section must be named in the reading map', () => {
  const source = skill({ name: 'x', code: 'U1', sections: ['Rules', 'Hidden'], map: 'Always in force: `Rules`.' });
  assert.deepEqual(findUnmappedSections(source), ['section `Hidden` is not named in the reading map']);
  assert.deepEqual(findUnmappedSections('## Lonely\n'), ['has no `How to read this skill` section']);
});

test('a section name wrapped across lines of the map still counts', () => {
  const source = skill({
    name: 'x',
    code: 'U1',
    sections: ['Evidence before claims'],
    map: 'Always in force: `Evidence before\nclaims` — why.',
  });
  assert.deepEqual(findUnmappedSections(source), []);
});

test('headings inside code fences are not sections', () => {
  const source = skill({ name: 'x', code: 'U1', extra: '```markdown\n## Not a section\n```\n' });
  assert.deepEqual(findUnmappedSections(source), []);
});

test('broken links and orphaned references are caught; linked references pass', () => {
  const linked = skill({ ...A, extra: 'See [ref](references/ok.md) and [gone](references/gone.md).' });
  const files = {
    'alpha/SKILL.md': linked,
    'alpha/references/ok.md': 'ok',
    'alpha/references/orphan.md': 'nobody links here',
  };
  const { errors } = checkTree(['alpha'], files, null);
  assert.ok(errors.some((e) => e.includes('`references/gone.md` resolves to nothing')));
  assert.ok(errors.some((e) => e.startsWith('alpha/references/orphan.md: nothing')));
  assert.ok(!errors.some((e) => e.includes('ok.md')));
});

test('links: external and in-code links are ignored, cross-skill links resolve', () => {
  assert.deepEqual(findRelativeLinks('[a](https://x.y) [b](../beta/SKILL.md#part) `[c](d)`\n```\n[e](f)\n```'), [
    '../beta/SKILL.md',
    'd',
  ]);
  const files = tree([{ ...A, extra: 'Read [beta](../beta/SKILL.md).' }, B]);
  assert.deepEqual(checkTree(['alpha', 'beta'], files, null).errors, []);
});

test('domain words are refused in U and E skills, allowed in D and in marked examples', () => {
  assert.deepEqual(findForbiddenWords('A Questionnaire for every school.'), ['questionnaire', 'school']);
  assert.deepEqual(findForbiddenWords('scholarly preschooler'), []);
  assert.deepEqual(findForbiddenWords('Пункты шкалы'), ['шкал']);

  const leak = tree([{ ...A, extra: 'Each teacher fills it in.' }]);
  assert.ok(checkTree(['alpha'], leak, null).errors.some((e) => e.includes('domain vocabulary in a U skill: teacher')));

  const domain = tree([{ name: 'delta', code: 'D1', extra: 'Each teacher fills it in.' }]);
  assert.deepEqual(checkTree(['delta'], domain, null).errors, []);

  const example = {
    ...tree([{ ...A, extra: 'See [example](references/example.md).' }]),
    'alpha/references/example.md': '<!-- domain-example -->\nA school survey.',
  };
  assert.deepEqual(checkTree(['alpha'], example, null).errors, []);
});

test('the plugin manifest must list exactly the skill directories', () => {
  const { errors } = checkTree(['alpha', 'beta'], tree([A, B]), ['./alpha', './ghost']);
  assert.ok(errors.some((e) => e.includes('skill `beta` is not listed')));
  assert.ok(errors.some((e) => e.includes('lists `ghost`')));
});
