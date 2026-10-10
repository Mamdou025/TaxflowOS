import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { z } from 'zod';
import type { PersonalWorkflow } from '@workspace/workflow-contracts/library-types';
import type { WorkflowBlock } from '@workspace/workflow-contracts/domain/workflow-types';
import type { GraphRuntime } from '@workspace/workflow-core/ports';
import {
  startSession,
  getSession,
  sessionDefinition,
  sessionContext,
  changeSession,
  runInputKeys,
} from '@workspace/workflow-core/sessions';
import { sessionRuntime } from './session-runtime';
import {
  SessionCommandError,
  type SessionActor,
  type SessionStore,
  type SessionCaptures,
  type SessionTarget,
  type SessionChange,
  type SessionPreview,
  type SessionReceipt,
  type SessionOperation,
  type SessionTransaction,
  type PreparedSessionChange,
  type SessionHistory,
} from './session-types';

const id = z.string().trim().min(1).max(200);
const revision = z.number().int().min(0);
const targetSchema = z
  .object({
    workflowId: id,
    runId: id,
    expectedRevision: revision,
    expectedLibraryRevision: revision,
  })
  .strict();
const changeSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('inputs'), blockId: id, patch: z.record(z.unknown()) }).strict(),
  z
    .object({
      kind: z.literal('source'),
      blockId: id,
      captureId: id,
      mode: z.enum(['replace', 'add']),
    })
    .strict(),
]);
export const sessionStartSchema = z
  .object({
    workflowId: id,
    version: z.number().int().positive(),
    expectedLibraryRevision: revision,
    requestId: id,
  })
  .strict();
export const sessionPreviewSchema = targetSchema.extend({ change: changeSchema }).strict();
export const sessionApplySchema = z
  .object({ reviewToken: z.string().regex(/^[A-Za-z0-9_-]{43}$/) })
  .strict();
export const sessionRecalculateSchema = targetSchema.extend({ requestId: id }).strict();
const historySchema = z.object({ workflowId: id, runId: id }).strict();
const manualFields = new Set([
  'value',
  'manualValue',
  'scalarValue',
  'valuePreview',
  'unit',
  'currency',
  'valueLabel',
  'documentCurrency',
  'reportingCurrency',
  'fapiYear',
  'overrideRate',
  'inclusionRate',
  'rtf',
  'fatPaid',
  'inputValues',
  'inputChoices',
]);

/** Data-edit projection only; core still validates every proposed input change. */
export function sessionEditableInputKeys(block: WorkflowBlock) {
  return runInputKeys(block).filter(
    (key) => manualFields.has(key) || /^override[A-Z_][A-Za-z0-9_]*$/.test(key),
  );
}
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, canonical(child)]),
    );
  return value;
}
function hash(value: unknown) {
  return createHash('sha256')
    .update(JSON.stringify(canonical(value)))
    .digest('hex');
}
function parse<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success)
    throw new SessionCommandError(
      'INVALID_REQUEST',
      'Supply the exact workflow, session revisions and supported change fields.',
    );
  return result.data;
}
function entryFor(tx: SessionTransaction, workflowId: string) {
  const entry = Object.hasOwn(tx.library, workflowId) ? tx.library[workflowId] : undefined;
  if (!entry) throw new SessionCommandError('NOT_FOUND', 'The requested workflow is unavailable.');
  return entry;
}
function checkRevision(tx: SessionTransaction, expected: number) {
  if (tx.libraryRevision !== expected)
    throw new SessionCommandError(
      'CONFLICT',
      'The workspace library changed. Refresh and review the change again.',
    );
}
function checkedSession(tx: SessionTransaction, target: SessionTarget) {
  checkRevision(tx, target.expectedLibraryRevision);
  const entry = entryFor(tx, target.workflowId);
  const session = getSession(entry, target.runId);
  if (session.revision !== target.expectedRevision)
    throw new SessionCommandError(
      'CONFLICT',
      'The session changed. Refresh and review the change again.',
    );
  if (session.endedAt || !session.paused)
    throw new SessionCommandError(
      'CONFLICT',
      'This command requires a paused, active working session.',
    );
  return { entry, session };
}
function operationKey(actor: SessionActor, kind: string, requestId: string) {
  return hash({ actor, kind, requestId });
}
function assertBound(operation: SessionOperation, actor: SessionActor) {
  if (operation.actorId !== actor.userId || operation.workspaceId !== actor.workspaceId)
    throw new SessionCommandError('NOT_FOUND', 'The reviewed operation is unavailable.');
}
async function previous(
  tx: SessionTransaction,
  actor: SessionActor,
  key: string,
  requestHash: string,
) {
  const operation = await tx.getOperation(key);
  if (!operation) return undefined;
  assertBound(operation, actor);
  if (operation.requestHash !== requestHash)
    throw new SessionCommandError('CONFLICT', 'This request ID belongs to a different operation.');
  if (!operation.receipt)
    throw new SessionCommandError('CONFLICT', 'This operation has not completed.');
  return operation.receipt;
}
function receipt(
  entry: PersonalWorkflow,
  runId: string,
  libraryRevision: number,
  executedBlockIds: string[] = [],
  stopReason?: string,
  completedAt = new Date().toISOString(),
): SessionReceipt {
  const session = getSession(entry, runId);
  const steps = sessionContext(entry, session).steps;
  return {
    workflowId: entry.id,
    runId,
    version: session.version,
    revision: session.revision,
    libraryRevision,
    paused: true,
    computed:
      steps.length > 0 &&
      steps.every((step) => ['success', 'warning', 'reviewed'].includes(step.status)),
    executedBlockIds,
    completedAt,
    ...(stopReason ? { stopReason } : {}),
  };
}
function impact(entry: PersonalWorkflow, runId: string, blockId: string) {
  // Display the dependency closure; mutation/invalidation remains exclusively in core.
  const steps = sessionContext(entry, getSession(entry, runId)).steps;
  const affected = new Set([blockId]);
  for (const step of steps)
    if (step.dependencies.some((dependency) => affected.has(dependency))) affected.add(step.id);
  return [...affected];
}
function validateManualPatch(block: WorkflowBlock, patch: Record<string, unknown>) {
  if (
    JSON.stringify(patch).length > 32000 ||
    !Object.keys(patch).length ||
    Object.keys(patch).some((key) => !sessionEditableInputKeys(block).includes(key))
  )
    throw new SessionCommandError(
      'INVALID_REQUEST',
      'Only bounded manual input values can change here. Attach source documents through a captured source; rules and provider responses cannot be edited.',
    );
  for (const [key, value] of Object.entries(patch)) {
    if (typeof value === 'string' && value.length > 1000)
      throw new SessionCommandError('INVALID_REQUEST', 'Input text exceeds the supported length.');
    if (
      /^override[A-Z_]/.test(key) &&
      value !== null &&
      (typeof value !== 'number' || !Number.isFinite(value) || (/rate/i.test(key) && value <= 0))
    )
      throw new SessionCommandError(
        'INVALID_REQUEST',
        'A manual override must be a finite number; exchange rates must be positive.',
      );
  }
}

export function createSessionService(dependencies: {
  store: SessionStore;
  captures: SessionCaptures;
  runtime?: GraphRuntime;
  now?: () => Date;
}) {
  const runtime = dependencies.runtime ?? sessionRuntime;
  const now = dependencies.now ?? (() => new Date());
  const noExecution: GraphRuntime = {
    ...runtime,
    getTool() {
      throw new Error('A reviewed change must never execute tools.');
    },
  };
  const makeOperation = (
    actor: SessionActor,
    kind: SessionOperation['kind'],
    key: string,
    requestHash: string,
    action: Record<string, unknown>,
    workflowId: string,
    runId: string | null,
  ): SessionOperation => ({
    key,
    actorId: actor.userId,
    workspaceId: actor.workspaceId,
    workflowId,
    runId,
    kind,
    requestHash,
    action,
    preview: null,
    receipt: null,
    createdAt: now().toISOString(),
    expiresAt: new Date(now().getTime() + 15 * 60 * 1000).toISOString(),
  });
  return {
    async start(actor: SessionActor, input: z.infer<typeof sessionStartSchema>) {
      const args = parse(sessionStartSchema, input);
      return dependencies.store.transaction(actor, 'write', async (tx) => {
        const key = operationKey(actor, 'start', args.requestId);
        const requestHash = hash(args);
        const prior = await previous(tx, actor, key, requestHash);
        if (prior) return prior;
        checkRevision(tx, args.expectedLibraryRevision);
        const entry = entryFor(tx, args.workflowId);
        const runId = `session:${randomUUID()}`;
        const next = startSession(entry, args.version, runId, now().toISOString());
        const libraryRevision = await tx.saveLibrary(
          { ...tx.library, [entry.id]: next },
          args.expectedLibraryRevision,
        );
        const result = receipt(next, runId, libraryRevision, [], undefined, now().toISOString());
        await tx.putOperation({
          ...makeOperation(actor, 'start', key, requestHash, args, entry.id, runId),
          receipt: result,
        });
        return result;
      });
    },
    async preview(
      actor: SessionActor,
      input: SessionTarget & { change: SessionChange },
    ): Promise<SessionPreview> {
      const args = parse(sessionPreviewSchema, input);
      return dependencies.store.transaction(actor, 'write', async (tx) => {
        const { entry, session } = checkedSession(tx, args);
        const definition = sessionDefinition(entry, session);
        const block = definition.blocks.find((item) => item.id === args.change.blockId);
        if (!block)
          throw new SessionCommandError('NOT_FOUND', 'The requested input block is unavailable.');
        let action: PreparedSessionChange['action'];
        let changes: SessionPreview['changes'];
        if (args.change.kind === 'inputs') {
          validateManualPatch(block, args.change.patch);
          action = { kind: 'inputs', blockId: block.id, patch: structuredClone(args.change.patch) };
          changes = Object.entries(args.change.patch).map(([field, after]) => ({
            field: `${block.id}.${field}`,
            before: block.config[field] ?? null,
            after,
          }));
        } else {
          const capture = await dependencies.captures.resolve(actor, args.change.captureId);
          if (
            capture.workflowId !== args.workflowId ||
            capture.runId !== args.runId ||
            capture.blockId !== block.id
          )
            throw new SessionCommandError(
              'NOT_FOUND',
              'The captured source does not belong to this session and block.',
            );
          action = {
            kind: 'source',
            blockId: block.id,
            sourceId: capture.id,
            name: capture.name,
            mode: args.change.mode,
            rows: structuredClone(capture.rows),
            extraction: structuredClone(capture.extraction),
          };
          changes = [
            {
              field: `${block.id}.source`,
              before: {
                blockLabel: block.label,
                records: Array.isArray(block.config.rows) ? block.config.rows.length : 0,
                documents: Array.isArray(block.config.documentExtractions)
                  ? block.config.documentExtractions.map(
                      (value: { id?: string; fileName?: string }) => ({
                        id: value.id,
                        name: value.fileName,
                      }),
                    )
                  : [],
              },
              after: {
                captureId: args.change.captureId,
                name: capture.name,
                mode: args.change.mode,
                records: capture.rows.length,
                contentHash: capture.extraction.contentHash,
              },
            },
          ];
        }
        const next = changeSession(
          entry,
          args.runId,
          args.expectedRevision,
          action,
          noExecution,
          now().toISOString(),
        );
        const reviewToken = randomBytes(32).toString('base64url');
        const prepared: PreparedSessionChange = {
          workflowId: args.workflowId,
          runId: args.runId,
          expectedRevision: args.expectedRevision,
          expectedLibraryRevision: args.expectedLibraryRevision,
          action,
        };
        const operation = makeOperation(
          actor,
          'change',
          hash(reviewToken),
          hash(prepared),
          prepared,
          entry.id,
          args.runId,
        );
        operation.preview = {
          workflowId: entry.id,
          runId: args.runId,
          revision: session.revision,
          libraryRevision: tx.libraryRevision,
          expiresAt: operation.expiresAt,
          changes: structuredClone(changes),
          affectedBlockIds: impact(entry, args.runId, block.id),
          approvalInvalidated: Boolean(
            session.approvedAt && !getSession(next, args.runId).approvedAt,
          ),
        };
        await tx.putOperation(operation);
        return { reviewToken, ...operation.preview };
      });
    },
    async apply(actor: SessionActor, input: { reviewToken: string }) {
      const args = parse(sessionApplySchema, input);
      return dependencies.store.transaction(actor, 'write', async (tx) => {
        const operation = await tx.getOperation(hash(args.reviewToken));
        if (!operation || operation.kind !== 'change')
          throw new SessionCommandError('NOT_FOUND', 'The reviewed change is unavailable.');
        assertBound(operation, actor);
        if (operation.receipt) return operation.receipt;
        if (new Date(operation.expiresAt).getTime() <= now().getTime())
          throw new SessionCommandError('EXPIRED', 'The change review expired. Preview it again.');
        const prepared = operation.action as PreparedSessionChange;
        if (hash(prepared) !== operation.requestHash)
          throw new SessionCommandError(
            'CONFLICT',
            'The reviewed change no longer matches its receipt.',
          );
        const { entry } = checkedSession(tx, prepared);
        const next = changeSession(
          entry,
          prepared.runId,
          prepared.expectedRevision,
          prepared.action,
          noExecution,
          now().toISOString(),
        );
        const libraryRevision = await tx.saveLibrary(
          { ...tx.library, [entry.id]: next },
          prepared.expectedLibraryRevision,
        );
        const result = receipt(
          next,
          prepared.runId,
          libraryRevision,
          [],
          undefined,
          now().toISOString(),
        );
        await tx.putOperation({ ...operation, receipt: result });
        return result;
      });
    },
    async recalculate(actor: SessionActor, input: SessionTarget & { requestId: string }) {
      const args = parse(sessionRecalculateSchema, input);
      return dependencies.store.transaction(actor, 'execute', async (tx) => {
        const key = operationKey(actor, 'recalculate', args.requestId);
        const requestHash = hash(args);
        const prior = await previous(tx, actor, key, requestHash);
        if (prior) return prior;
        const { entry } = checkedSession(tx, args);
        let next = entry;
        const executed: string[] = [];
        let stopReason: string | undefined;
        for (let count = 0; count < 200; count++) {
          const session = getSession(next, args.runId);
          const context = sessionContext(next, session);
          const blocked = context.steps.find((step) =>
            ['error', 'skipped', 'needs_review'].includes(step.status),
          );
          if (blocked) {
            stopReason = `Resolve ${blocked.label}: ${blocked.status}.`;
            break;
          }
          const step = context.steps.find(
            (item) =>
              ['pending', 'outdated'].includes(item.status) && item.ready && !item.inputRequired,
          );
          if (!step) {
            if (
              context.steps.some(
                (item) => !['success', 'warning', 'reviewed'].includes(item.status),
              )
            )
              stopReason = 'Required inputs or current dependencies are missing.';
            break;
          }
          const block = sessionDefinition(next, session).blocks.find(
            (item) => item.id === step.id,
          )!;
          if (
            block.config.useSampleData === true ||
            !runtime.getTool(runtime.resolveToolId(block))
          ) {
            stopReason = `The server cannot execute ${block.label} with the current source authority.`;
            break;
          }
          next = changeSession(
            next,
            args.runId,
            session.revision,
            { kind: 'block', blockId: step.id },
            runtime,
            now().toISOString(),
          );
          executed.push(step.id);
          if (count === 199)
            stopReason =
              'The bounded recalculation pass reached its step limit. Review before continuing.';
        }
        const state = receipt(next, args.runId, tx.libraryRevision, executed, stopReason);
        if (state.computed && executed.length)
          next = changeSession(
            next,
            args.runId,
            state.revision,
            { kind: 'record' },
            noExecution,
            now().toISOString(),
          );
        const libraryRevision =
          next === entry
            ? tx.libraryRevision
            : await tx.saveLibrary(
                { ...tx.library, [entry.id]: next },
                args.expectedLibraryRevision,
              );
        const result = receipt(
          next,
          args.runId,
          libraryRevision,
          executed,
          stopReason,
          now().toISOString(),
        );
        await tx.putOperation({
          ...makeOperation(actor, 'recalculate', key, requestHash, args, entry.id, args.runId),
          receipt: result,
        });
        return result;
      });
    },
    async history(
      actor: SessionActor,
      input: { workflowId: string; runId: string },
    ): Promise<SessionHistory[]> {
      const args = parse(historySchema, input);
      return dependencies.store.transaction(actor, 'read', async (tx) => {
        getSession(entryFor(tx, args.workflowId), args.runId);
        const operations = await tx.listOperations(args.workflowId, args.runId);
        return operations.flatMap((operation) =>
          operation.receipt
            ? [
                {
                  id: operation.key,
                  kind: operation.kind,
                  actorId: operation.actorId,
                  at: operation.receipt.completedAt,
                  revisionBefore:
                    typeof operation.action.expectedRevision === 'number'
                      ? operation.action.expectedRevision
                      : null,
                  revisionAfter: operation.receipt.revision,
                  changes: operation.preview?.changes ?? [],
                  affectedBlockIds: operation.preview?.affectedBlockIds ?? [],
                },
              ]
            : [],
        );
      });
    },
  };
}
export type SessionService = ReturnType<typeof createSessionService>;
