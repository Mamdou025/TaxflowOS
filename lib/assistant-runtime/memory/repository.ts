// ─────────────────────────────────────────────────────────────────────────────
// Memory repository — Postgres/Drizzle CRUD, server-only, FAIL-SOFT.
//
// Every call is wrapped so a missing/unreachable database degrades to "no memory"
// (empty list / null / false) instead of throwing — the chat must keep working
// without a DB, exactly like the app's other DB-backed routes.
// ─────────────────────────────────────────────────────────────────────────────

import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { assistantMemories, type AssistantMemory, type NewAssistantMemory } from '@/lib/db/schema';

/** Insert a memory. Returns the row, or null if the DB is unavailable. */
export async function insertMemory(input: NewAssistantMemory): Promise<AssistantMemory | null> {
  try {
    const [row] = await db.insert(assistantMemories).values(input).returning();
    return row ?? null;
  } catch (err) {
    console.error('[assistant-memory] insert failed:', err);
    return null;
  }
}

/** All of a user's memories (most recent first), capped. Empty on any error. */
export async function listMemoriesForUser(userId: string, limit = 200): Promise<AssistantMemory[]> {
  try {
    return await db
      .select()
      .from(assistantMemories)
      .where(eq(assistantMemories.userId, userId))
      .orderBy(desc(assistantMemories.createdAt))
      .limit(limit);
  } catch (err) {
    console.error('[assistant-memory] list failed:', err);
    return [];
  }
}

/** Delete one of the user's memories by id. False on error or not-found. */
export async function deleteMemory(userId: string, id: string): Promise<boolean> {
  try {
    const res = await db
      .delete(assistantMemories)
      .where(and(eq(assistantMemories.id, id), eq(assistantMemories.userId, userId)))
      .returning({ id: assistantMemories.id });
    return res.length > 0;
  } catch (err) {
    console.error('[assistant-memory] delete failed:', err);
    return false;
  }
}
