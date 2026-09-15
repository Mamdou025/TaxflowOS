# Reusable task prompts

Use the common frame plus one task-specific block. Replace bracketed fields.
The root [AGENTS.md](../AGENTS.md) supplies stable project rules; avoid copying
the entire conversation into every task. Attach exact errors/examples or mention
relevant files. Reference product requirement or journey IDs when applicable.

These templates adapt the goal/context/constraints/completion structure in
[official Codex guidance](https://learn.chatgpt.com/guides/best-practices) to this
repository. They do not authorize deployment, external communication or live-data
changes merely because the task involves code.

## Common frame

```text
Goal: [Observable user outcome.]
Type: [Correction / Bug fix / Audit / Test / Refactor / Feature / Review / Plan.]
Context: [Files, error, reproduction, fixture, or requirement/journey IDs.]
Scope: [Owners/areas allowed to change and behavior to preserve.]
Done when: [Specific observable acceptance criteria.]

Follow AGENTS.md and identify the owning module first. Distinguish facts,
hypotheses and assumptions. Ask only for missing decisions that materially
affect behavior, permissions, stored data or public interfaces; continue
independent work. State routine reversible choices and proceed.
Surface necessary scope expansion and preserve unrelated changes.
Verify appropriately, review the diff, and report outcomes and limitations.
```

## Correct a known mistake

```text
Current: [Exact incorrect text, value or behavior.]
Required: [Exact correction.]

Inspect related uses, make the smallest coherent correction and preserve
surrounding behavior. Use a proportionate check; add a regression test for
a meaningful behavior bug. Report similar issues outside scope separately.
```

## Investigate and fix a bug

```text
Expected: [...]
Observed: [...]
Reproduction: [Steps, input, environment and frequency.]

Reproduce the issue or establish the strongest available evidence.
Separate symptom from root cause. If reproduction fails, state uncertainty.
Fix the owning component and add a regression test where appropriate.
Check relevant neighboring behavior. A disappearing symptom alone does
not establish the cause. Keep unrelated cleanup separate.
```

## Audit without editing

```text
Perform a read-only audit of [scope].
Assess [correctness / maintainability / data integrity / permissions /
performance / accessibility / test coverage].

Trace actual execution paths and relevant tests. For each finding provide
severity, file/location, a concrete scenario, evidence, confidence,
verification limits and the smallest recommended correction.
Separate confirmed defects, architectural debt and optional preferences.
Prioritize by impact and likelihood. Do not implement fixes.
```

## Run verification

```text
Verify [feature/change] using existing relevant checks.
Do not change application code or weaken tests. Temporary test outputs
and isolated disposable test data are allowed.

Report exact checks/results, what they establish, what remains untested,
failures/flakiness and the smallest next investigation. A check that could
not run is not passed. Do not use live/shared data without task authorization.
```

## Add missing tests

```text
Add coverage for [behavior].
Required scenarios: [Normal, invalid, boundary and recovery cases.]

Specify expected outcomes independently of the implementation. Prefer
direct tests for rules, integration tests for service/database boundaries,
and browser tests for interactions. Preserve application behavior.
If a test exposes a defect, report it before expanding into a fix.
Explain the realistic regression each test would catch.
```

## Refactor while preserving behavior

```text
Refactor [module] to improve [specific maintainability problem].
Preserve: [Behavior, interfaces and saved-data compatibility.]
Target owner/interface: [...]

Inspect behavior and coverage before moving code. Separate responsibilities
with clear interfaces. Avoid unrelated features and dependency upgrades.
Add only meaningful coverage needed to protect the refactor. Verify the
changed owner and affected consumers. Explain the practical reduction in
coupling or complexity; moving files alone is not the acceptance criterion.
```

## Add a feature, block or integration

```text
Implement [feature] for [user scenario].
Inputs: [...]
Outputs/behavior: [...]
Permissions/external effects: [...]
Failure behavior: [...]
Acceptance examples: [...]

Identify the owner and reuse its interfaces. Resolve material missing
product decisions before dependent implementation. Include validation,
error handling and appropriate tests. For integrations, address credential
handling, timeouts, retries, duplicate requests and response validation.
State supported behavior and explicit limitations.
```

## Review a change without editing

```text
Review [exact commit, branch/base or diff] without editing it.
Acceptance criteria: [...]

Check behavior, scope, ownership, saved-data compatibility, permissions,
data-loss risks and meaningful coverage. Separate pre-existing issues from
introduced regressions. Give actionable evidence with severity and list
important verification gaps. Do not stage or revert unrelated changes.
```

## Plan an architectural change

```text
Produce a read-only proposal for [objective].
Describe current ownership, target boundaries/interfaces, alternatives,
tradeoffs, assumptions and unresolved decisions. Give migration steps
that preserve existing behavior, tests/exit criteria per step, and recovery
considerations. Recommend the smallest useful first task.
Do not implement the plan or present proposals as current capabilities.
```

## Example for the next phase

```text
Goal: Test real workflow-library persistence using a disposable Postgres database.
Type: Feature / test infrastructure.
Context: Phase 2; product journeys J-4 and J-5; existing sync and contract tests.
Scope: Test harness, fixtures and necessary test adapters. Preserve API semantics.
Done when: Fresh save/read and conflicting-revision cases pass against an isolated
database, cleanup is scoped, and setup needs no model-provider key or shared data.

Follow the common frame. Report any real API defect separately before expanding
the task into a behavior change. A mocked HTTP response is not proof of persistence.
```
