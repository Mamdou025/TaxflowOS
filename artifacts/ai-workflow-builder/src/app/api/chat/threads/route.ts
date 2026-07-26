// ─────────────────────────────────────────────────────────────────────────────
// Chat threads collection API.
//
//   GET  /api/chat/threads?includeArchived=  → the user's saved conversations
//   POST /api/chat/threads   { title?, clientId? }  → create a new thread
//
// Tenant boundary = the authenticated user (better-auth; anonymous sessions count).
// FAIL-SOFT: no session or no DB → GET returns []; the chat still works unsaved.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextRequest } from '@/lib/next-server-shim';
import { NextResponse } from '@/lib/next-server-shim';
import { auth } from "@/platform/auth/auth";
import {
  listThreads,
  upsertThread,
} from "@/features/assistant/runtime/chat/repository";

async function getUserId(req: NextRequest): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ threads: [] });

  const includeArchived =
    new URL(req.url).searchParams.get("includeArchived") === "true";
  const threads = await listThreads(userId, { includeArchived });
  return NextResponse.json({ threads });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json(
      { ok: false, error: "AUTH_REQUIRED" },
      { status: 401 }
    );

  let body: { title?: string | null; clientId?: string | null } = {};
  try {
    body = (await req.json()) ?? {};
  } catch {
    // Empty body is fine — create an untitled thread.
  }

  const thread = await upsertThread(userId, {
    title: body.title ?? null,
    clientId: body.clientId ?? null,
  });
  if (!thread)
    return NextResponse.json(
      { ok: false, error: "STORAGE_UNAVAILABLE" },
      { status: 503 }
    );
  return NextResponse.json({ ok: true, thread });
}
