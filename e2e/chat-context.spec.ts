import type { Page } from '@playwright/test';
import { test, expect } from './workflow-audit-isolation';

type Input = {
  threadId: string;
  runId: string;
  context?: { description: string; value: unknown }[];
};
type Saved = {
  title?: string;
  messages: { id: string; role: string; seq: number; content: Record<string, unknown> }[];
};
const sourceText =
  'SYNTHETIC SOURCE: Affiliate Maple has investment income of 2400. No exchange rate is supplied.';
const sourceId = 'explicit-context-document';
const sourceName = 'Selected affiliate notes.txt';
const stamp = '2026-10-09T12:00:00.000Z';

test('opening a viewer file is explicit context and removing it restores the Use in this chat action', async ({
  page,
}) => {
  const state = await installFixture(page);
  await page.goto('/');
  await waitForChatUI(page);
  await composer(page).fill('viewer');
  await page
    .locator('[aria-label="Workspace suggestions"]')
    .getByRole('button', { name: /Documents/ })
    .click();
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Open files', exact: true }).click();
  await (
    await chooser
  ).setFiles({ name: 'Viewer notes.txt', mimeType: 'text/plain', buffer: Buffer.from(sourceText) });
  await expandContext(page);
  await expect(strip(page).locator('[data-context-source]')).toHaveCount(0);
  await closeContext(page);
  await page.getByRole('button', { name: 'Use in this chat', exact: true }).click();
  await expect(page.getByText('Added to this chat', { exact: true })).toBeVisible();
  await expandContext(page);
  await strip(page).getByRole('button', { name: 'Remove Viewer notes.txt from this chat' }).click();
  await expect(page.getByText('Added to this chat', { exact: true })).toHaveCount(0);
  await expect(strip(page).locator('[data-context-source]')).toHaveCount(0);
  await closeContext(page);
  await expect(page.getByRole('button', { name: 'Use in this chat', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Use in this chat', exact: true }).click();
  await expect(page.getByText('Added to this chat', { exact: true })).toBeVisible();
  await expandContext(page);
  await expect(strip(page).locator('[data-context-source]')).toHaveCount(1);

  // A click belongs to its original conversation even when reading file bytes is slow.
  await strip(page).getByRole('button', { name: 'Remove Viewer notes.txt from this chat' }).click();
  await closeContext(page);
  const extractsBeforeSwitch = state.extracts;
  await page.evaluate(() => {
    const hashGate = window as Window & {
      viewerHashStarted?: boolean;
      releaseViewerHash?: () => void;
    };
    const digest = crypto.subtle.digest.bind(crypto.subtle);
    const pending = new Promise<void>((resolve) => {
      hashGate.releaseViewerHash = resolve;
    });
    crypto.subtle.digest = async (algorithm, data) => {
      crypto.subtle.digest = digest;
      hashGate.viewerHashStarted = true;
      await pending;
      return digest(algorithm, data);
    };
  });
  await page.getByRole('button', { name: 'Use in this chat', exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() => (window as Window & { viewerHashStarted?: boolean }).viewerHashStarted),
    )
    .toBe(true);
  try {
    await page.getByRole('button', { name: 'New chat', exact: true }).click();
    await expandContext(page);
    await expect(strip(page).locator('[data-context-source]')).toHaveCount(0);
  } finally {
    await page.evaluate(() =>
      (window as Window & { releaseViewerHash?: () => void }).releaseViewerHash?.(),
    );
  }
  await expect(
    page.getByText('The conversation changed. Attach the source in the intended chat.', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(strip(page).locator('[data-context-source]')).toHaveCount(0);
  expect(state.extracts).toBe(extractsBeforeSwitch);
  expect(state.runs).toHaveLength(0);
});

async function installFixture(page: Page) {
  const state = {
    runs: [] as { input: Input; provider: string | undefined }[],
    saved: new Map<string, Saved>(),
    revision: 1,
    memoryReads: 0,
    extracts: 0,
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
                description: 'Isolated context fixture',
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
      if (envelope.method === 'agent/stop') return route.fulfill({ json: { ok: true } });
      if (envelope.method === 'agent/run') {
        const input = (envelope.body ?? envelope) as Input;
        state.runs.push({ input, provider: request.headers()['x-inscope-agent'] });
        const messageId = `context-reply-${state.runs.length}`;
        return route.fulfill({
          contentType: 'text/event-stream',
          body: [
            { type: 'RUN_STARTED', threadId: input.threadId, runId: input.runId },
            { type: 'TEXT_MESSAGE_START', messageId, role: 'assistant' },
            {
              type: 'TEXT_MESSAGE_CONTENT',
              messageId,
              delta: `Context reply ${state.runs.length}.`,
            },
            { type: 'TEXT_MESSAGE_END', messageId },
            { type: 'RUN_FINISHED', threadId: input.threadId, runId: input.runId },
          ]
            .map((event) => `data: ${JSON.stringify(event)}\n\n`)
            .join(''),
        });
      }
    }
    if (pathname.startsWith('/api/chat/threads')) {
      const id = decodeURIComponent(pathname.split('/')[4] ?? '');
      if (request.method() === 'POST') {
        state.saved.set(id, request.postDataJSON());
        return route.fulfill({ json: { ok: true } });
      }
      if (!id)
        return route.fulfill({
          json: {
            threads: [...state.saved].map(([id, saved]) => ({
              id,
              title: saved.title,
              updatedAt: stamp,
            })),
          },
        });
      return route.fulfill({ json: state.saved.get(id) ?? { messages: [] } });
    }
    const document = {
      id: sourceId,
      fileName: sourceName,
      mimeType: 'text/plain',
      sourceRevision: state.revision,
      contentHash: null,
      lifecycleStatus: 'active',
      status: 'ready',
      inLibrary: true,
      createdAt: stamp,
      sizeBytes: sourceText.length,
    };
    if (pathname === '/api/documents')
      return route.fulfill({
        json: {
          documents: [
            document,
            { ...document, id: 'ambient-unselected', fileName: 'Do not include this source.txt' },
          ],
        },
      });
    if (pathname === `/api/documents/${sourceId}`)
      return route.fulfill({ json: { document, downloadUrl: '/api/context-fixture/original' } });
    if (pathname === '/api/context-fixture/original')
      return route.fulfill({ contentType: 'text/plain', body: sourceText });
    if (pathname === '/api/assistant/extract') {
      state.extracts++;
      return route.fulfill({
        json: {
          fileName: sourceName,
          kind: 'text',
          text: sourceText,
          chars: sourceText.length,
          truncated: false,
        },
      });
    }
    if (pathname === '/api/documents/upload-url')
      return route.fulfill({ status: 503, json: { error: 'STORAGE_NOT_CONFIGURED' } });
    if (pathname === '/api/assistant/memory') {
      state.memoryReads++;
      return route.fulfill({
        json: {
          memories: [{ id: 'ambient-memory', content: 'PRIVATE AMBIENT MEMORY MUST NOT LOAD' }],
        },
      });
    }
    return route.fulfill({
      json:
        pathname === '/api/integrations'
          ? []
          : { documents: [], workers: [], conversations: [], tasks: [], items: [] },
    });
  });
  return state;
}

const composer = (page: Page) =>
  page.locator('.lc-console').getByRole('textbox', { name: 'Ask Scope, or describe a task…' });
const strip = (page: Page) => page.locator('[data-chat-context]');
async function waitForChatUI(page: Page) {
  // Route load precedes the lazy authenticated workspace; wait for its usable shell.
  await composer(page).waitFor({ state: 'visible' });
}
async function expandContext(page: Page) {
  if (!(await strip(page).isVisible()))
    await page.getByRole('button', { name: 'Open Scope', exact: true }).click();
  await expect(
    page.getByRole('dialog', { name: 'Scope for this chat', exact: true }),
  ).toBeVisible();
}
async function closeContext(page: Page) {
  if (await strip(page).isVisible()) await page.keyboard.press('Escape');
  await expect(strip(page)).toBeHidden();
}
async function expectCenteredScope(page: Page) {
  const trigger = page.locator('[data-chat-scope-trigger]');
  const panel = page.locator('[data-chat-panel]:visible');
  await expect(trigger).toHaveCount(1);
  await expect(trigger).toBeVisible();
  await expect(page.getByRole('button', { name: /^Context:/ })).toHaveCount(0);
  await expect(page.locator('details[data-chat-context]')).toHaveCount(0);
  await expect(page.locator('.cwp-chat-header [data-testid="work-menu"]')).toHaveCount(0);
  await expect
    .poll(async () => {
      const control = await trigger.boundingBox();
      const boundary = await panel.boundingBox();
      expect(control).not.toBeNull();
      expect(boundary).not.toBeNull();
      return Math.abs(control!.x + control!.width / 2 - (boundary!.x + boundary!.width / 2));
    })
    .toBeLessThanOrEqual(3);
}
function explicitContext(input: Input) {
  const context = input.context?.filter(
    (item) => item.description === 'Explicit context for this chat',
  );
  expect(context).toHaveLength(1);
  return JSON.parse(String(context![0].value)) as {
    company: { name: string | null; year: number | null; labelsOnly: boolean };
    sources: {
      sourceId: string | null;
      revision: number | null;
      fileName: string;
      status: string;
      text?: string;
    }[];
  };
}

for (const provider of ['sina', 'microsina'] as const) {
  test(`explicit chat context reaches ${provider} on the first turn, restores exact sources and starts clean`, async ({
    page,
  }) => {
    const state = await installFixture(page);
    await page.goto('/');
    await waitForChatUI(page);
    await expect(composer(page)).toBeEditable();
    await expectCenteredScope(page);
    await expandContext(page);
    await page.getByRole('textbox', { name: 'Company name' }).fill('Synthetic Maple');
    await page.getByRole('spinbutton', { name: 'Reporting year' }).fill('2025');
    await page.getByRole('button', { name: 'Apply to this chat' }).click();
    await closeContext(page);
    if (provider === 'microsina') {
      await page.getByRole('button', { name: /^Chat agent:/ }).click();
      await page.getByRole('menuitemradio', { name: 'MicroSina · Foundry' }).click();
    }
    await page.getByRole('button', { name: 'Attach files', exact: true }).click();
    await page.getByRole('menuitem', { name: 'Choose from Sources' }).click();
    await page.getByRole('dialog').getByRole('button', { name: sourceName, exact: true }).click();
    await expandContext(page);
    await expect(strip(page)).toContainText('Ready');
    await page.screenshot({ path: test.info().outputPath(`chat-context-${provider}.png`) });
    await closeContext(page);
    if (provider === 'sina')
      await page.screenshot({ path: test.info().outputPath('scope-desktop-closed.png') });
    if (provider === 'sina') {
      const viewport = page.viewportSize();
      await page.setViewportSize({ width: 390, height: 844 });
      await expectCenteredScope(page);
      await page.screenshot({ path: test.info().outputPath('scope-mobile-closed.png') });
      await expandContext(page);
      const bounds = await strip(page).boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(391);
      expect(bounds!.y).toBeGreaterThanOrEqual(0);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(844);
      await expect(strip(page).getByRole('textbox', { name: 'Company name' })).toHaveValue(
        'Synthetic Maple',
      );
      await expect(strip(page).getByRole('spinbutton', { name: 'Reporting year' })).toHaveValue(
        '2025',
      );
      await expect(strip(page).locator(`[data-context-source="${sourceId}"]`)).toContainText(
        'Ready',
      );
      await page.screenshot({ path: test.info().outputPath('chat-context-mobile.png') });
      await closeContext(page);
      if (viewport) await page.setViewportSize(viewport);
    }
    await composer(page).fill('Read my explicit context.');
    await composer(page).press('Enter');
    await expect(page.getByText('Context reply 1.', { exact: true })).toBeVisible();
    await expectCenteredScope(page);
    if (provider === 'sina') {
      await page.screenshot({ path: test.info().outputPath('scope-desktop-active.png') });
      const viewport = page.viewportSize();
      await page.setViewportSize({ width: 390, height: 844 });
      await expectCenteredScope(page);
      await page.screenshot({ path: test.info().outputPath('scope-mobile-active.png') });
      if (viewport) await page.setViewportSize(viewport);
    }
    expect(state.runs[0].provider).toBe(provider);
    const first = explicitContext(state.runs[0].input);
    expect(first.company).toEqual({ name: 'Synthetic Maple', year: 2025, labelsOnly: true });
    expect(first.sources).toHaveLength(1);
    expect(first.sources[0]).toMatchObject({
      sourceId,
      revision: 1,
      text: sourceText,
      status: 'ready',
    });
    expect(JSON.stringify(state.runs[0].input)).not.toContain('PRIVATE AMBIENT MEMORY');
    await expect
      .poll(() =>
        [...state.saved.values()].some((saved) =>
          saved.messages.some((message) => message.content.text === 'Context reply 1.'),
        ),
      )
      .toBe(true);
    await page.reload();
    await waitForChatUI(page);
    await expect(page.getByText('Context reply 1.', { exact: true })).toBeVisible();
    await expandContext(page);
    await expect(strip(page)).toContainText('Ready');
    await expect(strip(page).getByRole('textbox', { name: 'Company name' })).toHaveValue(
      'Synthetic Maple',
    );
    await expect(strip(page).getByRole('spinbutton', { name: 'Reporting year' })).toHaveValue(
      '2025',
    );
    expect(state.extracts).toBe(2);
    // A new source revision must not silently replace the reference recorded in chat.
    state.revision = 2;
    await page.reload();
    await waitForChatUI(page);
    await expect(composer(page)).toBeEditable();
    await expandContext(page);
    await expect(strip(page)).toContainText('Unavailable');
    await expect(strip(page)).toContainText('saved revision was not replaced');
    await closeContext(page);
    await composer(page).fill('Is the same source still available?');
    await composer(page).press('Enter');
    await expect(page.getByText('Context reply 2.', { exact: true })).toBeVisible();
    const unavailable = explicitContext(state.runs[1].input).sources[0];
    expect(unavailable).toMatchObject({ sourceId, revision: 1, status: 'unavailable' });
    expect(unavailable.text).toBeUndefined();
    expect(state.extracts).toBe(2);
    await page.getByRole('button', { name: 'New chat', exact: true }).click();
    await expandContext(page);
    await expect(strip(page).getByRole('textbox', { name: 'Company name' })).toHaveValue('');
    await expect(strip(page).getByRole('spinbutton', { name: 'Reporting year' })).toHaveValue('');
    await expect(strip(page).locator('[data-context-source]')).toHaveCount(0);
    await closeContext(page);
    await composer(page).fill('A separate conversation.');
    await composer(page).press('Enter');
    await expect(page.getByText('Context reply 3.', { exact: true })).toBeVisible();
    expect(explicitContext(state.runs[2].input)).toMatchObject({
      company: { name: null, year: null, labelsOnly: true },
      sources: [],
    });
    expect(state.memoryReads).toBe(0);
  });
}

test('Sources adds text documents only on Use in this chat; example text remains an explicit unsaved attachment', async ({
  page,
}) => {
  const state = await installFixture(page);
  await page.goto('/');
  await waitForChatUI(page);
  await expandContext(page);
  await expect(strip(page).locator('[data-context-source]')).toHaveCount(0);
  await strip(page).getByRole('button', { name: 'Browse Sources', exact: true }).click();
  await expect(strip(page)).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Sources', exact: true })).toBeVisible();
  await page.getByRole('button', { name: `Use ${sourceName} in chat`, exact: true }).click();
  await expandContext(page);
  await expect(strip(page)).toContainText(sourceName);
  await expect(strip(page)).toContainText('Ready');
  await strip(page)
    .getByRole('button', { name: `Remove ${sourceName} from this chat` })
    .click();
  await strip(page).getByRole('button', { name: 'Add text', exact: true }).click();
  await strip(page).getByRole('button', { name: 'Add example text', exact: true }).click();
  await expect(strip(page).getByRole('textbox', { name: 'Source text' })).toHaveValue(
    /SAMPLE DATA/,
  );
  await expect(strip(page).locator('[data-context-source]')).toHaveCount(0);
  await strip(page).getByRole('textbox', { name: 'Text name' }).fill('Explicit local notes');
  await strip(page).getByRole('textbox', { name: 'Source text' }).fill(sourceText);
  await strip(page).getByRole('button', { name: 'Use text in this chat' }).click();
  await expect(strip(page)).toContainText('Local attachment');
  await expect(strip(page)).toContainText('not saved in Sources');
  await expect
    .poll(() =>
      [...state.saved.values()].some((saved) =>
        saved.messages.some((message) =>
          (JSON.stringify(message.content.chatContext) ?? '').includes('Explicit local notes.txt'),
        ),
      ),
    )
    .toBe(true);
  await page.reload();
  await waitForChatUI(page);
  await expect(composer(page)).toBeEditable();
  await expandContext(page);
  await expect(strip(page)).toContainText('Explicit local notes.txt');
  await expect(strip(page)).toContainText('Ready');
  expect(state.extracts).toBe(2);
  expect(state.memoryReads).toBe(0);

  const evidence = strip(page).locator('details[aria-label="Evidence used in this conversation"]');
  await expect(evidence).toHaveJSProperty('open', false);
  await evidence.locator('summary').click();
  await expect(evidence).toContainText('No retrieved evidence yet.');
  await expect(strip(page).locator('[data-context-source]')).toHaveCount(1);
  await evidence.locator('summary').click();

  const uploadedName = 'Scope uploaded notes.txt';
  const extraction = page.waitForRequest(
    (request) =>
      new URL(request.url()).pathname === '/api/assistant/extract' && request.method() === 'POST',
  );
  const chooser = page.waitForEvent('filechooser');
  await strip(page).getByRole('button', { name: 'Upload file', exact: true }).click();
  await (
    await chooser
  ).setFiles({ name: uploadedName, mimeType: 'text/plain', buffer: Buffer.from(sourceText) });
  const uploadedRequest = await extraction;
  expect(uploadedRequest.postData()).toContain(`filename="${uploadedName}"`);
  expect(uploadedRequest.postData()).toContain(sourceText);
  const uploadedCard = strip(page)
    .locator('[data-context-source]')
    .filter({ hasText: uploadedName });
  await expect(uploadedCard).toHaveCount(1);
  await expect(uploadedCard).toContainText('Ready');
  await expect(strip(page).locator('[data-context-source]')).toHaveCount(2);
  expect(state.extracts).toBe(3);
  expect(state.runs).toHaveLength(0);
});
