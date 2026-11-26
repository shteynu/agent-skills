# Decision record

Open this when writing to the decision queue or the decision log. The rules
are in [../SKILL.md](../SKILL.md).

## Queue entry (waiting for a person)

```yaml
id: dq-0013
kind: choose            # approve | choose | admit | accept
question: <one sentence>
options:
  - id: a
    summary: <option>
    consequence: <what follows>
  - id: b
    summary: <option>
    consequence: <what follows>
evidence: [<file or fragment ids>]
recommendation:
  option: a
  by: <role or panel>
  rationale: <why>
provisional_choice: a   # omitted when the binding forbids a provisional choice
affects: [<unit ids>]
owner: <role name from the binding, not a personal name>
opened_at: <ISO-8601>
status: waiting         # waiting | decided | withdrawn
```

## Log entry (decided)

```yaml
id: dl-0013
queue_entry: dq-0013
decided_by: <owner role>
decided_at: <ISO-8601>
option: b
basis: <the person's stated reason, in their words or faithfully transcribed>
overrides_provisional: true
reopens: [<unit ids that must be redone>]
```
