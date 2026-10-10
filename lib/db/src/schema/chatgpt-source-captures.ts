import { sql } from 'drizzle-orm';
import { check, index, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import type { DocumentExtraction } from '@workspace/workflow-contracts/domain/document-extraction';
import { users } from './auth';
import { workspaces } from './workspaces';

export const chatgptSourceCaptures = pgTable(
  'chatgpt_source_captures',
  {
    id: text('id').primaryKey(),
    actorId: text('actor_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    workflowId: text('workflow_id').notNull(),
    runId: text('run_id').notNull(),
    blockId: text('block_id').notNull(),
    sessionRevision: integer('session_revision').notNull(),
    fileName: text('file_name').notNull(),
    mimeType: text('mime_type').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    uploadedBytes: integer('uploaded_bytes').notNull().default(0),
    contentBase64: text('content_base64').notNull().default(''),
    extraction: jsonb('extraction').$type<DocumentExtraction>(),
    selection: jsonb('selection').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (t) => [
    check(
      'chatgpt_source_capture_size',
      sql`${t.sizeBytes} > 0 AND ${t.sizeBytes} <= 20971520 AND ${t.uploadedBytes} >= 0 AND ${t.uploadedBytes} <= ${t.sizeBytes}`,
    ),
    check('chatgpt_source_capture_revision', sql`${t.sessionRevision} >= 0`),
    check('chatgpt_source_capture_expiry', sql`${t.expiresAt} > ${t.createdAt}`),
    index('chatgpt_source_capture_expiry_idx').on(t.expiresAt),
    index('chatgpt_source_capture_actor_idx').on(t.actorId, t.workspaceId),
  ],
);
