# Envelope example

Open this when writing the first file of a new type. Field meanings are in
[../SKILL.md](../SKILL.md) `Provenance`. Values are illustrative.

```yaml
id: unit-0042
schema: draft@2
produced_by:
  role: writer-a
  skill: writer@1.3.0
model: <model identifier>
inputs:
  - id: spec-0007
    version: 3
produced_at: 2026-11-26T10:15:00Z
status: drafted
provisional: true
transitions:
  - from: null
    to: drafted
    by: writer-a
    at: 2026-11-26T10:15:00Z
    evidence: [spec-0007@3]
content:
  # the schema-specific body
```
