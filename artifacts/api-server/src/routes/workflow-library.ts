import { Router } from 'express';
import { createHash } from 'node:crypto';
import { pool } from '@workspace/db';

const router = Router();
let ready: Promise<unknown> | undefined;
function initialize() {
  return ready ??= pool.query(`CREATE TABLE IF NOT EXISTS personal_workflow_libraries (
    workspace_hash text PRIMARY KEY, owner_id text NOT NULL, payload text NOT NULL,
    revision integer NOT NULL DEFAULT 1, updated_at timestamptz NOT NULL DEFAULT now()
  )`).catch(error => { ready = undefined; throw error; });
}
router.use(async (req, res, next) => {
  const key = req.header('x-workflow-workspace');
  // Possession of this unguessable recovery code grants access to this workspace.
  // Keep it out of URLs, logs, and the ordinary anonymous workflow listing.
  if (!key || !/^[a-f0-9]{64}$/.test(key)) { res.status(401).json({ error: 'A valid workspace recovery code is required.' }); return; }
  res.locals.workspaceHash = createHash('sha256').update(key).digest('hex');
  try { await initialize(); next(); } catch { res.status(503).json({ error: 'Workflow storage is unavailable. Your local copy has not been replaced.' }); }
});
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT payload, revision, updated_at FROM personal_workflow_libraries WHERE workspace_hash=$1 AND owner_id=$2', [res.locals.workspaceHash, req.userId]);
    res.set('Cache-Control', 'no-store').json(rows[0] ?? { payload: null, revision: 0 });
  } catch { res.status(503).json({ error: 'Could not load saved workflows.' }); }
});
router.put('/', async (req, res) => {
  const { payload, revision } = req.body ?? {};
  if (typeof payload !== 'string' || payload.length > 20_000_000 || !Number.isInteger(revision) || revision < 0) {
    res.status(400).json({ error: 'Invalid workflow backup or revision.' }); return;
  }
  try {
    const { rows } = revision === 0
      ? await pool.query('INSERT INTO personal_workflow_libraries (workspace_hash,owner_id,payload) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING RETURNING revision,updated_at', [res.locals.workspaceHash, req.userId, payload])
      : await pool.query('UPDATE personal_workflow_libraries SET payload=$3,revision=revision+1,updated_at=now() WHERE workspace_hash=$1 AND owner_id=$2 AND revision=$4 RETURNING revision,updated_at', [res.locals.workspaceHash, req.userId, payload, revision]);
    if (!rows.length) { res.status(409).json({ error: 'This workspace changed in another browser. Export your local backup, then reload the server copy before editing again.' }); return; }
    res.json(rows[0]);
  } catch { res.status(503).json({ error: 'Server save failed. Your local changes are still available; retry or export a backup.' }); }
});
router.delete('/', async (req, res) => {
  try {
    await pool.query('DELETE FROM personal_workflow_libraries WHERE workspace_hash=$1 AND owner_id=$2', [res.locals.workspaceHash, req.userId]);
    res.json({ ok: true });
  } catch { res.status(503).json({ error: 'Could not remove this workspace.' }); }
});
export default router;
