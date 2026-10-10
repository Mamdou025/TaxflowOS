import type { Page, Route } from '@playwright/test';
import { createServer, type ServerResponse } from 'node:http';
import { readFileSync } from 'node:fs';
import { test, expect } from './workflow-audit-isolation';

type RuntimeMessage = {
  id: string;
  role: string;
  content?: unknown;
  toolCallId?: string;
  toolCalls?: { id: string; function: { name: string; arguments: string } }[];
};
type RuntimeInput = {
  threadId: string;
  runId: string;
  messages: RuntimeMessage[];
  tools: { name: string }[];
  context?: { description: string; value: unknown }[];
};
type RemoteStop = { agentId: string; threadId: string };
type SavedMessage = {
  id: string;
  role: string;
  seq: number;
  content: {
    text?: string;
    toolCall?: { name: string; args?: unknown; result?: unknown; callId?: string };
    [key: string]: unknown;
  };
};
type SavedThread = { messages: SavedMessage[]; title?: string };

const savedThreadId = 'assistant-ui-saved-thread';
const savedTitle = 'Previously saved conversation';
const savedQuestion = 'What did we decide in this saved conversation?';
const savedAnswer = 'The saved decision belongs only to this conversation.';
const stamp = '2026-10-09T12:00:00.000Z';

function encodeEvents(events: Record<string, unknown>[]) {
  return events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join('');
}

async function finishReply(route: Route, input: RuntimeInput, messageId: string, text: string) {
  await route.fulfill({
    contentType: 'text/event-stream',
    body: encodeEvents([
      { type: 'RUN_STARTED', threadId: input.threadId, runId: input.runId },
      { type: 'TEXT_MESSAGE_START', messageId, role: 'assistant' },
      { type: 'TEXT_MESSAGE_CONTENT', messageId, delta: text },
      { type: 'TEXT_MESSAGE_END', messageId },
      { type: 'RUN_FINISHED', threadId: input.threadId, runId: input.runId },
    ]),
  });
}

async function listWorkflowReply(
  route: Route,
  input: RuntimeInput,
  toolCallId: string,
  toolName: 'listAvailableWorkflows' | 'listSavedWorkflows',
  query?: string,
) {
  expect(input.tools.some((tool) => tool.name === toolName)).toBe(true);
  await route.fulfill({
    contentType: 'text/event-stream',
    body: encodeEvents([
      { type: 'RUN_STARTED', threadId: input.threadId, runId: input.runId },
      {
        type: 'TOOL_CALL_START',
        toolCallId,
        toolCallName: toolName,
        parentMessageId: `${toolCallId}-message`,
      },
      { type: 'TOOL_CALL_ARGS', toolCallId, delta: JSON.stringify(query ? { query } : {}) },
      { type: 'TOOL_CALL_END', toolCallId },
      { type: 'RUN_FINISHED', threadId: input.threadId, runId: input.runId },
    ]),
  });
}

const choiceName = 'FAPI Calculation Template';
const firstChoiceId = 'custom:choice-fapi-one';
const secondChoiceId = 'custom:choice-fapi-two';
const draftChoiceId = 'custom:choice-fapi-draft';

/** Synthetic server library, applied through the normal workspace sync boundary. */
async function installWorkflowChoices(page: Page, duplicate = false, existingRuns = false) {
  await page.goto('/');
  await waitForChatUI(page);
  await expect(composer(page)).toBeEditable();
  const rootPath = `/@fs/${process.cwd().replaceAll('\\', '/')}`;
  let remote = {
    revision: 1,
    payload: await page.evaluate(
      async ({ rootPath, duplicate, existingRuns, name, firstId, secondId, draftId }) => {
        const { createWorkflow, saveVersion } = await import(
          `${rootPath}/lib/workflow-core/src/application/commands.ts`
        );
        const { createFapiTemplateWorkflow } =
          await import('/src/shared/workflow-engine/workflow/templates/fapi.ts');
        const { stringifySharedJSON } = await import('/src/shared/workflow-engine/shared-json.ts');
        const { startSession } = await import(
          `${rootPath}/lib/workflow-core/src/application/sessions.ts`
        );
        const definition = createFapiTemplateWorkflow();
        definition.name = name;
        let first = saveVersion(createWorkflow(firstId, 'fapi', definition));
        if (existingRuns) {
          first = startSession(first, 1, 'existing-run-one', '2026-10-09T12:00:00.000Z');
          first = startSession(first, 1, 'existing-run-two', '2026-10-09T12:01:00.000Z');
        }
        const draft = createWorkflow(draftId, 'pf-fapi', {
          ...definition,
          name: `${name} with adjustments`,
        });
        const entries = [first, draft];
        if (duplicate) entries.push(saveVersion(createWorkflow(secondId, 'pf-fapi', definition)));
        return stringifySharedJSON(Object.fromEntries(entries.map((entry) => [entry.id, entry])));
      },
      {
        rootPath,
        duplicate,
        existingRuns,
        name: choiceName,
        firstId: firstChoiceId,
        secondId: secondChoiceId,
        draftId: draftChoiceId,
      },
    ),
  };
  await page.route('**/api/workflow-library', (route) => {
    if (route.request().method() === 'GET') return route.fulfill({ json: remote });
    const body = route.request().postDataJSON() as { payload: string; revision: number };
    remote = { payload: body.payload, revision: body.revision + 1 };
    return route.fulfill({ json: { revision: remote.revision } });
  });
  const applyRemote = () =>
    page.evaluate(async () => {
      const { openWorkflowWorkspace } =
        await import('/src/features/workflows-hub/workflow-sync.ts');
      const { workspaceContext } = await import('/src/platform/auth/workspace-context.ts');
      if (!workspaceContext) throw new Error('Missing isolated workspace.');
      await openWorkflowWorkspace(workspaceContext.workspace.id);
    });
  await applyRemote();
  return {
    async update(operation: 'duplicate' | 'newer-version' | 'delete', id = secondChoiceId) {
      const payload = await page.evaluate(
        async ({ rootPath, operation, id, firstId }) => {
          const { createWorkflow, replaceDraft, saveVersion } = await import(
            `${rootPath}/lib/workflow-core/src/application/commands.ts`
          );
          const { readWorkflowLibrary } =
            await import('/src/features/workflows-hub/workflow-library.ts');
          const { stringifySharedJSON } =
            await import('/src/shared/workflow-engine/shared-json.ts');
          const library = structuredClone(readWorkflowLibrary());
          if (operation === 'delete') delete library[id];
          else if (operation === 'duplicate')
            library[id] = saveVersion(createWorkflow(id, 'pf-fapi', library[firstId].draft));
          else {
            const draft = structuredClone(library[id].draft);
            draft.blocks.find((block) => block.id === 'fapi-source-inputs')!.config.inclusionRate =
              0.25;
            library[id] = saveVersion(replaceDraft(library[id], draft));
          }
          return stringifySharedJSON(library);
        },
        { rootPath, operation, id, firstId: firstChoiceId },
      );
      remote = { payload, revision: remote.revision + 1 };
      await applyRemote();
    },
    read: () =>
      page.evaluate(async () => {
        const { readWorkflowLibrary } =
          await import('/src/features/workflows-hub/workflow-library.ts');
        return Object.fromEntries(
          Object.values(readWorkflowLibrary()).map((entry) => [
            entry.id,
            {
              versions: entry.versions.map((version) => version.number),
              runs: entry.runs.length,
              sessions: (entry.sessions ?? []).map((session) => ({
                id: session.id,
                version: session.version,
                attempts: session.attempts.length,
              })),
            },
          ]),
        );
      }),
  };
}

async function installChatFixture(
  page: Page,
  onRun: (route: Route, input: RuntimeInput, attempt: number) => Promise<void>,
  onStop?: (request: RemoteStop) => boolean,
  onThreadRead?: (route: Route, id: string, saved: SavedThread) => Promise<void>,
) {
  const state = {
    runs: [] as RuntimeInput[],
    stops: [] as RemoteStop[],
    reads: [] as string[],
    writes: [] as { id: string; thread: SavedThread }[],
    saved: new Map<string, SavedThread>([
      [
        savedThreadId,
        {
          title: savedTitle,
          messages: [
            {
              id: 'saved-question',
              role: 'user',
              seq: 0,
              content: { text: savedQuestion, chatAgent: 'sina' },
            },
            {
              id: 'saved-answer',
              role: 'assistant',
              seq: 1,
              content: { text: savedAnswer, authorAgent: 'sina' },
            },
          ],
        },
      ],
    ]),
    searches: [] as unknown[],
    unexpected: [] as string[],
  };
  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    if (['/api/session', '/api/workspaces', '/api/workflow-library'].includes(pathname))
      return route.fallback();
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
                description: 'Isolated assistant-ui regression',
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
      if (envelope.method === 'agent/connect')
        return route.fulfill({ contentType: 'text/event-stream', body: '' });
      if (envelope.method === 'agent/stop') {
        const stop = {
          agentId: String(envelope.params?.agentId ?? ''),
          threadId: String(envelope.params?.threadId ?? ''),
        };
        state.stops.push(stop);
        if (onStop && !onStop(stop))
          return route.fulfill({ status: 409, json: { error: 'Stop targeted a different run.' } });
        return route.fulfill({ json: { ok: true } });
      }
      if (envelope.method === 'agent/run') {
        const input = (envelope.body ?? envelope) as RuntimeInput;
        state.runs.push(input);
        return onRun(route, input, state.runs.length);
      }
    }
    if (pathname.startsWith('/api/chat/threads')) {
      const id = decodeURIComponent(pathname.split('/')[4] ?? '');
      if (request.method() === 'POST' && pathname.endsWith('/messages')) {
        const thread = request.postDataJSON() as SavedThread;
        state.writes.push({ id, thread });
        state.saved.set(id, thread);
        return route.fulfill({ json: { ok: true } });
      }
      if (request.method() === 'GET' && pathname === '/api/chat/threads')
        return route.fulfill({
          json: {
            threads: [...state.saved].map(([threadId, value]) => ({
              id: threadId,
              title: value.title,
              updatedAt: stamp,
            })),
          },
        });
      if (request.method() === 'GET' && state.saved.has(id)) {
        state.reads.push(id);
        if (onThreadRead) return onThreadRead(route, id, state.saved.get(id)!);
        return route.fulfill({ json: state.saved.get(id) });
      }
    }
    if (request.method() === 'POST' && pathname === '/api/documents/search') {
      state.searches.push(request.postDataJSON());
      return route.fulfill({ json: { status: 'ready', passages: [], limitations: [] } });
    }
    if (request.method() === 'GET' && !pathname.startsWith('/api/copilotkit'))
      return route.fulfill({
        json:
          pathname === '/api/integrations'
            ? []
            : { documents: [], workers: [], conversations: [], tasks: [], memories: [], items: [] },
      });
    state.unexpected.push(`${request.method()} ${pathname}`);
    return route.fulfill({ status: 500, json: { error: 'Unexpected synthetic operation.' } });
  });
  return state;
}

async function openHeldStream() {
  let response: ServerResponse | undefined;
  let input: RuntimeInput | undefined;
  let closed = false;
  const server = createServer((request, outgoing) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      const envelope = JSON.parse(body);
      input = (envelope.body ?? envelope) as RuntimeInput;
      response = outgoing;
      outgoing.once('close', () => {
        closed = true;
      });
      outgoing.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      });
      outgoing.write(
        encodeEvents([
          { type: 'RUN_STARTED', threadId: input.threadId, runId: input.runId },
          { type: 'TEXT_MESSAGE_START', messageId: 'held-reply', role: 'assistant' },
          { type: 'TEXT_MESSAGE_CONTENT', messageId: 'held-reply', delta: 'A partial answer.' },
        ]),
      );
    });
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Missing synthetic stream port.');
  return {
    url: `http://127.0.0.1:${address.port}/`,
    isClosed: () => closed,
    stop: (request: RemoteStop) => {
      // The installed CopilotKit proxy stops remotely through agent/stop; it
      // intentionally does not abort the original fetch's AbortController.
      // An idle stop is harmless, but an active stop must match this held run.
      if (closed) return true;
      if (
        !response ||
        !input ||
        request.agentId !== 'default' ||
        request.threadId !== input.threadId
      )
        return false;
      response.end(
        encodeEvents([
          { type: 'TEXT_MESSAGE_END', messageId: 'held-reply' },
          { type: 'RUN_FINISHED', threadId: input.threadId, runId: input.runId },
        ]),
      );
      return true;
    },
    finishLate: () => {
      if (!response || !input) throw new Error('The browser never opened the held stream.');
      // The fixture attempts completion after cancellation. The closed transport
      // must never reintroduce these tokens into this or a replacement thread.
      if (response.writableEnded || response.destroyed) return;
      response.end(
        encodeEvents([
          { type: 'TEXT_MESSAGE_CONTENT', messageId: 'held-reply', delta: ' LATE OLD TOKENS' },
          { type: 'TEXT_MESSAGE_END', messageId: 'held-reply' },
          { type: 'RUN_FINISHED', threadId: input.threadId, runId: input.runId },
        ]),
      );
    },
    close: async () => {
      server.closeAllConnections();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    },
  };
}

function composer(page: Page) {
  return page
    .locator('.lc-console')
    .getByRole('textbox', { name: 'Ask Scope, or describe a task…' });
}

async function waitForChatUI(page: Page) {
  // The public shell loads before the deferred workspace. Finish that navigation
  // setup before asserting chat behavior; production startup has separate probes.
  await composer(page).waitFor({ state: 'visible' });
}

function conversation(page: Page) {
  // The empty home keeps its log mounted but hidden behind the hero.
  return page.locator('[data-assistant-ui-thread][role="log"][aria-label="Conversation"]');
}

async function waitForSend(page: Page) {
  await expect(
    page.locator('.lc-console').getByRole('button', { name: /^(Send|Open|Run|Build)$/ }),
  ).toBeEnabled();
}

test('saved chat restoration keeps the normal shell and unlocks exactly the restored history', async ({
  page,
}) => {
  let hold = false;
  let held: { route: Route; saved: SavedThread } | undefined;
  const state = await installChatFixture(
    page,
    (route, input) =>
      finishReply(route, input, 'restored-followup', 'The restored chat continues.'),
    undefined,
    async (route, _id, saved) => {
      if (hold) {
        held = { route, saved: structuredClone(saved) };
        return;
      }
      await route.fulfill({ json: saved });
    },
  );
  await page.goto('/');
  await waitForChatUI(page);
  await composer(page).fill('Unsent setup draft.');
  await waitForSend(page);
  await composer(page).clear();
  await page.getByTitle(savedTitle, { exact: true }).click();
  await expect(conversation(page).getByText(savedAnswer, { exact: true })).toBeVisible();
  hold = true;
  await page.reload();
  await waitForChatUI(page);
  await expect.poll(() => !!held).toBe(true);
  const recovery = page.getByRole('region', { name: 'Saved chat recovery', exact: true });
  await expect(recovery).toContainText('Opening your saved chat');
  await expect(page.locator('[data-chat-panel] .lc-console')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open Scope', exact: true })).toBeVisible();
  await expect(composer(page)).toBeDisabled();
  await expect(
    page.locator('.lc-console').getByRole('button', { name: 'Send', exact: true }),
  ).toBeDisabled();
  await expect(
    recovery.getByRole('button', { name: 'Start a new chat', exact: true }),
  ).toBeEnabled();
  await page.getByRole('button', { name: 'Open Scope', exact: true }).click();
  const scope = page.getByRole('dialog', { name: 'Scope for this chat', exact: true });
  await expect(scope.getByRole('textbox', { name: 'Company name' })).toBeDisabled();
  await expect(scope.getByRole('spinbutton', { name: 'Reporting year' })).toBeDisabled();
  for (const name of ['Apply to this chat', 'Upload file', 'Add text'])
    await expect(scope.getByRole('button', { name, exact: true })).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(scope).toBeHidden();
  expect(state.reads).toEqual([savedThreadId, savedThreadId]);
  expect(state.runs).toHaveLength(0);
  await page.screenshot({ path: test.info().outputPath('saved-chat-restoring-shell.png') });
  hold = false;
  await held!.route.fulfill({ json: held!.saved });
  await expect(conversation(page).locator('[data-message-id="saved-answer"]')).toContainText(
    savedAnswer,
  );
  await expect(recovery).toHaveCount(0);
  await expect(composer(page)).toBeEditable();
  await composer(page).fill('Continue this exact saved conversation.');
  await waitForSend(page);
  await composer(page).press('Enter');
  await expect(
    conversation(page).getByText('The restored chat continues.', { exact: true }),
  ).toBeVisible();
  expect(state.runs).toHaveLength(1);
  expect(
    state.runs[0].messages
      .filter((message) => message.role === 'user')
      .map((message) => message.content),
  ).toEqual([savedQuestion, 'Continue this exact saved conversation.']);
  expect(state.runs[0].messages.find((message) => message.id === 'saved-answer')?.content).toBe(
    savedAnswer,
  );
  await expect
    .poll(() =>
      state.writes.some(
        ({ id, thread }) =>
          id === savedThreadId &&
          thread.messages.some(
            (message) => message.content.text === 'The restored chat continues.',
          ),
      ),
    )
    .toBe(true);
  expect(
    state.writes
      .filter(({ id }) => id === savedThreadId)
      .every(({ thread }) =>
        thread.messages.some(
          (message) => message.id === 'saved-question' && message.content.text === savedQuestion,
        ),
      ),
  ).toBe(true);
  expect(state.unexpected).toEqual([]);
});

test('failed saved chat restoration retries the requested chat and New chat rejects a late restore', async ({
  page,
}) => {
  let mode: 'fail' | 'ready' | 'hold' = 'fail';
  let held: { route: Route; saved: SavedThread } | undefined;
  const state = await installChatFixture(
    page,
    (route, input) =>
      finishReply(route, input, 'new-after-restore', 'Only the new conversation continues.'),
    undefined,
    async (route, _id, saved) => {
      if (mode === 'hold') {
        held = { route, saved: structuredClone(saved) };
        return;
      }
      if (mode === 'fail') {
        await route.fulfill({ status: 503, json: { error: 'Synthetic saved-chat read failure.' } });
        return;
      }
      await route.fulfill({ json: saved });
    },
  );
  await page.goto('/');
  await waitForChatUI(page);
  await composer(page).fill('An unsent draft survives a failed restore.');
  await waitForSend(page);
  await page.getByTitle(savedTitle, { exact: true }).click();
  const recovery = page.getByRole('region', { name: 'Saved chat recovery', exact: true });
  await expect(recovery.getByRole('alert')).toContainText('could not be opened');
  await expect(page.getByRole('button', { name: 'Open Scope', exact: true })).toBeVisible();
  await expect(composer(page)).toHaveValue('An unsent draft survives a failed restore.');
  await expect(composer(page)).toBeDisabled();
  await expect(
    page.locator('.lc-console').getByRole('button', { name: 'Send', exact: true }),
  ).toBeDisabled();
  expect(state.reads).toEqual([savedThreadId]);
  expect(state.writes).toEqual([]);
  await page.screenshot({ path: test.info().outputPath('saved-chat-failed-shell.png') });
  mode = 'ready';
  await recovery.getByRole('button', { name: 'Retry saved chat', exact: true }).click();
  await expect(conversation(page).getByText(savedAnswer, { exact: true })).toBeVisible();
  await expect(recovery).toHaveCount(0);
  await expect(composer(page)).toBeEditable();
  expect(state.reads).toEqual([savedThreadId, savedThreadId]);
  mode = 'hold';
  await page.getByTitle(savedTitle, { exact: true }).click();
  await expect.poll(() => !!held).toBe(true);
  await expect(composer(page)).toBeDisabled();
  await recovery.getByRole('button', { name: 'Start a new chat', exact: true }).click();
  await expect(recovery).toHaveCount(0);
  await expect(composer(page)).toBeEditable();
  await held!.route.fulfill({ json: held!.saved });
  await composer(page).fill('This is a separate new conversation.');
  await waitForSend(page);
  await composer(page).press('Enter');
  await expect(
    conversation(page).getByText('Only the new conversation continues.', { exact: true }),
  ).toBeVisible();
  await expect(conversation(page).locator('[data-message-id="saved-answer"]')).toHaveCount(0);
  expect(state.runs).toHaveLength(1);
  expect(
    state.runs[0].messages
      .filter((message) => message.role === 'user')
      .map((message) => message.content),
  ).toEqual(['This is a separate new conversation.']);
  expect(state.reads).toEqual([savedThreadId, savedThreadId, savedThreadId]);
  expect(
    state.writes
      .filter(({ id }) => id === savedThreadId)
      .every(({ thread }) =>
        thread.messages.some(
          (message) => message.id === 'saved-question' && message.content.text === savedQuestion,
        ),
      ),
  ).toBe(true);
  expect(state.unexpected).toEqual([]);
});

test('a saved chat restore times out at its existing bound and New chat recovers without replacing history', async ({
  page,
}) => {
  let held: { route: Route; saved: SavedThread } | undefined;
  const state = await installChatFixture(
    page,
    (route, input) => finishReply(route, input, 'after-timeout', 'The new chat is available.'),
    undefined,
    async (route, _id, saved) => {
      held = { route, saved: structuredClone(saved) };
    },
  );
  await page.goto('/');
  await waitForChatUI(page);
  await composer(page).fill('Keep this unsent draft while the saved chat is unavailable.');
  await waitForSend(page);
  await page.clock.install({ time: new Date('2026-10-10T12:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-10T12:00:10Z'));
  await page.getByTitle(savedTitle, { exact: true }).click();
  await expect.poll(() => !!held).toBe(true);
  const recovery = page.getByRole('region', { name: 'Saved chat recovery', exact: true });
  await page.clock.fastForward(19_999);
  await expect(recovery).toContainText('Opening your saved chat');
  await expect(recovery.getByRole('alert')).toHaveCount(0);
  await expect(composer(page)).toBeDisabled();
  await page.clock.fastForward(2);
  await expect(recovery.getByRole('alert')).toContainText('Opening your saved chat took too long');
  await expect(composer(page)).toHaveValue(
    'Keep this unsent draft while the saved chat is unavailable.',
  );
  await expect(page.getByRole('button', { name: 'Open Scope', exact: true })).toBeVisible();
  await expect(
    recovery.getByRole('button', { name: 'Retry saved chat', exact: true }),
  ).toBeEnabled();
  expect(state.reads).toEqual([savedThreadId]);
  expect(state.writes).toEqual([]);
  expect(state.runs).toEqual([]);
  await recovery.getByRole('button', { name: 'Start a new chat', exact: true }).click();
  await expect(recovery).toHaveCount(0);
  await expect(composer(page)).toBeEditable();
  await held!.route.fulfill({ json: held!.saved });
  await composer(page).fill('Continue after the failed restore.');
  await waitForSend(page);
  await composer(page).press('Enter');
  await expect(
    conversation(page).getByText('The new chat is available.', { exact: true }),
  ).toBeVisible();
  await expect(conversation(page).locator('[data-message-id="saved-answer"]')).toHaveCount(0);
  expect(
    state.runs[0].messages
      .filter((message) => message.role === 'user')
      .map((message) => message.content),
  ).toEqual(['Continue after the failed restore.']);
  expect(state.saved.get(savedThreadId)?.messages.map((message) => message.content.text)).toEqual([
    savedQuestion,
    savedAnswer,
  ]);
});

test('assistant-ui Stop stops the exact remote stream, retains the draft and rejects late tokens', async ({
  page,
}) => {
  const stream = await openHeldStream();
  const state = await installChatFixture(
    page,
    (route, input, attempt) =>
      attempt === 1
        ? route.continue({ url: stream.url })
        : finishReply(route, input, 'next-reply', 'The next request completed.'),
    stream.stop,
  );
  try {
    await page.goto('/');
    await waitForChatUI(page);
    await expect(conversation(page)).toHaveAttribute('data-assistant-ui-thread');
    await expect(composer(page)).toBeEditable();
    const originalViewport = page.viewportSize();
    const desktopComposer = await composer(page).boundingBox();
    expect(desktopComposer).not.toBeNull();
    await page.screenshot({ path: test.info().outputPath('assistant-ui-home-desktop.png') });
    await page.setViewportSize({ width: 390, height: 844 });
    await expect
      .poll(async () => (await composer(page).boundingBox())?.width ?? 0)
      .toBeGreaterThanOrEqual(180);
    const mobileComposer = await composer(page).boundingBox();
    expect(mobileComposer).not.toBeNull();
    expect(mobileComposer!.width).toBeGreaterThanOrEqual(180);
    expect(mobileComposer!.x + mobileComposer!.width).toBeLessThanOrEqual(390);
    for (const control of [
      page.locator('.lc-console').getByRole('button', { name: 'Chat agent: Sina', exact: true }),
      page.locator('.lc-console').getByRole('button', { name: /^Computer:/ }),
    ]) {
      const bounds = await control.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
    }
    const mobileDraft = 'Explain the first topic.';
    await composer(page).fill(mobileDraft);
    await page.getByRole('button', { name: 'Expand sidebar', exact: true }).click();
    await expect(
      page.getByRole('button', { name: 'Collapse sidebar', exact: true }),
    ).toHaveAttribute('aria-expanded', 'true');
    await expect
      .poll(async () => (await composer(page).boundingBox())?.width ?? 0)
      .toBeCloseTo(mobileComposer!.width, 1);
    await expect(composer(page)).toHaveValue(mobileDraft);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Expand sidebar', exact: true })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect
      .poll(async () => (await composer(page).boundingBox())?.width ?? 0)
      .toBeCloseTo(mobileComposer!.width, 1);
    await expect(composer(page)).toHaveValue(mobileDraft);
    await page.screenshot({ path: test.info().outputPath('assistant-ui-home-mobile.png') });
    if (originalViewport) {
      await page.setViewportSize(originalViewport);
      await expect
        .poll(async () => (await composer(page).boundingBox())?.width ?? 0)
        .toBeCloseTo(desktopComposer!.width, 1);
    }
    await expect(composer(page)).toHaveValue(mobileDraft);
    await waitForSend(page);
    await composer(page).press('Enter');
    await expect(conversation(page).locator('[data-message-id="held-reply"]')).toContainText(
      'A partial answer.',
    );
    await composer(page).fill('@fapi');
    const workflowSuggestion = page
      .getByRole('button', { name: /FAPI/ })
      .filter({ hasText: 'FAPI' })
      .first();
    await expect(workflowSuggestion).toBeDisabled();
    await composer(page).press('ArrowDown');
    await composer(page).press('Enter');
    await expect(composer(page)).toHaveValue('@fapi');
    await expect(
      conversation(page).getByRole('region', { name: 'Workflow in chat', exact: true }),
    ).toHaveCount(0);
    expect(state.runs).toHaveLength(1);
    await composer(page).fill('Keep this unsent follow-up.');
    await page.getByRole('button', { name: 'Stop', exact: true }).click();
    await expect.poll(stream.isClosed).toBe(true);
    expect(state.stops).toEqual([{ agentId: 'default', threadId: state.runs[0].threadId }]);
    stream.finishLate();
    await expect(composer(page)).toHaveValue('Keep this unsent follow-up.');
    await expect(page.getByRole('button', { name: 'Send', exact: true })).toBeEnabled();
    expect(state.runs).toHaveLength(1);
    await expect(conversation(page)).not.toContainText('LATE OLD TOKENS');
    await composer(page).press('Enter');
    await expect(conversation(page).locator('[data-message-id="next-reply"]')).toContainText(
      'The next request completed.',
    );
    expect(state.runs).toHaveLength(2);
    expect(state.runs[1].messages.filter((message) => message.role === 'user')).toHaveLength(2);
    await expect(conversation(page)).not.toContainText('LATE OLD TOKENS');
    expect(state.unexpected).toEqual([]);
  } finally {
    await stream.close();
  }
});

test('assistant-ui retries one failed text turn without repeating a completed tool or user message', async ({
  page,
}) => {
  const toolCallId = 'completed-document-search';
  const firstQuestion = 'Tell me what the saved documents say about the existing decision.';
  const failedQuestion = 'Explain that result in a single sentence.';
  const selectedDocument = {
    id: 'retry-selected-source',
    fileName: 'Decision notes.txt',
    mimeType: 'text/plain',
    sourceRevision: 1,
    contentHash: null,
    lifecycleStatus: 'active',
    status: 'ready',
  };
  const selectedText = 'Synthetic evidence: the existing decision is ready for review.';
  const state = await installChatFixture(page, async (route, input, attempt) => {
    if (attempt === 1) {
      expect(input.tools.some((tool) => tool.name === 'searchCompanyDocuments')).toBe(true);
      return route.fulfill({
        contentType: 'text/event-stream',
        body: encodeEvents([
          { type: 'RUN_STARTED', threadId: input.threadId, runId: input.runId },
          {
            type: 'TOOL_CALL_START',
            toolCallId,
            toolCallName: 'searchCompanyDocuments',
            parentMessageId: 'search-request',
          },
          {
            type: 'TOOL_CALL_ARGS',
            toolCallId,
            delta: JSON.stringify({ query: 'existing decision' }),
          },
          { type: 'TOOL_CALL_END', toolCallId },
          { type: 'RUN_FINISHED', threadId: input.threadId, runId: input.runId },
        ]),
      });
    }
    if (attempt === 2)
      return finishReply(route, input, 'search-summary', 'The search is complete.');
    if (attempt === 3)
      return route.fulfill({
        contentType: 'text/event-stream',
        body: encodeEvents([
          { type: 'RUN_STARTED', threadId: input.threadId, runId: input.runId },
          { type: 'RUN_ERROR', message: 'Synthetic text reply failure.' },
        ]),
      });
    return finishReply(route, input, 'retry-success', 'The explanation succeeded on retry.');
  });
  // The search tool only reads explicitly selected sources. Exercise its real
  // request path before verifying that Retry never repeats that completed tool.
  await page.route('**/api/documents', (route) =>
    route.fulfill({ json: { documents: [selectedDocument] } }),
  );
  await page.route('**/api/documents/retry-selected-source', (route) =>
    route.fulfill({ json: { document: selectedDocument, downloadUrl: '/api/retry-fixture-file' } }),
  );
  await page.route('**/api/retry-fixture-file', (route) =>
    route.fulfill({ contentType: 'text/plain', body: selectedText }),
  );
  await page.route('**/api/assistant/extract', (route) =>
    route.fulfill({ json: { kind: 'text', text: selectedText, truncated: false } }),
  );
  await page.goto('/');
  await page.getByRole('button', { name: 'Attach files', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Choose from Sources', exact: true }).click();
  await page
    .getByRole('dialog', { name: 'Choose from Sources' })
    .getByRole('button', { name: selectedDocument.fileName, exact: true })
    .click();
  const context = page.locator('[data-chat-context]');
  await page.getByRole('button', { name: 'Open Scope', exact: true }).click();
  await expect(context.locator('[data-context-source="retry-selected-source"]')).toContainText(
    'Ready',
  );
  await page.keyboard.press('Escape');
  await composer(page).fill(firstQuestion);
  await waitForSend(page);
  await composer(page).press('Enter');
  await expect(conversation(page).locator('[data-message-id="search-summary"]')).toContainText(
    'The search is complete.',
  );
  expect(state.searches).toHaveLength(1);
  expect(state.searches[0]).toMatchObject({
    selectedSourceIds: [selectedDocument.id],
    policy: 'selected-only',
  });
  expect(state.runs).toHaveLength(2);
  await composer(page).fill(failedQuestion);
  await composer(page).press('Enter');
  await expect(
    page.getByRole('alert').filter({ hasText: 'Sina could not complete its reply' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Retry reply', exact: true })).toBeEnabled();
  expect(state.runs).toHaveLength(3);
  const failedUserId = state.runs[2].messages.find(
    (message) => message.role === 'user' && message.content === failedQuestion,
  )?.id;
  expect(failedUserId).toBeTruthy();
  await page.getByRole('button', { name: 'Retry reply', exact: true }).click();
  await expect(
    conversation(page).locator('[data-message-id="retry-success"][data-agent="sina"]'),
  ).toContainText('The explanation succeeded on retry.');
  expect(state.runs).toHaveLength(4);
  expect(state.searches).toHaveLength(1);
  const retried = state.runs[3].messages;
  expect(
    retried.filter((message) => message.role === 'user').map((message) => message.content),
  ).toEqual([firstQuestion, failedQuestion]);
  expect(retried.filter((message) => message.id === failedUserId)).toHaveLength(1);
  expect(
    retried.filter((message) => message.role === 'tool' && message.toolCallId === toolCallId),
  ).toHaveLength(1);
  expect(
    retried.flatMap((message) => message.toolCalls ?? []).filter((call) => call.id === toolCallId),
  ).toHaveLength(1);
  await expect(conversation(page).getByText(failedQuestion, { exact: true })).toHaveCount(1);
  await expect
    .poll(() =>
      [...state.saved.values()].some((thread) =>
        thread.messages.some((message) => message.id === 'retry-success'),
      ),
    )
    .toBe(true);
  await page.reload();
  await waitForChatUI(page);
  await expect(conversation(page).locator('[data-message-id="retry-success"]')).toContainText(
    'The explanation succeeded on retry.',
  );
  await expect(conversation(page).getByText(failedQuestion, { exact: true })).toHaveCount(1);
  expect(state.runs).toHaveLength(4);
  expect(state.searches).toHaveLength(1);
  expect(state.unexpected).toEqual([]);
});

for (const destination of ['new', 'saved'] as const) {
  test(`assistant-ui switching to a ${destination} chat stops the exact active reply and keeps histories separate`, async ({
    page,
  }) => {
    const stream = await openHeldStream();
    const interruptedQuestion = 'Keep this interrupted conversation separate.';
    const nextQuestion = 'Answer only in the destination conversation.';
    const nextAnswer = 'This answer belongs to the destination conversation.';
    const state = await installChatFixture(
      page,
      (route, input, attempt) =>
        attempt === 1
          ? route.continue({ url: stream.url })
          : finishReply(route, input, 'destination-reply', nextAnswer),
      stream.stop,
    );
    try {
      await page.goto('/');
      await waitForChatUI(page);
      await composer(page).fill(interruptedQuestion);
      await waitForSend(page);
      await composer(page).press('Enter');
      await expect(conversation(page).locator('[data-message-id="held-reply"]')).toContainText(
        'A partial answer.',
      );
      if (destination === 'new')
        await page.getByRole('button', { name: 'New chat', exact: true }).click();
      else await page.getByTitle(savedTitle, { exact: true }).click();
      await expect.poll(stream.isClosed).toBe(true);
      expect(state.stops).toEqual([{ agentId: 'default', threadId: state.runs[0].threadId }]);
      stream.finishLate();
      await expect(composer(page)).toBeEditable();
      await expect(conversation(page)).not.toContainText(interruptedQuestion);
      await expect(conversation(page)).not.toContainText('A partial answer.');
      await expect(conversation(page)).not.toContainText('LATE OLD TOKENS');
      if (destination === 'saved') {
        await expect(conversation(page).locator('[data-message-id="saved-question"]')).toHaveText(
          savedQuestion,
        );
        await expect(
          conversation(page).locator('[data-message-id="saved-answer"][data-agent="sina"]'),
        ).toContainText(savedAnswer);
      } else {
        await expect(conversation(page).locator('[data-message-id]')).toHaveCount(0);
      }
      expect(state.runs).toHaveLength(1);
      const interruptedEntry = [...state.saved].find(([, thread]) =>
        thread.messages.some((message) => message.content.text === interruptedQuestion),
      );
      expect(interruptedEntry).toBeDefined();
      const interruptedHistory = structuredClone(interruptedEntry![1].messages);
      // Persisted histories also include the system workflow-binding metadata.
      // Compare visible turns here, then preserve every row in the checks below.
      expect(
        interruptedHistory
          .filter((message) => message.role === 'user' || message.role === 'assistant')
          .map((message) => message.content.text),
      ).toEqual([interruptedQuestion, 'A partial answer.']);
      await composer(page).fill(nextQuestion);
      await composer(page).press('Enter');
      await expect(
        conversation(page).locator('[data-message-id="destination-reply"]'),
      ).toContainText(nextAnswer);
      expect(state.runs).toHaveLength(2);
      expect(
        state.runs[1].messages
          .filter((message) => message.role === 'user')
          .map((message) => message.content),
      ).toEqual(destination === 'saved' ? [savedQuestion, nextQuestion] : [nextQuestion]);
      expect(JSON.stringify(state.runs[1])).not.toContain(interruptedQuestion);
      expect(JSON.stringify(state.runs[1])).not.toContain('LATE OLD TOKENS');
      await expect
        .poll(() =>
          [...state.saved.values()].some((thread) =>
            thread.messages.some((message) => message.id === 'destination-reply'),
          ),
        )
        .toBe(true);
      expect(state.saved.get(interruptedEntry![0])?.messages).toEqual(interruptedHistory);
      await page.reload();
      await waitForChatUI(page);
      await expect(
        conversation(page).locator('[data-message-id="destination-reply"]'),
      ).toContainText(nextAnswer);
      await page.getByTitle(interruptedQuestion, { exact: true }).click();
      await expect(conversation(page).getByText(interruptedQuestion, { exact: true })).toHaveCount(
        1,
      );
      await expect(conversation(page).locator('[data-message-id="held-reply"]')).toContainText(
        'A partial answer.',
      );
      await expect(conversation(page)).not.toContainText(nextQuestion);
      await expect(conversation(page)).not.toContainText(nextAnswer);
      await expect(conversation(page)).not.toContainText('LATE OLD TOKENS');
      expect(state.runs).toHaveLength(2);
      expect(state.unexpected).toEqual([]);
    } finally {
      await stream.close();
    }
  });
}

test('assistant-ui opens the exact saved FAPI version once and keeps its live worksheet through follow-ups', async ({
  page,
}) => {
  let workflowId = '';
  const toolCallId = 'open-saved-fapi-v1';
  const requestText = 'Please open version 1 of my saved FAPI workflow in this chat.';
  const followupText = 'Explain the recorded worksheet without changing the calculation.';
  const state = await installChatFixture(page, async (route, input, attempt) => {
    if (attempt !== 1)
      return finishReply(
        route,
        input,
        'fapi-followup',
        'The recorded worksheet remains unchanged.',
      );
    expect(input.tools.some((tool) => tool.name === 'openSavedWorkflowVersion')).toBe(true);
    expect(workflowId).not.toBe('');
    return route.fulfill({
      contentType: 'text/event-stream',
      body: encodeEvents([
        { type: 'RUN_STARTED', threadId: input.threadId, runId: input.runId },
        {
          type: 'TOOL_CALL_START',
          toolCallId,
          toolCallName: 'openSavedWorkflowVersion',
          parentMessageId: 'open-fapi-message',
        },
        { type: 'TOOL_CALL_ARGS', toolCallId, delta: JSON.stringify({ workflowId, version: 1 }) },
        { type: 'TOOL_CALL_END', toolCallId },
        { type: 'RUN_FINISHED', threadId: input.threadId, runId: input.runId },
      ]),
    });
  });
  // The established workflow fixtures retain extracted evidence locally when
  // object storage is unavailable. No external file service participates here.
  await page.route('**/api/documents/upload-url', (route) =>
    route.fulfill({ status: 503, json: { error: 'STORAGE_NOT_CONFIGURED' } }),
  );
  await page.goto('/w/pf-fapi');
  const backup = await page.evaluate(
    async (rootPath) => {
      const { createWorkflow, replaceDraft, saveVersion } = await import(
        `${rootPath}/lib/workflow-core/src/application/commands.ts`
      );
      const { createFapiTemplateWorkflow } =
        await import('/src/shared/workflow-engine/workflow/templates/fapi.ts');
      const { stringifySharedJSON } = await import('/src/shared/workflow-engine/shared-json.ts');
      const definition = createFapiTemplateWorkflow();
      definition.name = 'Assistant UI saved FAPI';
      const first = saveVersion(createWorkflow('custom:assistant-ui-fapi', 'pf-fapi', definition));
      const later = structuredClone(first.draft);
      later.blocks.find((block) => block.id === 'fapi-source-inputs')!.config.inclusionRate = 0.25;
      return stringifySharedJSON({ [first.id]: saveVersion(replaceDraft(first, later)) });
    },
    `/@fs/${process.cwd().replaceAll('\\', '/')}`,
  );
  await page.getByLabel('Workflow storage status').click();
  await page.getByLabel('Import workflow backup').setInputFiles({
    name: 'assistant-ui-fapi-versions.json',
    mimeType: 'application/json',
    buffer: Buffer.from(backup),
  });
  await expect(
    page.getByRole('button', { name: 'Assistant UI saved FAPI — Imported', exact: true }),
  ).toBeVisible();
  workflowId = await page.evaluate(async () => {
    const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
    const entry = Object.values(readWorkflowLibrary()).find(
      (item) => item.draft.name === 'Assistant UI saved FAPI — Imported',
    );
    if (!entry) throw new Error('The synthetic saved FAPI backup was not imported.');
    return entry.id;
  });
  await page.getByLabel('Workflow storage status').click();
  await page.getByRole('button', { name: 'Chat', exact: true }).click();
  await composer(page).fill(requestText);
  await waitForSend(page);
  await composer(page).press('Enter');
  const thread = conversation(page);
  const card = thread.getByRole('region', { name: 'Workflow in chat', exact: true });
  const panel = card.getByRole('region', { name: 'Workflow execution', exact: true });
  const timeline = panel.getByRole('list', { name: 'Execution steps', exact: true });
  const worksheet = panel.getByRole('region', { name: 'FAPI worksheet', exact: true });
  const summary = worksheet.getByRole('table', { name: 'FAPI results summary', exact: true });
  await expect(card).toHaveCount(1);
  await expect(panel.locator(':scope > header')).toContainText('Version 1');
  await expect(timeline.locator('[data-stage-toggle]')).toHaveCount(4);
  await expect(timeline.locator('.workflow-timeline-kind')).toHaveText([
    'Source',
    'Rule match',
    'Engine',
    'Checkpoint',
  ]);
  expect(
    await timeline
      .locator('.workflow-timeline-stage')
      .evaluateAll((stages) => stages.map((stage) => getComputedStyle(stage).animationName)),
  ).toEqual(['workflow-step-in', 'workflow-step-in', 'workflow-step-in', 'workflow-step-in']);
  await expect(summary.locator('[data-result-key="NET_FAPI_CAD"]')).toHaveText('Not calculated');
  await expect
    .poll(() =>
      [...state.saved.values()].some((entry) =>
        entry.messages.some(
          (message) => message.role === 'tool' && message.content.toolCall?.callId === toolCallId,
        ),
      ),
    )
    .toBe(true);
  const chat = [...state.saved.values()].find((entry) =>
    entry.messages.some((message) => message.content.text === requestText),
  )!;
  const binding = chat.messages.find((message) => message.content.workflowBinding)?.content
    .workflowBinding as { workflowId: string; runId: string };
  expect(binding).toBeDefined();
  expect(binding.workflowId).toBe(workflowId);
  await expect(worksheet).toHaveAttribute('data-run-id', binding.runId);
  const originalUserId = state.runs[0].messages.find(
    (message) => message.content === requestText,
  )!.id;
  expect(
    await thread.evaluate((element, id) => {
      const request = [...element.querySelectorAll('[data-message-id]')].find(
        (item) => item.getAttribute('data-message-id') === id,
      );
      const workflow = element.querySelector('#chat-workflow');
      return (
        !!request &&
        !!workflow &&
        !!(request.compareDocumentPosition(workflow) & Node.DOCUMENT_POSITION_FOLLOWING)
      );
    }, originalUserId),
  ).toBe(true);
  const read = () =>
    page.evaluate(async (id) => {
      const { readWorkflowLibrary } =
        await import('/src/features/workflows-hub/workflow-library.ts');
      const entry = readWorkflowLibrary()[id];
      return {
        versions: entry.versions.map((version) => version.number),
        runs: entry.runs.map((run) => ({
          version: run.version,
          id: run.result.record.execution.id,
        })),
        sessions: entry.sessions?.map((session) => ({
          id: session.id,
          version: session.version,
          revision: session.revision,
          attempts: session.attempts.length,
          inputs: session.inputOverrides,
          netCad:
            session.results['fapi-logic-summary-engine']?.output?.calculatedResults?.NET_FAPI_CAD,
        })),
      };
    }, workflowId);
  const unopened = await read();
  expect(unopened.versions).toEqual([1, 2]);
  expect(unopened.runs).toEqual([]);
  expect(unopened.sessions).toHaveLength(1);
  expect(unopened.sessions![0].attempts).toBe(0);
  const form = panel.getByRole('region', { name: 'Inputs for FAPI Inputs', exact: true });
  const inclusion = form
    .getByText('Inclusion rate', { exact: true })
    .locator('..')
    .locator('input');
  await expect(inclusion).toBeEditable();
  await expect(inclusion).toHaveValue('0.5');
  // Same synthetic records and independent expected arithmetic as
  // fapi-reference-display.spec.ts: net=700 USD and 945 CAD at v1's 0.5 rate.
  const rows = [
    {
      rowId: 'interest',
      account: '4000',
      label: 'Interest income',
      description: 'Bank interest income',
      amount: 1000,
      currency: 'USD',
    },
    {
      rowId: 'expense',
      account: '5000',
      label: 'General expenses',
      description: 'Operating expenses',
      amount: -100,
      currency: 'USD',
    },
    {
      rowId: 'gain',
      account: '4300',
      label: 'Capital gains',
      description: 'Capital gains on shares',
      amount: 400,
      currency: 'USD',
    },
  ];
  await panel.getByLabel('Upload run source').setInputFiles({
    name: 'synthetic-fapi-trial-balance.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(rows)),
  });
  await expect(panel).toContainText('synthetic-fapi-trial-balance.json · 3 records');
  await panel.getByRole('button', { name: 'Start workflow', exact: true }).click();
  // Execution yields between blocks; inspect the sheet after the run pauses.
  await panel.getByRole('button', { name: 'Resume workflow', exact: true }).waitFor();
  await expect(summary.locator('[data-result-key="NET_FAPI_CAD"]')).toHaveText('945.00');
  await expect(summary.getByRole('columnheader')).toHaveText(['Results summary', 'USD', 'CAD']);
  await expect(summary.locator('tbody > tr > th')).toContainText([
    'Gross',
    'Deductions',
    'FAPI brut',
    'FAT deduction',
    'Net FAPI',
  ]);
  await expect(summary.locator('[data-result-key="NET_FAPI"]')).toHaveText('700.00');
  const calculated = await read();
  expect(calculated.runs).toHaveLength(1);
  expect(calculated.runs[0].version).toBe(1);
  const collect = timeline.locator('[data-stage-toggle="collect"]');
  if ((await collect.getAttribute('aria-expanded')) !== 'true') await collect.click();
  await inclusion.fill('0.25');
  await composer(page).fill(followupText);
  await composer(page).press('Enter');
  await expect(thread.locator('[data-message-id="fapi-followup"]')).toContainText(
    'The recorded worksheet remains unchanged.',
  );
  await expect(card).toHaveCount(1);
  await expect(worksheet).toHaveAttribute('data-run-id', binding.runId);
  await expect(inclusion).toHaveValue('0.25');
  expect(await read()).toEqual(calculated);
  expect(state.runs).toHaveLength(2);
  expect(
    state.runs[1].messages.filter(
      (message) => message.role === 'tool' && message.toolCallId === toolCallId,
    ),
  ).toHaveLength(1);
  expect(
    await thread.evaluate((element, text) => {
      const workflow = element.querySelector('#chat-workflow');
      const followup = [...element.querySelectorAll('[data-message-id]')].find(
        (item) => item.textContent === text,
      );
      return (
        !!workflow &&
        !!followup &&
        !!(workflow.compareDocumentPosition(followup) & Node.DOCUMENT_POSITION_FOLLOWING)
      );
    }, followupText),
  ).toBe(true);
  await form.getByRole('button', { name: 'Apply inputs & recalculate', exact: true }).click();
  // Require this Apply's revision to finish, so the previous paused UI cannot
  // satisfy the readiness wait before the input update has been accepted.
  await page.waitForFunction(
    async ({ workflowId, runId, revision }) => {
      const { readWorkflowLibrary } =
        await import('/src/features/workflows-hub/workflow-library.ts');
      const session = readWorkflowLibrary()[workflowId].sessions?.find((item) => item.id === runId);
      return session && session.revision > revision && session.paused;
    },
    { workflowId, runId: binding.runId, revision: calculated.sessions![0].revision },
  );
  await panel.getByRole('button', { name: 'Resume workflow', exact: true }).waitFor();
  await expect(summary.locator('[data-result-key="NET_FAPI_CAD"]')).toHaveText('810.00');
  await expect(summary.locator('[data-result-key="NET_FAPI"]')).toHaveText('600.00');
  await expect.poll(async () => (await read()).runs.length).toBe(2);
  const recalculated = await read();
  expect(recalculated.sessions).toHaveLength(1);
  expect(recalculated.sessions![0].id).toBe(binding.runId);
  expect(recalculated.sessions![0].netCad).toBe(810);
  expect(recalculated.runs[0]).toEqual(calculated.runs[0]);
  await worksheet.getByText('Open full worksheet', { exact: true }).click();
  const lines = worksheet.getByRole('table', { name: 'FAPI worksheet lines', exact: true });
  await expect(lines.locator('[data-result-key="A"]')).toHaveText('900.00');
  await expect(lines.locator('[data-result-key="B"]')).toHaveText('100.00');
  const downloaded = page.waitForEvent('download');
  await worksheet.getByRole('button', { name: 'Export worksheet CSV', exact: true }).click();
  const download = await downloaded;
  const downloadedPath = await download.path();
  expect(downloadedPath).not.toBeNull();
  const csv = readFileSync(downloadedPath!, 'utf8');
  expect(csv).toContain(
    `"Run","${binding.runId}","Version",1,"Revision",${recalculated.sessions![0].revision}`,
  );
  expect(csv).toContain(
    '"Results summary","NET_FAPI","Net FAPI","CAD","current",810,"fapi-logic-summary-engine","NET_FAPI_CAD"',
  );
  await page.reload();
  await waitForChatUI(page);
  await expect(card).toHaveCount(1);
  await expect(worksheet).toHaveAttribute('data-run-id', binding.runId);
  await expect(summary.locator('[data-result-key="NET_FAPI_CAD"]')).toHaveText('810.00');
  expect(await read()).toEqual(recalculated);
  expect(state.runs).toHaveLength(2);
  expect(state.unexpected).toEqual([]);
  await panel.locator(':scope > header').scrollIntoViewIfNeeded();
  await page.screenshot({
    path: test.info().outputPath('assistant-ui-fapi-restored-workflow.png'),
  });
  await worksheet.scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath('assistant-ui-fapi-restored-results.png') });
});

test('assistant-ui workflow choices resolve full names for both agents and retain identical names', async ({
  page,
}) => {
  const requests = [
    'Show my saved FAPI Calculation Template, Sina.',
    'Show my saved FAPI Calculation Template, MicroSina.',
    'Show the available built-in FAPI workflow.',
  ];
  const emitted = new Set<string>();
  const state = await installChatFixture(page, async (route, input) => {
    const userText = String(input.messages.findLast((message) => message.role === 'user')?.content);
    const index = requests.indexOf(userText);
    expect(index).toBeGreaterThanOrEqual(0);
    if (emitted.has(userText))
      return finishReply(
        route,
        input,
        `choice-answer-${index}`,
        'Choose the workflow shown below.',
      );
    emitted.add(userText);
    return listWorkflowReply(
      route,
      input,
      `choice-list-${index}`,
      index === 2 ? 'listAvailableWorkflows' : 'listSavedWorkflows',
      index === 2 ? 'FAPI' : ' fapi calculation template ',
    );
  });
  const library = await installWorkflowChoices(page);
  const unopened = await library.read();
  for (const [index, agent] of ['Sina', 'MicroSina'].entries()) {
    await page
      .locator('.lc-console')
      .getByRole('button', { name: /^Chat agent:/ })
      .click();
    await page
      .getByRole('menuitemradio', {
        name: agent === 'Sina' ? 'Sina · Tax specialist' : 'MicroSina · Foundry',
        exact: true,
      })
      .click();
    if (index === 1) await library.update('duplicate');
    await composer(page).fill(requests[index]);
    await waitForSend(page);
    await composer(page).press('Enter');
    const choices = conversation(page)
      .locator(`[data-message-id="choice-list-${index}-message"]`)
      .getByRole('region', { name: 'Saved workflows', exact: true });
    await expect(choices.locator('[data-workflow-choice]')).toHaveCount(index + 1);
    await expect(choices.locator(`[data-workflow-choice="${firstChoiceId}"]`)).toBeVisible();
    await expect(choices.locator(`[data-workflow-choice="${draftChoiceId}"]`)).toHaveCount(0);
    if (index === 1)
      await expect(choices.locator(`[data-workflow-choice="${secondChoiceId}"]`)).toBeVisible();
    await expect(
      choices.getByRole('button', { name: `Open ${choiceName} version 1 in chat`, exact: true }),
    ).toHaveCount(index + 1);
    await expect(
      conversation(page).locator(`[data-message-id="choice-answer-${index}"]`),
    ).toBeVisible();
    const firstRequest = state.runs.find((input) =>
      input.messages.some(
        (message) => message.role === 'user' && message.content === requests[index],
      ),
    )!;
    // Inspect the real outbound host context for both providers. The mocked
    // response exercises the registered list handler, not a live model's reasoning.
    expect(JSON.stringify(firstRequest)).toContain('Resolve a unique full-name match');
    expect(JSON.stringify(firstRequest)).toContain('do not reproduce internal workflow IDs');
    if (agent === 'MicroSina')
      expect(JSON.stringify(firstRequest)).not.toContain(
        'You are Sina, the assistant inside InScope',
      );
    expect((await library.read())[firstChoiceId]).toEqual(unopened[firstChoiceId]);
    await expect(
      conversation(page).getByRole('region', { name: 'Workflow in chat', exact: true }),
    ).toHaveCount(0);
    if (index === 1) {
      await choices.scrollIntoViewIfNeeded();
      await page.screenshot({ path: test.info().outputPath('assistant-ui-workflow-choices.png') });
    }
  }
  await composer(page).fill(requests[2]);
  await waitForSend(page);
  await composer(page).press('Enter');
  const available = conversation(page).getByRole('region', {
    name: 'Available workflows',
    exact: true,
  });
  await expect(available.locator('[data-workflow-choice]')).toHaveCount(1);
  await expect(available.locator('[data-workflow-choice="fapi"]')).toBeVisible();
  await expect(conversation(page).locator('[data-message-id="choice-answer-2"]')).toBeVisible();
  // Cards mounted during a reply must unlock with the main chat after it finishes.
  await expect(
    available.getByRole('button', { name: 'Start FAPI in chat', exact: true }),
  ).toBeEnabled();
  const callsBeforeClick = state.runs.length;
  await available.getByRole('button', { name: 'Start FAPI in chat', exact: true }).click();
  await expect(
    conversation(page).getByRole('region', { name: 'Workflow in chat', exact: true }),
  ).toHaveCount(1);
  const entries = Object.values(await library.read());
  expect(entries.flatMap((entry) => entry.sessions)).toHaveLength(1);
  expect(entries.flatMap((entry) => entry.sessions)[0].attempts).toBe(0);
  expect(entries.every((entry) => entry.runs === 0)).toBe(true);
  expect(state.runs).toHaveLength(callsBeforeClick);
  expect(state.unexpected).toEqual([]);
});

test('assistant-ui workflow choices pin the listed saved version through follow-up and reload', async ({
  page,
}) => {
  const request = 'Show my saved FAPI Calculation Template choices.';
  const followup = 'Explain the selected workflow without running it.';
  let listed = false;
  const state = await installChatFixture(page, async (route, input) => {
    if (!listed) {
      listed = true;
      return listWorkflowReply(
        route,
        input,
        'pinned-choice-list',
        'listSavedWorkflows',
        choiceName,
      );
    }
    const isFollowup = input.messages.some((message) => message.content === followup);
    return finishReply(
      route,
      input,
      isFollowup ? 'selected-choice-explanation' : 'pinned-choice-answer',
      isFollowup
        ? 'The selected saved workflow has not been calculated.'
        : 'Choose a saved workflow.',
    );
  });
  const library = await installWorkflowChoices(page, true);
  await composer(page).fill(request);
  await waitForSend(page);
  await composer(page).press('Enter');
  const choices = conversation(page).getByRole('region', { name: 'Saved workflows', exact: true });
  await expect(choices.locator('[data-workflow-choice]')).toHaveCount(2);
  await expect(
    conversation(page).locator('[data-message-id="pinned-choice-answer"]'),
  ).toBeVisible();
  const before = await library.read();
  expect(
    Object.values(before).every((entry) => entry.sessions.length === 0 && entry.runs === 0),
  ).toBe(true);
  // A later saved version arrives after the list. Its button must keep the
  // version the user actually saw, rather than silently selecting the latest.
  await library.update('newer-version');
  const updated = await library.read();
  expect(updated[secondChoiceId].versions).toEqual([1, 2]);
  const callsBeforeClick = state.runs.length;
  await choices
    .locator(`[data-workflow-choice="${secondChoiceId}"]`)
    .getByRole('button', { name: `Open ${choiceName} version 1 in chat`, exact: true })
    .click();
  const panel = conversation(page).getByRole('region', { name: 'Workflow execution', exact: true });
  await expect(panel).toHaveCount(1);
  await expect(panel.locator(':scope > header')).toContainText('Version 1');
  const opened = await library.read();
  expect(opened[firstChoiceId]).toEqual(before[firstChoiceId]);
  expect(opened[draftChoiceId]).toEqual(before[draftChoiceId]);
  expect(opened[secondChoiceId].versions).toEqual([1, 2]);
  expect(opened[secondChoiceId].runs).toBe(0);
  expect(opened[secondChoiceId].sessions).toHaveLength(1);
  expect(opened[secondChoiceId].sessions[0]).toMatchObject({ version: 1, attempts: 0 });
  const runId = opened[secondChoiceId].sessions[0].id;
  await expect(
    conversation(page).getByRole('status', { name: 'Workflow selection' }),
  ).toContainText(choiceName);
  await expect(panel.getByRole('region', { name: 'FAPI worksheet', exact: true })).toHaveAttribute(
    'data-run-id',
    runId,
  );
  expect(state.runs).toHaveLength(callsBeforeClick);
  await composer(page).fill(followup);
  await waitForSend(page);
  await composer(page).press('Enter');
  await expect(
    conversation(page).locator('[data-message-id="selected-choice-explanation"]'),
  ).toBeVisible();
  const followupRequest = state.runs.findLast((input) =>
    input.messages.some((message) => message.content === followup),
  )!;
  const context = followupRequest.context?.find(
    (item) => item.description === 'Explicit context for this chat',
  );
  expect(context).toBeDefined();
  const contextValue =
    typeof context!.value === 'string' ? JSON.parse(context!.value) : context!.value;
  expect(contextValue.workflowInteraction).toMatchObject({
    status: 'opened',
    workflowId: secondChoiceId,
    version: 1,
    runId,
  });
  expect(await library.read()).toEqual(opened);
  await expect
    .poll(() =>
      [...state.saved.values()].some((thread) =>
        thread.messages.some((message) => {
          const binding = message.content.workflowBinding as
            { workflowId?: string; runId?: string } | undefined;
          return binding?.workflowId === secondChoiceId && binding.runId === runId;
        }),
      ),
    )
    .toBe(true);
  const saved = [...state.saved].find(([, thread]) =>
    thread.messages.some((message) => message.content.text === followup),
  )!;
  const beforeReloadCalls = state.runs.length;
  const [restored] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        new URL(response.url()).pathname === `/api/chat/threads/${encodeURIComponent(saved[0])}`,
    ),
    page.reload(),
  ]);
  expect(restored.status()).toBe(200);
  await expect(
    conversation(page).getByRole('status', { name: 'Workflow selection' }),
  ).toContainText(choiceName);
  await expect(panel).toHaveCount(1);
  await expect(panel.getByRole('region', { name: 'FAPI worksheet', exact: true })).toHaveAttribute(
    'data-run-id',
    runId,
  );
  await expect(choices.locator('[data-workflow-choice]')).toHaveCount(2);
  await expect(
    choices
      .locator(`[data-workflow-choice="${secondChoiceId}"]`)
      .getByRole('button', { name: `Open ${choiceName} version 1 in chat`, exact: true }),
  ).toBeVisible();
  expect(await library.read()).toEqual(opened);
  expect(state.runs).toHaveLength(beforeReloadCalls);
  expect(state.unexpected).toEqual([]);
});

test('assistant-ui workflow choices reject deleted records and open draft-only work for review', async ({
  page,
}) => {
  let listed = false;
  const state = await installChatFixture(page, async (route, input) => {
    if (!listed) {
      listed = true;
      return listWorkflowReply(route, input, 'stale-choice-list', 'listSavedWorkflows');
    }
    return finishReply(route, input, 'stale-choice-answer', 'Choose a saved workflow or a draft.');
  });
  const library = await installWorkflowChoices(page, true);
  await composer(page).fill('Show my saved workflows and drafts.');
  await waitForSend(page);
  await composer(page).press('Enter');
  const choices = conversation(page).getByRole('region', { name: 'Saved workflows', exact: true });
  await expect(choices.locator('[data-workflow-choice]')).toHaveCount(3);
  await expect(conversation(page).locator('[data-message-id="stale-choice-answer"]')).toBeVisible();
  await library.update('delete', firstChoiceId);
  const before = await library.read();
  const calls = state.runs.length;
  await choices
    .locator(`[data-workflow-choice="${firstChoiceId}"]`)
    .getByRole('button', { name: `Open ${choiceName} version 1 in chat`, exact: true })
    .click();
  await expect(choices.getByRole('alert')).toContainText(
    'This saved workflow is no longer available. No other workflow was selected.',
  );
  expect(await library.read()).toEqual(before);
  await expect(
    conversation(page).getByRole('region', { name: 'Workflow in chat', exact: true }),
  ).toHaveCount(0);
  await choices
    .locator(`[data-workflow-choice="${draftChoiceId}"]`)
    .getByRole('button', { name: `Open ${choiceName} with adjustments draft`, exact: true })
    .click();
  const builder = page.locator('.cwp-card');
  await expect(
    builder
      .getByRole('navigation', { name: 'Workflow navigation', exact: true })
      .getByRole('button', { name: `${choiceName} with adjustments`, exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  // Build loads its canvas separately from Chat. Use the same initial readiness
  // bound as the existing workflow browser cases; identity and writes stay exact.
  await expect(builder.locator('.react-flow')).toBeVisible({ timeout: 30000 });
  expect(await library.read()).toEqual(before);
  expect(before[draftChoiceId].versions).toEqual([]);
  expect(before[draftChoiceId].sessions).toEqual([]);
  expect(before[draftChoiceId].runs).toBe(0);
  expect(state.runs).toHaveLength(calls);
  expect(state.unexpected).toEqual([]);
});

test('assistant-ui starts a template independently and resumes the exact saved run', async ({
  page,
}) => {
  const emitted = new Set<string>();
  const state = await installChatFixture(page, async (route, input) => {
    const request = String(input.messages.findLast((message) => message.role === 'user')?.content);
    if (!emitted.has(request)) {
      emitted.add(request);
      return listWorkflowReply(
        route,
        input,
        request.includes('built-in') ? 'fresh-list' : 'resume-list',
        request.includes('built-in') ? 'listAvailableWorkflows' : 'listSavedWorkflows',
        'FAPI',
      );
    }
    return finishReply(
      route,
      input,
      request.includes('built-in') ? 'fresh-answer' : 'resume-answer',
      'Choose a workflow.',
    );
  });
  const library = await installWorkflowChoices(page, true, true);
  const before = await library.read();
  await composer(page).fill('Show the built-in FAPI workflow.');
  await waitForSend(page);
  await composer(page).press('Enter');
  await expect(conversation(page).locator('[data-message-id="fresh-answer"]')).toBeVisible();
  const calls = state.runs.length;
  await conversation(page).getByRole('button', { name: 'Start FAPI in chat', exact: true }).click();
  const started = await library.read();
  expect(started[firstChoiceId]).toEqual(before[firstChoiceId]);
  expect(started[secondChoiceId]).toEqual(before[secondChoiceId]);
  const created = Object.entries(started).filter(([id]) => !before[id]);
  expect(created).toHaveLength(1);
  expect(created[0][1].sessions).toHaveLength(1);
  expect(created[0][1].sessions[0].attempts).toBe(0);
  expect(state.runs).toHaveLength(calls);
  await composer(page).fill('Show my saved FAPI workflows.');
  await waitForSend(page);
  await composer(page).press('Enter');
  await expect(conversation(page).locator('[data-message-id="resume-answer"]')).toBeVisible();
  const listed = conversation(page)
    .getByRole('region', { name: 'Saved workflows', exact: true })
    .locator(`[data-workflow-choice="${firstChoiceId}"]`);
  await listed
    .getByRole('button', { name: `Resume ${choiceName} version 1 run 2`, exact: true })
    .click();
  const panel = conversation(page).getByRole('region', { name: 'Workflow execution', exact: true });
  await expect(panel.getByRole('region', { name: 'FAPI worksheet', exact: true })).toHaveAttribute(
    'data-run-id',
    'existing-run-two',
  );
  await expect(
    conversation(page).getByRole('status', { name: 'Workflow selection' }),
  ).toContainText(`Returned to ${choiceName}`);
  expect(await library.read()).toEqual(started);
  expect(state.unexpected).toEqual([]);
});
