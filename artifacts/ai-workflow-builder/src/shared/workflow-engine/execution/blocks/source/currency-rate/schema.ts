import { buildApiRequest } from "../http-json/connectors";
import {
  extractAtPath,
  fetchJsonPayload,
  mapRecordsToRows,
} from "../http-json/schema";

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

  // An API is an API: this goes through the SAME path as every other API source.
  // The `boc.fx_observations` connector builds the URL and the field map, and
  // fetchJsonPayload performs the call — so the SSRF guard, the 30s timeout and
  // the 8MB response cap apply here too. This used to be a bare `fetch()` with
  // none of those, against a URL templated a second time, which is exactly the
  // drift two code paths to one upstream produce.
  //
  // What is genuinely different about FX is not the transport — it is the SHAPE:
  // the block emits one scalar, not rows. So the only bespoke part left is the
  // reduction below (average the year's daily observations), applied to rows the
  // shared mapper produced.
  const built = buildApiRequest("boc.fx_observations", {
    currency: documentCurrency,
    year,
  });
  if (!built.ok) {
    throw new Error(built.errors.join(" "));
  }
  const seriesName = `FX${documentCurrency}CAD`;

  const { payload } = await fetchJsonPayload({
    url: built.spec.url,
    method: built.spec.method,
    headers: {},
  });

  const records = extractAtPath(payload, built.spec.resultsPath);
  const { rows } = mapRecordsToRows({
    currency: built.spec.currency,
    fieldMap: built.spec.fieldMap ?? {},
    maxRows: built.spec.maxRows ?? 400,
    records: Array.isArray(records) ? records : [],
  });

  const observations = rows.map((row) => ({
    date: row.label,
    value: row.amount,
  }));
  if (observations.length === 0) {
    throw new Error("FX lookup response did not include a usable rate.");
  }
  const values = observations.map((observation) => observation.value);
  const rate =
    values.reduce((total, value) => total + value, 0) / values.length;

  // The averaged inputs, not just the average — a reviewer asked to trust an FX
  // figure wants to see how many daily observations it rests on and over what
  // window, and the min/max says whether an annual mean is even representative.
  return {
    rate,
    rateSource: "bank_of_canada_valet",
    rateType: "annual_average",
    rateYear: year,
    seriesName,
    // The URL that was ACTUALLY called, so callers echo it instead of rebuilding
    // it — one more place the two paths could have disagreed.
    endpoint: built.spec.url,
    observationCount: observations.length,
    firstObservation: observations[0]?.date,
    lastObservation: observations.at(-1)?.date,
    minRate: Math.min(...values),
    maxRate: Math.max(...values),
  };
}
