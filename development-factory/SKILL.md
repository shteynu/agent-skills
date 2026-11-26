---
name: development-factory
description: The manager of a development factory and the entry point of the engineering layer - takes in any substantial task, splits it into lines of work, gives each line its chain of development roles (product, architect, implementer, reviewer, QA, evals) and decides which role runs in which session or subagent with a fresh context, chooses whether the lines run in this session, with subagents, in parallel sessions or as a chain of phases, staffs each role with its skill, notices when a skill is missing or keeps failing and writes or proposes one, and closes each phase with a retrospective that feeds the skills. Use at the start of any substantial task in a repository that uses this collection (a feature, a bug fix, a phase, a project, a multi-step change), when deciding which agent or session should do the next piece of development, when the same problem recurs, or when a phase or run ends. Not for a question, a lookup or a single edit: the intake sends those straight back to the session. How sessions are opened and checked is session-management; one session's handoff is task-tracker; each role's own rules are in its role skill.
metadata:
  tree-code: E11
  depends-on: session-management, task-tracker, product-spec, architecture-decisions, implementation, code-review, qa-testing, agent-evals, skill-authoring, orchestration, human-gates
---

# Development Factory

Draft: an evaluation baseline is recorded (at the ceiling; see
[references/eval-set.md](references/eval-set.md)), but there is one consumer
so far and no approval by the layer's owner
([skill-authoring](../skill-authoring/SKILL.md) `Done`).

## How to read this skill

Always in force:
- `The factory's job`: it separates deciding how work is organised from
  doing it.
- `Intake`: every task passes it, and most leave at once. Without it the
  factory is either skipped or becomes a tax on small work.
- `Contract`: the factory is a role, with input, output and limits.

Conditional:
- `Lines of work`: the intake found a substantial task.
- `Roles`: lines are known and each needs its chain of roles, or a role
  hands work back to another.
- `Choosing the topology`: lines are known, or a recorded topology no
  longer fits.
- `Staffing with skills`: a topology is chosen and lines need workers.
- `Skill gaps`: a gap signal fires, at staffing or at any time during the
  run.
- `Running`: the plan is recorded and the first line can start.
- `Retrospective`: a phase or the run ends, or the owner asks for one.

The plan's format is in [references/run-plan.md](references/run-plan.md),
opened when recording a plan or a topology change. The gap log and the
proposal format are in [references/skill-gaps.md](references/skill-gaps.md),
opened when a gap signal fires or at a retrospective. The evaluation set
for the factory's own decisions is in
[references/eval-set.md](references/eval-set.md), opened when this skill or
the binding values it reads change.

## The factory's job

The factory decides how a task is organised: how many workers, in which
kind of session, on which branches, with which skills. Then it hands the
plan to [session-management](../session-management/SKILL.md), which runs
it.

- Every decision is written down with its reason, in the run plan. A
  decision without a recorded reason cannot be checked, and a replacement
  manager cannot keep it.
- Organising is cheaper than it looks only when it is light. The factory
  never adds sessions, files or ceremony that the task does not need.
- In the simplest topology the factory and the worker are the same session.
  That is a valid outcome, not a failure to delegate.

## Intake

Every task passes the intake first. It answers four questions from the
request, the repository and the project's agent instructions:

1. **Goal**, in one sentence, and **done when**, as checks that can be run.
2. **Decisions that belong to people** on the way
   ([human-gates](../human-gates/SKILL.md)).
3. **Size**: how many steps, which areas of the repository, whether it fits
   one context.
4. **Consent**: whether the owner has allowed multi-agent work for this
   project ([orchestration](../orchestration/SKILL.md) `Autonomous runs`).

A task is **small** when it is a question, a lookup, a single edit, or a few
steps in one area with no human decision on the way. A small task leaves the
intake at once: the session does it, with no plan and no files. Say nothing
about the factory to the owner.

Everything else is **substantial** and goes on to `Lines of work`. When in
doubt, treat it as small and come back if it grows: a task that grows past
one area or one context during work re-enters the intake.

## Lines of work

Split a substantial task into lines. A line is work with its own branch,
task file and done-when, which can be checked and merged on its own
([task-tracker](../task-tracker/SKILL.md) `Parallel work`).

For each line record: its goal, done-when, the files or areas it touches,
the lines it needs results from, the human decisions on it, and the skills
it needs. Two lines that touch the same files depend on each other even if
neither needs the other's result.

Do not split for its own sake. One line is the right answer for most tasks.

## Roles

A line of development work passes through roles. Each role has its own
skill, reads files and writes files; no role does another's work, and the
roles hand work to each other only through those files.

| Role | Skill | Reads | Writes |
| --- | --- | --- | --- |
| product | [product-spec](../product-spec/SKILL.md) | the request | a spec with numbered acceptance criteria, each with a check |
| architect | [architecture-decisions](../architecture-decisions/SKILL.md) | the spec | a decision record, schema drafts, implementation steps |
| implementer | [implementation](../implementation/SKILL.md) | the approved spec and record | commits with tests on the line's branch |
| reviewer | [code-review](../code-review/SKILL.md) | the diff, the spec, the record | findings and a verdict |
| QA | [qa-testing](../qa-testing/SKILL.md) | the spec, not the code | tests from the spec and a coverage report |
| evals | [agent-evals](../agent-evals/SKILL.md) | the changed role skill, prompt or model | the set's results against its baseline |

The binding may name a project skill that replaces a role's skill for the
project's own kind of work; the factory takes the binding's name.

### The chain for each kind of line

Take the first row that fits the line:

| Line | Chain |
| --- | --- |
| A change to an agent role skill, prompt or model assignment | implementer → evals → reviewer |
| A change that crosses components or roles, adds or changes a schema or an interface, or picks a technology | product → architect → implementer → reviewer → QA |
| A feature or any change of behaviour a user or a client sees | product → implementer → reviewer → QA |
| A bug fix whose cause is not yet known, or that changes what users see | implementer (reproduce with a failing test first) → reviewer → QA |
| A bug fix with a known cause in one area, or a refactor with no change of behaviour | implementer → reviewer |

- **Skip product** when an approved spec for the line already exists, or the
  request itself states acceptance criteria that can each be checked;
  record that text as the spec.
- **Human gates sit between roles.** The spec and the decision record are
  approved by whoever the binding names before the implementer starts;
  where the binding allows, provisionally. Merging stays the owner's
  ([human-gates](../human-gates/SKILL.md)).
- **Returns go back one role.** Reviewer findings and failing QA tests go
  back to the implementer; a spec found silent or wrong goes back to
  product. When a role reports that the spec contradicts the code or
  another requirement, the line goes to product, not back to the
  implementer: product answers with a new version or a question to the
  owner ([product-spec](../product-spec/SKILL.md) `Approval and versions`).
  After the same return on the same cause the number of times the binding
  names, two by default, stop the loop, log a gap signal and ask the owner;
  the line still goes to the role that owns the cause, and waits there for
  the answer.

### Where each role runs

- **The writer never checks its own work.** The reviewer and QA always start
  with a fresh context: a subagent, or a session of their own. Never in the
  implementer's session, never with a copy of the implementer's
  conversation. They read the files, not the history.
- **Model and effort for each role** come from the binding
  ([session-management](../session-management/SKILL.md) `Choosing the
  worker`). The reviewer and QA run on another model than the implementer
  where the binding names one, and never at lower effort than the
  implementer. In evals, the role under test runs on the model and effort
  the changed role will run on; a rubric's grader runs on another model.
  Where the binding names nothing for a role, it is recorded as
  `inherited`.
- **Product and architect** run before the implementer in the line's own
  session, or as a session of their own when the spec or the record needs
  research or rounds with the owner.
- **The implementer** is the line's worker: this session for the topology
  `This session`, otherwise the line's session.
- **QA in parallel.** Once the spec is approved, QA may run as a session of
  its own alongside the implementer, writing tests from the spec in files
  the implementer does not touch. Its branch is integrated with the
  implementer's ([session-management](../session-management/SKILL.md)
  `Integrating lines`). Otherwise QA runs after the reviewer passes the
  change.
- **Evals** run as a subagent or a session of their own, never as part of
  the change they evaluate.

Each role's place is recorded in the plan
([references/run-plan.md](references/run-plan.md)): which role, which
skill, where it runs, from which context, and on which model and effort.

## Choosing the topology

Take the first topology whose condition holds, and record why the ones
before it did not:

| Topology | Condition |
| --- | --- |
| **This session** | One line, it fits one context, and no piece of it is independent enough to hand off. |
| **This session with subagents** | One line, but it has pieces that return a result inside one step: a search across many files, an evaluation, separate parts of one change that do not share files. The line's own reviewer or QA in a subagent is not such a piece (`Roles are not lines`). |
| **Parallel sessions** | Two or more lines that need no result from each other and touch no common files, and the owner has consented to multi-agent work. |
| **Chain of phases** | Lines depend on each other in order, or the whole does not fit one context. Each phase is a session on its own branch, opened when the one before ends. |

Combinations are allowed: a chain of phases whose phases use subagents, or
parallel lines inside one phase. Record each level.

- **No consent.** Without the owner's consent to multi-agent work, the
  factory records the topology it would choose as `preferred`, with why,
  runs the task in this session or as a chain the owner starts (that is the
  `kind`), and asks once. Consent that the project requires and that is not
  recorded counts as `no`, not `unknown`.
- **Limits.** The number of sessions writing at once, the budget and which
  models serve which work come from the binding, through
  [session-management](../session-management/SKILL.md) `Run limits and
  closing` and `Choosing the worker`.
- **Roles are not lines.** The roles of one line run inside that line, as
  `Roles` places them; they count toward the topology only when a role runs
  as a session of its own. A reviewer or QA in a subagent leaves the
  topology as it was: one line with no other piece to hand off is still
  `This session`.
- **Revisit** the topology when a line's assumption breaks, a new
  independent line appears, a line is blocked for long, or a worker's
  context is degraded. Record the change and its reason; never change it
  silently.

The record format is in [references/run-plan.md](references/run-plan.md).

## Staffing with skills

For each role of each line, name the skill that covers it, and the other
skills the work needs. Take them from the project's routing (its agent
instructions or the client's skill list) and the binding, not from memory.

- A role or a line whose work no skill covers, or covers only in part,
  raises a gap signal (`Skill gaps`).
- Each worker's brief names its role, its role skill and the other skills
  in reading order, and what it must not do because another role does it
  ([session-management](../session-management/SKILL.md) `The brief`).
- A worker on a line with a known open gap gets the gap in its brief, so it
  records what it learns instead of guessing silently.

## Skill gaps

A gap is a rule the work needs that no skill holds, or a skill that keeps
failing. Signals:

- a line or a role that no skill covers;
- a role skill with no `Contract` or no evaluation set;
- the same review finding, block or rework on the same cause, seen the
  number of times the binding names, two by default;
- the same instructions written into briefs again and again;
- a rule that lives only in a task file, a decision log or an agent's
  memory, but applies to future work.

Every signal goes into the gap log with its evidence
([references/skill-gaps.md](references/skill-gaps.md)). A signal seen fewer
times than the count is logged as `watching` and nothing more. Once it
reaches the count, act on it in this order:

1. **Fix an existing skill** when one owns the area and is wrong or
   incomplete.
2. **Extend an existing skill** when the rule fits its scope.
3. **Write a new skill** only when no skill owns the area. One occurrence is
   never enough for a new skill.

Then decide the layer by
[skill-authoring](../skill-authoring/SKILL.md) `Layers`:

- **A project skill** (domain or binding) is written as a line of its own,
  with its own branch and worker, from the skill template, with an
  evaluation set for a role skill ([agent-evals](../agent-evals/SKILL.md)),
  and passes the project's gates. Accepting it is the decision of the
  layer's owner. Where the binding allows, it is used provisionally until
  then, marked as a draft; otherwise it waits.
- **A shared skill** (universal or engineering) is never written into the
  project's copy of this collection. The factory drafts it and proposes it
  to this collection's repository; the project uses it only after it is
  accepted and pinned.

Never write or change a skill so that it widens permissions, loosens a gate,
or moves a human decision to an agent. Such a gap goes to the owner as a
question. The binding may limit how many new skills one run starts; when it
names none, start at most one at a time.

## Running

Record the plan ([references/run-plan.md](references/run-plan.md)) as the
first section of the run register
([session-management](../session-management/SKILL.md) `The run register`),
then hand it to session-management. From there:

- session-management opens, briefs, checks, continues and replaces sessions;
- the factory is consulted again when a topology must be revisited, a gap
  signal fires, or a phase ends.

For the topology `This session`, there is no register; the task file is
enough.

## Retrospective

At the end of each phase and of the run, read the evidence, not the
conversation: review findings, blocks, reworks, replaced sessions and their
reasons, briefs, and the gap log.

The output is short:

- gap signals to add or to close, each with its evidence;
- skill changes to propose, in the order of `Skill gaps`;
- binding values that proved wrong (a limit that was always hit, a threshold
  that never fired), as proposals to the owner;
- new evaluation cases from real failures, for the factory's own set and for
  the role skills involved ([agent-evals](../agent-evals/SKILL.md)
  `Building a set`).

The retrospective proposes. It changes no skill and no binding value
itself; those changes are lines of their own or decisions of the owner.

## Contract

- **Input:** the owner's request, the project's agent instructions and
  binding, the task files, the run register and the gap log when they exist.
  A missing binding value is taken from the defaults above and recorded as a
  default.
- **Output:** the run plan in the register, with each line's chain of roles
  and where each role runs; entries in the gap log, skill proposals,
  retrospective notes. For a small task: nothing.
- **Does not:** do a role's work once it has given it to a worker; review
  its own lines' output; put a reviewer or QA in the implementer's context;
  run a role below the model or effort the binding names for it;
  approve a spec or a record; accept its own skill proposals; grant itself
  or a worker any permission; start parallel sessions without the owner's
  consent.
- **Escalate when:** the goal or done-when cannot be stated from the
  request; every topology needs a decision only the owner can make; a
  return loop between roles reaches its limit; a gap can be closed only by
  widening a permission or a gate; the plan needs more sessions or budget
  than the binding allows; the client does not offer the model or effort
  the binding names for a role. Use the format in
  [agent-foundations](../agent-foundations/SKILL.md) `Escalation`.
