import {
  type WorkflowBlock,
  type WorkflowDefinition,
} from '@workspace/workflow-executors/workflow/contracts';
import {
  type SourceTraceRef,
  type ToolExecutionContext,
  type ToolRunResult,
  type ValidationGateIssue,
  type FinalityStatus,
} from './types';
import { isDualResultMappingWorkflow, getDualResultPipelineTrace } from './sample-traces';
import { collectSourceTrace, collectRowsFromResult } from './rows';
import { asRecord } from './primitives';

export function dedupeStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

export function formatSourceTraceRef(trace: SourceTraceRef) {
  const itemId = trace.rowId || trace.evidenceRefId?.split(':').at(-1);
  return itemId ? `${trace.sourceLabel}.${itemId}` : trace.sourceLabel;
}

export function getPipelineTrace(context: ToolExecutionContext, resultName?: string) {
  if (
    isDualResultMappingWorkflow(context.workflow.name) &&
    (resultName === 'Z' || resultName === 'W')
  ) {
    return getDualResultPipelineTrace(context.workflow.name, resultName);
  }

  if (resultName === 'Z' || context.workflow.name === 'Single Item Pipeline Demo') {
    return [
      'Excel Template Row Source.row-001',
      'Mapping Rules Source.rule-001',
      'Keyword Mapper.mapped_rows',
      'Section Aggregator.subtotal',
      'Confidence Check.validation_result',
      'Approval Gate.approval_status',
      'Protected Result Z.protected_result',
    ];
  }

  return dedupeStrings(collectSourceTrace(context).map(formatSourceTraceRef));
}

function getCurrencyForNamedResult(result: ToolRunResult, resultName: string) {
  const finalTotals = asRecord(result.output.finalTotals);
  const finalTotal = asRecord(finalTotals?.[resultName]);
  if (typeof finalTotal?.currency === 'string') {
    return finalTotal.currency;
  }

  const finalTotalDetails = asRecord(result.output.finalTotalDetails);
  const finalTotalDetail = asRecord(finalTotalDetails?.[resultName]);
  if (typeof finalTotalDetail?.currency === 'string') {
    return finalTotalDetail.currency;
  }

  const officialLineDetails = asRecord(result.output.officialLineDetails);
  const officialLineDetail = asRecord(officialLineDetails?.[resultName]);
  return typeof officialLineDetail?.currency === 'string' ? officialLineDetail.currency : null;
}

export function getUpstreamCurrency(context: ToolExecutionContext, resultName?: string) {
  for (const result of context.upstreamResults) {
    if (resultName) {
      const namedCurrency = getCurrencyForNamedResult(result, resultName);
      if (namedCurrency) {
        return namedCurrency;
      }
    }

    const subtotal = asRecord(result.output.subtotal);
    if (typeof subtotal?.currency === 'string') {
      return subtotal.currency;
    }

    const rows = collectRowsFromResult(result);
    const rowCurrency = rows.find((row) => row.currency)?.currency;
    if (rowCurrency) {
      return rowCurrency;
    }
  }

  return typeof context.config.currency === 'string' ? context.config.currency : undefined;
}

export function findProtectedResult(results: ToolRunResult[]) {
  for (const result of results) {
    const protectedResult =
      asRecord(result.output.protectedResult) || asRecord(result.output.protected_result);
    if (protectedResult) {
      return protectedResult;
    }
  }
  return undefined;
}

export function findValidationResult(results: ToolRunResult[]) {
  for (const result of results) {
    const validationResult =
      asRecord(result.output.validationResult) || asRecord(result.output.validation_result);
    if (validationResult) {
      return validationResult;
    }
  }
  return undefined;
}

export function findApprovalStatus(results: ToolRunResult[]) {
  for (const result of results) {
    const approvalStatus =
      asRecord(result.output.approvalStatus) || asRecord(result.output.approval_status);
    if (approvalStatus) {
      return approvalStatus;
    }
  }
  return undefined;
}

function getValidationResultRecord(result: ToolRunResult) {
  return (
    asRecord(result.output.validationResult) ||
    asRecord(result.output.validation_result) ||
    asRecord(result.output.outputReadinessResult) ||
    asRecord(result.output.output_readiness_result) ||
    asRecord(result.output.requiredInputResult) ||
    asRecord(result.output.required_input_result)
  );
}

function getReviewerOverrides(results: ToolRunResult[]) {
  const overrides: Record<string, unknown> = {};

  for (const result of results) {
    const approvalStatus =
      asRecord(result.output.approvalStatus) || asRecord(result.output.approval_status);
    const reviewOverride =
      asRecord(result.output.reviewerOverrides) ||
      asRecord(result.output.reviewOverride) ||
      asRecord(approvalStatus?.reviewerOverrides) ||
      asRecord(approvalStatus?.reviewOverride);

    if (reviewOverride) {
      Object.assign(overrides, reviewOverride);
    }
    if (approvalStatus?.overrideUnmatchedRows !== undefined) {
      overrides.overrideUnmatchedRows = approvalStatus.overrideUnmatchedRows;
    }
    if (approvalStatus?.overrideReason) {
      overrides.overrideReason = approvalStatus.overrideReason;
    }
  }

  return overrides;
}

function isTruthy(value: unknown) {
  return value === true || value === 'true';
}

function hasUnmatchedRowsOverride(overrides: Record<string, unknown>) {
  return isTruthy(overrides.overrideUnmatchedRows);
}

function isUnmatchedRowsReview({
  block,
  result,
}: {
  block?: WorkflowBlock;
  result: ToolRunResult;
}) {
  return (
    result.toolId === 'review.unmatched_rows_check' || block?.subtype === 'Unmatched Rows Check'
  );
}

function getValidationPass({
  result,
  validationResult,
}: {
  result: ToolRunResult;
  validationResult: Record<string, unknown> | null;
}) {
  if (typeof result.output.pass === 'boolean') {
    return result.output.pass;
  }
  if (typeof result.output.ready === 'boolean') {
    return result.output.ready;
  }
  if (validationResult?.status === 'pass') {
    return true;
  }
  if (
    validationResult?.status === 'fail' ||
    validationResult?.status === 'error' ||
    result.status === 'error' ||
    result.status === 'needs_review'
  ) {
    return false;
  }
  return result.status !== 'warning';
}

function getValidationMessage({
  result,
  validationResult,
}: {
  result: ToolRunResult;
  validationResult: Record<string, unknown> | null;
}) {
  if (typeof validationResult?.message === 'string') {
    return validationResult.message;
  }
  return result.warnings[0] || result.errors[0] || 'Review needs attention.';
}

export function summarizeValidationGateResults({
  results,
  workflow,
}: {
  results: ToolRunResult[];
  workflow: WorkflowDefinition;
}) {
  const reviewerOverrides = getReviewerOverrides(results);
  const validationSummary = results.flatMap<ValidationGateIssue>((result) => {
    const block = workflow.blocks.find((item) => item.id === result.blockId);
    if (block?.family !== 'Review / Validation' || Object.hasOwn(result.output, 'approved')) {
      return [];
    }

    const validationResult = getValidationResultRecord(result);
    const blocking = result.output.blocking !== false && validationResult?.blocking !== false;
    const overridden =
      isUnmatchedRowsReview({ block, result }) && hasUnmatchedRowsOverride(reviewerOverrides);
    const pass = overridden || getValidationPass({ result, validationResult });
    const status = String(
      validationResult?.status ||
        result.output.reviewStatus ||
        result.output.review_status ||
        result.status,
    );
    const message =
      overridden && !getValidationPass({ result, validationResult })
        ? `${getValidationMessage({ result, validationResult })} Reviewer override applied.`
        : getValidationMessage({ result, validationResult });

    return [
      {
        blockId: result.blockId,
        blocking,
        label: block.label,
        message,
        overridden,
        pass,
        status,
      },
    ];
  });
  const blockingIssues = validationSummary.filter((item) => item.blocking && !item.pass);
  const nonBlockingWarnings = validationSummary.filter(
    (item) => !item.blocking && (!item.pass || item.status === 'warning'),
  );

  return {
    blockingIssues,
    nonBlockingWarnings,
    reviewerOverrides,
    validationSummary,
  };
}

function getProtectedResultsFinality(protectedResults: Record<string, unknown>[]) {
  return protectedResults.map((result) => ({
    blockId: result.blockId,
    final: result.final === true,
    finalityStatus: String(
      result.finalityStatus || (result.final === true ? 'final' : 'review_ready'),
    ),
    name: result.name,
    runtimeLocked: result.runtimeLocked === true,
    status: result.status,
    value: result.value,
  }));
}

export function getOutputFinalitySummary({
  protectedResults,
  results,
  workflow,
}: {
  protectedResults: Record<string, unknown>[];
  results: ToolRunResult[];
  workflow: WorkflowDefinition;
}) {
  const validationGate = summarizeValidationGateResults({ results, workflow });
  const protectedResultsFinality = getProtectedResultsFinality(protectedResults);
  const hasExecutionError = results.some(
    (result) => result.status === 'error' || result.status === 'skipped',
  );
  const hasNonFinalProtectedResult = protectedResultsFinality.some(
    (result) => result.runtimeLocked !== true || result.finalityStatus !== 'final',
  );
  const expectsProtectedResult = workflow.blocks.some(
    (block) =>
      block.config.toolId === 'protected.protected_result' ||
      block.catalogId === 'protected:protected-result',
  );
  let finalityStatus: FinalityStatus = 'final';
  if (hasExecutionError) {
    finalityStatus = 'failed';
  } else if (results.length === 0 || (expectsProtectedResult && protectedResults.length === 0)) {
    finalityStatus = 'draft';
  } else if (validationGate.blockingIssues.length > 0 || hasNonFinalProtectedResult) {
    finalityStatus = 'review_ready';
  }

  return {
    ...validationGate,
    finalityStatus,
    protectedResultsFinality,
    reason:
      finalityStatus === 'final' && !expectsProtectedResult
        ? 'Workflow steps completed and all blocking validations passed.'
        : getOutputFinalityReason(finalityStatus),
  };
}

function getOutputFinalityReason(finalityStatus: FinalityStatus) {
  if (finalityStatus === 'final') {
    return 'All blocking validations passed and protected results are final.';
  }
  if (finalityStatus === 'review_ready') {
    return 'This package is review-ready, not final, because unresolved validation findings remain.';
  }
  if (finalityStatus === 'failed') {
    return 'One or more workflow steps failed.';
  }
  return 'The workflow has not produced protected results yet.';
}

function getFinalityLabel(status: FinalityStatus) {
  if (status === 'final') {
    return 'Final';
  }
  if (status === 'review_ready') {
    return 'Review-ready';
  }
  if (status === 'failed') {
    return 'Failed';
  }
  return 'Draft';
}

export function buildFinalityPreviewHeader(finality: ReturnType<typeof getOutputFinalitySummary>) {
  return [
    `Workflow state: ${getFinalityLabel(finality.finalityStatus)}`,
    `Reason: ${finality.reason}`,
    '',
    'Blocking issues:',
    ...(finality.blockingIssues.length > 0
      ? finality.blockingIssues.map((issue) => `- ${issue.label}: ${issue.message}`)
      : ['- None']),
    '',
    'Non-blocking warnings:',
    ...(finality.nonBlockingWarnings.length > 0
      ? finality.nonBlockingWarnings.map((issue) => `- ${issue.label}: ${issue.message}`)
      : ['- None']),
  ].join('\n');
}

export function withCanonicalFinality(
  value: unknown,
  finality: ReturnType<typeof getOutputFinalitySummary>,
) {
  return {
    ...(asRecord(value) || {}),
    blockingIssues: finality.blockingIssues,
    finalityStatus: finality.finalityStatus,
    nonBlockingWarnings: finality.nonBlockingWarnings,
    protectedResultsFinality: finality.protectedResultsFinality,
    reviewerOverrides: finality.reviewerOverrides,
    validationSummary: finality.validationSummary,
  };
}

export function getProtectedResults(results: ToolRunResult[]): Record<string, unknown>[] {
  return results
    .map((result) => {
      const protectedResult =
        asRecord(result.output.protectedResult) || asRecord(result.output.protected_result);
      if (!protectedResult) {
        return null;
      }

      return { ...protectedResult, blockId: result.blockId } as Record<string, unknown>;
    })
    .filter((result): result is Record<string, unknown> => Boolean(result));
}

export function findProtectedResultByName(results: Record<string, unknown>[], name: string) {
  return results.find((result) => result.name === name);
}
