import { pool } from '@workspace/db';
import { InvalidGrantError } from '@modelcontextprotocol/sdk/server/auth/errors.js';
import type { OAuthConfig } from './config';
import { requestOperations } from './store-requests';
import { tokenOperations } from './store-tokens';
import type { OAuthGrantSummary } from './store-types';

/** OAuth persistence is separate from Better Auth sessions and workflow state. */
export function createOAuthStore(config: OAuthConfig) {
  return {
    ...requestOperations(config),
    ...tokenOperations(config),
    async listGrants(userId: string): Promise<OAuthGrantSummary[]> {
      const { rows } = await pool.query<{
        id: string;
        workspace_id: string;
        workspace_name: string;
        scope: string;
        created_at: Date;
        expires_at: Date;
        last_used_at: Date | null;
        revoked_at: Date | null;
      }>(
        `SELECT g.id,g.workspace_id,w.name AS workspace_name,g.scope,g.created_at,g.expires_at,g.last_used_at,g.revoked_at
         FROM chatgpt_oauth_grants g JOIN workspaces w ON w.id=g.workspace_id
         WHERE g.user_id=$1 ORDER BY g.created_at DESC,g.id`,
        [userId],
      );
      return rows.map((grant) => ({
        id: grant.id,
        workspaceId: grant.workspace_id,
        workspaceName: grant.workspace_name,
        scope: grant.scope,
        createdAt: grant.created_at.toISOString(),
        expiresAt: grant.expires_at.toISOString(),
        lastUsedAt: grant.last_used_at?.toISOString() ?? null,
        revokedAt: grant.revoked_at?.toISOString() ?? null,
      }));
    },
    async revokeGrant(userId: string, grantId: string) {
      const result = await pool.query(
        'UPDATE chatgpt_oauth_grants SET revoked_at=COALESCE(revoked_at,now()) WHERE id=$1 AND user_id=$2',
        [grantId, userId],
      );
      if (!result.rowCount) throw new InvalidGrantError('This connection is unavailable.');
    },
  };
}
export type OAuthStore = ReturnType<typeof createOAuthStore>;
