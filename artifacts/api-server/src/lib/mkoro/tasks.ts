import { randomUUID } from 'node:crypto';
import { pool } from '@workspace/db';
import {
  MKORO_OFFLINE_MS,
  MkoroConversationSchema,
  MkoroTaskSchema,
  MkoroEventSchema,
  MkoroPermissionOptionSchema,
  MkoroPendingPermissionSchema,
} from '@workspace/api-zod/mkoro';
import { iso, MkoroError, transaction, activeStatuses, type Scope, type Client } from './common';

type Row = Record<string, unknown>;
export const taskView = (row: Row) =>
  MkoroTaskSchema.parse({
    id: row.id,
    conversationId: row.conversation_id,
    workerId: row.worker_id,
    requestId: row.request_id,
    message: row.message,
    status: row.status,
    cancelRequested: row.cancel_requested,
    error: row.error ?? null,
    connectionLost:
      activeStatuses.includes(String(row.status)) &&
      (Boolean(row.revoked_at) ||
        !row.last_seen_at ||
        Date.now() - new Date(String(row.last_seen_at)).getTime() >= MKORO_OFFLINE_MS),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  });
export const eventView = (row: Row) =>
  MkoroEventSchema.parse({
    id: row.id,
    taskId: row.task_id,
    seq: row.seq,
    type: row.type,
    payload: row.payload,
    cursor: Number(row.cursor),
    createdAt: iso(row.created_at),
  });
const conversationView = (row: Row) =>
  MkoroConversationSchema.parse({
    id: row.id,
    workerId: row.worker_id,
    title: row.title,
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  });
export async function createConversation(scope: Scope, workerId: string, title = 'New Mkoro chat') {
  const { rows } = await pool.query(
    `INSERT INTO mkoro_conversations(id,workspace_id,actor_id,worker_id,title)
     SELECT $1,workspace_id,actor_id,id,$2 FROM mkoro_workers
     WHERE id=$3 AND actor_id=$4 AND workspace_id=$5 AND revoked_at IS NULL RETURNING *`,
    [randomUUID(), title, workerId, scope.actorId, scope.workspaceId],
  );
  if (!rows[0]) throw new MkoroError(404, 'Companion not found.');
  return conversationView(rows[0]);
}
export async function listConversations(scope: Scope) {
  const { rows } = await pool.query(
    'SELECT * FROM mkoro_conversations WHERE actor_id=$1 AND workspace_id=$2 ORDER BY updated_at DESC LIMIT 100',
    [scope.actorId, scope.workspaceId],
  );
  return rows.map(conversationView);
}
export async function getTask(scope: Scope, id: string, client: Pick<Client, 'query'> = pool) {
  const { rows } = await client.query(
    `SELECT t.*,w.last_seen_at,w.revoked_at FROM mkoro_tasks t JOIN mkoro_conversations c ON c.id=t.conversation_id
     JOIN mkoro_workers w ON w.id=t.worker_id WHERE t.id=$1 AND c.actor_id=$2 AND c.workspace_id=$3`,
    [id, scope.actorId, scope.workspaceId],
  );
  if (!rows[0]) throw new MkoroError(404, 'Task not found.');
  return taskView(rows[0]);
}
async function pendingPermissions(conversationId: string, taskId?: string) {
  const { rows } = await pool.query(
    `SELECT p.* FROM mkoro_permissions p JOIN mkoro_tasks t ON t.id=p.task_id
     WHERE t.conversation_id=$1 AND ($2::text IS NULL OR t.id=$2) AND p.decision IS NULL
     AND t.status='waiting_permission' AND NOT t.cancel_requested ORDER BY p.created_at`,
    [conversationId, taskId ?? null],
  );
  return rows.map((row) =>
    MkoroPendingPermissionSchema.parse({
      taskId: row.task_id,
      requestId: row.request_id,
      toolCall: row.tool_call,
      options: row.options,
    }),
  );
}
export async function conversationDetail(scope: Scope, id: string, before?: number) {
  const { rows } = await pool.query(
    'SELECT * FROM mkoro_conversations WHERE id=$1 AND actor_id=$2 AND workspace_id=$3',
    [id, scope.actorId, scope.workspaceId],
  );
  if (!rows[0]) throw new MkoroError(404, 'Conversation not found.');
  const tasks = await pool.query(
    `SELECT t.*,w.last_seen_at,w.revoked_at FROM mkoro_tasks t JOIN mkoro_workers w ON w.id=t.worker_id
     WHERE conversation_id=$1 ORDER BY t.created_at DESC LIMIT 101`,
    [id],
  );
  const events = await pool.query(
    `SELECT e.* FROM mkoro_events e JOIN mkoro_tasks t ON t.id=e.task_id
     WHERE t.conversation_id=$1 AND ($2::bigint IS NULL OR e.cursor<$2) ORDER BY e.cursor DESC LIMIT 501`,
    [id, before ?? null],
  );
  return {
    conversation: conversationView(rows[0]),
    tasks: tasks.rows.slice(0, 100).reverse().map(taskView),
    events: events.rows.slice(0, 500).reverse().map(eventView),
    tasksTruncated: tasks.rows.length > 100,
    eventsTruncated: events.rows.length > 500,
    pendingPermissions: await pendingPermissions(id),
  };
}
export async function taskEvents(scope: Scope, id: string, after: number) {
  const task = await getTask(scope, id);
  const { rows } = await pool.query(
    'SELECT * FROM mkoro_events WHERE task_id=$1 AND cursor>$2 ORDER BY cursor LIMIT 200',
    [id, after],
  );
  const events = rows.map(eventView);
  return {
    task,
    events,
    cursor: events.at(-1)?.cursor ?? after,
    pendingPermissions: await pendingPermissions(task.conversationId, id),
  };
}
export async function createMessage(
  scope: Scope,
  conversationId: string,
  message: string,
  requestId: string,
) {
  const id = await transaction(async (client) => {
    const { rows } = await client.query(
      `SELECT c.worker_id,w.revoked_at,w.last_seen_at FROM mkoro_conversations c JOIN mkoro_workers w ON w.id=c.worker_id
       WHERE c.id=$1 AND c.actor_id=$2 AND c.workspace_id=$3 FOR UPDATE OF w`,
      [conversationId, scope.actorId, scope.workspaceId],
    );
    const worker = rows[0];
    if (!worker) throw new MkoroError(404, 'Conversation not found.');
    const prior = await client.query(
      'SELECT id,message FROM mkoro_tasks WHERE conversation_id=$1 AND request_id=$2',
      [conversationId, requestId],
    );
    if (prior.rows[0]) {
      if (prior.rows[0].message !== message)
        throw new MkoroError(409, 'This request ID already identifies another message.');
      return String(prior.rows[0].id);
    }
    if (
      worker.revoked_at ||
      !worker.last_seen_at ||
      Date.now() - new Date(worker.last_seen_at).getTime() >= MKORO_OFFLINE_MS
    )
      throw new MkoroError(409, 'Companion is offline. Reconnect it before sending a message.');
    const busy = await client.query(
      'SELECT id FROM mkoro_tasks WHERE worker_id=$1 AND status=ANY($2::text[])',
      [worker.worker_id, activeStatuses],
    );
    if (busy.rowCount)
      throw new MkoroError(
        409,
        'This companion already has an active task. Finish or cancel it first.',
      );
    const taskId = randomUUID();
    await client.query(
      'INSERT INTO mkoro_tasks(id,conversation_id,worker_id,request_id,message) VALUES($1,$2,$3,$4,$5)',
      [taskId, conversationId, worker.worker_id, requestId, message],
    );
    await client.query(
      'INSERT INTO mkoro_commands(id,worker_id,task_id,type,payload) VALUES($1,$2,$3,$4,$5)',
      [
        randomUUID(),
        worker.worker_id,
        taskId,
        'message',
        JSON.stringify({ message, conversationId }),
      ],
    );
    await client.query('UPDATE mkoro_conversations SET updated_at=now() WHERE id=$1', [
      conversationId,
    ]);
    return taskId;
  });
  return getTask(scope, id);
}
export async function cancelTask(scope: Scope, id: string) {
  await transaction(async (client) => {
    await getTask(scope, id, client);
    await client.query('SELECT id FROM mkoro_tasks WHERE id=$1 FOR UPDATE', [id]);
    const task = await getTask(scope, id, client);
    if (!activeStatuses.includes(task.status) || task.cancelRequested) return;
    const queued = await client.query(
      "DELETE FROM mkoro_commands WHERE task_id=$1 AND type='message' AND delivered_at IS NULL RETURNING id",
      [id],
    );
    if (queued.rowCount) {
      await client.query(
        "UPDATE mkoro_tasks SET status='cancelled',cancel_requested=true,updated_at=now() WHERE id=$1",
        [id],
      );
    } else {
      await client.query(
        'UPDATE mkoro_tasks SET cancel_requested=true,updated_at=now() WHERE id=$1',
        [id],
      );
      await client.query(
        "INSERT INTO mkoro_commands(id,worker_id,task_id,type,payload) VALUES($1,$2,$3,'cancel','{}')",
        [randomUUID(), task.workerId, id],
      );
    }
  });
  return getTask(scope, id);
}
export async function decidePermission(
  scope: Scope,
  id: string,
  requestId: string,
  optionId: string,
) {
  await transaction(async (client) => {
    await getTask(scope, id, client);
    await client.query('SELECT id FROM mkoro_tasks WHERE id=$1 FOR UPDATE', [id]);
    const task = await getTask(scope, id, client);
    if (task.status !== 'waiting_permission' || task.cancelRequested)
      throw new MkoroError(409, 'This task is not waiting for that decision.');
    const { rows } = await client.query(
      'SELECT * FROM mkoro_permissions WHERE task_id=$1 AND request_id=$2 FOR UPDATE',
      [id, requestId],
    );
    const permission = rows[0];
    if (!permission) throw new MkoroError(404, 'Permission request not found.');
    if (permission.decision)
      throw new MkoroError(409, 'This permission request has already been answered.');
    const options = MkoroPermissionOptionSchema.array().parse(permission.options);
    const option = options.find((item) => item.optionId === optionId);
    if (!option || !['allow_once', 'reject_once'].includes(option.kind))
      throw new MkoroError(400, 'Choose one of the offered one-time decisions.');
    await client.query(
      'UPDATE mkoro_permissions SET decision=$3,decided_at=now() WHERE task_id=$1 AND request_id=$2',
      [id, requestId, optionId],
    );
    await client.query(
      "INSERT INTO mkoro_commands(id,worker_id,task_id,type,payload) VALUES($1,$2,$3,'permission',$4)",
      [randomUUID(), task.workerId, id, JSON.stringify({ requestId, optionId })],
    );
    await client.query(
      `UPDATE mkoro_tasks SET status=CASE WHEN EXISTS(
      SELECT 1 FROM mkoro_permissions WHERE task_id=$1 AND decision IS NULL
      ) THEN 'waiting_permission' ELSE 'running' END,updated_at=now() WHERE id=$1`,
      [id],
    );
  });
  return getTask(scope, id);
}
