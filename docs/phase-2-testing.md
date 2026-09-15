# Phase 2 — reproducible testing

Phase 2 adds repeatable checks around the current implementation. Ownership is
test infrastructure, workflow calculation/backup contracts and the existing API
storage boundary. Product navigation, agent permissions and workflow execution
semantics were unchanged in this phase. D-01, D-02 and D-03 were pending when this
phase completed; later phase records describe the decisions subsequently confirmed.

## Delivered scope

- Frozen, synthetic legacy backup and arithmetic fixtures with independently
  specified expectations. Direct regression tests check legacy edge aliases,
  history preservation, repeated restore, unsupported formats, zero and negative values.
- Disposable Postgres and the real bundled API: missing/invalid recovery codes,
  exact roundtrips, revision conflicts, competing creates/updates, separate recovery
  codes, deletion, large and empty payloads across restart, query failure/retry,
  and two simultaneously running independent stacks.
- Harness checks for environment credential filtering, output containment,
  failure propagation and cleanup that preserves a neighboring process.
- Browser commands own their server, ports, API build, database, Vite cache and
  reports. They do not attach to an existing development server. Cold browser
  dependency preparation is separated from functional test timeouts.
- JSON/HTML reports and retained failure traces, screenshots and video; a
  deliberately failing opt-in probe verifies the diagnostic path.
- A separate CI integration/persistence job and documented focused/full commands
  in [TEST.md](../TEST.md). No dependency or lockfile update was needed.

Small runtime adapters let a test-owned API child bind a loopback ephemeral port
and report readiness over IPC. Test builds use an invocation-specific output
directory. Normal application startup/build destinations remain the same.
The Windows integration setup exposed a Drizzle schema-glob path issue; normalizing
that path to forward slashes lets the existing schema load on Windows and Linux.

## Verification record

Validation completed on 2026-09-13 on native Windows x64 with Node 24.21.0,
pnpm 10.33.2 and Docker Desktop Linux containers:

| Check                                | Result                                                                                              |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `pnpm run verify`                    | Passed toolchain, contracts, architecture, formatting, workspace/test types and all 25 direct tests |
| `pnpm run test:integration`          | All 11 tests passed, including two independent API/database stacks and cleanup                      |
| `pnpm run test:workflow-reliability` | All 15 tests passed; no retries, skips or flaky results                                             |
| `pnpm run test:workflow-persistence` | Both tests passed against real API/Postgres; no retries or skips                                    |
| Deliberate browser failure probe     | Expected exit 1; nonempty trace, screenshot, video and reports retained; owned port closed          |
| Documentation                        | Seven documents, 40 local links, no broken targets; formatting passed                               |

The four passing commands above were run individually; `test:phase2` composes them
in that order. The API was bundled with the production build configuration inside
each disposable stack. Hosted CI and the entire broader `test:workflow-builder`
selection were not run from this task.

Local browser/stack evidence is retained under `test-results/phase2/` (ignored by Git):

- Integration: `04a727d1-f6b62c5d-8c76-46c3-8985-58fd18d937c5`.
- Reliability: `04a727d1-eee2608b-b8c3-4fb8-82f7-8ee9ffe746ef`.
- Persistence: `04a727d1-846cbc37-7c42-4364-bdff-a4002ff721a8`.
- Expected failure probe: `04a727d1-158a241c-7bdc-4bb2-8095-d8cd96cfafbb`.

Earlier failed setup attempts exposed the Windows schema path, Vite's default-port
fallback, cold dependency preparation and warmup-selector issues. Those were fixed
before the passing runs; regression assertions were retained. After verification,
no labeled test containers or temporary API builds remained. Passing these tests
does not mean the architecture has reached the final product blueprint.

## What remains outside Phase 2

The database is initialized from the current schema using Drizzle push. The
fixture migrations are **saved-backup migrations**, not database upgrades.
Managed database migrations and authenticated workspace authorization are Phase 3.
Today's recovery-code storage uses an anonymous owner; passing separation tests
does not turn it into an authenticated tenant system.

Provider behavior, agent action evaluations, durable execution, load testing,
production deployment and all historical browser specs are outside this gate.
UI recovery tests simulate an offline save and a stale revision; the API suite
also exercises a real failing database query. Neither establishes every network
or database failure mode. Application test data is synthetic and discarded.

The development branch and real Git index are preserved. The Phase 1 checkpoint
remains the recovery baseline; no push or deployment is part of this phase.
