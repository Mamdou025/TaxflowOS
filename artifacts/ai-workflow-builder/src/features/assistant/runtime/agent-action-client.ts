import type {
  AgentActionRequest,
  AgentAuthorizationDecision,
  CreateAgentGrant,
} from '@workspace/agent-runtime/capabilities';
import type { AgentWorkflowAuthorization } from '@workspace/workflow-core/agent-commands';
import { apiFetch } from '@/platform/auth/api-fetch';

type AuthorizationResponse = AgentAuthorizationDecision & {
  operationStatus: 'allowed' | 'denied' | 'succeeded' | 'failed' | 'conflict';
  authorization?: AgentWorkflowAuthorization;
  message?: string;
};

async function responseBody(response: Response): Promise<Record<string, unknown>> {
  const body: unknown = await response.json();
  return body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
}

export async function createAgentGrant(grant: CreateAgentGrant): Promise<string> {
  const response = await apiFetch('/api/agent-actions/grants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(grant),
  });
  const body = await responseBody(response);
  if (!response.ok) throw new Error(String(body.error ?? 'The action grant was not created.'));
  const saved = body.grant;
  if (!saved || typeof saved !== 'object' || !('id' in saved) || typeof saved.id !== 'string')
    throw new Error('The action grant could not be verified.');
  return saved.id;
}

export async function authorizeAgentAction(
  request: AgentActionRequest,
): Promise<AuthorizationResponse> {
  const response = await apiFetch('/api/agent-actions/operations/authorize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const body = (await responseBody(response)) as AuthorizationResponse & { error?: string };
  if (response.status === 409) throw new Error(body.error ?? 'The action request conflicts.');
  return body;
}

export async function recordAgentActionOutcome(
  operationId: string,
  status: 'succeeded' | 'failed' | 'conflict',
  message: string,
): Promise<void> {
  const response = await apiFetch(
    `/api/agent-actions/operations/${encodeURIComponent(operationId)}/outcome`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, message }),
    },
  );
  if (!response.ok) {
    const body = await responseBody(response);
    throw new Error(String(body.error ?? 'The action outcome could not be recorded.'));
  }
}

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, canonical(item)]),
    );
  return value;
}

export async function fingerprintAgentPayload(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(canonical(value)));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
