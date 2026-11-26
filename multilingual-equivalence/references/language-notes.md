# Language notes

Open this when Hebrew or Russian is a target language. The process rules are
in [../SKILL.md](../SKILL.md).

## Hebrew

- **Gender in address.** Second-person pronouns, verbs and adjectives agree
  with the reader's gender. Choose one strategy per product and apply it
  everywhere: plural address, infinitive or impersonal forms, paired forms
  (`/ה`, `/ת`), or separate gendered versions. Mixing strategies within one
  text reads as an error.
- **Gender in content.** Nouns for people and roles are gendered; a
  masculine default excludes some readers. Note the choice made.
- **Direction.** Text runs right to left; numbers, Latin-script words, URLs
  and code run left to right inside it. Test rendering of every mixed line.
  Punctuation at the end of a line with a left-to-right segment can jump to
  the wrong side; directional marks (LRM, RLM) or isolation in markup fix it.
- **Numerals and dates.** Western digits are standard. Dates are day, month,
  year. Hebrew-calendar dates are a separate choice.
- **Vowel points.** Normal text has no vowel points; use them only to
  disambiguate a word that would otherwise be misread, and note it.
- **Length.** Hebrew text is usually shorter than English; Russian is
  usually longer. Leave room in fixed layouts.

## Russian

- **One "you".** Choose formal `вы` or informal `ты` for the whole product
  and keep it, including in buttons, errors and emails. Capitalized `Вы` is
  for letters to one person, not interface text.
- **Case and number in templates.** A placeholder followed or preceded by a
  word must agree with it: counts need three plural forms (1, 2–4, 5+, with
  11–14 as exceptions), and names inserted into sentences change case. Prefer
  sentence structures where the placeholder stands alone (`Участников: 5`).
- **Gender agreement.** Past-tense verbs agree with the subject's gender;
  avoid past tense about the reader, or use neutral constructions.
- **Quotes and dashes.** Use `«»` for quotes and an em dash with spaces
  for a dash. Normalizers may unify these; the displayed text should not.
- **Loanwords.** Prefer the established Russian term over a transliteration
  when one exists and readers know it.

## Both

- Read the final text aloud in the target language. If it does not sound like
  something a native speaker would write, it is not done.
- Pretest with native speakers of the variety the users actually speak, for
  example people for whom Russian is a first language but who live in a
  Hebrew-speaking country.
