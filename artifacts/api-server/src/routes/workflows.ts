import { Router } from "express";
import { db, workflows, desc, eq, and } from "@workspace/db";
import { customAlphabet } from "nanoid";

const generateId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 21);
const router = Router();

// List workflows for the current user
router.get("/", async (req, res) => {
  try {
    const userWorkflows = await db
      .select()
      .from(workflows)
      .where(eq(workflows.userId, req.userId))
      .orderBy(desc(workflows.updatedAt));

    res.json(
      userWorkflows.map((w) => ({
        ...w,
        createdAt: w.createdAt.toISOString(),
        updatedAt: w.updatedAt.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list workflows");
    res.status(500).json({ error: "Failed to list workflows" });
  }
});

// Create workflow
router.post("/", async (req, res) => {
  try {
    const { name, description, nodes, edges, visibility } = req.body as {
      name?: string;
      description?: string;
      nodes?: unknown[];
      edges?: unknown[];
      visibility?: "private" | "public";
    };
    const id = generateId();
    const [workflow] = await db
      .insert(workflows)
      .values({
        id,
        name: name ?? "Untitled",
        description,
        userId: req.userId,
        nodes: nodes ?? [],
        edges: edges ?? [],
        visibility: visibility ?? "private",
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
    req.log.error({ err }, "Failed to create workflow");
    res.status(500).json({ error: "Failed to create workflow" });
  }
});

// Get workflow by ID — scoped to the current user
router.get("/:workflowId", async (req, res) => {
  try {
    const { workflowId } = req.params;
    const workflow = await db.query.workflows.findFirst({
      where: and(eq(workflows.id, workflowId), eq(workflows.userId, req.userId)),
    });
    if (!workflow) {
      res.status(404).json({ error: "Workflow not found" });
      return;
    }
    res.json({
      ...workflow,
      createdAt: workflow.createdAt.toISOString(),
      updatedAt: workflow.updatedAt.toISOString(),
      isOwner: true,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get workflow");
    res.status(500).json({ error: "Failed to get workflow" });
  }
});

// Update workflow — scoped to the current user
router.patch("/:workflowId", async (req, res) => {
  try {
    const { workflowId } = req.params;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    const body = req.body as Record<string, unknown>;
    for (const key of ["name", "description", "nodes", "edges", "visibility"]) {
      if (body[key] !== undefined) updates[key] = body[key];
    }
    const [updated] = await db
      .update(workflows)
      .set(updates)
      .where(and(eq(workflows.id, workflowId), eq(workflows.userId, req.userId)))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Workflow not found" });
      return;
    }
    res.json({
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update workflow");
    res.status(500).json({ error: "Failed to update workflow" });
  }
});

// Delete workflow — scoped to the current user
router.delete("/:workflowId", async (req, res) => {
  try {
    const { workflowId } = req.params;
    await db
      .delete(workflows)
      .where(and(eq(workflows.id, workflowId), eq(workflows.userId, req.userId)));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete workflow");
    res.status(500).json({ error: "Failed to delete workflow" });
  }
});

export default router;
