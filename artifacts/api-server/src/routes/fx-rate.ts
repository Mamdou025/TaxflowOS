// ─────────────────────────────────────────────────────────────────────────────
// GET /api/fx-rate?from=USD&to=CAD&year=2025 — live Bank of Canada annual-average FX.
//
// Ported from the dead Next.js route (app/api/fx-rate/route.ts) into the Express
// api-server. This app is a Vite SPA, so those `app/**/route.ts` handlers never run;
// the FAPI run card's "↻ fetch live rate" button (workflow-run-flow.tsx) calls this
// path and, without a real route, got a 404 → the UI silently kept the workbook
// override rate ("Live fetch unavailable"). The actual fetch lives in the shared
// currency-rate block, reused verbatim via the `@` esbuild alias (tsc sees the stub
// in src/types/web-currency-rate.d.ts — same pattern as the agent-tools/genui ports).
//
// On any failure it returns `ok: false` with the reason (HTTP 200) so the client
// falls back to the override rather than hard-failing the run. CAD-only for now
// (the shared fetcher throws for non-CAD reporting currencies).
// ─────────────────────────────────────────────────────────────────────────────
import { Router } from "express";
import { fetchAnnualAverageExchangeRate } from "@/shared/workflow-engine/execution/blocks/source/currency-rate/schema";

const router = Router();

router.get("/fx-rate", async (req, res) => {
  const documentCurrency = String(req.query.from ?? "USD").toUpperCase();
  const reportingCurrency = String(req.query.to ?? "CAD").toUpperCase();
  const year = Number(req.query.year) || new Date().getFullYear();

  try {
    const result = await fetchAnnualAverageExchangeRate({
      documentCurrency,
      reportingCurrency,
      year,
    });
    res.json({
      ok: true,
      documentCurrency,
      reportingCurrency,
      year,
      provider: "bank_of_canada",
      endpoint: `https://www.bankofcanada.ca/valet/observations/FX${documentCurrency}${reportingCurrency}/json?start_date=${year}-01-01&end_date=${year}-12-31`,
      ...result,
    });
  } catch (error) {
    req.log.warn({ err: error, documentCurrency, reportingCurrency, year }, "FX lookup failed");
    res.json({
      ok: false,
      documentCurrency,
      reportingCurrency,
      year,
      provider: "bank_of_canada",
      reason: error instanceof Error ? error.message : "FX lookup failed.",
    });
  }
});

export default router;
