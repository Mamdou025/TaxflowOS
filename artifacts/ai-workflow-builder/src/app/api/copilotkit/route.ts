import { CopilotRuntime, OpenAIAdapter, copilotRuntimeNextJSAppRouterEndpoint } from '@copilotkit/runtime';
import { BuiltInAgent } from '@copilotkit/runtime/v2';
import OpenAI from 'openai';
import type { NextRequest } from '@/lib/next-server-shim';
import { repairOrphanToolCalls } from '@/lib/copilot-orphan-repair';
import { traceCopilotInput } from '@/lib/copilot-trace';
import { getAssistantRuntimeConfig } from '@/features/assistant/runtime/config';
import { computeGateDecision, applyGateDecision, classifyTurn } from '@/features/assistant/runtime/routing/gate';
import { normalizeModelSpec, pickModelDecision } from '@/features/assistant/runtime/model-policy';
import { sinaTurnDirective } from '@/features/assistant/runtime/agents/sina';

// ─────────────────────────────────────────────────────────────────────────────
// CopilotKit runtime endpoint.
//
// Bridges the CopilotKit React UI/actions to our LLM. Uses the same OpenAI key as the
// rest of the app (OPENAI_API_KEY in .env.local); model via OPENAI_CHAT_MODEL (default
// gpt-4o). Frontend actions (useCopilotAction) are sent to the model here and their
// calls streamed back to the client to run.
//
// Orphan safety — the "can't chat after a workflow" fix:
// We register an EXPLICIT default `BuiltInAgent` (the same model driver CopilotKit would
// create implicitly) and attach a middleware that REPAIRS orphaned tool calls on every
// run, immediately before the thread is converted for the Vercel AI SDK. Without this,
// the default agent hands the whole persisted thread to ai@6's convertToLanguageModelPrompt,
// which throws MissingToolResultsError ("Tool result is missing for tool call …") on any
// assistant tool-call left unpaired by an aborted/navigated run — so one orphan (very
// common right after a workflow, when the user navigates to inspect results) poisons every
// later message. Repairing at the runtime boundary is deterministic and covers orphans from
// any source; it replaces the former client-side heal (removed), which silently failed
// because agent.setMessages() structuredClone-throws on the render closure a workflow's
// assistant message always carries. See lib/copilot-orphan-repair.ts.
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/copilotkit — CopilotKit's dev-console sends a GET to /api/copilotkit/info
// on startup to confirm the runtime is reachable. Without a GET handler Next.js returns
// 405, which the SDK surfaces as the "Runtime info request failed" banner even when a
// real backend is configured. The info check never calls the LLM, so no real API key is
// needed here — the endpoint just needs a valid CopilotRuntime to respond.
export const GET = async (req: NextRequest) => {
  const placeholderKey = process.env.AI_GATEWAY_API_KEY ?? process.env.OPENAI_API_KEY ?? 'placeholder';
  const openai = new OpenAI({ apiKey: placeholderKey });
  const serviceAdapter = new OpenAIAdapter({ openai, model: 'gpt-4o' });
  const runtime = new CopilotRuntime();
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit',
  });
  return handleRequest(req);
};

export const POST = async (req: NextRequest) => {
  // Prefer the Vercel AI Gateway when its key is set: one key unlocks every
  // provider/model (vercel.com/ai-gateway/models). The OpenAI SDK talks to the
  // gateway's OpenAI-compatible endpoint, where models must be "provider/model" —
  // so a bare OPENAI_CHAT_MODEL like "gpt-5.6-terra" is normalized to "openai/…".
  // Falls back to calling OpenAI directly with OPENAI_API_KEY (previous behavior).
  const gatewayKey = process.env.AI_GATEWAY_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!gatewayKey && !openaiKey) {
    return new Response(JSON.stringify({ error: 'Set AI_GATEWAY_API_KEY or OPENAI_API_KEY in .env.local' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const configuredModel = process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o';
  const openai = gatewayKey
    ? new OpenAI({ apiKey: gatewayKey, baseURL: 'https://ai-gateway.vercel.sh/v1' })
    : new OpenAI({ apiKey: openaiKey });
  const model = gatewayKey ? normalizeModelSpec(configuredModel) : configuredModel;
  const serviceAdapter = new OpenAIAdapter({ openai, model });

  // Explicit default agent + orphan-repair middleware. The middleware runs before
  // BuiltInAgent converts input.messages for the AI SDK, so the exact thread the SDK
  // validates is always tool-call/result paired. Frontend useCopilotAction tools are
  // unaffected — they arrive per-request as input.tools and stream to the client as
  // before; we rewrite only input.messages.
  const runtimeConfig = getAssistantRuntimeConfig();

  // `overridableProperties` lets the middleware pick the model/reasoning per turn via
  // input.forwardedProps (model tiering below). Without it BuiltInAgent ignores them.
  const agent = new BuiltInAgent({
    model: serviceAdapter.getLanguageModel(),
    overridableProperties: ['model', 'providerOptions'],
  });
  agent.use((input, next) => {
    // Trace what the model receives this turn (no-op unless COPILOT_TRACE is set).
    traceCopilotInput(input);

    // Ask/Propose/Execute intent gate (lib/assistant-runtime). Deterministic, sync,
    // fail-open: on ask/mention/negation turns it withholds the state-starting tools
    // (so a workflow MENTION can't trigger a run) and on explicit commands it steers
    // to the right workflow. Controlled by ASSISTANT_INTENT_GATE (off|shadow|enforce,
    // default enforce). See docs/assistant-routing-policy.md.
    const decision = computeGateDecision(input, {
      mode: runtimeConfig.intentGate,
      directives: runtimeConfig.intentDirectives,
    });
    const gated = applyGateDecision(input.messages, input.tools, decision);

    // The route the gate computed for this turn (reused for tiering + specialist).
    const route = decision.route.source !== 'fallback' ? decision.route : classifyTurn(input)?.route ?? null;

    // Model tiering (lib/assistant-runtime/model-policy). Pick a stronger model for
    // hard tax/analysis questions and a fast one for navigation. NO-OP until
    // ASSISTANT_MODEL_FAST/DEEP are set to distinct models.
    let forwardedProps = input.forwardedProps;
    let tierLabel: string | undefined;
    if (runtimeConfig.modelTiering && route) {
      const md = pickModelDecision(route, runtimeConfig);
      tierLabel = md.tier;
      if (md.modelSpec) {
        forwardedProps = {
          ...(input.forwardedProps ?? {}),
          model: md.modelSpec,
          ...(md.providerOptions ? { providerOptions: md.providerOptions } : {}),
        };
      }
    }

    // Domain focus (agents/sina). There is ONE unified agent — Sina. A turn about a
    // resolved workflow surfaces that domain's expertise (FAPI / s.85 rollover / expense
    // / campaign) as a "DOMAIN FOCUS" note — Sina stays Sina, no persona swap. Injected
    // as a context item so it reaches the model without touching the message thread.
    // Controlled by ASSISTANT_SPECIALISTS (default on).
    let context = input.context;
    let specialistLabel: string | undefined;
    if (runtimeConfig.specialists && route) {
      const directive = sinaTurnDirective(route);
      if (directive) {
        specialistLabel = 'Sina';
        context = [
          ...(input.context ?? []),
          { value: directive, description: 'Domain focus for this turn (Sina — one unified agent)' },
        ];
      }
    }

    if (decision.route.source !== 'fallback') {
      // Log-safe, single-line observability (no message content, no chain-of-thought).
      console.log(
        '[assistant-route]',
        JSON.stringify({
          mode: decision.route.mode,
          intent: decision.route.intent,
          target: decision.route.target.id,
          conf: decision.route.confidence,
          withheld: decision.withheldToolNames,
          directive: decision.directive != null,
          tier: tierLabel,
          specialist: specialistLabel,
          gate: decision.mode,
          audit: decision.route.auditSummary,
        })
      );
    }

    // Orphan repair still runs last, on the (possibly gated) messages, so the thread
    // handed to the AI SDK is always tool-call/result paired.
    return next.run({ ...input, tools: gated.tools, messages: repairOrphanToolCalls(gated.messages), forwardedProps, context });
  });

  const runtime = new CopilotRuntime({ agents: { default: agent } });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit',
  });

  return handleRequest(req);
};
