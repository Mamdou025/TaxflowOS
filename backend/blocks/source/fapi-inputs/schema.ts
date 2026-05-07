export type FapiInputsConfig = {
  documentCurrency?: string;
  expectedResults?: Record<string, number>;
  fatPaid?: number;
  fapiYear?: number;
  inclusionRate?: number;
  reportingCurrency?: string;
  rtf?: number;
};

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parseNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== "string") {
    return;
  }
  const parsed = Number(value.replaceAll(",", "").trim());
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseExpectedResults(value: unknown) {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => [key, parseNumber(item)])
      .filter((entry): entry is [string, number] => entry[1] !== undefined)
  );
}

export function parseFapiInputsConfig(
  config: Record<string, unknown>
): FapiInputsConfig {
  const fapiInputs =
    typeof config.fapiInputs === "object" && config.fapiInputs !== null
      ? (config.fapiInputs as Record<string, unknown>)
      : {};
  const source = { ...config, ...fapiInputs };

  return {
    documentCurrency:
      optionalString(source.documentCurrency) ||
      optionalString(source.sourceCurrency),
    expectedResults: parseExpectedResults(source.expectedResults),
    fatPaid: parseNumber(source.fatPaid),
    fapiYear: parseNumber(source.fapiYear),
    inclusionRate: parseNumber(source.inclusionRate),
    reportingCurrency:
      optionalString(source.reportingCurrency) ||
      optionalString(source.targetCurrency),
    rtf: parseNumber(source.rtf) || parseNumber(source.rtfRate),
  };
}
