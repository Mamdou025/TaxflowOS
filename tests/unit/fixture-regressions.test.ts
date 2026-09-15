import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateWorkflowLibrary, workflowBackup } from '../../lib/workflow-contracts/src/library';
import { executeWorkflowCommand } from '../../artifacts/ai-workflow-builder/src/features/assistant/runtime/workflow-command';
import {
  parseSharedJSON,
  stringifySharedJSON,
} from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/shared-json';

const fixtureText = fs.readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8');
const id = 'custom:synthetic-recovery';

test('the frozen legacy backup migrates aliases in drafts and history without mutating its input', () => {
  const input = JSON.parse(fixtureText);
  const restored = validateWorkflowLibrary(input)[id];
  assert.equal(restored.draft.edges[0].relationshipType, 'initiates');
  assert.equal(restored.versions[0].definition.edges[0].relationshipType, 'initiates');
  assert.equal(restored.draft.name, 'Synthetic archived draft');
  assert.equal(restored.versions[0].definition.name, 'Synthetic archived version');
  assert.equal(restored.versions[0].savedAt, '2024-01-02T03:04:05.000Z');
  assert.equal(JSON.stringify(input), JSON.stringify(JSON.parse(fixtureText)));
  assert.deepEqual(validateWorkflowLibrary({ [id]: restored })[id], restored);
});

test('legacy import survives compressed v1 export and repeated restore', () => {
  const restored = validateWorkflowLibrary(JSON.parse(fixtureText));
  const bytes = stringifySharedJSON(workflowBackup(restored));
  assert.deepEqual(validateWorkflowLibrary(parseSharedJSON(bytes)), restored);
  assert.throws(
    () => validateWorkflowLibrary({ format: 'taxflow-workflow-backup-v999', library: restored }),
    /Unsupported/,
  );
});

test('a synthetic calculation retains explicit zero and credit adjustments', () => {
  const fixture = JSON.parse(
    fs.readFileSync('tests/fixtures/calculations/document-rows.json', 'utf8'),
  );
  const result = executeWorkflowCommand({
    workflowId: 'document-calculator',
    recordsJson: JSON.stringify(fixture.records),
  });
  assert.equal(result.sample, false);
  assert.ok(result.core);
  assert.deepEqual(result.core.errors, []);
  assert.deepEqual(
    result.core.detail.mapped.map(({ label, amount }) => ({ label, amount })),
    fixture.records,
  );
  assert.deepEqual(result.core.detail.unmatched, []);
  assert.equal(result.core.summaryValues.RESULT, fixture.expectedResult);
});
