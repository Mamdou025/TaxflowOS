import { Router } from 'express';
import { db, workflows, desc, eq, and } from '@workspace/db';
import { customAlphabet } from 'nanoid';
import { z } from 'zod';

const generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 21);
const router = Router();
const WorkflowInput = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    description: z.string().max(100000).nullable().optional(),
    nodes: z.array(z.record(z.string(), z.unknown())).optional(),
    edges: z.array(z.record(z.string(), z.unknown())).optional(),
    visibility: z.enum(['private', 'public']).optional(),
  })
  .strict();

// List workflows for the current workspace
router.get('/', async (req, res) => {
  try {
    const userWorkflows = await db
      .select()
      .from(workflows)
      .where(eq(workflows.workspaceId, req.workspaceId))
      .orderBy(desc(workflows.updatedAt));

    res.json(
      userWorkflows.map((w) => ({
        ...w,
        createdAt: w.createdAt.toISOString(),
        updatedAt: w.updatedAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, 'Failed to list workflows');
    res.status(500).json({ error: 'Failed to list workflows' });
  }
});

// Create workflow
router.post('/', async (req, res) => {
  try {
    const parsed = WorkflowInput.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid workflow input' });
      return;
    }
    const { name, description, nodes, edges, visibility } = parsed.data;
    const id = generateId();
    const [workflow] = await db
      .insert(workflows)
      .values({
        id,
        name: name ?? 'Untitled',
        description,
        userId: req.userId,
        workspaceId: req.workspaceId,
        nodes: nodes ?? [],
        edges: edges ?? [],
        visibility: visibility ?? 'private',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    res.status(201).json({
      ...workflow,
      createdAt: workflow.createdAt.toISOString(),
      updatedAt: workflow.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, 'Failed to create workflow');
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

// Get workflow by ID — scoped to the current workspace
router.get('/:workflowId', async (req, res) => {
  try {
    const { workflowId } = req.params;
    const workflow = await db.query.workflows.findFirst({
      where: and(eq(workflows.id, workflowId), eq(workflows.workspaceId, req.workspaceId)),
    });
    if (!workflow) {
      res.status(404).json({ error: 'Workflow not found' });
      return;
    }
    res.json({
      ...workflow,
      createdAt: workflow.createdAt.toISOString(),
      updatedAt: workflow.updatedAt.toISOString(),
      isOwner: req.workspaceRole === 'owner',
      canEdit: req.workspaceRole !== 'viewer',
    });
  } catch (err) {
    req.log.error({ err }, 'Failed to get workflow');
    res.status(500).json({ error: 'Failed to get workflow' });
  }
});

// Update workflow — scoped to the current workspace
router.patch('/:workflowId', async (req, res) => {
  try {
    const { workflowId } = req.params;
    const parsed = WorkflowInput.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid workflow input' });
      return;
    }
    const updates = { ...parsed.data, updatedAt: new Date() };
    const [updated] = await db
      .update(workflows)
      .set(updates)
      .where(and(eq(workflows.id, workflowId), eq(workflows.workspaceId, req.workspaceId)))
      .returning();
    if (!updated) {
      res.status(404).json({ error: 'Workflow not found' });
      return;
    }
    res.json({
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, 'Failed to update workflow');
    res.status(500).json({ error: 'Failed to update workflow' });
  }
});

// Delete workflow — scoped to the current workspace
router.delete('/:workflowId', async (req, res) => {
  try {
    const { workflowId } = req.params;
    await db
      .delete(workflows)
      .where(and(eq(workflows.id, workflowId), eq(workflows.workspaceId, req.workspaceId)));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, 'Failed to delete workflow');
    res.status(500).json({ error: 'Failed to delete workflow' });
  }
});

export default router;
