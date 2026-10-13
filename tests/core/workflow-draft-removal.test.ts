import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  createWorkflow,
  deleteUnusedWorkflowDrafts,
  saveVersion,
} from '../../lib/workflow-core/src/application/commands';
import { validateWorkflowLibrary } from '../../lib/workflow-contracts/src/library';

function fixture() {
  const historical = Object.values(
    validateWorkflowLibrary(
      JSON.parse(readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8')),
    ),
  )[0];
  const draft = createWorkflow('custom:unused', 'blank', historical.draft);
  return { draft, historical, library: { [draft.id]: draft, [historical.id]: historical } };
}

test('unused draft deletion removes only explicit identities without mutating retained history', () => {
  const { draft, historical, library } = fixture();
  const before = structuredClone(library);
  const next = deleteUnusedWorkflowDrafts(library, [draft.id]);
  assert.deepEqual(next, { [historical.id]: historical });
  assert.equal(next[historical.id], historical);
  assert.deepEqual(library, before);
  assert.deepEqual(validateWorkflowLibrary(JSON.parse(JSON.stringify(next))), next);
});

test('unused draft deletion rejects absent or ambiguous intent atomically', () => {
  const { draft, library } = fixture();
  const before = structuredClone(library);
  for (const ids of [[], [''], [draft.id, draft.id], [draft.id, 'custom:missing']])
    assert.throws(() => deleteUnusedWorkflowDrafts(library, ids));
  assert.deepEqual(library, before);
});

test('any saved version, session or run protects a workflow from unused-draft deletion', () => {
  const { draft, historical } = fixture();
  // Separate each history owner; a draft remains protected even if a malformed
  // caller has omitted the version normally referenced by its session or run.
  const saved = saveVersion(draft);
  const session = {
    id: 'session',
    version: 1,
    revision: 0,
    createdAt: '2026-01-01',
    paused: true,
    results: {},
    stale: [],
    reviewed: [],
    sources: [],
    attempts: [],
  };
  for (const protectedDraft of [
    saved,
    { ...draft, sessions: [session] },
    { ...draft, runs: historical.runs },
  ]) {
    assert.ok(
      protectedDraft.versions.length ||
        protectedDraft.sessions?.length ||
        protectedDraft.runs.length,
    );
    assert.throws(
      () => deleteUnusedWorkflowDrafts({ [draft.id]: protectedDraft }, [draft.id]),
      /saved history/,
    );
  }
});
