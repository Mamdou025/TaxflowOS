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
import { Router } from "express";
import OpenAI from "openai";
import type { IncomingMessage, ServerResponse } from "http";

const router = Router();

// Gateway model ids are "provider/model"; a bare OpenAI id gets an "openai/" prefix.
const normalizeModelSpec = (spec: string): string =>
  spec.includes("/") ? spec : `openai/${spec}`;

// Build the handler once — serviceAdapter and runtime are stateless,
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
