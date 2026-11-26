---
name: multilingual-equivalence
description: Produce content in several languages that means the same thing - the TRAPD process (translation, review, adjudication, pretesting, documentation), independent parallel translations, what equivalence means beyond word-for-word, and language-specific hazards for Hebrew (grammatical gender in address and verbs, right-to-left and mixed-direction text) and Russian (one consistent formal or informal "you", case agreement in templates). Use for translating or localizing any content where meaning must survive, and for reviewing translations.
metadata:
  tree-code: U7
  depends-on: agent-foundations
---

# Multilingual Equivalence

## How to read this skill

Always in force: `Equivalence` — it defines what a translation is judged
against; `TRAPD` — the order of steps and who does each. Conditional:
`Parallel translation` — you are a translator; `Reconciliation` — you compare
translations; `Documentation` — you close a unit; `Language notes` — the
target is Hebrew or Russian, details in
[references/language-notes.md](references/language-notes.md).

## Equivalence

A translation is equivalent when a reader of the target language
understands the same thing, at the same difficulty, with the same tone, as a
reader of the source. That covers:

- **meaning** — the same claim, request or question;
- **concept** — the idea exists and is understood the same way in the target
  culture; if not, it is flagged, not forced;
- **form** — fixed elements (answer options, units, time frames, placeholders)
  keep their function;
- **register** — the same formality and directness.

Word-for-word fidelity is not the goal; a literal translation that reads
oddly is a defect.

## TRAPD

| Step | Who | Output |
| --- | --- | --- |
| **T**ranslation | Two or more translators, independently | Parallel versions |
| **R**eview | A reconciler who sees all versions | Differences, a proposed compromise, open points |
| **A**djudication | The decision owner from the binding (a panel provisionally, or a person) | The chosen version |
| **P**retesting | People of the target language, or simulated users as a filter first | Problems of understanding |
| **D**ocumentation | The keeper of the unit | Every choice and its reason, kept with the unit |

The reconciler proposes; it does not choose. The choice is a human gate
([human-gates](../human-gates/SKILL.md)).

## Parallel translation

- Translators work from the source and its notes, never from each other's
  versions.
- Translate meaning, and write a short note for every place where you made a
  non-obvious choice.
- Do not "fix" the source silently. If the source is ambiguous, translate both
  readings or flag it.
- Keep placeholders, markup and fixed answer options intact and in the order
  the target language needs.

## Reconciliation

For each unit, list every difference between the versions as one of:
wording only, meaning, register, form. For meaning differences, say which
version matches the source and why. Propose one version with its reasoning,
and list what the adjudicator must decide.

## Documentation

Keep with the unit: source version, every translation, the reconciliation
notes, the decision record, pretest findings, and the final text. A later
reader must be able to tell why the final wording was chosen.

## Language notes

Hebrew and Russian hazards — gendered address and verbs, direction of mixed
text, numerals and punctuation in right-to-left lines, formal versus informal
address, case agreement in templates — are in
[references/language-notes.md](references/language-notes.md). Open it
whenever either language is a target.
