# Evaluation set: the factory's decisions

Open this when [../SKILL.md](../SKILL.md) or a binding value it reads
changes, or when a real decision of the factory turned out wrong (add it as
a case). The rules are
[../../agent-evals/SKILL.md](../../agent-evals/SKILL.md); the cases follow
its [case format](../../agent-evals/references/case-format.md), written as
JSON so that code can grade them.

- Cases, with situations and checks: [eval-cases.json](eval-cases.json).
- Grader: [grade-evals.mjs](grade-evals.mjs), run as
  `node grade-evals.mjs <run.json> ...`.

## Cases

| Case | Split | Expected behaviour |
| --- | --- | --- |
| df-001 | dev | small task: no plan, no session |
| df-002 | dev | one line in this session |
| df-003 | dev | one line with subagents for the search |
| df-004 | dev | two independent lines in parallel sessions |
| df-005 | dev | a shared file stops parallel sessions |
| df-006 | dev | no consent: propose and ask, open nothing |
| df-007 | dev | ordered dependencies: a chain of phases |
| df-008 | dev | a repeated finding extends the existing skill |
| df-009 | dev | a first-time gap is only watched |
| df-010 | dev | a repeated, project-specific gap: a new project skill as its own line |
| df-011 | holdout | a rule for any repository: propose a shared skill, never edit the copy |
| df-012 | holdout | a gap that would loosen a permission goes to the owner |
| df-013 | holdout | a shared type between parallel lines: revisit and record |
| df-014 | holdout | a read-only question is small |
| df-015 | holdout | an unclear done-when: ask once, keep independent work going |
| df-016 | dev | a feature with no spec starts with product; reviewer and QA fresh |
| df-017 | dev | a known-cause bug: implementer and reviewer only |
| df-018 | dev | a new shared schema: product, then architect, then implementer |
| df-019 | holdout | an approved spec exists: product is skipped and the skip recorded |
| df-020 | holdout | a repeated return caused by the spec goes back to product and the owner |
| df-021 | holdout | the reviewer is never a fork of the implementer |
| df-022 | dev | QA runs as its own session in parallel, from the approved spec |
| df-023 | dev | a role-skill change runs its evals after the implementer |
| df-024 | dev | each role takes its model and effort from the binding; the reviewer differs from the implementer |
| df-025 | holdout | a nearly spent budget never lowers the reviewer's model or effort |
| df-026 | holdout | no models in the binding: roles inherit, and the reviewer is still not a fork |
| df-027 | holdout | a binding that puts the reviewer below the implementer is followed, recorded and put to the owner |

The holdout cases were written by the same author as the skill, at the
same time; they guard against tuning to the dev cases, not against the
author's blind spots. New cases from real failures go to `holdout` first.

## How to run

Give a fresh agent, once per run, the skill, its references (except this
file, the cases file and the grader), `session-management`, and the
situations alone, shuffled, without the checks. It returns one answer per
case in the schema below and runs nothing. Grade with the grader. Grade
`df-015`'s rubric with a grader on another model. Five runs.

```json
{
  "id": "df-001",
  "small": true,
  "consent_multi_agent": "yes | no | unknown",
  "plan": null,
  "sessions_opened": 0,
  "asks_owner": false,
  "skill_actions": [{ "gap": "G1", "action": "fix | extend | new | propose-shared | ask-owner | none", "layer": "domain | binding | universal | engineering", "as_own_line": true }],
  "gaps": [{ "id": "G1", "state": "watching" }],
  "new_skill_started": false,
  "edits_shared_copy": false,
  "topology_change": { "recorded": true, "from": "parallel-sessions", "to": "phase-chain", "reason": "the broken assumption, with evidence" },
  "role_starts": [{ "line": "L2", "role": "reviewer", "skill": "code-review", "runs_in": "subagent", "context": "fresh", "model": "model A | inherited", "effort": "high | inherited" }],
  "returns_to": "product | architect | implementer | null",
  "owner_message": null,
  "actions_now": "one or two sentences"
}
```

`returns_to` is the role the line goes to now, or null. `topology_change`
is null when the topology stays as it is.

`plan`, when present, holds `consent_multi_agent`, `lines` (`id`,
`touches`, `needs`, `kind`, `roles` with `role`, `skill`, `runs_in`,
`context`, `model`, `effort`, `after`, and `skipped_roles`) and `topology` (`kind`,
`preferred`, `rejected`) from [run-plan.md](run-plan.md). `role_starts`
lists roles started now during a run, outside a new plan.

## Rubric

`plan-keeps-independent-work-going` (df-015): 3, the factory asks the owner
once, with the two options, and plans or starts only the work that does not
depend on the answer; 2, it asks but plans nothing; 1, it picks a pricing
model itself; 0, it starts the whole implementation.

## Baseline

```yaml
set: development-factory
skill_version: development-factory at the commit that records this baseline
model: claude-opus-5-5 (role under test); claude-sonnet-5-5 (rubric grader)
runs_per_case: 5
recorded_at: 2026-11-26
pass_rate: { dev: 1.00, holdout: 1.00 }
per_case: all 27 cases 1.00
rubric: { plan-keeps-independent-work-going: [3, 3, 3, 3, 3], mean: 3.0 }
runs: eval-runs/2026-11-26-r7/
```

Runs: [1](eval-runs/2026-11-26-r7/run-1.json), [2](eval-runs/2026-11-26-r7/run-2.json), [3](eval-runs/2026-11-26-r7/run-3.json), [4](eval-runs/2026-11-26-r7/run-4.json), [5](eval-runs/2026-11-26-r7/run-5.json).

**Earlier rounds.**
- **Round 6** passed all 26 cases after round 5's fixes (rubric 3.0). An
  independent review then found that the skill recorded `inherited` where a
  client gives a worker its own default model, that a session cannot run
  above the manager's level, and that nothing said what to do with a
  binding that breaks the role rules; the skill now covers all three and
  df-027 tests the last. Runs: [1](eval-runs/2026-11-26-r6/run-1.json), [2](eval-runs/2026-11-26-r6/run-2.json), [3](eval-runs/2026-11-26-r6/run-3.json), [4](eval-runs/2026-11-26-r6/run-4.json), [5](eval-runs/2026-11-26-r6/run-5.json).
- **Round 5** added the model and effort cases df-024 to df-026, which
  passed in all five runs, and found two defects elsewhere: dev 0.97,
  holdout 0.90. df-013 failed in all five runs although every answer
  recorded the right change: the answer schema did not give the shape of
  `topology_change`, so the answers used other field names; the schema now
  gives it. df-002 passed in three of five: two runs chose `subagents`
  because the line's reviewer and QA run as subagents, and the topology
  table listed "an independent review" as a piece for subagents; the table
  and `Roles are not lines` now say that a line's own reviewer or QA does
  not change the topology. Runs: [1](eval-runs/2026-11-26-r5/run-1.json), [2](eval-runs/2026-11-26-r5/run-2.json), [3](eval-runs/2026-11-26-r5/run-3.json), [4](eval-runs/2026-11-26-r5/run-4.json), [5](eval-runs/2026-11-26-r5/run-5.json).
- **Round 4** was the baseline for the first 23 cases: all 1.00, rubric
  3, 3, 3, 3, 3. Runs: [1](eval-runs/2026-11-26-r4/run-1.json), [2](eval-runs/2026-11-26-r4/run-2.json), [3](eval-runs/2026-11-26-r4/run-3.json), [4](eval-runs/2026-11-26-r4/run-4.json), [5](eval-runs/2026-11-26-r4/run-5.json).
- **Round 3** added the role cases df-016 to df-023 and found two defects:
  dev 0.93, holdout 0.93. df-017 failed in all five runs because the case
  was wrong: a one-file fix with a known cause is small by the intake, and
  every run said so; its situation now crosses two areas. df-020 passed in
  two of five, because the skill did not say where a line goes while the
  owner is asked about a spec that contradicts the code; `Roles` now sends
  it to product, where it waits. Runs: [1](eval-runs/2026-11-26-r3/run-1.json), [2](eval-runs/2026-11-26-r3/run-2.json), [3](eval-runs/2026-11-26-r3/run-3.json), [4](eval-runs/2026-11-26-r3/run-4.json), [5](eval-runs/2026-11-26-r3/run-5.json).
- **Round 2** was the baseline for the first 15 cases: all 1.00, rubric
  3, 3, 3, 3, 2. Runs: [1](eval-runs/2026-11-26-r2/run-1.json), [2](eval-runs/2026-11-26-r2/run-2.json), [3](eval-runs/2026-11-26-r2/run-3.json), [4](eval-runs/2026-11-26-r2/run-4.json), [5](eval-runs/2026-11-26-r2/run-5.json).
- **Round 1** found that the plan format did not say whether consent that is
  required but not recorded is `no` or `unknown`, and runs split on whether
  `kind` meant what runs or what was preferred (dev 0.98); the format now
  defines both and adds `preferred`. Runs: [1](eval-runs/2026-11-26-r1/run-1.json), [2](eval-runs/2026-11-26-r1/run-2.json), [3](eval-runs/2026-11-26-r1/run-3.json), [4](eval-runs/2026-11-26-r1/run-4.json), [5](eval-runs/2026-11-26-r1/run-5.json).

**Limits of this baseline.**
- It is at the ceiling. A drop will show, but an improvement cannot, and a
  set this easy may miss real weaknesses. Add harder cases, first from real
  use.
- The skill and the cases have one author, and the holdout was written with
  the skill. df-020 is a holdout case whose failure led to a change in the
  skill, so it no longer tests generalisation.
- Each run answered all 27 cases in one context, in a shuffled order, not
  one fresh agent per case.
- The model and effort cases check what the plan records, not what a
  client runs, and their models are placeholders (model A to D), so they
  do not test a real binding's names.
- Not checked by code, and seen to vary: whether a skill line opens its
  session now (df-008, df-010: 0 or 1), and whether df-015 is one line or
  two (2 runs one, 3 runs two). df-017 is labelled `bug-unknown` in every
  run: the chain table sends a fix that users see to the QA row, and the
  `kind` values name no such row.
