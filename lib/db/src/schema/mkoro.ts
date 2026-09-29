import { sql } from 'drizzle-orm';
import {
  bigserial,
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from './auth';
import { workspaces } from './workspaces';

const time = (name: string) => timestamp(name, { withTimezone: true });
export const mkoroWorkers = pgTable('mkoro_workers', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspaces.id),
  actorId: text('actor_id')
    .notNull()
    .references(() => users.id),
  name: text('name').notNull(),
  autoApprove: boolean('auto_approve').notNull().default(false),
  tokenHash: text('token_hash').notNull().unique(),
  capabilities: jsonb('capabilities').$type<string[]>().notNull().default([]),
  createdAt: time('created_at').notNull().defaultNow(),
  lastSeenAt: time('last_seen_at'),
  revokedAt: time('revoked_at'),
});
export const mkoroPairings = pgTable('mkoro_pairings', {
  tokenHash: text('token_hash').primaryKey(),
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspaces.id),
  actorId: text('actor_id')
    .notNull()
    .references(() => users.id),
  expiresAt: time('expires_at').notNull(),
  usedAt: time('used_at'),
  createdAt: time('created_at').notNull().defaultNow(),
});
export const mkoroConversations = pgTable(
  'mkoro_conversations',
  {
    id: text('id').primaryKey(),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    actorId: text('actor_id')
      .notNull()
      .references(() => users.id),
    workerId: text('worker_id')
      .notNull()
      .references(() => mkoroWorkers.id),
    title: text('title').notNull(),
    // Historical companion activity survives deletion of its Sina thread.
    sinaThreadId: text('sina_thread_id'),
    createdAt: time('created_at').notNull().defaultNow(),
    updatedAt: time('updated_at').notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('mkoro_sina_thread_worker')
      .on(t.workspaceId, t.actorId, t.sinaThreadId, t.workerId)
      .where(sql`${t.sinaThreadId} IS NOT NULL`),
  ],
);
export const mkoroTasks = pgTable(
  'mkoro_tasks',
  {
    id: text('id').primaryKey(),
    conversationId: text('conversation_id')
      .notNull()
      .references(() => mkoroConversations.id),
    workerId: text('worker_id')
      .notNull()
      .references(() => mkoroWorkers.id),
    requestId: text('request_id').notNull(),
    message: text('message').notNull(),
    delegation: jsonb('delegation').$type<Record<string, unknown>>(),
    status: text('status').notNull().default('queued'),
    error: text('error'),
    cancelRequested: boolean('cancel_requested').notNull().default(false),
    createdAt: time('created_at').notNull().defaultNow(),
    updatedAt: time('updated_at').notNull().defaultNow(),
  },
  (t) => [
    unique().on(t.conversationId, t.requestId),
    uniqueIndex('mkoro_one_active_task')
      .on(t.workerId)
      .where(sql`${t.status} IN ('queued','running','waiting_permission')`),
    check(
      'mkoro_task_status',
      sql`${t.status} IN ('queued','running','waiting_permission','completed','failed','cancelled')`,
    ),
  ],
);
export const mkoroCommands = pgTable(
  'mkoro_commands',
  {
    id: text('id').primaryKey(),
    workerId: text('worker_id')
      .notNull()
      .references(() => mkoroWorkers.id),
    taskId: text('task_id')
      .notNull()
      .references(() => mkoroTasks.id),
    type: text('type').notNull(),
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull(),
    createdAt: time('created_at').notNull().defaultNow(),
    deliveredAt: time('delivered_at'),
  },
  (t) => [
    index('mkoro_commands_pending')
      .on(t.workerId, t.createdAt)
      .where(sql`${t.deliveredAt} IS NULL`),
    check('mkoro_command_type', sql`${t.type} IN ('message','cancel','permission')`),
  ],
);
export const mkoroEvents = pgTable(
  'mkoro_events',
  {
    cursor: bigserial('cursor', { mode: 'number' }).primaryKey(),
    id: text('id').notNull().unique(),
    taskId: text('task_id')
      .notNull()
      .references(() => mkoroTasks.id),
    seq: integer('seq').notNull(),
    type: text('type').notNull(),
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull(),
    createdAt: time('created_at').notNull().defaultNow(),
  },
  (t) => [unique().on(t.taskId, t.seq)],
);
export const mkoroPermissions = pgTable(
  'mkoro_permissions',
  {
    taskId: text('task_id')
      .notNull()
      .references(() => mkoroTasks.id),
    requestId: text('request_id').notNull(),
    options: jsonb('options').$type<Record<string, unknown>[]>().notNull(),
    toolCall: jsonb('tool_call').$type<unknown>(),
    decision: text('decision'),
    decisionSource: text('decision_source').notNull().default('manual'),
    createdAt: time('created_at').notNull().defaultNow(),
    decidedAt: time('decided_at'),
  },
  (t) => [
    primaryKey({ columns: [t.taskId, t.requestId] }),
    check('mkoro_permission_decision_source', sql`${t.decisionSource} IN ('manual','automatic')`),
  ],
);
