# Phase 9 — Operations and release evidence

This is historical checkpoint evidence. Current coverage and tighter performance
ceilings are described in [the readiness record](readiness-2026-09-15.md) and
[current functionality](FUNCTIONALITY.md).

Phase 9 adds operational checks around the existing application without changing
the ownership of workflow execution. Recovery can be rehearsed, requests and
source-ingestion jobs can be correlated, production payload growth is bounded,
and CI invokes the same release commands available to developers.

At the end of Phase 9, decision D-01 remained pending and full workflow runs still
executed in the browser. The later durable-execution work is documented in
[Phase 10](phase-10-durable-execution.md).
The Run surface and nested history now say that the tab must remain open until a
run finishes and distinguish that lifetime from server synchronization of a
completed record. The existing durable document-ingestion queue is not presented
as durable workflow execution.

## Request and job tracing

The browser assigns a UUID to same-origin API calls unless the caller already
provided a request ID. The API validates incoming `x-request-id` values, replaces
unsafe or ambiguous values, returns the accepted ID in every response, and includes
it in Pino request logs. Response time, method, path and status remain structured.
Authenticated logs may also include the server-derived actor, workspace and role.

Request IDs are correlation data. They never grant access and never replace the
Better Auth session or current membership check. Request serializers omit query
values, and logger redaction continues to cover authorization, cookies and response
cookies. API logs carry `service=taxflow-api` and `RELEASE_ID` when deployment sets
it.

Document ingestion now records the durable ingestion job ID when a request queues
work. Worker messages use a child logger containing the job, document, workspace,
attempt and operation identity. No document contents are added to logs.

## Recovery verification

`pnpm run recovery:verify` validates every frozen workflow backup fixture, migrates
it through the current contract, writes and restores the current v1 envelope in
memory, then emits only hashes and record counts to
`test-results/recovery/workflow-backups.json`. An exported JSON backup path may be
passed after `--` to inspect it without importing it into an account:

```sh
pnpm run recovery:verify -- path/to/workflow-backup.json
```

The integration suite also contains a physical Postgres recovery drill. Inside a
disposable container it seeds a workspace library, membership, queued ingestion job
and agent operation receipt, creates a `pg_dump` archive, restores it into a new
database, verifies each record and reruns migration checksum validation. It never
uses an ambient or shared database.

This evidence covers workflow backup compatibility and database restoration. A
deployment still needs its own encrypted backup schedule, retention, access controls,
off-site copy and measured recovery-time objective.

## Performance budgets

[`performance-budgets.json`](performance-budgets.json) records the production build
measured on 2026-09-14. `pnpm run performance:check` parses the built HTML, measures
the assets a browser is told to load, recomputes gzip sizes, checks the workflow
canvas chunk, rejects scaffold metadata and fails if source maps remain in the
public asset directory.

| Metric                         | Measured baseline | Enforced ceiling | Improvement target |
| ------------------------------ | ----------------: | ---------------: | -----------------: |
| Initial JavaScript, gzip       |       1,719,492 B |      1,760,000 B |          900,000 B |
| Initial CSS, gzip              |          77,851 B |         85,000 B |           60,000 B |
| Largest JavaScript chunk, gzip |         863,560 B |        880,000 B |          500,000 B |
| Initial JavaScript, raw        |       5,999,147 B |      6,100,000 B |                  — |
| Workflow canvas chunk, raw     |         174,992 B |        190,000 B |                  — |
| Initial local asset references |                20 |               22 |                  — |

The ceilings are regression limits with small measured headroom, not a claim that
the current payload is fast. The initial JavaScript and largest CopilotKit chunk are
large. The improvement targets make that debt explicit without turning an unproved
hardware timing into a release guarantee. Production builds emit hidden source maps
only when the complete Sentry upload configuration exists; the upload plugin then
deletes them from deployable output.

## Release commands

| Command                              | Scope                                                                                   |
| ------------------------------------ | --------------------------------------------------------------------------------------- |
| `pnpm run release:check`             | Backup verification, `verify`, API/web builds, artifact budgets and browser reliability |
| `pnpm run release:check:persistence` | API/Postgres integration and authenticated browser persistence                          |
| `pnpm run release:check:full`        | Both gates in sequence                                                                  |

The first CI job runs `release:check`; the second runs the persistence gate against
disposable Postgres. Release builds clear ambient Sentry upload credentials so a
verification run cannot upload artifacts. Actual deployment supplies a release ID
and performs monitoring uploads in its separate deployment environment.

## Verification performed

- A normal install updated the internal workspace link, then
  `pnpm install --frozen-lockfile` passed with Node 24.21.0 and pnpm 10.33.2.
- `pnpm run recovery:verify` restored the frozen legacy backup and wrote its
  hash/count report.
- `pnpm run verify` passed: architecture, contracts, formatting, all typechecks,
  44 unit tests and 12 workflow-core tests.
- The API production build passed. The web production build passed in 1 minute
  51 seconds on this machine with existing source-location, browser-externalization
  and large-chunk warnings.
- `pnpm run performance:check` passed the measurements above and found zero public
  source maps.
- `pnpm run test:workflow-reliability` passed all 21 cases in 3 minutes. Evidence
  directory: `test-results/phase2/04a727d1-3d8c158d-87b6-48b9-bc5f-6b4bfe4a9716`.

Docker Desktop's engine was unavailable in this local session, so the new physical
restore drill and the existing authenticated persistence suites were not run here.
They are part of the CI persistence gate; that configuration is not evidence that
the hosted job has passed.
