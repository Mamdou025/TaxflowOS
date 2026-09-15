# Phase 10: durable workflow execution

This records the initial durable rollout. The later [readiness work](readiness-2026-09-15.md)
extends coverage to the complete shared registry. Use [current functionality](FUNCTIONALITY.md)
for today's supported behavior.

Phase 10 confirms D-01 and introduces a server-owned execution path for immutable
saved workflow versions. The API reads the authorized workspace library, resolves
the exact requested version, verifies that every tool has a durable implementation,
and snapshots that definition into `workflow_run_jobs`.

The request uses a caller-generated UUID as an idempotency key. Repeating the same
workspace, request ID, workflow and version returns the existing run. Reusing the
request ID for a different version fails with a conflict. Owner and Editor roles can
start, cancel and retry runs; Viewers can read run history and results.

The in-process worker is a deployable adapter over the PostgreSQL queue. Claims use
row locking with `SKIP LOCKED`, attempts are bounded, transient throws use exponential
backoff, and a stale-running reaper recovers work after a stopped process. Set
`WORKFLOW_RUN_WORKER=0` when a deployment runs the same worker in a separate process.

The first server-safe tool set is intentionally strict:

- `trigger.manual`
- `source.manual_value`, requiring an explicit finite value from the saved version
- `logic.formula`, supporting add, subtract, multiply, divide and percentage

Any other resolved tool ID produces `422` with `unsupportedToolIds`; no job or sample
result is created. Browser previews remain labelled and available while each remaining
tool is moved behind an injected server adapter and checked for result, evidence,
warning and error parity.

The API contract lives in `lib/api-zod/src/workflow-runs.ts`, including identifiers,
list filters, success and error bodies, and client path construction. Tool-ID
resolution and the portable durable registry live in `lib/workflow-core`; React and
Express consume those exports instead of maintaining separate resolver rules. Three
duplicate legacy browser implementations were removed after the modular executors
became authoritative; registry composition now rejects future ownership overlap.
Database migrations
`0004_auth_timestamps` and `0005_durable_workflow_runs` respectively make Better Auth
timestamps timezone-safe and add the queue without changing applied history.
