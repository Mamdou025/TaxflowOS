// Ambient declaration for the shared currency-rate block we reuse from the web
// package via the `@` alias (esbuild resolves it at build; tsc uses this stub so it
// doesn't pull the whole web source tree into this package's program). Keep in sync
// with shared/workflow-engine/execution/blocks/source/currency-rate/schema.ts.
declare module "@/shared/workflow-engine/execution/blocks/source/currency-rate/schema" {
  export function fetchAnnualAverageExchangeRate(input: {
    documentCurrency: string;
    reportingCurrency: string;
    year: number;
  }): Promise<{
    rate: number;
    rateSource: string;
    rateType: string;
    rateYear: number;
    seriesName?: string;
  }>;
}
