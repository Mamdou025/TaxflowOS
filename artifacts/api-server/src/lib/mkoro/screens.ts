import { randomUUID } from 'node:crypto';
import { pool } from '@workspace/db';
import {
  MKORO_SCREEN_CAPABILITY,
  MKORO_SCREEN_FRAME_TTL_MS,
  MKORO_SCREEN_LEASE_MS,
  MKORO_SCREEN_MAX_BYTES,
  type MkoroScreenFrame,
  type MkoroScreenLease,
  type MkoroScreenResponse,
  type MkoroScreenUpload,
} from '@workspace/api-zod/mkoro';
import { activeStatuses, MkoroError, type Scope, type WorkerScope } from './common';
import { getTask } from './tasks';

type ScreenState = {
  workerId: string;
  lease: MkoroScreenLease;
  frame?: MkoroScreenFrame;
  receivedAt?: number;
  error?: { code: string; message: string };
};
// Preview transport only: no pixels enter durable events, chat history or model context.
// A multi-process deployment needs sticky routing or a shared ephemeral transport.
const screens = new Map<string, ScreenState>();
function expireScreens() {
  const now = Date.now();
  for (const [id, state] of screens) {
    if (Date.parse(state.lease.expiresAt) <= now) screens.delete(id);
    else if (state.receivedAt && now - state.receivedAt >= MKORO_SCREEN_FRAME_TTL_MS) {
      delete state.frame;
      delete state.error;
      delete state.receivedAt;
    }
  }
}
const cleanup = setInterval(expireScreens, 2000);
cleanup.unref();

async function activeTask(scope: Scope, taskId: string) {
  const task = await getTask(scope, taskId);
  const active =
    activeStatuses.includes(task.status) && !task.cancelRequested && !task.connectionLost;
  if (!active) screens.delete(taskId);
  return { task, active };
}
export function forgetWorkerScreens(workerId: string) {
  for (const [id, state] of screens) if (state.workerId === workerId) screens.delete(id);
}
export function forgetTaskScreen(taskId: string) {
  screens.delete(taskId);
}

export async function setScreenView(scope: Scope, taskId: string, enabled: boolean) {
  expireScreens();
  const { task, active } = await activeTask(scope, taskId);
  if (!enabled) {
    screens.delete(taskId);
    return { lease: null };
  }
  if (!active)
    throw new MkoroError(
      409,
      'Screen viewing is available only while this computer task is active and connected.',
    );
  const worker = await pool.query('SELECT capabilities FROM mkoro_workers WHERE id=$1', [
    task.workerId,
  ]);
  if (!worker.rows[0]?.capabilities?.includes(MKORO_SCREEN_CAPABILITY))
    throw new MkoroError(409, 'Update and restart the companion to support desktop screenshots.');
  const existing = screens.get(taskId);
  if (!existing && screens.size >= 64)
    throw new MkoroError(503, 'Desktop preview capacity is temporarily full.');
  const lease: MkoroScreenLease = {
    taskId,
    leaseId: existing?.lease.leaseId ?? randomUUID(),
    expiresAt: new Date(Date.now() + MKORO_SCREEN_LEASE_MS).toISOString(),
    intervalMs: 2000,
  };
  screens.set(taskId, { ...existing, workerId: task.workerId, lease });
  return { lease };
}

export async function screenLease(scope: WorkerScope) {
  expireScreens();
  const state = [...screens.values()].find((item) => item.workerId === scope.workerId);
  if (!state) return null;
  const { active } = await activeTask(scope, state.lease.taskId);
  return active ? state.lease : null;
}

export async function readScreen(scope: Scope, taskId: string): Promise<MkoroScreenResponse> {
  expireScreens();
  const { active } = await activeTask(scope, taskId);
  const state = active ? screens.get(taskId) : undefined;
  return {
    taskId,
    status: !state ? 'inactive' : state.error ? 'unavailable' : state.frame ? 'ready' : 'waiting',
    leaseExpiresAt: state?.lease.expiresAt ?? null,
    ...(state?.frame ? { frame: state.frame } : {}),
    ...(state?.error ? { error: state.error } : {}),
  };
}

function validateJpeg(frame: MkoroScreenFrame) {
  const bytes = Buffer.from(frame.data, 'base64');
  if (bytes.toString('base64') !== frame.data) throw new MkoroError(400, 'Invalid JPEG encoding.');
  if (
    bytes.length > MKORO_SCREEN_MAX_BYTES ||
    bytes.length < 12 ||
    bytes.readUInt16BE(0) !== 0xffd8 ||
    bytes.readUInt16BE(bytes.length - 2) !== 0xffd9
  )
    throw new MkoroError(400, 'A bounded JPEG screenshot is required.');
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) break;
    while (bytes[offset] === 0xff) offset++;
    const marker = bytes[offset++];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > bytes.length) break;
    const size = bytes.readUInt16BE(offset);
    if (size < 2 || offset + size > bytes.length) break;
    if (
      [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(
        marker,
      )
    ) {
      if (
        size < 8 ||
        bytes.readUInt16BE(offset + 3) !== frame.height ||
        bytes.readUInt16BE(offset + 5) !== frame.width
      )
        throw new MkoroError(400, 'Screenshot dimensions do not match the JPEG.');
      return;
    }
    offset += size;
  }
  throw new MkoroError(400, 'JPEG dimensions could not be verified.');
}

export async function recordScreen(scope: WorkerScope, input: MkoroScreenUpload) {
  expireScreens();
  const { task, active } = await activeTask(scope, input.taskId);
  if (task.workerId !== scope.workerId) throw new MkoroError(404, 'Task not found.');
  const state = screens.get(input.taskId);
  if (
    !active ||
    !state ||
    state.workerId !== scope.workerId ||
    state.lease.leaseId !== input.leaseId
  )
    throw new MkoroError(409, 'The desktop viewing lease expired or was closed.');
  if ('frame' in input) {
    validateJpeg(input.frame);
    const capturedAt = Date.parse(input.frame.capturedAt);
    if (capturedAt > Date.now() + 5000 || capturedAt < Date.now() - MKORO_SCREEN_FRAME_TTL_MS)
      throw new MkoroError(400, 'The screenshot timestamp is stale or invalid.');
    if (state.frame && capturedAt <= Date.parse(state.frame.capturedAt))
      throw new MkoroError(409, 'A newer screenshot is already available.');
    state.frame = input.frame;
    delete state.error;
  } else {
    state.error = input.error;
    delete state.frame;
  }
  state.receivedAt = Date.now();
  return { ok: true };
}
