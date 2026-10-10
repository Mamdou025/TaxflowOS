import { createHash, randomBytes } from 'node:crypto';
import { pool } from '@workspace/db';
import { WorkspaceRoleSchema } from '@workspace/api-zod/access';
import {
  AccessDeniedError,
  InvalidGrantError,
  InvalidRequestError,
  type OAuthError,
} from '@modelcontextprotocol/sdk/server/auth/errors.js';
import { parseWorkflowScopes, type OAuthConfig } from './config';
import type { GrantRow, OAuthActor } from './store-types';

// Resolve the promise overload; Pool.connect also has a callback/void overload.
const connect = () => pool.connect();
export type StoreClient = Awaited<ReturnType<typeof connect>>;
export const opaque = () => randomBytes(32).toString('base64url');
export const hash = (value: string) => createHash('sha256').update(value).digest('hex');
export const validOpaque = (value: string) => /^[A-Za-z0-9_-]{43}$/.test(value);
export const invalidGrant = () =>
  new InvalidGrantError('This authorization grant is unavailable. Reconnect InScope.');

/** Some denials must persist revocation; throwing inside the transaction would undo it. */
export class CommittedRejection {
  constructor(readonly error: OAuthError) {}
}
export async function transaction<T>(
  work: (client: StoreClient) => Promise<T | CommittedRejection>,
): Promise<T> {
  const client = await pool.connect();
  let result: T | CommittedRejection;
  try {
    await client.query('BEGIN');
    result = await work(client);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  if (result instanceof CommittedRejection) throw result.error;
  return result;
}

export function assertTarget(config: OAuthConfig, clientId: string, resource: string) {
  if (clientId !== config.clientId || resource !== config.resource)
    throw new InvalidRequestError(
      'The client or resource does not match this private integration.',
    );
}
export async function assertActor(client: StoreClient, config: OAuthConfig, actor: OAuthActor) {
  if (!config.pilotUserIds.includes(actor.userId))
    throw new AccessDeniedError('This account is not enabled for the private pilot.');
  const current = await client.query(
    `SELECT 1 FROM users u JOIN sessions s ON s.user_id=u.id
     WHERE u.id=$1 AND s.id=$2 AND s.expires_at>now() AND u.is_anonymous IS NOT TRUE`,
    [actor.userId, actor.sessionId],
  );
  if (!current.rowCount) throw new AccessDeniedError('Sign in with an eligible InScope account.');
}
export async function currentRole(
  client: StoreClient,
  config: OAuthConfig,
  userId: string,
  workspaceId: string,
) {
  if (!config.pilotUserIds.includes(userId)) return undefined;
  const { rows } = await client.query(
    `SELECT m.role FROM workspace_members m JOIN users u ON u.id=m.user_id
     WHERE m.user_id=$1 AND m.workspace_id=$2 AND u.is_anonymous IS NOT TRUE`,
    [userId, workspaceId],
  );
  const parsed = WorkspaceRoleSchema.safeParse(rows[0]?.role);
  return parsed.success ? parsed.data : undefined;
}
export async function lockGrant(client: StoreClient, grantId: string) {
  const { rows } = await client.query<GrantRow>(
    'SELECT * FROM chatgpt_oauth_grants WHERE id=$1 FOR UPDATE',
    [grantId],
  );
  return rows[0];
}
export function grantMatches(
  config: OAuthConfig,
  grant: GrantRow | undefined,
  clientId: string,
  resource: string,
) {
  return (
    grant &&
    grant.client_id === clientId &&
    clientId === config.clientId &&
    grant.resource === resource &&
    resource === config.resource &&
    parseWorkflowScopes(grant.scope)?.join(' ') === grant.scope
  );
}
export function grantAvailable(grant: GrantRow) {
  return !grant.revoked_at && grant.expires_at.getTime() > Date.now();
}
export async function revoke(client: StoreClient, grantId: string) {
  await client.query(
    'UPDATE chatgpt_oauth_grants SET revoked_at=COALESCE(revoked_at,now()) WHERE id=$1',
    [grantId],
  );
}
