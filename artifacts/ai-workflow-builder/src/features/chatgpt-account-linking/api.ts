import { z } from 'zod';
import { WorkspaceSchema } from '@workspace/api-zod/access';
import { apiFetch } from '@/platform/auth/api-fetch';

const timestamp = z.string().datetime({ offset: true });
export const workflowScopeSchema = z.enum([
  'inscope.workflows:read',
  'inscope.workflows:read inscope.workflows:write',
  'inscope.workflows:read inscope.workflows:execute',
  'inscope.workflows:read inscope.workflows:write inscope.workflows:execute',
]);
export function scopeAccess(scope: z.infer<typeof workflowScopeSchema>) {
  const scopes = scope.split(' ');
  const write = scopes.includes('inscope.workflows:write');
  const execute = scopes.includes('inscope.workflows:execute');
  return {
    write,
    execute,
    label:
      write && execute
        ? 'Read, change inputs and execute'
        : write
          ? 'Read and change inputs'
          : execute
            ? 'Read and execute'
            : 'Read-only',
  };
}
export const consentSchema = z.object({
  request: z.object({
    id: z.string().min(1),
    clientName: z.string().min(1),
    scope: workflowScopeSchema,
    expiresAt: timestamp,
    grantDurationDays: z.literal(7),
  }),
  account: z.object({ id: z.string(), name: z.string().nullable(), email: z.string().nullable() }),
  workspaces: z.array(WorkspaceSchema),
});
export type Consent = z.infer<typeof consentSchema>;
export const grantsSchema = z.object({
  grants: z.array(
    z.object({
      id: z.string().min(1),
      clientName: z.string().min(1),
      workspaceId: z.string().uuid(),
      workspaceName: z.string(),
      scope: workflowScopeSchema,
      createdAt: timestamp,
      expiresAt: timestamp,
      revokedAt: timestamp.nullable(),
    }),
  ),
});
export type Grant = z.infer<typeof grantsSchema>['grants'][number];
export const decisionSchema = z.object({
  redirectUrl: z
    .string()
    .url()
    .refine((value) => {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password;
    }),
});

export class LinkingError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function linkingRequest(path: string, init?: RequestInit): Promise<unknown> {
  const response = await apiFetch(`/api/chatgpt/oauth${path}`, {
    ...init,
    signal: init?.signal
      ? AbortSignal.any([init.signal, AbortSignal.timeout(15000)])
      : AbortSignal.timeout(15000),
  });
  if (response.status === 204) return null;
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      body && typeof body === 'object' && 'error' in body && typeof body.error === 'string'
        ? body.error
        : 'ChatGPT account linking is unavailable. Please retry.';
    throw new LinkingError(response.status, message);
  }
  return body;
}

export const accountLinkingPath = (page: 'authorize' | 'connections') =>
  `${import.meta.env.BASE_URL}chatgpt/${page}`;
export function isAccountLinkingPage(pathname: string) {
  return ['authorize', 'connections'].some(
    (page) => pathname.replace(/\/$/, '') === `${import.meta.env.BASE_URL}chatgpt/${page}`,
  );
}
export function errorMessage(error: unknown) {
  return error instanceof LinkingError
    ? error.message
    : 'The account-linking service could not be verified. Please retry.';
}
