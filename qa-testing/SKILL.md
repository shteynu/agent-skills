---
name: qa-testing
description: The QA role - write tests from the specification rather than from the finished implementation, cover failure paths with negative tests, make results deterministic, and prove the properties every agent pipeline must hold (a person's transition is unreachable by an agent, an off-schema file is rejected, assembly is deterministic, the quote check catches an invented quote). Use when writing or reviewing tests for a pipeline or service, or when deciding what a test suite must prove.
metadata:
  tree-code: E4
  depends-on: verification
---

# QA Testing

## How to read this skill

Always in force: `Tests from the spec` — the reason QA is a separate role;
`Contract` — the role boundary. Conditional: `Pipeline properties` — the
system under test is an agent pipeline or its coordinator;
`Negative tests` and `Determinism` — writing or reviewing any suite;
`End-to-end smoke` — a user-visible or cross-service flow changed. Evaluating
agent behavior rather than code is [agent-evals](../agent-evals/SKILL.md).

## Tests from the spec

- Derive cases from the specification and records before reading the
  implementation. A test written from the code checks that the code does what
  it does.
- Each specified rule has at least one test that fails if the rule is broken.
  Name tests after the rule, not after the function.
- When the spec does not say what should happen, that is a finding for the
  spec owner, not a behavior to freeze in a test.

## Pipeline properties

Every agent pipeline's suite proves, at minimum:

| Property | Test |
| --- | --- |
| A person's transition is unreachable by an agent | Attempt each such transition as every agent role and as the coordinator; each attempt is refused and logged |
| An off-schema file is rejected | For each schema, feed a file with a missing field, a wrong type and an unknown version; each is refused with the validator's message |
| Assembly is deterministic | The same inputs produce byte-identical output across runs and machines |
| The quote check catches an invented quote | A quote changed by one word, a quote from another fragment, and a quote with an ellipsis all fail |
| A failed role is visible | A role that errors or times out produces a recorded failure, never a substituted result |
| Provisional stays provisional | A unit downstream of a provisional decision carries the flag through every step |

## Negative tests

For every input boundary, test what must be refused: unauthorized caller,
missing secret, malformed input, wrong tenant or owner, oversized payload,
replayed request. A suite with only happy paths shows that the system works
when nothing goes wrong.

## Determinism

- Fix seeds, clocks and ordering. Sort wherever order is not specified.
- Tests do not depend on the network or on a live model. Model calls are
  replaced by recorded responses or stubs behind the same interface.
- A flaky test is a failing test until its cause is found.

## End-to-end smoke

A small end-to-end run answers "is it standing?" across the real wiring. It
does not replace the rule-level tests above, and it never writes to a
deployed environment without the authorization
[verification](../verification/SKILL.md) `Preflight` requires.

## Contract

- **Input:** the spec, the records, the schemas, and the change under test.
- **Output:** tests that fail on the defects they target, and a short
  report of what is covered and what is not.
- **Does not:** change product code to make a test pass, or relax a test to
  match current behavior.
- **Escalate when:** the spec is silent on behavior a test must fix; a
  required property cannot be tested with the current design.
