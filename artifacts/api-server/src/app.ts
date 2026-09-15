import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { REQUEST_ID_HEADER } from '@workspace/api-zod/observability';
import router from './routes';
import { logger } from './lib/logger';
import { resolveRequestId } from './observability/request-id';
import { toNodeHandler } from 'better-auth/node';
import { auth, appOrigin } from './security/auth';
import {
  requireSession,
  checkOrigin,
  requireWorkspace,
  authorizeOperation,
} from './security/access';
import workspacesRouter from './routes/workspaces';
import healthRouter from './routes/health';

const app: Express = express();

app.use(
  pinoHttp<Request, Response>({
    logger,
    genReqId(req, res) {
      const id = resolveRequestId(req.headers[REQUEST_ID_HEADER]);
      res.setHeader('X-Request-Id', id);
      return id;
    },
    customLogLevel(_req, res, error) {
      if (error || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    customSuccessMessage() {
      return 'API request completed';
    },
    customErrorMessage() {
      return 'API request failed';
    },
    customProps(req) {
      return {
        actorId: req.userId,
        workspaceId: req.workspaceId,
        workspaceRole: req.workspaceRole,
      };
    },
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split('?')[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ origin: appOrigin, credentials: true }));
app.all('/api/auth/*splat', toNodeHandler(auth));
app.use('/api', healthRouter);
app.use('/api', requireSession, checkOrigin);
app.get('/api/session', (_req, res) =>
  res.set('Cache-Control', 'no-store').json({ user: res.locals.user }),
);
app.use('/api/workflow-library', express.json({ limit: '24mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/workspaces', workspacesRouter);
app.use('/api', requireWorkspace, authorizeOperation, router);
app.use(
  (err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    req.log.error({ err }, 'API request failed');
    const status =
      typeof err === 'object' && err !== null && 'status' in err ? err.status : undefined;
    res.status(status === 400 || status === 413 ? status : 503).json({
      error:
        status === 400
          ? 'Invalid request body.'
          : status === 413
            ? 'Request body is too large.'
            : 'The operation is unavailable; no success was confirmed.',
    });
  },
);

export default app;
