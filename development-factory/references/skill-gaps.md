# Format: the gap log and a skill proposal

Open this when a gap signal fires or at a retrospective. The rules are in
[../SKILL.md](../SKILL.md) `Skill gaps`.

## The gap log

One file per project, kept across runs, so that a signal seen once in each
of two runs still counts twice. The binding names its path; when it names
none, use `<task directory>/skill-gaps.md`. Any session may add evidence to
an open gap in its own branch; the factory opens, decides and closes gaps.

```markdown
# Skill gaps

| Gap | Signal | Area | Evidence | Count | State | Action |
| --- | --- | --- | --- | --- | --- | --- |
| G1 | repeated finding | <area> | <commit or file>, <commit or file> | 2 | open | extend <skill> |
| G2 | no skill covers line | <area> | run <id> L3 | 1 | watching | none yet |
```

- **Signal** is one of: `no skill covers line`, `role without contract`,
  `role without eval set`, `repeated finding`, `repeated block`,
  `repeated rework`, `repeated brief text`, `rule outside skills`.
- **State** is one of: `watching` (below the count), `open`, `proposed`,
  `accepted`, `rejected`, `closed`.
- **Evidence** points to files and commits. A gap without evidence is not
  recorded.

## A skill proposal

The factory writes a proposal before a worker writes the skill:

```markdown
### Proposal for G1: <fix | extend | new> <skill name>

- Layer: <domain | binding | universal | engineering>, by skill-authoring
  `Layers`: <one sentence why>.
- Why not the cheaper action: <for new: which skills were checked and why
  none owns the area>.
- The rule, in one paragraph.
- Evidence: <gap log entries>.
- Evaluation: <existing set to rerun, or the new cases to write>.
- Accepting it: <the owner of the layer, from the binding>; provisional use
  <allowed by the binding | not allowed>.
- Does not: widen a permission, loosen a gate, or move a human decision.
```

A proposal for a shared skill goes to this collection's repository as a
pull request; the project records the link in the gap's `Action`.
