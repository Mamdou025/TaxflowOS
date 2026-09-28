import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash, randomUUID } from 'node:crypto';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { setTimeout as delay } from 'node:timers/promises';
import { AcpClient } from './acp-client.mjs';
import { MkoroWorker, WorkerApi, serverOrigin } from './worker.mjs';

export const HELP = `Mkoro local Goose companion

node scripts/mkoro/companion.mjs --server https://your-inscope-host --workspace "C:\\Users\\Mamad\\Mkoro"

--server     Inscope origin (HTTPS; HTTP allowed only on localhost)
--workspace  Existing local working folder for Goose; this is not a sandbox
--goose      Goose CLI executable or absolute executable path (default: goose)
--goose-config  Folder containing the existing Goose config.yaml (auto-detected by default)
--name       Computer name displayed in Inscope (default: Mkoro on this hostname)
--state      Local credentials/session mapping file (default: user profile)
--pair       Pair again with a fresh one-time code from Inscope
--help       Show this help

The first run prompts for a pairing token. MKORO_PAIRING_TOKEN is also supported.
Keep this process running. Ctrl+C requests cancellation and stops the companion.
`;

export function parseOptions(args) {
  const { values } = parseArgs({
    args,
    options: {
      server: { type: 'string' },
      workspace: { type: 'string' },
      goose: { type: 'string' },
      'goose-config': { type: 'string' },
      name: { type: 'string' },
      state: { type: 'string' },
      pair: { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
    },
  });
  if (values.help) return values;
  if (!values.server || !values.workspace)
    throw new Error('Provide --server and --workspace. Use --help for an example.');
  const server = serverOrigin(values.server);
  const workspace = path.resolve(values.workspace);
  const identity = createHash('sha256')
    .update(`${server}\n${workspace}`)
    .digest('hex')
    .slice(0, 16);
  const directory =
    process.platform === 'win32' && process.env.LOCALAPPDATA
      ? path.join(process.env.LOCALAPPDATA, 'Mkoro')
      : path.join(os.homedir(), '.mkoro');
  const name = (values.name ?? `Mkoro on ${os.hostname()}`).trim();
  if (!name || name.length > 100) throw new Error('--name must contain 1 to 100 characters.');
  return {
    ...values,
    server,
    workspace,
    name,
    goose: values.goose || 'goose',
    state: path.resolve(values.state ?? path.join(directory, identity, 'worker.json')),
  };
}

export function gooseConfigDirectory({
  env = process.env,
  platform = process.platform,
  home = os.homedir(),
} = {}) {
  if (env.GOOSE_PATH_ROOT && path.isAbsolute(env.GOOSE_PATH_ROOT))
    return path.join(env.GOOSE_PATH_ROOT, 'config');
  if (platform === 'win32')
    return path.join(
      env.APPDATA ?? path.join(home, 'AppData', 'Roaming'),
      'Block',
      'goose',
      'config',
    );
  return path.join(env.XDG_CONFIG_HOME ?? path.join(home, '.config'), 'goose');
}

/** Keep model/extensions, but keep this bridge's approval grants and sessions separate. */
export async function prepareGooseProfile(sourceDirectory, rootDirectory) {
  const source = path.resolve(sourceDirectory);
  const target = path.join(path.resolve(rootDirectory), 'config');
  if (source === target)
    throw new Error(
      '--goose-config must point to the original Goose configuration, not the private Mkoro profile.',
    );
  await fs.mkdir(target, { recursive: true, mode: 0o700 });
  for (const name of ['config.yaml', 'secrets.yaml']) {
    let contents;
    try {
      contents = await fs.readFile(path.join(source, name));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      if (name === 'config.yaml')
        throw new Error(
          'Goose config.yaml was not found. Configure Goose first or provide --goose-config.',
        );
      await fs.rm(path.join(target, name), { force: true });
      continue;
    }
    await fs.writeFile(path.join(target, name), contents, { mode: 0o600 });
  }
  // Approve mode still honors saved AlwaysAllow grants. A fresh private permission store
  // is therefore required; modifying the user's ordinary Goose permission file is avoided.
  await fs.writeFile(path.join(target, 'permission.yaml'), '{}\n', { mode: 0o600 });
  return { GOOSE_PATH_ROOT: path.resolve(rootDirectory), GOOSE_MODE: 'approve' };
}

export async function writeState(filename, state) {
  await fs.mkdir(path.dirname(filename), { recursive: true, mode: 0o700 });
  const temporary = `${filename}.${randomUUID()}.tmp`;
  try {
    await fs.writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, {
      mode: 0o600,
      flag: 'wx',
    });
    await fs.rename(temporary, filename);
  } catch (error) {
    await fs.rm(temporary, { force: true });
    throw error;
  }
}

export async function acquireLock(filename) {
  await fs.mkdir(path.dirname(filename), { recursive: true, mode: 0o700 });
  const lockPath = `${filename}.lock`;
  let lock;
  try {
    lock = await fs.open(lockPath, 'wx', 0o600);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    throw new Error(
      `A companion lock already exists at ${lockPath}. Stop the other companion. If it crashed, confirm it is no longer running before removing this lock file.`,
    );
  }
  await lock.writeFile(String(process.pid));
  return async () => {
    await lock.close();
    await fs.rm(lockPath, { force: true });
  };
}

async function readPairingToken() {
  if (process.env.MKORO_PAIRING_TOKEN) {
    const token = process.env.MKORO_PAIRING_TOKEN.trim();
    delete process.env.MKORO_PAIRING_TOKEN;
    return token;
  }
  let muted = false;
  const output = new Writable({
    write(chunk, _encoding, callback) {
      if (!muted) process.stdout.write(chunk);
      callback();
    },
  });
  output.isTTY = process.stdout.isTTY;
  output.columns = process.stdout.columns;
  const terminal = createInterface({
    input: process.stdin,
    output,
    terminal: Boolean(process.stdin.isTTY),
  });
  try {
    const answer = terminal.question('Paste the one-time pairing token from Inscope: ');
    muted = true;
    return (await answer).trim();
  } finally {
    terminal.close();
    process.stdout.write('\n');
  }
}

export async function main(args = process.argv.slice(2)) {
  const options = parseOptions(args);
  if (options.help) {
    process.stdout.write(HELP);
    return;
  }
  const workspace = await fs.stat(options.workspace).catch(() => null);
  if (!workspace?.isDirectory()) throw new Error('--workspace must be an existing local folder.');
  const releaseLock = await acquireLock(options.state);
  let worker;
  let acp;
  let state;
  const shutdown = new AbortController();
  const onSignal = () => shutdown.abort();
  process.on('SIGINT', onSignal);
  process.on('SIGTERM', onSignal);
  try {
    try {
      const contents = await fs.readFile(options.state, 'utf8');
      if (contents.length > 1_000_000) throw new Error('Invalid saved Mkoro state.');
      try {
        state = JSON.parse(contents);
      } catch {
        throw new Error('Saved Mkoro state is not valid JSON.');
      }
      if (
        state.version !== 1 ||
        typeof state.token !== 'string' ||
        !state.token ||
        state.server !== options.server ||
        state.workspace !== options.workspace
      )
        throw new Error(
          'Saved Mkoro state does not match this server/workspace. Use a different --state file.',
        );
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }

    // Check ACP support before consuming a one-time pairing token. This does not submit a model prompt.
    const profileRoot = `${options.state}.goose`;
    const profileEnv = await prepareGooseProfile(
      options['goose-config'] ?? gooseConfigDirectory(),
      profileRoot,
    );
    acp = new AcpClient({
      executable: options.goose,
      cwd: options.workspace,
      env: { ...process.env, ...profileEnv },
    });
    await acp.start();
    const api = new WorkerApi({ server: options.server, token: state?.token });
    if (!state || options.pair || process.env.MKORO_PAIRING_TOKEN) {
      const pairingToken = await readPairingToken();
      if (pairingToken.length < 40 || pairingToken.length > 200)
        throw new Error('The pairing token is incomplete. Generate a fresh code in Inscope.');
      api.token = undefined;
      const result = await api.post('pair', {
        pairingToken,
        name: options.name,
        capabilities: ['goose-acp', 'manual-approval', 'text-chat', 'tool-progress'],
      });
      if (typeof result?.token !== 'string' || !result.token || typeof result.workerId !== 'string')
        throw new Error('Inscope returned invalid pairing credentials.');
      state = {
        version: 1,
        server: options.server,
        workspace: options.workspace,
        workerId: result.workerId,
        token: result.token,
        sessions: {},
        pollIntervalMs: result.pollIntervalMs,
      };
      await writeState(options.state, state);
      api.token = state.token;
    }
    worker = new MkoroWorker({
      api,
      acp,
      workspace: options.workspace,
      sessions: state.sessions ?? {},
      saveSessions: async (sessions) => {
        state.sessions = sessions;
        await writeState(options.state, state);
      },
    });
    acp.on('disconnect', () => {
      shutdown.abort();
    });
    console.log('Mkoro is connected. Open its chat in Inscope; keep this terminal running.');
    console.log(`Working folder: ${options.workspace}`);
    console.log('Goose manual approval is required for every turn. Review requests in Inscope.');
    const interval = Math.min(5000, Math.max(500, Number(state.pollIntervalMs) || 1500));
    let lastContact = Date.now();
    let warned = false;
    while (!shutdown.signal.aborted && !worker.stopping) {
      try {
        await worker.tick();
        lastContact = Date.now();
        if (warned) console.log('Connection restored. Buffered progress has resumed.');
        warned = false;
      } catch (error) {
        if ([400, 401, 403, 404, 409, 413, 422].includes(error.status)) throw error;
        if (Date.now() - lastContact >= 45_000)
          throw new Error(
            'Inscope has been unreachable for 45 seconds. Stopping Goose; inspect any partial work before retrying.',
          );
        if (!warned)
          console.warn(
            'Inscope is temporarily unreachable. Retrying progress delivery; prompts are not replayed.',
          );
        warned = true;
      }
      await delay(interval, undefined, { signal: shutdown.signal }).catch(() => {});
    }
  } finally {
    process.off('SIGINT', onSignal);
    process.off('SIGTERM', onSignal);
    if (worker) {
      await worker.stop();
      // Best effort only. Revocation/network loss must not keep the local process running.
      try {
        while (worker.outbox.length) await worker.flush();
      } catch {
        console.warn(
          'Some final progress could not be delivered. Check the local results before another run.',
        );
      }
    } else acp?.close();
    await releaseLock();
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
