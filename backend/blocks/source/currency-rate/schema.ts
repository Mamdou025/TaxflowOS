export type CurrencyRateConfig = {
  documentCurrency: string;
  reportingCurrency: string;
  fapiYear?: number;
  overrideRate?: number;
  overrideReason?: string;
  rateProvider?: string;
  rateType?: string;
  /** Live rate fetched from the Bank of Canada Valet API, when available. */
  liveRate?: number;
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

export function parseCurrencyRateConfig(
  config: Record<string, unknown>
): CurrencyRateConfig {
  const fapiInputs =
    typeof config.fapiInputs === "object" && config.fapiInputs !== null
      ? (config.fapiInputs as Record<string, unknown>)
      : {};
  const source = { ...config, ...fapiInputs };

  return {
    documentCurrency:
      optionalString(source.documentCurrency) ||
      optionalString(source.sourceCurrency) ||
      "USD",
    fapiYear: parseNumber(source.fapiYear),
    liveRate:
      parseNumber(source.liveRate) ||
      parseNumber(source.fetchedRate) ||
      parseNumber(source.valetRate),
    overrideReason: optionalString(source.overrideReason),
    overrideRate:
      parseNumber(source.overrideRate) ||
      parseNumber(source.fxRate) ||
      parseNumber(source.exchangeRate),
    rateProvider: optionalString(source.rateProvider) || "bank_of_canada",
    rateType: optionalString(source.rateType) || "annual_average",
    reportingCurrency:
      optionalString(source.reportingCurrency) ||
      optionalString(source.targetCurrency) ||
      "CAD",
  };
}

export async function fetchAnnualAverageExchangeRate({
  documentCurrency,
  reportingCurrency,
  year,
}: {
  documentCurrency: string;
  reportingCurrency: string;
  year: number;
}) {
  if (documentCurrency === reportingCurrency) {
    return {
      rate: 1,
      rateSource: "same_currency",
      rateType: "same_currency",
      rateYear: year,
    };
  }

  if (reportingCurrency !== "CAD") {
    throw new Error(
      "The local Bank of Canada lookup currently supports rates expressed in CAD."
    );
  }

  const seriesName = `FX${documentCurrency}CAD`;
  const response = await fetch(
    `https://www.bankofcanada.ca/valet/observations/${encodeURIComponent(
      seriesName
    )}/json?start_date=${year}-01-01&end_date=${year}-12-31`
  );
  if (!response.ok) {
    throw new Error(`FX lookup failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as {
    observations?: Record<string, { v?: string } | string>[];
  };
  const values =
    payload.observations
      ?.map((observation) => {
        const seriesValue = observation[seriesName];
        const rawValue =
          typeof seriesValue === "object" && seriesValue !== null
            ? seriesValue.v
            : seriesValue;
        return typeof rawValue === "string" ? Number(rawValue) : Number.NaN;
      })
      .filter((value) => Number.isFinite(value)) || [];
  if (values.length === 0) {
    throw new Error("FX lookup response did not include a usable rate.");
  }
  const rate =
    values.reduce((total, value) => total + value, 0) / values.length;

  return {
    rate,
    rateSource: "bank_of_canada_valet",
    rateType: "annual_average",
    rateYear: year,
    seriesName,
  };
}
