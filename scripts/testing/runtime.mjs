import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import net from 'node:net';
import { configurationProblems, runtimeProblems } from '../check-toolchain.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const apiRoot = path.join(root, 'artifacts/api-server');
export const webRoot = path.join(root, 'artifacts/ai-workflow-builder');

export async function reserveLoopbackPort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const port = server.address().port;
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  return port;
}

export function isolatedEnvironment(extra = {}, source = process.env) {
  // Inherit OS/tool locations, never provider credentials or an ambient database.
  const allowed =
    /^(path|systemroot|windir|comspec|pathext|temp|tmp|tmpdir|home|userprofile|appdata|localappdata|programfiles|programfiles\(x86\)|commonprogramfiles|homedrive|homepath|lang|lc_all|ci|docker_host|docker_context|docker_config|docker_tls_verify|docker_cert_path|playwright_browsers_path)$/i;
  return {
    ...Object.fromEntries(Object.entries(source).filter(([key]) => allowed.test(key))),
    ...extra,
  };
}

export function assertRunPath(parent, target) {
  const relative = path.relative(parent, target);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Test output must be below ${parent}`);
  }
  return target;
}

export function createTestRun(kind) {
  const problems = [
    ...configurationProblems(),
    ...runtimeProblems(process.versions.node, process.env.npm_config_user_agent),
  ];
  if (problems.length) throw new Error(problems.join('\n'));
  const workspace = createHash('sha256').update(fs.realpathSync(root)).digest('hex').slice(0, 8);
  const id = `${workspace}-${randomUUID()}`;
  const output = assertRunPath(
    path.join(root, 'test-results/phase2'),
    path.join(root, 'test-results/phase2', id),
  );
  fs.mkdirSync(output, { recursive: true });
  const children = new Set();
  const cleanup = [];
  let closing;
  const env = isolatedEnvironment({
    TAXFLOW_TEST_RUN_ID: id,
    NODE_ENV: 'test',
    INGEST_WORKER: '0',
  });

  function start(command, args, { cwd = root, extraEnv = {}, log = 'process', ipc = false } = {}) {
    const stream = fs.createWriteStream(path.join(output, `${log}.log`), { flags: 'a' });
    const child = spawn(command, args, {
      cwd,
      env: { ...env, ...extraEnv },
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe', ...(ipc ? ['ipc'] : [])],
    });
    let stdout = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
      stream.write(chunk);
    });
    child.stderr.on('data', (chunk) => stream.write(chunk));
    children.add(child);
    const done = new Promise((resolve, reject) => {
      child.once('error', reject);
      child.once('close', (code, signal) => {
        children.delete(child);
        stream.end();
        if (code === 0) resolve(stdout);
        else
          reject(
            new Error(`${log} exited ${code ?? signal}; see ${path.join(output, `${log}.log`)}`),
          );
      });
    });
    // Long-lived children may exit before their owner awaits readiness/cleanup.
    done.catch(() => {});
    return { child, done };
  }

  async function command(command, args, options) {
    return start(command, args, options).done;
  }

  async function ready(process, timeoutMs = 120000) {
    let timer;
    try {
      return await Promise.race([
        once(process.child, 'message').then(([message]) => {
          if (
            message?.type !== 'taxflow-test-ready' ||
            message.runId !== id ||
            !Number.isInteger(message.port) ||
            message.port <= 0
          )
            throw new Error('Invalid test server readiness message');
          return `http://127.0.0.1:${message.port}`;
        }),
        process.done.then(() => {
          throw new Error('Test server exited before readiness');
        }),
        new Promise((_, reject) => {
          timer = setTimeout(
            () => reject(new Error(`Test server readiness timed out; see ${output}`)),
            timeoutMs,
          );
        }),
      ]);
    } finally {
      clearTimeout(timer);
    }
  }

  async function stop(process) {
    if (process.child.exitCode !== null || process.child.signalCode !== null) return;
    process.child.kill('SIGTERM');
    let timer;
    await Promise.race([
      process.done.catch(() => {}),
      new Promise((resolve) => {
        timer = setTimeout(() => {
          process.child.kill('SIGKILL');
          resolve();
        }, 5000);
      }),
    ]);
    clearTimeout(timer);
  }

  async function close() {
    return (closing ??= (async () => {
      for (const child of [...children]) await stop({ child, done: once(child, 'close') });
      const failures = [];
      for (const fn of cleanup.reverse()) {
        try {
          await fn();
        } catch (error) {
          failures.push(error);
        }
      }
      if (failures.length) throw new AggregateError(failures, 'Test cleanup failed');
    })());
  }

  fs.writeFileSync(
    path.join(output, 'run.json'),
    JSON.stringify({ kind, id, workspace, startedAt: new Date().toISOString() }, null, 2),
  );
  return { id, output, env, command, start, ready, stop, close, cleanup };
}
