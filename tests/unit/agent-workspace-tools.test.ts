import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  AgentWorkspaceToolError,
  createAgentWorkspaceTools,
  type AgentWorkspaceContext,
  type AgentWorkspacePorts,
} from '../../lib/agent-runtime/src/workspace-tools';

const context: AgentWorkspaceContext = {
  actorId: 'actor-one',
  workspaceId: 'workspace-one',
  agentId: 'sina',
};

function runtime() {
  const calls: {
    method: keyof AgentWorkspacePorts;
    context: AgentWorkspaceContext;
    input?: unknown;
  }[] = [];
  const record = (
    method: keyof AgentWorkspacePorts,
    received: AgentWorkspaceContext,
    input?: unknown,
  ) => {
    calls.push({ method, context: received, input });
  };
  const ports: AgentWorkspacePorts = {
    listWorkflows: async (received) => {
      record('listWorkflows', received);
      return { ok: true };
    },
    readWorkflow: async (received, input) => {
      record('readWorkflow', received, input);
      return { ok: true };
    },
    retrieveSources: async (received, input) => {
      record('retrieveSources', received, input);
      return { status: 'empty', passages: [], limitations: [] };
    },
    proposeWorkflowDraft: async (received, input) => {
      record('proposeWorkflowDraft', received, input);
      return { ok: true };
    },
    applyWorkflowProposal: async (received, input) => {
      record('applyWorkflowProposal', received, input);
      return { ok: true };
    },
    saveWorkflowVersion: async (received, input) => {
      record('saveWorkflowVersion', received, input);
      return { ok: true };
    },
    executeWorkflowVersion: async (received, input) => {
      record('executeWorkflowVersion', received, input);
      return { ok: true };
    },
  };
  return { calls, tools: createAgentWorkspaceTools(ports) };
}

test('workspace tools validate model arguments and pass trusted context through ports', async () => {
  const { calls, tools } = runtime();
  await tools.run(
    'retrieveSources',
    { query: 'filing deadline', selectedSourceIds: ['source-one'], policy: 'selected-only' },
    context,
  );
  assert.deepEqual(calls, [
    {
      method: 'retrieveSources',
      context,
      input: {
        query: 'filing deadline',
        selectedSourceIds: ['source-one'],
        policy: 'selected-only',
        limit: 6,
      },
    },
  ]);
});

test('invalid or unknown tool requests never reach a workspace port', async () => {
  const { calls, tools } = runtime();
  for (const [tool, input, code] of [
    ['executeWorkflowVersion', { workflowId: 'one', version: 0 }, 'INVALID_ARGUMENTS'],
    ['retrieveSources', { query: '', policy: 'invented' }, 'INVALID_ARGUMENTS'],
    ['inventedTool', {}, 'UNKNOWN_TOOL'],
  ] as const) {
    await assert.rejects(
      tools.run(tool, input, context),
      (error) => error instanceof AgentWorkspaceToolError && error.code === code,
    );
  }
  assert.equal(calls.length, 0);
});

test('mutating tool definitions expose distinct capabilities for policy evaluation', () => {
  const { tools } = runtime();
  assert.equal(tools.definitions.proposeWorkflowDraft.capability, 'workflow:propose');
  assert.equal(tools.definitions.applyWorkflowProposal.capability, 'workflow:apply-draft');
  assert.equal(tools.definitions.saveWorkflowVersion.capability, 'workflow:save-version');
  assert.equal(tools.definitions.executeWorkflowVersion.capability, 'workflow:execute');
});
