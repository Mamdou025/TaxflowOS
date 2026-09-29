import { Router } from 'express';
import {
  MkoroPairRequestSchema,
  MkoroEventBatchSchema,
  MkoroScreenUploadSchema,
  MkoroWorkerPollRequestSchema,
} from '@workspace/api-zod/mkoro';
import { authenticateWorker, pairWorker, pollCommands } from '../lib/mkoro/workers';
import { recordEvents } from '../lib/mkoro/events';
import { MkoroError, type WorkerScope } from '../lib/mkoro/common';
import { mkoroError } from './mkoro';
import { forgetTaskScreen, recordScreen, screenLease } from '../lib/mkoro/screens';

const router = Router();
router.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
// Pairing accepts only a single-use capability, never browser-supplied identity or role.
router.post('/pair', async (req, res) => {
  const parsed = MkoroPairRequestSchema.safeParse(req.body);
  if (!parsed.success) throw new MkoroError(400, 'Supply a valid pairing code and companion name.');
  res.status(201).json(await pairWorker(parsed.data));
});
router.use(async (req, res, next) => {
  const match = /^Bearer ([A-Za-z0-9_-]{40,200})$/.exec(req.header('authorization') ?? '');
  if (!match) throw new MkoroError(401, 'A companion token is required.');
  res.locals.mkoro = await authenticateWorker(match[1]);
  next();
});
router.post('/poll', async (req, res) => {
  const parsed = MkoroWorkerPollRequestSchema.safeParse(req.body);
  if (!parsed.success) throw new MkoroError(400, 'Invalid companion capabilities.');
  const scope = res.locals.mkoro as WorkerScope;
  const commands = await pollCommands(scope, parsed.data.capabilities);
  res.json({ commands, screenLease: await screenLease(scope) });
});
router.post('/events', async (req, res) => {
  const parsed = MkoroEventBatchSchema.safeParse(req.body);
  if (!parsed.success) throw new MkoroError(400, 'Invalid companion events.');
  const accepted = await recordEvents(res.locals.mkoro as WorkerScope, parsed.data.events);
  for (const event of parsed.data.events)
    if (['task_completed', 'task_failed', 'task_cancelled'].includes(event.type))
      forgetTaskScreen(event.taskId);
  res.json({ ok: true, accepted });
});
router.post('/screen', async (req, res) => {
  const parsed = MkoroScreenUploadSchema.safeParse(req.body);
  if (!parsed.success) throw new MkoroError(400, 'Invalid desktop screenshot.');
  res.json(await recordScreen(res.locals.mkoro as WorkerScope, parsed.data));
});
router.use(mkoroError);
export default router;
