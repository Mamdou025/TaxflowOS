export const SCOPE = 'inscope.workflows:read';
export const WRITE_SCOPE = 'inscope.workflows:write';
export const EXECUTE_SCOPE = 'inscope.workflows:execute';
export const ALL_SCOPES = [SCOPE, WRITE_SCOPE, EXECUTE_SCOPE] as const;
export type WorkflowScope = (typeof ALL_SCOPES)[number];
export const CLIENT_NAME = 'ChatGPT — InScope private pilot';

/** Read is the discovery baseline; write and execute are independent opt-ins. */
export function parseWorkflowScopes(value: string | readonly string[] | undefined) {
  const scopes = typeof value === 'string' ? value.split(' ') : value;
  if (
    !scopes?.length ||
    new Set(scopes).size !== scopes.length ||
    !scopes.includes(SCOPE) ||
    scopes.some((scope) => !ALL_SCOPES.some((supported) => supported === scope))
  )
    return undefined;
  return ALL_SCOPES.filter((scope) => scopes.includes(scope));
}

export function canConsentWorkflowScopes(role: string | undefined, scopes: readonly string[]) {
  if (!role || !parseWorkflowScopes(scopes)) return false;
  return scopes.some((scope) => scope === WRITE_SCOPE || scope === EXECUTE_SCOPE)
    ? role === 'owner' || role === 'editor'
    : ['owner', 'editor', 'viewer'].includes(role);
}

export type OAuthConfig = {
  issuer: string;
  resource: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  pilotUserIds: readonly string[];
};

/** An unconfigured installation keeps its existing browser-only reader. */
export function loadOAuthConfig(
  env: Record<string, string | undefined>,
  origin: string,
): OAuthConfig | undefined {
  const values = [
    env.INSCOPE_CHATGPT_OAUTH_CLIENT_ID,
    env.INSCOPE_CHATGPT_OAUTH_CLIENT_SECRET,
    env.INSCOPE_CHATGPT_OAUTH_REDIRECT_URI,
    env.INSCOPE_CHATGPT_PILOT_USER_IDS,
  ];
  if (values.every((value) => !value)) return undefined;
  const [clientId, clientSecret, redirectUri, actors] = values;
  const fail = () => {
    throw new Error(
      'Configure all four InScope ChatGPT OAuth settings with a valid client, secret, exact callback and pilot account IDs. See docs/chatgpt-plugin.md.',
    );
  };
  if (!clientId || !clientSecret || !redirectUri || !actors) return fail();
  const pilotUserIds = [...new Set(actors.split(',').map((id) => id.trim()))];
  if (
    !/^[A-Za-z0-9._-]{1,200}$/.test(clientId) ||
    clientSecret.length < 32 ||
    clientSecret.length > 512 ||
    pilotUserIds.length > 20 ||
    pilotUserIds.some((id) => !/^[A-Za-z0-9_-]{1,128}$/.test(id))
  )
    return fail();
  let callback: URL, issuer: URL;
  try {
    callback = new URL(redirectUri);
    issuer = new URL(origin);
  } catch {
    return fail();
  }
  const loopback = (url: URL) => ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (
    issuer.origin !== origin ||
    (issuer.protocol !== 'https:' && !(issuer.protocol === 'http:' && loopback(issuer))) ||
    callback.username ||
    callback.password ||
    callback.hash ||
    callback.href !== redirectUri ||
    (callback.protocol !== 'https:' &&
      !(callback.protocol === 'http:' && loopback(callback) && loopback(issuer)))
  )
    return fail();
  return {
    issuer: origin,
    resource: `${origin}/api/chatgpt/mcp`,
    clientId,
    clientSecret,
    redirectUri,
    pilotUserIds,
  };
}
