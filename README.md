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

### Option B — copy

Copy a skill directory into the project's skills directory. A copy is a fork
that drifts silently, so record the source repository and commit next to the
copy, and prefer Option A when the project tolerates submodules.

### Wire the routing

Add routing to the project's root `AGENTS.md` (and `CLAUDE.md` when the
client needs it), for example:

```markdown
- Starting, continuing or resuming work, reporting status, saving progress,
  or preparing a handoff → `.agents/skills/shared/task-tracker/SKILL.md`.
- Verifying changes, proving a fix, checking merge readiness, or recording
  verification evidence → `.agents/skills/shared/verification/SKILL.md`.
```

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
