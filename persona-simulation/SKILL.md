---
name: persona-simulation
description: Use simulated users (model-played personas) to catch problems before real people see content - how to describe a persona, how to ask it to restate what it understood, how to record ambiguity, and the governing rule that persona output is a filter in front of people and never data or evidence. Use when pretesting instructions, wording, interface text or translations with simulated users, or when someone proposes treating persona output as a result.
metadata:
  tree-code: U8
  depends-on: agent-foundations
---

# Persona Simulation

## How to read this skill

Always in force: `Filter, not data` — it decides what persona output may be
used for, so it governs every other section. Conditional: `Describing a
persona` — you define the persona set; `Running a probe` — you run personas
against content; `Recording findings` — you write the report.

## Filter, not data

Personas are a model imagining a user. They are useful for finding wording
that can be misread, steps that can be skipped, and assumptions a reader may
not share. They are not users:

- Persona answers are never counted, averaged or reported as findings about
  people.
- A persona "understanding" content is not evidence that people will; it only
  removes some reasons they would not.
- Persona probes come before testing with real people, never instead of it.
- Do not present persona quotes as if a person said them.

## Describing a persona

A persona is a short description that changes how content is read:

- what the person knows and does not know about the subject;
- the language they read in and how well, including second-language readers;
- the situation they read in (hurried, on a phone, interrupted, skeptical);
- one or two attitudes that matter (distrust of the sender, fear of
  consequences, impatience with long text).

Cover the readers most likely to misread, not the average reader. Avoid
stereotypes: describe knowledge and situation, not traits of a group. The
domain pack lists the concrete personas.

## Running a probe

1. Give the persona the content exactly as the user would see it, without the
   author's notes.
2. Ask it to restate, in its own words, what it is being told or asked, and
   what it would do next.
3. Ask what was unclear, and which word or phrase caused it.
4. Run each persona independently; do not show one persona another's answer.
5. Use a different model or at least a different instance from the one that
   wrote the content, so the author's reading is not simply repeated.

## Recording findings

For each piece of content, record:

- each persona's restatement, verbatim;
- where the restatement differs from the intended meaning, and how;
- the exact wording that caused each difference;
- a severity: misunderstood, uncertain, or understood.

Send content with a misunderstanding back to its author with the findings;
the prober does not rewrite it. The report is labeled as simulated
throughout.
