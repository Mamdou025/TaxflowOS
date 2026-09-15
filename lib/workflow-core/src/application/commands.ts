import { z } from 'zod';
import { LocalWorkflowSnapshotSchema as WorkflowDefinitionSchema } from '@workspace/workflow-contracts/generated-schemas';
import type { PersonalWorkflow } from '@workspace/workflow-contracts/library-types';
import type { WorkflowDefinition } from '@workspace/workflow-contracts/domain/workflow-types';
import type { LocalToolRunnerResult } from '@workspace/workflow-contracts/execution-result';
import type { DefinitionExecutor } from '../core/ports';

export class WorkflowCommandError extends Error {
  constructor(
    public readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'CONFLICT' | 'INVALID_RESULT',
    message: string,
  ) {
    super(message);
    this.name = 'WorkflowCommandError';
  }
}

// Audit timestamps do not create new versions. Editable behavior, source,
// governance and output settings do, including code/formulas outside config.
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, canonical(item)]),
    );
  return value;
}
export function definitionFingerprint(definition: WorkflowDefinition): string {
  return JSON.stringify(
    canonical({
      name: definition.name,
      description: definition.description,
      blocks: definition.blocks.map(
        ({ createdAt, updatedAt, createdBy, updatedBy, ...block }) => block,
      ),
      edges: definition.edges.map(({ createdAt, createdBy, history, ...edge }) => edge),
    }),
  );
}

export function createWorkflow(
  id: string,
  templateId: string,
  draft: WorkflowDefinition,
): PersonalWorkflow {
  if (!id.trim() || !templateId.trim())
    throw new WorkflowCommandError('INVALID_REQUEST', 'Workflow and template IDs are required.');
  return {
    id,
    templateId,
    draft: structuredClone(WorkflowDefinitionSchema.parse({ ...draft, id })),
    versions: [],
    runs: [],
  };
}

export function replaceDraft(
  entry: PersonalWorkflow,
  draft: WorkflowDefinition,
  expectedFingerprint?: string,
): PersonalWorkflow {
  if (
    expectedFingerprint !== undefined &&
    definitionFingerprint(entry.draft) !== expectedFingerprint
  )
    throw new WorkflowCommandError(
      'CONFLICT',
      'The workflow draft changed. Reload it before applying this edit.',
    );
  if (draft.id !== entry.id)
    throw new WorkflowCommandError(
      'INVALID_REQUEST',
      'An edit cannot change the workflow identity.',
    );
  return { ...entry, draft: structuredClone(WorkflowDefinitionSchema.parse(draft)) };
}

export function saveVersion(
  entry: PersonalWorkflow,
  now = new Date().toISOString(),
): PersonalWorkflow {
  const previous = entry.versions.at(-1);
  if (previous && definitionFingerprint(previous.definition) === definitionFingerprint(entry.draft))
    return entry;
  const definition = WorkflowDefinitionSchema.parse(entry.draft);
  if (definition.id !== entry.id)
    throw new WorkflowCommandError('INVALID_REQUEST', 'The draft must belong to this workflow.');
  return {
    ...entry,
    versions: [
      ...entry.versions,
      {
        number: (previous?.number ?? 0) + 1,
        savedAt: now,
        definition: structuredClone(definition),
      },
    ],
  };
}

export function getSavedVersion(entry: PersonalWorkflow, number?: number | null) {
  const saved =
    number == null
      ? entry.versions.at(-1)
      : entry.versions.find((version) => version.number === number);
  if (!saved)
    throw new WorkflowCommandError(
      'NOT_FOUND',
      'The requested workflow version does not exist. Save a version before running it.',
    );
  return structuredClone(saved);
}

export function getWorkflowRun(entry: PersonalWorkflow, runId: string) {
  const run = entry.runs.find((run) => run.result.record.execution.id === runId);
  if (!run) throw new WorkflowCommandError('NOT_FOUND', `Workflow run '${runId}' does not exist.`);
  return structuredClone(run);
}

/** Also used by compatibility/import adapters: historical workflow IDs are retained. */
export function recordWorkflowExecution(
  entry: PersonalWorkflow,
  version: number,
  result: LocalToolRunnerResult,
  now = new Date().toISOString(),
): PersonalWorkflow {
  getSavedVersion(entry, version);
  return { ...entry, runs: [...entry.runs, { version, at: now, result: structuredClone(result) }] };
}

export const RunOptionsSchema = z
  .object({
    saveDraft: z.boolean().optional(),
    version: z.number().int().positive().nullable().optional(),
    requestId: z.string().trim().min(1).max(128).optional(),
  })
  .strict();
export type RunOptions = z.infer<typeof RunOptionsSchema>;
export type RunInitiator = {
  actorId: string;
  workspaceId: string;
  surface: 'builder' | 'run' | 'chat';
};

export function executeSavedWorkflow(
  entry: PersonalWorkflow,
  input: RunOptions,
  execute: DefinitionExecutor,
  context: { now?: () => Date; initiatedBy?: RunInitiator } = {},
) {
  const parsed = RunOptionsSchema.safeParse(input);
  if (!parsed.success)
    throw new WorkflowCommandError('INVALID_REQUEST', 'Supply valid workflow run options.');
  const options = parsed.data;
  if (options.version != null && options.saveDraft !== false)
    throw new WorkflowCommandError(
      'INVALID_REQUEST',
      'Choose either saving the draft or running an explicit saved version.',
    );
  const now = context.now ?? (() => new Date());
  const saved = options.saveDraft === false ? entry : saveVersion(entry, now().toISOString());
  const version = getSavedVersion(saved, options.version);
  const previous =
    options.requestId && entry.runs.find((run) => run.requestId === options.requestId);
  if (previous) {
    if (previous.version !== version.number)
      throw new WorkflowCommandError(
        'CONFLICT',
        'This run request was already used for another version.',
      );
    return { entry, version: previous.version, result: structuredClone(previous.result) };
  }
  // Never give an executor references to an immutable historical snapshot.
  const result = execute(structuredClone(version.definition));
  if (
    result.result.workflowId !== saved.id ||
    result.record.execution.workflowId !== saved.id ||
    result.result.runId !== result.record.execution.id
  )
    throw new WorkflowCommandError(
      'INVALID_RESULT',
      'The executor returned a result for a different workflow or run.',
    );
  const recorded = recordWorkflowExecution(saved, version.number, result, now().toISOString());
  const last = recorded.runs[recorded.runs.length - 1];
  if (options.requestId) last.requestId = options.requestId;
  if (context.initiatedBy) last.initiatedBy = { ...context.initiatedBy };
  return { entry: recorded, version: version.number, result };
}
