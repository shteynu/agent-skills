# agent-skills

Reusable, client-neutral Agent Skills for AI coding agents — Claude Code,
Codex, Gemini CLI and any client that can read a `SKILL.md` file directly.
Generalized from the working agent workflow of a production project
(shalomut-map-demo) so different repositories can share one discipline for
session continuity and verification instead of re-inventing it per project.

## Skills

| Skill | What it owns |
| --- | --- |
| [task-tracker](task-tracker/SKILL.md) | Work continuity: branch-scoped task files, session start/resume, saving progress, handoffs and their visibility boundaries, parallel-agent Git safety, escalation. |
| [verification](verification/SKILL.md) | Proof discipline: choose checks proportional to the diff, run them, and record passed / failed / blocked / not-run evidence without unverified claims. |

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
lists one plugin, `agent-skills`, carrying both skills. Nothing is copied
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

The skills then appear as `agent-skills:task-tracker` and
`agent-skills:verification`. Wire the routing below with those names instead
of file paths.

- **Updates.** `plugin.json` carries no `version` on purpose, so an install
  tracks this repository's commits. Pull them with
  `claude plugin update agent-skills@shteynu`, or turn on auto-update for the
  marketplace under **Marketplaces** in `/plugin`.
- **Private repository.** Claude Code clones with the machine's own git
  credentials and never prompts: a GitHub SSH key loaded in `ssh-agent`, or
  `gh auth login` followed by `gh auth setup-git` for HTTPS.
- **Claude Code only.** Codex, Gemini CLI and other clients do not read
  Claude Code plugins; give them Option A or C.

### Option C — copy

Copy a skill directory into the project's skills directory. A copy is a fork
that drifts silently, so record the source repository and commit next to the
copy, and prefer Option A or B when the project tolerates them.

### Wire the routing

Add routing to the project's root `AGENTS.md` (and `CLAUDE.md` when the
client needs it), for example:

```markdown
- Starting, continuing or resuming work, reporting status, saving progress,
  or preparing a handoff → `.agents/skills/shared/task-tracker/SKILL.md`.
- Verifying changes, proving a fix, checking merge readiness, or recording
  verification evidence → `.agents/skills/shared/verification/SKILL.md`.
```

With the plugin (Option B), name the skills instead of the paths:
`agent-skills:task-tracker` and `agent-skills:verification`.

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
