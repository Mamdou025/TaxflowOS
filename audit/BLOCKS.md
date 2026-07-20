# Blocks

*Last updated: 2026-05-18*

---

## Overview

The block system is the core abstraction of the app. Each block belongs to a **family** (semantic role) and a **subtype** (specific behavior). Blocks have configs, optional code/formula fields, evidence metadata, and governance metadata.

**Families (7):** Trigger · Source · Logic · Review/Validation · Field · Output · AI/Agent

**Registered tool modules (11):** mapped to block subtypes via `block.config.toolId`

---

## Block Families

Each family has strict responsibility rules enforced in `src/domain/workflow/workflow-rules.ts`.

| Family | Responsibility | Must NOT |
|---|---|---|
| **Trigger** `[LIVE]` | Initiates the workflow — schedule, webhook, or manual start | Process, transform, or store data |
| **Source** | Immutable truth or reference objects | Classify, calculate, correct, or finalize values |
| **Logic** | Transform, calculate, classify, aggregate, branch | Overwrite Source truth or lock final governance |
| **Review/Validation** | Judge readiness, trust, approval, completeness | Mutate evidence or perform primary calculations |
| **Field** | Display computed values and breakdowns in UI | Compute or transform data — display only |
| **Output** | Generate deliverables, handoffs, exports | Become the source of workflow truth |
| **AI/Agent** | Propose changes, mappings, formulas, or reviews | Silently mutate workflows |

---

## Block Status Enums

**BlockStatus** (lifecycle):
`draft` · `configured` · `needs-review` · `approved` · `locked` · `running` · `success` · `error`

**BlockRunStatus** (execution):
`pending` · `running` · `success` · `warning` · `error` · `skipped`

---

## Trigger Blocks `[LIVE]`

Trigger blocks sit at the start of the pipeline — before Source. They fire the workflow and optionally pass initial payload data downstream.

**Allowed outbound edges:** `initiates` · `provides_data_to` → Source or Logic

### Manual / On Demand
- **Subtype:** `Manual / On Demand`
- **Purpose:** User-initiated run — no schedule or external event required
- **Icon:** Play

### Schedule / Cron
- **Subtype:** `Schedule / Cron`
- **Purpose:** Time-based trigger (cron expression or interval)
- **Icon:** Clock

### Webhook / API Event
- **Subtype:** `Webhook / API Event`
- **Purpose:** Fires on an inbound HTTP event — passes request payload into the workflow
- **Icon:** Webhook

---

## Source Blocks

Source blocks carry `SourceMetadata` — they are immutable evidence anchors.

### Manual Entry
- **Catalog ID:** `source:manual-entry`
- **Tool ID:** `source.manual_value`
- **Purpose:** A single evidence value entered by a builder or reviewer
- **Config:**
  - `owner`: `"Builder"`
  - `inputs`: `"manual value"`
  - `outputs`: `"manualEntry"`
  - `sourceLocator`: `"manual-entry"`
- **Output roles:** `manualEntry`
- **Evidence:** `treatedAsEvidence = true`, `immutable = true`

---

### Excel / Workbook
- **Catalog ID:** `source:excel-workbook`
- **Tool ID:** `source.manual_table`
- **Purpose:** Upload and reference an Excel workbook as row-based evidence
- **Config:**
  - `outputs`: `"workbookRows"`
  - `sourceLocator`: `"excel-workbook"`
- **Output roles:** `workbook_file` · `selected_sheet` · `selected_range` · `rows` · `selected_rows` · `raw_rows` · `source_metadata` · `source_locator`
- **Evidence:** supports `hasExcelSourceEvidence()` — uploads rows, workbook, file metadata
- **UI:** `excel-upload-panel.tsx` — file upload, sheet selection, range selection, data preview

---

### PDF / Document
- **Catalog ID:** `source:pdf-document`
- **Tool ID:** `source.manual_value`
- **Purpose:** Upload a PDF or document as evidence
- **Config:**
  - `outputs`: `"documentEvidence"`
  - `sourceLocator`: `"pdf-document"`
- **Output roles:** `documentEvidence`

---

### API / HTTP Request
- **Catalog ID:** `source:api-http-request`
- **Tool ID:** `source.manual_value`
- **Icon:** `Cloud` (distinct from Currency Rate's `Braces`) [LIVE]
- **Purpose:** Reference an external API response as evidence
- **Config:**
  - `outputs`: `"apiReference"`
  - `sourceLocator`: `"api-http-request"`
- **Output roles:** `apiReference`
- **FAPI usage:** `fapi-api-boc-fx` ("Bank of Canada Valet API") is the live source of the FX rate. It feeds `fapi-source-fx-rate` (Currency Rate) so the audit shows the real origin of the rate. Real fetch runs through `GET /api/fx-rate` → `fetchAnnualAverageExchangeRate` (BoC Valet). [LIVE]

---

### Currency Rate
- **Catalog ID:** `source:currency-rate`
- **Tool ID:** `source.currency_rate`
- **Purpose:** Fetch or override an FX exchange rate (Bank of Canada default)
- **Config:**
  - `documentCurrency`: `"USD"`
  - `reportingCurrency`: `"CAD"`
  - `fapiYear`: `2025`
  - `rateProvider`: `"bank_of_canada"`
  - `rateType`: `"annual_average"`
  - `overrideRate`: `1.35`
  - `liveRate`: fetched BoC Valet rate (optional; **preferred over `overrideRate` when present**)
- **Rate precedence (run.ts):** same-currency → `1`; else `liveRate` (→ `rate_source: "bank_of_canada_valet"`) → `overrideRate` (→ `rate_source: "override"`). `rate_metadata` now carries `live` + `rate_source`. [LIVE]
- **Output roles:** `exchange_rate` · `rate_metadata`
- **UI:** `currency-rate-source-panel.tsx`

---

### Database Query
- **Catalog ID:** `source:database-query`
- **Tool ID:** `source.manual_table`
- **Purpose:** Reference rows from a database query as evidence
- **Config:**
  - `outputs`: `"queryRows"`
  - `sourceLocator`: `"database-query"`
- **Output roles:** same as Manual Table

---

### Web / URL
- **Catalog ID:** `source:web-url`
- **Tool ID:** `source.manual_value`
- **Purpose:** Reference a web page or URL as evidence
- **Config:**
  - `outputs`: `"webReference"`
  - `sourceLocator`: `"web-url"`

---

### AI Search Result
- **Catalog ID:** `source:ai-search-result`
- **Tool ID:** `source.manual_value`
- **Purpose:** Store an AI search result as traceable evidence
- **Config:**
  - `outputs`: `"aiSearchEvidence"`
  - `sourceLocator`: `"ai-search-result"`

---

### Keyword Rules
- **Catalog ID:** `source:keyword-rules`
- **Tool ID:** `source.keyword_rules`
- **Purpose:** Store a set of keyword classification rules used by the Keyword Mapper logic block
- **Config:** array of rule objects, each with:
  - `ruleId`, `categoryId`, `categoryLabel`
  - `keywords[]`, `confidence`, `suggestedLine`
- **Output roles:** `keyword_rules` · `rule_metadata` · `rule_version`
- **Sample rules:** 5 categories — interest, rental, bank fees, professional fees, other income
- **UI:** `keyword-rulebook-editor.tsx` — inline add/remove/edit rules

---

### Aggregation Rules
- **Catalog ID:** `source:aggregation-rules`
- **Tool ID:** `source.aggregation_rules`
- **Purpose:** Define rollup operations (sum/subtract) across named value groups
- **Config:** tree of rule groups, each with:
  - `ruleId`, `label`, `operation` (`sum` | `subtract`)
  - `children[]` or `inputs[]`
- **Sample groups:** Income Base, Expense Base, Income After Expenses
- **UI:** `aggregation-rulebook-editor.tsx`

---

### Rollup Rules
- **Catalog ID:** `source:rollup-rules` [WIP]
- **Tool ID:** `source.rollup_rules`
- **Purpose:** Category-level rollup definitions
- **UI:** `rollup-rulebook-editor.tsx`

---

### Calculation Rules
- **Catalog ID:** `source:calculation-rules` [WIP]
- **Tool ID:** `source.calculation_rules`
- **Purpose:** External formula/calculation rule definitions
- **UI:** `calculation-engine-editor.tsx`

---

### FAPI Inputs
- **Catalog ID:** `source:fapi-inputs`
- **Tool ID:** `source.fapi_inputs`
- **Purpose:** Foreign Accrual Property Income workbook assumptions
- **Emits (fapiInputs):** `documentCurrency, reportingCurrency, fapiYear, inclusionRate, fatPaid, rtf` **plus the line-driving assumptions** `pCoefficient (default 1), canadianRules95_4 (95(2)), priorYearG (→A2), prescribedAmount (→F), prescribedAmountF1 (→F1), dividendDeductions (→G), partnershipDividends (→H)`. [LIVE]
- **Classified lines default to `undefined` [2026-07-14]:** `debtForgiveness (→A1×2), cfaIncome (→C), businessLosses (→D), faclCarryforward (→E)` are NO LONGER defaulted to 0 — they're normally derived by classifying trial-balance rows (the rollup emits them as named values). A `0` here would clobber the classified value (fapi_inputs wins over rollup in the calc engine's named-value merge), so they stay `undefined` unless explicitly entered via the run's editable inputs. Paired with a calc-engine fix so `undefined` named values are skipped (never clobber an earlier role). [LIVE]
- **RTF snapping:** `rtf` is normalized to one of `{1.9, 4}` (default 1.9) in the block schema. [LIVE]
- **Consumed by:** the lines engine as `fapi_inputs`/`protected_inputs` named values; exposed in the run as **editable inputs** (`lib/workflow-runs/fapi.ts`).

---

## Logic Blocks

Logic blocks transform or derive values. They do not overwrite source evidence.

### Keyword Mapper
- **Catalog ID:** `logic:keyword-mapper`
- **Tool ID:** `logic.keyword_mapper`
- **Purpose:** Classify input rows by matching keywords against a keyword rules source block
- **Input roles:**
  - `data_rows` — from Source or Logic blocks (the rows to classify)
  - `keyword_rules` — from a Keyword Rules source block
- **Output roles:**
  - `mapped_rows` — rows with category assignments
  - `unmatched_rows` — rows with no rule match
  - `low_confidence_rows` — rows below threshold
  - `conflicts` — rows with multiple conflicting matches
  - `mapping_summary` — stats object
- **Config:**
  - `conflictStrategy`: `"highest_confidence"` — pick highest confidence on tie
  - `lowConfidenceThreshold`: `0.75`
  - `matchFields`: `["account", "label", "description"]`
  - `matchMode`: `"contains"` (substring) · `"exact"` · `"starts_with"` · **`"all_words"` [2026-07-14]** — every token of a (multi-word) keyword must appear as a word in the field, in ANY order, with singular/plural tolerance (gain↔gains). This makes phrase keywords like `"interest income"` match real GL labels like `"Investment Income - Interest"` that plain substring matching misses. The FAPI mapping rules (`lib/workflow-runs/fapi-mapping.ts`) use `all_words`.
  - `unmatchedStrategy`: `"send_to_review"`
- **Algorithm:**
  1. Normalize text (diacritics, case, separator chars)
  2. For each row, test each keyword rule
  3. Score confidence per match
  4. Resolve conflicts via `conflictStrategy`
  5. Bucket rows into mapped/unmatched/low-confidence/conflict
- **UI:** `keyword-mapper-workspace.tsx`

---

### Calculation Engine
- **Catalog ID:** `logic:calculation-engine`
- **Tool ID:** `logic.calculation_engine`
- **Purpose:** Evaluate formulas over named values from upstream blocks
- **Input roles:**
  - `named_values` — key→value map from upstream
  - `calculation_rules` (optional) — external rule set
  - `protected_inputs` (optional) — governance-locked inputs
- **Output roles:**
  - `calculated_results` — output values
  - `formula_trace` — per-formula resolution trace
  - `calculation_summary` — statistics
  - `named_values` — passthrough + derived values
- **Config:**
  - `mode`: `"auto"` | `"inline"` | `"external_rules"`
- **Two rule forms:** `operands` + `operation`, OR a **`formulaExpression`** string (`+ − * /`, parentheses, functions below) — used for FAPI line A: `pCoefficient * (income_bucket - expense_bucket) + canadianRules95_4`.
- **Supported functions:**
  - `abs`, `max`, `min`, `round`
  - `max_subtract_zero`, `min_multiply_cap`
- **Operand namespace:** merges the `named_values`, `protected_inputs`, **and `fapi_inputs`** input roles, so FAPI Inputs keys (P-coefficient, 95(2), A1/A2/C–H assumptions) resolve directly as operands.
- **Algorithm:**
  1. Parse inline formulas / `formulaExpression` or load external rules
  2. Resolve operands from the merged named-value namespace (dependency-ordered)
  3. Apply function / evaluate expression
  4. Return result + trace
- **UI:** `calculation-engine-workspace.tsx`, `calculation-engine-editor.tsx`

---

### Hierarchy Aggregator
- **Catalog ID:** `logic:hierarchy-aggregator`
- **Tool ID:** `logic.hierarchy_aggregator`
- **Purpose:** Aggregate values across a hierarchical category tree (e.g. income → sub-category → line items)
- **Input roles:** named values + hierarchy definition
- **Output roles:** aggregated values per node in the hierarchy
- **UI:** `hierarchy-aggregator-run-sections.tsx`

---

### Category Rollup Aggregator
- **Catalog ID:** `logic:category-rollup-aggregator` [WIP]
- **Tool ID:** `logic.category_rollup_aggregator`
- **Purpose:** Rollup values within flat category groups
- **UI:** `aggregator-workspace.tsx`

---

## Review / Validation Blocks

No tool modules registered yet. Family is defined; subtypes pending implementation.

**Planned subtypes:**
- Readiness Check
- Trust Review
- Approval Gate
- Completeness Check

---

## Field Blocks

Display-only blocks. Render computed values in the user-facing UI.

### Field Block [WIP]
- **Tool ID:** none (display only)
- **Purpose:** Show a computed value or category breakdown in the UI
- **Must NOT:** compute or transform data
- **UI:** `field-block-workspace.tsx`

---

## Output Blocks

Output blocks generate final deliverables. They reference governed/protected values.

Subtypes defined in domain (no tool modules yet):
- **CSV Export** — tabular export
- **Excel Export** — workbook export
- **PDF Report** — formatted report
- **Evidence Pack** — audit bundle
- **Canonical JSON** — structured output
- **Taxprep Handoff** — tax software data
- **ONESOURCE Handoff** — ONESOURCE tax platform data

**Governance rule:** Final governed handoffs must map from **Protected** values. Mapping directly from Logic blocks emits a `LOGIC_OUTPUT_GOVERNANCE_WARNING`.

---

## AI / Agent Blocks

AI blocks propose changes. They never silently mutate.

Subtypes defined in domain:
- **AI Search Result** (also a Source subtype)
- AI Proposal blocks — generated by the prompt panel

**Proposal lifecycle:** `proposed → approved → rejected`

---

## Block Config Shape (common fields)

Every block in `WorkflowDefinition` carries:

```typescript
{
  id: string
  family: BlockFamily
  subtype: BlockSubtype
  label: string
  description?: string
  status: BlockStatus
  position: { x: number, y: number }
  config: Record<string, unknown>   // block-specific config

  // optional code execution
  code?: {
    language: string
    body: string
    entrypoint?: string
  }

  // optional formula
  formula?: {
    expression: string
    outputKey: string
    inputs: string[]
  }

  // evidence metadata (Source blocks)
  source?: {
    sourceType: string
    locator: string
    immutable: boolean
    treatedAsEvidence: boolean
    locks: {
      labelLocked: boolean
      locatorLocked: boolean
      valuesLocked: boolean
    }
  }

  // governance metadata (Protected blocks)
  governance?: {
    protected: boolean
    protectedKind: ProtectedKind
    steward?: string
    lockedInRuntime: boolean
    requiresUnlockToEdit: boolean
    editIntent?: string
    approvalState: "draft" | "review-required" | "approved"
  }

  // runtime rendering
  runtime: {
    visible: boolean
    editableInRuntime: boolean
    generatedUiLocked: boolean
    masked: boolean
    showInRuns: boolean
    outputKey?: string
  }
}
```

---

## Block Catalog Reference

Full catalog in `lib/local-fiscal-workflow.ts` → `BLOCK_CATALOG: BlockCatalogItem[]`

Registry → `lib/local-tool-registry.ts` → `LOCAL_TOOL_REGISTRY`

Backend implementations → `backend/blocks/{family}/{subtype}/run.ts`

---

## Allowed Edge Relationships by Family Pair

Defined in `src/domain/workflow/workflow-rules.ts` → `RELATIONSHIP_TYPES_BY_FAMILY_PAIR`

| Source Family | Target Family | Allowed Relationship Types |
|---|---|---|
| Source | Logic | `provides_data_to`, `extracted_into`, `referenced_by` |
| Logic | Logic | `transforms_into`, `aggregates_into`, `branches_to`, `depends_on` |
| Logic | Output | `feeds_output_input`, `included_in_output_preview`, `maps_to_output_candidate` |
| Logic | Protected | `feeds_protected_input`, `feeds_protected_result` |
| Logic | Review | `checked_by`, `requires_review_by`, `triggers_validation` |
| Protected | Output | `maps_to_output`, `included_in_handoff` (governed) |
| Any | AI/Agent | `feeds_ai_context`, `provides_context_to_ai`, `requests_ai_review`, `supplies_candidate_data` |
| AI/Agent | Any | `proposes`, `suggests_mapping`, `suggests_formula`, `suggests_workflow_change` |

**Governance note:** Only `Protected → Output` edges are considered final governed handoffs. `Logic → Output` edges emit a warning and are treated as draft/candidate mappings.
