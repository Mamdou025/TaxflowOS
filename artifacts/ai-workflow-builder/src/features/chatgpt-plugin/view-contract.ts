import { z } from 'zod';
import { BLOCK_FAMILIES } from '@workspace/workflow-contracts/domain/block-types';
import {
  LocalRunRecordSchema,
  LocalWorkflowSnapshotSchema,
  ToolRunResultSchema,
  DocumentReviewSchema,
} from '@workspace/workflow-contracts/generated-schemas';
import {
  inputRequirementSchema,
  sourceSummarySchema,
  attemptSummarySchema,
  changeHistorySchema,
  type ViewerFocus,
  type OperationReceipt,
} from './workbench-contract';

const identifier = z.string().min(1);
const stepStatus = z.enum([
  'pending',
  'success',
  'warning',
  'error',
  'skipped',
  'needs_review',
  'outdated',
  'reviewed',
]);
const inspectionStep = z.object({
  id: identifier,
  label: z.string(),
  family: z.enum(BLOCK_FAMILIES),
  status: stepStatus,
  dependencies: z.array(identifier),
  ready: z.boolean().optional(),
  inputRequired: z.boolean().optional(),
  inputKeys: z.array(z.string()).optional(),
  inputRequirements: z.array(inputRequirementSchema).optional(),
  warnings: z.array(z.string()).optional(),
  errors: z.array(z.string()).optional(),
});
const runInspection = z.object({
  workflowId: identifier,
  runId: identifier,
  version: z.number().int().positive(),
  revision: z.number().int().nonnegative().optional(),
  results: z.record(ToolRunResultSchema),
  steps: z.array(inspectionStep).optional(),
  kind: z.enum(['session', 'record']).optional(),
  paused: z.boolean().optional(),
  approvedAt: z.string().datetime({ offset: true }).optional(),
  endedAt: z.string().datetime({ offset: true }).optional(),
  inputOverrides: z.record(z.record(z.unknown())).optional(),
  stale: z.array(identifier).optional(),
  reviewed: z.array(identifier).optional(),
  sourceSummaries: z.array(sourceSummarySchema).optional(),
  documentReviews: z.array(DocumentReviewSchema).optional(),
  attemptSummaries: z.array(attemptSummarySchema).optional(),
  changeHistory: z.array(changeHistorySchema).optional(),
  changeHistoryTotal: z.number().int().nonnegative().optional(),
  attemptsTotal: z.number().int().nonnegative().optional(),
});

export const workflowViewSchema = z
  .object({
    schemaVersion: z.literal('inscope-workflow-view-v1'),
    kind: z.enum(['workflow-version', 'workflow-run']),
    workspace: z.object({ id: identifier, name: identifier }),
    workflowId: identifier,
    version: z.number().int().positive(),
    definition: LocalWorkflowSnapshotSchema,
    runId: identifier.optional(),
    revision: z.number().int().nonnegative().optional(),
    libraryRevision: z.number().int().nonnegative().optional(),
    capabilities: z
      .object({ write: z.boolean(), execute: z.boolean() })
      .default({ write: false, execute: false }),
    disclosure: z
      .object({
        omittedCollections: z.array(
          z.object({
            path: z.string(),
            total: z.number().int().nonnegative(),
            shown: z.number().int().nonnegative(),
          }),
        ),
      })
      .optional(),
    record: LocalRunRecordSchema.optional(),
    inspection: runInspection.optional(),
    statuses: z.record(stepStatus).default({}),
    selectedBlockId: identifier.optional(),
    capturedAt: z.string().datetime({ offset: true }),
    credentialFieldsOmitted: z.boolean().default(false),
  })
  .superRefine((snapshot, context) => {
    if ((snapshot.kind === 'workflow-run') !== Boolean(snapshot.runId))
      context.addIssue({ code: 'custom', message: 'The view kind and exact run ID do not match.' });
    if (snapshot.kind === 'workflow-run' && !snapshot.inspection)
      context.addIssue({ code: 'custom', message: 'The selected run has no inspection evidence.' });
    if (
      snapshot.selectedBlockId &&
      !snapshot.definition.blocks.some((block) => block.id === snapshot.selectedBlockId)
    )
      context.addIssue({ code: 'custom', message: 'The requested block is unavailable.' });
    if (
      snapshot.inspection &&
      (snapshot.inspection.workflowId !== snapshot.workflowId ||
        snapshot.inspection.runId !== snapshot.runId ||
        snapshot.inspection.version !== snapshot.version)
    )
      context.addIssue({
        code: 'custom',
        message: 'Run evidence does not match the selected view.',
      });
    const ids = new Set(snapshot.definition.blocks.map((block) => block.id));
    const steps = snapshot.inspection?.steps;
    if (
      steps &&
      (steps.length !== ids.size ||
        new Set(steps.map((step) => step.id)).size !== ids.size ||
        steps.some((step) => !ids.has(step.id) || step.dependencies.some((id) => !ids.has(id))))
    )
      context.addIssue({ code: 'custom', message: 'Run steps do not match the selected graph.' });
    if (Object.keys(snapshot.statuses).some((id) => !ids.has(id)))
      context.addIssue({ code: 'custom', message: 'Block status is outside the selected graph.' });
    // Historical imported records retain their original definition/execution identities.
    // The authenticated tool resolves the public workflow/run IDs above.
  });

export type WorkflowView = z.infer<typeof workflowViewSchema> & {
  /** Local recovery state: never represents refreshed run evidence. */
  pendingReceipt?: OperationReceipt;
  operationReceipt?: OperationReceipt;
};

export function sameViewIdentity(left: WorkflowView, right: WorkflowView) {
  return (
    left.workspace.id === right.workspace.id &&
    left.workflowId === right.workflowId &&
    left.version === right.version &&
    left.runId === right.runId &&
    left.kind === right.kind
  );
}

export function parseWorkflowView(result: unknown): WorkflowView {
  const envelope = z
    .object({ isError: z.boolean().optional(), _meta: z.object({ inscope: z.unknown() }) })
    .parse(result);
  if (envelope.isError)
    throw new Error('The workflow could not be loaded. Request it again in chat.');
  return workflowViewSchema.parse(envelope._meta.inscope);
}

export function selectionContext(
  view: WorkflowView,
  blockId: string,
  focus: ViewerFocus = { tab: 'workflow' },
) {
  const block = view.definition.blocks.find((item) => item.id === blockId);
  if (!block) throw new Error('The selected block is unavailable.');
  const review = focus.pendingReview;
  const pendingReview =
    !view.pendingReceipt &&
    review &&
    review.workflowId === view.workflowId &&
    review.runId === view.runId &&
    review.revision === view.inspection?.revision &&
    review.libraryRevision === view.libraryRevision
      ? {
          workflowId: review.workflowId,
          runId: review.runId,
          revision: review.revision,
          changes: review.changes,
          affectedBlockIds: review.affectedBlockIds,
          expiresAt: review.expiresAt,
          status: 'awaiting_user_review',
        }
      : null;
  return {
    workspaceId: view.workspace.id,
    workflowId: view.workflowId,
    version: view.version,
    runId: view.pendingReceipt?.runId ?? view.runId ?? null,
    revision: view.pendingReceipt?.revision ?? view.inspection?.revision ?? view.revision ?? null,
    selectedBlockId: block.id,
    selectedBlockLabel: block.label,
    status: view.pendingReceipt
      ? 'saved_snapshot_unavailable'
      : view.kind === 'workflow-version'
        ? 'no_run_selected'
        : (view.inspection?.steps?.find((step) => step.id === block.id)?.status ??
          view.statuses[block.id] ??
          'pending'),
    capturedAt: view.capturedAt,
    readOnly:
      !view.capabilities.write ||
      view.inspection?.kind !== 'session' ||
      view.inspection.paused !== true ||
      !!view.inspection.endedAt,
    capabilities: view.capabilities,
    ...(view.pendingReceipt
      ? {
          snapshotUnavailable: true,
          message:
            'The operation was saved. Refresh this exact run before reasoning about its current inputs or results.',
        }
      : {}),
    activeTab: focus.tab,
    hasUnappliedDrafts: focus.hasUnappliedDrafts ?? false,
    pendingReview,
    ...(focus.sourceId ? { selectedSourceId: focus.sourceId } : {}),
  };
}
