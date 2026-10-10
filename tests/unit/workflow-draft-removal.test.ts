import assert from 'node:assert/strict';
import test from 'node:test';
import { createWorkflow, saveVersion } from '../../lib/workflow-core/src/application/commands';
import type { WorkflowLibrary } from '../../lib/workflow-contracts/src/library-types';
import { WorkflowStorageError, type SaveLibraryRequest, type ReadLibraryResponse, type SaveLibraryResponse } from '../../lib/workflow-contracts/src/storage-protocol';
import { createBlankWorkflow } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/templates/portfolio';
import { createWorkflowSyncService, WORKSPACE_KEY, SYNC_META_KEY } from '../../artifacts/ai-workflow-builder/src/features/workflows-hub/services/workflow-sync-service';

function draft(id: string) { return createWorkflow(`custom:${id}`, 'blank', createBlankWorkflow()); }
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const flush = () => new Promise<void>((resolve) => setImmediate(resolve));
function harness(local: WorkflowLibrary, remote: WorkflowLibrary, options: {
  read?: () => Promise<ReadLibraryResponse>;
  save?: (body: SaveLibraryRequest) => Promise<SaveLibraryResponse>;
  pendingSync?: boolean;
} = {}) {
  const memory = new Map([[WORKSPACE_KEY, 'a'.repeat(64)], [SYNC_META_KEY, JSON.stringify({ revision: 2, dirty: true })]]);
  let library = local;
  const writes: SaveLibraryRequest[] = [];
  let reads = 0;
  const service = createWorkflowSyncService({
    storage: { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => { memory.set(key, value); } },
    client: {
      read: async () => { reads++; return options.read ? options.read() : { payload: JSON.stringify(remote), revision: 2 }; },
      save: async (_code, body) => { writes.push(body); return options.save ? options.save(body) : { revision: body.revision + 1 }; },
    },
    encode: JSON.stringify, decode: JSON.parse, createCode: () => 'a'.repeat(64), schedule: () => 0, cancel: () => {},
  });
  // Existing full-library validation/size failures must not prevent this narrow
  // remote operation, and must not trigger a full-library upload after it.
  if (!options.pendingSync) service.pause('Existing full-library save failed.');
  const dispose = service.initialize(() => library, (value) => { library = value; });
  return { service, writes, reads: () => reads, local: () => library, meta: () => JSON.parse(memory.get(SYNC_META_KEY)!), dispose,
    edit(value: WorkflowLibrary) { library = value; service.queueSave(); } };
}

test('removal changes only selected remote IDs, preserves unrelated local work, and keeps it dirty', async () => {
  const remove = draft('remove'), localOnly = draft('local-only'), remoteOnly = saveVersion(draft('remote-history'));
  const h = harness({ [remove.id]: remove, [localOnly.id]: localOnly }, { [remove.id]: remove, [remoteOnly.id]: remoteOnly });
  const result = await h.service.deleteUnusedDrafts([remove.id]);
  assert.deepEqual(result, { removedIds: [remove.id], dirty: true });
  assert.deepEqual(h.local(), { [localOnly.id]: localOnly });
  assert.deepEqual(JSON.parse(h.writes[0].payload), { [remoteOnly.id]: remoteOnly });
  assert.equal(h.writes[0].revision, 2);
  assert.deepEqual(h.meta(), { revision: 3, dirty: true });
  assert.equal(h.writes.length, 1);
  assert.match(h.service.getStatus(), /Other local changes still need saving/);
});

test('local-only targets may be removed and equivalent remaining copies are clean', async () => {
  const remove = draft('local-unused'), kept = saveVersion(draft('keep'));
  const h = harness({ [remove.id]: remove, [kept.id]: kept }, { [kept.id]: structuredClone(kept) });
  assert.deepEqual(await h.service.deleteUnusedDrafts([remove.id]), { removedIds: [remove.id], dirty: false });
  assert.deepEqual(h.local(), { [kept.id]: kept });
  assert.equal(h.meta().revision, 3);
  assert.equal(h.writes.length, 1);
});

test('remote saved history protects a selected draft and missing intent cannot start I/O', async () => {
  const remove = draft('remove');
  const h = harness({ [remove.id]: remove }, { [remove.id]: saveVersion(remove) });
  await assert.rejects(h.service.deleteUnusedDrafts([]), /exact workflow IDs/);
  assert.equal(h.reads(), 0);
  await assert.rejects(h.service.deleteUnusedDrafts([remove.id]), /saved history/);
  assert.equal(h.writes.length, 0);
  assert.deepEqual(h.local(), { [remove.id]: remove });
  assert.deepEqual(h.meta(), { revision: 2, dirty: true });
});

test('offline and revision-conflict failures preserve local contents and unsaved state', async () => {
  for (const error of [new Error('Offline'), new WorkflowStorageError('Revision conflict', 409)]) {
    const remove = draft('remove');
    const h = harness({ [remove.id]: remove }, { [remove.id]: remove }, { save: async () => { throw error; } });
    await assert.rejects(h.service.deleteUnusedDrafts([remove.id]), error);
    assert.deepEqual(h.local(), { [remove.id]: remove });
    assert.deepEqual(h.meta(), { revision: 2, dirty: true });
  }
});

test('in-flight full sync settles before cleanup reads its compare-and-swap revision', async () => {
  const remove = draft('remove');
  const pending = deferred<SaveLibraryResponse>();
  let revision = 2;
  const h = harness({ [remove.id]: remove }, { [remove.id]: remove }, {
    pendingSync: true,
    read: async () => ({ payload: JSON.stringify({ [remove.id]: remove }), revision }),
    save: async (body) => body.revision === 2 ? pending.promise : { revision: body.revision + 1 },
  });
  await flush();
  const removal = h.service.deleteUnusedDrafts([remove.id]);
  await flush();
  assert.equal(h.reads(), 1);
  assert.equal(h.writes.length, 1);
  revision = 3;
  pending.resolve({ revision });
  await removal;
  assert.deepEqual(h.writes.map((body) => body.revision), [2, 3]);
  assert.deepEqual(h.local(), {});
  assert.deepEqual(h.meta(), { revision: 4, dirty: false });
});

test('concurrent removal/open and changed targets cannot replace current local work', async () => {
  const remove = draft('remove');
  const reading = deferred<ReadLibraryResponse>();
  const h = harness({ [remove.id]: remove }, {}, { read: () => reading.promise });
  const removal = h.service.deleteUnusedDrafts([remove.id]);
  await flush();
  await assert.rejects(h.service.deleteUnusedDrafts([remove.id]), /already in progress/);
  await assert.rejects(h.service.open('b'.repeat(64)), /Wait for/);
  const changed = { ...remove, draft: { ...remove.draft, name: 'Edited while waiting' } };
  h.edit({ [remove.id]: changed });
  reading.resolve({ payload: JSON.stringify({ [remove.id]: remove }), revision: 2 });
  await assert.rejects(removal, /selected draft changed/);
  assert.equal(h.writes.length, 0);
  assert.equal(h.local()[remove.id], changed);
});

test('unrelated edits made during removal are retained and marked dirty', async () => {
  const remove = draft('remove'), keep = draft('keep');
  const saving = deferred<SaveLibraryResponse>();
  const h = harness({ [remove.id]: remove, [keep.id]: keep }, { [remove.id]: remove, [keep.id]: keep }, { save: () => saving.promise });
  const removal = h.service.deleteUnusedDrafts([remove.id]);
  await flush();
  const changed = { ...keep, draft: { ...keep.draft, name: 'New unsaved title' } };
  h.edit({ [remove.id]: remove, [keep.id]: changed });
  saving.resolve({ revision: 3 });
  assert.equal((await removal).dirty, true);
  assert.equal(h.local()[keep.id], changed);
  assert.deepEqual(h.meta(), { revision: 3, dirty: true });
});

test('a selected draft changed during PUT is kept locally and automatic overwrite is blocked', async () => {
  const remove = draft('remove');
  const saving = deferred<SaveLibraryResponse>();
  const h = harness({ [remove.id]: remove }, { [remove.id]: remove }, { save: () => saving.promise });
  const removal = h.service.deleteUnusedDrafts([remove.id]);
  await flush();
  const changed = saveVersion(remove);
  h.edit({ [remove.id]: changed });
  saving.resolve({ revision: 3 });
  await assert.rejects(removal, /selected draft changed/);
  assert.equal(h.local()[remove.id], changed);
  assert.equal(h.meta().dirty, true);
  assert.match(h.service.getStatus(), /Server draft removal completed/);
  await h.service.sync();
  assert.equal(h.writes.length, 1);
});

test('unmount supersedes a pending cleanup and no response can mutate the local library', async () => {
  const remove = draft('remove');
  const reading = deferred<ReadLibraryResponse>();
  const h = harness({ [remove.id]: remove }, {}, { read: () => reading.promise });
  const removal = h.service.deleteUnusedDrafts([remove.id]);
  await flush();
  h.dispose();
  reading.resolve({ payload: '{}', revision: 2 });
  await assert.rejects(removal, /workspace changed/);
  assert.deepEqual(h.local(), { [remove.id]: remove });
  assert.equal(h.writes.length, 0);
});
