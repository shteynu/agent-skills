# Client profile: the Claude desktop app (Code tab)

Open this when the coordinating session runs in the Claude desktop app. It
maps [../SKILL.md](../SKILL.md) `Client capabilities` onto that client's
tools and limits. Lines marked *observed* were seen in a run on 2026-11-26;
the rest come from the app's tool descriptions on the same date. Check them
against the tools your session actually lists before relying on them.

## Capabilities

| Capability | Tool |
| --- | --- |
| open | `start_session`. `initiation: user_asked` starts it now; `own_initiative` only shows a card the owner must start, and the card expires after a week; `offer` asks the owner first. `context: fresh` needs a self-contained `prompt` and `background`; `context: fork` copies the manager's conversation. `model` picks the model the binding names for the work. The result gives the session a short name and a `local_...` id: record both in the register. |
| isolate | `use_worktree: true` gives the session its own worktree and branch. `use_worktree: false` shares the manager's folder, so only one writer may run there; when the manager itself runs in a worktree, `false` means that same worktree and branch. |
| message | `SendMessage` with `to` set to the `local_...` id, never a display name. A busy worker holds the message until its turn ends. |
| observe | `list_sessions` with `linked: true`, or `get_session`, which shows `isRunning` and `permissionMode`. |
| stop | `stop_session`. It interrupts the turn, and messages already queued for the worker run next. *Observed.* |

## Model and effort

- **A session.** `start_session` takes `model` and `effort`, for `fresh`
  local sessions only (not cloud). Both are capped at the manager's own
  level: a higher model or effort is ignored without an error, so a role
  the binding names above the manager's level runs as a subagent, or the
  owner starts its session. `set_session_model` and `set_session_effort`
  apply from the worker's next turn and ask the owner for a higher value;
  a `user_asked` session starts its first turn at once, so pass the values
  when starting it.
- **A subagent.** The `Agent` tool takes `model` (a family name such as
  `opus`, `sonnet`, `haiku`) and `effort` (`low`, `medium`, `high`,
  `xhigh`, `max`). An omitted `model` comes from the agent type's own
  definition, then a configured default subagent model, and only then the
  manager's; so for `inherited`, pass the manager's model explicitly. The client sets effort only when the owner or an
  instruction asks for it explicitly; a binding value is such an
  instruction, so name its source in the plan. A `fork` subagent ignores
  `model` and runs at the manager's effort: a role that needs another model
  is never a fork.
- An agent type defined in the client's agent files can fix its own model
  and effort; an explicit `model` overrides it, so pass the binding's
  value.

`hand_off_to_session` moves the manager's own unfinished task to a new
session when a new owner message is about something else. In a worktree,
commit first: the new session starts from the branch tip.

## Reports

- When a worker ends a turn, the session that started it, or the session
  whose message began that turn, gets a note. The note quotes the first 400
  characters of the worker's latest report. So the worker's report starts
  with its status line, and the manager reads the rest from the task file
  and the branch before acting.
- A replacement manager receives a worker's notes only after it has sent
  that worker a message (`Replacing the manager` step 3).
- Notes from a turn the owner drove, or from a turn that was stopped or
  failed, wait for the manager's next turn. A cloud session sends no note.
- A worker in its own worktree commits to its own branch, which the note
  names when the app knows it. The manager's checkout has none of that work
  until the branch is merged, and merging follows `Integrating lines`.

## Limits

- **Who may start a session.** In a turn that a worker's report woke, and
  not an owner's message, the app refuses `start_session`. Only a card can
  be shown. Sending a running worker its next step is still possible. One
  exception: in a report-driven turn right after the owner's own turn, a
  step the owner asked to have in its own session may still start, in the
  same project. *Refusal observed.*
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
  allow rule in either. *Observed.*
- A pattern matches from the start of the command. `git push origin:*`
  does not match `git push -u origin ...`, nor `git -C <path> push`, nor a
  push chained after another command with `&&`. Run such commands alone.
  *Observed.*
- A settings change was picked up by the running session without a
  restart, at least for Bash rules. *Observed once.*
- The auto-mode classifier can refuse an action that no rule names, for
  example creating a scheduled task. Treat it as a permission block.
  *Observed.*
- When the owner edits settings by hand, check which file changed: pasting
  the global file into the project file replaces the project's own rules
  and plugins. *Observed.*
