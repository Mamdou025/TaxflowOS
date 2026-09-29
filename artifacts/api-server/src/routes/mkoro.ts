import { Router, type Request, type Response, type NextFunction } from 'express';
import {
  MkoroDelegationRequestSchema,
  MkoroScreenViewRequestSchema,
  MkoroThreadIdSchema,
  MkoroPermissionRequestSchema,
  MkoroIdSchema,
} from '@workspace/api-zod/mkoro';
import { createPairing, listWorkers, revokeWorker } from '../lib/mkoro/workers';
import {
  listConversations,
  conversationDetail,
  taskEvents,
  cancelTask,
  decidePermission,
} from '../lib/mkoro/tasks';
import { MkoroError } from '../lib/mkoro/common';
import { createDelegation, threadConversations } from '../lib/mkoro/delegations';
import {
  forgetTaskScreen,
  forgetWorkerScreens,
  readScreen,
  setScreenView,
} from '../lib/mkoro/screens';

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
  const workerId = id(req.params.id);
  await revokeWorker(scope(req), workerId);
  forgetWorkerScreens(workerId);
  res.json({ ok: true });
});
router.get('/conversations', async (req, res) => {
  res.json({ conversations: await listConversations(scope(req)) });
});
// New work enters through Sina's typed delegation tool; legacy history stays readable.
router.post(['/conversations', '/conversations/:id/messages'], (_req, res) => {
  res
    .status(410)
    .json({ error: 'Start computer tasks in Sina chat. Direct Mkoro messages have been retired.' });
});
router.post('/delegations', async (req, res) => {
  const parsed = MkoroDelegationRequestSchema.safeParse(req.body);
  if (!parsed.success)
    throw new MkoroError(
      400,
      'Supply a Sina thread, companion and complete computer task delegation.',
    );
  res.status(202).json(await createDelegation(scope(req), parsed.data));
});
router.get('/threads/:threadId/conversations', async (req, res) => {
  const parsed = MkoroThreadIdSchema.safeParse(req.params.threadId);
  if (!parsed.success) throw new MkoroError(400, 'Invalid Sina conversation identifier.');
  res.json({ conversations: await threadConversations(scope(req), parsed.data) });
});
router.get('/conversations/:id', async (req, res) => {
  const before = req.query.before === undefined ? undefined : Number(req.query.before);
  if (before !== undefined && (!Number.isSafeInteger(before) || before < 1))
    throw new MkoroError(400, 'Invalid event cursor.');
  res.json(await conversationDetail(scope(req), id(req.params.id), before));
});
router.get('/tasks/:id/events', async (req, res) => {
  const latest = req.query.latest === 'true';
  if (req.query.latest !== undefined && !latest)
    throw new MkoroError(400, 'Invalid latest-event selection.');
  if (latest && req.query.after !== undefined)
    throw new MkoroError(400, 'Choose either the latest events or an event cursor.');
  const after = req.query.after === undefined ? 0 : Number(req.query.after);
  if (!Number.isSafeInteger(after) || after < 0) throw new MkoroError(400, 'Invalid event cursor.');
  res.json(await taskEvents(scope(req), id(req.params.id), after, latest));
});
router.post('/tasks/:id/cancel', async (req, res) => {
  const taskId = id(req.params.id);
  const task = await cancelTask(scope(req), taskId);
  forgetTaskScreen(taskId);
  res.json({ task });
});
// Both reading a live preview and authorizing capture require execute role.
router.get('/tasks/:id/screen', async (req, res) => {
  res.json(await readScreen(scope(req), id(req.params.id)));
});
router.post('/tasks/:id/screen-view', async (req, res) => {
  const parsed = MkoroScreenViewRequestSchema.safeParse(req.body);
  if (!parsed.success) throw new MkoroError(400, 'Choose whether the computer screen is visible.');
  res.json(await setScreenView(scope(req), id(req.params.id), parsed.data.enabled));
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
