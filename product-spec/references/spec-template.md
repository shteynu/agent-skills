# Template: a specification

Open this when writing a spec. The rules are in [../SKILL.md](../SKILL.md).
The project's binding names where specs live; when it names none, keep the
spec next to the line's task file as `<task directory>/<branch>.spec.md`.

```markdown
# Spec: <title>

- Version: 1
- Status: draft            # draft | approved | approved-provisional
- Approved by: <person, date, decision-log id>
- Line: <line id and branch>
- Sources: <the request, decisions, documents this spec traces to>

## Problem

<Who has the problem, what happens now, why it matters. Two to five
sentences.>

## In scope

- <behaviour that changes>

## Non-goals

- <nearest thing this does not change>

## Acceptance criteria

1. Given <state>, when <action>, then <observable result>.
   Check: <test to write | command | manual step and expected result>.
2. Given <invalid input>, when <action>, then <error the user sees>.
   Check: <negative test>.

## Expected areas

- <directories or components, as a hint for splitting lines>

## Open questions

| # | Question | Options and what each changes | Blocks criteria | Waiting for |
| --- | --- | --- | --- | --- |

## Versions

- 1 (<date>): first version.
```
