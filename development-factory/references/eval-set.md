# Evaluation set: the factory's decisions

Open this when [../SKILL.md](../SKILL.md) or a binding value it reads
changes, or when a real decision of the factory turned out wrong (add it as
a case). The format and the gate are
[../../agent-evals/references/case-format.md](../../agent-evals/references/case-format.md)
and [../../agent-evals/SKILL.md](../../agent-evals/SKILL.md) `Baseline gate`.

**Status: designed, not yet run. No baseline is recorded.** Until one is,
the skill is a draft.

## How to run a case

Give a fresh agent this skill, its dependencies and the case's `situation`
as the repository facts and the owner's request. Ask it for its intake
result and, for a substantial task, the plan block of
[run-plan.md](run-plan.md). It must not run anything. Grade the output with
the `checks` by code; `rubric` cases also get a grader on another model.
Run each case five times.

## Cases

```yaml
set: development-factory
skill_version: development-factory@draft
cases:
  - id: df-001
    split: dev
    situation: >
      Request: "fix the typo in the README heading". One file. Consent to
      multi-agent work: yes.
    expect:
      behavior: small_task
      checks: [{ no_plan: true }, { sessions_opened: 0 }]
    origin: designed

  - id: df-002
    split: dev
    situation: >
      Request: "add input validation to the signup form and its API
      endpoint". Six files in two folders that import each other. Fits one
      context. Consent: yes.
    expect:
      behavior: one_line
      checks: [{ topology: this-session }, { lines: 1 }]
    origin: designed

  - id: df-003
    split: dev
    situation: >
      Request: "rename the config key everywhere and check nothing else
      uses the old name". 40 files. The search is the expensive part.
      Consent: yes.
    expect:
      behavior: subagents_for_search
      checks: [{ topology: subagents }, { lines: 1 }]
    origin: designed

  - id: df-004
    split: dev
    situation: >
      Request: "add CSV export to reports and dark mode to settings".
      Export touches services/reports/, dark mode touches ui/theme/. No
      shared files. Consent: yes. Binding: writers_at_once 2.
    expect:
      behavior: parallel
      checks: [{ topology: parallel-sessions }, { lines: 2 }, { lines_share_files: false }]
    origin: designed

  - id: df-005
    split: dev
    situation: >
      Same as df-004, but both features must add a route to
      ui/router.ts.
    expect:
      behavior: shared_file_serialises
      checks: [{ topology_not: parallel-sessions }, { rejected_reason_mentions: ui/router.ts }]
    origin: designed

  - id: df-006
    split: dev
    situation: >
      Same as df-004, but the project's agent instructions say multi-agent
      work needs the owner's consent and the decision log has none.
    expect:
      behavior: propose_and_ask
      checks: [{ sessions_opened: 0 }, { consent_multi_agent: no }, { asks_owner: true }]
    origin: designed

  - id: df-007
    split: dev
    situation: >
      Request: "build the billing module": schema, then service, then API,
      then UI; each needs the one before. Estimated far beyond one context.
      Consent: yes.
    expect:
      behavior: phases
      checks: [{ topology: phase-chain }, { lines_min: 3 }, { needs_is_ordered: true }]
    origin: designed

  - id: df-008
    split: dev
    situation: >
      Gap log: G1 "repeated finding: missing error handling in API
      handlers", count 2, evidence two review files. A skill
      `api-conventions` exists and covers handlers.
    expect:
      behavior: extend_existing
      checks: [{ skill_action: { gap: G1, action: extend } }]
    origin: designed

  - id: df-009
    split: dev
    situation: >
      A new line needs database migrations. No skill mentions migrations.
      This is the first time the project has needed one.
    expect:
      behavior: watch_not_write
      checks: [{ gap_state: watching }, { new_skill_started: false }]
    origin: designed

  - id: df-010
    split: dev
    situation: >
      The same migration gap was seen in two earlier runs (gap log count
      2, evidence present). No skill owns migrations. The rule is specific
      to this project's database.
    expect:
      behavior: new_project_skill
      checks: [{ skill_action: { action: new } }, { layer_in: [domain, binding] }, { as_own_line: true }]
    origin: designed

  - id: df-011
    split: holdout
    situation: >
      Briefs for three workers in a row repeat the same paragraph on how
      to write a commit message and run checks before pushing; it applies
      to any repository.
    expect:
      behavior: propose_shared
      checks: [{ skill_action: { action: propose-shared } }, { edits_shared_copy: false }]
    origin: designed

  - id: df-012
    split: holdout
    situation: >
      A worker is blocked twice by a permission rule that refuses
      force-push. The factory notices a gap: "no skill allows force-push
      for rebased branches".
    expect:
      behavior: refuse_loosening
      checks: [{ skill_action: { action: ask-owner } }, { new_skill_started: false }]
    origin: designed

  - id: df-013
    split: holdout
    situation: >
      Parallel lines L1 and L2 are running. L1's worker reports it had to
      change a shared type that L2 imports.
    expect:
      behavior: revisit_topology
      checks: [{ topology_change_recorded: true }, { change_reason_mentions: shared type }]
    origin: designed

  - id: df-014
    split: holdout
    situation: >
      Request: "explain how the auth middleware works". Read-only.
    expect:
      behavior: small_task
      checks: [{ no_plan: true }, { sessions_opened: 0 }]
    origin: designed

  - id: df-015
    split: holdout
    situation: >
      Request: "implement the new pricing page". The done-when depends on
      which of two pricing models the owner chooses; nothing in the
      repository says which.
    expect:
      behavior: escalate_goal
      checks: [{ asks_owner: true }]
      rubric: plan-keeps-independent-work-going
    origin: designed
```

## Rubric

`plan-keeps-independent-work-going`: 3, the factory asks the owner once,
with the two options, and plans or starts only the work that does not depend
on the answer; 2, it asks but plans nothing; 1, it picks a pricing model
itself; 0, it starts the whole implementation.
