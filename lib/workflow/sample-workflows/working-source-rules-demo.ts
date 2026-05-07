type StarterAggregationOperand = {
  label?: string;
  refId?: string;
  refType: "category" | "constant" | "input" | "node";
  sign?: 1 | -1;
  value?: number;
};

type StarterAggregationRule = {
  children: string[];
  description?: string;
  formulaExpression?: string;
  includeCategoryIds?: string[];
  label: string;
  nodeId: string;
  nodeType:
    | "category_total"
    | "constant"
    | "final_result"
    | "formula"
    | "group";
  operands?: StarterAggregationOperand[];
  operation:
    | "add"
    | "divide"
    | "max_subtract_zero"
    | "min_multiply_cap"
    | "multiply"
    | "pass_through"
    | "subtract"
    | "sum"
    | "sum_abs";
  order: number;
  outputRole?: string;
  resultName?: string;
  value?: number;
};

type StarterRollupRule = {
  description?: string;
  includeCategoryIds: string[];
  label: string;
  operation: "sum" | "sum_abs";
  rollupId: string;
};

type StarterCalculationRule = {
  calculationId: string;
  description?: string;
  label: string;
  operands: Array<number | string>;
  operation:
    | "abs"
    | "add"
    | "divide"
    | "max"
    | "max_subtract_zero"
    | "min"
    | "min_multiply_cap"
    | "multiply"
    | "pass_through"
    | "round"
    | "subtract";
  resultKey: string;
};

const WORKING_SOURCE_DEMO_HEADERS = [
  "rowId",
  "account",
  "label",
  "description",
  "amount",
  "currency",
];

export const WORKING_SOURCE_DEMO_RULES = [
  {
    categoryId: "interestIncome",
    categoryLabel: "Interest Income",
    confidence: 0.95,
    description: "Interest income style row.",
    keywords: ["interest income", "interest earned", "bank interest"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-interest-income",
  },
  {
    categoryId: "rents",
    categoryLabel: "Rents",
    confidence: 0.92,
    description: "Rental or lease income style row.",
    keywords: ["rental income", "rent received", "lease income"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-rents",
  },
  {
    categoryId: "royalties",
    categoryLabel: "Royalties",
    confidence: 0.9,
    description: "Royalty income style row.",
    keywords: ["royalty income", "royalties", "patent royalty"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-royalties",
  },
  {
    categoryId: "dividends",
    categoryLabel: "Dividends",
    confidence: 0.9,
    description: "Dividend income style row.",
    keywords: ["dividend income", "portfolio shares"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-dividends",
  },
  {
    categoryId: "otherFapiIncome",
    categoryLabel: "Other FAPI Income",
    confidence: 0.72,
    description: "Other FAPI income style row with lower confidence.",
    keywords: ["other fapi income", "miscellaneous fapi revenue"],
    matchMode: "contains",
    priority: 5,
    ruleId: "rule-other-fapi-income",
  },
  {
    categoryId: "generalExpenses",
    categoryLabel: "General Expenses",
    confidence: 0.9,
    description: "General expense row.",
    keywords: ["general expenses", "operating expenses"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-general-expenses",
  },
  {
    categoryId: "legalExpenses",
    categoryLabel: "Legal Expenses",
    confidence: 0.9,
    description: "Legal expense row.",
    keywords: ["legal expenses", "legal advisory"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-legal-expenses",
  },
  {
    categoryId: "accountingExpenses",
    categoryLabel: "Accounting Expenses",
    confidence: 0.9,
    description: "Accounting expense row.",
    keywords: ["accounting expenses", "accounting service"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-accounting-expenses",
  },
  {
    categoryId: "debtForgiveness",
    categoryLabel: "Debt Forgiveness",
    confidence: 0.9,
    description: "Debt forgiveness amount.",
    keywords: ["debt forgiveness"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-debt-forgiveness",
  },
  {
    categoryId: "priorYearG",
    categoryLabel: "Prior Year G",
    confidence: 0.9,
    description: "Prior year amount G.",
    keywords: ["prior year g"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-prior-year-g",
  },
  {
    categoryId: "capGains",
    categoryLabel: "Capital Gains",
    confidence: 0.9,
    description: "Capital gains amount.",
    keywords: ["capital gains", "cap gains"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-cap-gains",
  },
  {
    categoryId: "cfaIncome",
    categoryLabel: "CFA Income",
    confidence: 0.9,
    description: "CFA income amount.",
    keywords: ["cfa income"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-cfa-income",
  },
  {
    categoryId: "businessLosses",
    categoryLabel: "Business Losses",
    confidence: 0.9,
    description: "Business losses amount.",
    keywords: ["business losses"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-business-losses",
  },
  {
    categoryId: "faclCarryforward",
    categoryLabel: "FACL Carryforward",
    confidence: 0.9,
    description: "FACL carryforward amount.",
    keywords: ["facl carryforward"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-facl-carryforward",
  },
  {
    categoryId: "prescribedAmount",
    categoryLabel: "Prescribed Amount",
    confidence: 0.9,
    description: "Prescribed amount.",
    excludeKeywords: ["f1"],
    keywords: ["prescribed amount"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-prescribed-amount",
  },
  {
    categoryId: "prescribedAmountF1",
    categoryLabel: "Prescribed Amount F1",
    confidence: 0.9,
    description: "Prescribed amount F1.",
    keywords: ["prescribed amount f1"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-prescribed-amount-f1",
  },
  {
    categoryId: "dividendDeductions",
    categoryLabel: "Dividend Deductions",
    confidence: 0.9,
    description: "Dividend deductions amount.",
    keywords: ["dividend deductions"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-dividend-deductions",
  },
  {
    categoryId: "partnershipDividends",
    categoryLabel: "Partnership Dividends",
    confidence: 0.9,
    description: "Partnership dividends amount.",
    keywords: ["partnership dividends"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-partnership-dividends",
  },
];

export const WORKING_SOURCE_DEMO_EXPECTED_RESULTS = {
  A: 4950,
  A1: 100,
  A2: 75,
  B: 400,
  C: 125,
  D: 200,
  Deductions: 400,
  E: 90,
  F: 40,
  F1: 10,
  "FAPI Brut": 5250,
  "FAT Deduction": 190,
  G: 35,
  Gross: 5650,
  H: 25,
  "Net FAPI": 5060,
  "Net FAPI CAD": 6831,
};

export const WORKING_SOURCE_DEMO_FAPI_INPUTS = {
  documentCurrency: "USD",
  expectedResults: WORKING_SOURCE_DEMO_EXPECTED_RESULTS,
  fatPaid: 100,
  fapiYear: 2025,
  inclusionRate: 0.5,
  reportingCurrency: "CAD",
  rtf: 1.9,
};

export const WORKING_SOURCE_DEMO_FX_RATE = {
  documentCurrency: "USD",
  fapiYear: 2025,
  overrideRate: 1.35,
  overrideReason: "Workbook-provided local draft override.",
  rateProvider: "bank_of_canada",
  rateType: "annual_average",
  reportingCurrency: "CAD",
};

export const WORKING_SOURCE_DEMO_AGGREGATION_RULES: StarterAggregationRule[] = [
  {
    children: [],
    description: "Income bucket sourced from mapped atomic categories.",
    includeCategoryIds: [
      "interestIncome",
      "rents",
      "royalties",
      "dividends",
      "otherFapiIncome",
    ],
    label: "Income Bucket",
    nodeId: "income_bucket",
    nodeType: "group",
    operation: "sum",
    order: 10,
  },
  {
    children: [],
    description:
      "Expense bucket uses absolute values for deduction style rows.",
    includeCategoryIds: [
      "generalExpenses",
      "legalExpenses",
      "accountingExpenses",
    ],
    label: "Expense Bucket",
    nodeId: "expense_bucket",
    nodeType: "group",
    operation: "sum_abs",
    order: 20,
  },
  {
    children: [],
    description: "A = income bucket minus expense bucket, floored at zero.",
    label: "A",
    nodeId: "A",
    nodeType: "final_result" as const,
    operands: [
      { label: "Income Bucket", refId: "income_bucket", refType: "node" },
      { label: "Expense Bucket", refId: "expense_bucket", refType: "node" },
    ],
    operation: "max_subtract_zero",
    order: 30,
    outputRole: "official_line",
    resultName: "A",
  },
  {
    children: [],
    label: "A1",
    nodeId: "A1",
    nodeType: "final_result",
    operands: [
      { refId: "debtForgiveness", refType: "category" },
      { refType: "constant", value: 2 },
    ],
    operation: "multiply",
    order: 40,
    outputRole: "official_line",
    resultName: "A1",
  },
  {
    children: [],
    label: "A2",
    nodeId: "A2",
    nodeType: "final_result",
    operands: [{ refId: "priorYearG", refType: "category" }],
    operation: "pass_through" as const,
    order: 50,
    outputRole: "official_line",
    resultName: "A2",
  },
  {
    children: [],
    label: "B",
    nodeId: "B",
    nodeType: "final_result" as const,
    operands: [
      { refId: "capGains", refType: "category" },
      { label: "Inclusion Rate", refId: "inclusionRate", refType: "input" },
    ],
    operation: "multiply",
    order: 60,
    outputRole: "official_line",
    resultName: "B",
  },
  ...[
    ["C", "cfaIncome"],
    ["D", "businessLosses"],
    ["E", "faclCarryforward"],
    ["F", "prescribedAmount"],
    ["F1", "prescribedAmountF1"],
    ["G", "dividendDeductions"],
    ["H", "partnershipDividends"],
  ].map<StarterAggregationRule>(([nodeId, categoryId], index) => ({
    children: [],
    label: nodeId,
    nodeId,
    nodeType: "final_result",
    operands: [{ refId: categoryId, refType: "category" as const }],
    operation: "pass_through" as const,
    order: 70 + index * 10,
    outputRole: "official_line",
    resultName: nodeId,
  })),
  {
    children: [],
    label: "FAT Paid",
    nodeId: "FAT_PAID",
    nodeType: "final_result" as const,
    operands: [{ label: "FAT Paid", refId: "fatPaid", refType: "input" }],
    operation: "pass_through" as const,
    order: 140,
    outputRole: "official_line",
    resultName: "FAT_PAID",
  },
  {
    children: [],
    label: "RTF",
    nodeId: "RTF",
    nodeType: "final_result" as const,
    operands: [{ label: "RTF", refId: "rtf", refType: "input" }],
    operation: "pass_through",
    order: 150,
    outputRole: "official_line",
    resultName: "RTF",
  },
  {
    children: [],
    label: "FX Rate",
    nodeId: "FX_RATE",
    nodeType: "final_result",
    operands: [{ label: "FX Rate", refId: "fxRate", refType: "input" }],
    operation: "pass_through",
    order: 160,
    outputRole: "official_line",
    resultName: "FX_RATE",
  },
  {
    children: [],
    label: "Gross",
    nodeId: "GROSS",
    nodeType: "final_result",
    operands: ["A", "A1", "A2", "B", "C"].map((refId) => ({
      refId,
      refType: "node" as const,
    })),
    operation: "add" as const,
    order: 170,
    resultName: "Gross",
  },
  {
    children: [],
    label: "Deductions",
    nodeId: "DEDUCTIONS",
    nodeType: "final_result" as const,
    operands: ["D", "E", "F", "F1", "G", "H"].map((refId) => ({
      refId,
      refType: "node" as const,
    })),
    operation: "add" as const,
    order: 180,
    resultName: "Deductions",
  },
  {
    children: [],
    label: "FAPI Brut",
    nodeId: "FAPI_BRUT",
    nodeType: "final_result" as const,
    operands: [
      { refId: "GROSS", refType: "node" },
      { refId: "DEDUCTIONS", refType: "node" },
    ],
    operation: "max_subtract_zero" as const,
    order: 190,
    resultName: "FAPI Brut",
  },
  {
    children: [],
    label: "FAT Deduction",
    nodeId: "FAT_DEDUCTION",
    nodeType: "final_result" as const,
    operands: [
      { label: "FAT Paid", refId: "fatPaid", refType: "input" },
      { label: "RTF", refId: "rtf", refType: "input" },
      { label: "FAPI Brut", refId: "FAPI_BRUT", refType: "node" },
    ],
    operation: "min_multiply_cap" as const,
    order: 200,
    resultName: "FAT Deduction",
  },
  {
    children: [],
    label: "Net FAPI",
    nodeId: "NET_FAPI",
    nodeType: "final_result" as const,
    operands: [
      { refId: "FAPI_BRUT", refType: "node" },
      { refId: "FAT_DEDUCTION", refType: "node" },
    ],
    operation: "max_subtract_zero" as const,
    order: 210,
    resultName: "Net FAPI",
  },
  {
    children: [],
    formulaExpression: "node:NET_FAPI * input:fxRate",
    label: "Net FAPI CAD",
    nodeId: "NET_FAPI_CAD",
    nodeType: "final_result" as const,
    operands: [],
    operation: "multiply" as const,
    order: 220,
    resultName: "Net FAPI CAD",
  },
];

export const WORKING_SOURCE_DEMO_ROLLUP_RULES: StarterRollupRule[] = [
  {
    description: "Adds income mapped categories.",
    includeCategoryIds: [
      "interestIncome",
      "rents",
      "royalties",
      "dividends",
      "otherFapiIncome",
    ],
    label: "Income Bucket",
    operation: "sum",
    rollupId: "income_bucket",
  },
  {
    description: "Adds expenses using absolute values.",
    includeCategoryIds: [
      "generalExpenses",
      "legalExpenses",
      "accountingExpenses",
    ],
    label: "Expense Bucket",
    operation: "sum_abs",
    rollupId: "expense_bucket",
  },
];

export const WORKING_SOURCE_DEMO_CALCULATION_RULES: StarterCalculationRule[] = [
  {
    calculationId: "A",
    description: "A = max(income_bucket - expense_bucket, 0)",
    label: "A",
    operands: ["income_bucket", "expense_bucket"],
    operation: "max_subtract_zero",
    resultKey: "A",
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
  ...[
    ["C", "cfaIncome"],
    ["D", "businessLosses"],
    ["E", "faclCarryforward"],
    ["F", "prescribedAmount"],
    ["F1", "prescribedAmountF1"],
    ["G", "dividendDeductions"],
    ["H", "partnershipDividends"],
  ].map<StarterCalculationRule>(([calculationId, sourceKey]) => ({
    calculationId,
    description: `${calculationId} = ${sourceKey}`,
    label: calculationId,
    operands: [sourceKey],
    operation: "pass_through",
    resultKey: calculationId,
  })),
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
  {
    calculationId: "FX_RATE",
    description: "FX_RATE = fxRate",
    label: "FX Rate",
    operands: ["fxRate"],
    operation: "pass_through",
    resultKey: "FX_RATE",
  },
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
    description: "FAPI Brut = max(GROSS - DEDUCTIONS, 0)",
    label: "FAPI Brut",
    operands: ["GROSS", "DEDUCTIONS"],
    operation: "max_subtract_zero",
    resultKey: "FAPI_BRUT",
  },
  {
    calculationId: "FAT_DEDUCTION",
    description: "FAT Deduction = min(max(FAT_PAID, 0) * RTF, FAPI_BRUT)",
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
    calculationId: "NET_FAPI_CAD",
    description: "Net FAPI CAD = NET_FAPI * FX_RATE",
    label: "Net FAPI CAD",
    operands: ["NET_FAPI", "FX_RATE"],
    operation: "multiply",
    resultKey: "NET_FAPI_CAD",
  },
];

const PROTECTED_RESULT_NAMES = [
  "A",
  "A1",
  "A2",
  "B",
  "C",
  "D",
  "E",
  "F",
  "F1",
  "G",
  "H",
  "FAT_PAID",
  "RTF",
  "Gross",
  "Deductions",
  "FAPI Brut",
  "FAT Deduction",
  "Net FAPI",
  "Net FAPI CAD",
];

const REQUIRED_INPUT_KEYS = [
  "trial_balance_rows",
  "keyword_rules",
  "rollup_rules",
  "fatPaid",
  "rtf",
  "fxRate",
  "inclusionRate",
  "expectedResults",
];

const REQUIRED_PROTECTED_SUMMARY_RESULTS = [
  "Gross",
  "Deductions",
  "FAPI Brut",
  "FAT Deduction",
  "Net FAPI",
  "Net FAPI CAD",
];

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const PROTECTED_RESULT_SPECS = PROTECTED_RESULT_NAMES.map(
  (resultName, index) => ({
    catalogId: "protected:protected-result",
    config: {
      inputs: "candidate_value, approval_status",
      outputs: "protected_result",
      resultName,
      runtimeLocked: true,
      toolId: "protected.protected_result",
    },
    description: `Governed protected result ${resultName}.`,
    id: `working-protected-${slug(resultName)}`,
    label: `Protected ${resultName}`,
    position: { x: 1320, y: 80 + index * 120 },
  })
);

export const WORKING_SOURCE_DEMO_BLOCK_SPECS = [
  {
    catalogId: "source:excel-workbook",
    config: {
      columns: WORKING_SOURCE_DEMO_HEADERS,
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
      workbookName: "Upload workflow_studio_fapi_sample_source.xlsx",
    },
    description:
      "Draft local Excel Source where the FAPI-style workbook can be uploaded.",
    id: "working-source-uploaded-rows",
    label: "Uploaded Workbook",
    position: { x: -180, y: 100 },
  },
  {
    catalogId: "source:keyword-rules",
    config: {
      keywordRules: WORKING_SOURCE_DEMO_RULES,
      outputs: "keyword_rules",
      ruleVersion: "v1",
      sourceKind: "keyword_rules",
      sourceLocator: "manual-source://keyword-rulebook-awaiting-import",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.keyword_rules",
    },
    description:
      "Editable draft Keyword Rulebook imported from the workbook rules sheet.",
    id: "working-source-editable-rules",
    label: "Keyword Rulebook",
    position: { x: -180, y: 370 },
  },
  {
    catalogId: "source:rollup-rules",
    config: {
      outputs: "rollup_rules",
      rollupRules: WORKING_SOURCE_DEMO_ROLLUP_RULES,
      ruleVersion: "v1",
      sourceKind: "rollup_rules",
      sourceLocator: "manual-source://rollup-rulebook-awaiting-import",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.rollup_rules",
    },
    description:
      "Editable draft Rollup Rulebook defining category grouping only.",
    id: "working-source-rollup-rules",
    label: "Rollup Rulebook",
    position: { x: -180, y: 640 },
  },
  {
    catalogId: "source:manual-entry",
    config: {
      ...WORKING_SOURCE_DEMO_FAPI_INPUTS,
      outputs: "fapi_inputs, input_metadata",
      sourceKind: "fapi_inputs",
      sourceLocator: "manual-source://fapi-inputs-awaiting-import",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.fapi_inputs",
    },
    description:
      "Workbook calculation inputs such as inclusion rate, RTF, FAT paid, and expected results.",
    id: "working-source-fapi-inputs",
    label: "FAPI Inputs",
    position: { x: -180, y: 910 },
  },
  {
    catalogId: "source:currency-rate",
    config: {
      ...WORKING_SOURCE_DEMO_FX_RATE,
      outputs: "exchange_rate, rate_metadata",
      sourceKind: "currency_rate",
      sourceLocator: "bank-of-canada://annual-average/USD-CAD/2025",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.currency_rate",
    },
    description:
      "External Bank of Canada-style FX rate reference. Overrides are reviewed downstream.",
    id: "working-source-bank-of-canada-fx",
    label: "Bank of Canada FX Rate",
    position: { x: -180, y: 1180 },
  },
  {
    catalogId: "review:manual-override-review",
    config: {
      approved: true,
      inputs: "exchange_rate",
      outputs: "reviewed_exchange_rate, fapi_inputs, approval_status",
      overrideRate: undefined,
      overrideReason: "",
      reviewer: "fx-reviewer",
      toolId: "review.fx_rate_review",
      useOverride: false,
    },
    description:
      "Reviews the Bank of Canada FX source and can emit a downstream override without mutating the source.",
    id: "working-review-fx-rate",
    label: "FX Rate Review",
    position: { x: 260, y: 1080 },
  },
  {
    catalogId: "protected:protected-input",
    config: {
      fapiInputKey: "fxRate",
      inputs: "approved_value",
      outputs: "governed_value",
      resultName: "FX_RATE",
      runtimeLocked: true,
      toolId: "protected.protected_input",
      valueLabel: "FX Rate",
    },
    description: "Reviewed FX rate locked for the calculator.",
    id: "working-protected-fx-rate",
    label: "Protected FX Rate",
    position: { x: 660, y: 1080 },
  },
  {
    catalogId: "review:required-input-check",
    config: {
      blocking: true,
      inputs: "review_findings",
      outputs: "required_input_result, validation_result",
      requiredKeys: REQUIRED_INPUT_KEYS,
      toolId: "review.required_input_check",
    },
    description:
      "Blocking check that required workbook rows, rules, inputs, expected results, and reviewed FX are present.",
    id: "working-review-required-inputs",
    label: "Required Input Check",
    position: { x: 660, y: 1260 },
  },
  {
    catalogId: "logic:classification-mapping",
    config: {
      conflictStrategy: "highest_confidence",
      inputs: "data_rows, keyword_rules",
      lowConfidenceThreshold: 0.75,
      matchFields: ["account", "label", "description"],
      matchMode: "contains",
      outputs:
        "mapped_rows, unmatched_rows, low_confidence_rows, conflicts, mapping_summary",
      toolId: "logic.keyword_mapper",
      unmatchedStrategy: "send_to_review",
    },
    description:
      "Reusable Logic tool that maps uploaded source rows with connected rules.",
    id: "working-logic-keyword-mapper",
    label: "Keyword Mapper",
    position: { x: 260, y: 260 },
  },
  {
    catalogId: "logic:category-rollup-aggregator",
    config: {
      inputs: "mapped_rows, rollup_rules",
      operation: "sum",
      outputs:
        "category_totals, rollup_totals, named_values, included_rows_by_category, included_rows_by_rollup, excluded_rows, rollup_formula_trace, rollup_summary",
      toolId: "logic.category_rollup_aggregator",
    },
    description: "Groups mapped categories into category and rollup totals.",
    id: "working-logic-category-rollup",
    label: "Category Rollup Aggregator",
    position: { x: 660, y: 260 },
  },
  {
    catalogId: "logic:calculation-engine",
    config: {
      inputs: "named_values, protected_inputs",
      mode: "auto",
      outputs:
        "calculated_results, formula_trace, calculation_summary, named_values",
      toolId: "logic.calculation_engine",
      formulas: WORKING_SOURCE_DEMO_CALCULATION_RULES,
    },
    description:
      "Applies FAPI-style arithmetic, constants, min/max caps, and FX formulas using inline formula config.",
    id: "working-logic-calculation-engine",
    label: "Calculation Engine",
    position: { x: 1040, y: 260 },
  },
  {
    catalogId: "review:low-confidence-warning",
    config: {
      blocking: false,
      inputs: "checked_items",
      outputs: "validation_result, low_confidence_rows",
      threshold: 0.75,
      toolId: "review.confidence_check",
    },
    description:
      "Warns when mapped rows fall below the local confidence threshold.",
    id: "working-review-mapping-quality",
    label: "Mapping Quality Check",
    position: { x: 660, y: 620 },
  },
  {
    catalogId: "review:unmatched-rows-check",
    config: {
      blocking: true,
      inputs: "checked_items",
      outputs: "review_status, unmatched_rows",
      overrideUnmatchedRows: false,
      toolId: "review.unmatched_rows_check",
    },
    description: "Flags uploaded rows that did not match any mapping rule.",
    id: "working-review-unmatched-rows",
    label: "Unmatched Rows Check",
    position: { x: 660, y: 820 },
  },
  {
    catalogId: "review:formula-consistency-check",
    config: {
      inputs: "checked_items",
      outputs: "validation_result",
      tolerance: 0.01,
      toolId: "review.formula_consistency_check",
    },
    description:
      "Compares calculator output to the workbook Expected Results sheet.",
    id: "working-review-formula-consistency",
    label: "Formula Consistency Check",
    position: { x: 1040, y: 700 },
  },
  {
    catalogId: "review:approval-gate",
    config: {
      approved: true,
      approvedWithWarnings: false,
      inputs: "value_to_approve, validation_result, review_findings",
      notes: "Approved local FAPI-style workflow preparation run.",
      overrideUnmatchedRows: false,
      outputs: "approval_status",
      reviewer: "demo-reviewer",
      toolId: "review.approval_gate",
    },
    description: "Local mock approval gate for protected FAPI results.",
    id: "working-review-approval",
    label: "Approval Gate",
    position: { x: 1040, y: 500 },
  },
  ...PROTECTED_RESULT_SPECS,
  {
    catalogId: "review:output-readiness-check",
    config: {
      blocking: true,
      inputs: "protected_values, validation_result, review_findings",
      outputs: "output_readiness_result, validation_result",
      requiredProtectedResults: REQUIRED_PROTECTED_SUMMARY_RESULTS,
      toolId: "review.output_readiness_check",
    },
    description:
      "Blocking handoff check that required validations passed and protected summary results exist.",
    id: "working-review-output-readiness",
    label: "Output Readiness Check",
    position: { x: 1580, y: 80 },
  },
  {
    catalogId: "output:evidence-pack",
    config: {
      inputs:
        "protected_result, mapped_rows, unmatched_rows, low_confidence_rows, validation_result",
      outputs: "preview",
      toolId: "output.evidence_pack_preview",
    },
    description:
      "Human-readable local preview with workbook, rules, formulas, warnings, and protected results.",
    id: "working-output-evidence-preview",
    label: "Evidence Pack Preview",
    position: { x: 1740, y: 260 },
  },
  {
    catalogId: "output:canonical-json",
    config: {
      inputs:
        "protected_result, mapped_rows, unmatched_rows, low_confidence_rows, validation_result",
      outputs: "canonical_json",
      toolId: "output.canonical_json",
    },
    description:
      "Structured local JSON package for mapped rows, formula trace, warnings, and protected results.",
    id: "working-output-canonical-json",
    label: "Canonical JSON",
    position: { x: 1740, y: 540 },
  },
];

const PROTECTED_EDGES = PROTECTED_RESULT_NAMES.flatMap((resultName) => {
  const protectedId = `working-protected-${slug(resultName)}`;
  return [
    {
      bindingLabel: `${resultName} candidate value`,
      reason: `${resultName} is calculated by the Calculation Engine.`,
      relationshipType: "feeds_protected_result",
      sourceBlockId: "working-logic-calculation-engine",
      sourceOutputRole: "calculated_results",
      targetBlockId: protectedId,
      targetInputRole: "candidate_value",
    },
    {
      bindingLabel: `${resultName} approval`,
      reason: "Approval Gate determines whether the protected value can lock.",
      relationshipType: "approves_for",
      sourceBlockId: "working-review-approval",
      sourceOutputRole: "approval_status",
      targetBlockId: protectedId,
      targetInputRole: "approval_status",
    },
    {
      bindingLabel: `${resultName} required inputs`,
      reason:
        "Protected finality requires workbook rows, rules, assumptions, expected values, and reviewed FX.",
      relationshipType: "depends_on",
      sourceBlockId: "working-review-required-inputs",
      sourceOutputRole: "validation_result",
      targetBlockId: protectedId,
      targetInputRole: "validation_result",
    },
    {
      bindingLabel: `${resultName} formula consistency`,
      reason: "Protected finality requires formulas to match expected values.",
      relationshipType: "depends_on",
      sourceBlockId: "working-review-formula-consistency",
      sourceOutputRole: "validation_result",
      targetBlockId: protectedId,
      targetInputRole: "validation_result",
    },
    {
      bindingLabel: `${resultName} unmatched rows review`,
      reason:
        "Unmatched rows block clean finality unless a reviewer override is configured.",
      relationshipType: "depends_on",
      sourceBlockId: "working-review-unmatched-rows",
      sourceOutputRole: "review_status",
      targetBlockId: protectedId,
      targetInputRole: "validation_result",
    },
    {
      bindingLabel: `${resultName} evidence preview`,
      reason: "Evidence Pack includes protected FAPI values.",
      relationshipType: "maps_to_output",
      sourceBlockId: protectedId,
      sourceOutputRole: "protected_result",
      targetBlockId: "working-output-evidence-preview",
      targetInputRole: "protected_result",
    },
    {
      bindingLabel: `${resultName} canonical JSON`,
      reason: "Canonical JSON includes protected FAPI values.",
      relationshipType: "maps_to_output",
      sourceBlockId: protectedId,
      sourceOutputRole: "protected_result",
      targetBlockId: "working-output-canonical-json",
      targetInputRole: "protected_result",
    },
  ];
});

export const WORKING_SOURCE_DEMO_EDGE_SPECS = [
  {
    bindingLabel: "Trial Balance rows to classify",
    reason: "Keyword Mapper needs selected Trial Balance rows.",
    relationshipType: "provides_data_to",
    sourceBlockId: "working-source-uploaded-rows",
    sourceOutputRole: "selected_rows",
    targetBlockId: "working-logic-keyword-mapper",
    targetInputRole: "data_rows",
  },
  {
    bindingLabel: "Keyword rules for mapping",
    reason: "Keyword Mapper applies the connected Keyword Rulebook.",
    relationshipType: "referenced_by",
    sourceBlockId: "working-source-editable-rules",
    sourceOutputRole: "keyword_rules",
    targetBlockId: "working-logic-keyword-mapper",
    targetInputRole: "keyword_rules",
  },
  {
    bindingLabel: "Mapped categories to aggregate",
    reason: "Category Rollup Aggregator groups mapped atomic categories.",
    relationshipType: "aggregates_into",
    sourceBlockId: "working-logic-keyword-mapper",
    sourceOutputRole: "mapped_rows",
    targetBlockId: "working-logic-category-rollup",
    targetInputRole: "mapped_rows",
  },
  {
    bindingLabel: "Rollup rulebook",
    reason: "Category Rollup Aggregator applies grouping-only rollup rules.",
    relationshipType: "referenced_by",
    sourceBlockId: "working-source-rollup-rules",
    sourceOutputRole: "rollup_rules",
    targetBlockId: "working-logic-category-rollup",
    targetInputRole: "rollup_rules",
  },
  {
    bindingLabel: "Rollup named values",
    reason:
      "Calculation Engine consumes category and rollup totals as named values.",
    relationshipType: "provides_data_to",
    sourceBlockId: "working-logic-category-rollup",
    sourceOutputRole: "named_values",
    targetBlockId: "working-logic-calculation-engine",
    targetInputRole: "named_values",
  },
  {
    bindingLabel: "FAPI workbook inputs",
    reason:
      "Calculation Engine needs workbook assumptions such as inclusion rate, RTF, and FAT paid.",
    relationshipType: "provides_data_to",
    sourceBlockId: "working-source-fapi-inputs",
    sourceOutputRole: "fapi_inputs",
    targetBlockId: "working-logic-calculation-engine",
    targetInputRole: "protected_inputs",
  },
  {
    bindingLabel: "Bank of Canada FX source for review",
    reason: "FX Rate Review judges the source rate before it is protected.",
    relationshipType: "triggers_validation",
    sourceBlockId: "working-source-bank-of-canada-fx",
    sourceOutputRole: "exchange_rate",
    targetBlockId: "working-review-fx-rate",
    targetInputRole: "value_to_approve",
  },
  {
    bindingLabel: "Reviewed FX rate to protect",
    reason: "Protected FX Rate locks the reviewed rate for calculator use.",
    relationshipType: "approves_for",
    sourceBlockId: "working-review-fx-rate",
    sourceOutputRole: "reviewed_exchange_rate",
    targetBlockId: "working-protected-fx-rate",
    targetInputRole: "approved_value",
  },
  {
    bindingLabel: "Protected FX rate for calculator",
    reason:
      "Calculation Engine uses the reviewed protected FX rate, not a silently edited source value.",
    relationshipType: "provides_data_to",
    sourceBlockId: "working-protected-fx-rate",
    sourceOutputRole: "governed_value",
    targetBlockId: "working-logic-calculation-engine",
    targetInputRole: "protected_inputs",
  },
  {
    bindingLabel: "Trial Balance rows required",
    reason: "Required Input Check confirms uploaded workbook rows exist.",
    relationshipType: "triggers_validation",
    sourceBlockId: "working-source-uploaded-rows",
    sourceOutputRole: "selected_rows",
    targetBlockId: "working-review-required-inputs",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "Keyword rules required",
    reason: "Required Input Check confirms Keyword Rules Source exists.",
    relationshipType: "triggers_validation",
    sourceBlockId: "working-source-editable-rules",
    sourceOutputRole: "keyword_rules",
    targetBlockId: "working-review-required-inputs",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "Rollup rules required",
    reason: "Required Input Check confirms Rollup Rules Source exists.",
    relationshipType: "triggers_validation",
    sourceBlockId: "working-source-rollup-rules",
    sourceOutputRole: "rollup_rules",
    targetBlockId: "working-review-required-inputs",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "FAPI inputs required",
    reason:
      "Required Input Check confirms FAT paid, RTF, inclusion rate, and expected results.",
    relationshipType: "triggers_validation",
    sourceBlockId: "working-source-fapi-inputs",
    sourceOutputRole: "fapi_inputs",
    targetBlockId: "working-review-required-inputs",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "Reviewed FX required",
    reason: "Required Input Check confirms reviewed protected FX rate exists.",
    relationshipType: "triggers_validation",
    sourceBlockId: "working-protected-fx-rate",
    sourceOutputRole: "governed_value",
    targetBlockId: "working-review-required-inputs",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "Mapped rows to check confidence",
    reason: "Mapping Quality Check reviews mapping confidence.",
    relationshipType: "triggers_validation",
    sourceBlockId: "working-logic-keyword-mapper",
    sourceOutputRole: "mapped_rows",
    targetBlockId: "working-review-mapping-quality",
    targetInputRole: "checked_items",
  },
  {
    bindingLabel: "Unmatched rows to review",
    reason: "Unmatched Rows Check reviews rows with no rule match.",
    relationshipType: "triggers_validation",
    sourceBlockId: "working-logic-keyword-mapper",
    sourceOutputRole: "unmatched_rows",
    targetBlockId: "working-review-unmatched-rows",
    targetInputRole: "checked_items",
  },
  {
    bindingLabel: "Calculated results for comparison",
    reason: "Formula Consistency Check compares actual and expected results.",
    relationshipType: "triggers_validation",
    sourceBlockId: "working-logic-calculation-engine",
    sourceOutputRole: "calculated_results",
    targetBlockId: "working-review-formula-consistency",
    targetInputRole: "checked_items",
  },
  {
    bindingLabel: "Expected workbook results for comparison",
    reason: "Formula Consistency Check reads expected values from FAPI Inputs.",
    relationshipType: "triggers_validation",
    sourceBlockId: "working-source-fapi-inputs",
    sourceOutputRole: "fapi_inputs",
    targetBlockId: "working-review-formula-consistency",
    targetInputRole: "checked_items",
  },
  {
    bindingLabel: "Candidate FAPI values for approval",
    reason: "Approval Gate reviews calculated values.",
    relationshipType: "triggers_validation",
    sourceBlockId: "working-logic-calculation-engine",
    sourceOutputRole: "calculated_results",
    targetBlockId: "working-review-approval",
    targetInputRole: "value_to_approve",
  },
  {
    bindingLabel: "Formula consistency for approval",
    reason: "Approval Gate includes formula consistency context.",
    relationshipType: "depends_on",
    sourceBlockId: "working-review-formula-consistency",
    sourceOutputRole: "validation_result",
    targetBlockId: "working-review-approval",
    targetInputRole: "validation_result",
  },
  {
    bindingLabel: "Required inputs for approval",
    reason: "Approval Gate records required-input readiness context.",
    relationshipType: "depends_on",
    sourceBlockId: "working-review-required-inputs",
    sourceOutputRole: "validation_result",
    targetBlockId: "working-review-approval",
    targetInputRole: "validation_result",
  },
  {
    bindingLabel: "Unmatched row review for approval",
    reason: "Approval Gate records unresolved unmatched-row context.",
    relationshipType: "depends_on",
    sourceBlockId: "working-review-unmatched-rows",
    sourceOutputRole: "review_status",
    targetBlockId: "working-review-approval",
    targetInputRole: "review_findings",
  },
  ...PROTECTED_EDGES,
  ...PROTECTED_RESULT_NAMES.map((resultName) => ({
    bindingLabel: `${resultName} readiness input`,
    reason:
      "Output Readiness Check verifies required protected result availability.",
    relationshipType: "triggers_validation",
    sourceBlockId: `working-protected-${slug(resultName)}`,
    sourceOutputRole: "protected_result",
    targetBlockId: "working-review-output-readiness",
    targetInputRole: "protected_values",
  })),
  {
    bindingLabel: "Required input readiness",
    reason: "Output Readiness Check includes required input status.",
    relationshipType: "depends_on",
    sourceBlockId: "working-review-required-inputs",
    sourceOutputRole: "validation_result",
    targetBlockId: "working-review-output-readiness",
    targetInputRole: "validation_result",
  },
  {
    bindingLabel: "Formula consistency readiness",
    reason: "Output Readiness Check includes expected-result comparison.",
    relationshipType: "depends_on",
    sourceBlockId: "working-review-formula-consistency",
    sourceOutputRole: "validation_result",
    targetBlockId: "working-review-output-readiness",
    targetInputRole: "validation_result",
  },
  {
    bindingLabel: "Unmatched row readiness",
    reason:
      "Output Readiness Check treats unmatched rows as blocking unless overridden.",
    relationshipType: "depends_on",
    sourceBlockId: "working-review-unmatched-rows",
    sourceOutputRole: "review_status",
    targetBlockId: "working-review-output-readiness",
    targetInputRole: "validation_result",
  },
  {
    bindingLabel: "Mapping quality readiness",
    reason:
      "Output Readiness Check carries non-blocking low-confidence warnings.",
    relationshipType: "depends_on",
    sourceBlockId: "working-review-mapping-quality",
    sourceOutputRole: "validation_result",
    targetBlockId: "working-review-output-readiness",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "Protected FX rate evidence preview",
    reason: "Evidence Pack includes the reviewed protected FX rate.",
    relationshipType: "maps_to_output",
    sourceBlockId: "working-protected-fx-rate",
    sourceOutputRole: "governed_value",
    targetBlockId: "working-output-evidence-preview",
    targetInputRole: "protected_result",
  },
  {
    bindingLabel: "Protected FX rate canonical JSON",
    reason: "Canonical JSON includes the reviewed protected FX rate.",
    relationshipType: "maps_to_output",
    sourceBlockId: "working-protected-fx-rate",
    sourceOutputRole: "governed_value",
    targetBlockId: "working-output-canonical-json",
    targetInputRole: "protected_result",
  },
  {
    bindingLabel: "Mapped row evidence",
    reason: "Evidence Preview lists mapped rows and source trace.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "working-logic-keyword-mapper",
    sourceOutputRole: "mapped_rows",
    targetBlockId: "working-output-evidence-preview",
    targetInputRole: "mapped_rows",
  },
  {
    bindingLabel: "Rollup summary preview",
    reason: "Evidence Preview includes category and rollup totals.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "working-logic-category-rollup",
    sourceOutputRole: "rollup_summary",
    targetBlockId: "working-output-evidence-preview",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "Rollup trace preview",
    reason: "Evidence Preview includes rollup trace rows.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "working-logic-category-rollup",
    sourceOutputRole: "rollup_formula_trace",
    targetBlockId: "working-output-evidence-preview",
    targetInputRole: "source_trace",
  },
  {
    bindingLabel: "Calculation summary preview",
    reason: "Evidence Preview includes calculated result values.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "working-logic-calculation-engine",
    sourceOutputRole: "calculation_summary",
    targetBlockId: "working-output-evidence-preview",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "Formula trace preview",
    reason: "Evidence Preview includes readable calculation formula traces.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "working-logic-calculation-engine",
    sourceOutputRole: "formula_trace",
    targetBlockId: "working-output-evidence-preview",
    targetInputRole: "source_trace",
  },
  {
    bindingLabel: "Formula consistency warning context",
    reason: "Evidence Preview includes expected-result comparison.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "working-review-formula-consistency",
    sourceOutputRole: "validation_result",
    targetBlockId: "working-output-evidence-preview",
    targetInputRole: "validation_result",
  },
  {
    bindingLabel: "Output readiness preview context",
    reason: "Evidence Preview labels the package as final or review-ready.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "working-review-output-readiness",
    sourceOutputRole: "validation_result",
    targetBlockId: "working-output-evidence-preview",
    targetInputRole: "validation_result",
  },
  {
    bindingLabel: "Mapping warning context",
    reason: "Evidence Preview includes low-confidence rows.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "working-review-mapping-quality",
    sourceOutputRole: "low_confidence_rows",
    targetBlockId: "working-output-evidence-preview",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "Unmatched warning context",
    reason: "Evidence Preview includes unmatched rows.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "working-review-unmatched-rows",
    sourceOutputRole: "unmatched_rows",
    targetBlockId: "working-output-evidence-preview",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "Mapped row JSON",
    reason: "Canonical JSON includes mapped rows and summary.",
    relationshipType: "included_in_handoff",
    sourceBlockId: "working-logic-keyword-mapper",
    sourceOutputRole: "mapped_rows",
    targetBlockId: "working-output-canonical-json",
    targetInputRole: "mapped_rows",
  },
  {
    bindingLabel: "Rollup JSON",
    reason: "Canonical JSON includes category and rollup totals.",
    relationshipType: "included_in_handoff",
    sourceBlockId: "working-logic-category-rollup",
    sourceOutputRole: "rollup_summary",
    targetBlockId: "working-output-canonical-json",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "Rollup trace JSON",
    reason: "Canonical JSON includes rollup formula traces.",
    relationshipType: "included_in_handoff",
    sourceBlockId: "working-logic-category-rollup",
    sourceOutputRole: "rollup_formula_trace",
    targetBlockId: "working-output-canonical-json",
    targetInputRole: "source_trace",
  },
  {
    bindingLabel: "Calculation JSON",
    reason: "Canonical JSON includes calculated results.",
    relationshipType: "included_in_handoff",
    sourceBlockId: "working-logic-calculation-engine",
    sourceOutputRole: "calculation_summary",
    targetBlockId: "working-output-canonical-json",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "Formula trace JSON",
    reason: "Canonical JSON includes readable calculation formula traces.",
    relationshipType: "included_in_handoff",
    sourceBlockId: "working-logic-calculation-engine",
    sourceOutputRole: "formula_trace",
    targetBlockId: "working-output-canonical-json",
    targetInputRole: "source_trace",
  },
  {
    bindingLabel: "Formula consistency JSON",
    reason: "Canonical JSON includes expected-result comparison.",
    relationshipType: "included_in_handoff",
    sourceBlockId: "working-review-formula-consistency",
    sourceOutputRole: "validation_result",
    targetBlockId: "working-output-canonical-json",
    targetInputRole: "validation_result",
  },
  {
    bindingLabel: "Output readiness JSON",
    reason: "Canonical JSON labels the package as final or review-ready.",
    relationshipType: "included_in_handoff",
    sourceBlockId: "working-review-output-readiness",
    sourceOutputRole: "validation_result",
    targetBlockId: "working-output-canonical-json",
    targetInputRole: "validation_result",
  },
];
