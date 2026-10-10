import type { RequestHandler } from 'express';
import type {} from '@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js';
import { OAuthError } from '@modelcontextprotocol/sdk/server/auth/errors.js';
import type { OAuthServerProvider } from '@modelcontextprotocol/sdk/server/auth/provider.js';
import { WorkspaceRoleSchema, WORKSPACE_ID_HEADER } from '@workspace/api-zod/access';
import { SCOPE, parseWorkflowScopes, type OAuthConfig } from './config';
import { requireSession, checkOrigin, requireWorkspace, requireAction } from '../access';

/** Bearer authorization exists only here; browser reads retain their prior checks. */
export function createMcpAccess(
  config?: OAuthConfig,
  provider?: OAuthServerProvider,
): RequestHandler[] {
  return [
    async (req, res, next) => {
      res.set('Cache-Control', 'no-store');
      const challenge = config
        ? `Bearer resource_metadata="${config.issuer}/.well-known/oauth-protected-resource/api/chatgpt/mcp", scope="${SCOPE}"`
        : undefined;
      const authorization = req.header('authorization');
      if (authorization !== undefined) {
        if (challenge) res.set('WWW-Authenticate', challenge);
        if (!config || !provider || !/^Bearer [A-Za-z0-9_-]{43}$/i.test(authorization)) {
          res.status(401).json({ error: 'Invalid InScope access token.' });
          return;
        }
        try {
          const info = await provider.verifyAccessToken(authorization.slice(7));
          const extra = info.extra;
          const role = WorkspaceRoleSchema.safeParse(extra?.workspaceRole);
          if (
            !extra ||
            typeof extra.userId !== 'string' ||
            typeof extra.workspaceId !== 'string' ||
            !role.success ||
            info.resource?.href !== config.resource ||
            !parseWorkflowScopes(info.scopes)
          ) {
            res.status(401).json({ error: 'Invalid InScope access token.' });
            return;
          }
          const requestedWorkspace = req.header(WORKSPACE_ID_HEADER);
          if (requestedWorkspace && requestedWorkspace !== extra.workspaceId) {
            res
              .status(403)
              .json({ error: 'This connection is restricted to its authorized workspace.' });
            return;
          }
          req.userId = extra.userId;
          req.workspaceId = extra.workspaceId;
          req.workspaceRole = role.data;
          req.isDemo = false;
          req.auth = info;
          res.removeHeader('WWW-Authenticate');
          next();
        } catch (error) {
          res
            .status(error instanceof OAuthError ? 401 : 503)
            .json({ error: 'The InScope connection could not be verified.' });
        }
        return;
      }
      if (challenge) res.set('WWW-Authenticate', challenge);
      requireSession(req, res, next);
    },
    (req, res, next) => {
      if (req.auth) {
        next();
        return;
      }
      checkOrigin(req, res, next);
    },
    (req, res, next) => {
      if (req.auth) {
        next();
        return;
      }
      requireWorkspace(req, res, next);
    },
    requireAction('read'),
  ];
}
