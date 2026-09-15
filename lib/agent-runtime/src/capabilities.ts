import { z } from 'zod';

export const AgentCapabilitySchema = z.enum([
  'workflow:read',
  'workflow:propose',
  'workflow:apply-draft',
  'workflow:save-version',
  'workflow:execute',
  'source:retrieve',
  'connection:external-write',
]);
export type AgentCapability = z.infer<typeof AgentCapabilitySchema>;

export const AgentResourceTypeSchema = z.enum(['workflow', 'source', 'connection']);
export type AgentResourceType = z.infer<typeof AgentResourceTypeSchema>;

export const AgentGrantKindSchema = z.enum(['one-time', 'reusable']);
export type AgentGrantKind = z.infer<typeof AgentGrantKindSchema>;

const IdentifierSchema = z.string().trim().min(1).max(200);
const FingerprintSchema = z.string().trim().min(1).max(256);

export const AgentActionRequestSchema = z
  .object({
    operationId: IdentifierSchema,
    agentId: IdentifierSchema,
    capability: AgentCapabilitySchema,
    resourceType: AgentResourceTypeSchema,
    resourceId: IdentifierSchema,
    resourceRevision: FingerprintSchema.optional(),
    requestFingerprint: FingerprintSchema.optional(),
  })
  .strict();
export type AgentActionRequest = z.infer<typeof AgentActionRequestSchema>;

export const CreateAgentGrantSchema = z
  .object({
    agentId: IdentifierSchema,
    capability: AgentCapabilitySchema,
    resourceType: AgentResourceTypeSchema,
    resourceId: IdentifierSchema,
    kind: AgentGrantKindSchema,
    operationId: IdentifierSchema.optional(),
    resourceRevision: FingerprintSchema.optional(),
    requestFingerprint: FingerprintSchema.optional(),
    expiresAt: z.string().datetime({ offset: true }).optional(),
  })
  .strict()
  .superRefine((grant, context) => {
    if (grant.capability === 'workflow:read' || grant.capability === 'workflow:propose') {
      context.addIssue({
        code: 'custom',
        message: 'Read and proposal capabilities do not require a grant.',
      });
    }
    if (grant.capability === 'source:retrieve') {
      context.addIssue({
        code: 'custom',
        message: 'Authorized source retrieval does not require a grant.',
      });
    }
    if (grant.kind === 'one-time' && !grant.operationId) {
      context.addIssue({
        code: 'custom',
        path: ['operationId'],
        message: 'A one-time grant must identify its operation.',
      });
    }
    if (grant.kind === 'reusable' && grant.operationId) {
      context.addIssue({
        code: 'custom',
        path: ['operationId'],
        message: 'A reusable grant cannot be tied to one operation.',
      });
    }
    if (grant.kind === 'one-time' && !grant.requestFingerprint) {
      context.addIssue({
        code: 'custom',
        path: ['requestFingerprint'],
        message: 'A one-time grant must identify the approved request.',
      });
    }
    if (grant.kind === 'reusable' && grant.requestFingerprint) {
      context.addIssue({
        code: 'custom',
        path: ['requestFingerprint'],
        message: 'A reusable grant cannot approve one request fingerprint.',
      });
    }
    if (
      grant.capability === 'workflow:apply-draft' &&
      grant.kind === 'one-time' &&
      !grant.resourceRevision
    ) {
      context.addIssue({
        code: 'custom',
        path: ['resourceRevision'],
        message: 'A one-time draft approval must identify the base revision.',
      });
    }
    if (grant.capability === 'connection:external-write' && grant.kind !== 'one-time') {
      context.addIssue({
        code: 'custom',
        path: ['kind'],
        message: 'External writes require one-time approval.',
      });
    }
  });
export type CreateAgentGrant = z.infer<typeof CreateAgentGrantSchema>;

export type AgentActionGrant = CreateAgentGrant & {
  id: string;
  workspaceId: string;
  actorId: string;
  createdAt: string;
  revokedAt?: string | null;
  usedAt?: string | null;
  usedByOperationId?: string | null;
};

export type AgentAuthorizationDecision =
  | { allowed: true; code: 'IMPLICIT' | 'GRANTED'; grantId?: string }
  | {
      allowed: false;
      code: 'GRANT_REQUIRED' | 'GRANT_EXPIRED' | 'GRANT_REVOKED' | 'GRANT_USED';
      message: string;
    };

const IMPLICIT_CAPABILITIES = new Set<AgentCapability>([
  'workflow:read',
  'workflow:propose',
  'source:retrieve',
]);

function sameScope(grant: AgentActionGrant, request: AgentActionRequest): boolean {
  return (
    grant.agentId === request.agentId &&
    grant.capability === request.capability &&
    grant.resourceType === request.resourceType &&
    grant.resourceId === request.resourceId
  );
}

/** Pure grant evaluation. Workspace membership remains a separate server boundary. */
export function evaluateAgentAction(
  request: AgentActionRequest,
  grants: readonly AgentActionGrant[],
  now = new Date(),
): AgentAuthorizationDecision {
  const parsed = AgentActionRequestSchema.parse(request);
  if (IMPLICIT_CAPABILITIES.has(parsed.capability)) return { allowed: true, code: 'IMPLICIT' };

  const scoped = grants.filter((grant) => sameScope(grant, parsed));
  const active = scoped.filter(
    (grant) => !grant.revokedAt && (!grant.expiresAt || new Date(grant.expiresAt) > now),
  );
  const matching = active.find((grant) => {
    if (grant.kind === 'reusable') return !grant.usedAt;
    return (
      grant.operationId === parsed.operationId &&
      grant.requestFingerprint === parsed.requestFingerprint &&
      (!grant.resourceRevision || grant.resourceRevision === parsed.resourceRevision) &&
      (!grant.usedAt || grant.usedByOperationId === parsed.operationId)
    );
  });
  if (matching) return { allowed: true, code: 'GRANTED', grantId: matching.id };
  if (scoped.some((grant) => grant.revokedAt))
    return { allowed: false, code: 'GRANT_REVOKED', message: 'The matching grant was revoked.' };
  if (scoped.some((grant) => grant.expiresAt && new Date(grant.expiresAt) <= now))
    return { allowed: false, code: 'GRANT_EXPIRED', message: 'The matching grant expired.' };
  if (scoped.some((grant) => grant.usedAt))
    return { allowed: false, code: 'GRANT_USED', message: 'The matching one-time grant was used.' };
  return {
    allowed: false,
    code: 'GRANT_REQUIRED',
    message: 'This agent operation needs an applicable action grant.',
  };
}

export function capabilityResourceType(capability: AgentCapability): AgentResourceType {
  if (capability.startsWith('workflow:')) return 'workflow';
  if (capability.startsWith('source:')) return 'source';
  return 'connection';
}
