# Shared interactive workflow execution

Chat, the Workflows Run tab and `/run/:workflowId` render the same
`WorkflowSessionPanel`. The panel reads the actual saved Build graph, rather than
the older template-specific calculation loop. The application commands in
`lib/workflow-core/src/application/sessions.ts` own transitions and dependency
rules. Browser adapters inject the existing tool registry.

Chat keeps the panel inline in the conversation, with the existing source inputs,
steps and execution controls. Its compact presentation uses one colored step
accordion inside that card. A step expands its actual source form, checks or recorded
results underneath; folding keeps unapplied edits. The first missing input can open
initially, while manual expansion/collapse remains under the user's control. Clicking
a step stays in Chat and never executes it; Build is an explicit separate action.
The opening tool receipt places the live card directly in the conversation, after the request; later input proposals do not mount duplicate forms. Work contains the current workflow and links back to that card or its exact Run view. Opening a workflow from
Sina creates or selects a paused session without executing its steps.

The exact workflow/run reference is saved as non-prompt metadata through the
existing chat message API, including conversations started from a workflow before
any message is sent. Switching chats clears or restores that reference. Missing
runs fail visibly; legacy chats without a binding do not infer a latest run.
Workflow progress remains owned by the workflow library and its save status.
Chat save failures are displayed separately. Current-work inputs, reviewed agent
changes and reply interruption are described under Conversational execution inputs
below. Hypothetical comparison branches remain outside this increment.

## User journey

- Starting a guided run freezes a saved version. Opening an existing run resumes
  its identity and evidence, without executing it. Build edits do not alter it.
- Resume executes ready blocks using actual recorded predecessor results. The
  browser yields between blocks; Pause takes effect before the next block.
- Errors, unavailable tools and review checkpoints stop advancement. Reading or
  asking a question does not change execution state.
- Each block exposes its real input and output. A block can be rerun using the
  same executor. Dependent results become outdated, and approval is cleared.
- Source replacement/addition targets an explicit document source block. Previous
  attachments and execution attempts remain available. Row IDs are namespaced by
  attachment so adding documents cannot merge unrelated records accidentally.
- Approval is explicit and records a result revision in existing run history.
  A subsequent change leaves the historical record intact.

Chat receives a structured summary with exact workflow/run/version/revision IDs,
steps, dependencies, source identities and statuses. `inspectWorkflowBlock` reads
actual results. `controlWorkflowRun` proposes block execution, resume or source
or input changes under a one-time execution grant and rejects a changed run revision.
Pausing is immediate. Changing mapping rules still requires editing Build through
the existing draft/version authorization flow and starting a new version.

## Persistence and runtime boundaries

### Captured document evidence

The guided run uploader accepts PDF, DOCX, Excel and JSON. Native PDF extraction
preserves page text; DOCX preserves extracted paragraph locations (not original
page layout). Each attachment records its content hash, extraction method, issues
and source revision. Excel/JSON captures preserve selected records and available
sheet/row locations. These are evidence snapshots, not a completeness or financial
interpretation guarantee.

Original files are uploaded through the existing Sources API. If storage fails,
the run retains extracted evidence and displays an explicit missing-original
warning. Downloading an available original checks its hash against the snapshot.
Replacing or adding sources preserves prior attempts and invalidates dependent
results. Text and structured records must use separate source blocks when added;
Replace can change the source format.

Run, Chat and the immutable Build inspector render the same recorded evidence.
Sina's `inspectWorkflowBlock` can list documents, list their locations and read
text in bounded pages using exact extraction/segment IDs. Evidence is untrusted
document content; reading it does not execute steps or authorize actions.

The five parser tools no longer fall back to default rows. Text, workbook and
JSON readers require compatible captured evidence or supported explicit legacy
records. OCR reads an explicitly acquired OCR capture; the guided uploader reports
image-only PDFs as requiring OCR. PDF table parsing reports unavailable instead
of treating text as a verified table. No new external extraction provider, fiscal
interpretation, approximate matching or automatic document refresh is introduced.

The extraction snapshot is optional in the persisted source contract. Historical
backups remain readable. These changes target guided uploads; they do not migrate
old attachments or refresh frozen durable workflow versions automatically.

### Document interpretation notes

Sina can use `inspectRunDocuments` to read current attachments before any block
executes, then `proposeDocumentReview` to prepare a review card. A review addresses
document type, company, reporting period and currency, with cited observations
or explicit questions. Other observations can describe facts and workflow
relevance. Missing information, ambiguities and conflicts stay visible.

Workflow commands check that every quotation exists in the selected source
segment. This validates the quotation's origin, not the interpretation's accuracy.
Review notes remain proposals; they neither populate calculation inputs nor
approve tax treatment. No automatic inference of missing values is implemented.

The user selects **Save interpretation notes** to append the proposal to the
paused run. The command rejects changed run revisions and replaced documents.
Earlier notes remain available; Run and Build distinguish replaced sources and
earlier interpretations. The latest notes for current sources accompany the
approved run snapshot and do not change when later notes are saved. Backups
validate note/source identity; old backups without notes remain readable.
Saving notes does not execute, change calculated results or approve the run.
Existing workspace synchronization reports server persistence separately.

Sina's operating instructions explain this sequence. Live model interpretation
quality still requires a reviewed document benchmark. Company-history retrieval,
rulebook applicability, financial table interpretation and mapping acceptance are
separate future work.

Sessions are an optional additive field in the existing workflow library contract.
Older backups remain readable. Current workspace storage and revision conflict
handling also cover guided sessions; server persistence is reported by the
existing workspace save status, never inferred from calculation completion.

Interactive advancement runs in the browser. Closing it stops advancement; saved
progress can be reopened and explicitly resumed. This does not replace the
existing server-managed background execution path. That path continues to run an
immutable version on the server and retains its existing controls in Run.

The earlier browser run-flow cache is not silently imported as a saved execution.
Previously attached workspace sources can be selected explicitly. There is no
sample-data fallback.

## Verification

Core tests cover frozen versions, exact dependency inputs, source history,
downstream invalidation, revision conflicts, checkpoint gating, unavailable tools
and backup roundtrips. Browser cases cover Run/Chat continuity, recomputation after
adding a source, approval and reload, as well as Build preview compatibility.
Workspace integration coverage includes saving and restoring guided session state
with stale-write rejection. These tests do not verify a live model's tool selection.

After building the frontend, `pnpm exec node tests/smoke/workflow-session-ui.mjs`
checks the production bundle with synthetic Excel files: Run → Chat, added-source
recomputation, explicit approval and reloading the same run. Its API writes are
isolated mocks; the workspace integration case covers the real storage API.

## Verify the selected run in Build

Chat and Run offer **Verify this run in Build**, and each step offers **Verify this
block in Build**. Build opens the immutable saved graph for that exact session or
recorded run. It displays recorded block inputs/outputs, source provenance,
findings, source revision history and previous execution attempts. Paused sessions
can be inspected before approval. Selecting an upstream block follows the saved
graph; navigation never executes another calculation.

This evidence view reuses the normal Build canvas, bloc shapes and configuration workspace in an isolated read-only inspection context. It never writes the recorded graph into the mutable draft or executes a bloc. **Edit current draft** explicitly returns to authoring without changing historical versions or results.
**Return to this run** and **Continue this run in Chat** retain the same session.
A missing run/version reports an error rather than showing the latest record.

The portable `workflow-core/inspection` query owns exact run/version resolution.
The Build adapter publishes the selected evidence context to Chat;
`inspectWorkflowBlock` reads the selected historical attempt when one is open.
The existing session execution commands still own reruns and invalidation.

Verification uses isolated synthetic Excel records (200 × 2 = 400, replacement
50 × 2 = 100), checks that the earlier attempt remains 400, and verifies that
inspection leaves the draft and execution counts unchanged. Provider-free browser
checks do not certify live model responses or production persistence.

## Conversational execution inputs

Chat renders one inline workflow card with a thin progress rail using the canvas
block-family colors. Each step opens the existing workspace's exact-run evidence
view; the card link returns to Run. The existing Work menu keeps the linked workflow visible while the user asks other questions. Agent and computer selection are grouped in the composer, with the current provider and actual computer connection status. Saved chats retain their provider; unavailable computer status is shown as unverified. The source
currently missing required input is brought forward first. The user can choose
other source forms after required inputs are satisfied.

`SessionInputForms` renders the existing `SourceSetupPanel` components. Manual,
exchange-rate, fiscal, HTTP and workbook fields therefore use their existing UI.
The form submits every allowed current-work field, including the complete Manual Entry form (value, unit and label). It is not a second form schema or a chat calculation engine. Agent proposals derive named connector requests and workbook mappings with the same helpers as those forms. Unavailable workbook columns and fabricated captured HTTP/FX responses are rejected; captured provider evidence must come from the existing acquisition controls. Fetch freshness is still checked by the shared executor: a changed FX pair/year may be rejected there after the basic readiness gate.
`SessionSourceFiles` is the shared basic attachment form for Excel, JSON, PDF and
DOCX, including add/replace and source provenance. Attachment changes are staged
in the paused run; Resume executes them. Form values are submitted explicitly with
**Apply inputs & recalculate**. Field typing alone never changes calculation results.

The portable `inputs` command accepts an allowlist of data fields, requires a
paused session and an exact revision, and invalidates the changed block and its
descendants. Overrides belong to the session; saved versions and the current
builder draft remain unchanged. `submitSessionInput` is the adapter shared by Run,
Chat and approved agent changes. It gathers missing inputs, then recalculates real
dependencies. No scalar value is inferred when a guided input is missing. This
readiness gate covers known required source inputs, not all possible information
needs or permissions of a workflow.

Sina's input/source proposals show the proposed changes before a one-time approval.
Existing reusable grants do not bypass that review. Structural draft proposals
also always show their review card; applying a structural change still does not
rewrite an already running saved version. Workflow execution remains independent
of the model reply: sending a new message during a reply stops and settles that
reply before sending the follow-up, without resetting workflow state.

Each completed calculation is recorded automatically with a detached session
snapshot, preserving its inputs, source revisions and results for Runs history.
Computation is still distinct from user result approval and server save state.
Chat's main results remain the latest session results; previous block attempts
remain inspectable. **End workflow** marks the session terminal and stops further
steps or input changes. It retains history and cannot undo completed external
actions. Starting new work after End creates a new session.

These changes apply to the existing guided browser execution path. They do not
turn it into a durable server job or replace the separate background-run controls.

## Implementation review: conversational inputs

The following files implement this increment. Earlier chat-binding work already
present in the working tree is retained. Unrelated architecture-explorer files,
package scripts, and the architecture guide edits are unchanged by this increment.

| File (relative to repository root)                                                                            | Purpose and before → after                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/workflow-contracts/src/library-types.ts`                                                                 | Saved data: sessions gain optional input overrides and terminal timestamps; historical results can retain a session snapshot. Existing backups remain valid.                                                                                                           |
| `lib/workflow-contracts/src/generated-schemas.ts`                                                             | Generated validation: admits those additive saved fields. No separate execution behavior.                                                                                                                                                                              |
| `lib/workflow-core/src/application/session-inputs.ts`                                                         | New portable input policy: allowlisted source data, finite values, valid exchange rates and complete workbook evidence; captured HTTP responses retain their request signature, and structural rules cannot enter input overrides.                                     |
| `lib/workflow-core/src/application/sessions.ts`                                                               | Shared execution: saved inputs alone → current-work overlays, required-input gating, downstream invalidation, terminal End and completed-calculation recording.                                                                                                        |
| `lib/workflow-core/src/application/inspection.ts`                                                             | Evidence query: original version config alone → exact historical input/source snapshot where recorded.                                                                                                                                                                 |
| `lib/workflow-core/src/application/queries.ts`                                                                | Run history: terminal sessions now display ended instead of merely paused.                                                                                                                                                                                             |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-store.ts`                          | Browser commands: Apply submits inputs and recalculates; completed passes record history; ended sessions are not reopened as executable work, and advancement stops when the workspace changes.                                                                        |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/session-input-forms.tsx`                            | New adapter: mounts existing source block forms with an explicit current-work Apply target. Typing remains local until Apply.                                                                                                                                          |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/session-source-files.tsx`                           | Extracted attachment form: Run and Chat share the existing add/replace capture controls. No intended change to file parsing or original-file storage.                                                                                                                  |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/session-input-proposal.ts`                          | New agent input adapter: workbook selection edits derive rows with the existing mapper. Model-provided document records and captured HTTP response fields are refused. Record-only captures require the original workbook in the form before changing sheet selection. |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-panel.tsx`                         | Execution UI: full Run presentation remains; Chat gains an inline progress rail and focused source form. End is available in both.                                                                                                                                     |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/chat-workflow-thread.tsx`                            | Linked Chat workflow: selects the compact presentation and exposes a persistent workflow indicator above conversation scrolling. Exact run binding remains unchanged.                                                                                                  |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-thread.tsx`                                | Chat shell: mounts that indicator and supplies the stable reply-interruption callback. Keeps CopilotChat mounted behind the welcome screen so sending the first message does not reconnect the agent, while rendering only one composer.                               |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/use-assistant.tsx`                                   | Conversation adapter: shares message dispatch and pending-reply state across the welcome screen and conversation; exposes stop-and-settle on the existing agent subscription. Transport failures still depend on the SDK reporting them.                               |
| `artifacts/ai-workflow-builder/src/features/assistant/workspace/aside-thread.tsx`                             | Composer: a pending reply no longer disables a typed follow-up. Stop-and-settle precedes sending; failures remain visible and newer drafts are preserved.                                                                                                              |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/use-session-tools.tsx`                               | Agent commands: adds reviewed input edits and End, shows before/after, rejects stale revisions/workspace changes and prevents reusable grants from silently applying these proposals.                                                                                  |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/use-agent-workflow-tools.tsx`                        | Structural proposals: previously reusable grants could auto-apply a draft; proposals now always require the existing one-time review action. Saving/versioning commands are otherwise unchanged.                                                                       |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/inspector/source-setup-panel.tsx`             | Shared form entry: accepts current-work context; builder behavior is otherwise unchanged.                                                                                                                                                                              |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/source-viewers/manual-value-source-panel.tsx` | Scalar form: explains current-work Apply when reused, and carries invalid numeric edits to validation instead of silently reusing a previous valid number.                                                                                                             |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/nodes/family-node-shape.tsx`                  | Shared palette: exports the existing family color for the progress rail. No intended canvas behavior change.                                                                                                                                                           |
| `tests/core/workflow-sessions.test.ts`                                                                        | Adds independently expected recalculation/history values, immutable-definition checks, backup roundtrip, specialized-source readiness, same-currency and terminal-state regressions. No production behavior.                                                           |
| `tests/unit/session-input-proposal.test.ts`                                                                   | New regressions: real workbook mapping yields the independently specified amount; invented records, captured HTTP response fields and nonexistent sheets are rejected. Trusted HTTP captures preserve their request signature. No production behavior.                 |
| `tests/integration/workflow-storage.test.mjs`                                                                 | Existing real-storage roundtrip now includes overrides and End; stale-write expectations remain intact. No production behavior.                                                                                                                                        |
| `e2e/workflow-session.spec.ts`                                                                                | Adds actual form/approval/history/End and conversation-interruption cases. The upload locator now names the intended control because the reused form adds another file input. Existing evidence and restoration assertions remain.                                     |
| `e2e/mkoro-delegation.spec.ts`                                                                                | Native workflow regression now expects the approved inline input card, with no execution history and correct specialized-source readiness, rather than a separate Start screen. Computer delegation assertions remain unchanged.                                       |
| `tests/smoke/workflow-session-ui.mjs`                                                                         | Production-bundle regression now mocks saved chat messages as well as the workflow library, so a reload can restore the exact chat binding. Assertions remain unchanged.                                                                                               |
| `docs/microsina-foundry/tools.json`                                                                           | Saved-agent tool contract: matches the new input/End arguments. This file does not update the remote agent.                                                                                                                                                            |
| `docs/microsina-foundry/README.md`                                                                            | Records the pending remote schema refresh and current-work approval boundary. Documentation only.                                                                                                                                                                      |
| `docs/FUNCTIONALITY.md`                                                                                       | Supported-scope summary now describes the implemented conversational inputs and readiness limits. Documentation only.                                                                                                                                                  |
| `docs/unified-workflow-execution.md`                                                                          | Documents the execution contract, surface differences, current-work scope and this file inventory. Documentation only.                                                                                                                                                 |

Pre-existing work retained without additional changes in this increment includes
chat message serialization and persistence (`message-codec.ts`,
`use-chat-persistence.ts`, `workflow-binding.ts`), document review navigation
(`use-document-review-tools.tsx`), Build inspection navigation
(`workflow-run-inspector.tsx`), and their existing chat-binding/workspace-access
tests. Their prior Git changes are not new changes made by this increment.

Keeping completed recalculations also retains their input/source snapshots, so the
saved workflow library grows with run history. This increment does not introduce
automatic history pruning. Live provider calls and the remote Foundry catalog
update are outside the local verification described here.

### Verification for this increment

- A full `pnpm run verify` passed before the final specialized-source readiness
  and single-composer fixes. The final rerun passed toolchain, contracts,
  architecture, formatting and all application/test typechecks. Its unit stage
  retained a stuck process across a long suspended session: 104 tests passed,
  then that process was stopped. All nine tests in the affected
  `microsina-foundry.test.ts` file passed when rerun separately. The final
  workflow-core typecheck and all 27 core tests passed. The 34 worker tests
  passed in the earlier full verification; worker code was not changed.
- Ten real-storage integration tests and two browser persistence/recovery tests
  passed against disposable test databases. Live providers were excluded.
- Earlier focused browser checks passed source upload/replacement, document
  evidence, exact chat restoration, reviewed input changes, recalculation
  history, End, and a real held-open stream interrupted by a follow-up.
- A wider browser run found the obsolete separate-Start-screen expectation and
  the duplicate hidden composer. The expectation now checks the approved inline
  input card and zero execution history; the hidden composer was removed.
  Inspection also found and fixed specialized-source readiness, with a new
  passing core regression. Final focused browser retries timed out during cold
  warmup before tests. A direct retry reached the server after its teardown and
  failed with connection-refused errors. These failed startup attempts are not
  reported as passing browser tests. A subsequent isolated run copied only the
  completed dependency prebundles from a successful test run; normal warmup and
  all eight focused browser cases then passed against the final source
  (`04a727d1-5a1635ab-3b68-44b5-92c8-cfa073093464`). This includes the corrected
  native-workflow and single-composer cases, uploads, source history, exact
  restoration, reviewed changes, recalculation history, End and reply interruption.
- `git diff --check` and all 30 implementation-inventory file references passed.
- A bounded follow-up review found that the trusted HTTP form's request signature
  was being filtered out. The signature is now retained, while agent proposals
  cannot supply captured HTTP rows/metadata/signatures. Both focused source-input
  tests passed, including an independently expected amount of 250 and rejection
  of replay after changing the URL without fetching again. This adds one unit
  regression to the 113 previously passing cases.
- The production build and compiled-app smoke check passed (Excel upload,
  Run/Chat sharing, recomputation, approval and reload). The build emitted existing
  source-map, browser-externalization and large-chunk warnings. The final HTTP
  signature fix landed after its modules had been bundled, so that small fix is
  covered by the focused source tests rather than that compiled-app smoke check.
  The new test fixture initially used an incorrect executor-context field; it was
  corrected to the actual interface. Test typechecking and both focused tests
  subsequently passed, without changing the expected result or stale-response
  assertion.

## Approved Chat layout and form parity correction

The approved illustration changes presentation and navigation. Workflows still own
the graph, source restrictions, execution sequence, results and history. A bloc with
three current-work fields exposes those same three fields in Chat through its
existing form. User edits and reviewed Sina proposals enter shared workflow commands;
they do not write a second Chat workflow or modify a frozen definition.

This correction builds on an already modified working tree. The earlier inventory
above describes that prior work. The following table describes this increment only;
unrelated architecture-explorer, package-script and previous execution changes were
preserved. Frontend paths below are relative to `artifacts/ai-workflow-builder/src/`.

| File                                                                     | Purpose and before/after behavior in this correction                                                                                                                                                                                     |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `features/assistant/ui/assistant-thread.tsx`                             | Chat shell: duplicated top agent/computer controls and workflow strip → existing Work menu plus composer controls; the workflow leaves the pinned-card area. Existing mounted-stream behavior is preserved.                              |
| `features/assistant/ui/thread-messages.tsx`                              | Conversation layout: workflow above all messages → one card beside its opening receipt or saved launcher anchor, with later conversation below.                                                                                          |
| `features/assistant/ui/chat-workflow-thread.tsx`                         | Workflow presentation: active tool result required a View button → active form appears directly; historical receipts can explicitly restore their exact run. Supplies Work status from real session steps.                               |
| `features/assistant/runtime/chat/workflow-position.ts`                   | New position resolver: matches exact opening tool/run identity or persisted message anchor, without interpreting conversation mentions as actions.                                                                                       |
| `features/assistant/runtime/chat/workflow-binding.ts`                    | Saved binding: exact run only → optional message anchor as non-prompt metadata; legacy bindings remain valid and malformed anchors fail visibly.                                                                                         |
| `features/assistant/runtime/chat/message-codec.ts`                       | Persisted message types: adds optional anchor typing; no change to message execution or model transcript.                                                                                                                                |
| `features/assistant/runtime/chat/use-chat-persistence.ts`                | Registers a live message-position reader so launcher placement survives save/restore; saving/restoring still does not execute a workflow.                                                                                                |
| `features/assistant/ui/use-session-tools.tsx`                            | Projects the chat binding to workflow/run identity before preparing tool results and action requests; the saved layout anchor stays out of model context. Execution and approval rules are unchanged.                                    |
| `features/assistant/ui/use-document-review-tools.tsx`                    | Projects the same exact identity for document tools so their output excludes the layout anchor. Document inspection, cited review and approval behavior are unchanged.                                                                   |
| `features/assistant/ui/work-menu.tsx`                                    | Current work: legacy registry only → also shows the linked workflow, honest status, return-to-card and exact-run detail actions. Previous items are not simultaneously marked Current.                                                   |
| `features/assistant/ui/composer-menus.tsx`                               | Agent menu: hardcoded Sina display → actual Sina/MicroSina selection with the existing new-chat-only provider restriction and visible explanation.                                                                                       |
| `features/assistant/workspace/aside-thread.tsx`                          | Composer: passes guarded agent selection and places computer connection beside it; earlier attachment and interruption behavior remains intact.                                                                                          |
| `features/assistant/mkoro/mkoro-panel.tsx`                               | Computer control: separate header trigger → optional composer dropdown using actual workers, status and selection; existing settings/pairing/recovery remain available. No backend or device simulation.                                 |
| `features/workflows-hub/workflow-session-panel.tsx`                      | Shared execution card: adjusts Chat spacing, header and progress highlighting; no execution or form-field behavior change intended.                                                                                                      |
| `features/workflows-hub/workflow-session-store.ts`                       | Chat binding only: captures a durable conversation position on new binding and preserves it on same-run navigation. Calculation commands are unchanged in this increment.                                                                |
| `features/workflows-hub/session-input-proposal.ts`                       | Agent input adapter: derives named API requests with existing helpers; preserves partial workbook mappings and resets sheet/header detection as the real form does. Rejects unavailable columns and fabricated fetched HTTP/FX evidence. |
| `lib/workflow-core/src/application/session-inputs.ts` (repository root)  | Portable input policy: retains the actual HTTP form's captured preview rather than dropping that field; no new executor.                                                                                                                 |
| `features/workflows-hub/workflow-run-inspector.tsx`                      | Exact-run navigation: separate generic graph/evidence page → normal Build canvas and bloc workspace in read-only mode, with exact run/attempt navigation.                                                                                |
| `features/workflows-hub/recorded-workflow-builder.tsx`                   | New adapter mounts existing Build components with isolated state; main authoring state and writable library synchronization remain outside inspection.                                                                                   |
| `features/workflows-hub/recorded-run-projection.ts`                      | New adapter presents recorded outputs/configuration to existing builder viewers without calculation or latest-run lookup.                                                                                                                |
| `features/workflows-hub/workflow-run-evidence.tsx`                       | Existing recorded evidence content extracted into the normal bloc workspace. No change intended to source provenance, attempts or interpretation history.                                                                                |
| `features/workflow-builder/ui/workflow-canvas.tsx`                       | Canvas gains recorded inspection mode: same nodes/connections/zoom, with graph mutation and authoring toolbar disabled. Normal authoring remains available outside inspection.                                                           |
| `features/workflow-builder/ui/nodes/action-node.tsx`                     | Bloc navigation opens recorded Input & Output instead of authoring properties when inspecting an unconfigured historical bloc; ordinary builder clicks retain their behavior.                                                            |
| `features/workflow-builder/ui/overlays/configuration-overlay.tsx`        | Existing bloc workspace reads exact recorded evidence in inspection, hides test/execute controls and blocks configuration writes. It avoids writable-library subscriptions in the isolated view.                                         |
| `features/workflow-builder/ui/workspace/recorded-inspection-context.tsx` | New read-only context supplies the selected record/evidence and an inert library view.                                                                                                                                                   |
| `features/workflow-builder/ui/workspace/workspace-runs-tab.tsx`          | Extracts the existing runs tab to respect the editor size budget; no behavior change intended.                                                                                                                                           |
| `tests/unit/chat-workflow-position.test.ts` (repository root)            | New placement regressions for opening receipts, follow-ups, restored launcher anchors and malformed/non-opening messages; no product behavior.                                                                                           |
| `tests/unit/chat-workflow-binding.test.ts` (repository root)             | Adds anchor serialization, legacy compatibility and unfinished-tool coverage; no product behavior.                                                                                                                                       |
| `tests/unit/session-input-proposal.test.ts` (repository root)            | Adds API parameter derivation, workbook mapping and captured FX restrictions coverage; no product behavior.                                                                                                                              |
| `e2e/workflow-session.spec.ts` (repository root)                         | Checks all three real Manual Entry fields, rejected empty value, recalculation/history, Work status, normal recorded Build canvas and unchanged workflow state during inspection. Adapts agent selection to its new location.            |
| `e2e/mkoro-delegation.spec.ts` (repository root)                         | Asserts immediate single FAPI card after the request, no View gate, Work navigation and one composer agent/computer control.                                                                                                             |
| `e2e/microsina-chat.spec.ts` (repository root)                           | Provider selection/restoration assertions now exercise the real composer menu and saved-chat lock.                                                                                                                                       |
| `e2e/mkoro-chat.spec.ts` (repository root)                               | Existing computer scenarios open settings through the composer; their permission/recovery assertions remain unchanged.                                                                                                                   |
| `tests/smoke/production-ui.mjs` (repository root)                        | Compiled-app settings navigation uses the composer entry point; no product behavior.                                                                                                                                                     |
| `tests/integration/workspace-access.test.mjs` (repository root)          | Existing real chat-storage roundtrip now also includes the launcher anchor while retaining cross-workspace and denied-viewer assertions; no product behavior.                                                                            |
| `docs/ARCHITECTURE.md` (repository root)                                 | Updates ownership/adapter summary for turn placement and isolated recorded Build inspection; documentation only.                                                                                                                         |
| `docs/FUNCTIONALITY.md` (repository root)                                | Updates visible layout, controls and shared-form boundaries; documentation only.                                                                                                                                                         |
| `docs/unified-workflow-execution.md` (repository root)                   | Updates the approved behavior, before/after inventory and verification evidence; documentation only.                                                                                                                                     |

`tests/unit/recorded-run-projection.test.ts` is also new in this correction. It
exercises actual session history and independently checks 200 × 2 = 400 before
replacement and 50 × 2 = 100 afterward, exact earlier configuration/input/execution
identity, explicit legacy-settings fallback, unavailable-attempt rejection, and
unchanged session data. It changes no product behavior.

`tests/smoke/workflow-session-ui.mjs` also extends the existing compiled-app smoke
from Run/Chat into Build, asserting the same run identity, normal canvas and recorded
bloc workspace, and absence of execution controls during inspection. The prior Excel,
recalculation, approval and reload expectations are preserved. This changes test
coverage only, with no product behavior change.

Known boundaries: this is current-work editing, not structural editing of the saved
workflow. Definition locks remain distinct from correctable run inputs. A historical
reference-only source without an editable form still requires its locator in Build;
Chat does not invent a replacement input. FX freshness is enforced by the shared
executor even when basic readiness has passed. Interactive browser execution and
durable server execution still have their documented different lifetimes. No live
provider results or external computer actions are implied by synthetic checks.

### Verification for the layout and parity correction

- `pnpm run doctor` passed with the repository pins (Node 24.21.0 and pnpm 10.26.1).
  No runtime, dependency, migration or architecture-budget changes were made.
- `pnpm run verify` passed: toolchain, generated contracts, architecture, formatting,
  application/library/test typechecks, 123 unit tests, 34 worker tests and 27 core
  tests. Its first attempt identified an oversized configuration overlay; extracting
  the existing runs tab resolved it without raising the budget. After the final
  recorded-run projection refinement, its three new unit tests also passed (126
  validated unit cases in total), along with frontend/test typechecks and architecture.
- Twelve selected browser cases passed collectively. The initial run passed eleven;
  the recorded Build case timed out while Vite was loading the view. An isolated retry
  preloaded the new inspector module in the disposable warmup context, retained the
  existing test assertions/timeouts, and passed. The case now checks the actual
  imported workflow ID when asserting that inspection leaves persisted state unchanged.
  Evidence runs: `04a727d1-15776262-c44c-419d-a341-45434df09cbd` and
  `04a727d1-d39be535-1047-4c82-be0f-d5950216d93c`.
- These browser cases cover the immediate FAPI card and its position, Work navigation,
  single composer controls, provider locking/restoration, computer pairing/revocation,
  source uploads/history, document evidence, all three Manual Entry fields, rejection
  of an empty required value, recalculation, End, exact-run restoration and interruption
  of an active reply stream. They use synthetic data and controlled providers.
- The focused real-database chat-binding roundtrip passed, including the saved
  position anchor and existing cross-workspace/viewer-write denial assertions:
  `04a727d1-02d85ece-3b91-45aa-9173-adae2942cb00`.
- Both browser persistence cases passed against a disposable database: recovery in
  another browser, backup import/export, offline retry, revision-conflict protection
  and a one-megabyte server payload. Evidence:
  `04a727d1-945daf1e-26bb-4a4e-a989-1b6d427b1cc8`.
- After the final tool-identity projection, frontend typechecking, maintained-file
  formatting and architecture checks passed again. The production frontend build
  passed in 9m 59s. It emitted source-map reporting, browser-externalization and
  large-chunk warnings; no build budget or warning threshold was changed.
- Both compiled-app smoke checks passed. `tests/smoke/workflow-session-ui.mjs`
  verified Excel upload, shared Run/Chat identity, recomputation, approval, reload
  and the same recorded run in the normal Build canvas/workspace, with no browser
  runtime errors (`04a727d1-8f08cf89-ec4f-4648-8b0c-260ad278a72a`).
  `pnpm run test:production-ui` verified composer computer settings, agent settings,
  deferred editors, primary navigation and preserved chat draft
  (`04a727d1-76d18414-13aa-48ab-b804-a2e8b90fa298`).
- All 40 correction-inventory file references resolve. Documentation formatting
  and `git diff --check` passed. Git reports existing CRLF normalization warnings.
  No commit, push, merge or deployment was performed. Live model/provider calls,
  external computer actions and deployed-site behavior were not exercised.

## Compact steps, agent switching and computer identity correction

This increment implements the approved compact step accordion, successive Sina and
MicroSina turns in one chat, and reconnection to an existing Mkoro computer identity.
The previous implementation and verification sections above remain historical
records of their own increments.

The inventory below was checked against the starting snapshot
`test-results/chat-accordion-switch-baseline-1791061806341`: 23 files changed from
saved copies of already-dirty files, 17 initially clean tracked files changed from
Git HEAD, and six files are new. These are 46 distinct files. Initial architecture
explorer work, its `package.json` script additions, generated test artifacts and
earlier unchanged workflow changes are excluded. Files already untracked at the
start, such as the session form adapters, are compared with their saved copies;
their entire contents are not claimed as new work in this increment.

### Behavior and ownership

Chat now has one colored list of workflow steps. The first missing input can open
initially; afterward the user controls expansion, with one step open at a time.
Opening a row displays its actual bloc form, uploads, checks and recorded evidence
underneath. It neither executes that bloc nor opens Build. Resume remains available
with every step collapsed; explicit Run and Build actions remain separate.

Visited forms stay mounted but hidden when folded, so browsing other steps preserves
unapplied values. A draft becomes stale when its own bloc's effective inputs or
source identity changes, rather than on every unrelated session revision. The user
must explicitly review the edits against the latest inputs or discard them before
Apply is available. The existing command still checks the current run revision.
These drafts are local form state: folding preserves them, but reloading restores
the saved session inputs, not unapplied edits. Run keeps its existing presentation;
the shared form adapter also gains the draft-preservation and conflict behavior.

Workflows continue to own the definition, validation, execution order, recalculation,
approval and history. This increment changes no workflow engine, executor, saved
workflow contract or workflow-session command. Chat composes the existing source
forms and evidence viewers and invokes the same commands. It does not create a
second version of the workflow or reinterpret a row click as permission to run it.

The explicit Build deep-link also keeps its delayed inspector opening stable across
parent renders. The opening effect depends on inspection mode rather than the
recreated header/evidence object. The failed browser trace showed loaded inspector
modules and repeated empty overlay renders; that changing object repeatedly reset
the opening timer. The fix retains the original selected-bloc/evidence assertion
and its timeout instead of requiring another click or extending the wait.

The agent selector chooses who answers next after the current reply or tool turn
settles. It leaves the conversation and workflow binding in place. Saved metadata
separates the next selected agent from each previous assistant/tool row's author;
legacy chats retain their original saved provider, defaulting to Sina only when
that metadata is absent. Pending approvals retain the originating agent, operation
and grant scope. Session-action previews remain transient and expire on reload as
before; durable workflow proposal results can restore their original attribution.

Reconnecting a computer now keeps its actor/workspace-scoped ID and task history,
rotates its credential atomically, and resets automatic tool approval to off. A
targeted pairing code is tied to the selected connection's current credential;
stale outstanding codes cannot take it over after another rotation. The companion
can prove its saved identity and preserves its Goose session map. Queued, running
or waiting tasks block reconnection, so reconnect does not reassign or replay work.
Worker polling and event recording recheck the credential within their transaction
to reject requests that raced revocation or rotation.

Older duplicate computer registrations remain separate. Display names are not
identity, and this change does not merge or delete those records. Revoked entries
are hidden from the composer picker but remain inspectable in Settings with short
IDs and timestamps. Reconnection requires the matching API/migration and an updated
companion for saved-state identity preservation; the UI refuses a targeted pairing
response that does not confirm the requested connection. A crashed delivered task
can still block reconnect until cancellation is confirmed. Forced recovery of an
uncertain external action remains outside this increment.

### Incremental file inventory

All paths in the following tables are relative to the repository root. Each row
describes only the change since the starting snapshot.

| Frontend file                                                                               | Purpose and before → after                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-panel.tsx`       | Execution presentation: duplicate Chat progress rail, input selector and detailed list → one expandable step list with scoped real inputs and shared details. Run keeps its existing layout and commands; Build opens only through its explicit action.                                                                        |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/workflow-canvas.tsx`        | Explicit Build deep-link: repeated header/evidence context updates could keep restarting the delayed inspector opening → the effect depends on the stable inspection-mode boolean, so the selected bloc opens without another click. Existing canvas editing/execution behavior is unchanged.                                  |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/chat-workflow-steps.tsx`          | New Chat presentation component: one colored list manages initial required input, one open step and Collapse all. Visited panels remain mounted but hidden and excluded from accessibility navigation. Row selection performs no execution or navigation.                                                                      |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/session-input-forms.tsx`          | Shared input adapter: revision-keyed remounts could discard edits → stable form identity preserves them. Changes to this bloc's underlying inputs/source identity require explicit review or discard; unrelated bloc updates do not invalidate the draft. Successful Apply clears the draft through the existing command path. |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/session-source-files.tsx`         | Attachment display: each scoped source showed every session attachment → a selected Chat source shows its own attachments. Run's combined source display and the existing upload/add/replace commands remain unchanged.                                                                                                        |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/chat-agent.ts`           | Agent metadata: one provider tag for a conversation → original-provider fallback, independently saved next-agent selection, and stable per-message/tool authors. Unsupported saved identities still fail visibly.                                                                                                              |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/message-codec.ts`        | Stored message typing: adds optional next-agent and author metadata to the existing JSON content shape. Model-message reconstruction continues to omit this UI metadata; no execution or transcript-text behavior change is intended.                                                                                          |
| `artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/use-chat-persistence.ts` | Conversation state: captures settled authors before a provider switch, saves selection without requiring another message, and restores authors separately from the next provider. Switching preserves messages and the exact workflow binding; an active reply/tool or restore blocks the switch.                              |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/assistant-thread.tsx`              | Chat composition: the composer uses the guarded same-chat selection callback and its busy state instead of restricting selection to an empty conversation. Existing workflow and conversation components remain mounted.                                                                                                       |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/composer-menus.tsx`                | Agent menu: empty-chat-only selection messaging → next-reply selection with an explanation while switching is unavailable. Existing customization access remains available.                                                                                                                                                    |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/use-assistant.tsx`                 | Dispatch coordination: supplies the guarded selector and tracks an immediate pending-send flag, preventing a provider change between submission and the runtime reporting the active reply. Existing message dispatch remains authoritative.                                                                                   |
| `artifacts/ai-workflow-builder/src/features/assistant/workspace/aside-thread.tsx`           | Message/composer rendering: prior turns could appear to belong to the currently selected provider → headers use their retained authors. The selector also explains the temporary attachment-upload restriction.                                                                                                                |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/use-agent-workflow-tools.tsx`      | Workflow draft/version proposals: new requests use their creating agent instead of a fixed Sina identity; review cards display that origin. Existing proposals retain their original request and grant identity after switching.                                                                                               |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/use-session-tools.tsx`             | Session approval presentation: displays the agent recorded on the proposal request. No session-command or approval-scope behavior change is intended; those requests already carry their originating agent.                                                                                                                    |
| `artifacts/ai-workflow-builder/src/features/assistant/mkoro/mkoro-panel.tsx`                | Computer selection/settings: reconnection created a fresh registration → targets the selected offline/revoked connection. Revoked entries leave the composer picker but stay in Settings; short IDs and timestamps distinguish existing duplicates.                                                                            |
| `artifacts/ai-workflow-builder/src/features/assistant/mkoro/mkoro-pairing.tsx`              | Pairing instructions and regeneration: explains retained identity/history and automatic approval reset; generating another code preserves the selected reconnect target instead of losing it.                                                                                                                                  |
| `artifacts/ai-workflow-builder/src/features/assistant/mkoro/use-mkoro.ts`                   | Pairing request adapter: sends the optional reconnect ID, clears an older code before requesting another, and rejects responses that fail to confirm the requested target. An older API now produces an explicit update error instead of offering an untargeted reconnect code.                                                |

| Server, contracts and companion file              | Purpose and before → after                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `artifacts/api-server/src/lib/mkoro/pairing.ts`   | New pairing owner, extracted from workers: fresh-only registration → fresh registration or authorized reconnection of the same identity. Checks current membership, scoped target, credential proof and idle state; consumes the code and rotates credentials atomically, resetting automatic approval.        |
| `artifacts/api-server/src/lib/mkoro/workers.ts`   | Worker authentication/polling: pairing moves to its dedicated owner, authentication returns the credential hash, and polling verifies that hash again inside the transaction. A request racing rotation/revocation rolls back rather than delivering commands or automatic decisions under the old credential. |
| `artifacts/api-server/src/lib/mkoro/common.ts`    | Internal authenticated worker scope: adds the credential hash needed for transactional rechecks. This supports existing actor/workspace checks; it does not grant another scope.                                                                                                                               |
| `artifacts/api-server/src/lib/mkoro/events.ts`    | Event persistence: after initial authentication, a batch now rechecks the current credential before committing its worker update. A raced revoked/rotated credential rejects and rolls back the batch.                                                                                                         |
| `artifacts/api-server/src/routes/mkoro.ts`        | Existing pairing write endpoint: validates an optional target connection and passes it to the pairing owner. Current session/workspace access checks remain authoritative.                                                                                                                                     |
| `artifacts/api-server/src/routes/mkoro-worker.ts` | Worker pairing route: imports the new pairing owner so the same endpoint supports the validated reconnect request. No separate endpoint or additional worker authority is introduced.                                                                                                                          |
| `lib/api-zod/src/mkoro.ts`                        | API contracts: adds optional saved worker/token proof and targeted pairing request/response fields. Strict validation rejects malformed reconnect requests while ordinary fresh pairing remains supported.                                                                                                     |
| `lib/db/src/schema/mkoro.ts`                      | Database model: pairing records gain nullable target worker ID and pinned credential hash fields. Existing rows retain their meaning.                                                                                                                                                                          |
| `lib/db/migrations/0009_mkoro_reconnect.sql`      | New additive migration: adds the two nullable reconnect fields and target reference without editing applied migrations or rewriting computer/task history.                                                                                                                                                     |
| `lib/db/migrations/meta/_journal.json`            | Migration ordering: registers migration 0009 after the existing entries. No independent application behavior change is intended.                                                                                                                                                                               |
| `scripts/mkoro/companion.mjs`                     | Companion startup: validates the saved worker ID and delegates pairing to the new helper. Re-pairing no longer discards the saved identity and Goose session map.                                                                                                                                              |
| `scripts/mkoro/pairing.mjs`                       | New companion pairing helper: proves saved identity when available, validates returned credentials/identity before local state replacement, and retains prior Goose sessions. A mismatched identity response fails instead of silently replacing the saved connection.                                         |

| Test file                                        | Purpose and before → after; no product behavior change intended                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `e2e/workflow-session.spec.ts`                   | Adds one-list, collapsed Resume, expansion-without-execution/navigation, draft folding/browsing, same-bloc conflict review and unrelated-bloc-update coverage. Exercises all three real manual fields, scoped document attachments, recalculation/history and explicit Build evidence. Existing calculation expectations remain independently specified. |
| `e2e/mkoro-delegation.spec.ts`                   | Native FAPI launch assertions now exercise the single list, collapsed controls and inline bloc expansion without opening Build. Existing no-delegation and zero-execution assertions remain.                                                                                                                                                             |
| `e2e/microsina-chat.spec.ts`                     | Replaces the old empty-chat selection restriction with same-chat switching, retained authors/workflow, selection-only save/reload, active-turn blocking and original-agent approval/grant regressions.                                                                                                                                                   |
| `tests/unit/chat-agent-authorship.test.ts`       | New metadata regressions for stable mixed-agent authorship, tool attribution, saved next-agent selection, legacy provider fallback, unsupported identities and unchanged workflow binding/model text.                                                                                                                                                    |
| `tests/integration/workspace-access.test.mjs`    | Existing real chat roundtrip now includes selected-agent and per-row author metadata while retaining exact workflow binding and denied cross-workspace/viewer-write assertions.                                                                                                                                                                          |
| `tests/smoke/workflow-session-ui.mjs`            | Compiled-app smoke adapts to the accordion's explicit expansion/collapse and retains upload, recomputation, approval, reload and recorded Build checks.                                                                                                                                                                                                  |
| `e2e/mkoro-chat.spec.ts`                         | Adds retained reconnect target/code regeneration, duplicate distinction, revoked-picker exclusion and old-API response rejection; updates the former new-registration expectation to the approved same-identity behavior.                                                                                                                                |
| `tests/integration/mkoro.test.mjs`               | Adds real-database reconnect cases for retained identity/history, credential rotation and stale-code rejection, scoped access/proof, active-task blocking and unchanged work after denied reconnect attempts.                                                                                                                                            |
| `tests/integration/database-migrations.test.mjs` | Adds upgrade coverage for the additive reconnect migration on a pre-0009 database, including preservation of existing records.                                                                                                                                                                                                                           |
| `scripts/mkoro/pairing.test.mjs`                 | New isolated helper regressions for saved identity proof/session retention, fresh pairing and rejection of an identity mismatch before local state replacement.                                                                                                                                                                                          |

| Documentation file                   | Purpose and before → after; no application behavior change intended                                                                                                                                 |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/ARCHITECTURE.md`               | Updates the Chat accordion/form-state boundary and separate next-agent versus historical-author metadata ownership.                                                                                 |
| `docs/FUNCTIONALITY.md`              | Replaces the prior rail and empty-chat-only agent descriptions with the approved compact list and same-chat switching, retaining current-work and runtime limits.                                   |
| `docs/product/decisions.md`          | Records the user-approved same-chat agent switching and underneath-the-step expansion decisions, distinguishing presentation defaults from execution policy.                                        |
| `docs/microsina-foundry/README.md`   | Documents next-agent selection, retained authors and originating approval scope, including the unchanged transient session-proposal limitation.                                                     |
| `docs/unified-workflow-execution.md` | Updates the current presentation description and appends this scoped before/after inventory, ownership boundaries, limitations and verification record without replacing earlier increment history. |
| `docs/mkoro-connection.md`           | Documents retained computer identity, reconnect requirements, automatic approval reset, legacy duplicates and the unresolved crashed-active-task boundary.                                          |
| `scripts/mkoro/README.md`            | Updates companion deployment/re-pairing instructions for the helper, saved identity/session preservation, matching server migration and legacy registration limits.                                 |

### Verification for compact steps, switching and computer identity

- The final `pnpm run verify` passed after the Build-opening correction: pinned
  toolchain, generated contracts, architecture, maintained formatting, application
  and test typechecks, 130 unit tests, 37 companion tests and 27 workflow-core tests.
  No dependency, runtime pin, validation expectation or architecture budget changed.
- All 22 migration/Mkoro integration cases passed against disposable databases,
  including the populated pre-0009 upgrade, reconnect identity/history, stale
  credentials and codes, active-task rejection, roles, workspace boundaries and
  existing approval/cancellation behavior. The test stack built and ran the
  production API bundle. Logs: `test-results/phase2/chat-accordion-integration.log`.
- The real-database chat roundtrip passed with selected-agent and historical-author
  metadata, exact workflow binding, denied viewer writes and cross-workspace access
  checks (`04a727d1-6f89cc81-cee0-4348-a907-0efc7e3030ca`).
- Thirteen distinct selected browser cases passed collectively. The initial run
  passed ten and failed three (`04a727d1-fb045d5a-9418-4ace-ad1e-34d3de02bd16`).
  Three test setup errors were corrected: using the actual imported workflow ID,
  selecting Document instead of Trigger before uploading, and supplying the second
  required source added by the attachment-scoping fixture. Expected calculations,
  approval checks and timeouts were preserved. Two retries then passed; the remaining
  Build assertion exposed a real timer-dependency defect
  (`04a727d1-50198f42-d650-410c-a663-c36f70114a77`). Repeated inspection-context renders
  restarted the opening delay. Depending on the stable inspection-mode boolean fixed
  it, and the unchanged five-second assertion passed in the final document case
  (`04a727d1-ea0976c7-f060-4d07-9cce-6ce03f688bfb`). A direct-node retry attempt was
  rejected by the toolchain guard before starting tests; the successful retry used
  the pinned runtime through pnpm. No test failures are counted as passes.
- Those browser cases cover one step list, collapsed execution, inline expansion,
  three actual manual fields, folded drafts, stale-edit review, scoped attachments,
  recalculation/history, End, exact-run restoration, interrupted replies, same-chat
  agent switching, saved selection/authorship, original-agent pending approvals,
  reconnect target retention and older-API rejection. FAPI screenshots were also
  inspected. They use controlled providers and synthetic sources.
- Both real-database browser persistence cases passed: recovery in another browser,
  backup import/export, offline retry, revision conflict protection and a one-megabyte
  payload (`04a727d1-0df9793e-b21c-409a-bc58-2b6a8fcb6b7d`).
- The production frontend build passed in 11m 12s (16,497 modules). It emitted the
  existing source-map reporting, browser-externalization and large-chunk warnings;
  no build budget or warning threshold was changed.
- Both compiled-app smoke checks passed. The workflow smoke exercised Excel upload,
  shared Run/Chat/Build identity, recalculation, approval and reload
  (`04a727d1-f5317518-3a6d-474f-85ac-ed35fb284d1e`). The general UI smoke checked composer
  computer settings, agent settings, navigation, deferred editors and retained chat
  drafts (`04a727d1-e061c361-a475-4305-ad57-b8089e282e4b`).
- All 46 incremental file references resolve and match the Git/baseline comparison.
  Documentation formatting and final whitespace checks passed; Git reports existing
  CRLF normalization notices. Earlier unrelated work was preserved.
- No commit, push, merge, deployment, live migration or real companion reconnect was
  performed. Live provider calls, external computer actions and deployed behavior
  were not tested. Existing duplicate registrations remain for explicit review;
  reconnect requires the matching API/migration and updated companion described above.
