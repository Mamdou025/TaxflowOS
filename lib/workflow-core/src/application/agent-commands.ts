import { z } from 'zod';
import { LocalWorkflowSnapshotSchema } from '@workspace/workflow-contracts/generated-schemas';
import type { PersonalWorkflow } from '@workspace/workflow-contracts/library-types';
import type { WorkflowDefinition } from '@workspace/workflow-contracts/domain/workflow-types';
import type { DefinitionExecutor } from '../core/ports';
import {
  WorkflowCommandError,
  definitionFingerprint,
  executeSavedWorkflow,
  replaceDraft,
  saveVersion,
} from './commands';

export type AgentWorkflowCapability =
  'workflow:apply-draft' | 'workflow:save-version' | 'workflow:execute';

export type AgentWorkflowActionRequest = {
  operationId: string;
  agentId: string;
  capability: AgentWorkflowCapability;
  resourceType: 'workflow';
  resourceId: string;
  resourceRevision: string;
  requestFingerprint: string;
};

export type AgentWorkflowAuthorization = AgentWorkflowActionRequest & {
  allowed: true;
  grantId: string;
};

export type WorkflowDraftProposal = {
  operationId: string;
  agentId: string;
  workflowId: string;
  reason: string;
  baseRevision: string;
  baseFingerprint: string;
  requestFingerprint: string;
  changedPaths: string[];
  draft: WorkflowDefinition;
};

function compactFingerprint(value: string): string {
  let first = 0x811c9dc5;
  let second = 0x9e3779b9;
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    first = Math.imul(first ^ code, 0x01000193);
    second = Math.imul(second ^ code, 0x85ebca6b);
  }
  return `wf-${value.length}-${(first >>> 0).toString(16).padStart(8, '0')}${(second >>> 0).toString(16).padStart(8, '0')}`;
}

export function workflowDefinitionRevision(definition: WorkflowDefinition): string {
  return compactFingerprint(definitionFingerprint(definition));
}

const ProposalInputSchema = z
  .object({
    operationId: z.string().trim().min(1).max(200),
    agentId: z.string().trim().min(1).max(200),
    reason: z.string().trim().min(1).max(2000),
    draft: LocalWorkflowSnapshotSchema,
  })
  .strict();

function reviewFingerprint(definition: WorkflowDefinition, blockId: string): string | null {
  const block = definition.blocks.find((candidate) => candidate.id === blockId);
  if (!block) return null;
  return JSON.stringify({
    config: block.config,
    code: block.code,
    formula: block.formula,
    source: block.source,
  });
}

/** Rule or source changes invalidate an earlier block approval. */
function invalidateChangedReviewState(
  previous: WorkflowDefinition,
  proposed: WorkflowDefinition,
): WorkflowDefinition {
  const draft = structuredClone(proposed);
  for (const block of draft.blocks) {
    if (
      block.governance?.approvalState === 'approved' &&
      reviewFingerprint(previous, block.id) !== reviewFingerprint(draft, block.id)
    ) {
      block.governance.approvalState = 'review-required';
    }
  }
  return draft;
}

function escapePointer(segment: string): string {
  return segment.replaceAll('~', '~0').replaceAll('/', '~1');
}

function collectChangedPaths(
  previous: unknown,
  next: unknown,
  path = '',
  result: string[] = [],
): string[] {
  if (Object.is(previous, next)) return result;
  if (
    previous === null ||
    next === null ||
    typeof previous !== 'object' ||
    typeof next !== 'object' ||
    Array.isArray(previous) !== Array.isArray(next)
  ) {
    result.push(path || '/');
    return result;
  }
  const left = previous as Record<string, unknown>;
  const right = next as Record<string, unknown>;
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  for (const key of [...keys].sort()) {
    if (result.length >= 200) break;
    const child = `${path}/${escapePointer(key)}`;
    if (!(key in left) || !(key in right)) result.push(child);
    else collectChangedPaths(left[key], right[key], child, result);
  }
  return result;
}

export function createWorkflowDraftProposal(
  entry: PersonalWorkflow,
  input: {
    operationId: string;
    agentId: string;
    reason: string;
    draft: WorkflowDefinition;
  },
): WorkflowDraftProposal {
  const parsed = ProposalInputSchema.parse(input);
  if (parsed.draft.id !== entry.id)
    throw new WorkflowCommandError(
      'INVALID_REQUEST',
      'A proposal cannot change the workflow identity.',
    );
  const draft = LocalWorkflowSnapshotSchema.parse(
    invalidateChangedReviewState(entry.draft, parsed.draft),
  );
  const paths = collectChangedPaths(entry.draft, draft);
  if (!paths.length)
    throw new WorkflowCommandError('INVALID_REQUEST', 'The proposal does not change the draft.');
  return {
    operationId: parsed.operationId,
    agentId: parsed.agentId,
    workflowId: entry.id,
    reason: parsed.reason,
    baseRevision: workflowDefinitionRevision(entry.draft),
    baseFingerprint: definitionFingerprint(entry.draft),
    requestFingerprint: workflowDefinitionRevision(draft),
    changedPaths: paths,
    draft: structuredClone(draft),
  };
}

export function workflowActionRequest(
  entry: PersonalWorkflow,
  input: {
    operationId: string;
    agentId: string;
    capability: AgentWorkflowCapability;
    resourceRevision?: string;
    requestFingerprint: string;
  },
): AgentWorkflowActionRequest {
  return {
    operationId: input.operationId,
    agentId: input.agentId,
    capability: input.capability,
    resourceType: 'workflow',
    resourceId: entry.id,
    resourceRevision: input.resourceRevision ?? workflowDefinitionRevision(entry.draft),
    requestFingerprint: input.requestFingerprint,
  };
}

function requireAuthorization(
  expected: AgentWorkflowActionRequest,
  authorization: AgentWorkflowAuthorization,
): void {
  const mismatch = (Object.keys(expected) as (keyof AgentWorkflowActionRequest)[]).find(
    (key) => authorization[key] !== expected[key],
  );
  if (mismatch || !authorization.grantId)
    throw new WorkflowCommandError(
      'INVALID_REQUEST',
      'The action authorization does not match the requested workflow operation.',
    );
}

export function applyWorkflowDraftProposal(
  entry: PersonalWorkflow,
  proposal: WorkflowDraftProposal,
  authorization: AgentWorkflowAuthorization,
): PersonalWorkflow {
  const expected = workflowActionRequest(entry, {
    operationId: proposal.operationId,
    agentId: proposal.agentId,
    capability: 'workflow:apply-draft',
    resourceRevision: proposal.baseRevision,
    requestFingerprint: proposal.requestFingerprint,
  });
  requireAuthorization(expected, authorization);
  return replaceDraft(entry, proposal.draft, proposal.baseFingerprint);
}

export function saveWorkflowVersionForAgent(
  entry: PersonalWorkflow,
  request: AgentWorkflowActionRequest,
  authorization: AgentWorkflowAuthorization,
  now?: string,
): PersonalWorkflow {
  const expected = workflowActionRequest(entry, {
    ...request,
    capability: 'workflow:save-version',
    resourceRevision: workflowDefinitionRevision(entry.draft),
  });
  requireAuthorization(expected, authorization);
  return saveVersion(entry, now);
}

/** Agent runs target an existing immutable version. Saving the draft is a separate grant. */
export function executeWorkflowVersionForAgent(
  entry: PersonalWorkflow,
  input: { version: number; requestId: string },
  execute: DefinitionExecutor,
  request: AgentWorkflowActionRequest,
  authorization: AgentWorkflowAuthorization,
  context: Parameters<typeof executeSavedWorkflow>[3] = {},
) {
  const expected = workflowActionRequest(entry, {
    ...request,
    capability: 'workflow:execute',
    resourceRevision: String(input.version),
  });
  requireAuthorization(expected, authorization);
  return executeSavedWorkflow(
    entry,
    { saveDraft: false, version: input.version, requestId: input.requestId },
    execute,
    context,
  );
}
