import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { permits, WorkspaceRoleSchema } from '@workspace/api-zod/access';
import { activeStatuses, MkoroError, transaction, type Client, type Scope } from './common';

const hash = (token: string) => createHash('sha256').update(token).digest('hex');
const secret = () => randomBytes(32).toString('base64url');

async function requireIdle(client: Client, workerId: string) {
  // The caller holds the worker lock, which also serializes new delegations. Do not
  // lock tasks here: event recording and tool approval use task-before-worker order.
  const active = await client.query(
    'SELECT id FROM mkoro_tasks WHERE worker_id=$1 AND status=ANY($2::text[]) LIMIT 1',
    [workerId, activeStatuses],
  );
  if (active.rowCount)
    throw new MkoroError(409, 'Finish or cancel the active computer task before reconnecting.');
}

export async function createPairing(scope: Scope, reconnectWorkerId?: string) {
  return transaction(async (client) => {
    let reconnectTokenHash: string | null = null;
    if (reconnectWorkerId) {
      const target = await client.query(
        'SELECT token_hash FROM mkoro_workers WHERE id=$1 AND actor_id=$2 AND workspace_id=$3 FOR UPDATE',
        [reconnectWorkerId, scope.actorId, scope.workspaceId],
      );
      if (!target.rows[0]) throw new MkoroError(404, 'Computer connection not found.');
      await requireIdle(client, reconnectWorkerId);
      reconnectTokenHash = target.rows[0].token_hash;
    }
    const pairingToken = secret();
    const expiresAt = new Date(Date.now() + 10 * 60_000).toISOString();
    await client.query(
      `INSERT INTO mkoro_pairings(token_hash,workspace_id,actor_id,expires_at,reconnect_worker_id,reconnect_token_hash)
       VALUES($1,$2,$3,$4,$5,$6)`,
      [
        hash(pairingToken),
        scope.workspaceId,
        scope.actorId,
        expiresAt,
        reconnectWorkerId ?? null,
        reconnectTokenHash,
      ],
    );
    return { pairingToken, expiresAt, ...(reconnectWorkerId ? { reconnectWorkerId } : {}) };
  });
}

export async function pairWorker(input: {
  pairingToken: string;
  name: string;
  capabilities: string[];
  reconnect?: { workerId: string; token: string };
}) {
  return transaction(async (client) => {
    const { rows } = await client.query(
      `SELECT p.*,m.role FROM mkoro_pairings p JOIN workspace_members m
       ON m.workspace_id=p.workspace_id AND m.user_id=p.actor_id
       WHERE p.token_hash=$1 AND p.used_at IS NULL AND p.expires_at>now() FOR UPDATE OF p,m`,
      [hash(input.pairingToken)],
    );
    const pairing = rows[0];
    const role = WorkspaceRoleSchema.safeParse(pairing?.role);
    if (!pairing || !role.success || !permits(role.data, 'execute'))
      throw new MkoroError(401, 'Pairing expired, already used, or no longer authorized.');
    const targetId = pairing.reconnect_worker_id ?? input.reconnect?.workerId;
    const workerId = targetId ?? randomUUID();
    const token = secret();
    if (targetId) {
      const target = await client.query(
        'SELECT token_hash FROM mkoro_workers WHERE id=$1 AND actor_id=$2 AND workspace_id=$3 FOR UPDATE',
        [targetId, pairing.actor_id, pairing.workspace_id],
      );
      const credential = target.rows[0]?.token_hash;
      if (
        !credential ||
        (pairing.reconnect_token_hash && pairing.reconnect_token_hash !== credential) ||
        (input.reconnect &&
          (input.reconnect.workerId !== targetId || hash(input.reconnect.token) !== credential))
      )
        throw new MkoroError(
          401,
          'The reconnect identity does not match this pairing code or its current connection.',
        );
      await requireIdle(client, targetId);
      await client.query(
        `UPDATE mkoro_workers SET name=$2,token_hash=$3,capabilities=$4,last_seen_at=now(),
         revoked_at=NULL,auto_approve=false WHERE id=$1`,
        [workerId, input.name, hash(token), JSON.stringify(input.capabilities)],
      );
    } else {
      await client.query(
        `INSERT INTO mkoro_workers(id,workspace_id,actor_id,name,token_hash,capabilities,last_seen_at)
         VALUES($1,$2,$3,$4,$5,$6,now())`,
        [
          workerId,
          pairing.workspace_id,
          pairing.actor_id,
          input.name,
          hash(token),
          JSON.stringify(input.capabilities),
        ],
      );
    }
    await client.query('UPDATE mkoro_pairings SET used_at=now() WHERE token_hash=$1', [
      hash(input.pairingToken),
    ]);
    return { workerId, token, pollIntervalMs: 1500 };
  });
}
