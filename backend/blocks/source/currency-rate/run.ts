import { info, warning } from "../../../runtime/events";
import {
  createEvidenceRef,
  createSourceTraceRef,
} from "../../../runtime/lineage";
import type {
  ToolExecutionContext,
  ToolRunResult,
} from "../../../runtime/types";
import {
  fetchAnnualAverageExchangeRate,
  parseCurrencyRateConfig,
} from "./schema";

function getRateYear(year?: number) {
  return year || new Date().getFullYear();
}

export function runCurrencyRateSource(
  context: ToolExecutionContext
): ToolRunResult {
  const config = parseCurrencyRateConfig(context.config);
  const documentCurrency = config.documentCurrency.toUpperCase();
  const reportingCurrency = config.reportingCurrency.toUpperCase();
  const rateYear = getRateYear(config.fapiYear);
  const sameCurrency = documentCurrency === reportingCurrency;
  const overrideRate = config.overrideRate;
  const warnings: string[] = [];
  let rate = sameCurrency ? 1 : overrideRate;
  let rateSource = sameCurrency ? "same_currency" : "override";
  let rateType = sameCurrency ? "same_currency" : "user_override";
  if (!(typeof rate === "number" && Number.isFinite(rate))) {
    warnings.push(
      "No FX override was supplied. The Bank of Canada lookup path is available for later integration, but local deterministic runs require an override."
    );
    rate = 0;
    rateSource = "missing_override";
    rateType = "missing";
  }

  const exchangeRate = {
    conversion_applied: documentCurrency !== reportingCurrency,
    documentCurrency,
    exchange_rate: rate,
    override_reason: config.overrideReason,
    provider: config.rateProvider || "bank_of_canada",
    rate,
    rate_source: rateSource,
    rate_type: rateType,
    rate_year: rateYear,
    reportingCurrency,
    warning: warnings[0],
  };
  const fapiInputs = { fxRate: rate };
  const evidenceRef = createEvidenceRef({
    block: context.block,
    label: `${documentCurrency} to ${reportingCurrency} exchange rate`,
    sourceKind: "currency_rate",
    valuePreview: `${rate}`,
  });
  const sourceTrace = [createSourceTraceRef({ evidenceRef })];
  const rateMetadata = {
    fetcher: fetchAnnualAverageExchangeRate.name,
    provider: config.rateProvider || "bank_of_canada",
    sourceId: context.block.id,
    sourceKind: "currency_rate",
    sourceName: context.block.label,
    sourceStatus: context.config.sourceStatus || "draft",
    sourceVersion: Number(context.config.sourceVersion || 1),
    warning: warnings[0],
  };

  return {
    blockId: context.block.id,
    completedAt: new Date().toISOString(),
    errors: [],
    evidenceRefs: [evidenceRef],
    logs: [
      warnings.length > 0
        ? warning("Currency rate source emitted with warnings.", {
            ...exchangeRate,
          })
        : info("Currency rate source emitted Bank of Canada FX reference.", {
            ...exchangeRate,
          }),
    ],
    outputs: {
      exchange_rate: exchangeRate,
      fapi_inputs: { fapiInputs },
      rate_metadata: rateMetadata,
    },
    primaryOutputRole: "exchange_rate",
    runId: context.runId,
    sourceTrace,
    startedAt: context.startedAt,
    status:
      warnings.length > 0 && rateSource === "missing_override"
        ? "warning"
        : "success",
    toolId: "source.currency_rate",
    warnings,
  };
}
