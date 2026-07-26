/**
 * CopilotKit runtime stub.
 *
 * Intentionally returns 404 so CopilotKit enters "Error" connection status
 * (graceful disconnected mode). In Error status the SDK returns provisional
 * agents with `isReady: false`, which prevents auto-runs and `useAgent`
 * throws — the app renders fully but AI agent features are inactive.
 *
 * The red "Runtime info request failed" banner is suppressed on the frontend
 * by <CopilotErrorSuppressor> (see app-shell.tsx), which dismisses banners
 * whose code is `runtime_info_fetch_failed`.
 *
 * To activate AI features:
 *   1. Set OPENAI_API_KEY (or your LLM provider key) in environment secrets
 *   2. Replace this file with the @copilotkit/runtime Express adapter
 *   3. See https://docs.copilotkit.ai/quickstart
 */
import { Router } from "express";

const router = Router();

// GET /api/copilotkit/info — intentional 404 (disconnected mode).
router.get("/info", (_req, res) => {
  res.status(404).json({ error: "CopilotKit runtime not configured" });
});

// GET /api/copilotkit/threads
router.get("/threads", (_req, res) => {
  res.json({ threads: [], nextCursor: null });
});

// POST /api/copilotkit — intentional 404 (covers single-endpoint info probe
// as well as any chat messages sent before AI is configured).
router.post("/", (_req, res) => {
  res.status(404).json({ error: "CopilotKit runtime not configured" });
});

export default router;
