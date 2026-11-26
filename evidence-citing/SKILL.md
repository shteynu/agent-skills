---
name: evidence-citing
description: Rules for an agent citing a corpus - a citation is a fragment identifier plus verbatim text that code can find, source verification codes V / C / K, what to write when no support exists, and how cited claims are checked before they move on. Use whenever an output makes a claim that should rest on a document, and before handing on any file that contains citations.
metadata:
  tree-code: U4
  depends-on: agent-foundations
---

# Evidence Citing

## How to read this skill

Always in force: `What a citation is`, `Writing a citation` and `When there
is no support` — every cited claim is made under all three.

Conditional: `Verification codes` — you record or filter by how a source was
checked; `Checking citations` — you validate or hand on a file with
citations. The search interface itself belongs to
[retrieval-corpus](../retrieval-corpus/SKILL.md); this skill holds only the
agent's rules.

## What a citation is

A citation is two things together:

1. a **fragment identifier** the corpus can resolve, and
2. a **verbatim quote** that code finds inside that fragment after the
   corpus's fixed normalization.

A paraphrase is not a citation. A source title or URL alone is not a
citation. A quote that is "close" to the source is a failed citation.

## Writing a citation

```yaml
claim: <the statement in your output>
citations:
  - fragment_id: <id returned by the corpus>
    quote: <copied text, not retyped from memory>
    corpus_version: <version the corpus reported>
```

- Copy the quote from the fragment text the corpus returned. Never
  reconstruct it from memory or from a summary.
- Quote the shortest passage that carries the claim, no shorter than the
  corpus's minimum length. No ellipses inside a quote: cite two quotes
  instead.
- One claim, its own citations. Do not attach a citation to a paragraph and
  let it cover several claims.
- A claim you make by inference from cited material is labeled as inference,
  with the citations it rests on.

## When there is no support

If you cannot find a fragment that supports a claim, write `not found` with
the queries you ran, and drop or weaken the claim. Never pick the nearest
similar passage and present it as support. Never cite from model memory: if
the corpus is unavailable, that is a block
([agent-foundations](../agent-foundations/SKILL.md) `Blocked means stop`).

## Verification codes

Each source in the corpus carries how its text was checked:

| Code | Meaning |
| --- | --- |
| `V` | The source itself was opened and the text read from it |
| `C` | Reached through an index or secondary record that points to the source; the source itself not opened |
| `K` | A standard reference cited from common knowledge; not re-checked |

A claim that matters to a decision should rest on `V` sources. Report the
weakest code among a claim's citations next to the claim when it is not `V`.

## Checking citations

Before a file with citations moves to the next role, code calls the corpus's
quote check for every citation. A file with any failing citation is returned
to its author; it is not passed to a reviewer or a person. The check is
deterministic string matching, never a model's judgment of similarity.
