import { randomUUID } from 'node:crypto';
import {
  AccessDeniedError,
  InvalidRequestError,
} from '@modelcontextprotocol/sdk/server/auth/errors.js';
import { WorkspaceIdSchema, WorkspaceRoleSchema } from '@workspace/api-zod/access';
import { pool } from '@workspace/db';
import {
  CLIENT_NAME,
  canConsentWorkflowScopes,
  parseWorkflowScopes,
  type OAuthConfig,
} from './config';
import {
  assertActor,
  assertTarget,
  currentRole,
  hash,
  invalidGrant,
  opaque,
  transaction,
  validOpaque,
  type StoreClient,
} from './store-common';
import type {
  OAuthActor,
  OAuthDecision,
  OAuthRequestDetails,
  OAuthRequestInput,
} from './store-types';

type RequestRow = {
  request_hash: string;
  client_id: string;
  redirect_uri: string;
  code_challenge: string;
  resource: string;
  scope: string;
  client_state: string | null;
  bound_user_id: string | null;
  bound_session_id: string | null;
  expires_at: Date;
  consumed_at: Date | null;
};
async function requestRow(client: StoreClient, config: OAuthConfig, requestId: string) {
  if (!validOpaque(requestId)) throw invalidGrant();
  const { rows } = await client.query<RequestRow>(
    'SELECT * FROM chatgpt_oauth_requests WHERE request_hash=$1 FOR UPDATE',
    [hash(requestId)],
  );
  const row = rows[0];
  if (
    !row ||
    row.consumed_at ||
    row.expires_at.getTime() <= Date.now() ||
    row.client_id !== config.clientId ||
    row.redirect_uri !== config.redirectUri ||
    row.resource !== config.resource ||
    parseWorkflowScopes(row.scope)?.join(' ') !== row.scope
  )
    throw invalidGrant();
  return row;
}
function sameActor(row: RequestRow, actor: OAuthActor) {
  return row.bound_user_id === actor.userId && row.bound_session_id === actor.sessionId;
}
export function requestOperations(config: OAuthConfig) {
  return {
    async createRequest(params: OAuthRequestInput) {
      assertTarget(config, params.clientId, params.resource);
      const scopes = parseWorkflowScopes(params.scope);
      if (
        params.redirectUri !== config.redirectUri ||
        !scopes ||
        !validOpaque(params.codeChallenge) ||
        (params.state?.length ?? 0) > 2048
      )
        throw new InvalidRequestError('Invalid authorization request.');
      const requestId = opaque();
      await pool.query(
        `INSERT INTO chatgpt_oauth_requests(request_hash,client_id,redirect_uri,code_challenge,resource,scope,client_state,expires_at)
         VALUES($1,$2,$3,$4,$5,$6,$7,now()+interval '10 minutes')`,
        [
          hash(requestId),
          params.clientId,
          params.redirectUri,
          params.codeChallenge,
          params.resource,
          scopes.join(' '),
          params.state ?? null,
        ],
      );
      return requestId;
    },
    getRequest(requestId: string, actor: OAuthActor): Promise<OAuthRequestDetails> {
      return transaction(async (client) => {
        await assertActor(client, config, actor);
        const row = await requestRow(client, config, requestId);
        if (row.bound_user_id !== null && !sameActor(row, actor)) throw invalidGrant();
        if (row.bound_user_id === null)
          await client.query(
            'UPDATE chatgpt_oauth_requests SET bound_user_id=$2,bound_session_id=$3 WHERE request_hash=$1',
            [row.request_hash, actor.userId, actor.sessionId],
          );
        const { rows } = await client.query<{ id: string; name: string; role: string }>(
          `SELECT w.id,w.name,m.role FROM workspaces w JOIN workspace_members m ON m.workspace_id=w.id
           WHERE m.user_id=$1 ORDER BY w.name,w.id`,
          [actor.userId],
        );
        return {
          clientName: CLIENT_NAME,
          scope: row.scope,
          resource: config.resource,
          redirectUri: config.redirectUri,
          expiresAt: row.expires_at.toISOString(),
          workspaces: rows.flatMap((workspace) => {
            const role = WorkspaceRoleSchema.safeParse(workspace.role);
            return role.success && canConsentWorkflowScopes(role.data, row.scope.split(' '))
              ? [{ ...workspace, role: role.data }]
              : [];
          }),
        };
      });
    },
    decideRequest(requestId: string, actor: OAuthActor, decision: OAuthDecision) {
      return transaction(async (client) => {
        await assertActor(client, config, actor);
        const row = await requestRow(client, config, requestId);
        if (!sameActor(row, actor)) throw invalidGrant();
        const redirect = new URL(row.redirect_uri);
        if (row.client_state !== null) redirect.searchParams.set('state', row.client_state);
        if (decision.decision === 'deny') {
          redirect.searchParams.set('error', 'access_denied');
        } else if (decision.decision === 'allow') {
          const parsed = WorkspaceIdSchema.safeParse(decision.workspaceId);
          const role = parsed.success
            ? await currentRole(client, config, actor.userId, parsed.data)
            : undefined;
          if (!parsed.success || !canConsentWorkflowScopes(role, row.scope.split(' ')))
            throw new AccessDeniedError(
              'Choose a workspace where your current role permits the requested access.',
            );
          const grantId = randomUUID();
          await client.query(
            `INSERT INTO chatgpt_oauth_grants(id,user_id,workspace_id,client_id,resource,scope,expires_at)
             VALUES($1,$2,$3,$4,$5,$6,now()+interval '7 days')`,
            [grantId, actor.userId, parsed.data, row.client_id, row.resource, row.scope],
          );
          const code = opaque();
          await client.query(
            `INSERT INTO chatgpt_oauth_codes(code_hash,grant_id,redirect_uri,code_challenge,expires_at)
             VALUES($1,$2,$3,$4,now()+interval '5 minutes')`,
            [hash(code), grantId, row.redirect_uri, row.code_challenge],
          );
          redirect.searchParams.set('code', code);
        } else throw new InvalidRequestError('Choose allow or deny.');
        await client.query(
          'UPDATE chatgpt_oauth_requests SET consumed_at=now() WHERE request_hash=$1',
          [row.request_hash],
        );
        return { redirectUrl: redirect.href };
      });
    },
    async challengeForCode(clientId: string, code: string) {
      if (!validOpaque(code) || clientId !== config.clientId) throw invalidGrant();
      const { rows } = await pool.query<{ code_challenge: string; scope: string }>(
        `SELECT c.code_challenge,g.scope FROM chatgpt_oauth_codes c JOIN chatgpt_oauth_grants g ON g.id=c.grant_id
         WHERE c.code_hash=$1 AND g.client_id=$2 AND g.resource=$3
         AND c.expires_at>now() AND g.revoked_at IS NULL AND g.expires_at>now()`,
        [hash(code), clientId, config.resource],
      );
      if (!rows[0] || parseWorkflowScopes(rows[0].scope)?.join(' ') !== rows[0].scope)
        throw invalidGrant();
      return rows[0].code_challenge;
    },
  };
}
