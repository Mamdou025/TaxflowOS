# workflow-core

Portable graph engine and application layer: drafts, versions, execution recording,
calculation resolution, field-worksheet projection. See the root [AGENTS.md](../../AGENTS.md)
for repo-wide rules and [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) for how this
package fits the running app.

## The one rule that matters here

This package has exactly two dependencies: `@workspace/workflow-contracts` and `zod`
(see `package.json`). No React, no model provider, no HTTP client, no database client —
not even transitively. `scripts/check-architecture.mjs` enforces this at the import-graph
level and will fail the build before you find out at runtime. If a change here seems to
need a browser API, a fetch call, or a DB handle, that logic belongs in an adapter
(`artifacts/api-server`, `artifacts/ai-workflow-builder/src/shared/workflow-engine`), not
here — inject it through `src/core/ports.ts` instead.

## Layout

- `src/core/` — pure graph/calculation primitives (graph validation, tool resolution,
  calculation input rules, formula references, edges, outputs, durable-tool allowlist).
- `src/application/` — commands and queries that operate on a `PersonalWorkflow` entry
  (`commands.ts`: `createWorkflow`, `replaceDraft`, `saveVersion`, `recordWorkflowExecution`,
  `executeSavedWorkflow`; `queries.ts`: the cross-workflow execution read projection).

## Exports are explicit, not a barrel

`package.json#exports` lists each public subpath individually (`./commands`, `./graph`,
`./sessions`, etc.). Adding a new consumer-facing module means adding its subpath there —
deep-importing `src/...` from outside the package is not the supported path and the
architecture check treats package boundaries as load-bearing.

## Execution recording is in-memory, not a DB write

`recordWorkflowExecution` (and `executeSavedWorkflow`) append to the `runs` array on the
in-memory `PersonalWorkflow` object and return a new copy (`structuredClone`) — they don't
touch Postgres. The caller (a browser sync adapter, or the API's durable-run worker) is
responsible for persisting the result. Don't assume a run recorded here is durable until
you've checked who calls it.

## Before changing a persisted type

Anything under `lib/workflow-contracts/src/domain` that this package consumes is a
persisted-type contract — see [workflow-contracts/AGENTS.md](../workflow-contracts/AGENTS.md)
before touching its shape.
