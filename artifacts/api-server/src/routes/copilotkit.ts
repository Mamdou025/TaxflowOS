/**
 * CopilotKit runtime stub.
 *
 * The stub intentionally returns 404 so CopilotKit gracefully degrades to
 * "disconnected" mode — the app renders fully without AI agent features.
 * Wire up a real LangGraph/OpenAI agent to activate the AI runtime:
 *
 *   1. Set OPENAI_API_KEY (or your LLM provider key) in environment secrets
 *   2. Replace this file with the @copilotkit/runtime Express adapter
 *   3. See https://docs.copilotkit.ai/quickstart
 *
 * When CopilotKit receives 404 it logs a warning and sets runtimeStatus to
 * "Disconnected" — the UI still renders but AI chat is inactive.
 */
import { Router } from "express";

const router = Router();

// GET /api/copilotkit/info  — intentional 404 so CopilotKit gracefully disconnects
// (returning any 2xx here with agents:{} causes the SDK to try to establish a
// streaming AG-UI connection; our stub can't handle that, so we let it fail-safe)
router.get("/info", (_req, res) => {
  res.status(404).json({ error: "CopilotKit runtime not configured" });
});

// GET /api/copilotkit/threads
router.get("/threads", (_req, res) => {
  res.json({ threads: [], nextCursor: null });
});

// POST /api/copilotkit
router.post("/", (_req, res) => {
  res.status(404).json({ error: "CopilotKit runtime not configured" });
});

export default router;
