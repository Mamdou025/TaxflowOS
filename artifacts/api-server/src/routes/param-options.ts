// ─────────────────────────────────────────────────────────────────────────────
// GET /api/param-options?connector=<id>&param=<key>
//
// Serves the live choices for any connector parameter that publishes them,
// replacing the bespoke /api/fx-currencies route.
//
// The point is that this route knows nothing about currencies, or about the Bank
// of Canada. It looks up the parameter's declared `optionsSource`, fetches it
// through the SAME guarded transport every other API source uses
// (fetchJsonPayload → SSRF guard, 30s timeout, 8MB cap), and interprets the
// payload with the shared pure mapper. A second connector needing a live list
// adds a few lines of declaration and no code here.
//
// Failures return `ok: false` with a reason at HTTP 200 — the caller falls back
// to free-text entry rather than showing a menu it cannot stand behind.
// ─────────────────────────────────────────────────────────────────────────────
import { Router } from "express";
import {
  getParamOptionsSource,
  optionsFromPayload,
  type ApiParamOption,
} from "@/shared/workflow-engine/execution/blocks/source/http-json/connectors";
import { fetchJsonPayload } from "@/shared/workflow-engine/execution/blocks/source/http-json/schema";

const router = Router();

// Published option sets change on the order of years, and every panel mount would
// otherwise re-hit the upstream.
const TTL_MS = 12 * 60 * 60 * 1000;
const cache = new Map<string, { at: number; options: ApiParamOption[] }>();

router.get("/param-options", async (req, res) => {
  const connectorId = String(req.query.connector ?? "");
  const paramKey = String(req.query.param ?? "");
  const cacheKey = `${connectorId}:${paramKey}`;

  const source = getParamOptionsSource(connectorId, paramKey);
  if (!source) {
    res.json({
      ok: false,
      options: [],
      reason: `"${paramKey}" on "${connectorId}" does not publish a live option list.`,
    });
    return;
  }

  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < TTL_MS) {
    res.json({ ok: true, cached: true, options: hit.options });
    return;
  }

  try {
    const { payload } = await fetchJsonPayload({
      url: source.url,
      method: source.method ?? "GET",
      headers: {},
    });
    const options = optionsFromPayload(payload, source);
    if (options.length === 0) {
      res.json({
        ok: false,
        options: [],
        reason: "The upstream returned no usable options.",
      });
      return;
    }
    cache.set(cacheKey, { at: Date.now(), options });
    res.json({ ok: true, cached: false, options });
  } catch (error) {
    req.log.warn({ err: error, connectorId, paramKey }, "param options lookup failed");
    res.json({
      ok: false,
      options: [],
      reason: error instanceof Error ? error.message : "Option lookup failed.",
    });
  }
});

export default router;
