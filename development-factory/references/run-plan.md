# Format: the run plan

Open this when recording a plan or a change of topology. The rules are in
[../SKILL.md](../SKILL.md) `Choosing the topology`. The plan is the first
section of the run register
([../../session-management/references/run-register.md](../../session-management/references/run-register.md)).
For the topology `this-session` it goes into the task file instead.

The decision block is YAML so that code can check it: the evaluation set
grades the factory on these fields.

````markdown
## Plan

```yaml
intake:
  goal: <one sentence>
  done_when:
    - <check that can be run>
  human_decisions:
    - <decision, owner per the binding>
  size: substantial          # small never reaches a plan
  consent_multi_agent: yes   # yes: recorded consent; no: the project requires
                             # consent and none is recorded, or the owner refused;
                             # unknown: the project says nothing either way
  consent_source: <decision-log id or the owner's words and date>
lines:
  - id: L1
    goal: <goal>
    done_when: [<check>]
    touches: [<files or areas>]
    needs: []                # line ids whose results it needs
    human_decisions: []
    kind: feature            # role-change | cross-boundary | feature | bug-unknown | bug-known | refactor
    roles:                   # in order; SKILL.md `Roles`
      - role: product        # product | architect | implementer | reviewer | qa | evals
        skill: product-spec  # or the project skill the binding names
        runs_in: line-session    # this-session | line-session | own-session | subagent
        context: fresh           # fresh | the line's (only for product, architect, implementer)
        model: <model>           # the name the binding gives this role, or inherited
        effort: <effort>         # the client's effort level the binding names, or inherited
        after: []                # roles it waits for; a human gate is named as gate:<what>
      - role: implementer
        skill: implementation
        runs_in: line-session
        context: the line's
        model: <model>
        effort: <effort>
        after: [product, "gate:spec approved"]
      - role: reviewer
        skill: code-review
        runs_in: subagent
        context: fresh
        model: <model>           # another model than the implementer's where the binding names one
        effort: <effort>         # never lower than the implementer's
        after: [implementer]
      - role: qa
        skill: qa-testing
        runs_in: own-session     # parallel with the implementer once the spec is approved
        context: fresh
        model: <model>
        effort: <effort>
        after: ["gate:spec approved"]
    skipped_roles: {}        # {product: "approved spec docs/specs/x.md exists"}
    skills: [<other skill>]
    gaps: []                 # gap ids from the gap log
topology:
  kind: parallel-sessions    # what actually runs: this-session | subagents | parallel-sessions | phase-chain
  preferred: null            # what the factory would run if consent or a limit did not
                             # stop it; null when it equals kind
  levels: []                 # for combinations: [{line: L1, kind: subagents}]
  rejected:
    this-session: <why not>
    subagents: <why not>
  limits:
    writers_at_once: 2
    source: <binding field, or "default">
    models_source: <binding field for models and effort, or "none: inherited">
    read_only_pieces: {model: <model>, effort: <effort>}   # searches and lookups run as subagents
skill_actions: []            # [{gap: G1, action: fix | extend | new | propose-shared | ask-owner}]
```

### Changes

- <YYYY-MM-DD> topology parallel-sessions -> phase-chain: <the assumption
  that broke, with evidence>.
````

Keep the reasons short and concrete: "L2 edits the same router as L1", not
"risk of conflicts".
