---
name: session-management
description: The coordinating session as a manager of worker sessions in a long autonomous run - when to open a new session and when to keep one going, how to brief it, one writer per worktree, reading a worker's report as a claim to check, continuing, replacing or stopping a session, relaying the owner's words and standing permissions, and handling a permission block without weakening any rule. Use when a session coordinates other sessions or agents across hours or days, when deciding whether work needs a new session, or when a worker session reports back. Not for a single session's own handoff (task-tracker) or the coordinator code of a pipeline (orchestration).
metadata:
  tree-code: E10
  depends-on: orchestration, task-tracker, human-gates
---

# Session Management

## How to read this skill

Always in force:
- `The manager's job`: it keeps the coordinating session from doing a
  worker's work or losing track of who is working where.
- `One writer per worktree`: two sessions in one folder overwrite each
  other, and nothing warns either of them.
- `Reports are claims`: an unchecked report is what turns "done" into
  invented progress.

Conditional:
- `When to open a session`: deciding whether work goes to a new session, a
  running one or a subagent.
- `The brief`: starting a session or a subagent.
- `Continue, replace or stop`: a worker ended its turn, or must be halted.
- `Relaying the owner`: the owner says something a worker needs, or grants
  a standing permission.
- `Permission blocks`: a worker or the manager is refused an action.

How these rules map onto one client's tools and limits is in
[references/claude-code-desktop.md](references/claude-code-desktop.md),
opened when the client is the Claude desktop app.

## The manager's job

The coordinating session decides what runs where. It does not take over a
line of work itself.

- It keeps a current picture of every line of work: its branch, task file,
  session, state (working, idle, blocked, waiting for the owner) and last
  verified commit. The picture comes from Git and the task files, not from
  memory of the conversation.
- It starts sessions, briefs them, checks what they report, gives the next
  step, and tells the owner what is verified, provisional and blocked
  ([orchestration](../orchestration/SKILL.md) `Autonomous runs`).
- It does not do a worker's step to save a round trip, and it does not
  repair a worker's output. Defects go back to the worker with the finding
  ([agent-foundations](../agent-foundations/SKILL.md) `Stay in role`).
- Small checks, answers and single edits that belong to no line of work
  stay with the manager. They are not worth a session.

## When to open a session

A new session is for a line of work of its own. Open one when:

- **A phase or deliverable ends.** The next one starts on its own branch
  with its own task file, in a new session briefed from that file.
- **Work is independent.** It needs no result of the running line, touches
  none of its files, and can be merged on its own. It runs in parallel, on a
  separate branch and worktree
  ([task-tracker](../task-tracker/SKILL.md) `Parallel work`).
- **A session's context is degraded.** Signs: it repeats finished steps, it
  contradicts a recorded decision, it asks for what is in the task file, or
  its context was compacted and its next action disagrees with the task
  file. Save progress first, then replace it.
- **A worker is blocked on one line.** Independent lines go on in their own
  sessions.

Do not open a session:

- for a piece of the current step, such as a search, a review or an
  independent part of one change. Use a subagent; its result returns in the
  same step.
- because a task is large. A long session that commits after every step is
  cheaper than many short ones, and automatic compaction is not by itself a
  reason to switch.
- on a schedule, unless the owner chose one. Sessions open because of the
  state of the work, not the clock.

## The brief

A worker starts with nothing but its brief and the repository. The brief
says:

1. Where to start. The project's agent instructions and the branch's task
   file come first; the brief never replaces them.
2. The task: the branch, the files or area, and the next concrete step.
3. What done looks like, as checks that can be run.
4. When to stop: a block, owner-gated work only, or degraded context, each
   ending with saved progress and a report.
5. The owner's standing permissions that apply, quoted with their source
   (a decision-log entry, the owner's words and their date). The brief
   never grants more than the owner did.
6. What the worker must not do. Never ask a worker to do something your
   own session was refused: that launders a permission decision.

Keep the brief self-contained. A worker cannot read the manager's
conversation, and a phrase like "as discussed" reaches it as nothing.

## One writer per worktree

- At most one session writes in a given folder at a time, and that
  includes the manager. While a worker runs in the shared checkout, the
  manager does not edit, commit or switch branches there.
- A worker that needs the files the manager is editing, or that runs next
  to another worker, gets its own worktree and branch.
- Before acting in a folder that a stopped or finished worker used, check
  `git status`. Uncommitted changes there may be the owner's or the
  worker's. Look at them; never discard or commit them blind.

## Reports are claims

A worker's report says what it believes it did. Before passing it on:

- check the branch: commits, diff, and the task file's evidence and next
  step;
- rerun the project's cheapest gate when the report claims checks passed;
- compare with the brief: what was asked and not done, or done but not
  asked.

Then tell the owner what is verified, with the evidence, and what is not.
Never predict or invent a worker's result while it is still running.

## Continue, replace or stop

- **Continue** a worker that has its context and a clear next step: send it
  the step and the verified state. This is cheaper than a new session that
  must reread everything.
- **Replace** it when its context is degraded, when its phase ended, or
  when the next step belongs to another line. The new session starts from
  the task file. Close or archive the old one only after its work is
  committed.
- **Stop** a worker when the owner asks, or when it is doing something
  outside its brief. A stopped worker may still run messages already queued
  for it. Withdraw or supersede those, or make the replacement aware of
  them, so that two sessions do not act on one instruction.

## Relaying the owner

- Pass the owner's words to a worker verbatim, with the date, and keep your
  interpretation apart from them.
- A decision or standing permission the owner states goes into the decision
  log by the session that holds the folder, from the owner's own words
  ([human-gates](../human-gates/SKILL.md) `Recording a decision`).
- A standing permission covers only what it names. "Push everything
  yourself" covers pushing branches. It does not cover merging to the main
  branch, force-pushing or any decision the binding gives to a person.

## Permission blocks

A refusal is a decision of the owner's tooling. It is not an obstacle to
route around.

1. Stop the refused line. Record the exact command and message in the task
   file.
2. Do not retry the same action in another form, and do not ask another
   session to do it.
3. Find the cause where you can read it: which rule matched, in which
   settings file. Common causes: a deny rule that beats an allow rule, a
   rule in a file the client does not read, or an allow pattern that does
   not match the exact command form.
4. Tell the owner the cause and the exact change that would fix it. Never
   edit your own permission settings to unblock yourself.
5. Continue with independent work. Commits accumulate locally until the
   block is lifted.
