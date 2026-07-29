// ─────────────────────────────────────────────────────────────────────────────
// Documents repository — Postgres/Drizzle CRUD for company-document METADATA,
// backed by the shared @workspace/db schema. The bytes live in Supabase Storage
// (src/lib/storage.ts); this table only tracks the pointer + processing status.
// Tenancy is enforced by userId. FAIL-SOFT: any DB error returns null / [].
// Ported from the web app's platform/db/documents.ts.
// ─────────────────────────────────────────────────────────────────────────────

import {
  and,
  db,
  desc,
  documents,
  eq,
  type DocumentRow,
  type DocumentStatus,
  type NewDocumentRow,
} from "@workspace/db";

/** Insert a document row (status defaults to "uploading"). Null if DB unavailable. */
export async function createDocument(
  input: NewDocumentRow,
): Promise<DocumentRow | null> {
  try {
    const [row] = await db.insert(documents).values(input).returning();
    return row ?? null;
  } catch (err) {
    console.error("[documents] create failed:", err);
    return null;
  }
}

/** A user's documents, newest first (optionally scoped to a client). Empty on error. */
export async function listDocuments(
  userId: string,
  opts: { clientId?: string | null; limit?: number } = {},
): Promise<DocumentRow[]> {
  const { clientId, limit = 200 } = opts;
  try {
    return await db
      .select()
      .from(documents)
      .where(
        clientId
          ? and(eq(documents.userId, userId), eq(documents.clientId, clientId))
          : eq(documents.userId, userId),
      )
      .orderBy(desc(documents.createdAt))
      .limit(limit);
  } catch (err) {
    console.error("[documents] list failed:", err);
    return [];
  }
}

/** One document, only if it belongs to the user. Null otherwise / on error. */
export async function getDocument(
  userId: string,
  id: string,
): Promise<DocumentRow | null> {
  try {
    const rows = await db
      .select()
      .from(documents)
      .where(and(eq(documents.id, id), eq(documents.userId, userId)))
      .limit(1);
    return rows[0] ?? null;
  } catch (err) {
    console.error("[documents] get failed:", err);
    return null;
  }
}

/** Patch a document's processing fields (user-scoped). Returns the row or null. */
export async function updateDocument(
  userId: string,
  id: string,
  patch: Partial<{
    status: DocumentStatus;
    extractedChars: number | null;
    pageCount: number | null;
    error: string | null;
  }>,
): Promise<DocumentRow | null> {
  try {
    const [row] = await db
      .update(documents)
      .set({ ...patch, updatedAt: new Date() })
      .where(and(eq(documents.id, id), eq(documents.userId, userId)))
      .returning();
    return row ?? null;
  } catch (err) {
    console.error("[documents] update failed:", err);
    return null;
  }
}

/**
 * Delete a document row (user-scoped) and return the deleted row so the caller can
 * also remove the Storage object. Chunks are removed by FK cascade. Null on error.
 */
export async function deleteDocument(
  userId: string,
  id: string,
): Promise<DocumentRow | null> {
  try {
    const [row] = await db
      .delete(documents)
      .where(and(eq(documents.id, id), eq(documents.userId, userId)))
      .returning();
    return row ?? null;
  } catch (err) {
    console.error("[documents] delete failed:", err);
    return null;
  }
}
