import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  applyWorkflowDraftProposal,
  createWorkflowDraftProposal,
  executeWorkflowVersionForAgent,
  saveWorkflowVersionForAgent,
  workflowActionRequest,
  type AgentWorkflowAuthorization,
} from '../../lib/workflow-core/src/application/agent-commands';
import { validateWorkflowLibrary } from '../../lib/workflow-contracts/src/library';
import type { LocalToolRunnerResult } from '../../lib/workflow-contracts/src/execution-result';

function entry() {
  const backup: unknown = JSON.parse(readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8'));
  return validateWorkflowLibrary(backup)['custom:synthetic-recovery'];
}

function authorization(
  request: ReturnType<typeof workflowActionRequest>,
): AgentWorkflowAuthorization {
  return { ...request, allowed: true, grantId: 'grant-one' };
}

test('agent proposals identify changes, preserve history and invalidate affected approval state', () => {
  const initial = entry();
  initial.draft.blocks.push({
    id: 'calculation-one',
    family: 'Logic',
    subtype: 'Calculation Engine',
    label: 'Calculation',
    description: '',
    status: 'configured',
    position: { x: 0, y: 0 },
    config: { threshold: 10 },
    governance: {
      protected: true,
      steward: 'owner',
      lockedInRuntime: false,
      requiresUnlockToEdit: false,
      approvalState: 'approved',
    },
    runtime: {
      visible: true,
      editableInRuntime: true,
      generatedUiLocked: false,
      masked: false,
      showInRuns: true,
    },
    createdBy: 'fixture',
    createdAt: '2026-09-14T00:00:00.000Z',
    updatedBy: 'fixture',
    updatedAt: '2026-09-14T00:00:00.000Z',
  });
  const proposed = structuredClone(initial.draft);
  proposed.blocks[0].config = { ...proposed.blocks[0].config, threshold: 25 };
  const proposal = createWorkflowDraftProposal(initial, {
    operationId: 'proposal-one',
    agentId: 'sina',
    reason: 'Use the reviewed threshold.',
    draft: proposed,
  });
  assert.ok(proposal.changedPaths.some((path) => path.includes('/config/threshold')));
  assert.ok(proposal.changedPaths.some((path) => path.includes('/governance/approvalState')));
  assert.equal(proposal.draft.blocks[0].governance?.approvalState, 'review-required');
  const request = workflowActionRequest(initial, {
    operationId: proposal.operationId,
    agentId: proposal.agentId,
    capability: 'workflow:apply-draft',
    resourceRevision: proposal.baseRevision,
    requestFingerprint: proposal.requestFingerprint,
  });
  const applied = applyWorkflowDraftProposal(initial, proposal, authorization(request));
  assert.equal(applied.draft.blocks[0].config.threshold, 25);
  assert.deepEqual(applied.versions, initial.versions);
  assert.deepEqual(applied.runs, initial.runs);
});

test('mismatched authorization and stale proposals cannot mutate a workflow', () => {
  const initial = entry();
  const draft = { ...initial.draft, name: 'Agent proposal' };
  const proposal = createWorkflowDraftProposal(initial, {
    operationId: 'proposal-two',
    agentId: 'sina',
    reason: 'Clarify the workflow name.',
    draft,
  });
  const request = workflowActionRequest(initial, {
    operationId: proposal.operationId,
    agentId: proposal.agentId,
    capability: 'workflow:apply-draft',
    resourceRevision: proposal.baseRevision,
    requestFingerprint: proposal.requestFingerprint,
  });
  assert.throws(
    () =>
      applyWorkflowDraftProposal(initial, proposal, {
        ...authorization(request),
        resourceId: 'other-workflow',
      }),
    /does not match/,
  );
  const concurrentlyEdited = { ...initial, draft: { ...initial.draft, description: 'New edit' } };
  assert.throws(
    () => applyWorkflowDraftProposal(concurrentlyEdited, proposal, authorization(request)),
    /draft changed/,
  );
});

test('saving and executing are separately authorized and execution targets an immutable version', () => {
  const initial = entry();
  const saveRequest = workflowActionRequest(initial, {
    operationId: 'save-one',
    agentId: 'sina',
    capability: 'workflow:save-version',
    requestFingerprint: 'save-request',
  });
  const saved = saveWorkflowVersionForAgent(
    initial,
    saveRequest,
    authorization(saveRequest),
    '2026-09-14T12:00:00.000Z',
  );
  assert.equal(saved.versions.length, initial.versions.length + 1);

  const executeRequest = workflowActionRequest(saved, {
    operationId: 'execute-one',
    agentId: 'sina',
    capability: 'workflow:execute',
    resourceRevision: String(saved.versions.at(-1)?.number),
    requestFingerprint: 'input-fingerprint',
  });
  let calls = 0;
  const execute = (definition: typeof saved.draft): LocalToolRunnerResult => {
    calls++;
    const runId = 'agent-run-one';
    return {
      blockStatuses: {},
      edgeStatuses: {},
      record: {
        execution: {
          id: runId,
          workflowId: definition.id,
          status: 'success',
          startedAt: new Date('2026-09-14T12:00:00.000Z'),
          completedAt: new Date('2026-09-14T12:00:01.000Z'),
          duration: '1000',
          error: null,
        },
        logs: [],
      },
      result: {
        runId,
        workflowId: definition.id,
        workflowName: definition.name,
        status: 'success',
        startedAt: '2026-09-14T12:00:00.000Z',
        completedAt: '2026-09-14T12:00:01.000Z',
        results: [],
        logs: [],
        warnings: [],
        errors: [],
      },
    };
  };
  assert.throws(
    () =>
      executeWorkflowVersionForAgent(
        saved,
        { version: saved.versions.at(-1)!.number, requestId: 'run-request' },
        execute,
        executeRequest,
        authorization({ ...executeRequest, capability: 'workflow:save-version' }),
      ),
    /does not match/,
  );
  assert.equal(calls, 0);
  const executed = executeWorkflowVersionForAgent(
    saved,
    { version: saved.versions.at(-1)!.number, requestId: 'run-request' },
    execute,
    executeRequest,
    authorization(executeRequest),
  );
  assert.equal(calls, 1);
  assert.equal(executed.entry.versions.length, saved.versions.length);
  assert.equal(executed.entry.runs.at(-1)?.version, saved.versions.at(-1)?.number);
});
