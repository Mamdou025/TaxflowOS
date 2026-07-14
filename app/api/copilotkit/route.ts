import { CopilotRuntime, OpenAIAdapter, copilotRuntimeNextJSAppRouterEndpoint } from '@copilotkit/runtime';
import OpenAI from 'openai';
import type { NextRequest } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// CopilotKit runtime endpoint.
//
// Bridges the CopilotKit React UI/actions to our LLM. Uses the same OpenAI key
// as the rest of the app (OPENAI_API_KEY in .env.local); model via
// OPENAI_CHAT_MODEL (default gpt-4o). Frontend actions (useCopilotAction) are
// sent to the model here and their calls streamed back to the client to run.
// ─────────────────────────────────────────────────────────────────────────────

export const POST = async (req: NextRequest) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not set in .env.local' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const openai = new OpenAI({ apiKey });
  const serviceAdapter = new OpenAIAdapter({ openai, model: process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o' });
  const runtime = new CopilotRuntime();

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit',
  });

  return handleRequest(req);
};
