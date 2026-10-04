import test from 'node:test';
import assert from 'node:assert/strict';
import { pairCompanion } from './pairing.mjs';

const options = { server: 'https://example.test', workspace: 'synthetic-folder', name: 'Laptop' };
const previous = {
  version: 1,
  ...options,
  workerId: '10000000-0000-4000-8000-000000000001',
  token: 'synthetic-old-credential',
  sessions: { savedConversation: 'saved-goose-session' },
};
const result = {
  workerId: previous.workerId,
  token: 'synthetic-rotated-credential',
  pollIntervalMs: 1500,
};

test('re-pair sends saved identity proof privately and preserves conversation sessions', async () => {
  const api = {
    token: previous.token,
    async post(path, body) {
      assert.equal(path, 'pair');
      assert.equal(this.token, undefined);
      assert.deepEqual(body, {
        pairingToken: 'synthetic-one-use-code',
        name: options.name,
        capabilities: ['sina-delegation-v1'],
        reconnect: { workerId: previous.workerId, token: previous.token },
      });
      return result;
    },
  };
  const next = await pairCompanion({
    api,
    options,
    pairingToken: 'synthetic-one-use-code',
    capabilities: ['sina-delegation-v1'],
    previous,
  });
  assert.equal(next.workerId, previous.workerId);
  assert.equal(next.token, result.token);
  assert.deepEqual(next.sessions, previous.sessions);
  assert.equal(previous.token, 'synthetic-old-credential');
});

test('first pairing has no fabricated identity proof and starts with no Goose sessions', async () => {
  const api = {
    async post(_path, body) {
      assert.equal(Object.hasOwn(body, 'reconnect'), false);
      return result;
    },
  };
  const next = await pairCompanion({ api, options, pairingToken: 'new-code', capabilities: [] });
  assert.deepEqual(next.sessions, {});
  assert.equal(next.workerId, result.workerId);
});

test('a different returned identity or failed reconnect leaves saved state untouched', async () => {
  const snapshot = structuredClone(previous);
  for (const post of [
    async () => ({ ...result, workerId: '10000000-0000-4000-8000-000000000002' }),
    async () => {
      throw new Error('Reconnect denied');
    },
  ]) {
    await assert.rejects(
      pairCompanion({ api: { post }, options, pairingToken: 'code', capabilities: [], previous }),
    );
    assert.deepEqual(previous, snapshot);
  }
});
