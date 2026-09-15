import type { RequestHandler } from 'express';
import { randomUUID } from 'node:crypto';
import { pool } from '@workspace/db';

// Called only after session/origin verification. Retrying or opening another tab
// must recover the same guest workspace, never create a shared anonymous account.
export const openDemoWorkspace: RequestHandler = async (req, res) => {
  if (!req.isDemo) {
    res.status(403).json({ error: 'This operation requires a demo session.' });
    return;
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT id FROM users WHERE id=$1 FOR UPDATE', [req.userId]);
    const existing = await client.query(
      `SELECT w.id,w.name,m.role FROM workspaces w JOIN workspace_members m
       ON w.id=m.workspace_id WHERE w.created_by=$1 AND m.user_id=$1`,
      [req.userId],
    );
    let workspace = existing.rows[0];
    if (!workspace) {
      workspace = { id: randomUUID(), name: 'Demo workspace', role: 'owner' };
      await client.query('INSERT INTO workspaces(id,name,created_by) VALUES($1,$2,$3)', [
        workspace.id,
        workspace.name,
        req.userId,
      ]);
      await client.query(
        "INSERT INTO workspace_members(workspace_id,user_id,role) VALUES($1,$2,'owner')",
        [workspace.id, req.userId],
      );
    }
    await client.query('COMMIT');
    res.set('Cache-Control', 'no-store').json({ workspaces: [workspace] });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
