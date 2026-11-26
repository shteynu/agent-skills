---
name: session-management
description: The coordinating session as a manager of worker sessions in a long autonomous run - the run register that records every line of work, when to open a new session and when to keep one going, choosing and briefing a worker, one writer per worktree, reading a worker's report as a claim to check, silent or crashed workers, continuing, replacing or stopping a session, integrating parallel branches, run limits and closing, replacing the manager itself, relaying the owner's words and standing permissions, and handling a permission block without weakening any rule. Use when a session coordinates other sessions or agents across hours or days, when deciding whether work needs a new session, when a worker session reports back or goes silent, or when the coordinating session itself must hand over. Not for a single session's own handoff (task-tracker) or the coordinator code of a pipeline (orchestration).
metadata:
  tree-code: E10
  depends-on: orchestration, task-tracker, human-gates
---

# Session Management

Draft: used by one project so far, so not yet proven universal
([skill-authoring](../skill-authoring/SKILL.md) `Universality rules` 2).

## How to read this skill

Always in force:
- `The manager's job`: it keeps the coordinating session from doing a
  worker's work or losing track of who is working where.
- `The run register`: the manager's own context is replaceable too, and
  without a register a new manager cannot tell which sessions exist.
- `One writer per worktree`: two sessions in one folder overwrite each
  other, and nothing warns either of them.
- `Reports are claims`: an unchecked report is what turns "done" into
  invented progress.

Conditional:
- `Client capabilities`: first use in a client, or a rule below needs a
  capability the client may lack.
- `When to open a session`: deciding whether work goes to a new session, a
  running one or a subagent.
- `Choosing the worker`: a session or subagent is about to be started.
- `The brief`: starting a session or a subagent.
- `Silence and failure`: a worker has not reported when expected, or it
  stopped in the middle of a step.
- `Continue, replace or stop`: a worker ended its turn, or must be halted.
- `Integrating lines`: two or more lines have committed work that must end
  up together.
- `Run limits and closing`: starting a run, about to exceed a limit, or no
  line has an unblocked next step.
- `Replacing the manager`: the manager's own context is degraded, or it
  must hand over.
- `Relaying the owner`: the owner says something a worker needs, or grants
  a standing permission.
- `Permission blocks`: a worker or the manager is refused an action.

Templates for the register, the brief and the report are in
[references/run-register.md](references/run-register.md),
[references/brief.md](references/brief.md) and
[references/report.md](references/report.md), opened when writing one of
them. Client profiles are opened from `Client capabilities`.

## The manager's job

The coordinating session decides what runs where. It does not take over a
line of work itself.

- It keeps the run register current (`The run register`). Its picture of
  the run comes from the register, Git and the task files, not from memory
  of the conversation.
- It starts sessions, briefs them, checks what they report, gives the next
  step, and tells the owner what is verified, provisional and blocked
  ([orchestration](../orchestration/SKILL.md) `Autonomous runs`).
- It does not do a worker's step to save a round trip, and it does not
  repair a worker's output. Defects go back to the worker with the finding
  ([agent-foundations](../agent-foundations/SKILL.md) `Stay in role`).
- Small checks, answers and single edits that belong to no line of work
  stay with the manager. They are not worth a session.

## The run register

One file per run records the run and every line of work in it. Only the
manager writes it. The binding names its path; when it names none, use
`<task directory>/runs/<run-id>.md`, next to the task files
([task-tracker](../task-tracker/SKILL.md) `Project profile`).

- **The run:** its id and start date, the goal, the owner's standing
  permissions with their source, the limits in force
  (`Run limits and closing`), the current manager session, and the
  questions waiting for the owner.
- **Each line:** its id and goal, branch, worktree, task file, current
  session, state, last verified commit, and next step. The state is one of
  `working`, `idle`, `blocked`, `waiting-owner`, `done`, `stopped`.
- **The log:** one line per event, such as a session opened, replaced,
  stopped or taken over, a line blocked or unblocked, or a branch
  integrated, each with the date and the reason.

Update the register when an event happens, and commit and push it with the
manager's next commit. Name a session by the client's label or local id.
Never by a URL, and never with transcript text
([task-tracker](../task-tracker/SKILL.md) `Git safety`). The template is in
[references/run-register.md](references/run-register.md).

## Client capabilities

The rules use five capabilities: **open** a session, **message** a running
one, **observe** its state, **stop** it, and **isolate** it in its own
worktree and branch. Clients differ in which of these they have and in what
wakes the manager.

| Missing capability | Fallback |
| --- | --- |
| open | No worker sessions. The manager works the lines one after another itself, uses subagents for pieces of a step, and replaces itself through the task-tracker handoff. |
| message | A worker cannot be continued. Each next step is a new session briefed from the task file. |
| observe | Read state from Git: commits on the worker's branch, its task file, `git status` in its worktree. |
| stop | Stop sending steps. Record in the register that the session may still be acting. |
| isolate | Create the worktree and branch yourself before opening the session, and name them in the brief. |

Profiles map the capabilities onto real tools and limits. Open the one for
your client:
- the Claude desktop app:
  [references/claude-code-desktop.md](references/claude-code-desktop.md);
- the Claude Code CLI:
  [references/claude-code-cli.md](references/claude-code-cli.md).

For another client, check its tools against the table above and follow the
fallbacks for what it lacks. Never assume a capability the client has not
shown.

## When to open a session

Where the project uses
[development-factory](../development-factory/SKILL.md), the topology of a
task is chosen there, at intake; the rules below then apply during the run.
A new session is for a line of work of its own. Open one when:

- **A phase or deliverable ends.** The next one starts on its own branch
  with its own task file, in a new session briefed from that file.
- **Work is independent.** It needs no result of the running line, touches
  none of its files, and can be merged on its own. It runs in parallel, on a
  separate branch and worktree
  ([task-tracker](../task-tracker/SKILL.md) `Parallel work`).
- **A session's context is degraded.** Signs: it repeats finished steps,
  contradicts a recorded decision, asks for what is in the task file, cites
  a file or commit that does not exist, or its context was compacted and its
  next action disagrees with the task file. One sign is enough when the
  worker's next step does not match its task file. Save progress first, then
  replace it. The binding may add a limit, such as a number of compactions.
- **A worker is blocked on one line.** Independent lines go on in their own
  sessions.

Do not open a session:

- for a piece of the current step, such as a search, a review or an
  independent part of one change. Use a subagent; its result returns in the
  same step.
- because a task is large. A long session that commits after every step is
  cheaper than many short ones, and automatic compaction alone is not a
  reason to switch.
- on a schedule, unless the owner chose one. Sessions open because of the
  state of the work, not the clock.
- when the run is at its limit of parallel workers (`Run limits and
  closing`). The new line waits in the register as `idle`.

## Choosing the worker

- **Context.** Start a worker with a fresh context and a self-contained
  brief by default. Give it a copy of the manager's conversation only when
  the work leans on a short conversation that is not yet in files. Once the
  manager's conversation is long, write what matters to the task file and
  start fresh.
- **Isolation.** A worker that writes gets its own worktree and branch
  unless it is the only writer in the shared checkout (`One writer per
  worktree`). A worker that only reads may share the checkout.
- **Model and effort.** The binding names, for each kind of work, which
  model serves it and, where the client has the setting, how much reasoning
  effort. Take both from the binding when opening a worker or a subagent,
  and record them with the line: in the plan's role entry, or in the
  register's log. Where the binding names none, the worker inherits the
  manager's model and effort, recorded as `inherited`. Within what the
  binding allows:
  - a read-only or mechanical worker (a search, a lookup, a format
    conversion) may run on a cheaper model or at lower effort;
  - work that judges or feeds other work (a spec, a decision record, a
    review, a grader) never runs at lower effort than the work it judges or
    feeds;
  - a worker that copies the manager's conversation runs on the manager's
    model and effort where the client cannot change them for a copy, so
    work that needs another model starts fresh.

  Never lower a worker's model or effort to stay within a budget: an
  exceeded budget is a recorded failure
  ([orchestration](../orchestration/SKILL.md) `Budget`). A retry on a
  stronger model or at higher effort is a change of the line's plan, logged
  with its reason, never a silent way past a failing check.
- **Permissions.** A worker runs with the same or narrower permissions than
  the manager. Never start one in a more permissive mode to get past a block
  (`Permission blocks`).

## The brief

A worker starts with nothing but its brief and the repository. The brief
says:

1. Where to start. The project's agent instructions and the branch's task
   file come first; the brief never replaces them.
2. The task: the line id, the branch, the worktree, the files or area, and
   the next concrete step. Where the work has roles, the worker's role, its
   role skill, the files it receives from the role before it, and the work
   it leaves to other roles
   ([development-factory](../development-factory/SKILL.md) `Roles`).
3. What done looks like, as checks that can be run.
4. When to stop: a block, owner-gated work only, or degraded context, each
   ending with saved progress and a report.
5. The owner's standing permissions that apply, quoted with their source
   (a decision-log entry, the owner's words and their date). The brief
   never grants more than the owner did.
6. What the worker must not do. Never ask a worker to do something your
   own session was refused: that launders a permission decision.
7. How to report: the format in
   [references/report.md](references/report.md).

Keep the brief self-contained. A worker cannot read the manager's
conversation, and a phrase like "as discussed" reaches it as nothing. The
template is in [references/brief.md](references/brief.md).

## One writer per worktree

- At most one session writes in a given folder at a time, and that
  includes the manager. While a worker writes in the shared checkout, the
  manager does not edit, commit or switch branches there.
- The manager writes the register, so it needs a folder of its own while
  workers run, or it writes the register only while no worker writes in its
  folder.
- A worker that needs the files the manager is editing, or that runs next
  to another worker, gets its own worktree and branch.
- Before acting in a folder that a stopped or finished worker used, check
  `git status`. Uncommitted changes there may be the owner's or the
  worker's. Look at them; never discard or commit them blind.

## Reports are claims

A worker's report says what it believes it did. It follows
[references/report.md](references/report.md). A report that does not
follow it goes back with what is missing. Before passing a report on:

- check the branch: commits, diff, and the task file's evidence and next
  step;
- rerun the project's cheapest gate when the report claims checks passed;
- compare with the brief: what was asked and not done, or done but not
  asked;
- check that decisions it made provisionally are in the decision queue
  ([human-gates](../human-gates/SKILL.md) `Deferred decisions`).

Then update the register and tell the owner what is verified, with the
evidence, and what is not. Never predict or invent a worker's result while
it is still running.

## Silence and failure

A worker can go silent, end with no report, or stop in the middle of a step.

- **Look before you act.** Observe its state through the client; read the
  commits on its branch, its task file and `git status` in its worktree.
  Do not ask it to "continue" until you know where it stopped.
- **Still running.** Leave it alone. Never poll it on a timer; wait for the
  next event that wakes the manager.
- **Ended without a report.** Ask it for the report in the standard format.
  If it cannot give one, treat it as degraded and replace it.
- **Stopped mid-step with uncommitted changes.** The changes stay where
  they are. The replacement works in the same worktree. It reads
  `git status`, the diff and the task file first, then decides with
  evidence whether to finish the step or record it as abandoned. Only one
  session recovers a given worktree.
- **The client lost the session.** Mark the line `stopped` in the register
  with the last verified commit, and brief a new session from the task
  file.

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

Every one of these is an event in the register's log.

## Integrating lines

Parallel lines finish on separate branches, and someone has to bring them
together.

- Integration is a line of its own, with its own branch, task file and
  worker. The manager decides the order of merging, and it does not resolve
  conflicts itself.
- Plan for it when opening parallel lines: lines that touch no common files
  merge cleanly. Two lines that will need the same file are not
  independent; run them one after the other.
- Merge into the main branch only where the binding gives that decision to
  agents. Otherwise the integrated branch goes to the owner, as a pull
  request or a named branch.
- After integration, run the full verification of the merged result. A
  line's own green checks do not prove the merge.

## Run limits and closing

The binding names the limits of a run: how many workers write at once,
how many automatic turns follow without an owner message, and the budget
([orchestration](../orchestration/SKILL.md) `Budget`). When the binding
names no number of writers, run at most two at once.

The run closes, or pauses until the owner returns, when:

- every line is `done`;
- every line that is not done is `blocked` or `waiting-owner`;
- a limit is reached;
- the owner says stop.

On closing, write the package that
[orchestration](../orchestration/SKILL.md) `Autonomous runs` asks for, with
the register as its index. Send the owner one summary, not a stream of
messages: what is verified, what is provisional, what is blocked and why,
and the questions only the owner can answer, each with the line it unblocks.

## Replacing the manager

The manager's context degrades by the same signs as a worker's.

1. Bring the register up to date: every line's state, last verified commit
   and next step, and the questions waiting for the owner. Commit and push
   it.
2. Open the new manager with a brief that points to the register and the
   standing permissions. It does not get the old conversation.
3. The new manager reads the register, observes each live worker, and
   takes each one over by sending its next step. Until then, a worker may
   still report to the old manager, so the old manager starts nothing and
   sends no step after the handover.
4. The register's log records the handover. The old manager stops after
   its last report to the owner.

## Relaying the owner

- Pass the owner's words to a worker verbatim, with the date, and keep your
  interpretation apart from them.
- A decision or standing permission the owner states goes into the decision
  log by the session that holds the folder, from the owner's own words
  ([human-gates](../human-gates/SKILL.md) `Recording a decision`), and into
  the register's standing permissions.
- A standing permission covers only what it names. Permission to push
  covers pushing branches. It does not cover merging to the main branch,
  force-pushing or any decision the binding gives to a person.

## Permission blocks

A refusal is a decision of the owner's tooling. It is not an obstacle to
route around.

1. Stop the refused line. Record the exact command and message in the task
   file, and mark the line `blocked` in the register.
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
