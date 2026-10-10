import type { OAuthServerProvider } from '@modelcontextprotocol/sdk/server/auth/provider.js';
import {
  InvalidRequestError,
  InvalidScopeError,
} from '@modelcontextprotocol/sdk/server/auth/errors.js';
import { ALL_SCOPES, CLIENT_NAME, parseWorkflowScopes, type OAuthConfig } from './config';
import { createOAuthStore } from './store';

/** SDK owns protocol parsing/PKCE; the store owns one-use credentials and grants. */
export function createOAuthProvider(config: OAuthConfig) {
  const store = createOAuthStore(config);
  const resource = (url?: URL) => {
    if (url?.href !== config.resource)
      throw new InvalidRequestError('The exact InScope resource is required.');
    return config.resource;
  };
  const provider: OAuthServerProvider = {
    clientsStore: {
      getClient: (id) =>
        id === config.clientId
          ? {
              client_id: config.clientId,
              client_secret: config.clientSecret,
              client_name: CLIENT_NAME,
              redirect_uris: [config.redirectUri],
              token_endpoint_auth_method: 'client_secret_post',
              grant_types: ['authorization_code', 'refresh_token'],
              response_types: ['code'],
              scope: ALL_SCOPES.join(' '),
            }
          : undefined,
    },
    async authorize(client, params, response) {
      if (
        params.redirectUri !== config.redirectUri ||
        !/^[A-Za-z0-9_-]{43}$/.test(params.codeChallenge) ||
        (params.state?.length ?? 0) > 2048
      )
        throw new InvalidRequestError('Supply the registered callback and a valid S256 challenge.');
      const scopes = parseWorkflowScopes(params.scopes);
      if (!scopes)
        throw new InvalidScopeError(
          'Request workflow read access and only supported optional permissions.',
        );
      const requestId = await store.createRequest({
        clientId: client.client_id,
        redirectUri: params.redirectUri,
        codeChallenge: params.codeChallenge,
        resource: resource(params.resource),
        scope: scopes.join(' '),
        state: params.state,
      });
      response.redirect(
        302,
        `${config.issuer}/chatgpt/authorize?request=${encodeURIComponent(requestId)}`,
      );
    },
    challengeForAuthorizationCode: (client, code) => store.challengeForCode(client.client_id, code),
    exchangeAuthorizationCode: (client, code, _verifier, redirectUri, audience) => {
      if (redirectUri !== config.redirectUri)
        throw new InvalidRequestError('The exact registered callback is required.');
      return store.exchangeCode({
        clientId: client.client_id,
        code,
        redirectUri,
        resource: resource(audience),
      });
    },
    exchangeRefreshToken: (client, refreshToken, scopes, audience) => {
      if (scopes && !parseWorkflowScopes(scopes))
        throw new InvalidScopeError('The granted scope cannot be changed.');
      return store.refresh({
        clientId: client.client_id,
        refreshToken,
        scopes,
        resource: resource(audience),
      });
    },
    verifyAccessToken: (token) => store.verify(token),
    revokeToken: (client, request) => store.revokeToken(client.client_id, request.token),
  };
  return { provider, store };
}
