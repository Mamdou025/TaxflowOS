import { Router } from 'express';
import { createHash } from 'node:crypto';
import { pool } from '@workspace/db';
import {
  RecoveryCodeSchema,
  SaveLibraryRequestSchema,
} from '@workspace/workflow-contracts/storage-protocol';
import { validateBackup } from '../storage/validate-backup';
import { requireAccount } from '../security/access';

const router = Router();
router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT payload, revision, updated_at FROM workspace_libraries WHERE workspace_id=$1',
    [req.workspaceId],
  );
  res.set('Cache-Control', 'no-store').json(rows[0] ?? { payload: null, revision: 0 });
});
router.put('/', async (req, res) => {
  const parsed = SaveLibraryRequestSchema.strict().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid workflow backup or revision.' });
    return;
  }
  const { payload, revision } = parsed.data;
  try {
    validateBackup(payload);
  } catch {
    res.status(400).json({
      error: 'The backup is invalid or exceeds the supported limits. Your saved copy was retained.',
    });
    return;
  }
  const { rows } =
    revision === 0
      ? await pool.query(
          'INSERT INTO workspace_libraries (workspace_id,updated_by,payload) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING RETURNING revision,updated_at',
          [req.workspaceId, req.userId, payload],
        )
      : await pool.query(
          'UPDATE workspace_libraries SET payload=$3,revision=revision+1,updated_at=now(),updated_by=$2 WHERE workspace_id=$1 AND revision=$4 RETURNING revision,updated_at',
          [req.workspaceId, req.userId, payload, revision],
        );
  if (!rows.length) {
    res.status(409).json({
      error:
        'This workspace changed in another browser. Export your local backup, then reload the server copy before editing again.',
    });
    return;
  }
  res.json(rows[0]);
});
router.delete('/', async (req, res) => {
  // Keep a revisioned empty library so deletion/recreation cannot reuse an old
  // revision and admit a stale browser's compare-and-swap write.
  const { rows } = await pool.query(
    `INSERT INTO workspace_libraries (workspace_id,payload,updated_by) VALUES ($1,$2,$3)
    ON CONFLICT (workspace_id) DO UPDATE SET payload=EXCLUDED.payload,
      revision=workspace_libraries.revision+1,updated_at=now(),updated_by=EXCLUDED.updated_by
    RETURNING revision`,
    [
      req.workspaceId,
      JSON.stringify({ format: 'taxflow-workflow-backup-v1', library: {} }),
      req.userId,
    ],
  );
  res.json({ ok: true, revision: rows[0].revision });
});
router.post('/claim', requireAccount, async (req, res) => {
  const parsed = RecoveryCodeSchema.safeParse(req.body?.recoveryCode);
  if (!parsed.success || Object.keys(req.body).some((key) => key !== 'recoveryCode')) {
    res.status(400).json({ error: 'Supply a complete legacy recovery code.' });
    return;
  }
  const hash = createHash('sha256').update(parsed.data).digest('hex');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const legacy = await client.query(
      "SELECT payload FROM personal_workflow_libraries WHERE workspace_hash=$1 AND owner_id IN ('anonymous',$2) FOR UPDATE",
      [hash, req.userId],
    );
    const claimed = await client.query(
      'SELECT 1 FROM legacy_library_claims WHERE workspace_hash=$1',
      [hash],
    );
    if (!legacy.rowCount || claimed.rowCount) {
      res
        .status(409)
        .json({ error: 'This legacy library is unavailable or has already been claimed.' });
      return;
    }
    try {
      validateBackup(legacy.rows[0].payload);
    } catch {
      res
        .status(400)
        .json({ error: 'The legacy backup cannot be validated. Its original data was retained.' });
      return;
    }
    const saved = await client.query(
      'INSERT INTO workspace_libraries (workspace_id,payload,updated_by) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING RETURNING revision',
      [req.workspaceId, legacy.rows[0].payload, req.userId],
    );
    if (!saved.rowCount) {
      res
        .status(409)
        .json({ error: 'Claim into a new empty workspace to preserve its existing library.' });
      return;
    }
    await client.query(
      'INSERT INTO legacy_library_claims (workspace_hash,workspace_id,claimed_by) VALUES ($1,$2,$3)',
      [hash, req.workspaceId, req.userId],
    );
    await client.query('COMMIT');
    res.json({ ok: true, revision: 1 });
  } finally {
    await client.query('ROLLBACK');
    client.release();
  }
});
export default router;
