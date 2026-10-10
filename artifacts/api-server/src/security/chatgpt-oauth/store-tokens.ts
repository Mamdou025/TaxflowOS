import { pool } from '@workspace/db';
import {
  InvalidScopeError,
  InvalidTokenError,
} from '@modelcontextprotocol/sdk/server/auth/errors.js';
import type { OAuthTokens } from '@modelcontextprotocol/sdk/shared/auth.js';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { parseWorkflowScopes, type OAuthConfig } from './config';
import {
  CommittedRejection,
  currentRole,
  grantAvailable,
  grantMatches,
  hash,
  invalidGrant,
  lockGrant,
  opaque,
  revoke,
  transaction,
  validOpaque,
  type StoreClient,
} from './store-common';
import type { GrantRow, OAuthCodeExchange, OAuthRefresh } from './store-types';

type TokenRow = {
  grant_id: string;
  kind: 'access' | 'refresh';
  expires_at: Date;
  used_at: Date | null;
};
type CodeRow = {
  grant_id: string;
  redirect_uri: string;
  expires_at: Date;
  consumed_at: Date | null;
};
async function issueTokens(client: StoreClient, grant: GrantRow): Promise<OAuthTokens> {
  const accessToken = opaque();
  const refreshToken = opaque();
  const mintedAt = Date.now();
  const expiresAt = new Date(Math.min(mintedAt + 900_000, grant.expires_at.getTime()));
  const expiresIn = Math.floor((expiresAt.getTime() - mintedAt) / 1000);
  if (expiresIn < 1) throw invalidGrant();
  await client.query(
    `INSERT INTO chatgpt_oauth_tokens(token_hash,grant_id,kind,expires_at)
     VALUES($1,$2,'access',$3),($4,$2,'refresh',$5)`,
    [hash(accessToken), grant.id, expiresAt, hash(refreshToken), grant.expires_at],
  );
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: 'Bearer',
    expires_in: expiresIn,
    scope: grant.scope,
  };
}
async function rejectIneligible(client: StoreClient, config: OAuthConfig, grant: GrantRow) {
  const role = await currentRole(client, config, grant.user_id, grant.workspace_id);
  if (role) return role;
  await revoke(client, grant.id);
  return new CommittedRejection(invalidGrant());
}
export function tokenOperations(config: OAuthConfig) {
  return {
    exchangeCode(input: OAuthCodeExchange): Promise<OAuthTokens> {
      return transaction(async (client) => {
        if (
          !validOpaque(input.code) ||
          input.clientId !== config.clientId ||
          input.redirectUri !== config.redirectUri ||
          input.resource !== config.resource
        )
          throw invalidGrant();
        const codeHash = hash(input.code);
        const found = await client.query<CodeRow>(
          'SELECT * FROM chatgpt_oauth_codes WHERE code_hash=$1',
          [codeHash],
        );
        if (!found.rows[0]) throw invalidGrant();
        // All token mutations lock the grant first, then its code/token row.
        const grant = await lockGrant(client, found.rows[0].grant_id);
        if (
          !grant ||
          !grantMatches(config, grant, input.clientId, input.resource) ||
          !grantAvailable(grant)
        )
          throw invalidGrant();
        const { rows } = await client.query<CodeRow>(
          'SELECT * FROM chatgpt_oauth_codes WHERE code_hash=$1 FOR UPDATE',
          [codeHash],
        );
        const code = rows[0];
        if (
          !code ||
          code.redirect_uri !== input.redirectUri ||
          code.expires_at.getTime() <= Date.now()
        )
          throw invalidGrant();
        // The SDK has verified PKCE before this call. A valid replay revokes the
        // issued grant; a wrong verifier never reaches this mutation.
        if (code.consumed_at) {
          await revoke(client, grant.id);
          return new CommittedRejection(invalidGrant());
        }
        const eligible = await rejectIneligible(client, config, grant);
        if (eligible instanceof CommittedRejection) return eligible;
        await client.query('UPDATE chatgpt_oauth_codes SET consumed_at=now() WHERE code_hash=$1', [
          codeHash,
        ]);
        return issueTokens(client, grant);
      });
    },
    refresh(input: OAuthRefresh): Promise<OAuthTokens> {
      const requestedScopes =
        input.scopes === undefined ? undefined : parseWorkflowScopes(input.scopes);
      if (input.scopes !== undefined && !requestedScopes)
        return Promise.reject(new InvalidScopeError('The granted scope cannot be changed.'));
      return transaction(async (client) => {
        if (
          !validOpaque(input.refreshToken) ||
          input.clientId !== config.clientId ||
          input.resource !== config.resource
        )
          throw invalidGrant();
        const tokenHash = hash(input.refreshToken);
        const found = await client.query<TokenRow>(
          'SELECT * FROM chatgpt_oauth_tokens WHERE token_hash=$1',
          [tokenHash],
        );
        if (!found.rows[0] || found.rows[0].kind !== 'refresh') throw invalidGrant();
        const grant = await lockGrant(client, found.rows[0].grant_id);
        if (
          !grant ||
          !grantMatches(config, grant, input.clientId, input.resource) ||
          !grantAvailable(grant)
        )
          throw invalidGrant();
        // A scope-change attempt must not consume a token or revoke a valid grant.
        if (requestedScopes && requestedScopes.join(' ') !== grant.scope)
          throw new InvalidScopeError('Reconnect to request a different set of permissions.');
        const { rows } = await client.query<TokenRow>(
          'SELECT * FROM chatgpt_oauth_tokens WHERE token_hash=$1 FOR UPDATE',
          [tokenHash],
        );
        const token = rows[0];
        if (!token || token.expires_at.getTime() <= Date.now()) throw invalidGrant();
        if (token.used_at) {
          await revoke(client, grant.id);
          return new CommittedRejection(invalidGrant());
        }
        const eligible = await rejectIneligible(client, config, grant);
        if (eligible instanceof CommittedRejection) return eligible;
        await client.query('UPDATE chatgpt_oauth_tokens SET used_at=now() WHERE token_hash=$1', [
          tokenHash,
        ]);
        return issueTokens(client, grant);
      });
    },
    verify(token: string): Promise<AuthInfo> {
      return transaction(async (client) => {
        const invalidToken = () =>
          new InvalidTokenError('The InScope connection is expired, revoked or unavailable.');
        if (!validOpaque(token)) throw invalidToken();
        const { rows } = await client.query<TokenRow>(
          'SELECT * FROM chatgpt_oauth_tokens WHERE token_hash=$1',
          [hash(token)],
        );
        const stored = rows[0];
        if (!stored || stored.kind !== 'access' || stored.expires_at.getTime() <= Date.now())
          throw invalidToken();
        const grant = await lockGrant(client, stored.grant_id);
        if (
          !grant ||
          !grantMatches(config, grant, config.clientId, config.resource) ||
          !grantAvailable(grant)
        )
          throw invalidToken();
        const role = await currentRole(client, config, grant.user_id, grant.workspace_id);
        if (!role) {
          await revoke(client, grant.id);
          return new CommittedRejection(invalidToken());
        }
        await client.query('UPDATE chatgpt_oauth_grants SET last_used_at=now() WHERE id=$1', [
          grant.id,
        ]);
        // Waiting for another refresh/revocation transaction must not extend access.
        if (stored.expires_at.getTime() <= Date.now() || !grantAvailable(grant))
          throw invalidToken();
        return {
          token,
          clientId: grant.client_id,
          scopes: grant.scope.split(' '),
          expiresAt: Math.floor(
            Math.min(stored.expires_at.getTime(), grant.expires_at.getTime()) / 1000,
          ),
          resource: new URL(grant.resource),
          extra: {
            userId: grant.user_id,
            workspaceId: grant.workspace_id,
            workspaceRole: role,
            grantId: grant.id,
          },
        };
      });
    },
    async revokeToken(clientId: string, token: string) {
      if (clientId !== config.clientId || !validOpaque(token)) return;
      await pool.query(
        `UPDATE chatgpt_oauth_grants g SET revoked_at=COALESCE(g.revoked_at,now())
         FROM chatgpt_oauth_tokens t WHERE t.grant_id=g.id AND t.token_hash=$1 AND g.client_id=$2`,
        [hash(token), clientId],
      );
    },
  };
}
