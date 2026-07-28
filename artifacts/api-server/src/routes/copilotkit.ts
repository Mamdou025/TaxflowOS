/**
 * CopilotKit runtime — OpenAI adapter via @copilotkit/runtime.
 *
 * Exposes a GraphQL endpoint that the CopilotKit React SDK streams through.
 *
 * Model / key resolution (first match wins):
 *   1. AI_GATEWAY_API_KEY  → Vercel AI Gateway OpenAI-compatible endpoint
 *      Base URL: https://ai-gateway.vercel.sh/v1/openai
 *      Model:    ASSISTANT_MODEL_FAST (default: gpt-5.6-luna)
 *   2. OPENAI_API_KEY      → direct OpenAI
 *      Model:    OPENAI_CHAT_MODEL   (default: gpt-4o)
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
import OpenAI from "openai";
import { Router } from "express";
import type { IncomingMessage, ServerResponse } from "http";

const router = Router();

// Build the OpenAI client: prefer the Vercel AI Gateway so the same key that
// powers agent-lab drives the CopilotKit chat too. Fall back to direct OpenAI
// if only OPENAI_API_KEY is present (e.g. local dev without gateway access).
function buildOpenAIClient(): { client: OpenAI; model: string } {
  const gatewayKey = process.env.AI_GATEWAY_API_KEY;
  if (gatewayKey) {
    return {
      client: new OpenAI({
        apiKey: gatewayKey,
        baseURL: "https://ai-gateway.vercel.sh/v1/openai",
      }),
      model: process.env.ASSISTANT_MODEL_FAST ?? "gpt-5.6-luna",
    };
  }
  return {
    client: new OpenAI(), // reads OPENAI_API_KEY automatically
    model: process.env.OPENAI_CHAT_MODEL ?? "gpt-4o",
  };
}

const { client: openaiClient, model: chatModel } = buildOpenAIClient();

// Build the handler once — serviceAdapter and runtime are stateless,
// so a single instance shared across requests is fine.
const serviceAdapter = new OpenAIAdapter({ openai: openaiClient, model: chatModel });
const runtime = new CopilotRuntime();

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
