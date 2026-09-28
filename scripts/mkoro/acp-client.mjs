import { spawn } from 'node:child_process';
import { EventEmitter } from 'node:events';

const MAX_LINE_BYTES = 8 * 1024 * 1024;

/** A stdio ACP client. The executable and cwd come only from local startup options. */
export class AcpClient extends EventEmitter {
  constructor({ executable = 'goose', cwd, spawnProcess = spawn, env = process.env } = {}) {
    super();
    this.executable = executable;
    this.cwd = cwd;
    this.spawnProcess = spawnProcess;
    this.env = env;
    this.pending = new Map();
    this.nextId = 1;
    this.buffer = '';
    this.closed = false;
  }

  async start() {
    const env = { ...this.env, GOOSE_MODE: 'approve' };
    delete env.MKORO_PAIRING_TOKEN;
    delete env.MKORO_WORKER_TOKEN;
    this.child = this.spawnProcess(this.executable, ['acp'], {
      cwd: this.cwd,
      env,
      shell: false,
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    this.child.stdout.setEncoding('utf8');
    this.child.stdout.on('data', (chunk) => this.consume(chunk));
    // Logs can contain credentials, account data, or full tool arguments. Do not forward them.
    this.child.stderr.resume();
    this.child.stdin.on('error', () => this.fail(new Error('The Goose ACP input pipe closed.')));
    this.child.once('error', () =>
      this.fail(
        new Error('Could not start Goose. Install a Goose CLI with ACP support and check --goose.'),
      ),
    );
    this.child.once('close', () =>
      this.fail(
        new Error(
          'Goose stopped. The task outcome may be incomplete; inspect results before retrying.',
        ),
      ),
    );
    const result = await this.request('initialize', {
      protocolVersion: 1,
      clientCapabilities: {},
      clientInfo: { name: 'inscope-mkoro', title: 'Inscope Mkoro companion', version: '1.0.0' },
    });
    if (result?.protocolVersion !== 1) {
      this.close();
      throw new Error('This Goose version does not support ACP protocol version 1.');
    }
    this.capabilities = result.agentCapabilities ?? {};
    return result;
  }

  consume(chunk) {
    if (this.closed) return;
    this.buffer += chunk;
    for (;;) {
      const newline = this.buffer.indexOf('\n');
      if (newline < 0) break;
      const line = this.buffer.slice(0, newline).trim();
      this.buffer = this.buffer.slice(newline + 1);
      if (!line) continue;
      if (Buffer.byteLength(line) > MAX_LINE_BYTES) {
        this.fail(new Error('Goose sent an ACP message above the supported size limit.'));
        return;
      }
      let message;
      try {
        message = JSON.parse(line);
      } catch {
        this.fail(new Error('Goose stdout was not valid ACP JSON. Check the CLI version.'));
        return;
      }
      if (!message || message.jsonrpc !== '2.0') {
        this.fail(new Error('Goose sent an invalid ACP envelope.'));
        return;
      }
      this.dispatch(message);
    }
    if (Buffer.byteLength(this.buffer) > MAX_LINE_BYTES)
      this.fail(new Error('Goose sent an ACP message above the supported size limit.'));
  }

  dispatch(message) {
    if (typeof message.method === 'string') {
      if (message.id !== undefined) {
        if (message.method === 'session/request_permission') this.emit('permission', message);
        else
          this.respondError(message.id, -32601, 'This Mkoro client does not support that method.');
      } else if (message.method === 'session/update') this.emit('update', message.params);
      return;
    }
    const pending = this.pending.get(message.id);
    if (!pending) return;
    this.pending.delete(message.id);
    clearTimeout(pending.timer);
    if (message.error) {
      // The arbitrary error data/message can include provider secrets. Keep the method and code.
      pending.reject(
        new Error(
          `Goose rejected ${pending.method} (ACP ${Number(message.error.code) || 'error'}). Check local Goose configuration.`,
        ),
      );
    } else pending.resolve(message.result);
  }

  send(message) {
    if (this.closed || !this.child?.stdin.writable) throw new Error('Goose ACP is not connected.');
    this.child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', ...message })}\n`);
  }

  request(method, params, timeoutMs = 60_000) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer =
        timeoutMs > 0
          ? setTimeout(() => {
              this.pending.delete(id);
              reject(new Error(`Goose ${method} timed out. No prompt was automatically retried.`));
            }, timeoutMs)
          : undefined;
      this.pending.set(id, { resolve, reject, timer, method });
      try {
        this.send({ id, method, params });
      } catch (error) {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(error);
      }
    });
  }

  notify(method, params) {
    this.send({ method, params });
  }
  respond(id, result) {
    this.send({ id, result });
  }
  respondError(id, code, message) {
    this.send({ id, error: { code, message } });
  }

  fail(error) {
    if (this.closed) return;
    this.closed = true;
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(error);
    }
    this.pending.clear();
    this.child?.kill();
    this.emit('disconnect', error);
  }

  close() {
    this.fail(new Error('Mkoro companion stopped; any unfinished task needs review.'));
  }
}
