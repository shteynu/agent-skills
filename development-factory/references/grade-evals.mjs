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
// good; `plan_mentions` and `change_reason_mentions` are substring matches;
// the model and effort checks read what the answer records, not what a
// client would actually run.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const { cases } = JSON.parse(fs.readFileSync(path.join(here, 'eval-cases.json'), 'utf8'));

const has = (text, needle) => String(text ?? '').toLowerCase().includes(needle.toLowerCase());
const actions = (a) => a.skill_actions ?? [];
const planRoles = (a) => (a.plan?.lines ?? []).flatMap((l) => l.roles ?? []);
const allRoles = (a) => [...planRoles(a), ...(a.role_starts ?? [])];
const roleNames = (a) => new Set(allRoles(a).map((r) => r.role));
const SEPARATE = ['subagent', 'own-session'];
const norm = (v) => String(v ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
// Effort levels as the cases name them; a case for another client names its own.
const EFFORT = ['low', 'medium', 'high', 'xhigh', 'max'];
const rolesNamed = (a, name) => allRoles(a).filter((r) => r.role === name);

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
  roles_first: (a, want) => (a.plan?.lines ?? []).some((l) => l.roles?.[0]?.role === want),
  roles_include: (a, want) => want.every((r) => roleNames(a).has(r)),
  roles_exclude: (a, want) => want.every((r) => !roleNames(a).has(r)),
  roles_order: (a, want) =>
    (a.plan?.lines ?? []).some((l) => {
      const order = (l.roles ?? []).map((r) => r.role);
      const idx = want.map((r) => order.indexOf(r));
      return idx.every((i) => i >= 0) && idx.every((i, k) => k === 0 || i > idx[k - 1]);
    }),
  role_fresh: (a, want) =>
    want.every((name) => {
      const found = allRoles(a).filter((r) => r.role === name);
      return found.length > 0 && found.every((r) => r.context === 'fresh' && SEPARATE.includes(r.runs_in));
    }),
  role_runs_in: (a, want) => {
    const found = allRoles(a).filter((r) => r.role === want.role);
    return found.length > 0 && found.every((r) => want.in.includes(r.runs_in));
  },
  skipped_has: (a, want) => (a.plan?.lines ?? []).some((l) => l.skipped_roles && want in l.skipped_roles),
  returns_to: (a, want) => a.returns_to === want,
  // Model and effort: names are compared without case, spaces or punctuation.
  role_model: (a, want) => {
    const found = rolesNamed(a, want.role);
    return found.length > 0 && found.every((r) => want.in.map(norm).includes(norm(r.model)));
  },
  role_effort: (a, want) => {
    const found = rolesNamed(a, want.role);
    return found.length > 0 && found.every((r) => want.in.map(norm).includes(norm(r.effort)));
  },
  roles_differ_model: (a, want) => {
    const [x, y] = want.map((name) => rolesNamed(a, name).map((r) => norm(r.model)));
    const named = (ms) => ms.length > 0 && ms.every((m) => m && m !== 'inherited');
    return named(x) && named(y) && x.every((m) => !y.includes(m));
  },
  // Both `inherited` counts as equal; otherwise both must be named levels.
  role_effort_at_least: (a, want) => {
    const found = rolesNamed(a, want.role);
    const than = rolesNamed(a, want.than);
    if (found.length === 0 || than.length === 0) return false;
    const levels = [...found, ...than].map((r) => norm(r.effort));
    if (levels.every((e) => e === 'inherited')) return true;
    const rank = (r) => EFFORT.indexOf(norm(r.effort));
    const floor = Math.max(...than.map(rank));
    return floor >= 0 && found.every((r) => rank(r) >= floor);
  },
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
