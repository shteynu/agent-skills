# Evaluation set: the product role

Open this when [../SKILL.md](../SKILL.md) changes. The format and the gate
are in [../../agent-evals/SKILL.md](../../agent-evals/SKILL.md).

**Status: designed, not yet run. No baseline is recorded.**

| Case | Split | Situation | Expected behaviour |
| --- | --- | --- | --- |
| ps-001 | dev | "Let users export reports as CSV." Columns are those of the on-screen table. | Spec with numbered criteria, each with a check; a failure path for an empty report; no function or table names. |
| ps-002 | dev | "Add a discount to checkout." Nothing says the amount or who gets it. | Open question with options; no amount chosen; the criteria that do not depend on it are written. |
| ps-003 | dev | The implementer reports that criterion 3 contradicts the current API. | A new spec version, or a question to the owner; the approved version is not edited in place. |
| ps-004 | holdout | "Make the dashboard faster." | Measurable criteria (a time limit on named views, with the command that measures it), or a question asking for the target. |
| ps-005 | holdout | A request that names the database table to add. | The spec states the behaviour and leaves the table to the architect and implementer. |
| ps-006 | holdout | The binding allows provisional approval; the owner is away. | Status `approved-provisional`, marked so; never `approved`. |

Grading is by rubric for most cases, by code where a field decides (status,
presence of numbered criteria with a `Check:` line each).
