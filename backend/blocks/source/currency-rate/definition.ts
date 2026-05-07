import type { ToolDefinition } from "../../../runtime/types";

export const currencyRateDefinition: ToolDefinition = {
  defaultConfig: {
    documentCurrency: "USD",
    fapiYear: 2025,
    overrideRate: 1.35,
    rateProvider: "bank_of_canada",
    rateType: "annual_average",
    reportingCurrency: "CAD",
    sourceKind: "currency_rate",
  },
  description:
    "Represents an external Bank of Canada FX rate reference with deterministic local override support.",
  displayName: "Bank of Canada FX Rate Source",
  family: "Source",
  inputRoles: [],
  outputRoles: [
    {
      canRouteToFamilies: ["Logic", "Review / Validation", "Output"],
      description: "Exchange rate used to convert document currency.",
      id: "exchange_rate",
      label: "Exchange rate",
      outputKey: "exchangeRateInfo",
      outputType: "exchange_rate",
      samplePreview: "USD -> CAD 1.35",
    },
    {
      canRouteToFamilies: ["Logic", "Review / Validation", "Output"],
      description: "Rate source, year, warning, and conversion metadata.",
      id: "rate_metadata",
      label: "Rate metadata",
      outputKey: "rateMetadata",
      outputType: "rate_metadata",
      samplePreview: "override",
    },
  ],
  runMode: "local_mock",
  subtype: "Currency Rate",
  toolGroup: "source",
  toolId: "source.currency_rate",
};
