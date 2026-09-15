import {
  buildSingleItemPipelineTrace,
  Z_SOURCE_TRACE,
  EXPANDED_MAPPING_PIPELINE_NAME,
  WORKING_SOURCE_RULES_DEMO_NAME,
  EXPANDED_MAPPING_TRACE_COMMON,
  WORKING_SOURCE_RULES_TRACE_COMMON,
  isDualResultMappingWorkflow,
  getDualResultTraceCommon,
  getDualResultPipelineTrace,
} from './sample-traces';
export {
  buildSingleItemPipelineTrace,
  Z_SOURCE_TRACE,
  EXPANDED_MAPPING_PIPELINE_NAME,
  WORKING_SOURCE_RULES_DEMO_NAME,
  EXPANDED_MAPPING_TRACE_COMMON,
  WORKING_SOURCE_RULES_TRACE_COMMON,
  isDualResultMappingWorkflow,
  getDualResultTraceCommon,
  getDualResultPipelineTrace,
} from './sample-traces';
import { asRecord, parseNumber } from './primitives';
import { type ToolExecutionContext, type FiscalRow, type ToolRunResult } from './types';
import {
  getPipelineTrace,
  findProtectedResultByName,
  dedupeStrings,
  formatSourceTraceRef,
} from './finality';
import { collectRows, fiscalRowFromOutputRecord, collectSourceTrace } from './rows';

function firstPresent<T>(...values: T[]) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function getZOutputDetails({
  approvalStatus,
  mappedRows,
  protectedResult,
  ruleUsed,
  validationResult,
}: {
  approvalStatus?: Record<string, unknown>;
  mappedRows: unknown[];
  protectedResult: Record<string, unknown>;
  ruleUsed?: Record<string, unknown>;
  validationResult?: Record<string, unknown>;
}) {
  const mappedRow = asRecord(mappedRows[0]) || {};
  const sourceRow = asRecord(mappedRow.sourceRow) || mappedRow;
  const final = protectedResult.final !== false;

  return {
    account: firstPresent(sourceRow.account, '4000'),
    amount: firstPresent(sourceRow.amount, protectedResult.value, 100),
    approved: firstPresent(approvalStatus?.approved, true),
    confidence: firstPresent(mappedRow.confidence, 0.95),
    currency: firstPresent(protectedResult.currency, sourceRow.currency, 'USD'),
    final,
    label: firstPresent(sourceRow.label, 'Interest income'),
    matchedKeyword: firstPresent(mappedRow.matchedKeyword, 'interest income'),
    reviewer: firstPresent(approvalStatus?.reviewer, protectedResult.approvedBy),
    rowId: firstPresent(sourceRow.rowId, 'row-001'),
    ruleId: firstPresent(ruleUsed?.ruleId, mappedRow.ruleId, 'rule-001'),
    sectionId: firstPresent(mappedRow.sectionId, ruleUsed?.sectionId, 'income'),
    status: firstPresent(protectedResult.status, final ? 'locked' : 'needs_review'),
    subsectionId: firstPresent(mappedRow.subsectionId, ruleUsed?.subsectionId, 'interest'),
    target: firstPresent(mappedRow.target, ruleUsed?.target, 'income_interest'),
    threshold: firstPresent(validationResult?.threshold, 0.75),
    validationStatus: firstPresent(validationResult?.status, 'pass'),
    value: firstPresent(protectedResult.value, 100),
  };
}

export function buildZEvidencePreview({
  approvalStatus,
  mappedRows,
  protectedResult,
  ruleUsed,
  validationResult,
}: {
  approvalStatus?: Record<string, unknown>;
  mappedRows: unknown[];
  protectedResult: Record<string, unknown>;
  ruleUsed?: Record<string, unknown>;
  validationResult?: Record<string, unknown>;
}) {
  const details = getZOutputDetails({
    approvalStatus,
    mappedRows,
    protectedResult,
    ruleUsed,
    validationResult,
  });
  const status = details.final ? 'Final / locked' : 'Draft / needs review';
  const approvalLine = details.reviewer
    ? `approved the result (${details.reviewer}).`
    : 'approved the result.';

  return [
    'Z Evidence Preview',
    '',
    'Final result:',
    `Z = ${details.value} ${details.currency}`,
    `Status: ${status}`,
    '',
    'Input item:',
    `${details.rowId} | ${details.account} | ${details.label} | ${details.amount} ${details.currency}`,
    '',
    'Rule used:',
    `${details.ruleId} | ${details.matchedKeyword} -> ${details.target} / ${details.sectionId} / ${details.subsectionId}`,
    '',
    'Transformations:',
    '1. Keyword Mapper classified row-001 as income_interest.',
    '2. Section Aggregator included row-001 in income / interest.',
    '3. Section Aggregator calculated subtotal = 100.',
    `4. Confidence Check passed because confidence ${details.confidence} >= threshold ${details.threshold}.`,
    `5. Approval Gate ${approvalLine}`,
    '6. Protected Result Z locked the final value.',
    '',
    'Trace:',
    Z_SOURCE_TRACE.join('\n-> '),
  ].join('\n');
}

export function buildZCanonicalJson({
  approvalStatus,
  context,
  mappedRows,
  protectedResult,
  ruleUsed,
  validationResult,
}: {
  approvalStatus?: Record<string, unknown>;
  context: ToolExecutionContext;
  mappedRows: unknown[];
  protectedResult: Record<string, unknown>;
  ruleUsed?: Record<string, unknown>;
  validationResult?: Record<string, unknown>;
}) {
  const details = getZOutputDetails({
    approvalStatus,
    mappedRows,
    protectedResult,
    ruleUsed,
    validationResult,
  });
  const trace = getPipelineTrace(context, 'Z');

  return {
    approval: {
      approved: details.approved,
      reviewer: details.reviewer,
    },
    finalResult: {
      currency: details.currency,
      final: details.final,
      name: 'Z',
      status: details.status,
      value: details.value,
    },
    inputItem: {
      amount: details.amount,
      currency: details.currency,
      label: details.label,
      rowId: details.rowId,
    },
    ruleUsed: {
      matchedKeyword: details.matchedKeyword,
      ruleId: details.ruleId,
      sectionId: details.sectionId,
      subsectionId: details.subsectionId,
      target: details.target,
    },
    trace,
    validation: {
      confidence: details.confidence,
      status: details.validationStatus,
      threshold: details.threshold,
    },
    workflowName: context.workflow.name,
  };
}

function dedupeRowsById(rows: FiscalRow[]) {
  return [...new Map(rows.map((row) => [row.rowId, row])).values()];
}

// ── Export helpers (CSV / Excel output tools) ────────────────────────────────

/** Column order that reads well in a spreadsheet; anything else is appended. */
const EXPORT_COLUMN_PRIORITY = [
  'rowId',
  'label',
  'description',
  'account',
  'category',
  'categoryLabel',
  'amount',
  'currency',
  'confidence',
  'status',
];

const EXPORT_COLUMN_DENYLIST = new Set([
  'evidenceRefs',
  'sourceTrace',
  'ruleSourceTrace',
  'raw',
  'sourceRow',
  'metadata',
]);

export function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, '-')
      .replaceAll(/(^-|-$)/g, '') || 'workflow-export'
  );
}

/** Prefer classified rows when a mapper ran; fall back to raw source rows. */
export function collectExportRows(context: ToolExecutionContext): Record<string, unknown>[] {
  const workpapers = context.upstreamResults.filter((result) =>
    Array.isArray(result.output.workpaperRows),
  );
  if (workpapers.length)
    return workpapers.flatMap((result) => result.output.workpaperRows as Record<string, unknown>[]);
  const mapped = collectRowsByOutputKey(context.upstreamResults, 'mappedRows');
  const rows = mapped.length > 0 ? mapped : collectRows(context);
  return rows.map((row) => asRecord(row) || {});
}

export function resolveExportColumns(
  rows: Record<string, unknown>[],
  configured: unknown,
): string[] {
  if (Array.isArray(configured) && configured.length > 0) {
    return configured.map(String);
  }

  const seen = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (EXPORT_COLUMN_DENYLIST.has(key)) {
        continue;
      }
      const value = row[key];
      // Keep the sheet flat — nested objects/arrays don't belong in a cell.
      if (value !== null && typeof value === 'object') {
        continue;
      }
      seen.add(key);
    }
  }

  const present = [...seen];
  const ordered = EXPORT_COLUMN_PRIORITY.filter((key) => seen.has(key));
  return [...ordered, ...present.filter((key) => !ordered.includes(key)).sort()];
}

export function pickColumns(row: Record<string, unknown>, columns: string[]) {
  return Object.fromEntries(columns.map((key) => [key, row[key] ?? '']));
}

/** RFC 4180 escaping — quote when the value holds a comma, quote, or newline. */
function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  const header = columns.map(escapeCsvCell).join(',');
  const body = rows.map((row) => columns.map((key) => escapeCsvCell(row[key])).join(','));
  return [header, ...body].join('\n');
}

export function collectRowsByOutputKey(results: ToolRunResult[], key: string) {
  return dedupeRowsById(
    results.flatMap((result) => {
      const rows = result.output[key];
      if (!Array.isArray(rows)) {
        return [];
      }

      return rows
        .map((item) => {
          const record = asRecord(item);
          return record ? fiscalRowFromOutputRecord({ record, result }) : null;
        })
        .filter((row): row is FiscalRow => Boolean(row));
    }),
  );
}

function getSectionRows(rows: FiscalRow[], sectionId: string) {
  return rows.filter((row) => row.sectionId === sectionId);
}

const WORKING_Z_CATEGORY_IDS = new Set([
  'interest_income',
  'rental_income',
  'service_income',
  'other_income',
]);

const WORKING_W_CATEGORY_IDS = new Set(['bank_fees', 'professional_fees', 'interest_expense']);

function getResultRows({
  resultName,
  rows,
  workflowName,
}: {
  resultName: 'W' | 'Z';
  rows: FiscalRow[];
  workflowName: string;
}) {
  if (workflowName === WORKING_SOURCE_RULES_DEMO_NAME) {
    const categoryIds = resultName === 'Z' ? WORKING_Z_CATEGORY_IDS : WORKING_W_CATEGORY_IDS;
    return rows.filter((row) => categoryIds.has(row.categoryId || ''));
  }

  return getSectionRows(rows, resultName);
}

function getCurrencyFromRows(rows: FiscalRow[]) {
  return rows.find((row) => row.currency)?.currency || 'USD';
}

function formatAmount(value: unknown) {
  const numberValue = parseNumber(value);
  return numberValue === null ? String(value ?? '') : String(numberValue);
}

function formatExpandedRow(row: FiscalRow) {
  return `${row.rowId} ${row.label} ${formatAmount(row.amount)} ${row.currency || 'USD'}`;
}

function sumRows(rows: FiscalRow[]) {
  return rows.reduce((total, row) => total + row.amount, 0);
}

export function getExpandedWarnings({
  lowConfidenceRows,
  unmatchedRows,
}: {
  lowConfidenceRows: FiscalRow[];
  unmatchedRows: FiscalRow[];
}) {
  return [
    ...lowConfidenceRows.map((row) => `${row.rowId} confidence below threshold`),
    ...unmatchedRows.map((row) => `${row.rowId} unmatched`),
  ];
}

function findMappingSummary(results: ToolRunResult[]) {
  return results.map((result) => asRecord(result.output.mappingSummary)).find(Boolean);
}

function applyCombinedAggregationDetails(details: Record<string, unknown>, result: ToolRunResult) {
  const aggregationSummary = asRecord(result.output.aggregationSummary);
  if (!aggregationSummary) {
    return;
  }
  details.aggregationSummary = aggregationSummary;
  details.aggregationTree = result.output.aggregationTree;
  details.categoryTotalDetails = result.output.categoryTotalDetails;
  details.categoryTotals = result.output.categoryTotals;
  details.finalTotalDetails = result.output.finalTotalDetails;
  details.finalTotals = result.output.finalTotals;
  details.formulaTrace = result.output.formulaTrace;
  details.formulaTraceText = result.output.formulaTraceText;
  details.groupTotals = result.output.groupTotals;
  details.nodeTotalDetails = result.output.nodeTotalDetails;
  details.nodeTotals = result.output.nodeTotals;
  details.officialLineDetails = result.output.officialLineDetails;
  details.officialLineValues = result.output.officialLineValues;
}

function applySplitRollupDetails(details: Record<string, unknown>, result: ToolRunResult) {
  const rollupSummary = asRecord(result.output.rollupSummary);
  if (!(rollupSummary || result.output.rollupTotals)) {
    return;
  }
  details.categoryTotalDetails = result.output.categoryTotalDetails || details.categoryTotalDetails;
  details.categoryTotals = result.output.categoryTotals || details.categoryTotals;
  details.excludedRows = result.output.excludedRows;
  details.includedRowsByCategory = result.output.includedRowsByCategory;
  details.includedRowsByRollup = result.output.includedRowsByRollup;
  details.namedValues = result.output.namedValues || details.namedValues;
  details.rollupFormulaTrace = result.output.rollupFormulaTrace;
  details.rollupSummary = rollupSummary || result.output.rollupSummary;
  details.rollupTotals = result.output.rollupTotals;
  details.rollupTotalDetails = result.output.rollupTotalDetails;
}

function applySplitCalculationDetails(details: Record<string, unknown>, result: ToolRunResult) {
  const calculationSummary = asRecord(result.output.calculationSummary);
  if (!(calculationSummary || result.output.calculatedResults)) {
    return;
  }
  details.calculatedResults = result.output.calculatedResults;
  details.calculationSummary = calculationSummary;
  details.formulaTrace = result.output.formulaTrace || details.formulaTrace;
  details.namedValues = result.output.namedValues || details.namedValues;
  details.resultDetails = result.output.resultDetails;
}

function findAggregationDetails(results: ToolRunResult[]) {
  const details: Record<string, unknown> = {};

  for (const result of results) {
    applyCombinedAggregationDetails(details, result);
    applySplitRollupDetails(details, result);
    applySplitCalculationDetails(details, result);
  }

  return Object.keys(details).length > 0 ? details : null;
}

export function getAggregationRuleCount(results: ToolRunResult[]) {
  const details = findAggregationDetails(results);
  const summary = asRecord(details?.aggregationSummary);
  const ruleCount = parseNumber(summary?.ruleCount);
  if (ruleCount !== null) {
    return ruleCount;
  }
  return Array.isArray(details?.aggregationTree) ? details.aggregationTree.length : 0;
}

function buildExpandedMappingSummary({
  lowConfidenceRows,
  mappedRows,
  results,
  unmatchedRows,
}: {
  lowConfidenceRows: FiscalRow[];
  mappedRows: FiscalRow[];
  results: ToolRunResult[];
  unmatchedRows: FiscalRow[];
}) {
  const summary = findMappingSummary(results);
  const totalRows = parseNumber(summary?.totalRows) ?? mappedRows.length + unmatchedRows.length;

  return {
    lowConfidenceRows: parseNumber(summary?.lowConfidenceCount) ?? lowConfidenceRows.length,
    mappedRows: parseNumber(summary?.mappedCount) ?? mappedRows.length,
    categoryAmountTotals: asRecord(summary?.categoryAmountTotals),
    categoryCounts: asRecord(summary?.categoryCounts),
    totalRows,
    unmatchedRows: parseNumber(summary?.unmatchedCount) ?? unmatchedRows.length,
  };
}

function getSourceBlockSummary(context: ToolExecutionContext) {
  return context.workflow.blocks
    .filter((block) => block.family === 'Source')
    .map((block) => {
      const rows = Array.isArray(block.config.rows) ? block.config.rows : [];
      const rules = Array.isArray(block.config.keywordRules) ? block.config.keywordRules : [];
      const aggregationRules = Array.isArray(block.config.aggregationRules)
        ? block.config.aggregationRules
        : [];
      return {
        blockId: block.id,
        columns: block.config.columns,
        fileName: block.config.fileName || block.config.workbookName,
        label: block.label,
        rowCount: rows.length || undefined,
        ruleCount: rules.length || aggregationRules.length || undefined,
        sourceKind: block.config.sourceKind || block.subtype,
        sourceLocator: block.config.sourceLocator,
        sourceVersion: block.config.sourceVersion || block.config.ruleVersion,
        status: block.config.sourceStatus || block.status,
      };
    });
}

function getProtectedResultDetails(
  protectedResult: Record<string, unknown> | undefined,
  fallbackName: 'W' | 'Z',
  fallbackValue: number,
  fallbackCurrency: string,
) {
  const final = protectedResult?.final !== false;

  return {
    currency: firstPresent(protectedResult?.currency, fallbackCurrency),
    final,
    name: firstPresent(protectedResult?.name, fallbackName),
    runtimeLocked: protectedResult?.runtimeLocked === true,
    status: firstPresent(protectedResult?.status, final ? 'locked' : 'needs_review'),
    value: firstPresent(protectedResult?.value, fallbackValue),
  };
}

function formatPreviewTotals(value: unknown) {
  const record = asRecord(value);
  if (!record || Object.keys(record).length === 0) {
    return ['- None'];
  }

  return Object.entries(record).map(([key, total]) => `- ${key} = ${String(total)}`);
}

function formatFormulaTracePreview(value: unknown) {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((entry) => `- ${String(entry)}`);
  }

  const record = asRecord(value);
  if (!record || Object.keys(record).length === 0) {
    return ['- None'];
  }

  return Object.entries(record).map(([key, trace]) => {
    const traceRecord = asRecord(trace);
    return `- ${key}: ${String(traceRecord?.expression || trace)}`;
  });
}

export function buildExpandedEvidencePreview({
  aggregationRuleCount,
  keywordRuleCount,
  mappedRows,
  protectedResults,
  results,
  sourceRows,
  sourceWarnings,
  workflowName,
}: {
  aggregationRuleCount: number;
  keywordRuleCount: number;
  mappedRows: FiscalRow[];
  protectedResults: Record<string, unknown>[];
  results: ToolRunResult[];
  sourceRows: FiscalRow[];
  sourceWarnings: string[];
  workflowName: string;
}) {
  const zRows = getResultRows({
    resultName: 'Z',
    rows: mappedRows,
    workflowName,
  });
  const wRows = getResultRows({
    resultName: 'W',
    rows: mappedRows,
    workflowName,
  });
  const zResult = getProtectedResultDetails(
    findProtectedResultByName(protectedResults, 'Z'),
    'Z',
    sumRows(zRows),
    getCurrencyFromRows(zRows),
  );
  const wResult = getProtectedResultDetails(
    findProtectedResultByName(protectedResults, 'W'),
    'W',
    sumRows(wRows),
    getCurrencyFromRows(wRows),
  );
  const trace = [
    ...getDualResultPipelineTrace(workflowName, 'Z'),
    ...getDualResultPipelineTrace(workflowName, 'W').filter(
      (step) => !getDualResultPipelineTrace(workflowName, 'Z').includes(step),
    ),
  ];
  const title =
    workflowName === WORKING_SOURCE_RULES_DEMO_NAME
      ? 'Working Demo Evidence Preview'
      : 'Z/W Evidence Preview';
  const aggregationDetails = findAggregationDetails(results);

  return [
    title,
    '',
    'Final protected results:',
    `- Z = ${zResult.value} ${zResult.currency}`,
    `- W = ${wResult.value} ${wResult.currency}`,
    '',
    'Source rows:',
    ...sourceRows.map((row) => `- ${formatExpandedRow(row)}`),
    '',
    'Rule Sources:',
    `- Keyword rules used: ${keywordRuleCount}`,
    `- Aggregation rules used: ${aggregationRuleCount}`,
    '',
    'Z included rows:',
    ...zRows.map((row) => `- ${formatExpandedRow(row)}`),
    '',
    'W included rows:',
    ...wRows.map((row) => `- ${formatExpandedRow(row)}`),
    '',
    'Rollup & calculation results:',
    'Category totals:',
    ...formatPreviewTotals(aggregationDetails?.categoryTotals),
    'Rollup / formula node totals:',
    ...formatPreviewTotals(aggregationDetails?.nodeTotals),
    'Formula totals:',
    ...formatPreviewTotals(aggregationDetails?.finalTotals),
    'Official line values:',
    ...formatPreviewTotals(aggregationDetails?.officialLineValues),
    '',
    'Formula trace:',
    ...formatFormulaTracePreview(
      aggregationDetails?.formulaTraceText || aggregationDetails?.formulaTrace,
    ),
    '',
    'Warnings:',
    ...(sourceWarnings.length > 0 ? sourceWarnings.map((warning) => `- ${warning}`) : ['- None']),
    '',
    'Trace:',
    ...trace.map((step) => `- ${step}`),
  ].join('\n');
}

export function buildExpandedCanonicalJson({
  context,
  keywordRulesUsed,
  lowConfidenceRows,
  mappedRows,
  protectedResults,
  results,
  unmatchedRows,
}: {
  context: ToolExecutionContext;
  keywordRulesUsed: unknown[];
  lowConfidenceRows: FiscalRow[];
  mappedRows: FiscalRow[];
  protectedResults: Record<string, unknown>[];
  results: ToolRunResult[];
  unmatchedRows: FiscalRow[];
}) {
  const zRows = getResultRows({
    resultName: 'Z',
    rows: mappedRows,
    workflowName: context.workflow.name,
  });
  const wRows = getResultRows({
    resultName: 'W',
    rows: mappedRows,
    workflowName: context.workflow.name,
  });
  const zResult = getProtectedResultDetails(
    findProtectedResultByName(protectedResults, 'Z'),
    'Z',
    sumRows(zRows),
    getCurrencyFromRows(zRows),
  );
  const wResult = getProtectedResultDetails(
    findProtectedResultByName(protectedResults, 'W'),
    'W',
    sumRows(wRows),
    getCurrencyFromRows(wRows),
  );
  const zTrace = getDualResultPipelineTrace(context.workflow.name, 'Z');
  const aggregationDetails = findAggregationDetails(results);

  return {
    finalResults: {
      W: {
        currency: wResult.currency,
        final: wResult.final,
        status: wResult.status,
        value: wResult.value,
      },
      Z: {
        currency: zResult.currency,
        final: zResult.final,
        status: zResult.status,
        value: zResult.value,
      },
    },
    protected_results: protectedResults,
    mappingSummary: buildExpandedMappingSummary({
      lowConfidenceRows,
      mappedRows,
      results,
      unmatchedRows,
    }),
    ruleSources: {
      aggregationRuleCount: getAggregationRuleCount(results),
      keywordRuleCount: keywordRulesUsed.length,
    },
    aggregation: aggregationDetails,
    aggregation_summary: aggregationDetails?.aggregationSummary,
    category_totals: aggregationDetails?.categoryTotals,
    final_totals: aggregationDetails?.finalTotals,
    formula_trace: aggregationDetails?.formulaTraceText || aggregationDetails?.formulaTrace,
    group_totals: aggregationDetails?.groupTotals,
    node_totals: aggregationDetails?.nodeTotals,
    official_line_values: aggregationDetails?.officialLineValues,
    sourceMetadata: getSourceBlockSummary(context),
    trace: [
      ...zTrace,
      ...getDualResultPipelineTrace(context.workflow.name, 'W').filter(
        (step) => !zTrace.includes(step),
      ),
    ],
    warnings: getExpandedWarnings({ lowConfidenceRows, unmatchedRows }),
    workflowName: context.workflow.name,
  };
}

export function buildGenericEvidencePreview({
  mappedRows,
  protectedResults,
  results,
  sourceRows,
  warnings,
  workflowName,
}: {
  mappedRows: FiscalRow[];
  protectedResults: Record<string, unknown>[];
  results: ToolRunResult[];
  sourceRows: FiscalRow[];
  warnings: string[];
  workflowName: string;
}) {
  const aggregationDetails = findAggregationDetails(results);
  const protectedLines =
    protectedResults.length > 0
      ? protectedResults.map((result) => {
          const name = String(result.name || 'Result');
          const value = result.value ?? '-';
          const currency = result.currency ? ` ${String(result.currency)}` : '';
          const status = String(
            result.status || (result.final === false ? 'needs_review' : 'final'),
          );
          return `- ${name} = ${String(value)}${currency} (${status})`;
        })
      : ['- None'];

  return [
    `${workflowName} Evidence Preview`,
    '',
    'Source rows:',
    ...(sourceRows.length > 0
      ? sourceRows.map((row) => `- ${formatExpandedRow(row)}`)
      : ['- None']),
    '',
    'Mapped categories:',
    ...(mappedRows.length > 0
      ? mappedRows.map((row) => `- ${formatExpandedRow(row)}`)
      : ['- None']),
    '',
    'Rollup & calculation results:',
    'Category totals:',
    ...formatPreviewTotals(aggregationDetails?.categoryTotals),
    'Rollup totals:',
    ...formatPreviewTotals(aggregationDetails?.rollupTotals || aggregationDetails?.groupTotals),
    'Rollup / formula node totals:',
    ...formatPreviewTotals(aggregationDetails?.nodeTotals),
    'Formula totals:',
    ...formatPreviewTotals(
      aggregationDetails?.calculatedResults || aggregationDetails?.finalTotals,
    ),
    'Official line values:',
    ...formatPreviewTotals(aggregationDetails?.officialLineValues),
    '',
    'Formula trace:',
    ...formatFormulaTracePreview(
      aggregationDetails?.formulaTraceText || aggregationDetails?.formulaTrace,
    ),
    'Rollup trace:',
    ...formatFormulaTracePreview(aggregationDetails?.rollupFormulaTrace),
    '',
    'Protected results:',
    ...protectedLines,
    '',
    'Warnings:',
    ...(warnings.length > 0 ? warnings.map((warning) => `- ${warning}`) : ['- None']),
  ].join('\n');
}

export function buildGenericCanonicalJson({
  context,
  lowConfidenceRows,
  mappedRows,
  protectedResults,
  results,
  unmatchedRows,
}: {
  context: ToolExecutionContext;
  lowConfidenceRows: FiscalRow[];
  mappedRows: FiscalRow[];
  protectedResults: Record<string, unknown>[];
  results: ToolRunResult[];
  unmatchedRows: FiscalRow[];
}) {
  const aggregationDetails = findAggregationDetails(results);
  return {
    aggregation: aggregationDetails,
    aggregation_summary: aggregationDetails?.aggregationSummary,
    calculated_results: aggregationDetails?.calculatedResults,
    calculation_summary: aggregationDetails?.calculationSummary,
    category_totals: aggregationDetails?.categoryTotals,
    finalTotals: aggregationDetails?.finalTotals,
    node_totals: aggregationDetails?.nodeTotals,
    group_totals: aggregationDetails?.groupTotals,
    final_totals: aggregationDetails?.finalTotals,
    formulaTrace: aggregationDetails?.formulaTraceText || aggregationDetails?.formulaTrace,
    named_values: aggregationDetails?.namedValues,
    official_line_values: aggregationDetails?.officialLineValues,
    rollup_formula_trace: aggregationDetails?.rollupFormulaTrace,
    rollup_summary: aggregationDetails?.rollupSummary,
    rollup_totals: aggregationDetails?.rollupTotals,
    formula_trace: aggregationDetails?.formulaTraceText || aggregationDetails?.formulaTrace,
    mappingSummary: buildExpandedMappingSummary({
      lowConfidenceRows,
      mappedRows,
      results,
      unmatchedRows,
    }),
    protectedResults,
    protected_results: protectedResults,
    sourceMetadata: getSourceBlockSummary(context),
    trace: dedupeStrings(collectSourceTrace(context).map(formatSourceTraceRef)),
    warnings: dedupeStrings([
      ...getExpandedWarnings({ lowConfidenceRows, unmatchedRows }),
      ...results.flatMap((result) => result.warnings),
    ]),
    workflowName: context.workflow.name,
  };
}
