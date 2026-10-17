// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai-classification-suggestion — backend for the "AI Mapping Suggestion"
// workflow block's config panel.
//
// Generates category suggestions for rows a Keyword Mapper could not confidently
// classify. This is the live model call the block's pure executor
// (lib/workflow-executors/.../ai/classification-suggestion/run.ts) never makes
// itself — the executor only replays whatever this route's response gets pinned
// into the block's config, same split currency-rate/http-json use (see
// routes/http-source.ts). Nothing here writes to Postgres; the browser pins the
// result into the workflow document when it saves, like any other config edit.
// ─────────────────────────────────────────────────────────────────────────────
import { Router } from "express";
import { generateObject, jsonSchema } from "ai";
import { resolveModel } from "@workspace/agent-runtime/agent";
import {
  DEFAULT_MODEL,
  DEFAULT_SYSTEM_PROMPT,
} from "@workspace/workflow-executors/execution/blocks/ai/classification-suggestion/schema";

const router = Router();

type SuggestionRow = {
  rowId: string;
  account?: string;
  label?: string;
  description?: string;
  amount?: number;
  currency?: string;
};

type ReferenceRule = {
  categoryId: string;
  categoryLabel: string;
  keywords: string[];
};

const OUTPUT_SCHEMA = jsonSchema<{
  results: Array<{
    rowRef: string;
    suggestedCategoryId: string | null;
    confidence: number;
    rationale: string;
    matchedSignal: string;
  }>;
}>({
  type: "object",
  properties: {
    results: {
      type: "array",
      items: {
        type: "object",
        properties: {
          rowRef: { type: "string" },
          suggestedCategoryId: { type: ["string", "null"] },
          confidence: { type: "number" },
          rationale: { type: "string" },
          matchedSignal: { type: "string" },
        },
        required: ["rowRef", "suggestedCategoryId", "confidence", "rationale", "matchedSignal"],
        additionalProperties: false,
      },
    },
  },
  required: ["results"],
  additionalProperties: false,
});

function buildSystemPrompt(systemPrompt: string, rulebook: ReferenceRule[]) {
  if (rulebook.length === 0) {
    return systemPrompt;
  }
  return `${systemPrompt}\n\nRULEBOOK (reference categories — keywords are examples, not exhaustive):\n${JSON.stringify(rulebook, null, 2)}`;
}

router.post("/", async (req, res) => {
  try {
    const body = (req.body ?? {}) as Partial<{
      systemPrompt: string;
      model: string;
      rows: SuggestionRow[];
      keywordRules: ReferenceRule[];
    }>;

    const rows = Array.isArray(body.rows) ? body.rows : [];
    if (rows.length === 0) {
      res.json({ ok: true, results: [], model: body.model ?? DEFAULT_MODEL, generatedAt: new Date().toISOString() });
      return;
    }

    const systemPrompt =
      typeof body.systemPrompt === "string" && body.systemPrompt.trim()
        ? body.systemPrompt
        : DEFAULT_SYSTEM_PROMPT;
    const model = typeof body.model === "string" && body.model.trim() ? body.model : DEFAULT_MODEL;
    const rulebook = Array.isArray(body.keywordRules) ? body.keywordRules : [];

    const { object } = await generateObject({
      model: resolveModel(model),
      schema: OUTPUT_SCHEMA,
      system: buildSystemPrompt(systemPrompt, rulebook),
      prompt: `Rows to classify:\n${JSON.stringify(rows, null, 2)}`,
    });

    res.json({
      ok: true,
      results: object.results,
      model,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "AI classification suggestion failed");
    res
      .status(500)
      .json({ ok: false, error: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
