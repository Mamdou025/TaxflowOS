# Workflow Studio Aggregation / Calculation Audit

Date: 2026-05-05

This audit documents the aggregation and calculation implementation in Workflow Studio. The latest pass keeps the existing combined `Hierarchy Aggregator` available for compatibility and adds a clearer split path for v1 experimentation: Category Rollup Aggregator plus Calculation Engine.

Target product model:

`Source -> Logic -> Review / Validation -> Protected -> Output`

Product rules used for this audit:

- Sources are immutable truth/reference objects.
- Logic classifies, transforms, aggregates, calculates, branches, or scripts.
- Review / Validation judges readiness, trust, approval, completeness, and warnings.
- Protected blocks govern final inputs/results.
- Output blocks package deliverables.
- Formula/code editing belongs in inspector tabs, not in the Structure Sheet.
- Workflow Studio remains generic; FAPI is only the first fiscal sample.

## Executive Recommendation

Recommendation: use option 4, a hybrid path.

Keep the current `Hierarchy Aggregator` available as the combined compatibility tool, and add separate Logic tools where users want clearer responsibilities:

- `logic.category_rollup_aggregator`: category grouping and rollup subtotals only.
- `logic.calculation_engine`: arithmetic/formula rules over named values and protected/source inputs.
- `logic.hierarchy_aggregator`: existing combined Rollup & Calculation Engine for compatibility.

The split path is implemented without adding a new public block family, without adding a Calculation Sheet, and without making Workflow Studio FAPI-only.

## Calculation Rules are optional

**2026-05-06 update**: Calculation Rules Source is no longer required for every Calculation Engine block.

The Calculation Engine supports two formula modes:

### Inline formula mode (default)

Formulas live directly inside the Calculation Engine block config under the `formulas` key. Best for one-off or workflow-specific calculations. Formulas are editable in the block's Properties tab.

Config shape:
```json
{
  "mode": "auto",
  "formulas": [
    { "calculationId": "GROSS", "label": "Gross", "operation": "add", "operands": ["A", "A1", "A2", "B", "C"], "resultKey": "GROSS", "description": "Gross = A + A1 + A2 + B + C" }
  ]
}
```

### External rules mode

Formulas come from a connected Calculation Rules Source (Source subtype `Calculation Rules`). Best for reusable, governed, imported, or firm-standard formulas.

### Mode behavior

| mode | behavior |
|---|---|
| `auto` | Uses external rules if a Calculation Rules Source is connected; otherwise uses inline `formulas`. |
| `inline` | Always uses inline formulas from block config. |
| `external_rules` | Requires a connected Calculation Rules Source. |

### Default working workflow

The default FAPI-style workflow (`working-source-rules-demo.ts`) now uses inline formula mode:

- The Calculation Engine block carries inline formulas directly in its config.
- No Calculation Rules Source edge is required.
- The Calculation Rules Source catalog item remains available for advanced/governed formula packs.
- Required Input Check no longer checks for `calculation_rules`.

### Inline formula editor

The Calculation Engine Properties tab shows:
- Mode selector (auto / inline / external_rules).
- Mode notice: which formula source is active.
- Available values panel (upstream named values for formula authoring).
- Formula list with expand/edit/delete per formula.
- Add formula button.

The Code tab shows the active formula mode and a generated formula list from config.

The Runs tab shows the formula trace, calculated results, and run summary including the resolved formula mode.

### FAPI smoke values (inline formula mode)

Expected and confirmed:
- GROSS = 5650
- DEDUCTIONS = 400
- FAPI_BRUT = 5250
- FAT_DEDUCTION = 190
- NET_FAPI = 5060
- NET_FAPI_CAD = 6831

## Aggregation/Calculation Split Path

Implemented split responsibilities:

- Keyword Mapper remains mapping-only: `data_rows` + `keyword_rules` -> `mapped_rows`, `unmatched_rows`, `low_confidence_rows`.
- Category Rollup Aggregator groups mapped rows by category and applies rollup rules: `mapped_rows` + `rollup_rules` -> `category_totals`, `rollup_totals`, `named_values`, row inclusion details, and `rollup_formula_trace`.
- Calculation Engine applies formulas over named values and source/protected inputs: `named_values` + optional `calculation_rules` + optional protected inputs -> `calculated_results`, `formula_trace`, `calculation_summary`.

New Rule / Knowledge Sources:

- Rollup Rules Source: Source subtype `Rollup Rules`, sourceKind `rollup_rules`, output role `rollup_rules`.
- Calculation Rules Source: Source subtype `Calculation Rules`, sourceKind `calculation_rules`, output role `calculation_rules`.

Compatibility:

- Existing `source.aggregation_rules` remains available and editable/versioned.
- Existing `logic.hierarchy_aggregator` remains available as Rollup & Calculation Engine.
- Existing working FAPI workflow still runs on the combined engine to avoid breaking the current upload/run path.
- The smoke test now verifies the split path in parallel and confirms it reproduces the same FAPI-style values.

## A. Current Tools Found

| Tool / block | Family / subtype | Tool group | File path | Purpose | Inputs | Outputs | Operations supported | Rules consumed | Code preview | Run result behavior |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `logic.hierarchy_aggregator` | Logic / Hierarchy Aggregator | `calculation` | `backend/blocks/logic/hierarchy-aggregator/definition.ts`, `backend/blocks/logic/hierarchy-aggregator/run.ts`, adapted by `lib/local-tool-registry.ts` | Main combined hierarchy and calculator tool. Groups mapped categories, evaluates aggregation nodes, emits final totals and formula traces. | `mapped_rows`, `aggregation_rules`, optional `fapi_inputs` / reviewed FX / protected inputs. | `category_totals`, `node_totals`, `group_totals`, `final_totals`, `official_line_values`, `aggregation_tree`, `included_rows_by_node`, `excluded_rows`, `formula_trace`, `aggregation_summary`. | `sum`, `sum_abs`, `add`, `subtract`, `multiply`, `divide`, `pass_through`, `max_subtract_zero`, `min_multiply_cap`, plus `formulaExpression` infix formulas with `category:`, `node:`, `input:` / `fapi:` refs. | `source.aggregation_rules` output role `aggregation_rules`. | `components/workflow/inspector/code-preview/hierarchy-aggregator-code-preview.ts`. Preview shows category grouping, node evaluation, final totals, and formula traces, but currently omits `sum_abs`, `max_subtract_zero`, and `min_multiply_cap` from the supported operation list. | Backend runner evaluates nodes recursively with cycle protection, warns and zeros missing refs, warns and marks needs review on divide by zero, emits flattened outputs for existing viewers. |
| `logic.aggregation` | Logic / Aggregation | `calculation` | `lib/local-tool-registry.ts`, preview in `components/workflow/inspector/code-preview/aggregation-code-preview.ts` | Legacy/simple section aggregator. Filters mapped rows by target, section, subsection, and sums amount field. | `mapped_rows`. | `subtotal`, `included_rows`, `excluded_rows`, `aggregation_summary`, `formulaTrace`, `value`. | Deterministic sum only, despite config field `aggregationMethod`. | No aggregation rulebook. Uses config filters such as `includeSectionIds`. | Preview shows row filtering by `target`, `sectionId`, and `subsectionId`, then summing `amountField`. | Produces warning when no rows match. Existing expanded demos still use it for Z/W-style section aggregation. |
| `logic.formula` | Logic / Formula | `calculation` | `lib/local-tool-registry.ts`, preview in `components/workflow/inspector/code-preview/formula-code-preview.ts` | Legacy/simple numeric formula block. Calculates one value from upstream numeric values. | `values` from Logic or Source outputs. | `value`, `formula_trace`. | `add`, `subtract`, `multiply`, `divide`, `percentage`; divide by zero keeps prior result rather than erroring. | No rule source. Uses config operands/formula/operation. | Preview shows safe operation over upstream values, not arbitrary JavaScript. | Emits `formulaTrace`, `inputValues`, and one numeric `value`; warns if no numeric operands exist. |
| `source.aggregation_rules` | Source / Aggregation Rules | `source` | `backend/blocks/source/aggregation-rules/definition.ts`, `backend/blocks/source/aggregation-rules/run.ts`, schema in `backend/blocks/source/aggregation-rules/schema.ts` | Rule / Knowledge Source for category hierarchy, formula rules, constants, and final result rollups. | None. | `aggregation_rules`, `aggregation_tree`, `rule_metadata`, `rule_version`. | Data model allows all operations used by `logic.hierarchy_aggregator`. | Owns the aggregation rulebook data. | Source preview in `components/workflow/inspector/code-preview/source-code-preview.ts` marks emitted rules as immutable evidence/reference. | Emits rules with evidence refs, source trace, version metadata, read-only evidence flags, and rule count. |
| `review.formula_consistency_check` | Review / Validation / Formula Consistency Check | `review` | `lib/local-tool-registry.ts` | Compares actual calculated values against expected workbook values. | `checked_items`, usually calculator outputs plus expected results. | `validation_result`, `review_status`, `formulaConsistency`, `mismatches`. | None. Validation only. | Reads expected and actual values from upstream outputs. | Generic validation preview through `components/workflow/inspector/code-preview/validation-code-preview.ts`. | Emits pass/warning with tolerance, mismatches, checked count, and warnings. |
| `protected.protected_result` | Protected / Protected Result | `protected` | `lib/local-tool-registry.ts` | Locks governed final results after approval/review. | Candidate values from `final_totals`, `official_line_values`, or other numeric upstream outputs, plus approval status. | `protected_result`, `governed_value`. | None. Governance only. | Reads result names from calculator outputs. | `components/workflow/inspector/code-preview/protected-result-code-preview.ts`. | Emits locked/final protected result when approvals pass; otherwise status reflects review. |
| `output.evidence_pack_preview` / `output.canonical_json` | Output | `output` | `lib/local-tool-registry.ts` | Packages mapped rows, aggregation details, formula trace, validation warnings, protected results, and workflow trace. | Upstream Source / Logic / Review / Protected outputs. | Human-readable preview package and canonical JSON. | None. Packaging only. | Reads aggregation summaries and formula traces from upstream results. | `components/workflow/inspector/code-preview/output-code-preview.ts`. | Collects available mapping, aggregation, validation, and protected result data into output payloads. |

## B. Current Rule Sources Found

### Aggregation Rulebook

- Source kind: `aggregation_rules`.
- Output role: `aggregation_rules`.
- Current backend paths:
  - `backend/blocks/source/aggregation-rules/definition.ts`
  - `backend/blocks/source/aggregation-rules/schema.ts`
  - `backend/blocks/source/aggregation-rules/run.ts`
  - `backend/blocks/source/aggregation-rules/fixtures.ts`
- Current UI paths:
  - `components/workflow/source-viewers/rule-source-editor.tsx`
  - `components/workflow/source-viewers/aggregation-rules-overview.tsx`
  - `components/workflow/inspector/source-setup-panel.tsx`
  - `components/workflow/workspace/block-data-flow-pane.tsx`
- Data model:
  - `nodeId`
  - `label`
  - `nodeType`: `category_total`, `group`, `final_result`, `constant`, `formula`
  - `operation`: `sum`, `sum_abs`, `add`, `subtract`, `multiply`, `divide`, `pass_through`, `max_subtract_zero`, `min_multiply_cap`
  - `includeCategoryIds`
  - `children`
  - `operands`
  - `formulaExpression`
  - `value`
  - `outputRole`
  - `resultName`
  - `description`
  - `order`
- Editable:
  - Draft rulebooks are editable through the rule source editor.
  - Used/published rulebooks show lock/versioning behavior and can create a new source version.
- Mixed responsibility:
  - This source currently defines both aggregation hierarchy and arithmetic calculation formulas.

### Keyword Rulebook

- Source kind: `keyword_rules`.
- Output role: `keyword_rules`.
- Relevant paths:
  - `backend/blocks/source/keyword-rules/*`
  - `components/workflow/source-viewers/rule-source-editor.tsx`
  - `components/workflow/source-viewers/keyword-rulebook-editor.tsx`
- Purpose:
  - Classifies source rows into atomic categories only.
- Relationship to aggregation:
  - Keyword rules define the category leaves that Aggregation Rulebook nodes reference.
  - Keyword rules should not assign final result lines.

### Workbook-imported rule sheets

- Parser path: `components/workflow/source-viewers/excel-utils.ts`.
- `parseAggregationRulesSheet` imports aggregation rules from workbook sheets named `Aggregation Rules`, `Aggregation Rulebook`, or `Calculation Rules`.
- The parser supports:
  - node ids, labels, types, operations, included categories, children, operands, formula expressions, output role, result name, order, value.
- `parseKeywordRulesSheet` imports keyword rules from `Keyword Rules` or `Keyword Rulebook`.
- `buildFapiWorkbookImportPatch` can import Trial Balance, Keyword Rules, Aggregation Rules, FAPI Inputs, and Expected Results into the current workflow preparation flow.

## C. Current Flow

### Working Excel Source + Rulebooks flow

Current fixture: `lib/workflow/sample-workflows/working-source-rules-demo.ts`.

The flow is:

1. Excel Source: `Uploaded Workbook`
   - Exposes `selected_rows`.
   - Currently requires user upload for the main working flow.
2. Keyword Rulebook
   - Emits `keyword_rules`.
3. Keyword Mapper
   - Consumes `selected_rows` and `keyword_rules`.
   - Emits `mapped_rows`, `unmatched_rows`, `low_confidence_rows`, `conflicts`, and `mapping_summary`.
4. Aggregation Rulebook
   - Emits `aggregation_rules`.
   - Contains rollups, official line formulas, final totals, FX-related formula expression, and expected FAPI-style nodes.
5. FAPI Inputs Source and Bank of Canada FX Rate Source
   - Emit workbook assumptions and exchange-rate data.
   - FX source is reviewed and protected before calculator use.
6. Hierarchy Aggregator
   - Consumes `mapped_rows`, `aggregation_rules`, `fapi_inputs`, and protected/reviewed FX input.
   - Emits category totals, node totals, official line values, final totals, formula trace, and aggregation summary.
7. Review / Validation
   - Checks low confidence, unmatched rows, formula consistency, and output readiness.
8. Protected Results
   - Lock official lines and summary results after approval.
9. Output
   - Evidence Pack Preview and Canonical JSON include mapping, aggregation, formula trace, validation, protected results, and trace.

### Older expanded mapping flow

Current fixture: `lib/workflow/sample-workflows/expanded-mapping-pipeline-demo.ts`.

This flow still uses the older `logic.aggregation` blocks:

- `Aggregate Z Sections` filters mapped rows by `includeSectionIds: ["Z"]`.
- `Aggregate W Sections` filters mapped rows by `includeSectionIds: ["W"]`.
- This depends on older mapped row fields such as `sectionId` and is not rulebook-driven.

This older flow is useful as a compatibility fixture, but it should not be the main model for FAPI-style formulas.

### Legacy local sample flow

`lib/local-fiscal-workflow.ts` still contains older sample workflows where:

- `logic.aggregation` aggregates groups of mapped rows.
- `logic.formula` applies one safe numeric operation such as FX conversion.
- FX rate examples include manual/API-looking mock sources and protected inputs.

These are compatibility/sample paths and should stay stable while the working rulebook flow matures.

## D. Where Aggregation And Calculation Are Mixed

The main mixed area is `logic.hierarchy_aggregator`.

It currently handles:

- Category grouping from `mapped_rows`.
- Category totals by `categoryId`.
- Hierarchy/group rollups from `includeCategoryIds`, `children`, and `operands`.
- Constants.
- Arithmetic operations.
- Special fiscal calculation operations:
  - `sum_abs`
  - `max_subtract_zero`
  - `min_multiply_cap`
- Infix formula expressions:
  - Example: `node:NET_FAPI * input:fxRate`
  - Supports category, node, and input references.
- Official line values.
- Final totals.
- Included/excluded rows.
- Formula trace generation.
- Warning generation for missing references, cycles, and divide by zero.

The main mixed rule model is `AggregationRule`.

It currently represents:

- Category grouping rules.
- Parent/group hierarchy.
- Formula nodes.
- Constants.
- Final result nodes.
- Official-line output metadata.
- Input/rate references.

This is coherent for a v1 combined block, but the model is already doing more than pure aggregation.

## E. Strengths Of The Current Combined Design

- The main user flow has fewer blocks and less wiring.
- The existing `Hierarchy Aggregator` already computes category totals, node totals, final totals, official line values, and formula traces.
- It supports user-requested calculator-style formulas such as `category A + category B - category C + 1.5 * category D / category E`.
- It can represent FAPI-style formulas without a separate Calculation Sheet.
- It preserves traceability from source rows and rulebook nodes through output packages.
- It already has safe handling for divide by zero and missing references.
- It makes the current working demo easier to run locally.
- It keeps formulas under Logic, which matches the product rule.

## F. Weaknesses Of The Current Combined Design

- The term "Aggregation" now covers both rollup hierarchy and arithmetic formulas, which can confuse fiscal users.
- The rulebook editor must explain both category grouping and calculation behavior in one place.
- The Code tab preview does not list every supported backend operation.
- The older `logic.aggregation` tool still uses `target`, `sectionId`, and `subsectionId`, which can make the model look like Keyword Mapper still routes final lines in older demos.
- Formula expressions and operation/operand nodes coexist, which can be powerful but needs clearer UI guidance.
- `AggregationRuleSourceEditor` is doing many jobs: cascade selection, table view, form editing, calculator token builder, JSON import/export, version locking, and config persistence.
- Real FAPI has separate concepts for review/input lines, result lines, line formulas, formula traces, and frozen concept/rule libraries. The current combined block can mirror that only up to a point.
- Validation boundaries are harder to explain when grouping, formula evaluation, rate/reference input use, and final result production all occur in one Logic block.

## G. Recommendation

Keep the combined `Hierarchy Aggregator` for v1 and do not split aggregation/calculation in this pass.

Use the hybrid path:

1. Keep the existing combined block for the current working workflow.
2. Make its internal vocabulary clearer:
   - Rollup node
   - Formula node
   - Constant
   - Final result
   - Official line
3. Keep the older `logic.aggregation` and `logic.formula` tools for compatibility and simple demos.
4. Plan a dedicated Calculation Engine later if the FAPI workflow needs reusable line formulas, more complex min/max/cap logic, richer rate handling, or independent validation of formula definitions.

Reasoning:

- The current combined implementation is already functional and traceable.
- The user-facing issue is mostly clarity and editability, not runtime capability.
- A split now would require migration of rule source shape, edge bindings, Code previews, run viewers, protected result bindings, output packaging, and demo workflows.
- The v1 product still benefits from proving a coherent workflow before adding another Logic block.

## H. Staged Migration Plan If A Split Becomes Necessary

Do not execute this migration now. This is a staged plan for a future pass.

### Stage 1: Clarify the combined model

- Rename UI sections, not tool IDs:
  - "Category rollups"
  - "Formulas"
  - "Final results"
- Update Code preview to list all supported operations:
  - `sum`, `sum_abs`, `add`, `subtract`, `multiply`, `divide`, `pass_through`, `max_subtract_zero`, `min_multiply_cap`.
- In Runs, separate tables for:
  - category totals
  - rollup/group totals
  - formula/final totals
  - official line values
  - formula trace
- Keep backend behavior unchanged.

### Stage 2: Mark internal modes in rule metadata

- Add optional metadata only:
  - `calculationMode: "rollup" | "formula" | "final_result"`
  - or derive this from `nodeType`.
- Keep compatibility with existing `AggregationRule`.
- Use metadata only for UI grouping and docs.

### Stage 3: Introduce a Calculation Engine only when needed

If separation becomes necessary:

- Hierarchy Aggregator keeps:
  - mapped rows grouped by category
  - category totals
  - group rollups
  - included/excluded row trace
- Calculation Engine owns:
  - official line formulas
  - final formulas
  - constants and rate/input references
  - min/max/cap operations
  - formula expression parser
  - formula traces
- Aggregation Rulebook splits into either:
  - one rulebook with typed node sections, or
  - Aggregation Rulebook plus Calculation Rulebook.
- Existing workflows migrate by:
  - keeping rollup nodes in Aggregation Rulebook
  - moving formula/final_result nodes into Calculation Rulebook
  - adding an edge from Hierarchy Aggregator node totals into Calculation Engine
  - preserving output role aliases during migration.

### Stage 4: Update UI and validation

- Hierarchy Aggregator UI shows category/group tree only.
- Calculation Engine UI shows formula worksheet-style traces in inspector only.
- Formula Consistency Check consumes Calculation Engine outputs.
- Protected Results bind to Calculation Engine final totals.
- Output packages include both aggregation trace and calculation trace.

## I. If Combined Is Kept For Now: Clarity Improvements

Short-term improvements that preserve behavior:

- In Aggregation Rulebook, visibly group nodes as:
  - Final results
  - Rollups
  - Formulas
  - Constants
- Add a small "node kind" explanation in the editor:
  - Rollup nodes add mapped categories.
  - Formula nodes combine categories, other nodes, inputs, and numbers.
  - Final result nodes expose protected/output-ready results.
- Update `Hierarchy Aggregator` Code tab to show every supported operation.
- Update Runs tab to show formula trace rows with columns:
  - node
  - kind
  - expression
  - result
  - warnings
- Keep the cascade display for rule comprehension.
- Keep the calculator-style formula builder in the middle pane.
- Avoid making the Structure Sheet a formula editor.

## J. User-Facing Clarity Check

Question: Can a fiscalist see what categories are being grouped?

Answer: Mostly yes. `AggregationRulesOverview` shows a cascade of aggregation nodes with category leaves, and it can show keyword information when keyword rules are connected. The editor also supports category rollup chips. More grouping labels would help.

Question: Can a fiscalist see what formula is being applied?

Answer: Partly. The cascade shows a formula preview, the editor has a calculator-style `formulaExpression` field, and the run emits formula trace. The Code tab and Runs tab need clearer operation coverage and trace display.

Question: Can a fiscalist edit aggregation rules?

Answer: Yes in draft mode. `AggregationRuleSourceEditor` supports creating, selecting, editing, duplicating, deleting, JSON import/export, and formula token building. Used/published rulebooks are locked or versioned.

Question: Can a fiscalist edit arithmetic/formula operations?

Answer: Yes for common operations and formula expressions. The editor supports operation selection and formula expressions with categories, nodes, operators, and numbers. Some backend operations are available through imported/JSON data but are not equally obvious in the main operation selector.

Question: Can a fiscalist distinguish category rollups from final calculations?

Answer: Not enough yet. The UI shows node types and badges, but the phrase "Aggregation Rulebook" still includes both rollup and calculation logic. This is the main clarity gap.

Question: Does the Code tab show the actual behavior?

Answer: Mostly, but incompletely. `hierarchy-aggregator-code-preview.ts` correctly describes group-by-category, rule evaluation, final totals, and formula trace, but it omits special operations now supported by the backend.

Question: Does the Runs tab show formula trace clearly?

Answer: Partly. `HierarchyAggregatorPanel` and block inspector summaries show formula trace, node totals, and final totals, but trace display is still compact and partly JSON/string-heavy.

Question: Are input/output roles clear?

Answer: The backend definition is clear: `mapped_rows`, `aggregation_rules`, optional `fapi_inputs` in; totals, tree, included/excluded rows, trace, and summary out. The UI needs to mirror this clarity consistently.

Question: Does output show category totals, node totals, final totals, and traces?

Answer: Yes. The backend emits these roles and the output package functions collect them when upstream results are present.

## K. Current FAPI-Style Formula Coverage

The working source/rulebook fixture currently represents formulas such as:

- `A = max(income_bucket - expense_bucket, 0)`
- `A1 = debtForgiveness * 2`
- `B = capGains * inclusionRate`
- `Gross = A + A1 + A2 + B + C`
- `Deductions = D + E + F + F1 + G + H`
- `FAPI Brut = max(Gross - Deductions, 0)`
- `FAT Deduction = min(max(FAT Paid, 0) * RTF, FAPI Brut)`
- `Net FAPI = max(FAPI Brut - FAT Deduction, 0)`
- `Net FAPI CAD = node:NET_FAPI * input:fxRate`

This aligns with the real FAPI pattern of line/result formulas and formula traces, but it currently lives inside the combined Hierarchy Aggregator rather than a dedicated Calculation Engine.

## L. Files Inspected

Runtime and tool registry:

- `lib/local-tool-registry.ts`
- `lib/local-tool-runner.ts`
- `backend/runtime/*`

Backend-style blocks:

- `backend/blocks/logic/hierarchy-aggregator/definition.ts`
- `backend/blocks/logic/hierarchy-aggregator/run.ts`
- `backend/blocks/logic/hierarchy-aggregator/schema.ts`
- `backend/blocks/source/aggregation-rules/definition.ts`
- `backend/blocks/source/aggregation-rules/schema.ts`
- `backend/blocks/source/aggregation-rules/run.ts`
- `backend/blocks/source/aggregation-rules/fixtures.ts`

Workflow definitions and demos:

- `lib/local-fiscal-workflow.ts`
- `lib/workflow/sample-workflows/working-source-rules-demo.ts`
- `lib/workflow/sample-workflows/expanded-mapping-pipeline-demo.ts`

Inspector, rulebook, and data views:

- `components/workflow/inspector/block-inspector.tsx`
- `components/workflow/inspector/code-preview/generate-code-preview.ts`
- `components/workflow/inspector/code-preview/hierarchy-aggregator-code-preview.ts`
- `components/workflow/inspector/code-preview/aggregation-code-preview.ts`
- `components/workflow/inspector/code-preview/formula-code-preview.ts`
- `components/workflow/inspector/code-preview/source-code-preview.ts`
- `components/workflow/source-viewers/rule-source-editor.tsx`
- `components/workflow/source-viewers/aggregation-rules-overview.tsx`
- `components/workflow/source-viewers/excel-utils.ts`
- `components/workflow/logic-viewers/hierarchy-aggregator-panel.tsx`
- `components/workflow/workspace/block-data-flow-pane.tsx`
- `components/workflow/data-viewer/data-preview-utils.ts`

## M. Verification Notes

This audit is documentation-only. Verification should confirm:

- `pnpm fix` passes.
- `pnpm type-check` passes.
- `pnpm build` passes.
- Existing workflow demos still instantiate.
- Existing local runner behavior remains unchanged.

No runtime behavior was intentionally changed by this audit.

## N. Clarity Pass Implemented

The v1 combined runtime remains `logic.hierarchy_aggregator`; no separate Calculation Engine was added.

Implemented display label:

- User-facing tool label: Rollup & Calculation Engine.
- Compatibility subtype/tool id remain `Hierarchy Aggregator` and `logic.hierarchy_aggregator`.

Internal display modes now used in the rulebook and inspector:

- Rollup nodes: category totals and group subtotals.
- Formula nodes: calculator operations and formula expressions.
- Constants: reusable numeric values.
- Final result nodes: named results for Protected and Output blocks.
- Official line outputs: fiscal or worksheet line values when the workflow defines them.

UI clarity improvements:

- Aggregation Rules Source now shows mode badges, mode counts, supported operations, output role, formula expression, and result name.
- The editor exposes all supported backend operations: `sum`, `sum_abs`, `add`, `subtract`, `multiply`, `divide`, `pass_through`, `max_subtract_zero`, and `min_multiply_cap`.
- The Rollup & Calculation Engine center panel explains inputs, internal modes, supported operations, and emitted output roles.
- The Code tab now separates category grouping, rollup evaluation, formula evaluation, final result output, and formula trace.
- The Runs view now separates category totals, rollup/group totals, formula/final totals, formula trace, and warnings.
- Output table views now render total maps and formula traces as tables instead of mostly raw JSON.
- Evidence Preview and Canonical JSON now label rollup/calculation data as category totals, rollup totals, formula totals, official line values, formula trace, and protected results.

Remaining reasons not to split yet:

- The current engine already emits coherent category, node, official-line, final-total, and trace outputs.
- The current user issue is clarity and inspectability, not a missing runtime capability.
- Splitting now would require migration of rule source shapes, edge bindings, code previews, protected result bindings, output packaging, and demos before the v1 workflow is stable.
