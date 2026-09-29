import { randomUUID } from 'node:crypto';
import { pool } from '@workspace/db';
import {
  MKORO_DELEGATION_CAPABILITY,
  MKORO_OFFLINE_MS,
  MkoroDelegationSchema,
  validateMkoroDelegationTarget,
  type MkoroDelegationRequest,
} from '@workspace/api-zod/mkoro';
import { appOrigin } from '../../security/auth';
import { activeStatuses, MkoroError, transaction, type Scope } from './common';
import { conversationView, getTask } from './tasks';

export async function threadConversations(scope: Scope, threadId: string) {
  const thread = await pool.query('SELECT id FROM chat_threads WHERE id=$1 AND workspace_id=$2', [
    threadId,
    scope.workspaceId,
  ]);
  if (!thread.rowCount) throw new MkoroError(404, 'Sina conversation not found.');
  const { rows } = await pool.query(
    'SELECT * FROM mkoro_conversations WHERE sina_thread_id=$1 AND actor_id=$2 AND workspace_id=$3 ORDER BY updated_at DESC LIMIT 100',
    [threadId, scope.actorId, scope.workspaceId],
  );
  return rows.map(conversationView);
}

export async function createDelegation(scope: Scope, input: MkoroDelegationRequest) {
  const targetError = validateMkoroDelegationTarget(input, [appOrigin]);
  if (targetError) throw new MkoroError(400, targetError);
  const delegation = MkoroDelegationSchema.parse({
    taskType: input.taskType,
    target: input.target,
    objective: input.objective,
    expectedOutput: input.expectedOutput,
    reasonNoPlatformTool: input.reasonNoPlatformTool,
  });
  const result = await transaction(async (client) => {
    // Thread lock serializes retries even if a retry names a different computer.
    const thread = await client.query(
      'SELECT id FROM chat_threads WHERE id=$1 AND workspace_id=$2 FOR UPDATE',
      [input.threadId, scope.workspaceId],
    );
    if (!thread.rowCount) throw new MkoroError(404, 'Sina conversation not found.');
    const prior = await client.query(
      `SELECT t.id AS task_id,t.delegation=$5::jsonb AS same,c.* FROM mkoro_tasks t
       JOIN mkoro_conversations c ON c.id=t.conversation_id
       WHERE c.sina_thread_id=$1 AND c.actor_id=$2 AND c.workspace_id=$3 AND t.request_id=$4`,
      [
        input.threadId,
        scope.actorId,
        scope.workspaceId,
        input.requestId,
        JSON.stringify(delegation),
      ],
    );
    if (prior.rows[0]) {
      if (!prior.rows[0].same || prior.rows[0].worker_id !== input.workerId)
        throw new MkoroError(409, 'This request ID already identifies another computer task.');
      return {
        conversation: conversationView(prior.rows[0]),
        taskId: String(prior.rows[0].task_id),
      };
    }
    const worker = await client.query(
      'SELECT * FROM mkoro_workers WHERE id=$1 AND actor_id=$2 AND workspace_id=$3 FOR UPDATE',
      [input.workerId, scope.actorId, scope.workspaceId],
    );
    const row = worker.rows[0];
    if (!row) throw new MkoroError(404, 'Companion not found.');
    if (
      row.revoked_at ||
      !row.last_seen_at ||
      Date.now() - new Date(row.last_seen_at).getTime() >= MKORO_OFFLINE_MS
    )
      throw new MkoroError(409, 'Companion is offline. Reconnect it before delegating a task.');
    if (!Array.isArray(row.capabilities) || !row.capabilities.includes(MKORO_DELEGATION_CAPABILITY))
      throw new MkoroError(409, 'Update and restart the companion to support Sina delegations.');
    const busy = await client.query(
      'SELECT id FROM mkoro_tasks WHERE worker_id=$1 AND status=ANY($2::text[])',
      [input.workerId, activeStatuses],
    );
    if (busy.rowCount)
      throw new MkoroError(
        409,
        'This companion already has an active task. Finish or cancel it first.',
      );
    const existing = await client.query(
      'SELECT * FROM mkoro_conversations WHERE sina_thread_id=$1 AND actor_id=$2 AND workspace_id=$3 AND worker_id=$4',
      [input.threadId, scope.actorId, scope.workspaceId, input.workerId],
    );
    const conversation =
      existing.rows[0] ??
      (
        await client.query(
          `INSERT INTO mkoro_conversations(id,workspace_id,actor_id,worker_id,title,sina_thread_id)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
          [
            randomUUID(),
            scope.workspaceId,
            scope.actorId,
            input.workerId,
            'Computer tasks for Sina',
            input.threadId,
          ],
        )
      ).rows[0];
    const taskId = randomUUID();
    await client.query(
      'INSERT INTO mkoro_tasks(id,conversation_id,worker_id,request_id,message,delegation) VALUES($1,$2,$3,$4,$5,$6)',
      [
        taskId,
        conversation.id,
        input.workerId,
        input.requestId,
        input.objective,
        JSON.stringify(delegation),
      ],
    );
    await client.query(
      "INSERT INTO mkoro_commands(id,worker_id,task_id,type,payload) VALUES($1,$2,$3,'message',$4)",
      [
        randomUUID(),
        input.workerId,
        taskId,
        JSON.stringify({
          message: input.objective,
          conversationId: conversation.id,
          threadId: input.threadId,
          delegation,
          platformOrigin: appOrigin,
        }),
      ],
    );
    await client.query('UPDATE mkoro_conversations SET updated_at=now() WHERE id=$1', [
      conversation.id,
    ]);
    return { conversation: conversationView(conversation), taskId };
  });
  return { conversation: result.conversation, task: await getTask(scope, result.taskId) };
}
