import { z } from 'zod';
import type { CalculationInputRequirement } from '@workspace/workflow-contracts/domain/calculation-inputs';

const id = z.string().min(1);
export const inputRequirementSchema: z.ZodType<CalculationInputRequirement> = z.object({
  name: id,
  label: z.string(),
  type: z.literal('number'),
  unit: z.string().optional(),
  binding: z
    .discriminatedUnion('kind', [
      z.object({ kind: z.literal('manual') }),
      z.object({ kind: z.literal('source'), blockId: id, path: z.array(z.string()) }),
    ])
    .optional(),
  status: z.enum(['provided', 'missing', 'invalid']),
  origin: z.enum(['manual', 'source', 'connected', 'default']).optional(),
  value: z.number().finite().optional(),
  message: z.string().optional(),
});
export const changedFieldSchema = z.object({ field: id, before: z.unknown(), after: z.unknown() });
export const changeReviewSchema = z.object({
  reviewToken: id,
  workflowId: id,
  runId: id,
  revision: z.number().int().nonnegative(),
  libraryRevision: z.number().int().nonnegative(),
  expiresAt: z.string().datetime({ offset: true }),
  changes: z.array(changedFieldSchema),
  affectedBlockIds: z.array(id),
  approvalInvalidated: z.boolean(),
});
export const sourceSummarySchema = z.object({
  id,
  blockId: id,
  name: z.string(),
  at: z.string(),
  mode: z.enum(['replace', 'add']),
  active: z.boolean(),
  rowCount: z.number().int().nonnegative(),
  previewRows: z.array(z.record(z.unknown())).default([]),
  extraction: z
    .object({
      revision: z.number().int().positive(),
      contentHash: z.string(),
      method: z.string(),
      originalDocumentId: id.optional(),
      issues: z.array(z.object({ code: z.string(), message: z.string() })).default([]),
    })
    .optional(),
});
export const changeHistorySchema = z.object({
  id,
  at: z.string(),
  actorId: id,
  kind: z.string(),
  revisionBefore: z.number().int().nonnegative().nullable(),
  revisionAfter: z.number().int().nonnegative(),
  changes: z.array(changedFieldSchema),
  affectedBlockIds: z.array(id),
});
export const attemptSummarySchema = z.object({
  at: z.string(),
  revision: z.number().int().nonnegative(),
  blockId: id,
  status: z.string(),
});
export const operationReceiptSchema = z.object({
  workflowId: id,
  runId: id,
  version: z.number().int().positive(),
  revision: z.number().int().nonnegative(),
  libraryRevision: z.number().int().nonnegative(),
  paused: z.literal(true),
  computed: z.boolean(),
  executedBlockIds: z.array(id),
  completedAt: z.string().datetime({ offset: true }),
  stopReason: z.string().optional(),
});
export type OperationReceipt = z.infer<typeof operationReceiptSchema>;
export function operationReceipt(result: unknown) {
  return z
    .object({ _meta: z.object({ operationReceipt: operationReceiptSchema }) })
    .safeParse(result).data?._meta.operationReceipt;
}
export type ChangeReview = z.infer<typeof changeReviewSchema>;
export type WorkflowChange =
  | { kind: 'inputs'; blockId: string; patch: Record<string, unknown> }
  | { kind: 'source'; blockId: string; captureId: string; mode: 'add' | 'replace' };
export type ViewerTab = 'workflow' | 'inputs' | 'sources' | 'changes';
export type ViewerFocus = {
  tab: ViewerTab;
  sourceId?: string;
  hasUnappliedDrafts?: boolean;
  pendingReview?: ChangeReview | null;
};

export function accessRejected(result: unknown) {
  const response = z
    .object({
      isError: z.boolean().optional(),
      structuredContent: z.object({ error: z.object({ code: z.string() }).optional() }).optional(),
      _meta: z.record(z.unknown()).optional(),
    })
    .safeParse(result);
  return (
    response.success &&
    response.data.isError === true &&
    (response.data._meta?.['mcp/www_authenticate'] !== undefined ||
      ['FORBIDDEN', 'UNAUTHORIZED', 'AUTHENTICATION_REQUIRED'].includes(
        response.data.structuredContent?.error?.code ?? '',
      ))
  );
}

export function parseToolData(result: unknown): Record<string, unknown> {
  const response = z
    .object({
      isError: z.boolean().optional(),
      structuredContent: z.record(z.unknown()).optional(),
      content: z.array(z.object({ type: z.string(), text: z.string().optional() })).optional(),
    })
    .parse(result);
  if (response.isError)
    throw new Error(
      response.content?.find((item) => item.type === 'text')?.text ??
        'The operation was rejected. Refresh the current work before retrying.',
    );
  if (!response.structuredContent)
    throw new Error('The operation returned no verified result. Refresh before retrying.');
  return response.structuredContent;
}
