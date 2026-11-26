---
name: gate-management
description: Work on a repository's fitness gates - the scripts that turn a rule about the shape of the repository into a refusal (import boundaries, generated copies, forbidden literals, where skills live). Use when a gate has failed and the rule behind it must be understood, when a prose rule should become checkable, or when adding, changing, weakening or removing a gate or a generated artifact.
metadata:
  tree-code: E8
  depends-on: verification
---

# Gate Management

## How to read this skill

Always in force: `A red gate` — the most common way in, and where a rule is
most often lost by "fixing" the check; `What deserves a gate` — the line
between a test, a gate and prose. Conditional: `The shape of a gate` — you
write or edit a gate script; `Wiring a gate in` — you add, rename or remove
one; `Generated artifacts` — the task touches an editable source and its
generated copy; `Inventory` — you need to know which gate owns a rule.

Which checks to run for a diff is decided by
[verification](../verification/SKILL.md); this skill is about how a rule
becomes checkable.

## A red gate

1. Read the comment at the top of the gate script. It states the rule, often
   the incident behind it, and what the check cannot see. It beats any
   retelling.
2. Treat the violation as real until shown otherwise. The message names the
   file and the rule; find how the change broke it.
3. Weakening a check, adding an exemption, narrowing its scope or removing a
   step is a change to the rule, not a fix to the build. Do it only on
   purpose: update the gate's comment and its tests so the new rule is stated
   and checked from both sides.
4. Never change a gate's test to match current behavior to get green. The
   test is the record of the rule.
5. If the gates run as a chain that stops at the first failure, the steps
   after it did not run. Do not report them as passed.
6. If the gate really is wrong, state which behavior it must allow, add a
   test for that side, and change the check itself, not only its message.
7. A refusal right after an edit, from an editor or agent hook, is the same
   gate speaking earlier, not a second rule. Run the gate's own command to
   see it with its tests.

## What deserves a gate

- A rule inside one module, expressed through its API → an ordinary test.
- A rule about the shape of the repository — what may import what, where a
  literal may appear, which copy of a document is generated, where skills
  live — cannot be held by an ordinary test, because the violation arrives in
  a new file the test does not know. That is a gate.
- A source with a derived copy → a `--check` mode on the generator itself,
  not a second comparison script.
- A rule a machine cannot check (is this decision right, what does this
  paragraph mean) stays prose. Say so in the comment of any gate near it: a
  green gate must not read as proof of what it never checked.
- The sign that a gate is needed: the violation is silent. Tests pass, the
  build passes, review sees nothing, and the rule is already broken.

## The shape of a gate

- One script per subject, run from the repository root.
- A comment at the top: the rule, why it exists, and what it cannot see.
  Record only what actually happened; an invented incident is worse than
  none.
- Pure functions that take text or structures and return a list of
  violations; file reading and the exit code only in the entry point, so a
  test can import the functions.
- On failure: one line per violation naming the file, the rule and what to
  do instead, then a non-zero exit.
- On success: one line saying how much was checked. A silent pass looks the
  same as a check that read nothing.
- A paired test that exercises both sides: what is caught, what is
  legitimately allowed, and which blind spot is accepted. A check that has
  never failed on purpose is a check nobody understands.

## Wiring a gate in

1. Give it a command that runs its own test first, then the check.
2. Add it to the chain the project and CI run. A gate outside that chain is
   prose with an extra file.
3. Add it to the inventory, with what it refuses and where its rule is
   stated.
4. Name it where the rule is stated for agents (`AGENTS.md`, a skill, the
   verification matrix).
5. Renaming or removing a gate changes all of these in one change.

## Generated artifacts

- Exactly one copy is editable; the others are produced by a generator.
  Editing a generated file by hand is drift, not a change.
- The generator has a `--check` mode that rebuilds and compares, so
  "generated" and "checked" cannot disagree.

## Inventory

Keep a table of every gate: command, what it refuses, where the rule is
stated. Where possible a gate checks the table against the commands, so a
gate cannot exist without a row or a row without a gate. On any
disagreement, the script's own comment wins over the table.
