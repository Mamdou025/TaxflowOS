import { fetchAnnualAverageExchangeRate } from "@/backend/blocks/source/currency-rate/schema";

/**
 * GET /api/fx-rate?from=USD&to=CAD&year=2025
 *
 * Real live fetch against the Bank of Canada Valet API (annual-average series).
 * This is the actual source wired behind the FAPI workflow's "Bank of Canada
 * Valet API" block. Runs server-side to avoid CORS and keep the call auditable.
 *
 * On any failure it returns `ok: false` (with the reason) so callers can fall
 * back to the workbook override rate rather than hard-failing the run.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const documentCurrency = (url.searchParams.get("from") || "USD").toUpperCase();
  const reportingCurrency = (url.searchParams.get("to") || "CAD").toUpperCase();
  const year = Number(url.searchParams.get("year")) || new Date().getFullYear();

  try {
    const result = await fetchAnnualAverageExchangeRate({
      documentCurrency,
      reportingCurrency,
      year,
    });

    return Response.json({
      ok: true,
      documentCurrency,
      reportingCurrency,
      year,
      provider: "bank_of_canada",
      endpoint: `https://www.bankofcanada.ca/valet/observations/FX${documentCurrency}${reportingCurrency}/json?start_date=${year}-01-01&end_date=${year}-12-31`,
      ...result,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        documentCurrency,
        reportingCurrency,
        year,
        provider: "bank_of_canada",
        reason: error instanceof Error ? error.message : "FX lookup failed.",
      },
      { status: 200 }
    );
  }
}
