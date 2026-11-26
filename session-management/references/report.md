# Template: the worker's report

Open this when writing a brief (to tell the worker how to report) or when
checking a report. The rules are in [../SKILL.md](../SKILL.md)
`Reports are claims`. The manager checks every field against the branch
before passing anything on.

```markdown
Line <line id>, run <run id>: <done | stopped at a block | waiting for the owner | context degraded>

Branch and commits
- Branch <branch>, HEAD <short sha>, pushed: <yes | no, why>.
- Commits this turn: <sha> <subject>; ...

Checks that ran
- `<command>`: <result line, e.g. "14 of 14 passed">.
- Not run: <check> because <reason>.

Done against the brief
- <done-when item>: <met | not met>, evidence <file or commit>.

Not done
- <item>: <why>.

Decisions
- Provisional, in the queue: <id> <one line>.
- Waiting for a person: <id> <one line>.

Blocks
- <exact command> refused with "<exact message>"; cause if known: <rule,
  file>.

Worktree state
- Uncommitted: <none | list>. Untracked: <none | list>.

Next step
- <one concrete step, as in the task file>
```

A report that leaves out a field, or says "tests pass" with no command and
result, goes back to the worker with what is missing.
