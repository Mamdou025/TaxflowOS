// ─────────────────────────────────────────────────────────────────────────────
// Embeddings — OpenAI text-embedding-3-small (1536 dims, EMBEDDING_DIMENSIONS in
// @workspace/db). Prefers the direct OpenAI key (OPENAI_API_KEY); falls back to
// the Vercel AI Gateway (AI_GATEWAY_API_KEY, model prefixed "openai/…"), mirroring
// the provider selection used elsewhere in this server. Reuses the `openai` SDK
// already in the api-server's deps. Ported from the web app's platform/rag.
// ─────────────────────────────────────────────────────────────────────────────

import OpenAI from "openai";
import { withRetry } from "../retry";

const MODEL = process.env.EMBEDDING_MODEL || "text-embedding-3-small";
const BATCH_SIZE = 96;

export function isEmbeddingConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY || process.env.AI_GATEWAY_API_KEY);
}

function resolveClient(): { openai: OpenAI; model: string } | null {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) return { openai: new OpenAI({ apiKey: openaiKey }), model: MODEL };

  const gatewayKey = process.env.AI_GATEWAY_API_KEY;
  if (gatewayKey) {
    return {
      openai: new OpenAI({
        apiKey: gatewayKey,
        baseURL: "https://ai-gateway.vercel.sh/v1",
      }),
      model: MODEL.includes("/") ? MODEL : `openai/${MODEL}`,
    };
  }
  return null;
}

/** Embed a batch of texts. Throws if no provider is configured. */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  const c = resolveClient();
  if (!c) {
    throw new Error(
      "No embedding provider configured — set OPENAI_API_KEY or AI_GATEWAY_API_KEY.",
    );
  }
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    // Retry a rate-limited / transient batch in-place before giving up to the
    // job queue (backpressure, not collapse). Terminal errors rethrow at once.
    const res = await withRetry(
      () => c.openai.embeddings.create({ model: c.model, input: batch }),
      {
        attempts: 4,
        baseMs: 2_000,
        onRetry: (err, attempt) =>
          console.warn(
            `[rag] embeddings batch retry ${attempt}:`,
            err instanceof Error ? err.message : err,
          ),
      },
    );
    for (const d of res.data) out.push(d.embedding as number[]);
  }
  return out;
}

/** Embed a single query string. */
export async function embedQuery(text: string): Promise<number[]> {
  const [vector] = await embedTexts([text]);
  return vector;
}
