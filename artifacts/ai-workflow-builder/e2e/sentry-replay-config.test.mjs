import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const monitoringSource = await readFile(
  new URL('../src/lib/error-monitoring.ts', import.meta.url),
  'utf8',
);

test('retains every crash session and masks sensitive replay content', () => {
  assert.match(monitoringSource, /Sentry\.replayIntegration\s*\(\s*\{/);
  assert.match(monitoringSource, /maskAllText:\s*true/);
  assert.match(monitoringSource, /blockAllMedia:\s*true/);
  assert.match(monitoringSource, /replaysOnErrorSampleRate:\s*1(?:\.0)?/);
});

test('limits baseline Replay sampling in production', () => {
  assert.match(
    monitoringSource,
    /replaysSessionSampleRate:\s*import\.meta\.env\.PROD\s*\?\s*0\.1\s*:\s*1(?:\.0)?/,
  );
});