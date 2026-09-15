import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { pool } from '@workspace/db';

const router = Router();
const Id = z.string().min(1).max(200);
const Title = z.string().max(500).nullable().optional();
const Message = z
  .object({
    id: Id.optional(),
    role: z.enum(['user', 'assistant', 'tool', 'system']),
    seq: z.number().int().nonnegative().max(100000).optional(),
    content: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();
const Batch = z
  .object({
    messages: z.array(Message).max(2000),
    title: Title,
    clientId: Id.nullable().optional(),
  })
  .strict();
const Thread = z
  .object({ id: Id.optional(), title: Title, clientId: Id.nullable().optional() })
  .strict();
router.get('/threads', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM chat_threads WHERE workspace_id=$1 ORDER BY updated_at DESC LIMIT 100',
    [req.workspaceId],
  );
  res.json({ threads: rows.map(thread) });
});
function thread(row: Record<string, unknown>) {
  return {
    id: row.id,
    title: row.title,
    clientId: row.client_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at,
  };
}
router.post('/threads', async (req, res) => {
  const parsed = Thread.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid chat thread.' });
    return;
  }
  const { rows } = await pool.query(
    `INSERT INTO chat_threads (id,user_id,workspace_id,title,client_id) VALUES ($1,$2,$3,$4,$5)
    ON CONFLICT(id) DO UPDATE SET updated_at=now(),title=COALESCE(EXCLUDED.title,chat_threads.title)
    WHERE chat_threads.workspace_id=EXCLUDED.workspace_id RETURNING *`,
    [
      parsed.data.id ?? randomUUID(),
      req.userId,
      req.workspaceId,
      parsed.data.title ?? null,
      parsed.data.clientId ?? null,
    ],
  );
  if (!rows.length) {
    res.status(403).json({ error: 'Thread access denied.' });
    return;
  }
  res.status(201).json({ thread: thread(rows[0]) });
});
router.get(['/threads/:threadId', '/threads/:threadId/messages'], async (req, res) => {
  const owned = await pool.query('SELECT * FROM chat_threads WHERE id=$1 AND workspace_id=$2', [
    req.params.threadId,
    req.workspaceId,
  ]);
  if (!owned.rowCount) {
    res.status(404).json({ error: 'Thread not found.' });
    return;
  }
  const { rows } = await pool.query(
    'SELECT id,role,seq,content FROM chat_messages WHERE thread_id=$1 AND workspace_id=$2 ORDER BY seq',
    [req.params.threadId, req.workspaceId],
  );
  res.json({ thread: thread(owned.rows[0]), messages: rows });
});
router.post('/threads/:threadId/messages', async (req, res) => {
  const batch = Batch.safeParse(req.body);
  const single = Message.safeParse(req.body);
  if (!Id.safeParse(req.params.threadId).success || (!batch.success && !single.success)) {
    res.status(400).json({ error: 'Invalid chat messages.' });
    return;
  }
  const input = batch.success ? batch.data.messages : single.success ? [single.data] : [];
  const rows = Array.from(
    new Map(
      input.map((message, i) => {
        const value = {
          id: message.id ?? randomUUID(),
          role: message.role,
          seq: message.seq ?? i,
          content: message.content ?? {},
        };
        return [value.id, value];
      }),
    ).values(),
  );
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const owned = await client.query(
      `INSERT INTO chat_threads(id,user_id,workspace_id,title,client_id) VALUES($1,$2,$3,$4,$5)
      ON CONFLICT(id) DO UPDATE SET updated_at=now(),title=COALESCE(EXCLUDED.title,chat_threads.title)
      WHERE chat_threads.workspace_id=EXCLUDED.workspace_id RETURNING id`,
      [
        req.params.threadId,
        req.userId,
        req.workspaceId,
        batch.success ? (batch.data.title ?? null) : null,
        batch.success ? (batch.data.clientId ?? null) : null,
      ],
    );
    if (!owned.rowCount) {
      res.status(403).json({ error: 'Thread access denied.' });
      return;
    }
    // Lock/serialize on the parent above. A reused global message ID may never move threads.
    const collisions = await client.query(
      'SELECT id FROM chat_messages WHERE id=ANY($1::text[]) AND (thread_id<>$2 OR workspace_id IS DISTINCT FROM $3)',
      [rows.map((r) => r.id), req.params.threadId, req.workspaceId],
    );
    if (collisions.rowCount) {
      res.status(409).json({ error: 'A message ID already belongs to another thread.' });
      return;
    }
    if (batch.success)
      await client.query('DELETE FROM chat_messages WHERE thread_id=$1 AND workspace_id=$2', [
        req.params.threadId,
        req.workspaceId,
      ]);
    const saved = await client.query(
      `INSERT INTO chat_messages(id,thread_id,user_id,workspace_id,role,seq,content)
      SELECT m.id,$2,$3,$4,m.role,m.seq,m.content FROM jsonb_to_recordset($1::jsonb) AS m(id text,role text,seq integer,content jsonb)
      ON CONFLICT(id) DO UPDATE SET role=EXCLUDED.role,seq=EXCLUDED.seq,content=EXCLUDED.content
      WHERE chat_messages.thread_id=EXCLUDED.thread_id AND chat_messages.workspace_id=EXCLUDED.workspace_id RETURNING *`,
      [JSON.stringify(rows), req.params.threadId, req.userId, req.workspaceId],
    );
    if (saved.rowCount !== rows.length) {
      res.status(409).json({ error: 'A message ID changed ownership during the save.' });
      return;
    }
    await client.query('COMMIT');
    if (batch.success) res.json({ ok: true, count: rows.length });
    else res.json({ message: saved.rows[0] });
  } finally {
    await client.query('ROLLBACK');
    client.release();
  }
});
router.patch('/threads/:threadId', async (req, res) => {
  const parsed = z.object({ title: Title }).strict().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid title.' });
    return;
  }
  const { rows } = await pool.query(
    'UPDATE chat_threads SET title=$3,updated_at=now() WHERE id=$1 AND workspace_id=$2 RETURNING *',
    [req.params.threadId, req.workspaceId, parsed.data.title ?? null],
  );
  if (!rows.length) {
    res.status(404).json({ error: 'Thread not found.' });
    return;
  }
  res.json({ thread: thread(rows[0]) });
});
router.delete('/threads/:threadId', async (req, res) => {
  const result = await pool.query('DELETE FROM chat_threads WHERE id=$1 AND workspace_id=$2', [
    req.params.threadId,
    req.workspaceId,
  ]);
  if (!result.rowCount) {
    res.status(404).json({ error: 'Thread not found.' });
    return;
  }
  res.json({ ok: true });
});
export default router;
