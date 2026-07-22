// ─────────────────────────────────────────────────────────────────────────────
// Assistant memory API — durable facts/preferences for the AI chat.
//
//   GET    /api/assistant/memory?clientId=&fiscalYear=  → relevant memories for the user
//   POST   /api/assistant/memory   { content, subject?, clientId?, ... }  → save one
//   DELETE /api/assistant/memory?id=<id>                → forget one
//
// Tenant boundary = the authenticated user (better-auth). All queries are scoped to
// that userId, so one user can never read/delete another's memory. FAIL-SOFT: no
// session or no DB → the chat still works, just without memory.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/platform/auth/auth';
import { deleteMemory, insertMemory, listMemoriesForUser } from '@/features/assistant/runtime/memory/repository';
import { selectRelevantMemories } from '@/features/assistant/runtime/memory/retrieval';
import { SaveMemoryInputSchema } from '@/features/assistant/runtime/memory/types';
import type { AssistantMemory } from '@/platform/db/schema';

async function getUserId(req: NextRequest): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

function view(m: AssistantMemory) {
  return {
    id: m.id,
    clientId: m.clientId,
    fiscalYear: m.fiscalYear,
    workflowId: m.workflowId,
    kind: m.kind,
    subject: m.subject,
    content: m.content,
    source: m.source,
    createdAt: m.createdAt,
  };
}

export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  // Fail-soft: an unauthenticated / anonymous caller simply gets no memory.
  if (!userId) return NextResponse.json({ memories: [] });

  const url = new URL(req.url);
  const clientId = url.searchParams.get('clientId');
  const yearRaw = url.searchParams.get('fiscalYear');
  const yearNum = yearRaw ? Number(yearRaw) : NaN;
  const fiscalYear = Number.isFinite(yearNum) ? yearNum : null;

  const rows = await listMemoriesForUser(userId);
  const relevant = selectRelevantMemories(rows, { clientId, fiscalYear });
  return NextResponse.json({ memories: relevant.map(view) });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ ok: false, error: 'AUTH_REQUIRED' }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'INVALID_JSON' }, { status: 400 });
  }

  const parsed = SaveMemoryInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'INVALID_INPUT', issues: parsed.error.issues }, { status: 400 });
  }

  const d = parsed.data;
  const row = await insertMemory({
    userId,
    content: d.content,
    subject: d.subject ?? null,
    kind: d.kind ?? 'fact',
    clientId: d.clientId ?? null,
    fiscalYear: d.fiscalYear ?? null,
    workflowId: d.workflowId ?? null,
    source: d.source ?? 'user',
  });
  if (!row) return NextResponse.json({ ok: false, error: 'STORAGE_UNAVAILABLE' }, { status: 503 });
  return NextResponse.json({ ok: true, memory: view(row) });
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ ok: false, error: 'AUTH_REQUIRED' }, { status: 401 });

  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, error: 'MISSING_ID' }, { status: 400 });

  const ok = await deleteMemory(userId, id);
  return NextResponse.json({ ok });
}
