// ─────────────────────────────────────────────────────────────────────────────
// Single chat thread API.
//
//   GET    /api/chat/threads/:id  → { thread, messages } (ordered)
//   PATCH  /api/chat/threads/:id  { title? , archived? }  → rename / archive
//   DELETE /api/chat/threads/:id  → delete thread + its messages (cascade)
//
// Every operation is scoped to the authenticated user; a thread that isn't theirs
// reads as 404.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/platform/auth/auth";
import {
  archiveThread,
  deleteThread,
  getThread,
  getThreadMessages,
  renameThread,
} from "@/features/assistant/runtime/chat/repository";

async function getUserId(req: NextRequest): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ threadId: string }> }
) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json(
      { ok: false, error: "AUTH_REQUIRED" },
      { status: 401 }
    );

  const { threadId } = await context.params;
  const thread = await getThread(userId, threadId);
  if (!thread)
    return NextResponse.json(
      { ok: false, error: "NOT_FOUND" },
      { status: 404 }
    );

  const messages = await getThreadMessages(userId, threadId);
  return NextResponse.json({ ok: true, thread, messages });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ threadId: string }> }
) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json(
      { ok: false, error: "AUTH_REQUIRED" },
      { status: 401 }
    );

  const { threadId } = await context.params;
  let body: { title?: string; archived?: boolean } = {};
  try {
    body = (await req.json()) ?? {};
  } catch {
    return NextResponse.json(
      { ok: false, error: "INVALID_JSON" },
      { status: 400 }
    );
  }

  if (body.archived === true) {
    const ok = await archiveThread(userId, threadId);
    return NextResponse.json({ ok });
  }
  if (typeof body.title === "string") {
    const ok = await renameThread(userId, threadId, body.title);
    return NextResponse.json({ ok });
  }
  return NextResponse.json(
    { ok: false, error: "NOTHING_TO_UPDATE" },
    { status: 400 }
  );
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ threadId: string }> }
) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json(
      { ok: false, error: "AUTH_REQUIRED" },
      { status: 401 }
    );

  const { threadId } = await context.params;
  const ok = await deleteThread(userId, threadId);
  return NextResponse.json({ ok });
}
