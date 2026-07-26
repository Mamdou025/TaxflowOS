// ─────────────────────────────────────────────────────────────────────────────
// Chat repository — Postgres/Drizzle CRUD for saved conversations. server-only,
// FAIL-SOFT.
//
// Mirrors features/assistant/runtime/memory/repository.ts: every call is wrapped
// so a missing/unreachable database degrades to "no persistence" (empty / null /
// false) instead of throwing — the chat keeps working with no DB, exactly like the
// app's other DB-backed routes. Tenancy is enforced here: every read/write is
// scoped by userId.
// ─────────────────────────────────────────────────────────────────────────────


import { and, asc, desc, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/platform/db";
import {
  type ChatMessage,
  type ChatMessageContent,
  type ChatMessageRole,
  chatMessages,
  type ChatThread,
  chatThreads,
} from "@/platform/db/schema";

/** A projected, serializable message coming from the client (no render closures). */
export type IncomingChatMessage = {
  id: string;
  role: ChatMessageRole;
  seq: number;
  content: ChatMessageContent;
};

/**
 * Create or touch a thread. If a row with `id` exists AND belongs to `userId`, its
 * `updatedAt` (and title, when provided) is bumped; otherwise a new row is inserted.
 * Returns the thread, or null if the DB is unavailable.
 */
export async function upsertThread(
  userId: string,
  input: { id?: string; clientId?: string | null; title?: string | null }
): Promise<ChatThread | null> {
  try {
    if (input.id) {
      const existing = await db
        .select()
        .from(chatThreads)
        .where(and(eq(chatThreads.id, input.id), eq(chatThreads.userId, userId)))
        .limit(1);
      if (existing[0]) {
        const [row] = await db
          .update(chatThreads)
          .set({
            updatedAt: new Date(),
            ...(input.title !== undefined ? { title: input.title } : {}),
          })
          .where(and(eq(chatThreads.id, input.id), eq(chatThreads.userId, userId)))
          .returning();
        return row ?? existing[0];
      }
    }
    const [row] = await db
      .insert(chatThreads)
      .values({
        ...(input.id ? { id: input.id } : {}),
        userId,
        clientId: input.clientId ?? null,
        title: input.title ?? null,
      })
      .returning();
    return row ?? null;
  } catch (err) {
    console.error("[chat] upsertThread failed:", err);
    return null;
  }
}

/** A user's threads, most-recently-updated first. Empty on any error. */
export async function listThreads(
  userId: string,
  opts: { includeArchived?: boolean; limit?: number } = {}
): Promise<ChatThread[]> {
  const { includeArchived = false, limit = 100 } = opts;
  try {
    return await db
      .select()
      .from(chatThreads)
      .where(
        includeArchived
          ? eq(chatThreads.userId, userId)
          : and(eq(chatThreads.userId, userId), isNull(chatThreads.archivedAt))
      )
      .orderBy(desc(chatThreads.updatedAt))
      .limit(limit);
  } catch (err) {
    console.error("[chat] listThreads failed:", err);
    return [];
  }
}

/** One thread, only if it belongs to the user. Null otherwise / on error. */
export async function getThread(
  userId: string,
  id: string
): Promise<ChatThread | null> {
  try {
    const rows = await db
      .select()
      .from(chatThreads)
      .where(and(eq(chatThreads.id, id), eq(chatThreads.userId, userId)))
      .limit(1);
    return rows[0] ?? null;
  } catch (err) {
    console.error("[chat] getThread failed:", err);
    return null;
  }
}

/** A thread's messages in order. Empty on error or if the thread isn't the user's. */
export async function getThreadMessages(
  userId: string,
  threadId: string
): Promise<ChatMessage[]> {
  try {
    // Messages carry a denormalized userId, so one scoped query is enough — no
    // separate ownership check needed.
    return await db
      .select()
      .from(chatMessages)
      .where(
        and(eq(chatMessages.threadId, threadId), eq(chatMessages.userId, userId))
      )
      .orderBy(asc(chatMessages.seq));
  } catch (err) {
    console.error("[chat] getThreadMessages failed:", err);
    return [];
  }
}

/**
 * Upsert the projected transcript for a thread (idempotent by message id) and bump
 * the thread's updatedAt. Ensures the thread exists + belongs to the user first.
 * Returns the number of messages written, or 0 on any failure.
 */
export async function saveMessages(
  userId: string,
  threadId: string,
  messages: IncomingChatMessage[],
  meta: { clientId?: string | null; title?: string | null } = {}
): Promise<number> {
  if (messages.length === 0) return 0;
  try {
    // Ensure the thread row exists and is owned by this user (idempotent).
    const thread = await upsertThread(userId, {
      id: threadId,
      clientId: meta.clientId,
      title: meta.title,
    });
    if (!thread) return 0;

    const rows = messages.map((m) => ({
      id: m.id,
      threadId,
      userId,
      role: m.role,
      seq: m.seq,
      content: m.content,
    }));

    await db
      .insert(chatMessages)
      .values(rows)
      .onConflictDoUpdate({
        target: chatMessages.id,
        set: {
          role: sqlExcluded("role"),
          seq: sqlExcluded("seq"),
          content: sqlExcluded("content"),
        },
      });

    return rows.length;
  } catch (err) {
    console.error("[chat] saveMessages failed:", err);
    return 0;
  }
}

/** Rename a thread (user-scoped). False on error / not found. */
export async function renameThread(
  userId: string,
  id: string,
  title: string
): Promise<boolean> {
  try {
    const res = await db
      .update(chatThreads)
      .set({ title, updatedAt: new Date() })
      .where(and(eq(chatThreads.id, id), eq(chatThreads.userId, userId)))
      .returning({ id: chatThreads.id });
    return res.length > 0;
  } catch (err) {
    console.error("[chat] renameThread failed:", err);
    return false;
  }
}

/** Archive (soft-hide) a thread. False on error / not found. */
export async function archiveThread(
  userId: string,
  id: string
): Promise<boolean> {
  try {
    const res = await db
      .update(chatThreads)
      .set({ archivedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(chatThreads.id, id), eq(chatThreads.userId, userId)))
      .returning({ id: chatThreads.id });
    return res.length > 0;
  } catch (err) {
    console.error("[chat] archiveThread failed:", err);
    return false;
  }
}

/** Hard-delete a thread and its messages (FK cascade). False on error / not found. */
export async function deleteThread(
  userId: string,
  id: string
): Promise<boolean> {
  try {
    const res = await db
      .delete(chatThreads)
      .where(and(eq(chatThreads.id, id), eq(chatThreads.userId, userId)))
      .returning({ id: chatThreads.id });
    return res.length > 0;
  } catch (err) {
    console.error("[chat] deleteThread failed:", err);
    return false;
  }
}

// Reference the INSERT's excluded row in an ON CONFLICT DO UPDATE (Postgres upsert).
// Drizzle's `sql` tag builds `excluded."<col>"` so an upsert overwrites with the
// incoming values rather than the stored ones.
function sqlExcluded(column: "role" | "seq" | "content") {
  return sql.raw(`excluded."${column}"`);
}
