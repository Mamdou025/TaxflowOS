# Cleanliness and functional readiness — 2026-09-15

## Changes

- Extracted 115 deterministic executor modules into `lib/workflow-executors`.
  Browser previews and server runs share all 49 registry entries. Historical
  editor/test import paths are thin exports, preserving compatibility.
- Formula operands fail when invalid, missing or ambiguous. Removed the unused
  permissive formula helpers and invented scalar defaults. Historical API-reference
  blocks retain their locator without fabricating an exchange rate.
- Browser normalization preserves saved source timestamps during execution.
- Consolidated UI primitives under `shared/ui`; removed all legacy UI import
  exceptions. Extended formatting and architecture checks to shared UI and executors.
- Included legacy database and worksheet code in frontend typechecking and replaced
  the obsolete fake router shim with the real Wouter exports.
- Removed the monolithic CopilotKit chunk. A small entry adapter loads the shell
  and primary Chat eagerly in development and lazily from production bundles.
  Added a production UI smoke test to the release gate and tightened asset limits.
- Added the [current functionality guide](FUNCTIONALITY.md), keeping historical phase
  records distinct from current capabilities. Account functionality is unchanged.

## Verification

The task uses cached Node 24.21.0 and pnpm 10.33.2 through a task-local PATH.
The global runtime was not changed. Frozen installation passed. No shared database
or live-provider operations were used.

| Check                                | Evidence                                                                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm run doctor`                    | Pinned runtime and package manager passed.                                                                                     |
| `pnpm install --frozen-lockfile`     | Passed after adding the internal executor workspace dependency.                                                                |
| `pnpm run verify`                    | Passed: schemas, architecture, formatting, typechecks, 56 unit tests and 19 core tests.                                        |
| `pnpm run test:integration`          | 35 passed, including physical database restoration.                                                                            |
| Focused durable API integration      | Passed again with saved table rows, idempotency, cancellation and restart checks.                                              |
| `pnpm run test:workflow-persistence` | 8 passed; report `test-results/phase2/04a727d1-2d111c15-d07e-4c2a-83cf-dcc7a570ee79`.                                          |
| `pnpm run recovery:verify`           | Frozen backup roundtrip passed.                                                                                                |
| Documentation links                  | 55 local links checked across 9 documents.                                                                                     |
| API and frontend production builds   | Passed on the final application code.                                                                                          |
| `pnpm run performance:check`         | Passed every tightened limit; figures below.                                                                                   |
| `pnpm run test:production-ui`        | Passed Chat, Sources, Connections and run history; report `test-results/phase2/04a727d1-e39e5bb3-1eaf-4e8b-837f-1e37fe2456c6`. |

The first reliability attempt failed during warmup with Chromium
`net::ERR_NETWORK_CHANGED`, before application tests ran. Docker test activity
overlapped that attempt. Subsequent browser suites ran separately from database
startup/cleanup. A deferred shell caused reproducible navigation timeouts; restoring
eager shell loading resolved those. The next full run passed 22 of 23 cases and
exposed an additional Documents-to-Chat loading waterfall, addressed by loading the
primary Chat workspace eagerly in development. Eager production loading and manual
vendor grouping failed the bundle gate, so production retains lazy workspace
bundles through `app-workspace.production.tsx`. Vite selects that adapter for
production; both adapters share the same components. Assertions and timeouts were
not weakened, and the recorded pre-task performance baseline was preserved.

The final full release invocation passed verification, both builds, the performance
gate and production smoke. Its reliability stage passed 22 of 23 cases. The remaining
source-selection failure came from the recovery test mutating a shared fixture into
a deleted source before the next test reused it. The recovery test now copies its
mutable fixtures. The complete source-library file was selected for the follow-up
run, keeping all assertions and timeouts. Full release log:
`test-results/readiness-final-release.log`; follow-up log:
`test-results/readiness-source-recheck.log`.

The follow-up passed all 4 source-library cases, including recovery immediately
followed by saved-source selection, reload and immutable approval inputs. Report:
`test-results/phase2/04a727d1-24d02841-1530-4541-a679-6730d5b7b126`.
The other 19 reliability cases passed in the full run against the same application
code. The entire release command was not repeated after this fixture-only fix.

## Production asset measurements

| Metric                               | Pre-task baseline | Final build |
| ------------------------------------ | ----------------: | ----------: |
| HTML-referenced initial assets       |                20 |           8 |
| Initial JavaScript, gzip bytes       |         1,719,492 |     387,720 |
| Initial CSS, gzip bytes              |            77,851 |      32,466 |
| Largest JavaScript chunk, gzip bytes |           863,560 |     525,655 |

Initial assets are those referenced by the HTML. Chat loads additional bundles on
demand; these figures do not establish total transfer or time to interaction.
Existing source-map reporting, browser externalization and large-chunk build
warnings remain visible. The public build contains no source maps.

## Remaining boundaries

The executor migration preserves existing tool behavior. Live acquisition, native
third-party filing formats and complete tax-return preparation are not added by
server execution. Explicit example data is still identified as such. Provider
tests remain separate from isolated regression evidence. Large feature editors and
their formatting policy remain maintenance work outside the shared UI cleanup.
