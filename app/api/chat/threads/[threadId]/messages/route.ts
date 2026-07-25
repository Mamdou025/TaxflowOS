// ─────────────────────────────────────────────────────────────────────────────
// Chat message persistence API.
//
//   POST /api/chat/threads/:id/messages
//     { messages: [{ id, role, seq, content }], title?, clientId? }
//     → upserts the projected transcript (idempotent by message id) and touches
//       the thread. Creates the thread row if it doesn't exist yet.
//
// The client sends a SERIALIZABLE projection only — text + tool name/args/result.
// It must never send CopilotKit's raw message objects (they carry non-serializable
// generative-UI render closures). See features/assistant/runtime/chat/repository.ts.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/platform/auth/auth";
import {
  type IncomingChatMessage,
  saveMessages,
} from "@/features/assistant/runtime/chat/repository";

const ToolCallSchema = z.object({
  name: z.string(),
  args: z.unknown().optional(),
  result: z.unknown().optional(),
  callId: z.string().optional(),
});

const MessageSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["user", "assistant", "tool", "system"]),
  seq: z.number().int().nonnegative(),
  content: z.object({
    text: z.string().optional(),
    toolCall: ToolCallSchema.optional(),
  }),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema).max(2000),
  title: z.string().nullish(),
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

export async function POST(
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "INVALID_JSON" },
      { status: 400 }
    );
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "INVALID_INPUT", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const saved = await saveMessages(
    userId,
    threadId,
    parsed.data.messages as IncomingChatMessage[],
    { title: parsed.data.title ?? undefined, clientId: parsed.data.clientId ?? undefined }
  );
  return NextResponse.json({ ok: saved > 0, saved });
}
