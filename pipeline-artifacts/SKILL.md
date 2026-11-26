---
name: pipeline-artifacts
description: How roles in an agent pipeline exchange work as files - every file against a declared schema with provenance fields, statuses of a unit of work and the transitions allowed between them, how to read input and write output, and what to do with a file that does not match its schema. Use when a role reads or writes pipeline files, when a status changes, or when designing the file layout of a new pipeline.
metadata:
  tree-code: U2
  depends-on: agent-foundations
---

# Pipeline Artifacts

## How to read this skill

Always in force: `Unit of work` — every other rule is stated in terms of it;
`Provenance` — a file without it cannot be trusted or traced;
`Reading input` and `Writing output` — every role does both on every step.

Conditional: `Statuses and transitions` — your step changes a status, or you
are defining the status model; `Off-schema files` — a file fails validation
or has no schema; `Designing a layout` — a new pipeline or a new file type.
A filled example of the envelope is in
[references/envelope-example.md](references/envelope-example.md), opened when
writing the first file of a new type.

## Unit of work

The pipeline moves units of work: whatever one pass of the pipeline produces
and tracks individually. This skill does not know what a unit is; the domain
pack defines it. Every unit has a stable identifier that never changes and is
never reused, even after the unit is rejected.

## Provenance

Every file a role writes carries, next to its content:

| Field | Meaning |
| --- | --- |
| `id` | Identifier of the unit (or of the file, for collections) |
| `schema` | Schema name and version the file claims to follow |
| `produced_by` | Role name and the skill version that defined the role |
| `model` | Model identifier, when an agent produced it |
| `inputs` | Identifier and version of every file it was produced from |
| `produced_at` | ISO-8601 timestamp |
| `status` | Current status of the unit |
| `provisional` | `true` when any decision in its history is still waiting for a person |

`inputs` is what makes lineage reconstructable
([provenance-versioning](../provenance-versioning/SKILL.md)); never leave it
empty for a file that was derived from something.

## Statuses and transitions

- The pipeline declares a finite set of statuses and, for each allowed
  transition, which actor may perform it: a named role, code, or a person.
- An actor performs only the transitions assigned to it. Transitions that
  belong to a person are covered by [human-gates](../human-gates/SKILL.md).
- A transition is a recorded event (who, when, from, to, on what evidence),
  not just an overwritten field.
- Returning a unit to an earlier status for rework is a transition too, and
  it carries the reviewer's remarks. The actor that rejected the unit does not
  repair it; the unit goes back to the role that produced it.

## Reading input

1. Validate every input file against its declared schema before using it.
2. Check the input's status is one your role is allowed to start from.
3. Read the files themselves, not a summary passed in a prompt.
4. A missing input is a block, not an invitation to reconstruct it.

## Writing output

1. Write exactly the files your role skill's contract names, in their schema.
2. Fill every provenance field; never copy them from an input unchanged.
3. Validate your own output before handing it on. A role that emits an
   invalid file has failed its step, whatever the content.
4. Write to a new file or a new version; do not edit another role's output in
   place.

## Off-schema files

A file that fails validation is rejected, not repaired by the reader. Record
which file, which schema and the validator's message, return it to the
producing role, and continue with other units. A file with no declared schema
is a defect in the pipeline definition: escalate it.

## Designing a layout

- One schema per file type, versioned; schemas live in one directory the
  binding names.
- Changing a schema is an architecture decision with a consumer-first
  rollout; see [architecture-decisions](../architecture-decisions/SKILL.md).
- Keep human-readable formats (YAML, JSON, Markdown with frontmatter) so a
  person can audit a unit without tools.
