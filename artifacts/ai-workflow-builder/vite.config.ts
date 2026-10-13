import path from 'path';
import http from 'node:http';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

import { developmentRuntimeErrorOverlay } from './build/runtime-error-overlay';

// Node's http.Server defaults to a 5s keepAliveTimeout, far shorter than the
// frontend's own 60s session/workspace poll (see AuthProvider). On an idle
// tab the browser's pooled keep-alive connection to this dev server outlives
// that window, races the next poll's request, and the browser surfaces a bare
// "TypeError: Failed to fetch" with no server-side error to point at. Keep
// this comfortably above the longest known client idle gap.
// Without an explicit agent, Vite's dev proxy opens a brand-new TCP
// connection to the api-server for every single proxied request (Node's
// default http.globalAgent has keepAlive: false) and forwards the resulting
// "Connection: close" straight through to the browser. That means every
// /api/* poll pays for a fresh handshake end-to-end instead of reusing one,
// which is the main thing actually exposed to a flaky local network path.
const apiKeepAliveAgent = new http.Agent({ keepAlive: true, maxSockets: 32 });

function devServerKeepAlive(): Plugin {
  return {
    name: 'dev-server-keep-alive',
    configureServer(server) {
      if (!server.httpServer) return;
      server.httpServer.keepAliveTimeout = 75_000;
      server.httpServer.headersTimeout = 80_000;
    },
  };
}

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    'PORT environment variable is required but was not provided.',
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    'BASE_PATH environment variable is required but was not provided.',
  );
}

const sentryRelease = process.env.VITE_RELEASE;
const hasSentryUploadConfig = Boolean(
  process.env.SENTRY_AUTH_TOKEN &&
    process.env.SENTRY_ORG &&
    process.env.SENTRY_PROJECT,
);

if (hasSentryUploadConfig && !sentryRelease) {
  throw new Error(
    'VITE_RELEASE is required when Sentry source-map uploads are configured.',
  );
}

export default defineConfig({
  base: basePath,
  define: {
    // Keep the browser SDK release identical to the release used by the upload
    // plugin. JSON.stringify also makes an absent value a valid `undefined`.
    'import.meta.env.VITE_RELEASE': JSON.stringify(sentryRelease),
  },
  plugins: [
    react(),
    tailwindcss(),
    developmentRuntimeErrorOverlay(),
    devServerKeepAlive(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
    ...(process.env.NODE_ENV === 'production' && hasSentryUploadConfig
      ? [
          sentryVitePlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            release: {
              name: sentryRelease,
            },
            sourcemaps: {
              assets: './dist/public/assets/**',
              filesToDeleteAfterUpload: './dist/public/assets/**/*.map',
            },
            telemetry: false,
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      // Both adapters defer the workspace so the public startup shell can paint.
      // Production bundles are verified separately by test:production-ui.
      '@/app-workspace': path.resolve(
        import.meta.dirname,
        process.env.NODE_ENV === 'production'
          ? 'src/app-workspace.production.tsx'
          : 'src/app-workspace.ts',
      ),
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  // Scan the application entry, not generated standalone MCP viewer HTML.
  optimizeDeps: { entries: ['index.html'], holdUntilCrawlEnd: false },
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
    // "hidden" emits full maps for Sentry without adding sourceMappingURL
    // comments that would advertise their public location to browsers.
    sourcemap: hasSentryUploadConfig ? 'hidden' : false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // ── Shared runtime helpers ──────────────────────────────────────────
          // These packages call side-effectful code (e.g. createSidecarMedium)
          // at module-evaluation time and are imported by BOTH the copilotkit
          // and radix chunks.  If they land inside either chunk, Rollup's
          // circular-evaluation order leaves the other chunk's bindings
          // uninitialised → "tt is not a function" crash on boot.
          //
          // Placing them in a dedicated cycle-free chunk that both copilotkit
          // and radix import from breaks the cycle.  This chunk must be listed
          // BEFORE the copilotkit/radix rules so the matches take priority.
          if (
            id.includes('/tslib/') ||
            id.includes('/use-sidecar/') ||
            id.includes('react-remove-scroll') ||
            id.includes('use-callback-ref')
          ) {
            return 'runtime';
          }

          // Core React runtime — tiny, load first
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react';
          }
          // Heavy editor — loaded lazily in the UI
          if (id.includes('@monaco-editor') || id.includes('monaco-editor')) {
            return 'monaco';
          }
          // Workflow canvas (xyflow) — large, specific feature
          if (id.includes('@xyflow')) {
            return 'xyflow';
          }
          // Let CopilotKit follow feature imports rather than one eager chunk.
          // Radix UI primitives — shared across many pages
          if (id.includes('@radix-ui') || id.includes('radix-ui')) {
            return 'radix';
          }
          // Heavy document-processing libs — only needed on upload/viewer pages.
          // Keeping these out of the main vendor chunk prevents them from blocking
          // the initial page load (they would otherwise land in vendor and be
          // preloaded on every navigation).
          // Note: pnpm virtual store paths look like .pnpm/xlsx@x.y.z/node_modules/xlsx
          // so we match on the package name anywhere in the id.
          if (id.includes('/pako/')) return 'workflow-compression';
          if (id.includes('/xlsx/')) return 'spreadsheets';
          if (id.includes('/mammoth/')) return 'word-processing';
          if (id.includes('/unpdf/') || id.includes('/pdfjs-dist/')) return 'pdf-processing';
          if (id.includes('/jszip/')) return 'document-zip';
          // External service SDKs — very large, only needed when those integrations
          // are active. @linear/sdk alone is ~28 MB source; @slack/web-api is ~8 MB.
          if (id.includes('@linear/sdk') || id.includes('@slack/web-api') || id.includes('@slack/')) {
            return 'integrations';
          }
          // Geographic data — world-atlas ships large GeoJSON/TopoJSON blobs
          if (id.includes('world-atlas') || id.includes('topojson')) {
            return 'geo-data';
          }
          // Vercel AI SDK — only needed on AI-feature pages
          if (id.includes('@ai-sdk/') || id.includes('/node_modules/ai/')) {
            return 'ai-sdk';
          }
          // No blanket vendor catch-all — let Rollup place shared sync deps
          // naturally. This prevents lazy-only packages (openui, graphql, linear
          // sdk, etc.) from being force-merged into a single preloaded chunk.
        },
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    // File-watching over a Docker Desktop *Windows* bind mount: native inotify
    // events don't propagate from the host into the Linux container, so Vite
    // never sees source edits and keeps serving the module transforms it cached
    // at boot (symptom: committed UI changes just don't appear until you manually
    // `docker compose restart web`). Polling restores HMR there. Gated on an env
    // var (set for the `web` service in docker-compose.yml) so native, event-based
    // watching is kept everywhere it actually works (Replit, macOS, bare-metal).
    watch: process.env.VITE_USE_POLLING
      ? { usePolling: true, interval: 300 }
      : undefined,
    fs: {
      strict: true,
    },
    // Dev-only bridge: forward the frontend's relative `/api/*` calls — including
    // the CopilotKit runtime at `/api/copilotkit` (app-shell.tsx runtimeUrl) — to
    // the Express api-server.
    //
    // Port resolution order:
    //   1. API_BASE        — full override (e.g. http://api:8080 in docker-compose)
    //   2. API_SERVER_PORT — just the port number (set alongside PORT for each artifact)
    //   3. 8080            — matches the api-server artifact.toml localPort default
    //
    // In the Replit preview pane the platform's own path-router forwards /api
    // directly to the api-server process before requests ever reach Vite, so the
    // proxy is only exercised by local curl / e2e tests that hit Vite directly
    // (localhost:PORT/api/...). The proxy must still point at the correct port so
    // those callers don't hit ECONNREFUSED.
    proxy: {
      '/.well-known': {
        target: process.env.API_BASE ?? `http://localhost:${process.env.API_SERVER_PORT ?? 8080}`,
        changeOrigin: true,
        agent: apiKeepAliveAgent,
      },
      '/api': {
        target: process.env.API_BASE ?? `http://localhost:${process.env.API_SERVER_PORT ?? 8080}`,
        changeOrigin: true,
        agent: apiKeepAliveAgent,
      },
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
