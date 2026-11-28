// Code grader for the qa-testing evaluation set.
//
// Usage: node grade-evals.mjs <run.json> [<run.json> ...]
//
// Each run file is a JSON array of answers, one per case, in the answer
// schema of eval-set.md. The grader applies every case's `checks` from
// eval-cases.json and prints the pass rate per case and per split.
//
// Blind spots: it checks what the answer records about its tests, not tests
// that run; `*_mention*` are case-insensitive substring matches (a `|`
// separates alternatives) over a test's name, rule, setup, action and
// expected result, so a test that names its subject in other words fails;
// whether a test would fail when its rule is broken is judged only by the
// `tests-from-spec` rubric on qa-001.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const { cases } = JSON.parse(fs.readFileSync(path.join(here, 'eval-cases.json'), 'utf8'));

const text = (v) => (typeof v === 'string' ? v : JSON.stringify(v ?? '')).toLowerCase();
const anyOf = (v, alternatives) => alternatives.split('|').some((alt) => text(v).includes(alt.toLowerCase()));
const list = (v) => (Array.isArray(v) ? v : []);
const tests = (a) => list(a.tests);
const testText = (t) => [t?.name, t?.rule, t?.setup, t?.action, t?.expected];
const blank = (v) => v === null || v === undefined || String(v).trim() === '';
const flag = (field) => (a, want) => Boolean(a[field]) === want;

export const CHECKS = {
  tests_min: (a, want) => tests(a).length >= want,
  // A refusal under `Pipeline properties` is often labelled a property test.
  negative_min: (a, want) => tests(a).filter((t) => ['negative', 'property'].includes(t?.kind)).length >= want,
  tests_mention: (a, want) => tests(a).some((t) => anyOf(testText(t), want)),
  tests_mention_all: (a, want) => want.every((alt) => tests(a).some((t) => anyOf(testText(t), alt))),
  tests_expected_exclude: (a, want) => !tests(a).some((t) => anyOf(t?.expected, want)),
  all_tests_have_expected: (a, want) => (tests(a).length > 0 && tests(a).every((t) => !blank(t?.expected))) === want,
  spec_findings_min: (a, want) => list(a.spec_findings).length >= want,
  spec_findings_mention: (a, want) => list(a.spec_findings).some((f) => anyOf(f, want)),
  defects_mention: (a, want) => list(a.defects).some((d) => anyOf(d, want)),
  not_covered_mention: (a, want) => list(a.not_covered).some((n) => anyOf(n, want)),
  escalates: flag('escalates'),
  escalate_mentions: (a, want) => anyOf(a.escalate_reason, want),
  changes_product_code: flag('changes_product_code'),
  relaxes_test: flag('relaxes_test'),
  retries_flaky: flag('retries_flaky'),
  uses_network_or_live_model: flag('uses_network_or_live_model'),
  writes_to_deployed: flag('writes_to_deployed'),
  asks_authorization: flag('asks_authorization'),
  other_skill_in: (a, want) => want.includes(a.other_skill),
};

export function gradeCase(spec, answer) {
  const failed = [];
  if (!answer) return { pass: false, failed: ['no answer'] };
  for (const check of spec.checks) {
    const [name, want] = Object.entries(check)[0];
    const fn = CHECKS[name];
    if (!fn) throw new Error(`unknown check ${name} in ${spec.id}`);
    if (!fn(answer, want)) failed.push(`${name}=${JSON.stringify(want)}`);
  }
  return { pass: failed.length === 0, failed };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const runs = process.argv.slice(2).map((f) => JSON.parse(fs.readFileSync(f, 'utf8')));
  if (runs.length === 0) {
    console.error('usage: node grade-evals.mjs <run.json> [...]');
    process.exit(2);
  }
  const perCase = {};
  const splitTotals = {};
  for (const spec of cases) {
    let passes = 0;
    const failures = [];
    runs.forEach((run, i) => {
      const result = gradeCase(spec, run.find((a) => a.id === spec.id));
      if (result.pass) passes += 1;
      else failures.push(`run ${i + 1}: ${result.failed.join(', ')}`);
    });
    const rate = passes / runs.length;
    perCase[spec.id] = rate;
    (splitTotals[spec.split] ??= []).push(rate);
    console.log(`${spec.id} ${spec.split.padEnd(7)} ${rate.toFixed(2)}${failures.length ? '  ' + failures.join('; ') : ''}`);
  }
  const mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;
  for (const [split, rates] of Object.entries(splitTotals)) {
    console.log(`pass_rate ${split}: ${mean(rates).toFixed(2)}`);
  }
  console.log(JSON.stringify({ runs: runs.length, per_case: perCase }));
}
