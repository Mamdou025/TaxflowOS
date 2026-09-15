import { asRecord, parseNumber } from './primitives';
import { type ToolExecutionContext } from './types';

function collectNumberRecord(target: Record<string, number>, value: unknown) {
  const record = asRecord(value);
  if (!record) {
    return;
  }

  for (const [key, item] of Object.entries(record)) {
    const numericValue = parseNumber(item);
    if (numericValue !== null) {
      target[key] = numericValue;
    }
  }
}

export function normalizeResultLookupKey(resultName: string) {
  return resultName
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function getNumberRecordValueByResultName(
  record: Record<string, number>,
  resultName: string,
) {
  return record[resultName] ?? record[normalizeResultLookupKey(resultName)];
}

export function collectExpectedResultValues(context: ToolExecutionContext) {
  const expectedResults: Record<string, number> = {};
  collectNumberRecord(expectedResults, context.config.expectedResults);

  for (const result of context.upstreamResults) {
    collectNumberRecord(expectedResults, result.output.expectedResults);
    collectNumberRecord(
      expectedResults,
      asRecord(result.output.aggregationSummary)?.expectedResults,
    );
    collectNumberRecord(expectedResults, asRecord(result.output.fapiInputs)?.expectedResults);
  }

  return expectedResults;
}

export function collectActualResultValues(context: ToolExecutionContext) {
  const actualResults: Record<string, number> = {};

  for (const result of context.upstreamResults) {
    collectNumberRecord(actualResults, result.output.calculatedResults);
    collectNumberRecord(actualResults, result.output.categoryTotals);
    collectNumberRecord(actualResults, result.output.nodeTotals);
    collectNumberRecord(actualResults, result.output.officialLineValues);
    collectNumberRecord(actualResults, result.output.finalTotals);
    const protectedResult = asRecord(result.output.protectedResult);
    const protectedName = String(protectedResult?.resultName || protectedResult?.name || '');
    const protectedValue = parseNumber(protectedResult?.value);
    if (protectedName && protectedValue !== null) {
      actualResults[protectedName] = protectedValue;
    }
  }

  return actualResults;
}
