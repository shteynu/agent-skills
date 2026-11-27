# Evaluation set: the product role

Open this when [../SKILL.md](../SKILL.md) or
[spec-template.md](spec-template.md) changes, or when a spec in real use
invented a requirement, missed a failure path or was edited in place (add
it as a case). The rules are
[../../agent-evals/SKILL.md](../../agent-evals/SKILL.md); the cases follow
its [case format](../../agent-evals/references/case-format.md), written as
JSON so that code can grade them.

- Cases, with situations and checks: [eval-cases.json](eval-cases.json).
- Grader: [grade-evals.mjs](grade-evals.mjs), run as
  `node grade-evals.mjs <run.json> ...`.

## Cases

| Case | Split | Section | Expected behaviour |
| --- | --- | --- | --- |
| ps-001 | dev | Acceptance criteria | numbered criteria, each with a check, the empty report as a criterion or an open question, non-goals, status draft |
| ps-002 | dev | Never invent requirements | the discount's size is an open question with options; the criteria that do not depend on it are written |
| ps-003 | dev | Approval and versions | an implementer's report against an approved spec: a new version or a question, never an edit in place |
| ps-004 | holdout | Acceptance criteria | "faster" becomes a time limit with its check, or a question for the target |
| ps-005 | holdout | What a spec is for | a request that names a table: the spec states the behaviour, not the table |
| ps-006 | holdout | Approval and versions | after the coordinating session's provisional approval the spec reads `approved-provisional`, never `approved` |
| ps-007 | dev | Contract | the product role never approves its own spec; it asks the owner |
| ps-008 | dev | Scope and non-goals | the nearest things (emails, the printable invoice) are placed in or out of scope, or asked about |
| ps-009 | dev | (description) | a request with testable criteria needs no spec |
| ps-010 | dev | (description) | a bug fix with a known cause needs no spec |
| ps-011 | holdout | Contract | a criterion that depends on a privacy decision goes to the owner |
| ps-012 | holdout | Approval and versions | QA's report that the spec is silent is answered in the spec |
| ps-013 | dev | What a spec is for | two deliverable lines, two specs |
| ps-014 | holdout | Contract | a request that contradicts a recorded decision goes to the owner |

ps-001 to ps-006 are the six cases first designed with the skill; the
others were added when the set was first run. All were written by the
skill's author; the holdout guards against tuning to the dev cases, not
against the author's blind spots. New cases from real failures go to
`holdout` first.

## How to run

Give a fresh agent, once per run, [../SKILL.md](../SKILL.md),
[spec-template.md](spec-template.md),
[../../human-gates/SKILL.md](../../human-gates/SKILL.md) and
[../../verification/SKILL.md](../../verification/SKILL.md), and the
situations alone, shuffled, without the checks. It returns one answer per
case in the schema below, as a JSON array, and runs nothing. Grade with the
grader. Grade `ps-001`'s rubric with a grader on another model. Five runs
per model.

```json
{
  "id": "<case id>",
  "spec_written": true,
  "specs": [
    {
      "title": "",
      "version": 1,
      "status": "draft | approved | approved-provisional",
      "sources": [""],
      "in_scope": [""],
      "non_goals": [""],
      "criteria": [{ "n": 1, "text": "Given ..., when ..., then ...", "check": "" }],
      "expected_areas": [""],
      "open_questions": [{ "question": "", "options": [{ "option": "", "changes": "" }], "blocks_criteria": [1], "waiting_for": "" }],
      "versions": [""]
    }
  ],
  "approved_edited_in_place": false,
  "answered_by": "new_version | question_to_owner | message | none",
  "asks_owner": false,
  "approves_own_spec": false,
  "actions_now": "one or two sentences"
}
```

- `spec_written`: the product role writes or revises a spec now.
- `specs` holds every spec the situation is about that is written, revised
  or changes status now, as it stands after the answer; it is empty when
  none is.
- `answered_by`: how a report against an existing spec is answered; `none`
  when there is no such report.

## Rubric

`criteria-observable` (ps-001): 3, every criterion is one observable
behaviour or measurable property, its check would prove it, and the
failure paths (an empty report, a filter that matches nothing) are there, as
criteria or, where the request is silent, as open questions;
2, the criteria are observable but a check would not prove its criterion,
or a failure path is missing; 1, some criteria are wishes ("the export is
easy to use") or name the implementation; 0, there are no numbered
criteria.

## Baseline

```yaml
set: product-spec
skill_version: product-spec at the commit that records this baseline
model: claude-opus-5-5 and claude-haiku-5-5 (role under test, each separately)
runs_per_case: 5 per model
recorded_at: 2026-11-27
pass_rate: { opus: { dev: 1.00, holdout: 1.00 }, haiku: { dev: 1.00, holdout: 1.00 } }
rubric: { criteria-observable, ps-001, grader: claude-sonnet-5-5, opus: [3, 3, 3, 3, 3], haiku: [2, 3, 3, 3, 3] }
runs: eval-runs/2026-11-27-r2/
```

Runs, Opus: [1](eval-runs/2026-11-27-r2/opus-run-1.json), [2](eval-runs/2026-11-27-r2/opus-run-2.json), [3](eval-runs/2026-11-27-r2/opus-run-3.json), [4](eval-runs/2026-11-27-r2/opus-run-4.json), [5](eval-runs/2026-11-27-r2/opus-run-5.json). Haiku: [1](eval-runs/2026-11-27-r2/haiku-run-1.json), [2](eval-runs/2026-11-27-r2/haiku-run-2.json), [3](eval-runs/2026-11-27-r2/haiku-run-3.json), [4](eval-runs/2026-11-27-r2/haiku-run-4.json), [5](eval-runs/2026-11-27-r2/haiku-run-5.json).
Rubric grades: [rubric-ps-001.json](eval-runs/2026-11-27-r2/rubric-ps-001.json),
graded blind to the model.

Haiku's one rubric 2 (run 1) has a criterion that asks for a "clear
message", which no check can prove, and fixes a header-only file for an
empty export, which the request leaves open (`Never invent requirements`).

**Earlier rounds.**
- **Round 1** found defects in the cases, not in the skill; graded against
  the current checks it reads Opus dev 0.88, holdout 0.93; Haiku dev 0.85,
  holdout 0.93. The mention checks' word lists were too narrow ("no rows",
  "how large", "fast enough"). The answer schema did not say that `specs`
  holds an existing spec whose status changes, so ps-006 and ps-007 came
  back empty. ps-006 asked the product role to record an approval, which
  the skill forbids; it now gives the coordinating session's provisional
  approval and asks for the spec as it stands. ps-008 accepted the nearest
  things only as non-goals; it now accepts them in scope or as a question.
  Runs, Opus: [1](eval-runs/2026-11-27-r1/opus-run-1.json), [2](eval-runs/2026-11-27-r1/opus-run-2.json), [3](eval-runs/2026-11-27-r1/opus-run-3.json), [4](eval-runs/2026-11-27-r1/opus-run-4.json), [5](eval-runs/2026-11-27-r1/opus-run-5.json). Haiku: [1](eval-runs/2026-11-27-r1/haiku-run-1.json), [2](eval-runs/2026-11-27-r1/haiku-run-2.json), [3](eval-runs/2026-11-27-r1/haiku-run-3.json), [4](eval-runs/2026-11-27-r1/haiku-run-4.json), [5](eval-runs/2026-11-27-r1/haiku-run-5.json).
- **Round 2**, before this baseline: ps-001 required the empty report as a
  criterion. In Haiku run 4 it was an open question with options. The
  request is silent on it, so that is what `Never invent requirements`
  asks for, and the check now accepts either (Haiku ps-001 was 0.80
  before).

**Limits of this baseline.**
- Both models are at the ceiling on the code checks; the rubric separates
  them by one answer.
- The skill and the cases have one author.
- Each run answers all cases in one context, in a shuffled order, not one
  fresh agent per case.
- It checks what an answer records, not a spec file a reader without the
  conversation would use; whether a spec stays out of design is checked
  only by ps-005's words.
