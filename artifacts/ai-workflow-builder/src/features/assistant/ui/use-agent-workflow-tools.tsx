import { useState } from 'react';
import { useCopilotAction } from '@copilotkit/react-core';
import { useStore } from 'jotai';
import type { Store } from 'jotai/vanilla/store';
import type { CreateAgentGrant } from '@workspace/agent-runtime/capabilities';
import {
  applyWorkflowDraftProposal,
  createWorkflowDraftProposal,
  saveWorkflowVersionForAgent,
  workflowActionRequest,
  workflowDefinitionRevision,
  type AgentWorkflowAuthorization,
  type AgentWorkflowActionRequest,
  type WorkflowDraftProposal,
} from '@workspace/workflow-core/agent-commands';
import { Button } from '@/shared/ui/button';
import { workflowLibraryAtom } from '@/features/workflows-hub/workflow-library';
import { WORKFLOW_CONFIGS } from '@/shared/workflow-engine/runtime/workflow-runs';
import {
  authorizeAgentAction,
  createAgentGrant,
  recordAgentActionOutcome,
} from '../runtime/agent-action-client';

const AGENT_ID = 'sina';

type ProposalResult =
  | { status: 'review-required'; workflowName: string; proposal: WorkflowDraftProposal }
  | { status: 'applied'; message: string }
  | { status: 'error'; error: string };

type SaveResult =
  | {
      status: 'review-required';
      workflowName: string;
      request: AgentWorkflowActionRequest;
    }
  | { status: 'saved'; message: string }
  | { status: 'error'; error: string };

function proposalRequest(proposal: WorkflowDraftProposal) {
  return {
    operationId: proposal.operationId,
    agentId: proposal.agentId,
    capability: 'workflow:apply-draft' as const,
    resourceType: 'workflow' as const,
    resourceId: proposal.workflowId,
    resourceRevision: proposal.baseRevision,
    requestFingerprint: proposal.requestFingerprint,
  };
}

function grantForProposal(
  proposal: WorkflowDraftProposal,
  kind: CreateAgentGrant['kind'],
): CreateAgentGrant {
  const request = proposalRequest(proposal);
  return kind === 'one-time'
    ? { ...request, kind }
    : {
        agentId: request.agentId,
        capability: request.capability,
        resourceType: request.resourceType,
        resourceId: request.resourceId,
        kind,
      };
}

async function applyAuthorizedProposal(
  store: Store,
  proposal: WorkflowDraftProposal,
  authorization?: AgentWorkflowAuthorization,
): Promise<string> {
  let receipt = authorization;
  if (!receipt) {
    const decision = await authorizeAgentAction(proposalRequest(proposal));
    if (!decision.allowed || !decision.authorization)
      throw new Error(decision.message ?? 'This workflow change was not authorized.');
    receipt = decision.authorization as AgentWorkflowAuthorization;
  }
  const current = store.get(workflowLibraryAtom)[proposal.workflowId];
  if (!current) throw new Error('The workflow is no longer available in this workspace.');
  try {
    const updated = applyWorkflowDraftProposal(current, proposal, receipt);
    store.set(workflowLibraryAtom, (library) => ({ ...library, [updated.id]: updated }));
    await recordAgentActionOutcome(proposal.operationId, 'succeeded', 'Draft proposal applied.');
    return 'Draft updated. Historical versions and runs were preserved.';
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The proposal could not be applied.';
    await recordAgentActionOutcome(
      proposal.operationId,
      /changed|conflict/i.test(message) ? 'conflict' : 'failed',
      message,
    );
    throw error;
  }
}

async function approveProposal(
  store: Store,
  proposal: WorkflowDraftProposal,
  kind: CreateAgentGrant['kind'],
): Promise<string> {
  await createAgentGrant(grantForProposal(proposal, kind));
  return applyAuthorizedProposal(store, proposal);
}

function WorkflowProposalReview({ result }: { result: ProposalResult }) {
  const store = useStore();
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  if (result.status === 'error') return <p role="alert">{result.error}</p>;
  if (result.status === 'applied') return <p role="status">{result.message}</p>;
  const run = async (kind: CreateAgentGrant['kind']) => {
    setPending(true);
    setMessage('');
    try {
      setMessage(await approveProposal(store, result.proposal, kind));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The workflow change failed.');
    } finally {
      setPending(false);
    }
  };
  return (
    <section aria-label="Workflow change proposal" className="space-y-3 rounded border p-3">
      <div>
        <strong>{result.workflowName}</strong>
        <p>{result.proposal.reason}</p>
        <p className="text-xs text-muted-foreground">
          Base revision {result.proposal.baseRevision} · {result.proposal.changedPaths.length}{' '}
          changed field{result.proposal.changedPaths.length === 1 ? '' : 's'}
        </p>
      </div>
      <ul className="max-h-32 overflow-auto text-xs">
        {result.proposal.changedPaths.map((path) => (
          <li key={path}>{path}</li>
        ))}
      </ul>
      {!message && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" disabled={pending} onClick={() => void run('one-time')}>
            Approve this change
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => void run('reusable')}
          >
            Allow draft changes for 24 hours
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={pending}
            onClick={() => setMessage('Proposal rejected.')}
          >
            Reject
          </Button>
        </div>
      )}
      {message && (
        <p role={/failed|could not|changed|conflict/i.test(message) ? 'alert' : 'status'}>
          {message}
        </p>
      )}
    </section>
  );
}

function grantForSave(
  request: AgentWorkflowActionRequest,
  kind: CreateAgentGrant['kind'],
): CreateAgentGrant {
  return kind === 'one-time'
    ? { ...request, kind }
    : {
        agentId: request.agentId,
        capability: request.capability,
        resourceType: request.resourceType,
        resourceId: request.resourceId,
        kind,
      };
}

async function saveAuthorizedVersion(
  store: Store,
  request: AgentWorkflowActionRequest,
  authorization?: AgentWorkflowAuthorization,
): Promise<string> {
  let receipt = authorization;
  if (!receipt) {
    const decision = await authorizeAgentAction(request);
    if (!decision.allowed || !decision.authorization)
      throw new Error(decision.message ?? 'Saving this workflow version was not authorized.');
    receipt = decision.authorization as AgentWorkflowAuthorization;
  }
  const current = store.get(workflowLibraryAtom)[request.resourceId];
  if (!current) throw new Error('The workflow is no longer available in this workspace.');
  try {
    const updated = saveWorkflowVersionForAgent(current, request, receipt);
    store.set(workflowLibraryAtom, (library) => ({ ...library, [updated.id]: updated }));
    const version = updated.versions.at(-1)?.number;
    const message =
      updated === current
        ? `Workflow version ${String(version)} already represents this draft.`
        : `Saved immutable workflow version ${String(version)}.`;
    await recordAgentActionOutcome(request.operationId, 'succeeded', message);
    return message;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The workflow version was not saved.';
    await recordAgentActionOutcome(
      request.operationId,
      /changed|conflict/i.test(message) ? 'conflict' : 'failed',
      message,
    );
    throw error;
  }
}

function WorkflowSaveReview({ result }: { result: SaveResult }) {
  const store = useStore();
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  if (result.status === 'error') return <p role="alert">{result.error}</p>;
  if (result.status === 'saved') return <p role="status">{result.message}</p>;
  const run = async (kind: CreateAgentGrant['kind']) => {
    setPending(true);
    setMessage('');
    try {
      await createAgentGrant(grantForSave(result.request, kind));
      setMessage(await saveAuthorizedVersion(store, result.request));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The workflow version was not saved.');
    } finally {
      setPending(false);
    }
  };
  return (
    <section aria-label="Workflow version approval" className="space-y-3 rounded border p-3">
      <div>
        <strong>{result.workflowName}</strong>
        <p>Save the current draft as an immutable workflow version?</p>
        <p className="text-xs text-muted-foreground">
          Saving does not execute the workflow or approve its result.
        </p>
      </div>
      {!message && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" disabled={pending} onClick={() => void run('one-time')}>
            Approve this save
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => void run('reusable')}
          >
            Allow saves for 24 hours
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={pending}
            onClick={() => setMessage('Save rejected.')}
          >
            Reject
          </Button>
        </div>
      )}
      {message && <p role={/not|failed|rejected/i.test(message) ? 'alert' : 'status'}>{message}</p>}
    </section>
  );
}

function parseResult(value: unknown): ProposalResult {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as ProposalResult;
    } catch {
      return { status: 'error', error: value };
    }
  }
  return value && typeof value === 'object'
    ? (value as ProposalResult)
    : { status: 'error', error: 'No workflow proposal was returned.' };
}

/** Chat adapters for exact workflow reads and proposal-first editing. */
export function useAgentWorkflowTools() {
  const store = useStore();
  useCopilotAction({
    name: 'listAvailableWorkflows',
    description:
      'List executable built-in workflow templates, including their exact runWorkflow IDs and required source columns. These are available even when the workspace has no saved workflow drafts. Listing does not start a run or supply sample data. Saved drafts and versions are separate; use listSavedWorkflows for those.',
    parameters: [],
    handler: async () =>
      Object.values(WORKFLOW_CONFIGS).map((config) => ({
        workflowId: config.id,
        name: config.name,
        kind: 'built-in-template',
        source: config.documentLabel,
        requiredColumns: config.requiredColumns,
      })),
  });
  useCopilotAction({
    name: 'listSavedWorkflows',
    description:
      'List only workspace-saved workflow drafts before reading or proposing a change. An empty list does NOT mean no workflows are available: built-in templates such as FAPI are separate. Use listAvailableWorkflows for the executable template catalog. Never guess a saved ID from a name.',
    parameters: [],
    handler: async () =>
      Object.values(store.get(workflowLibraryAtom)).map((entry) => ({
        id: entry.id,
        name: entry.draft.name,
        description: entry.draft.description,
        draftRevision: workflowDefinitionRevision(entry.draft),
        latestVersion: entry.versions.at(-1)?.number ?? null,
        blocks: entry.draft.blocks.length,
      })),
  });
  useCopilotAction({
    name: 'readSavedWorkflow',
    description:
      'Read one exact workflow draft by ID. Call listSavedWorkflows first when the user supplied only a name.',
    parameters: [
      {
        name: 'workflowId',
        type: 'string',
        description: 'exact saved workflow ID',
        required: true,
      },
    ],
    handler: async ({ workflowId }: { workflowId: string }) => {
      const entry = store.get(workflowLibraryAtom)[workflowId];
      return entry
        ? {
            workflowId,
            draft: entry.draft,
            versions: entry.versions.map(({ number, savedAt }) => ({ number, savedAt })),
          }
        : { error: `Workflow '${workflowId}' was not found. Do not substitute another workflow.` };
    },
  });
  useCopilotAction({
    name: 'proposeSavedWorkflowDraft',
    description:
      'Propose a complete updated draft for an exact saved workflow. This creates a review card and does not apply the change.',
    parameters: [
      {
        name: 'workflowId',
        type: 'string',
        description: 'exact saved workflow ID',
        required: true,
      },
      { name: 'reason', type: 'string', description: 'why the change is needed', required: true },
      {
        name: 'draftJson',
        type: 'string',
        description: 'complete updated workflow draft as JSON',
        required: true,
      },
    ],
    handler: async ({
      workflowId,
      reason,
      draftJson,
    }: {
      workflowId: string;
      reason: string;
      draftJson: string;
    }): Promise<ProposalResult> => {
      const entry = store.get(workflowLibraryAtom)[workflowId];
      if (!entry) return { status: 'error', error: `Workflow '${workflowId}' was not found.` };
      try {
        const proposal = createWorkflowDraftProposal(entry, {
          operationId: crypto.randomUUID(),
          agentId: AGENT_ID,
          reason,
          draft: JSON.parse(draftJson) as typeof entry.draft,
        });
        const decision = await authorizeAgentAction(proposalRequest(proposal));
        if (decision.allowed && decision.authorization)
          return {
            status: 'applied',
            message: await applyAuthorizedProposal(
              store,
              proposal,
              decision.authorization as AgentWorkflowAuthorization,
            ),
          };
        return { status: 'review-required', workflowName: entry.draft.name, proposal };
      } catch (error) {
        return {
          status: 'error',
          error: error instanceof Error ? error.message : 'The workflow proposal is invalid.',
        };
      }
    },
    render: ({ result, status }) =>
      status === 'complete' ? (
        <WorkflowProposalReview result={parseResult(result)} />
      ) : (
        <p role="status">Preparing workflow proposal…</p>
      ),
  });
  useCopilotAction({
    name: 'saveSavedWorkflowVersion',
    description:
      'Request an immutable saved version of one exact workflow draft. Saving is separately authorized and never executes the workflow.',
    parameters: [
      {
        name: 'workflowId',
        type: 'string',
        description: 'exact saved workflow ID',
        required: true,
      },
    ],
    handler: async ({ workflowId }: { workflowId: string }): Promise<SaveResult> => {
      const entry = store.get(workflowLibraryAtom)[workflowId];
      if (!entry) return { status: 'error', error: `Workflow '${workflowId}' was not found.` };
      const revision = workflowDefinitionRevision(entry.draft);
      const request = workflowActionRequest(entry, {
        operationId: crypto.randomUUID(),
        agentId: AGENT_ID,
        capability: 'workflow:save-version',
        resourceRevision: revision,
        requestFingerprint: `save:${revision}`,
      });
      const decision = await authorizeAgentAction(request);
      if (decision.allowed && decision.authorization)
        return {
          status: 'saved',
          message: await saveAuthorizedVersion(
            store,
            request,
            decision.authorization as AgentWorkflowAuthorization,
          ),
        };
      return { status: 'review-required', workflowName: entry.draft.name, request };
    },
    render: ({ result, status }) =>
      status === 'complete' ? (
        <WorkflowSaveReview result={parseSaveResult(result)} />
      ) : (
        <p role="status">Preparing workflow version…</p>
      ),
  });
}

function parseSaveResult(value: unknown): SaveResult {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as SaveResult;
    } catch {
      return { status: 'error', error: value };
    }
  }
  return value && typeof value === 'object'
    ? (value as SaveResult)
    : { status: 'error', error: 'No workflow save request was returned.' };
}
