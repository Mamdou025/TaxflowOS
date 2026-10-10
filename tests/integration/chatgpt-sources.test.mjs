import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { createTestRun } from '../../scripts/testing/runtime.mjs';
import { startTestStack } from '../../scripts/testing/stack.mjs';
import { createAccount, createWorkspace, setMember } from './access-fixtures.mjs';

const XLSX = createRequire(path.resolve('artifacts/api-server/package.json'))('xlsx');
const run = createTestRun('chatgpt-sources');
const runId = 'source-working-run';
const blockId = 'pf-document-calculator--document';
let stack, owner, viewer, stranger, workspace, other, workflowId, initialPayload;
let requestId = 0;
async function call(account, name, args, selectedWorkspace = workspace, route = '/chatgpt/mcp') {
  const response = await account.request(route, {
    method: 'POST',
    workspace: selectedWorkspace,
    headers: { Accept: 'application/json, text/event-stream' },
    body: {
      jsonrpc: '2.0',
      id: ++requestId,
      method: 'tools/call',
      params: { name, arguments: args },
    },
  });
  const body = await response.json();
  return { status: response.status, result: body.result, error: body.error };
}
async function success(name, args) {
  const response = await call(owner, name, args);
  assert.equal(response.status, 200);
  assert.notEqual(
    response.result?.isError,
    true,
    JSON.stringify(response.result?.structuredContent),
  );
  assert.ok(response.result?.structuredContent);
  return response.result.structuredContent;
}
async function saved() {
  const response = await owner.request('/workflow-library', { workspace });
  assert.equal(response.status, 200);
  return response.json();
}
async function upload(bytes, fileName, revision = 0) {
  const started = await success('begin_workflow_source', {
    workflowId,
    runId,
    blockId,
    expectedRevision: revision,
    fileName,
    size: bytes.length,
    mimeType: 'application/octet-stream',
  });
  for (let offset = 0; offset < bytes.length; offset += started.chunkBytes)
    await success('append_workflow_source', {
      uploadId: started.uploadId,
      offset,
      base64: bytes.subarray(offset, offset + started.chunkBytes).toString('base64'),
    });
  return started;
}
before(
  async () => {
    stack = await startTestStack(run);
    owner = await createAccount(stack, 'Source owner');
    viewer = await createAccount(stack, 'Source viewer');
    stranger = await createAccount(stack, 'Foreign source owner');
    workspace = await createWorkspace(owner, 'Source capture test');
    other = await createWorkspace(stranger, 'Other source workspace');
    await setMember(owner, workspace, viewer, 'viewer');
    const library = JSON.parse(
      fs.readFileSync('tests/fixtures/backups/document-calculation-v1.json', 'utf8'),
    ).library;
    const entry = Object.values(library)[0];
    workflowId = entry.id;
    const now = '2026-10-08T00:00:00.000Z';
    entry.versions = [{ number: 1, savedAt: now, definition: structuredClone(entry.draft) }];
    const results = Object.fromEntries(
      entry.draft.blocks.map((block) => [
        block.id,
        {
          runId,
          blockId: block.id,
          toolId: block.config.toolId ?? 'synthetic.fixture',
          status: 'success',
          output: { syntheticFixture: true },
          logs: [],
          warnings: [],
          errors: [],
          evidenceRefs: [],
          sourceTrace: [],
          startedAt: now,
          completedAt: now,
        },
      ]),
    );
    entry.sessions = [
      {
        id: runId,
        version: 1,
        revision: 0,
        createdAt: now,
        paused: true,
        results,
        stale: [],
        reviewed: Object.keys(results),
        approvedAt: now,
        sources: [
          {
            id: 'old-evidence',
            blockId,
            name: 'previous.json',
            at: now,
            mode: 'replace',
            rows: [{ rowId: 'prior-1', label: 'Prior input', amount: 5 }],
          },
        ],
        attempts: [],
      },
    ];
    initialPayload = JSON.stringify({ format: 'taxflow-workflow-backup-v1', library });
    const response = await owner.request('/workflow-library', {
      method: 'PUT',
      workspace,
      body: { payload: initialPayload, revision: 0 },
    });
    assert.equal(response.status, 200, await response.clone().text());
  },
  { timeout: 240000 },
);
after(() => run.close());

test('staged bytes are actor/workspace bound, ordered, bounded and safe to retry', async () => {
  const bytes = Buffer.from(
    JSON.stringify([{ rowId: 'new-1', label: 'New input', amount: 9, note: 'x'.repeat(60000) }]),
  );
  const args = {
    workflowId,
    runId,
    blockId,
    expectedRevision: 0,
    fileName: 'staged.json',
    size: bytes.length,
    mimeType: 'application/json',
  };
  for (const route of ['/chatgpt/mcp', '/CHATGPT/MCP/']) {
    assert.equal(
      (await call(viewer, 'begin_workflow_source', args, workspace, route)).result.isError,
      true,
    );
    assert.equal(
      (await call(stranger, 'begin_workflow_source', args, workspace, route)).status,
      403,
    );
  }
  const started = await success('begin_workflow_source', args);
  assert.equal(started.chunkBytes, 49152);
  const first = {
    uploadId: started.uploadId,
    offset: 0,
    base64: bytes.subarray(0, started.chunkBytes).toString('base64'),
  };
  assert.equal((await success('append_workflow_source', first)).offset, started.chunkBytes);
  assert.equal((await success('append_workflow_source', first)).offset, started.chunkBytes);
  await setMember(owner, workspace, viewer, 'editor');
  try {
    for (const [account, selectedWorkspace] of [
      [viewer, workspace],
      [stranger, other],
    ])
      assert.equal(
        (await call(account, 'append_workflow_source', first, selectedWorkspace)).result.isError,
        true,
      );
  } finally {
    await setMember(owner, workspace, viewer, 'viewer');
  }
  assert.equal(
    (
      await call(owner, 'append_workflow_source', {
        ...first,
        base64: Buffer.alloc(started.chunkBytes, 65).toString('base64'),
      })
    ).result.isError,
    true,
  );
  assert.equal(
    (await call(owner, 'capture_workflow_source', { uploadId: started.uploadId })).result.isError,
    true,
  );
  await success('append_workflow_source', {
    uploadId: started.uploadId,
    offset: started.chunkBytes,
    base64: bytes.subarray(started.chunkBytes).toString('base64'),
  });
  const capture = await success('capture_workflow_source', { uploadId: started.uploadId });
  assert.equal(capture.rowCount, 1);
  assert.equal(
    (await success('capture_workflow_source', { uploadId: started.uploadId })).captureId,
    capture.captureId,
  );
  assert.equal(
    (await saved()).payload,
    initialPayload,
    'Capturing bytes must not apply them to the run',
  );
});

test('malformed source capture preserves existing source, revision and results', async () => {
  const staged = await upload(Buffer.from('{invalid json'), 'broken.json');
  assert.equal(
    (await call(owner, 'capture_workflow_source', { uploadId: staged.uploadId })).result.isError,
    true,
  );
  const state = await saved();
  assert.equal(state.revision, 1);
  assert.equal(state.payload, initialPayload);
  const old = await success('read_workflow_source', {
    workflowId,
    runId,
    sourceId: 'old-evidence',
  });
  assert.deepEqual(old.rows, [{ rowId: 'prior-1', label: 'Prior input', amount: 5 }]);
});

test('explicit worksheet selection is preserved through review/apply and old evidence stays readable', async () => {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.aoa_to_sheet([
      ['Label', 'Amount'],
      ['Wrong', 999],
    ]),
    'Wrong',
  );
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.aoa_to_sheet([
      ['Label', 'Amount'],
      ['Item A', 27],
      ['Item B', -4],
    ]),
    'Chosen',
  );
  const bytes = Buffer.from(XLSX.write(book, { type: 'buffer', bookType: 'xlsx' }));
  const staged = await upload(bytes, 'replacement.xlsx');
  const inspected = await success('inspect_workflow_source', { uploadId: staged.uploadId });
  assert.deepEqual(
    inspected.sheets.map((sheet) => sheet.sheetName),
    ['Wrong', 'Chosen'],
  );
  assert.equal(
    (await call(owner, 'capture_workflow_source', { uploadId: staged.uploadId })).result.isError,
    true,
  );
  const captured = await success('capture_workflow_source', {
    uploadId: staged.uploadId,
    selection: {
      sheetName: 'Chosen',
      headerRowNumber: 1,
      mapping: { label: 'Label', amount: 'Amount' },
    },
  });
  assert.deepEqual(
    captured.previewRows.map((row) => [row.label, row.amount]),
    [
      ['Item A', 27],
      ['Item B', -4],
    ],
  );
  assert.ok(captured.issues.some((issue) => issue.code === 'ORIGINAL_NOT_STORED'));
  // PostgreSQL JSONB reorders nested object keys. The same selection must remain
  // idempotent, including when a client sends its keys in a different order.
  const captureRetry = await success('capture_workflow_source', {
    uploadId: staged.uploadId,
    selection: {
      mapping: { amount: 'Amount', label: 'Label' },
      headerRowNumber: 1,
      sheetName: 'Chosen',
    },
  });
  assert.deepEqual(captureRetry, captured);
  assert.equal(
    (
      await call(owner, 'capture_workflow_source', {
        uploadId: staged.uploadId,
        selection: {
          sheetName: 'Wrong',
          headerRowNumber: 1,
          mapping: { label: 'Label', amount: 'Amount' },
        },
      })
    ).result.isError,
    true,
    'A genuinely different worksheet selection must still be rejected',
  );
  await setMember(owner, workspace, viewer, 'editor');
  try {
    assert.equal(
      (
        await call(viewer, 'preview_workflow_change', {
          workflowId,
          runId,
          expectedRevision: 0,
          expectedLibraryRevision: 1,
          change: { kind: 'source', blockId, captureId: captured.captureId, mode: 'replace' },
        })
      ).result.isError,
      true,
    );
  } finally {
    await setMember(owner, workspace, viewer, 'viewer');
  }
  const preview = await success('preview_workflow_change', {
    workflowId,
    runId,
    expectedRevision: 0,
    expectedLibraryRevision: 1,
    change: { kind: 'source', blockId, captureId: captured.captureId, mode: 'replace' },
  });
  assert.equal(
    preview.changes[0].after.contentHash,
    `sha256:${createHash('sha256').update(bytes).digest('hex')}`,
  );
  assert.deepEqual(
    preview.affectedBlockIds.sort(),
    ['document', 'rules', 'groups', 'calculate', 'result']
      .map((name) => `pf-document-calculator--${name}`)
      .sort(),
  );
  assert.equal((await saved()).payload, initialPayload);
  const applied = await success('apply_workflow_change', { reviewToken: preview.reviewToken });
  assert.equal(applied.operation.runId, runId);
  assert.deepEqual(applied.operation.executedBlockIds, []);
  const state = await saved();
  const session = JSON.parse(state.payload).library[workflowId].sessions[0];
  assert.equal(session.id, runId);
  assert.equal(session.revision, 1);
  assert.equal(session.paused, true);
  assert.equal(session.approvedAt, undefined);
  assert.equal(session.sources.length, 2);
  assert.deepEqual(
    session.stale.sort(),
    ['document', 'rules', 'groups', 'calculate', 'result']
      .map((name) => `pf-document-calculator--${name}`)
      .sort(),
  );
  assert.ok(!session.stale.includes('pf-document-calculator--start'));
  assert.deepEqual(
    session.results,
    JSON.parse(initialPayload).library[workflowId].sessions[0].results,
    'Apply marks prior results stale; it does not invent new outputs',
  );
  assert.deepEqual(
    (await success('read_workflow_source', { workflowId, runId, sourceId: 'old-evidence' })).rows,
    [{ rowId: 'prior-1', label: 'Prior input', amount: 5 }],
  );
  const current = await success('read_workflow_source', {
    workflowId,
    runId,
    sourceId: captured.captureId,
    limit: 1,
  });
  assert.equal(current.totalRows, 2);
  assert.equal(current.rows[0].amount, 27);
  assert.equal(current.nextOffset, 1);
  assert.equal(
    (
      await success('read_workflow_source', {
        workflowId,
        runId,
        sourceId: captured.captureId,
        offset: 1,
        limit: 1,
      })
    ).rows[0].amount,
    -4,
  );
});
