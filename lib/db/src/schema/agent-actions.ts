import { check, index, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './auth';
import { workspaces } from './workspaces';

export type AgentGrantKind = 'one-time' | 'reusable';
export type AgentOperationStatus = 'allowed' | 'denied' | 'succeeded' | 'failed' | 'conflict';

export const agentActionGrants = pgTable(
  'agent_action_grants',
  {
    id: text('id').primaryKey(),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    actorId: text('actor_id')
      .notNull()
      .references(() => users.id),
    agentId: text('agent_id').notNull(),
    capability: text('capability').notNull(),
    resourceType: text('resource_type').notNull(),
    resourceId: text('resource_id').notNull(),
    kind: text('kind').notNull().$type<AgentGrantKind>(),
    operationId: text('operation_id'),
    resourceRevision: text('resource_revision'),
    requestFingerprint: text('request_fingerprint'),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    usedAt: timestamp('used_at', { withTimezone: true }),
    usedByOperationId: text('used_by_operation_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('agent_grants_scope_idx').on(
      table.workspaceId,
      table.actorId,
      table.agentId,
      table.capability,
      table.resourceType,
      table.resourceId,
    ),
    check('agent_grants_kind', sql`${table.kind} in ('one-time', 'reusable')`),
  ],
);

export const agentActionOperations = pgTable(
  'agent_action_operations',
  {
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    actorId: text('actor_id')
      .notNull()
      .references(() => users.id),
    operationId: text('operation_id').notNull(),
    agentId: text('agent_id').notNull(),
    capability: text('capability').notNull(),
    resourceType: text('resource_type').notNull(),
    resourceId: text('resource_id').notNull(),
    resourceRevision: text('resource_revision'),
    requestFingerprint: text('request_fingerprint'),
    requestSignature: text('request_signature').notNull(),
    grantId: text('grant_id').references(() => agentActionGrants.id),
    status: text('status').notNull().$type<AgentOperationStatus>(),
    message: text('message'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.workspaceId, table.actorId, table.operationId] }),
    index('agent_operations_resource_idx').on(
      table.workspaceId,
      table.resourceType,
      table.resourceId,
      table.createdAt,
    ),
    check(
      'agent_operations_status',
      sql`${table.status} in ('allowed', 'denied', 'succeeded', 'failed', 'conflict')`,
    ),
  ],
);

export type AgentActionGrantRow = typeof agentActionGrants.$inferSelect;
export type AgentActionOperationRow = typeof agentActionOperations.$inferSelect;
