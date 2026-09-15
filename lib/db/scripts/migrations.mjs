import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { readMigrationFiles } from 'drizzle-orm/migrator';

export const migrationsFolder = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../migrations',
);

async function catalog(client, schema, tables) {
  // ALTER TABLE appends columns physically. Compare names and definitions,
  // not their storage order, when checking a semantically identical schema.
  const columns = await client.query(
    `SELECT c.relname AS table_name,a.attname AS column_name,
    format_type(a.atttypid,a.atttypmod) AS type,a.attnotnull AS not_null,
    pg_get_expr(d.adbin,d.adrelid) AS default_value FROM pg_attribute a
    JOIN pg_class c ON a.attrelid=c.oid JOIN pg_namespace n ON c.relnamespace=n.oid
    LEFT JOIN pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum
    WHERE n.nspname=$1 AND c.relname=ANY($2) AND a.attnum>0 AND NOT a.attisdropped
    ORDER BY c.relname,a.attname`,
    [schema, tables],
  );
  const constraints = await client.query(
    `SELECT c.relname AS table_name, con.conname,
    pg_get_constraintdef(con.oid) AS definition FROM pg_constraint con
    JOIN pg_class c ON c.oid=con.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname=$1 AND c.relname=ANY($2) ORDER BY c.relname, con.conname`,
    [schema, tables],
  );
  const indexes = await client.query(
    `SELECT tablename, indexname, indexdef FROM pg_indexes
    WHERE schemaname=$1 AND tablename=ANY($2) ORDER BY tablename,indexname`,
    [schema, tables],
  );
  return JSON.stringify([columns.rows, constraints.rows, indexes.rows]).replaceAll(
    schema + '.',
    'public.',
  );
}

/** Adopt only an exact Phase 2 schema. Never infer ownership or skip schema drift. */
async function baseline(client, migration) {
  const snapshot = JSON.parse(
    fs.readFileSync(path.join(migrationsFolder, 'meta/0000_snapshot.json'), 'utf8'),
  );
  const tables = Object.values(snapshot.tables).map((t) => t.name);
  const shadow = 'migration_check_' + randomUUID().replaceAll('-', '');
  await client.query('BEGIN');
  try {
    await client.query(`CREATE SCHEMA "${shadow}"`);
    await client.query(`SET LOCAL search_path TO "${shadow}", public`);
    for (const statement of migration.sql) {
      await client.query(statement.replaceAll('"public".', `"${shadow}".`));
    }
    // Search-path-independent constraint definitions, normalized above.
    await client.query('SET LOCAL search_path TO pg_catalog');
    const expected = await catalog(client, shadow, tables);
    const actual = await catalog(client, 'public', tables);
    if (expected !== actual)
      throw new Error(
        'Existing schema differs from the Phase 2 baseline. Review schema drift before adopting migrations.',
      );
  } finally {
    await client.query('ROLLBACK'); // Removes the comparison schema, including on failure.
  }
  await client.query('INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1,$2)', [
    migration.hash,
    migration.folderMillis,
  ]);
}

export async function runMigrations(connectionString, mode = 'migrate', folder = migrationsFolder) {
  if (!connectionString) throw new Error('DATABASE_URL is required for database migrations.');
  if (!['migrate', 'baseline', 'status'].includes(mode))
    throw new Error('Choose migrate, baseline or status.');
  const client = new pg.Client({ connectionString });
  await client.connect();
  try {
    await client.query("SELECT pg_advisory_lock(hashtext('taxflow:migrations'))");
    await client.query('CREATE SCHEMA IF NOT EXISTS drizzle');
    await client.query(
      'CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (id SERIAL PRIMARY KEY, hash text NOT NULL, created_at bigint)',
    );
    const migrations = readMigrationFiles({ migrationsFolder: folder });
    const { rows } = await client.query(
      'SELECT hash,created_at FROM drizzle.__drizzle_migrations ORDER BY created_at,id',
    );
    for (const [i, row] of rows.entries()) {
      if (
        !migrations[i] ||
        row.hash !== migrations[i].hash ||
        Number(row.created_at) !== migrations[i].folderMillis
      ) {
        throw new Error(
          'Migration history does not match the committed files. Do not edit or remove applied migrations.',
        );
      }
    }
    if (mode === 'baseline') {
      if (rows.length)
        throw new Error('Database already has migration history; baseline is not applicable.');
      await baseline(client, migrations[0]);
    } else if (mode === 'migrate') {
      await migrate(drizzle(client), { migrationsFolder: folder });
    }
    const applied = await client.query(
      'SELECT count(*)::int AS count FROM drizzle.__drizzle_migrations',
    );
    return { applied: applied.rows[0].count, total: migrations.length };
  } finally {
    await client.end(); // Also releases the advisory lock after errors.
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(await runMigrations(process.env.DATABASE_URL, process.argv[2] ?? 'migrate'));
}
