---
name: provenance-versioning
description: Versions and lineage of units of work in a pipeline - version numbering, lineage from inputs to outputs, a change log, immutability of anything published, and introducing a new version instead of editing an old one. Use when publishing, revising, deprecating or tracing a unit of work, or when designing a catalog that keeps versions.
metadata:
  tree-code: U10
  depends-on: pipeline-artifacts
---

# Provenance and Versioning

## How to read this skill

Always in force: `Published is immutable` — breaking it breaks every
reference to the unit. Conditional: `Versions` — you create or number a
version; `Lineage` — you need to know what a unit came from or what depends
on it; `Change log` — a version is published or deprecated; `Deprecation` — a
version should stop being used.

## Published is immutable

Once a version is published — handed to anyone outside the pipeline, used to
produce results, or referenced by another published unit — its content never
changes. Any correction, however small, is a new version. Fixing a typo in
place silently changes what every earlier result was based on.

## Versions

- Each unit has a stable identifier and a version; `<id>@<version>` names
  exactly one content.
- Drafts may change freely; the first published version is `1`.
- Where consumers need to know whether a change can break them, use
  `major.minor.patch`: patch for corrections that do not change meaning,
  minor for additions that keep old uses valid, major for changes in meaning.
  The binding chooses the scheme per unit type.
- A content hash next to the version detects accidental edits.

## Lineage

- Every version records its inputs by `<id>@<version>`
  ([pipeline-artifacts](../pipeline-artifacts/SKILL.md) `Provenance`).
- Lineage is read in both directions: "what is this made from" for audit,
  "what is made from this" for impact when a version is rejected or
  corrected.
- Keep lineage queryable by code, not only readable by people.

## Change log

Each published version adds an entry: version, date, who approved it, what
changed, why, and whether earlier results need to be revisited. Write the
reason, not only the diff.

## Deprecation

A version that should no longer be used is marked deprecated with the
reason and its replacement. It is kept and still resolves, because earlier
results reference it. Deletion is for drafts and for content that must be
removed for legal or privacy reasons; the removal itself is logged.
