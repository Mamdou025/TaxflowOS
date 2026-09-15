import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SourceMetadataSchema,
  WorkflowRelationshipTypeSchema,
} from '../../lib/workflow-contracts/src/generated-schemas';
import { BLOCK_CATALOG } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/block-catalog-data';
import { validateWorkflowLibrary, workflowBackup } from '../../lib/workflow-contracts/src/library';
import { createWorkflowStorageClient } from '../../lib/workflow-contracts/src/storage-protocol';
import { createBlankWorkflow } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/templates/portfolio';
import {
  saveVersion,
  executeSavedWorkflow,
  recordWorkflowExecution,
} from '../../artifacts/ai-workflow-builder/src/features/workflows-hub/services/workflow-commands';
import type { PersonalWorkflow } from '../../lib/workflow-contracts/src/library-types';
import { WORKFLOW_CONFIGS } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs';
import { executeWorkflowCommand } from '../../artifacts/ai-workflow-builder/src/features/assistant/runtime/workflow-command';
import {
  createWorkflowLibraryRepository,
  WORKFLOW_LIBRARY_KEY,
} from '../../artifacts/ai-workflow-builder/src/features/workflows-hub/services/workflow-library-repository';
import { composeToolRegistry } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/tools/compose-registry';
import { LOCAL_TOOL_REGISTRY } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/tools/registry';
import { localTools } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/tools/tool-list';
import { BACKEND_ADAPTED_TOOL_IDS } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/tools/backend-adapter';
import {
  WorkflowRunErrorSchema,
  WorkflowRunIdSchema,
  WorkflowRunListQuerySchema,
  workflowRunActionPath,
} from '../../lib/api-zod/src/workflow-runs';
import {
  stringifySharedJSON,
  parseSharedJSON,
} from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/shared-json';

function entry(): PersonalWorkflow {
  return saveVersion({
    id: 'custom:test',
    templateId: 'blank',
    draft: { ...createBlankWorkflow(), id: 'custom:test' },
    versions: [],
    runs: [],
  });
}

test('legacy trigger relationships migrate and every catalog source has valid metadata', () => {
  assert.equal(WorkflowRelationshipTypeSchema.parse('triggers'), 'initiates');
  assert.equal(WorkflowRelationshipTypeSchema.parse('data_flow'), 'provides_data_to');
  assert.equal(WorkflowRelationshipTypeSchema.safeParse('made-up').success, false);
  for (const item of BLOCK_CATALOG.filter((item) => item.family === 'Source')) {
    assert.equal(
      SourceMetadataSchema.safeParse({
        sourceType: item.subtype,
        locator: 'test',
        immutable: true,
        treatedAsEvidence: true,
        labelLocked: true,
        locatorLocked: true,
        valuesLocked: true,
      }).success,
      true,
      item.id,
    );
  }
});

test('legacy bare libraries and v1 backup envelopes preserve saved definitions', () => {
  const library = { 'custom:test': entry() };
  assert.deepEqual(validateWorkflowLibrary(library), library);
  assert.deepEqual(validateWorkflowLibrary(workflowBackup(library)), library);
  assert.deepEqual(
    validateWorkflowLibrary(parseSharedJSON(stringifySharedJSON(library))),
    JSON.parse(JSON.stringify(library)),
  );
  assert.throws(() => validateWorkflowLibrary({ format: 'taxflow-workflow-backup-v999', library }));
});

test('restore rejects malformed nested workflow data and duplicate version numbers', () => {
  const original = entry();
  const bad = { ...original, draft: { ...original.draft, blocks: [{ id: 'x' }] } };
  assert.throws(() => validateWorkflowLibrary({ 'custom:test': bad }), /Invalid workflow backup/);
  assert.throws(
    () =>
      validateWorkflowLibrary({
        'custom:test': { ...original, versions: [...original.versions, original.versions[0]] },
      }),
    /duplicate version/,
  );
  assert.throws(
    () => validateWorkflowLibrary({ 'custom:other': original }),
    /inconsistent workflow IDs/,
  );
});

test('version saving is immutable and reuses an unchanged version', () => {
  const original = entry();
  assert.equal(saveVersion(original), original);
  const edited = { ...original, draft: { ...original.draft, name: 'Changed' } };
  const saved = saveVersion(edited);
  assert.equal(saved.versions.length, 2);
  edited.draft.name = 'Later';
  assert.equal(saved.versions[1].definition.name, 'Changed');
  assert.equal(original.versions.length, 1);
});

test('explicit missing versions fail before invoking the executor', () => {
  let calls = 0;
  assert.throws(
    () =>
      executeSavedWorkflow(entry(), { saveDraft: false, version: 999 }, () => {
        calls++;
        throw new Error('Executor should not run');
      }),
    /requested workflow version/,
  );
  assert.equal(calls, 0);
});

test('storage client rejects invalid server revisions', async () => {
  const client = createWorkflowStorageClient(
    async () => new Response(JSON.stringify({ payload: null, revision: '2' })),
  );
  await assert.rejects(client.read('a'.repeat(64)));
});

test('all executable templates roundtrip their actual graph results through validated storage', () => {
  assert.equal(Object.keys(WORKFLOW_CONFIGS).length, 17);
  for (const config of Object.values(WORKFLOW_CONFIGS)) {
    const command = executeWorkflowCommand({ workflowId: config.id, useSample: true });
    assert.ok(command.core, config.id);
    assert.notEqual(
      command.core.status,
      'error',
      `${config.id}: ${command.core.errors.join(', ')}`,
    );
    const id = `custom:${config.id}`;
    const saved = recordWorkflowExecution(
      saveVersion({
        id,
        templateId: config.id,
        draft: { ...command.core.definition, id },
        versions: [],
        runs: [],
      }),
      1,
      command.core.execution,
    );
    const restored = validateWorkflowLibrary(parseSharedJSON(stringifySharedJSON({ [id]: saved })))[
      id
    ];
    assert.deepEqual(
      restored.runs[0].result.result,
      JSON.parse(JSON.stringify(command.core.execution.result)),
    );
    assert.ok(restored.runs[0].result.record.execution.startedAt instanceof Date);
    assert.equal(
      restored.runs[0].result.result.workflowId,
      command.core.execution.result.workflowId,
    );
  }
});

test('unreadable local data remains byte-for-byte available for recovery', () => {
  const bytes = '{bad json';
  const memory = new Map([[WORKFLOW_LIBRARY_KEY, bytes]]);
  const repository = createWorkflowLibraryRepository({
    storage: {
      getItem: (key) => memory.get(key) ?? null,
      setItem: (key, value) => {
        memory.set(key, value);
      },
    },
    encode: JSON.stringify,
    decode: JSON.parse,
  });
  assert.throws(repository.read);
  assert.equal(repository.rawBackup(), bytes);
});

test('tool composition rejects silent overrides and invalid aliases', () => {
  const tool = LOCAL_TOOL_REGISTRY['logic.formula'];
  assert.throws(() => composeToolRegistry([tool, tool]), /Duplicate/);
  assert.throws(() => composeToolRegistry([tool], { alternate: 'missing' }), /missing tool/);
  assert.equal(
    LOCAL_TOOL_REGISTRY['logic.keyword_classifier'],
    LOCAL_TOOL_REGISTRY['logic.keyword_mapper'],
  );
});

test('modular executor ownership cannot overlap with legacy local tools', () => {
  const localIds = new Set(localTools.map((tool) => tool.toolId));
  assert.deepEqual(
    BACKEND_ADAPTED_TOOL_IDS.filter((toolId) => localIds.has(toolId)),
    [],
  );
  for (const toolId of BACKEND_ADAPTED_TOOL_IDS) assert.ok(LOCAL_TOOL_REGISTRY[toolId]);
});

test('durable workflow requests share strict identifiers, filters, errors and paths', () => {
  const runId = '00000000-0000-4000-8000-000000000001';
  assert.equal(workflowRunActionPath(runId, 'retry'), `/api/workflow-runs/${runId}/retry`);
  assert.equal(WorkflowRunIdSchema.safeParse('../not-safe').success, false);
  assert.equal(
    WorkflowRunListQuerySchema.safeParse({ workflowId: ['custom:one', 'custom:two'] }).success,
    false,
  );
  assert.equal(
    WorkflowRunErrorSchema.safeParse({ error: 'Failed.', unexpected: true }).success,
    false,
  );
});
