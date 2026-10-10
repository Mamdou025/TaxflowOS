import { z } from 'zod';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { WorkflowLibrary } from '@workspace/workflow-contracts/library-types';
import type { WorkflowDefinition } from '@workspace/workflow-contracts/domain/workflow-types';
import { getSavedVersion, WorkflowCommandError } from '@workspace/workflow-core/commands';
import { inspectWorkflowRun } from '@workspace/workflow-core/inspection';
import { listWorkflowRuns } from '@workspace/workflow-core/queries';
import { projectCredentialFields } from './credential-projection';
import {
  boundedEvidence,
  projectDefinition,
  projectInspection,
  sourcePage,
} from './view-projection';
import type { SessionHistory } from './session-types';

export const MAX_TOOL_RESPONSE_BYTES = 1024 * 1024;
export const WORKFLOW_VIEW_URI = 'ui://inscope/workflow-viewer-v3.html';
const identifier = z.string().trim().min(1).max(200);
export const readToolSchemas = {
  list_workflows: z.object({}).strict(),
  get_workflow_version: z
    .object({
      workflowId: identifier,
      version: z.number().int().positive(),
      blockId: identifier.optional(),
    })
    .strict(),
  list_workflow_runs: z.object({ workflowId: identifier.optional() }).strict(),
  read_workflow_source: z
    .object({
      workflowId: identifier,
      runId: identifier,
      sourceId: identifier,
      offset: z.number().int().nonnegative().default(0),
      limit: z.number().int().min(1).max(50).default(20),
    })
    .strict(),
  inspect_workflow_run: z
    .object({ workflowId: identifier, runId: identifier, blockId: identifier.optional() })
    .strict(),
  open_workflow_view: z
    .object({
      workflowId: identifier,
      version: z.number().int().positive().optional(),
      runId: identifier.optional(),
      blockId: identifier.optional(),
    })
    .strict(),
};
const readRequestSchema = z.discriminatedUnion('name', [
  z.object({ name: z.literal('list_workflows'), input: readToolSchemas.list_workflows }),
  z.object({
    name: z.literal('get_workflow_version'),
    input: readToolSchemas.get_workflow_version,
  }),
  z.object({ name: z.literal('list_workflow_runs'), input: readToolSchemas.list_workflow_runs }),
  z.object({
    name: z.literal('read_workflow_source'),
    input: readToolSchemas.read_workflow_source,
  }),
  z.object({
    name: z.literal('inspect_workflow_run'),
    input: readToolSchemas.inspect_workflow_run,
  }),
  z.object({ name: z.literal('open_workflow_view'), input: readToolSchemas.open_workflow_view }),
]);
export type ReadToolName = keyof typeof readToolSchemas;
export type AuthorizedWorkspaceSnapshot = {
  workspace: { id: string; name: string };
  libraryRevision: number;
  library: WorkflowLibrary;
  capabilities?: { write: boolean; execute: boolean };
};
export type ReadToolDependencies = {
  readWorkspace: () => Promise<AuthorizedWorkspaceSnapshot>;
  now?: () => Date;
  readHistory?: (workflowId: string, runId: string) => Promise<SessionHistory[]>;
};

export function failure(code: string, message: string): CallToolResult {
  return {
    isError: true,
    content: [{ type: 'text', text: message }],
    structuredContent: { error: { code, message } },
  };
}

export function boundedResult(
  summary: Record<string, unknown>,
  snapshot?: Record<string, unknown>,
): CallToolResult {
  const safeSummary = projectCredentialFields(summary);
  const safeSnapshot = snapshot ? projectCredentialFields(snapshot) : undefined;
  const credentialFieldsOmitted = safeSummary.fieldsOmitted || !!safeSnapshot?.fieldsOmitted;
  const visible = { ...safeSummary.value, credentialFieldsOmitted };
  const result: CallToolResult = {
    content: [{ type: 'text', text: JSON.stringify(visible) }],
    structuredContent: visible,
    ...(safeSnapshot
      ? { _meta: { inscope: { ...safeSnapshot.value, credentialFieldsOmitted } } }
      : {}),
  };
  if (Buffer.byteLength(JSON.stringify(result), 'utf8') > MAX_TOOL_RESPONSE_BYTES)
    return failure(
      'RESPONSE_TOO_LARGE',
      'This read exceeds the 1 MiB response limit. Open the exact workflow in InScope; no partial snapshot was returned.',
    );
  return result;
}

function graphSummary(definition: WorkflowDefinition) {
  return {
    blocks: definition.blocks.map(({ id, label, family }) => ({ id, label, family })),
    connections: definition.edges.map(
      ({ id, sourceBlockId, targetBlockId, status, relationshipType }) => ({
        id,
        sourceBlockId,
        targetBlockId,
        status,
        relationshipType,
      }),
    ),
  };
}

function selectedBlock(definition: WorkflowDefinition, blockId?: string) {
  if (!blockId) return undefined;
  const block = definition.blocks.find((candidate) => candidate.id === blockId);
  if (!block)
    throw new WorkflowCommandError(
      'NOT_FOUND',
      'The requested block is unavailable in this exact workflow snapshot.',
    );
  return block;
}

/** Read one current authorized library. Never execute, save, or choose a fallback version. */
export async function runReadTool(
  name: string,
  input: unknown,
  dependencies: ReadToolDependencies,
): Promise<CallToolResult> {
  if (!Object.hasOwn(readToolSchemas, name))
    return failure('UNKNOWN_TOOL', 'This read-only plugin does not expose that operation.');
  const parsed = readRequestSchema.safeParse({ name, input: input ?? {} });
  if (!parsed.success) return failure('INVALID_ARGUMENTS', 'Supply valid, exact tool arguments.');
  if (parsed.data.name === 'open_workflow_view') {
    const { workflowId, version, runId, blockId } = parsed.data.input;
    if ((version === undefined) === (runId === undefined))
      return failure('INVALID_ARGUMENTS', 'Supply exactly one saved version or recorded run ID.');
    return version !== undefined
      ? runReadTool('get_workflow_version', { workflowId, version, blockId }, dependencies)
      : runReadTool('inspect_workflow_run', { workflowId, runId, blockId }, dependencies);
  }
  try {
    const {
      workspace,
      libraryRevision,
      library,
      capabilities = { write: false, execute: false },
    } = await dependencies.readWorkspace();
    const context = {
      workspace,
      libraryRevision,
      capturedAt: (dependencies.now?.() ?? new Date()).toISOString(),
      capabilities,
    };
    const request = parsed.data;
    if (request.name === 'list_workflows')
      return boundedResult({
        ...context,
        workflows: Object.values(library).map((entry) => ({
          workflowId: entry.id,
          name: entry.draft.name,
          versions: entry.versions.map((version) => version.number),
          draftIsAvailable: true,
        })),
      });
    const workflowId = request.input.workflowId;
    const entry =
      workflowId && Object.hasOwn(library, workflowId) ? library[workflowId] : undefined;
    if (workflowId && !entry)
      throw new WorkflowCommandError('NOT_FOUND', 'The requested workflow is unavailable.');
    if (request.name === 'list_workflow_runs')
      return boundedResult({
        ...context,
        runs: listWorkflowRuns(entry ? { [entry.id]: entry } : library),
        scope: 'saved-workflow-library',
      });
    if (!entry)
      throw new WorkflowCommandError('NOT_FOUND', 'The requested workflow is unavailable.');
    if (request.name === 'read_workflow_source') {
      const source = sourcePage(
        entry,
        request.input.runId,
        request.input.sourceId,
        request.input.offset,
        request.input.limit,
      );
      if (!source)
        throw new WorkflowCommandError(
          'NOT_FOUND',
          'This source is unavailable in the exact selected run.',
        );
      return boundedResult({
        ...context,
        workflowId: entry.id,
        runId: request.input.runId,
        ...source,
      });
    }
    if (request.name === 'get_workflow_version') {
      const saved = getSavedVersion(entry, request.input.version);
      const block = selectedBlock(saved.definition, request.input.blockId);
      const omitted: import('./view-projection').OmittedCollection[] = [];
      const definition = projectDefinition(saved.definition, omitted);
      return boundedResult(
        {
          ...context,
          workflowId: entry.id,
          version: saved.number,
          name: saved.definition.name,
          savedAt: saved.savedAt,
          blockCount: saved.definition.blocks.length,
          edgeCount: saved.definition.edges.length,
          graph: graphSummary(saved.definition),
          ...(block
            ? { selectedBlock: definition.blocks.find((item) => item.id === block.id) }
            : {}),
          disclosure: { omittedCollections: omitted },
        },
        {
          ...context,
          schemaVersion: 'inscope-workflow-view-v1',
          kind: 'workflow-version',
          workflowId: entry.id,
          version: saved.number,
          definition,
          disclosure: { omittedCollections: omitted },
          ...(block ? { selectedBlockId: block.id } : {}),
          statuses: Object.fromEntries(
            saved.definition.blocks.map((block) => [block.id, 'pending']),
          ),
        },
      );
    }
    if (request.name === 'inspect_workflow_run') {
      const inspection = inspectWorkflowRun(entry, request.input.runId);
      const block = selectedBlock(inspection.definition, request.input.blockId);
      const history =
        inspection.kind === 'session'
          ? ((await dependencies.readHistory?.(entry.id, request.input.runId)) ?? [])
          : [];
      const projected = projectInspection(
        entry,
        request.input.runId,
        history.filter((item) => item.revisionAfter <= (inspection.revision ?? Infinity)),
      );
      return boundedResult(
        {
          ...context,
          workflowId: entry.id,
          runId: inspection.runId,
          version: inspection.version,
          revision: inspection.revision,
          kind: inspection.kind,
          paused: inspection.paused,
          approvedAt: inspection.approvedAt,
          steps: inspection.steps,
          graph: graphSummary(inspection.definition),
          ...(block
            ? {
                selectedBlock: projected.definition.blocks.find((item) => item.id === block.id),
                selectedResult: Object.hasOwn(inspection.results, block.id)
                  ? boundedEvidence(
                      inspection.results[block.id],
                      `selectedResult.${block.id}`,
                      projected.omitted,
                    )
                  : null,
              }
            : {}),
          disclosure: { omittedCollections: projected.omitted },
        },
        {
          ...context,
          schemaVersion: 'inscope-workflow-view-v1',
          kind: 'workflow-run',
          workflowId: entry.id,
          runId: inspection.runId,
          version: inspection.version,
          definition: projected.definition,
          inspection: projected.inspection,
          disclosure: { omittedCollections: projected.omitted },
          statuses: Object.fromEntries(inspection.steps.map((step) => [step.id, step.status])),
          ...(block ? { selectedBlockId: block.id } : {}),
        },
      );
    }
    return failure('INVALID_ARGUMENTS', 'Supply valid, exact tool arguments.');
  } catch (error) {
    if (error instanceof WorkflowCommandError) return failure(error.code, error.message);
    return failure(
      'READ_UNAVAILABLE',
      'The saved workspace could not be read. No workflow data was returned.',
    );
  }
}
