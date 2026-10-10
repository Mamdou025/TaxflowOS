import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { expect } from '@playwright/test';
import { root, webRoot } from '../../scripts/testing/runtime.mjs';
import { syntheticContext, syntheticSession } from '../../scripts/testing/browser-fixtures.mjs';

// A size probe, not a customer backup or completed calculation fixture. Keep the
// frozen graph intact and add only independent workflow identities and versions.
export function createLoadingProbeLibrary() {
  const fixture = JSON.parse(
    fs.readFileSync(path.join(root, 'tests/fixtures/backups/document-calculation-v1.json'), 'utf8'),
  );
  const original = Object.values(fixture.library)[0];
  return Object.fromEntries(
    Array.from({ length: 100 }, (_, index) => {
      const id = `custom:loading-probe-${String(index + 1).padStart(3, '0')}`;
      const draft = {
        ...structuredClone(original.draft),
        id,
        name: `Synthetic loading workflow ${String(index + 1).padStart(3, '0')}`,
      };
      return [
        id,
        {
          ...structuredClone(original),
          id,
          draft,
          versions: Array.from({ length: 3 }, (_, version) => ({
            number: version + 1,
            savedAt: '2026-04-28T12:00:00.000Z',
            definition: structuredClone(draft),
          })),
          runs: [],
        },
      ];
    }),
  );
}

export async function measureProductionLoading({ browser, baseURL, output, profile = false }) {
  const measurements = [];
  const scenarios = [
    { name: 'empty', library: {} },
    { name: 'populated', library: createLoadingProbeLibrary() },
  ];
  const metadata = {
    capturedAt: new Date().toISOString(),
    buildHtmlSha256: createHash('sha256')
      .update(fs.readFileSync(path.join(webRoot, 'dist/public/index.html')))
      .digest('hex'),
    conditions: {
      productionBuild: true,
      syntheticApis: true,
      providerAvailable: false,
      externalRequestsBlocked: true,
      networkThrottling: false,
      // Playwright routing disables HTTP cache. Reopen measures the retained
      // application, and reload measures a saved browser library, not HTTP cache.
      httpCacheEnabled: false,
      cpuProfile: profile,
    },
    fixtures: scenarios.map(({ name, library }) => ({
      name,
      workflows: Object.keys(library).length,
      savedVersions: Object.values(library).reduce(
        (count, item) => count + item.versions.length,
        0,
      ),
      recordedRuns: 0,
      jsonBytes: Buffer.byteLength(JSON.stringify(library)),
    })),
  };
  const save = () => {
    fs.writeFileSync(
      path.join(output, 'loading-probe.json'),
      JSON.stringify({ ...metadata, measurements }, null, 2),
    );
  };
  save();

  for (const scenario of scenarios) {
    const context = await browser.newContext({ serviceWorkers: 'block' });
    const page = await context.newPage();
    const failures = [];
    page.on('pageerror', (error) => failures.push(error.message));
    let payload = Object.keys(scenario.library).length ? JSON.stringify(scenario.library) : null;
    let revision = payload ? 1 : 0;
    await page.route('**/*', (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin !== baseURL) return route.abort();
      if (!url.pathname.startsWith('/api/')) return route.continue();
      if (url.pathname === '/api/workflow-library') {
        if (request.method() === 'PUT') {
          const body = request.postDataJSON();
          expect(body.revision).toBe(revision);
          payload = body.payload;
          revision += 1;
        }
        return route.fulfill({ json: { payload, revision } });
      }
      const responses = {
        '/api/session': syntheticSession,
        '/api/workspaces': { workspaces: [syntheticContext.workspace] },
        '/api/mkoro/workers': { workers: [] },
        '/api/mkoro/conversations': { conversations: [] },
        '/api/documents': { documents: [] },
        '/api/integrations': [],
        '/api/chat/threads': { threads: [] },
      };
      return route.fulfill({
        status: url.pathname in responses ? 200 : 503,
        json: responses[url.pathname] ?? {
          error: 'Provider disabled in production loading probe.',
        },
      });
    });
    await page.addInitScript((value) => {
      sessionStorage.setItem('taxflow:authenticated-workspace', JSON.stringify(value));
      window.__loadingProbe = { longTasks: [], milestones: {} };
      const probe = window.__loadingProbe;
      if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
        const observer = new PerformanceObserver((list) => {
          probe.longTasks.push(
            ...list.getEntries().map(({ startTime, duration }) => ({ startTime, duration })),
          );
        });
        observer.observe({ type: 'longtask', buffered: true });
      }
      const observer = new MutationObserver(() => {
        for (const [name, selector] of [
          ['startupShell', '[aria-label="Workspace startup"]'],
          ['composerMounted', '.lc-console textarea'],
        ]) {
          if (!(name in probe.milestones) && document.querySelector(selector)) {
            probe.milestones[name] = Math.round(performance.now());
          }
        }
      });
      observer.observe(document, { childList: true, subtree: true });
    }, syntheticContext);

    async function measure(name, action, ready, navigation = false) {
      const profiler =
        profile && scenario.name === 'populated' && name === 'saved-library-reload'
          ? await context.newCDPSession(page)
          : undefined;
      if (profiler) {
        await profiler.send('Profiler.enable');
        await profiler.send('Profiler.start');
      }
      const browserStart = navigation ? 0 : await page.evaluate(() => performance.now());
      const start = performance.now();
      await action();
      if (typeof ready === 'function') await ready();
      else await expect(ready).toBeVisible({ timeout: 60_000 });
      const readyMilliseconds = Math.round(performance.now() - start);
      const browserMetrics = await page.evaluate((since) => {
        const resources = performance
          .getEntriesByType('resource')
          .filter((entry) => entry.startTime >= since)
          .map((entry) => ({
            path: new URL(entry.name).pathname,
            type: entry.initiatorType,
            startTime: Math.round(entry.startTime),
            duration: Math.round(entry.duration),
            responseStart: Math.round(entry.responseStart),
            transferSize: entry.transferSize,
            decodedBodySize: entry.decodedBodySize,
          }));
        const longTasks = window.__loadingProbe.longTasks.filter(
          (entry) => entry.startTime >= since,
        );
        return {
          documentMilliseconds: Math.round(performance.now()),
          milestones: window.__loadingProbe.milestones,
          paint: performance.getEntriesByType('paint').map(({ name, startTime }) => ({
            name,
            milliseconds: Math.round(startTime),
          })),
          longTaskCount: longTasks.length,
          longTaskMilliseconds: Math.round(
            longTasks.reduce((total, entry) => total + entry.duration, 0),
          ),
          resources,
        };
      }, browserStart);
      // A busy main thread may delay the snapshot after controls appear ready.
      // Keep both bounds so long-task totals have an explicit measurement window.
      const milliseconds = Math.round(performance.now() - start);
      measurements.push({
        scenario: scenario.name,
        name,
        milliseconds,
        readyMilliseconds,
        ...browserMetrics,
      });
      if (profiler) {
        const { profile: captured } = await profiler.send('Profiler.stop');
        fs.writeFileSync(
          path.join(output, 'populated-reload.cpuprofile'),
          JSON.stringify(captured),
        );
        await profiler.detach();
      }
      save();
    }

    try {
      const composer = page.locator('.lc-console').getByRole('textbox');
      const ready = async () => {
        await expect(
          page.getByRole('button', { name: 'New chat', exact: true }).first(),
        ).toBeVisible({
          timeout: 60_000,
        });
        await expect(composer).toBeEditable({ timeout: 60_000 });
        await composer.fill('Synthetic loading probe draft');
        await expect(composer).toHaveValue('Synthetic loading probe draft');
      };
      await measure(
        'fresh-context-chat',
        () => page.goto(baseURL, { waitUntil: 'load' }),
        ready,
        true,
      );
      const libraryHeading = page.getByText('Workflow library', { exact: true }).last();
      const libraryReady = async () => {
        await expect(libraryHeading).toBeVisible({ timeout: 60_000 });
        await expect(
          page.getByRole('navigation', { name: 'Workflow navigation' }).getByRole('button', {
            name: /^Synthetic loading workflow /,
          }),
        ).toHaveCount(Object.keys(scenario.library).length, { timeout: 60_000 });
      };
      await measure(
        'workflows-first-open',
        () => page.getByRole('button', { name: 'Workflows', exact: true }).first().click(),
        libraryReady,
      );
      await page.getByRole('button', { name: 'Chat', exact: true }).click();
      await measure(
        'workflows-reopen',
        () => page.getByRole('button', { name: 'Workflows', exact: true }).first().click(),
        libraryReady,
      );
      await measure(
        'saved-library-reload',
        () => page.goto(baseURL, { waitUntil: 'load' }),
        ready,
        true,
      );
      await expect(composer).toBeEditable();
      expect(failures).toEqual([]);
    } finally {
      save();
      await context.close();
    }
  }
  console.table(
    measurements.map(({ scenario, name, milliseconds, longTaskMilliseconds }) => ({
      scenario,
      name,
      milliseconds,
      longTaskMilliseconds,
    })),
  );
}
