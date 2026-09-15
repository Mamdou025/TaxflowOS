import { asRecord, parseNumber } from './primitives';
import {
  type ToolRunResult,
  type ToolExecutionContext,
  type ValidationGateIssue,
  type FinalityStatus,
} from './types';

function hasRecordEntries(value: unknown) {
  const record = asRecord(value);
  return Boolean(record && Object.keys(record).length > 0);
}

function getBackendOutputRole(result: ToolRunResult, role: string) {
  return asRecord(asRecord(result.output.backendOutputs)?.[role]);
}

function getFapiInputsFromResult(result: ToolRunResult) {
  return (
    asRecord(result.output.fapiInputs) ||
    asRecord(getBackendOutputRole(result, 'fapi_inputs')?.fapiInputs) ||
    asRecord(getBackendOutputRole(result, 'fapi_inputs'))
  );
}

function hasRowsOutput(result: ToolRunResult) {
  const backendRows = getBackendOutputRole(result, 'rows');
  const selectedRows = getBackendOutputRole(result, 'selected_rows');
  return (
    (Array.isArray(result.output.rows) && result.output.rows.length > 0) ||
    (Array.isArray(result.output.selectedRows) && result.output.selectedRows.length > 0) ||
    (parseNumber(result.output.rowCount) ?? 0) > 0 ||
    (parseNumber(result.output.selectedRowsCount) ?? 0) > 0 ||
    (parseNumber(backendRows?.rowCount) ?? 0) > 0 ||
    (parseNumber(selectedRows?.rowCount) ?? 0) > 0
  );
}

function hasKeywordRulesOutput(result: ToolRunResult) {
  return (
    (Array.isArray(result.output.keywordRules) && result.output.keywordRules.length > 0) ||
    (parseNumber(result.output.ruleCount) ?? 0) > 0
  );
}

function hasAggregationRulesOutput(result: ToolRunResult) {
  return (
    (Array.isArray(result.output.aggregationRules) && result.output.aggregationRules.length > 0) ||
    (parseNumber(result.output.ruleCount) ?? 0) > 0
  );
}

function hasRollupRulesOutput(result: ToolRunResult) {
  return Array.isArray(result.output.rollupRules) && result.output.rollupRules.length > 0;
}

function hasCalculationRulesOutput(result: ToolRunResult) {
  return Array.isArray(result.output.calculationRules) && result.output.calculationRules.length > 0;
}

function hasExchangeRateOutput({
  exchangeRateInfo,
  fapiInputs,
  result,
}: {
  exchangeRateInfo: Record<string, unknown> | null;
  fapiInputs: Record<string, unknown> | null;
  result: ToolRunResult;
}) {
  return (
    parseNumber(fapiInputs?.fxRate) !== null ||
    parseNumber(exchangeRateInfo?.rate) !== null ||
    parseNumber(exchangeRateInfo?.exchange_rate) !== null ||
    parseNumber(result.output.governedValue) !== null
  );
}

function hasKnownRequiredInput({
  exchangeRateInfo,
  fapiInputs,
  normalized,
  result,
}: {
  exchangeRateInfo: Record<string, unknown> | null;
  fapiInputs: Record<string, unknown> | null;
  normalized: string;
  result: ToolRunResult;
}) {
  if (['datarows', 'rows', 'selectedrows', 'trialbalancerows'].includes(normalized)) {
    return hasRowsOutput(result);
  }
  if (['keywordrules', 'keywordrulebook'].includes(normalized)) {
    return hasKeywordRulesOutput(result);
  }
  if (['aggregationrules', 'aggregationrulebook'].includes(normalized)) {
    return hasAggregationRulesOutput(result);
  }
  if (['rolluprules', 'rolluprulebook'].includes(normalized)) {
    return hasRollupRulesOutput(result);
  }
  if (['calculationrules', 'calculationrulebook'].includes(normalized)) {
    return hasCalculationRulesOutput(result);
  }
  if (normalized === 'expectedresults') {
    return (
      hasRecordEntries(result.output.expectedResults) ||
      hasRecordEntries(fapiInputs?.expectedResults)
    );
  }
  if (['fatpaid', 'fatpaidusd'].includes(normalized)) {
    return parseNumber(fapiInputs?.fatPaid) !== null;
  }
  if (normalized === 'rtf' || normalized === 'rtfrate') {
    return parseNumber(fapiInputs?.rtf) !== null;
  }
  if (normalized === 'inclusionrate') {
    return parseNumber(fapiInputs?.inclusionRate) !== null;
  }
  if (['fxrate', 'exchangerate'].includes(normalized)) {
    return hasExchangeRateOutput({ exchangeRateInfo, fapiInputs, result });
  }
  return undefined;
}

export function hasRequiredInputKey(context: ToolExecutionContext, key: string) {
  const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, '');

  return context.upstreamResults.some((result) => {
    const fapiInputs = getFapiInputsFromResult(result);
    const exchangeRateInfo =
      asRecord(result.output.exchangeRateInfo) || getBackendOutputRole(result, 'exchange_rate');

    const knownMatch = hasKnownRequiredInput({
      exchangeRateInfo,
      fapiInputs,
      normalized,
      result,
    });
    if (typeof knownMatch === 'boolean') {
      return knownMatch;
    }

    return parseNumber(fapiInputs?.[key]) !== null || result.output[key] !== undefined;
  });
}

export function getUnmatchedRowsReviewConfig(context: ToolExecutionContext) {
  const reviewOverride = asRecord(context.config.reviewOverride);
  const overrideUnmatchedRows =
    context.config.overrideUnmatchedRows === true || reviewOverride?.overrideUnmatchedRows === true;
  const overrideReason =
    String(context.config.overrideReason || reviewOverride?.overrideReason || '').trim() ||
    undefined;

  return {
    blocking: context.config.blocking !== false,
    overrideReason,
    overrideUnmatchedRows,
  };
}

export function getUnmatchedRowsWarning({
  count,
  overrideUnmatchedRows,
}: {
  count: number;
  overrideUnmatchedRows: boolean;
}) {
  if (count === 0) {
    return;
  }
  if (overrideUnmatchedRows) {
    return `${count} row(s) remain unmatched but reviewer override was applied.`;
  }
  return `${count} row(s) remain unmatched.`;
}

export function getUnmatchedRowsMessage({
  hasUnmatchedRows,
  pass,
  warning,
}: {
  hasUnmatchedRows: boolean;
  pass: boolean;
  warning?: string;
}) {
  if (!pass) {
    return warning;
  }
  if (hasUnmatchedRows) {
    return 'Unmatched rows were reviewed and overridden.';
  }
  return 'No unmatched rows remain.';
}

export function getUnmatchedRowsStatus({ pass, warnings }: { pass: boolean; warnings: string[] }) {
  if (!pass) {
    return 'needs_review';
  }
  if (warnings.length > 0) {
    return 'warning';
  }
  return 'success';
}

export function getProtectedApprovalState(upstreamResults: ToolRunResult[]) {
  const approvalResults = upstreamResults.filter((result) =>
    Object.hasOwn(result.output, 'approved'),
  );
  const approvalPresent = approvalResults.length > 0;
  const approved =
    approvalPresent && approvalResults.every((result) => result.output.approved === true);
  const approvedBy = approvalResults.find((result) => result.output.approved === true)?.output
    .reviewer;

  return { approvalPresent, approved, approvedBy };
}

export function getProtectedFinalityStatus({
  approvalPresent,
  approved,
  blockingIssues,
  value,
}: {
  approvalPresent: boolean;
  approved: boolean;
  blockingIssues: ValidationGateIssue[];
  value: number | null;
}): FinalityStatus {
  if (value !== null && approved && blockingIssues.length === 0) {
    return 'final';
  }
  if (value === null || !approvalPresent) {
    return 'draft';
  }
  if (approved) {
    return 'review_ready';
  }
  return 'failed';
}

export function getProtectedFinalityReason(finalityStatus: FinalityStatus) {
  if (finalityStatus === 'final') {
    return 'Approved and all blocking validations passed.';
  }
  if (finalityStatus === 'review_ready') {
    return 'Candidate value exists, but blocking validation findings remain unresolved.';
  }
  if (finalityStatus === 'failed') {
    return 'Approval is false or failed.';
  }
  return 'Candidate value or approval is missing.';
}

export function getProtectedWarnings({
  approvalPresent,
  approved,
  blockingIssues,
  value,
}: {
  approvalPresent: boolean;
  approved: boolean;
  blockingIssues: ValidationGateIssue[];
  value: number | null;
}) {
  return [
    value === null ? 'No protected result value found.' : '',
    approvalPresent ? '' : 'Upstream approval is missing.',
    approved || !approvalPresent ? '' : 'Upstream approval is not complete.',
    ...blockingIssues.map((issue) => issue.message),
  ].filter(Boolean);
}
