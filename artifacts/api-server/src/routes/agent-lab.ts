// ─────────────────────────────────────────────────────────────────────────────
// POST /api/agent-lab — the backend the Agent Lab page calls.
//
// Ported from the old Next.js route (app/api/agent-lab/route.ts) into the Express
// api-server. It reuses the SAME runAgent from the web package (resolved via the
// `@` esbuild alias in build.mjs), so the Lab runs the exact agent loop + shared
// tools — no re-implementation, no drift.
// ─────────────────────────────────────────────────────────────────────────────
import { Router } from "express";
import { runAgent } from "@/features/agent-lab/agent";
import type {
  AgentLabDoc,
  AgentLabMessage,
  DocMode,
} from "@/features/agent-lab/catalog";
import { EFFORT_LEVELS, type EffortLevel } from "@/features/agent-lab/model-router";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const body = (req.body ?? {}) as Partial<{
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
      (m): AgentLabMessage => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }),
    );

    const documents = (Array.isArray(body.documents) ? body.documents : []).filter(
      (d): d is AgentLabDoc =>
        typeof d?.name === "string" && typeof d?.text === "string",
    );

    const out = await runAgent({
      model: body.model ?? "gpt-4o",
      system: body.system ?? "",
      temperature: typeof body.temperature === "number" ? body.temperature : 0.7,
      maxSteps: typeof body.maxSteps === "number" ? body.maxSteps : 6,
      enabledTools: Array.isArray(body.enabledTools) ? body.enabledTools : [],
      messages,
      documents,
      docMode: body.docMode === "retrieval" ? "retrieval" : "full",
      effort: EFFORT_LEVELS.includes(body.effort as EffortLevel)
        ? body.effort
        : undefined,
    });

    res.json(out);
  } catch (err) {
    // Surface the message so the page can show it (missing key, bad model id, …).
    req.log.error({ err }, "Agent Lab run failed");
    res
      .status(500)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
