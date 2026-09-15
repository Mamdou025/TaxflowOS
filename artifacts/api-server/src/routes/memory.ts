import { Router } from 'express';
import { db, assistantMemories, desc, eq, and } from '@workspace/db';
import { customAlphabet } from 'nanoid';
import { z } from 'zod';

const generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 21);
const router = Router();
const MemoryInput = z
  .object({
    content: z.string().trim().min(1).max(100000),
    subject: z.string().max(1000).nullable().optional(),
    clientId: z.string().max(200).nullable().optional(),
    fiscalYear: z.number().int().min(1).max(9999).nullable().optional(),
    workflowId: z.string().max(200).nullable().optional(),
    kind: z.enum(['preference', 'fact', 'scope']).default('fact'),
    source: z.enum(['user', 'assistant']).default('user'),
  })
  .strict();

// GET /api/assistant/memory — return memories for the current workspace
router.get('/memory', async (req, res) => {
  try {
    const memories = await db
      .select()
      .from(assistantMemories)
      .where(eq(assistantMemories.workspaceId, req.workspaceId))
      .orderBy(desc(assistantMemories.createdAt))
      .limit(200);
    res.json({
      memories: memories.map((m) => ({
        ...m,
        createdAt: m.createdAt?.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error({ err }, 'Failed to list memories');
    res.status(503).json({ error: 'Memory storage is unavailable' });
  }
});

// POST /api/assistant/memory — save a memory for the current workspace
router.post('/memory', async (req, res) => {
  try {
    const parsed = MemoryInput.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid memory input' });
      return;
    }
    const { content, subject, clientId, fiscalYear, workflowId, kind, source } = parsed.data;
    const [memory] = await db
      .insert(assistantMemories)
      .values({
        id: generateId(),
        userId: req.userId,
        workspaceId: req.workspaceId,
        content,
        subject: subject ?? null,
        clientId: clientId ?? null,
        fiscalYear: fiscalYear ?? null,
        workflowId: workflowId ?? null,
        kind,
        source,
        createdAt: new Date(),
      })
      .returning();
    res.status(201).json({ memory: { ...memory, createdAt: memory.createdAt?.toISOString() } });
  } catch (err) {
    req.log.error({ err }, 'Failed to save memory');
    res.status(500).json({ error: 'Failed to save memory' });
  }
});

// DELETE /api/assistant/memory?id=<id> — delete a memory owned by the current workspace
router.delete('/memory', async (req, res) => {
  try {
    const id = req.query.id;
    if (typeof id !== 'string' || !id || id.length > 200) {
      res.status(400).json({ error: 'id required' });
      return;
    }
    // Ownership: only delete memories in the authorized workspace
    await db
      .delete(assistantMemories)
      .where(and(eq(assistantMemories.id, id), eq(assistantMemories.workspaceId, req.workspaceId)));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, 'Failed to delete memory');
    res.status(500).json({ error: 'Failed to delete memory' });
  }
});

export default router;
