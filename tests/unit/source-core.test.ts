import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  selectSourcePassages,
  SourceLifecycleError,
  transitionSource,
  type SourceCandidate,
} from '../../lib/source-core/src/index';

function candidate(sourceId: string, options: Partial<SourceCandidate> = {}): SourceCandidate {
  return {
    identity: {
      sourceId,
      workspaceId: 'workspace-a',
      kind: 'document',
      label: `${sourceId}.pdf`,
      revision: 2,
      contentHash: 'sha256:synthetic',
      clientId: null,
    },
    lifecycleStatus: 'active',
    inLibrary: true,
    content: `Passage from ${sourceId}`,
    chunkIndex: 3,
    similarity: 0.8,
    ...options,
  };
}

test('selected sources rank first and selected-only excludes unselected library sources', () => {
  const candidates = [candidate('relevant', { similarity: 0.99 }), candidate('selected')];
  const broad = selectSourcePassages({
    candidates,
    workspaceId: 'workspace-a',
    selectedSourceIds: ['selected'],
    policy: 'selected-and-authorized',
    limit: 4,
    retrievedAt: '2026-09-13T00:00:00.000Z',
  });
  assert.deepEqual(
    broad.passages.map((passage) => passage.evidence.source.sourceId),
    ['selected', 'relevant'],
  );
  assert.equal(broad.passages[0].evidence.selection, 'selected');
  assert.equal(broad.passages[0].evidence.citationId, 'source:selected:r2:chunk:3');

  const narrow = selectSourcePassages({
    candidates,
    workspaceId: 'workspace-a',
    selectedSourceIds: ['selected'],
    policy: 'selected-only',
    limit: 4,
    retrievedAt: '2026-09-13T00:00:00.000Z',
  });
  assert.deepEqual(
    narrow.passages.map((passage) => passage.evidence.source.sourceId),
    ['selected'],
  );
});

test('retrieval excludes cross-workspace, cross-client, archived and deleted candidates', () => {
  const scoped = (sourceId: string, options: Partial<SourceCandidate> = {}) =>
    candidate(sourceId, {
      identity: { ...candidate(sourceId).identity, clientId: 'client-a' },
      ...options,
    });
  const hidden = [
    scoped('other-workspace', {
      identity: {
        ...candidate('x').identity,
        sourceId: 'other-workspace',
        workspaceId: 'workspace-b',
        clientId: 'client-a',
      },
    }),
    scoped('other-client', {
      identity: { ...candidate('x').identity, sourceId: 'other-client', clientId: 'client-b' },
    }),
    scoped('archived', { lifecycleStatus: 'archived' }),
    scoped('deleted', { lifecycleStatus: 'deleted' }),
  ];
  const result = selectSourcePassages({
    candidates: [scoped('visible'), ...hidden],
    workspaceId: 'workspace-a',
    clientId: 'client-a',
    selectedSourceIds: hidden.map((item) => item.identity.sourceId),
    policy: 'selected-and-authorized',
    limit: 10,
    retrievedAt: '2026-09-13T00:00:00.000Z',
  });
  assert.deepEqual(
    result.passages.map((passage) => passage.evidence.source.sourceId),
    ['visible'],
  );
  assert.deepEqual(
    result.unavailableSelectedSourceIds.sort(),
    hidden.map((item) => item.identity.sourceId).sort(),
  );
});

test('Editors can archive and soft-delete; only Owners can restore or purge', () => {
  assert.equal(transitionSource('editor', 'active', 'archive'), 'archived');
  assert.equal(transitionSource('editor', 'archived', 'delete'), 'deleted');
  assert.equal(transitionSource('owner', 'deleted', 'restore'), 'active');
  assert.equal(transitionSource('owner', 'deleted', 'purge'), 'purged');
  assert.throws(
    () => transitionSource('editor', 'deleted', 'restore'),
    (error) => error instanceof SourceLifecycleError && error.code === 'FORBIDDEN',
  );
  assert.throws(
    () => transitionSource('owner', 'active', 'purge'),
    (error) => error instanceof SourceLifecycleError && error.code === 'INVALID_TRANSITION',
  );
});
