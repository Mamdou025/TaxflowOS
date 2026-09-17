import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateWorkflowLibrary } from '../../lib/workflow-contracts/src/library';
import { workflowSessionRequest } from '../../artifacts/ai-workflow-builder/src/features/assistant/runtime/workflow-session-request';

const hasTemplate = (id: string) => ['fapi', 'pf-fapi'].includes(id);

test('Chat opens a built-in step preview without needing a saved version or starting a run', () => {
  const library = {};
  assert.deepEqual(workflowSessionRequest(library, hasTemplate, 'fapi'), { workflowId: 'fapi' });
  assert.deepEqual(workflowSessionRequest(library, hasTemplate, 'pf-fapi', null), {
    workflowId: 'pf-fapi',
  });
  assert.deepEqual(library, {});
});

test('a guessed built-in version is rejected with actionable guidance, never silently substituted', () => {
  const result = workflowSessionRequest({}, hasTemplate, 'pf-fapi', 1);
  assert.ok('error' in result);
  assert.match(result.error, /without a version/);
  assert.equal('workflowId' in result, false);
});

test('Chat preserves an exact saved version and rejects unavailable IDs and versions', () => {
  const library = validateWorkflowLibrary(
    JSON.parse(readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8')),
  );
  const entry = library['custom:synthetic-recovery'];
  const before = structuredClone(library);
  const version = entry.versions[0].number;
  assert.deepEqual(workflowSessionRequest(library, hasTemplate, entry.id, version), {
    workflowId: entry.id,
    version,
  });
  assert.ok('error' in workflowSessionRequest(library, hasTemplate, entry.id, 999));
  assert.ok('error' in workflowSessionRequest(library, hasTemplate, 'unknown'));
  assert.deepEqual(library, before);
});
