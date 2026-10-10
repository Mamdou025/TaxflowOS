import { test, expect } from './workflow-audit-isolation';
import fs from 'node:fs';
import { openDocumentCalculationFixture } from './retired-workflow-fixtures';

function schemaShape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(schemaShape);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value)
        .filter(
          ([key, entry]) =>
            key !== 'description' &&
            !(key === 'required' && Array.isArray(entry) && entry.length === 0),
        )
        .map(([key, entry]) => [key, schemaShape(entry)]),
    );
  return value;
}

test('agents continue the same chat, retain turn authors and save a selection without another reply', async ({
  page,
}) => {
  const runs: { agent?: string; body: unknown }[] = [];
  let failReply = false;
  let holdReply = false;
  let releaseReply: (() => void) | undefined;
  type Saved = {
    messages: {
      id: string;
      role: string;
      seq: number;
      content: {
        text?: string;
        chatAgent?: string;
        selectedChatAgent?: string;
        authorAgent?: string;
      };
    }[];
  };
  const saves: (Saved & { id: string })[] = [];
  const savedChats = new Map<string, Saved>();
  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (['/api/session', '/api/workspaces', '/api/workflow-library'].includes(path))
      return route.fallback();
    if (path.startsWith('/api/copilotkit')) {
      const data = request.postDataJSON();
      if (data?.method === 'info' || request.method() === 'GET')
        return route.fulfill({
          json: {
            version: '1.63.2',
            mode: 'sse',
            agents: {
              default: {
                name: 'default',
                description: 'Synthetic test',
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
      if (data?.method === 'agent/run') {
        runs.push({ agent: request.headers()['x-inscope-agent'], body: data });
        if (holdReply)
          await new Promise<void>((resolve) => {
            releaseReply = resolve;
          });
        if (failReply)
          return route.fulfill({
            contentType: 'text/event-stream',
            body: `data: ${JSON.stringify({ type: 'RUN_ERROR', message: 'Synthetic Foundry authentication failure' })}\n\n`,
          });
        const input = data.body ?? data;
        const messageId = `reply-${runs.length}`;
        const author = request.headers()['x-inscope-agent'] === 'microsina' ? 'MicroSina' : 'Sina';
        const events = [
          { type: 'RUN_STARTED', threadId: input.threadId ?? 'test', runId: input.runId ?? 'test' },
          { type: 'TEXT_MESSAGE_START', messageId, role: 'assistant' },
          { type: 'TEXT_MESSAGE_CONTENT', messageId, delta: `Synthetic ${author} reply.` },
          { type: 'TEXT_MESSAGE_END', messageId },
          {
            type: 'RUN_FINISHED',
            threadId: input.threadId ?? 'test',
            runId: input.runId ?? 'test',
          },
        ];
        return route.fulfill({
          contentType: 'text/event-stream',
          body: events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join(''),
        });
      }
      return route.fulfill({ contentType: 'text/event-stream', body: '' });
    }
    if (path.startsWith('/api/chat/threads')) {
      if (request.method() === 'POST') {
        const id = decodeURIComponent(path.split('/')[4]);
        const saved = request.postDataJSON() as Saved;
        saves.push({ ...saved, id });
        savedChats.set(id, saved);
        return route.fulfill({ json: { ok: true } });
      }
      if (path === '/api/chat/threads')
        return route.fulfill({
          json: {
            threads: [
              { id: 'old-sina', title: 'Legacy Sina chat', updatedAt: '2026-09-29T12:00:00Z' },
              {
                id: 'saved-micro',
                title: 'Saved MicroSina chat',
                updatedAt: '2026-09-29T12:00:00Z',
              },
            ],
          },
        });
      const saved = savedChats.get(decodeURIComponent(path.split('/')[4]));
      if (saved) return route.fulfill({ json: saved });
      return route.fulfill({
        json: {
          messages: [
            {
              id: 'saved-user',
              role: 'user',
              seq: 0,
              content: {
                text: 'Saved conversation',
                ...(path.endsWith('saved-micro') ? { chatAgent: 'microsina' } : {}),
              },
            },
            {
              id: 'saved-answer',
              role: 'assistant',
              seq: 1,
              content: { text: 'Legacy agent answer.' },
            },
          ],
        },
      });
    }
    return route.fulfill({
      json: { documents: [], workers: [], conversations: [], tasks: [], memories: [], items: [] },
    });
  });
  await page.goto('/');
  const selector = page.locator('.lc-console').getByRole('button', { name: /^Chat agent:/ });
  const reloadSavedChat = async (id: string) => {
    const [response] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.request().method() === 'GET' &&
          new URL(response.url()).pathname === `/api/chat/threads/${encodeURIComponent(id)}`,
      ),
      page.reload(),
    ]);
    expect(response.status()).toBe(200);
  };
  const expectAvailableAgent = async (name: 'Sina' | 'MicroSina') => {
    await expect(selector).toHaveAccessibleName(`Chat agent: ${name}`);
    await selector.click();
    await expect(page.getByRole('menuitemradio', { name: 'Sina · Tax specialist' })).toBeEnabled();
    await expect(page.getByRole('menuitemradio', { name: 'MicroSina · Foundry' })).toBeEnabled();
    await expect(
      page.getByText(
        'The selected agent continues this chat with the same conversation and workflow.',
      ),
    ).toBeVisible();
    await page.keyboard.press('Escape');
  };
  await expect(selector).toHaveCount(1);
  await expect(selector).toHaveAccessibleName('Chat agent: Sina');
  await expect(page.getByRole('combobox', { name: 'Chat agent' })).toHaveCount(0);
  await expect(
    page.locator('.lc-console').getByRole('button', { name: /^Computer:/ }),
  ).toBeVisible();
  await selector.click();
  await page.getByRole('menuitemradio', { name: 'MicroSina · Foundry' }).click();
  const composer = page.locator('.lc-console').getByRole('textbox');
  await composer.fill('Say hello without using tools.');
  await composer.press('Enter');
  await expect.poll(() => runs.length).toBe(1);
  expect(runs[0].agent).toBe('microsina');
  expect(JSON.stringify(runs[0].body)).toContain('delegateComputerTask');
  expect(JSON.stringify(runs[0].body)).toContain('listAvailableWorkflows');
  const captured = runs[0].body as { body?: { tools?: unknown[] }; tools?: unknown[] };
  const tools = captured.body?.tools ?? captured.tools;
  expect(Array.isArray(tools)).toBe(true);
  const registered = JSON.parse(fs.readFileSync('docs/microsina-foundry/tools.json', 'utf8')) as {
    name: string;
    parameters: unknown;
  }[];
  for (const tool of tools as { name: string; parameters: unknown }[]) {
    const saved = registered.find((entry) => entry.name === tool.name);
    expect(saved, `Missing Foundry schema: ${tool.name}`).toBeDefined();
    expect(schemaShape(saved?.parameters), tool.name).toEqual(schemaShape(tool.parameters));
  }
  await test.info().attach('microsina-tool-catalog.json', {
    body: JSON.stringify(tools, null, 2),
    contentType: 'application/json',
  });
  expect(JSON.stringify(runs[0].body)).not.toContain('You are Sina, the assistant inside InScope');
  await expectAvailableAgent('MicroSina');
  await expect.poll(() => saves.length).toBeGreaterThan(0);
  expect(saves.at(-1)?.messages[0].content.chatAgent).toBe('microsina');
  const sameChatId = saves.at(-1)!.id;
  const microReply = page.locator('[data-message-id="reply-1"][data-agent="microsina"]');
  await expect(microReply).toContainText('MicroSina');
  await selector.click();
  await page.getByRole('menuitemradio', { name: 'Sina · Tax specialist' }).click();
  await expect
    .poll(() => savedChats.get(sameChatId)?.messages[0].content.selectedChatAgent)
    .toBe('sina');
  expect(
    savedChats.get(sameChatId)?.messages.find((message) => message.id === 'reply-1')?.content
      .authorAgent,
  ).toBe('microsina');
  await reloadSavedChat(sameChatId);
  await expectAvailableAgent('Sina');
  await expect(microReply).toContainText('Synthetic MicroSina reply.');
  expect(runs).toHaveLength(1);
  holdReply = true;
  await composer.fill('Continue with the same information, Sina.');
  await composer.press('Enter');
  await expect.poll(() => runs.length).toBe(2);
  expect(runs[1].agent).toBe('sina');
  expect(JSON.stringify(runs[1].body)).toContain('Synthetic MicroSina reply.');
  expect(JSON.stringify(runs[1].body)).toContain('Say hello without using tools.');
  await selector.click();
  await expect(page.getByRole('menuitemradio', { name: 'MicroSina · Foundry' })).toBeDisabled();
  await expect(
    page.getByText('Wait for the current reply or tool to finish before switching agents.'),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  holdReply = false;
  releaseReply?.();
  await expect(page.locator('[data-message-id="reply-2"][data-agent="sina"]')).toContainText(
    'Synthetic Sina reply.',
  );
  await expect(microReply).toHaveAttribute('data-agent', 'microsina');
  await expectAvailableAgent('Sina');
  await selector.click();
  await page.getByRole('menuitemradio', { name: 'MicroSina · Foundry' }).click();
  await expect
    .poll(() => savedChats.get(sameChatId)?.messages[0].content.selectedChatAgent)
    .toBe('microsina');
  expect(new Set(saves.map((save) => save.id))).toEqual(new Set([sameChatId]));
  await reloadSavedChat(sameChatId);
  await expectAvailableAgent('MicroSina');
  await expect(microReply).toContainText('Synthetic MicroSina reply.');
  await expect(page.locator('[data-message-id="reply-2"][data-agent="sina"]')).toContainText(
    'Synthetic Sina reply.',
  );
  await page.getByTitle('Legacy Sina chat', { exact: true }).click();
  await expectAvailableAgent('Sina');
  await expect(page.locator('[data-message-id="saved-answer"]')).toHaveAttribute(
    'data-agent',
    'sina',
  );
  await page.getByTitle('Saved MicroSina chat', { exact: true }).click();
  await expect(selector).toHaveAccessibleName('Chat agent: MicroSina');
  await reloadSavedChat('saved-micro');
  await expectAvailableAgent('MicroSina');
  await expect(page.locator('[data-message-id="saved-answer"]')).toHaveAttribute(
    'data-agent',
    'microsina',
  );
  expect(runs).toHaveLength(2);
  failReply = true;
  await composer.fill('Try another reply.');
  await composer.press('Enter');
  await expect(
    page.getByRole('alert').filter({ hasText: 'MicroSina could not complete its reply' }),
  ).toBeVisible();
  await expect.poll(() => runs.length).toBe(3);
  expect(runs.map((run) => run.agent)).toEqual(['microsina', 'sina', 'microsina']);
});

test('a MicroSina workflow approval keeps its agent and grant scope after switching to Sina and reloading', async ({
  page,
}) => {
  let workflowId: string;
  const savedChats = new Map<string, unknown>();
  const requests: { agentId: string; operationId: string; requestFingerprint: string }[] = [];
  const grants: { agentId: string; operationId: string; requestFingerprint: string }[] = [];
  let runCount = 0;
  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (['/api/session', '/api/workspaces', '/api/workflow-library'].includes(path))
      return route.fallback();
    if (path === '/api/agent-actions/grants') {
      grants.push(request.postDataJSON());
      return route.fulfill({ json: { grant: { id: 'micro-only-grant' } } });
    }
    if (path === '/api/agent-actions/operations/authorize') {
      const action = request.postDataJSON();
      requests.push(action);
      return route.fulfill({
        json: grants.length
          ? {
              allowed: true,
              operationStatus: 'allowed',
              authorization: { ...action, allowed: true, grantId: 'micro-only-grant' },
            }
          : { allowed: false, operationStatus: 'denied', message: 'Review this request first.' },
      });
    }
    if (path.startsWith('/api/agent-actions/operations/'))
      return route.fulfill({ json: { ok: true } });
    if (path.startsWith('/api/chat/threads')) {
      const id = decodeURIComponent(path.split('/')[4] ?? '');
      if (request.method() === 'POST') {
        savedChats.set(id, request.postDataJSON());
        return route.fulfill({ json: { ok: true } });
      }
      return route.fulfill({
        json: id ? (savedChats.get(id) ?? { messages: [] }) : { threads: [] },
      });
    }
    if (path.startsWith('/api/copilotkit')) {
      const envelope = request.postDataJSON();
      if (request.method() === 'GET' || envelope?.method === 'info')
        return route.fulfill({
          json: {
            version: '1.63.2',
            mode: 'sse',
            agents: {
              default: {
                name: 'default',
                description: 'Synthetic approval',
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
      if (envelope?.method !== 'agent/run')
        return route.fulfill({ contentType: 'text/event-stream', body: '' });
      runCount++;
      expect(request.headers()['x-inscope-agent']).toBe('microsina');
      const input = envelope.body ?? envelope;
      const events =
        runCount === 1
          ? [
              {
                type: 'TOOL_CALL_START',
                toolCallId: 'micro-save-call',
                toolCallName: 'saveSavedWorkflowVersion',
                parentMessageId: 'micro-save-message',
              },
              {
                type: 'TOOL_CALL_ARGS',
                toolCallId: 'micro-save-call',
                delta: JSON.stringify({ workflowId }),
              },
              { type: 'TOOL_CALL_END', toolCallId: 'micro-save-call' },
            ]
          : [
              { type: 'TEXT_MESSAGE_START', messageId: 'micro-review-answer', role: 'assistant' },
              {
                type: 'TEXT_MESSAGE_CONTENT',
                messageId: 'micro-review-answer',
                delta: 'Please review the saved-version request.',
              },
              { type: 'TEXT_MESSAGE_END', messageId: 'micro-review-answer' },
            ];
      return route.fulfill({
        contentType: 'text/event-stream',
        body: [
          { type: 'RUN_STARTED', threadId: input.threadId, runId: input.runId },
          ...events,
          { type: 'RUN_FINISHED', threadId: input.threadId, runId: input.runId },
        ]
          .map((event) => `data: ${JSON.stringify(event)}\n\n`)
          .join(''),
      });
    }
    return route.fulfill({
      json: { documents: [], workers: [], conversations: [], tasks: [], memories: [], items: [] },
    });
  });
  await openDocumentCalculationFixture(page);
  workflowId = await page.evaluate(async () => {
    const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
    const imported = Object.values(readWorkflowLibrary()).filter(
      (entry) => entry.draft.name === 'Document calculation fixture — Imported',
    );
    if (imported.length !== 1) throw new Error('Expected one imported approval fixture.');
    return imported[0].id;
  });
  await page.goto('/');
  const selector = page.locator('.lc-console').getByRole('button', { name: /^Chat agent:/ });
  await selector.click();
  await page.getByRole('menuitemradio', { name: 'MicroSina · Foundry' }).click();
  const composer = page.locator('.lc-console').getByRole('textbox');
  await composer.fill('Prepare an approval to save this exact workflow version.');
  await composer.press('Enter');
  const review = page.getByRole('region', { name: 'Workflow version approval' });
  await expect(review).toContainText('Requested by MicroSina');
  await expect(
    page.getByText('Please review the saved-version request.', { exact: true }),
  ).toBeVisible();
  expect(requests).toHaveLength(1);
  expect(requests[0].agentId).toBe('microsina');
  await selector.click();
  await expect(page.getByRole('menuitemradio', { name: 'Sina · Tax specialist' })).toBeEnabled();
  await page.getByRole('menuitemradio', { name: 'Sina · Tax specialist' }).click();
  await expect(review).toContainText('Requested by MicroSina');
  expect(grants).toHaveLength(0);
  await expect
    .poll(() =>
      [...savedChats.values()].some((chat) => {
        const saved = chat as { messages: { content: { selectedChatAgent?: string } }[] };
        return saved.messages[0]?.content.selectedChatAgent === 'sina';
      }),
    )
    .toBe(true);
  const beforeReloadRuns = runCount;
  await page.reload();
  await expect(selector).toHaveAccessibleName('Chat agent: Sina');
  await expect(review).toContainText('Requested by MicroSina');
  await expect(page.locator('[data-message-id="micro-save-call"]')).toHaveAttribute(
    'data-agent',
    'microsina',
  );
  expect(runCount).toBe(beforeReloadRuns);
  await review.getByRole('button', { name: 'Approve this save', exact: true }).click();
  await expect(review).toContainText('Saved immutable workflow version 1.');
  expect(grants).toHaveLength(1);
  expect(grants[0]).toMatchObject(requests[0]);
  expect(requests[1]).toEqual(requests[0]);
  expect(runCount).toBe(beforeReloadRuns);
  const entry = await page.evaluate(async (id) => {
    const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
    return readWorkflowLibrary()[id];
  }, workflowId);
  expect(entry.versions).toHaveLength(1);
  expect(entry.runs).toHaveLength(0);
});
