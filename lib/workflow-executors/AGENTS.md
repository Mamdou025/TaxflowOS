# workflow-executors

The modular deterministic block executors (`src/execution/blocks/**`) and tool composition
/ result-shape adapters (`src/tools/**`) shared by browser preview runs and durable server
runs. See the root [AGENTS.md](../../AGENTS.md) and
[docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) ("Extending workflows" section) first —
that section is the authority on the registration steps; this file only adds what's easy to
get wrong locally.

## The one rule that matters here

Each executor is the **sole** implementation owner for its registered tool ID. Duplicate
tool IDs, or a missing alias target, fail at initialization — not at the call site, not in
a test, at startup. If you're adding a new block type, register its executor explicitly;
don't assume an unregistered tool ID will fall back to anything. If you're replacing an
existing executor, you're removing the old registration in the same change, not shadowing
it.

## Depends on workflow-core and workflow-contracts, not the other way around

`package.json` dependencies: `@workspace/workflow-contracts`, `@workspace/workflow-core`,
`@workspace/source-connectors`. This package implements tools that the graph runner in
`workflow-core` resolves by ID — it does not get imported back into `workflow-core`. If you
find yourself wanting that, the logic probably belongs in `workflow-core/src/core` instead.

## The durable subset is intentionally small

Only tools in `workflow-core`'s durable-tool allowlist (`src/core/durable-tools.ts`) can run
through the server's Postgres-backed queue (`workflow_run_jobs`); everything else is
browser-preview-only today. Adding an executor here does not make it durable — that's a
separate, explicit step (see [phase-10-durable-execution.md](../../docs/phase-10-durable-execution.md)).
Don't assume a new block type is covered by the durable path until you've checked.
