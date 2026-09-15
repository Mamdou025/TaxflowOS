import { and, db, documentChunks, documents, eq, inArray, sql } from '@workspace/db';
import {
  selectSourcePassages,
  type SourceCandidate,
  type SourceRetrievalPolicy,
  type SourceRetrievalResult,
} from '@workspace/source-core';
import { embedQuery, isEmbeddingConfigured } from './embeddings';

type CandidateRow = {
  documentId: string;
  workspaceId: string | null;
  clientId: string | null;
  fileName: string;
  sourceRevision: number;
  contentHash: string | null;
  lifecycleStatus: SourceCandidate['lifecycleStatus'];
  inLibrary: boolean;
  chunkIndex: number;
  content: string;
  similarity: number;
};

function toCandidate(row: CandidateRow): SourceCandidate | null {
  if (!row.workspaceId) return null;
  return {
    identity: {
      sourceId: row.documentId,
      workspaceId: row.workspaceId,
      kind: 'document',
      label: row.fileName,
      revision: row.sourceRevision,
      contentHash: row.contentHash,
      clientId: row.clientId,
    },
    lifecycleStatus: row.lifecycleStatus,
    inLibrary: row.inLibrary,
    content: row.content,
    chunkIndex: row.chunkIndex,
    similarity: row.similarity,
  };
}

export async function searchChunks(
  workspaceId: string,
  query: string,
  opts: {
    clientId?: string | null;
    k?: number;
    selectedSourceIds?: string[];
    policy?: SourceRetrievalPolicy;
  } = {},
): Promise<SourceRetrievalResult> {
  const {
    clientId = null,
    k = 6,
    selectedSourceIds = [],
    policy = 'selected-and-authorized',
  } = opts;
  if (!isEmbeddingConfigured()) {
    return {
      status: 'unavailable',
      passages: [],
      limitations: [
        {
          code: 'EMBEDDINGS_UNAVAILABLE',
          message: 'Document retrieval is unavailable because embeddings are not configured.',
          retryable: false,
        },
      ],
    };
  }

  try {
    const qv = await embedQuery(query);
    const qvLiteral = `[${qv.join(',')}]`;
    const distance = sql<number>`${documentChunks.embedding} <=> ${qvLiteral}::vector`;
    const fields = {
      documentId: documentChunks.documentId,
      workspaceId: documents.workspaceId,
      clientId: documents.clientId,
      fileName: documents.fileName,
      sourceRevision: documents.sourceRevision,
      contentHash: documents.contentHash,
      lifecycleStatus: documents.lifecycleStatus,
      inLibrary: documents.inLibrary,
      chunkIndex: documentChunks.chunkIndex,
      content: documentChunks.content,
      similarity: sql<number>`1 - (${distance})`,
    };
    const clientScope = clientId ? eq(documents.clientId, clientId) : undefined;
    const activeScope = and(
      eq(documentChunks.workspaceId, workspaceId),
      eq(documents.workspaceId, workspaceId),
      eq(documents.lifecycleStatus, 'active'),
      clientScope,
    );
    const candidateLimit = Math.max(k * 4, selectedSourceIds.length * k);
    const selectedQuery =
      selectedSourceIds.length > 0
        ? db
            .select(fields)
            .from(documentChunks)
            .innerJoin(documents, eq(documentChunks.documentId, documents.id))
            .where(and(activeScope, inArray(documents.id, selectedSourceIds)))
            .orderBy(distance)
            .limit(candidateLimit)
        : Promise.resolve([] as CandidateRow[]);
    const relevantQuery =
      policy === 'selected-and-authorized'
        ? db
            .select(fields)
            .from(documentChunks)
            .innerJoin(documents, eq(documentChunks.documentId, documents.id))
            .where(and(activeScope, eq(documents.inLibrary, true)))
            .orderBy(distance)
            .limit(candidateLimit)
        : Promise.resolve([] as CandidateRow[]);
    const [selectedRows, relevantRows] = await Promise.all([selectedQuery, relevantQuery]);
    const byChunk = new Map<string, SourceCandidate>();
    for (const row of [...selectedRows, ...relevantRows]) {
      const candidate = toCandidate(row);
      if (candidate) {
        byChunk.set(`${candidate.identity.sourceId}:${candidate.chunkIndex}`, candidate);
      }
    }
    const selection = selectSourcePassages({
      candidates: [...byChunk.values()],
      workspaceId,
      clientId,
      selectedSourceIds,
      policy,
      limit: k,
      retrievedAt: new Date().toISOString(),
    });
    const limitations = selection.unavailableSelectedSourceIds.map((sourceId) => ({
      code: 'SELECTED_SOURCE_UNAVAILABLE' as const,
      message:
        'A selected source is unavailable, outside the active scope, or has no searchable content.',
      retryable: false,
      sourceId,
    }));
    return selection.passages.length
      ? { status: 'ok', passages: selection.passages, limitations }
      : { status: 'empty', passages: [], limitations };
  } catch (error) {
    console.error('[rag] search failed:', error);
    return {
      status: 'unavailable',
      passages: [],
      limitations: [
        {
          code: 'RETRIEVAL_FAILED',
          message: 'Document retrieval failed before a trustworthy result was produced.',
          retryable: true,
        },
      ],
    };
  }
}
