/**
 * CopilotKit runtime — OpenAI adapter via @copilotkit/runtime.
 *
 * Exposes a GraphQL endpoint that the CopilotKit React SDK streams through.
 * The OpenAIAdapter picks up OPENAI_API_KEY from the environment automatically.
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
import type { IncomingMessage, ServerResponse } from "http";

const router = Router();

// Build the handler once — serviceAdapter and runtime are stateless,
// so a single instance shared across requests is fine.
const serviceAdapter = new OpenAIAdapter({ model: "gpt-4o" });
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
