# TaxflowOS architecture

For the current tool coverage and exact functional boundaries, see
[current functionality](FUNCTIONALITY.md). Historical phase records are evidence
for their own checkpoints, not release certificates for the current tree.

This guide describes the current implementation. The
[Phase 0 product blueprint](product/README.md) describes the target product,
navigation, ownership boundaries and acceptance criteria; proposed capabilities
there are not evidence of existing runtime guarantees.

The active application is a Vite/React frontend, an Express API, and PostgreSQL.
Start with `artifacts/ai-workflow-builder/src/main.tsx` and `App.tsx` for browser
routes, and `artifacts/api-server/src/index.ts`, `app.ts`, and `routes/index.ts`
for server routes. Files under `archive/next-api` are historical Next.js handlers;
they are not part of the running application.

## Workspace composition

The active workspace uses Chat as its home and keeps the conversation mounted while
opening detail surfaces. Its primary navigation is Chat, Workflows, Sources and
Connections, with Settings and Help below recent conversations. Agents are managed
from Chat. Run history is nested inside Workflows. The implemented behavior and
remaining journey limits are recorded in
[the Phase 7 record](phase-7-navigation.md).

`features/assistant/workspace/copilot-workspace-panel.tsx` owns this composition and
navigation state. Detail implementations are registered in
`shared/stores/resource-registry.tsx`; the shell does not copy their rules. Direct
routes for Sources, Connections and workflow history open the same registered
surfaces. `/documents` remains a compatibility adapter for older saved links.

The cross-workflow execution list is a read projection owned by
`lib/workflow-core/src/application/queries.ts`. Chat cards, global run history and
workflow results keep the exact run ID. Opening a record changes selection only and
never invokes the execution command.

Interactive Chat and Run views share a saved-version session and component. See
[shared interactive workflow execution](unified-workflow-execution.md) for block
commands, source revisions, checkpoint behavior and runtime boundaries.

## Ownership

Phase 4 adds a portable workflow core and application layer. The full boundary,
compatibility adapters and remaining limits are in [the Phase 4 record](phase-4-workflows.md).
The builder and Chat feed definitions to shared commands; the browser supplies concrete
tools to the graph runner. Neither React nor the model provider is a dependency of
`lib/workflow-core`.

| Responsibility                                                        | Owner                                                                                                 |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Authentication and role policy                                        | `artifacts/api-server/src/security` and `lib/api-zod/src/access.ts`                                   |
| Workspace membership and library claims                               | `artifacts/api-server/src/routes/workspaces.ts`, `workflow-library.ts`                                |
| Browser session gate, workspace selection and cache scope             | `src/platform/auth`                                                                                   |
| Schema history and explicit upgrades                                  | `lib/db/migrations`, `lib/db/scripts/migrations.mjs`                                                  |
| Portable workflow types, backup validation, storage wire contract     | `lib/workflow-contracts`                                                                              |
| HTTP source mapping, connector definitions, exchange-rate fetching    | `lib/source-connectors`                                                                               |
| Agent loop, model policy/catalog, capability contracts and tool ports | `lib/agent-runtime`                                                                                   |
| Scoped agent grants and durable operation receipts                    | `artifacts/api-server/src/routes/agent-actions.ts`, `lib/db/src/schema/agent-actions.ts`              |
| Modular deterministic block executors                                 | `lib/workflow-executors/src/execution/blocks`                                                         |
| Tool composition and result-shape adapters                            | `lib/workflow-executors/src/tools`                                                                    |
| Canvas conversion, workflow factories, publishing, local run storage  | `src/shared/workflow-engine/workflow`                                                                 |
| Graph execution, tool-ID resolution and durable deterministic tools   | `lib/workflow-core/src/core`                                                                          |
| Durable workflow run API, queue and worker                            | `artifacts/api-server/src/routes/workflow-runs.ts`, `src/lib/workflow-runs`, `workflow-run-worker.ts` |
| Drafts, versioning and execution recording                            | `lib/workflow-core/src/application/commands.ts`                                                       |
| Browser tool composition and legacy default expansion                 | `src/shared/workflow-engine/workflow/execute.ts`                                                      |
| Revision/conflict/retry state                                         | `src/features/workflows-hub/services/workflow-sync-service.ts`                                        |
| Browser storage adapter                                               | `src/features/workflows-hub/services/workflow-library-repository.ts`                                  |
| Jotai bindings and UI notifications                                   | `src/features/workflows-hub/workflow-library.ts`, `workflow-execution.ts`, and `workflow-sync.ts`     |
| Builder toolbar rendering and hooks                                   | `src/features/workflow-builder/toolbar`                                                               |
| Calculation editor model, interaction and run presentation            | `src/features/workflow-builder/ui/logic-viewers/calculation-*`                                        |
| HTTP correlation and structured logging                               | `artifacts/api-server/src/observability`, `src/platform/auth/api-fetch.ts`                            |

The `src/` paths in this table are relative to `artifacts/ai-workflow-builder`.
Shared packages must never import application source. The API consumes package
exports; its bundler has no alias into the frontend. Server implementation files
and the model-facing GenUI prompt are owned by the runtime package. Browser code
should import only the catalog/model policy subpaths it needs, not the server agent.

The broad workflow and tool-registry compatibility facades have been retired;
application and integration code import their owning `workflow/*` and `tools/*`
modules directly. `local-tool-runner.ts`, the browser template engine and workflow
commands remain compatibility paths while their callers move to injected
executors. The architecture check prevents retired facades from being recreated or
referenced by active source and browser tests. Resolving a block's tool ID remains
independent of looking up an executor.

## Extending workflows

1. Define the workflow's graph and source data requirements in its template module.
2. Prefer an existing executor. Add definitions, schemas and runners under
   `lib/workflow-executors/src/execution/blocks` for new deterministic behavior.
3. Register that executor explicitly. Duplicate tool IDs and missing alias targets
   fail at initialization; backend adapters replace only their explicitly listed IDs.
4. Add direct calculation/input-validation tests, using independently specified
   expected values. Keep a browser case for any changed upload, editing, navigation,
   approval, persistence, or export behavior.

Build and Run use the same saved-version execution command. Chat uses the same
version and execution-recording rules; template execution still goes through the
deterministic graph runner. Rendering and toast notifications belong in UI adapters.
An explicit missing version is an error, not permission to execute the latest one.

Agent consumers use `lib/agent-runtime` tool definitions with injected workflow
and source ports. Workflow proposals, application, version saves and exact-version
execution remain owned by `lib/workflow-core`. The server derives actor/workspace
scope from the session before checking a durable action grant. A browser approval
receipt is valid only when its operation, agent, capability, resource, revision and
request fingerprint match the workflow command.

## Persisted contracts

The TypeScript domain types in `lib/workflow-contracts/src` are the source for
`generated-schemas.ts`. `pnpm run contracts:generate` derives the Zod validators;
`contracts:check` rejects stale output. The generated schemas are compiled against
the original types, validate nested structures, preserve extension fields, and
restore serialized execution dates. Arbitrary block configuration/output records
remain extensible; each executor owns their block-specific meaning.

Bare libraries are the v0 storage envelope. Portable v1 backups wrap the same
library in `{ format: 'taxflow-workflow-backup-v1', library }`. Unknown envelope
versions fail explicitly. Restore preserves recorded execution provenance, including
the original workflow ID when a workflow is copied or imported. It does not repair
invalid execution graphs or change approval state.

The API validates library envelopes, revisions and the decoded nested backup before
saving the original portable bytes. Compressed/shared-reference payloads have expansion,
depth and reference limits. The browser validates responses before applying them.
Workspace identity is a UUID selected by the browser and authorized against current
server membership; the actor comes exclusively from a Better Auth session. Recovery
codes are accepted only by the explicit one-time legacy claim endpoint.

The sign-in screen also offers a password-free demo through Better Auth guest
sessions. `routes/demo-workspace.ts` provisions one private workspace per guest,
locking the user row so concurrent retries reuse it. Guests use the same scoped
resource APIs, while the server reserves workspace sharing and legacy claims for
email/password accounts. `platform/auth/ui/demo-menu.tsx` provides exit and retention
guidance. No browser flag bypasses session or membership checks.

Sync state belongs to one service instance. Dependencies for storage, transport,
serialization, IDs, and scheduling are injected. A failed save stays dirty; a
revision conflict blocks writes until explicit recovery. Requests from an older
workspace cannot change the current workspace's status or revision. Unreadable
local backups are retained for raw export and cannot be overwritten by an empty
startup fallback.

## Operations and release boundaries

Same-origin browser requests carry a bounded `x-request-id`; the API returns the
accepted value and Pino records it with response time and status. Session-derived
actor and workspace fields may be attached after authentication. Source ingestion
uses its persisted job ID across queue and worker logs. These identifiers support
correlation only and do not participate in access decisions.

Saved workflow versions whose tool IDs are installed in the durable registry can be
queued through `/api/workflow-runs`. PostgreSQL stores the immutable definition,
idempotency key, attempts, cancellation state and result. A worker claims jobs with
`FOR UPDATE SKIP LOCKED`; stalled jobs recover after a worker restart. The Runs view
reads these records independently of the browser that started them.

Browser previews and durable runs inject the same 49-entry registry from
`lib/workflow-executors`. Source acquisition happens before saving; both runtimes
replay pinned inputs. Unknown tools are rejected before enqueue. Missing evidence
and unavailable providers remain explicit failures or warnings.

The operational commands, restoration scope, production payload ceilings and exact
Phase 9 evidence are in [the Phase 9 record](phase-9-operations.md). Source maps are
generated only for a configured Sentry upload and are removed from deployable output.

## Verification and boundaries

Run `pnpm run verify` for schema consistency, architecture rules, formatting of
maintained modules, workspace and test typechecks, and direct unit tests, including
the standalone `test:workflow-core` suite without frontend aliases. Run
`pnpm run test:workflow-reliability` for the browser regressions. Before a release,
run `pnpm run release:check:full`; CI splits the same checks into code/build and
persistence jobs. Browser tests isolate their workflow-library writes.

Architecture checks enforce package separation, UI-free application services,
acyclic runtime imports inside the maintained modules, no explicit `any` or typecheck
suppression there, and fixed size ceilings for existing large files. The checked-in
baseline is a debt ceiling, not a file to regenerate when a check fails. File-size
budgets count nonempty implementation lines, excluding imports and re-exports.

Formatting is enforced on `scripts/maintained-paths.mjs`, including all shared UI
primitives and extracted executors. `shared/ui` is the sole primitive location;
duplicate `components/ui` implementations and import exceptions are removed.
Older feature editors have not received a bulk formatting rewrite.

The `@/app-workspace` entry adapter exports the same shell and Chat components in
both environments. Vite selects eager module loading in development to avoid
unbundled navigation waterfalls, and `app-workspace.production.tsx` selects lazy
production bundles. The reliability suite covers the development adapter;
`test:production-ui` covers the built adapter and its navigation without live APIs.

## Remaining architectural debt

- Several inspector/editor components remain large. Split each with its editing
  regression tests, especially preservation of unsaved drafts and approval invalidation.
- The generated OpenAPI client currently covers health. The durable workflow API now
  shares request, query, identifier, success, error and path contracts; workflow-library
  storage also uses a shared runtime-validated contract. Other legacy REST endpoints
  still use the handwritten platform client and should migrate as changed.
- Shared executors are the sole implementation owners for their registered
  tool IDs. The remaining UI result-shape adapter is a compatibility boundary for
  existing canvas viewers; shrink it as those consumers adopt the modular result.
- Legacy database and worksheet files are included in frontend typechecking.
  Historical Next layouts and auth-only exclusions remain outside this cleanup.
- Workspace roles are enforced at the Express boundary. Email verification/recovery
  delivery and live-provider checks remain separate work. See
  [the access design](phase-3-access.md) and [agent boundary](phase-6-agents.md).
