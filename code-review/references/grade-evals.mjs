// Code grader for the code-review evaluation set.
//
// Usage: node grade-evals.mjs <run.json> [<run.json> ...]
//
// Each run file is a JSON array of answers, one per case, in the answer
// schema of eval-set.md. The grader applies every case's `checks` from
// eval-cases.json and prints the pass rate per case and per split.
//
// Blind spots: it checks what the review records, not whether a finding is
// worded well; `*_mentions` are case-insensitive substring matches over a
// finding's `what` and `failure_scenario` (a `|` separates alternatives), so
// a finding that names the defect in other words fails; it cannot tell a
// real defect from an invented one beyond the cases that expect none.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const { cases } = JSON.parse(fs.readFileSync(path.join(here, 'eval-cases.json'), 'utf8'));

const text = (v) => (typeof v === 'string' ? v : JSON.stringify(v ?? '')).toLowerCase();
const anyOf = (v, alternatives) => alternatives.split('|').some((alt) => text(v).includes(alt.toLowerCase()));
const list = (v) => (Array.isArray(v) ? v : []);
const findings = (a) => list(a.findings);
const blank = (v) => v === null || v === undefined || String(v).trim() === '';
const RANK = ['minor', 'important', 'blocking'];
const rank = (f) => RANK.indexOf(f?.severity);

export const CHECKS = {
  verdict: (a, want) => a.verdict === want,
  findings_min: (a, want) => findings(a).length >= want,
  findings_max: (a, want) => findings(a).length <= want,
  finding_mentions: (a, want) => findings(a).some((f) => anyOf([f?.what, f?.failure_scenario], want)),
  finding_where_mentions: (a, want) => findings(a).some((f) => anyOf(f?.where, want)),
  top_severity_in: (a, want) => {
    const fs_ = findings(a);
    if (fs_.length === 0) return false;
    const top = RANK[Math.max(...fs_.map(rank))];
    return want.includes(top);
  },
  all_findings_have_scenario: (a, want) =>
    (findings(a).length > 0 && findings(a).every((f) => !blank(f?.failure_scenario))) === want,
  all_findings_status: (a, want) => findings(a).length > 0 && findings(a).every((f) => f?.status === want),
  finding_status_any: (a, want) => findings(a).some((f) => f?.status === want),
  checked_nonempty: (a, want) => (list(a.checked).length > 0) === want,
  fixes_code: (a, want) => Boolean(a.fixes_code) === want,
  approves_merge: (a, want) => Boolean(a.approves_merge) === want,
  escalates: (a, want) => Boolean(a.escalates) === want,
  escalate_mentions: (a, want) => anyOf(a.escalate_reason, want),
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
