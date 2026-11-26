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
  "topology_change": null,
  "owner_message": null,
  "actions_now": "one or two sentences"
}
```

`plan`, when present, holds `consent_multi_agent`, `lines` (`id`,
`touches`, `needs`) and `topology` (`kind`, `rejected`) from
[run-plan.md](run-plan.md).

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
per_case: all 15 cases 1.00
rubric: { plan-keeps-independent-work-going: [3, 3, 3, 3, 2], mean: 2.8 }
runs: eval-runs/2026-11-26-r2/
```

Runs: [1](eval-runs/2026-11-26-r2/run-1.json),
[2](eval-runs/2026-11-26-r2/run-2.json),
[3](eval-runs/2026-11-26-r2/run-3.json),
[4](eval-runs/2026-11-26-r2/run-4.json),
[5](eval-runs/2026-11-26-r2/run-5.json).

**Round 1** ran on the version before this baseline and found a defect:
dev 0.98, holdout 1.00; df-006 failed once, because the plan format did not
say whether consent that is required but not recorded is `no` or
`unknown`, and runs split on whether `kind` meant what runs or what was
preferred. The format now defines both and adds `preferred`, and df-006
checks them. Runs: [1](eval-runs/2026-11-26-r1/run-1.json),
[2](eval-runs/2026-11-26-r1/run-2.json),
[3](eval-runs/2026-11-26-r1/run-3.json),
[4](eval-runs/2026-11-26-r1/run-4.json),
[5](eval-runs/2026-11-26-r1/run-5.json); rubric 3 in all five.

**Limits of this baseline.**
- It is at the ceiling. A drop will show, but an improvement cannot, and a
  set this easy may miss real weaknesses. Add harder cases, first from real
  use.
- The skill and the cases have one author, and the holdout was written with
  the skill.
- Each run answered all 15 cases in one context, in a shuffled order, not
  one fresh agent per case.
- Not checked by code, and seen to vary: whether a skill line opens its
  session now (df-008, df-010: 0 or 1), and whether df-015 is one line or
  two.
