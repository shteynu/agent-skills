# Client profile: the Claude Code CLI

Open this when the coordinating session runs in the Claude Code command-line
client, without the desktop app's session tools. It maps
[../SKILL.md](../SKILL.md) `Client capabilities` onto that client. Written
on 2026-11-26 from the client's documented tools; **not yet observed in a
long run**. Check each line against the tools and flags your session
actually has before relying on it, and record what you confirm here.

## Two kinds of worker

| Kind | What it is | Lives as long as | Use for |
| --- | --- | --- | --- |
| Subagent | The `Agent` tool inside the manager's session | the manager's session | pieces of a step; short lines that finish before the manager is replaced |
| Headless session | A separate `claude -p` process started from the shell | its own session id, resumable | lines of work that must outlive the manager |

A subagent ends with the session that started it. Lines that must survive
`Replacing the manager` run as headless sessions.

## Capabilities

| Capability | Subagent | Headless session |
| --- | --- | --- |
| open | `Agent` with a self-contained prompt; run it in the background when the manager has other work | `claude -p "<brief>" --output-format json` run in the background from the worker's worktree; record the returned session id in the register |
| message | `SendMessage` to the agent's id or name | `claude -p --resume <session id> "<next step>"` |
| observe | the completion notice the manager receives; Git | the exit of the background process and its JSON output; Git |
| stop | stop the background task | stop the background process; queued work does not exist, but a step it already started may have left uncommitted changes |
| isolate | `isolation: "worktree"` gives a temporary worktree, removed if unchanged | `git worktree add <path> -b <branch>` before starting, then start the process in that folder |

## Limits

- **What wakes the manager.** A completed background task or agent, or the
  owner's next message. Nothing else; do not add a timer to poll.
- **Permissions of a headless worker.** It reads the same settings files
  and cannot ask the owner anything. A refused action ends in a refusal in
  its output, which is a permission block for the line. Never start it with
  a flag that skips permission checks, and never in a wider permission mode
  than the manager's (`Choosing the worker`).
- **Model.** `--model` picks the worker's model; use only what the binding
  names for that kind of work.
- **Context compaction** happens in both kinds of worker. State lives in
  Git for that reason.

## Permission settings

The same files and matching rules as in
[claude-code-desktop.md](claude-code-desktop.md) `Permission settings`, plus
the project's `.claude/settings.local.json`, which is personal and not in
Git.
