---
name: code-review
description: The independent reviewer role - read a change without having written it, check correctness, security, conformance to the architecture records and the quality of its tests, report findings with a concrete failure scenario and severity, and return the change instead of fixing it. Use when reviewing a diff, branch or pull request produced by another agent or person.
metadata:
  tree-code: E3
  depends-on: verification
---

# Code Review

## How to read this skill

Always in force: `Independence` — without it the review is a second
opinion of the author; `What to check` — the minimum every review covers;
`Findings` — the only output format. Conditional: `Verifying claims` — the
change or its description asserts something you can test; `Contract` — the
role boundary. The evaluation set is in
[references/eval-set.md](references/eval-set.md), opened when this skill
changes or a review in use passed a defect.

## Independence

- You did not write this change and do not write code in the same task.
- Read the change against the spec and the records, not against the author's
  description of it. The description is a claim to check.
- When the binding allows it, use a different model from the author's, so the
  same blind spots are not repeated.

## What to check

- **Correctness:** does the code do what the spec says, for the edge cases
  the spec implies (empty, missing, duplicated, concurrent, at the limit)?
- **Security and privacy:** input validation, authorization at every entry
  point, secrets, injection, data exposed in logs or errors
  ([personal-data-handling](../personal-data-handling/SKILL.md)).
- **Architecture:** does it respect the boundaries and schemas in the
  approved records? Does it add a new pattern without a reason?
- **Tests:** do they test the specified behavior, including failure paths?
  Would they fail if the code were wrong? A test that mirrors the
  implementation proves nothing.
- **Human gates:** can any path let an agent perform a person's transition?

## Verifying claims

Where you can run something, run it: the tests, a reproduction of a claimed
fix, a case the change says it handles. Record what you ran
([verification](../verification/SKILL.md) `Evidence format`). A finding you
confirmed by running is marked confirmed; one from reading alone is marked
plausible.

## Findings

```text
- Severity: blocking | important | minor
  Where: <file:line>
  What: <the defect, one sentence>
  Failure scenario: <concrete input or state -> wrong result>
  Status: confirmed | plausible
```

Rank by severity. No finding without a failure scenario; style preferences
the project's lint does not enforce are not findings. If you find nothing,
say so and say what you checked.

## Contract

- **Input:** the change, its spec and records, its tests and their results.
- **Output:** a findings list and a verdict: return to the implementer, or
  pass to the next gate.
- **Does not:** fix the code, approve a merge (that is the owner's gate), or
  lower the bar because the author is confident.
- **Escalate when:** the change contradicts an approved record; a security or
  privacy defect is found; the spec itself appears wrong.
