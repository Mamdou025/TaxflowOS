/**
 * Playwright harness for the AI virtual worker.
 *
 * Wraps a Chromium page with:
 *  - resilient click / type helpers (locate by role, text, label, placeholder,
 *    then fall back to a raw selector) so the LLM can act with human-ish targets;
 *  - an `askSina` helper that types into the chat, sends, and waits for the
 *    streamed answer to settle (text-stabilization — no dependency on exact
 *    CopilotKit DOM);
 *  - a `snapshot` that returns the page's accessibility outline as the LLM's "eyes";
 *  - error buffers that capture console errors, uncaught page errors, and failed
 *    (4xx/5xx) network requests, so the worker notices crashes it triggers.
 */
import {
  chromium,
  type Browser,
  type BrowserContext,
  type Page,
  type Locator,
} from 'playwright';
import { resolve } from 'node:path';

export interface CapturedError {
  kind: 'console' | 'pageerror' | 'network';
  detail: string;
}

export interface HarnessOptions {
  baseUrl: string;
  headless: boolean;
  screenshotDir: string;
}

export interface Harness {
  page: Page;
  goto(path: string): Promise<string>;
  snapshot(): Promise<string>;
  click(target: string): Promise<string>;
  typeInto(target: string, text: string, submit: boolean): Promise<string>;
  drag(target: string, opts: { dx?: number; dy?: number; to?: string }): Promise<string>;
  uploadFile(filePath: string, trigger?: string): Promise<string>;
  readWorkflow(): Promise<string>;
  reload(): Promise<string>;
  apiGet(path: string): Promise<string>;
  askSina(message: string): Promise<string>;
  screenshot(name: string): Promise<string>;
  /** Errors captured since the last drain (advances the cursor). */
  drainErrors(): CapturedError[];
  /** Every error captured so far (for the final report). */
  allErrors(): CapturedError[];
  close(): Promise<void>;
}

function truncate(s: string, n: number): string {
  if (!s) return '';
  return s.length > n ? `${s.slice(0, n)}… [truncated ${s.length - n} chars]` : s;
}

export async function createHarness(opts: HarnessOptions): Promise<Harness> {
  const browser: Browser = await chromium.launch({ headless: opts.headless });
  const context: BrowserContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page: Page = await context.newPage();

  const errors: CapturedError[] = [];
  let cursor = 0;

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push({ kind: 'console', detail: truncate(msg.text(), 400) });
    }
  });
  page.on('pageerror', (err) => {
    errors.push({ kind: 'pageerror', detail: truncate(err.message, 400) });
  });
  page.on('response', (res) => {
    const status = res.status();
    if (status >= 400) {
      const url = res.url();
      if (url.includes('favicon')) return;
      errors.push({
        kind: 'network',
        detail: `${status} ${res.request().method()} ${truncate(url, 200)}`,
      });
    }
  });
  page.on('requestfailed', (req) => {
    const failure = req.failure();
    errors.push({
      kind: 'network',
      detail: `FAILED ${req.method()} ${truncate(req.url(), 200)} (${failure?.errorText ?? 'unknown'})`,
    });
  });

  function drainErrors(): CapturedError[] {
    const fresh = errors.slice(cursor);
    cursor = errors.length;
    return fresh;
  }

  async function goto(path: string): Promise<string> {
    const base = opts.baseUrl.replace(/\/$/, '');
    const url = path.startsWith('http')
      ? path
      : base + (path.startsWith('/') ? path : `/${path}`);
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    } catch (e) {
      return `Navigation to ${url} failed: ${(e as Error).message}`;
    }
    // Let lazy chunks / client render settle (networkidle is unreliable with a
    // streaming chat runtime, so use a fixed settle instead).
    await page.waitForTimeout(1500);
    return `Navigated to ${url}`;
  }

  async function snapshot(): Promise<string> {
    let outline = '';
    try {
      outline = await page.locator('body').ariaSnapshot();
    } catch {
      outline = '(could not capture accessibility outline)';
    }
    const url = page.url();
    const title = await page.title().catch(() => '');
    return [
      `URL: ${url}`,
      `Title: ${title}`,
      '--- Page outline (accessibility tree, truncated) ---',
      truncate(outline, 3000),
    ].join('\n');
  }

  // Locate the first visible element matching `target` by role, then text, then
  // as a raw CSS selector. Shared by click() and drag().
  async function locate(target: string): Promise<Locator | null> {
    const makers: Array<() => Locator> = [
      () => page.getByRole('button', { name: target }),
      () => page.getByRole('link', { name: target }),
      () => page.getByRole('tab', { name: target }),
      () => page.getByRole('menuitem', { name: target }),
      () => page.getByText(target, { exact: false }),
      () => page.locator(target),
    ];
    for (const make of makers) {
      try {
        const loc = make().first();
        if ((await loc.count()) > 0 && (await loc.isVisible())) return loc;
      } catch {
        // Try the next strategy.
      }
    }
    return null;
  }

  async function bodyTextLen(): Promise<number> {
    return ((await page.locator('body').innerText().catch(() => '')) || '').length;
  }
  async function dialogCount(): Promise<number> {
    return page.locator('[role="dialog"], [role="alertdialog"]').count().catch(() => 0);
  }

  async function click(target: string): Promise<string> {
    const loc = await locate(target);
    if (!loc) return `Could not find a clickable element matching "${target}".`;

    // Capture state so we can tell whether the click actually did anything —
    // the signal the worker uses to catch "buttons that go nowhere".
    const beforeUrl = page.url();
    const beforeText = await bodyTextLen();
    const beforeDialogs = await dialogCount();

    try {
      await loc.click({ timeout: 5000 });
    } catch (e) {
      return `Found "${target}" but the click failed: ${(e as Error).message}`;
    }
    await page.waitForTimeout(800);

    let verdict: string;
    if (page.url() !== beforeUrl) {
      verdict = `navigated to ${page.url()}`;
    } else if ((await dialogCount()) > beforeDialogs) {
      verdict = 'a dialog/panel opened';
    } else if (Math.abs((await bodyTextLen()) - beforeText) > 15) {
      verdict = 'page content changed';
    } else {
      verdict = 'NO visible change — no navigation, no dialog, no content change (possible dead button)';
    }
    return `Clicked "${target}" → ${verdict}.`;
  }

  async function drag(
    target: string,
    opts: { dx?: number; dy?: number; to?: string },
  ): Promise<string> {
    const src = await locate(target);
    if (!src) return `Could not find "${target}" to drag.`;
    const box = await src.boundingBox();
    if (!box) return `"${target}" is not visible enough to drag.`;
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    let endX = startX + (opts.dx ?? 0);
    let endY = startY + (opts.dy ?? 0);
    if (opts.to) {
      const dst = await locate(opts.to);
      const dbox = dst ? await dst.boundingBox() : null;
      if (dbox) {
        endX = dbox.x + dbox.width / 2;
        endY = dbox.y + dbox.height / 2;
      }
    }
    // Move in small steps so pointer-based DnD (React Flow / @xyflow) registers it.
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    const steps = 12;
    for (let i = 1; i <= steps; i += 1) {
      await page.mouse.move(
        startX + ((endX - startX) * i) / steps,
        startY + ((endY - startY) * i) / steps,
      );
      await page.waitForTimeout(20);
    }
    await page.mouse.up();
    await page.waitForTimeout(400);
    return `Dragged "${target}" to (${Math.round(endX)}, ${Math.round(endY)}).`;
  }

  async function uploadFile(filePath: string, trigger?: string): Promise<string> {
    // Case 1: a button opens a native file chooser (input is hidden behind it).
    if (trigger) {
      const chooserPromise = page
        .waitForEvent('filechooser', { timeout: 4000 })
        .catch(() => null);
      await click(trigger);
      const chooser = await chooserPromise;
      if (chooser) {
        try {
          await chooser.setFiles(filePath);
          await page.waitForTimeout(1000);
          return `Uploaded ${filePath} via the file picker.`;
        } catch (e) {
          return `File picker opened but setting the file failed: ${(e as Error).message}`;
        }
      }
    }
    // Case 2: a file <input> exists (possibly hidden) — set it directly.
    const input = page.locator('input[type="file"]').first();
    if ((await input.count()) > 0) {
      try {
        await input.setInputFiles(filePath);
        await page.waitForTimeout(1000);
        return `Set ${filePath} on the file input.`;
      } catch (e) {
        return `Found a file input but the upload failed: ${(e as Error).message}`;
      }
    }
    return 'No file input or file picker found here. Click the upload control first, or pass its label as "trigger".';
  }

  async function typeInto(
    target: string,
    text: string,
    submit: boolean,
  ): Promise<string> {
    const makers: Array<() => Locator> = [
      () => page.getByPlaceholder(target, { exact: false }),
      () => page.getByLabel(target, { exact: false }),
      () => page.getByRole('textbox', { name: target }),
      () =>
        page.locator(
          'textarea, input[type="text"], input:not([type]), [contenteditable="true"]',
        ),
    ];
    for (const make of makers) {
      try {
        const loc = make().first();
        if ((await loc.count()) > 0 && (await loc.isVisible())) {
          await loc.fill(text);
          if (submit) await loc.press('Enter');
          await page.waitForTimeout(800);
          return `Typed into "${target}"${submit ? ' and pressed Enter' : ''}.`;
        }
      } catch {
        // Try the next strategy.
      }
    }
    return `Could not find an input matching "${target}".`;
  }

  async function askSina(message: string): Promise<string> {
    const inputSelectors = [
      'textarea[placeholder="Ask Scope, or describe a task…"]',
      'textarea[placeholder*="Ask"]',
      'textarea[placeholder*="Sina"]',
      'textarea',
      '[contenteditable="true"]',
    ];
    let input: Locator | null = null;
    for (const sel of inputSelectors) {
      const loc = page.locator(sel).first();
      if ((await loc.count()) > 0 && (await loc.isVisible())) {
        input = loc;
        break;
      }
    }
    if (!input) {
      return 'Could not find a chat input on the current page. Navigate to a page with the Sina chat (e.g. "/") first.';
    }

    const scope =
      (await page.locator('main').count()) > 0
        ? page.locator('main').first()
        : page.locator('body');
    const before = (await scope.innerText().catch(() => '')) || '';

    await input.click();
    await input.fill(message);

    const sendBtn = page.locator('button[aria-label="Send"]').first();
    if ((await sendBtn.count()) > 0 && (await sendBtn.isEnabled().catch(() => false))) {
      await sendBtn.click();
    } else {
      await input.press('Enter');
    }

    // Wait for the streamed answer to grow and then stay stable for ~3s.
    let last = '';
    let stable = 0;
    const deadline = Date.now() + 90_000;
    while (Date.now() < deadline) {
      await page.waitForTimeout(1500);
      const now = (await scope.innerText().catch(() => '')) || '';
      if (now.length > before.length && now === last) {
        stable += 1;
        if (stable >= 2) break;
      } else {
        stable = 0;
      }
      last = now;
    }

    const full = (await scope.innerText().catch(() => '')) || '';
    const diff = full.length > before.length ? full.slice(before.length) : full;
    const answer = diff.trim();
    return answer
      ? truncate(answer, 2000)
      : 'No visible response detected within 90s (the chat may be down, or the answer rendered somewhere unexpected).';
  }

  // Read the workflow-builder canvas (@xyflow/react) so the worker can verify
  // which blocks exist and how they're configured, instead of eyeballing pixels.
  async function readWorkflow(): Promise<string> {
    const nodeLoc = page.locator('.react-flow__node');
    const count = Math.min(await nodeLoc.count().catch(() => 0), 40);
    if (count === 0) {
      return 'No workflow canvas / React Flow blocks found on this page (are you on /builder with a workflow open?).';
    }
    const nodes: string[] = [];
    for (let i = 0; i < count; i += 1) {
      const el = nodeLoc.nth(i);
      const cls = (await el.getAttribute('class').catch(() => '')) || '';
      const typeMatch = /react-flow__node-([\w-]+)/.exec(cls);
      const type = typeMatch ? typeMatch[1] : 'node';
      const text = ((await el.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim().slice(0, 140);
      nodes.push(`  ${i + 1}. [${type}] ${text || '(no visible label)'}`);
    }
    const edges = await page.locator('.react-flow__edge').count().catch(() => 0);
    return [`Workflow graph: ${count} block(s), ${edges} connection(s).`, 'Blocks:', ...nodes].join('\n');
  }

  // Reload the current page — used to test that state (e.g. a saved chat/workflow)
  // actually persisted and can be traced back to.
  async function reload(): Promise<string> {
    try {
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
    } catch (e) {
      return `Reload failed: ${(e as Error).message}`;
    }
    await page.waitForTimeout(1500);
    return `Reloaded ${page.url()}.`;
  }

  // Read-only GET against the app's OWN backend API, reusing the page's session
  // cookies (so session-gated routes work). Backend ground truth: does what the
  // UI/chat claims actually exist server-side?
  async function apiGet(path: string): Promise<string> {
    const base = opts.baseUrl.replace(/\/$/, '');
    const url = path.startsWith('http') ? path : base + (path.startsWith('/') ? path : `/${path}`);
    try {
      const res = await page.request.get(url, { timeout: 15000 });
      const status = res.status();
      let body = (await res.text().catch(() => '')) || '';
      try {
        body = JSON.stringify(JSON.parse(body), null, 2);
      } catch {
        // not JSON — leave as-is
      }
      return `GET ${url} → ${status}\n${truncate(body, 4000)}`;
    } catch (e) {
      return `GET ${url} failed: ${(e as Error).message}`;
    }
  }

  async function screenshot(name: string): Promise<string> {
    const path = resolve(opts.screenshotDir, name);
    try {
      await page.screenshot({ path, fullPage: false });
      return path;
    } catch {
      return '';
    }
  }

  async function close(): Promise<void> {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }

  return {
    page,
    goto,
    snapshot,
    click,
    typeInto,
    drag,
    uploadFile,
    readWorkflow,
    reload,
    apiGet,
    askSina,
    screenshot,
    drainErrors,
    allErrors: () => errors.slice(),
    close,
  };
}
