import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { randomBytes } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { apiRoot, root, assertRunPath, reserveLoopbackPort } from './runtime.mjs';

const dbRequire = createRequire(path.join(root, 'lib/db/package.json'));
const { Client } = dbRequire('pg');

export async function startTestDatabase(run) {
  const container = `taxflow-test-${run.id}`;
  const label = 'com.taxflow.test-run';
  const database = `test_${run.id.replaceAll('-', '_')}`;
  const password = randomBytes(24).toString('hex');
  await run.command('docker', ['version', '--format', '{{.Server.Version}}'], { log: 'docker' });
  // No named volumes or supplied DATABASE_URL: the container owns disposable data.
  run.cleanup.push(async () => {
    const present = await run.command(
      'docker',
      ['ps', '--all', '--filter', `name=^/${container}$`, '--format', '{{.Names}}'],
      { log: 'cleanup' },
    );
    if (!present.trim()) return;
    const owner = (
      await run.command(
        'docker',
        ['inspect', '--format', `{{index .Config.Labels "${label}"}}`, container],
        { log: 'cleanup' },
      )
    ).trim();
    if (owner !== run.id)
      throw new Error('Refusing to remove a container owned by another test run');
    await run.command('docker', ['rm', '--force', '--volumes', container], { log: 'cleanup' });
  });
  await run.command(
    'docker',
    [
      'run',
      '--detach',
      '--name',
      container,
      '--label',
      `${label}=${run.id}`,
      '--publish',
      '127.0.0.1::5432',
      '--env',
      `POSTGRES_DB=${database}`,
      '--env',
      'POSTGRES_USER=postgres',
      '--env',
      `POSTGRES_PASSWORD=${password}`,
      'pgvector/pgvector:pg16',
    ],
    { log: 'postgres-start' },
  );
  const mapping = (
    await run.command('docker', ['port', container, '5432/tcp'], { log: 'postgres-port' })
  ).trim();
  if (!/^127\.0\.0\.1:\d+$/.test(mapping))
    throw new Error('Postgres must publish only a local ephemeral port');
  const connectionString = `postgres://postgres:${password}@${mapping}/${database}`;
  const deadline = Date.now() + 60000;
  let connected = false;
  while (Date.now() < deadline) {
    const probe = new Client({ connectionString, connectionTimeoutMillis: 1000 });
    try {
      await probe.connect();
      connected = true;
    } catch {
      /* Postgres is still starting. */
    } finally {
      await probe.end();
    }
    if (connected) break;
    await delay(250);
  }
  if (!connected) throw new Error('Disposable Postgres did not become ready');
  const db = new Client({ connectionString });
  await db.connect();
  run.cleanup.push(() => db.end());
  return { connectionString, db, container };
}

export async function startTestStack(run) {
  const { connectionString, db, container } = await startTestDatabase(run);
  const webPort = await reserveLoopbackPort();
  const origin = 'http://127.0.0.1:' + webPort;
  const extraEnv = {
    DATABASE_URL: connectionString,
    PORT: '0',
    NODE_ENV: 'production',
    LOG_LEVEL: 'warn',
    BETTER_AUTH_SECRET: randomBytes(48).toString('hex'),
    APP_ORIGIN: origin,
  };
  await run.command(process.execPath, ['scripts/migrations.mjs', 'migrate'], {
    cwd: path.join(root, 'lib/db'),
    extraEnv,
    log: 'schema',
  });
  const build = assertRunPath(
    path.join(apiRoot, '.test-builds'),
    path.join(apiRoot, '.test-builds', run.id),
  );
  run.cleanup.push(() => fs.rm(build, { recursive: true, force: true }));
  await run.command(process.execPath, ['build.mjs'], { cwd: apiRoot, extraEnv, log: 'api-build' });
  let api;
  let baseURL;
  async function restartApi() {
    if (api) await run.stop(api);
    api = run.start(process.execPath, [path.join(build, 'index.mjs')], {
      cwd: apiRoot,
      extraEnv,
      log: 'api',
      ipc: true,
    });
    baseURL = await run.ready(api);
    return baseURL;
  }
  await restartApi();
  return {
    db,
    container,
    origin,
    webPort,
    restartApi,
    get baseURL() {
      return baseURL;
    },
  };
}
