# agent-skills

Reusable, client-neutral Agent Skills for AI coding agents — Claude Code,
Codex, Gemini CLI and any client that can read a `SKILL.md` file directly.
Generalized from the working agent workflow of a production project
(shalomut-map-demo) and from the design of a multi-agent content pipeline,
so different repositories can share one discipline instead of re-inventing
it per project.

## The skill tree

Skills are split by who needs them. This repository holds the two shared
layers; a consuming project adds its own domain pack (`D`) and project
binding (`P`) on top. The rules for the layers, metadata and universality are
in [skill-authoring](skill-authoring/SKILL.md).

```text
U0  skill-authoring                 how to write a skill in this tree
U1  agent-foundations               baseline rules for any agent role
├── U2  pipeline-artifacts          files by schema, provenance, statuses
│   ├── U3  human-gates             decisions that belong to people
│   ├── U10 provenance-versioning   versions, lineage, immutability
│   └── E6  orchestration           coordinator as code, autonomous runs
├── U4  evidence-citing             verifiable citations from a corpus
│   └── U5  source-research         primary, legal, opened-vs-seen sources
├── U6  third-party-rights          licences, close paraphrase, rights questions
├── U7  multilingual-equivalence    TRAPD, Hebrew and Russian hazards
├── U8  persona-simulation          simulated users: a filter, never data
├── U9  personal-data-handling      minimization, thresholds, suppression
└── E0  verification                proportional checks, evidence format
    ├── E12 product-spec            role: spec with checkable criteria
    ├── E1  architecture-decisions  role: ADRs, schemas as contracts
    ├── E2  implementation          role: building to spec in small steps
    ├── E3  code-review             role: independent review, findings
    ├── E4  qa-testing              role: tests from spec, pipeline properties
    │   └── E5  agent-evals         role: eval sets, baseline-regression gate
    ├── E7  task-tracker            task files, handoff, Git safety
    │   └── E10 session-management  opening, briefing, checking sessions
    ├── E8  gate-management         fitness gates and their rules
    └── E9  retrieval-corpus        RAG contract (+ evidence-citing)

E11 development-factory             entry point of the E layer: intake,
                                    lines, roles E12 E1-E5 and where each
                                    runs, topology, skill gaps; runs the
                                    sessions through E10
```

`development-factory` sits above the tree rather than inside it: it depends
on the role skills and on `session-management`, and it is the first skill a
substantial development task opens.

Dependencies are declared in each skill's frontmatter under
`metadata.depends-on`; `metadata.tree-code` gives its place in the tree. A
purely engineering project needs only `U0`, `U1` and the `E` branch.

### Layer U — how agents work in a pipeline

| Skill | What it owns |
| --- | --- |
| [skill-authoring](skill-authoring/SKILL.md) | Layers, frontmatter and dependencies, the reading map, the role contract, references, universality rules, readiness. |
| [agent-foundations](agent-foundations/SKILL.md) | Stay in role, evidence before claims, never invent, work through files, report as it is, blocked means stop, escalation format. |
| [pipeline-artifacts](pipeline-artifacts/SKILL.md) | Abstract unit of work, provenance fields, statuses and who may move them, reading and writing files, off-schema files. |
| [human-gates](human-gates/SKILL.md) | Kinds of human decision, the no-agent rule, decision packets, the decision log and queue and their ids across parallel branches, provisional decisions in autonomous runs. |
| [evidence-citing](evidence-citing/SKILL.md) | Citation as fragment id plus verbatim quote, `not found` instead of the nearest passage, V / C / K codes, code-checked quotes. |
| [source-research](source-research/SKILL.md) | Primary before secondary, legal access only, opened versus seen, recording sources, paywalls, re-verification. |
| [third-party-rights](third-party-rights/SKILL.md) | Licence types and their traps, finding the terms, close paraphrase, the rights question for a person. |
| [multilingual-equivalence](multilingual-equivalence/SKILL.md) | Equivalence, TRAPD, parallel translation, reconciliation, documentation; Hebrew and Russian notes. |
| [persona-simulation](persona-simulation/SKILL.md) | Simulated users as a filter before people, describing personas, running probes, recording findings. |
| [personal-data-handling](personal-data-handling/SKILL.md) | Minimum collection, aggregates, publication threshold and complementary suppression, what never goes to a model, synthetic test data. |
| [provenance-versioning](provenance-versioning/SKILL.md) | Immutability of published versions, numbering, lineage both ways, change log, deprecation. |

### Layer E — how the software around it is built

| Skill | What it owns |
| --- | --- |
| [verification](verification/SKILL.md) | Proof discipline: choose checks proportional to the diff, run them, and record passed / failed / blocked / not-run evidence without unverified claims. |
| [architecture-decisions](architecture-decisions/SKILL.md) | When a decision needs a record, writing ADRs, schemas as contracts, consumer-first schema changes. |
| [implementation](implementation/SKILL.md) | Building to spec in small verifiable steps, what to do when the spec is silent or wrong, scope. |
| [code-review](code-review/SKILL.md) | Independent review: what to check, verifying claims by running them, findings with failure scenarios. |
| [qa-testing](qa-testing/SKILL.md) | Tests from the spec, mandatory pipeline properties, negative tests, determinism, end-to-end smoke. |
| [agent-evals](agent-evals/SKILL.md) | Eval sets per role, grading by code then rubric then people, variance, held-out cases, baseline-regression gate. |
| [orchestration](orchestration/SKILL.md) | The coordinator as code, visible failure, retries and idempotency, budgets, resuming, autonomous runs. |
| [task-tracker](task-tracker/SKILL.md) | Work continuity: branch-scoped task files, session start/resume, saving progress, handoffs and their visibility boundaries, parallel-agent Git safety, escalation. |
| [session-management](session-management/SKILL.md) | The coordinating session as manager of worker sessions: the run register, client capabilities and fallbacks, when to open or keep a session, choosing a worker (context, isolation, model and effort from the binding) and briefing it, one writer per worktree, reports as claims, silent or crashed workers, continue/replace/stop, integrating lines, run limits and closing, replacing the manager, relaying the owner, permission blocks; templates for the register, brief and report; client profiles for the Claude desktop app and the Claude Code CLI. |
| [product-spec](product-spec/SKILL.md) | The product role: a spec for others to build and test against, scope and non-goals, numbered acceptance criteria each with its check, open questions instead of invented requirements, approval and versions. |
| [development-factory](development-factory/SKILL.md) | The manager of a development factory and entry point of the E layer: intake that sends small tasks straight back, lines of work, the chain of roles for each kind of line (product, architect, implementer, reviewer, QA, evals) and where each role runs, with a fresh context and on the model and effort the binding names, choosing the topology (this session, subagents, parallel sessions, chain of phases), staffing lines with skills, skill gaps (fix, extend, new, propose shared), the retrospective; the run plan, gap log and an evaluation set for its own decisions. |
| [gate-management](gate-management/SKILL.md) | Red gates, what deserves a gate, the shape of a gate, wiring, generated artifacts, the inventory. |
| [retrieval-corpus](retrieval-corpus/SKILL.md) | The RAG contract: who builds what, span-based fragment ids, `search` / `get` / `verify_quote` / `list_sources`, normalization, quality set. The owner implements the search. |

Skills without an evaluation set are drafts by the tree's own rule. Of the
role skills here, `E1`, `E2` and `E4` have no set yet, and `E3`, `E11` and
`E12` have a run baseline; none has had its second consumer. Of the
universal skills, `U3` (`human-gates`) has a run baseline.

Each skill opens with a `How to read this skill` section: which sections are
always in force and which are opened only when a named condition holds. That
map decides how much of a skill a task needs, so a client with automatic
skill discovery and a client reading the file directly end up applying the
same rules.

## Using these skills in a project

### Option A — Git submodule (recommended)

Keeps the skills updatable and pins an exact commit:

```bash
git submodule add https://github.com/shteynu/agent-skills .agents/skills/shared
```

### Option B — Claude Code plugin

This repository is also a Claude Code plugin marketplace (`shteynu`) that
lists one plugin, `agent-skills`, carrying every skill in the tree. Nothing is copied
into the project, and a project that does not need the skills does not load
them.

```bash
claude plugin marketplace add shteynu/agent-skills
claude plugin install agent-skills@shteynu
```

Inside a session, the same is `/plugin marketplace add shteynu/agent-skills`
followed by `/plugin install agent-skills@shteynu`. Install into a single
project with `--scope project`, which records the plugin in that project's
`.claude/settings.json` so everyone who trusts the folder gets it.

The skills then appear as `agent-skills:<skill-name>`, for example
`agent-skills:task-tracker` or `agent-skills:human-gates`. The namespace also
keeps `agent-skills:code-review` apart from a client's built-in
`code-review`. Wire the routing below with those names instead of file paths.

- **Updates.** `plugin.json` carries no `version` on purpose, so an install
  tracks this repository's commits. Pull them with
  `claude plugin update agent-skills@shteynu`, or turn on auto-update for the
  marketplace under **Marketplaces** in `/plugin`.
- **Access.** This repository is public, so the plugin install, a
  submodule clone and a consumer's CI need no credentials. A private fork
  does: Claude Code clones with the machine's own git credentials and never
  prompts (a GitHub SSH key loaded in `ssh-agent`, or `gh auth login`
  followed by `gh auth setup-git` for HTTPS), and CI needs a read token.
- **Claude Code only.** Codex, Gemini CLI and other clients do not read
  Claude Code plugins; give them Option A or C.

### Option C — copy

Copy a skill directory into the project's skills directory. A copy is a fork
that drifts silently, so record the source repository and commit next to the
copy, and prefer Option A or B when the project tolerates them. Copy a
skill's dependencies with it (`metadata.depends-on`); its relative links
assume they sit beside it. Copied into `.claude/skills/`, `code-review` would
share its name with Claude Code's built-in skill; rename the copy or use
Option B.

### Wire the routing

Add routing to the project's root `AGENTS.md` (and `CLAUDE.md` when the
client needs it), for example:

```markdown
- Starting, continuing or resuming work, reporting status, saving progress,
  or preparing a handoff → `.agents/skills/shared/task-tracker/SKILL.md`.
- Verifying changes, proving a fix, checking merge readiness, or recording
  verification evidence → `.agents/skills/shared/verification/SKILL.md`.
- Any agent role in a pipeline → `.agents/skills/shared/agent-foundations/SKILL.md`
  first, then the role's own skill.
- A step that ends in a decision a person owns →
  `.agents/skills/shared/human-gates/SKILL.md`.
```

Route only the skills the project uses. With the plugin (Option B), name the
skills instead of the paths, for example `agent-skills:task-tracker`.

### Add the project layers

A project that runs an agent pipeline adds, in its own `.agents/skills/`:

- a **domain pack** (`D` codes): its vocabulary and one skill per role, each
  depending on the universal skills it uses;
- a **binding** (`P` code): who owns which human decision, paths to schemas,
  corpus and catalog, models per role, thresholds such as the minimum group
  size, and the pinned commit of this repository.

If a project has to edit a skill from this repository to use it, that is a
defect here: fix it upstream rather than in the project's copy.

### Declare the project profile

The skills work out of the box with their defaults (task files under
`docs/agent-tasks/active/`, and so on). When a project's layout or stack
differs, the project declares overrides in its own `AGENTS.md`: see
`Project profile` in [task-tracker/SKILL.md](task-tracker/SKILL.md) and
`Project matrix` in [verification/SKILL.md](verification/SKILL.md). The
skills name document *roles*; the project maps roles to files.

## Design rules for skills in this repo

- One skill is one directory with a `SKILL.md` whose frontmatter `name`
  matches the directory name; supporting files live in `references/` beside
  it and are linked from the skill.
- Every skill classifies all of its sections in `How to read this skill`.
- Skills stay project-agnostic. Concrete commands, product invariants and
  document names belong to the consuming project, which a skill reads through
  its declared profile — never hard-coded here.
- Every skill declares `metadata.tree-code` and, when it builds on others,
  `metadata.depends-on`. The full rules are in
  [skill-authoring](skill-authoring/SKILL.md).

## Checking the tree

```bash
node --test scripts/*.test.mjs && node scripts/check-skill-tree.mjs
```

[`scripts/check-skill-tree.mjs`](scripts/check-skill-tree.mjs) checks
frontmatter and unique tree codes, that dependencies exist and form no
cycle, that every section is in the reading map, that relative links resolve
and no reference is orphaned, that `U` and `E` skills carry no domain
vocabulary, and that `.claude-plugin/plugin.json` lists exactly the skill
directories. CI runs the same command.

## License

[MIT](LICENSE).
