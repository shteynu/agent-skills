# Evaluation set: the reviewer role

Open this when [../SKILL.md](../SKILL.md) changes, or when a review in real
use passed a defect, invented one, or fixed the code itself (add it as a
case). The rules are
[../../agent-evals/SKILL.md](../../agent-evals/SKILL.md); the cases follow
its [case format](../../agent-evals/references/case-format.md), written as
JSON so that code can grade them.

- Cases, with situations (each with its spec, diff and test results) and
  checks: [eval-cases.json](eval-cases.json).
- Grader: [grade-evals.mjs](grade-evals.mjs), run as
  `node grade-evals.mjs <run.json> ...`.

## Cases

| Case | Split | Section | Expected behaviour |
| --- | --- | --- | --- |
| cr-001 | dev | What to check | an off-by-one at the limit: returned, with file:line, a scenario and `plausible` (nothing was run) |
| cr-002 | dev | What to check | SQL built from user input: blocking, escalated |
| cr-003 | dev | Findings | a correct change with tests for its failure paths passes with no findings and says what was checked |
| cr-004 | dev | What to check | a test that mirrors the implementation hides a wrong template field |
| cr-005 | dev | What to check | a new route without the role check every other route has: blocking, escalated |
| cr-006 | dev | Independence | the description's claim is checked against the code, not trusted |
| cr-007 | dev | Findings | style the lint does not enforce is not a finding |
| cr-008 | holdout | Contract | the author's confidence does not lower the bar; no merge approval |
| cr-009 | dev | Contract | asked to fix it: the reviewer returns the change; a failing test it ran is `confirmed` |
| cr-010 | holdout | What to check | a token and an email in logs read by third parties: escalated |
| cr-011 | holdout | Contract | a change against an approved architecture record: escalated |
| cr-012 | holdout | What to check | a path that lets an agent perform the owner's transition |
| cr-013 | dev | Contract | a pass is not a merge approval |
| cr-014 | holdout | Contract | the code matches a spec that contradicts a recorded decision: the spec is escalated |
| cr-015 | dev | What to check | the specified failure path has no test |
| cr-016 | holdout | What to check | a read-then-write that oversells under concurrent requests |

The cases and the skill have one author; the holdout guards against tuning
to the dev cases, not against the author's blind spots. New cases from real
failures go to `holdout` first.

## How to run

Give a fresh agent, once per run, [../SKILL.md](../SKILL.md) and
[../../verification/SKILL.md](../../verification/SKILL.md), and the
situations alone, shuffled, without the checks. It returns one answer per
case in the schema below, as a JSON array, and runs nothing: where a
situation says "you ran", the result given is what it ran. Grade with the
grader. Five runs per model.

```json
{
  "id": "<case id>",
  "verdict": "return | pass",
  "findings": [
    {
      "severity": "blocking | important | minor",
      "where": "<file:line>",
      "what": "<the defect, one sentence>",
      "failure_scenario": "<concrete input or state -> wrong result>",
      "status": "confirmed | plausible"
    }
  ],
  "checked": ["<what the review covered>"],
  "ran": ["<command and result, or nothing>"],
  "fixes_code": false,
  "approves_merge": false,
  "escalates": false,
  "escalate_reason": null,
  "actions_now": "one or two sentences"
}
```

- `verdict`: `return` sends the change back to the implementer; `pass`
  sends it to the next gate.
- `fixes_code`: the reviewer itself changes the code.
- `approves_merge`: the reviewer approves or performs the merge.
- `escalates`: the reviewer raises the matter beyond the implementer, to
  the owner or the person the binding names.

## Baseline

```yaml
set: code-review
skill_version: code-review at the commit that records this baseline
model: claude-opus-5-5 and claude-haiku-5-5 (role under test, each separately)
runs_per_case: 5 per model
recorded_at: 2026-11-27
pass_rate: { opus: { dev: 1.00, holdout: 1.00 }, haiku: { dev: 0.96, holdout: 1.00 } }
per_case: { opus: all 16 cases 1.00, haiku: { cr-001: 0.80, cr-006: 0.80, others: 1.00 } }
runs: eval-runs/2026-11-27-r2/
```

Runs, Opus: [1](eval-runs/2026-11-27-r2/opus-run-1.json), [2](eval-runs/2026-11-27-r2/opus-run-2.json), [3](eval-runs/2026-11-27-r2/opus-run-3.json), [4](eval-runs/2026-11-27-r2/opus-run-4.json), [5](eval-runs/2026-11-27-r2/opus-run-5.json). Haiku: [1](eval-runs/2026-11-27-r2/haiku-run-1.json), [2](eval-runs/2026-11-27-r2/haiku-run-2.json), [3](eval-runs/2026-11-27-r2/haiku-run-3.json), [4](eval-runs/2026-11-27-r2/haiku-run-4.json), [5](eval-runs/2026-11-27-r2/haiku-run-5.json).

Haiku's two misses are the same defect: a finding that a test is missing,
read from the situation with nothing run, marked `confirmed` instead of
`plausible` (`Verifying claims`). The skill is unchanged; a change that
makes this rule plainer is measured against this baseline.

**Earlier rounds.**
- **Round 1** found two defects in the cases, and in both the reviewer was
  right: Opus dev 1.00, holdout 1.00; Haiku dev 0.90, holdout 1.00. cr-003
  was meant to be a clean change, but `.length` counts UTF-16 code units
  while the spec counted characters, so 150 emoji were rejected; Haiku
  found it in three runs, Opus in none. cr-013 was meant to be clean, but
  `?? 'Not set'` lets an empty string through. Both situations now state
  what the schema guarantees. cr-002's check named only "inject"; it now
  also accepts a finding that describes raw interpolation, after round 2
  showed such a finding failing. Runs, Opus: [1](eval-runs/2026-11-27-r1/opus-run-1.json), [2](eval-runs/2026-11-27-r1/opus-run-2.json), [3](eval-runs/2026-11-27-r1/opus-run-3.json), [4](eval-runs/2026-11-27-r1/opus-run-4.json), [5](eval-runs/2026-11-27-r1/opus-run-5.json). Haiku: [1](eval-runs/2026-11-27-r1/haiku-run-1.json), [2](eval-runs/2026-11-27-r1/haiku-run-2.json), [3](eval-runs/2026-11-27-r1/haiku-run-3.json), [4](eval-runs/2026-11-27-r1/haiku-run-4.json), [5](eval-runs/2026-11-27-r1/haiku-run-5.json).

**Limits of this baseline.**
- Opus is at the ceiling; Haiku is near it.
- The diffs are a few lines each, with the defect in view; a real review
  reads more code, where a defect is easier to miss.
- Each run answers all cases in one context, in a shuffled order, not one
  fresh agent per case.
- It checks what a review records, not what the reviewer would run in a
  real repository.
