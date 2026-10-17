# Running a workflow

**Status: derived from code/docs, not yet live-verified — 2026-10-17.** Routes, ownership
and the durable/preview split below are confirmed against `docs/ARCHITECTURE.md`,
`docs/phase-10-durable-execution.md` and the referenced source files. Exact UI steps
(button labels, click order) are not confirmed against a running instance. Run
`scripts/virtual-worker` against a local stack and promote this file to "verified live"
once it's walked, correcting anything below that turns out wrong.

## There are two different "a run happened" paths

1. **Browser preview run.** `executeSavedWorkflow`/`recordWorkflowExecution`
   (`lib/workflow-core/src/application/commands.ts`) append the result to the in-memory
   `PersonalWorkflow.runs` array; a browser sync adapter
   (`artifacts/ai-workflow-builder/src/features/workflows-hub/services/workflow-sync-service.ts`,
   `workflow-library-repository.ts`) persists the whole library (including that run) to
   `workspace_libraries`/`personal_workflow_libraries` as a JSON payload. This path can
   execute any registered tool, including ones that read uploaded documents.
2. **Durable server run.** `POST /api/workflow-runs`
   (`artifacts/api-server/src/routes/workflow-runs.ts`) resolves the authorized workspace
   library, verifies every tool in the requested version has a durable implementation, and
   snapshots the definition into the `workflow_run_jobs` table (migration
   `0005_durable_workflow_runs.sql`). A Postgres-queue worker (`FOR UPDATE SKIP LOCKED`)
   claims and runs it. As of `phase-10-durable-execution.md`, the durable allowlist is only
   `trigger.manual`, `source.manual_value`, and `logic.formula` — any other tool ID in the
   requested version gets a `422` with `unsupportedToolIds` before a job is even created.

**Consequence for provenance/evidence work:** a run that reads an uploaded document (any
source/connector tool beyond `source.manual_value`) is, today, only ever a browser preview
run. If you're looking for where a document-citing run is durably recorded, it isn't in
`workflow_run_jobs` yet — check whether it landed in `workspace_libraries.payload` instead.

## Starting a run

- From Chat: a workflow-choice tool renderer shows catalog records as clickable choices;
  clicking one starts a new run from that template (never infers a saved derivative). A
  saved card offers a separate explicit Resume action and keeps its listed immutable
  version even if a newer one exists.
- From the Workflows hub: `features/workflows-hub/workflow-page.tsx` owns the list +
  selected detail; Build and Run use the same saved-version execution command.
- An explicit missing version is an error, not permission to run the latest one.

## Reading back a run

- The cross-workflow execution list is a read projection:
  `lib/workflow-core/src/application/queries.ts`. Chat cards, global run history, and
  workflow results all key off the exact run ID; opening a record changes selection only
  and never re-invokes execution.
- Owner/Editor roles can start, cancel and retry durable runs; Viewers can read run history
  and results (`phase-10-durable-execution.md`).

## Confirmed dead tables — don't build on these

`workflow_executions`/`workflow_execution_logs` (migration `0000_phase2_baseline.sql`)
have live Drizzle bindings in `@workspace/db` and physically exist in the database, but
nothing under `artifacts/api-server/src`, `lib/workflow-core`, `lib/workflow-executors` or
`lib/workflow-contracts` reads or writes them (checked 2026-10-17; their only writer,
`shared/workflow-engine/runtime/workflow-logging.ts`, imports from
`src/platform/db/schema.ts`, which is `@ts-nocheck`'d and explicitly commented
"server-only file; not compiled in the Vite frontend build" — pre-rewrite Next.js
leftovers under `src/app/`, same category as `archive/next-api`). Real run history lives
in `workspace_libraries.payload`/`personal_workflow_libraries.payload` (JSON) and
`workflow_run_jobs` (durable queue), as above. Re-grep before trusting this if much time
has passed — dead code does occasionally get swept out.
