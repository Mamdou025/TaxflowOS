import { Router, urlencoded } from 'express';
import { authorizationHandler } from '@modelcontextprotocol/sdk/server/auth/handlers/authorize.js';
import { tokenHandler } from '@modelcontextprotocol/sdk/server/auth/handlers/token.js';
import { revocationHandler } from '@modelcontextprotocol/sdk/server/auth/handlers/revoke.js';
import { mcpAuthMetadataRouter } from '@modelcontextprotocol/sdk/server/auth/router.js';
import type { OAuthServerProvider } from '@modelcontextprotocol/sdk/server/auth/provider.js';
import { ALL_SCOPES, type OAuthConfig } from './config';

/** Public protocol endpoints validate clients, credentials and PKCE, not cookies. */
export function createOAuthPublicRouter(config: OAuthConfig, provider: OAuthServerProvider) {
  const router = Router();
  const base = `${config.issuer}/api/chatgpt/oauth`;
  router.use(
    mcpAuthMetadataRouter({
      oauthMetadata: {
        issuer: config.issuer,
        authorization_endpoint: `${base}/authorize`,
        token_endpoint: `${base}/token`,
        revocation_endpoint: `${base}/revoke`,
        response_types_supported: ['code'],
        grant_types_supported: ['authorization_code', 'refresh_token'],
        token_endpoint_auth_methods_supported: ['client_secret_post'],
        revocation_endpoint_auth_methods_supported: ['client_secret_post'],
        code_challenge_methods_supported: ['S256'],
        scopes_supported: [...ALL_SCOPES],
        // SDK errors do not all echo iss; use the callback-specific URI supplied by ChatGPT.
        authorization_response_iss_parameter_supported: false,
      },
      resourceServerUrl: new URL(config.resource),
      scopesSupported: [...ALL_SCOPES],
      resourceName: 'InScope saved workflows',
    }),
  );
  const prefix = '/api/chatgpt/oauth';
  router.use(
    [`${prefix}/authorize`, `${prefix}/token`, `${prefix}/revoke`],
    (req, res, next) => {
      res.set({ 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' });
      if (req.originalUrl.length > 8192) {
        res.status(400).json({ error: 'invalid_request' });
        return;
      }
      next();
    },
    urlencoded({ extended: false, limit: '8kb' }),
  );
  router.use(
    `${prefix}/authorize`,
    (req, res, next) => {
      const input = req.method === 'POST' ? req.body : req.query;
      // The SDK relaxes loopback ports; this registered web client requires an exact URI.
      if (input?.redirect_uri !== undefined && input.redirect_uri !== config.redirectUri) {
        res
          .status(400)
          .json({ error: 'invalid_request', error_description: 'Unregistered redirect_uri' });
        return;
      }
      next();
    },
    authorizationHandler({ provider }),
  );
  router.use(
    `${prefix}/token`,
    (req, res, next) => {
      if (
        req.body?.grant_type === 'authorization_code' &&
        !/^[A-Za-z0-9._~-]{43,128}$/.test(req.body.code_verifier ?? '')
      ) {
        res.status(400).json({ error: 'invalid_grant' });
        return;
      }
      next();
    },
    tokenHandler({ provider }),
  );
  router.use(`${prefix}/revoke`, revocationHandler({ provider }));
  // Parser errors can contain raw forms and secrets. Do not pass them to the logger.
  router.use(
    (
      error: unknown,
      _req: import('express').Request,
      res: import('express').Response,
      _next: import('express').NextFunction,
    ) => {
      const status =
        typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined;
      res.status(status === 400 || status === 413 ? status : 503).json({
        error: status === 400 || status === 413 ? 'invalid_request' : 'server_error',
        error_description: 'The OAuth request could not be processed.',
      });
    },
  );
  return router;
}
