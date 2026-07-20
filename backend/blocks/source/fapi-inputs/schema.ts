export type FapiInputsConfig = {
  documentCurrency?: string;
  expectedResults?: Record<string, number>;
  fatPaid?: number;
  fapiYear?: number;
  inclusionRate?: number;
  reportingCurrency?: string;
  rtf?: number;
  // ── Line-driving workbook assumptions (feed A1/A2/C-H + 95(2)) ──────────────
  /** Global participating (P) coefficient applied to property income & expenses in line A. */
  pCoefficient?: number;
  /** Canadian 95(2) rules amount — flows into line A and shows as the 95(2) line. */
  canadianRules95_4?: number;
  debtForgiveness?: number; // → A1 (× 2)
  priorYearG?: number; // → A2
  cfaIncome?: number; // → C
  businessLosses?: number; // → D
  faclCarryforward?: number; // → E
  prescribedAmount?: number; // → F
  prescribedAmountF1?: number; // → F1
  dividendDeductions?: number; // → G
  partnershipDividends?: number; // → H
};

// Platform snaps RTF to one of these; default 1.9.
const ALLOWED_RTF_VALUES = [1.9, 4];
const DEFAULT_RTF_VALUE = 1.9;
function normalizeRtf(value: number | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_RTF_VALUE;
  }
  return (
    ALLOWED_RTF_VALUES.find((allowed) => Math.abs(allowed - value) < 1e-7) ??
    DEFAULT_RTF_VALUE
  );
}

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
    rtf: normalizeRtf(parseNumber(source.rtf) ?? parseNumber(source.rtfRate)),
    // P defaults to 1 (no scaling); pure assumptions default to 0.
    pCoefficient: parseNumber(source.pCoefficient) ?? 1,
    canadianRules95_4: parseNumber(source.canadianRules95_4) ?? 0,
    priorYearG: parseNumber(source.priorYearG) ?? 0,
    // These four are normally DERIVED by classifying trial-balance rows (the
    // rollup emits them as named values). Left undefined when not explicitly
    // entered, so they don't clobber the classified value; an explicit entry
    // still overrides. See fapi-template FAPI_ROLLUP_RULES.
    debtForgiveness: parseNumber(source.debtForgiveness),
    cfaIncome: parseNumber(source.cfaIncome),
    businessLosses: parseNumber(source.businessLosses),
    faclCarryforward: parseNumber(source.faclCarryforward),
    prescribedAmount: parseNumber(source.prescribedAmount) ?? 0,
    prescribedAmountF1: parseNumber(source.prescribedAmountF1) ?? 0,
    dividendDeductions: parseNumber(source.dividendDeductions) ?? 0,
    partnershipDividends: parseNumber(source.partnershipDividends) ?? 0,
  };
}
