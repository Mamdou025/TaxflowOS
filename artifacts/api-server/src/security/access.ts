import type { RequestHandler } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { pool } from '@workspace/db';
import {
  WorkspaceIdSchema,
  WorkspaceRoleSchema,
  WORKSPACE_ID_HEADER,
  permits,
  type WorkspaceAction,
} from '@workspace/api-zod/access';
import { auth, appOrigin } from './auth';

export const requireSession: RequestHandler = async (req, res, next) => {
  try {
    // Read without sliding refresh first. Better Auth may reuse a recently read
    // session internally; refreshing before the database check could revive a row
    // that an administrator or expiry process just invalidated.
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
      query: { disableRefresh: true },
    });
    if (!session || session.user.id === 'anonymous') {
      res.status(401).json({ error: 'Sign in to access this workspace.' });
      return;
    }
    // The database row is the revocation authority. Re-check it even when the auth
    // library returns a parsed session so expiry and deletion take effect immediately.
    const current = await pool.query(
      'SELECT 1 FROM sessions WHERE token=$1 AND user_id=$2 AND expires_at > now()',
      [session.session.token, session.user.id],
    );
    if (!current.rowCount) {
      res.status(401).json({ error: 'Sign in to access this workspace.' });
      return;
    }
    req.userId = session.user.id;
    req.isDemo = session.user.isAnonymous === true;
    res.locals.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      isDemo: req.isDemo,
    };
    next();
  } catch {
    res.status(503).json({ error: 'Session verification is unavailable. Access was not granted.' });
  }
};

export const requireAccount: RequestHandler = (req, res, next) => {
  if (req.isDemo) {
    res.status(403).json({
      error: 'Use an email/password account to manage shared workspaces or claim a legacy library.',
    });
    return;
  }
  next();
};

export const checkOrigin: RequestHandler = (req, res, next) => {
  const origin = req.header('origin');
  if (
    (origin && origin !== appOrigin) ||
    (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && origin !== appOrigin)
  ) {
    res.status(403).json({ error: 'This request did not originate from the application.' });
    return;
  }
  next();
};

export const requireWorkspace: RequestHandler = async (req, res, next) => {
  const parsed = WorkspaceIdSchema.safeParse(req.header(WORKSPACE_ID_HEADER));
  if (!parsed.success) {
    res.status(400).json({ error: 'Select a valid workspace.' });
    return;
  }
  try {
    const { rows } = await pool.query(
      'SELECT role FROM workspace_members WHERE workspace_id=$1 AND user_id=$2',
      [parsed.data, req.userId],
    );
    const role = WorkspaceRoleSchema.safeParse(rows[0]?.role);
    if (!role.success) {
      res.status(403).json({ error: 'You do not have access to this workspace.' });
      return;
    }
    req.workspaceId = parsed.data;
    req.workspaceRole = role.data;
    next();
  } catch {
    res.status(503).json({ error: 'Workspace access could not be verified.' });
  }
};

export function requireAction(action: WorkspaceAction): RequestHandler {
  return (req, res, next) => {
    if (!permits(req.workspaceRole, action)) {
      res
        .status(403)
        .json({ error: `Your workspace role does not allow this operation (${action}).` });
      return;
    }
    next();
  };
}

export const authorizeOperation: RequestHandler = (req, res, next) => {
  // Express routes are case-insensitive and accept a trailing slash by default.
  const path = req.path.toLowerCase().replace(/\/+$/, '');
  const execute =
    (req.method === 'POST' && /^\/workflow-runs(?:\/[^/]+\/(?:cancel|retry))?$/.test(path)) ||
    /^\/(copilotkit|agent-lab|agent-actions|genui|http-source|fx-rate|param-options|assistant\/tools)(?:\/|$)/.test(
      path,
    );
  const read =
    ['GET', 'HEAD'].includes(req.method) || (path === '/documents/search' && req.method === 'POST');
  return requireAction(execute ? 'execute' : read ? 'read' : 'write')(req, res, next);
};
