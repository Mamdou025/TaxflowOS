import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { pool } from '@workspace/db';
import { CreateWorkspaceSchema, MemberSchema, WorkspaceIdSchema } from '@workspace/api-zod/access';
import { requireAccount } from '../security/access';
import { openDemoWorkspace } from './demo-workspace';

const router = Router();
router.post('/demo', openDemoWorkspace);
router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT w.id,w.name,m.role FROM workspaces w JOIN workspace_members m
    ON w.id=m.workspace_id WHERE m.user_id=$1 ORDER BY w.created_at,w.id`,
    [req.userId],
  );
  res.json({ workspaces: rows });
});
router.post('/', requireAccount, async (req, res) => {
  const parsed = CreateWorkspaceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Workspace name must contain 1–100 characters.' });
    return;
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const id = randomUUID();
    await client.query('INSERT INTO workspaces (id,name,created_by) VALUES ($1,$2,$3)', [
      id,
      parsed.data.name,
      req.userId,
    ]);
    await client.query(
      "INSERT INTO workspace_members (workspace_id,user_id,role) VALUES ($1,$2,'owner')",
      [id, req.userId],
    );
    await client.query('COMMIT');
    res.status(201).json({ id, name: parsed.data.name, role: 'owner' });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});
router.get('/:id/members', async (req, res) => {
  const parsed = WorkspaceIdSchema.safeParse(req.params.id);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid workspace.' });
    return;
  }
  const member = await pool.query(
    'SELECT 1 FROM workspace_members WHERE workspace_id=$1 AND user_id=$2',
    [parsed.data, req.userId],
  );
  if (!member.rowCount) {
    res.status(403).json({ error: 'Workspace access denied.' });
    return;
  }
  const { rows } = await pool.query(
    `SELECT m.user_id AS "userId",u.name,m.role FROM workspace_members m
    JOIN users u ON m.user_id=u.id WHERE m.workspace_id=$1 ORDER BY u.name,m.user_id`,
    [parsed.data],
  );
  res.json({ members: rows });
});
// Membership uses an exact account ID, never an unverified email-address claim.
router.put('/:id/members', requireAccount, async (req, res) => {
  const id = WorkspaceIdSchema.safeParse(req.params.id);
  const body = MemberSchema.safeParse(req.body);
  if (!id.success || !body.success) {
    res.status(400).json({ error: 'Supply a workspace, account ID and role.' });
    return;
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT id FROM workspaces WHERE id=$1 FOR UPDATE', [id.data]);
    const owner = await client.query(
      "SELECT 1 FROM workspace_members WHERE workspace_id=$1 AND user_id=$2 AND role='owner'",
      [id.data, req.userId],
    );
    if (!owner.rowCount) {
      res.status(403).json({ error: 'Only an Owner can manage members.' });
      return;
    }
    const account = await client.query(
      "SELECT 1 FROM users WHERE id=$1 AND id<>'anonymous' AND is_anonymous IS NOT TRUE",
      [body.data.userId],
    );
    if (!account.rowCount) {
      res.status(400).json({ error: 'That account ID is unavailable.' });
      return;
    }
    const owners = await client.query(
      "SELECT user_id FROM workspace_members WHERE workspace_id=$1 AND role='owner'",
      [id.data],
    );
    if (
      body.data.role !== 'owner' &&
      owners.rows.length === 1 &&
      owners.rows[0].user_id === body.data.userId
    ) {
      res.status(409).json({ error: 'A workspace must retain at least one Owner.' });
      return;
    }
    await client.query(
      `INSERT INTO workspace_members (workspace_id,user_id,role) VALUES ($1,$2,$3)
      ON CONFLICT (workspace_id,user_id) DO UPDATE SET role=EXCLUDED.role`,
      [id.data, body.data.userId, body.data.role],
    );
    await client.query('COMMIT');
    res.json({ ok: true });
  } finally {
    await client.query('ROLLBACK');
    client.release();
  }
});
router.delete('/:id/members/:userId', requireAccount, async (req, res) => {
  if (!WorkspaceIdSchema.safeParse(req.params.id).success) {
    res.status(400).json({ error: 'Invalid workspace.' });
    return;
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT id FROM workspaces WHERE id=$1 FOR UPDATE', [req.params.id]);
    const owner = await client.query(
      "SELECT 1 FROM workspace_members WHERE workspace_id=$1 AND user_id=$2 AND role='owner'",
      [req.params.id, req.userId],
    );
    if (!owner.rowCount) {
      res.status(403).json({ error: 'Only an Owner can remove members.' });
      return;
    }
    const owners = await client.query(
      "SELECT user_id FROM workspace_members WHERE workspace_id=$1 AND role='owner'",
      [req.params.id],
    );
    if (owners.rows.length === 1 && owners.rows[0].user_id === req.params.userId) {
      res.status(409).json({ error: 'A workspace must retain at least one Owner.' });
      return;
    }
    await client.query('DELETE FROM workspace_members WHERE workspace_id=$1 AND user_id=$2', [
      req.params.id,
      req.params.userId,
    ]);
    await client.query('COMMIT');
    res.json({ ok: true });
  } finally {
    await client.query('ROLLBACK');
    client.release();
  }
});
export default router;
