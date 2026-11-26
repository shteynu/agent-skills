# Template: the brief

Open this when starting a worker session or a subagent. The rules are in
[../SKILL.md](../SKILL.md) `The brief`. Fill every field; a field that does
not apply says "none", so the worker can tell an omission from an absence.

```markdown
You are the worker for line <line id> of run <run id>.

Start here
- Read <the project's agent instructions file> and the task file
  <path>. They come before this brief. If they disagree with it, stop and
  report the disagreement.

Role
- You are the <product | architect | implementer | reviewer | QA | evals>
  of this line. Read <role skill> before anything else in this list.
- You receive: <spec path, record path, branch or diff>. You hand over:
  <the file you write, and to which role>.
- You do not: <the other roles' work, e.g. "review or test your own change",
  "write tests from the code instead of the spec">.

Task
- Branch: <branch>. Worktree: <path, or "the shared checkout">.
- Area: <files or directories>.
- Next step: <one concrete step>. Then continue step after step from the
  task file's next step until a stop condition below.

Done when
- <a check that can be run, with its command>
- <another>

Stop and report when
- a command is refused, a network call fails, or a result would have to be
  invented;
- only work that a person decides is left;
- your context is degraded (you repeat steps, or your plan disagrees with
  the task file).
Save progress to the task file, commit and push before reporting.

Permissions that apply
- "<the owner's words>" (<date>, <decision-log id>). This covers <what it
  names> and nothing else.

Do not
- <merge to the main branch, force-push, edit permission settings, ...>
- <anything the manager itself was refused>

Report
- In the format of <path to the report template, or the fields pasted
  here>.
```

A brief for a subagent inside one step is shorter: the task, done-when and
the report fields. It still never grants more than the owner did.
