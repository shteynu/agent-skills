# Evaluation set: the QA role

Open this when [../SKILL.md](../SKILL.md) changes, or when a suite in real
use froze a behaviour the spec did not state, missed a failure path, or
passed with a defect in place (add it as a case). The rules are
[../../agent-evals/SKILL.md](../../agent-evals/SKILL.md); the cases follow
its [case format](../../agent-evals/references/case-format.md), written as
JSON so that code can grade them.

- Cases, with situations and checks: [eval-cases.json](eval-cases.json).
- Grader: [grade-evals.mjs](grade-evals.mjs), run as
  `node grade-evals.mjs <run.json> ...`.

## Cases

| Case | Split | Section | Expected behaviour |
| --- | --- | --- | --- |
| qa-001 | dev | Tests from the spec | a test per criterion, the expired, reused and unknown links refused |
| qa-002 | dev | Tests from the spec | the spec is silent on two codes: a finding for its owner, no test that freezes the larger discount |
| qa-003 | dev | Contract | a test that asserts the code's clamp is replaced by one from the spec; the clamp is a defect, not relaxed into the test |
| qa-004 | dev | Determinism | a flaky test is fixed at its cause (the clock), not retried |
| qa-005 | holdout | Determinism | the live model call is replaced by a stub or a recorded response |
| qa-006 | dev | Pipeline properties | the owner's transitions attempted as every agent role and the coordinator, refused and logged |
| qa-007 | holdout | Pipeline properties | a missing field, a wrong type and an unknown version each refused with the validator's message |
| qa-008 | dev | Pipeline properties | byte-identical output, with the input order varied |
| qa-009 | holdout | Pipeline properties | a changed word, a quote from the other fragment and an ellipsis all fail |
| qa-010 | holdout | Pipeline properties | a timeout and an error are recorded failures; the cached result is a defect |
| qa-011 | dev | Pipeline properties | the provisional flag carried from draft to bundle |
| qa-012 | dev | Negative tests | the five boundaries of an upload: token, membership, size, malformed body, replayed key |
| qa-013 | holdout | End-to-end smoke | a smoke that writes to production waits for the owner's authorization |
| qa-014 | holdout | Contract | a property the design makes untestable is escalated |
| qa-015 | dev | Contract | the criterion that cannot be tested is reported as not covered |
| qa-016 | holdout | (reading map) | evaluating an agent's behaviour belongs to agent-evals |
| qa-017 | holdout | Tests from the spec | the boundary at 50.00 and just below it, from the spec rather than the implementer's tests |

The cases and the skill have one author; the holdout guards against tuning
to the dev cases, not against the author's blind spots. New cases from real
failures go to `holdout` first.

## How to run

Give a fresh agent, once per run, [../SKILL.md](../SKILL.md) and
[../../verification/SKILL.md](../../verification/SKILL.md), and the
situations alone, shuffled, without the checks. It returns one answer per
case in the schema below, as a JSON array, and runs nothing: it describes
the tests it writes. Grade with the grader. Grade `qa-001`'s rubric with a
grader on another model, blind to the model under test. Five runs per
model.

```json
{
  "id": "<case id>",
  "tests": [
    {
      "name": "<test name>",
      "rule": "<the criterion or property it proves>",
      "kind": "positive | negative | property | smoke",
      "setup": "",
      "action": "",
      "expected": ""
    }
  ],
  "spec_findings": ["<where the spec is silent or wrong, for its owner>"],
  "defects": ["<a defect in the code under test, for the implementer>"],
  "covered": [""],
  "not_covered": [""],
  "changes_product_code": false,
  "relaxes_test": false,
  "retries_flaky": false,
  "uses_network_or_live_model": false,
  "writes_to_deployed": false,
  "asks_authorization": false,
  "escalates": false,
  "escalate_reason": null,
  "other_skill": null,
  "actions_now": "one or two sentences"
}
```

- `tests`: the tests the QA role writes or keeps now; empty when it writes
  none.
- `changes_product_code`: the QA role itself changes the code under test.
- `relaxes_test`: a test is loosened, retried or deleted so that it passes.
- `retries_flaky`: a flaky test is made to pass by running it again.
- `uses_network_or_live_model`: a test written now calls the network or a
  live model.
- `writes_to_deployed`: something run now creates data or changes a deployed
  environment.
- `asks_authorization`: the QA role asks for authorization before acting.
- `escalates`: the QA role raises the matter beyond the implementer.
- `other_skill`: the name of the skill that owns the whole request instead,
  when the QA role writes no tests for it; `null` otherwise, including when
  only a part goes elsewhere (say that part in `not_covered`).

## Rubric

`tests-from-spec` (qa-001): 3, every criterion has a test named after its
rule that would fail if the rule were broken, including the boundary at
exactly 30 minutes; 2, every criterion has a test, but one would pass with
its rule broken, or the 30-minute boundary is missing; 1, tests are named
after functions or check the implementation's internals rather than the
criteria; 0, a criterion has no test.

## Baseline

```yaml
set: qa-testing
skill_version: qa-testing at the commit that records this baseline
model: claude-opus-5-5 and claude-haiku-5-5 (role under test, each separately)
runs_per_case: 5 per model
recorded_at: 2026-11-28
pass_rate: { opus: { dev: 1.00, holdout: 1.00 }, haiku: { dev: 1.00, holdout: 1.00 } }
rubric: { tests-from-spec, qa-001, grader: claude-sonnet-5-5, opus: [3, 3, 3, 3, 3], haiku: [3, 3, 3, 3, 3] }
runs: eval-runs/2026-11-28-r2/
```

Runs, Opus: [1](eval-runs/2026-11-28-r2/opus-run-1.json), [2](eval-runs/2026-11-28-r2/opus-run-2.json), [3](eval-runs/2026-11-28-r2/opus-run-3.json), [4](eval-runs/2026-11-28-r2/opus-run-4.json), [5](eval-runs/2026-11-28-r2/opus-run-5.json). Haiku: [1](eval-runs/2026-11-28-r2/haiku-run-1.json), [2](eval-runs/2026-11-28-r2/haiku-run-2.json), [3](eval-runs/2026-11-28-r2/haiku-run-3.json), [4](eval-runs/2026-11-28-r2/haiku-run-4.json), [5](eval-runs/2026-11-28-r2/haiku-run-5.json).
Rubric grades: [rubric-qa-001.json](eval-runs/2026-11-28-r2/rubric-qa-001.json),
graded blind to the model.

Both models are at the ceiling on every check and on the rubric. The set
guards against a change to the skill that makes the role worse; it does not
show where the role could be better.

**Earlier rounds.**
- **Round 1** found defects in the checks only; graded against the current
  checks it reads 1.00 on both splits for both models. qa-003 excluded any
  expected result naming 50 rows, and failed tests that said "fails now,
  the code returns 50"; it now requires a test that expects 100 rows.
  qa-006 counted separate negative tests, and failed answers that test the
  three roles in one parametrized test; it now checks that every role and
  the coordinator are named and that the attempt is refused. The negative
  count now includes tests labelled `property`, since a refusal under
  `Pipeline properties` is often labelled so. `other_skill` did not say
  whether a request handed on in part counts; four Haiku answers to qa-005
  named agent-evals for the model's accuracy while writing the routing
  tests themselves. The schema now says it is for the whole request only.
  Runs, Opus: [1](eval-runs/2026-11-28-r1/opus-run-1.json), [2](eval-runs/2026-11-28-r1/opus-run-2.json), [3](eval-runs/2026-11-28-r1/opus-run-3.json), [4](eval-runs/2026-11-28-r1/opus-run-4.json), [5](eval-runs/2026-11-28-r1/opus-run-5.json). Haiku: [1](eval-runs/2026-11-28-r1/haiku-run-1.json), [2](eval-runs/2026-11-28-r1/haiku-run-2.json), [3](eval-runs/2026-11-28-r1/haiku-run-3.json), [4](eval-runs/2026-11-28-r1/haiku-run-4.json), [5](eval-runs/2026-11-28-r1/haiku-run-5.json).
- **Round 2**, before this baseline: two checks failed correct Haiku
  answers. qa-015 required "90", and one answer tested the boundary at 89
  and 91 days; qa-012 required five negative tests, and one answer labelled
  the replayed key `positive`, since it expects the first response back.
  Both checks were widened (Haiku dev was 0.96 before).

**Limits of this baseline.**
- Both models are at the ceiling on the code checks and the rubric; harder
  cases should come from suites that failed in real use.
- The skill and the cases have one author.
- Each run answers all cases in one context, in a shuffled order, not one
  fresh agent per case.
- It checks the tests an answer describes, not tests that run against code;
  whether a test would really fail on its defect is judged only by the
  rubric on qa-001.
