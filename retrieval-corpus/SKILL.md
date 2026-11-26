---
name: retrieval-corpus
description: The contract for a document corpus and search over it (RAG) that agents cite from - fragment identifiers as spans of normalized source text, the search / get / verify_quote / list_sources interface, deterministic results, cross-language search, fixed normalization, and a question set for measuring search quality. The project owner implements the search; agents implement only a stub and the contract tests. Use when an agent searches or cites the corpus, when writing the stub or contract tests, or when an implementation is being swapped in.
metadata:
  tree-code: E9
  depends-on: verification, evidence-citing
---

# Retrieval Corpus

## How to read this skill

Always in force: `Who builds what` — it decides whether you may write search
code at all; `Using the corpus` — every agent that searches or cites works
under it. Conditional: `Fragment identifiers`, `Interface` and
`Normalization` — you write the stub, the contract tests or a client of the
interface, with full types in [references/contract.md](references/contract.md);
`Quality set` — you measure or gate search quality; `Swapping
implementations` — the stub is being replaced.

## Who builds what

- The **project owner** implements the real search: storage, chunking,
  lexical and semantic retrieval, reranking. Those choices are not part of
  the contract.
- **Agents** write only: a stub that implements the same interface, the
  contract tests, and the quality set. Agents do not implement or tune the
  owner's search unless the owner asks.
- Roles depend on the interface, never on an implementation. Replacing the
  stub changes no role skill and no recorded citation.

## Using the corpus

- Search through the interface; cite exactly as
  [evidence-citing](../evidence-citing/SKILL.md) says, with the
  `fragment_id`, the copied quote and the `corpus_version` from the response.
- An unavailable corpus is a visible error. An answer "from model memory"
  instead of a search is forbidden.
- Record the queries you ran, so `not found` can be checked.

## Fragment identifiers

A fragment is a span of the normalized text of one version of one source:

```text
<source_id>@<version>:<start>-<end>
```

`version` is a prefix of the SHA-256 of the normalized text; `start`–`end`
is a half-open character range. Chunking is internal: any valid span of an
existing version resolves through `get`, whether or not the current chunker
produced it. A citation breaks only when the source text itself changes,
which is a new version, and old versions stay resolvable while stored.

## Interface

Four operations, every response carrying `corpus_version`:

- `search(query, filters, k)` → ranked hits with fragments. Same
  `corpus_version` and request give the same ordered list; ties break by
  `fragment_id`. A query in one language finds fragments in another.
- `get(fragment_id, context_chars)` → the fragment, optionally with context.
- `verify_quote(fragment_id, quote)` → `ok` or a reason. Pure function, no
  model: after normalization the quote lies wholly inside the span, meets
  the minimum length, has no internal ellipsis; case is kept.
- `list_sources(filters)` → the source registry.

Errors are typed (`invalid_request`, `unknown_fragment`, `version_gone`,
`corpus_version_mismatch`, `unavailable`).

## Normalization

Spans and quote checks depend on one fixed normalizer shared by every
implementation: Unicode NFC; remove soft hyphens and join words hyphenated
across lines; collapse whitespace; unify quotes, apostrophes and dashes;
strip Hebrew vowel points and direction marks; never change case. The
normalizer has a version, which is part of `corpus_version`, and a table of
input → output examples that every implementation passes.

## Quality set

Questions with expected evidence written as a source and a quote or page,
never as a fragment id, so the set survives re-chunking. Metrics: recall@k
and MRR. The gate is a drop from the recorded baseline
([agent-evals](../agent-evals/SKILL.md) `Baseline gate`), not an absolute
threshold.

## Swapping implementations

When the owner's implementation replaces the stub, QA runs the contract
tests, the normalization examples, the quality set, and `verify_quote` on
every citation already recorded. A recorded citation that no longer verifies
is a normalization defect in the new implementation, not a reason to rewrite
the citation.
