# Architecture decision record template

Open this when writing a record. The rules for each part are in
[../SKILL.md](../SKILL.md) `Writing the record`.

```markdown
# ADR-<number>: <decision in a few words>

- Status: proposed | approved | superseded by ADR-<n> | rejected
- Owner: <role from the binding>
- Date: <YYYY-MM-DD>
- Related: <records, issues, schemas>

## Context

<Forces, constraints and evidence, with links. Known versus assumed.>

## Options

### A. <name>
<How it works. Cost. Risks.>

### B. <name>
<How it works. Cost. Risks.>

## Decision

<One option, one paragraph, implementable.>

## Consequences

- Easier: <...>
- Harder: <...>
- Must now be maintained: <...>
- Would be wrong if: <observable condition>

## Open questions

<Points still undecided; the record stays proposed while any blocks the decision.>
```
