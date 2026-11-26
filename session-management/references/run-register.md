# Template: the run register

Open this when starting a run or when the register's shape is in doubt. The
rules for it are in [../SKILL.md](../SKILL.md) `The run register`. Copy the
block below into the path the binding names, or into
`<task directory>/runs/<run-id>.md`. Only the manager edits it.

```markdown
# Run <run-id>

## Run

- Started: <YYYY-MM-DD>
- Goal: <one sentence>
- Manager session: <client label or local id>, since <YYYY-MM-DD>
- Limits: <writers at once>; <automatic turns without the owner>; <budget>
  (source: <binding field or "default">)

## Standing permissions

| Permission | Covers | Does not cover | Source |
| --- | --- | --- | --- |
| <what the owner allowed> | <exactly what it names> | <the nearest things it does not> | <decision-log id, or the owner's words and date> |

## Lines

| Line | Goal | Branch | Worktree | Task file | Session | State | Last verified commit | Next step |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L1 | <goal> | <branch> | <path or "shared"> | <path> | <label or id> | working | <short sha> | <one step> |

State is one of: working, idle, blocked, waiting-owner, done, stopped.

## Waiting for the owner

| Question | Line it unblocks | Since | Where the packet is |
| --- | --- | --- | --- |

## Log

- <YYYY-MM-DD> L1 opened: <reason>.
- <YYYY-MM-DD> L1 replaced: context degraded (<the sign>); new session <label>.
- <YYYY-MM-DD> manager handed over to <label>: <reason>.
```

Keep it a snapshot, like a task file: drop finished detail from the table
once the log has it, and reference commits instead of pasting diffs.
