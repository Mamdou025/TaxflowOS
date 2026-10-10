# Chat context and workflow integration

This increment implements the user's approved lightweight context and consistent
workflow interaction plan. Chat remains home, with assistant-ui for conversation
presentation, existing Sina/MicroSina and Computer controls, and application-owned
workflow execution. Company and year are labels only. Sample data is used only in
isolated checks or when a user explicitly adds the labeled text example.

## Behavior and ownership

- Explicit source references, company/year labels and the current workflow selection
  belong to the chat. A new chat clears them; restoring a chat restores its recorded
  references. Selecting a company does not retrieve unrelated company documents.
- Sources and Chat share attachment handling. Text can be created directly; saved
  documents use **Use in this chat**. Revision/hash changes fail visibly. Local text
  snapshots are bounded; local workbooks require their account/workspace browser cache.
- Workflow choices preserve exact IDs and listed versions internally. A built-in
  template creates a fresh instance; an explicit Resume action returns to one exact
  run. Clicks add a deterministic application acknowledgment and context for the next
  model request. They do not create an extra model turn or calculate/approve results.
- Shared Chat/Run timelines expose saved formulas, configured rules, recorded input/
  output evidence and stale states within expanded blocks. Forms retain their drafts.
  FAPI stage layout is recognized separately from specialized worksheet compatibility.
- Calculation, validation, recalculation, review and export stay with Workflows.
  Arbitrary agent prose does not replace prescribed FAPI/Field worksheets. The optional
  generated-view renderer remains available and is loaded on demand.
- Access checks remain on the server. The public startup surface can paint before the
  chat module finishes loading; this does not grant workspace access prematurely.

## Loading investigation

The baseline is a fresh production build of the working tree before this increment's
source edits, rather than a comparison with an unrelated deployed revision. Browser
probes use isolated synthetic responses, block external requests and retain actual
requested-script sizes. A populated case contains 100 workflows with three saved
versions each and no runs or result payloads. Browser HTTP mocking disables its HTTP
cache, so retained-menu reentry is not evidence of a warm HTTP-cache load.

Baseline Chat requested 27 scripts / 6,713,101 decoded bytes. The measured production
build requests 27 scripts / 5,125,528 decoded bytes: 1,587,573 fewer bytes. The optional
generated-view renderer's 1,549,736-byte chunk is absent from startup requests.
Workflow navigation also subscribes to names/IDs rather than every result edit.

The large `mermaid-*` filename is misleading: Rollup placed shared application and
chat-provider code in that chunk. It is not a measurement of Mermaid core alone.
The real `mermaid.core` module is dynamically loaded and absent from startup requests.
The installed chat-provider package still includes built-in Markdown/diagram UI
through its monolithic provider export. A further headless-provider migration needs
separate compatibility tests; splitting chunks just to satisfy a size number would
not remove startup work.

A populated reload CPU profile identified repeated Zod schema construction during
library validation. Generated lazy factories now construct each schema once, retaining
lazy recursive references and validating each incoming value. No parsed data is cached,
no storage format changes, and no writes are delayed. On the isolated source benchmark,
plain validation changed from 4726/1989/1215 ms to 1202/598/701 ms across three passes;
compressed-library validation changed from 3451/1775/1256 ms to 481/547/502 ms. Host
load varies substantially; these are diagnostics, not a promised user-facing percentage.

Both fresh production builds and navigation smoke runs passed. The asset gate still
fails on the shared chunk: before 3,754,999 raw / 1,105,681 gzip bytes; after 2,175,031 /
648,177 bytes; limits remain 1,900,000 / 560,000. The other six asset metrics pass.

Same finalized isolated loading probe (milliseconds; single observed samples):

| Measurement                                     | Before | After |
| ----------------------------------------------- | -----: | ----: |
| Populated fresh Chat typing readiness           |   8390 |  2558 |
| Populated first Workflows open                  |    874 |   674 |
| Populated retained Workflows reentry            |    698 |   509 |
| Populated saved-library reload typing readiness |  11194 |  2833 |
| Populated reload main-thread long tasks         |   7724 |  1197 |
| Empty-library reload typing readiness           |   3437 |  1540 |

Before artifact: `test-results/phase2/04a727d1-f36f6887-6d14-480e-95ea-58346964657c`.
After artifact: `test-results/phase2/04a727d1-c6e0939b-481f-49b1-8a7f-34df0cc58ae3`.
No clean development-server before/after benchmark was captured. Cold development
test preparation failures are not production navigation timings. These probes mock
API latency and provider availability; deployed-server performance remains unverified.

## Changes in this increment

The checkout already contained extensive unrelated and earlier requested changes.
Task-start file hashes and copies were captured in the local temporary directory
`taxflow-chat-workflow-baseline-1791598336877`; this inventory describes this increment's
delta against that snapshot, not every difference from Git HEAD. No commit, push or
deployment is authorized or performed.

Paths below are relative to the repository. Each row identifies purpose and before/
after behavior. Newly extracted helpers have no behavior outside their stated caller.

### Chat and context

| File                                                                                              | Purpose and before/after behavior                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/chat-context-model.ts`         | New validated metadata contract: replaces implicit ambient context with explicit label/source references, bounded local text and current selection; rejects malformed restore data and preserves all existing workbook mapping fields, including account type. |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/chat-context-store.ts`         | New per-chat context/loaded-source state and epoch boundary; attachment/removal/restoration synchronizes existing source adapters without choosing unrelated files.                                                                                            |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/chat-context-sources.ts`       | New shared attachment/restoration owner; exact saved revision and original bytes are checked, with honest local-only or unavailable outcomes.                                                                                                                  |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/chat-context-projection.ts`    | New bounded model-readable projection: labels, explicitly selected text/status and workflow receipt, with no ambient company dataset.                                                                                                                          |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/use-chat-context.ts`           | New single v2 registration and source restoration hook; refreshes selected context synchronously before send instead of waiting only for React effects.                                                                                                        |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/workflow-interaction.ts`       | New validated application-selection receipt with exact identity/version/run and success/failure; never infers a replacement run.                                                                                                                               |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/workflow-interaction-store.ts` | New receipt writer reads the actual selected saved version and records an acknowledgment; does not run calculations.                                                                                                                                           |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/message-codec.ts`              | Conversation codec excludes context metadata from reconstructed user/model messages while persistence retains it.                                                                                                                                              |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/source-selection.ts`           | Source selection routes through explicit chat attachment state rather than silently relying on a globally selected source.                                                                                                                                     |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/use-chat-persistence.ts`       | Saves/restores context alongside exact workflow bindings, including label-only chats; new-chat and switching boundaries clear or invalidate context work. Existing history API remains the owner.                                                              |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/use-assistant-ui-runtime.ts`   | Adds a stable display-only application receipt anchored to the click's conversation position; it is not an assistant-authored/model turn.                                                                                                                      |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/workflow-chat-instructions.ts`      | Both providers receive exact-selection/start/resume guidance and must respect failed/draft selection semantics instead of guessing among copies.                                                                                                               |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-thread.tsx`                    | Mounts the context strip and displays honest unset company/year labels; mobile controls wrap and menus fit the viewport. Company selection does not automatically read documents.                                                                              |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/chat-context-strip.tsx`                  | New collapsible visible context controls with selected source status, removal/retry and Add text.                                                                                                                                                              |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-ui-composer.tsx`               | Keeps assistant-ui attachment/composer behavior while connecting workflow scope selection to the explicit chat context.                                                                                                                                        |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-ui-transcript.tsx`             | Renders application workflow acknowledgments separately from Sina/MicroSina prose.                                                                                                                                                                             |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/workflow-choice-model.ts`                | Adds exact Resume resolution and rejects ended/missing runs without changing another session.                                                                                                                                                                  |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/workflow-choice-list.tsx`                | Built-in/saved starts, draft opens and Resume controls are distinct; clicks record outcomes. Cards share the chat busy state, so a card mounted during a reply unlocks when it finishes.                                                                       |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/chat-workflow-thread.tsx`                | Returning to a historical workflow card validates and acknowledges the exact run before binding it.                                                                                                                                                            |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/chat-source-picker.tsx`                  | Existing saved-source choices use the same explicit attachment path and user-facing action.                                                                                                                                                                    |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/composer-menus.tsx`                      | Legacy composer scope/source controls write the same explicit context instead of a separate implicit selection.                                                                                                                                                |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/data-files-panel.tsx`                    | Files reflects explicitly selected chat sources; removing an item removes its chat context.                                                                                                                                                                    |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/memory-copilot.tsx`                      | Stops silently publishing saved memories as current context; does not delete stored memory records.                                                                                                                                                            |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/use-assistant.tsx`                       | Uses shared explicit attachment/publication, records template launches, removes ambient computed previews and lazily loads generated views. Owns the shared pending-reply/restoration lock; agent transport remains unchanged.                                 |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/use-session-tools.tsx`                   | Explicit open/start commands prepare fresh sessions for the requested template/version instead of accidentally reusing the last session.                                                                                                                       |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/use-workspace-retrieval-tools.ts`        | Document retrieval is restricted to ready, explicitly selected saved sources and validates returned revisions. Company labels no longer imply document search scope.                                                                                           |
| `artifacts/ai-workflow-builder/src/features/assistant/workspace/document-viewer.tsx`              | Viewing a document no longer attaches it automatically; explicit Use in this chat shares attachment handling. A chat switch cancels an in-flight addition, including file preparation before extraction.                                                       |
| `artifacts/ai-workflow-builder/src/features/assistant/workspace/workflow-run-flow.tsx`            | Legacy flow omits a year-dependent live FX configuration when year is unset rather than inventing a year.                                                                                                                                                      |
| `artifacts/ai-workflow-builder/src/components/global-client-switcher.tsx`                         | Company/year editor uses freeform labels for this chat instead of implying a populated company data system.                                                                                                                                                    |
| `artifacts/ai-workflow-builder/src/shared/stores/nav-store.ts`                                    | Company/year defaults can be unset and are controlled by chat context; no sample company/year is silently selected.                                                                                                                                            |
| `artifacts/ai-workflow-builder/src/shared/stores/workspace-store.ts`                              | Retains source identity/revision/byte provenance needed by explicit attachment restoration; existing workspace isolation stays in place.                                                                                                                       |

### Sources and workflow presentation

| File                                                                                      | Purpose and before/after behavior                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `artifacts/ai-workflow-builder/src/features/documents/source-text-form.tsx`               | New named text form uses normal source upload and offers an explicitly labeled optional sample; never autofills missing user data.                                                                                                                                                                                                                                                                                 |
| `artifacts/ai-workflow-builder/src/features/documents/documents-library.tsx`              | Sources gains Add text and consistent Use in this chat alongside existing document operations.                                                                                                                                                                                                                                                                                                                     |
| `artifacts/ai-workflow-builder/src/features/documents/attach-workflow-source.ts`          | Preserves saved workbook identity/revision metadata when adapting uploads for workflows/chat.                                                                                                                                                                                                                                                                                                                      |
| `artifacts/ai-workflow-builder/src/features/documents/workflow-source-client.ts`          | Exposes original file hash and source metadata separately so extracted-text hashes are not confused with uploaded-byte hashes.                                                                                                                                                                                                                                                                                     |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-store.ts`      | A built-in catalog choice creates that template independently of existing saved derivatives; saved identity/version access remains exact.                                                                                                                                                                                                                                                                          |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-panel.tsx`     | Composes shared timeline/details in Chat and Run, preserves live forms and specialized result contracts, and removes redundant FAPI evidence folding. Template previews no longer infer a saved derivative; local openings reset for a different requested workspace/workflow/run/version, and Start/New run in Run synchronizes its selected identity. Exact history links retain their original run and version. |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/chat-workflow-steps.tsx`        | Chat's step presentation now delegates to the common timeline; execution ownership is unchanged.                                                                                                                                                                                                                                                                                                                   |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/fapi-workflow-steps.tsx`        | Retains the four FAPI stages independently of worksheet-unit compatibility, and exposes block details directly.                                                                                                                                                                                                                                                                                                    |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-step-model.ts`         | Shared read-only type/color/status projection; no calculation or mutation is introduced.                                                                                                                                                                                                                                                                                                                           |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-step-timeline.tsx`     | New shared animated step controls keep visited content mounted and respect reduced motion.                                                                                                                                                                                                                                                                                                                         |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-block-detail-model.ts` | New allowlisted read-only projection of saved formulas/rules and current/previous/failed evidence; no evaluation or fabricated defaults.                                                                                                                                                                                                                                                                           |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-block-details.tsx`     | New inline detail rendering replaces the need to navigate to Build just to read formulas and recorded evidence.                                                                                                                                                                                                                                                                                                    |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-timeline.css`          | Extends existing timeline styling to generic workflows and inline details; no workflow behavior change.                                                                                                                                                                                                                                                                                                            |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-navigation.tsx`        | Subscribes to workflow IDs/names instead of all result payloads; ordering and selection behavior are unchanged.                                                                                                                                                                                                                                                                                                    |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-library.ts`            | Imports portable version commands directly, avoiding the canvas/execution adapter dependency; no intended command behavior change.                                                                                                                                                                                                                                                                                 |

### Loading, contracts and verification infrastructure

| File                                                 | Purpose and before/after behavior                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `artifacts/ai-workflow-builder/src/App.tsx`          | Uses the branded public startup shell during module loading; membership requirements are unchanged.                                                                                                                                                                                                            |
| `artifacts/ai-workflow-builder/src/app-workspace.ts` | Development now shares lazy workspace boundaries with production instead of eager workspace imports.                                                                                                                                                                                                           |
| `artifacts/ai-workflow-builder/vite.config.ts`       | Bounds dependency scanning to the application entry and allows discovered modules to serve before crawl completion; no dependency upgrade.                                                                                                                                                                     |
| `scripts/generate-workflow-schemas.mjs`              | Generated lazy validators memoize schema construction, preserving recursive references and every parse.                                                                                                                                                                                                        |
| `lib/workflow-contracts/src/generated-schemas.ts`    | Regenerated output implements the same validator reuse; storage contracts and accepted types are unchanged.                                                                                                                                                                                                    |
| `scripts/maintained-paths.mjs`                       | Registers new owned helpers/tests for maintained checks; no runtime behavior change.                                                                                                                                                                                                                           |
| `tests/smoke/production-ui.mjs`                      | Retains production navigation checks and adds controlled loading probes; no application behavior change.                                                                                                                                                                                                       |
| `tests/smoke/production-loading.mjs`                 | New isolated empty/populated library, typing-readiness, long-task and script-size measurements; no application behavior change.                                                                                                                                                                                |
| `tests/unit/workflow-contracts.test.ts`              | Asserts schema reuse does not cache accepted user data or allow malformed later input; no runtime behavior change.                                                                                                                                                                                             |
| `tests/unit/workflow-interaction.test.ts`            | New exact selection/JSON roundtrip and invalid receipt tests; no runtime behavior change.                                                                                                                                                                                                                      |
| `tests/unit/workflow-choice-model.test.ts`           | Adds exact Resume/missing/ended-session coverage; no runtime behavior change.                                                                                                                                                                                                                                  |
| `tests/unit/workflow-block-details.test.ts`          | New tests for saved formulas, zero values, stale/failed evidence, immutability and FAPI stage/output independence; no runtime behavior change.                                                                                                                                                                 |
| `e2e/assistant-ui-chat.spec.ts`                      | Verifies next-request selection context, reload acknowledgment, independent template start and exact Resume while preserving no-execution assertions.                                                                                                                                                          |
| `e2e/fapi-reference-display.spec.ts`                 | Verifies formulas/evidence directly inside FAPI stages alongside independently expected recalculation/export values.                                                                                                                                                                                           |
| `e2e/workflow-session.spec.ts`                       | Uses shared accessible step controls and checks generic formulas, recorded traces and stale evidence.                                                                                                                                                                                                          |
| `e2e/workflow-traceability.spec.ts`                  | Updates selectors/status presentation for the shared timeline without weakening evidence identity checks.                                                                                                                                                                                                      |
| `e2e/workflow-run-persistence.spec.ts`               | Updates shared timeline selectors/status presentation and verifies independent template starts, exact saved-source/version restoration, and history reselection after New run in the same mounted panel. Uses the existing isolated browser persistence fixture; no live data or weakened identity assertions. |
| `docs/ARCHITECTURE.md`                               | Updates implementation ownership, context/selection, shared details and loading boundaries; no runtime behavior change.                                                                                                                                                                                        |
| `docs/FUNCTIONALITY.md`                              | Describes actual explicit context, source and workflow actions and their limits; no runtime behavior change.                                                                                                                                                                                                   |
| `docs/product/decisions.md`                          | Records the user's approved lightweight context direction, leaving unrelated pending policies untouched; no runtime behavior change.                                                                                                                                                                           |
| `docs/chat-workflow-integration.md`                  | This per-file semantic delta and evidence record; no runtime behavior change.                                                                                                                                                                                                                                  |

Additional verification files:

| File                                          | Purpose and before/after behavior                                                                                                                                                                                                                                                                   |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/unit/chat-context.test.ts`             | Checks validated context/workbook-mapping roundtrips, malformed metadata, exact source revisions, bounded selected text and absence of ambient documents; no runtime behavior change.                                                                                                               |
| `e2e/chat-context.spec.ts`                    | Checks explicit first-turn context for both providers, exact source restoration, clean new chats, Sources/text attachments, canceled Viewer additions across a chat switch, and mobile control/menu bounds using isolated data.                                                                     |
| `playwright.reliability.config.mjs`           | Registers the new context browser cases in the normal reliability suite; no application behavior change.                                                                                                                                                                                            |
| `tests/integration/workspace-access.test.mjs` | Extends the real chat-storage roundtrip with explicit context/selection metadata while preserving denied-role and cross-workspace assertions.                                                                                                                                                       |
| `e2e/phase-7-navigation.spec.ts`              | Waits for the existing authenticated-workspace readiness check after both access responses before checking that its loading shell disappeared, and for each direct-link target before checking its redirect; all access checks and timeout values remain unchanged. No application behavior change. |
| `e2e/mkoro-delegation.spec.ts`                | Waits for the deferred chat to mount before initial Computer assertions and saved-chat restore assertions; delegation counts, review identity, native workflow behavior and assertion deadlines remain unchanged. No application behavior change.                                                   |

`e2e/source-library.spec.ts` also adapts saved document/workbook fixtures to provide
actual mock downloads/extraction and chat-metadata persistence. It uses the explicit
context strip while retaining exact revisions, independent calculation amounts and
the 1,100-record import assertion. No application behavior change is made by this file.

`e2e/workspace-access.spec.ts` now verifies that workflow navigation is mounted and
server-library loading has completed before asserting that another workspace's or
account's saved workflow is absent. Previously that absence could pass against the
deferred startup shell. Existing authentication, denied access and isolation
expectations remain unchanged, with no timeout increases or application behavior change.

## Verification and limits

`pnpm run verify` passed: doctor, generated contracts, architecture, maintained
formatting, application/library/test types, 249 unit tests, 37 Computer-worker tests
and 50 portable workflow-core tests (336 total). This final source verification
completed on 2026-10-10. The measured production build and navigation smoke passed
before the final workbook-mapping, card-lock, attachment-race, panel-selection and
mobile-layout corrections; source verification covers those follow-ups, with their
focused browser verification recorded below.
The asset-size gate remains failed as described above; this is not a full release-gate pass.

Real API checks passed against disposable Postgres and real test sessions: compressed
backup byte preservation, cross-workspace chat-batch rejection, and chat/context
metadata roundtrip with denied-role coverage. A separate two-case run passed the
shared-library access/seed case and malformed, cyclic and oversized backup rejection,
including preservation of the previously stored backup. The initial filtered run
omitted that seed and failed its preservation assertion; the complete seed/rejection
pair passed. One retry failed before assertions because Docker was absent from the
task PATH; adding its existing installation to that task shell resolved setup.

API evidence: `test-results/chat-integration-api.log` and
`test-results/chat-integration-api-final.log` (final pair run
`04a727d1-44d484d8-60e4-40b4-aeac-40ac8b031ff3`). No shared or production database
was used.

Both selected real-database persistence cases passed: workflow/result recovery in a
second browser, backup export/import, offline retry and conflict protection; and
account creation, workspace switching, sign-out/sign-in isolation. The run used
disposable Postgres and real sessions, with live providers disabled. Evidence:
`test-results/chat-integration-persistence-final.log`, run
`04a727d1-d89d066b-41c8-49f9-8daf-6dbd688fe1a6`. Both cases passed and owned-stack
cleanup completed. These are the two selected persistence cases, not a claim that
the entire integration or persistence suites ran.

All 33 targeted reliability-browser cases now have a passing result across focused
runs. This is not a claim that the entire reliability suite ran, or that one
33-case run passed. The final seven-case pass set covered the complete chat FAPI
worksheet/recalculation, both agents' selectable workflows, independent template
starts/exact Resume, explicit Viewer attachment cancellation, Sina context/mobile
layout, unstarted-workflow isolation and shared generic progress. The same-mounted
panel history check passed in the next run. The final two-case run passed exact
source/version/run restoration after reopening and Build evidence inspection with
source replacement, preserving historical results and explicit approval state.

Reliability run evidence (earlier failures remain in their logs):

| Log                                                        | Result                                    |
| ---------------------------------------------------------- | ----------------------------------------- |
| `test-results/chat-integration-browser-final.log`          | Initial 31 cases: 10 passed, 21 failed.   |
| `test-results/chat-integration-browser-recheck2.log`       | 21 selected retries: 16 passed, 5 failed. |
| `test-results/chat-integration-browser-final-retry.log`    | 10 selected cases: 7 passed, 3 failed.    |
| `test-results/chat-integration-browser-history-final.log`  | 3 selected cases: 1 passed, 2 failed.     |
| `test-results/chat-integration-browser-evidence-final.log` | Final 2 corrected cases: both passed.     |

Final two-case run: `04a727d1-aef55e3c-4f70-4f6e-976f-d394ae8a0610`. These browser
cases mock workflow-library server writes; database durability is established by
the separate real persistence checks above. No test deadlines, expected arithmetic,
validation or asset budgets were relaxed. Desktop FAPI results/workflow choices and
mobile context screenshots were visually reviewed. Maintained unit-test type
checking also passed; the changed browser fixtures were verified by execution.

Cold browser-test preparation also exceeded its unchanged five-minute deadline in
run `04a727d1-b34599fc-4737-4463-aea8-6d721ad5dbe9`; no cases executed. The trace
showed pending dependency imports, with Vite optimization completing 25 seconds
after the deadline and no application/compilation errors. This remains separate
from functional test results and production loading measurements.

The later traceability rerun exposed a pre-existing timing-sensitive test
expectation: it required zero calculation records before approval. The task-start
implementation and [execution documentation](unified-workflow-execution.md) already
record each completed calculation automatically, with approval and server save
separate. The corrected check waits for completion and verifies an exact result
record with neither the session nor its recorded snapshot approved. Independently
specified arithmetic and evidence/history checks are retained. Two new history
checks also needed their selectors narrowed to the run header because the nested
worksheet has its own header; their identity comparisons remain unchanged.

The existing `/w/:workflowId?run=...` compatibility route opens the exact workflow
in the main shell and normalizes the URL to `/`. Refreshing that normalized URL
opens Chat home, not the transient workflow detail panel. The persistence test
therefore reopens its captured exact link after refresh before comparing the saved
source, version and session. This increment does not change that route behavior or
claim that refreshing `/` restores the workflow detail panel.

Toolchain checks used the authoritative pins (Node 24.21.0 and pnpm 10.26.1) in a
task-local shell. The pre-existing development-guide header still says pnpm
10.33.2, although its installation example and the package pin say 10.26.1; this
unrelated documentation discrepancy was not changed.

Live Sina/Foundry reasoning, external connectors, deployed service latency and a
user-provided reference workbook are not verified by isolated fixtures. The sample
FAPI checks exercise the actual workflow engine with independently specified expected
values and mocked external responses. Existing browser execution lifetime and local
attachment limitations remain; this increment does not add durable background execution.
