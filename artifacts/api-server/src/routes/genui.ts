// ─────────────────────────────────────────────────────────────────────────────
// POST /api/genui — GenUI streaming endpoint.
//
// Ported from the Next.js route (app/api/genui/route.ts) into the Express
// api-server. Hands the LLM a system prompt describing our OpenUI-Lang component
// vocabulary, then streams the model's DSL response back as raw text. The client
// accumulates it and feeds <Renderer>. Used by BOTH the /genui-lab page and the
// live Sina chat's generative UI (features/genui/genui-render.tsx).
//
// Direct OpenAI (OPENAI_API_KEY), gpt-4.1 — it follows the DSL far more reliably
// than gpt-4o; GENUI_MODEL overrides. The system prompt is bundled at build time
// (esbuild `.txt` text loader) so there is no runtime file dependency here.
//
// Reliability: emitting openui-lang (not prose) is the whole game. We sniff the
// first line of the stream and, if it isn't openui-lang, retry once (non-streaming)
// with a hard steer — so a prose answer self-heals instead of rendering nothing.
// ─────────────────────────────────────────────────────────────────────────────
import { Router } from "express";
import OpenAI from "openai";
import SYSTEM_PROMPT from "@/features/genui/system-prompt.txt";

const router = Router();

type ChatMessage = { role: "user" | "assistant"; content: string };

// Hard steer against prose. gpt-4o ignores the library prompt's "no explanations"
// rule for short inputs and narrates instead — a one-shot example + an explicit
// "first characters" rule pins it back to emitting OpenUI Lang.
const STEER = `CRITICAL OUTPUT RULES — these override any instinct to be conversational:
- Your ENTIRE reply is OpenUI Lang. The FIRST characters must be "root =" or a "name =" line. Never a sentence, heading, bullet, or number list.
- NO markdown, NO code fences (no \`\`\`), NO prose before or after. If you write any explanation, the render fails.
- KPI tiles use TaxMetric(label, value, delta?, tone?) where tone is "neutral" | "positive" | "negative". delta may be null.

VALUES ARE LITERALS — never expressions or code:
- Every value, label, and number is a literal string or number written out in full: "7.2%", "$1.24M", 42. Pre-format numbers YOURSELF into the finished string.
- NEVER write JavaScript in a value: no method calls (.toFixed, .toLocaleString, .map), no arithmetic, no member access, no template strings. OpenUI Lang does NOT evaluate these — it leaks internals like "function toFixed() { [native code] }" into the UI.
- Every identifier you reference MUST be defined on its own line. Never reference a variable (e.g. "revenueDisplay") you didn't define — undefined refs render as garbage. For a two-way editable field, bind the Input to a $variable and define that $variable as a literal (e.g. $rev = "7.2%").

DATA FIDELITY — this is a tax workspace, not a demo (OVERRIDES any "generate plausible data" rule):
- Use ONLY the figures given in the request. NEVER invent, estimate, round, or compute numbers/labels/dates. No arithmetic, no totals, no percentages you weren't handed — every value is pre-computed and passed in already formatted; render it verbatim.
- If a number isn't provided, omit that element. If there's no real data at all, output ONE Callout("info", "No data yet", "…") and nothing else.

COMPONENT DISCIPLINE — the simplest view that fits, nothing gratuitous:
- Don't add charts/tiles/sections that weren't asked for. A few labeled amounts → TaxMetric tiles or a Table, not a chart. A chart only for a real comparison/trend across multiple values.
- Use PieChart ONLY for explicit parts-of-a-whole proportions (3–6 categories) — never to decorate.
- FORBIDDEN components (never emit): Image, ImageBlock, ImageGallery, Carousel, RadarChart, ScatterChart, RadialChart, Modal, and anything decorative/marketing.

LAYOUT — fit a narrow column, don't overflow:
- The UI renders in a chat column ~900px wide. NEVER put more than 3 items in a single "row" Stack. For 4+ tiles/cards, WRAP them: use Stack([...], "row", "m", "start", "start", true) — the 6th positional arg is wrap=true — so they flow onto multiple rows instead of overflowing sideways.
- Prefer vertical Stacks and wrapped rows over wide horizontal ones. Keep each card comfortably narrow.

Example — for "two KPI tiles: Revenue $2.1M up 8%, Costs $1.3M":
root = Stack([tiles], "column", "l")
tiles = Stack([revenue, costs], "row", "m")
revenue = TaxMetric("Revenue", "$2.1M", "8%", "positive")
costs = TaxMetric("Costs", "$1.3M", null, "neutral")

Now produce OpenUI Lang for the user's request the same way — components only.`;

// Even harder steer for the retry after a prose answer slipped through.
const HARD_STEER = `${STEER}

Your PREVIOUS attempt failed: it contained prose or Markdown, which renders NOTHING. This time output openui-lang ONLY. The very first characters of your reply MUST be "root =". No sentence, no heading, no Markdown table, no code fence — the render depends on it.`;

// Prefer the Vercel AI Gateway when its key is set — one key reaches OpenAI (and
// every other provider), so no separate OpenAI account/key is needed. Falls back
// to a direct OpenAI client when only OPENAI_API_KEY is present.
const GATEWAY_KEY = process.env.AI_GATEWAY_API_KEY;
const GATEWAY_BASE_URL = "https://ai-gateway.vercel.sh/v1";

// gpt-4.1 follows the DSL far more reliably than gpt-4o. Kept separate from the
// chat runtime's OPENAI_CHAT_MODEL so tuning the generator can't regress chat.
// Gateway model ids are "provider/model", so a bare id → "openai/…".
const rawModel = process.env.GENUI_MODEL ?? "gpt-4.1";
const MODEL = GATEWAY_KEY && !rawModel.includes("/") ? `openai/${rawModel}` : rawModel;

// Strip a leading/trailing Markdown code fence the model sometimes adds.
function stripFences(s: string): string {
  return s.replace(/^\s*```[a-zA-Z]*\n?/, "").replace(/\n?```\s*$/, "");
}

// Is this the openui-lang DSL (an `ident = …` assignment) rather than prose?
function looksLikeLang(s: string): boolean {
  return /^\s*(root\b|[A-Za-z_][A-Za-z0-9_]*\s*=)/.test(stripFences(s).trimStart());
}

router.post("/", async (req, res) => {
  const directKey = process.env.OPENAI_API_KEY;
  if (!GATEWAY_KEY && !directKey) {
    res.status(500).send("Set AI_GATEWAY_API_KEY or OPENAI_API_KEY in .env.local");
    return;
  }

  const { messages } = (req.body ?? {}) as { messages?: ChatMessage[] };
  const msgs = Array.isArray(messages) ? messages : [];
  const openai = GATEWAY_KEY
    ? new OpenAI({ apiKey: GATEWAY_KEY, baseURL: GATEWAY_BASE_URL })
    : new OpenAI({ apiKey: directKey! });

  // One non-streaming retry with the hard steer — used only when the first
  // attempt comes back as prose.
  const retryLang = async (): Promise<string> => {
    const r = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "system", content: HARD_STEER },
        ...msgs,
      ],
    });
    return stripFences(r.choices[0]?.message?.content ?? "");
  };

  // `stream: true as const` pins the streaming overload so `completion` infers as
  // a Stream (async-iterable), not the ChatCompletion|Stream union.
  const openStream = () =>
    openai.chat.completions.create({
      model: MODEL,
      stream: true as const,
      // Deterministic: temperature 0 stops the model from "helpfully" narrating in
      // prose instead of emitting the DSL for short/ambiguous prompts.
      temperature: 0,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "system", content: STEER },
        ...msgs,
      ],
    });

  let completion: Awaited<ReturnType<typeof openStream>>;
  try {
    completion = await openStream();
  } catch (err) {
    // Surface a clear error (e.g. model not available on this key) instead of an
    // opaque 500 that leaves the client's view stuck. GENUI_MODEL overrides MODEL.
    res
      .status(502)
      .send(
        `GenUI model "${MODEL}" failed: ${String(err)}. Set GENUI_MODEL in .env.local to a model your key can use.`,
      );
    return;
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");

  try {
    let buf = "";
    let decided = false; // have we confirmed the output is openui-lang?
    for await (const chunk of completion) {
      const delta = chunk.choices[0]?.delta?.content;
      if (!delta) continue;
      if (decided) {
        res.write(delta);
        continue;
      }
      buf += delta;
      // Judge once we have the first line (or enough characters).
      if (buf.includes("\n") || buf.length >= 60) {
        if (looksLikeLang(buf)) {
          decided = true;
          res.write(buf);
        } else {
          // Prose slipped through → self-heal with one hard-steer retry.
          res.write(await retryLang());
          decided = true;
          break;
        }
      }
    }
    // Short output that ended before we judged it.
    if (!decided) {
      res.write(looksLikeLang(buf) ? buf : await retryLang());
    }
  } catch (err) {
    res.write(`\n<!-- stream error: ${String(err)} -->`);
  } finally {
    res.end();
  }
});

export default router;
