import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Structural gate for the skill tree in this repository.
 *
 * The skills are meant to be read selectively: a reading map decides which
 * sections a task opens, `references/` holds material behind a condition, and
 * `metadata.depends-on` says which skills are read first. Each of those trades
 * reading budget for a failure that reading alone does not reveal, so this
 * gate checks them:
 *
 * 1. Every top-level directory that is not tooling is a skill with a
 *    `SKILL.md` whose frontmatter `name` equals the directory and which has a
 *    `description` and a `metadata.tree-code` of the form U<n>, E<n>, D<n> or
 *    P<n>, unique across the tree.
 * 2. Every `depends-on` names an existing skill, and dependencies form no
 *    cycle.
 * 3. Every `## ` section of a SKILL.md is named in its `How to read this skill`
 *    map. The check is a substring match: it proves the map mentions the
 *    section, not that the condition it states is a good one.
 * 4. Every relative Markdown link inside a skill resolves to a file in the
 *    tree, and every `references/` file is linked from its own skill.
 * 5. Skills in layers U and E contain none of the forbidden domain words
 *    below. A `references/` file that opens with `<!-- domain-example -->` is
 *    exempt. The list is deliberately narrow: bare English nouns that are
 *    also everyday words ("scale", "item") are not on it, so a domain leak
 *    phrased with them passes. Review still owns universality.
 * 6. `.claude-plugin/plugin.json` lists exactly the skill directories, so a
 *    new skill cannot be missing from the installed plugin.
 *
 * It cannot tell whether a rule is right, whether two skills contradict each
 * other, or whether a dependency is necessary.
 */

const NOT_SKILLS = new Set([
  '.git',
  '.github',
  '.claude-plugin',
  '.claude',
  'scripts',
  'node_modules',
]);
const READING_MAP_HEADING = 'How to read this skill';
const DOMAIN_EXAMPLE_MARKER = '<!-- domain-example -->';
const TREE_CODE = /^[UEDP]\d+$/;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;
const MARKDOWN_LINK = /\[[^\]]*\]\(([^)\s]+)\)/g;
const FENCE = /^(```|~~~)[\s\S]*?^\1/gm;

export const FORBIDDEN_LATIN = [
  'questionnaire',
  'psychometric',
  'psychometrics',
  'respondent',
  'respondents',
  'school',
  'schools',
  'teacher',
  'teachers',
  'pupil',
  'pupils',
  'likert',
  'burnout',
  'wellbeing',
  'well-being',
  'shalomut',
];
export const FORBIDDEN_CYRILLIC_STEMS = [
  'шкал',
  'опросник',
  'анкет',
  'респондент',
  'школ',
  'учител',
  'психометр',
];

export function stripFences(source) {
  return source.replace(FENCE, '');
}

export function parseFrontmatter(source) {
  const block = source.match(FRONTMATTER)?.[1];
  if (block === undefined) return null;
  const result = { metadata: {} };
  let inMetadata = false;
  for (const line of block.split(/\r?\n/)) {
    if (/^\S/.test(line)) {
      inMetadata = false;
      const match = line.match(/^([\w-]+):\s*(.*)$/);
      if (!match) continue;
      if (match[1] === 'metadata' && match[2] === '') {
        inMetadata = true;
      } else {
        result[match[1]] = match[2].trim();
      }
    } else if (inMetadata) {
      const match = line.match(/^\s+([\w-]+):\s*(.*)$/);
      if (match) result.metadata[match[1]] = match[2].trim();
    }
  }
  return result;
}

export function readDependencies(frontmatter) {
  const raw = frontmatter?.metadata?.['depends-on'];
  if (!raw) return [];
  return raw
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
}

export function findUnmappedSections(source) {
  const body = stripFences(source);
  const sections = [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
  if (!sections.includes(READING_MAP_HEADING)) {
    return sections.length === 0 ? [] : [`has no \`${READING_MAP_HEADING}\` section`];
  }
  const start = body.indexOf(`## ${READING_MAP_HEADING}`);
  const rest = body.slice(start + READING_MAP_HEADING.length + 3);
  const end = rest.indexOf('\n## ');
  // Wrapped prose splits a section name across lines; compare on single spaces.
  const map = (end === -1 ? rest : rest.slice(0, end)).replace(/\s+/g, ' ');
  return sections
    .filter((section) => section !== READING_MAP_HEADING)
    .filter((section) => !map.includes(section))
    .map((section) => `section \`${section}\` is not named in the reading map`);
}

export function findRelativeLinks(source) {
  const links = [];
  for (const match of stripFences(source).matchAll(MARKDOWN_LINK)) {
    const target = match[1].split('#')[0];
    if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('/')) continue;
    links.push(target);
  }
  return links;
}

export function findForbiddenWords(source) {
  const lower = source.toLowerCase();
  const found = new Set();
  for (const word of FORBIDDEN_LATIN) {
    const pattern = new RegExp(`(^|[^a-z])${word.replace('-', '\\-')}([^a-z]|$)`);
    if (pattern.test(lower)) found.add(word);
  }
  for (const stem of FORBIDDEN_CYRILLIC_STEMS) {
    if (lower.includes(stem)) found.add(stem);
  }
  return [...found];
}

export function findCycle(graph) {
  const state = new Map();
  const stack = [];
  const visit = (node) => {
    if (state.get(node) === 'done') return null;
    if (state.get(node) === 'active') return [...stack.slice(stack.indexOf(node)), node];
    state.set(node, 'active');
    stack.push(node);
    for (const next of graph.get(node) ?? []) {
      if (!graph.has(next)) continue;
      const cycle = visit(next);
      if (cycle) return cycle;
    }
    stack.pop();
    state.set(node, 'done');
    return null;
  };
  for (const node of graph.keys()) {
    const cycle = visit(node);
    if (cycle) return cycle;
  }
  return null;
}

/**
 * @param {string[]} skillDirs top-level skill directory names
 * @param {Record<string, string>} files repository-relative path -> contents,
 *   for every file under the skill directories
 * @param {string[] | null} pluginSkills the `skills` array of plugin.json
 */
export function checkTree(skillDirs, files, pluginSkills) {
  const errors = [];
  const graph = new Map();
  const codes = new Map();

  for (const dir of skillDirs) {
    const skillFile = `${dir}/SKILL.md`;
    const source = files[skillFile];
    if (source === undefined) {
      errors.push(`${dir}/: no SKILL.md. Every top-level directory that is not tooling is a skill.`);
      continue;
    }

    const fm = parseFrontmatter(source);
    if (!fm) {
      errors.push(`${skillFile}: no frontmatter.`);
      continue;
    }
    if (fm.name !== dir) {
      errors.push(`${skillFile}: frontmatter name \`${fm.name ?? ''}\` does not match directory \`${dir}\`.`);
    }
    if (!fm.description) {
      errors.push(`${skillFile}: no \`description\`; it is what a client matches a task against.`);
    }

    const code = fm.metadata['tree-code'];
    if (!code || !TREE_CODE.test(code)) {
      errors.push(`${skillFile}: \`metadata.tree-code\` is missing or not U<n>/E<n>/D<n>/P<n>.`);
    } else if (codes.has(code)) {
      errors.push(`${skillFile}: tree-code ${code} is already used by \`${codes.get(code)}\`.`);
    } else {
      codes.set(code, dir);
    }

    graph.set(dir, readDependencies(fm));

    for (const problem of findUnmappedSections(source)) {
      errors.push(`${skillFile}: ${problem}; an unclassified section has no condition that opens it.`);
    }

    const universal = code && /^[UE]/.test(code);
    const linked = new Set();
    for (const [file, contents] of Object.entries(files)) {
      if (!file.startsWith(`${dir}/`)) continue;
      for (const target of findRelativeLinks(contents)) {
        const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file), target));
        if (files[resolved] === undefined) {
          errors.push(`${file}: link \`${target}\` resolves to nothing.`);
        } else {
          linked.add(resolved);
        }
      }
      if (universal && !contents.trimStart().startsWith(DOMAIN_EXAMPLE_MARKER)) {
        const words = findForbiddenWords(contents);
        if (words.length > 0) {
          errors.push(
            `${file}: domain vocabulary in a ${code[0]} skill: ${words.join(', ')}. ` +
              `Move it to the domain pack, or to a references/ file marked ${DOMAIN_EXAMPLE_MARKER}.`,
          );
        }
      }
    }
    for (const file of Object.keys(files)) {
      if (file.startsWith(`${dir}/references/`) && !linked.has(file)) {
        errors.push(`${file}: nothing in \`${dir}\` links to it; an unreachable reference is a rule with no route.`);
      }
    }
  }

  for (const [dir, deps] of graph) {
    for (const dep of deps) {
      if (!graph.has(dep)) errors.push(`${dir}/SKILL.md: depends on \`${dep}\`, which is not a skill here.`);
    }
  }
  const cycle = findCycle(graph);
  if (cycle) errors.push(`dependency cycle: ${cycle.join(' -> ')}.`);

  if (pluginSkills) {
    const listed = new Set(pluginSkills.map((entry) => entry.replace(/^\.\//, '').replace(/\/$/, '')));
    for (const dir of skillDirs) {
      if (!listed.has(dir)) errors.push(`.claude-plugin/plugin.json: skill \`${dir}\` is not listed in \`skills\`.`);
    }
    for (const entry of listed) {
      if (!skillDirs.includes(entry)) errors.push(`.claude-plugin/plugin.json: lists \`${entry}\`, which is not a skill directory.`);
    }
  }

  return { errors, skills: graph.size };
}

function readTree(dir, files) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.posix.join(dir, entry.name);
    if (entry.isDirectory()) readTree(full, files);
    else if (entry.isFile()) files[full] = fs.readFileSync(full, 'utf8');
  }
  return files;
}

function main() {
  const skillDirs = fs
    .readdirSync('.', { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !NOT_SKILLS.has(entry.name))
    .map((entry) => entry.name)
    .sort();
  const files = {};
  for (const dir of skillDirs) readTree(dir, files);

  let pluginSkills = null;
  const manifest = '.claude-plugin/plugin.json';
  if (fs.existsSync(manifest)) pluginSkills = JSON.parse(fs.readFileSync(manifest, 'utf8')).skills ?? [];

  const { errors, skills } = checkTree(skillDirs, files, pluginSkills);
  if (errors.length > 0) {
    console.error('Skill tree check failed:');
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`Skill tree check passed: ${skills} skills, ${Object.keys(files).length} files.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
