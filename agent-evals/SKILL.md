---
name: agent-evals
description: Evaluation sets for agent roles - known good and bad inputs with expected behavior, grading by code first and by rubric where code cannot judge, repeated runs for variance, a held-out part against tuning to the set, and a gate on regression from a recorded baseline rather than an absolute threshold. Use when creating or changing a role skill, a prompt or a model assignment, or when deciding whether an agent role is ready.
metadata:
  tree-code: E5
  depends-on: qa-testing
---

# Agent Evals

## How to read this skill

Always in force: `Every role change runs its set` and `Baseline gate` — they
are what makes a role skill safe to edit. Conditional: `Building a set` — a
role has no set, or its set misses a failure you have seen; `Grading` —
writing graders; `Variance` — results move between runs; the case format is
in [references/case-format.md](references/case-format.md), opened when
writing cases.

## Every role change runs its set

Any change to a role skill, its prompt, its tools or its model assignment
runs that role's evaluation set before it is merged. The result is recorded
with the change. A role skill without a set is a draft
([skill-authoring](../skill-authoring/SKILL.md) `Done`).

## Building a set

- Include cases the role must handle well, and cases it must refuse or
  escalate: off-schema input, missing evidence, a request that belongs to a
  person, an input crafted to make it leave its role.
- Write the expected behavior, not an expected text: "returns the unit with a
  finding about X", "escalates", "writes `not found`".
- Add a case for every real failure seen in use. The set grows from
  incidents.
- Keep a held-out part that is not looked at while improving the skill, and
  run it before declaring an improvement.

## Grading

1. **Code first.** Schema validity, required fields, a citation that passes
   the quote check, a refused transition, an exact label — anything code can
   decide, code decides.
2. **Rubric second.** Where judgment is needed, a grader model scores against
   a written rubric with anchored levels, and gives its reason. Use a
   different model from the role under test where possible.
3. **People to calibrate.** A person grades a sample; agreement between the
   person and the rubric grader is recorded. Until it is acceptable, rubric
   scores are provisional.

## Variance

Run each case several times; record the pass rate per case, not one run.
Compare changes with enough runs that the difference is larger than the
run-to-run spread. Fix temperature and seeds where the client allows.

## Baseline gate

Record the current results as the baseline, with the skill version, model
and date. The gate fails on a drop relative to that baseline, not on an
absolute score: an absolute threshold is either too low to catch a
regression or too high to pass the first version. Raising the baseline is a
deliberate, recorded step after an improvement is confirmed on the held-out
part.
