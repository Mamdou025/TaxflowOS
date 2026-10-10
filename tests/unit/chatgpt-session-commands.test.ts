import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createWorkflow, saveVersion } from '../../lib/workflow-core/src/application/commands';
import { getSession } from '../../lib/workflow-core/src/application/sessions';
import { createWorkflowEdgeRecord } from '../../lib/workflow-core/src/core/edges';
import { LocalWorkflowSnapshotSchema } from '../../lib/workflow-contracts/src/generated-schemas';
import type { WorkflowBlock } from '../../lib/workflow-contracts/src/domain/workflow-types';
import type { WorkflowLibrary } from '../../lib/workflow-contracts/src/library-types';
import type { ToolDefinition } from '../../lib/workflow-contracts/src/tool-types';
import type { GraphRuntime } from '../../lib/workflow-core/src/core/ports';
import { createSessionService } from '../../artifacts/api-server/src/lib/chatgpt-plugin/session-service';
import { sessionRuntime } from '../../artifacts/api-server/src/lib/chatgpt-plugin/session-runtime';
import {
  SessionCommandError,
  type SessionStore,
  type SessionOperation,
  type SessionActor,
} from '../../artifacts/api-server/src/lib/chatgpt-plugin/session-types';

const at = '2026-10-08T12:00:00.000Z';
const actor = { userId: 'synthetic-owner', workspaceId: 'synthetic-workspace' };
function fixture() {
  const base = LocalWorkflowSnapshotSchema.parse(
    JSON.parse(readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8'))[
      'custom:synthetic-recovery'
    ].draft,
  );
  const block = (
    id: string,
    family: WorkflowBlock['family'],
    config: Record<string, unknown>,
  ): WorkflowBlock => ({
    id,
    family,
    subtype: family === 'Source' ? 'Manual Entry' : 'Aggregation',
    label: id,
    description: '',
    status: 'configured',
    position: { x: 0, y: 0 },
    config,
    runtime: {
      visible: true,
      editableInRuntime: true,
      generatedUiLocked: false,
      masked: false,
      showInRuns: true,
    },
    createdAt: at,
    updatedAt: at,
    createdBy: 'fixture',
    updatedBy: 'fixture',
  });
  const definition = {
    ...base,
    id: 'custom:session-test',
    name: 'Synthetic reviewed correction',
    blocks: [
      block('document', 'Source', {
        toolId: 'source.manual_table',
        sourceKind: 'manual_table',
        rows: [{ rowId: '1', amount: 100 }],
      }),
      block('fx', 'Source', {
        toolId: 'source.currency_rate',
        sourceKind: 'currency_rate',
        documentCurrency: 'USD',
        reportingCurrency: 'CAD',
        overrideRate: 2,
      }),
      block('product', 'Logic', { toolId: 'fixture.product' }),
      block('independent', 'Source', {
        toolId: 'source.manual_value',
        sourceKind: 'manual_value',
        value: 7,
      }),
    ],
    edges: ['document', 'fx'].map((sourceBlockId) =>
      createWorkflowEdgeRecord({
        sourceBlockId,
        targetBlockId: 'product',
        reason: 'synthetic input',
        createdAt: at,
      }),
    ),
  };
  const entry = saveVersion(createWorkflow(definition.id, 'synthetic', definition), at);
  let library: WorkflowLibrary = { [entry.id]: entry };
  let libraryRevision = 1;
  let role = 'owner';
  let time = new Date(at);
  let operations = new Map<string, SessionOperation>();
  const store: SessionStore = {
    async transaction<T>(
      who: SessionActor,
      permission: 'read' | 'write' | 'execute',
      work: Parameters<SessionStore['transaction']>[2],
    ) {
      if (
        who.workspaceId !== actor.workspaceId ||
        (who.userId !== actor.userId && who.userId !== 'synthetic-other') ||
        (permission !== 'read' && role === 'viewer')
      )
        throw new SessionCommandError('FORBIDDEN', 'Denied by current membership.');
      const pending = structuredClone(operations);
      let nextLibrary = structuredClone(library),
        nextRevision = libraryRevision;
      const result = await work({
        library: nextLibrary,
        libraryRevision,
        getOperation: async (key) => pending.get(key),
        putOperation: async (operation) => {
          pending.set(operation.key, structuredClone(operation));
        },
        listOperations: async (workflowId, runId) =>
          [...pending.values()].filter(
            (operation) => operation.workflowId === workflowId && operation.runId === runId,
          ),
        saveLibrary: async (value, expected) => {
          assert.equal(nextRevision, expected);
          nextLibrary = structuredClone(value);
          return ++nextRevision;
        },
      });
      library = nextLibrary;
      libraryRevision = nextRevision;
      operations = pending;
      return result as T;
    },
  };
  const calls: string[] = [];
  const tools: Record<string, ToolDefinition> = {};
  for (const toolId of [
    'source.manual_table',
    'source.currency_rate',
    'fixture.product',
    'source.manual_value',
  ])
    tools[toolId] = {
      toolId,
      family: 'Logic',
      toolGroup: 'calculation',
      displayName: toolId,
      description: '',
      inputRoles: [],
      outputRoles: [],
      inputSchema: { fields: [] },
      outputSchema: { fields: [{ key: 'value', type: 'number', required: true }] },
      defaultConfig: {},
      runMode: 'local_mock',
      execute(context) {
        calls.push(context.block.id);
        const value =
          toolId === 'fixture.product'
            ? context.upstreamResults.reduce(
                (total, result) => total * Number(result.output.value),
                1,
              )
            : toolId === 'source.manual_table'
              ? (context.config.rows as { amount: number }[]).reduce(
                  (total, row) => total + row.amount,
                  0,
                )
              : toolId === 'source.currency_rate'
                ? Number(context.config.overrideRate)
                : Number(context.config.value);
        return {
          blockId: context.block.id,
          runId: context.runId,
          toolId,
          status: 'success',
          output: { value },
          logs: [],
          warnings: [],
          errors: [],
          evidenceRefs: [],
          sourceTrace: [],
          startedAt: context.startedAt,
          completedAt: context.startedAt,
        };
      },
    };
  const runtime: GraphRuntime = {
    getTool: (id) => tools[id] ?? null,
    resolveToolId: (block) => String(block.config.toolId),
    createId: (prefix) => `${prefix}:${calls.length}`,
    now: () => time,
  };
  const captures = {
    async resolve(_who: SessionActor, captureId: string) {
      return {
        id: captureId,
        workflowId: entry.id,
        runId: captureRun,
        blockId: 'document',
        name: 'replacement.json',
        rows: [{ rowId: 'new', amount: 400 }],
        extraction: {
          id: captureId,
          revision: 1,
          fileName: 'replacement.json',
          contentHash: `sha256:${'a'.repeat(64)}`,
          extractedAt: at,
          method: 'json' as const,
          rows: [{ rowId: 'new', amount: 400 }],
          segments: [],
          issues: [],
        },
      };
    },
  };
  let captureRun = '';
  const service = createSessionService({ store, captures, runtime, now: () => time });
  return {
    entry,
    service,
    calls,
    tools,
    runtime,
    store,
    captures,
    read: () => library[entry.id],
    revision: () => libraryRevision,
    setRole: (value: string) => {
      role = value;
    },
    setTime: (value: Date) => {
      time = value;
    },
    setCaptureRun: (value: string) => {
      captureRun = value;
    },
  };
}
async function start(f: ReturnType<typeof fixture>) {
  return f.service.start(actor, {
    workflowId: f.entry.id,
    version: 1,
    expectedLibraryRevision: 1,
    requestId: 'start',
  });
}

test('start uses exact saved version, persists a paused session and idempotent receipt', async () => {
  const f = fixture();
  await assert.rejects(
    f.service.start(actor, {
      workflowId: f.entry.id,
      version: 99,
      expectedLibraryRevision: 1,
      requestId: 'missing',
    }),
    /version/,
  );
  const receipt = await start(f);
  assert.equal(receipt.paused, true);
  assert.equal(receipt.computed, false);
  assert.equal(receipt.revision, 0);
  assert.equal(f.calls.length, 0);
  assert.deepEqual(await start(f), receipt);
  assert.equal(f.read().sessions?.length, 1);
  await assert.rejects(
    f.service.start(actor, {
      workflowId: f.entry.id,
      version: 2,
      expectedLibraryRevision: 1,
      requestId: 'start',
    }),
    /different operation/,
  );
  await assert.rejects(
    f.service.start(actor, {
      workflowId: f.entry.id,
      version: 1,
      expectedLibraryRevision: 1,
      requestId: 'stale',
    }),
    /library changed/,
  );
});

test('FX review and apply pause without execution; explicit recalculation updates only affected results and preserves history', async () => {
  const f = fixture();
  const initial = await start(f);
  const computed = await f.service.recalculate(actor, {
    ...target(initial),
    requestId: 'calculate',
  });
  assert.equal(computed.computed, true);
  assert.equal(getSession(f.read(), initial.runId).results.product.output.value, 200);
  const historical = JSON.stringify(f.read().runs);
  const immutableVersion = JSON.stringify(f.read().versions);
  f.read().sessions![0].approvedAt = at;
  const priorCalls = f.calls.length;
  const preview = await f.service.preview(actor, {
    ...target(computed),
    change: { kind: 'inputs', blockId: 'fx', patch: { overrideRate: 3 } },
  });
  assert.deepEqual(preview.changes, [{ field: 'fx.overrideRate', before: 2, after: 3 }]);
  assert.deepEqual(preview.affectedBlockIds, ['fx', 'product']);
  assert.equal(preview.approvalInvalidated, true);
  assert.equal(f.calls.length, priorCalls);
  assert.equal(getSession(f.read(), initial.runId).revision, computed.revision);
  const applied = await f.service.apply(actor, { reviewToken: preview.reviewToken });
  assert.equal(applied.paused, true);
  assert.equal(applied.computed, false);
  assert.equal(f.calls.length, priorCalls);
  const stale = getSession(f.read(), initial.runId);
  assert.equal(stale.approvedAt, undefined);
  assert.deepEqual(stale.stale, ['fx', 'product']);
  assert.equal(stale.results.product.output.value, 200);
  assert.equal(stale.results.independent.output.value, 7);
  assert.equal(JSON.stringify(f.read().runs), historical);
  assert.equal(JSON.stringify(f.read().versions), immutableVersion);
  assert.deepEqual(await f.service.apply(actor, { reviewToken: preview.reviewToken }), applied);
  const next = await f.service.recalculate(actor, { ...target(applied), requestId: 'recalculate' });
  assert.deepEqual(next.executedBlockIds, ['fx', 'product']);
  assert.equal(getSession(f.read(), initial.runId).results.product.output.value, 300);
  assert.equal(f.read().runs.length, 2);
  assert.equal(JSON.stringify(f.read().runs.slice(0, 1)), historical);
  assert.equal(getSession(f.read(), initial.runId).approvedAt, undefined);
  const afterCalls = f.calls.length;
  assert.deepEqual(
    await f.service.recalculate(actor, { ...target(applied), requestId: 'recalculate' }),
    next,
  );
  assert.equal(f.calls.length, afterCalls);
  const history = await f.service.history(actor, { workflowId: f.entry.id, runId: initial.runId });
  assert.equal(history.filter((item) => item.kind === 'change').length, 1);
  assert.deepEqual(history.find((item) => item.kind === 'change')?.changes, preview.changes);
});

test('captured source replacement preserves prior source evidence and rejects model-supplied rows or other-session captures', async () => {
  const f = fixture();
  const initial = await start(f);
  f.setCaptureRun(initial.runId);
  const proposed = await f.service.preview(actor, {
    ...target(initial),
    change: { kind: 'source', blockId: 'document', captureId: 'captured-one', mode: 'replace' },
  });
  const applied = await f.service.apply(actor, { reviewToken: proposed.reviewToken });
  assert.equal(f.calls.length, 0);
  assert.equal(getSession(f.read(), initial.runId).sources[0].rows[0].amount, 400);
  const replaced = await f.service.preview(actor, {
    ...target(applied),
    change: { kind: 'source', blockId: 'document', captureId: 'captured-two', mode: 'replace' },
  });
  const next = await f.service.apply(actor, { reviewToken: replaced.reviewToken });
  assert.equal(getSession(f.read(), initial.runId).sources.length, 2);
  assert.equal(getSession(f.read(), initial.runId).sources[0].id, 'captured-one');
  await assert.rejects(
    f.service.preview(actor, {
      ...target(next),
      change: { kind: 'inputs', blockId: 'document', patch: { rows: [{ amount: 900 }] } },
    }),
    /manual input/,
  );
  f.setCaptureRun('another-run');
  await assert.rejects(
    f.service.preview(actor, {
      ...target(next),
      change: { kind: 'source', blockId: 'document', captureId: 'wrong-run', mode: 'replace' },
    }),
    /does not belong/,
  );
});

test('review is actor-bound, expires, rejects revision races and rechecks current role', async () => {
  const f = fixture();
  const initial = await start(f);
  const makePreview = () =>
    f.service.preview(actor, {
      ...target(initial),
      change: { kind: 'inputs', blockId: 'fx', patch: { overrideRate: 4 } },
    });
  const one = await makePreview(),
    two = await makePreview();
  await assert.rejects(
    f.service.apply({ ...actor, userId: 'synthetic-other' }, { reviewToken: one.reviewToken }),
    /unavailable/,
  );
  f.setRole('viewer');
  await assert.rejects(f.service.apply(actor, { reviewToken: one.reviewToken }), /membership/);
  f.setRole('owner');
  await f.service.apply(actor, { reviewToken: one.reviewToken });
  await assert.rejects(f.service.apply(actor, { reviewToken: two.reviewToken }), /library changed/);
  f.setTime(new Date('2026-10-08T12:16:00.000Z'));
  await assert.rejects(f.service.apply(actor, { reviewToken: two.reviewToken }), /expired/);
});

test('manual edits reject rule/provider mutation, invalid FX numbers and unsupported arguments before persistence', async () => {
  const f = fixture();
  const initial = await start(f);
  for (const patch of [
    { formula: '1' },
    { fetchedRows: [{ amount: 123 }] },
    { overrideRate: -1 },
    { overrideRate: '3' },
    { overrideRate: Infinity },
  ])
    await assert.rejects(
      f.service.preview(actor, {
        ...target(initial),
        change: { kind: 'inputs', blockId: 'fx', patch },
      }),
    );
  assert.equal(f.revision(), initial.libraryRevision);
  assert.equal(f.calls.length, 0);
});

test('recalculation stops at review and unavailable tool authority without running later blocks', async () => {
  const f = fixture();
  const prior = f.tools['source.currency_rate'].execute;
  f.tools['source.currency_rate'].execute = (context) => ({
    ...prior(context),
    status: 'needs_review',
  });
  const initial = await start(f);
  const result = await f.service.recalculate(actor, {
    ...target(initial),
    requestId: 'review-stop',
  });
  assert.equal(result.computed, false);
  assert.match(result.stopReason ?? '', /needs_review/);
  assert.equal(f.calls.includes('product'), false);
  assert.equal(f.read().runs.length, 0);
  assert.equal(sessionRuntime.getTool('source.web_url'), null);
  assert.equal(sessionRuntime.getTool('source.database_query'), null);
  assert.equal(sessionRuntime.getTool('ai.proposal_only'), null);
});

function target(receipt: {
  workflowId: string;
  runId: string;
  revision: number;
  libraryRevision: number;
}) {
  return {
    workflowId: receipt.workflowId,
    runId: receipt.runId,
    expectedRevision: receipt.revision,
    expectedLibraryRevision: receipt.libraryRevision,
  };
}
