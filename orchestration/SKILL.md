---
name: orchestration
description: The coordinator of an agent pipeline as code - order of roles, transition rules, retries with idempotency, a call budget, resumability from files, and visible failure instead of silent substitution; plus the coordinating session in long autonomous runs (state in Git, replaceable session, multi-agent workflows only with consent, parallel work only on separate branches). Use when building or changing a coordinator, or when running a pipeline unattended across sessions.
metadata:
  tree-code: E6
  depends-on: pipeline-artifacts
---

# Orchestration

## How to read this skill

Always in force: `The coordinator is code` and `Failure is visible` — they
are what keep a pipeline auditable. Conditional: `Retries and idempotency`
and `Budget` — building or changing the coordinator; `Resuming` — a run was
interrupted; `Autonomous runs` — a session drives the pipeline unattended.

## The coordinator is code

- The order of roles, the allowed transitions and who may perform each are
  defined in code and configuration, not decided by an agent at run time.
- The coordinator validates every file at every transition
  ([pipeline-artifacts](../pipeline-artifacts/SKILL.md)) and refuses any
  transition that belongs to a person
  ([human-gates](../human-gates/SKILL.md)).
- An agent role receives its input files and returns output files. It does
  not call the next role, choose it, or change a unit's status itself.

## Failure is visible

When a role errors, times out, returns an invalid file or exceeds its
budget, the coordinator records a failure for that unit with the cause and
stops that unit. It never substitutes a default, a cached older result, or
another role's output, and never marks the step done. Other units continue.

## Retries and idempotency

- Retry only failures that are plausibly transient (timeouts, rate limits),
  with backoff and a fixed maximum.
- Each step has an idempotency key derived from the unit, the step and the
  input versions. Re-running a step with the same key returns the recorded
  result instead of doing the work twice.
- A retry after an invalid output is a new attempt, recorded as such; after
  the maximum, the failure stands.

## Budget

Set limits per step and per run: model calls, tokens, wall time, money.
Exceeding a limit is a recorded failure, not a reason to switch silently to
a cheaper model or skip a step. The binding sets the values.

## Resuming

The coordinator's state is the files and the transition log. After an
interruption it reads them, finds each unit's last completed step, and
continues; nothing is re-run that has a recorded result for the same key.

## Autonomous runs

When a coordinating session drives the work across hours or days (how it
opens, briefs, checks and replaces worker sessions is in
[session-management](../session-management/SKILL.md)):

- **State lives in Git; the session is replaceable.** After each completed
  step, the result is committed and pushed before the next step starts. A new
  session continues from `AGENTS.md` and the branch's task file
  ([task-tracker](../task-tracker/SKILL.md)), not from chat history.
- **Human decisions do not stop the run.** They are made provisionally where
  allowed and go to the decision queue
  ([human-gates](../human-gates/SKILL.md) `Deferred decisions`).
- **A block stops and notifies.** Network, permission or a refusal: stop that
  line, record it, notify the owner; no invented results.
- **Multi-agent workflows only with consent.** Scripted fan-out of many
  agents is expensive; run it only when the owner has asked for it.
- **Parallel only on separate branches.** Two sessions never share a branch
  or a task file.
- **Close with a package.** At the end: the decision queue, what is
  verified, what is provisional, what is blocked and why.
