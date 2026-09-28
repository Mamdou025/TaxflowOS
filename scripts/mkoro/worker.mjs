import { randomUUID } from 'node:crypto';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const clip = (value, limit) => (typeof value === 'string' ? value.slice(0, limit) : '');
const terminalStatuses = new Set(['completed', 'failed']);
const terminalTaskEvents = new Set(['task_completed', 'task_failed', 'task_cancelled']);
const MAX_TASK_EVENTS = 10_000;

export function serverOrigin(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error('--server must be a valid Inscope origin.');
  }
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (
    (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== '/'
  )
    throw new Error('--server must be an HTTPS origin, or HTTP on localhost for development.');
  return url.origin;
}

export class WorkerApi {
  constructor({ server, token, fetchImpl = fetch }) {
    this.server = serverOrigin(server);
    this.token = token;
    this.fetchImpl = fetchImpl;
  }

  async post(endpoint, body) {
    let response;
    try {
      response = await this.fetchImpl(`${this.server}/api/mkoro-worker/${endpoint}`, {
        method: 'POST',
        redirect: 'error',
        signal: AbortSignal.timeout(15_000),
        headers: {
          'content-type': 'application/json',
          ...(this.token ? { authorization: `Bearer ${this.token}` } : {}),
        },
        body: JSON.stringify(body),
      });
    } catch {
      throw new Error('Cannot reach the configured Inscope server.');
    }
    if (!response.ok) {
      const error = new Error(`Inscope worker request failed (HTTP ${response.status}).`);
      error.status = response.status;
      throw error;
    }
    try {
      return await response.json();
    } catch {
      throw new Error('Inscope returned an invalid worker response.');
    }
  }
}

/** Display only bounded textual tool summaries, never screenshots, raw input, or resource contents. */
export function publicTool(tool = {}) {
  const content = Array.isArray(tool.content)
    ? tool.content
        .filter((item) => item?.type === 'content' && item.content?.type === 'text')
        .slice(0, 3)
        .map((item) => ({
          type: 'content',
          content: { type: 'text', text: clip(item.content.text, 1500) },
        }))
    : [];
  return {
    toolCallId: clip(tool.toolCallId, 200),
    title: clip(tool.title, 500),
    kind: clip(tool.kind, 80),
    status: clip(tool.status, 80),
    content,
  };
}

function redactText(value) {
  return value
    .replace(/\b(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]+/gi, '$1 [redacted]')
    .replace(
      /((?:api[_-]?key|token|password|secret|authorization|cookie)\s*(?:=|:)\s*)(?:"[^"]*"|'[^']*'|[^\s;,]+)/gi,
      '$1[redacted]',
    )
    .replace(/(https?:\/\/)[^/\s:@]+:[^/\s@]+@/gi, '$1[redacted]@');
}

/** A best-effort preview for informed approval; it is not a universal secret detector. */
export function publicPermissionTool(tool = {}) {
  let shortened = false;
  const redact = (value, depth = 0) => {
    if (depth > 4) {
      shortened = true;
      return '[nested content omitted]';
    }
    if (typeof value === 'string') {
      const text = redactText(value);
      if (text.length > 1600) shortened = true;
      return text.slice(0, 1600);
    }
    if (Array.isArray(value)) {
      if (value.length > 8) shortened = true;
      return value.slice(0, 8).map((item) => redact(item, depth + 1));
    }
    if (value && typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length > 24) shortened = true;
      return Object.fromEntries(
        entries
          .slice(0, 24)
          .map(([key, item]) => [
            key,
            /password|passcode|passphrase|secret|token|authorization|cookie|credential|api[_-]?key|private[_-]?key/i.test(
              key,
            ) || ['text', 'value', 'values', 'data', 'body'].includes(key.toLowerCase())
              ? '[redacted]'
              : redact(item, depth + 1),
          ]),
      );
    }
    return value;
  };
  let argumentsPreview =
    tool.rawInput === undefined
      ? 'Goose supplied no arguments preview.'
      : JSON.stringify(redact(tool.rawInput), null, 2);
  if (argumentsPreview.length > 2500) {
    shortened = true;
    argumentsPreview = `${argumentsPreview.slice(0, 2500)}\n[truncated]`;
  }
  const summary = publicTool(tool);
  summary.title = redactText(summary.title).slice(0, 160);
  summary.content = summary.content.slice(0, 1).map((item) => ({
    type: 'content',
    content: { type: 'text', text: redactText(item.content.text).slice(0, 500) },
  }));
  return {
    ...summary,
    argumentsPreview,
    argumentsNotice: `Sensitive fields and typed text are hidden. ${shortened ? 'Some arguments are truncated. ' : ''}Redaction may miss secrets; this preview is stored in Inscope. Reject if the visible details are insufficient.`,
  };
}

/** One local Goose prompt at a time, with independent polling for cancellation and approval. */
export class MkoroWorker {
  constructor({
    api,
    acp,
    workspace,
    sessions = {},
    saveSessions = async () => {},
    log = () => {},
  }) {
    this.api = api;
    this.acp = acp;
    this.workspace = workspace;
    this.sessions = new Map(Object.entries(sessions));
    this.loaded = new Set();
    this.saveSessions = saveSessions;
    this.log = log;
    this.outbox = [];
    this.handled = new Set();
    this.sequences = new Map();
    this.terminalTasks = new Set();
    this.permissions = new Map();
    this.active = null;
    this.stopping = false;
    acp.on('update', (params) => this.onUpdate(params));
    acp.on('permission', (request) => this.onPermission(request));
  }

  emit(taskId, type, payload) {
    if (this.terminalTasks.has(taskId)) return;
    const seq = this.sequences.get(taskId) ?? 0;
    const exhausted =
      (seq >= MAX_TASK_EVENTS - 1 || this.outbox.length >= MAX_TASK_EVENTS - 1) &&
      !terminalTaskEvents.has(type);
    if (exhausted) {
      // The API accepts at most 10,000 events per task. Reserve the final slot
      // for the failure itself, including when earlier progress was already delivered.
      type = 'task_failed';
      payload = {
        message:
          'Mkoro reached its progress event limit and stopped Goose. Some work may already have completed; inspect local results before retrying.',
      };
    }
    if (terminalTaskEvents.has(type)) this.terminalTasks.add(taskId);
    this.sequences.set(taskId, seq + 1);
    this.outbox.push({ id: randomUUID(), taskId, seq, type, payload });
    if (exhausted) {
      this.stopping = true;
      this.log(payload.message);
      this.acp.close();
    }
  }

  async flush() {
    if (!this.outbox.length) return;
    const batch = this.outbox.slice(0, 40);
    const result = await this.api.post('events', { events: batch });
    if (result?.ok !== true) throw new Error('Inscope did not acknowledge the event batch.');
    this.outbox.splice(0, batch.length);
  }

  async tick() {
    // Keep polls alive even with buffered progress, so a waiting tool can receive its decision.
    const result = await this.api.post('poll', {});
    if (!Array.isArray(result?.commands))
      throw new Error('Inscope returned invalid worker commands.');
    for (const command of result.commands) this.handle(command);
    await this.flush();
  }

  handle(command) {
    if (
      !command ||
      !UUID.test(command.id) ||
      !UUID.test(command.taskId) ||
      !['message', 'cancel', 'permission'].includes(command.type)
    )
      throw new Error('Inscope returned an unsupported worker command.');
    if (this.handled.has(command.id) || this.stopping) return;
    this.handled.add(command.id);
    const payload = command.payload ?? {};
    if (command.type === 'message') {
      if (
        typeof payload.message !== 'string' ||
        !payload.message.trim() ||
        payload.message.length > 16_000 ||
        !UUID.test(payload.conversationId)
      ) {
        this.emit(command.taskId, 'task_failed', { message: 'Invalid Mkoro message command.' });
        return;
      }
      if (this.active) {
        this.emit(command.taskId, 'task_failed', {
          message: 'This computer is already running a task. Send a new message after it finishes.',
        });
        return;
      }
      const active = {
        taskId: command.taskId,
        sessionId: null,
        cancelled: false,
        ready: false,
        tools: new Map(),
      };
      this.active = active;
      this.turn = this.runMessage(active, payload);
      // The turn handles failures itself; polling must remain available while it runs.
      this.turn.catch(() => {
        this.stopping = true;
        this.acp.close();
      });
    } else if (this.active?.taskId === command.taskId) {
      if (command.type === 'cancel') this.cancel();
      else this.decide(command.taskId, payload);
    }
  }

  async sessionFor(conversationId) {
    let sessionId = this.sessions.get(conversationId);
    let setup;
    if (sessionId && !this.loaded.has(sessionId)) {
      if (!this.acp.capabilities?.loadSession)
        throw new Error(
          'This Goose version cannot reload this chat. Update Goose or start a new Mkoro chat.',
        );
      setup = await this.acp.request('session/load', {
        sessionId,
        cwd: this.workspace,
        mcpServers: [],
      });
    } else if (!sessionId) {
      setup = await this.acp.request('session/new', { cwd: this.workspace, mcpServers: [] });
      if (typeof setup?.sessionId !== 'string' || !setup.sessionId)
        throw new Error('Goose did not return a session ID.');
      sessionId = setup.sessionId;
      this.sessions.set(conversationId, sessionId);
      await this.saveSessions(Object.fromEntries(this.sessions));
    }
    if (setup?.modes && !setup.modes.availableModes?.some((mode) => mode.id === 'approve'))
      throw new Error('This Goose version does not advertise manual approval mode.');
    // Reapply for each turn, including restored sessions, before any prompt is sent.
    await this.acp.request('session/set_mode', { sessionId, modeId: 'approve' });
    this.loaded.add(sessionId);
    return sessionId;
  }

  async runMessage(active, payload) {
    this.emit(active.taskId, 'task_started', {});
    try {
      active.sessionId = await this.sessionFor(payload.conversationId);
      if (active.cancelled || this.stopping) {
        this.emit(active.taskId, 'task_cancelled', { stopReason: 'cancelled_before_prompt' });
        return;
      }
      active.ready = true;
      const result = await this.acp.request(
        'session/prompt',
        {
          sessionId: active.sessionId,
          prompt: [{ type: 'text', text: payload.message }],
        },
        0,
      );
      if (result?.stopReason === 'cancelled')
        this.emit(active.taskId, 'task_cancelled', { stopReason: 'cancelled' });
      else if (result?.stopReason === 'end_turn')
        this.emit(active.taskId, 'task_completed', { stopReason: 'end_turn' });
      else
        this.emit(active.taskId, 'task_failed', {
          message: `Goose stopped without completing its turn (${clip(result?.stopReason, 80) || 'unknown reason'}). Inspect results before trying again.`,
        });
    } catch (error) {
      this.emit(active.taskId, 'task_failed', { message: clip(error.message, 1000) });
    } finally {
      this.cancelPermissions(active.taskId);
      if (this.active === active) this.active = null;
    }
  }

  onUpdate(params) {
    const active = this.active;
    if (!active?.ready || active.sessionId !== params?.sessionId) return;
    const update = params.update;
    if (!update) return;
    const changedMode =
      update.sessionUpdate === 'current_mode_update'
        ? update.currentModeId
        : update.sessionUpdate === 'config_option_update'
          ? update.configOptions?.find((option) => option.id === 'mode')?.currentValue
          : undefined;
    if (changedMode && changedMode !== 'approve') {
      this.cancel();
      this.acp.close();
      this.stopping = true;
      return;
    }
    if (update.sessionUpdate === 'agent_message_chunk' && update.content?.type === 'text') {
      const text = update.content.text;
      if (typeof text === 'string')
        for (let i = 0; i < text.length; i += 4000)
          this.emit(active.taskId, 'message_delta', { text: text.slice(i, i + 4000) });
    } else if (
      ['tool_call', 'tool_call_update'].includes(update.sessionUpdate) &&
      typeof update.toolCallId === 'string'
    ) {
      const previous = active.tools.get(update.toolCallId) ?? {};
      const tool = { ...previous, ...update };
      active.tools.set(update.toolCallId, tool);
      this.emit(
        active.taskId,
        terminalStatuses.has(tool.status) ? 'tool_finished' : 'tool_started',
        publicTool(tool),
      );
    }
  }

  onPermission(request) {
    const active = this.active;
    const params = request.params;
    const options = (Array.isArray(params?.options) ? params.options : [])
      .filter(
        (option) =>
          ['allow_once', 'reject_once'].includes(option?.kind) &&
          typeof option.optionId === 'string' &&
          option.optionId.length > 0 &&
          option.optionId.length <= 200,
      )
      .slice(0, 8)
      .map((option) => ({
        optionId: option.optionId,
        name: clip(option.name, 100),
        kind: option.kind,
      }));
    if (
      !active?.ready ||
      active.cancelled ||
      active.sessionId !== params?.sessionId ||
      !options.length
    ) {
      this.acp.respond(request.id, { outcome: { outcome: 'cancelled' } });
      return;
    }
    const requestId = randomUUID();
    this.permissions.set(requestId, { rpcId: request.id, taskId: active.taskId, options });
    this.emit(active.taskId, 'permission_required', {
      requestId,
      toolCall: publicPermissionTool(params.toolCall),
      options,
    });
  }

  decide(taskId, payload) {
    const pending = this.permissions.get(payload.requestId);
    if (
      !pending ||
      pending.taskId !== taskId ||
      !pending.options.some((option) => option.optionId === payload.optionId)
    )
      return;
    this.permissions.delete(payload.requestId);
    this.acp.respond(pending.rpcId, {
      outcome: { outcome: 'selected', optionId: payload.optionId },
    });
  }

  cancelPermissions(taskId) {
    for (const [requestId, pending] of this.permissions)
      if (pending.taskId === taskId) {
        this.permissions.delete(requestId);
        if (!this.acp.closed)
          this.acp.respond(pending.rpcId, { outcome: { outcome: 'cancelled' } });
      }
  }

  cancel() {
    if (!this.active) return;
    this.active.cancelled = true;
    this.cancelPermissions(this.active.taskId);
    if (this.active.sessionId && !this.acp.closed)
      this.acp.notify('session/cancel', { sessionId: this.active.sessionId });
  }

  async stop() {
    this.stopping = true;
    this.cancel();
    if (this.turn) {
      let timer;
      await Promise.race([
        this.turn,
        new Promise((resolve) => {
          timer = setTimeout(resolve, 3000);
        }),
      ]);
      clearTimeout(timer);
    }
    this.acp.close();
    await this.turn;
  }
}
