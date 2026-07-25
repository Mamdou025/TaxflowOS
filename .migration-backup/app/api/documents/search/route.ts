// ─────────────────────────────────────────────────────────────────────────────
// Document retrieval API (RAG).
//
//   POST /api/documents/search  { query, clientId?, k? }
//     → { passages: [{ documentId, fileName, chunkIndex, content, similarity }] }
//
// Embeds the query and returns the nearest chunks from the user's documents. Backs
// Sina's `searchCompanyDocuments` tool. Scoped to the session user.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/platform/auth/auth";
import { searchChunks } from "@/platform/rag/retrieve";

const BodySchema = z.object({
  query: z.string().min(1).max(2000),
  clientId: z.string().nullish(),
  k: z.number().int().min(1).max(20).optional(),
});

async function getUserId(req: NextRequest): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ passages: [] });

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

  const passages = await searchChunks(userId, parsed.data.query, {
    clientId: parsed.data.clientId,
    k: parsed.data.k,
  });
  return NextResponse.json({ ok: true, passages });
}
