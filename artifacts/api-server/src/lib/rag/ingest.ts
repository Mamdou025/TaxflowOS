// ─────────────────────────────────────────────────────────────────────────────
// Ingestion — download a stored document, extract → chunk → embed, and write the
// chunks to document_chunks. Updates the document's status (processing → ready /
// failed) as it goes. Idempotent: existing chunks are replaced on re-ingest.
//
// The /complete route fires this WITHOUT awaiting (fire-and-forget) so the client
// isn't blocked; the client polls GET /api/documents for the status to settle. A
// very large document can still exceed practical request lifetimes — a durable
// background worker is the follow-up. Ported from platform/rag/ingest.ts, backed
// by the shared @workspace/db schema.
// ─────────────────────────────────────────────────────────────────────────────

import { db, documentChunks, eq } from "@workspace/db";
import { getDocument, updateDocument } from "./documents-repo";
import { downloadObject } from "../storage";
import { chunkText } from "./chunk";
import { embedTexts, isEmbeddingConfigured } from "./embeddings";
import { extractText } from "./extract";

const INSERT_BATCH = 200;

export type IngestResult = { ok: boolean; chunks?: number; error?: string };

export async function ingestDocument(
  userId: string,
  documentId: string,
): Promise<IngestResult> {
  const doc = await getDocument(userId, documentId);
  if (!doc) return { ok: false, error: "NOT_FOUND" };

  try {
    await updateDocument(userId, documentId, { status: "processing", error: null });

    const bytes = await downloadObject(doc.storageKey);
    const { text, pageCount } = await extractText(bytes, doc.fileName, doc.mimeType);

    if (!text.trim()) {
      await updateDocument(userId, documentId, {
        status: "failed",
        error: "No extractable text (the file may be scanned/image-only).",
        extractedChars: 0,
        pageCount,
      });
      return { ok: false, error: "NO_TEXT" };
    }

    if (!isEmbeddingConfigured()) {
      await updateDocument(userId, documentId, {
        status: "failed",
        error:
          "No embedding provider configured (OPENAI_API_KEY / AI_GATEWAY_API_KEY).",
        extractedChars: text.length,
        pageCount,
      });
      return { ok: false, error: "NO_EMBEDDINGS" };
    }

    const chunks = chunkText(text);
    const embeddings = await embedTexts(chunks.map((c) => c.content));

    // Replace any prior chunks (re-ingest safety).
    await db.delete(documentChunks).where(eq(documentChunks.documentId, documentId));

    const rows = chunks.map((c, i) => ({
      documentId,
      userId,
      clientId: doc.clientId,
      chunkIndex: c.index,
      content: c.content,
      tokens: c.tokens,
      embedding: embeddings[i],
    }));

    for (let i = 0; i < rows.length; i += INSERT_BATCH) {
      await db.insert(documentChunks).values(rows.slice(i, i + INSERT_BATCH));
    }

    await updateDocument(userId, documentId, {
      status: "ready",
      error: null,
      extractedChars: text.length,
      pageCount,
    });
    return { ok: true, chunks: rows.length };
  } catch (err) {
    console.error("[rag] ingest failed:", err);
    await updateDocument(userId, documentId, {
      status: "failed",
      error: err instanceof Error ? err.message : "Ingestion failed",
    });
    return { ok: false, error: "INGEST_ERROR" };
  }
}
