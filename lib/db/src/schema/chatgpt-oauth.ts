import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { workspaces } from './workspaces';

const time = (name: string) => timestamp(name, { withTimezone: true });
export const chatgptOAuthRequests = pgTable(
  'chatgpt_oauth_requests',
  {
    requestHash: text('request_hash').primaryKey(),
    clientId: text('client_id').notNull(),
    redirectUri: text('redirect_uri').notNull(),
    codeChallenge: text('code_challenge').notNull(),
    resource: text('resource').notNull(),
    scope: text('scope').notNull(),
    clientState: text('client_state'),
    boundUserId: text('bound_user_id').references(() => users.id, { onDelete: 'cascade' }),
    boundSessionId: text('bound_session_id'),
    createdAt: time('created_at').notNull().defaultNow(),
    expiresAt: time('expires_at').notNull(),
    consumedAt: time('consumed_at'),
  },
  (t) => [
    check(
      'chatgpt_oauth_request_scope',
      sql`${t.scope} IN (
      'inscope.workflows:read',
      'inscope.workflows:read inscope.workflows:write',
      'inscope.workflows:read inscope.workflows:execute',
      'inscope.workflows:read inscope.workflows:write inscope.workflows:execute'
    )`,
    ),
    check(
      'chatgpt_oauth_request_binding',
      sql`(${t.boundUserId} IS NULL) = (${t.boundSessionId} IS NULL)`,
    ),
    check('chatgpt_oauth_request_expiry', sql`${t.expiresAt} > ${t.createdAt}`),
    index('chatgpt_oauth_request_expiry_idx').on(t.expiresAt),
  ],
);

export const chatgptOAuthGrants = pgTable(
  'chatgpt_oauth_grants',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    clientId: text('client_id').notNull(),
    resource: text('resource').notNull(),
    scope: text('scope').notNull(),
    createdAt: time('created_at').notNull().defaultNow(),
    expiresAt: time('expires_at').notNull(),
    lastUsedAt: time('last_used_at'),
    revokedAt: time('revoked_at'),
  },
  (t) => [
    check(
      'chatgpt_oauth_grant_scope',
      sql`${t.scope} IN (
      'inscope.workflows:read',
      'inscope.workflows:read inscope.workflows:write',
      'inscope.workflows:read inscope.workflows:execute',
      'inscope.workflows:read inscope.workflows:write inscope.workflows:execute'
    )`,
    ),
    check('chatgpt_oauth_grant_expiry', sql`${t.expiresAt} > ${t.createdAt}`),
    index('chatgpt_oauth_grant_user_idx').on(t.userId, t.createdAt),
  ],
);

export const chatgptOAuthCodes = pgTable(
  'chatgpt_oauth_codes',
  {
    codeHash: text('code_hash').primaryKey(),
    grantId: text('grant_id')
      .notNull()
      .references(() => chatgptOAuthGrants.id, { onDelete: 'cascade' }),
    redirectUri: text('redirect_uri').notNull(),
    codeChallenge: text('code_challenge').notNull(),
    createdAt: time('created_at').notNull().defaultNow(),
    expiresAt: time('expires_at').notNull(),
    consumedAt: time('consumed_at'),
  },
  (t) => [
    check('chatgpt_oauth_code_expiry', sql`${t.expiresAt} > ${t.createdAt}`),
    index('chatgpt_oauth_code_grant_idx').on(t.grantId),
  ],
);

export const chatgptOAuthTokens = pgTable(
  'chatgpt_oauth_tokens',
  {
    tokenHash: text('token_hash').primaryKey(),
    grantId: text('grant_id')
      .notNull()
      .references(() => chatgptOAuthGrants.id, { onDelete: 'cascade' }),
    kind: text('kind').notNull().$type<'access' | 'refresh'>(),
    createdAt: time('created_at').notNull().defaultNow(),
    expiresAt: time('expires_at').notNull(),
    usedAt: time('used_at'),
  },
  (t) => [
    check('chatgpt_oauth_token_kind', sql`${t.kind} IN ('access','refresh')`),
    check('chatgpt_oauth_token_expiry', sql`${t.expiresAt} > ${t.createdAt}`),
    index('chatgpt_oauth_token_grant_idx').on(t.grantId),
    index('chatgpt_oauth_token_expiry_idx').on(t.expiresAt),
  ],
);
