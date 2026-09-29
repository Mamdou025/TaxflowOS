import { test, expect } from './workflow-audit-isolation';

test('MicroSina selection reaches the backend, locks during a conversation and restores from history', async ({
  page,
}) => {
  const runs: { agent?: string; body: unknown }[] = [];
  let failReply = false;
  const saves: { messages: { seq: number; content: { chatAgent?: string } }[] }[] = [];
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
        if (failReply)
          return route.fulfill({
            contentType: 'text/event-stream',
            body: `data: ${JSON.stringify({ type: 'RUN_ERROR', message: 'Synthetic Foundry authentication failure' })}\n\n`,
          });
        const input = data.body ?? data;
        const events = [
          { type: 'RUN_STARTED', threadId: input.threadId ?? 'test', runId: input.runId ?? 'test' },
          { type: 'TEXT_MESSAGE_START', messageId: 'reply', role: 'assistant' },
          { type: 'TEXT_MESSAGE_CONTENT', messageId: 'reply', delta: 'Synthetic MicroSina reply.' },
          { type: 'TEXT_MESSAGE_END', messageId: 'reply' },
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
        saves.push(request.postDataJSON());
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
          ],
        },
      });
    }
    return route.fulfill({
      json: { documents: [], workers: [], conversations: [], tasks: [], memories: [], items: [] },
    });
  });
  await page.goto('/');
  const selector = page.getByRole('combobox', { name: 'Chat agent' });
  await expect(selector).toHaveValue('sina');
  await selector.selectOption('microsina');
  const composer = page.locator('.lc-console').getByRole('textbox');
  await composer.fill('Say hello without using tools.');
  await composer.press('Enter');
  await expect.poll(() => runs.length).toBe(1);
  expect(runs[0].agent).toBe('microsina');
  expect(JSON.stringify(runs[0].body)).toContain('delegateComputerTask');
  expect(JSON.stringify(runs[0].body)).toContain('listAvailableWorkflows');
  expect(JSON.stringify(runs[0].body)).not.toContain('You are Sina, the assistant inside InScope');
  await expect(selector).toBeDisabled();
  await expect.poll(() => saves.length).toBeGreaterThan(0);
  expect(saves.at(-1)?.messages[0].content.chatAgent).toBe('microsina');
  await page.getByTitle('Legacy Sina chat', { exact: true }).click();
  await expect(selector).toHaveValue('sina');
  await expect(selector).toBeDisabled();
  await page.getByTitle('Saved MicroSina chat', { exact: true }).click();
  await expect(selector).toHaveValue('microsina');
  await page.reload();
  await expect(selector).toHaveValue('microsina');
  await expect(selector).toBeDisabled();
  expect(runs).toHaveLength(1);
  failReply = true;
  await composer.fill('Try another reply.');
  await composer.press('Enter');
  await expect(
    page.getByRole('alert').filter({ hasText: 'MicroSina could not complete its reply' }),
  ).toBeVisible();
  await expect.poll(() => runs.length).toBe(2);
  expect(runs.every((run) => run.agent === 'microsina')).toBe(true);
});
