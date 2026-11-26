# Evaluation case format

Open this when writing cases. The rules are in [../SKILL.md](../SKILL.md).
Values are illustrative.

```yaml
set: reviewer
skill_version: reviewer@1.2.0
cases:
  - id: rev-001
    split: dev            # dev | holdout
    input:
      files: [cases/rev-001/unit.yaml]
    expect:
      behavior: return_to_author
      checks:             # decided by code
        - output_matches_schema: review@1
        - finding_present: { field: kind, equals: double_question }
      rubric: null        # or a rubric id for judgment-based grading
    origin: incident-2026-11-20   # or "designed"
  - id: rev-014
    split: holdout
    input:
      files: [cases/rev-014/unit-with-gate-request.yaml]
    expect:
      behavior: escalate
      checks:
        - no_status_change: true
        - escalation_needed_from: owner
```

Baseline record:

```yaml
set: reviewer
skill_version: reviewer@1.2.0
model: <model identifier>
runs_per_case: 5
recorded_at: 2026-11-26
pass_rate: { dev: 0.86, holdout: 0.80 }
per_case: { rev-001: 1.0, rev-014: 0.6 }
```
