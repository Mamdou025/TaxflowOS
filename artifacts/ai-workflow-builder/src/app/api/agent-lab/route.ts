// ─────────────────────────────────────────────────────────────────────────────
// POST /api/agent-lab — the backend the Agent Lab page calls.
//
// Self-contained: it does NOT touch the CopilotKit chat pipeline
// (app/api/copilotkit/route.ts). It reuses the same OPENAI_API_KEY, plus the AI
// Gateway (AI_GATEWAY_API_KEY) for switching to non-OpenAI models.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextRequest } from '@/lib/next-server-shim';
import { auth } from '@/platform/auth/auth';
import { runAgent } from '@/features/agent-lab/agent';
import type { AgentLabDoc, AgentLabMessage, DocMode } from '@/features/agent-lab/catalog';
import { EFFORT_LEVELS, type EffortLevel } from '@/features/agent-lab/model-router';

// Node runtime (matches the rest of the AI routes in this app).
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Protect the deployed (Vercel) endpoint so it can't spend your credits
    // anonymously. Left open in local dev so you can test without signing in.
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user && process.env.NODE_ENV === 'production') {
      return Response.json({ error: 'Sign in to use the Agent Lab.' }, { status: 401 });
    }

    const body = (await req.json()) as Partial<{
      model: string;
      system: string;
      temperature: number;
      maxSteps: number;
      enabledTools: string[];
      messages: AgentLabMessage[];
      documents: AgentLabDoc[];
      docMode: DocMode;
      effort: EffortLevel;
    }>;

    const messages = (body.messages ?? []).map(
      (m): AgentLabMessage => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })
    );

    const documents = (Array.isArray(body.documents) ? body.documents : [])
      .filter((d): d is AgentLabDoc => typeof d?.name === 'string' && typeof d?.text === 'string');

    const out = await runAgent({
      model: body.model ?? 'gpt-4o',
      system: body.system ?? '',
      temperature: typeof body.temperature === 'number' ? body.temperature : 0.7,
      maxSteps: typeof body.maxSteps === 'number' ? body.maxSteps : 6,
      enabledTools: Array.isArray(body.enabledTools) ? body.enabledTools : [],
      messages,
      documents,
      docMode: body.docMode === 'retrieval' ? 'retrieval' : 'full',
      effort: EFFORT_LEVELS.includes(body.effort as EffortLevel) ? body.effort : undefined,
    });

    return Response.json(out);
  } catch (err) {
    // Send the error back so the page can show it (missing key, bad model id, …).
    return Response.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
