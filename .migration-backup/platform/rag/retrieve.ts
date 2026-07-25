import "server-only";

// ─────────────────────────────────────────────────────────────────────────────
// Retrieval — embed the query and find the nearest document chunks by cosine
// distance (pgvector, HNSW index), scoped to the user (+ optional client). This is
// what Sina calls to ground answers in the company's documents. FAIL-SOFT: no
// embeddings provider / no DB → returns [] and the assistant just answers without.
// ─────────────────────────────────────────────────────────────────────────────

import { and, cosineDistance, eq, sql } from "drizzle-orm";
import { db } from "@/platform/db";
import { documentChunks, documents } from "@/platform/db/schema";
import { embedQuery, isEmbeddingConfigured } from "./embeddings";

export type RetrievedPassage = {
  documentId: string;
  fileName: string;
  chunkIndex: number;
  content: string;
  similarity: number;
};

export async function searchChunks(
  userId: string,
  query: string,
  opts: { clientId?: string | null; k?: number } = {}
): Promise<RetrievedPassage[]> {
  const { clientId, k = 6 } = opts;
  if (!query.trim() || !isEmbeddingConfigured()) return [];

  try {
    const qv = await embedQuery(query);
    const distance = cosineDistance(documentChunks.embedding, qv);
    const where = clientId
      ? and(eq(documentChunks.userId, userId), eq(documentChunks.clientId, clientId))
      : eq(documentChunks.userId, userId);

    return await db
      .select({
        documentId: documentChunks.documentId,
        fileName: documents.fileName,
        chunkIndex: documentChunks.chunkIndex,
        content: documentChunks.content,
        similarity: sql<number>`1 - (${distance})`,
      })
      .from(documentChunks)
      .innerJoin(documents, eq(documentChunks.documentId, documents.id))
      .where(where)
      .orderBy(distance) // ascending distance = most similar first (HNSW-friendly)
      .limit(k);
  } catch (err) {
    console.error("[rag] search failed:", err);
    return [];
  }
}
