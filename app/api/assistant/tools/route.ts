// ─────────────────────────────────────────────────────────────────────────────
// Assistant server tools — the live-data / secret-bearing tools Sina can call.
//
//   POST /api/assistant/tools  { tool, args }
//     → tool-specific JSON result
//
// Thin auth-gated dispatcher: the actual tool IMPLEMENTATIONS live in the shared
// registry (platform/agent-tools/registry.ts) so the Agent Lab and Sina run the same
// code. This route just authenticates the caller and delegates. Client registration
// (CopilotKit actions) is in features/assistant/ui/use-assistant.tsx.
//
// Session-gated: the tools proxy outbound fetches, so an unauthenticated caller must
// not be able to use this as an open web proxy.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/platform/auth/auth';
import { isAgentToolId, runAgentTool } from '@/platform/agent-tools/registry';

const BodySchema = z.object({
  tool: z.string(),
  args: z.record(z.string(), z.unknown()).optional().default({}),
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
  if (!userId) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT', issues: parsed.error.issues }, { status: 400 });
  }
  if (!isAgentToolId(parsed.data.tool)) {
    return NextResponse.json({ error: 'Unknown tool.' }, { status: 400 });
  }

  return NextResponse.json(await runAgentTool(parsed.data.tool, parsed.data.args));
}
