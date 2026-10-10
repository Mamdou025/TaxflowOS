import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { DocumentExtraction } from '../../lib/workflow-contracts/src/domain/document-extraction';
import { queueStoredSourceIndexing } from '../../artifacts/api-server/src/lib/chatgpt-plugin/source-indexing-status';

function extraction(): DocumentExtraction {
  return {
    id: 'synthetic-capture',
    revision: 1,
    fileName: 'synthetic.json',
    contentHash: `sha256:${'a'.repeat(64)}`,
    extractedAt: '2026-10-08T00:00:00.000Z',
    method: 'json',
    originalDocumentId: 'confirmed-original',
    rows: [{ amount: 3 }],
    segments: [],
    issues: [],
  };
}

test('a failed queue and failed status update preserve confirmed original provenance', async () => {
  const value = extraction();
  let statusUpdates = 0;
  await assert.doesNotReject(
    queueStoredSourceIndexing(value, {
      enqueue: async () => {
        throw new Error('Synthetic queue unavailable');
      },
      markFailed: async () => {
        statusUpdates++;
        throw new Error('Synthetic metadata unavailable');
      },
    }),
  );
  assert.equal(statusUpdates, 1);
  assert.equal(value.originalDocumentId, 'confirmed-original');
  assert.deepEqual(
    value.issues.map((issue) => issue.code),
    ['SEARCH_NOT_INDEXED'],
  );
  assert.equal(
    value.issues.some((issue) => issue.code === 'ORIGINAL_NOT_STORED'),
    false,
  );
});

test('successful indexing queues leave confirmed provenance unchanged and do not mark failure', async () => {
  const value = extraction(),
    before = structuredClone(value);
  let queued = 0;
  await queueStoredSourceIndexing(value, {
    enqueue: async () => {
      queued++;
    },
    markFailed: async () => {
      assert.fail('A successful queue must not be marked failed.');
    },
  });
  assert.equal(queued, 1);
  assert.deepEqual(value, before);
});
