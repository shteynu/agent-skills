---
name: architecture-decisions
description: The architect role - write an architecture decision record (context, options, decision, consequences) for the owner to approve, treat file schemas as the contract between roles, and change a schema as a new version with a consumer-first rollout. Use when a change crosses a boundary between components or roles, introduces or changes a schema or interface, or picks between technologies; not for local refactors.
metadata:
  tree-code: E1
  depends-on: verification
---

# Architecture Decisions

## How to read this skill

Always in force: `When a decision needs a record` — it decides whether this
skill applies at all; `Contract` — the role boundary. Conditional:
`Writing the record` — a record is needed; `Schemas as contracts` and
`Changing a schema` — the decision touches a file schema or an interface
between roles. The record skeleton is
[references/adr-template.md](references/adr-template.md), opened when
writing one.

## When a decision needs a record

Write a record when the decision:

- changes a boundary: between services, between pipeline roles, or between
  this system and an outside one;
- introduces or changes a schema, an interface or a persisted format;
- would be expensive to reverse, or picks between technologies;
- resolves a disagreement that would otherwise be reopened.

A local refactor, a bug fix inside one module, or a dependency patch does
not need a record.

## Writing the record

- **Context**: the forces, constraints and evidence, with links. State what
  is known and what is assumed.
- **Options**: at least two real ones, including "do nothing" when it is
  real, each with its cost.
- **Decision**: one option, in one paragraph, in terms an implementer can
  follow.
- **Consequences**: what becomes easier, what becomes harder, what must now
  be maintained, and what would make the decision wrong.
- **Status**: `proposed` until the owner approves it. Implementation that
  depends on a proposed record is provisional
  ([human-gates](../human-gates/SKILL.md)).
- A record is never edited after approval except to change its status; a
  changed decision is a new record that supersedes the old one.

## Schemas as contracts

The schema of a file exchanged between roles is the contract between them.
Each schema has a name, a version, an owner (the producing role), and a list
of consumers. Validation against the schema is code, run on both sides
([pipeline-artifacts](../pipeline-artifacts/SKILL.md)).

## Changing a schema

1. Publish the new schema version alongside the old one.
2. Update every consumer to accept both versions, and release that first.
3. Switch the producer to the new version.
4. Remove support for the old version only when no stored or in-flight file
   uses it.

A change that cannot be rolled out this way (a meaning changes, not only a
shape) needs its own record and a migration plan.

## Contract

- **Input:** the task from the owner, the current architecture documents and
  records, the code, and the schemas in force.
- **Output:** a record in `proposed` status; schema drafts; a short list of
  implementation steps an implementer can take one at a time.
- **Does not:** implement the decision, approve its own record, or change an
  approved record.
- **Escalate when:** the options differ in cost or risk the owner must weigh;
  the decision touches privacy, security, money or people; evidence for the
  context is missing or contradictory.
