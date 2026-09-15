import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createWorkflowSyncService,
  WORKSPACE_KEY,
  SYNC_META_KEY,
} from '../../artifacts/ai-workflow-builder/src/features/workflows-hub/services/workflow-sync-service';
import {
  WorkflowStorageError,
  type ReadLibraryResponse,
  type SaveLibraryResponse,
  type SaveLibraryRequest,
} from '../../lib/workflow-contracts/src/storage-protocol';
import type { WorkflowLibrary } from '../../lib/workflow-contracts/src/library-types';
import { createBlankWorkflow } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/templates/portfolio';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
const flush = () => new Promise<void>((resolve) => setImmediate(resolve));
function harness(
  options: {
    read?: (code: string) => Promise<ReadLibraryResponse>;
    save?: (code: string, body: SaveLibraryRequest) => Promise<SaveLibraryResponse>;
    dirty?: boolean;
  } = {},
) {
  const memory = new Map([
    [WORKSPACE_KEY, 'a'.repeat(64)],
    [SYNC_META_KEY, JSON.stringify({ revision: 1, dirty: options.dirty ?? true })],
  ]);
  const writes: SaveLibraryRequest[] = [];
  let library: WorkflowLibrary = {};
  let applied = 0;
  const service = createWorkflowSyncService({
    storage: {
      getItem: (key) => memory.get(key) ?? null,
      setItem: (key, value) => {
        memory.set(key, value);
      },
    },
    client: {
      read: options.read ?? (async () => ({ payload: '{}', revision: 1 })),
      save: async (code, body) => {
        writes.push(body);
        return options.save ? options.save(code, body) : { revision: body.revision + 1 };
      },
    },
    encode: JSON.stringify,
    decode: JSON.parse,
    createCode: () => 'c'.repeat(64),
    // No real timer in unit tests; callers explicitly flush queued work.
    schedule: () => 0,
    cancel: () => {},
  });
  service.initialize(
    () => library,
    (value) => {
      applied++;
      library = value;
    },
  );
  return { service, memory, writes, applied: () => applied };
}

test('edits made during an in-flight save stay dirty and use the returned revision', async () => {
  const first = deferred<SaveLibraryResponse>();
  let count = 0;
  const h = harness({
    save: async (_code, body) => (++count === 1 ? first.promise : { revision: body.revision + 1 }),
  });
  await flush();
  h.service.queueSave();
  first.resolve({ revision: 2 });
  await h.service.sync();
  assert.equal(JSON.parse(h.memory.get(SYNC_META_KEY)!).dirty, true);
  await h.service.sync();
  assert.deepEqual(
    h.writes.map((write) => write.revision),
    [1, 2],
  );
  assert.equal(JSON.parse(h.memory.get(SYNC_META_KEY)!).dirty, false);
});

test('revision conflicts stop subsequent writes until an explicit workspace open', async () => {
  const h = harness({
    save: async () => {
      throw new WorkflowStorageError('Conflict; keep the local backup.', 409);
    },
  });
  await h.service.sync();
  h.service.queueSave();
  await h.service.sync();
  assert.equal(h.writes.length, 1);
  assert.match(h.service.getStatus(), /Conflict/);
});

test('offline failures retain dirty state and can be retried', async () => {
  let count = 0;
  const h = harness({
    save: async () => {
      if (++count === 1) throw new Error('Offline');
      return { revision: 2 };
    },
  });
  await h.service.sync();
  assert.equal(JSON.parse(h.memory.get(SYNC_META_KEY)!).dirty, true);
  await h.service.sync();
  assert.equal(h.service.getStatus(), 'Saved to server');
});

test('an intentional empty local library is saved instead of resurrecting deleted workflows', async () => {
  const library = {
    'custom:test': {
      id: 'custom:test',
      templateId: 'blank',
      draft: { ...createBlankWorkflow(), id: 'custom:test' },
      versions: [],
      runs: [],
    },
  };
  const h = harness({ read: async () => ({ payload: JSON.stringify(library), revision: 1 }) });
  await h.service.sync();
  assert.equal(h.applied(), 0);
  assert.equal(h.writes[0].payload, '{}');
});

test('a stale request failure cannot change the status of the newly opened workspace', async () => {
  const pending = deferred<SaveLibraryResponse>();
  const h = harness({ save: async () => pending.promise });
  await flush();
  const oldSync = h.service.sync();
  await h.service.open('b'.repeat(64));
  pending.reject(new WorkflowStorageError('Old workspace conflict', 409));
  await oldSync;
  assert.equal(h.memory.get(WORKSPACE_KEY), 'b'.repeat(64));
  assert.equal(h.service.getStatus(), 'Saved to server');
});

test('invalid remote backups are never applied or replaced by local data', async () => {
  const h = harness({
    dirty: false,
    read: async () => ({ payload: '{"custom:x":{"id":"custom:x"}}', revision: 2 }),
  });
  await h.service.sync();
  assert.equal(h.applied(), 0);
  assert.equal(h.writes.length, 0);
  assert.match(h.service.getStatus(), /Invalid workflow backup/);
});
