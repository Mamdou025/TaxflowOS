// ─────────────────────────────────────────────────────────────────────────────
// Documents collection API.
//
//   GET /api/documents?clientId=  → the signed-in user's stored documents
//
// FAIL-SOFT: no session or no DB → returns []. Scoped to the session user.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/platform/auth/auth";
import { listDocuments } from "@/platform/db/documents";

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
  if (!userId) return NextResponse.json({ documents: [] });

  const clientId = new URL(req.url).searchParams.get("clientId");
  const documents = await listDocuments(userId, { clientId });
  return NextResponse.json({ documents });
}
