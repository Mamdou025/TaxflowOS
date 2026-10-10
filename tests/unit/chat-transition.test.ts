import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createChatTransition } from '@/features/assistant/runtime/chat/chat-transition';
import { stopChatBeforeSwitch } from '@/features/assistant/runtime/chat/chat-switch';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (cause: Error) => void;
  const promise = new Promise<T>((accept, fail) => {
    resolve = accept;
    reject = fail;
  });
  return { promise, resolve, reject };
}

test('a stalled SDK detach times out without replacing messages or starting a saved read', async () => {
  const detached = deferred<void>();
  const transition = createChatTransition('The previous reply is still stopping.', 10);
  let reads = 0;
  let replacements = 0;
  const opening = (async () => {
    await transition.wait(() =>
      stopChatBeforeSwitch({
        stopGeneration() {},
        agent: { detachActiveRun: () => detached.promise },
      }),
    );
    await transition.wait(async () => reads++);
    replacements++;
  })();
  await assert.rejects(opening, /previous reply is still stopping/);
  assert.equal(transition.signal.aborted, true);
  detached.resolve();
  await detached.promise;
  assert.equal(reads, 0);
  assert.equal(replacements, 0);
  transition.finish();
});

test('retry after a timeout cannot bypass an earlier pending SDK detach', async () => {
  const detached = deferred<void>();
  let detachCalls = 0;
  const chat = {
    stopGeneration() {},
    agent: {
      detachActiveRun() {
        detachCalls++;
        return detachCalls === 1 ? detached.promise : Promise.resolve();
      },
    },
  };
  const first = createChatTransition('Timed out.', 10);
  await assert.rejects(
    first.wait(() => stopChatBeforeSwitch(chat)),
    /Timed out/,
  );
  first.finish();
  let replaced = false;
  const retry = createChatTransition('Timed out.');
  const next = retry
    .wait(() => stopChatBeforeSwitch(chat))
    .then(() => {
      replaced = true;
    });
  await Promise.resolve();
  assert.equal(detachCalls, 1);
  assert.equal(replaced, false);
  detached.resolve();
  await next;
  assert.equal(replaced, true);
  retry.finish();
});

test('superseding a saved read cancels its signal and rejects even if that read later succeeds', async () => {
  const response = deferred<string>();
  const previous = createChatTransition('Timed out.');
  let history = 'outgoing conversation';
  let reading = false;
  const opening = previous
    .wait(() => {
      reading = true;
      return response.promise;
    })
    .then((value) => {
      history = value;
    });
  await Promise.resolve();
  assert.equal(reading, true);
  previous.cancel();
  await assert.rejects(opening, { name: 'AbortError' });
  assert.equal(previous.signal.aborted, true);
  const current = createChatTransition('Timed out.');
  await current.wait(async () => {
    history = 'explicitly selected new conversation';
  });
  response.resolve('stale saved conversation');
  await Promise.resolve();
  assert.equal(history, 'explicitly selected new conversation');
  current.finish();
});

test('the transition bounds response-body loading as well as the request', async () => {
  const body = deferred<string>();
  const transition = createChatTransition('Saved chat took too long.', 10);
  await transition.wait(async () => ({ ok: true }));
  await assert.rejects(
    transition.wait(() => body.promise),
    /Saved chat took too long/,
  );
  let committed = false;
  await assert.rejects(
    transition.wait(() => {
      committed = true;
    }),
    /Saved chat took too long/,
  );
  assert.equal(committed, false);
  body.resolve('late history');
  transition.finish();
});

test('canceling navigation absorbs a later failure and prevents additional work', async () => {
  const response = deferred<void>();
  const transition = createChatTransition('Timed out.');
  const pending = transition.wait(() => response.promise);
  await Promise.resolve();
  transition.cancel();
  await assert.rejects(pending, { name: 'AbortError' });
  response.reject(new Error('Late network failure.'));
  await Promise.resolve();
  await assert.rejects(
    transition.wait(async () => undefined),
    { name: 'AbortError' },
  );
});

test('a settled detach failure remains an error but permits a genuine retry', async () => {
  let attempts = 0;
  const chat = {
    stopGeneration() {},
    agent: {
      async detachActiveRun() {
        if (++attempts === 1) throw new Error('Detach failed.');
      },
    },
  };
  await assert.rejects(stopChatBeforeSwitch(chat), /Detach failed/);
  await stopChatBeforeSwitch(chat);
  assert.equal(attempts, 2);
});
