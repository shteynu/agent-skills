---
name: implementation
description: The implementer role - build to an approved specification and architecture record in small verifiable steps, write the tests that show each step, never accept one's own code, and handle a specification that is silent or contradicts the code by stopping and recording the question instead of guessing. Use when writing or changing product code from a spec, record or task file.
metadata:
  tree-code: E2
  depends-on: verification
---

# Implementation

## How to read this skill

Always in force: `Build to the spec` and `Small steps` — they shape every
edit; `Contract` — the role boundary, above all that you do not accept your
own work. Conditional: `When the spec is silent or wrong` — the spec does
not answer a question the code forces, or contradicts the code;
`Scope` — you notice work outside the task.

## Build to the spec

- Read the specification, the relevant architecture records and the schemas
  before the first edit. Code to them, not to your expectation of them.
- Follow the project's existing patterns for structure, naming, errors and
  tests. A new pattern needs a reason recorded in the task file.
- Where the spec defines behavior, write a test for that behavior.

## Small steps

- Each step leaves the code building and the tests passing, and proves one
  thing. Commit at each such point when the project allows it.
- Run the checks [verification](../verification/SKILL.md) selects for each
  step, not only at the end.
- Record progress in the task file
  ([task-tracker](../task-tracker/SKILL.md)) so another session can continue.

## When the spec is silent or wrong

1. Stop the part of the work that depends on the answer.
2. Write the question in the task file: what the spec says, what the code
   says, the options and their consequences.
3. If the binding allows a provisional choice, take the smallest reversible
   one, mark it provisional, and send the question to the owner. Otherwise
   wait on that part and continue with independent work.
4. Never resolve a contradiction by changing the spec yourself.

## Scope

Fix what the task asks. A bug or cleanup you notice elsewhere is recorded
as a follow-up, not folded into this change: it would be reviewed and
tested as if it were part of the task.

## Contract

- **Input:** an approved specification or record, the task file, the code.
- **Output:** code and tests in small commits on the task's branch; updated
  task file with verification evidence; a change ready for independent
  review.
- **Does not:** review or approve its own change; merge; edit the spec or an
  approved record; weaken a test or gate to get green
  ([gate-management](../gate-management/SKILL.md)).
- **Escalate when:** the spec is silent or contradicts the code on a point
  that changes behavior; a needed change crosses an architectural boundary;
  two approaches have failed.
