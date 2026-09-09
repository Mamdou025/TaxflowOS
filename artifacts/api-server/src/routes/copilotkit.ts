/**
 * CopilotKit runtime — OpenAI adapter via @copilotkit/runtime.
 *
 * Exposes a GraphQL endpoint that the CopilotKit React SDK streams through.
 *
 * Model routing: prefer the Vercel AI Gateway when AI_GATEWAY_API_KEY is set —
 * one key reaches every provider/model, so OPENAI_API_KEY is OPTIONAL. The
 * OpenAI SDK points at the gateway's OpenAI-compatible endpoint, where models
 * must be "provider/model", so a bare OPENAI_CHAT_MODEL (e.g. "gpt-5.6-terra")
 * is normalized to "openai/…". With no gateway key we fall back to a direct
 * OpenAI client, which reads OPENAI_API_KEY from the environment.
 *
 * Orphan safety — the "can't send a follow-up after the AI replied" fix:
 * The chat runs through a CopilotKit BuiltInAgent that hands the whole persisted
 * thread to the AI SDK (streamText → convertToLanguageModelPrompt), which THROWS
 * MissingToolResultsError ("Tool result is missing for tool call …") on any assistant
 * tool-call left unpaired by an aborted/navigated run — so one orphan poisons every
 * later message. We register an EXPLICIT default BuiltInAgent (the same model driver
 * CopilotKit would create implicitly) and attach a middleware that REPAIRS orphaned tool
 * calls on every run, right before the thread is converted. This mirrors the Next.js
 * route (app/api/copilotkit/route.ts); the LIVE runtime in the 3-service dev stack is
 * THIS Express api-server, so the repair must live here. See lib/copilot-orphan-repair.ts.
 *
 * Strict-model system-message handling:
 * Some models (o-series reasoning models, *-pro / *-deep-research variants) are served
 * via the Responses API and reject system-role messages in the messages array, returning
 * "Invalid prompt: System messages are not allowed … Use the instructions option instead."
 * The same middleware that repairs orphans also injects providerOptions.openai.systemMessageMode
 * = "developer" for those models via forwardedProps, so @ai-sdk/openai converts system →
 * developer role (accepted by all Responses-API models) before the API call is made.
 * Permissive chat-completions models are unaffected — no providerOptions injected.
 *
 * Frontend mounts at: /api/copilotkit  (app-shell.tsx runtimeUrl)
 * This router is mounted at /copilotkit inside /api — the full path is
 * /api/copilotkit, matching the frontend config.
 *
 * Note: Express strips the mount prefix from req.url before calling middleware.
 * We restore req.url to the full path (req.baseUrl + req.url) so the yoga
 * GraphQL server inside CopilotKit can route correctly.
 */
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNodeExpressEndpoint,
} from "@copilotkit/runtime";
import { BuiltInAgent } from "@copilotkit/runtime/v2";
import OpenAI from "openai";
import { Router } from "express";
import type { IncomingMessage, ServerResponse } from "http";
import { repairOrphanToolCalls } from "../lib/copilot-orphan-repair";

const router = Router();

// Gateway model ids are "provider/model"; a bare OpenAI id gets an "openai/" prefix.
const normalizeModelSpec = (spec: string): string =>
  spec.includes("/") ? spec : `openai/${spec}`;

/**
 * Detect models that are served exclusively via the Responses API and therefore
 * reject "system" role messages in the messages array (demanding `instructions`
 * instead). Returns true for any model whose name matches a Responses-API-only
 * pattern — this is a capability heuristic, not a hardcoded allow-list:
 *
 *   • /^o[1-9](-|$)/   — o1, o1-mini, o1-pro, o3, o3-mini, o3-pro, o4-mini, …
 *   • /-(pro|deep-research)(\b|$)/ — flagship Responses-API variants (any base model)
 *
 * Permissive chat-completions models (gpt-4o, gpt-5.6-terra, claude-*, …) return false.
 */
function needsStrictSystemHandling(model: string): boolean {
  // Strip optional "openai/" gateway prefix before matching.
  const id = model.startsWith("openai/") ? model.slice("openai/".length) : model;
  // Reasoning / o-series models reject system messages.
  if (/^o[1-9](-|$)/i.test(id)) return true;
  // Explicit Responses-API-only variants (e.g. *-pro, *-deep-research).
  if (/-(pro|deep-research)(\b|$)/i.test(id)) return true;
  return false;
}

// Build the handler once — serviceAdapter, agent and runtime are stateless,
// so a single instance shared across requests is fine.
const gatewayKey = process.env.AI_GATEWAY_API_KEY;
const configuredModel = process.env.OPENAI_CHAT_MODEL ?? "gpt-4o";
const serviceAdapter = gatewayKey
  ? new OpenAIAdapter({
      openai: new OpenAI({
        apiKey: gatewayKey,
        baseURL: "https://ai-gateway.vercel.sh/v1",
      }),
      model: normalizeModelSpec(configuredModel),
    })
  : new OpenAIAdapter({ model: configuredModel });

// Explicit default agent + middleware pipeline. Middleware runs before the
// BuiltInAgent converts input.messages for the AI SDK, so the exact thread
// the SDK validates is always in good shape.
const agent = new BuiltInAgent({ model: serviceAdapter.getLanguageModel() });

const isStrict = needsStrictSystemHandling(configuredModel);

agent.use((input, next) => {
  // ── 1. Orphan repair ────────────────────────────────────────────────────
  // Ensure every assistant tool-call is answered before handing the thread to
  // the AI SDK. Reference-stable: a no-op when nothing needs repair.
  const messages = repairOrphanToolCalls(input.messages);
  if (messages !== input.messages) {
    const injected = messages.length - input.messages.length;
    console.log(
      `[copilotkit] repaired orphaned tool call(s): injected ${injected} synthetic result(s)`,
    );
  }

  // ── 2. Strict-model system-message conversion ────────────────────────────
  // For Responses-API-only models, tell @ai-sdk/openai to emit system messages
  // as "developer" role (accepted) instead of "system" role (rejected). We set
  // this via forwardedProps.providerOptions so it reaches the streamText call
  // inside BuiltInAgent without touching the adapter or runtime internals.
  // For permissive chat-completions models, forwardedProps is passed through
  // unchanged — zero overhead and zero behaviour change for those paths.
  const fp = input.forwardedProps as Record<string, unknown> | undefined;
  const forwardedProps: Record<string, unknown> | undefined = isStrict
    ? {
        ...fp,
        providerOptions: {
          ...(fp?.providerOptions as Record<string, unknown> | undefined),
          openai: {
            // Spread any existing openai-specific options so nothing is clobbered.
            ...((fp?.providerOptions as Record<string, unknown> | undefined)
              ?.openai as Record<string, unknown> | undefined),
            // "developer" role is the Responses-API equivalent of "system".
            systemMessageMode: "developer",
          },
        },
      }
    : fp;

  return next.run({ ...input, messages, forwardedProps });
});

const runtime = new CopilotRuntime({ agents: { default: agent } });

const handler = copilotRuntimeNodeExpressEndpoint({
  runtime,
  serviceAdapter,
  endpoint: "/api/copilotkit",
});

router.use("/", (req, res, next) => {
  // Express strips the mount prefix from req.url. GraphQL Yoga needs the full
  // path to route /api/copilotkit and /api/copilotkit/info correctly.
  req.url = (req.baseUrl || "") + (req.url === "/" ? "" : req.url);

  // The handler return type is Promise<void> | Response | Promise<Response>.
  // Wrap in Promise.resolve() so .catch() is always valid regardless of which
  // branch the runtime takes.
  Promise.resolve(
    handler(
      req as unknown as IncomingMessage,
      res as unknown as ServerResponse,
    ),
  ).catch(next);
});

export default router;
