import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { acquireLock, parseOptions, prepareGooseProfile, writeState } from './companion.mjs';

test('local startup options require explicit origin/folder and reject command-line tokens', () => {
  assert.throws(() => parseOptions([]), /--server and --workspace/);
  assert.throws(() =>
    parseOptions(['--server', 'https://example.com', '--workspace', '.', '--token', 'secret']),
  );
  const options = parseOptions([
    '--server',
    'http://localhost:3001',
    '--workspace',
    '.',
    '--goose',
    'C:\\Goose Folder\\goose.exe',
  ]);
  assert.equal(options.server, 'http://localhost:3001');
  assert.equal(options.workspace, process.cwd());
  assert.equal(options.goose, 'C:\\Goose Folder\\goose.exe');
  assert.equal(path.isAbsolute(options.state), true);
});

test('private Goose profile preserves settings but cannot inherit saved permanent approvals', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mkoro-profile-test-'));
  const source = path.join(directory, 'source');
  const target = path.join(directory, 'target');
  await fs.mkdir(source);
  try {
    await fs.writeFile(path.join(source, 'config.yaml'), 'GOOSE_PROVIDER: test-provider\n');
    await fs.writeFile(path.join(source, 'secrets.yaml'), 'test: private-placeholder\n');
    await fs.writeFile(path.join(source, 'permission.yaml'), 'user:\n  always_allow: [shell]\n');
    const env = await prepareGooseProfile(source, target);
    assert.equal(env.GOOSE_PATH_ROOT, target);
    assert.equal(env.GOOSE_MODE, 'approve');
    assert.equal(
      await fs.readFile(path.join(target, 'config', 'config.yaml'), 'utf8'),
      'GOOSE_PROVIDER: test-provider\n',
    );
    assert.equal(await fs.readFile(path.join(target, 'config', 'permission.yaml'), 'utf8'), '{}\n');
    assert.match(await fs.readFile(path.join(source, 'permission.yaml'), 'utf8'), /always_allow/);
    await fs.rm(path.join(source, 'secrets.yaml'));
    await prepareGooseProfile(source, target);
    await assert.rejects(fs.stat(path.join(target, 'config', 'secrets.yaml')), { code: 'ENOENT' });
  } finally {
    for (const base of [source, path.join(target, 'config')]) {
      for (const name of ['config.yaml', 'secrets.yaml', 'permission.yaml'])
        await fs.rm(path.join(base, name), { force: true });
      await fs.rmdir(base);
    }
    await fs.rmdir(target);
    await fs.rmdir(directory);
  }
});

test('state writes replace atomically and lock prevents two companions sharing credentials', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mkoro-worker-test-'));
  const stateFile = path.join(directory, 'worker.json');
  try {
    const release = await acquireLock(stateFile);
    await assert.rejects(acquireLock(stateFile), /companion lock already exists/);
    await writeState(stateFile, { token: 'first-token', sessions: {} });
    await writeState(stateFile, { token: 'next-token', sessions: { chat: 'session' } });
    assert.deepEqual(JSON.parse(await fs.readFile(stateFile, 'utf8')), {
      token: 'next-token',
      sessions: { chat: 'session' },
    });
    assert.deepEqual((await fs.readdir(directory)).sort(), ['worker.json', 'worker.json.lock']);
    await release();
    const releaseAgain = await acquireLock(stateFile);
    await releaseAgain();
  } finally {
    await fs.rm(stateFile, { force: true });
    await fs.rm(`${stateFile}.lock`, { force: true });
    await fs.rmdir(directory);
  }
});
