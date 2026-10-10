import { test, expect, type Page } from '@playwright/test';
import { createServer, type ServerResponse } from 'node:http';
import { syntheticContext, syntheticSession } from '../scripts/testing/browser-fixtures.mjs';

type RuntimeInput = {
  threadId: string;
  runId: string;
  messages: { id: string; role: string; content?: unknown }[];
};
type SavedThread = {
  messages: { id: string; role: string; content: { text?: string } }[];
};
type AccessMode = 'healthy' | 'hold' | 'unavailable' | 'denied';

function events(values: Record<string, unknown>[]) {
  return values.map((value) => `data: ${JSON.stringify(value)}\n\n`).join('');
}

/** All live streams and access reads use one disposable HTTP/1 server. */
async function createTransport(isDemo: boolean, delayMs?: number) {
  const state = {
    connects: 0,
    sessions: 0,
    memberships: 0,
    demoMemberships: 0,
    runs: [] as { input: RuntimeInput; author: string }[],
    sessionMode: 'healthy' as AccessMode,
    workspaceMode: 'healthy' as AccessMode,
    firstTextAfterMs: 0,
  };
  let run:
    | { input: RuntimeInput; response: ServerResponse; startedAt: number; author: string }
    | undefined;
  let completion: ReturnType<typeof setTimeout> | undefined;
  let replyReady!: () => void;
  const waitingForReply = new Promise<void>((resolve) => {
    replyReady = resolve;
  });
  const heldMemberships: ServerResponse[] = [];
  const attachedStreams = new Set<ServerResponse>();
  const json = (response: ServerResponse, status: number, value: unknown) => {
    response.writeHead(status, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    });
    response.end(JSON.stringify(value));
  };
  const membership = (response: ServerResponse, mode: AccessMode) => {
    if (mode === 'hold') heldMemberships.push(response);
    else
      json(
        response,
        mode === 'denied' ? 403 : mode === 'unavailable' ? 503 : 200,
        mode === 'healthy'
          ? { workspaces: [syntheticContext.workspace] }
          : { error: 'Synthetic access failure.' },
      );
  };
  const finish = () => {
    if (!run) throw new Error('The isolated model run has not started.');
    clearTimeout(completion);
    state.firstTextAfterMs = Date.now() - run.startedAt;
    const body = events([
      { type: 'TEXT_MESSAGE_START', messageId: 'delayed-reply', role: 'assistant' },
      {
        type: 'TEXT_MESSAGE_CONTENT',
        messageId: 'delayed-reply',
        delta: `The isolated ${run.author} reply completed once.`,
      },
      { type: 'TEXT_MESSAGE_END', messageId: 'delayed-reply' },
      { type: 'RUN_FINISHED', threadId: run.input.threadId, runId: run.input.runId },
    ]);
    run.response.end(body);
    for (const response of attachedStreams) response.end(body);
    attachedStreams.clear();
  };
  const server = createServer((request, response) => {
    let body = '';
    request.on('data', (chunk) => (body += chunk));
    request.on('end', () => {
      const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
      if (pathname === '/api/session') {
        state.sessions++;
        if (state.sessionMode === 'hold') return;
        return json(
          response,
          state.sessionMode === 'denied' ? 403 : state.sessionMode === 'unavailable' ? 503 : 200,
          state.sessionMode === 'healthy'
            ? { user: { ...syntheticSession.user, isDemo } }
            : { error: 'Synthetic access failure.' },
        );
      }
      if (pathname === '/api/workspaces' || pathname === '/api/workspaces/demo') {
        state.memberships++;
        if (pathname.endsWith('/demo')) state.demoMemberships++;
        return membership(response, state.workspaceMode);
      }
      const envelope = JSON.parse(body);
      response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      });
      if (envelope.method === 'agent/connect') {
        state.connects++;
        // An idle runtime connect ends immediately. Reconnecting a running turn
        // replays RUN_STARTED and stays attached until that same turn finishes.
        if (!run || run.response.writableEnded) return response.end();
        attachedStreams.add(response);
        response.once('close', () => attachedStreams.delete(response));
        response.write(
          events([{ type: 'RUN_STARTED', threadId: run.input.threadId, runId: run.input.runId }]),
        );
        return;
      }
      const input = envelope.body as RuntimeInput;
      const author = request.headers['x-inscope-agent'] === 'microsina' ? 'MicroSina' : 'Sina';
      state.runs.push({ input, author });
      run = { input, response, startedAt: Date.now(), author };
      response.write(
        events([{ type: 'RUN_STARTED', threadId: input.threadId, runId: input.runId }]),
      );
      if (delayMs !== undefined) completion = setTimeout(replyReady, delayMs);
    });
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Missing fixture server port.');
  return {
    state,
    origin: `http://127.0.0.1:${address.port}`,
    finish,
    waitUntilReplyReady: () => waitingForReply,
    releaseMemberships(mode: AccessMode) {
      state.workspaceMode = mode;
      for (const response of heldMemberships.splice(0)) membership(response, mode);
    },
    async close() {
      clearTimeout(completion);
      server.closeAllConnections();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    },
  };
}

async function installFixture(
  page: Page,
  transport: Awaited<ReturnType<typeof createTransport>>,
  isDemo: boolean,
) {
  const saved = new Map<string, SavedThread>();
  const unexpected: string[] = [];
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.addInitScript(
    (context) => {
      sessionStorage.setItem('taxflow:authenticated-workspace', JSON.stringify(context));
      Object.assign(window, { lifecycleUnhandledRejections: [] as string[] });
      window.addEventListener('unhandledrejection', (event) => {
        const target = window as unknown as { lifecycleUnhandledRejections: string[] };
        target.lifecycleUnhandledRejections.push(String(event.reason));
      });
    },
    { ...syntheticContext, isDemo },
  );
  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    if (['/api/session', '/api/workspaces', '/api/workspaces/demo'].includes(pathname))
      return route.continue({ url: `${transport.origin}${pathname}` });
    if (pathname.startsWith('/api/copilotkit')) {
      const envelope = request.method() === 'POST' ? request.postDataJSON() : {};
      if (envelope.method === 'info' || request.method() === 'GET')
        return route.fulfill({
          json: {
            version: '1.63.2',
            mode: 'sse',
            agents: {
              default: {
                name: 'default',
                description: 'Isolated lifecycle',
                className: 'FixtureAgent',
              },
            },
            audioFileTranscriptionEnabled: false,
            suggestions: false,
            telemetryDisabled: true,
            threadEndpoints: {
              list: false,
              inspect: false,
              mutations: false,
              realtimeMetadata: false,
            },
          },
        });
      if (envelope.method === 'agent/connect' || envelope.method === 'agent/run')
        return route.continue({ url: `${transport.origin}/api/copilotkit` });
    }
    if (pathname === '/api/workflow-library')
      return route.fulfill({ json: { revision: 0, payload: null } });
    if (pathname.startsWith('/api/chat/threads')) {
      const id = decodeURIComponent(pathname.split('/')[4] ?? '');
      if (request.method() === 'POST' && pathname.endsWith('/messages')) {
        saved.set(id, request.postDataJSON() as SavedThread);
        return route.fulfill({ json: { ok: true } });
      }
      if (request.method() === 'GET') return route.fulfill({ json: { threads: [] } });
    }
    if (request.method() === 'GET')
      return route.fulfill({
        json:
          pathname === '/api/integrations'
            ? []
            : { documents: [], workers: [], tasks: [], conversations: [], memories: [], items: [] },
      });
    unexpected.push(`${request.method()} ${pathname}`);
    return route.fulfill({ status: 500, json: { error: 'Unexpected isolated operation.' } });
  });
  return { saved, unexpected, pageErrors };
}

function composer(page: Page) {
  return page
    .locator('.lc-console')
    .getByRole('textbox', { name: 'Ask Scope, or describe a task…', includeHidden: true });
}

async function sendQuestion(page: Page) {
  await composer(page).fill('Explain the isolated result.');
  await expect(
    page.locator('.lc-console').getByRole('button', { name: 'Send', exact: true }),
  ).toBeEnabled();
  await composer(page).press('Enter');
  await expect(page.getByRole('button', { name: 'Stop', exact: true })).toBeEnabled();
}

for (const author of ['Sina', 'MicroSina'] as const) {
  test(`${author} waits beyond 30 seconds with one connection and responsive access checks`, async ({
    page,
  }) => {
    // MicroSina also exercises the real guest-session membership branch.
    const isDemo = author === 'MicroSina';
    const transport = await createTransport(isDemo, 35000);
    const fixture = await installFixture(page, transport, isDemo);
    try {
      await page.goto('/');
      await expect(composer(page)).toBeEditable();
      if (author === 'MicroSina') {
        await page.getByRole('button', { name: 'Chat agent: Sina' }).click();
        await page.getByRole('menuitemradio', { name: 'MicroSina · Foundry' }).click();
      }
      await sendQuestion(page);
      await expect.poll(() => transport.state.runs.length).toBe(1);
      await composer(page).fill('Keep this unsent follow-up.');
      const membershipsBefore = transport.state.memberships;
      await page.evaluate(() => window.dispatchEvent(new Event('focus')));
      await expect.poll(() => transport.state.memberships).toBeGreaterThan(membershipsBefore);
      // This is real elapsed network time; browser timers are not accelerated.
      // Keep the response held until the assertions finish so loaded machines
      // cannot race the boundary between a pending reply and its first token.
      await transport.waitUntilReplyReady();
      await expect(page.getByRole('button', { name: 'Stop', exact: true })).toBeEnabled();
      await expect(page.getByRole('alert')).toHaveCount(0);
      await expect(page.locator('vite-error-overlay, runtime-error-overlay')).toHaveCount(0);
      await expect(page.locator('[data-message-id="delayed-reply"]')).toHaveCount(0);
      transport.finish();
      const reply = page.locator('[data-assistant-ui-thread] [data-message-id="delayed-reply"]');
      await expect(reply).toContainText(`The isolated ${author} reply completed once.`);
      await expect(reply).toHaveCount(1);
      await expect
        .poll(
          () =>
            [...fixture.saved.values()]
              .flatMap((thread) => thread.messages)
              .filter((message) => message.id === 'delayed-reply').length,
        )
        .toBe(1);
      expect(transport.state.connects).toBe(1);
      expect(transport.state.runs).toHaveLength(1);
      expect(transport.state.runs[0].author).toBe(author);
      expect(transport.state.firstTextAfterMs).toBeGreaterThanOrEqual(35000);
      expect(transport.state.demoMemberships > 0).toBe(isDemo);
      await expect(composer(page)).toHaveValue('Keep this unsent follow-up.');
      await expect(page.getByRole('alert')).toHaveCount(0);
      expect(fixture.unexpected).toEqual([]);
      expect(fixture.pageErrors).toEqual([]);
      expect(
        await page.evaluate(
          () =>
            (window as unknown as { lifecycleUnhandledRejections: string[] })
              .lifecycleUnhandledRejections,
        ),
      ).toEqual([]);
      await page.screenshot({
        path: test.info().outputPath(`${author.toLowerCase()}-delayed-reply.png`),
      });
      await test.info().attach('sanitized-response-timing', {
        body: JSON.stringify({
          author,
          firstTextAfterMs: transport.state.firstTextAfterMs,
          connects: transport.state.connects,
          runs: transport.state.runs.length,
          sessions: transport.state.sessions,
          memberships: transport.state.memberships,
        }),
        contentType: 'application/json',
      });
    } finally {
      await page.close();
      await transport.close();
    }
  });
}

test('timed-out access rechecks once promptly, preserves a finished reply and stays closed through denial', async ({
  page,
}) => {
  const transport = await createTransport(true);
  const fixture = await installFixture(page, transport, true);
  try {
    await page.clock.install({ time: new Date('2026-10-09T12:00:00Z') });
    // Isolate the access timers from cold-start wall time; only this test advances
    // the clock. The two delayed-provider tests above keep real elapsed time.
    await page.clock.pauseAt(new Date('2026-10-09T12:00:01Z'));
    await page.goto('/');
    await page.clock.runFor(1000);
    await expect(composer(page)).toBeEditable();
    await sendQuestion(page);
    await expect.poll(() => transport.state.runs.length).toBe(1);
    await composer(page).fill('Preserve this draft while verifying access.');
    transport.state.sessionMode = 'hold';
    const initialSessions = transport.state.sessions;
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    await expect.poll(() => transport.state.sessions).toBe(initialSessions + 1);
    // The held request keeps its original response; only the next check recovers.
    transport.state.sessionMode = 'healthy';
    transport.state.workspaceMode = 'hold';
    const beforeRetry = transport.state.memberships;
    await page.clock.fastForward(30000);
    const interrupted = page.getByRole('heading', { name: 'Connection interrupted' });
    await expect(interrupted).toBeVisible();
    await expect(
      page.getByText('The app service is taking too long to respond. Please retry.', {
        exact: true,
      }),
    ).toBeVisible();
    await expect(composer(page)).toBeHidden();
    transport.finish();
    // The first prompt retry can verify the session, but cannot reveal cached
    // private content while the separate membership response is still pending.
    await page.clock.fastForward(1000);
    await expect.poll(() => transport.state.memberships).toBe(beforeRetry + 1);
    await expect(interrupted).toBeVisible();
    await expect(composer(page)).toBeHidden();
    await expect(composer(page)).toHaveValue('Preserve this draft while verifying access.');
    transport.releaseMemberships('healthy');
    await expect(composer(page)).toBeVisible();
    await expect(page.locator('[data-message-id="delayed-reply"]')).toContainText(
      'The isolated Sina reply completed once.',
    );
    await page.clock.fastForward(1000);
    await expect.poll(() => fixture.saved.size).toBe(1);
    expect(transport.state.sessions).toBe(initialSessions + 2);
    expect(transport.state.runs).toHaveLength(1);
    expect(transport.state.connects).toBe(1);

    transport.state.sessionMode = 'unavailable';
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    await expect(interrupted).toBeVisible();
    const failedSessions = transport.state.sessions;
    await page.clock.fastForward(1000);
    await expect.poll(() => transport.state.sessions).toBe(failedSessions + 1);
    await page.clock.fastForward(10000);
    expect(transport.state.sessions).toBe(failedSessions + 1);
    await expect(interrupted).toBeVisible();
    // Manual retry is fail-closed too, and a real membership denial discards
    // the protected tree instead of resuming it from previously cached access.
    transport.state.sessionMode = 'healthy';
    transport.state.workspaceMode = 'hold';
    const beforeManual = transport.state.memberships;
    await page.getByRole('button', { name: 'Retry access check', exact: true }).click();
    await expect.poll(() => transport.state.memberships).toBe(beforeManual + 1);
    await expect(interrupted).toBeVisible();
    await expect(composer(page)).toBeHidden();
    transport.releaseMemberships('denied');
    await expect(
      page.getByText('Workspace access could not be verified.', { exact: true }),
    ).toBeVisible();
    await expect(composer(page)).toHaveCount(0);
    expect(fixture.unexpected).toEqual([]);
    expect(fixture.pageErrors).toEqual([]);
  } finally {
    await page.close();
    await transport.close();
  }
});
