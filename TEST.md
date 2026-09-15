# Verification

Use [the pinned development environment](docs/DEVELOPMENT.md): Node 24.21.0,
pnpm 10.33.2, `pnpm run doctor`, and `pnpm install --frozen-lockfile`.
Install the browser once with `pnpm exec playwright install chromium`.
Docker Desktop/Engine with Linux containers must be running for database suites.
No development app, environment file, provider account or existing database is needed.

## Choose the smallest useful check

`pnpm run test:production-ui` serves the existing production build and checks Chat,
Sources, Connections and run-history navigation with synthetic API responses. It
catches lazy-chunk initialization failures that a Vite development test cannot.
The release gate runs it after the build and performance check. All external
requests are blocked; its success does not verify live providers.

The unit suite includes full output/warning/error/provenance parity for the 17
executable template snapshots and admission coverage for every shared tool entry.
Database coverage also executes saved table rows through the durable worker.

| Command                              | What it checks                                                                                                                                   | Needs Docker |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| `pnpm run test:unit`                 | Calculation rules, validation, immutable versions, frozen backup migrations, sync failures/races                                                 | No           |
| `pnpm run verify`                    | Toolchain, generated contracts, architecture, maintained formatting, workspace/test types and unit tests                                         | No           |
| `pnpm run test:integration`          | Real API/Postgres saves, revisions, competing writes, workspace roles/claims, migrations/rollback, restarts, query failure and harness isolation | Yes          |
| `pnpm run test:workflow-reliability` | Calculation UI, editor/run state, uploads, review and results; workflow-library HTTP calls are mocked                                            | No           |
| `pnpm run test:workflow-persistence` | Real sign-up/sign-in, account/workspace switching, save/restore, backup import/export, retry, conflicts and large payloads                       | Yes          |
| `pnpm run test:workflow-builder`     | Broader existing browser regression selection, including storage and extraction; owns an API/Postgres stack                                      | Yes          |
| `pnpm run test:phase3`               | `verify`, integration, reliability and persistence in sequence                                                                                   | Yes          |
| `pnpm run recovery:verify`           | Frozen or supplied workflow backups migrate and roundtrip through the current envelope                                                           | No           |
| `pnpm run performance:check`         | Built initial assets, largest chunks, scaffold metadata and public source maps stay within the release policy                                    | No           |
| `pnpm run release:check`             | Recovery verification, direct verification, both builds, performance budgets and browser reliability                                             | No           |
| `pnpm run release:check:full`        | The release gate plus real API/Postgres, physical restoration and authenticated browser persistence                                              | Yes          |

During iteration, select a case without changing its assertions:

`pnpm run test:workflow-core` checks the portable workflow package with no browser,
frontend path aliases or model provider. `verify` includes these tests and
`typecheck:workflow-core-tests`. Adapter parity is checked in `test:unit`; browser
regressions cover the actual Chat handler and Build/Run state transitions.

```sh
pnpm run test:workflow-reliability --grep "the chat handler"
pnpm run test:workflow-persistence --grep "one-megabyte"
pnpm exec node --test --test-name-pattern="simultaneous" tests/integration/workflow-storage.test.mjs
```

Read exact test names before filtering. A filter that selects no tests is not
verification. API integration setup still creates a fresh database for a filtered run.
Cold API bundling and browser dependency optimization can take several minutes on
Windows. Browser warmup is a separate bounded setup step; regression timeouts and
assertions are unchanged. Run focused checks while editing and the relevant complete
suite at the change boundary. See [fixture policy](tests/fixtures/README.md) before adding data.

## Isolation and failure evidence

Each invocation has a workspace hash plus a random run identifier. It owns its
processes, automatically assigned loopback ports, database/container, API build,
Vite cache and report directory. No existing server is reused. Two runs can coexist,
including in the same checkout. Child processes inherit OS/tool settings, not an
ambient `DATABASE_URL`, provider credentials or Sentry upload credentials. Vite does
not read environment files. The browser harness blocks live integration routes.

The API uses its normal application and current schema in a disposable
`pgvector/pgvector:pg16` container. Cleanup checks the container's ownership label
and removes only that container and its volumes. Normal completion and handled
failure stop owned processes and remove the temporary API build. Reports remain.
Forced OS termination/power loss can prevent cleanup; inspect the exact run's label,
process command lines and report before removing anything. Never use broad prune/kill
commands to clean test resources.

Find the printed directory under `test-results/phase2/<run-id>/`. Browser runs retain
JSON and HTML reports, logs and endpoint metadata. Failed tests also retain a trace,
screenshot and video. A browser setup failure retains `warmup-trace.zip` and a
screenshot when possible. Open the actual paths from the report:

```sh
pnpm exec playwright show-report test-results/phase2/<run-id>/html
pnpm exec playwright show-trace test-results/phase2/<run-id>/artifacts/<failed-test>/trace.zip
```

`pnpm exec node scripts/run-browser-tests.mjs probe` is an explicit diagnostic that
deliberately fails to demonstrate artifact retention and cleanup. Its expected exit
code is 1; it is excluded from all passing suites and CI gates.

CI runs verification/builds/reliability and a separate integration/persistence job.
Both upload failure artifacts. This does not imply a hosted CI run has passed locally.

The integration job also creates a physical Postgres archive and restores it into a
second database inside the same disposable container. It verifies workspace data,
membership, a queued source-ingestion job, an agent operation receipt and migration
checksums. See [Phase 9 operations](docs/phase-9-operations.md) for the deployment
recovery limits this local drill cannot establish.

## Boundaries of the evidence

Integration tests use real Better Auth sessions and workspace membership. They check
forged identities, role restrictions, resource isolation, revocation, one-time legacy
claims and database upgrades. Migration tests verify fresh databases and a populated
Phase 2 schema, concurrent/rerun behavior, drift detection and transactional failure.
The reliability suite uses synthetic access responses and mocked library writes;
functional persistence/access tests use real auth and Postgres. Warmup alone mocks
access to prepare browser dependencies, then discards that context.

Demo access has real integration coverage for concurrent workspace initialization,
guest/account isolation, saving, tool access, denied sharing/claims and session
revocation. `demo-access.spec.ts` covers entry without credentials, visible startup
failure/retry, calculation, save/reload, export, exit and a fresh isolated demo.
Run it with `pnpm run test:workflow-persistence --grep "Try demo"` during iteration.

These tests do not migrate or certify a particular deployed database. Follow
[the migration procedure](docs/phase-3-access.md) against a restored copy first.

These suites do not establish live provider correctness, durable parity for every
workflow tool, load limits, all supported document formats or every user journey. The
broader historical specs/configs are not all part of `test:phase2`.

For bundling changes, run the affected production build:

```sh
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/ai-workflow-builder run build
```

The frontend build needs `PORT` and `BASE_PATH` in its environment. The older
`test:api-startup` smoke command requires `TEST_API_BASE_URL` pointing to a deliberately
isolated, provider-free local API. It checks health and anonymous denial, not storage. Authenticated provider-unavailable
behavior is checked in the access integration suite.
See [architecture](docs/ARCHITECTURE.md) for ownership and remaining typecheck exclusions.
