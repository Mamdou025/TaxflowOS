// ─────────────────────────────────────────────────────────────────────────────
// Retrieval — embed the query and find the nearest document chunks by cosine
// distance (pgvector, HNSW index), scoped to the user (+ optional client). This is
// what Sina's searchCompanyDocuments tool calls to ground answers in the company's
// documents. FAIL-SOFT: no embeddings provider / no DB → returns [] and the
// assistant just answers without. Ported from platform/rag/retrieve.ts, backed by
// the shared @workspace/db schema.
//
// The cosine distance is expressed with the `sql` helper re-exported from
// @workspace/db (same drizzle-orm instance as the schema columns) rather than
// importing drizzle's cosineDistance directly — this keeps a single drizzle
// instance in play and avoids cross-instance type conflicts.
// ─────────────────────────────────────────────────────────────────────────────

import { and, db, documentChunks, documents, eq, sql } from "@workspace/db";
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
  opts: { clientId?: string | null; k?: number } = {},
): Promise<RetrievedPassage[]> {
  const { clientId, k = 6 } = opts;
  if (!query.trim() || !isEmbeddingConfigured()) return [];

  try {
    const qv = await embedQuery(query);
    // pgvector's text input format is "[v1,v2,…]". Interpolated as a bound param,
    // then cast to `vector` so the `<=>` (cosine distance) operator applies.
    const qvLiteral = `[${qv.join(",")}]`;
    const distance = sql<number>`${documentChunks.embedding} <=> ${qvLiteral}::vector`;
    const scope = clientId
      ? and(eq(documentChunks.userId, userId), eq(documentChunks.clientId, clientId))
      : eq(documentChunks.userId, userId);
    // Only retrieve from documents currently in the Library (active context). Dormant
    // repository files stay stored + chunked but excluded until switched back on.
    const where = and(scope, eq(documents.inLibrary, true));

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
