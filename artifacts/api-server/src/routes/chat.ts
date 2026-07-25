import { Router } from "express";
import { db, chatThreads, chatMessages, desc, eq, asc, and } from "@workspace/db";
import { customAlphabet } from "nanoid";

const generateId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 21);
const router = Router();

// GET /api/chat/threads — return threads belonging to the current user
router.get("/threads", async (req, res) => {
  try {
    const threads = await db
      .select()
      .from(chatThreads)
      .where(eq(chatThreads.userId, req.userId))
      .orderBy(desc(chatThreads.updatedAt))
      .limit(100);
    res.json({
      threads: threads.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
    });
  } catch {
    res.json({ threads: [] });
  }
});

// POST /api/chat/threads — upsert a thread owned by the current user
router.post("/threads", async (req, res) => {
  try {
    const { id, title, clientId } = req.body as {
      id?: string;
      title?: string;
      clientId?: string;
    };
    const threadId = id ?? generateId();
    const userId = req.userId;

    // Upsert — only touch threads owned by this user
    const existing = await db.query.chatThreads.findFirst({
      where: eq(chatThreads.id, threadId),
    });
    if (existing) {
      // Only allow updating your own thread
      if (existing.userId !== userId) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const [updated] = await db
        .update(chatThreads)
        .set({ updatedAt: new Date(), ...(title ? { title } : {}) })
        .where(eq(chatThreads.id, threadId))
        .returning();
      res.json({ thread: { ...updated, createdAt: updated.createdAt.toISOString(), updatedAt: updated.updatedAt.toISOString() } });
      return;
    }
    const [thread] = await db
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
    res.status(201).json({ thread: { ...thread, createdAt: thread.createdAt.toISOString(), updatedAt: thread.updatedAt.toISOString() } });
  } catch (err) {
    req.log.error({ err }, "Failed to upsert thread");
    res.status(500).json({ error: "Failed to upsert thread" });
  }
});

// GET /api/chat/threads/:threadId/messages — returns messages for a thread the user owns
router.get("/threads/:threadId/messages", async (req, res) => {
  try {
    const { threadId } = req.params;
    // Ownership check
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
        ...m,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch {
    res.json({ messages: [] });
  }
});

// POST /api/chat/threads/:threadId/messages — upsert a message into an owned thread.
// Ownership is verified before any write: the caller must own the thread.
router.post("/threads/:threadId/messages", async (req, res) => {
  try {
    const { threadId } = req.params;

    // Ownership gate: reject if the thread does not belong to this user.
    const ownerThread = await db.query.chatThreads.findFirst({
      where: and(eq(chatThreads.id, threadId), eq(chatThreads.userId, req.userId)),
    });
    if (!ownerThread) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }

    const { id, role, seq, content } = req.body as {
      id?: string;
      role: string;
      seq: number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      content: any;
    };
    const messageId = id ?? generateId();

    // Upsert: on id conflict, only update if the existing row belongs to this user's thread.
    // We achieve this by re-checking userId in the where clause on the update path.
    const existing = messageId
      ? await db.query.chatMessages.findFirst({ where: eq(chatMessages.id, messageId) })
      : null;

    if (existing) {
      // Reject cross-user message overwrites.
      if (existing.threadId !== threadId || existing.userId !== req.userId) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const [updated] = await db
        .update(chatMessages)
        .set({ content, seq })
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
        role: role as "user" | "assistant" | "system" | "tool",
        seq,
        content,
        createdAt: new Date(),
      })
      .returning();
    res.status(201).json({ message: { ...message, createdAt: message.createdAt.toISOString() } });
  } catch (err) {
    req.log.error({ err }, "Failed to save message");
    res.status(500).json({ error: "Failed to save message" });
  }
});

export default router;
