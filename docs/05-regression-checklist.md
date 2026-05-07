# Workflow Studio Regression Checklist

Date: 2026-05-04

Use this checklist after inspector, canvas, state, runtime, or workspace changes.

## Inspector Tabs

- Selecting a Source block opens Properties.
- Selecting a Logic block opens Code.
- Selecting a Review / Validation block opens Properties.
- Selecting a Protected block opens Properties.
- Selecting an Output block opens Properties.
- Selecting an AI / Agent block opens Properties.
- Selecting an edge opens Properties.
- The visible inspector tabs remain Properties, Code, and Runs.
- Tab switching does not discard draft edits unless the user explicitly applies or discards them.

## Code Tab

- Formula mode shows Formula fields and formula preview.
- Script mode shows the TypeScript editor and input/output schema fields.
- Condition mode shows condition expression, true path, and false path fields.
- Aggregation mode shows aggregation method and grouped input fields.
- Transformation mode shows transformation type and conversion/normalization fields.
- AI-assisted logic mode shows prompt/config, allowed tools, structured output schema, and guardrails.
- Classification / Mapping mode shows Keyword Mapper logic preview only.
- Keyword Mapper code preview does not show final aggregation or protected result logic.
- Category Rollup Aggregator code preview shows grouping and summing logic only.
- Calculation Engine code preview shows formula evaluation only.
- Hierarchy Aggregator code preview shows category/group/final aggregation logic only.
- Formula/code editing remains in the inspector, not the Structure view.

## Properties Tab

- Source Properties show immutability/versioning messaging.
- Source evidence cannot be silently mutated after use or publish.
- Logic Properties show tool settings and explicit input/output binding context.
- Review / Validation Properties describe readiness, approval, completeness, warnings, or trust checks.
- Protected Properties show governed field state and runtime lock state.
- Output Properties show deliverable/output packaging settings.
- AI / Agent Properties state proposal-only behavior.
- Edge Properties show typed relationship metadata and status.

## Runs Tab

- Runs are local deterministic/sample-data test runs only for v1.
- Running a selected block updates the local output preview.
- Running downstream preserves source/rule/protected trace where available.
- Deleting runs uses the existing alert dialog flow.
- Runs tab does not perform publish or backend execution.

## Canvas And Overlay

- Clicking a block selects it and opens the configuration overlay.
- Clicking a Logic block opens the overlay on Code.
- Clicking non-Logic workflow blocks opens the overlay on Properties.
- Clicking an edge opens the overlay on Properties.
- Connector pull behavior still creates or completes relationships as before.
- The default block -> configuration menu -> Properties/Code/Runs pattern still works.

## Structure Sheet

- Structure remains a generated worksheet/runtime preview.
- Structure uses the generated rows from `src/runtime/generate-structure-view.ts`.
- Structure renders as an accordion/tree hierarchy.
- Protected/high-level rows can contain Logic rows.
- Logic rows can contain child Logic rows and Source leaves.
- Source rows render as read-only evidence leaves.
- Source rows cannot be renamed, deleted, or directly value-edited from Structure.
- Source corrections, annotations, and derived values create downstream Logic.
- Structure hierarchy edits for non-Source rows use command-backed workflow mutations.
- Structure does not become a separate Calculation Sheet.
- Structure does not contain formula/code editors.
- Structure still shows lineage, runs/logs, and JSON previews where already supported.

## Workflow Product Model

- Public block families remain Source, Logic, Review / Validation, Protected, Output, and AI / Agent.
- Sources are immutable truth/reference objects.
- Logic transforms, classifies, calculates, aggregates, or branches.
- Review / Validation judges readiness, trust, approval, completeness, or warnings.
- Protected blocks represent governed inputs/results.
- Output blocks generate deliverables.
- AI / Agent blocks propose changes only.
- Edges remain first-class workflow objects with metadata and status.

## Persistence And Import/Export

- LocalStorage draft persistence still works.
- Import workflow JSON still recreates nodes, edges, block config, and metadata.
- Export workflow JSON still includes workflow state.
- Publish snapshots still preserve workflow data.
- Existing local run records remain readable.

## FAPI Workbook Preparation

- Uploading a normal `.xlsx` still populates the Excel Source without storing the raw File object.
- A workbook with `Trial Balance`, `Keyword Rules`, `Aggregation Rules`, `FAPI Inputs`, and `Expected Results` sheets imports those sheets into the existing source/rulebook blocks.
- Trial Balance rows feed Keyword Mapper `data_rows`.
- Keyword Rules feed Keyword Mapper `keyword_rules`.
- Aggregation Rules and FAPI Inputs feed Hierarchy Aggregator in the compatibility workflow.
- Rollup Rules can feed Category Rollup Aggregator `rollup_rules`.
- Category Rollup Aggregator `named_values` can feed Calculation Engine.
- Calculation Rules can feed Calculation Engine `calculation_rules`.
- Formula Consistency Check compares actual values with Expected Results at tolerance `0.01`.
- After the user uploads the sample workbook, the local working workflow produces A = 4950, Gross = 5650, Deductions = 400, FAPI Brut = 5250, FAT Deduction = 190, Net FAPI = 5060, and Net FAPI CAD = 6831.
- The split-path smoke produces income_bucket = 5500, expense_bucket = 550, Gross = 5650, Deductions = 400, FAPI Brut = 5250, FAT Deduction = 190, Net FAPI = 5060, and Net FAPI CAD = 6831.
- Unknown adjustment remains unmatched and visible.
- Other FAPI income remains low confidence and visible.
- Protected results are final only after approval metadata is present.

## Recommended Commands

Run these before considering the pass complete:

```bash
pnpm fix
pnpm type-check
pnpm build
```
