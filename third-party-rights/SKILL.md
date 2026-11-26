---
name: third-party-rights
description: Decide whether third-party content may be used and on what terms - recognize licence types (open government licences, Creative Commons BY / SA / NC / ND, free for noncommercial or research use only, commercial agreement, no stated licence), find the actual terms, tell an informal permission from a licence, recognize a close paraphrase, and prepare the question for a person instead of issuing a legal conclusion. Use before reusing, adapting, translating or shipping text, data, images or instruments someone else wrote.
metadata:
  tree-code: U6
  depends-on: agent-foundations
---

# Third-Party Rights

## How to read this skill

Always in force: `Not a legal opinion` — it bounds everything else here;
`Default` — the starting assumption for any content. Conditional:
`Licence types` — you have found the terms and must classify them;
`Finding the terms` — you have not found them yet; `Close paraphrase` — new
content is being written next to existing protected content;
`The question for a person` — use depends on terms you cannot settle.

## Not a legal opinion

This skill prepares a question; it does not answer it. The output is a
classified record of the terms with citations and the specific doubt, for a
person the binding names. Never write "this is allowed" as a conclusion
about law.

## Default

Content with no stated licence is all rights reserved. Being publicly
viewable, being free to download, or being widely copied grants nothing.

## Licence types

| Terms | What usually follows | Typical trap |
| --- | --- | --- |
| Public domain, CC0 | Free use | Confirm it is the work itself, not a new edition with its own rights |
| Open government licence | Free use with attribution | Excludes logos, personal data and third-party material inside |
| CC BY / BY-SA | Use and adapt with attribution; SA requires the same licence on adaptations | SA can conflict with your own licence |
| CC BY-NC | No commercial use | Charging users, or use inside a paid product, is commercial |
| CC BY-ND | No adaptations | Translation and shortening are adaptations |
| "Free for research / educational use" | Only that use | A pilot may fit; a paid deployment usually does not |
| Commercial licence or agreement | Only what the contract says | Terms per seat, per use or per deployment |
| Informal permission (an email, a forum answer) | Evidence of willingness, not a licence | Ask for written terms that name the use |

## Finding the terms

Look, in order, at: the work itself (front matter, footer, a licence file),
the publisher's or author's terms page, the repository record, and the
rights holder's contact page. Record the URL and the exact wording of the
terms with [evidence-citing](../evidence-citing/SKILL.md). Terms in a
secondary source are a lead, not the terms.

## Close paraphrase

Rewording protected text sentence by sentence, keeping its structure and
selection, can still copy it. When writing new content in the same area:

- do not work from the protected text open beside you;
- compare the result against known protected texts with code, and flag
  matches and near-matches for review;
- record what was checked against.

## The question for a person

```text
Rights question:
- Content: <what, which version, where it would be used>
- Terms found: <verbatim, with URL>
- Classification: <licence type>
- Intended use: <exactly what we plan to do, including whether money changes hands>
- Doubt: <the specific point that is unclear>
- Options: <ask for permission | replace | drop | use within the stated terms only>
```

A request to the rights holder is drafted for the person to send; an agent
does not send it.
