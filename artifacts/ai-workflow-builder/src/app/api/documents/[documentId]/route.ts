// ─────────────────────────────────────────────────────────────────────────────
// Single document API.
//
//   GET    /api/documents/:id  → { document, downloadUrl } (short-lived signed URL)
//   DELETE /api/documents/:id  → removes the row (+ chunks by cascade) + the object
//
// Scoped to the session user; a document that isn't theirs reads as 404.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextRequest } from '@/lib/next-server-shim';
import { NextResponse } from '@/lib/next-server-shim';
import { auth } from "@/platform/auth/auth";
import { deleteDocument, getDocument } from "@/platform/db/documents";
import {
  createSignedDownloadUrl,
  deleteObject,
} from "@/platform/storage/supabase";

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
  context: { params: Promise<{ documentId: string }> }
) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ ok: false, error: "AUTH_REQUIRED" }, { status: 401 });
  }

  const { documentId } = await context.params;
  const document = await getDocument(userId, documentId);
  if (!document) {
    return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
  }

  let downloadUrl: string | null = null;
  try {
    downloadUrl = await createSignedDownloadUrl(document.storageKey);
  } catch (err) {
    console.error("[documents] signed download url failed:", err);
  }

  return NextResponse.json({ ok: true, document, downloadUrl });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ documentId: string }> }
) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ ok: false, error: "AUTH_REQUIRED" }, { status: 401 });
  }

  const { documentId } = await context.params;
  const row = await deleteDocument(userId, documentId);
  if (row) {
    // Best-effort object removal — the metadata is already gone.
    try {
      await deleteObject(row.storageKey);
    } catch (err) {
      console.error("[documents] object delete failed:", err);
    }
  }
  return NextResponse.json({ ok: Boolean(row) });
}
