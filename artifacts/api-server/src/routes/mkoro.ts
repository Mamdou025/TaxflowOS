import { Router, type Request, type Response, type NextFunction } from 'express';
import {
  MkoroCreateConversationSchema,
  MkoroMessageRequestSchema,
  MkoroPermissionRequestSchema,
  MkoroIdSchema,
} from '@workspace/api-zod/mkoro';
import { createPairing, listWorkers, revokeWorker } from '../lib/mkoro/workers';
import {
  createConversation,
  listConversations,
  conversationDetail,
  createMessage,
  taskEvents,
  cancelTask,
  decidePermission,
} from '../lib/mkoro/tasks';
import { MkoroError } from '../lib/mkoro/common';

const router = Router();
const scope = (req: Request) => ({ actorId: req.userId, workspaceId: req.workspaceId });
const id = (value: unknown) => {
  const parsed = MkoroIdSchema.safeParse(value);
  if (!parsed.success) throw new MkoroError(400, 'Invalid Mkoro identifier.');
  return parsed.data;
};
router.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
router.get('/workers', async (req, res) => {
  res.json({ workers: await listWorkers(scope(req)) });
});
router.post('/pairings', async (req, res) => {
  res.status(201).json(await createPairing(scope(req)));
});
router.delete('/workers/:id', async (req, res) => {
  await revokeWorker(scope(req), id(req.params.id));
  res.json({ ok: true });
});
router.get('/conversations', async (req, res) => {
  res.json({ conversations: await listConversations(scope(req)) });
});
router.post('/conversations', async (req, res) => {
  const parsed = MkoroCreateConversationSchema.safeParse(req.body);
  if (!parsed.success) throw new MkoroError(400, 'Choose a companion and a valid chat title.');
  res.status(201).json({
    conversation: await createConversation(scope(req), parsed.data.workerId, parsed.data.title),
  });
});
router.get('/conversations/:id', async (req, res) => {
  const before = req.query.before === undefined ? undefined : Number(req.query.before);
  if (before !== undefined && (!Number.isSafeInteger(before) || before < 1))
    throw new MkoroError(400, 'Invalid event cursor.');
  res.json(await conversationDetail(scope(req), id(req.params.id), before));
});
router.post('/conversations/:id/messages', async (req, res) => {
  const parsed = MkoroMessageRequestSchema.safeParse(req.body);
  if (!parsed.success) throw new MkoroError(400, 'Supply a message and a unique request ID.');
  res.status(202).json({
    task: await createMessage(
      scope(req),
      id(req.params.id),
      parsed.data.message,
      parsed.data.requestId,
    ),
  });
});
router.get('/tasks/:id/events', async (req, res) => {
  const after = req.query.after === undefined ? 0 : Number(req.query.after);
  if (!Number.isSafeInteger(after) || after < 0) throw new MkoroError(400, 'Invalid event cursor.');
  res.json(await taskEvents(scope(req), id(req.params.id), after));
});
router.post('/tasks/:id/cancel', async (req, res) => {
  res.json({ task: await cancelTask(scope(req), id(req.params.id)) });
});
router.post('/tasks/:id/permission', async (req, res) => {
  const parsed = MkoroPermissionRequestSchema.safeParse(req.body);
  if (!parsed.success) throw new MkoroError(400, 'Choose an offered permission decision.');
  res.json({
    task: await decidePermission(
      scope(req),
      id(req.params.id),
      parsed.data.requestId,
      parsed.data.optionId,
    ),
  });
});
export function mkoroError(error: unknown, _req: Request, res: Response, next: NextFunction) {
  if (error instanceof MkoroError) res.status(error.status).json({ error: error.message });
  else next(error);
}
router.use(mkoroError);
export default router;
