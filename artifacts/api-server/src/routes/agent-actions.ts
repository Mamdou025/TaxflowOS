import { createHash, randomUUID } from 'node:crypto';
import { Router } from 'express';
import { pool } from '@workspace/db';
import {
  AgentActionRequestSchema,
  CreateAgentGrantSchema,
  capabilityResourceType,
  evaluateAgentAction,
  type AgentActionGrant,
} from '@workspace/agent-runtime/capabilities';

const router = Router();
const MAX_GRANT_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

type GrantRow = {
  id: string;
  workspace_id: string;
  actor_id: string;
  agent_id: string;
  capability: AgentActionGrant['capability'];
  resource_type: AgentActionGrant['resourceType'];
  resource_id: string;
  kind: AgentActionGrant['kind'];
  operation_id: string | null;
  resource_revision: string | null;
  request_fingerprint: string | null;
  expires_at: Date | null;
  revoked_at: Date | null;
  used_at: Date | null;
  used_by_operation_id: string | null;
  created_at: Date;
};

function grantFromRow(row: GrantRow): AgentActionGrant {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    actorId: row.actor_id,
    agentId: row.agent_id,
    capability: row.capability,
    resourceType: row.resource_type,
    resourceId: row.resource_id,
    kind: row.kind,
    operationId: row.operation_id ?? undefined,
    resourceRevision: row.resource_revision ?? undefined,
    requestFingerprint: row.request_fingerprint ?? undefined,
    expiresAt: row.expires_at?.toISOString(),
    revokedAt: row.revoked_at?.toISOString(),
    usedAt: row.used_at?.toISOString(),
    usedByOperationId: row.used_by_operation_id,
    createdAt: row.created_at.toISOString(),
  };
}

function requestSignature(request: ReturnType<typeof AgentActionRequestSchema.parse>): string {
  return createHash('sha256').update(JSON.stringify(request)).digest('hex');
}

router.get('/grants', async (req, res) => {
  const { rows } = await pool.query<GrantRow>(
    `SELECT * FROM agent_action_grants
     WHERE workspace_id=$1 AND actor_id=$2 ORDER BY created_at DESC`,
    [req.workspaceId, req.userId],
  );
  res.set('Cache-Control', 'no-store').json({ grants: rows.map(grantFromRow) });
});

router.post('/grants', async (req, res) => {
  const parsed = CreateAgentGrantSchema.safeParse(req.body);
  if (
    !parsed.success ||
    capabilityResourceType(parsed.data.capability) !== parsed.data.resourceType
  ) {
    res.status(400).json({ error: 'Supply a valid, narrowly scoped agent grant.' });
    return;
  }
  const now = new Date();
  const defaultLifetime = parsed.data.kind === 'one-time' ? 15 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const expiresAt = parsed.data.expiresAt
    ? new Date(parsed.data.expiresAt)
    : new Date(now.getTime() + defaultLifetime);
  if (expiresAt <= now || expiresAt.getTime() - now.getTime() > MAX_GRANT_LIFETIME_MS) {
    res.status(400).json({ error: 'Agent grants must expire within the next 30 days.' });
    return;
  }
  const grant = parsed.data;
  const id = randomUUID();
  const { rows } = await pool.query<GrantRow>(
    `INSERT INTO agent_action_grants(
       id,workspace_id,actor_id,agent_id,capability,resource_type,resource_id,kind,
       operation_id,resource_revision,request_fingerprint,expires_at
     ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [
      id,
      req.workspaceId,
      req.userId,
      grant.agentId,
      grant.capability,
      grant.resourceType,
      grant.resourceId,
      grant.kind,
      grant.operationId ?? null,
      grant.resourceRevision ?? null,
      grant.requestFingerprint ?? null,
      expiresAt,
    ],
  );
  res.status(201).json({ grant: grantFromRow(rows[0]) });
});

router.delete('/grants/:grantId', async (req, res) => {
  const { rowCount } = await pool.query(
    `UPDATE agent_action_grants SET revoked_at=COALESCE(revoked_at,now())
     WHERE id=$1 AND workspace_id=$2 AND actor_id=$3`,
    [req.params.grantId, req.workspaceId, req.userId],
  );
  if (!rowCount) {
    res.status(404).json({ error: 'Agent grant not found.' });
    return;
  }
  res.json({ ok: true });
});

router.post('/operations/authorize', async (req, res) => {
  const parsed = AgentActionRequestSchema.safeParse(req.body);
  if (
    !parsed.success ||
    capabilityResourceType(parsed.data.capability) !== parsed.data.resourceType
  ) {
    res.status(400).json({ error: 'Supply a valid agent action request.' });
    return;
  }
  const request = parsed.data;
  const signature = requestSignature(request);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const previous = await client.query<{
      request_signature: string;
      status: 'allowed' | 'denied' | 'succeeded' | 'failed' | 'conflict';
      grant_id: string | null;
      message: string | null;
    }>(
      `SELECT request_signature,status,grant_id,message FROM agent_action_operations
       WHERE workspace_id=$1 AND actor_id=$2 AND operation_id=$3 FOR UPDATE`,
      [req.workspaceId, req.userId, request.operationId],
    );
    const existing = previous.rows[0];
    if (existing && existing.request_signature !== signature) {
      await client.query('ROLLBACK');
      res.status(409).json({ error: 'This operation ID was already used for a different action.' });
      return;
    }
    if (existing && ['succeeded', 'failed', 'conflict'].includes(existing.status)) {
      await client.query('COMMIT');
      res.json({
        allowed: existing.status === 'succeeded',
        operationStatus: existing.status,
        grantId: existing.grant_id,
        message: existing.message ?? 'This operation already has a recorded outcome.',
      });
      return;
    }
    const grantRows = await client.query<GrantRow>(
      `SELECT * FROM agent_action_grants
       WHERE workspace_id=$1 AND actor_id=$2 AND agent_id=$3 AND capability=$4
         AND resource_type=$5 AND resource_id=$6 FOR UPDATE`,
      [
        req.workspaceId,
        req.userId,
        request.agentId,
        request.capability,
        request.resourceType,
        request.resourceId,
      ],
    );
    const decision = evaluateAgentAction(request, grantRows.rows.map(grantFromRow));
    if (decision.allowed && decision.grantId) {
      await client.query(
        `UPDATE agent_action_grants SET used_at=COALESCE(used_at,now()),
           used_by_operation_id=COALESCE(used_by_operation_id,$2)
         WHERE id=$1 AND kind='one-time'`,
        [decision.grantId, request.operationId],
      );
    }
    const status = decision.allowed ? 'allowed' : 'denied';
    const message = decision.allowed ? null : decision.message;
    await client.query(
      `INSERT INTO agent_action_operations(
        workspace_id,actor_id,operation_id,agent_id,capability,resource_type,resource_id,
        resource_revision,request_fingerprint,request_signature,grant_id,status,message
       ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (workspace_id,actor_id,operation_id) DO UPDATE SET
        grant_id=EXCLUDED.grant_id,status=EXCLUDED.status,message=EXCLUDED.message,updated_at=now()`,
      [
        req.workspaceId,
        req.userId,
        request.operationId,
        request.agentId,
        request.capability,
        request.resourceType,
        request.resourceId,
        request.resourceRevision ?? null,
        request.requestFingerprint ?? null,
        signature,
        decision.allowed ? (decision.grantId ?? null) : null,
        status,
        message,
      ],
    );
    await client.query('COMMIT');
    res.status(decision.allowed ? 200 : 403).json({
      ...decision,
      operationStatus: status,
      ...(decision.allowed
        ? { authorization: { ...request, allowed: true, grantId: decision.grantId } }
        : {}),
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

router.post('/operations/:operationId/outcome', async (req, res) => {
  const body = (req.body ?? {}) as { status?: unknown; message?: unknown };
  const status =
    body.status === 'succeeded' || body.status === 'failed' || body.status === 'conflict'
      ? body.status
      : null;
  if (!status || (body.message !== undefined && typeof body.message !== 'string')) {
    res.status(400).json({ error: 'Supply a valid agent operation outcome.' });
    return;
  }
  const { rowCount } = await pool.query(
    `UPDATE agent_action_operations SET status=$4,message=$5,updated_at=now()
     WHERE workspace_id=$1 AND actor_id=$2 AND operation_id=$3 AND status='allowed'`,
    [
      req.workspaceId,
      req.userId,
      req.params.operationId,
      status,
      typeof body.message === 'string' ? body.message.slice(0, 2000) : null,
    ],
  );
  if (!rowCount) {
    res.status(409).json({ error: 'Only an allowed pending operation can record an outcome.' });
    return;
  }
  res.json({ ok: true, status });
});

export default router;
