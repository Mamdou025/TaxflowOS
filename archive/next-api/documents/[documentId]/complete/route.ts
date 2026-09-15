// ─────────────────────────────────────────────────────────────────────────────
// Mark an upload complete + kick off RAG ingestion.
//
//   POST /api/documents/:id/complete  → the bytes have landed in Storage.
//
// Flips status to "processing" and runs extract → chunk → embed via `after()`, so
// the response returns immediately while ingestion continues (status → "ready" /
// "failed"). The client polls GET /api/documents to see the status settle. Scoped
// to the session user.
//
// Very large documents may exceed the serverless function's max duration even under
// after() — a durable background worker is the follow-up (see platform/rag/ingest.ts).
// ─────────────────────────────────────────────────────────────────────────────

import { after, type NextRequest, NextResponse } from '@/lib/next-server-shim';
import { auth } from "@/platform/auth/auth";
import { getDocument, updateDocument } from "@/platform/db/documents";
import { ingestDocument } from "@/platform/rag/ingest";

async function getUserId(req: NextRequest): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ documentId: string }> }
) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ ok: false, error: "AUTH_REQUIRED" }, { status: 401 });
  }

  const { documentId } = await context.params;
  const doc = await getDocument(userId, documentId);
  if (!doc) {
    return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
  }

  // Mark processing now; ingest after the response so the client isn't blocked.
  await updateDocument(userId, documentId, { status: "processing", error: null });
  after(async () => {
    await ingestDocument(userId, documentId);
  });

  return NextResponse.json({ ok: true, status: "processing" });
}
