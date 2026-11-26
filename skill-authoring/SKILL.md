---
name: skill-authoring
description: Write or change a skill in this skill tree - frontmatter and tree metadata, declared dependencies, the reading map, the contract of a role skill (input, output, does not, escalate), references/, and the universality rules that keep the shared layer free of any one project's subject matter. Use before creating, splitting, renaming or substantially editing a SKILL.md in this collection or in a project that builds on it.
metadata:
  tree-code: U0
---

# Skill Authoring

## How to read this skill

Always in force: `Layers` — it decides where a new rule belongs before a word
of it is written; `Universality rules` — the shared layer stays shared only if
every edit respects them; `Checking a skill` — a skill is not done until the
tree gate passes.

Conditional: `Frontmatter` and `Dependencies` — creating a skill or changing
what it builds on; `Reading map` — adding, renaming or removing a section;
`Role contract` — the skill is the instructions for one agent role in a
pipeline; `References` — a section has grown past what every task needs;
`Done` — declaring a skill ready. The skeleton to start from is
[references/template.md](references/template.md).

## Layers

Skills are split by who needs them, not by role:

| Layer | Holds | Lives in | Approved by |
| --- | --- | --- | --- |
| `U` universal | How agents work in any pipeline: roles, files, statuses, human decisions, evidence, sources, rights, languages, personal data, versions | this collection | the collection owner |
| `E` engineering | How the software around the pipeline is built: verification, architecture, implementation, review, QA, evals, orchestration, handoff, gates, retrieval | this collection | the collection owner |
| `D` domain | The subject matter of one project: its vocabulary, its quality rules, one skill per role | the consuming project | the project's domain expert |
| `P` binding | Who exactly decides what, where schemas and corpora live, which model serves which role, which version of this collection is pinned | the consuming project | the project owner |

A universal skill states a mechanism ("a human decision is recorded like
this, and an agent never performs it"). The binding says who that human is
and which decisions are theirs. The domain pack says what good work looks
like in that subject.

## Frontmatter

```yaml
---
name: <directory name, kebab-case>
description: <what the skill owns and when to use it; the trigger surface>
metadata:
  tree-code: <U0..Un | E0..En; unique in the tree>
  depends-on: <comma-separated skill names, omitted when none>
---
```

- `name` equals the directory name: discovering clients resolve the pair.
- `description` names the tasks that should open the skill and, where it
  helps, the ones that should not. Write it for matching, not for marketing.
- `metadata` is the only place for tree data. Clients that do not know the
  keys ignore them.

## Dependencies

- Declare a dependency only when the skill uses rules the parent owns. A
  dependency is a promise that the parent is read first, not a "see also".
- Do not restate a parent's rule; link to it by relative path and name the
  section, so there is one statement of each rule.
- The tree has no cycles. If two skills need each other, a third skill owns
  the shared part.
- Domain and binding skills may depend on universal ones; a universal skill
  never depends on a domain or binding skill.

## Reading map

Every skill opens with `## How to read this skill`. It sorts every other `##`
section into two groups:

- **Always in force** — sections that apply to every task the skill covers,
  each with the reason it cannot be skipped;
- **Conditional** — sections opened only when a named, checkable condition
  holds ("the diff adds a schema", not "when relevant").

The map is what lets a client with automatic discovery and an agent reading
the file directly apply the same subset. A section the map does not name is
unreachable, and the tree gate refuses it.

## Role contract

A skill that is the instructions for one agent role carries a `## Contract`
section with four parts:

- **Input** — which files it reads, by schema, and what it does when one is
  missing or off-schema;
- **Output** — which files it writes, by schema, with provenance;
- **Does not** — the adjacent work it must refuse, especially judging its own
  output and making decisions that belong to a person;
- **Escalate when** — the concrete conditions that stop the role and go to a
  person or the coordinator, in the format of
  [agent-foundations](../agent-foundations/SKILL.md) `Escalation`.

A role skill also has an evaluation set before it is called ready; see
[agent-evals](../agent-evals/SKILL.md).

## References

Move material into `references/` when only some tasks need it: long tables,
templates, worked examples, procedures behind a trigger. Every file in
`references/` is linked from its own skill with the condition for opening it.
An unlinked reference is a rule nobody can reach.

## Universality rules

1. **Forbidden vocabulary.** `SKILL.md` files in layers `U` and `E` contain no
   project or subject-matter vocabulary. The tree gate holds the word list. A
   domain example is allowed only in a `references/` file that opens with the
   marker `<!-- domain-example -->`.
2. **Second consumer.** A skill is written without domain words from the
   start, but it counts as proven universal only once a second project uses
   it unchanged. If a second project has to edit it, that is a defect in this
   collection: fix it here, never in the project's copy.
3. **Mechanism here, specifics in the binding.** A person's name, a path, a
   model or a threshold value appearing in a universal skill marks a place
   that belongs in the binding. Write the mechanism and say which binding
   field supplies the value.

## Checking a skill

Run the tree gate from the repository root after any edit:

```bash
node --test scripts/*.test.mjs && node scripts/check-skill-tree.mjs
```

It checks frontmatter, unique tree codes, that dependencies exist and form no
cycle, that the reading map classifies every section, that relative links
resolve, that no reference is orphaned, the forbidden vocabulary, and that
the plugin manifest lists exactly the skill directories. It cannot judge
whether a rule is right; that stays with review.

## Done

A skill is ready when:

- it follows the template: reading map, dependencies, and for a role skill
  the contract;
- long material sits in linked `references/`;
- a role skill has an evaluation set that has been run, with its baseline
  recorded;
- the tree gate passes;
- the owner of its layer approved it. Until then it is a draft, and it says
  so rather than reading as settled.
