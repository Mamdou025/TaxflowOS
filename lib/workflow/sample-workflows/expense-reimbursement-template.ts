// ─────────────────────────────────────────────────────────────────────────────
// Employee Expense Reimbursement — a NON-fiscal demo workflow.
//
// Purpose: take an uploaded expense report, classify each receipt into a policy
// category, roll up per category, apply per-category caps/policy, and compute the
// net amount payable to the employee (with a CAD conversion column).
//
// Shows the builder handling a business-operations pipeline that is NOT tax:
// four source types (Excel · Manual policy · Currency rate · live API feed),
// keyword classification, rollup, a two-stage calculation, field displays, and
// two output deliverables. The real domain math lives in EXPENSE_CONFIG's
// computeExtra (see lib/workflow-runs/expense.ts) — the calc-engine blocks here
// give the canvas a faithful, runnable shape.
// ─────────────────────────────────────────────────────────────────────────────

// ── Classification rules — sort each receipt into a policy category ───────────

export const EXPENSE_CLASSIFICATION_RULES = [
  {
    categoryId: "travel",
    categoryLabel: "Travel",
    confidence: 0.93,
    description: "Air, rail, taxi and ground transport to and from client sites.",
    keywords: [
      "flight", "airfare", "air travel", "airline", "taxi", "uber", "lyft",
      "train", "rail", "transport", "car rental", "parking", "toll",
    ],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-travel",
  },
  {
    categoryId: "lodging",
    categoryLabel: "Lodging",
    confidence: 0.92,
    description: "Hotels, motels and short-term accommodation.",
    keywords: [
      "hotel", "lodging", "accommodation", "motel", "airbnb", "resort", "nights",
    ],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-lodging",
  },
  {
    categoryId: "meals",
    categoryLabel: "Meals & entertainment",
    confidence: 0.9,
    description: "Business meals, restaurants and coffee meetings (per-diem capped).",
    keywords: [
      "meal", "restaurant", "dinner", "lunch", "breakfast", "coffee", "catering", "food",
    ],
    matchMode: "contains",
    priority: 9,
    ruleId: "rule-meals",
  },
  {
    categoryId: "supplies",
    categoryLabel: "Supplies & software",
    confidence: 0.88,
    description: "Equipment, hardware, stationery and software subscriptions.",
    keywords: [
      "supplies", "supply", "equipment", "hardware", "software", "subscription",
      "license", "stationery", "docking", "computer",
    ],
    matchMode: "contains",
    priority: 8,
    ruleId: "rule-supplies",
  },
  {
    categoryId: "mileage",
    categoryLabel: "Personal vehicle mileage",
    confidence: 0.9,
    description: "Personal-vehicle mileage reimbursed at the corporate rate.",
    keywords: [
      "mileage", "kilometre", "kilometer", "km", "personal vehicle", "car allowance", "odometer",
    ],
    matchMode: "contains",
    priority: 9,
    ruleId: "rule-mileage",
  },
  {
    categoryId: "nonReimbursable",
    categoryLabel: "Non-reimbursable (policy)",
    confidence: 0.86,
    description: "Alcohol, gifts, fines and personal items disallowed by policy.",
    keywords: [
      "alcohol", "wine", "beer", "liquor", "gift", "fine", "penalty", "personal", "entertainment",
    ],
    matchMode: "contains",
    priority: 7,
    ruleId: "rule-non-reimbursable",
  },
];

// ── Rollup rules — total each policy category + a submitted grand total ────────

export const EXPENSE_ROLLUP_RULES = [
  { description: "Total travel receipts.", includeCategoryIds: ["travel"], label: "Travel total", operation: "sum", rollupId: "travel_total" },
  { description: "Total lodging receipts.", includeCategoryIds: ["lodging"], label: "Lodging total", operation: "sum", rollupId: "lodging_total" },
  { description: "Total meal receipts (before per-diem cap).", includeCategoryIds: ["meals"], label: "Meals total", operation: "sum", rollupId: "meals_total" },
  { description: "Total supplies & software receipts.", includeCategoryIds: ["supplies"], label: "Supplies total", operation: "sum", rollupId: "supplies_total" },
  { description: "Total personal-vehicle mileage claimed.", includeCategoryIds: ["mileage"], label: "Mileage total", operation: "sum", rollupId: "mileage_total" },
  { description: "Total non-reimbursable (policy-disallowed) items.", includeCategoryIds: ["nonReimbursable"], label: "Non-reimbursable total", operation: "sum", rollupId: "nonreimbursable_total" },
  {
    description: "All submitted receipts across every category.",
    includeCategoryIds: ["travel", "lodging", "meals", "supplies", "mileage", "nonReimbursable"],
    label: "Submitted grand total",
    operation: "sum",
    rollupId: "submitted_total",
  },
];

// ── Calculation rules — per-category reimbursable amounts (stage 1) ────────────
// operation:'min' with a literal cap → min(bucket, cap); max_subtract_zero →
// the over-cap disallowed portion. Real policy numbers come from computeExtra;
// these give the calc block a runnable, faithful shape on the canvas.

export const EXPENSE_LINES_CALC_RULES = [
  { calculationId: "TRAVEL_REIMBURSABLE", description: "Travel = travel_total (100% policy)", label: "Travel (reimbursable)", operands: ["travel_total"], operation: "pass_through", resultKey: "TRAVEL_REIMBURSABLE" },
  { calculationId: "LODGING_REIMBURSABLE", description: "Lodging = lodging_total (100% policy)", label: "Lodging (reimbursable)", operands: ["lodging_total"], operation: "pass_through", resultKey: "LODGING_REIMBURSABLE" },
  { calculationId: "MEALS_REIMBURSABLE", description: "Meals = min(meals_total, per-diem cap)", label: "Meals (capped)", operands: ["meals_total", 250], operation: "min", resultKey: "MEALS_REIMBURSABLE" },
  { calculationId: "SUPPLIES_REIMBURSABLE", description: "Supplies = supplies_total (100% policy)", label: "Supplies (reimbursable)", operands: ["supplies_total"], operation: "pass_through", resultKey: "SUPPLIES_REIMBURSABLE" },
  { calculationId: "MILEAGE_REIMBURSABLE", description: "Mileage = mileage_total (corporate rate)", label: "Mileage (reimbursable)", operands: ["mileage_total"], operation: "pass_through", resultKey: "MILEAGE_REIMBURSABLE" },
  { calculationId: "MEALS_OVER_CAP", description: "Meals over cap = max(meals_total − per-diem cap, 0)", label: "Meals over cap (disallowed)", operands: ["meals_total", 250], operation: "max_subtract_zero", resultKey: "MEALS_OVER_CAP" },
];

// ── Calculation rules — report totals (stage 2) ───────────────────────────────

export const EXPENSE_SUMMARY_CALC_RULES = [
  { calculationId: "SUBMITTED_TOTAL", description: "Submitted total = every receipt across all categories", label: "Submitted total", operands: ["submitted_total"], operation: "pass_through", resultKey: "SUBMITTED_TOTAL" },
  { calculationId: "TOTAL_REIMBURSABLE", description: "Total reimbursable = sum of the five reimbursable category lines", label: "Total reimbursable", operands: ["TRAVEL_REIMBURSABLE", "LODGING_REIMBURSABLE", "MEALS_REIMBURSABLE", "SUPPLIES_REIMBURSABLE", "MILEAGE_REIMBURSABLE"], operation: "add", resultKey: "TOTAL_REIMBURSABLE" },
  { calculationId: "POLICY_DISALLOWED", description: "Disallowed = non-reimbursable items + meals over cap", label: "Policy-disallowed", operands: ["nonreimbursable_total", "MEALS_OVER_CAP"], operation: "add", resultKey: "POLICY_DISALLOWED" },
  { calculationId: "NET_PAYABLE", description: "Net payable to employee = total reimbursable", label: "Net payable to employee", operands: ["TOTAL_REIMBURSABLE"], operation: "pass_through", resultKey: "NET_PAYABLE" },
  { calculationId: "FX_RATE", description: "Annual-average USD→CAD rate (Bank of Canada)", label: "FX rate (USD → CAD)", operands: ["fxRate"], operation: "pass_through", resultKey: "FX_RATE" },
  { calculationId: "NET_PAYABLE_CAD", description: "Net payable (CAD) = net payable × FX rate", label: "Net payable (CAD)", operands: ["NET_PAYABLE", "FX_RATE"], operation: "multiply", resultKey: "NET_PAYABLE_CAD" },
];

// ── Block specs ───────────────────────────────────────────────────────────────

export const EXPENSE_TEMPLATE_BLOCK_SPECS = [
  // ── Sources ────────────────────────────────────────────────────────────────
  {
    catalogId: "source:excel-workbook",
    config: {
      columns: ["rowId", "account", "label", "description", "amount", "currency"],
      columnMapping: { account: "account", amount: "amount", currency: "currency", description: "description", label: "label" },
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
      workbookName: "Upload the employee expense report",
    },
    description: "Upload the expense report — one row per receipt (merchant, description, amount, currency).",
    id: "expense-source-receipts",
    label: "Expense Report",
    position: { x: -220, y: 80 },
  },
  {
    catalogId: "source:manual-entry",
    config: {
      documentCurrency: "USD",
      reportingCurrency: "CAD",
      // Policy parameters (shown in the inspector; the run/worksheet expose these
      // as editable inputs, injected into the reimbursement math at compute time).
      mealPerDiemCap: 250,
      reimbursementRate: 1,
      mileageRate: 0.68,
      outputs: "reimbursement_policy, input_metadata",
      sourceKind: "fapi_inputs",
      sourceLocator: "manual-source://reimbursement-policy",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.fapi_inputs",
    },
    description: "Reimbursement policy: meal per-diem cap, mileage rate, and the reimbursement rate for capped categories.",
    id: "expense-source-policy",
    label: "Reimbursement Policy",
    position: { x: -220, y: 360 },
  },
  {
    catalogId: "source:currency-rate",
    config: {
      documentCurrency: "USD",
      fapiYear: 2025,
      overrideRate: 1.35,
      overrideReason: "Draft USD→CAD rate for expense conversion.",
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
    description: "Bank of Canada annual-average USD→CAD rate used to pay a USD expense report in Canadian dollars.",
    id: "expense-source-fx",
    label: "USD → CAD Rate",
    position: { x: -220, y: 640 },
  },
  {
    catalogId: "source:api-http-request",
    config: {
      apiName: "Bank of Canada Valet",
      documentCurrency: "USD",
      endpoint: "https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json",
      inputs: "HTTP GET request",
      outputs: "apiReference, exchange_rate",
      rateProvider: "bank_of_canada",
      rateType: "annual_average",
      reportingCurrency: "CAD",
      seriesName: "FXUSDCAD",
      sourceKind: "api_reference",
      sourceLocator: "https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?start_date=2025-01-01&end_date=2025-12-31",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.manual_value",
    },
    description: "Live Bank of Canada Valet API — the real origin of the USD→CAD conversion rate.",
    id: "expense-api-boc-fx",
    label: "Bank of Canada Valet API",
    position: { x: -520, y: 640 },
  },

  // ── Logic ──────────────────────────────────────────────────────────────────
  {
    catalogId: "logic:classification-mapping",
    config: {
      conflictStrategy: "highest_confidence",
      inputs: "data_rows, keyword_rules",
      keywordRules: EXPENSE_CLASSIFICATION_RULES,
      lowConfidenceThreshold: 0.75,
      matchFields: ["label", "description", "account"],
      matchMode: "contains",
      outputs: "mapped_rows, unmatched_rows, low_confidence_rows, mapping_summary",
      toolId: "logic.keyword_mapper",
      unmatchedStrategy: "send_to_review",
    },
    description: "Classifies each receipt into a policy category (travel, lodging, meals, supplies, mileage, non-reimbursable).",
    id: "expense-logic-classifier",
    label: "Expense Classifier",
    position: { x: 340, y: 80 },
  },
  {
    catalogId: "logic:category-rollup-aggregator",
    config: {
      inputs: "mapped_rows, rollup_rules",
      operation: "sum",
      outputs: "category_totals, rollup_totals, named_values, rollup_summary",
      rollupRules: EXPENSE_ROLLUP_RULES,
      toolId: "logic.category_rollup_aggregator",
    },
    description: "Totals receipts per policy category and produces the submitted grand total.",
    id: "expense-logic-rollup",
    label: "Category Totals",
    position: { x: 800, y: 80 },
  },
  {
    catalogId: "logic:calculation-engine",
    config: {
      formulas: EXPENSE_LINES_CALC_RULES,
      inputs: "named_values, protected_inputs",
      mode: "auto",
      outputs: "calculated_results, formula_trace, calculation_summary, named_values",
      toolId: "logic.calculation_engine",
    },
    description: "Applies the per-category policy: meal per-diem cap, and the reimbursable amount per category.",
    id: "expense-logic-lines",
    label: "Policy Engine",
    position: { x: 1260, y: 80 },
  },
  {
    catalogId: "logic:calculation-engine",
    config: {
      formulas: EXPENSE_SUMMARY_CALC_RULES,
      inputs: "named_values",
      mode: "auto",
      outputs: "calculated_results, formula_trace, calculation_summary, named_values",
      toolId: "logic.calculation_engine",
    },
    description: "Sums the reimbursable lines into the net payable and converts it to CAD.",
    id: "expense-logic-summary",
    label: "Reimbursement Summary",
    position: { x: 1720, y: 80 },
  },

  // ── Field blocks ───────────────────────────────────────────────────────────
  {
    catalogId: "field:field-block",
    config: { toolId: "field.field_block" },
    description: "Displays the total claimed per policy category.",
    id: "expense-field-categories",
    label: "Category Breakdown",
    position: { x: 800, y: 480 },
  },
  {
    catalogId: "field:field-block",
    config: { toolId: "field.field_block" },
    description: "Displays the reimbursable amount per category after policy caps.",
    id: "expense-field-lines",
    label: "Reimbursable Lines",
    position: { x: 1260, y: 480 },
  },
  {
    catalogId: "field:field-block",
    config: { toolId: "field.field_block" },
    description: "Displays the reimbursement summary: submitted, reimbursable, disallowed, net payable, CAD.",
    id: "expense-field-summary",
    label: "Reimbursement Summary",
    position: { x: 1720, y: 480 },
  },

  // ── Outputs ────────────────────────────────────────────────────────────────
  {
    catalogId: "output:evidence-pack",
    config: {
      inputs: "mapped_rows, review_findings, source_trace",
      outputs: "preview",
      toolId: "output.evidence_pack_preview",
    },
    description: "Reviewable pack: each receipt with its category, the policy applied, and the net payable.",
    id: "expense-output-evidence",
    label: "Approval Pack",
    position: { x: 2180, y: 80 },
  },
  {
    catalogId: "output:excel-export",
    config: {
      inputs: "mapped_rows, calculation_summary",
      outputs: "workbook",
      toolId: "output.excel_export",
    },
    description: "Excel export of the reimbursement schedule for payroll upload.",
    id: "expense-output-excel",
    label: "Payroll Export",
    position: { x: 2180, y: 380 },
  },
];

// ── Edge specs ──────────────────────────────────────────────────────────────

export const EXPENSE_TEMPLATE_EDGE_SPECS = [
  // Sources → Logic
  {
    bindingLabel: "Receipts to classify",
    reason: "The Expense Classifier sorts each uploaded receipt into a policy category.",
    relationshipType: "provides_data_to",
    sourceBlockId: "expense-source-receipts",
    sourceOutputRole: "selected_rows",
    targetBlockId: "expense-logic-classifier",
    targetInputRole: "data_rows",
  },
  {
    bindingLabel: "Classified receipts to total",
    reason: "Category Totals groups classified receipts into per-category buckets.",
    relationshipType: "aggregates_into",
    sourceBlockId: "expense-logic-classifier",
    sourceOutputRole: "mapped_rows",
    targetBlockId: "expense-logic-rollup",
    targetInputRole: "mapped_rows",
  },
  {
    bindingLabel: "Category totals for the policy engine",
    reason: "The Policy Engine reads the per-category totals to apply caps and rates.",
    relationshipType: "provides_data_to",
    sourceBlockId: "expense-logic-rollup",
    sourceOutputRole: "named_values",
    targetBlockId: "expense-logic-lines",
    targetInputRole: "named_values",
  },
  {
    bindingLabel: "Reimbursement policy parameters",
    reason: "The Policy Engine needs the meal per-diem cap and reimbursement rate from policy.",
    relationshipType: "provides_data_to",
    sourceBlockId: "expense-source-policy",
    sourceOutputRole: "reimbursement_policy",
    targetBlockId: "expense-logic-lines",
    targetInputRole: "protected_inputs",
  },
  {
    bindingLabel: "Reimbursable lines to summarize",
    reason: "The Reimbursement Summary totals the reimbursable category lines.",
    relationshipType: "provides_data_to",
    sourceBlockId: "expense-logic-lines",
    sourceOutputRole: "calculated_results",
    targetBlockId: "expense-logic-summary",
    targetInputRole: "named_values",
  },
  {
    bindingLabel: "Live FX observations feed the rate",
    reason: "The USD→CAD rate consumes the Bank of Canada Valet API annual-average observations.",
    relationshipType: "provides_data_to",
    sourceBlockId: "expense-api-boc-fx",
    sourceOutputRole: "apiReference",
    targetBlockId: "expense-source-fx",
    targetInputRole: "request",
  },
  {
    bindingLabel: "FX rate for CAD conversion",
    reason: "The Reimbursement Summary uses the USD→CAD rate to pay the report in Canadian dollars.",
    relationshipType: "provides_data_to",
    sourceBlockId: "expense-source-fx",
    sourceOutputRole: "exchange_rate",
    targetBlockId: "expense-logic-summary",
    targetInputRole: "named_values",
  },

  // Logic → Field blocks
  {
    bindingLabel: "Per-category breakdown",
    reason: "The Category Breakdown field shows the total claimed per policy category.",
    relationshipType: "provides_data_to",
    sourceBlockId: "expense-logic-rollup",
    sourceOutputRole: "rollup_totals",
    targetBlockId: "expense-field-categories",
    targetInputRole: "computed_values",
  },
  {
    bindingLabel: "Reimbursable lines",
    reason: "The Reimbursable Lines field shows the reimbursable amount per category after caps.",
    relationshipType: "provides_data_to",
    sourceBlockId: "expense-logic-lines",
    sourceOutputRole: "calculated_results",
    targetBlockId: "expense-field-lines",
    targetInputRole: "computed_values",
  },
  {
    bindingLabel: "Reimbursement summary",
    reason: "The Reimbursement Summary field shows net payable and the CAD conversion.",
    relationshipType: "provides_data_to",
    sourceBlockId: "expense-logic-summary",
    sourceOutputRole: "calculated_results",
    targetBlockId: "expense-field-summary",
    targetInputRole: "computed_values",
  },

  // Logic → Outputs
  {
    bindingLabel: "Classified receipts evidence",
    reason: "The Approval Pack lists each classified receipt with the policy applied.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "expense-logic-classifier",
    sourceOutputRole: "mapped_rows",
    targetBlockId: "expense-output-evidence",
    targetInputRole: "mapped_rows",
  },
  {
    bindingLabel: "Reimbursement summary evidence",
    reason: "The Approval Pack includes the computed reimbursement totals.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "expense-logic-summary",
    sourceOutputRole: "calculation_summary",
    targetBlockId: "expense-output-evidence",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "Reimbursement schedule to Excel",
    reason: "The Payroll Export writes the reimbursement schedule to a workbook.",
    relationshipType: "included_in_handoff",
    sourceBlockId: "expense-logic-summary",
    sourceOutputRole: "calculation_summary",
    targetBlockId: "expense-output-excel",
    targetInputRole: "calculation_summary",
  },
];
