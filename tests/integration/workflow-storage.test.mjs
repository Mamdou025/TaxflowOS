import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createAccount, createWorkspace } from './access-fixtures.mjs';
import { createTestRun } from '../../scripts/testing/runtime.mjs';
import { startTestStack } from '../../scripts/testing/stack.mjs';

const run = createTestRun('integration');
console.log(`Integration evidence: ${run.output}`);
let stack, account;
before(
  async () => {
    stack = await startTestStack(run);
    account = await createAccount(stack);
  },
  { timeout: 180000 },
);
after(() => run.close());
const key = () => createWorkspace(account);
const fixture = fs.readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8');
function payload(description) {
  const library = JSON.parse(fixture);
  Object.values(library)[0].draft.description = description;
  return JSON.stringify(library);
}

async function request(method, code, body) {
  return account.request('/workflow-library', { method, workspace: code, body });
}
async function save(code, payload, revision) {
  const response = await request('PUT', code, { payload, revision });
  assert.equal(response.status, 200);
  return response.json();
}

test('missing and malformed workspace IDs are refused for read, write and delete', async () => {
  for (const method of ['GET', 'PUT', 'DELETE']) {
    for (const code of [undefined, 'not-a-recovery-code', 'G'.repeat(64)]) {
      assert.equal(
        (
          await request(
            method,
            code,
            method === 'PUT' ? { payload: fixture, revision: 0 } : undefined,
          )
        ).status,
        400,
      );
    }
  }
});

test('first save roundtrips the frozen backup with server-authorized workspace ownership', async () => {
  const code = await key();
  const empty = await request('GET', code);
  assert.equal(empty.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await empty.json(), { payload: null, revision: 0 });
  assert.equal((await save(code, fixture, 0)).revision, 1);
  const loaded = await (await request('GET', code)).json();
  assert.equal(loaded.payload, fixture);
  assert.equal(loaded.revision, 1);
  assert.ok(Number.isFinite(Date.parse(loaded.updated_at)));
  const { rows } = await stack.db.query(
    'SELECT workspace_id, updated_by, payload, revision FROM workspace_libraries WHERE workspace_id=$1',
    [code],
  );
  assert.equal(rows[0].payload, fixture);
  assert.equal(rows[0].updated_by, account.user.id);
  assert.equal(rows[0].workspace_id, code);
  assert.equal(rows[0].revision, 1);
});

test('invalid request envelopes do not advance a saved revision', async () => {
  const code = await key();
  await save(code, fixture, 0);
  for (const body of [
    { payload: {}, revision: 1 },
    { payload: fixture, revision: -1 },
    { payload: fixture, revision: 1.5 },
    { payload: fixture, revision: '1' },
    { revision: 1 },
  ]) {
    assert.equal((await request('PUT', code, body)).status, 400);
  }
  const stored = await (await request('GET', code)).json();
  assert.equal(stored.revision, 1);
  assert.equal(stored.payload, fixture);
});

test('simultaneous creators and writers have exactly one winner; stale writes preserve it', async () => {
  const code = await key();
  const race = async (revision) => {
    const payloads = [payload(`synthetic-a-${revision}`), payload(`synthetic-b-${revision}`)];
    const responses = await Promise.all(
      payloads.map((payload) => request('PUT', code, { payload, revision })),
    );
    assert.deepEqual(responses.map((response) => response.status).sort(), [200, 409]);
    const winner = payloads[responses.findIndex((response) => response.status === 200)];
    const stored = await (await request('GET', code)).json();
    assert.equal(stored.payload, winner);
    assert.equal(stored.revision, revision + 1);
    assert.equal((await request('PUT', code, { payload: payload('stale'), revision })).status, 409);
    assert.equal((await (await request('GET', code)).json()).payload, winner);
  };
  await race(0);
  await race(1);
});

test('separate workspace libraries and deleting one library preserve the other', async () => {
  const first = await key(),
    second = await key();
  await save(first, payload('first synthetic workspace'), 0);
  await save(second, payload('second synthetic workspace'), 0);
  assert.equal((await request('DELETE', first)).status, 200);
  const deleted = await (await request('GET', first)).json();
  assert.equal(deleted.revision, 2);
  assert.deepEqual(JSON.parse(deleted.payload), {
    format: 'taxflow-workflow-backup-v1',
    library: {},
  });
  assert.equal(
    (await (await request('GET', second)).json()).payload,
    payload('second synthetic workspace'),
  );
});

test('deleting and recreating a library never admits an older browser revision', async () => {
  const code = await key();
  await save(code, fixture, 0);
  assert.equal((await request('DELETE', code)).status, 200);
  const tombstone = await (await request('GET', code)).json();
  assert.equal(tombstone.revision, 2);
  const restored = payload('New library after deletion');
  assert.equal((await save(code, restored, tombstone.revision)).revision, 3);
  assert.equal((await request('PUT', code, { revision: 1, payload: fixture })).status, 409);
  assert.equal((await (await request('GET', code)).json()).payload, restored);
});

test('a one-megabyte backup and an intentionally empty library survive an API restart', async () => {
  const code = await key();
  const large = payload('x'.repeat(1024 * 1024));
  await save(code, large, 0);
  await stack.restartApi();
  assert.equal((await (await request('GET', code)).json()).payload, large);
  const empty = JSON.stringify({ format: 'taxflow-workflow-backup-v1', library: {} });
  assert.equal((await save(code, empty, 1)).revision, 2);
  await stack.restartApi();
  assert.equal((await (await request('GET', code)).json()).payload, empty);
});

test('a storage query failure is visible and retry retains the last durable payload', async () => {
  const code = await key();
  await save(code, fixture, 0);
  await stack.db.query('ALTER TABLE workspace_libraries RENAME TO test_unavailable_library');
  try {
    assert.equal((await request('GET', code)).status, 503);
    assert.equal(
      (await request('PUT', code, { revision: 1, payload: payload('failed write') })).status,
      503,
    );
  } finally {
    await stack.db.query('ALTER TABLE test_unavailable_library RENAME TO workspace_libraries');
  }
  const retained = await (await request('GET', code)).json();
  assert.equal(retained.payload, fixture);
  assert.equal(retained.revision, 1);
  assert.equal((await save(code, payload('retried write'), 1)).revision, 2);
});

test(
  'two simultaneous test stacks have independent databases, ports and cleanup',
  { timeout: 180000 },
  async () => {
    const otherRun = createTestRun('integration-isolation');
    const code = await key();
    await save(code, payload('belongs to the first stack'), 0);
    try {
      const other = await startTestStack(otherRun);
      assert.notEqual(other.container, stack.container);
      assert.notEqual(other.baseURL, stack.baseURL);
      assert.notEqual(otherRun.output, run.output);
      // Even the first stack's valid session and workspace cannot authenticate here.
      const cross = await fetch(other.baseURL + '/api/workflow-library', {
        headers: { Cookie: account.cookie, 'x-taxflow-workspace': code },
      });
      assert.equal(cross.status, 401);
      const otherAccount = await createAccount(other);
      const otherWorkspace = await createWorkspace(otherAccount);
      const response = await otherAccount.request('/workflow-library', {
        workspace: otherWorkspace,
      });
      assert.deepEqual(await response.json(), { payload: null, revision: 0 });
    } finally {
      await otherRun.close();
    }
    assert.equal(
      (await (await request('GET', code)).json()).payload,
      payload('belongs to the first stack'),
    );
  },
);
