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
      truncate(outline, 6000),
    ].join('\n');
  }

  async function click(target: string): Promise<string> {
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
        if ((await loc.count()) > 0 && (await loc.isVisible())) {
          await loc.click({ timeout: 5000 });
          await page.waitForTimeout(800);
          return `Clicked "${target}".`;
        }
      } catch {
        // Try the next strategy.
      }
    }
    return `Could not find a clickable element matching "${target}".`;
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
      ? truncate(answer, 4000)
      : 'No visible response detected within 90s (the chat may be down, or the answer rendered somewhere unexpected).';
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
    askSina,
    screenshot,
    drainErrors,
    allErrors: () => errors.slice(),
    close,
  };
}
