// ─────────────────────────────────────────────────────────────────────────────
// POST /api/assistant/tools — Sina's live-data / secret-bearing tools.
//
//   POST /api/assistant/tools  { tool, args }  → tool-specific JSON result
//
// Ported from the Next.js route (app/api/assistant/tools/route.ts) into the Express
// api-server. The tool IMPLEMENTATIONS live in the shared registry
// (platform/agent-tools/registry.ts), reused verbatim via the `@` esbuild alias — the
// SAME code the Agent Lab runs, no re-implementation. Covers: searchWeb,
// searchCanadianTax, fetchWebPage, getFxRate (live Bank of Canada rate),
// estimateForeignIncomeTax. Without this route the client's callServerTool() gets a 404
// and every one of those tools reports "Tool unavailable (HTTP 404)".
//
// Auth: the Next.js original was session-gated. The api-server currently treats all
// traffic as anonymous (app.ts), so — like the agent-lab/genui ports — this route does
// not session-gate; it would otherwise reject every caller. Outbound-proxy safety still
// comes from the registry itself (fetchWebPage keeps its SSRF host guard); the other
// tools hit fixed upstreams (Bank of Canada, Firecrawl). Re-add a session gate here when
// real auth lands in the api-server.
// ─────────────────────────────────────────────────────────────────────────────
import { Router } from "express";
import { isAgentToolId, runAgentTool } from "@/platform/agent-tools/registry";

const router = Router();

router.post("/tools", async (req, res) => {
  try {
    const body = (req.body ?? {}) as { tool?: unknown; args?: unknown };
    if (typeof body.tool !== "string" || !isAgentToolId(body.tool)) {
      res.status(400).json({ error: "Unknown tool." });
      return;
    }
    const args =
      body.args && typeof body.args === "object" ? (body.args as Record<string, unknown>) : {};
    // runAgentTool validates args (zod) and returns a JSON-serializable result. Tool-level
    // failures come back as `{ error }` with HTTP 200 — the model/tool sees them; only an
    // unknown tool id is a 400 here.
    res.json(await runAgentTool(body.tool, args));
  } catch (err) {
    req.log.error({ err }, "Assistant tool run failed");
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
