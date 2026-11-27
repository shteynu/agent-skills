---
name: human-gates
description: Decisions that belong to people in an agent pipeline - the kinds of human decision, the rule that an agent never performs a person's transition even when a tool allows it, how to prepare a decision packet, how a decision is recorded, and how autonomous runs defer decisions to a queue as provisional instead of faking them. Use when a step reaches a human decision, when preparing work for review, or when running unattended.
metadata:
  tree-code: U3
  depends-on: pipeline-artifacts
---

# Human Gates

## How to read this skill

Always in force: `The rule` — it is the reason this skill exists;
`Kinds of decision` — you need it to recognize a gate when you reach one;
`Provisional is not verified` — it governs every report you write.

Conditional: `Preparing a decision` — your step ends at a human gate;
`Recording a decision` — a person has answered; `Identifiers` — you add an
entry to the decision queue or the decision log; `Deferred decisions` — the run
is autonomous and a gate is reached with nobody present; `Rejection` — a
person rejected an earlier decision. The record format is in
[references/decision-record.md](references/decision-record.md), opened when
writing to the decision log or queue.

## The rule

A transition the project binding assigns to a person is performed by that
person. An agent never performs it, never marks it as performed and never
words a report as if it were — even when the file is writable, the tool has
the permission, or the person said earlier that something similar was fine.
Approval for one decision does not extend to the next.

## Kinds of decision

| Kind | What the person does | Example of what the agent prepares |
| --- | --- | --- |
| Approve | Accepts or rejects one proposal | The proposal, its evidence, known weaknesses |
| Choose | Picks one of several options | The options side by side, the trade-off of each, a recommendation marked as such |
| Admit | Lets work proceed to a stage that affects real people, money or the outside world | What will happen, to whom, what can be undone |
| Accept | Declares a result final against criteria fixed in advance | The criteria, the measured result, every deviation |

The binding lists the concrete decisions and who owns each. This skill only
defines the mechanism.

## Preparing a decision

Put in front of the person everything needed to decide without opening other
files, and nothing that decides for them:

1. The question in one sentence.
2. The options, each with its consequence.
3. The evidence, with citations; contrary evidence included.
4. What the agents recommend and why, labeled as a recommendation.
5. What depends on the answer, so the cost of each option is visible.

## Recording a decision

A decision is recorded in the decision log by the person or from their own
words: who decided, when, which option, on what basis, and which units it
applies to. The unit's transition then cites the log entry. An agent may
transcribe a person's answer; it never infers one.

## Identifiers

Units, other entries and reports cite queue and log entries by id, so an id
names one entry for good, across every branch of the repository.

- Before taking an id, fetch, read the highest id in that file on every
  branch that adds entries, local and pushed, parallel lines included, and
  take the next one above all of them. The next free number in your own copy is not
  enough: a parallel line may already hold it.
- Where lines add entries at the same time, the binding may give each line
  its own range or prefix instead; a line then takes ids only from its own.
- An id is never reused, even after its entry is withdrawn.
- Before two lines are merged, check that no id stands for different entries
  on the two sides. The same entry on both sides, because one line took in
  the other, is not a collision. A collision is fixed on the side that is not
  yet in the main line, whichever way the merge runs: its entry takes a new
  id, and every reference to it on that side changes in the same commit. An id already merged into the main line,
  or cited from another line, is never renumbered.

## Deferred decisions

In an unattended run a gate does not stop the pipeline:

- Where the binding allows it, agents make a **provisional** decision with
  its rationale and continue. The decision goes to the **decision queue**
  marked as waiting for a person, and every unit that depends on it carries
  `provisional: true`.
- Where the binding does not allow a provisional decision (typically `Admit`),
  the dependent work waits; independent work continues.
- Choices that cannot be derived from evidence are not invented; they are
  taken from earlier recorded work and marked provisional, or left open.

## Provisional is not verified

Nothing provisional is presented as decided, in files or in reports. A
summary states separately what is verified, what is provisional and what is
blocked. A panel of agents agreeing makes a decision better prepared, not
less provisional, until the binding says the panel has been calibrated
against a person.

## Rejection

When a person rejects a provisional decision, every unit derived from it is
reopened and redone from that point. The lineage in
[pipeline-artifacts](../pipeline-artifacts/SKILL.md) `Provenance` is what
finds them; do not patch the downstream units by hand.
