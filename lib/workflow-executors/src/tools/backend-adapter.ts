import {
  executeTool as executeBackendTool,
  getToolDefinition as getBackendToolDefinition,
} from '@workspace/workflow-executors/execution/runtime/registry';
import type {
  ToolExecutionContext as BackendToolExecutionContext,
  ToolRunResult as BackendToolRunResult,
} from '@workspace/workflow-executors/execution/runtime/types';
import { type ToolRunResult, type ToolExecutionContext, type ToolDefinition } from './types';
import { asRecord } from './primitives';
import { getToolInputSchema, getToolOutputSchema } from './ports';

export const BACKEND_ADAPTED_TOOL_IDS = [
  'source.manual_table',
  'source.keyword_rules',
  'source.aggregation_rules',
  'source.rollup_rules',
  'source.calculation_rules',
  'source.fapi_inputs',
  'source.currency_rate',
  'source.http_json',
  'logic.keyword_mapper',
  'logic.category_rollup_aggregator',
  'logic.calculation_engine',
  'logic.hierarchy_aggregator',
] as const;

function pushInputRole(inputsByRole: Record<string, unknown[]>, role: string, value: unknown) {
  inputsByRole[role] = [...(inputsByRole[role] || []), value];
}

function pushBackendOutputAsInputs({
  inputsByRole,
  role,
  value,
}: {
  inputsByRole: Record<string, unknown[]>;
  role: string;
  value: unknown;
}) {
  pushInputRole(inputsByRole, role, value);

  if (role === 'rows' || role === 'selected_rows') {
    pushInputRole(inputsByRole, 'data_rows', value);
  }
}

function pushBackendOutputsAsInputs(
  inputsByRole: Record<string, unknown[]>,
  backendOutputs: Record<string, unknown>,
) {
  for (const [role, value] of Object.entries(backendOutputs)) {
    if (role === 'selected_rows' && backendOutputs.rows !== undefined) {
      continue;
    }
    pushBackendOutputAsInputs({ inputsByRole, role, value });
  }
}

function pushFlattenedResultAsInputs(
  inputsByRole: Record<string, unknown[]>,
  result: ToolRunResult,
) {
  if (Array.isArray(result.output.rows)) {
    pushInputRole(inputsByRole, 'data_rows', {
      evidenceRefs: result.evidenceRefs,
      rows: result.output.rows,
      sourceTrace: result.sourceTrace,
    });
  }
  if (Array.isArray(result.output.keywordRules)) {
    pushInputRole(inputsByRole, 'keyword_rules', {
      evidenceRefs: result.evidenceRefs,
      keywordRules: result.output.keywordRules,
      sourceTrace: result.sourceTrace,
    });
  }
  if (Array.isArray(result.output.aggregationRules)) {
    pushInputRole(inputsByRole, 'aggregation_rules', {
      aggregationRules: result.output.aggregationRules,
      evidenceRefs: result.evidenceRefs,
      sourceTrace: result.sourceTrace,
    });
  }
  if (Array.isArray(result.output.rollupRules)) {
    pushInputRole(inputsByRole, 'rollup_rules', {
      evidenceRefs: result.evidenceRefs,
      rollupRules: result.output.rollupRules,
      sourceTrace: result.sourceTrace,
    });
  }
  if (Array.isArray(result.output.calculationRules)) {
    pushInputRole(inputsByRole, 'calculation_rules', {
      calculationRules: result.output.calculationRules,
      evidenceRefs: result.evidenceRefs,
      sourceTrace: result.sourceTrace,
    });
  }
  if (typeof result.output.namedValues === 'object' && result.output.namedValues) {
    pushInputRole(inputsByRole, 'named_values', {
      evidenceRefs: result.evidenceRefs,
      namedValues: result.output.namedValues,
      sourceTrace: result.sourceTrace,
    });
  }
  if (typeof result.output.calculatedResults === 'object' && result.output.calculatedResults) {
    pushInputRole(inputsByRole, 'named_values', {
      calculatedResults: result.output.calculatedResults,
      evidenceRefs: result.evidenceRefs,
      sourceTrace: result.sourceTrace,
    });
  }
  if (typeof result.output.fapiInputs === 'object' && result.output.fapiInputs) {
    pushInputRole(inputsByRole, 'fapi_inputs', {
      evidenceRefs: result.evidenceRefs,
      fapiInputs: result.output.fapiInputs,
      sourceTrace: result.sourceTrace,
    });
  }
  if (Array.isArray(result.output.mappedRows)) {
    const mappedInput = {
      evidenceRefs: result.evidenceRefs,
      mappedRows: result.output.mappedRows,
      sourceTrace: result.sourceTrace,
    };
    pushInputRole(inputsByRole, 'mapped_rows', mappedInput);
    pushInputRole(inputsByRole, 'data_rows', {
      evidenceRefs: result.evidenceRefs,
      rows: result.output.mappedRows,
      sourceTrace: result.sourceTrace,
    });
  }
}

function toBackendInputsByRole(context: ToolExecutionContext) {
  const inputsByRole: Record<string, unknown[]> = {};

  for (const result of context.upstreamResults) {
    // Preserve source identity and the public output shape for formula references.
    pushInputRole(inputsByRole, 'calculation_sources', {
      blockId: result.blockId,
      output: result.output,
    });
    const backendOutputs = asRecord(result.output.backendOutputs);
    if (backendOutputs) {
      pushBackendOutputsAsInputs(inputsByRole, backendOutputs);
      continue;
    }

    pushFlattenedResultAsInputs(inputsByRole, result);
  }

  return inputsByRole;
}

function toBackendExecutionContext(context: ToolExecutionContext): BackendToolExecutionContext {
  return {
    block: context.block,
    config: context.config,
    evidenceRefs: context.evidenceRefs,
    inputsByRole: toBackendInputsByRole(context),
    runId: context.runId,
    sourceTrace: context.sourceTrace,
    startedAt: context.startedAt,
    upstreamBlocks: context.upstreamBlocks,
    workflow: context.workflow,
  };
}

function getBackendOutputRecord(
  result: BackendToolRunResult,
  role: string,
): Record<string, unknown> {
  return asRecord(result.outputs[role]) || {};
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Backend adapter intentionally flattens each public output role for legacy local viewers.
function flattenBackendResultOutput(result: BackendToolRunResult) {
  const output: Record<string, unknown> = {
    backendOutputs: result.outputs,
    primaryOutputRole: result.primaryOutputRole,
  };
  const rowsOutput = getBackendOutputRecord(result, 'rows');
  if (Object.keys(rowsOutput).length > 0) {
    output.immutable = rowsOutput.immutable;
    output.readOnlyEvidence = rowsOutput.readOnlyEvidence;
    output.rowCount = rowsOutput.rowCount;
    output.rows = rowsOutput.rows;
    output.sourceKind = rowsOutput.sourceKind;
    output.sourceSubtype = rowsOutput.sourceSubtype;
  }
  const rawRowsOutput = getBackendOutputRecord(result, 'raw_rows');
  if (Object.keys(rawRowsOutput).length > 0) {
    output.rawRows = rawRowsOutput.rawRows;
    output.rawRowsCount = rawRowsOutput.rowCount;
  }
  const selectedRowsOutput = getBackendOutputRecord(result, 'selected_rows');
  if (Object.keys(selectedRowsOutput).length > 0) {
    output.selectedRows = selectedRowsOutput.rows;
    output.selectedRowsCount = selectedRowsOutput.rowCount;
  }
  const workbookFileOutput = getBackendOutputRecord(result, 'workbook_file');
  if (Object.keys(workbookFileOutput).length > 0) {
    output.workbookFile = workbookFileOutput.workbookFile || workbookFileOutput;
  }
  const selectedSheetOutput = getBackendOutputRecord(result, 'selected_sheet');
  if (Object.keys(selectedSheetOutput).length > 0) {
    output.selectedSheet = selectedSheetOutput;
  }
  const selectedRangeOutput = getBackendOutputRecord(result, 'selected_range');
  if (Object.keys(selectedRangeOutput).length > 0) {
    output.selectedRange = selectedRangeOutput;
  }
  const sourceMetadataOutput = getBackendOutputRecord(result, 'source_metadata');
  if (Object.keys(sourceMetadataOutput).length > 0) {
    output.sourceMetadata = sourceMetadataOutput;
  }
  const sourceLocatorOutput = getBackendOutputRecord(result, 'source_locator');
  if (Object.keys(sourceLocatorOutput).length > 0) {
    output.sourceLocator = sourceLocatorOutput.sourceLocator;
  }

  const keywordRulesOutput = getBackendOutputRecord(result, 'keyword_rules');
  if (Object.keys(keywordRulesOutput).length > 0) {
    output.immutable = keywordRulesOutput.immutable;
    output.keywordRuleEvidence = keywordRulesOutput.keywordRuleEvidence;
    output.keywordRules = keywordRulesOutput.keywordRules;
    output.keywordRuleTrace = keywordRulesOutput.keywordRuleTrace;
    output.readOnlyEvidence = keywordRulesOutput.readOnlyEvidence;
    output.ruleMetadata = keywordRulesOutput.ruleMetadata;
    output.ruleVersion = keywordRulesOutput.ruleVersion;
    output.ruleCount = keywordRulesOutput.ruleCount;
    output.sourceKind = keywordRulesOutput.sourceKind;
  }

  const aggregationRulesOutput = getBackendOutputRecord(result, 'aggregation_rules');
  if (Object.keys(aggregationRulesOutput).length > 0) {
    output.aggregationRuleEvidence = aggregationRulesOutput.aggregationRuleEvidence;
    output.aggregationTree = aggregationRulesOutput.aggregationTree;
    output.aggregationRules = aggregationRulesOutput.aggregationRules;
    output.aggregationRuleTrace = aggregationRulesOutput.aggregationRuleTrace;
    output.immutable = aggregationRulesOutput.immutable;
    output.readOnlyEvidence = aggregationRulesOutput.readOnlyEvidence;
    output.ruleMetadata = aggregationRulesOutput.ruleMetadata;
    output.ruleVersion = aggregationRulesOutput.ruleVersion;
    output.ruleCount = aggregationRulesOutput.ruleCount;
    output.sourceKind = aggregationRulesOutput.sourceKind;
  }

  const rollupRulesOutput = getBackendOutputRecord(result, 'rollup_rules');
  if (Object.keys(rollupRulesOutput).length > 0) {
    output.immutable = rollupRulesOutput.immutable;
    output.readOnlyEvidence = rollupRulesOutput.readOnlyEvidence;
    output.rollupRuleEvidence = rollupRulesOutput.rollupRuleEvidence;
    output.rollupRules = rollupRulesOutput.rollupRules;
    output.rollupRuleTrace = rollupRulesOutput.rollupRuleTrace;
    output.ruleMetadata = rollupRulesOutput.ruleMetadata;
    output.ruleVersion = rollupRulesOutput.ruleVersion;
    output.ruleCount = rollupRulesOutput.ruleCount;
    output.sourceKind = rollupRulesOutput.sourceKind;
  }

  const calculationRulesOutput = getBackendOutputRecord(result, 'calculation_rules');
  if (Object.keys(calculationRulesOutput).length > 0) {
    output.calculationRuleEvidence = calculationRulesOutput.calculationRuleEvidence;
    output.calculationRules = calculationRulesOutput.calculationRules;
    output.calculationRuleTrace = calculationRulesOutput.calculationRuleTrace;
    output.immutable = calculationRulesOutput.immutable;
    output.readOnlyEvidence = calculationRulesOutput.readOnlyEvidence;
    output.ruleMetadata = calculationRulesOutput.ruleMetadata;
    output.ruleVersion = calculationRulesOutput.ruleVersion;
    output.ruleCount = calculationRulesOutput.ruleCount;
    output.sourceKind = calculationRulesOutput.sourceKind;
  }

  const ruleMetadataOutput = getBackendOutputRecord(result, 'rule_metadata');
  if (Object.keys(ruleMetadataOutput).length > 0) {
    output.ruleMetadata = ruleMetadataOutput;
  }

  const ruleVersionOutput = getBackendOutputRecord(result, 'rule_version');
  if (Object.keys(ruleVersionOutput).length > 0) {
    output.ruleVersion = ruleVersionOutput.ruleVersion || ruleVersionOutput;
    output.ruleVersionMetadata = ruleVersionOutput;
  }

  const mappedRowsOutput = getBackendOutputRecord(result, 'mapped_rows');
  if (Object.keys(mappedRowsOutput).length > 0) {
    output.mappedRows = mappedRowsOutput.mappedRows;
    output.mappedRowsCount = mappedRowsOutput.rowCount;
  }

  const unmatchedRowsOutput = getBackendOutputRecord(result, 'unmatched_rows');
  if (Object.keys(unmatchedRowsOutput).length > 0) {
    output.unmatchedRows = unmatchedRowsOutput.unmatchedRows;
    output.unmatchedRowsCount = unmatchedRowsOutput.rowCount;
  }

  const lowConfidenceRowsOutput = getBackendOutputRecord(result, 'low_confidence_rows');
  if (Object.keys(lowConfidenceRowsOutput).length > 0) {
    output.lowConfidenceRows = lowConfidenceRowsOutput.lowConfidenceRows;
    output.lowConfidenceRowsCount = lowConfidenceRowsOutput.rowCount;
  }

  const conflictsOutput = getBackendOutputRecord(result, 'conflicts');
  if (Object.keys(conflictsOutput).length > 0) {
    output.conflictCount = conflictsOutput.conflictCount;
    output.conflicts = conflictsOutput.conflicts;
  }

  const mappingSummaryOutput = getBackendOutputRecord(result, 'mapping_summary');
  if (Object.keys(mappingSummaryOutput).length > 0) {
    output.mappingSummary = mappingSummaryOutput;
    output.rulesUsed = mappingSummaryOutput.rulesUsed;
  }

  const categoryTotalsOutput = getBackendOutputRecord(result, 'category_totals');
  if (Object.keys(categoryTotalsOutput).length > 0) {
    output.categoryTotalDetails = categoryTotalsOutput.categoryTotalDetails;
    output.categoryTotals = categoryTotalsOutput.categoryTotals;
  }

  const nodeTotalsOutput = getBackendOutputRecord(result, 'node_totals');
  if (Object.keys(nodeTotalsOutput).length > 0) {
    output.nodeTotalDetails = nodeTotalsOutput.nodeTotalDetails;
    output.nodeTotals = nodeTotalsOutput.nodeTotals;
  }

  const groupTotalsOutput = getBackendOutputRecord(result, 'group_totals');
  if (Object.keys(groupTotalsOutput).length > 0) {
    output.groupTotals = groupTotalsOutput.groupTotals;
  }

  const rollupTotalsOutput = getBackendOutputRecord(result, 'rollup_totals');
  if (Object.keys(rollupTotalsOutput).length > 0) {
    output.rollupTotalDetails = rollupTotalsOutput.rollupTotalDetails;
    output.rollupTotals = rollupTotalsOutput.rollupTotals;
  }

  const namedValuesOutput = getBackendOutputRecord(result, 'named_values');
  if (Object.keys(namedValuesOutput).length > 0) {
    output.namedValues = namedValuesOutput.namedValues;
    output.namedValuesSourceKind = namedValuesOutput.sourceKind;
  }

  const finalTotalsOutput = getBackendOutputRecord(result, 'final_totals');
  if (Object.keys(finalTotalsOutput).length > 0) {
    output.finalTotalDetails = finalTotalsOutput.finalTotalDetails;
    output.finalTotals = finalTotalsOutput.finalTotals;
  }

  const officialLineValuesOutput = getBackendOutputRecord(result, 'official_line_values');
  if (Object.keys(officialLineValuesOutput).length > 0) {
    output.officialLineDetails = officialLineValuesOutput.officialLineDetails;
    output.officialLineValues = officialLineValuesOutput.officialLineValues;
  }

  const exchangeRateOutput = getBackendOutputRecord(result, 'exchange_rate');
  if (Object.keys(exchangeRateOutput).length > 0) {
    output.exchangeRate = exchangeRateOutput.rate;
    output.exchangeRateInfo = exchangeRateOutput;
    output.value = exchangeRateOutput.rate;
  }

  const fapiInputsOutput = getBackendOutputRecord(result, 'fapi_inputs');
  if (Object.keys(fapiInputsOutput).length > 0) {
    output.expectedResults = asRecord(fapiInputsOutput.fapiInputs)?.expectedResults;
    output.fapiInputs = fapiInputsOutput.fapiInputs || fapiInputsOutput;
  }

  const inputMetadataOutput = getBackendOutputRecord(result, 'input_metadata');
  if (Object.keys(inputMetadataOutput).length > 0) {
    output.inputMetadata = inputMetadataOutput;
  }

  const rateMetadataOutput = getBackendOutputRecord(result, 'rate_metadata');
  if (Object.keys(rateMetadataOutput).length > 0) {
    output.rateMetadata = rateMetadataOutput;
  }

  const aggregationTreeOutput = getBackendOutputRecord(result, 'aggregation_tree');
  if (Object.keys(aggregationTreeOutput).length > 0) {
    output.aggregationTree = aggregationTreeOutput.aggregationTree;
  }

  const includedRowsByNodeOutput = getBackendOutputRecord(result, 'included_rows_by_node');
  if (Object.keys(includedRowsByNodeOutput).length > 0) {
    output.includedRowsByNode = includedRowsByNodeOutput.includedRowsByNode;
  }

  const hierarchyExcludedRowsOutput = getBackendOutputRecord(result, 'excluded_rows');
  if (Object.keys(hierarchyExcludedRowsOutput).length > 0) {
    output.excludedRows = hierarchyExcludedRowsOutput.excludedRows;
    output.excludedRowsCount = hierarchyExcludedRowsOutput.rowCount;
  }

  const includedRowsByCategoryOutput = getBackendOutputRecord(result, 'included_rows_by_category');
  if (Object.keys(includedRowsByCategoryOutput).length > 0) {
    output.includedRowsByCategory = includedRowsByCategoryOutput.includedRowsByCategory;
  }

  const includedRowsByRollupOutput = getBackendOutputRecord(result, 'included_rows_by_rollup');
  if (Object.keys(includedRowsByRollupOutput).length > 0) {
    output.includedRowsByRollup = includedRowsByRollupOutput.includedRowsByRollup;
  }

  const formulaTraceOutput = getBackendOutputRecord(result, 'formula_trace');
  if (Object.keys(formulaTraceOutput).length > 0) {
    output.formulaTrace = formulaTraceOutput.formulaTrace;
    output.formulaTraceText = formulaTraceOutput.formulaTraceText;
  }

  const rollupFormulaTraceOutput = getBackendOutputRecord(result, 'rollup_formula_trace');
  if (Object.keys(rollupFormulaTraceOutput).length > 0) {
    output.rollupFormulaTrace = rollupFormulaTraceOutput.rollupFormulaTrace;
  }

  const aggregationSummaryOutput = getBackendOutputRecord(result, 'aggregation_summary');
  if (Object.keys(aggregationSummaryOutput).length > 0) {
    output.aggregationSummary = aggregationSummaryOutput;
    output.aggregation_summary = aggregationSummaryOutput;
  }

  const calculatedResultsOutput = getBackendOutputRecord(result, 'calculated_results');
  if (Object.keys(calculatedResultsOutput).length > 0) {
    output.calculatedResults = calculatedResultsOutput.calculatedResults;
    output.resultDetails = calculatedResultsOutput.resultDetails;
  }

  const calculationSummaryOutput = getBackendOutputRecord(result, 'calculation_summary');
  if (Object.keys(calculationSummaryOutput).length > 0) {
    output.calculationSummary = calculationSummaryOutput;
  }

  const rollupSummaryOutput = getBackendOutputRecord(result, 'rollup_summary');
  if (Object.keys(rollupSummaryOutput).length > 0) {
    output.rollupSummary = rollupSummaryOutput;
  }

  return output;
}

function adaptBackendResult(result: BackendToolRunResult): ToolRunResult {
  return {
    blockId: result.blockId,
    completedAt: result.completedAt,
    confidence: result.confidence,
    errors: result.errors,
    evidenceRefs: result.evidenceRefs,
    logs: result.logs,
    output: flattenBackendResultOutput(result),
    runId: result.runId,
    sourceTrace: result.sourceTrace,
    startedAt: result.startedAt,
    status: result.status,
    toolId: result.toolId,
    warnings: result.warnings,
  };
}

export function createBackendAdaptedTool(toolId: string): ToolDefinition | null {
  const backendDefinition = getBackendToolDefinition(toolId);
  if (!backendDefinition) {
    return null;
  }

  return {
    defaultConfig: backendDefinition.defaultConfig,
    description: backendDefinition.description,
    displayName: backendDefinition.displayName,
    execute: (context) =>
      adaptBackendResult(executeBackendTool(toolId, toBackendExecutionContext(context))),
    family: backendDefinition.family,
    inputRoles: backendDefinition.inputRoles,
    inputSchema: getToolInputSchema(
      backendDefinition.inputRoles.map((role) => ({
        key: role.id,
        required: role.required,
        type: 'object',
      })),
    ),
    outputRoles: backendDefinition.outputRoles,
    outputSchema: getToolOutputSchema(
      backendDefinition.outputRoles.map((role) => ({
        key: role.outputKey || role.id,
        type: role.outputType === 'value' ? 'number' : 'object',
      })),
    ),
    runMode: 'local_mock',
    subtype: backendDefinition.subtype,
    toolGroup: backendDefinition.toolGroup,
    toolId: backendDefinition.toolId,
  };
}
