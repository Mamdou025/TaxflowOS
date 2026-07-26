// Vite shim for next/server types — API routes run in api-server, not Vite
export type NextRequest = Request & { nextUrl: URL };
export class NextResponse extends Response {
  static json(data: unknown, init?: ResponseInit) {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    });
  }
}
