import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { workspaces } from './workspaces';

export const chatgptSessionOperations = pgTable(
  'chatgpt_session_operations',
  {
    operationKey: text('operation_key').primaryKey(),
    actorId: text('actor_id')
      .notNull()
      .references(() => users.id),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    workflowId: text('workflow_id').notNull(),
    runId: text('run_id'),
    kind: text('kind').notNull(),
    requestHash: text('request_hash').notNull(),
    action: jsonb('action').notNull(),
    preview: jsonb('preview'),
    receipt: jsonb('receipt'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (table) => [
    check(
      'chatgpt_session_operations_kind_check',
      sql`${table.kind} in ('start', 'change', 'recalculate')`,
    ),
    index('chatgpt_session_operations_history_idx').on(
      table.workspaceId,
      table.workflowId,
      table.runId,
      table.createdAt,
    ),
  ],
);
