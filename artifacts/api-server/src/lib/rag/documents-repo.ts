import {
  and,
  db,
  desc,
  documentChunks,
  documents,
  eq,
  inArray,
  ingestJobs,
  type DocumentLifecycleStatus,
  type DocumentRow,
  type DocumentStatus,
  type NewDocumentRow,
} from '@workspace/db';

export async function createDocument(input: NewDocumentRow): Promise<DocumentRow> {
  const [row] = await db.insert(documents).values(input).returning();
  if (!row) throw new Error('Document insert returned no row.');
  return row;
}

export async function listDocuments(
  workspaceId: string,
  opts: { clientId?: string | null; includeDeleted?: boolean; limit?: number } = {},
): Promise<DocumentRow[]> {
  const { clientId, includeDeleted = false, limit = 200 } = opts;
  const lifecycle: DocumentLifecycleStatus[] = includeDeleted
    ? ['active', 'archived', 'deleted']
    : ['active', 'archived'];
  return db
    .select()
    .from(documents)
    .where(
      and(
        eq(documents.workspaceId, workspaceId),
        inArray(documents.lifecycleStatus, lifecycle),
        clientId ? eq(documents.clientId, clientId) : undefined,
      ),
    )
    .orderBy(desc(documents.createdAt))
    .limit(limit);
}

export async function getDocument(
  workspaceId: string,
  id: string,
  options: { includeDeleted?: boolean } = {},
): Promise<DocumentRow | null> {
  const lifecycle: DocumentLifecycleStatus[] = options.includeDeleted
    ? ['active', 'archived', 'deleted']
    : ['active', 'archived'];
  const rows = await db
    .select()
    .from(documents)
    .where(
      and(
        eq(documents.id, id),
        eq(documents.workspaceId, workspaceId),
        inArray(documents.lifecycleStatus, lifecycle),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function updateDocument(
  workspaceId: string,
  id: string,
  patch: Partial<{
    status: DocumentStatus;
    extractedChars: number | null;
    pageCount: number | null;
    error: string | null;
    inLibrary: boolean;
    contentHash: string | null;
  }>,
): Promise<DocumentRow | null> {
  const [row] = await db
    .update(documents)
    .set({ ...patch, updatedAt: new Date() })
    .where(
      and(
        eq(documents.id, id),
        eq(documents.workspaceId, workspaceId),
        eq(documents.lifecycleStatus, 'active'),
      ),
    )
    .returning();
  return row ?? null;
}

export async function setDocumentLifecycle(
  workspaceId: string,
  id: string,
  current: DocumentLifecycleStatus,
  target: Exclude<DocumentLifecycleStatus, 'purged'>,
): Promise<DocumentRow | null> {
  const now = new Date();
  const lifecycleTimestamp =
    target === 'archived' ? { archivedAt: now } : target === 'deleted' ? { deletedAt: now } : {};
  const [row] = await db
    .update(documents)
    .set({
      lifecycleStatus: target,
      inLibrary: false,
      ...lifecycleTimestamp,
      updatedAt: now,
    })
    .where(
      and(
        eq(documents.id, id),
        eq(documents.workspaceId, workspaceId),
        eq(documents.lifecycleStatus, current),
      ),
    )
    .returning();
  return row ?? null;
}

export class SourceContentPurgeError extends Error {
  constructor(readonly cause: unknown) {
    super('Stored source content could not be purged.');
    this.name = 'SourceContentPurgeError';
  }
}

export async function purgeDocument(
  workspaceId: string,
  id: string,
  purgeContent: (storageKey: string) => Promise<void>,
): Promise<DocumentRow | null> {
  return db.transaction(async (tx) => {
    const [locked] = await tx
      .select()
      .from(documents)
      .where(
        and(
          eq(documents.id, id),
          eq(documents.workspaceId, workspaceId),
          eq(documents.lifecycleStatus, 'deleted'),
        ),
      )
      .for('update')
      .limit(1);
    if (!locked) return null;
    if (locked.storageKey) {
      try {
        await purgeContent(locked.storageKey);
      } catch (error) {
        throw new SourceContentPurgeError(error);
      }
    }
    await tx.delete(documentChunks).where(eq(documentChunks.documentId, id));
    await tx.delete(ingestJobs).where(eq(ingestJobs.documentId, id));
    const now = new Date();
    const [tombstone] = await tx
      .update(documents)
      .set({
        lifecycleStatus: 'purged',
        inLibrary: false,
        storageBucket: null,
        storageKey: null,
        mimeType: null,
        sizeBytes: null,
        extractedChars: null,
        pageCount: null,
        error: null,
        purgedAt: now,
        updatedAt: now,
      })
      .where(
        and(
          eq(documents.id, id),
          eq(documents.workspaceId, workspaceId),
          eq(documents.lifecycleStatus, 'deleted'),
        ),
      )
      .returning();
    return tombstone ?? null;
  });
}
