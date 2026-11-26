# Skill skeleton

Copy this into `<skill-name>/SKILL.md` and delete what does not apply. Open it
only when creating a new skill; the rules behind each part are in
[../SKILL.md](../SKILL.md).

````markdown
---
name: <skill-name>
description: <What the skill owns, the tasks that should open it, and the ones that should not.>
metadata:
  tree-code: <U.. | E.. | D.. | P..>
  depends-on: <parent-skill, other-parent>
---

# <Title>

## How to read this skill

Always in force: `<Section>` — <why it cannot be skipped>.

Conditional: `<Section>` — <checkable condition that opens it>;
`<Other section>` — <condition>. <Long material> is in
[references/<file>.md](references/<file>.md), opened when <condition>.

## <Section>

<Rules. State each rule once; link to a parent skill instead of restating it.>

## Contract

Role skills only.

- **Input:** <files by schema; what to do when one is missing or off-schema>.
- **Output:** <files by schema, with provenance>.
- **Does not:** <adjacent work it refuses; judging its own output; decisions
  that belong to a person>.
- **Escalate when:** <concrete conditions; format from agent-foundations>.
````
