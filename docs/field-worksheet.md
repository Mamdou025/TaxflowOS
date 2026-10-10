# Generic Field worksheets

A Field can declare the result lines a workflow should present without owning
their arithmetic. The calculation engine or its connected rules source still
defines each formula. Sources and generated input forms supply the formula's
variables; Field explains and displays the result.

## Current behavior

- In Build, connect a calculator to a Field, then add worksheet lines. Each line
  chooses a calculator result, label and optional descriptive unit. Editing the
  display does not edit the formula.
- A line can be a primary result, summary row or grouped supporting detail. Its
  optional description and decimal places affect presentation only. The primary
  result remains visible above the details, including an explicit missing,
  outdated or invalid state. Workflows without presentation settings retain the
  flat worksheet. Displayed availability does not imply approval or a finished run.
- Chat and Run show these main lines before the Field step executes. A calculator
  that has already finished can show its current result while another line waits
  for missing inputs. Opening a line does not run anything.
- Expanding a line shows its formula, supporting variables and earlier calculator
  results. Explicit source bindings show the selected block and output path;
  manual, default and legacy connected values retain their respective origins.
  Available evidence and source traces remain attached to their recorded results.
- Missing, invalid and outdated values are explicit. Only finite current numbers
  appear as values, including an actual zero. Field performs no implicit arithmetic,
  currency conversion, tax interpretation or substitution of a missing value.
- **Edit inputs** opens the existing generated form for the relevant calculation,
  including earlier calculators exposed by its dependency tree. A field can use
  its saved provider, an entered value for this run, or an exact directly connected
  source. Applying retains all required source and review steps.
- Trigger and worksheet forms share one transient draft per calculator inside the
  session panel. Editing either surface updates the same staged values; collapsing
  the worksheet form preserves them. Apply uses the existing session command,
  revision checks, source-change review and dependent-result invalidation.
- Forms with more than 100 connected field choices show a **Browse connected
  fields** action instead of repeating the full list in every variable's menu.
  The picker searches all choices and displays 50 per page. Existing selections,
  manual input, saved defaults and unavailable selected paths retain their meaning.
- A Field without `worksheetLines` retains its previous recorded-value viewer and
  executor behavior. Missing or nonnumeric cells in that viewer now display a dash
  instead of being coerced to zero.

The displayed calculation projection uses applied session inputs. Unapplied edits
remain visible in the shared form and do not create a speculative calculation
result. Shared drafts are presentation state, not a new server persistence model.

## Contract and ownership

`worksheetLines` is optional Field configuration. Each line has `id`, `label`,
`calculationBlockId`, `resultKey`, and optional `unit`. Optional `presentation`
(`primary`, `summary` or `detail`), `group`, `description` and `decimalPlaces`
(an integer from 0 to 6) select the display hierarchy and formatting. The captured
number and formulas are never rounded or rewritten by these settings. Malformed
display metadata is rejected. The referenced calculator
must have a direct active connection to the Field. Line IDs distinguish results
even when different calculators use the same result key. An explicitly empty or
invalid declaration reports an error; it does not silently select all results.

`projectFieldWorksheet` in workflow-core returns declared lines, recursive
dependencies, evidence, validation errors and the value states `current`,
`missing`, `invalid` and `stale`. It uses the existing formula/variable resolver.
Dependency traversal is bounded and guards cycles. Source-bound earlier
calculations can be expanded; manual and default choices remain leaves.
Calculator states and numeric source options are reused within one projection
call. No cache survives that call, so changed values and source revisions are
always re-read; calculation semantics and projected evidence remain unchanged.

Each mounted session panel prepares a shared read model of its definition,
readiness, calculator inputs, source choices and worksheets. Forms reuse their own
calculator's prepared options instead of repeatedly cloning the entire session
and scanning every calculator. A panel-local reader reuses a projection only for
the same entry, session object and revision. Input edits, source refreshes and
invalidation rebuild it; account and workspace transitions discard the panel.
Commands keep their own cloning and revision checks. Chat context hooks also
reuse their read-only projections until the entry or session changes.

Where a calculation recorded the operands it actually consumed, the projector
checks them against the displayed dependency values. A disagreement marks the
line invalid instead of presenting a misleading explanation. This includes a
legacy connected name colliding with a later internal result. The guard changes
the worksheet's validity status; it does not alter the calculator's arithmetic or
rewrite its recorded result.

The declared Field executor uses this same projection. Its `computedValues` map
is keyed by worksheet line ID and contains current values only; `worksheet`
retains the structured explanation. Invalid declarations produce errors and
pending lines require attention. This is separate from run approval.

Guided execution supplies captured ancestor results as read-only context, separate
from the Field's direct inputs. Previously only direct calculator results reached
an isolated Field step, so valid source-backed lines could be falsely marked
outdated and final evidence could be blocked. Current, nonstale ancestors now
reach the same projector without adding connections, input roles or executions.
The graph validates this context against the original active ancestry and rejects
unrelated, later, selected-block or mismatched results. Source changes still
invalidate dependent calculations and prevent Field execution until they rerun.

The frontend owns presentation, canvas conversion and transient form state. Chat
and Run pass the effective session definition, current results, stale identifiers
and available calculation history. Stale historical rule structure may explain
fields; it never supplies a current numeric value. Builder previews are labelled
as last-run evidence and check recorded configuration through the existing browser
adapter. Rerun after changing sources, connections or formulas.

The Build result selector uses declared inline or connected rule-source metadata.
A result known only from an acquired dynamic rulebook can appear unavailable in
that selector until it is declared in the saved rules source, even though the
runtime projection can explain the captured rulebook. Units remain descriptive;
there is no dimension, currency or reporting-period validator in this increment.

## Replacing a saved workflow

Workflow storage accepts a backup containing exactly one workflow as a replacement
for the selected personal workflow. After preview, the explicit replacement action
checks the current draft fingerprint, preserves an unsaved draft as a version when
needed, and creates a replacement version under the existing workflow identity.
The target's earlier versions, sessions and run records are retained. Imported
history does not replace the target's history.

This operation does not modify an existing session's frozen definition. Start a
new run for the new version. Creating the local replacement version and confirming
server synchronization are separate outcomes. The command rejects a stale draft;
the UI also checks the selected target and workspace. This documentation does not
claim that a particular personal workflow has already been replaced or saved.

## Backup validation and retained evidence

The replacement work exposed repeated evidence in shared-format backups. Server
decoding now reuses decoded subtrees instead of repeatedly expanding identical
references. Valid shared evidence can be retained without spending the traversal
budget again on every reference. Cycles and malformed references still fail.

Existing limits remain: 20,000,000 expanded-text units (and the existing
20,000,000-byte decompression cap), 200,000 encoded graph nodes, 500,000 physical
decode visits and depth 128. Memoized subtree heights also enforce the depth limit
when an already decoded subtree is referenced from a deeper location. No existing
limit was raised to admit this workflow.

Two additional guards bound costs hidden by compact shared references. Typed
schema validation is limited to 500,000 estimated work units, accounting for
repeated typed parsing and cloning while leaving opaque evidence opaque. Logical
JSON expansion is limited to 256 MiB, measured as UTF-8 bytes including repeated
references and multibyte text. This prevents a small encoded graph from causing
unbounded validation work or later serialization. Plain, wrapped, shared and
compressed backups still pass through the existing workflow-library validation.
Rejected saves retain the prior server revision and payload; storage tests cover
both a legitimate shared-evidence roundtrip and rejected amplification.

## Personal FAPI artifact adaptation

The six changed files under `outputs/new-fapi-calc` adapt one personal workflow
artifact to the generic Field. The previous standalone P&L evidence output becomes
a Field named **FAPI worksheet**, directly connected to both calculators. It
declares 26 existing FAPI result lines and 10 separately labelled accounting lines,
including four new pass-through accounting subtotals. Existing tax formulas and
17 missing reviewed tax inputs remain unchanged; no tax inputs, approvals or mock
results are seeded into the portable backup.

The presentation follows the useful pattern reviewed in the `origin/DevReplit`
branch at `c667c8be09efefb306d41e9ad176cbf88b96eeee`: a prominent outcome, nearby
summary lines and expandable evidence. This artifact selects **Net FAPI** in EUR
and CAD as its primary results, with gross amounts, deductions, FAPI before the
foreign-tax deduction, that deduction and the FX rate as supporting summaries.
Tax lines and accounting support are separate detail groups. DevReplit's hardcoded
Gross headline, sample fallback, implicit zero values and UI currency arithmetic
are not carried across. All displayed numbers still come from this session's
captured calculators. Its tax assumptions and defaults are not adopted.

Available accounting support can therefore remain visible while FAPI inputs are
missing. Final evidence export still depends on the complete graph, including its
review checkpoints. The artifact retains the actual parsed workbook and captured
API evidence, and its separately labelled synthetic arithmetic checks operate on
an in-memory clone only. Regenerating these files does not replace or synchronize
the user's already saved app workflow, update the global FAPI template or certify
tax treatment. The artifact README records its source-retention and upload-path
limits.

## Incremental file inventory

The workspace already contained API-source, calculation-variable and generated
Trigger-form changes. They are preserved. This inventory describes the additional
Field worksheet behavior, not all outstanding Git changes. Paths are relative to
the repository; old semantic and verification records remain historical. The 63
file entries below match the scoped baseline comparison captured in
`field-increment.json`; previously dirty files are described only for this
increment. Existing `.archify` snapshots are unchanged historical references,
not current verification of these additions.

### Contracts and execution

| File                                                                                 | Purpose and before → after                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/workflow-contracts/src/domain/field-worksheet.ts`                               | New optional display declaration and typed worksheet/dependency projections, including result prominence, grouping, descriptions and display precision; previously Field had no declared worksheet-line contract.                                                                 |
| `lib/workflow-contracts/src/domain/workflow-rules.ts`                                | Allows the generic Logic-to-Field data connection and Field-to-Output candidate connection used by worksheet previews; a preview does not become protected or approved output.                                                                                                    |
| `lib/workflow-core/src/application/field-worksheet.ts`                               | New portable projection and validation using the existing formula and input resolver; results, missing/stale inputs, earlier calculations and evidence can be explained before Field execution. Recorded-operand disagreement invalidates the explanation; no arithmetic changes. |
| `lib/workflow-core/src/core/recorded-ancestor-results.ts`                            | New bounded active-ancestor traversal and context validator. It admits matching captured ancestor results for inspection without creating data edges or authorizing execution; unrelated, selected and future results are rejected.                                               |
| `lib/workflow-core/src/core/ports.ts`                                                | Adds optional recorded ancestor context to isolated graph requests. Existing graph modes and direct-input contracts remain unchanged.                                                                                                                                             |
| `lib/workflow-core/src/core/graph.ts`                                                | Supplies validated ancestor context separately from direct inputs during isolated execution. Previously an isolated Field could not inspect earlier providers; it now can, without adding execution steps or input transfers. Other graph modes reject this optional context.     |
| `lib/workflow-core/src/application/sessions.ts`                                      | Guided block commands provide actual, nonstale ancestor captures. This prevents valid source-backed Field results from falsely becoming outdated and blocking final output; source invalidation and readiness checks remain authoritative.                                        |
| `lib/workflow-core/package.json`                                                     | Exports the portable Field worksheet API; no independent user-facing behavior change intended.                                                                                                                                                                                    |
| `lib/workflow-core/src/core/calculation-input-inference.ts`                          | Adds optional rule label, unit and operation metadata for explanation. No dependency-inference or calculation behavior change intended.                                                                                                                                           |
| `lib/workflow-core/src/core/calculation-input-rules.ts`                              | Retains display metadata while normalizing effective rules. Rule-source precedence remains unchanged.                                                                                                                                                                             |
| `lib/workflow-executors/src/tools/definitions/field-field-block.ts`                  | Previously copied upstream values only; declared Fields now emit validated worksheet projection and line-ID values with explicit failure/pending status. Undeclared Fields retain their prior executor behavior.                                                                  |
| `lib/workflow-executors/src/tools/ports.ts`                                          | Accepts Field computed values as candidate preview data for Output; this does not promote them to approved/protected values.                                                                                                                                                      |
| `lib/workflow-executors/src/execution/blocks/logic/calculation-engine/definition.ts` | Allows calculated results to route directly to a Field for declared worksheet lines. Arithmetic remains unchanged.                                                                                                                                                                |

### Worksheet UI and shared forms

| File                                                                                                      | Purpose and before → after                                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/logic-viewers/field-worksheet-view.tsx`   | New reusable renderer for prominent primary results, summary rows, grouped detail lines, recursive supporting values, provenance, status and expandable input forms. Previously no generic declared-line view existed before execution; metadata-free worksheets retain the flat presentation. |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/logic-viewers/field-worksheet-editor.tsx` | New editor for connected calculator/result selection, line labels, units, prominence, grouping, description, display precision and add/remove actions. Keeps incomplete edits visible while validation reports errors and retains the old read-only field-label list for undeclared Fields.    |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/logic-viewers/field-worksheet-canvas.ts`  | New browser adapter converts canvas context and reuses recorded-configuration checks; portable projection contains no browser-store logic.                                                                                                                                                     |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx`  | Adds declared-line configuration and preview while retaining the undeclared viewer. Missing, blank and nonnumeric legacy values previously became zero; they now remain absent.                                                                                                                |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/inspector/block-inspector.tsx`            | Replaces the old inline Field configuration list with the focused editor. The read-only legacy list moves to that component; no unrelated inspector behavior change intended.                                                                                                                  |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/overlays/configuration-overlay.tsx`       | Connects Field configuration callbacks and existing ownership/inspection disabling to the workspace; recorded inspection remains read-only.                                                                                                                                                    |
| `artifacts/ai-workflow-builder/src/features/workflow-builder/ui/worksheet-page-view.tsx`                  | Displays declared lines before a recorded Field result, selects records from the current workflow and uses a responsive content width. Previously it read the first stored run without workflow scoping and omitted empty sections.                                                            |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-worksheet.tsx`                 | New early worksheet section for visible declared Fields, projected from the current saved-version session; connects relevant calculator forms without changing execution order.                                                                                                                |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/session-input-drafts.tsx`                       | New transient, session-scoped draft provider; multiple views of one calculator share draft/busy/error state instead of independently staging contradictory changes. No persisted state or formula logic added.                                                                                 |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/session-input-forms.tsx`                        | Calculator forms use the shared draft hook; source forms retain local state. Apply, stale-review and revision-checked session commands remain the same.                                                                                                                                        |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/session-calculation-inputs.tsx`                 | Large connected-source lists previously repeated thousands of options in every input menu, freezing the real workbook run. Lists above 100 choices now open the focused picker; small menus, current/unavailable selections and all provider semantics remain intact.                          |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/session-connected-field-picker.tsx`             | New on-demand connected-field search and pagination, with 50 results per page. It stages only the exact chosen provider through the existing form callback; no values or available paths are removed or inferred.                                                                              |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-panel.tsx`                     | Mounts the shared draft provider and early worksheet section for Chat and Run while retaining Trigger forms and execution controls.                                                                                                                                                            |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-read-model.ts`                 | New panel-scoped read projection shares definition, readiness, input options and worksheet evidence. Previously these were repeatedly cloned or recomputed by each form; reuse is bounded to the same immutable entry/session revision and does not change commands or calculations.           |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-required-inputs-model.ts`              | Prepares resolver options and source labels once per calculator; previously each mounted form repeated full-source scans. Provider precedence, source freshness and field eligibility remain unchanged.                                                                                        |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-required-inputs.tsx`                   | Accepts the panel's prepared calculator groups instead of repeating requirement preparation. Checklist meaning and input actions remain unchanged.                                                                                                                                             |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/use-session-tools.tsx`                           | Memoizes the existing active-session context so unrelated assistant updates do not recompute it. No tool, authorization or calculation behavior change intended.                                                                                                                               |
| `artifacts/ai-workflow-builder/src/features/assistant/ui/chat-workflow-thread.tsx`                        | Memoizes the selected session's existing Chat summary context. No navigation, session selection or execution behavior change intended.                                                                                                                                                         |

### Versioned replacement and backup storage

| File                                                                                      | Purpose and before → after                                                                                                                                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `lib/workflow-core/src/application/commands.ts`                                           | Adds an explicit single-workflow replacement command. Previously an imported definition had to be handled outside a dedicated replacement flow; the command now checks the target fingerprint, preserves unsaved work as a version if needed, keeps the target identity/history and saves the replacement version. |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-draft-replacement.tsx` | New selected-workflow replacement form with file preview, explicit Apply, stale-draft rejection, workspace/target checks and existing viewer restrictions. Selecting a file does not replace the definition; server saving remains separately reported.                                                            |
| `artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-storage-panel.tsx`     | Mounts replacement alongside the existing backup controls. Ordinary Import still creates separate workflows; replacement is a distinct action targeting the selected workflow.                                                                                                                                     |
| `artifacts/api-server/src/storage/validate-backup.ts`                                     | Shared references previously re-expanded during traversal; memoized decoding now retains repeated evidence while preserving existing graph/text/depth limits. Adds cached-height enforcement, schema-work admission and the 256 MiB logical JSON expansion guard before library validation.                        |
| `artifacts/api-server/src/storage/backup-schema-budget.ts`                                | New schema-aware work estimator rejects excessive typed parsing/cloning above 500,000 work units without recursively charging opaque evidence as typed content. Existing contract validation still determines validity.                                                                                            |

### Personal workflow artifact

| File                                                 | Purpose and before → after                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `outputs/new-fapi-calc/build.ts`                     | Existing artifact generator now declares a generic Field with 36 FAPI/accounting lines, adds four accounting pass-through results, connects both calculators and routes the Field to final evidence. Extends verification for real references, direct connections, missing tax inputs and partial worksheet visibility. Existing FAPI arithmetic and tax-input blanks remain unchanged; it edits no saved app workflow. |
| `outputs/new-fapi-calc/new-fapi-calc.backup.json`    | Regenerated portable personal workflow replaces its standalone P&L output with the configured Field and corresponding graph connections. It contains the draft/saved definition and source evidence, with no seeded tax values, runs or approvals. Import or versioned replacement remains an explicit separate action.                                                                                                 |
| `outputs/new-fapi-calc/verification-evidence.json`   | Regenerated evidence report adds declared-line references, available accounting/missing tax projections and separately identified synthetic smoke results. It records verification output; no production behavior or saved app state change is intended.                                                                                                                                                                |
| `outputs/new-fapi-calc/browser-verification.spec.ts` | Updates the existing isolated artifact browser check to inspect 36 early worksheet lines, reconciled actual-workbook accounting, 26 missing tax results and the generated tax-input form. No production behavior change intended; synthetic verification remains isolated from the backup.                                                                                                                              |
| `outputs/new-fapi-calc/browser-session-observer.ts`  | New test-only preloaded reader keeps browser progress checks synchronous and returns compact observations. It retains the 30-second progress assertion and separate DOM responsiveness observations; no production behavior change intended.                                                                                                                                                                            |
| `outputs/new-fapi-calc/README.md`                    | Updates the artifact's purpose, replacement instructions, source/approval limits and reproducible checks; makes partial accounting visibility distinct from a computed FAPI outcome. Documentation only; no production behavior change intended.                                                                                                                                                                        |

### Verification and documentation

| File                                          | Purpose and before → after; no application behavior change intended                                                                                                                                                                                                                               |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/unit/field-worksheet.test.ts`          | Adds focused projection/executor regressions for declared lines, dependency explanation, missing/zero/stale distinctions and compatibility.                                                                                                                                                       |
| `tests/unit/workflow-session-read.test.ts`    | New regressions cover reader reuse, calculator/session isolation, manual zero, same-value source refreshes and stale/failed captures. No production behavior change intended.                                                                                                                     |
| `tests/core/field-worksheet.test.ts`          | Adds portable projection coverage for current/missing/stale values, direct connections, internal and cross-calculator dependencies, provenance and explicit provider choices. Display metadata validation and unrounded result preservation are covered without changing arithmetic expectations. |
| `tests/core/workflow-replacement.test.ts`     | New replacement-command regressions retain identity, unsaved work, old versions and guided-run history; reject ambiguous backups and stale target drafts before mutation.                                                                                                                         |
| `tests/core/workflow-core.test.ts`            | Adds an isolated-context regression for ancestor visibility without additional edges, inputs or executions, and rejection of unrelated/mismatched context. Existing calculation expectations remain unchanged; no production behavior change intended.                                            |
| `tests/unit/backup-validation.test.ts`        | New legacy-format parity and shared-evidence tests cover memoization, cycles, malformed references, original node/visit/text/depth limits, cached-depth checks, logical-byte amplification and repeated schema work.                                                                              |
| `tests/integration/workflow-storage.test.mjs` | Adds real isolated-storage roundtrip coverage for repeated shared evidence and confirms logical/schema amplification failures leave the prior saved revision and payload intact. Earlier unrelated storage tests remain.                                                                          |
| `e2e/calculation-session-fixture.ts`          | Extends the existing isolated calculation fixture with optional worksheet lines and linked calculators so the real shared session UI can exercise early display, dependencies and edits in Chat and Run.                                                                                          |
| `e2e/calculation-large-source-fixture.ts`     | New isolated generic form fixture with a large connected numeric source, defaults and captured provider choices. No production behavior change intended.                                                                                                                                          |
| `e2e/calculation-variables.spec.ts`           | Adds a large-source regression proving bounded idle options, paginated/searchable deep-path selection, manual zero/blank behavior and restoration of the saved setting. Existing cases remain; no production behavior change intended.                                                            |
| `e2e/field-worksheet-session.spec.ts`         | New Chat/Run browser cases cover early main lines, shared Trigger/worksheet drafts, recalculation, nested dependencies and missing versus zero.                                                                                                                                                   |
| `e2e/field-worksheet-editor-fixture.ts`       | New isolated fixture connects the actual display editor, version command and shared preview. It verifies metadata save/clear behavior without changing production behavior or the underlying calculation.                                                                                         |
| `e2e/workflow-replacement-fixture.ts`         | New isolated browser fixture mounts the actual replacement UI with real saved versions, execution/session history and an unrelated workflow; provides a controlled concurrent-draft change.                                                                                                       |
| `e2e/workflow-replacement.spec.ts`            | New browser cases assert replacement preserves target identity/history and unrelated workflows, and refuses a target changed after file selection.                                                                                                                                                |
| `playwright.reliability.config.mjs`           | Registers the focused worksheet and replacement specifications in the existing reliability runner; no production behavior change intended.                                                                                                                                                        |
| `docs/field-worksheet.md`                     | New current-behavior boundary, contract, ownership and scoped before/after inventory.                                                                                                                                                                                                             |
| `docs/ARCHITECTURE.md`                        | Adds portable Field projection ownership and shared transient form-state boundaries.                                                                                                                                                                                                              |
| `docs/FUNCTIONALITY.md`                       | Describes declared worksheet behavior and version-preserving replacement without claiming tax completeness.                                                                                                                                                                                       |
| `docs/calculation-variables.md`               | Connects Field input editing to the existing generated requirements and provider semantics.                                                                                                                                                                                                       |
| `docs/unified-workflow-execution.md`          | Documents early worksheet visibility, shared drafts and the separation between new workflow versions and existing runs.                                                                                                                                                                           |
| `docs/product/decisions.md`                   | Records the generic Field direction and retained calculation/source/review/history boundaries.                                                                                                                                                                                                    |

## Verification status

Verification on 2026-10-05:

- Final `pnpm run verify` passed after the result presentation, responsiveness and
  guided-execution fixes: toolchain, contracts, architecture across 1,055 source
  files, maintained formatting, all application/library/test type checks, 176 unit
  tests, 37 companion-worker tests and 50 portable workflow-core tests. The final
  log is in `test-results/phase2/04a727d1-dc03aeff-a20d-4905-8b8b-2ff037a36503`.
- The complete API/database integration suite passed 60 tests. The subsequently
  added shared-evidence roundtrip and rejected-save preservation test passed
  separately against a freshly built API and isolated database.
- All 13 focused generic browser cases passed: source/manual/default alternatives,
  same-value source-refresh review, large-source search, Field editor save/clear,
  Chat/Run result hierarchy, missing/current zero/outdated distinctions and shared
  input drafts. Both replacement UI cases also passed earlier in this increment,
  preserving identity/history and rejecting a concurrent draft edit.
- Both adapted FAPI browser scenarios passed in the same 15-case run. The real
  workbook reconciled all three profit references, retained all 72 mappings and
  exposed 10 accounting results while leaving 26 tax lines missing. The separate
  synthetic scenario entered all 17 run-only values through the generated form,
  completed the Field and final output, displayed EUR 800.00 / CAD 1,185.41, and
  proved no test inputs became saved defaults. Screenshots were inspected.
- Both real-server persistence browser cases passed: recovery in another browser,
  backup import, offline retry, revision-conflict protection and a one-megabyte
  payload roundtrip.
- The frontend production build passed with provider credentials excluded from
  its environment. Vite reported source-map diagnostics, browser externalization
  warnings and large chunks; no upload or deployment was performed. The build
  final build log is in `test-results/phase2/04a727d1-9987fecb-8d80-4ad3-9417-e4a139eddb6f`.
- Early verification exposed formatting and a missing explicit return in the new
  trace guard; both were corrected. One browser attempt failed during a development
  reload and another during cold dependency warmup. The affected functional cases
  passed with the source tree stable; no assertions or timeouts were weakened.

The real local app accepted its existing library after the decoder fix and showed
**Saved to server**. This confirms recovery of saving, not replacement of the
personal workflow. Applying the prepared replacement is pending restoration of
the browser integration, which reported `Debugger unattached`; Windows control
could not target the native file picker. The final connection check exposed no
browser tabs. The personal workflow was last verified at version 2; this task has
not applied its prepared replacement to that saved workflow.

Early FAPI browser attempts timed out while transferring retained evidence and
awaiting dynamic browser imports during execution. Compact, preloaded synchronous
readers now retain the same 30-second progress assertion with separate DOM
observations. Profiling also found actual application costs:
62,626 source-choice options in one Trigger form and repeated worksheet dependency
scans taking roughly one second per render. The implemented picker reduces that
form's initial server-rendered output to 50 options (23.7 MB to 30.7 KB of HTML),
without dropping available paths. Invocation-local projection caches reduce the
same recorded state's median projection time from 1,045 ms to 89 ms with
byte-identical output. Repeated form preparation was a further measured cost;
the shared session read model prepares this snapshot in about 320 ms and reuses
it in under 0.003 ms until its identity or revision changes.

The final browser run completed the synthetic calculation in 15.1 seconds after
Apply. The real-workbook source/P&L sequence took 41.9 seconds including a warning
acknowledgement and another Resume; import took 0.7 seconds, guided mounting
4.4 seconds and switching to Chat 3.0 seconds. Individual DOM probes during
execution took roughly 2–5 seconds including automation overhead. These local
development measurements demonstrate completion, not instant responsiveness or a
production latency guarantee. Large evidence still carries a cost. The complete
FAPI browser cases took 1.9 minutes and 31.1 seconds respectively.

The guided synthetic smoke also caught and verified the repair of lost ancestor
context at the final Field. Core regressions retain direct-input boundaries and
source-change invalidation. These checks do not establish a tax outcome for the
user, certify the PNL's tax treatment or confirm a fresh live API response.

The browser scenarios exercise the guided workflow card in Chat and Run. They do
not exercise a live model reply. Their workflow-library writes are isolated mocks;
Chat conversation persistence is not covered by these fixtures and shows an
unavailable-save banner in their screenshots. An existing MicroSina provider error
was visible in the real local conversation; provider availability remains
separately unverified.
