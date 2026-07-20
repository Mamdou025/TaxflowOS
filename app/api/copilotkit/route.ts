import { CopilotRuntime, OpenAIAdapter, copilotRuntimeNextJSAppRouterEndpoint } from '@copilotkit/runtime';
import { BuiltInAgent } from '@copilotkit/runtime/v2';
import OpenAI from 'openai';
import type { NextRequest } from 'next/server';
import { repairOrphanToolCalls } from '@/lib/copilot-orphan-repair';
import { traceCopilotInput } from '@/lib/copilot-trace';
import { getAssistantRuntimeConfig } from '@/lib/assistant-runtime/config';
import { computeGateDecision, applyGateDecision, classifyTurn } from '@/lib/assistant-runtime/routing/gate';
import { pickModelDecision } from '@/lib/assistant-runtime/model-policy';
import { selectSpecialist, specialistDirective } from '@/lib/assistant-runtime/agents/specialists';

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

    // Specialist "hat" (lib/assistant-runtime/agents/specialists). A turn about a
    // resolved workflow is answered AS that workflow's specialist (Sofi/Théo/Mira/
    // Nova) — one conductor, one thread, but the domain persona + expertise for this
    // turn. Injected as a context item so it reaches the model without touching the
    // message thread. Controlled by ASSISTANT_SPECIALISTS (default on).
    let context = input.context;
    let specialistLabel: string | undefined;
    if (runtimeConfig.specialists && route) {
      const specialist = selectSpecialist(route);
      if (specialist) {
        specialistLabel = specialist.name;
        context = [
          ...(input.context ?? []),
          { value: specialistDirective(specialist), description: 'Active specialist persona for this turn (wear this hat)' },
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
