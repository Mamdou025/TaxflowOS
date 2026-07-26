/**
 * API smoke tests — no browser required.
 *
 * These use Playwright's `request` fixture which makes HTTP requests directly
 * from Node.js without launching a browser.  They run in any environment,
 * including NixOS/Replit where glibc-linked Chromium binaries can't start.
 *
 * What is covered:
 *  - POST /api/copilotkit is reachable and returns a CopilotKit validation
 *    error (not a 404 "Not found"), confirming the route is wired up and the
 *    Express handler is active after the error-banner fix.
 *  - The api-server health endpoint is alive, proving the backend is running
 *    and the frontend can reach it.
 *
 * NOTE: The CopilotKit runtime uses a custom streaming protocol (not plain
 * GraphQL).  A POST without the required "method" field returns a 400
 * {"error":"invalid_request"} — that is the expected response here and is
 * evidence the route is live (a 404 would mean the route is missing).
 *
 * Run: pnpm --filter @workspace/ai-workflow-builder test:e2e --project=api
 */

import { test, expect } from '@playwright/test';

const API_BASE = process.env.API_BASE ?? 'http://localhost:8080';

test.describe('CopilotKit runtime — route availability', () => {
  test('POST /api/copilotkit is reachable (not 404) — route is wired up', async ({ request }) => {
    // A POST without CopilotKit's required "method" field triggers a 400
    // validation error from the runtime.  That is the expected response —
    // a 404 would mean the route handler is missing entirely.
    const response = await request.post(`${API_BASE}/api/copilotkit`, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: '{}' },
      failOnStatusCode: false,
    });

    // Must not be 404 (missing route) or 405 (GET-only, wrong method).
    expect(response.status()).not.toBe(404);
    expect(response.status()).not.toBe(405);

    // Expect a CopilotKit-shaped error body, not a generic HTML 404 page.
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('api-server /healthz responds — backend is running', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/healthz`, {
      failOnStatusCode: false,
    });

    // 200 OK from /healthz confirms the Express server is up and routing.
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ status: 'ok' });
  });
});
