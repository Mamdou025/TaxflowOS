import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createTestRun } from '../../scripts/testing/runtime.mjs';
import { startTestDatabase } from '../../scripts/testing/stack.mjs';
import { migrationsFolder, runMigrations } from '../../lib/db/scripts/migrations.mjs';

test(
  'fresh migrations are serialized, repeatable, checksum-checked and roll back failed DDL',
  { timeout: 180000 },
  async () => {
    const run = createTestRun('database-migrations');
    console.log(`Migration evidence: ${run.output}`);
    try {
      const stack = await startTestDatabase(run);
      const results = await Promise.all([
        runMigrations(stack.connectionString),
        runMigrations(stack.connectionString),
      ]);
      assert.equal(results[0].applied, results[0].total);
      assert.ok(results[0].total >= 5);
      assert.deepEqual(results[1], results[0]);
      assert.deepEqual(await runMigrations(stack.connectionString), results[0]);
      const copy = path.join(run.output, 'migration-fixture');
      await fs.cp(migrationsFolder, copy, { recursive: true });
      const initial = path.join(copy, '0000_phase2_baseline.sql');
      const original = await fs.readFile(initial, 'utf8');
      await fs.writeFile(initial, original + '\n-- Changed applied migration');
      await assert.rejects(
        runMigrations(stack.connectionString, 'migrate', copy),
        /history does not match/,
      );
      await fs.writeFile(initial, original);
      const journalFile = path.join(copy, 'meta/_journal.json');
      const journal = JSON.parse(await fs.readFile(journalFile, 'utf8'));
      const nextIndex = journal.entries.length;
      const failureTag = `${String(nextIndex).padStart(4, '0')}_failure_probe`;
      journal.entries.push({
        idx: nextIndex,
        version: '7',
        when: journal.entries.at(-1).when + 1,
        tag: failureTag,
        breakpoints: true,
      });
      await fs.writeFile(journalFile, JSON.stringify(journal));
      await fs.writeFile(
        path.join(copy, `${failureTag}.sql`),
        'CREATE TABLE migration_rollback_probe(id integer);\n--> statement-breakpoint\nSELECT * FROM deliberately_missing_migration_relation;',
      );
      await assert.rejects(runMigrations(stack.connectionString, 'migrate', copy));
      assert.equal(
        (await stack.db.query("SELECT to_regclass('public.migration_rollback_probe') AS relation"))
          .rows[0].relation,
        null,
      );
      assert.equal(
        (await stack.db.query('SELECT count(*)::int AS n FROM drizzle.__drizzle_migrations'))
          .rows[0].n,
        nextIndex,
      );
    } finally {
      await run.close();
    }
  },
);

test(
  'a populated Phase 2 database can be baselined and upgraded without assigning or losing legacy data',
  { timeout: 180000 },
  async () => {
    const run = createTestRun('database-upgrade');
    try {
      const stack = await startTestDatabase(run);
      const baseline = await fs.readFile(
        path.join(migrationsFolder, '0000_phase2_baseline.sql'),
        'utf8',
      );
      await stack.db.query(baseline);
      await stack.db.query(
        "INSERT INTO users(id,name,email_verified,created_at,updated_at,is_anonymous) VALUES('anonymous','Guest',false,now(),now(),true)",
      );
      await stack.db.query(
        "INSERT INTO chat_threads(id,user_id,title) VALUES('legacy-chat','anonymous','Preserved legacy chat')",
      );
      await stack.db.query(
        "INSERT INTO personal_workflow_libraries(workspace_hash,owner_id,payload,revision) VALUES($1,'anonymous',$2,7)",
        ['a'.repeat(64), await fs.readFile('tests/fixtures/backups/legacy-v0.json', 'utf8')],
      );
      await runMigrations(stack.connectionString, 'baseline');
      await runMigrations(stack.connectionString);
      const { rows } = await stack.db.query(
        "SELECT title,workspace_id FROM chat_threads WHERE id='legacy-chat'",
      );
      assert.deepEqual(rows, [{ title: 'Preserved legacy chat', workspace_id: null }]);
      assert.equal(
        (await stack.db.query('SELECT revision FROM personal_workflow_libraries')).rows[0].revision,
        7,
      );
      assert.equal(
        (await stack.db.query('SELECT count(*)::int AS n FROM workspace_members')).rows[0].n,
        0,
      );
    } finally {
      await run.close();
    }
  },
);

test(
  'Mkoro reconnect migration preserves existing identities, active history and untargeted pairing codes',
  { timeout: 180000 },
  async () => {
    const run = createTestRun('mkoro-reconnect-upgrade');
    try {
      const stack = await startTestDatabase(run);
      const previous = path.join(run.output, 'before-reconnect');
      await fs.cp(migrationsFolder, previous, { recursive: true });
      const journalFile = path.join(previous, 'meta/_journal.json');
      const journal = JSON.parse(await fs.readFile(journalFile, 'utf8'));
      const reconnectIndex = journal.entries.findIndex(
        (entry) => entry.tag === '0009_mkoro_reconnect',
      );
      assert.ok(reconnectIndex > 0);
      journal.entries = journal.entries.slice(0, reconnectIndex);
      await fs.writeFile(journalFile, JSON.stringify(journal));
      await runMigrations(stack.connectionString, 'migrate', previous);
      await stack.db.query(
        "INSERT INTO users(id,name,email_verified,created_at,updated_at,is_anonymous) VALUES('upgrade-actor','Synthetic',false,now(),now(),true)",
      );
      await stack.db.query(
        "INSERT INTO workspaces(id,name,created_by) VALUES('upgrade-workspace','Synthetic','upgrade-actor')",
      );
      await stack.db.query(
        "INSERT INTO workspace_members(workspace_id,user_id,role) VALUES('upgrade-workspace','upgrade-actor','editor')",
      );
      await stack.db.query(
        "INSERT INTO mkoro_workers(id,workspace_id,actor_id,name,token_hash,auto_approve) VALUES('upgrade-worker','upgrade-workspace','upgrade-actor','Existing computer','synthetic-worker-hash',true)",
      );
      await stack.db.query(
        "INSERT INTO mkoro_conversations(id,workspace_id,actor_id,worker_id,title) VALUES('upgrade-chat','upgrade-workspace','upgrade-actor','upgrade-worker','Existing history')",
      );
      await stack.db.query(
        "INSERT INTO mkoro_tasks(id,conversation_id,worker_id,request_id,message,status) VALUES('upgrade-task','upgrade-chat','upgrade-worker','upgrade-request','Existing task','running')",
      );
      await stack.db.query(
        "INSERT INTO mkoro_pairings(token_hash,workspace_id,actor_id,expires_at) VALUES('synthetic-pairing-hash','upgrade-workspace','upgrade-actor',now()+interval '10 minutes')",
      );
      const worker = (await stack.db.query('SELECT * FROM mkoro_workers')).rows;
      const tasks = (await stack.db.query('SELECT * FROM mkoro_tasks')).rows;
      const pairings = (await stack.db.query('SELECT * FROM mkoro_pairings')).rows;
      await runMigrations(stack.connectionString);
      assert.deepEqual((await stack.db.query('SELECT * FROM mkoro_workers')).rows, worker);
      assert.deepEqual((await stack.db.query('SELECT * FROM mkoro_tasks')).rows, tasks);
      assert.deepEqual(
        (await stack.db.query('SELECT * FROM mkoro_pairings')).rows,
        pairings.map((pairing) => ({
          ...pairing,
          reconnect_worker_id: null,
          reconnect_token_hash: null,
        })),
      );
      assert.equal(
        (await stack.db.query("SELECT role FROM workspace_members WHERE user_id='upgrade-actor'"))
          .rows[0].role,
        'editor',
      );
      await assert.rejects(
        stack.db.query("UPDATE mkoro_pairings SET reconnect_worker_id='missing-worker'"),
        { code: '23503' },
      );
      await runMigrations(stack.connectionString);
    } finally {
      await run.close();
    }
  },
);

test(
  'baseline adoption refuses schema drift and leaves legacy data unchanged',
  { timeout: 180000 },
  async () => {
    const run = createTestRun('database-drift');
    try {
      const stack = await startTestDatabase(run);
      await stack.db.query(
        await fs.readFile(path.join(migrationsFolder, '0000_phase2_baseline.sql'), 'utf8'),
      );
      await stack.db.query(
        'ALTER TABLE personal_workflow_libraries ALTER COLUMN revision DROP NOT NULL',
      );
      await stack.db.query(
        "INSERT INTO personal_workflow_libraries(workspace_hash,owner_id,payload) VALUES('legacy','anonymous','retained')",
      );
      await assert.rejects(
        runMigrations(stack.connectionString, 'baseline'),
        /differs from the Phase 2 baseline/,
      );
      assert.equal(
        (await stack.db.query('SELECT payload FROM personal_workflow_libraries')).rows[0].payload,
        'retained',
      );
      assert.equal(
        (await stack.db.query('SELECT count(*)::int AS n FROM drizzle.__drizzle_migrations'))
          .rows[0].n,
        0,
      );
    } finally {
      await run.close();
    }
  },
);

test(
  'baseline adoption accepts matching columns added in a different physical order',
  { timeout: 180000 },
  async () => {
    const run = createTestRun('database-column-order');
    try {
      const stack = await startTestDatabase(run);
      const baseline = await fs.readFile(
        path.join(migrationsFolder, '0000_phase2_baseline.sql'),
        'utf8',
      );
      const withoutLibraryFlag = baseline.replace(
        /\s*"in_library" boolean DEFAULT true NOT NULL,/,
        '',
      );
      assert.notEqual(withoutLibraryFlag, baseline);
      await stack.db.query(withoutLibraryFlag);
      await assert.rejects(
        runMigrations(stack.connectionString, 'baseline'),
        /differs from the Phase 2 baseline/,
      );
      await stack.db.query(
        'ALTER TABLE documents ADD COLUMN in_library boolean NOT NULL DEFAULT true',
      );
      const migrationCount = JSON.parse(
        await fs.readFile(path.join(migrationsFolder, 'meta/_journal.json'), 'utf8'),
      ).entries.length;
      assert.deepEqual(await runMigrations(stack.connectionString, 'baseline'), {
        applied: 1,
        total: migrationCount,
      });
      assert.deepEqual(await runMigrations(stack.connectionString), {
        applied: migrationCount,
        total: migrationCount,
      });
      assert.equal(
        (await stack.db.query('SELECT count(*)::int AS n FROM workspace_members')).rows[0].n,
        0,
      );
    } finally {
      await run.close();
    }
  },
);
