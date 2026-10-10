# Editable InScope workspace in ChatGPT

The user wants to replace a wrong trial balance or change an FX rate while keeping
the same conversation, workflow and unaffected work. On 2026-10-08 the user chose
**review changes, then recalculate**. This extends the existing private reader;
it does not create another chat UI or another workflow engine.

## Behavior and ownership

The embedded panel contains Workflow, Inputs, Sources and Changes. Starting work
creates a paused core session from the selected immutable version. Its exact
workspace/workflow/version/run identity remains attached to the panel and model
context. Inputs show current values and run overrides. Sources distinguish current
and replaced attachments, with bounded previews and exact-source paging. Changes
show applied edits separately from execution attempts. ChatGPT controls panel
placement; the app cannot pin its own native header above the conversation.

Commands that start, stage or change work are app-only: the user operates the
embedded panel, which receives their results in place. Chat receives the exact
selected context, whether drafts exist and the safe pending review (never its
apply token). It can explain those changes and read the saved run. This avoids a
chat-created proposal that the existing widget cannot retrieve or display.

An input edit or captured source replacement produces a review with before/after
values and affected blocks. Apply consumes that exact review, persists the new
session revision and leaves the run paused. Core invalidates the changed block and
active descendants, clears affected reviews/approval and retains prior evidence.
Recalculate is a separate explicit command, using captured inputs through the
existing deterministic executors. It stops at missing inputs, unsupported tools,
errors and review gates. Computation does not approve the result.

The workflow core owns these rules. The API adapter owns authorization,
transactions, operation receipts and transport. Sources own original-file storage;
portable workbook parsing lives in `lib/source-connectors`. The widget owns drafts,
selection and presentation only. Normal application menus and its numeric-input
auto-resume adapter are unchanged; the plugin deliberately uses the selected
manual-review policy.

## Access, files and retained state

- Existing `inscope.workflows:read` grants remain read-only. Write and execute
  scopes require fresh explicit consent and current Owner/Editor membership.
  Scope enforcement happens on commands, including case/trailing-slash routes.
  Neither an actor ID nor a browser role grants authority.
- Reviews expire after 15 minutes and bind actor, workspace, payload, session
  revision and workspace-library revision. Stale edits fail. Successful start,
  apply and recalculation retries reuse persisted receipts.
- File bytes are uploaded in ordered 48 KiB chunks, never supplied as model-made
  rows. Staging is actor/workspace/run/source-bound, limited to 20 MB per file and
  four incomplete uploads. Staged captures expire after one hour; expired actor
  uploads are removed on a later upload. They do not replace the active source.
- Workbook selection includes sheet, header, columns and currency. The same
  financial normalization is used in browser and server adapters: debit/credit
  signs, account filtering, missing values and row locations remain consistent.
  Duplicate column names now fail explicitly instead of ambiguously overwriting
  a column. Server workbooks are bounded to 50,000 data rows and 500 columns.
  ZIP-based inputs are checked against 64 MiB of verified expanded content and
  2,048 entries before parsing; unsupported/encrypted/ZIP64 archives are rejected.
- JSON, Excel, text PDF and Word are supported. Empty/scanned PDF evidence fails
  with an OCR requirement. Capture records filename, hash, extraction and source
  locations. Configured Sources storage preserves the original and queues its
  ordinary indexing flow. An unavailable original store is visibly reported as
  `ORIGINAL_NOT_STORED`; extracted evidence can still be reviewed and attached,
  matching the existing InScope capture behavior.
- Saved definitions and prior runs are not rewritten. The current working
  session remains the same through corrections. An ended session stays historical.
  Backups retain their existing format; new command receipts/edit history are
  separate database records and are not exported in the workflow-library backup.

## Current limits

Recalculation is a bounded synchronous pass over local/captured-data executors,
not a new durable background job. Unsupported acquisition/AI tools stop visibly.
The adapter does not edit workflow rules, save a new definition version, acknowledge
review gates, approve results, save generic notes, run Sina/MicroSina or perform
computer tasks. Users can inspect the full graph, but record previews are bounded;
source detail uses paging. No complete audit of input edits made before this
adapter existed is invented.

The isolated private pilot now serves the updated viewer/backend. Package 1.0.3
is prepared but has not been uploaded, and the existing ChatGPT grant remains
read-only. Live editing acceptance still requires package refresh, explicit
expanded consent and a real ChatGPT interaction. Installing a new skill does not
change an old grant. No production deployment, commit or push is part of this
change. Live provider/storage behavior is not established by disposable tests.

## Verification record

`pnpm run verify` passed: doctor, generated contracts, architecture, maintained
formatting, library/application/test typechecks, 211 unit tests, 37 worker tests
and 50 core tests, including the final retry fixes. Final viewer-context changes
also passed frontend/test typechecks and formatting. The viewer production build and all 14 embedded-panel
browser cases passed, including selected-step/pending-review context, draft
preservation, exact source paging and saved-operation refresh recovery.

The full disposable-database integration run passed 85 of 86 tests. Its sole
failure was the old viewer metadata expectation; the explicit contract was
updated for v3 and all 7 tests in that affected MCP file then passed. The suite
also covered OAuth scope enforcement (14 tests), trusted source lifecycle (3),
real PostgreSQL session CAS/receipt replay/role checks, migrations and physical
recovery. No assertion was removed to obtain those results.

The normal frontend production build passed (15m34s), with existing sourcemap,
browser-externalization and large-chunk warnings. All six consent browser cases
and both selected existing upload/edit reliability cases passed. The broader
persistence suite finished with 5 passing and 3 failing cases. It passed
cross-browser recovery, backup, offline retry,
revision conflict and one-megabyte payload cases. Two demo-recovery cases retain
an older alert-text expectation already inconsistent with the unchanged provider
message in `HEAD`. A third demo case exhausted its unchanged 300-second budget
during slow Vite module loading: result 60, server save, reopening, export and a
new demo identity passed, but the final cross-workspace denial was not exercised.
Those unrelated tests and timeouts were not altered. Both final indexing-failure
unit cases passed. The final source integration passed 3/3 in 91.98 seconds,
including PostgreSQL JSONB selection-order retry and different-sheet rejection.
An earlier attempt exhausted its existing setup deadline while builds competed;
rerunning after they finished passed without changing timeouts or assertions.
The final API production build passed in 36.1 seconds. The host harness uses
synthetic records; it does not prove live ChatGPT editing behavior.

## Private-pilot handoff (2026-10-08)

The existing isolated `inscope_pilot` database was verified against its named
container label and loopback port, backed up, then upgraded through the managed
migration runner from 11 to 14 migrations. Before/after comparisons confirmed
identical workflow-library payload/revision and identical grant scopes/revocation
state. No run was started or recalculated. The private API restarted successfully.

An authenticated read-only probe through the existing public HTTPS endpoint
returned all 14 descriptors and the v3 viewer (2,959,225 bytes). Only explicit
`open_workflow_view` carries a viewer template; all eight start/stage/mutation
tools are app-only. The exact saved FAPI version 1 still has 12 blocks, 14 edges,
library revision 1 and no runs. This probe used a fresh owner browser session,
which has owner write/execute capabilities; it is not evidence of elevated
ChatGPT OAuth access. The active OAuth grant was separately confirmed to retain
only `inscope.workflows:read`, and the previously revoked grant remained revoked.

The prepared `.local/chatgpt-pilot/branding/inscope-private-pilot-1.0.3.zip` retains
the existing app mapping and canonical InScope icon and includes the current
guidance. Its manifest descriptions now explain permission-based editing instead
of the former unconditional read-only scope. Its SHA-256 is
`cb8f5712da51a5cdbb7014c81cd0c3400880f1456bdd6c564c56a1612b69dffa`.
Upload it in the existing plugin's settings, reconnect with the additional
write/execute consent, then explicitly open the workflow once in the existing
chat. No new conversation is required. Windows computer control timed out even
after its prescribed reset/retry, so package installation and human consent were
not performed or claimed. Live provider storage, a real user file and this
editable flow inside ChatGPT remain unverified.

Ignored pilot tooling changes are local to this test runtime:
`upgrade-workspace-pilot.mjs` adds a verified-target backup/migration helper;
`inspect-mcp-discovery.mjs` now checks v3 and the exact saved version/history
without editing them. Their reports, the database backup and package-validation
report remain in the ignored pilot directory, alongside its protected credentials.

## Changed-file meanings

The working tree already contained the plugin foundation and many unrelated
workflow/worksheet/API-source changes. The following inventory describes this
follow-up only; it does not claim those earlier changes as new work.

OAuth backend, consent UI, scope migration and their tests have a file-by-file
inventory in [the account-linking guide](chatgpt-account-linking.md#scope-expansion-verification-and-changed-files).

| File                                                                                             | Purpose and before/after behavior                                                                                                                                              |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `artifacts/api-server/src/routes/chatgpt-plugin.ts`                                              | Previously injected a read port only; now composes authenticated session/source commands, current-role/scope checks, capabilities and session history.                         |
| `artifacts/api-server/src/lib/chatgpt-plugin/server.ts`                                          | Registers separately scoped commands and app-only mutation controls; only explicit open returns a viewer. The resource moves to v3.                                            |
| `artifacts/api-server/src/lib/chatgpt-plugin/read-tools.ts`                                      | Keeps exact-record reads, adds current permissions/history and source paging, and projects large evidence rather than duplicating full source rows into the viewer.            |
| `artifacts/api-server/src/lib/chatgpt-plugin/view-projection.ts`                                 | New bounded view/read projection with active/replaced source summaries, real attempt history and explicit omitted-collection counts. Graph rules are preserved.                |
| `artifacts/api-server/src/lib/chatgpt-plugin/write-tools.ts`                                     | New strict command dispatch and result wrapping. Applies authority checks before work, returns persisted receipts and distinguishes saved-but-refresh-failed outcomes.         |
| `artifacts/api-server/src/lib/chatgpt-plugin/session-types.ts`                                   | New adapter contracts for actors, exact revisions, reviews, receipts, history, store and trusted captures; no alternate persisted workflow format.                             |
| `artifacts/api-server/src/lib/chatgpt-plugin/session-service.ts`                                 | New server adapter to core start/change commands, exact review/apply, idempotency and explicit bounded recalculation. Previously these commands were browser-owned.            |
| `artifacts/api-server/src/lib/chatgpt-plugin/session-store.ts`                                   | New transactional adapter to the existing workspace-library CAS boundary and operation ledger, rechecking current role in each transaction.                                    |
| `artifacts/api-server/src/lib/chatgpt-plugin/session-runtime.ts`                                 | New server runtime using the shared registry through an explicit local/captured-data allowlist; unavailable tools stop rather than substitute data.                            |
| `artifacts/api-server/src/lib/chatgpt-plugin/source-captures.ts`                                 | New authenticated chunk staging, inspection/capture and target-bound extraction lookup; staging does not mutate a workflow.                                                    |
| `artifacts/api-server/src/lib/chatgpt-plugin/source-parser.ts`                                   | New server file adapter using canonical workbook normalization and existing text extraction; rejects ambiguous/oversized/unreadable evidence.                                  |
| `artifacts/api-server/src/lib/chatgpt-plugin/source-archive-budget.ts`                           | New bounded ZIP validation before server parsing, including actual inflated size and local/central consistency. No financial normalization changes.                            |
| `artifacts/api-server/src/lib/chatgpt-plugin/source-original.ts`                                 | New bridge to existing private Sources storage/indexing. Confirms original storage separately from captured extraction and reports failures.                                   |
| `artifacts/api-server/src/lib/chatgpt-plugin/source-indexing-status.ts`                          | New post-storage failure handler. An indexing/failed-status double failure reports search unavailability without relabeling a confirmed stored original as missing.            |
| `artifacts/api-server/src/lib/chatgpt-plugin/credential-projection.ts`                           | Preserves worksheet column titles named `headers` while continuing to remove credential-shaped fields and HTTP headers.                                                        |
| `lib/db/migrations/0012_chatgpt_session_operations.sql`                                          | Additive reviewed-operation/idempotency/history storage; does not edit applied migrations or workflow backups.                                                                 |
| `lib/db/migrations/0013_chatgpt_source_captures.sql`                                             | Additive bounded actor/workspace upload staging and captured extraction storage.                                                                                               |
| `lib/db/migrations/meta/_journal.json`                                                           | Registers new migrations after prior history; earlier entries remain intact.                                                                                                   |
| `lib/db/src/schema/chatgpt-session-operations.ts`                                                | Mirrors the new operation ledger contract.                                                                                                                                     |
| `lib/db/src/schema/chatgpt-source-captures.ts`                                                   | Mirrors the source staging table and bounds.                                                                                                                                   |
| `lib/db/src/schema/index.ts`                                                                     | Exports the new schemas; existing unrelated schema edits are preserved.                                                                                                        |
| `lib/source-connectors/package.json`                                                             | Exposes portable workbook modules; no dependency or version change.                                                                                                            |
| `lib/source-connectors/src/workbook-types.ts`                                                    | Moves workbook data types into their portable owner; no intended behavioral change.                                                                                            |
| `lib/source-connectors/src/workbook-values.ts`                                                   | Moves existing financial normalization helpers unchanged; shared by browser and API.                                                                                           |
| `lib/source-connectors/src/workbook.ts`                                                          | Moves table selection/config normalization and injects the file reader; preserves normal parsing behavior.                                                                     |
| `lib/source-connectors/src/workbook-upload.ts`                                                   | Shares existing upload normalization/provenance; adds explicit duplicate-header rejection.                                                                                     |
| `artifacts/ai-workflow-builder/src/shared/workflow-engine/parsing/excel-types.ts`                | Becomes a type facade; existing consumers retain the same import path and contract.                                                                                            |
| `artifacts/ai-workflow-builder/src/shared/workflow-engine/parsing/excel-utils.ts`                | Retains browser SheetJS acquisition and workbook-rule import helpers while delegating shared normalization; no intended financial-result change.                               |
| `artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs/parse-upload.ts` | Becomes the browser facade for the shared upload parser; existing calls retain their shape.                                                                                    |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/view-contract.ts`                     | Retains verified capabilities, revisions and richer inputs/sources/history that the earlier schema stripped.                                                                   |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/workbench-contract.ts`                | New strict review/source/history DTO validation and failure parsing.                                                                                                           |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/host-bridge.ts`                       | Adds exact-context tool commands and in-place updated snapshots, preserving selection and handling saved-operation refresh failures.                                           |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/workflow-viewer.tsx`                  | Adds four persistent panels and context synchronization around the existing Steps/Canvas view.                                                                                 |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/viewer-header.tsx`                    | New compact identity/access/action header shared across panels.                                                                                                                |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/use-workflow-actions.ts`              | New reviewed command lifecycle, retry identities, stale-review checks and separate recalculation.                                                                              |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/input-panel.tsx`                      | New input values/provenance and preserved local drafts; zero remains distinct from missing.                                                                                    |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/source-panel.tsx`                     | New current/replaced source listing and controlled source import.                                                                                                              |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/source-detail.tsx`                    | New exact-source evidence paging without opening another viewer or chat.                                                                                                       |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/source-import-form.tsx`               | New file-selection/staging/capture interface; cancellation and failure retain the active source.                                                                               |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/source-upload.ts`                     | Sends selected file bytes in verified ordered chunks; no model-supplied extraction.                                                                                            |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/workbook-selection.tsx`               | New explicit sheet/header/column/currency selection before capture.                                                                                                            |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/change-panel.tsx`                     | New before/after review, impact list, Apply action and truthful applied-change/attempt history.                                                                                |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/step-navigator.tsx`                   | Updates step-detail guidance to distinguish permitted run-input changes from read-only graph inspection; existing status rules remain.                                         |
| `artifacts/ai-workflow-builder/src/features/chatgpt-plugin/viewer.css`                           | Styles the added panels, forms, review states and source tables; does not style native ChatGPT chrome.                                                                         |
| `plugins/inscope/skills/review-workflow/SKILL.md`                                                | Replaces unconditional reader-only guidance with actual-capability checks, same-run corrections and review-before-recalculation. Backend agents are unchanged.                 |
| `tests/unit/chatgpt-plugin.test.ts`                                                              | Adds large-source, historical-read and safe-header projection regressions; no production behavior change.                                                                      |
| `tests/unit/chatgpt-session-commands.test.ts`                                                    | New command invariants, role/revision/retry/source/FX and manual-execution tests; no production behavior change.                                                               |
| `tests/unit/chatgpt-source-archive.test.ts`                                                      | New real XLSX/ZIP allocation, expansion and archive-limit regressions; no production behavior change.                                                                          |
| `tests/unit/chatgpt-source-indexing.test.ts`                                                     | New indexing/status double-failure and unchanged successful-path regressions; no production behavior change.                                                                   |
| `tests/unit/chatgpt-source-parser.test.ts`                                                       | New file normalization/provenance, explicit selection, duplicate-column and OCR failure coverage; no production behavior change.                                               |
| `tests/integration/chatgpt-plugin.test.mjs`                                                      | Updates explicit tool contract and checks Viewer denial of all commands on route variants; no validation weakening.                                                            |
| `tests/integration/fixtures/chatgpt-session-store.ts`                                            | Synthetic real-database session fixture and assertions; no production behavior change.                                                                                         |
| `tests/integration/chatgpt-session-store.test.mjs`                                               | New real PostgreSQL command persistence/CAS/concurrent receipt/role/rollback checks; no production behavior change.                                                            |
| `tests/integration/chatgpt-sources.test.mjs`                                                     | New real source staging/ownership/bytes/review/replacement/history checks, including identical workbook capture retries after JSONB reordering; no production behavior change. |
| `e2e/chatgpt-workflow-viewer.spec.ts`                                                            | Adds panel/context/draft/review/manual-recalculate/upload-cancellation coverage in the host harness.                                                                           |
| `scripts/format-maintained.mjs`                                                                  | Batches the same complete formatting target list below Windows command-line limits. No files/checks are removed; fixes the ENAMETOOLONG failure exposed by the added modules.  |
| `docs/product/decisions.md`                                                                      | Records the user's C-10 manual-review decision and acceptance criteria; no runtime behavior change.                                                                            |
| `docs/ARCHITECTURE.md`                                                                           | Updates adapter, command, source-parser and storage ownership; no runtime behavior change.                                                                                     |
| `docs/FUNCTIONALITY.md`                                                                          | Distinguishes current editable code from earlier live reader evidence; no runtime behavior change.                                                                             |
| `docs/chatgpt-plugin.md`                                                                         | Links this follow-up and corrects stale earlier guidance-activation status; no runtime behavior change.                                                                        |
| `docs/chatgpt-workspace-editing.md`                                                              | Records behavior, limitations, verification and file meanings for this follow-up; no runtime behavior change.                                                                  |
