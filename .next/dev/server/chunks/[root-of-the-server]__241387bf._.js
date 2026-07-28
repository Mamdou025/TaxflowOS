module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[project]/app/api/genui/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// GenUI streaming endpoint.
//
// Free-form "generate UI from a prompt": we hand the LLM a system prompt that
// describes our component vocabulary (genuiLibrary.prompt()), then stream its
// OpenUI Lang response back as raw text. The client accumulates that text and
// feeds it to <Renderer>, which mounts real components as tokens arrive.
//
// Reuses the same OPENAI_API_KEY as the CopilotKit runtime. Unlike the CopilotKit
// actions (a fixed set of hardwired renders), here the model composes ANY layout
// from the registered library — no per-request code.
//
// Reliability: emitting the openui-lang DSL (not prose) is the whole game. We
//   (1) default to gpt-4.1 (GENUI_MODEL to override) — it follows the format far
//       more reliably than gpt-4o, which narrates in Markdown for short prompts;
//   (2) sniff the first line of the stream and, if it isn't openui-lang, retry
//       once (non-streaming) with a hard steer. So a prose answer self-heals
//       instead of rendering nothing / a Markdown table.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$6$2e$8$2e$1_ws$40$8$2e$18$2e$3_zod$40$4$2e$1$2e$12$2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/openai@6.8.1_ws@8.18.3_zod@4.1.12/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$6$2e$8$2e$1_ws$40$8$2e$18$2e$3_zod$40$4$2e$1$2e$12$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/openai@6.8.1_ws@8.18.3_zod@4.1.12/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
;
;
;
const runtime = 'nodejs';
// The system prompt is PRE-GENERATED to a text file by features/genui/gen-genui-prompt.cjs
// (pnpm genui:prompt). We can't import the OpenUI library here: @openuidev/react-lang
// calls React.createContext at load, which doesn't exist in the App Router's RSC
// react-server build — importing it in a route handler throws. Reading the txt keeps
// OpenUI entirely on the client. Re-run the script whenever the library changes.
const SYSTEM_PROMPT = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["readFileSync"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(process.cwd(), 'features', 'genui', 'system-prompt.txt'), 'utf8');
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
// gpt-4.1 follows the DSL far more reliably than gpt-4o. Kept separate from the
// CopilotKit runtime's OPENAI_CHAT_MODEL so tuning the generator can't regress chat.
const MODEL = process.env.GENUI_MODEL ?? 'gpt-4.1';
// Strip a leading/trailing Markdown code fence the model sometimes adds.
function stripFences(s) {
    return s.replace(/^\s*```[a-zA-Z]*\n?/, '').replace(/\n?```\s*$/, '');
}
// Is this the openui-lang DSL (an `ident = …` assignment) rather than prose?
function looksLikeLang(s) {
    return /^\s*(root\b|[A-Za-z_][A-Za-z0-9_]*\s*=)/.test(stripFences(s).trimStart());
}
async function POST(req) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return new Response('OPENAI_API_KEY not set in .env.local', {
            status: 500
        });
    }
    const { messages } = await req.json();
    const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$6$2e$8$2e$1_ws$40$8$2e$18$2e$3_zod$40$4$2e$1$2e$12$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
        apiKey
    });
    // One non-streaming retry with the hard steer — used only when the first
    // attempt comes back as prose.
    const retryLang = async ()=>{
        const res = await openai.chat.completions.create({
            model: MODEL,
            temperature: 0,
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT
                },
                {
                    role: 'system',
                    content: HARD_STEER
                },
                ...messages
            ]
        });
        return stripFences(res.choices[0]?.message?.content ?? '');
    };
    // `stream: true as const` pins the streaming overload so `completion` infers as
    // a Stream (async-iterable), not the ChatCompletion|Stream union.
    const openStream = ()=>openai.chat.completions.create({
            model: MODEL,
            stream: true,
            // Deterministic: temperature 0 stops the model from "helpfully" narrating in
            // prose instead of emitting the DSL for short/ambiguous prompts.
            temperature: 0,
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT
                },
                {
                    role: 'system',
                    content: STEER
                },
                ...messages
            ]
        });
    let completion;
    try {
        completion = await openStream();
    } catch (err) {
        // Surface a clear error (e.g. model not available on this key) instead of an
        // opaque 500 that leaves the client's view stuck. GENUI_MODEL overrides MODEL.
        return new Response(`GenUI model "${MODEL}" failed: ${String(err)}. Set GENUI_MODEL in .env.local to a model your key can use.`, {
            status: 502
        });
    }
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start (controller) {
            try {
                let buf = '';
                let decided = false; // have we confirmed the output is openui-lang?
                for await (const chunk of completion){
                    const delta = chunk.choices[0]?.delta?.content;
                    if (!delta) continue;
                    if (decided) {
                        controller.enqueue(encoder.encode(delta));
                        continue;
                    }
                    buf += delta;
                    // Judge once we have the first line (or enough characters).
                    if (buf.includes('\n') || buf.length >= 60) {
                        if (looksLikeLang(buf)) {
                            decided = true;
                            controller.enqueue(encoder.encode(buf));
                        } else {
                            // Prose slipped through → self-heal with one hard-steer retry.
                            controller.enqueue(encoder.encode(await retryLang()));
                            decided = true;
                            break;
                        }
                    }
                }
                // Short output that ended before we judged it.
                if (!decided) {
                    controller.enqueue(encoder.encode(looksLikeLang(buf) ? buf : await retryLang()));
                }
            } catch (err) {
                controller.enqueue(encoder.encode(`\n<!-- stream error: ${String(err)} -->`));
            } finally{
                controller.close();
            }
        }
    });
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache'
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__241387bf._.js.map