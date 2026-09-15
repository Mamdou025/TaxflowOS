import { useState } from 'react';
import { useStore } from 'jotai';
import type { Store } from 'jotai/vanilla/store';
import type { AgentActionRequest, CreateAgentGrant } from '@workspace/agent-runtime/capabilities';
import { Button } from '@/shared/ui/button';
import { executeAndSaveWorkflowCommand } from '../runtime/workflow-command-store';
import {
  authorizeAgentAction,
  createAgentGrant,
  fingerprintAgentPayload,
  recordAgentActionOutcome,
} from '../runtime/agent-action-client';
import { WorkflowCommandResult } from './workflow-command-result';
import { uploadedRowsAtom } from '@/shared/stores/workspace-store';
import { prepareWorkflowRunInput, type AgentTemplateRunArgs } from '../runtime/workflow-run-input';

export type { AgentTemplateRunArgs } from '../runtime/workflow-run-input';

export type AgentRunReviewResult = {
  status: 'approval-required';
  workflowName: string;
  request: AgentActionRequest;
  args: AgentTemplateRunArgs;
  reason: string;
  sourceName?: string;
};

function grantForRun(
  request: AgentActionRequest,
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

function outcomeOf(result: unknown): { status: 'succeeded' | 'failed'; message: string } {
  if (!result || typeof result !== 'object')
    return { status: 'failed', message: 'The workflow returned no verifiable result.' };
  const status = 'status' in result ? result.status : undefined;
  if (status === 'error' || status === 'needs_input')
    return { status: 'failed', message: `Workflow ${String(status).replace('_', ' ')}.` };
  return { status: 'succeeded', message: 'Workflow execution recorded.' };
}

async function executeAuthorizedRun(
  store: Store,
  args: AgentTemplateRunArgs,
  request: AgentActionRequest,
): Promise<unknown> {
  const decision = await authorizeAgentAction(request);
  if (!decision.allowed || !decision.authorization)
    throw new Error(decision.message ?? 'This workflow run was not authorized.');
  const result = executeAndSaveWorkflowCommand(store, args);
  const outcome = outcomeOf(result);
  await recordAgentActionOutcome(request.operationId, outcome.status, outcome.message);
  return result;
}

export async function requestAgentWorkflowRun(
  store: Store,
  args: AgentTemplateRunArgs,
  workflowName: string,
): Promise<unknown> {
  const normalizedId = args.workflowId.replace(/^pf-/, '');
  const sources = store.get(uploadedRowsAtom);
  let prepared: ReturnType<typeof prepareWorkflowRunInput>;
  try {
    prepared = prepareWorkflowRunInput(args, sources.__unassigned__ ?? sources[normalizedId]);
  } catch (error) {
    return {
      name: workflowName,
      status: 'needs_input',
      errors: [error instanceof Error ? error.message : 'Choose a source.'],
    };
  }
  args = prepared.args;
  const request: AgentActionRequest = {
    operationId: crypto.randomUUID(),
    agentId: 'sina',
    capability: 'workflow:execute',
    resourceType: 'workflow',
    resourceId: normalizedId,
    resourceRevision: `template:${normalizedId}`,
    requestFingerprint: await fingerprintAgentPayload(args),
  };
  const decision = await authorizeAgentAction(request);
  if (decision.allowed && decision.authorization) {
    const result = executeAndSaveWorkflowCommand(store, args);
    const outcome = outcomeOf(result);
    await recordAgentActionOutcome(request.operationId, outcome.status, outcome.message);
    return result;
  }
  return {
    status: 'approval-required',
    workflowName,
    request,
    args,
    sourceName: prepared.source?.fileName,
    reason: decision.message ?? 'Review this agent-initiated workflow run.',
  } satisfies AgentRunReviewResult;
}

export function isAgentRunReviewResult(value: unknown): value is AgentRunReviewResult {
  return (
    value !== null &&
    typeof value === 'object' &&
    'status' in value &&
    value.status === 'approval-required' &&
    'request' in value &&
    'args' in value
  );
}

export function AgentRunReview({ review }: { review: AgentRunReviewResult }) {
  const store = useStore();
  const [result, setResult] = useState<unknown>();
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  const approve = async (kind: CreateAgentGrant['kind']) => {
    setPending(true);
    setMessage('');
    try {
      await createAgentGrant(grantForRun(review.request, kind));
      setResult(await executeAuthorizedRun(store, review.args, review.request));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The workflow run failed.');
    } finally {
      setPending(false);
    }
  };
  if (result) return <WorkflowCommandResult result={result} />;
  return (
    <section aria-label="Workflow run approval" className="space-y-3 rounded border p-3">
      <div>
        <strong>{review.workflowName}</strong>
        {review.sourceName && <p>Source: {review.sourceName}</p>}
        <p>{review.reason}</p>
        <p className="text-xs text-muted-foreground">
          Execution permission is separate from editing and result approval.
        </p>
      </div>
      {!message && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" disabled={pending} onClick={() => void approve('one-time')}>
            Approve this run
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => void approve('reusable')}
          >
            Allow runs for 24 hours
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={pending}
            onClick={() => setMessage('Run rejected.')}
          >
            Reject
          </Button>
        </div>
      )}
      {message && <p role="alert">{message}</p>}
    </section>
  );
}
