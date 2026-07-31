// ─────────────────────────────────────────────────────────────────────────────
// Ingestion — download a stored document, extract → chunk → embed, and write the
// chunks to document_chunks. Updates the document's status (processing → ready /
// failed) as it goes. Idempotent: existing chunks are replaced on re-ingest.
//
// Driven by the durable ingest_jobs queue (src/lib/ingest-worker.ts), NOT the web
// request — a crash or deploy mid-processing resumes instead of losing the work.
// The outcome distinguishes a TERMINAL failure (a bad/scanned/unsupported file —
// the document is marked `failed` here, with a specific message) from a RETRYABLE
// one (a saturated embedding provider, a transient blip — the document is left
// `processing` and the queue retries it with backoff). Peak memory is bounded by
// embedding + inserting one batch of chunks at a time rather than all at once.
// ─────────────────────────────────────────────────────────────────────────────

import { db, documentChunks, eq } from "@workspace/db";
import { getDocument, updateDocument } from "./documents-repo";
import { downloadObject, StorageNotConfiguredError } from "../storage";
import { chunkText } from "./chunk";
import { embedTexts, isEmbeddingConfigured } from "./embeddings";
import { extractText } from "./extract";
import { canOcr, isOcrConfigured, ocrDocument } from "./ocr";
import { isRetryableError } from "../retry";

// Chunks embedded + inserted per iteration. Caps how many embedding vectors are
// resident at once (the old path held the whole document's vectors in memory).
const EMBED_INSERT_BATCH = 96;

export type IngestOutcome =
  | { ok: true; chunks: number }
  // retryable=false → the document has already been marked `failed` here.
  // retryable=true  → the document is left `processing` for the queue to retry.
  | { ok: false; retryable: boolean; error: string };

function message(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

/** Mark the document failed with a user-facing reason and return a terminal outcome. */
async function terminal(
  userId: string,
  documentId: string,
  error: string,
  extra: { extractedChars?: number; pageCount?: number | null } = {},
): Promise<IngestOutcome> {
  await updateDocument(userId, documentId, { status: "failed", error, ...extra });
  return { ok: false, retryable: false, error };
}

export async function ingestDocument(
  userId: string,
  documentId: string,
): Promise<IngestOutcome> {
  const doc = await getDocument(userId, documentId);
  if (!doc) return { ok: false, retryable: false, error: "NOT_FOUND" };

  // Mark processing (idempotent — the worker also does this when it claims the job).
  await updateDocument(userId, documentId, { status: "processing", error: null });

  // 1) Download the bytes. Missing config is terminal; a transient storage error
  //    (network/5xx) is retryable; anything else is treated as a bad object.
  let bytes: Uint8Array;
  try {
    bytes = await downloadObject(doc.storageKey);
  } catch (err) {
    if (err instanceof StorageNotConfiguredError) {
      return terminal(userId, documentId, "Storage is not configured.");
    }
    if (isRetryableError(err)) {
      return { ok: false, retryable: true, error: message(err, "Storage download failed") };
    }
    return terminal(userId, documentId, "Could not download the file from storage.");
  }

  // 2) Extract text via the fast path (unpdf/mammoth/xlsx). A parser throw is a
  //    bad file (terminal); no text means a scanned/image-only file → try OCR next.
  let text: string;
  let pageCount: number | null;
  try {
    const extracted = await extractText(bytes, doc.fileName, doc.mimeType);
    text = extracted.text;
    pageCount = extracted.pageCount;
  } catch (err) {
    return terminal(
      userId,
      documentId,
      `Could not read this file (${message(err, "extraction failed")}).`,
    );
  }

  // 2b) OCR fallback — a scanned / image-only file (common for tax slips, NOAs,
  //     receipts) yields no text above. Read it with the vision model before
  //     giving up. A transient OCR error retries via the queue; a terminal one
  //     falls through to the "no extractable text" outcome below.
  let ocrAttempted = false;
  if (!text.trim() && canOcr(doc.fileName, doc.mimeType) && isOcrConfigured()) {
    ocrAttempted = true;
    try {
      const ocred = await ocrDocument(bytes, doc.fileName, doc.mimeType);
      if (ocred.trim()) text = ocred;
    } catch (err) {
      if (isRetryableError(err)) {
        return { ok: false, retryable: true, error: message(err, "OCR failed") };
      }
      console.error("[rag] ocr failed (terminal):", err);
    }
  }

  if (!text.trim()) {
    return terminal(
      userId,
      documentId,
      ocrAttempted
        ? "No extractable text — OCR could not read this scanned file."
        : "No extractable text (the file may be scanned/image-only).",
      { extractedChars: 0, pageCount },
    );
  }

  if (!isEmbeddingConfigured()) {
    return terminal(
      userId,
      documentId,
      "No embedding provider configured (OPENAI_API_KEY / AI_GATEWAY_API_KEY).",
      { extractedChars: text.length, pageCount },
    );
  }

  // 3) Chunk, then embed + insert in bounded batches. A rate-limit part-way
  //    through leaves the document `processing`; the queue re-runs from the top
  //    (the delete below makes re-ingest idempotent) rather than failing the file.
  const chunks = chunkText(text);
  try {
    // Replace any prior chunks up-front so a retry starts clean.
    await db.delete(documentChunks).where(eq(documentChunks.documentId, documentId));

    let inserted = 0;
    for (let i = 0; i < chunks.length; i += EMBED_INSERT_BATCH) {
      const batch = chunks.slice(i, i + EMBED_INSERT_BATCH);
      const vectors = await embedTexts(batch.map((c) => c.content));
      const rows = batch.map((c, j) => ({
        documentId,
        userId,
        clientId: doc.clientId,
        chunkIndex: c.index,
        content: c.content,
        tokens: c.tokens,
        embedding: vectors[j],
      }));
      await db.insert(documentChunks).values(rows);
      inserted += rows.length;
    }

    await updateDocument(userId, documentId, {
      status: "ready",
      error: null,
      extractedChars: text.length,
      pageCount,
    });
    return { ok: true, chunks: inserted };
  } catch (err) {
    // Saturated dependency (429/5xx/network) → keep `processing`, let the queue
    // retry with backoff. A terminal error (bad input, auth) → fail the document.
    if (isRetryableError(err)) {
      console.error("[rag] ingest transient failure (will retry):", err);
      return { ok: false, retryable: true, error: message(err, "Embedding/index failed") };
    }
    return terminal(userId, documentId, `Processing failed: ${message(err, "unknown error")}`);
  }
}
