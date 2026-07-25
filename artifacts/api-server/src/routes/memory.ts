import { Router } from "express";
import { db, assistantMemories, desc, eq, and } from "@workspace/db";
import { customAlphabet } from "nanoid";
import type { AssistantMemoryKind, AssistantMemorySource } from "@workspace/db";

const generateId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 21);
const router = Router();

// GET /api/assistant/memory — return memories for the current user
router.get("/memory", async (req, res) => {
  try {
    const memories = await db
      .select()
      .from(assistantMemories)
      .where(eq(assistantMemories.userId, req.userId))
      .orderBy(desc(assistantMemories.createdAt))
      .limit(200);
    res.json({
      memories: memories.map((m) => ({
        ...m,
        createdAt: m.createdAt?.toISOString(),
      })),
    });
  } catch {
    res.json({ memories: [] });
  }
});

// POST /api/assistant/memory — save a memory for the current user
router.post("/memory", async (req, res) => {
  try {
    const { content, subject, clientId, fiscalYear, workflowId, kind, source } = req.body as {
      content: string;
      subject?: string;
      clientId?: string;
      fiscalYear?: number;
      workflowId?: string;
      kind?: string;
      source?: string;
    };
    const validKinds: AssistantMemoryKind[] = ["preference", "fact", "scope"];
    const validSources: AssistantMemorySource[] = ["user", "assistant"];
    const [memory] = await db
      .insert(assistantMemories)
      .values({
        id: generateId(),
        userId: req.userId,
        content,
        subject: subject ?? null,
        clientId: clientId ?? null,
        fiscalYear: fiscalYear ?? null,
        workflowId: workflowId ?? null,
        kind: (validKinds.includes(kind as AssistantMemoryKind) ? kind : "fact") as AssistantMemoryKind,
        source: (validSources.includes(source as AssistantMemorySource) ? source : "user") as AssistantMemorySource,
        createdAt: new Date(),
      })
      .returning();
    res.status(201).json({ memory: { ...memory, createdAt: memory.createdAt?.toISOString() } });
  } catch (err) {
    req.log.error({ err }, "Failed to save memory");
    res.status(500).json({ error: "Failed to save memory" });
  }
});

// DELETE /api/assistant/memory?id=<id> — delete a memory owned by the current user
router.delete("/memory", async (req, res) => {
  try {
    const id = req.query.id as string;
    if (!id) {
      res.status(400).json({ error: "id required" });
      return;
    }
    // Ownership: only delete your own memories
    await db
      .delete(assistantMemories)
      .where(and(eq(assistantMemories.id, id), eq(assistantMemories.userId, req.userId)));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete memory");
    res.status(500).json({ error: "Failed to delete memory" });
  }
});

export default router;
