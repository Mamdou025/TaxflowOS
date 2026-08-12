// ─────────────────────────────────────────────────────────────────────────────
// OCR fallback — read text out of SCANNED / image-only documents that the fast
// text path (unpdf/mammoth/xlsx) can't. Canadian tax work is full of these:
// scanned T4/T5 slips, Notices of Assessment, CRA letters, and photographed
// receipts arrive as image-only PDFs or JPG/PNG with no text layer, so before
// this lane they failed ingestion outright ("No extractable text").
//
// This is the ordered-fallback idea from Harvey's scaling post, right-sized: it
// reuses the vision-capable model already reachable via the same provider path as
// embeddings (direct OPENAI_API_KEY, else the Vercel AI Gateway with an
// "openai/…" model) — no new native deps, no rasterization, no new credentials.
// PDFs are sent as a `file` part (the model reads every page); images as an
// `image_url` part. FAIL-SOFT: no provider / a bad response → returns "" and the
// caller falls back to the original "no extractable text" outcome.
// ─────────────────────────────────────────────────────────────────────────────

import OpenAI from "openai";
import { withRetry } from "../retry";

const MODEL = process.env.OCR_MODEL || "gpt-4o-mini";
const MAX_OCR_BYTES = Number(process.env.OCR_MAX_BYTES) || 20 * 1024 * 1024;
const MAX_OUTPUT_TOKENS = Number(process.env.OCR_MAX_TOKENS) || 16_384;

const OCR_PROMPT =
  "Transcribe ALL text from this document exactly as it appears, preserving " +
  "reading order, table structure (as plain-text rows), labels, and every number. " +
  "This is a tax/financial document — do NOT summarize, omit, translate, or " +
  "interpret anything; output only the raw transcribed text. Transcribe your best " +
  "reading of any unclear value rather than skipping it.";

function isImage(fileName: string, mime?: string | null): boolean {
  return (
    (mime?.startsWith("image/") ?? false) ||
    /\.(png|jpe?g|webp|gif|tiff?|bmp|heic)$/i.test(fileName)
  );
}

function isPdf(fileName: string, mime?: string | null): boolean {
  return mime === "application/pdf" || /\.pdf$/i.test(fileName);
}

/** Whether OCR could even apply to this file type (a PDF or a supported image). */
export function canOcr(fileName: string, mime?: string | null): boolean {
  return isPdf(fileName, mime) || isImage(fileName, mime);
}

/** True when a vision provider is reachable and OCR isn't explicitly disabled. */
export function isOcrConfigured(): boolean {
  if (process.env.OCR_ENABLED === "0") return false;
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

/**
 * OCR a document's bytes into text via the vision model. Returns "" when no
 * provider is configured. Throws on a provider error so the caller can classify
 * it (a transient 429/5xx retries via the queue; a terminal error falls through
 * to the "no extractable text" outcome). Retryable blips are absorbed in-place.
 */
export async function ocrDocument(
  bytes: Uint8Array,
  fileName: string,
  mimeType?: string | null,
): Promise<string> {
  const c = resolveClient();
  if (!c) return "";

  if (bytes.byteLength > MAX_OCR_BYTES) {
    throw new Error(
      `File too large for OCR (${Math.round(bytes.byteLength / 1e6)}MB > ${Math.round(
        MAX_OCR_BYTES / 1e6,
      )}MB).`,
    );
  }

  const base64 = Buffer.from(bytes).toString("base64");
  const content: unknown[] = [{ type: "text", text: OCR_PROMPT }];

  if (isPdf(fileName, mimeType)) {
    content.push({
      type: "file",
      file: {
        filename: fileName || "document.pdf",
        file_data: `data:application/pdf;base64,${base64}`,
      },
    });
  } else {
    const mime = mimeType?.startsWith("image/") ? mimeType : "image/png";
    content.push({ type: "image_url", image_url: { url: `data:${mime};base64,${base64}` } });
  }

  const res = await withRetry(
    () =>
      c.openai.chat.completions.create({
        model: c.model,
        temperature: 0,
        max_tokens: MAX_OUTPUT_TOKENS,
        // The `file` content part (PDF input) is newer than some SDK type defs;
        // the wire shape is correct, so we build it untyped and hand it over.
        messages: [{ role: "user", content: content as never }],
      }),
    {
      attempts: 3,
      baseMs: 3_000,
      onRetry: (err, attempt) =>
        console.warn(
          `[rag] ocr retry ${attempt}:`,
          err instanceof Error ? err.message : err,
        ),
    },
  );

  const choice = res.choices?.[0];
  if (choice?.finish_reason === "length") {
    console.warn(
      `[rag] ocr output hit the token cap for "${fileName}" — a long scan may be truncated.`,
    );
  }
  const text = choice?.message?.content;
  return typeof text === "string" ? text.trim() : "";
}
