import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { setImmediate as nextTurn } from 'node:timers/promises';
import { captureDesktop, DesktopScreenshots } from './capture.mjs';

const syntheticFrame = {
  mimeType: 'image/jpeg',
  data: Buffer.from([0xff, 0xd8, 0xff, 0xd9]).toString('base64'),
  width: 1,
  height: 1,
  capturedAt: '2026-09-28T00:00:00.000Z',
};

function fixture(capture) {
  let time = Date.parse(syntheticFrame.capturedAt);
  const scheduled = new Map();
  let nextId = 0;
  const timers = {
    setTimeout(fn, delay) {
      const id = ++nextId;
      scheduled.set(id, { fn, at: time + delay });
      return id;
    },
    clearTimeout(id) {
      scheduled.delete(id);
    },
  };
  const active = { taskId: randomUUID(), ready: true, cancelled: false };
  const posted = [];
  const screenshots = new DesktopScreenshots({
    getActive: () => active,
    capture: capture ?? (async () => syntheticFrame),
    now: () => time,
    timers,
    api: { post: async (...args) => posted.push(args) },
  });
  const lease = {
    taskId: active.taskId,
    leaseId: randomUUID(),
    expiresAt: new Date(time + 10_000).toISOString(),
  };
  return {
    active,
    posted,
    screenshots,
    lease,
    advance(ms) {
      time += ms;
      for (const [id, timer] of [...scheduled])
        if (timer.at <= time) {
          scheduled.delete(id);
          timer.fn();
        }
    },
  };
}

test('Windows capture is a hidden fixed script process; frames are bounded and never written by Node', async () => {
  let call;
  const frame = await captureDesktop({
    platform: 'win32',
    env: { SystemRoot: 'C:\\Windows' },
    execute: (...args) => {
      call = args;
      args.at(-1)(null, JSON.stringify(syntheticFrame));
    },
  });
  assert.deepEqual(frame, syntheticFrame);
  assert.equal(call[0], 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe');
  assert.match(call[1].at(-1), /capture-windows\.ps1$/);
  assert.equal(call[2].windowsHide, true);
  assert.equal(call[2].shell, false);
  assert.equal(call[2].timeout, 7000);
  await assert.rejects(captureDesktop({ platform: 'linux' }), /SCREEN_UNSUPPORTED/);
  await assert.rejects(
    captureDesktop({
      platform: 'win32',
      execute: (...args) => args.at(-1)(null, JSON.stringify({ ...syntheticFrame, width: 9000 })),
    }),
    /SCREEN_UNAVAILABLE/,
  );
});

test('desktop frames require a matching live task lease and use only the dedicated transient endpoint', async () => {
  const f = fixture();
  f.screenshots.update(null);
  f.screenshots.update({ ...f.lease, taskId: randomUUID() });
  f.screenshots.update({ ...f.lease, expiresAt: '2099-01-01T00:00:00Z' });
  await nextTurn();
  assert.equal(f.posted.length, 0);
  f.screenshots.update(f.lease);
  await f.screenshots.pending;
  assert.equal(f.posted.length, 1);
  assert.equal(f.posted[0][0], 'screen');
  assert.deepEqual(f.posted[0][1], {
    taskId: f.active.taskId,
    leaseId: f.lease.leaseId,
    frame: syntheticFrame,
  });
  f.advance(2000);
  await f.screenshots.pending;
  assert.equal(f.posted.length, 2);
  f.screenshots.stop();
});

test('expiry and closing the viewer abort capture and prevent late frames from being published', async () => {
  for (const stop of ['expiry', 'viewer', 'cancelled']) {
    let finish;
    let signal;
    const f = fixture((options) => {
      signal = options.signal;
      return new Promise((resolve) => {
        finish = resolve;
      });
    });
    f.screenshots.update(f.lease);
    if (stop === 'expiry') f.advance(10_000);
    else if (stop === 'viewer') f.screenshots.update(null);
    else f.active.cancelled = true;
    if (stop !== 'cancelled') assert.equal(signal.aborted, true);
    finish(syntheticFrame);
    await f.screenshots.pending;
    assert.equal(f.posted.length, 0);
    f.screenshots.stop();
  }
});

test('capture failure is explicit, strips arbitrary error text, and does not masquerade as a frame', async () => {
  const f = fixture(async () => {
    throw new Error('secret local account detail');
  });
  f.screenshots.update(f.lease);
  await f.screenshots.pending;
  assert.equal(f.posted[0][1].frame, undefined);
  assert.equal(f.posted[0][1].error.code, 'SCREEN_UNAVAILABLE');
  assert.doesNotMatch(JSON.stringify(f.posted), /secret local account detail/);
  f.screenshots.stop();
});

test('failed screen upload drops the frame and stops until a new poll supplies a lease', async () => {
  const f = fixture();
  f.screenshots.api.post = async () => {
    throw new Error('offline');
  };
  f.screenshots.update(f.lease);
  await f.screenshots.pending;
  assert.equal(f.screenshots.lease, null);
  f.advance(3000);
  assert.equal(f.screenshots.pending, null);
});

test('a late failure from a closed viewer cannot remove a newly opened viewing lease', async () => {
  const f = fixture();
  let rejectUpload;
  f.screenshots.api.post = async () =>
    new Promise((_resolve, reject) => {
      rejectUpload = reject;
    });
  f.screenshots.update(f.lease);
  await nextTurn();
  const oldPending = f.screenshots.pending;
  f.screenshots.update(null);
  const replacement = { ...f.lease, leaseId: randomUUID() };
  f.screenshots.update(replacement);
  rejectUpload(new Error('Old request aborted'));
  await oldPending;
  assert.equal(f.screenshots.lease.leaseId, replacement.leaseId);
  f.screenshots.api.post = async (...args) => f.posted.push(args);
  f.screenshots.update(replacement);
  await f.screenshots.pending;
  assert.equal(f.posted.length, 1);
  assert.equal(f.posted[0][1].leaseId, replacement.leaseId);
  f.screenshots.stop();
});
