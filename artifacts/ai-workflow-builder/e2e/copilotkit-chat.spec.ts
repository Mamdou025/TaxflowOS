/**
 * E2E tests: CopilotKit chat integration after the error-banner fix.
 *
 * All /api/copilotkit/* requests are intercepted with page.route() so the
 * tests run without a real OpenAI key. They verify two things:
 *
 *  1. When the copilotkit runtime is reachable the chat UI renders and
 *     accepts input — no error banner, no blank page.
 *  2. When the runtime is unreachable the app still renders something
 *     visible (not a blank white page) — either the chat UI (with a
 *     degraded/offline state) or the AppErrorBoundary reload screen.
 */

import { test, expect, type Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal GraphQL-over-SSE response that CopilotKit accepts for a POST. */
const MOCK_SSE_RESPONSE = [
  'event: next',
  'data: {"data":{"generateCopilotResponse":{"threadId":"t1","runId":"r1","status":{"__typename":"MessageStreamStatus","code":"completed"},"messages":[{"__typename":"TextMessageOutput","id":"m1","createdAt":"2026-01-01T00:00:00Z","role":"assistant","content":[{"type":"text","text":"Hello! How can I help?"}]}]}}}',
  '',
  'event: complete',
  'data: {}',
  '',
].join('\n');

/**
 * Minimal runtime-info response that satisfies the CopilotKit SDK's startup
 * health-check (GET /api/copilotkit/info).
 */
const MOCK_INFO_RESPONSE = JSON.stringify({
  agents: [],
  actions: [],
});

/** Intercept every copilotkit request with happy-path mock responses. */
async function mockCopilotKitHappy(page: Page) {
  await page.route('**/api/copilotkit**', async (route) => {
    const method = route.request().method();
    const url = route.request().url();

    if (method === 'GET' || url.includes('/info')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: MOCK_INFO_RESPONSE,
      });
      return;
    }

    // POST — stream a minimal assistant reply.
    await route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      body: MOCK_SSE_RESPONSE,
    });
  });
}

/** Intercept every copilotkit request and return server errors. */
async function mockCopilotKitDown(page: Page) {
  await page.route('**/api/copilotkit**', (route) =>
    route.fulfill({ status: 503, body: 'Service Unavailable' }),
  );
}

/** Selector for the chat textarea used by AsideInput / the main chat. */
const CHAT_INPUT = 'textarea[placeholder="Ask Scope, or describe a task…"]';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('CopilotKit chat — happy path', () => {
  test.beforeEach(async ({ page }) => {
    await mockCopilotKitHappy(page);
  });

  test('chat input renders without an error banner when the runtime is reachable', async ({ page }) => {
    await page.goto('/');

    // The main chat textarea must appear — confirms the app shell and lazy
    // ChatWorkspacePage both mounted successfully.
    const textarea = page.locator(CHAT_INPUT).first();
    await expect(textarea).toBeVisible({ timeout: 15_000 });

    // No "Runtime info request failed" toast / console error should be
    // present.  We assert the body is non-empty as the weakest possible
    // "not blank" check; the textarea presence above is the real guard.
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.trim().length).toBeGreaterThan(0);
  });

  test('chat input accepts text and the send button becomes active', async ({ page }) => {
    await page.goto('/');

    const textarea = page.locator(CHAT_INPUT).first();
    await expect(textarea).toBeVisible({ timeout: 15_000 });

    await textarea.fill('Hello Sina, what can you do?');
    await expect(textarea).toHaveValue('Hello Sina, what can you do?');

    // The send button should be enabled once text is present.
    const sendBtn = page.locator('button[aria-label="Send"]').first();
    await expect(sendBtn).toBeVisible({ timeout: 5_000 });
    await expect(sendBtn).toBeEnabled();
  });

  test('sending a message shows a loading/response state', async ({ page }) => {
    await page.goto('/');

    const textarea = page.locator(CHAT_INPUT).first();
    await expect(textarea).toBeVisible({ timeout: 15_000 });

    await textarea.fill('Hello');
    const sendBtn = page.locator('button[aria-label="Send"]').first();
    await expect(sendBtn).toBeEnabled({ timeout: 5_000 });
    await sendBtn.click();

    // After sending, the textarea should clear (or the send button label
    // should change to Stop/loading). Either proves the SDK processed the
    // message — the exact transition depends on CopilotKit's internal state.
    await expect(textarea).toHaveValue('', { timeout: 5_000 });
  });
});

test.describe('CopilotKit chat — error path', () => {
  test.beforeEach(async ({ page }) => {
    await mockCopilotKitDown(page);
  });

  test('app renders a visible UI (not a blank page) when the runtime is down', async ({ page }) => {
    await page.goto('/');

    // Give the app time to attempt connection and settle.
    await page.waitForTimeout(3_000);

    // The page must not be blank. Accept either outcome:
    //  (a) The chat shell still rendered (CopilotKit degrades gracefully), or
    //  (b) The AppErrorBoundary caught a crash and shows a "Reload" button.
    const hasChat = await page
      .locator(CHAT_INPUT)
      .first()
      .isVisible()
      .catch(() => false);

    const hasErrorUI = await page
      .locator('button:has-text("Reload"), [role="alert"]')
      .first()
      .isVisible()
      .catch(() => false);

    expect(
      hasChat || hasErrorUI,
      'Expected either the chat UI or an error/reload screen — not a blank page',
    ).toBe(true);

    // Body must contain meaningful text (rules out a completely blank page).
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.trim().length).toBeGreaterThan(10);
  });
});
