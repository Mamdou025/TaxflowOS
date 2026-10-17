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

// Portable identity-sharing fixture; no user data or live source providers are involved.
function sharedPayload(value) {
  const nodes = [];
  const ids = new WeakMap();
  function encode(item) {
    if (item === null || typeof item !== 'object') return item;
    if (ids.has(item)) return [ids.get(item)];
    const id = nodes.length;
    ids.set(item, id);
    nodes.push(null);
    nodes[id] = Array.isArray(item)
      ? ['array', item.map(encode)]
      : ['object', Object.entries(item).map(([key, child]) => [key, encode(child)])];
    return [id];
  }
  return JSON.stringify({ format: 'taxflow-shared-json-v1', root: encode(value), nodes });
}

test('shared evidence roundtrips while logical and typed amplification preserve the saved revision', async () => {
  const code = await key();
  const sourceFixture = fs.readFileSync(
    'tests/fixtures/backups/document-calculation-v1.json',
    'utf8',
  );
  const library = JSON.parse(sourceFixture).library;
  const entry = Object.values(library)[0];
  const rows = Array.from({ length: 1500 }, (_, row) => ({ row, amount: row - 750 }));
  entry.draft.blocks[0].config.repeatedEvidence = Array(300).fill(rows);
  const valid = sharedPayload(library);
  assert.equal((await save(code, valid, 0)).revision, 1);
  assert.equal((await (await request('GET', code)).json()).payload, valid);

  const logical = JSON.parse(sourceFixture).library;
  let amplified = 0;
  for (let depth = 0; depth < 100; depth++) amplified = [amplified, amplified];
  Object.values(logical)[0].draft.blocks[0].config.amplified = amplified;
  const typed = JSON.parse(sourceFixture).library;
  const target = Object.values(typed)[0];
  target.versions = Array(2000).fill({
    number: 1,
    savedAt: '2026-10-05T00:00:00.000Z',
    definition: target.draft,
  });
  for (const invalid of [logical, typed]) {
    const response = await request('PUT', code, { payload: sharedPayload(invalid), revision: 1 });
    assert.equal(response.status, 400);
    const retained = await (await request('GET', code)).json();
    assert.equal(retained.revision, 1);
    assert.equal(retained.payload, valid);
  }
});

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

test('guided run revisions and pause state roundtrip through the real workspace library', async () => {
  const code = await key();
  const library = JSON.parse(fixture);
  const entry = Object.values(library)[0];
  entry.versions = [{ number: 1, savedAt: '2026-09-16T00:00:00.000Z', definition: entry.draft }];
  entry.runs = [];
  entry.sessions = [
    {
      id: 'guided-storage-test',
      endedAt: '2026-10-02T12:00:00.000Z',
      inputOverrides: {
        source: { value: 250, unit: 'CAD' },
        calculation: {
          inputChoices: {
            amount: { kind: 'manual', value: 0 },
            rate: { kind: 'source', blockId: 'source', path: ['namedValues', 'rate'] },
            adjustment: { kind: 'manual' },
          },
        },
      },
      version: 1,
      revision: 7,
      createdAt: '2026-09-16T00:00:00.000Z',
      paused: true,
      results: {},
      stale: [],
      reviewed: [],
      sources: [],
      attempts: [],
    },
  ];
  await save(code, JSON.stringify(library), 0);
  const restored = JSON.parse((await (await request('GET', code)).json()).payload);
  assert.deepEqual(restored[entry.id].sessions, entry.sessions);
  assert.deepEqual(restored[entry.id].versions, entry.versions);
  assert.deepEqual(restored[entry.id].draft, entry.draft);
  const stale = await request('PUT', code, { payload: JSON.stringify(library), revision: 0 });
  assert.equal(stale.status, 409);
  assert.deepEqual(
    JSON.parse((await (await request('GET', code)).json()).payload)[entry.id].sessions,
    entry.sessions,
  );
});

function documentRun(documentId, extractionId) {
  return {
    version: 1,
    at: '2026-10-17T12:00:00.000Z',
    result: {
      blockStatuses: {},
      edgeStatuses: {},
      record: {
        execution: {
          id: `run-${extractionId}`,
          workflowId: 'placeholder',
          status: 'success',
          startedAt: '2026-10-17T12:00:00.000Z',
          completedAt: '2026-10-17T12:00:01.000Z',
          duration: '1s',
          error: null,
        },
        logs: [],
      },
      result: {
        runId: `run-${extractionId}`,
        workflowId: 'placeholder',
        workflowName: 'test',
        status: 'success',
        startedAt: '2026-10-17T12:00:00.000Z',
        completedAt: '2026-10-17T12:00:01.000Z',
        results: [],
        logs: [],
        warnings: [],
        errors: [],
      },
    },
    sessionSnapshot: {
      id: `session-${extractionId}`,
      version: 1,
      revision: 1,
      createdAt: '2026-10-17T11:00:00.000Z',
      paused: false,
      results: {},
      stale: [],
      reviewed: [],
      attempts: [],
      sources: [
        {
          id: `source-${extractionId}`,
          blockId: 'block-1',
          name: 't4.pdf',
          at: '2026-10-17T11:00:00.000Z',
          mode: 'add',
          rows: [],
          extraction: {
            id: extractionId,
            revision: 1,
            fileName: 't4.pdf',
            contentHash: 'hash-1',
            extractedAt: '2026-10-17T11:00:00.000Z',
            method: 'pdf_text',
            originalDocumentId: documentId,
            segments: [],
            rows: [],
            issues: [],
          },
        },
      ],
    },
  };
}

test('a document-backed run indexes a workflow-to-document edge, and a later save without it clears the edge', async () => {
  const code = await key();
  const library = JSON.parse(fixture);
  const entry = Object.values(library)[0];
  const run = documentRun('doc-1', 'extraction-1');
  run.result.record.execution.workflowId = entry.id;
  run.result.result.workflowId = entry.id;
  entry.runs = [run];
  await save(code, JSON.stringify(library), 0);

  const indexed = await stack.db.query(
    'SELECT from_type, from_id, to_type, to_id, context FROM entity_references WHERE workspace_id=$1',
    [code],
  );
  assert.equal(indexed.rows.length, 1);
  assert.equal(indexed.rows[0].from_type, 'workflow');
  assert.equal(indexed.rows[0].from_id, entry.id);
  assert.equal(indexed.rows[0].to_type, 'document');
  assert.equal(indexed.rows[0].to_id, 'doc-1');
  assert.equal(indexed.rows[0].context.extractionId, 'extraction-1');

  // The whole payload is always a full snapshot, so the index replaces rather than
  // accumulates: removing the document-backed run from the saved library clears its edge.
  entry.runs = [];
  await save(code, JSON.stringify(library), 1);
  const cleared = await stack.db.query('SELECT 1 FROM entity_references WHERE workspace_id=$1', [
    code,
  ]);
  assert.equal(cleared.rowCount, 0);
});

test('deleting a workspace library clears its indexed references too', async () => {
  const code = await key();
  const library = JSON.parse(fixture);
  const entry = Object.values(library)[0];
  const run = documentRun('doc-2', 'extraction-2');
  run.result.record.execution.workflowId = entry.id;
  run.result.result.workflowId = entry.id;
  entry.runs = [run];
  await save(code, JSON.stringify(library), 0);
  assert.equal(
    (await stack.db.query('SELECT 1 FROM entity_references WHERE workspace_id=$1', [code]))
      .rowCount,
    1,
  );
  assert.equal((await request('DELETE', code)).status, 200);
  assert.equal(
    (await stack.db.query('SELECT 1 FROM entity_references WHERE workspace_id=$1', [code]))
      .rowCount,
    0,
  );
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
