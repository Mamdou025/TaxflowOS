import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';

const port = Number(process.env.CHATGPT_ACCOUNT_TEST_PORT ?? 4198);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error('Invalid account-linking test port.');
const root = await realpath(
  path.resolve(import.meta.dirname, '../../artifacts/ai-workflow-builder/dist/public'),
);
const index = await readFile(path.join(root, 'index.html'));
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

createServer(async (request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405).end();
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent((request.url ?? '/').split('?')[0]);
  } catch {
    response.writeHead(400).end();
    return;
  }
  if (
    !pathname.startsWith('/') ||
    pathname.includes('\\') ||
    pathname.includes('\0') ||
    pathname.split('/').includes('..')
  ) {
    response.writeHead(400).end();
    return;
  }
  if (pathname.startsWith('/api/')) {
    response
      .writeHead(503, { 'Content-Type': 'application/json' })
      .end('{"error":"Browser tests must mock API calls."}');
    return;
  }
  const candidate = path.resolve(root, `.${pathname}`);
  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) {
    response.writeHead(400).end();
    return;
  }
  try {
    const resolved = await realpath(candidate);
    if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
      response.writeHead(400).end();
      return;
    }
    const body = await readFile(resolved);
    response.writeHead(200, {
      'Content-Type': mime[path.extname(resolved)] ?? 'application/octet-stream',
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    if (path.extname(pathname)) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : index);
  }
}).listen(port, '127.0.0.1');
