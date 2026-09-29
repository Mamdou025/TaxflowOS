import { execFile } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./capture-windows.ps1', import.meta.url));
const MAX_BYTES = 512 * 1024;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Only the companion's interactive Windows desktop. No frame is written to disk. */
export function captureDesktop({
  signal,
  platform = process.platform,
  env = process.env,
  execute = execFile,
} = {}) {
  if (platform !== 'win32') return Promise.reject(new Error('SCREEN_UNSUPPORTED'));
  if (signal?.aborted) return Promise.reject(new Error('SCREEN_CANCELLED'));
  const executable = path.win32.join(
    env.SystemRoot || 'C:\\Windows',
    'System32',
    'WindowsPowerShell',
    'v1.0',
    'powershell.exe',
  );
  return new Promise((resolve, reject) => {
    execute(
      executable,
      ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', script],
      { windowsHide: true, shell: false, signal, timeout: 7000, maxBuffer: 800_000 },
      (error, stdout) => {
        if (error) {
          reject(new Error(signal?.aborted ? 'SCREEN_CANCELLED' : 'SCREEN_UNAVAILABLE'));
          return;
        }
        try {
          const frame = JSON.parse(stdout);
          if (
            frame.mimeType !== 'image/jpeg' ||
            typeof frame.data !== 'string' ||
            frame.data.length > Math.ceil(MAX_BYTES / 3) * 4 ||
            !/^[A-Za-z0-9+/]+={0,2}$/.test(frame.data) ||
            ![frame.width, frame.height].every(
              (value) => Number.isInteger(value) && value > 0 && value <= 1920,
            ) ||
            !Number.isFinite(Date.parse(frame.capturedAt))
          )
            throw new Error('invalid');
          const bytes = Buffer.from(frame.data, 'base64');
          if (
            bytes.length > MAX_BYTES ||
            bytes.length < 4 ||
            bytes[0] !== 0xff ||
            bytes[1] !== 0xd8 ||
            bytes.at(-2) !== 0xff ||
            bytes.at(-1) !== 0xd9
          )
            throw new Error('invalid');
          resolve({
            mimeType: 'image/jpeg',
            data: frame.data,
            width: frame.width,
            height: frame.height,
            capturedAt: new Date(frame.capturedAt).toISOString(),
          });
        } catch {
          reject(new Error('SCREEN_UNAVAILABLE'));
        }
      },
    );
  });
}

/** Separate transient transport. Polling, task history and model context never carry frames. */
export class DesktopScreenshots {
  constructor({ api, getActive, capture = captureDesktop, now = Date.now, timers = globalThis }) {
    this.api = api;
    this.getActive = getActive;
    this.capture = capture;
    this.now = now;
    this.timers = timers;
    this.lease = null;
    this.controller = null;
    this.pending = null;
  }

  eligible(lease = this.lease) {
    const active = this.getActive();
    return Boolean(
      lease &&
      active?.ready &&
      !active.cancelled &&
      active.taskId === lease.taskId &&
      Date.parse(lease.expiresAt) > this.now(),
    );
  }

  update(lease) {
    const expiry = Date.parse(lease?.expiresAt);
    if (
      !UUID.test(lease?.taskId) ||
      !UUID.test(lease?.leaseId) ||
      !Number.isFinite(expiry) ||
      expiry <= this.now() ||
      expiry > this.now() + 15_000 ||
      !this.eligible(lease)
    ) {
      this.stop();
      return;
    }
    const changed = this.lease?.leaseId !== lease.leaseId || this.lease?.taskId !== lease.taskId;
    if (changed) this.stop();
    this.lease = lease;
    this.timers.clearTimeout(this.expiryTimer);
    this.expiryTimer = this.timers.setTimeout(() => this.stop(), expiry - this.now());
    this.expiryTimer?.unref?.();
    if (!this.pending && !this.nextTimer) this.startCapture();
  }

  startCapture() {
    if (!this.eligible() || this.pending) return;
    const leaseId = this.lease.leaseId;
    const taskId = this.lease.taskId;
    const controller = new AbortController();
    this.controller = controller;
    const current = () =>
      !controller.signal.aborted && this.lease?.leaseId === leaseId && this.eligible();
    this.pending = (async () => {
      let payload;
      try {
        const frame = await this.capture({ signal: controller.signal });
        payload = { frame };
      } catch (error) {
        payload = {
          error: {
            code:
              error.message === 'SCREEN_UNSUPPORTED' ? 'SCREEN_UNSUPPORTED' : 'SCREEN_UNAVAILABLE',
            message:
              error.message === 'SCREEN_UNSUPPORTED'
                ? 'Desktop viewing currently requires the Windows companion.'
                : 'The desktop could not be captured. Keep the companion in an unlocked Windows desktop session.',
          },
        };
      }
      if (!current()) return;
      try {
        await this.api.post(
          'screen',
          { taskId, leaseId, ...payload },
          { signal: controller.signal },
        );
      } catch {
        // Never queue or replay frames. A later authenticated poll must renew viewing.
        // An aborted upload from a closed viewer cannot clear its replacement lease.
        if (
          this.controller === controller &&
          this.lease?.leaseId === leaseId &&
          this.lease?.taskId === taskId
        )
          this.stop();
      }
    })().finally(() => {
      this.pending = null;
      if (this.controller === controller) this.controller = null;
      if (current()) {
        this.nextTimer = this.timers.setTimeout(() => {
          this.nextTimer = null;
          this.startCapture();
        }, 2000);
        this.nextTimer?.unref?.();
      }
    });
  }

  stop() {
    this.lease = null;
    this.controller?.abort();
    this.timers.clearTimeout(this.expiryTimer);
    this.timers.clearTimeout(this.nextTimer);
    this.expiryTimer = null;
    this.nextTimer = null;
  }
}
