// ─────────────────────────────────────────────────────────────────────────────
// POST /api/assistant/tools — Sina's live-data / secret-bearing tools.
//
//   POST /api/assistant/tools  { tool, args }  → tool-specific JSON result
//
// Tool implementations live in @workspace/agent-runtime/registry, shared with
// the Agent Lab. Covers: searchWeb,
// searchCanadianTax, fetchWebPage, getFxRate (live Bank of Canada rate),
// estimateForeignIncomeTax. Without this route the client's callServerTool() gets a 404
// and every one of those tools reports "Tool unavailable (HTTP 404)".
//
// app.ts requires a real session, current workspace membership and execute permission.
// Outbound-proxy restrictions also remain enforced by the registry itself.
// ─────────────────────────────────────────────────────────────────────────────
import { Router } from "express";
import { isAgentToolId, runAgentTool } from "@workspace/agent-runtime/registry";

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
