import { type ToolRunResult, type NumericValueRef, type ToolExecutionContext } from './types';
import { parseNumber, asRecord } from './primitives';
import { normalizeResultLookupKey } from './validation-values';

function collectScalarNumericValues({
  label,
  output,
  result,
}: {
  label: string;
  output: Record<string, unknown>;
  result: ToolRunResult;
}): NumericValueRef[] {
  return ['value', 'subtotal', 'total', 'amount', 'protectedValue', 'governedValue'].flatMap(
    (key) => {
      const value = parseNumber(output[key]);
      return value === null ? [] : [{ key: `${result.blockId}.${key}`, label, value }];
    },
  );
}

function collectFinalTotalNumericValues({
  label,
  output,
  result,
}: {
  label: string;
  output: Record<string, unknown>;
  result: ToolRunResult;
}): NumericValueRef[] {
  const finalTotals = asRecord(output.finalTotals);
  if (!finalTotals) {
    return [];
  }

  return Object.entries(finalTotals).flatMap(([resultName, totalValue]) => {
    const value = parseNumber(totalValue);
    return value === null
      ? []
      : [
          {
            key: `${result.blockId}.final_totals.${resultName}`,
            label: `${label} ${resultName}`,
            value,
          },
        ];
  });
}

export function collectNumericValues(context: ToolExecutionContext): NumericValueRef[] {
  const values: NumericValueRef[] = [];

  for (const result of context.upstreamResults) {
    const block = context.workflow.blocks.find((item) => item.id === result.blockId);
    const output = result.output;
    const label = block?.label || result.blockId;
    values.push(...collectScalarNumericValues({ label, output, result }));
    values.push(...collectFinalTotalNumericValues({ label, output, result }));
  }

  return values;
}

function getExchangeRateCandidate(context: ToolExecutionContext) {
  for (const result of context.upstreamResults) {
    const output = result.output;
    const exchangeRateInfo =
      asRecord(output.exchangeRateInfo) ||
      asRecord(output.exchange_rate) ||
      asRecord(asRecord(output.backendOutputs)?.exchange_rate);
    const rate =
      parseNumber(exchangeRateInfo?.rate) ??
      parseNumber(exchangeRateInfo?.exchange_rate) ??
      parseNumber(output.exchangeRate) ??
      parseNumber(output.value);
    if (rate !== null) {
      return {
        documentCurrency:
          typeof exchangeRateInfo?.documentCurrency === 'string'
            ? exchangeRateInfo.documentCurrency
            : undefined,
        exchangeRateInfo,
        rate,
        reportingCurrency:
          typeof exchangeRateInfo?.reportingCurrency === 'string'
            ? exchangeRateInfo.reportingCurrency
            : undefined,
        sourceBlockId: result.blockId,
      };
    }
  }
  return undefined;
}

export function getFxRateReviewDraft(context: ToolExecutionContext) {
  const candidate = getExchangeRateCandidate(context);
  const useOverride = context.config.useOverride === true || context.config.useOverride === 'true';
  const overrideRate = parseNumber(context.config.overrideRate);
  const overrideReason =
    typeof context.config.overrideReason === 'string' ? context.config.overrideReason.trim() : '';
  const reviewedRate = useOverride && overrideRate !== null ? overrideRate : candidate?.rate;
  const approved = context.config.approved !== false;
  return {
    approved,
    candidate,
    overrideRate,
    overrideReason,
    reviewedRate,
    useOverride,
  };
}

export function getFxRateReviewWarnings({
  approved,
  candidate,
  overrideRate,
  overrideReason,
  reviewedRate,
  useOverride,
}: ReturnType<typeof getFxRateReviewDraft>) {
  return [
    candidate ? '' : 'No source FX rate was available for review.',
    reviewedRate === undefined ? 'No reviewed FX rate is available.' : '',
    useOverride && overrideRate === null
      ? 'Override is enabled, but no numeric override rate was supplied.'
      : '',
    useOverride && !overrideReason
      ? 'Override reason is required when changing the source FX rate.'
      : '',
    approved ? '' : 'FX rate review is not approved.',
  ].filter(Boolean);
}

export function getFxRateReviewOutput({
  context,
  pass,
  warnings,
}: {
  context: ToolExecutionContext;
  pass: boolean;
  warnings: string[];
}) {
  const draft = getFxRateReviewDraft(context);
  const reviewer = context.config.reviewer || context.config.owner || 'Reviewer';
  const exchangeRateInfo = {
    ...(draft.candidate?.exchangeRateInfo || {}),
    exchange_rate: draft.reviewedRate,
    original_rate: draft.candidate?.rate,
    override_applied: Boolean(draft.useOverride && draft.overrideRate !== null),
    override_reason: draft.overrideReason || undefined,
    rate: draft.reviewedRate,
    review_source: context.block.label,
    sourceBlockId: draft.candidate?.sourceBlockId,
  };
  const approvalStatus = {
    approved: pass,
    notes: draft.overrideReason,
    overrideApplied: exchangeRateInfo.override_applied,
    reviewer,
    status: pass ? 'approved' : 'needs_review',
  };
  const validationResult = {
    message: pass ? 'FX rate is reviewed and ready for protected use.' : warnings[0],
    status: pass ? 'pass' : 'warning',
  };

  return {
    approvalStatus,
    exchangeRateInfo,
    reviewedRate: draft.reviewedRate,
    validationResult,
  };
}

function getFinalTotalForResult(context: ToolExecutionContext, resultName: string) {
  const normalizedResultName = normalizeResultLookupKey(resultName);
  for (const result of context.upstreamResults) {
    const calculatedResults = asRecord(result.output.calculatedResults);
    const calculatedResult =
      parseNumber(calculatedResults?.[resultName]) ??
      parseNumber(calculatedResults?.[normalizedResultName]);
    if (calculatedResult !== null) {
      return calculatedResult;
    }

    const finalTotals = asRecord(result.output.finalTotals);
    const finalTotal = asRecord(finalTotals?.[resultName]);
    const value = parseNumber(finalTotal) ?? parseNumber(finalTotals?.[resultName]);
    if (value !== null) {
      return value;
    }

    const officialLineValues = asRecord(result.output.officialLineValues);
    const officialLineValue = parseNumber(officialLineValues?.[resultName]);
    if (officialLineValue !== null) {
      return officialLineValue;
    }
  }
  return null;
}

export function getProtectedValue(context: ToolExecutionContext, resultName?: string) {
  const configured =
    parseNumber(context.config.currentValue) ??
    parseNumber(context.config.value) ??
    parseNumber(context.config.protectedValue);
  if (configured !== null) {
    return configured;
  }

  if (resultName) {
    const finalTotal = getFinalTotalForResult(context, resultName);
    if (finalTotal !== null) {
      return finalTotal;
    }
  }

  const numericValues = collectNumericValues(context);
  return numericValues[0]?.value ?? null;
}
