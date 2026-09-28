import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { PassThrough, Writable } from 'node:stream';
import { AcpClient } from './acp-client.mjs';

function fixture() {
  const messages = [];
  const child = new EventEmitter();
  child.stdout = new PassThrough();
  child.stderr = new PassThrough();
  child.stdin = new Writable({
    write(chunk, _encoding, done) {
      messages.push(JSON.parse(chunk.toString()));
      done();
    },
  });
  child.kill = () => {
    child.killed = true;
  };
  let spawnArgs;
  const client = new AcpClient({
    executable: 'C:\\Goose Folder\\goose.exe',
    cwd: 'C:\\Mkoro',
    env: { GOOSE_MODE: 'auto', MKORO_PAIRING_TOKEN: 'private-pairing-token', PATH: '/tools' },
    spawnProcess: (...args) => {
      spawnArgs = args;
      return child;
    },
  });
  const send = (value) => child.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', ...value })}\n`);
  const ready = client.start();
  send({
    id: messages[0].id,
    result: { protocolVersion: 1, agentCapabilities: { loadSession: true } },
  });
  return { client, child, messages, send, ready, spawnArgs };
}

test('ACP starts executable directly with approve mode and no pairing secret', async () => {
  const f = fixture();
  await f.ready;
  assert.deepEqual(f.spawnArgs.slice(0, 2), ['C:\\Goose Folder\\goose.exe', ['acp']]);
  assert.equal(f.spawnArgs[2].shell, false);
  assert.equal(f.spawnArgs[2].env.GOOSE_MODE, 'approve');
  assert.equal(f.spawnArgs[2].env.MKORO_PAIRING_TOKEN, undefined);
  assert.deepEqual(f.messages[0].params.clientCapabilities, {});
  assert.equal(f.client.capabilities.loadSession, true);
  f.client.close();
});

test('ACP handles split UTF-8 and correlates concurrent responses by ID', async () => {
  const f = fixture();
  await f.ready;
  const updates = [];
  f.client.on('update', (params) => updates.push(params));
  const first = f.client.request('first', {});
  const second = f.client.request('second', {});
  f.send({ id: f.messages[2].id, result: { second: true } });
  const update = Buffer.from(
    `${JSON.stringify({ jsonrpc: '2.0', method: 'session/update', params: { text: 'hello 🌍' } })}\n`,
  );
  const split = update.indexOf(Buffer.from('🌍')) + 1;
  f.child.stdout.write(update.subarray(0, split));
  f.child.stdout.write(update.subarray(split));
  f.send({ id: f.messages[1].id, result: { first: true } });
  assert.deepEqual(await first, { first: true });
  assert.deepEqual(await second, { second: true });
  assert.deepEqual(updates, [{ text: 'hello 🌍' }]);
  f.client.close();
});

test('permission is not auto-approved; unsupported client methods are rejected', async () => {
  const f = fixture();
  await f.ready;
  const requests = [];
  f.client.on('permission', (request) => requests.push(request));
  f.send({ id: 'permission-1', method: 'session/request_permission', params: { options: [] } });
  assert.equal(requests.length, 1);
  assert.equal(f.messages.length, 1);
  f.send({ id: 9, method: 'fs/write_text_file', params: { path: 'C:\\do-not-write' } });
  assert.equal(f.messages.at(-1).error.code, -32601);
  assert.equal(f.messages.at(-1).id, 9);
  f.client.close();
});

test('process failure rejects pending requests without exposing stderr', async () => {
  const f = fixture();
  await f.ready;
  const pending = f.client.request('session/prompt', {}, 0);
  f.child.stderr.write('secret-key-that-must-not-be-forwarded');
  f.child.emit('close', 1);
  await assert.rejects(pending, (error) => {
    assert.doesNotMatch(error.message, /secret-key/);
    return /Goose stopped/.test(error.message);
  });
  assert.equal(f.client.closed, true);
});

test('malformed protocol terminates connection and raw provider error data stays private', async () => {
  const f = fixture();
  await f.ready;
  const pending = f.client.request('session/new', {});
  f.send({
    id: f.messages.at(-1).id,
    error: { code: -32603, message: 'secret-value', data: 'another-secret' },
  });
  await assert.rejects(pending, (error) => {
    assert.doesNotMatch(error.message, /secret/);
    return /-32603/.test(error.message);
  });
  const next = f.client.request('session/new', {});
  f.child.stdout.write('not-json\n');
  await assert.rejects(next, /not valid ACP JSON/);
  assert.equal(f.child.killed, true);
});
