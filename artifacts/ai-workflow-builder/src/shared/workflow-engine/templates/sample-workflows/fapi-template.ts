import { WORKING_SOURCE_DEMO_RULES } from "./working-source-rules-demo";

// ── Calculation rules ─────────────────────────────────────────────────────────

// Lines Engine: maps category totals → individual FAPI lines A through H
export const FAPI_LINES_CALC_RULES = [
  {
    calculationId: "A",
    description: "A = P × (income_bucket − expense_bucket) + 95(2)",
    formulaExpression:
      "pCoefficient * (income_bucket - expense_bucket) + canadianRules95_4",
    label: "A",
    operands: ["income_bucket", "expense_bucket"],
    operation: "max_subtract_zero",
    resultKey: "A",
  },
  {
    calculationId: "EXPENSES",
    description: "Expenses = P × expense_bucket",
    formulaExpression: "pCoefficient * expense_bucket",
    label: "Expenses",
    operands: ["expense_bucket"],
    operation: "pass_through",
    resultKey: "EXPENSES",
  },
  {
    calculationId: "COMPUTATION_95_4",
    description: "95(2) = Canadian 95(2) rules amount (flows into A)",
    label: "95(2)",
    operands: ["canadianRules95_4"],
    operation: "pass_through",
    resultKey: "COMPUTATION_95_4",
  },
  {
    calculationId: "A1",
    description: "A1 = debtForgiveness * 2",
    label: "A1",
    operands: ["debtForgiveness", 2],
    operation: "multiply",
    resultKey: "A1",
  },
  {
    calculationId: "A2",
    description: "A2 = priorYearG",
    label: "A2",
    operands: ["priorYearG"],
    operation: "pass_through",
    resultKey: "A2",
  },
  {
    calculationId: "B",
    description: "B = capGains * inclusionRate",
    label: "B",
    operands: ["capGains", "inclusionRate"],
    operation: "multiply",
    resultKey: "B",
  },
  ...["C", "D", "E", "F", "F1", "G", "H"].map((id, i) => {
    const sourceKeys: Record<string, string> = {
      C: "cfaIncome",
      D: "businessLosses",
      E: "faclCarryforward",
      F: "prescribedAmount",
      F1: "prescribedAmountF1",
      G: "dividendDeductions",
      H: "partnershipDividends",
    };
    return {
      calculationId: id,
      description: `${id} = ${sourceKeys[id]}`,
      label: id,
      operands: [sourceKeys[id]],
      operation: "pass_through",
      resultKey: id,
    };
  }),
  {
    calculationId: "FAT_PAID",
    description: "FAT_PAID = fatPaid",
    label: "FAT Paid",
    operands: ["fatPaid"],
    operation: "pass_through",
    resultKey: "FAT_PAID",
  },
  {
    calculationId: "RTF",
    description: "RTF = rtf",
    label: "RTF",
    operands: ["rtf"],
    operation: "pass_through",
    resultKey: "RTF",
  },
];

// Summary Engine: aggregates lines A-H into FAPI totals + CAD conversion
export const FAPI_SUMMARY_CALC_RULES = [
  {
    calculationId: "GROSS",
    description: "Gross = A + A1 + A2 + B + C",
    label: "Gross",
    operands: ["A", "A1", "A2", "B", "C"],
    operation: "add",
    resultKey: "GROSS",
  },
  {
    calculationId: "DEDUCTIONS",
    description: "Deductions = D + E + F + F1 + G + H",
    label: "Deductions",
    operands: ["D", "E", "F", "F1", "G", "H"],
    operation: "add",
    resultKey: "DEDUCTIONS",
  },
  {
    calculationId: "FAPI_BRUT",
    description: "FAPI Brut = max(Gross - Deductions, 0)",
    label: "FAPI Brut",
    operands: ["GROSS", "DEDUCTIONS"],
    operation: "max_subtract_zero",
    resultKey: "FAPI_BRUT",
  },
  {
    calculationId: "FAT_DEDUCTION",
    description: "FAT Deduction = min(FAT_PAID × RTF, FAPI_BRUT)",
    label: "FAT Deduction",
    operands: ["FAT_PAID", "RTF", "FAPI_BRUT"],
    operation: "min_multiply_cap",
    resultKey: "FAT_DEDUCTION",
  },
  {
    calculationId: "NET_FAPI",
    description: "Net FAPI = max(FAPI_BRUT - FAT_DEDUCTION, 0)",
    label: "Net FAPI",
    operands: ["FAPI_BRUT", "FAT_DEDUCTION"],
    operation: "max_subtract_zero",
    resultKey: "NET_FAPI",
  },
  {
    calculationId: "FX_RATE",
    description: "FX_RATE = fxRate (from Bank of Canada source)",
    label: "FX Rate",
    operands: ["fxRate"],
    operation: "pass_through",
    resultKey: "FX_RATE",
  },
  // CAD column — every result line scaled by the annual-average FX rate. Because
  // the FAPI formulas are linear, scaling each line equals recomputing in CAD
  // (matches Platform's convertMoneyLinesToCad + recompute). The parcours shows
  // all five result lines in both source currency and CAD.
  {
    calculationId: "GROSS_CAD",
    description: "Gross CAD = GROSS × FX_RATE",
    label: "Gross CAD",
    operands: ["GROSS", "FX_RATE"],
    operation: "multiply",
    resultKey: "GROSS_CAD",
  },
  {
    calculationId: "DEDUCTIONS_CAD",
    description: "Deductions CAD = DEDUCTIONS × FX_RATE",
    label: "Deductions CAD",
    operands: ["DEDUCTIONS", "FX_RATE"],
    operation: "multiply",
    resultKey: "DEDUCTIONS_CAD",
  },
  {
    calculationId: "FAPI_BRUT_CAD",
    description: "FAPI Brut CAD = FAPI_BRUT × FX_RATE",
    label: "FAPI Brut CAD",
    operands: ["FAPI_BRUT", "FX_RATE"],
    operation: "multiply",
    resultKey: "FAPI_BRUT_CAD",
  },
  {
    calculationId: "FAT_DEDUCTION_CAD",
    description: "FAT Deduction CAD = FAT_DEDUCTION × FX_RATE",
    label: "FAT Deduction CAD",
    operands: ["FAT_DEDUCTION", "FX_RATE"],
    operation: "multiply",
    resultKey: "FAT_DEDUCTION_CAD",
  },
  {
    calculationId: "NET_FAPI_CAD",
    description: "Net FAPI CAD = NET_FAPI × FX_RATE",
    label: "Net FAPI CAD",
    operands: ["NET_FAPI", "FX_RATE"],
    operation: "multiply",
    resultKey: "NET_FAPI_CAD",
  },
];

// ── Rollup rules ──────────────────────────────────────────────────────────────
// Income/expense buckets feed line A; the two sum_abs deduction rules turn the
// (negative) classified loss rows into positive named values for lines D and E.
// Other classified categories (capGains, cfaIncome, debtForgiveness) reach the
// lines engine automatically as per-category named values.
export const FAPI_ROLLUP_RULES = [
  {
    description: "Adds income mapped categories (line A property income).",
    includeCategoryIds: ["interestIncome", "rents", "royalties", "dividends", "otherFapiIncome"],
    label: "Income Bucket",
    operation: "sum",
    rollupId: "income_bucket",
  },
  {
    description: "Adds FAPI-allowable expenses using absolute values (subtracted in line A).",
    includeCategoryIds: ["generalExpenses", "legalExpenses", "accountingExpenses"],
    label: "Expense Bucket",
    operation: "sum_abs",
    rollupId: "expense_bucket",
  },
  {
    description: "Line C — controlled foreign affiliate income (classified rows).",
    includeCategoryIds: ["cfaIncome"],
    label: "CFA Income (C)",
    operation: "sum",
    rollupId: "cfaIncome",
  },
  {
    description: "Line A1 driver — debt forgiveness income (A1 = 2 × this).",
    includeCategoryIds: ["debtForgiveness"],
    label: "Debt Forgiveness (A1)",
    operation: "sum",
    rollupId: "debtForgiveness",
  },
  {
    description: "Line D — business investment losses as a positive deduction.",
    includeCategoryIds: ["businessLosses"],
    label: "Business Losses (D)",
    operation: "sum_abs",
    rollupId: "businessLosses",
  },
  {
    description: "Line E — foreign accrual capital losses as a positive deduction.",
    includeCategoryIds: ["faclCarryforward"],
    label: "FACL Carryforward (E)",
    operation: "sum_abs",
    rollupId: "faclCarryforward",
  },
];

// ── Block specs ───────────────────────────────────────────────────────────────

export const FAPI_TEMPLATE_BLOCK_SPECS = [
  // ── Sources ──────────────────────────────────────────────────────────────
  {
    catalogId: "source:excel-workbook",
    config: {
      columns: ["rowId", "account", "label", "description", "amount", "currency"],
      columnMapping: {
        account: "account",
        amount: "amount",
        currency: "currency",
        description: "description",
        label: "label",
      },
      outputs: "selected_rows",
      requireUpload: true,
      rows: [],
      selectedRange: "",
      selectedRowsCount: 0,
      selectedSheet: "",
      sheets: [],
      sourceKind: "excel_workbook",
      sourceLocator: "local-excel://awaiting-upload",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.manual_table",
      workbookName: "Upload FAPI trial balance workbook",
    },
    description: "Upload the Excel trial balance with FAPI income and expense rows.",
    id: "fapi-source-trial-balance",
    label: "Trial Balance",
    position: { x: -220, y: 80 },
  },
  {
    catalogId: "source:manual-entry",
    config: {
      documentCurrency: "USD",
      fatPaid: 100,
      fapiYear: 2025,
      inclusionRate: 0.5,
      outputs: "fapi_inputs, input_metadata",
      reportingCurrency: "CAD",
      // Corporate relevant tax factor (s.248(1)); individual/trust 1.9 is chosen
      // per-case via the worksheet RTF selector. See fapi-inputs/schema.ts.
      rtf: 4,
      // Line-driving workbook assumptions (feed A2/F–H and the 95(2) line).
      // NOTE: cfaIncome (C), debtForgiveness (A1), businessLosses (D) and
      // faclCarryforward (E) are intentionally NOT defaulted here — they come from
      // classifying trial-balance rows (the rollup produces them as named values).
      // Defaulting them to 0 here would clobber the classified value (fapi_inputs
      // wins over rollup in the calc engine). A user can still override via the
      // run's editable inputs.
      pCoefficient: 1,
      canadianRules95_4: 0,
      priorYearG: 0,
      prescribedAmount: 0,
      prescribedAmountF1: 0,
      dividendDeductions: 0,
      partnershipDividends: 0,
      sourceKind: "fapi_inputs",
      sourceLocator: "manual-source://fapi-inputs",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.fapi_inputs",
    },
    description: "Inclusion rate, RTF, FAT paid, P-coefficient, 95(2) amount, and the A1/A2/C–H line assumptions.",
    id: "fapi-source-inputs",
    label: "FAPI Inputs",
    position: { x: -220, y: 360 },
  },
  {
    catalogId: "source:currency-rate",
    config: {
      documentCurrency: "USD",
      fapiYear: 2025,
      overrideRate: 1.35,
      overrideReason: "Workbook-provided draft FX rate.",
      outputs: "exchange_rate, rate_metadata",
      rateProvider: "bank_of_canada",
      rateType: "annual_average",
      reportingCurrency: "CAD",
      sourceKind: "currency_rate",
      sourceLocator: "bank-of-canada://annual-average/USD-CAD/2025",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.currency_rate",
    },
    description: "Bank of Canada annual average USD→CAD FX rate for the FAPI year. Consumes the live Valet API rate when available, otherwise the workbook override.",
    id: "fapi-source-fx-rate",
    label: "Bank of Canada FX Rate",
    position: { x: -220, y: 640 },
  },
  {
    catalogId: "source:api-http-request",
    config: {
      apiName: "Bank of Canada Valet",
      documentCurrency: "USD",
      endpoint: "https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json",
      fapiYear: 2025,
      inputs: "HTTP GET request",
      outputs: "apiReference, exchange_rate",
      rateProvider: "bank_of_canada",
      rateType: "annual_average",
      reportingCurrency: "CAD",
      seriesName: "FXUSDCAD",
      sourceKind: "api_reference",
      sourceLocator:
        "https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?start_date=2025-01-01&end_date=2025-12-31",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.manual_value",
    },
    description:
      "Live Bank of Canada Valet API — annual-average USD→CAD observations for the FAPI year. This is the real source of the FX rate.",
    id: "fapi-api-boc-fx",
    label: "Bank of Canada Valet API",
    position: { x: -520, y: 640 },
  },

  // ── Logic ─────────────────────────────────────────────────────────────────
  {
    catalogId: "logic:classification-mapping",
    config: {
      conflictStrategy: "highest_confidence",
      inputs: "data_rows, keyword_rules",
      keywordRules: WORKING_SOURCE_DEMO_RULES,
      lowConfidenceThreshold: 0.75,
      matchFields: ["account", "label", "description"],
      matchMode: "contains",
      outputs: "mapped_rows, unmatched_rows, low_confidence_rows, mapping_summary",
      toolId: "logic.keyword_mapper",
      unmatchedStrategy: "send_to_review",
    },
    description:
      "Classifies trial balance rows into FAPI income and expense categories using built-in keyword rules.",
    id: "fapi-logic-keyword-mapper",
    label: "Keyword Mapper",
    position: { x: 340, y: 80 },
  },
  {
    catalogId: "logic:category-rollup-aggregator",
    config: {
      inputs: "mapped_rows, rollup_rules",
      operation: "sum",
      outputs: "category_totals, rollup_totals, named_values, rollup_summary",
      rollupRules: FAPI_ROLLUP_RULES,
      toolId: "logic.category_rollup_aggregator",
    },
    description:
      "Groups mapped categories into Income Bucket and Expense Bucket totals using built-in rollup rules.",
    id: "fapi-logic-category-rollup",
    label: "Category Rollup",
    position: { x: 800, y: 80 },
  },
  {
    catalogId: "logic:calculation-engine",
    config: {
      formulas: FAPI_LINES_CALC_RULES,
      inputs: "named_values, protected_inputs",
      mode: "auto",
      outputs: "calculated_results, formula_trace, calculation_summary, named_values",
      toolId: "logic.calculation_engine",
    },
    description:
      "Computes individual FAPI lines A through H from category totals and workbook inputs.",
    id: "fapi-logic-lines-engine",
    label: "FAPI Lines Engine",
    position: { x: 1260, y: 80 },
  },
  {
    catalogId: "logic:calculation-engine",
    config: {
      formulas: FAPI_SUMMARY_CALC_RULES,
      inputs: "named_values",
      mode: "auto",
      outputs: "calculated_results, formula_trace, calculation_summary, named_values",
      toolId: "logic.calculation_engine",
    },
    description:
      "Aggregates lines A-H into Gross, Deductions, FAPI Brut, Net FAPI, and Net FAPI CAD.",
    id: "fapi-logic-summary-engine",
    label: "FAPI Summary Engine",
    position: { x: 1720, y: 80 },
  },

  // ── Field blocks ──────────────────────────────────────────────────────────
  {
    catalogId: "field:field-block",
    config: { toolId: "field.field_block" },
    description: "Displays income and expense category breakdown from the rollup.",
    id: "fapi-field-income",
    label: "Income & Expense",
    position: { x: 800, y: 480 },
  },
  {
    catalogId: "field:field-block",
    config: { toolId: "field.field_block" },
    description: "Displays computed FAPI lines A through H with formula breakdown.",
    id: "fapi-field-lines",
    label: "FAPI Lines A–H",
    position: { x: 1260, y: 480 },
  },
  {
    catalogId: "field:field-block",
    config: { toolId: "field.field_block" },
    description: "Displays FAPI summary: Gross, Deductions, FAPI Brut, Net FAPI, and Net FAPI CAD.",
    id: "fapi-field-summary",
    label: "FAPI Summary",
    position: { x: 1720, y: 480 },
  },

  // ── Outputs ───────────────────────────────────────────────────────────────
  {
    catalogId: "output:evidence-pack",
    config: {
      inputs: "mapped_rows, review_findings, source_trace",
      outputs: "preview",
      toolId: "output.evidence_pack_preview",
    },
    description: "Human-readable preview with mapped rows, rollup totals, and calculated results.",
    id: "fapi-output-evidence",
    label: "Evidence Pack",
    position: { x: 2180, y: 80 },
  },
  {
    catalogId: "output:canonical-json",
    config: {
      inputs: "mapped_rows, review_findings, source_trace",
      outputs: "canonical_json",
      toolId: "output.canonical_json",
    },
    description: "Structured JSON package with mapped rows and all FAPI computed results.",
    id: "fapi-output-json",
    label: "Canonical JSON",
    position: { x: 2180, y: 380 },
  },
];

// ── Edge specs ────────────────────────────────────────────────────────────────

export const FAPI_TEMPLATE_EDGE_SPECS = [
  // Sources → Logic
  {
    bindingLabel: "Trial balance rows to classify",
    reason: "Keyword Mapper classifies uploaded trial balance rows into FAPI categories.",
    relationshipType: "provides_data_to",
    sourceBlockId: "fapi-source-trial-balance",
    sourceOutputRole: "selected_rows",
    targetBlockId: "fapi-logic-keyword-mapper",
    targetInputRole: "data_rows",
  },
  {
    bindingLabel: "Mapped categories to aggregate",
    reason: "Category Rollup groups mapped rows into income and expense buckets.",
    relationshipType: "aggregates_into",
    sourceBlockId: "fapi-logic-keyword-mapper",
    sourceOutputRole: "mapped_rows",
    targetBlockId: "fapi-logic-category-rollup",
    targetInputRole: "mapped_rows",
  },
  {
    bindingLabel: "Category totals for FAPI lines",
    reason: "Lines Engine uses category and rollup totals as named values for A-H formulas.",
    relationshipType: "provides_data_to",
    sourceBlockId: "fapi-logic-category-rollup",
    sourceOutputRole: "named_values",
    targetBlockId: "fapi-logic-lines-engine",
    targetInputRole: "named_values",
  },
  {
    bindingLabel: "FAPI workbook inputs",
    reason: "Lines Engine needs inclusion rate, RTF, and FAT paid from the workbook.",
    relationshipType: "provides_data_to",
    sourceBlockId: "fapi-source-inputs",
    sourceOutputRole: "fapi_inputs",
    targetBlockId: "fapi-logic-lines-engine",
    targetInputRole: "protected_inputs",
  },
  {
    bindingLabel: "FAPI lines A–H for summary",
    reason: "Summary Engine reads computed lines A-H and FAT/RTF as named values.",
    relationshipType: "provides_data_to",
    sourceBlockId: "fapi-logic-lines-engine",
    sourceOutputRole: "calculated_results",
    targetBlockId: "fapi-logic-summary-engine",
    targetInputRole: "named_values",
  },
  {
    bindingLabel: "Live FX observations feed the rate",
    reason:
      "Currency Rate block consumes the Bank of Canada Valet API's annual-average USD→CAD rate, falling back to the workbook override if the API is unavailable.",
    relationshipType: "provides_data_to",
    sourceBlockId: "fapi-api-boc-fx",
    sourceOutputRole: "apiReference",
    targetBlockId: "fapi-source-fx-rate",
    targetInputRole: "request",
  },
  {
    bindingLabel: "FX rate for CAD conversion",
    reason: "Summary Engine uses the Bank of Canada FX rate to convert Net FAPI to CAD.",
    relationshipType: "provides_data_to",
    sourceBlockId: "fapi-source-fx-rate",
    sourceOutputRole: "exchange_rate",
    targetBlockId: "fapi-logic-summary-engine",
    targetInputRole: "named_values",
  },

  // Logic → Field blocks
  {
    bindingLabel: "Income & expense breakdown",
    reason: "Income & Expense field displays rollup totals with category detail.",
    relationshipType: "provides_data_to",
    sourceBlockId: "fapi-logic-category-rollup",
    sourceOutputRole: "rollup_totals",
    targetBlockId: "fapi-field-income",
    targetInputRole: "computed_values",
  },
  {
    bindingLabel: "FAPI computation lines",
    reason: "FAPI Lines field displays A through H with formula trace.",
    relationshipType: "provides_data_to",
    sourceBlockId: "fapi-logic-lines-engine",
    sourceOutputRole: "calculated_results",
    targetBlockId: "fapi-field-lines",
    targetInputRole: "computed_values",
  },
  {
    bindingLabel: "FAPI summary results",
    reason: "FAPI Summary field displays Gross, Net FAPI, and Net FAPI CAD.",
    relationshipType: "provides_data_to",
    sourceBlockId: "fapi-logic-summary-engine",
    sourceOutputRole: "calculated_results",
    targetBlockId: "fapi-field-summary",
    targetInputRole: "computed_values",
  },

  // Logic → Outputs
  {
    bindingLabel: "Mapped rows evidence",
    reason: "Evidence Pack lists mapped trial balance rows with source trace.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "fapi-logic-keyword-mapper",
    sourceOutputRole: "mapped_rows",
    targetBlockId: "fapi-output-evidence",
    targetInputRole: "mapped_rows",
  },
  {
    bindingLabel: "Rollup summary evidence",
    reason: "Evidence Pack includes category and rollup totals.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "fapi-logic-category-rollup",
    sourceOutputRole: "rollup_summary",
    targetBlockId: "fapi-output-evidence",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "FAPI calculation summary",
    reason: "Evidence Pack includes all computed FAPI results.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "fapi-logic-summary-engine",
    sourceOutputRole: "calculation_summary",
    targetBlockId: "fapi-output-evidence",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "Mapped rows JSON",
    reason: "Canonical JSON includes mapped rows and source trace.",
    relationshipType: "included_in_handoff",
    sourceBlockId: "fapi-logic-keyword-mapper",
    sourceOutputRole: "mapped_rows",
    targetBlockId: "fapi-output-json",
    targetInputRole: "mapped_rows",
  },
  {
    bindingLabel: "FAPI results JSON",
    reason: "Canonical JSON includes all computed FAPI results.",
    relationshipType: "included_in_handoff",
    sourceBlockId: "fapi-logic-summary-engine",
    sourceOutputRole: "calculation_summary",
    targetBlockId: "fapi-output-json",
    targetInputRole: "review_findings",
  },
];
