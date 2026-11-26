# Client profile: the Claude desktop app (Code tab)

Open this when the coordinating session runs in the Claude desktop app. It
maps the rules in [../SKILL.md](../SKILL.md) onto that client's tools and
limits. The tool names and limits below were observed on 2026-11-26. Check
them against the tools your session actually lists before relying on them.

## Tools

| Rule | Tool |
| --- | --- |
| Open a session | `start_session`. `initiation: user_asked` starts it now; `own_initiative` only shows a card the owner must start; `offer` asks the owner first. `context: fresh` needs a self-contained `prompt` and `background`. |
| Shared or own worktree | `use_worktree: false` shares the manager's checkout, so only one writer may run there. `true` gives the session its own worktree and branch. |
| Continue a worker | `SendMessage` with `to` set to its `local_...` session id. A busy worker holds the message until its turn ends. |
| Know its state | `list_sessions` with `linked: true`, or `get_session`, which shows `isRunning` and `permissionMode`. |
| Stop a worker | `stop_session`. It interrupts the turn, and messages already queued for the worker run next. |
| Hand off your own task | `hand_off_to_session`, when a new owner message is about something else. |

## Limits

- **Who may start a session.** In a turn that a worker's report woke, and
  not an owner's message, the app refuses `start_session`. Only a card can
  be shown. Sending a running worker its next step is still possible.
- **Automatic continues pause.** After many report-driven turns in a row
  without an owner message, reports wait for the owner's next message.
  Tell the owner when that is near, so a long run does not stall unseen.
- **The manager's turn ends when it replies.** Nothing wakes it except an
  owner message, a worker's report or a scheduled run. A worker that runs
  many steps in one turn keeps a run going longest.
- **Context compaction.** A long conversation is summarized automatically
  and continues. Details are lost, which is why the state lives in Git.

## Permission settings

- Files: the user's global `~/.claude/settings.json` and the project's
  `.claude/settings.json` (shared, in Git). A deny rule in either beats an
  allow rule in either.
- A pattern matches from the start of the command. `git push origin:*`
  does not match `git push -u origin ...`, nor `git -C <path> push`, nor a
  push chained after another command with `&&`. Run such commands alone.
- A settings change was picked up by the running session without a
  restart, at least for Bash rules.
- The auto-mode classifier can refuse an action that no rule names, for
  example creating a scheduled task. Treat it as a permission block.
- When the owner edits settings by hand, check which file changed: pasting
  the global file into the project file replaces the project's own rules
  and plugins.
