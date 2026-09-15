import { pgTable, text, timestamp, integer, primaryKey, check, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './auth';

export const workspaces = pgTable('workspaces', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdBy: text('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const workspaceMembers = pgTable('workspace_members', {
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  userId: text('user_id').notNull().references(() => users.id),
  role: text('role').notNull().$type<'owner' | 'editor' | 'viewer'>(),
}, t => [
  primaryKey({ columns: [t.workspaceId, t.userId] }),
  check('workspace_member_role', sql`${t.role} in ('owner', 'editor', 'viewer')`),
  index('workspace_members_user_idx').on(t.userId),
]);
export const workspaceLibraries = pgTable('workspace_libraries', {
  workspaceId: text('workspace_id').primaryKey().references(() => workspaces.id),
  payload: text('payload').notNull(),
  revision: integer('revision').notNull().default(1),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  updatedBy: text('updated_by').notNull().references(() => users.id),
});
export const legacyLibraryClaims = pgTable('legacy_library_claims', {
  workspaceHash: text('workspace_hash').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  claimedBy: text('claimed_by').notNull().references(() => users.id),
  claimedAt: timestamp('claimed_at', { withTimezone: true }).notNull().defaultNow(),
});
