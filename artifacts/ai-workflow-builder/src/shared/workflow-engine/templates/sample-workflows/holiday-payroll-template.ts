// ─────────────────────────────────────────────────────────────────────────────
// Statutory Holiday Payroll Accrual — a NON-TAX workflow anyone can follow.
//
// The question it answers: "what will our statutory holidays cost us in payroll
// next year, and how much of that is province-specific?"
//
// Everyone understands the inputs (days off, headcount, hourly rate) and the
// arithmetic (days × people × hours × rate), so the workflow is legible to a
// non-accountant — while being exactly the shape a real accrual takes, so an
// accountant sees a journal entry.
//
// It exercises the same muscle set as any engagement:
//   • live API data      — Nager.Date publishes every public holiday, keyless
//   • real classification — each holiday is national or specific to one province,
//                           read from the `counties` field, not assumed
//   • hierarchy           — Country → Province → Holiday
//   • manual inputs       — headcount, rate, premium, all defaulted
//   • a human election    — hours accrued per holiday, between 0 and a full day
//   • formulas + gates    — liability, per-employee cost, share of payroll
//   • outputs             — accrual schedule, evidence pack
//
// The request is BUILT by the `nager.public_holidays` connector, never written
// out here, so the canvas block, the run's fetch and Sina's `useApiSource` cannot
// describe different requests.
// ─────────────────────────────────────────────────────────────────────────────

import {
  apiRequestToBlockConfig,
  buildApiRequest,
} from "@/shared/workflow-engine/execution/blocks/source/http-json/connectors";

export const HOLIDAY_PARAMS = {
  country: "CA",
  year: 2025,
} as const;

const HOLIDAY_REQUEST = buildApiRequest("nager.public_holidays", {
  ...HOLIDAY_PARAMS,
});
if (!HOLIDAY_REQUEST.ok) {
  throw new Error(
    `Holiday request could not be built: ${HOLIDAY_REQUEST.errors.join(" ")}`
  );
}
export const HOLIDAY_SPEC = HOLIDAY_REQUEST.spec;

// ── Classification rules — holiday → who it applies to ───────────────────────
//
// The classifier reads `label` (the holiday's name) and `description` (its
// `counties`, e.g. "CA-MB"). Regional holidays are matched on the province code —
// stable, unambiguous, and language-independent. National holidays carry no
// county at all, so they are matched on their names.
//
// Confidence is the tie-breaker under `highest_confidence`: a province code is an
// exact fact about the record, so it outranks a name match. That matters for
// Remembrance Day and Victoria Day, which are national in some provinces and not
// others — the county tag must win.

const province = (
  code: string,
  categoryId: string,
  categoryLabel: string
) => ({
  categoryId,
  categoryLabel,
  confidence: 0.95,
  keywords: [code],
  ruleId: `holiday-rule-${categoryId}`,
  suggestedLine: "PROVINCIAL",
});

export const HOLIDAY_KEYWORD_RULES = [
  province("CA-AB", "ab_holidays", "Alberta"),
  province("CA-BC", "bc_holidays", "British Columbia"),
  province("CA-MB", "mb_holidays", "Manitoba"),
  province("CA-NB", "nb_holidays", "New Brunswick"),
  province("CA-NL", "nl_holidays", "Newfoundland and Labrador"),
  province("CA-NS", "ns_holidays", "Nova Scotia"),
  province("CA-NT", "nt_holidays", "Northwest Territories"),
  province("CA-NU", "nu_holidays", "Nunavut"),
  province("CA-ON", "on_holidays", "Ontario"),
  province("CA-PE", "pe_holidays", "Prince Edward Island"),
  province("CA-QC", "qc_holidays", "Quebec"),
  province("CA-SK", "sk_holidays", "Saskatchewan"),
  province("CA-YT", "yt_holidays", "Yukon"),
  {
    categoryId: "national_holidays",
    categoryLabel: "National (all employees)",
    confidence: 0.8,
    // Exactly the eight days Nager.Date publishes as `global: true` for Canada.
    // Boxing Day is deliberately NOT here: the API tags it to specific provinces,
    // so it belongs to the provincial rules — listing it as national would have
    // been a plausible-looking guess contradicted by the source.
    keywords: [
      "new year",
      "good friday",
      "victoria day",
      "canada day",
      "labour day",
      "truth and reconciliation",
      "thanksgiving",
      "christmas",
    ],
    ruleId: "holiday-rule-national",
    suggestedLine: "NATIONAL",
  },
];

// ── Aggregation: Country → Province → Holiday ────────────────────────────────
// Shapes follow AggregationRule / the rollup-rules block exactly — `nodeId` and
// `rollupId` ARE the keys the calculation reads, and categories are listed under
// `includeCategoryIds`.

export const HOLIDAY_AGGREGATION_RULES = [
  {
    children: [],
    description: "Holidays every employee is paid for.",
    includeCategoryIds: ["national_holidays"],
    label: "National",
    nodeId: "national_group",
    nodeType: "group",
    operation: "sum",
    order: 10,
  },
  {
    children: [],
    description: "Holidays observed in one province only.",
    includeCategoryIds: ["ab_holidays", "bc_holidays", "mb_holidays", "nb_holidays", "nl_holidays", "ns_holidays", "nt_holidays", "nu_holidays", "on_holidays", "pe_holidays", "qc_holidays", "sk_holidays", "yt_holidays"],
    label: "Provincial",
    nodeId: "provincial_group",
    nodeType: "group",
    operation: "sum",
    order: 20,
  },
  {
    children: ["national_group", "provincial_group"],
    description: "The whole published calendar for the country.",
    label: "Country calendar",
    nodeId: "country_total",
    nodeType: "group",
    operation: "sum",
    order: 30,
  },
];

// ── Rollup: category totals the calculation reads ────────────────────────────

export const HOLIDAY_ROLLUP_RULES = [
  {
    description: "Holiday days that apply to every employee.",
    includeCategoryIds: ["national_holidays"],
    label: "National holiday days",
    operation: "sum",
    rollupId: "national_days",
  },
  {
    description: "Holiday days that apply in one province only.",
    includeCategoryIds: ["ab_holidays", "bc_holidays", "mb_holidays", "nb_holidays", "nl_holidays", "ns_holidays", "nt_holidays", "nu_holidays", "on_holidays", "pe_holidays", "qc_holidays", "sk_holidays", "yt_holidays"],
    label: "Provincial holiday days",
    operation: "sum",
    rollupId: "provincial_days",
  },
  {
    description: "Every classified holiday day in scope.",
    includeCategoryIds: ["national_holidays", "ab_holidays", "bc_holidays", "mb_holidays", "nb_holidays", "nl_holidays", "ns_holidays", "nt_holidays", "nu_holidays", "on_holidays", "pe_holidays", "qc_holidays", "sk_holidays", "yt_holidays"],
    label: "Total holiday days",
    operation: "sum",
    rollupId: "holiday_days_total",
  },
];

// ── Calculation rules — stage 1: the accrual ─────────────────────────────────

export const HOLIDAY_ACCRUAL_CALC_RULES = [
  { calculationId: "HOLIDAY_DAYS", description: "Holiday days = every holiday classified in scope", label: "Holiday days in scope", operands: ["holiday_days_total"], operation: "pass_through", resultKey: "HOLIDAY_DAYS" },
  { calculationId: "NATIONAL_DAYS", description: "National days = holidays that apply to every employee", label: "National holiday days", operands: ["national_days"], operation: "pass_through", resultKey: "NATIONAL_DAYS" },
  { calculationId: "PROVINCIAL_DAYS", description: "Provincial days = holidays that apply in one province only", label: "Provincial holiday days", operands: ["provincial_days"], operation: "pass_through", resultKey: "PROVINCIAL_DAYS" },
  { calculationId: "HOURS_FLOOR", description: "Floor = accrue nothing per holiday", label: "Hours floor", operands: ["HOURS_FLOOR"], operation: "pass_through", resultKey: "HOURS_FLOOR" },
  { calculationId: "HOURS_CEILING", description: "Ceiling = a full standard work day", label: "Hours ceiling", operands: ["HOURS_CEILING"], operation: "pass_through", resultKey: "HOURS_CEILING" },
  { calculationId: "HOURS_PER_HOLIDAY", description: "Hours per holiday = elected between the floor and a full work day", label: "Hours accrued per holiday", operands: ["HOURS_PER_HOLIDAY"], operation: "pass_through", resultKey: "HOURS_PER_HOLIDAY" },
];

// ── Calculation rules — stage 2: cost summary ────────────────────────────────

export const HOLIDAY_COST_CALC_RULES = [
  { calculationId: "TOTAL_LIABILITY", description: "Liability = days × employees × hours per holiday × hourly rate × premium", label: "Statutory holiday liability", operands: ["TOTAL_LIABILITY"], operation: "pass_through", resultKey: "TOTAL_LIABILITY" },
  { calculationId: "NATIONAL_LIABILITY", description: "National portion = national days × all employees × hours × rate × premium", label: "National portion", operands: ["NATIONAL_LIABILITY"], operation: "pass_through", resultKey: "NATIONAL_LIABILITY" },
  { calculationId: "PROVINCIAL_LIABILITY", description: "Provincial portion = provincial days × employees in that province × hours × rate × premium", label: "Provincial portion", operands: ["PROVINCIAL_LIABILITY"], operation: "pass_through", resultKey: "PROVINCIAL_LIABILITY" },
  { calculationId: "COST_PER_EMPLOYEE", description: "Per employee = total liability ÷ headcount", label: "Cost per employee", operands: ["TOTAL_LIABILITY", "HEADCOUNT"], operation: "divide", resultKey: "COST_PER_EMPLOYEE" },
  { calculationId: "PAYROLL_SHARE_PCT", description: "Share of payroll = liability ÷ annual base payroll", label: "Share of annual payroll %", operands: ["TOTAL_LIABILITY", "ANNUAL_PAYROLL"], operation: "divide", resultKey: "PAYROLL_SHARE_PCT" },
  { calculationId: "UNMATCHED_TOTAL", description: "Excluded = holidays the classifier could not place, left out of every figure above", label: "Excluded from totals (unmatched)", operands: ["UNMATCHED_TOTAL"], operation: "pass_through", resultKey: "UNMATCHED_TOTAL" },
  { calculationId: "SOURCE_TOTAL", description: "Source total = holidays in scope + excluded — reconciles to the API response", label: "Holidays fetched from source", operands: ["SOURCE_TOTAL"], operation: "pass_through", resultKey: "SOURCE_TOTAL" },
];

// ── Block specs ──────────────────────────────────────────────────────────────

export type HolidayBlockSpec = {
  catalogId: string;
  config: Record<string, unknown>;
  description: string;
  id: string;
  label: string;
  position: { x: number; y: number };
};

export const HOLIDAY_TEMPLATE_BLOCK_SPECS: HolidayBlockSpec[] = [
  {
    catalogId: "trigger:manual",
    config: { outputs: "trigger_event" },
    description: "A payroll reviewer starts the accrual on demand.",
    id: "hol-trigger",
    label: "Start Accrual",
    position: { x: -700, y: 160 },
  },

  // ── Sources ────────────────────────────────────────────────────────────────
  {
    catalogId: "source:api-http-request",
    config: {
      ...apiRequestToBlockConfig(
        "nager.public_holidays",
        { ...HOLIDAY_PARAMS },
        HOLIDAY_SPEC
      ),
      outputs: "selected_rows",
      sourceKind: "http_json",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.http_json",
    },
    description:
      "Every Canadian public holiday for 2025, live from Nager.Date (free, no API key). Each holiday counts as one day; the response is pinned into the run so the figures are reproducible.",
    id: "hol-source-holidays",
    label: "Public Holidays (Nager.Date API)",
    position: { x: -220, y: 20 },
  },
  {
    catalogId: "source:manual-entry",
    config: {
      annual_payroll: 2_371_200,
      headcount: 40,
      hourly_rate: 28.5,
      hours_per_holiday: 8,
      premium_multiplier: 1.5,
      provincial_headcount: 12,
      standard_work_day: 8,
      outputs: "payroll_params, input_metadata",
      sourceKind: "fapi_inputs",
      sourceLocator: "manual-source://holiday-payroll-params",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.fapi_inputs",
    },
    description:
      "The assumptions a payroll reviewer sets: headcount, hourly rate, the premium paid for a statutory day, and how many of the staff sit in the province being accrued. All defaulted, all editable in the run.",
    id: "hol-source-params",
    label: "Payroll Assumptions",
    position: { x: -220, y: 260 },
  },
  {
    catalogId: "source:keyword-rules",
    config: {
      keywordRules: HOLIDAY_KEYWORD_RULES,
      outputs: "keyword_rules",
      sourceKind: "keyword_rules",
      sourceLocator: "manual-source://holiday-scope-rulebook",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.keyword_rules",
    },
    description:
      "Which employees a holiday applies to: province codes for regional days, holiday names for the national ones.",
    id: "hol-source-keywords",
    label: "Holiday Scope Rulebook",
    position: { x: -220, y: 480 },
  },
  {
    catalogId: "source:aggregation-rules",
    config: {
      aggregationRules: HOLIDAY_AGGREGATION_RULES,
      outputs: "aggregation_rules",
      sourceKind: "aggregation_rules",
      sourceLocator: "manual-source://holiday-hierarchy",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.aggregation_rules",
    },
    description: "Country → Province → Holiday, held as reviewable rules.",
    id: "hol-source-hierarchy",
    label: "Calendar Hierarchy",
    position: { x: -220, y: 700 },
  },
  {
    catalogId: "source:rollup-rules",
    config: {
      outputs: "rollup_rules",
      rollupRules: HOLIDAY_ROLLUP_RULES,
      sourceKind: "rollup_rules",
      sourceLocator: "manual-source://holiday-rollup",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.rollup_rules",
    },
    description: "National / provincial / total day counts the calculation reads.",
    id: "hol-source-rollup",
    label: "Day-Count Rollup Rules",
    position: { x: 260, y: 480 },
  },
  {
    catalogId: "source:calculation-rules",
    config: {
      calculationRules: [
        ...HOLIDAY_ACCRUAL_CALC_RULES,
        ...HOLIDAY_COST_CALC_RULES,
      ],
      outputs: "calculation_rules",
      sourceKind: "calculation_rules",
      sourceLocator: "manual-source://holiday-formulas",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.calculation_rules",
    },
    description:
      "The accrual and cost formulas, held as reviewable rules rather than buried in code.",
    id: "hol-source-formulas",
    label: "Accrual Formula Rules",
    position: { x: 260, y: 700 },
  },

  // ── Logic ──────────────────────────────────────────────────────────────────
  {
    catalogId: "logic:classification-mapping",
    config: {
      conflictStrategy: "highest_confidence",
      inputs: "rows, keyword_rules",
      matchFields: ["label", "description"],
      outputs: "mapped_rows, unmatched_rows, mapping_conflicts",
      toolId: "logic.keyword_mapper",
    },
    description:
      "Reads each holiday's county tag and name to decide who it applies to. Matching on the county code beats a name match, so a day that is national in one province and regional in another lands correctly.",
    id: "hol-logic-classifier",
    label: "Holiday Scope Classifier",
    position: { x: 260, y: 20 },
  },
  {
    catalogId: "logic:category-rollup-aggregator",
    config: {
      inputs: "mapped_rows, rollup_rules",
      outputs: "category_totals, named_values",
      toolId: "logic.category_rollup_aggregator",
    },
    description: "Counts the days behind each scope category.",
    id: "hol-logic-rollup",
    label: "Day Counts",
    position: { x: 740, y: 20 },
  },
  {
    catalogId: "logic:hierarchy-aggregator",
    config: {
      inputs: "mapped_rows, aggregation_rules",
      outputs: "hierarchy_totals, category_totals",
      toolId: "logic.hierarchy_aggregator",
    },
    description: "Rolls the days up Country → Province → Holiday.",
    id: "hol-logic-hierarchy",
    label: "Calendar Rollup",
    position: { x: 740, y: 260 },
  },
  {
    catalogId: "logic:calculation-engine",
    config: {
      formulas: [...HOLIDAY_ACCRUAL_CALC_RULES, ...HOLIDAY_COST_CALC_RULES],
      inputs: "named_values, calculation_rules, payroll_params",
      outputs: "calculated_results, formula_trace, calculation_summary, named_values",
      toolId: "logic.calculation_engine",
    },
    description:
      "Turns day counts and assumptions into the accrual: days × employees × hours × rate × premium.",
    id: "hol-logic-calc",
    label: "Accrual Calculation",
    position: { x: 1220, y: 140 },
  },

  // ── Review gates ───────────────────────────────────────────────────────────
  {
    catalogId: "review:unmatched-rows-check",
    config: {
      inputs: "mapped_rows",
      outputs: "validation_result",
      toolId: "review.unmatched_rows_check",
    },
    description:
      "Flags holidays the rulebook could not place — they are excluded from every figure, so they must be seen.",
    id: "hol-review-unmatched",
    label: "Unplaced Holidays",
    position: { x: 1700, y: -80 },
  },
  {
    catalogId: "review:low-confidence-warning",
    config: {
      inputs: "mapped_rows",
      outputs: "validation_result",
      threshold: 0.7,
      toolId: "review.low_confidence_warning",
    },
    description: "Flags holidays matched only on a name, not a county code.",
    id: "hol-review-confidence",
    label: "Weak Match Review",
    position: { x: 1700, y: 140 },
  },
  {
    catalogId: "review:approval-gate",
    config: {
      inputs: "value_to_approve, validation_result",
      outputs: "approval_status",
      toolId: "review.approval_gate",
    },
    description: "The reviewer signs off the accrual before it can be exported.",
    id: "hol-review-approve",
    label: "Payroll Sign-off",
    position: { x: 1700, y: 360 },
  },
  {
    catalogId: "review:output-readiness-check",
    config: {
      inputs: "computed_values, approval_status",
      outputs: "validation_result",
      toolId: "review.output_readiness_check",
    },
    description: "Refuses to call the accrual final until every gate has passed.",
    id: "hol-review-ready",
    label: "Export Readiness",
    position: { x: 1700, y: 580 },
  },

  // ── Outputs ────────────────────────────────────────────────────────────────
  {
    catalogId: "output:csv-export",
    config: { inputs: "mapped_rows", outputs: "csv_file", toolId: "output.csv_export" },
    description: "The holiday-by-holiday accrual schedule.",
    id: "hol-output-csv",
    label: "Accrual Schedule (CSV)",
    position: { x: 2180, y: -80 },
  },
  {
    catalogId: "output:excel-export",
    config: { inputs: "mapped_rows", outputs: "excel_file", toolId: "output.excel_export" },
    description: "The same schedule as a workbook.",
    id: "hol-output-excel",
    label: "Accrual Workbook",
    position: { x: 2180, y: 140 },
  },
  {
    catalogId: "output:canonical-json",
    config: { inputs: "computed_values", outputs: "canonical_json", toolId: "output.canonical_json" },
    description: "Machine-readable accrual for a downstream payroll system.",
    id: "hol-output-json",
    label: "Canonical JSON",
    position: { x: 2180, y: 360 },
  },
  {
    catalogId: "output:evidence-pack",
    config: { inputs: "computed_values, source_trace", outputs: "evidence_pack", toolId: "output.evidence_pack_preview" },
    description:
      "Pins the exact holiday list the figures came from, every rule applied and who approved it.",
    id: "hol-output-pack",
    label: "Evidence Pack",
    position: { x: 2180, y: 580 },
  },
];

// ── Edge specs ───────────────────────────────────────────────────────────────

export type HolidayEdgeSpec = {
  bindingLabel: string;
  reason: string;
  relationshipType: string;
  sourceBlockId: string;
  sourceOutputRole: string;
  targetBlockId: string;
  targetInputRole: string;
};

const edge = (
  sourceBlockId: string,
  targetBlockId: string,
  sourceOutputRole: string,
  targetInputRole: string,
  bindingLabel: string,
  reason: string,
  relationshipType = "data_flow"
): HolidayEdgeSpec => ({
  bindingLabel,
  reason,
  relationshipType,
  sourceBlockId,
  sourceOutputRole,
  targetBlockId,
  targetInputRole,
});

export const HOLIDAY_TEMPLATE_EDGE_SPECS: HolidayEdgeSpec[] = [
  edge("hol-trigger", "hol-source-holidays", "trigger_payload", "trigger", "starts", "The reviewer starts the accrual, which triggers the holiday fetch."),
  edge("hol-source-holidays", "hol-logic-classifier", "selected_rows", "rows", "holidays", "Each fetched holiday is classified by who it applies to."),
  edge("hol-source-keywords", "hol-logic-classifier", "keyword_rules", "keyword_rules", "scope rules", "The rulebook decides national vs provincial."),
  edge("hol-logic-classifier", "hol-logic-rollup", "mapped_rows", "mapped_rows", "classified days", "Classified holidays are counted by scope."),
  edge("hol-source-rollup", "hol-logic-rollup", "rollup_rules", "rollup_rules", "rollup rules", "The rollup rules define the day counts."),
  edge("hol-logic-classifier", "hol-logic-hierarchy", "mapped_rows", "mapped_rows", "classified days", "The same days roll up the calendar hierarchy."),
  edge("hol-source-hierarchy", "hol-logic-hierarchy", "aggregation_rules", "aggregation_rules", "hierarchy", "Country → Province → Holiday."),
  edge("hol-logic-rollup", "hol-logic-calc", "named_values", "named_values", "day counts", "Day counts feed the accrual formulas."),
  edge("hol-source-formulas", "hol-logic-calc", "calculation_rules", "calculation_rules", "formulas", "The accrual formulas are applied as reviewable rules."),
  edge("hol-source-params", "hol-logic-calc", "payroll_params", "payroll_params", "assumptions", "Headcount, rate and premium scale the accrual."),
  edge("hol-logic-classifier", "hol-review-unmatched", "mapped_rows", "mapped_rows", "check", "Unplaced holidays are surfaced before sign-off."),
  edge("hol-logic-classifier", "hol-review-confidence", "mapped_rows", "mapped_rows", "check", "Name-only matches are surfaced for review."),
  edge("hol-logic-calc", "hol-review-approve", "computed_values", "value_to_approve", "approve", "The reviewer approves the computed accrual."),
  edge("hol-review-unmatched", "hol-review-approve", "validation_result", "validation_result", "gate", "Sign-off sees the unplaced-holiday finding."),
  edge("hol-review-confidence", "hol-review-approve", "validation_result", "validation_result", "gate", "Sign-off sees the weak-match finding."),
  edge("hol-logic-calc", "hol-review-ready", "computed_values", "computed_values", "readiness", "Export readiness checks the computed figures."),
  edge("hol-review-approve", "hol-review-ready", "approval_status", "approval_status", "readiness", "Nothing is final until it is approved."),
  edge("hol-logic-classifier", "hol-output-csv", "mapped_rows", "mapped_rows", "schedule", "The accrual schedule lists every classified holiday."),
  edge("hol-logic-classifier", "hol-output-excel", "mapped_rows", "mapped_rows", "workbook", "The same schedule as a workbook."),
  edge("hol-logic-calc", "hol-output-json", "computed_values", "computed_values", "canonical", "The computed accrual, machine-readable."),
  edge("hol-logic-calc", "hol-output-pack", "computed_values", "computed_values", "evidence", "The evidence pack states the figures it certifies."),
];
