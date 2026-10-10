import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const port = Number(process.env.CHATGPT_VIEWER_TEST_PORT ?? 4199);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error('Invalid viewer test port.');
const root = path.resolve(import.meta.dirname, '../..');
const viewer = await readFile(
  path.join(root, 'artifacts/ai-workflow-builder/dist-chatgpt/chatgpt.html'),
);
const host =
  '<!doctype html><html><head><meta charset="utf-8"><title>MCP Apps test host</title></head><body style="margin:0"><iframe title="InScope test viewer" src="/chatgpt.html" style="border:0;width:100vw;height:100vh"></iframe></body></html>';
createServer((request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
  if (!['/', '/chatgpt.html'].includes(pathname)) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(pathname === '/' ? host : viewer);
}).listen(port, '127.0.0.1');
