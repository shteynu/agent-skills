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
    skills: [<skill>, <skill>]
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
skill_actions: []            # [{gap: G1, action: fix | extend | new | propose-shared | ask-owner}]
```

### Changes

- <YYYY-MM-DD> topology parallel-sessions -> phase-chain: <the assumption
  that broke, with evidence>.
````

Keep the reasons short and concrete: "L2 edits the same router as L1", not
"risk of conflicts".
