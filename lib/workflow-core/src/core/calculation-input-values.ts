// Stable, source-qualified references prevent two blocks' identically named
// fields from overwriting one another. Segments also support spaces and dots.
const encodeSegment = (value: string) =>
  encodeURIComponent(value)
    .replace(/[.!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`)
    .replace(/%/g, '@');
export const calculationValueKey = (blockId: string, path: string[]) =>
  `source:${encodeSegment(blockId)}:${path.map(encodeSegment).join('.')}`;

export function numericOutputFields(
  output: unknown,
  path: string[] = [],
): { path: string[]; value: number }[] {
  if (path.length > 16) return [];
  const numeric =
    typeof output === 'number'
      ? output
      : typeof output === 'string' && /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(output.trim())
        ? Number(output)
        : NaN;
  if (Number.isFinite(numeric)) return [{ path, value: numeric }];
  if (!output || typeof output !== 'object') return [];
  return Object.entries(output).flatMap(([key, value]) =>
    key === 'backendOutputs' ? [] : numericOutputFields(value, [...path, key]),
  );
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

function parseNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== 'string') {
    return null;
  }
  if (!value.trim()) return null;
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function collectNumericEntries(target: Record<string, number>, value: unknown) {
  const record = asRecord(value);
  if (!record) {
    return;
  }

  for (const [key, item] of Object.entries(record)) {
    const numberValue = parseNumber(item);
    // Skip null AND undefined — an absent value must not clobber a value
    // supplied by an earlier input role (e.g. rollup-derived named values).
    if (numberValue !== null && numberValue !== undefined) {
      target[key] = numberValue;
    }
  }
}

function collectNumericEntryGroups(
  target: Record<string, number>,
  record: Record<string, unknown>,
) {
  for (const key of [
    'namedValues',
    'named_values',
    'categoryTotals',
    'category_totals',
    'rollupTotals',
    'rollup_totals',
    'calculatedResults',
    'calculated_results',
    'finalTotals',
    'final_totals',
    'officialLineValues',
    'official_line_values',
    'fapiInputs',
    'fapi_inputs',
  ]) {
    collectNumericEntries(target, record[key]);
    const nestedRecord = asRecord(record[key]);
    if (nestedRecord) {
      collectInputAliases(target, nestedRecord);
      collectRateAliases(target, nestedRecord);
    }
  }
}

function collectInputAliases(target: Record<string, number>, record: Record<string, unknown>) {
  const fatPaid = parseNumber(record.fatPaid) ?? parseNumber(record.FAT_PAID);
  if (fatPaid !== null) {
    target.FAT_PAID = fatPaid;
    target.fatPaid = fatPaid;
  }

  const rtf = parseNumber(record.rtf) ?? parseNumber(record.RTF);
  if (rtf !== null) {
    target.RTF = rtf;
    target.rtf = rtf;
  }

  const inclusionRate = parseNumber(record.inclusionRate) ?? parseNumber(record.INCLUSION_RATE);
  if (inclusionRate !== null) {
    target.INCLUSION_RATE = inclusionRate;
    target.inclusionRate = inclusionRate;
  }
}

function collectRateAliases(target: Record<string, number>, record: Record<string, unknown>) {
  const rate =
    parseNumber(record.rate) ??
    parseNumber(record.exchange_rate) ??
    parseNumber(record.exchangeRate) ??
    parseNumber(record.overrideRate) ??
    parseNumber(record.fxRate) ??
    parseNumber(record.FX_RATE);
  if (rate !== null) {
    target.FX_RATE = rate;
    target.fxRate = rate;
  }
}

function getProtectedResultName(protectedResult: Record<string, unknown>) {
  if (typeof protectedResult.name === 'string') {
    return protectedResult.name;
  }
  if (typeof protectedResult.resultName === 'string') {
    return protectedResult.resultName;
  }
  return '';
}

function collectProtectedResultValue(
  target: Record<string, number>,
  record: Record<string, unknown>,
) {
  const protectedResult = asRecord(record.protectedResult);
  if (!protectedResult) {
    return;
  }
  const protectedName = getProtectedResultName(protectedResult);
  const protectedValue = parseNumber(protectedResult.value);
  if (protectedName && protectedValue !== null) {
    target[protectedName] = protectedValue;
  }
}

export function collectNamedValuesFromBackendInput(value: unknown) {
  const namedValues: Record<string, number> = {};

  if (Array.isArray(value)) {
    for (const item of value) {
      for (const [key, itemValue] of collectNamedValuesFromBackendInput(item)) {
        namedValues[key] = itemValue;
      }
    }
    return Object.entries(namedValues);
  }

  const record = asRecord(value);
  if (!record) {
    return [];
  }

  collectNumericEntryGroups(namedValues, record);
  collectNumericEntries(namedValues, record);
  collectInputAliases(namedValues, record);
  collectProtectedResultValue(namedValues, record);
  collectRateAliases(namedValues, record);

  return Object.entries(namedValues);
}
