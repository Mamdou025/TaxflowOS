# Review and completion

Review one coherent change against its named base/checkpoint. The working tree
may contain work from several tasks; a full repository diff is not automatically
the current task's diff. See [Codex review scopes](https://learn.chatgpt.com/docs/code-review?surface=app).

## Evidence to request

- Concrete trigger and before/after behavior, with requirement/journey IDs where useful.
- The owning module and why other files changed.
- Preserved version, backup and interface compatibility, including migrations if required.
- Independently specified expected results and relevant failure-path coverage.
- Exact checks executed, results and what they do not establish.
- Scope of side effects, including data changes or external operations.

## Defects to flag

- Agent tools or UI components implementing their own workflow save/run rules.
- A wrong or absent requested version silently becoming the latest version.
- Missing/invalid input silently becoming sample data or a numeric zero.
- Calculated output becoming approved or server-saved without evidence.
- Historical snapshots changing, stale edits overwriting newer work, or retries
  duplicating external writes with unknown outcomes.
- Retrieved content granting authority, cross-workspace context leaking, or secrets
  entering public client configuration/logs.
- Type suppression, weakened validation/tests, or enlarged debt budgets hiding a failure.
- New navigation conflicting with Chat as home or adding a primary Runs/Overview menu.

Automated formatting and architecture checks handle mechanical rules. Focus human
and agent review on behavior, interfaces and failure cases. Passing tests and a
second review are evidence, not a guarantee of correctness.

## Completion report

State the outcome first, then changes and reasons, verification, and material
limits. Distinguish task changes from existing debt. Do not claim unrun checks,
live-provider correctness from stubs, or real database persistence from the
isolated browser suite. Keep unrelated fixes and dependency updates in separate tasks.
