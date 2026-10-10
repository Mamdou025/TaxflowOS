import { Router, json } from 'express';
import { z } from 'zod';
import {
  AccessDeniedError,
  InvalidGrantError,
  OAuthError,
} from '@modelcontextprotocol/sdk/server/auth/errors.js';
import type { createOAuthStore } from './store';
import { CLIENT_NAME, type OAuthConfig } from './config';
import { requireSession, checkOrigin } from '../access';

/** Personal grant management: authenticated account writes, never workspace writes. */
export function createOAuthAccountRouter(
  config?: OAuthConfig,
  store?: ReturnType<typeof createOAuthStore>,
) {
  const router = Router();
  router.use(requireSession, checkOrigin, json({ limit: '8kb' }), (req, res, next) => {
    res.set({ 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' });
    if (req.isDemo) {
      res
        .status(403)
        .json({ error: 'Sign in with your email/password account to connect ChatGPT.' });
      return;
    }
    if (!config || !store) {
      res.status(503).json({ error: 'ChatGPT account linking is not configured.' });
      return;
    }
    if (!config.pilotUserIds.includes(req.userId)) {
      res.status(403).json({ error: 'This account is not enabled for the private ChatGPT pilot.' });
      return;
    }
    next();
  });
  const requestId = z.string().regex(/^[A-Za-z0-9_-]{43}$/);
  const decision = z
    .object({ decision: z.enum(['allow', 'deny']), workspaceId: z.string().uuid().optional() })
    .strict();
  router.get('/requests/:id', async (req, res) => {
    const id = requestId.safeParse(req.params.id);
    if (!id.success) {
      res.status(404).json({ error: 'Authorization request unavailable.' });
      return;
    }
    const details = await store!.getRequest(id.data, {
      userId: req.userId,
      sessionId: req.authSessionId,
    });
    res.json({
      request: {
        id: id.data,
        clientName: CLIENT_NAME,
        scope: details.scope,
        expiresAt: details.expiresAt,
        grantDurationDays: 7,
      },
      account: { id: req.userId, name: res.locals.user.name, email: res.locals.user.email },
      workspaces: details.workspaces,
    });
  });
  router.post('/requests/:id/decision', async (req, res) => {
    const id = requestId.safeParse(req.params.id),
      input = decision.safeParse(req.body);
    if (!id.success) {
      res.status(404).json({ error: 'Authorization request unavailable.' });
      return;
    }
    if (!input.success || (input.data.decision === 'allow' && !input.data.workspaceId)) {
      res.status(400).json({ error: 'Choose a workspace and an explicit decision.' });
      return;
    }
    res.json(
      await store!.decideRequest(
        id.data,
        { userId: req.userId, sessionId: req.authSessionId },
        input.data,
      ),
    );
  });
  router.get('/grants', async (req, res) => {
    res.json({
      grants: (await store!.listGrants(req.userId)).map((grant) => ({
        ...grant,
        clientName: CLIENT_NAME,
      })),
    });
  });
  router.delete('/grants/:id', async (req, res) => {
    if (!z.string().uuid().safeParse(req.params.id).success) {
      res.status(404).json({ error: 'Connection unavailable.' });
      return;
    }
    await store!.revokeGrant(req.userId, String(req.params.id));
    res.status(204).end();
  });
  router.use(
    (
      error: unknown,
      _req: import('express').Request,
      res: import('express').Response,
      next: import('express').NextFunction,
    ) => {
      if (error instanceof OAuthError) {
        res
          .status(
            error instanceof AccessDeniedError
              ? 403
              : error instanceof InvalidGrantError
                ? 404
                : 400,
          )
          .json({ error: error.message });
        return;
      }
      next(error);
    },
  );
  return router;
}
