---
name: product-spec
description: The product role - turn a request into a specification that others can build and test against - the problem and who has it, scope and non-goals, acceptance criteria that each map to a check, the questions only the owner can answer, and the spec's approval and versions. Use when a feature or a change of behaviour has no approved specification yet, when an implementer, reviewer or QA reports that the spec is silent or wrong, or when the development factory assigns the product role. Not for a bug fix with a known cause, a refactor, or a request that already states testable acceptance criteria.
metadata:
  tree-code: E12
  depends-on: verification, human-gates
---

# Product Spec

Draft: an evaluation baseline is recorded (at the ceiling; see
[references/eval-set.md](references/eval-set.md)), but there is no consumer
yet and no approval by the layer's owner
([skill-authoring](../skill-authoring/SKILL.md) `Done`).

## How to read this skill

Always in force:
- `What a spec is for`: it decides what every later role builds and checks
  against.
- `Never invent requirements`: a guessed requirement passes review and QA,
  because they check against the spec.
- `Contract`: the product role's input, output and limits.

Conditional:
- `Acceptance criteria`: writing or changing criteria.
- `Scope and non-goals`: writing a new spec.
- `Approval and versions`: the spec is ready, or an approved spec must
  change.

The skeleton is [references/spec-template.md](references/spec-template.md),
opened when writing a spec. The evaluation set is
[references/eval-set.md](references/eval-set.md), opened when this skill
changes.

## What a spec is for

A specification is the input of the architect, the implementer, the
reviewer and QA ([architecture-decisions](../architecture-decisions/SKILL.md),
[implementation](../implementation/SKILL.md),
[code-review](../code-review/SKILL.md), [qa-testing](../qa-testing/SKILL.md)).
It says what must be true when the work is done, not how to build it.

- Write it for a reader with no access to the conversation: the request,
  the problem, who has it, and what changes for them.
- Keep design out. A spec that names functions or tables makes the
  architect's and the implementer's decisions for them; name the behaviour
  instead.
- One spec per deliverable line. A spec that needs two branches is two
  specs.

## Never invent requirements

- Every requirement traces to the request, a recorded decision, the code's
  current behaviour, or a document the project declares. Cite which.
- Where the request is silent on something a criterion needs, write the
  question in `Open questions` with the options and what each changes. Do
  not pick one, unless the binding allows a provisional choice; then mark it
  provisional ([human-gates](../human-gates/SKILL.md) `Deferred decisions`).
- Parts of the work that do not depend on an open question may go ahead;
  the spec says which parts wait.

## Acceptance criteria

- Each criterion is one observable behaviour, in the form "given ... when
  ... then ...", or one measurable property.
- Each criterion names the check that proves it: a test to write, a command
  to run, a manual step with its expected result
  ([verification](../verification/SKILL.md) `Evidence format`). A criterion
  without a check is a wish.
- Include the failure paths: invalid input, missing permission, empty state,
  the limit reached. QA writes its negative tests from them.
- Number the criteria. Reviewers and QA refer to them by number.

## Scope and non-goals

- `In scope` lists what this spec changes. `Non-goals` lists the nearest
  things it does not change, so that nobody builds them "while there".
- Name the areas of the repository it is expected to touch, as a hint for
  splitting lines, not as design.

## Approval and versions

- A spec is `draft` until the person the binding names approves it; then it
  is `approved`. Where the binding allows a provisional approval, it is
  `approved-provisional` and says so.
- An approved spec is not edited in place. A change is a new version with
  what changed and why; work already built against the old version is
  checked against the new one.
- When the implementer, reviewer or QA reports that the spec is silent or
  wrong, answer with a new version or a question to the owner. Never answer
  in a message that leaves the spec unchanged.

## Contract

- **Input:** the request, the project's agent instructions, the code's
  current behaviour, recorded decisions; for a revision, the report that
  the spec is silent or wrong.
- **Output:** a spec file from the template, with numbered acceptance
  criteria, each with its check, and open questions; status `draft` until
  approved.
- **Does not:** design the solution, write code or tests, approve its own
  spec, or pick an answer to an owner's question without the binding's
  leave.
- **Escalate when:** the goal itself is unclear; two requirements
  contradict; a criterion depends on a decision about money, privacy,
  security or people. Use [agent-foundations](../agent-foundations/SKILL.md)
  `Escalation`.
