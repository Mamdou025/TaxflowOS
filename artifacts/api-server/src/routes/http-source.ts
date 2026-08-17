// ─────────────────────────────────────────────────────────────────────────────
// POST /api/http-source — call a public JSON API server-side.
//
// Two consumers, one route:
//   • the workflow builder's "API / HTTP Request" Source block, which pins the
//     returned rows into block config so the run replays a fixed payload; and
//   • the assistant's `callApi` tool (Tools menu → Run, or "Sina, call this
//     endpoint"), which just wants to see what an endpoint returns.
//
// Running server-side is what makes both possible: no CORS, no key in the
// browser, and one place to enforce the SSRF guard. The guard lives in the shared
// block schema (assertPublicHttpUrl) so the workflow block and the chat tool can
// never diverge on what is callable.
//
// Failures return `ok: false` with a reason at HTTP 200 — callers (a run card, a
// chat tool result) render the reason rather than blowing up the whole run.
// ─────────────────────────────────────────────────────────────────────────────
import { Router } from "express";
import {
  extractAtPath,
  fetchJsonPayload,
  findRecordArray,
  mapRecordsToRows,
  parseHttpJsonConfig,
} from "@/shared/workflow-engine/execution/blocks/source/http-json/schema";

const router = Router();

/** Keep chat/tool payloads small enough to put in a model context. */
const PREVIEW_CHARS = 4000;

function previewOf(payload: unknown) {
  const text = JSON.stringify(payload, null, 2) ?? "";
  return text.length > PREVIEW_CHARS
    ? { preview: `${text.slice(0, PREVIEW_CHARS)}\n… truncated`, truncated: true }
    : { preview: text, truncated: false };
}

// ── Secret references ────────────────────────────────────────────────────────
// A block's config is saved with the workflow and travels wherever the workflow
// goes, so a literal API key typed into a header is a key committed to the
// workflow. `{{env:NAME}}` lets the builder reference a secret held in the
// api-server's environment (.env.local → compose env_file) instead: the config
// stores only the NAME, and the value is substituted here, server-side, at call
// time. It is never sent back to the browser — the response echoes the
// unresolved form.
//
// Literal values still work (plenty of endpoints need no secret, and a scratch
// key is sometimes the point), so this is an option, not a wall.
const SECRET_REF = /\{\{\s*env:([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g;

function resolveSecretRefs(
  value: string,
  missing: Set<string>,
  onUse: (name: string) => void
): string {
  return value.replace(SECRET_REF, (_match, name: string) => {
    const resolved = process.env[name];
    if (resolved === undefined || resolved === "") {
      missing.add(name);
      return "";
    }
    onUse(name);
    return resolved;
  });
}

function resolveConfigSecrets(config: {
  url: string;
  headers: Record<string, string>;
  body?: unknown;
}) {
  const missing = new Set<string>();
  const used = new Set<string>();
  const resolve = (value: string) =>
    resolveSecretRefs(value, missing, (name) => used.add(name));

  const headers = Object.fromEntries(
    Object.entries(config.headers).map(([key, value]) => [key, resolve(value)])
  );
  const url = resolve(config.url);
  // A POST body can carry a key too; only strings are walked.
  const body =
    typeof config.body === "string" ? resolve(config.body) : config.body;

  return { body, headers, missing: [...missing], url, used: [...used] };
}

/**
 * Scrub resolved secret values out of anything echoed back to the browser.
 *
 * The caller PINS the response into block config, and some endpoints reflect the
 * request — an echo/debug route hands the key straight back in its body, which
 * would then be saved into the workflow, exactly the outcome `{{env:}}` exists to
 * prevent. Values shorter than 8 characters are left alone: they are too likely to
 * collide with ordinary content to redact blindly, and too short to be a real key.
 */
function redactSecrets<T>(value: T, names: string[]): T {
  const secrets = names
    .map((name) => process.env[name])
    .filter((secret): secret is string => Boolean(secret && secret.length >= 8));

  if (secrets.length === 0) {
    return value;
  }

  let text = JSON.stringify(value);
  if (text === undefined) {
    return value;
  }
  for (const secret of secrets) {
    text = text.split(JSON.stringify(secret).slice(1, -1)).join("«redacted»");
  }
  return JSON.parse(text) as T;
}

router.post("/http-source", async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const config = parseHttpJsonConfig(body);
  // `mode: "raw"` skips row mapping — used by the callApi tool for arbitrary
  // endpoints that aren't a list of records.
  const mode = body.mode === "raw" ? "raw" : "rows";

  if (!config.url) {
    res.json({ ok: false, reason: "No URL was provided." });
    return;
  }

  const secrets = resolveConfigSecrets(config);
  if (secrets.missing.length > 0) {
    res.json({
      ok: false,
      mode,
      missingSecrets: secrets.missing,
      reason: `Not set in the server environment: ${secrets.missing.join(", ")}. Add ${secrets.missing.length === 1 ? "it" : "them"} to .env.local and restart the api service.`,
    });
    return;
  }

  // Every response below goes out through here, so no path can forget to scrub a
  // resolved key out of an echoed payload or an error message quoting the body.
  const send = (payload: Record<string, unknown>) =>
    res.json(redactSecrets(payload, secrets.used));

  try {
    const { payload, responseMeta: rawMeta } = await fetchJsonPayload({
      ...config,
      body: secrets.body,
      headers: secrets.headers,
      url: secrets.url,
    });
    // fetchJsonPayload reports the URL it actually called — which, for an API that
    // takes its key as a query param, has the secret substituted into it. The
    // caller pins this metadata into block config and shows it on screen, so echo
    // the UNRESOLVED url instead. The `{{env:…}}` reference is the reproducible
    // form anyway: it still identifies the endpoint, and still replays.
    const responseMeta = { ...rawMeta, url: config.url };

    if (mode === "raw") {
      const { preview, truncated } = previewOf(payload);
      send({
        ok: true,
        mode,
        responseMeta: { ...responseMeta, truncated },
        preview,
        payload: truncated ? undefined : payload,
      });
      return;
    }

    const located = extractAtPath(payload, config.resultsPath);
    const records = Array.isArray(located)
      ? located
      : findRecordArray(located) || findRecordArray(payload);

    if (!records) {
      // Not an error — hand back the payload so the caller can pick a path.
      const { preview } = previewOf(payload);
      send({
        ok: false,
        mode,
        responseMeta,
        preview,
        reason: config.resultsPath
          ? `No array of records found at "${config.resultsPath}".`
          : "Could not find an array of records — set resultsPath to point at one.",
      });
      return;
    }

    const { rows, skipped, truncated } = mapRecordsToRows({
      currency: config.currency,
      fieldMap: config.fieldMap,
      maxRows: config.maxRows,
      records,
    });

    send({
      ok: true,
      mode,
      responseMeta: { ...responseMeta, recordCount: records.length, truncated },
      rows,
      rowCount: rows.length,
      skipped,
      samplePayload: records.slice(0, 3),
    });
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "The request failed.";
    req.log.warn({ err: error, url: config.url }, "http-source fetch failed");
    send({ ok: false, mode, reason, url: config.url });
  }
});

export default router;
