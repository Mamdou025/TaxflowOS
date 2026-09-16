import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

import { transformWithEsbuild } from 'vite';

const appRoot = new URL('../', import.meta.url);

async function compileModule(relativePath, loader) {
  const source = await readFile(new URL(relativePath, appRoot), 'utf8');
  const result = await transformWithEsbuild(source, relativePath, {
    loader,
    format: 'esm',
    jsx: 'automatic',
  });
  return result.code;
}

function syntheticModule(context, identifier, exports) {
  const names = Object.keys(exports);
  return new vm.SyntheticModule(
    names,
    function initialiseExports() {
      for (const name of names) this.setExport(name, exports[name]);
    },
    { context, identifier },
  );
}

async function loadAppEntry() {
  const captures = [];
  const initialisationOrder = [];
  const window = new EventTarget();
  const originalAddEventListener = window.addEventListener.bind(window);
  let sentryInitialised = false;

  window.addEventListener = (type, listener, options) => {
    if (type === 'unhandledrejection') {
      initialisationOrder.push('listener');
      assert.equal(
        sentryInitialised,
        true,
        'unhandledrejection listener must be registered after Sentry initialises',
      );
    }
    return originalAddEventListener(type, listener, options);
  };

  const context = vm.createContext({
    console,
    Error,
    Event,
    EventTarget,
    String,
    window,
    document: {
      getElementById: () => ({ id: 'root' }),
    },
  });

  const modules = new Map();
  const createSynthetic = (identifier, exports) => {
    const module = syntheticModule(context, identifier, exports);
    modules.set(identifier, module);
    return module;
  };

  createSynthetic('react-dom/client', {
    createRoot: () => ({ render: () => undefined }),
  });
  createSynthetic('react/jsx-runtime', {
    Fragment: Symbol('Fragment'),
    jsx: () => null,
    jsxs: () => null,
  });
  createSynthetic('./App', { default: () => null });
  createSynthetic('./index.css', {});
  createSynthetic('@sentry/react', {
    captureException: (error) => captures.push({ error, tags: {} }),
    init: () => {
      initialisationOrder.push('sentry');
      sentryInitialised = true;
    },
    replayIntegration: () => ({}),
    withScope: (callback) => {
      const tags = {};
      callback({
        setExtra: () => undefined,
        setTag: (key, value) => {
          tags[key] = value;
        },
      });
      captures.at(-1).tags = tags;
    },
  });

  const monitoring = new vm.SourceTextModule(
    await compileModule('src/lib/error-monitoring.ts', 'ts'),
    {
      context,
      identifier: './lib/error-monitoring',
      initializeImportMeta(meta) {
        meta.env = {
          MODE: 'test',
          PROD: false,
          VITE_RELEASE: undefined,
          VITE_SENTRY_DSN: undefined,
        };
      },
    },
  );
  modules.set('./lib/error-monitoring', monitoring);

  const main = new vm.SourceTextModule(
    await compileModule('src/main.tsx', 'tsx'),
    { context, identifier: 'src/main.tsx' },
  );

  const linker = async (specifier) => {
    const linkedModule = modules.get(specifier);
    if (!linkedModule) throw new Error(`Unexpected import: ${specifier}`);
    return linkedModule;
  };

  await main.link(linker);
  await main.evaluate();

  return { captures, initialisationOrder, window };
}

function dispatchUnhandledRejection(window, reason) {
  const event = new Event('unhandledrejection');
  Object.defineProperty(event, 'reason', { value: reason });
  window.dispatchEvent(event);
}

test('captures an unhandled rejection exactly once with structured tags', async () => {
  const { captures, initialisationOrder, window } = await loadAppEntry();
  const rejection = new Error('request failed');

  dispatchUnhandledRejection(window, rejection);

  assert.deepEqual(initialisationOrder, ['sentry', 'listener']);
  assert.equal(captures.length, 1);
  assert.equal(captures[0].error, rejection);
  assert.deepEqual(captures[0].tags, {
    'error.type': 'UnhandledPromiseRejection',
    'error.source': 'window.unhandledrejection',
  });
});

test('normalizes non-Error rejection reasons without throwing', async () => {
  const { captures, window } = await loadAppEntry();

  assert.doesNotThrow(() => dispatchUnhandledRejection(window, { code: 503 }));

  assert.equal(captures.length, 1);
  assert.ok(captures[0].error instanceof Error);
  assert.equal(
    captures[0].error.message,
    'Unhandled promise rejection: [object Object]',
  );
});