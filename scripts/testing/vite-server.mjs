import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { webRoot, reserveLoopbackPort } from './runtime.mjs';
import { syntheticContext, syntheticSession } from './browser-fixtures.mjs';

const { createServer } = await import(
  pathToFileURL(path.join(webRoot, 'node_modules/vite/dist/node/index.js')).href
);
// Vite interprets port 0 as its default. Select an OS-assigned port explicitly;
// strictPort makes a competing bind fail instead of connecting to another app.
const port = process.env.TAXFLOW_TEST_WEB_PORT
  ? Number(process.env.TAXFLOW_TEST_WEB_PORT)
  : await reserveLoopbackPort();
const server = await createServer({
  configFile: path.join(webRoot, 'vite.config.ts'),
  root: webRoot,
  envFile: false,
  mode: 'test',
  cacheDir: path.join(process.env.TAXFLOW_TEST_OUTPUT_DIR, 'vite-cache'),
  server: { host: '127.0.0.1', port, strictPort: true, open: false },
  plugins: [
    {
      name: 'isolated-api-boundary',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (process.env.TAXFLOW_TEST_SUITE === 'reliability' && req.method === 'GET') {
            const mock =
              req.url === '/api/session'
                ? syntheticSession
                : req.url === '/api/workspaces'
                  ? { workspaces: [syntheticContext.workspace] }
                  : undefined;
            if (mock) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(mock));
              return;
            }
          }
          const blocked = ['reliability', 'probe'].includes(process.env.TAXFLOW_TEST_SUITE)
            ? req.url?.startsWith('/api/')
            : /^\/api\/(fx-rate|http-source|assistant\/tools|agent-lab|genui)(?:[/?]|$)/.test(
                req.url ?? '',
              );
          if (blocked) {
            res.writeHead(503, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                error: 'Live integration calls are disabled in this browser suite.',
              }),
            );
          } else next();
        });
      },
    },
  ],
});
await server.listen();
process.send?.({
  type: 'taxflow-test-ready',
  runId: process.env.TAXFLOW_TEST_RUN_ID,
  port: server.httpServer.address().port,
});
async function close() {
  await server.close();
  process.exit(0);
}
process.on('SIGTERM', close);
process.on('SIGINT', close);
process.on('disconnect', close);
