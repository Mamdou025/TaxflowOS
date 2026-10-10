import { Router } from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { pool } from '@workspace/db';
import { createChatgptPluginServer } from '../lib/chatgpt-plugin/server';
import { loadChatgptPluginUi } from '../lib/chatgpt-plugin/ui-resource';
import { decodeBackup } from '../storage/validate-backup';
import {
  loadOAuthConfig,
  SCOPE,
  WRITE_SCOPE,
  EXECUTE_SCOPE,
} from '../security/chatgpt-oauth/config';
import { appOrigin } from '../security/auth';
import { createSessionService } from '../lib/chatgpt-plugin/session-service';
import { createPostgresSessionStore } from '../lib/chatgpt-plugin/session-store';
import { resolveSourceCapture } from '../lib/chatgpt-plugin/source-captures';
import { SessionCommandError } from '../lib/chatgpt-plugin/session-types';

const router = Router();
// app.ts establishes either a browser session or a workspace-bound OAuth identity.
router.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
router.post('/', async (req, res) => {
  const actor = { userId: req.userId, workspaceId: req.workspaceId };
  const service = createSessionService({
    store: createPostgresSessionStore(),
    captures: { resolve: resolveSourceCapture },
  });
  const scopeAllows = (permission: 'write' | 'execute') =>
    !req.auth || req.auth.scopes.includes(permission === 'write' ? WRITE_SCOPE : EXECUTE_SCOPE);
  const ui = await loadChatgptPluginUi(process.env.INSCOPE_CHATGPT_UI_PATH, (message) =>
    req.log.warn(message),
  );
  const server = createChatgptPluginServer(
    {
      readWorkspace: async () => {
        const { rows } = await pool.query<{
          name: string;
          payload: string | null;
          revision: number | null;
          role: string;
        }>(
          `SELECT w.name, l.payload, l.revision, m.role FROM workspaces w
         JOIN workspace_members m ON m.workspace_id=w.id AND m.user_id=$2
         LEFT JOIN workspace_libraries l ON l.workspace_id=w.id WHERE w.id=$1`,
          [req.workspaceId, req.userId],
        );
        if (!rows[0]) throw new Error('Current workspace membership is unavailable.');
        return {
          workspace: { id: req.workspaceId, name: rows[0].name },
          libraryRevision: rows[0].revision ?? 0,
          library: rows[0].payload === null ? {} : decodeBackup(rows[0].payload),
          capabilities: {
            write: ['owner', 'editor'].includes(rows[0].role) && scopeAllows('write'),
            execute: ['owner', 'editor'].includes(rows[0].role) && scopeAllows('execute'),
          },
        };
      },
      readHistory: (workflowId, runId) => service.history(actor, { workflowId, runId }),
    },
    ui,
    loadOAuthConfig(process.env, appOrigin) ? [SCOPE] : undefined,
    {
      actor,
      service,
      authorize: async (permission) => {
        if (!scopeAllows(permission))
          throw new SessionCommandError(
            'FORBIDDEN',
            `This connection has not been granted ${permission} access. Reconnect and explicitly consent to the required scope.`,
          );
        const membership = await pool.query(
          'SELECT role FROM workspace_members WHERE workspace_id=$1 AND user_id=$2',
          [actor.workspaceId, actor.userId],
        );
        if (!['owner', 'editor'].includes(membership.rows[0]?.role))
          throw new SessionCommandError(
            'FORBIDDEN',
            'Current Owner or Editor membership is required for this operation.',
          );
      },
    },
  );
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on('close', () => {
    void server.close();
  });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    await server.close();
    if (res.headersSent) return;
    throw error;
  }
});
router.all('/', (_req, res) => {
  res
    .set('Allow', 'POST')
    .status(405)
    .json({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32000, message: 'This stateless MCP endpoint accepts POST only.' },
    });
});
export default router;
