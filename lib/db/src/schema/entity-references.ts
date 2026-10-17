import { customAlphabet } from 'nanoid';
import { index, jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { workspaces } from './workspaces';

const generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 21);

/**
 * A derived, rebuildable index of cross-entity relationships an owning module already
 * knows about (e.g. a workflow run whose source read a document). Never the source of
 * truth for a relationship — every row here must be recomputable from the owning
 * records — and writing a row never changes which module owns the underlying data.
 */
export const entityReferences = pgTable(
  'entity_references',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => generateId()),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    fromType: text('from_type').notNull(),
    fromId: text('from_id').notNull(),
    toType: text('to_type').notNull(),
    toId: text('to_id').notNull(),
    context: jsonb('context'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('entity_references_edge_idx').on(
      t.workspaceId,
      t.fromType,
      t.fromId,
      t.toType,
      t.toId,
    ),
    index('entity_references_from_idx').on(t.workspaceId, t.fromType, t.fromId),
    index('entity_references_to_idx').on(t.workspaceId, t.toType, t.toId),
  ],
);
export type EntityReference = typeof entityReferences.$inferSelect;
export type NewEntityReference = typeof entityReferences.$inferInsert;
