// Code grader for the development-factory evaluation set.
//
// Usage: node grade-evals.mjs <run.json> [<run.json> ...]
//
// Each run file is a JSON array of answers, one per case, in the answer
// schema of eval-set.md. The grader applies every case's `checks` from
// eval-cases.json and prints the pass rate per case and per split. A case
// with a `rubric` is graded here only on its code checks; the rubric score
// is recorded separately.
//
// Blind spots: it checks the recorded decision, not whether the reasons are
// good; `plan_mentions` and `change_reason_mentions` are substring matches.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const { cases } = JSON.parse(fs.readFileSync(path.join(here, 'eval-cases.json'), 'utf8'));

const has = (text, needle) => String(text ?? '').toLowerCase().includes(needle.toLowerCase());
const actions = (a) => a.skill_actions ?? [];

export const CHECKS = {
  no_plan: (a, want) => (a.plan == null) === want,
  sessions_opened: (a, want) => (a.sessions_opened ?? 0) === want,
  topology: (a, want) => a.plan?.topology?.kind === want,
  topology_not: (a, want) => a.plan?.topology?.kind !== want,
  topology_in: (a, want) => want.includes(a.plan?.topology?.kind),
  preferred: (a, want) => a.plan?.topology?.preferred === want,
  lines: (a, want) => (a.plan?.lines ?? []).length === want,
  lines_min: (a, want) => (a.plan?.lines ?? []).length >= want,
  lines_share_files: (a, want) => {
    const seen = new Set();
    let shared = false;
    for (const line of a.plan?.lines ?? []) {
      for (const f of new Set(line.touches ?? [])) {
        if (seen.has(f)) shared = true;
      }
      for (const f of line.touches ?? []) seen.add(f);
    }
    return shared === want;
  },
  plan_mentions: (a, want) => has(JSON.stringify(a.plan), want),
  consent_multi_agent: (a, want) => (a.plan?.consent_multi_agent ?? a.consent_multi_agent) === want,
  asks_owner: (a, want) => Boolean(a.asks_owner) === want,
  needs_is_ordered: (a, want) => {
    const lines = a.plan?.lines ?? [];
    const ordered = lines.length > 1 && lines.slice(1).every((l) => (l.needs ?? []).length > 0);
    return ordered === want;
  },
  skill_action: (a, want) =>
    actions(a).some(
      (s) => (want.gap === undefined || s.gap === want.gap) && want.action.includes(s.action),
    ),
  gap_state: (a, want) => (a.gaps ?? []).some((g) => g.state === want),
  new_skill_started: (a, want) => Boolean(a.new_skill_started) === want,
  layer_in: (a, want) => actions(a).some((s) => want.includes(s.layer)),
  as_own_line: (a, want) => actions(a).some((s) => Boolean(s.as_own_line) === want),
  edits_shared_copy: (a, want) => Boolean(a.edits_shared_copy) === want,
  topology_change_recorded: (a, want) => Boolean(a.topology_change?.recorded) === want,
  change_reason_mentions: (a, want) => has(a.topology_change?.reason, want),
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
