import { Router } from "express";
import { db, chatThreads, chatMessages, desc, eq, asc, and } from "@workspace/db";
import { customAlphabet } from "nanoid";

const generateId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 21);
const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// Saved chats API. The client (features/assistant/runtime/chat) speaks a BATCH
// contract — it autosaves the WHOLE projected transcript in one call and never
// pre-creates the thread — so these handlers upsert the thread on demand and
// replace its messages. Everything is scoped to req.userId (the anonymous user
// until a real auth layer lands). See message-codec.ts for the ProjectedMessage
// shape ({ id, role, seq, content:{text?,toolCall?} }).
// ─────────────────────────────────────────────────────────────────────────────

type ProjectedMessage = {
  id?: string;
  role: "user" | "assistant" | "tool" | "system";
  seq?: number;
  content?: unknown;
};

const isoThread = (t: typeof chatThreads.$inferSelect) => ({
  ...t,
  createdAt: t.createdAt.toISOString(),
  updatedAt: t.updatedAt.toISOString(),
});

// Ensure a thread exists and is owned by `userId`; create it if missing, and
// refresh updatedAt (+ title, when provided). Returns null if it exists but is
// owned by someone else.
async function ensureOwnedThread(
  threadId: string,
  userId: string,
  title?: string | null,
  clientId?: string | null,
) {
  const existing = await db.query.chatThreads.findFirst({
    where: eq(chatThreads.id, threadId),
  });
  if (existing) {
    if (existing.userId !== userId) return null;
    const [updated] = await db
      .update(chatThreads)
      .set({ updatedAt: new Date(), ...(title ? { title } : {}) })
      .where(eq(chatThreads.id, threadId))
      .returning();
    return updated;
  }
  const [created] = await db
    .insert(chatThreads)
    .values({
      id: threadId,
      userId,
      title: title ?? null,
      clientId: clientId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return created;
}

// GET /api/chat/threads — list the current user's threads, most-recent first.
router.get("/threads", async (req, res) => {
  try {
    const threads = await db
      .select()
      .from(chatThreads)
      .where(eq(chatThreads.userId, req.userId))
      .orderBy(desc(chatThreads.updatedAt))
      .limit(100);
    res.json({ threads: threads.map(isoThread) });
  } catch {
    res.json({ threads: [] });
  }
});

// POST /api/chat/threads — explicit upsert of a thread (kept for completeness;
// the batch message save below also upserts, so the client rarely needs this).
router.post("/threads", async (req, res) => {
  try {
    const { id, title, clientId } = req.body as {
      id?: string;
      title?: string;
      clientId?: string;
    };
    const thread = await ensureOwnedThread(id ?? generateId(), req.userId, title, clientId);
    if (!thread) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    res.status(201).json({ thread: isoThread(thread) });
  } catch (err) {
    req.log.error({ err }, "Failed to upsert thread");
    res.status(500).json({ error: "Failed to upsert thread" });
  }
});

// GET /api/chat/threads/:threadId — the thread + its full transcript, ordered by
// seq. This is what the client's loadThread() restores from.
router.get("/threads/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    const thread = await db.query.chatThreads.findFirst({
      where: eq(chatThreads.id, threadId),
    });
    if (!thread || thread.userId !== req.userId) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.threadId, threadId))
      .orderBy(asc(chatMessages.seq));
    res.json({
      thread: isoThread(thread),
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role,
        seq: m.seq,
        content: m.content,
      })),
    });
  } catch {
    res.json({ messages: [] });
  }
});

// GET /api/chat/threads/:threadId/messages — same transcript, messages only.
router.get("/threads/:threadId/messages", async (req, res) => {
  try {
    const { threadId } = req.params;
    const thread = await db.query.chatThreads.findFirst({
      where: eq(chatThreads.id, threadId),
    });
    if (!thread || thread.userId !== req.userId) {
      res.json({ messages: [] });
      return;
    }
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.threadId, threadId))
      .orderBy(asc(chatMessages.seq));
    res.json({
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role,
        seq: m.seq,
        content: m.content,
      })),
    });
  } catch {
    res.json({ messages: [] });
  }
});

// POST /api/chat/threads/:threadId/messages — the autosave endpoint.
//   • BATCH  (client): body = { messages: ProjectedMessage[], title? } → upsert
//     the thread (creating it if new) and REPLACE its transcript with the batch.
//   • SINGLE (legacy): body = { id, role, seq, content } → upsert one message.
router.post("/threads/:threadId/messages", async (req, res) => {
  try {
    const { threadId } = req.params;
    const body = req.body as {
      messages?: ProjectedMessage[];
      title?: string | null;
      clientId?: string | null;
    } & ProjectedMessage;

    // ── BATCH: whole-transcript replace ──────────────────────────────────────
    if (Array.isArray(body.messages)) {
      const thread = await ensureOwnedThread(
        threadId,
        req.userId,
        body.title,
        body.clientId,
      );
      if (!thread) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const rows = body.messages
        .filter((m) => m && m.role)
        .map((m, i) => ({
          id: m.id ?? generateId(),
          threadId,
          userId: req.userId,
          role: m.role,
          seq: typeof m.seq === "number" ? m.seq : i,
          content: (m.content ?? {}) as (typeof chatMessages.$inferInsert)["content"],
          createdAt: new Date(),
        }));

      // Replace atomically so a save can never leave a half-written transcript.
      await db.transaction(async (tx) => {
        await tx.delete(chatMessages).where(eq(chatMessages.threadId, threadId));
        if (rows.length > 0) await tx.insert(chatMessages).values(rows);
      });

      res.json({ ok: true, count: rows.length });
      return;
    }

    // ── SINGLE (legacy) ──────────────────────────────────────────────────────
    const ownerThread = await ensureOwnedThread(threadId, req.userId);
    if (!ownerThread) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const { id, role, seq, content } = body;
    const messageId = id ?? generateId();
    const existing = await db.query.chatMessages.findFirst({
      where: eq(chatMessages.id, messageId),
    });
    if (existing) {
      if (existing.threadId !== threadId || existing.userId !== req.userId) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const [updated] = await db
        .update(chatMessages)
        .set({ content: content as (typeof chatMessages.$inferInsert)["content"], seq: seq ?? existing.seq })
        .where(and(eq(chatMessages.id, messageId), eq(chatMessages.userId, req.userId)))
        .returning();
      res.json({ message: { ...updated, createdAt: updated.createdAt.toISOString() } });
      return;
    }
    const [message] = await db
      .insert(chatMessages)
      .values({
        id: messageId,
        threadId,
        userId: req.userId,
        role: role,
        seq: seq ?? 0,
        content: (content ?? {}) as (typeof chatMessages.$inferInsert)["content"],
        createdAt: new Date(),
      })
      .returning();
    res.status(201).json({ message: { ...message, createdAt: message.createdAt.toISOString() } });
  } catch (err) {
    req.log.error({ err }, "Failed to save messages");
    res.status(500).json({ error: "Failed to save messages" });
  }
});

// PATCH /api/chat/threads/:threadId — rename (title) an owned thread.
router.patch("/threads/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    const { title } = req.body as { title?: string };
    const owned = await db.query.chatThreads.findFirst({
      where: and(eq(chatThreads.id, threadId), eq(chatThreads.userId, req.userId)),
    });
    if (!owned) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }
    const [updated] = await db
      .update(chatThreads)
      .set({ title: title ?? null, updatedAt: new Date() })
      .where(eq(chatThreads.id, threadId))
      .returning();
    res.json({ thread: isoThread(updated) });
  } catch (err) {
    req.log.error({ err }, "Failed to rename thread");
    res.status(500).json({ error: "Failed to rename thread" });
  }
});

// DELETE /api/chat/threads/:threadId — delete an owned thread and its messages.
router.delete("/threads/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    const owned = await db.query.chatThreads.findFirst({
      where: and(eq(chatThreads.id, threadId), eq(chatThreads.userId, req.userId)),
    });
    if (!owned) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }
    // Delete messages first (works whether or not the FK cascades at the DB level).
    await db.delete(chatMessages).where(eq(chatMessages.threadId, threadId));
    await db.delete(chatThreads).where(eq(chatThreads.id, threadId));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete thread");
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

export default router;
