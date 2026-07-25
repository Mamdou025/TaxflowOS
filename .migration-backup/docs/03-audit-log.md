# Workflow Studio Audit Log

Date: 2026-05-04

This log records stabilization changes and known maintainability risks. It uses the target product model:

`Source -> Logic -> Review / Validation -> Protected -> Output`

## 2026-05-04 Inspector Stabilization

Goal: stabilize the inspector around the accepted v1 tabs:

- Properties
- Code
- Runs

Default tab rules are now centralized in `src/domain/workflow/inspector-rules.ts`:

- Source opens Properties.
- Logic opens Code.
- Review / Validation opens Properties.
- Protected opens Properties.
- Output opens Properties.
- AI / Agent opens Properties.
- Edge opens Properties.

The same domain file also owns the supported Logic Code tab modes:

- Formula
- Script
- Condition
- Aggregation
- Transformation
- AI-assisted logic
- Classification / Mapping

## Files Changed In This Pass

| File | Change |
| --- | --- |
| `src/domain/workflow/inspector-rules.ts` | Added shared inspector tab rules, tab validation, and Logic code modes. |
| `components/workflow/workflow-canvas.tsx` | Replaced inline node/edge tab decisions with domain inspector rules. |
| `components/workflow/node-config-panel.tsx` | Replaced inline node/edge tab decisions with domain inspector rules. Preserved legacy template behavior for non-workflow-block manual triggers and condition actions. |
| `components/overlays/configuration-overlay.tsx` | Reused tab validation from domain rules and kept Logic blocks eligible for the Code tab. |
| `components/workflow/inspector/block-inspector.tsx` | Removed local Logic mode constants, reused focused family editor components, and made Code tab editing adapt to the selected Logic mode. |
| `components/workflow/inspector/family-editors/logic-mode-editor.tsx` | Added focused Logic mode selector. |
| `components/workflow/inspector/family-editors/source-version-notice.tsx` | Added focused Source immutability/versioning notice. |
| `components/workflow/inspector/family-editors/ai-agent-proposal-notice.tsx` | Added focused AI proposal-only notice. |
| `docs/03-audit-log.md` | Added this audit entry. |
| `docs/05-regression-checklist.md` | Added v1 regression checklist. |

## Components Doing Too Much

| File | Risk |
| --- | --- |
| `components/workflow/inspector/block-inspector.tsx` | Still owns generic field rendering, family-specific Properties UI, Code tab editors, run previews, trace panels, and local run presentation. |
| `components/workflow/node-config-panel.tsx` | Still owns inspector shell state, draft state, apply/discard, node and edge editing, run controls, local runner calls, source creation, and tab rendering. |
| `components/overlays/configuration-overlay.tsx` | Still owns modal workspace layout, node and edge editing, source workspaces, data panes, Code/Runs rendering, and run controls. |
| `components/workflow/workflow-studio-shell.tsx` | Still owns shell layout plus the bottom Structure/runtime preview implementation. |

## Product Rules Moved Out Of UI

- Default inspector tab selection now lives in `src/domain/workflow/inspector-rules.ts`.
- Supported Logic Code tab modes now live in `src/domain/workflow/inspector-rules.ts`.
- Edge default tab behavior is now expressed as a domain helper rather than inline UI logic.

## Product Rules Still Embedded In UI

- `block-inspector.tsx` still contains most family-specific Properties rules.
- `configuration-overlay.tsx` still decides some tab visibility based on legacy template node shapes.
- `workflow-studio-shell.tsx` still contains Structure preview mutation affordances; formula/code editing was not moved there in this pass.
- `node-config-panel.tsx` still carries legacy Vercel template action behavior alongside Workflow Studio block behavior.

## Behavior Notes

- Formula/code editing remains inside the inspector Code tab.
- The Structure view remains a generated worksheet/runtime preview, not a separate calculation editor.
- Runs remain local deterministic/sample-data test runs for v1.
- AI / Agent inspector copy continues to enforce proposal-only behavior.

## Follow-Up Refactor Candidates

- Extract Source, Logic, Review / Validation, Protected, Output, and AI / Agent Properties editors into full family-owned components.
- Move the Code tab editor branches into `components/workflow/inspector/code-editors/`.
- Move Runs tab presentation into `components/workflow/runs-panel/`.
- Move modal workspace-specific source/rulebook panes out of `configuration-overlay.tsx`.
- Keep the Vercel template connector-pull -> default block -> configuration menu -> Properties/Code/Runs pattern intact while separating Workflow Studio block logic.

## 2026-05-04 Structure Sheet Stabilization

Goal: keep the Structure Sheet as a generated worksheet/runtime preview, not a duplicate calculation editor.

Owned folders:

- Generation: `src/runtime/`.
- Rendering: `components/workflow/`.
- Commands: `src/state/` and command-backed atoms in `lib/workflow-store.ts`.
- Docs: `docs/`.

Product rules applied:

- Structure can show hierarchy and runtime shape.
- Formula/code editing stays in inspector tabs.
- Source rows are read-only evidence leaves.
- Corrections, annotations, and derived values from Source evidence are downstream Logic.
- Non-Source hierarchy edits should flow through workflow commands.

Changes made:

- Added `src/runtime/generate-structure-view.ts` for pure generated Structure rows, Source traces, selected block lookup, upstream block lookup, and Source row editability.
- Updated `components/workflow/workflow-studio-shell.tsx` to render generated rows from the runtime module.
- Replaced direct Structure edge state mutation with command-backed `connectBlocksAtom`.
- Kept Source row rename/delete/value edit blocked in Structure.
- Added `docs/04-next-steps.md`.
- Expanded `docs/05-regression-checklist.md` for Structure behavior.

What did not change:

- The visual Structure Sheet remains in `workflow-studio-shell.tsx`.
- Formula/code editing remains in the inspector.
- Selection UI still updates React Flow selected flags locally.
- Existing canvas, inspector, local runner, localStorage, import/export, and publish behavior were not redesigned.

Risks left:

- `workflow-studio-shell.tsx` is still too large and still owns multiple bottom-panel previews.
- Structure actions use command-backed atoms, but there is no dedicated Structure command wrapper yet.
- Generated Structure logic has no unit tests yet.
- Source delete/edit policy may need command-level tightening once draft Source behavior is finalized.

## 2026-05-04 Aggregation Rulebook Usability

Goal: reduce visual noise in the modal workspace and make Aggregation Rulebook editing discoverable from the cascade view.

Owned folders:

- Rulebook UI: `components/workflow/source-viewers/`.
- Modal tone: `components/overlays/` and `app/globals.css`.

Changes made:

- Softened the Aggregation Rulebook cascade by replacing several nested card borders with subtle gray surfaces and lighter connector lines.
- Added cascade node edit affordances so selecting a cascade item updates the editable draft node.
- Added a visible `New node` action and a prominent `Save node` action for aggregation rules.
- Kept table and JSON tools available, but moved JSON import/export into an advanced disclosure.
- Softened the modal workspace divider and dark overlay border token.

What did not change:

- Aggregation rules still persist through the existing `aggregationRules` config patch.
- Used/published rulebooks still respect the existing locked/versioned behavior.
- Keyword Rulebook and Hierarchy Aggregator execution behavior were not changed.

Risks left:

- The broader modal workspace still has many surfaces with local borders in other panels.
- The Aggregation Rulebook editor is functional but still lives in a large mixed rule-source component.

## 2026-05-04 Aggregation Rulebook Calculator Builder

Goal: make aggregation rule editing feel like selecting categories and composing a simple calculator expression.

Owned folders:

- Rulebook UI: `components/workflow/source-viewers/`.
- Docs: `docs/`.

Product rules applied:

- Keyword Rulebook owns atomic categories and keywords.
- Aggregation Rulebook owns grouping and formula composition.
- Hierarchy Aggregator remains the execution engine for category totals, node totals, and final totals.

Changes made:

- Added a calculator-style builder to the Aggregation Rulebook editor.
- Added category rollup controls that update `includeCategoryIds`.
- Added formula term controls that append category, node, and constant operands.
- Added a live formula preview using the selected operation.
- Kept raw operands, children, included category IDs, and order available in an advanced node fields section.

What did not change:

- The underlying `aggregationRules` config shape stayed compatible.
- Runtime aggregation behavior was not changed.
- Source immutability and rulebook versioning behavior were not changed.

Risks left:

- The editor still lives in `rule-source-editor.tsx`; it should become a focused Aggregation Rulebook component.
- Category options are derived from the current aggregation rules and draft fields; richer cross-block category discovery can come later.

## 2026-05-04 Light Workspace Theme And Rulebook Outline Selection

Goal: make the workspace easier to read and make the rulebook outline drive editing instead of duplicating the same cascade in multiple panes.

Owned folders:

- Theme shell: `app/` and `app/globals.css`.
- Overlay shell: `components/overlays/`.
- Source/rulebook workspace: `components/workflow/source-viewers/` and `components/workflow/inspector/`.

Product rules applied:

- Rulebooks remain editable governance workspaces.
- Aggregation Rulebook editing changes rules only; Hierarchy Aggregator still executes calculations.
- Canvas behavior is preserved separately from app chrome.

Changes made:

- Forced the app chrome to a light theme while preserving the dark React Flow canvas background.
- Changed the workflow overlay token palette from black/white to lighter gray and white surfaces.
- Made Rulebook outline rows clickable.
- Added a left-pane `New` action for Aggregation Rulebook nodes.
- Passed selected rulebook item state from the left outline into the center editor.
- Hid the duplicate Aggregation Rulebook cascade in the center pane when the left outline is present.

What did not change:

- Canvas rendering, React Flow behavior, node families, and runtime behavior were not changed.
- The existing Properties / Code / Runs pattern remains.
- Aggregation rule storage shape remains `aggregationRules`.

Risks left:

- The right output pane still appears for rulebook blocks, so a future pass may tailor the third pane to rulebook outputs more gently.
- Keyword Rulebook selection is prepared in the outline but its detailed editor still has its own internal selection state.

## 2026-05-04 Aggregation Formula Expressions

Goal: let aggregation formulas behave more like a calculator instead of forcing one operation across every term.

Owned folders:

- Rulebook UI: `components/workflow/source-viewers/`.
- Runtime: `backend/blocks/logic/hierarchy-aggregator/`.
- Rulebook schema: `backend/blocks/source/aggregation-rules/`.

Product rules applied:

- Aggregation Rulebook owns formulas and hierarchy.
- Hierarchy Aggregator executes formulas and emits trace.
- Keyword Mapper remains category-only.

Changes made:

- Added `formulaExpression` to aggregation rule normalization and emitted rulebook output.
- Added infix formula evaluation to Hierarchy Aggregator with `+`, `-`, `*`, `/`, unary minus, parentheses, category refs, node refs, and numbers.
- Kept legacy operation/operand evaluation as a fallback when no formula expression is present.
- Updated the Aggregation Rulebook editor so category, node, operator, and number buttons append to a formula expression field.
- Updated the Hierarchy Aggregator code preview to mention formula expressions.

What did not change:

- Existing `operation` and `operands` rules still work.
- Formula editing remains inside the block workspace/inspector, not the Structure Sheet.

Risks left:

- Formula references currently use stable ids such as `category:interest_income` and `node:income_base`; a later pass can add a friendlier label-to-id picker.

## 2026-05-04 Aggregation Cascade Master Detail

Goal: make the Aggregation Rulebook behave like a cascade navigator on the left and a focused editor in the middle.

Owned folders:

- Rulebook UI: `components/workflow/source-viewers/`.
- Workspace coordination: `components/overlays/` and `components/workflow/inspector/`.

Changes made:

- Restored the Aggregation Rulebook cascade display in the left pane.
- Made aggregation nodes in the cascade select the editable node in the middle pane.
- Made category leaves in the cascade selectable.
- When a category leaf has no aggregation node yet, selecting it opens a draft `category_total` node in the middle editor.
- Saving that draft writes a normal aggregation rule, so it appears in the left cascade/outline on the next render.

What did not change:

- Keyword definitions still live in the Keyword Rulebook.
- Aggregation execution still happens in Hierarchy Aggregator.
- Existing aggregation rules continue to use the same `aggregationRules` config array.

Risks left:

- Constant leaves still point users back to editing the parent formula rather than becoming standalone editable constant nodes.

## 2026-05-04 Keyword Rulebook Master Detail

Goal: make Keyword Rulebook selection match the Aggregation Rulebook workspace pattern.

Owned folders:

- Rulebook UI: `components/workflow/source-viewers/`.
- Source setup coordination: `components/workflow/inspector/`.

Changes made:

- Added controlled selection support to the Keyword Rulebook editor.
- Let the left rulebook outline select a keyword category.
- In the rulebook workspace, the center pane now focuses on the selected keyword category instead of repeating the whole category list.
- Adding, duplicating, or deleting a category keeps the selected category in sync with the left outline.

What did not change:

- Keyword rules still only define atomic category matching.
- Keyword Mapper runtime behavior was not changed.
- Aggregation rollups and formulas remain in the Aggregation Rulebook.

Risks left:

- The left Keyword Rulebook outline does not yet include an add-category shortcut; the center editor still owns that action.

## 2026-05-04 Local Audit Event Model

Goal: add a simple v1 local audit/change event model without introducing a backend audit service.

Owned folders:

- Event model and storage: `src/audit/`.
- Workflow commands: `src/state/`.
- Store integration: `lib/workflow-store.ts`.
- Toolbar and AI local actions: `components/workflow/`.

Product rules applied:

- Edges are first-class workflow objects with metadata and history.
- Sources and Protected blocks should not be silently mutated.
- AI proposes changes only; approval/rejection is explicit.
- Local v1 audit events are best-effort and must not block workflow editing.

Changes made:

- Added `src/audit/workflow-events.ts` with v1 audit event types and summary helpers.
- Added `src/audit/change-log.ts` with a capped localStorage-backed event log and memory fallback.
- Extended workflow command results with structured audit events.
- Commands now emit local audit events for block create/update/delete, edge create/update/delete/split, protected block update/unlock, and source-derived Logic creation.
- Toolbar import/export/publish actions now record workflow-level audit events.
- Local AI proposal create/approve/reject actions now record proposal audit events.

What did not change:

- Existing local snapshot `WorkflowEvent` records remain intact.
- Autosave behavior remains unchanged.
- No backend audit table or API integration was added.
- No visible UI panel was added for the audit log.

Risks left:

- Block duplication is represented in the event model, but there is no block duplicate command wired yet.
- Some legacy direct mutations still exist outside command-backed paths, especially sample/demo replacement and AI apply internals.
- Audit events are inspectable through localStorage, not yet through a first-class UI.

## 2026-05-04 FAPI Workbook Preparation Workflow

Goal: prepare the existing Workflow Studio prototype to run a local FAPI-style workflow from a normal uploaded workbook without redesigning the app.

Owned folders:

- Workbook import helpers: `components/workflow/source-viewers/`.
- Backend-style Source and Logic tools: `backend/blocks/`.
- Local runner registry: `lib/local-tool-registry.ts`.
- Working workflow preparation shell: `lib/workflow/sample-workflows/`.

Product rules applied:

- Excel workbook data remains Source evidence.
- Keyword rules classify rows into atomic categories only.
- Aggregation rules and Hierarchy Aggregator own formulas, rollups, and final values.
- Protected blocks lock governed values after approval.
- Validation compares actual calculator output to expected workbook values.

Changes made:

- Added workbook sheet import helpers for Trial Balance, Keyword Rules, Aggregation Rules, FAPI Inputs, and Expected Results sheets.
- Added a backend-style Currency Rate Source that supports deterministic workbook override rates and keeps a future FX lookup code path.
- Extended Hierarchy Aggregator with `fapi_inputs`, official line values, `sum_abs`, `max_subtract_zero`, and `min_multiply_cap`.
- Added Formula Consistency Check as a local review tool.
- Rebuilt the working workflow as an upload-ready FAPI-style preparation sample using existing Source, Logic, Review, Protected, and Output blocks.
- Kept generated workbook data out of the workflow shell; the uploaded `.xlsx` is the workbook evidence.

What did not change:

- No backend upload/storage integration was added.
- No OCR, PDF parser, Taxprep, ONESOURCE, or real AI integration was added.
- The canvas, inspector, edge model, local runner, and import/export/publish model were preserved.

Expected result after uploading the sample workbook:

- A = 4950 USD.
- Gross = 5650 USD.
- Deductions = 400 USD.
- FAPI Brut = 5250 USD.
- FAT Deduction = 190 USD.
- Net FAPI = 5060 USD.
- Net FAPI CAD = 6831 CAD.
- Formula consistency should pass against expected results.
- Unknown adjustment remains unmatched.
- Other FAPI income remains low confidence.

## 2026-05-05 FX Source Canvas Icon Clarification

Goal: make the Bank of Canada FX Rate Source read visually as API-backed while preserving the standard Source block shape.

Owned folder:

- Canvas node shape display: `components/workflow/nodes/`.

Product rules applied:

- FX rate remains a Source reference.
- Source values are reviewed/protected downstream instead of silently edited.
- Visual identity may clarify source kind without changing block family or runtime wiring.

Changes made:

- Updated the family node shape icon resolver so `Currency Rate` uses the same API-style braces icon as API request/response blocks.
- Preserved the normal Source block shape for FX rate nodes.

What did not change:

- No FX lookup, review, protected rate, or calculator behavior changed.
- No new block family was introduced.
- Existing Source output roles and edge bindings remain unchanged.

## 2026-05-05 Local Run Loading Stabilization

Goal: stop local Workflow Studio runs from staying in a loading state after workbook upload.

Owned folders:

- Toolbar run action: `components/workflow/`.
- Runs panel polling: `components/workflow/`.
- Route-level execution polling: `app/workflows/`.
- Local run persistence: `lib/`.

Product rules applied:

- The workbook-backed fiscal workflow remains a local prototype workflow.
- Source upload and evidence parsing stay in the Source path.
- Run execution uses the existing local tool runner; no backend execution integration was added.
- Run history is best-effort and must not block the user from seeing current results.

Changes made:

- Local Source/Logic/Review/Protected/Output tool workflows now use the local runner even when the page has a saved or route workflow id.
- The local run path now clears `isExecuting` in a `finally` block, so errors surface instead of leaving the toolbar spinner active.
- Local run records are compacted before saving when workbook payloads are too large for browser storage.
- Local run ids no longer trigger backend execution polling in the Runs panel or workflow route page.

What did not change:

- No runtime calculation behavior was intentionally changed.
- No workbook parsing behavior was changed.
- No backend run API was introduced.
- Existing backend execution remains available for non-local template workflows.

Risks left:

- Local run history compaction is not yet covered by a browser quota regression test.
- The UI still needs a friendlier error summary when a run completes with missing required Source outputs.

## 2026-05-05 Run Output Coherence Fix

Goal: make uploaded-workbook runs show coherent mapping, aggregation, calculation, protected, and output data after Run.

Owned folders:

- Hierarchy Aggregator runtime: `backend/blocks/logic/hierarchy-aggregator/`.
- Block data-flow panes: `components/workflow/workspace/`.
- Logic result panel: `components/workflow/logic-viewers/`.
- Output packaging: `lib/`.
- Data preview helpers: `components/workflow/data-viewer/`.

Product rules applied:

- Logic outputs must be visible even before Protected blocks become final.
- Edges should make the same output role visible as the downstream input role.
- Protected blocks can carry draft candidate values while showing whether they are final/runtime-locked.
- Output packages should show calculation evidence, totals, formula traces, warnings, and protected values.

Changes made:

- Fixed FAPI input merging so a protected FX-rate input adds `fxRate` without wiping workbook inputs such as `inclusionRate`, `fatPaid`, and `rtf`.
- Fixed the Hierarchy Aggregator panel so it reads the flattened latest tool output instead of the outer run envelope.
- Improved data-flow input display for Protected blocks so `final_totals` and `official_line_values` show the named candidate value used by that Protected block.
- Improved aggregation preview summaries for numeric total maps such as category totals, node totals, and final totals.
- Added generic evidence and canonical JSON packaging for workflows that are not the older Z/W demos, including aggregation totals and formula traces.

What did not change:

- No separate Calculation Engine was introduced.
- No backend server execution path was added.
- No approval semantics changed; unapproved Protected results still show candidate values but remain not final.

Risks left:

- Data-flow role coherence still needs browser regression tests around expanded Input/Output panes.
- Output packages now expose richer local payloads, but the final visual formatting can still be improved.

## 2026-05-05 Workspace Run Payload Visibility Fix

Goal: make the block workspace show mapped rows, aggregation inputs, totals, and final results immediately after a workbook-backed local run.

Owned folders:

- Workspace data-flow panes: `components/workflow/workspace/`.
- Configuration overlay workspace: `components/overlays/`.
- Inspector panel run state: `components/workflow/`.
- Local run persistence: `lib/`.

Product rules applied:

- Logic outputs are visible as draft calculation results before approval.
- Edge-bound output roles should appear as downstream input roles.
- Local run history is best-effort and must not hide the current run output.

Changes made:

- Added an in-memory latest-run view model so workspace panes prefer the current selected execution output from `executionLogsAtom`.
- Kept persisted local run records as fallback for older runs and reloads.
- Made the output-pane `Execute step` action run the selected block plus its upstream inputs in the block workspace.
- Changed local run persistence fallback to try saving the newest full run by itself before compacting to minimal history.

What did not change:

- No mapper, aggregation, formula, protected, or output calculation behavior changed.
- No backend execution path was added.
- Approval behavior remains unchanged; results can be inspected before final approval.

Risks left:

- A very large workbook can still exceed browser storage after the current session, though the open workspace now keeps current outputs in memory.
- The run history panel still needs a richer warning when stored history has been compacted.

## 2026-05-05 Rollup & Calculation Clarity Pass

Goal: make the existing combined Hierarchy Aggregator understandable without adding a separate Calculation Engine.

Owned folders:

- Logic runtime metadata: `backend/blocks/logic/hierarchy-aggregator/`.
- Rule Source UI: `components/workflow/source-viewers/`.
- Logic run proof UI: `components/workflow/logic-viewers/`.
- Inspector and data previews: `components/workflow/inspector/` and `components/workflow/data-viewer/`.
- Output packaging: `lib/`.

Product rules applied:

- Logic can roll up categories and calculate formulas, but the inspector must make that behavior clear.
- Formula/code editing stays in the inspector/rule source editor, not in the Structure Sheet.
- Aggregation Rules remain a Rule / Knowledge Source.
- No separate Calculation Engine was introduced for v1.

Changes made:

- Relabeled the existing Hierarchy Aggregator as Rollup & Calculation Engine while preserving its tool id and subtype.
- Added shared display-mode helpers for Rollup, Formula, Constant, Final result, and Official line nodes.
- Updated the Aggregation Rulebook cascade/table/editor to show modes, output roles, all supported operations, and mode-specific guidance.
- Updated the Code tab to show grouped rollup/calculation preview sections.
- Added structured run sections for category totals, rollup totals, formula/final totals, formula trace, and warnings.
- Improved output table rendering for numeric totals and formula traces.
- Updated Evidence Preview and Canonical JSON labels for rollup/calculation outputs.

What did not change:

- Runtime computation semantics were not changed.
- Existing `logic.hierarchy_aggregator` workflows remain compatible.
- No backend server, OCR/PDF parser, real AI call, or separate Calculation Sheet was added.

Risks left:

- The rule editor is clearer, but it is still a large component that should be split later.
- Browser regression tests should confirm the Run tab and Output pane render the same totals after workbook upload and Run.

## 2026-05-05 FAPI Calculation Simulation Audit

Goal: verify whether the current generic Workflow Studio can run a FAPI-style calculation from source rows through mapping, rollup/calculation, validation, protected results, and outputs.

Owned folders:

- Local simulation script: `scripts/`.
- Workflow audit documentation: `docs/`.
- Existing workflow/runtime pieces inspected under `lib/`, `backend/`, and `components/workflow/`.

Product rules applied:

- FAPI remains a sample workflow, not the product model.
- Sources remain immutable evidence and Rule / Knowledge Sources.
- Rollup and calculation stay combined in the existing Hierarchy Aggregator for v1.
- Formula/calculation inspection remains in the block inspector/output report, not a separate Calculation Sheet.

Changes made:

- Added `scripts/smoke-fapi-calculation-simulation.ts` to run the existing Working FAPI Workbook Preparation Demo with workbook-equivalent local fixture rows.
- Added `docs/workflow-studio-fapi-calculation-simulation-audit.md`.
- Added `docs/generated-fapi-calculation-report.md`.

Findings:

- The local runner calculates the expected FAPI-style values: A `4950`, Gross `5650`, Deductions `400`, FAPI Brut `5250`, FAT Deduction `190`, Net FAPI `5060`, and Net FAPI CAD `6831`.
- Formula consistency passes at tolerance `0.01`.
- The run remains review-ready because one row is unmatched and one mapped row is below confidence `0.75`.
- The current UI screenshots point to a run-result visibility/state issue: uploaded rows can appear as inputs while block outputs still show `Not executed`.

Risks left at the time of that audit, addressed or refined below:

- Protected results lock in the local sample even when unrelated mapping warnings remain elsewhere in the graph.
- Required Input Check and Output Readiness Check exist but are not wired into the working source/rulebook simulation graph.
- Browser regression is still needed for the actual uploaded workbook and Run button path.

## 2026-05-05 FAPI Finality Gate And Run-State Coherence

Goal: keep the FAPI-style working workflow review-ready until blocking validations are resolved, while preserving the existing combined Rollup & Calculation Engine.

Owned folders:

- Local tool finality behavior: `lib/`.
- Working sample graph wiring: `lib/workflow/sample-workflows/`.
- Smoke guard: `scripts/`.
- Audit/report docs: `docs/`.

Product rules applied:

- Review / Validation determines readiness.
- Protected blocks govern finality and runtime locking.
- Logic calculation results remain inspectable before final approval.
- No separate Calculation Engine or Calculation Sheet was added.

Changes made:

- Wired Required Input Check into the working source/rulebook graph for workbook rows, rules, FAT paid, RTF, FX rate, inclusion rate, and expected results.
- Wired Output Readiness Check before Evidence Preview and Canonical JSON.
- Updated Protected Result finality so clean-final locking requires approval and no unresolved blocking validation findings.
- Kept Mapping Quality Check as a non-blocking warning and Unmatched Rows Check as blocking by default.
- Updated Evidence Preview and Canonical JSON with `finalityStatus`, validation summaries, blocking issues, non-blocking warnings, reviewer overrides, and protected result finality.
- Updated the FAPI smoke script to assert calculation values, validation gates, review-ready output finality, and unlocked protected result candidates.

What did not change:

- Rollup and calculation remain combined in `logic.hierarchy_aggregator`.
- No backend server execution path, Taxprep/ONESOURCE, OCR/PDF, or real AI integration was added.
- The working sample remains a generic fiscal workflow sample, not a FAPI-only product mode.

Risks left:

- Reviewer override UX is still a simple config/data shape rather than a dedicated approval screen.
- Browser regression is still needed for the actual uploaded workbook and Run button path.
