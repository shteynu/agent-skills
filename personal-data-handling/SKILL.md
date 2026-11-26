---
name: personal-data-handling
description: Handle data about people in an agent pipeline - collect the minimum, work on aggregates instead of records, apply a publication threshold and small-cell suppression (including complementary suppression against differencing), keep identifiers and free text away from models, and use synthetic data with a known answer for tests. Use when a step reads, analyses, reports or sends data about people, or when designing what is stored about them.
metadata:
  tree-code: U9
  depends-on: agent-foundations
---

# Personal Data Handling

## How to read this skill

Always in force: `Minimum` and `What never goes to a model` — they apply to
any step that touches data about people. Conditional: `Aggregates and
thresholds` — you report or display numbers about groups;
`Free text` — the data includes text people wrote; `Testing` — you build or
run tests over data about people; `Logs and retention` — you add logging or
storage.

## Minimum

- Collect and keep only what the stated purpose needs. A field with no
  current use is not collected "in case".
- Separate identity from content: the analysis side works on pseudonymous
  keys; the mapping to identity lives elsewhere, with narrower access.
- Access follows role. A role that only needs aggregates never receives
  records.

## Aggregates and thresholds

- Report about groups, not individuals. The binding sets the minimum group
  size `k` below which nothing about that group is shown.
- Suppress small cells: any cell computed from fewer than `k` people is
  hidden, not shown as zero.
- Apply complementary suppression. If a total and all but one of its parts
  are visible, the hidden part can be recovered by subtraction; hide enough
  other cells that no hidden value can be derived. The same applies across
  reports over time: a filter that narrows a group from `k+1` to `k-1`
  between two reports reveals one person.
- Do not show the exact size of a suppressed group.
- Threshold checks are code and are tested; they are not left to the agent
  writing the report.

## What never goes to a model

Unless the binding explicitly allows it for a named purpose:

- direct identifiers: names, emails, phone numbers, ID numbers, addresses;
- record-level data with quasi-identifiers that together single someone out
  (small team plus role plus start date);
- free text that has not been screened for identifying details;
- any data the people were not told would be processed this way.

A model receives aggregates, pseudonymized records with quasi-identifiers
coarsened, or synthetic data.

## Free text

Text people wrote can identify them by content (names of colleagues, unique
events, writing style). Screen it before any model sees it, report themes
rather than quotes by default, and quote only with consent and after
removing identifying details.

## Testing

Tests and evaluations use synthetic data generated with a known answer, so
the analysis can be checked against the truth without using real people's
data. Real data in a test fixture is a defect.

## Logs and retention

Do not log record-level data or free text. Log identifiers of units of work,
not of people. Keep data only as long as the binding's retention rule
allows, and make deletion actually remove it, including derived copies.
