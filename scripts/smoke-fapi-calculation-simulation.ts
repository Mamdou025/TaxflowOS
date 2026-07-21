import { SAMPLE_CALCULATION_RULES } from "../backend/blocks/source/calculation-rules/fixtures";
import { SAMPLE_ROLLUP_RULES } from "../backend/blocks/source/rollup-rules/fixtures";
import { executeTool } from "../backend/runtime/registry";
import type { WorkflowBlock } from "@/shared/workflow-engine/local-fiscal-workflow";
import { createWorkingSourceRulesDemoWorkflow } from "@/shared/workflow-engine/local-fiscal-workflow";
import { runLocalWorkflowTools } from "@/shared/workflow-engine/local-tool-runner";
import type { WorkflowEdge, WorkflowNode } from "@/shared/workflow-engine/state/workflow-store";

type TrialBalanceRow = {
  account: string;
  amount: number;
  currency: "USD";
  description: string;
  label: string;
  rowId: string;
  rowNumber: number;
};

type ValueComparison = {
  actual: number | null;
  delta: number | null;
  expected: number;
  name: string;
  status: "fail" | "pass";
};

const TOLERANCE = 0.01;

const DESCRIPTION_BY_LABEL: Record<string, string> = {
  "Accounting expenses": "Accounting service and audit support fees",
  "Bank interest revenue": "Interest earned from short-term deposits",
  "Business losses": "Business losses deductible amount",
  "Capital gains": "Capital gains from investment portfolio",
  "CFA income": "Current-year income from CFA",
  "Debt forgiveness": "Debt forgiveness amount for current year",
  "Dividend deductions": "Dividend deductions amount",
  "Dividend income": "Dividend income from portfolio",
  "FACL carryforward": "FACL carryforward available",
  "General expenses": "Operating expenses",
  "Interest income": "Interest earned on bank deposit",
  "Lease income": "Lease receipts from equipment rental",
  "Legal expenses": "Legal advisory and consulting fees",
  "Other FAPI income": "Miscellaneous FAPI revenue",
  "Partnership dividends": "Partnership dividends deduction amount",
  "Prescribed amount F": "Prescribed amount under F",
  "Prescribed amount F1": "Prescribed amount under F.1",
  "Prior year G": "Prior year G amount included as A2",
  "Rental income": "Rent received from warehouse lease",
  "Royalty income": "Royalty received from licensing agreement",
  "Unknown adjustment": "Manual year-end adjustment not in rules",
};

const TRIAL_BALANCE_ROWS: TrialBalanceRow[] = [
  trialBalanceRow({
    account: "4000",
    amount: 1000,
    label: "Interest income",
    rowId: "trial-balance-row-002",
    rowNumber: 2,
  }),
  trialBalanceRow({
    account: "4010",
    amount: 450,
    label: "Bank interest revenue",
    rowId: "trial-balance-row-003",
    rowNumber: 3,
  }),
  trialBalanceRow({
    account: "4100",
    amount: 2000,
    label: "Rental income",
    rowId: "trial-balance-row-004",
    rowNumber: 4,
  }),
  trialBalanceRow({
    account: "4110",
    amount: 750,
    label: "Lease income",
    rowId: "trial-balance-row-005",
    rowNumber: 5,
  }),
  trialBalanceRow({
    account: "4200",
    amount: 600,
    label: "Royalty income",
    rowId: "trial-balance-row-006",
    rowNumber: 6,
  }),
  trialBalanceRow({
    account: "4300",
    amount: 400,
    label: "Dividend income",
    rowId: "trial-balance-row-007",
    rowNumber: 7,
  }),
  trialBalanceRow({
    account: "6000",
    amount: 300,
    label: "Other FAPI income",
    rowId: "trial-balance-row-008",
    rowNumber: 8,
  }),
  trialBalanceRow({
    account: "5000",
    amount: -120,
    label: "General expenses",
    rowId: "trial-balance-row-009",
    rowNumber: 9,
  }),
  trialBalanceRow({
    account: "5100",
    amount: -250,
    label: "Legal expenses",
    rowId: "trial-balance-row-010",
    rowNumber: 10,
  }),
  trialBalanceRow({
    account: "5110",
    amount: -180,
    label: "Accounting expenses",
    rowId: "trial-balance-row-011",
    rowNumber: 11,
  }),
  trialBalanceRow({
    account: "7000",
    amount: 800,
    label: "Capital gains",
    rowId: "trial-balance-row-012",
    rowNumber: 12,
  }),
  trialBalanceRow({
    account: "7100",
    amount: 50,
    label: "Debt forgiveness",
    rowId: "trial-balance-row-013",
    rowNumber: 13,
  }),
  trialBalanceRow({
    account: "7200",
    amount: 75,
    label: "Prior year G",
    rowId: "trial-balance-row-014",
    rowNumber: 14,
  }),
  trialBalanceRow({
    account: "7300",
    amount: 125,
    label: "CFA income",
    rowId: "trial-balance-row-015",
    rowNumber: 15,
  }),
  trialBalanceRow({
    account: "8000",
    amount: 200,
    label: "Business losses",
    rowId: "trial-balance-row-016",
    rowNumber: 16,
  }),
  trialBalanceRow({
    account: "8100",
    amount: 90,
    label: "FACL carryforward",
    rowId: "trial-balance-row-017",
    rowNumber: 17,
  }),
  trialBalanceRow({
    account: "8200",
    amount: 40,
    label: "Prescribed amount F",
    rowId: "trial-balance-row-018",
    rowNumber: 18,
  }),
  trialBalanceRow({
    account: "8210",
    amount: 10,
    label: "Prescribed amount F1",
    rowId: "trial-balance-row-019",
    rowNumber: 19,
  }),
  trialBalanceRow({
    account: "8300",
    amount: 35,
    label: "Dividend deductions",
    rowId: "trial-balance-row-020",
    rowNumber: 20,
  }),
  trialBalanceRow({
    account: "8400",
    amount: 25,
    label: "Partnership dividends",
    rowId: "trial-balance-row-021",
    rowNumber: 21,
  }),
  trialBalanceRow({
    account: "9000",
    amount: 33,
    label: "Unknown adjustment",
    rowId: "trial-balance-row-022",
    rowNumber: 22,
  }),
];

const EXPECTED_OFFICIAL_VALUES: Record<string, number> = {
  A: 4950,
  A1: 100,
  A2: 75,
  B: 400,
  C: 125,
  D: 200,
  E: 90,
  F: 40,
  F1: 10,
  FAT_PAID: 100,
  FX_RATE: 1.35,
  G: 35,
  H: 25,
  RTF: 1.9,
};

const EXPECTED_SUMMARY_VALUES: Record<string, number> = {
  DEDUCTIONS: 400,
  FAPI_BRUT: 5250,
  FAT_DEDUCTION: 190,
  GROSS: 5650,
  NET_FAPI: 5060,
  NET_FAPI_CAD: 6831,
};

const EXPECTED_SPLIT_ROLLUP_VALUES: Record<string, number> = {
  expense_bucket: 550,
  income_bucket: 5500,
};

const CATEGORY_BY_LABEL: Record<string, string> = {
  "Accounting expenses": "accountingExpenses",
  "Bank interest revenue": "interestIncome",
  "Business losses": "businessLosses",
  "Capital gains": "capGains",
  "CFA income": "cfaIncome",
  "Debt forgiveness": "debtForgiveness",
  "Dividend deductions": "dividendDeductions",
  "Dividend income": "dividends",
  "FACL carryforward": "faclCarryforward",
  "General expenses": "generalExpenses",
  "Interest income": "interestIncome",
  "Lease income": "rents",
  "Legal expenses": "legalExpenses",
  "Other FAPI income": "otherFapiIncome",
  "Partnership dividends": "partnershipDividends",
  "Prescribed amount F": "prescribedAmount",
  "Prescribed amount F1": "prescribedAmountF1",
  "Prior year G": "priorYearG",
  "Rental income": "rents",
  "Royalty income": "royalties",
};

const CATEGORY_LABEL_BY_ID: Record<string, string> = {
  accountingExpenses: "Accounting Expenses",
  businessLosses: "Business Losses",
  capGains: "Capital Gains",
  cfaIncome: "CFA Income",
  debtForgiveness: "Debt Forgiveness",
  dividendDeductions: "Dividend Deductions",
  dividends: "Dividends",
  faclCarryforward: "FACL Carryforward",
  generalExpenses: "General Expenses",
  interestIncome: "Interest Income",
  legalExpenses: "Legal Expenses",
  otherFapiIncome: "Other FAPI Income",
  partnershipDividends: "Partnership Dividends",
  prescribedAmount: "Prescribed Amount F",
  prescribedAmountF1: "Prescribed Amount F1",
  priorYearG: "Prior Year G",
  rents: "Rents",
  royalties: "Royalties",
};

function trialBalanceRow({
  account,
  amount,
  label,
  rowId,
  rowNumber,
}: {
  account: string;
  amount: number;
  label: string;
  rowId: string;
  rowNumber: number;
}): TrialBalanceRow {
  return {
    account,
    amount,
    currency: "USD",
    description: DESCRIPTION_BY_LABEL[label] || label,
    label,
    rowId,
    rowNumber,
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asNumberRecord(value: unknown): Record<string, number> {
  return Object.fromEntries(
    Object.entries(asRecord(value))
      .map(([key, item]) => [key, asNumber(item)])
      .filter((entry): entry is [string, number] => entry[1] !== null)
  );
}

function compareValue({
  actual,
  expected,
  name,
}: {
  actual: number | null;
  expected: number;
  name: string;
}): ValueComparison {
  const delta = actual === null ? null : Number((actual - expected).toFixed(6));
  return {
    actual,
    delta,
    expected,
    name,
    status:
      actual !== null && Math.abs(actual - expected) <= TOLERANCE
        ? "pass"
        : "fail",
  };
}

function injectWorkbookRows(
  workflow: ReturnType<typeof createWorkingSourceRulesDemoWorkflow>
) {
  const sourceBlock = workflow.blocks.find(
    (block) => block.id === "working-source-uploaded-rows"
  );
  if (!sourceBlock) {
    throw new Error("Working demo workbook source block was not found.");
  }

  sourceBlock.config = {
    ...sourceBlock.config,
    fileName: "workflow_studio_fapi_sample_source.xlsx",
    fileSize: 32_768,
    requireUpload: true,
    rows: TRIAL_BALANCE_ROWS,
    selectedRange: "A1:F22",
    selectedRowsCount: TRIAL_BALANCE_ROWS.length,
    selectedSheet: "Trial Balance",
    sheets: [
      "Trial Balance",
      "Keyword Rules",
      "Rollup Rules",
      "Calculation Rules",
      "FAPI Inputs",
      "Expected Results",
    ],
    sourceLocator:
      "local-excel://simulation/workflow_studio_fapi_sample_source.xlsx/Trial%20Balance/A1%3AF22",
    uploadTimestamp: "2026-05-05T00:00:00.000Z",
    workbookFile: {
      fileName: "workflow_studio_fapi_sample_source.xlsx",
      fileSize: 32_768,
      uploadedAt: "2026-05-05T00:00:00.000Z",
      workbookId: "workflow-studio-fapi-simulation",
    },
    workbookId: "workflow-studio-fapi-simulation",
    workbookName: "workflow_studio_fapi_sample_source.xlsx",
  };

  return workflow;
}

function toCanvasNodes(
  workflow: ReturnType<typeof createWorkingSourceRulesDemoWorkflow>
): WorkflowNode[] {
  return workflow.blocks.map((block) => ({
    data: {
      block,
      config: block.config,
      description: block.description,
      label: block.label,
      type: block.source ? "trigger" : "action",
    },
    id: block.id,
    position: block.position,
    type: block.source ? "trigger" : "action",
  }));
}

function toCanvasEdges(
  workflow: ReturnType<typeof createWorkingSourceRulesDemoWorkflow>
): WorkflowEdge[] {
  return workflow.edges.map((edge) => ({
    data: {
      bindingLabel: edge.bindingLabel,
      bindingStatus: edge.bindingStatus,
      relationshipType: edge.relationshipType,
      sourceOutputRole: edge.sourceOutputRole,
      targetInputRole: edge.targetInputRole,
      workflowEdge: edge,
    },
    id: edge.id,
    source: edge.sourceBlockId,
    target: edge.targetBlockId,
  }));
}

function getBlockOutput(
  result: ReturnType<typeof runLocalWorkflowTools>,
  blockId: string
) {
  return (
    result.result.results.find((item) => item.blockId === blockId)?.output || {}
  );
}

function getStatus(
  result: ReturnType<typeof runLocalWorkflowTools>,
  blockId: string
) {
  return result.result.results.find((item) => item.blockId === blockId)?.status;
}

function summarizeMappedRow(value: unknown) {
  const mappedRecord = asRecord(value);
  return {
    amount: mappedRecord.amount,
    categoryId: mappedRecord.categoryId,
    categoryLabel: mappedRecord.categoryLabel,
    confidence: mappedRecord.confidence,
    label: mappedRecord.label,
    matchedKeyword: mappedRecord.matchedKeyword,
    matchedRuleId: mappedRecord.matchedRuleId || mappedRecord.ruleId,
    rowId: mappedRecord.rowId,
  };
}

function summarizeUnmatchedRow(value: unknown) {
  const unmatchedRecord = asRecord(value);
  return {
    amount: unmatchedRecord.amount,
    label: unmatchedRecord.label,
    rowId: unmatchedRecord.rowId,
    status: unmatchedRecord.status,
  };
}

function makeBackendBlock({
  family,
  id,
  label,
  subtype,
  toolId,
}: {
  family: WorkflowBlock["family"];
  id: string;
  label: string;
  subtype: WorkflowBlock["subtype"];
  toolId: string;
}): WorkflowBlock {
  const now = "2026-05-05T00:00:00.000Z";
  return {
    config: { toolId },
    createdAt: now,
    createdBy: "smoke",
    description: label,
    family,
    id,
    label,
    position: { x: 0, y: 0 },
    runtime: {
      editableInRuntime: false,
      generatedUiLocked: true,
      masked: false,
      showInRuns: true,
      visible: true,
    },
    status: "configured",
    subtype,
    updatedAt: now,
    updatedBy: "smoke",
  };
}

function getSplitMappedRows() {
  return TRIAL_BALANCE_ROWS.flatMap((row) => {
    const categoryId = CATEGORY_BY_LABEL[row.label];
    if (!categoryId) {
      return [];
    }
    return [
      {
        ...row,
        categoryId,
        categoryLabel: CATEGORY_LABEL_BY_ID[categoryId] || categoryId,
        confidence: 0.9,
        matchedKeyword: row.label.toLowerCase(),
        matchedRuleId: `rule-${categoryId}`,
        ruleId: `rule-${categoryId}`,
        status: "mapped",
      },
    ];
  });
}

function runSplitPathSimulation() {
  const startedAt = "2026-05-05T00:00:00.000Z";
  const mappedRows = getSplitMappedRows();
  const rollupResult = executeTool("logic.category_rollup_aggregator", {
    block: makeBackendBlock({
      family: "Logic",
      id: "smoke-category-rollup",
      label: "Category Rollup Aggregator",
      subtype: "Category Rollup Aggregator",
      toolId: "logic.category_rollup_aggregator",
    }),
    config: {},
    inputsByRole: {
      mapped_rows: [{ mappedRows }],
      rollup_rules: [{ rollupRules: SAMPLE_ROLLUP_RULES }],
    },
    runId: "smoke-split-rollup",
    startedAt,
  });
  const calculationResult = executeTool("logic.calculation_engine", {
    block: makeBackendBlock({
      family: "Logic",
      id: "smoke-calculation-engine",
      label: "Calculation Engine",
      subtype: "Calculation Engine",
      toolId: "logic.calculation_engine",
    }),
    config: {},
    inputsByRole: {
      calculation_rules: [{ calculationRules: SAMPLE_CALCULATION_RULES }],
      fapi_inputs: [
        {
          fapiInputs: {
            fatPaid: 100,
            inclusionRate: 0.5,
            rtf: 1.9,
          },
        },
      ],
      named_values: [rollupResult.outputs.named_values],
      protected_inputs: [{ FX_RATE: 1.35 }],
    },
    runId: "smoke-split-calculation",
    startedAt,
  });
  const expressionResult = executeTool("logic.calculation_engine", {
    block: makeBackendBlock({
      family: "Logic",
      id: "smoke-expression-calculation",
      label: "Calculation Engine",
      subtype: "Calculation Engine",
      toolId: "logic.calculation_engine",
    }),
    config: {},
    inputsByRole: {
      calculation_rules: [
        {
          calculationRules: [
            {
              calculationId: "MIXED_FORMULA",
              formulaExpression: "income_bucket + expense_bucket * 2 - 100 / 4",
              label: "Mixed Formula",
              operands: [],
              operation: "add",
              resultKey: "MIXED_FORMULA",
            },
          ],
        },
      ],
      named_values: [rollupResult.outputs.named_values],
    },
    runId: "smoke-expression-calculation",
    startedAt,
  });
  const categoryTotals = asNumberRecord(
    asRecord(rollupResult.outputs.category_totals).categoryTotals
  );
  const rollupTotals = asNumberRecord(
    asRecord(rollupResult.outputs.rollup_totals).rollupTotals
  );
  const calculatedResults = asNumberRecord(
    asRecord(calculationResult.outputs.calculated_results).calculatedResults
  );
  const expressionResults = asNumberRecord(
    asRecord(expressionResult.outputs.calculated_results).calculatedResults
  );

  return {
    calculatedResults,
    calculationStatus: calculationResult.status,
    categoryTotals,
    expressionResults,
    expressionStatus: expressionResult.status,
    mappedRowsCount: mappedRows.length,
    rollupStatus: rollupResult.status,
    rollupTotals,
  };
}

function runSimulation() {
  const workflow = injectWorkbookRows(createWorkingSourceRulesDemoWorkflow());
  const edges = toCanvasEdges(workflow);
  const nodes = toCanvasNodes(workflow);
  const runResult = runLocalWorkflowTools({
    edges,
    mode: "workflow",
    nodes,
    workflowName: workflow.name,
  });
  const selectedCalculationRunResult = runLocalWorkflowTools({
    edges,
    mode: "selected",
    nodes,
    selectedBlockId: "working-logic-calculation-engine",
    workflowName: workflow.name,
  });
  const splitPathResult = runSplitPathSimulation();

  return { runResult, selectedCalculationRunResult, splitPathResult };
}

function collectSmokeFailures({
  canonicalJsonOutput,
  evidenceOutput,
  formulaCheckOutput,
  lockedProtectedResults,
  mappingQualityResult,
  mismatches,
  outputReadinessResult,
  protectedResults,
  requiredInputResult,
  runResult,
  selectedCalculationResults,
  selectedMapperOutput,
  unmatchedRowsResult,
}: {
  canonicalJsonOutput: Record<string, unknown>;
  evidenceOutput: Record<string, unknown>;
  formulaCheckOutput: Record<string, unknown>;
  lockedProtectedResults: Record<string, unknown>[];
  mappingQualityResult: Record<string, unknown>;
  mismatches: ValueComparison[];
  outputReadinessResult: Record<string, unknown>;
  protectedResults: Record<string, unknown>[];
  requiredInputResult: Record<string, unknown>;
  runResult: ReturnType<typeof runLocalWorkflowTools>;
  selectedCalculationResults: Record<string, number>;
  selectedMapperOutput: Record<string, unknown>;
  unmatchedRowsResult: Record<string, unknown>;
}) {
  const failures = mismatches.map(
    (item) =>
      `${item.name} expected ${item.expected} but got ${item.actual ?? "missing"}.`
  );

  if (requiredInputResult.pass !== true) {
    failures.push("Required Input Check did not pass.");
  }
  if (asRecord(formulaCheckOutput.validationResult).pass !== true) {
    failures.push("Formula Consistency Check did not pass.");
  }
  if (
    getStatus(runResult, "working-review-mapping-quality") !== "warning" ||
    mappingQualityResult.blocking !== false
  ) {
    failures.push(
      "Mapping Quality Check did not emit the expected non-blocking warning."
    );
  }
  if (
    getStatus(runResult, "working-review-unmatched-rows") !== "needs_review" ||
    unmatchedRowsResult.blocking !== true ||
    unmatchedRowsResult.pass !== false
  ) {
    failures.push("Unmatched Rows Check did not block finality as expected.");
  }
  if (
    outputReadinessResult.finalityStatus !== "review_ready" ||
    outputReadinessResult.pass !== false
  ) {
    failures.push(
      "Output Readiness Check did not mark the package review-ready."
    );
  }
  if (lockedProtectedResults.length > 0) {
    failures.push(
      "Protected results locked despite unresolved blocking review findings."
    );
  }
  if (
    !protectedResults.every(
      (item) =>
        item.finalityStatus === "review_ready" || item.status === "review_ready"
    )
  ) {
    failures.push("Protected results were not all marked review-ready.");
  }
  if (
    evidenceOutput.finalityStatus !== "review_ready" ||
    canonicalJsonOutput.finalityStatus !== "review_ready"
  ) {
    failures.push("Output packages did not expose review-ready finality.");
  }
  if (runResult.result.status !== "needs_review") {
    failures.push(
      "Workflow run should be needs_review while unmatched rows are unresolved."
    );
  }
  if (
    asArray(selectedMapperOutput.mappedRows).length === 0 ||
    selectedCalculationResults.NET_FAPI_CAD !==
      EXPECTED_SUMMARY_VALUES.NET_FAPI_CAD
  ) {
    failures.push(
      "Selected Calculation Engine run did not execute upstream dependencies."
    );
  }

  return failures;
}

function buildSmokeReport({
  runResult,
  selectedCalculationRunResult,
  splitPathResult,
}: ReturnType<typeof runSimulation>) {
  const mapperOutput = getBlockOutput(
    runResult,
    "working-logic-keyword-mapper"
  );
  const rollupOutput = getBlockOutput(
    runResult,
    "working-logic-category-rollup"
  );
  const calculationOutput = getBlockOutput(
    runResult,
    "working-logic-calculation-engine"
  );
  const formulaCheckOutput = getBlockOutput(
    runResult,
    "working-review-formula-consistency"
  );
  const requiredInputOutput = getBlockOutput(
    runResult,
    "working-review-required-inputs"
  );
  const mappingQualityOutput = getBlockOutput(
    runResult,
    "working-review-mapping-quality"
  );
  const unmatchedRowsOutput = getBlockOutput(
    runResult,
    "working-review-unmatched-rows"
  );
  const outputReadinessOutput = getBlockOutput(
    runResult,
    "working-review-output-readiness"
  );
  const evidenceOutput = getBlockOutput(
    runResult,
    "working-output-evidence-preview"
  );
  const canonicalJsonOutput = getBlockOutput(
    runResult,
    "working-output-canonical-json"
  );

  const officialLineValues = asNumberRecord(
    calculationOutput.calculatedResults
  );
  const finalTotals = asNumberRecord(calculationOutput.calculatedResults);
  const officialComparisons = Object.entries(EXPECTED_OFFICIAL_VALUES).map(
    ([name, expected]) =>
      compareValue({ actual: officialLineValues[name] ?? null, expected, name })
  );
  const summaryComparisons = Object.entries(EXPECTED_SUMMARY_VALUES).map(
    ([name, expected]) =>
      compareValue({
        actual: finalTotals[name] ?? null,
        expected,
        name,
      })
  );
  const comparisons = [...officialComparisons, ...summaryComparisons];
  const mismatches = comparisons.filter((item) => item.status === "fail");
  const mappedRows = asArray(mapperOutput.mappedRows);
  const unmatchedRows = asArray(mapperOutput.unmatchedRows);
  const lowConfidenceRows = asArray(mapperOutput.lowConfidenceRows);
  const conflicts = asArray(mapperOutput.conflicts);
  const protectedResults = runResult.result.results
    .filter((item) => item.toolId === "protected.protected_result")
    .map((item) => asRecord(item.output.protectedResult))
    .filter((item) => Object.keys(item).length > 0);
  const protectedFxOutput = getBlockOutput(
    runResult,
    "working-protected-fx-rate"
  );
  const protectedFxValue = asNumber(protectedFxOutput.governedValue);
  const selectedCalculationOutput = getBlockOutput(
    selectedCalculationRunResult,
    "working-logic-calculation-engine"
  );
  const selectedMapperOutput = getBlockOutput(
    selectedCalculationRunResult,
    "working-logic-keyword-mapper"
  );
  const selectedCalculationResults = asNumberRecord(
    selectedCalculationOutput.calculatedResults
  );
  const lockedProtectedResults = protectedResults.filter(
    (item) => item.runtimeLocked === true
  );
  const unlockedProtectedResults = protectedResults.filter(
    (item) => item.runtimeLocked !== true
  );
  const requiredInputResult = asRecord(requiredInputOutput.validationResult);
  const mappingQualityResult = asRecord(mappingQualityOutput.validationResult);
  const unmatchedRowsResult = asRecord(unmatchedRowsOutput.validationResult);
  const outputReadinessResult = asRecord(
    outputReadinessOutput.validationResult
  );
  const smokeFailures = collectSmokeFailures({
    canonicalJsonOutput,
    evidenceOutput,
    formulaCheckOutput,
    lockedProtectedResults,
    mappingQualityResult,
    mismatches,
    outputReadinessResult,
    protectedResults,
    requiredInputResult,
    runResult,
    selectedCalculationResults,
    selectedMapperOutput,
    unmatchedRowsResult,
  });
  const splitRollupComparisons = Object.entries(
    EXPECTED_SPLIT_ROLLUP_VALUES
  ).map(([name, expected]) =>
    compareValue({
      actual: splitPathResult.rollupTotals[name] ?? null,
      expected,
      name: `split.${name}`,
    })
  );
  const splitCalculationComparisons = Object.entries(
    EXPECTED_SUMMARY_VALUES
  ).map(([name, expected]) =>
    compareValue({
      actual: splitPathResult.calculatedResults[name] ?? null,
      expected,
      name: `split.${name}`,
    })
  );
  const splitMismatches = [
    ...splitRollupComparisons,
    ...splitCalculationComparisons,
  ].filter((item) => item.status === "fail");
  smokeFailures.push(
    ...splitMismatches.map(
      (item) =>
        `${item.name} expected ${item.expected} but got ${item.actual ?? "missing"}.`
    )
  );
  if (splitPathResult.rollupStatus !== "success") {
    smokeFailures.push("Split Category Rollup Aggregator did not pass.");
  }
  if (splitPathResult.calculationStatus !== "success") {
    smokeFailures.push("Split Calculation Engine did not pass.");
  }
  if (
    splitPathResult.expressionStatus !== "success" ||
    splitPathResult.expressionResults.MIXED_FORMULA !== 6575
  ) {
    smokeFailures.push(
      "Calculation Engine formula expression smoke did not evaluate the mixed arithmetic expression."
    );
  }

  return {
    auditStatus: smokeFailures.length === 0 ? "PASS" : "FAIL",
    calculationComparisons: comparisons,
    canonicalJsonGenerated: Boolean(canonicalJsonOutput.canonicalJson),
    categoryTotals: rollupOutput.categoryTotals,
    evidencePreviewGenerated: Boolean(evidenceOutput.preview),
    finalTotals,
    formulaCheck: {
      output: formulaCheckOutput.validationResult,
      status: getStatus(runResult, "working-review-formula-consistency"),
    },
    formulaTrace: calculationOutput.formulaTrace,
    rollupFormulaTrace: rollupOutput.rollupFormulaTrace,
    mapping: {
      conflictsCount: conflicts.length,
      categoriesFound: [
        ...new Set(
          mappedRows
            .map((item) => String(asRecord(item).categoryId || ""))
            .filter(Boolean)
        ),
      ].sort(),
      exampleMappedRows: mappedRows.slice(0, 6).map(summarizeMappedRow),
      lowConfidenceExamples: lowConfidenceRows.map(summarizeMappedRow),
      lowConfidenceRowsCount: lowConfidenceRows.length,
      mappedRowsCount: mappedRows.length,
      sourceRowsCount: TRIAL_BALANCE_ROWS.length,
      unmatchedExamples: unmatchedRows.map(summarizeUnmatchedRow),
      unmatchedRowsCount: unmatchedRows.length,
    },
    mismatches,
    officialLineValues,
    outputWarnings: asArray(evidenceOutput.warnings),
    protected: {
      lockedCount: lockedProtectedResults.length,
      protectedFxRate: protectedFxValue,
      protectedResultCount: protectedResults.length,
      results: protectedResults.map((item) => ({
        finalityStatus: item.finalityStatus,
        name: item.name,
        runtimeLocked: item.runtimeLocked,
        status: item.status,
        value: item.value,
      })),
      unlockedCount: unlockedProtectedResults.length,
    },
    run: {
      errors: runResult.result.errors,
      selectedCalculationRunStatus: selectedCalculationRunResult.result.status,
      status: runResult.result.status,
      warnings: runResult.result.warnings,
    },
    smokeFailures,
    splitPath: {
      calculatedResults: splitPathResult.calculatedResults,
      calculationComparisons: splitCalculationComparisons,
      calculationStatus: splitPathResult.calculationStatus,
      categoryTotals: splitPathResult.categoryTotals,
      expressionResults: splitPathResult.expressionResults,
      expressionStatus: splitPathResult.expressionStatus,
      mappedRowsCount: splitPathResult.mappedRowsCount,
      rollupComparisons: splitRollupComparisons,
      rollupStatus: splitPathResult.rollupStatus,
      rollupTotals: splitPathResult.rollupTotals,
    },
    sourceData: {
      fileName: "workflow_studio_fapi_sample_source.xlsx",
      importedFromRepoWorkbook: false,
      note: "Workbook file was not present in the repo; simulation injected equivalent Trial Balance rows into the existing Excel Source block.",
      sheetNames: [
        "Trial Balance",
        "Keyword Rules",
        "Rollup Rules",
        "Calculation Rules",
        "FAPI Inputs",
        "Expected Results",
      ],
    },
    validation: {
      evidenceFinalityStatus: evidenceOutput.finalityStatus,
      formulaConsistency: formulaCheckOutput.validationResult,
      mappingQuality: mappingQualityOutput.validationResult,
      outputReadiness: outputReadinessOutput.validationResult,
      outputReadinessStatus: getStatus(
        runResult,
        "working-review-output-readiness"
      ),
      requiredInput: requiredInputOutput.validationResult,
      requiredInputStatus: getStatus(
        runResult,
        "working-review-required-inputs"
      ),
      canonicalFinalityStatus: canonicalJsonOutput.finalityStatus,
      unmatchedRows: unmatchedRowsOutput.validationResult,
    },
  };
}

function main() {
  const smoke = buildSmokeReport(runSimulation());

  console.log(JSON.stringify(smoke, null, 2));

  if (asArray(smoke.smokeFailures).length > 0) {
    process.exitCode = 1;
  }
}

main();
