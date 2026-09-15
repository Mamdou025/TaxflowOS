import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CreateAgentGrantSchema,
  evaluateAgentAction,
  type AgentActionGrant,
  type AgentActionRequest,
} from '../../lib/agent-runtime/src/capabilities';

const request: AgentActionRequest = {
  operationId: 'operation-one',
  agentId: 'sina',
  capability: 'workflow:apply-draft',
  resourceType: 'workflow',
  resourceId: 'workflow-one',
  resourceRevision: 'revision-one',
  requestFingerprint: 'request-one',
};

function grant(overrides: Partial<AgentActionGrant> = {}): AgentActionGrant {
  return {
    id: 'grant-one',
    workspaceId: 'workspace-one',
    actorId: 'actor-one',
    agentId: request.agentId,
    capability: request.capability,
    resourceType: request.resourceType,
    resourceId: request.resourceId,
    kind: 'one-time',
    operationId: request.operationId,
    resourceRevision: request.resourceRevision,
    requestFingerprint: request.requestFingerprint,
    expiresAt: '2026-09-15T00:00:00.000Z',
    createdAt: '2026-09-14T00:00:00.000Z',
    ...overrides,
  };
}

const now = new Date('2026-09-14T12:00:00.000Z');

test('read, proposal and authorized retrieval capabilities are implicit', () => {
  for (const capability of ['workflow:read', 'workflow:propose', 'source:retrieve'] as const) {
    assert.deepEqual(
      evaluateAgentAction(
        {
          ...request,
          capability,
          resourceType: capability === 'source:retrieve' ? 'source' : 'workflow',
        },
        [],
        now,
      ),
      { allowed: true, code: 'IMPLICIT' },
    );
  }
});

test('one-time approval is bound to agent, resource, revision, operation and request', () => {
  assert.deepEqual(evaluateAgentAction(request, [grant()], now), {
    allowed: true,
    code: 'GRANTED',
    grantId: 'grant-one',
  });
  for (const mismatch of [
    { agentId: 'other-agent' },
    { resourceId: 'other-workflow' },
    { resourceRevision: 'other-revision' },
    { operationId: 'other-operation' },
    { requestFingerprint: 'other-request' },
  ]) {
    assert.equal(evaluateAgentAction({ ...request, ...mismatch }, [grant()], now).allowed, false);
  }
});

test('reusable grants avoid repeated approval only inside their exact scope', () => {
  const reusable = grant({
    kind: 'reusable',
    operationId: undefined,
    resourceRevision: undefined,
    requestFingerprint: undefined,
  });
  assert.equal(evaluateAgentAction(request, [reusable], now).allowed, true);
  assert.equal(
    evaluateAgentAction({ ...request, resourceId: 'other-workflow' }, [reusable], now).allowed,
    false,
  );
});

test('expired, revoked and already-used approvals fail visibly', () => {
  assert.equal(
    evaluateAgentAction(request, [grant({ expiresAt: '2026-09-14T11:59:00.000Z' })], now).code,
    'GRANT_EXPIRED',
  );
  assert.equal(
    evaluateAgentAction(request, [grant({ revokedAt: '2026-09-14T11:00:00.000Z' })], now).code,
    'GRANT_REVOKED',
  );
  assert.equal(
    evaluateAgentAction(
      request,
      [grant({ usedAt: '2026-09-14T11:00:00.000Z', usedByOperationId: 'other-operation' })],
      now,
    ).code,
    'GRANT_USED',
  );
});

test('external writes reject reusable or unbound approvals', () => {
  const base = {
    agentId: 'sina',
    capability: 'connection:external-write' as const,
    resourceType: 'connection' as const,
    resourceId: 'connection-one',
  };
  assert.equal(CreateAgentGrantSchema.safeParse({ ...base, kind: 'reusable' }).success, false);
  assert.equal(CreateAgentGrantSchema.safeParse({ ...base, kind: 'one-time' }).success, false);
  assert.equal(
    CreateAgentGrantSchema.safeParse({
      ...base,
      kind: 'one-time',
      operationId: 'operation-one',
      requestFingerprint: 'request-one',
    }).success,
    true,
  );
});
