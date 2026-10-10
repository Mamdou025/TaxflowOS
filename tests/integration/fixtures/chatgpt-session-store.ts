import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pool } from '../../../lib/db/src/index';
import { createWorkflow, saveVersion } from '../../../lib/workflow-core/src/application/commands';
import { getSession } from '../../../lib/workflow-core/src/application/sessions';
import { LocalWorkflowSnapshotSchema } from '../../../lib/workflow-contracts/src/generated-schemas';
import { createSessionService } from '../../../artifacts/api-server/src/lib/chatgpt-plugin/session-service';
import { createPostgresSessionStore } from '../../../artifacts/api-server/src/lib/chatgpt-plugin/session-store';
import { decodeBackup } from '../../../artifacts/api-server/src/storage/validate-backup';

if (
  !process.env.TAXFLOW_TEST_RUN_ID ||
  !new URL(process.env.DATABASE_URL ?? '').pathname.startsWith('/test_')
)
  throw new Error('This fixture requires the isolated test database harness.');
const at = '2026-10-08T12:00:00.000Z';
const actor = { userId: 'synthetic-owner', workspaceId: 'synthetic-workspace' };
async function main() {
  try {
    for (const id of [actor.userId, 'synthetic-viewer', 'synthetic-stranger'])
      await pool.query(
        'INSERT INTO users (id,name,email,created_at,updated_at) VALUES ($1,$1,$2,$3,$3)',
        [id, `${id}@example.invalid`, at],
      );
    await pool.query('INSERT INTO workspaces (id,name,created_by) VALUES ($1,$2,$3)', [
      actor.workspaceId,
      'Synthetic session command workspace',
      actor.userId,
    ]);
    await pool.query(
      "INSERT INTO workspace_members (workspace_id,user_id,role) VALUES ($1,$2,'owner'),($1,'synthetic-viewer','viewer')",
      [actor.workspaceId, actor.userId],
    );
    const base = LocalWorkflowSnapshotSchema.parse(
      JSON.parse(readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8'))[
        'custom:synthetic-recovery'
      ].draft,
    );
    const definition = {
      ...base,
      id: 'custom:persisted-session',
      name: 'Synthetic persistence arithmetic',
      blocks: [
        {
          id: 'input',
          label: 'Synthetic input',
          description: '',
          status: 'configured' as const,
          position: { x: 0, y: 0 },
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
          family: 'Source' as const,
          subtype: 'Manual Entry' as const,
          config: { toolId: 'source.manual_value', sourceKind: 'manual_value', value: 2 },
        },
      ],
      edges: [],
    };
    const entry = saveVersion(createWorkflow(definition.id, 'synthetic', definition), at);
    await pool.query(
      'INSERT INTO workspace_libraries (workspace_id,payload,updated_by) VALUES ($1,$2,$3)',
      [
        actor.workspaceId,
        JSON.stringify({ format: 'taxflow-workflow-backup-v1', library: { [entry.id]: entry } }),
        actor.userId,
      ],
    );
    const makeService = () =>
      createSessionService({
        store: createPostgresSessionStore(),
        captures: {
          async resolve() {
            throw new Error('No source capture supplied in this fixture.');
          },
        },
      });
    let service = makeService();
    const startArgs = {
      workflowId: entry.id,
      version: 1,
      expectedLibraryRevision: 1,
      requestId: 'durable-start',
    };
    for (const userId of ['synthetic-viewer', 'synthetic-stranger'])
      await assert.rejects(service.start({ ...actor, userId }, startArgs), /membership/);
    const [first, concurrent] = await Promise.all([
      service.start(actor, startArgs),
      service.start(actor, startArgs),
    ]);
    assert.deepEqual(first, concurrent);
    service = makeService();
    assert.deepEqual(
      await service.start(actor, startArgs),
      first,
      'receipt survives service recreation',
    );
    const target = (receipt: typeof first) => ({
      workflowId: receipt.workflowId,
      runId: receipt.runId,
      expectedRevision: receipt.revision,
      expectedLibraryRevision: receipt.libraryRevision,
    });
    const preview = await service.preview(actor, {
      ...target(first),
      change: { kind: 'inputs', blockId: 'input', patch: { value: 5 } },
    });
    await pool.query(
      "UPDATE workspace_members SET role='viewer' WHERE workspace_id=$1 AND user_id=$2",
      [actor.workspaceId, actor.userId],
    );
    await assert.rejects(service.apply(actor, { reviewToken: preview.reviewToken }), /membership/);
    await pool.query(
      "UPDATE workspace_members SET role='owner' WHERE workspace_id=$1 AND user_id=$2",
      [actor.workspaceId, actor.userId],
    );
    const [applied, duplicate] = await Promise.all([
      service.apply(actor, { reviewToken: preview.reviewToken }),
      service.apply(actor, { reviewToken: preview.reviewToken }),
    ]);
    assert.deepEqual(applied, duplicate);
    assert.equal(applied.revision, 1);
    assert.equal(applied.paused, true);
    let stored = await pool.query<{ payload: string; revision: number }>(
      'SELECT payload,revision FROM workspace_libraries WHERE workspace_id=$1',
      [actor.workspaceId],
    );
    let session = getSession(decodeBackup(stored.rows[0].payload)[entry.id], first.runId);
    assert.equal(session.inputOverrides?.input.value, 5);
    assert.equal(session.attempts.length, 0);
    const calculated = await service.recalculate(actor, {
      ...target(applied),
      requestId: 'durable-calculate',
    });
    assert.equal(calculated.computed, true);
    assert.deepEqual(calculated.executedBlockIds, ['input']);
    stored = await pool.query(
      'SELECT payload,revision FROM workspace_libraries WHERE workspace_id=$1',
      [actor.workspaceId],
    );
    session = getSession(decodeBackup(stored.rows[0].payload)[entry.id], first.runId);
    assert.equal(session.results.input.output.value, 5);
    assert.equal(session.approvedAt, undefined);
    const stale = await service.preview(actor, {
      ...target(calculated),
      change: { kind: 'inputs', blockId: 'input', patch: { value: 9 } },
    });
    await pool.query('UPDATE workspace_libraries SET revision=revision+1 WHERE workspace_id=$1', [
      actor.workspaceId,
    ]);
    await assert.rejects(
      service.apply(actor, { reviewToken: stale.reviewToken }),
      /library changed/,
    );
    const ledger = await service.history(actor, { workflowId: entry.id, runId: first.runId });
    assert.equal(ledger.filter((item) => item.kind === 'change').length, 1);
    assert.deepEqual(ledger.find((item) => item.kind === 'change')?.changes, [
      { field: 'input.value', before: 2, after: 5 },
    ]);
    const priorRows = await pool.query<{ count: string }>(
      'SELECT count(*) FROM chatgpt_session_operations',
    );
    await assert.rejects(
      createPostgresSessionStore().transaction(actor, 'write', async (transaction) => {
        await transaction.saveLibrary({}, transaction.libraryRevision);
        throw new Error('Synthetic transaction failure');
      }),
      /Synthetic transaction failure/,
    );
    const afterRollback = await pool.query<{ payload: string }>(
      'SELECT payload FROM workspace_libraries WHERE workspace_id=$1',
      [actor.workspaceId],
    );
    assert.ok(decodeBackup(afterRollback.rows[0].payload)[entry.id]);
    assert.equal(
      (await pool.query<{ count: string }>('SELECT count(*) FROM chatgpt_session_operations'))
        .rows[0].count,
      priorRows.rows[0].count,
    );
    console.log(
      'Verified current roles, concurrent start/apply replay, durable receipts, no auto-execution, explicit real arithmetic, CAS conflicts, edit history and rollback.',
    );
  } finally {
    await pool.end();
  }
}
main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
