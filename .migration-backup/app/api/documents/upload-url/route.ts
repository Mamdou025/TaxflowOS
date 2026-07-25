// ─────────────────────────────────────────────────────────────────────────────
// Signed direct-upload URL for a company document.
//
//   POST /api/documents/upload-url  { fileName, mimeType?, sizeBytes?, clientId? }
//     → { documentId, uploadUrl, key }
//
// The browser PUTs the file bytes straight to `uploadUrl` (Supabase Storage), which
// sidesteps Vercel's 4.5 MB serverless body limit — essential for large docs. We
// create the metadata row up front (status "uploading"); the client calls
// /complete once the bytes land. Auth-scoped to the session user.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/platform/auth/auth";
import { createDocument } from "@/platform/db/documents";
import {
  createSignedUploadUrl,
  isStorageConfigured,
  STORAGE_BUCKET,
} from "@/platform/storage/supabase";
import { generateId } from "@/lib/utils/id";

const BodySchema = z.object({
  fileName: z.string().min(1).max(500),
  mimeType: z.string().max(255).nullish(),
  sizeBytes: z.number().int().nonnegative().nullish(),
  clientId: z.string().nullish(),
});

async function getUserId(req: NextRequest): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

/** Reduce a filename to a safe single storage-key segment (keeps the extension). */
function safeName(name: string): string {
  const cleaned = name.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
  return cleaned.slice(0, 200) || "document";
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ ok: false, error: "AUTH_REQUIRED" }, { status: 401 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json(
      { ok: false, error: "STORAGE_NOT_CONFIGURED" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "INVALID_INPUT", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { fileName, mimeType, sizeBytes, clientId } = parsed.data;
  const id = generateId();
  const key = `${userId}/${id}/${safeName(fileName)}`;

  let upload: { uploadUrl: string; token: string; key: string };
  try {
    upload = await createSignedUploadUrl(key);
  } catch (err) {
    console.error("[documents] signed upload url failed:", err);
    return NextResponse.json({ ok: false, error: "STORAGE_ERROR" }, { status: 502 });
  }

  const row = await createDocument({
    id,
    userId,
    clientId: clientId ?? null,
    fileName,
    mimeType: mimeType ?? null,
    sizeBytes: sizeBytes ?? null,
    storageBucket: STORAGE_BUCKET,
    storageKey: key,
    status: "uploading",
  });
  if (!row) {
    return NextResponse.json(
      { ok: false, error: "STORAGE_UNAVAILABLE" },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    documentId: id,
    uploadUrl: upload.uploadUrl,
    token: upload.token,
    key,
  });
}
