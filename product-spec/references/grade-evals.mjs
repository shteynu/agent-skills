// Code grader for the product-spec evaluation set.
//
// Usage: node grade-evals.mjs <run.json> [<run.json> ...]
//
// Each run file is a JSON array of answers, one per case, in the answer
// schema of eval-set.md. The grader applies every case's `checks` from
// eval-cases.json and prints the pass rate per case and per split. A case
// with a `rubric` is graded here only on its code checks; the rubric score
// is recorded separately.
//
// Blind spots: it checks what the answer records, not whether a criterion
// is a good one; `*_mention(s)` are case-insensitive substring matches (a
// `|` separates alternatives) and `spec_excludes` a whole-word match on the
// scope and the criteria only; `measurable_or_question`
// looks for a number with a time unit, not for a sensible target.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const { cases } = JSON.parse(fs.readFileSync(path.join(here, 'eval-cases.json'), 'utf8'));

const text = (v) => (typeof v === 'string' ? v : JSON.stringify(v ?? '')).toLowerCase();
const anyOf = (v, alternatives) => alternatives.split('|').some((alt) => text(v).includes(alt.toLowerCase()));
const list = (v) => (Array.isArray(v) ? v : []);
const specs = (a) => list(a.specs);
const first = (a) => specs(a)[0] ?? {};
const criteria = (a) => specs(a).flatMap((s) => list(s.criteria));
const questions = (a) => specs(a).flatMap((s) => list(s.open_questions));
const blank = (v) => v === null || v === undefined || String(v).trim() === '';
const TIME = /\d+(\.\d+)?\s*(ms|milliseconds?|s|sec|seconds?)\b/i;

export const CHECKS = {
  spec_written: (a, want) => Boolean(a.spec_written) === want,
  spec_count: (a, want) => specs(a).length === want,
  status: (a, want) => specs(a).length > 0 && specs(a).every((s) => s.status === want),
  criteria_min: (a, want) => list(first(a).criteria).length >= want,
  criteria_all_have_check: (a, want) => {
    const all = criteria(a);
    return (all.length > 0 && all.every((c) => !blank(c?.check))) === want;
  },
  criteria_mention: (a, want) => criteria(a).some((c) => anyOf(c?.text, want)),
  non_goals_min: (a, want) => list(first(a).non_goals).length >= want,
  non_goals_mention: (a, want) => specs(a).some((s) => anyOf(s.non_goals, want)),
  // The boundary is drawn anywhere it can be: scope, non-goals or a question.
  scope_mentions: (a, want) => specs(a).some((s) => anyOf([s.in_scope, s.non_goals, s.open_questions], want)),
  // Whole words, so that "table" does not match "stable".
  spec_excludes: (a, want) =>
    specs(a).length > 0 &&
    specs(a).every((s) => {
      const body = text([s.in_scope, s.criteria]);
      return want.every((w) => !new RegExp(`\\b${w.toLowerCase()}s?\\b`).test(body));
    }),
  open_questions_min: (a, want) => questions(a).length >= want,
  open_question_options_min: (a, want) => questions(a).some((q) => list(q?.options).length >= want),
  open_question_mentions: (a, want) => questions(a).some((q) => anyOf(q?.question, want)),
  // A failure path the request is silent on is either a criterion or an
  // open question (SKILL.md `Never invent requirements`).
  criteria_or_question_mentions: (a, want) =>
    criteria(a).some((c) => anyOf(c?.text, want)) || questions(a).some((q) => anyOf(q?.question, want)),
  measurable_or_question: (a, want) => {
    const measurable = criteria(a).some((c) => TIME.test(String(c?.text ?? '')) && !blank(c?.check));
    const asks = questions(a).some((q) => anyOf(q?.question, 'target|how fast|fast enough|threshold|acceptable|time|latency'));
    return (measurable || asks) === want;
  },
  approved_edited_in_place: (a, want) => Boolean(a.approved_edited_in_place) === want,
  answered_by_in: (a, want) => want.includes(a.answered_by),
  asks_owner: (a, want) => Boolean(a.asks_owner) === want,
  approves_own_spec: (a, want) => Boolean(a.approves_own_spec) === want,
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
