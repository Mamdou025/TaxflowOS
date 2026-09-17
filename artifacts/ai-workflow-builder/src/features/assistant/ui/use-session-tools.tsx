import { getWorkflowConfig } from '@/shared/workflow-engine/runtime/workflow-runs';
import { useState } from 'react';
import { atom, useAtomValue, useStore } from 'jotai';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import type { AgentActionRequest } from '@workspace/agent-runtime/capabilities';
import { getSession, sessionContext, type SessionAction } from '@workspace/workflow-core/sessions';
import { workflowLibraryAtom } from '@/features/workflows-hub/workflow-library';
import {
  activeSessionAtom,
  advanceSession,
  applySessionAction,
  type SessionRef,
} from '@/features/workflows-hub/workflow-session-store';
import { WorkflowSessionPanel } from '@/features/workflows-hub/workflow-session-panel';
import {
  authorizeAgentAction,
  createAgentGrant,
  fingerprintAgentPayload,
  recordAgentActionOutcome,
} from '../runtime/agent-action-client';
import { uploadedRowsAtom } from '@/shared/stores/workspace-store';

type Proposal = {
  ref: SessionRef;
  revision: number;
  action: SessionAction;
  request: AgentActionRequest;
};
const proposalsAtom = atom<Record<string, Proposal>>({});
function preview(value: unknown, depth = 0): unknown {
  if (depth > 5) return '[Nested details available in the block panel]';
  if (Array.isArray(value))
    return {
      count: value.length,
      items: value.slice(0, 12).map((item) => preview(item, depth + 1)),
      truncated: value.length > 12,
    };
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, preview(item, depth + 1)]),
    );
  return typeof value === 'string' && value.length > 1000
    ? value.slice(0, 1000) + ' [truncated]'
    : value;
}
function SessionActionReview({ operationId }: { operationId: string }) {
  const store = useStore();
  const proposal = useAtomValue(proposalsAtom)[operationId];
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  if (!proposal) return <p>This action preview expired. Ask again against the current run.</p>;
  return (
    <div className="space-y-3">
      {!done && (
        <div className="rounded border p-3">
          <p>
            Review workflow action: {proposal.action.kind}
            {'blockId' in proposal.action ? ` — ${proposal.action.blockId}` : ''}. Previous results
            are retained; affected downstream results will need review.
          </p>
          <button
            disabled={pending}
            className="rounded border px-3 py-2"
            onClick={async () => {
              setPending(true);
              setError('');
              try {
                await createAgentGrant({ ...proposal.request, kind: 'one-time' });
                const decision = await authorizeAgentAction(proposal.request);
                if (!decision.allowed || !decision.authorization)
                  throw new Error(decision.message ?? 'This action is not authorized.');
                applySessionAction(store, proposal.ref, proposal.revision, proposal.action);
                if (proposal.action.kind === 'resume') await advanceSession(store, proposal.ref);
                await recordAgentActionOutcome(
                  proposal.request.operationId,
                  'succeeded',
                  'Workflow action applied. Inspect the shared execution state for results.',
                );
                setDone(true);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'The action failed.');
              } finally {
                setPending(false);
              }
            }}
          >
            Approve workflow action
          </button>
        </div>
      )}
      {error && <p role="alert">{error}</p>}
      <WorkflowSessionPanel
        workflowId={proposal.ref.workflowId}
        runId={proposal.ref.runId}
        focusBlockId={'blockId' in proposal.action ? proposal.action.blockId : undefined}
      />
    </div>
  );
}
export function useSessionTools() {
  const store = useStore();
  const library = useAtomValue(workflowLibraryAtom);
  const active = useAtomValue(activeSessionAtom);
  const entry = active ? library[active.workflowId] : undefined;
  const session = entry?.sessions?.find((item) => item.id === active?.runId);
  useCopilotAction({
    name: 'runWorkflow',
    description:
      'Open the shared visual workflow execution in Chat, including steps and source selection even if no file is attached. Use an exact built-in catalog ID or saved workflow ID. Opening is not execution or result approval. The user starts/resumes in the panel. Use controlWorkflowRun for an existing active run.',
    followUp: false,
    parameters: [
      { name: 'workflowId', type: 'string', required: true },
      {
        name: 'version',
        type: 'number',
        required: false,
        description: 'Exact saved version when requested; never substitute another version.',
      },
    ],
    handler: ({ workflowId, version }: { workflowId: string; version?: number }) => {
      if (
        !getWorkflowConfig(workflowId.replace(/^pf-/, '')) &&
        !store.get(workflowLibraryAtom)[workflowId]
      )
        return { error: 'Choose an available workflow.' };
      return { workflowId, version };
    },
    render: ({ result, status }) => {
      if (status !== 'complete') return <p>Opening workflow…</p>;
      return result && typeof result === 'object' && 'workflowId' in result ? (
        <WorkflowSessionPanel
          workflowId={String(result.workflowId)}
          version={
            'version' in result && typeof result.version === 'number' ? result.version : undefined
          }
        />
      ) : (
        <p role="alert">Workflow unavailable.</p>
      );
    },
  });
  useCopilotReadable({
    description:
      'Exact active workflow run. Build, Run and Chat share this version and these block IDs. Pending and outdated steps have no current result. Use inspectWorkflowBlock for details and controlWorkflowRun for actions. Never infer completed steps from conversation text or approve results on the user’s behalf.',
    value: entry && session ? sessionContext(entry, session) : null,
  });
  useCopilotAction({
    name: 'inspectWorkflowBlock',
    description:
      'Read a block’s current input, result, findings and stale status in the active run. This does not execute anything.',
    parameters: [{ name: 'blockId', type: 'string', required: true }],
    handler: ({ blockId }: { blockId: string }) => {
      const ref = store.get(activeSessionAtom);
      if (!ref) return { error: 'Open a workflow first.' };
      const current = store.get(workflowLibraryAtom)[ref.workflowId];
      if (!current) return { error: 'This workflow is no longer in the current workspace.' };
      const run = getSession(current, ref.runId);
      const step = sessionContext(current, run).steps.find((item) => item.id === blockId);
      if (!step) return { error: 'That block is not in this run.' };
      return { ...step, ...ref, blockId, preview: preview(run.results[blockId] ?? null) };
    },
    render: ({ result, status }) =>
      status === 'complete' &&
      result &&
      typeof result === 'object' &&
      'workflowId' in result &&
      'runId' in result &&
      'blockId' in result ? (
        <WorkflowSessionPanel
          workflowId={String(result.workflowId)}
          runId={String(result.runId)}
          focusBlockId={String(result.blockId)}
        />
      ) : (
        <p>{status === 'complete' ? 'The requested block is unavailable.' : 'Reading block…'}</p>
      ),
  });
  useCopilotAction({
    name: 'controlWorkflowRun',
    description:
      'Control the exact active workflow: pause, resume, rerun one existing block, or add/replace the attached source in an existing document source block. Block runs use real current dependencies, preserve old results and invalidate downstream results. Never use this to change mapping rules; edit Build and start a new version for rule changes. Source rows come from the actual attachment, never model-generated JSON. Approval is presented before executing or changing sources. Final result approval remains a user action in the panel.',
    followUp: false,
    parameters: [
      {
        name: 'action',
        type: 'string',
        enum: ['pause', 'resume', 'block', 'add_source', 'replace_source'],
        required: true,
      },
      { name: 'blockId', type: 'string', required: false },
    ],
    handler: async ({ action, blockId }: { action: string; blockId?: string }) => {
      const ref = store.get(activeSessionAtom);
      if (!ref) return { error: 'Open a workflow first.' };
      const current = store.get(workflowLibraryAtom)[ref.workflowId];
      if (!current) return { error: 'This workflow is no longer in the current workspace.' };
      const run = getSession(current, ref.runId);
      let command: SessionAction;
      if (action === 'pause' || action === 'resume') command = { kind: action };
      else if (action === 'block' && blockId) command = { kind: 'block', blockId };
      else if ((action === 'add_source' || action === 'replace_source') && blockId) {
        const source = store.get(uploadedRowsAtom).__unassigned__;
        if (!source?.rows.length) return { error: 'Attach a source first.' };
        command = {
          kind: 'source',
          blockId,
          sourceId: crypto.randomUUID(),
          name: source.fileName,
          rows: structuredClone(source.rows),
          mode: action === 'add_source' ? 'add' : 'replace',
        };
      } else return { error: 'Choose a valid action and an exact block ID from the run context.' };
      if (command.kind === 'pause') {
        applySessionAction(store, ref, run.revision, command);
        return { paused: true, ...ref };
      }
      const request: AgentActionRequest = {
        operationId: crypto.randomUUID(),
        agentId: 'sina',
        capability: 'workflow:execute',
        resourceType: 'workflow',
        resourceId: ref.workflowId,
        resourceRevision: `session:${ref.runId}:${run.revision}`,
        requestFingerprint: await fingerprintAgentPayload({ ref, revision: run.revision, command }),
      };
      const decision = await authorizeAgentAction(request);
      if (decision.allowed && decision.authorization) {
        applySessionAction(store, ref, run.revision, command);
        if (command.kind === 'resume') await advanceSession(store, ref);
        await recordAgentActionOutcome(
          request.operationId,
          'succeeded',
          'Workflow action applied.',
        );
        return {
          applied: true,
          ...ref,
          blockId: 'blockId' in command ? command.blockId : undefined,
        };
      }
      store.set(proposalsAtom, (previous) => ({
        ...previous,
        [request.operationId]: { ref, revision: run.revision, action: command, request },
      }));
      return {
        operationId: request.operationId,
        ...ref,
        action: command.kind,
        blockId: 'blockId' in command ? command.blockId : undefined,
        source:
          command.kind === 'source'
            ? { name: command.name, records: command.rows.length }
            : undefined,
      };
    },
    render: ({ result, status }) => {
      if (status !== 'complete') return <p>Preparing workflow action…</p>;
      if (result && typeof result === 'object' && 'operationId' in result)
        return <SessionActionReview operationId={String(result.operationId)} />;
      if (
        result &&
        typeof result === 'object' &&
        'applied' in result &&
        'workflowId' in result &&
        'runId' in result
      )
        return (
          <WorkflowSessionPanel
            workflowId={String(result.workflowId)}
            runId={String(result.runId)}
            focusBlockId={
              'blockId' in result && result.blockId ? String(result.blockId) : undefined
            }
          />
        );
      return (
        <p>
          {result && typeof result === 'object' && 'error' in result
            ? String(result.error)
            : 'Workflow paused. You can continue asking questions.'}
        </p>
      );
    },
  });
}
