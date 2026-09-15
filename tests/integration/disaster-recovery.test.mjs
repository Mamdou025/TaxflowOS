import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { runMigrations } from '../../lib/db/scripts/migrations.mjs';
import { createTestRun, root } from '../../scripts/testing/runtime.mjs';
import { startTestDatabase } from '../../scripts/testing/stack.mjs';

const dbRequire = createRequire(path.join(root, 'lib/db/package.json'));
const { Client } = dbRequire('pg');

test(
  'a physical database backup restores workspace data, queued work and operation receipts',
  { timeout: 180000 },
  async () => {
    const run = createTestRun('database-recovery');
    console.log(`Recovery evidence: ${run.output}`);
    let restored;
    try {
      const source = await startTestDatabase(run);
      const migrationEvidence = await runMigrations(source.connectionString);
      const userId = `recovery-user-${randomUUID()}`;
      const workspaceId = randomUUID();
      const documentId = `recovery-document-${randomUUID()}`;
      const ingestJobId = `recovery-job-${randomUUID()}`;
      const operationId = `recovery-operation-${randomUUID()}`;
      const workflowRunId = `recovery-workflow-run-${randomUUID()}`;
      const payload = await fs.readFile('tests/fixtures/backups/legacy-v0.json', 'utf8');

      await source.db.query(
        `INSERT INTO users(id,name,email,email_verified,created_at,updated_at,is_anonymous)
         VALUES($1,'Recovery user',$2,true,now(),now(),false)`,
        [userId, `${randomUUID()}@example.invalid`],
      );
      await source.db.query(
        `INSERT INTO workspaces(id,name,created_by) VALUES($1,'Recovery workspace',$2)`,
        [workspaceId, userId],
      );
      await source.db.query(
        `INSERT INTO workspace_members(workspace_id,user_id,role) VALUES($1,$2,'owner')`,
        [workspaceId, userId],
      );
      await source.db.query(
        `INSERT INTO workspace_libraries(workspace_id,payload,revision,updated_by)
         VALUES($1,$2,7,$3)`,
        [workspaceId, payload, userId],
      );
      await source.db.query(
        `INSERT INTO documents(id,user_id,workspace_id,file_name,status)
         VALUES($1,$2,$3,'recovery-source.pdf','processing')`,
        [documentId, userId, workspaceId],
      );
      await source.db.query(
        `INSERT INTO ingest_jobs(id,document_id,user_id,workspace_id,status)
         VALUES($1,$2,$3,$4,'queued')`,
        [ingestJobId, documentId, userId, workspaceId],
      );
      await source.db.query(
        `INSERT INTO agent_action_operations(
           workspace_id,actor_id,operation_id,agent_id,capability,resource_type,
           resource_id,request_signature,status,message
         ) VALUES($1,$2,$3,'sina','workflow.run','workflow','custom:recovery','signature','succeeded','recorded')`,
        [workspaceId, userId, operationId],
      );
      const definition = JSON.parse(payload)['custom:synthetic-recovery'].versions[0].definition;
      await source.db.query(
        `INSERT INTO workflow_run_jobs(
          id,workspace_id,workflow_id,workflow_version,definition,requested_by,
          request_id,status,attempts
        ) VALUES($1,$2,'custom:synthetic-recovery',1,$3,$4,$5,'pending',0)`,
        [workflowRunId, workspaceId, definition, userId, randomUUID()],
      );

      const sourceUrl = new URL(source.connectionString);
      const sourceDatabase = decodeURIComponent(sourceUrl.pathname.slice(1));
      const restoredDatabase = `restore_${randomUUID().replaceAll('-', '').slice(0, 20)}`;
      const dumpPath = '/tmp/taxflow-recovery.dump';
      await run.command(
        'docker',
        [
          'exec',
          source.container,
          'pg_dump',
          '--username',
          'postgres',
          '--dbname',
          sourceDatabase,
          '--format',
          'custom',
          '--file',
          dumpPath,
        ],
        { log: 'recovery-dump' },
      );
      const dumpSize = Number(
        (
          await run.command('docker', ['exec', source.container, 'stat', '--format=%s', dumpPath], {
            log: 'recovery-dump-size',
          })
        ).trim(),
      );
      assert.ok(dumpSize > 0);
      await run.command(
        'docker',
        ['exec', source.container, 'createdb', '--username', 'postgres', restoredDatabase],
        { log: 'recovery-create-database' },
      );
      await run.command(
        'docker',
        [
          'exec',
          source.container,
          'pg_restore',
          '--username',
          'postgres',
          '--dbname',
          restoredDatabase,
          '--no-owner',
          '--no-privileges',
          dumpPath,
        ],
        { log: 'recovery-restore' },
      );

      const restoredUrl = new URL(source.connectionString);
      restoredUrl.pathname = `/${restoredDatabase}`;
      restored = new Client({ connectionString: restoredUrl.toString() });
      await restored.connect();
      assert.deepEqual(
        (
          await restored.query(
            `SELECT m.role,l.revision,l.payload
             FROM workspace_members m
             JOIN workspace_libraries l ON l.workspace_id=m.workspace_id
             WHERE m.workspace_id=$1 AND m.user_id=$2`,
            [workspaceId, userId],
          )
        ).rows,
        [{ role: 'owner', revision: 7, payload }],
      );
      assert.deepEqual(
        (
          await restored.query(
            'SELECT id,status,document_id FROM ingest_jobs WHERE workspace_id=$1',
            [workspaceId],
          )
        ).rows,
        [{ id: ingestJobId, status: 'queued', document_id: documentId }],
      );
      assert.deepEqual(
        (
          await restored.query(
            `SELECT operation_id,status FROM agent_action_operations
             WHERE workspace_id=$1 AND actor_id=$2`,
            [workspaceId, userId],
          )
        ).rows,
        [{ operation_id: operationId, status: 'succeeded' }],
      );
      assert.deepEqual(
        (
          await restored.query(
            `SELECT id,status,workflow_id,workflow_version
             FROM workflow_run_jobs WHERE workspace_id=$1`,
            [workspaceId],
          )
        ).rows,
        [
          {
            id: workflowRunId,
            status: 'pending',
            workflow_id: 'custom:synthetic-recovery',
            workflow_version: 1,
          },
        ],
      );
      assert.deepEqual(await runMigrations(restoredUrl.toString()), migrationEvidence);
    } finally {
      await restored?.end();
      await run.close();
    }
  },
);
