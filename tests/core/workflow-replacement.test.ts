import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  createWorkflow,
  definitionFingerprint,
  replaceWorkflowFromBackup,
  saveVersion,
} from '../../lib/workflow-core/src/application/commands';
import { startSession } from '../../lib/workflow-core/src/application/sessions';
import { workflowBackup } from '../../lib/workflow-contracts/src/library';

function fixture() {
  const entry = JSON.parse(readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8'))[
    'custom:synthetic-recovery'
  ];
  // The legacy restore fixture deliberately includes a dangling draft edge.
  entry.draft.edges = [];
  return entry;
}

test('replacement preserves identity, old versions, unsaved work and guided-run history', () => {
  const base = fixture();
  let entry = saveVersion(createWorkflow('custom:existing', 'original-template', base.draft));
  entry = startSession(entry, 1, 'historical-session', '2026-10-01T00:00:00Z');
  entry.draft.name = 'Unsaved user changes';
  const before = structuredClone(entry);
  const imported = saveVersion(
    createWorkflow('custom:import', 'replacement-template', {
      ...base.draft,
      name: 'Adapted worksheet',
    }),
  );
  const next = replaceWorkflowFromBackup(
    entry,
    workflowBackup({ [imported.id]: imported }),
    definitionFingerprint(entry.draft),
    '2026-10-05T00:00:00Z',
  );
  assert.equal(next.id, entry.id);
  assert.equal(next.templateId, entry.templateId);
  assert.equal(next.draft.name, 'Adapted worksheet');
  assert.equal(next.draft.id, entry.id);
  assert.deepEqual(
    next.versions.map((version) => version.number),
    [1, 2, 3],
  );
  assert.equal(next.versions[1].definition.name, 'Unsaved user changes');
  assert.deepEqual(next.versions[0], before.versions[0]);
  assert.deepEqual(next.sessions, before.sessions);
  assert.deepEqual(next.runs, before.runs);
  assert.deepEqual(entry, before);
});

test('replacement rejects ambiguous backups and a changed target before any mutation', () => {
  const base = fixture();
  const entry = saveVersion(createWorkflow('custom:existing', 'original-template', base.draft));
  const fingerprint = definitionFingerprint(entry.draft);
  const second = createWorkflow('custom:second', 'blank', base.draft);
  assert.throws(
    () =>
      replaceWorkflowFromBackup(
        entry,
        workflowBackup({ [entry.id]: entry, [second.id]: second }),
        fingerprint,
      ),
    /exactly one/,
  );
  assert.throws(
    () => replaceWorkflowFromBackup(entry, workflowBackup({}), fingerprint),
    /exactly one/,
  );
  entry.draft.name = 'Changed while selecting file';
  assert.throws(
    () => replaceWorkflowFromBackup(entry, workflowBackup({ [second.id]: second }), fingerprint),
    /draft changed/,
  );
  assert.equal(entry.versions.length, 1);
});
