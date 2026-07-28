(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/agent-lab/catalog.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Agent Lab — CLIENT-SAFE catalog (no secrets, no server imports).
//
// This file is imported by BOTH the builder page (browser) and the server, so it
// must contain ONLY plain data + types. The actual tool code lives in tools.ts;
// the run loop lives in agent.ts. Keep the TOOL_CATALOG ids in sync with tools.ts.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "AGENT_NAME",
    ()=>AGENT_NAME,
    "CATEGORY_HINT",
    ()=>CATEGORY_HINT,
    "CATEGORY_LABEL",
    ()=>CATEGORY_LABEL,
    "DEFAULT_SYSTEM_PROMPT",
    ()=>DEFAULT_SYSTEM_PROMPT,
    "MODEL_OPTIONS",
    ()=>MODEL_OPTIONS,
    "TOOL_CATALOG",
    ()=>TOOL_CATALOG
]);
const AGENT_NAME = 'Sina';
const DEFAULT_SYSTEM_PROMPT = `You are ${AGENT_NAME}, a helpful, precise agent used to evaluate how agents work. ` + `You have tools available — call a tool whenever it helps you answer accurately ` + `instead of guessing. When you use a tool, briefly say what you did and what you ` + `found. Be concise and honest about uncertainty.`;
const MODEL_OPTIONS = [
    // Direct OpenAI (uses OPENAI_API_KEY — no gateway needed)
    {
        id: 'gpt-4o',
        label: 'gpt-4o — direct OpenAI',
        via: 'openai',
        blurb: 'Fast, capable multimodal — a reliable general default.'
    },
    {
        id: 'gpt-4o-mini',
        label: 'gpt-4o-mini — direct OpenAI',
        via: 'openai',
        blurb: 'Cheapest OpenAI — good for simple, high-volume tasks.'
    },
    {
        id: 'gpt-5',
        label: 'gpt-5 — direct OpenAI',
        via: 'openai',
        blurb: "OpenAI's frontier — strongest general reasoning."
    },
    // Via the Vercel AI Gateway (uses AI_GATEWAY_API_KEY). One key → any model at
    // vercel.com/ai-gateway/models — paste any "provider/model" id in the custom box.
    {
        id: 'openai/gpt-5.6-sol',
        label: 'openai/gpt-5.6-sol — Gateway',
        via: 'gateway',
        blurb: 'OpenAI frontier tier, via the gateway.'
    },
    {
        id: 'anthropic/claude-haiku-4-5',
        label: 'anthropic/claude-haiku-4-5 — Gateway',
        via: 'gateway',
        blurb: 'Anthropic — fastest & cheapest. Quick reads / extraction / high volume (200K context).'
    },
    {
        id: 'anthropic/claude-sonnet-5',
        label: 'anthropic/claude-sonnet-5 — Gateway',
        via: 'gateway',
        blurb: 'Anthropic — near-Opus quality at Sonnet cost. Everyday default (1M context).'
    },
    {
        id: 'anthropic/claude-opus-4-8',
        label: 'anthropic/claude-opus-4-8 — Gateway',
        via: 'gateway',
        blurb: 'Anthropic — flagship reasoning. Tax logic & subtle cross-references (1M context).'
    },
    {
        id: 'anthropic/claude-fable-5',
        label: 'anthropic/claude-fable-5 — Gateway',
        via: 'gateway',
        blurb: 'Anthropic — most capable overall (premium). Reserve for the very hardest reasoning.'
    },
    {
        id: 'google/gemini-3.6-flash',
        label: 'google/gemini-3.6-flash — Gateway',
        via: 'gateway',
        blurb: 'Google — very fast & cheap, huge context window.'
    },
    {
        id: 'xai/grok-4.5',
        label: 'xai/grok-4.5 — Gateway',
        via: 'gateway',
        blurb: 'xAI — strong reasoning with fresh knowledge.'
    },
    {
        id: 'moonshotai/kimi-k3',
        label: 'moonshotai/kimi-k3 — Gateway',
        via: 'gateway',
        blurb: 'Moonshot — very long context, strong at coding.'
    },
    {
        id: 'zai/glm-5.2',
        label: 'zai/glm-5.2 — Gateway',
        via: 'gateway',
        blurb: 'Zhipu — capable general model, cost-effective.'
    }
];
const CATEGORY_LABEL = {
    template: 'Template / demo tools',
    real: 'Your real capabilities',
    retrieval: 'Document retrieval (RAG)',
    'workflow-template': 'Template workflows',
    'workflow-action': 'Workflow-builder actions'
};
const CATEGORY_HINT = {
    template: 'Safe sandbox — always work, nothing to break. Best for learning how tool calls fire.',
    real: 'Hit live data / your real integrations. Real output.',
    retrieval: 'Search big attached files by keyword and pull only the matching passages into context — instead of loading the whole file. Watch it fire in the provenance panel.',
    'workflow-template': 'Multi-input calculations. Give the inputs by typing them or attaching a file, then ask the agent to run it.',
    'workflow-action': 'Your builder actions (focusBlock, addBlock…). On THIS page they only echo the call — they act for real on the workflow-builder canvas.'
};
const TOOL_CATALOG = [
    {
        id: 'getCurrentDateTime',
        label: 'Current date & time',
        category: 'template',
        real: true,
        desc: 'Returns the server date/time.'
    },
    {
        id: 'calculate',
        label: 'Calculator',
        category: 'template',
        real: true,
        desc: 'Evaluates basic arithmetic like 18% of 240.'
    },
    {
        id: 'getWeatherDemo',
        label: 'Weather (demo)',
        category: 'template',
        real: false,
        desc: 'Fake weather data so you can watch a tool fire.'
    },
    {
        id: 'rememberNote',
        label: 'Remember a note',
        category: 'template',
        real: true,
        desc: 'Saves a note in memory (resets when the server restarts).'
    },
    {
        id: 'recallNotes',
        label: 'Recall notes',
        category: 'template',
        real: true,
        desc: 'Lists notes saved this session.'
    },
    {
        id: 'getFxRate',
        label: 'FX rate (Bank of Canada)',
        category: 'real',
        real: true,
        desc: 'Live annual-average exchange rate — your real FAPI source.'
    },
    {
        id: 'fetchWebPage',
        label: 'Fetch web page',
        category: 'real',
        real: true,
        desc: 'Fetches a public URL and returns its readable text (up to ~15k chars).'
    },
    {
        id: 'searchCanadianTax',
        label: 'CRA / canada.ca tax lookup',
        category: 'real',
        real: true,
        desc: 'Live web search restricted to official Canadian tax sources (canada.ca, CRA). Returns titles + URLs + snippets to cite. Needs FIRECRAWL_API_KEY.'
    },
    {
        id: 'searchDocuments',
        label: 'Search documents (keyword RAG)',
        category: 'retrieval',
        real: true,
        desc: 'Keyword-search your attached files and return only the most relevant passages. Lets the agent read files too big to load whole.'
    },
    {
        id: 'estimateForeignIncomeTax',
        label: 'Foreign-income tax estimate (3 inputs)',
        category: 'workflow-template',
        real: true,
        desc: 'Give income + currency + year → converts to CAD (live FX) and estimates combined corporate tax with a $500k small-business threshold.'
    },
    {
        id: 'focusBlock',
        label: 'focusBlock',
        category: 'workflow-action',
        real: false,
        desc: 'Builder action — echoes the call here (acts for real on the canvas).'
    },
    {
        id: 'addBlock',
        label: 'addBlock',
        category: 'workflow-action',
        real: false,
        desc: 'Builder action — echoes the call so you can see the agent choose it.'
    },
    {
        id: 'editBlockConfig',
        label: 'editBlockConfig',
        category: 'workflow-action',
        real: false,
        desc: 'Builder action — echoes the call.'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/agent-lab/model-router.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Agent Lab — MODEL ROUTER (client-safe: pure logic, no secrets, no server imports).
//
// One place that decides, per selected model, WHICH provider knobs to send. The
// Agent Lab lets you pick any model; different families want different treatment:
//
//   • effort — Anthropic's thinking-depth dial (low → max). The main quality/cost
//     lever. NOT every model accepts it: Haiku 4.5 and Sonnet 4.5 error if it's sent.
//   • prompt caching — cache the big system/doc block so repeated runs read it at
//     ~10% of input price instead of paying full price every turn. The single biggest
//     token-cost lever for a "read the same statute repeatedly" workload.
//   • temperature safety — the 5-era / 4.7+ Anthropic family (Opus 4.7/4.8, Sonnet 5,
//     Fable 5) REJECTS a non-default temperature with a 400. The router tells the
//     runtime not to send it, so picking Opus/Sonnet no longer breaks the call.
//
// Everything here maps onto @ai-sdk/anthropic provider options, forwarded through the
// Vercel AI Gateway (providerOptions.anthropic.{effort,cacheControl,…}).
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "AUTO_MODEL_ID",
    ()=>AUTO_MODEL_ID,
    "EFFORT_LEVELS",
    ()=>EFFORT_LEVELS,
    "planForModel",
    ()=>planForModel,
    "routeAuto",
    ()=>routeAuto
]);
const EFFORT_LEVELS = [
    'low',
    'medium',
    'high',
    'xhigh',
    'max'
];
// Accept both gateway strings ("anthropic/claude-opus-4-8") and bare ids ("claude-…").
function anthropicModel(modelId) {
    const id = modelId.trim().toLowerCase();
    if (id.startsWith('anthropic/')) return id.slice('anthropic/'.length);
    if (id.startsWith('claude')) return id;
    return null;
}
// The 5-era / 4.7+ family rejects a non-default temperature (and top_p/top_k) with a 400.
// Opus 4.6, Sonnet 4.6, Haiku 4.5 and older still accept sampling params.
const REJECTS_SAMPLING = /^claude-(opus-4-[78]|sonnet-5|fable-5|mythos-5)\b/;
// `effort` is supported on Opus 4.5+, Sonnet 4.6, Sonnet 5, Fable 5 — and ERRORS on
// Haiku 4.5 and Sonnet 4.5. Send it only where it's accepted.
const SUPPORTS_EFFORT = /^claude-(opus-4-[5678]|sonnet-4-6|sonnet-5|fable-5|mythos-5)\b/;
function planForModel(modelId, opts) {
    const anth = anthropicModel(modelId);
    // Non-Anthropic (direct OpenAI or any other gateway provider): preserve today's behavior.
    if (!anth) {
        return {
            provider: modelId.includes('/') ? 'gateway-other' : 'openai',
            sendTemperature: true,
            supportsEffort: false,
            cacheSystem: false
        };
    }
    const supportsEffort = SUPPORTS_EFFORT.test(anth);
    const effort = supportsEffort ? opts?.effort : undefined;
    const anthropicOpts = {};
    if (effort) {
        anthropicOpts.effort = effort;
    }
    const providerOptions = Object.keys(anthropicOpts).length > 0 ? {
        anthropic: anthropicOpts
    } : undefined;
    return {
        provider: 'anthropic',
        sendTemperature: !REJECTS_SAMPLING.test(anth),
        supportsEffort,
        effort,
        cacheSystem: true,
        providerOptions
    };
}
const AUTO_MODEL_ID = 'sina-auto';
// Each tier → an Anthropic tier + a sensible effort. Mirrors the tax-workload advice:
// quick reads → Haiku, everyday Q&A → Sonnet, cross-references → Sonnet+high, tax logic → Opus.
const TIER_MODEL = {
    quick: {
        model: 'anthropic/claude-haiku-4-5'
    },
    balanced: {
        model: 'anthropic/claude-sonnet-5'
    },
    reasoning: {
        model: 'anthropic/claude-sonnet-5',
        effort: 'high'
    },
    deep: {
        model: 'anthropic/claude-opus-4-8',
        effort: 'high'
    }
};
// Task-shape signals. Precedence: deep(calc) → reasoning → quick(short lookup) → deep(statute) → balanced.
const CALC = /\b(calculat|comput|reconcil|elect(ed|ion)?|deduct|withhold|estimat|amortiz|how much|arm'?s.?length|capital gain|small.?business|tax owing|net amount|amount of)/i;
const REASON = /\b(compare|comparison|differ|relationship|relate|\bbetween\b|versus|\bvs\.?\b|analy|implicat|consisten|contradic|conflict|\bwhy\b|justif|connect|\blink\b|depend|impact|affect|trade.?off)/i;
const LOOKUP = /\b(extract|find|list|look ?up|search|what is|what'?s the|how many|when (is|was|did|does)|which|who is|where|name of|value of|date of|show me)/i;
const STATUTE = /\b(section|subsection|paragraph|t2057|t1134|t106|eifel|part\s?xiii|treaty|deem(ing)?|foreign accrual|\bfapi\b|rollover|roulement|surplus|\bpbr\b|\bfmv\b|\bjvm\b)/i;
function routeAuto(text, ctx) {
    const t = (text || '').trim();
    const short = t.length < 220;
    let tier;
    let reason;
    if (CALC.test(t)) {
        tier = 'deep';
        reason = 'tax calculation / figure work';
    } else if (REASON.test(t)) {
        tier = 'reasoning';
        reason = 'compare / find the logic between elements';
    } else if (LOOKUP.test(t) && short) {
        tier = 'quick';
        reason = ctx?.hasDocs ? 'short lookup over attached docs' : 'short factual lookup';
    } else if (STATUTE.test(t)) {
        tier = 'deep';
        reason = 'statutory / tax-law reasoning';
    } else {
        tier = 'balanced';
        reason = 'general question';
    }
    const pick = TIER_MODEL[tier];
    return {
        model: pick.model,
        effort: pick.effort,
        tier,
        reason
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/agent-lab/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AgentLabPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// ─────────────────────────────────────────────────────────────────────────────
// Agent Lab — the builder page (browser).
//
// Left  = config: a Models reference, the sectioned system prompt, a MEMORY panel
//         (attach files/docs → context), tools, an ACCESS panel (what the agent can
//         see + a live context-size meter), and a NOTES pad.
// Right = one OR MORE chat columns ("lanes"), each running the SAME agent config on
//         a DIFFERENT model. One shared composer sends your message to every column
//         at once, so you can compare models side by side. Under each answer a
//         PROVENANCE panel shows where it came from (tools / documents / model).
//
// Standalone: rendered without the global nav (see components/app-shell.tsx),
// calls POST /api/agent-lab, and does NOT use or affect the main CopilotKit chat.
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/agent-lab/catalog.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$model$2d$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/agent-lab/model-router.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const CATEGORY_ORDER = [
    'template',
    'real',
    'retrieval',
    'workflow-template',
    'workflow-action'
];
const ACCEPT = '.pdf,.docx,.xlsx,.xls,.txt,.md,.markdown,.csv,.tsv,.json,.log,.yml,.yaml,.xml,.html,.htm,.rtf';
const MAX_DOC_CHARS = 120_000;
const MAX_LANES = 3;
async function extractFile(file) {
    const isExcel = /\.(xlsx|xls)$/i.test(file.name) || file.type.includes('spreadsheetml') || file.type === 'application/vnd.ms-excel';
    if (isExcel) {
        try {
            const XLSX = await __turbopack_context__.A("[project]/node_modules/.pnpm/xlsx@0.18.5/node_modules/xlsx/xlsx.mjs [app-client] (ecmascript, async loader)");
            const wb = XLSX.read(await file.arrayBuffer(), {
                type: 'array'
            });
            const parts = wb.SheetNames.map((n)=>`# Sheet: ${n}\n${XLSX.utils.sheet_to_csv(wb.Sheets[n])}`);
            let text = parts.join('\n\n');
            if (!text.trim()) {
                return {
                    error: 'the workbook has no readable cells'
                };
            }
            const truncated = text.length > MAX_DOC_CHARS;
            if (truncated) {
                text = text.slice(0, MAX_DOC_CHARS);
            }
            return {
                name: file.name,
                text,
                chars: text.length,
                truncated
            };
        } catch (e) {
            return {
                error: e instanceof Error ? e.message : 'could not read the workbook'
            };
        }
    }
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/assistant/extract', {
        method: 'POST',
        body: fd
    });
    const data = await res.json();
    const text = data.text;
    if (data.error || !text) {
        return {
            error: data.error ?? 'no readable text found'
        };
    }
    return {
        name: data.fileName ?? file.name,
        text,
        chars: data.chars ?? text.length,
        truncated: !!data.truncated
    };
}
const DEFAULT_SECTIONS = [
    {
        id: 'role',
        name: 'Role',
        enabled: true,
        content: 'You are Sina, a helpful, precise agent used to evaluate how agents work.'
    },
    {
        id: 'tools',
        name: 'Tool use',
        enabled: true,
        content: 'You have tools available — call a tool whenever it helps you answer accurately instead of guessing. When you use a tool, briefly say what you did and what you found.'
    },
    {
        id: 'style',
        name: 'Style',
        enabled: true,
        content: 'Be concise and honest about uncertainty.'
    }
];
function assembleSystemPrompt(sections) {
    return sections.filter((s)=>s.enabled && s.content.trim()).map((s)=>s.name.trim() ? `## ${s.name.trim()}\n${s.content.trim()}` : s.content.trim()).join('\n\n');
}
function AgentLabPage() {
    _s();
    const [temperature, setTemperature] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0.7);
    const [maxSteps, setMaxSteps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(6);
    // Effort = Anthropic thinking-depth dial. 'auto' → don't send it (model default).
    // Ignored for non-Anthropic models and for Haiku 4.5 / Sonnet 4.5 (see model-router).
    const [effort, setEffort] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('auto');
    const [enabled, setEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Object.fromEntries(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOOL_CATALOG"].map({
        "AgentLabPage.useState": (t)=>[
                t.id,
                true
            ]
    }["AgentLabPage.useState"])));
    // Chat columns. One lane by default; add up to MAX_LANES for side-by-side compare.
    const [lanes, setLanes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: 'lane-1',
            model: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODEL_OPTIONS"][0].id,
            customModel: '',
            messages: [],
            loading: false
        }
    ]);
    // The system prompt, authored as toggleable SECTIONS ("folders") for one agent.
    const [sections, setSections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_SECTIONS);
    const [sectionsLoaded, setSectionsLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const system = assembleSystemPrompt(sections);
    // A library of named prompt sets (separate from the auto-persisted current set).
    const [savedPrompts, setSavedPrompts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [savedLoaded, setSavedLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saveName, setSaveName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedSaved, setSelectedSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [docs, setDocs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [extracting, setExtracting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [docMode, setDocMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('full');
    const [inputText, setInputText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Load/save your notes locally so they survive a refresh.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgentLabPage.useEffect": ()=>{
            const saved = localStorage.getItem('agent-lab-notes');
            if (saved) {
                setNotes(saved);
            }
        }
    }["AgentLabPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgentLabPage.useEffect": ()=>{
            localStorage.setItem('agent-lab-notes', notes);
        }
    }["AgentLabPage.useEffect"], [
        notes
    ]);
    // Load saved sections once; then persist any change.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgentLabPage.useEffect": ()=>{
            try {
                const raw = localStorage.getItem('agent-lab-sections');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setSections(parsed);
                    }
                }
            } catch  {
            // ignore malformed storage
            }
            setSectionsLoaded(true);
        }
    }["AgentLabPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgentLabPage.useEffect": ()=>{
            if (!sectionsLoaded) {
                return;
            }
            localStorage.setItem('agent-lab-sections', JSON.stringify(sections));
        }
    }["AgentLabPage.useEffect"], [
        sections,
        sectionsLoaded
    ]);
    // The saved-prompt library — load once, then persist any change.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgentLabPage.useEffect": ()=>{
            try {
                const raw = localStorage.getItem('agent-lab-saved-prompts');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        setSavedPrompts(parsed);
                    }
                }
            } catch  {
            // ignore malformed storage
            }
            setSavedLoaded(true);
        }
    }["AgentLabPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgentLabPage.useEffect": ()=>{
            if (!savedLoaded) {
                return;
            }
            localStorage.setItem('agent-lab-saved-prompts', JSON.stringify(savedPrompts));
        }
    }["AgentLabPage.useEffect"], [
        savedPrompts,
        savedLoaded
    ]);
    const enabledTools = Object.keys(enabled).filter((k)=>enabled[k]);
    const activeDocs = docs.filter((d)=>d.enabled);
    const anyLoading = lanes.some((l)=>l.loading);
    const allEmpty = lanes.every((l)=>l.messages.length === 0);
    // Live estimate of the context sent this turn (system + docs + longest conversation).
    const docChars = docMode === 'full' ? activeDocs.reduce((sum, d)=>sum + d.text.length, 0) : 0;
    const convoChars = Math.max(0, ...lanes.map((l)=>l.messages.reduce((s, m)=>s + m.content.length, 0)));
    const convoCount = Math.max(0, ...lanes.map((l)=>l.messages.length));
    const contextChars = system.length + docChars + convoChars;
    const estTokens = Math.round(contextChars / 4);
    // ── section helpers ──────────────────────────────────────────────
    function updateSection(id, patch) {
        setSections((prev)=>prev.map((s)=>s.id === id ? {
                    ...s,
                    ...patch
                } : s));
    }
    function addSection() {
        setSections((prev)=>[
                ...prev,
                {
                    id: crypto.randomUUID(),
                    name: 'New section',
                    content: '',
                    enabled: true
                }
            ]);
    }
    function removeSection(id) {
        setSections((prev)=>prev.filter((s)=>s.id !== id));
    }
    function moveSection(id, dir) {
        setSections((prev)=>{
            const i = prev.findIndex((s)=>s.id === id);
            const j = i + dir;
            if (i < 0 || j < 0 || j >= prev.length) {
                return prev;
            }
            const next = [
                ...prev
            ];
            const [item] = next.splice(i, 1);
            next.splice(j, 0, item);
            return next;
        });
    }
    // ── saved prompt library ─────────────────────────────────────────
    function saveCurrentPrompt() {
        const name = saveName.trim();
        if (!name) {
            return;
        }
        // Overwrite a same-named entry; otherwise add a new one.
        setSavedPrompts((prev)=>{
            const existing = prev.find((p)=>p.name === name);
            const entry = {
                id: existing?.id ?? crypto.randomUUID(),
                name,
                sections
            };
            return existing ? prev.map((p)=>p.name === name ? entry : p) : [
                ...prev,
                entry
            ];
        });
        setSaveName('');
    }
    function loadSavedPrompt(id) {
        const found = savedPrompts.find((p)=>p.id === id);
        if (found) {
            setSections(found.sections.map((s)=>({
                    ...s
                })));
        }
    }
    function deleteSavedPrompt(id) {
        setSavedPrompts((prev)=>prev.filter((p)=>p.id !== id));
        setSelectedSaved('');
    }
    // ── lane helpers ─────────────────────────────────────────────────
    function updateLane(id, patch) {
        setLanes((prev)=>prev.map((l)=>l.id === id ? {
                    ...l,
                    ...patch
                } : l));
    }
    function addLane() {
        setLanes((prev)=>{
            if (prev.length >= MAX_LANES) {
                return prev;
            }
            const nextModel = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODEL_OPTIONS"][prev.length % __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODEL_OPTIONS"].length].id;
            return [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    model: nextModel,
                    customModel: '',
                    messages: [],
                    loading: false
                }
            ];
        });
    }
    function removeLane(id) {
        setLanes((prev)=>prev.length <= 1 ? prev : prev.filter((l)=>l.id !== id));
    }
    function clearAll() {
        setLanes((prev)=>prev.map((l)=>({
                    ...l,
                    messages: []
                })));
    }
    // ── documents ────────────────────────────────────────────────────
    async function addFiles(files) {
        if (!files || files.length === 0) {
            return;
        }
        setExtracting(true);
        setError('');
        for (const file of Array.from(files)){
            try {
                const result = await extractFile(file);
                if ('error' in result) {
                    setError(`${file.name}: ${result.error}`);
                    continue;
                }
                setDocs((prev)=>[
                        ...prev,
                        {
                            ...result,
                            enabled: true
                        }
                    ]);
            } catch (e) {
                setError(e instanceof Error ? e.message : String(e));
            }
        }
        setExtracting(false);
    }
    function toggleDoc(index) {
        setDocs((prev)=>prev.map((d, i)=>i === index ? {
                    ...d,
                    enabled: !d.enabled
                } : d));
    }
    function removeDoc(index) {
        setDocs((prev)=>prev.filter((_, i)=>i !== index));
    }
    // ── send the same message to every lane, each on its own model ──
    function send() {
        const text = inputText.trim();
        if (!text || anyLoading) {
            return;
        }
        setError('');
        setInputText('');
        const turnDocs = activeDocs.map((d)=>({
                name: d.name,
                text: d.text
            }));
        const docNames = activeDocs.map((d)=>d.name);
        const snapshot = lanes;
        const userMsg = {
            role: 'user',
            content: text
        };
        // Optimistic: show the user message + spinner in every column.
        setLanes((prev)=>prev.map((l)=>({
                    ...l,
                    messages: [
                        ...l.messages,
                        userMsg
                    ],
                    loading: true
                })));
        for (const lane of snapshot){
            const laneModel = lane.customModel.trim() || lane.model;
            const nextMessages = [
                ...lane.messages,
                userMsg
            ];
            const turnContext = {
                model: laneModel,
                system,
                enabledTools,
                messageCount: nextMessages.length,
                documents: docNames,
                effort
            };
            void (async ()=>{
                try {
                    const res = await fetch('/api/agent-lab', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model: laneModel,
                            system,
                            temperature,
                            maxSteps,
                            enabledTools,
                            messages: nextMessages.map((m)=>({
                                    role: m.role,
                                    content: m.content
                                })),
                            documents: turnDocs,
                            docMode,
                            effort: effort === 'auto' ? undefined : effort
                        })
                    });
                    const data = await res.json();
                    const assistantMsg = data.error ? {
                        role: 'assistant',
                        content: `⚠️ ${data.error}`
                    } : {
                        role: 'assistant',
                        content: data.text,
                        steps: data.steps,
                        usage: data.usage,
                        docContext: data.docContext,
                        context: turnContext
                    };
                    setLanes((prev)=>prev.map((l)=>l.id === lane.id ? {
                                ...l,
                                loading: false,
                                messages: [
                                    ...l.messages,
                                    assistantMsg
                                ]
                            } : l));
                } catch (e) {
                    const msg = {
                        role: 'assistant',
                        content: `⚠️ ${e instanceof Error ? e.message : String(e)}`
                    };
                    setLanes((prev)=>prev.map((l)=>l.id === lane.id ? {
                                ...l,
                                loading: false,
                                messages: [
                                    ...l.messages,
                                    msg
                                ]
                            } : l));
                }
            })();
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto max-w-7xl px-4 pb-16 text-neutral-900 dark:text-neutral-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: fileInputRef,
                type: "file",
                multiple: true,
                accept: ACCEPT,
                className: "hidden",
                onChange: (e)=>{
                    addFiles(e.target.files);
                    e.target.value = '';
                }
            }, void 0, false, {
                fileName: "[project]/app/agent-lab/page.tsx",
                lineNumber: 382,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "sticky top-0 z-10 -mx-4 mb-4 flex items-center gap-3 border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800",
                        children: "← Back to main"
                    }, void 0, false, {
                        fileName: "[project]/app/agent-lab/page.tsx",
                        lineNumber: 386,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-base font-semibold",
                                children: [
                                    "🤖 ",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGENT_NAME"],
                                    " — Agent Lab"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 390,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] text-neutral-500 dark:text-neutral-400",
                                children: "Configure the agent once, then compare it across models side by side."
                            }, void 0, false, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 391,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/agent-lab/page.tsx",
                        lineNumber: 389,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/agent-lab/page.tsx",
                lineNumber: 385,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 gap-4 lg:grid-cols-[400px_1fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                title: "Models — pick one per column",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mb-2 text-[11px] text-neutral-500 dark:text-neutral-400",
                                        children: [
                                            "Rough guidance — exact context window & pricing are on",
                                            ' ',
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "https://vercel.com/ai-gateway/models",
                                                target: "_blank",
                                                rel: "noreferrer",
                                                className: "underline",
                                                children: "the gateway catalog ↗"
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 403,
                                                columnNumber: 15
                                            }, this),
                                            ". Gateway models need ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: "AI_GATEWAY_API_KEY"
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 406,
                                                columnNumber: 37
                                            }, this),
                                            "; type any ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: "provider/model"
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 406,
                                                columnNumber: 79
                                            }, this),
                                            " id in a column's custom box."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 401,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1.5",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODEL_OPTIONS"].map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[12px]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-mono text-[11px]",
                                                                children: m.id
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                                lineNumber: 412,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `rounded px-1 text-[10px] ${m.via === 'gateway' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}`,
                                                                children: m.via === 'gateway' ? 'Gateway' : 'Direct'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                                lineNumber: 413,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 411,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-neutral-500 dark:text-neutral-400",
                                                        children: m.blurb
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 419,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, m.id, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 410,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 408,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 400,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                title: "System prompt — sections (folders)",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-2 flex flex-col gap-1.5 border-b border-neutral-200 pb-2 dark:border-neutral-800",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        className: `${fieldClass} flex-1`,
                                                        value: selectedSaved,
                                                        onChange: (e)=>setSelectedSaved(e.target.value),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "— load a saved prompt —"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                                lineNumber: 429,
                                                                columnNumber: 19
                                                            }, this),
                                                            savedPrompts.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: p.id,
                                                                    children: p.name
                                                                }, p.id, false, {
                                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                                    lineNumber: 431,
                                                                    columnNumber: 21
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 428,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>{
                                                            if (selectedSaved) {
                                                                loadSavedPrompt(selectedSaved);
                                                            }
                                                        },
                                                        disabled: !selectedSaved,
                                                        className: smallBtn,
                                                        children: "Load"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 436,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>{
                                                            if (selectedSaved) {
                                                                deleteSavedPrompt(selectedSaved);
                                                            }
                                                        },
                                                        disabled: !selectedSaved,
                                                        className: smallBtn,
                                                        children: "Delete"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 448,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 427,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        className: `${fieldClass} flex-1`,
                                                        placeholder: "Name to save these sections…",
                                                        value: saveName,
                                                        onChange: (e)=>setSaveName(e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 462,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: saveCurrentPrompt,
                                                        disabled: !saveName.trim(),
                                                        className: smallBtn,
                                                        children: "💾 Save"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 463,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 461,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 426,
                                        columnNumber: 13
                                    }, this),
                                    sections.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-2 rounded-lg border border-neutral-200 p-2 dark:border-neutral-800",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: s.enabled,
                                                            onChange: (e)=>updateSection(s.id, {
                                                                    enabled: e.target.checked
                                                                }),
                                                            title: "include this section in the prompt"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/agent-lab/page.tsx",
                                                            lineNumber: 471,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            className: "flex-1 bg-transparent text-[12px] font-semibold outline-none",
                                                            value: s.name,
                                                            onChange: (e)=>updateSection(s.id, {
                                                                    name: e.target.value
                                                                }),
                                                            placeholder: "Section name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/agent-lab/page.tsx",
                                                            lineNumber: 472,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>moveSection(s.id, -1),
                                                            disabled: i === 0,
                                                            className: tinyBtn,
                                                            title: "move up",
                                                            children: "↑"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/agent-lab/page.tsx",
                                                            lineNumber: 478,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>moveSection(s.id, 1),
                                                            disabled: i === sections.length - 1,
                                                            className: tinyBtn,
                                                            title: "move down",
                                                            children: "↓"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/agent-lab/page.tsx",
                                                            lineNumber: 481,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>removeSection(s.id),
                                                            className: tinyBtn,
                                                            title: "remove section",
                                                            children: "×"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/agent-lab/page.tsx",
                                                            lineNumber: 484,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 470,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    className: `${fieldClass} mt-1.5 min-h-[70px] resize-y ${s.enabled ? '' : 'opacity-50'}`,
                                                    value: s.content,
                                                    onChange: (e)=>updateSection(s.id, {
                                                            content: e.target.value
                                                        }),
                                                    placeholder: "Instructions for this section…"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 488,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, s.id, true, {
                                            fileName: "[project]/app/agent-lab/page.tsx",
                                            lineNumber: 469,
                                            columnNumber: 15
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: addSection,
                                        className: "rounded-lg border border-neutral-300 px-3 py-1.5 text-[13px] hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800",
                                        children: "+ Add section"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 496,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-[11px] text-neutral-500 dark:text-neutral-400",
                                        children: [
                                            "Combined (in order) into ONE system prompt, shared by every model column. Your current sections auto-save and survive a refresh; use ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: "💾 Save"
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 501,
                                                columnNumber: 52
                                            }, this),
                                            " above to keep multiple named versions."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 499,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 425,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                title: "Memory / knowledge (files & documents)",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>fileInputRef.current?.click(),
                                        className: "rounded-lg border border-neutral-300 px-3 py-1.5 text-[13px] hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800",
                                        children: "+ Add files"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 507,
                                        columnNumber: 13
                                    }, this),
                                    extracting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400",
                                        children: "Reading file(s)…"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 510,
                                        columnNumber: 28
                                    }, this),
                                    docs.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400",
                                        children: "No documents yet. Add PDF / Word / Excel / text files — their text becomes context every column reads."
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 512,
                                        columnNumber: 15
                                    }, this),
                                    docs.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-1.5 flex items-center gap-2 text-[12px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: d.enabled,
                                                    onChange: ()=>toggleDoc(i)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 518,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex-1 truncate",
                                                    title: d.name,
                                                    children: d.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 519,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-neutral-400",
                                                    children: [
                                                        d.chars.toLocaleString(),
                                                        " ch",
                                                        d.truncated ? ' (cut)' : ''
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 522,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>removeDoc(i),
                                                    className: "text-neutral-400 hover:text-red-500",
                                                    title: "remove",
                                                    children: "×"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 525,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/app/agent-lab/page.tsx",
                                            lineNumber: 517,
                                            columnNumber: 15
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-[11px] text-neutral-500 dark:text-neutral-400",
                                        children: "Reads PDF, Word, Excel (.xlsx/.xls) and text. Excel sheets are flattened to CSV. Large files are capped so context stays affordable."
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 530,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 border-t border-neutral-200 pt-2 dark:border-neutral-800",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300",
                                                children: "How the agent uses documents"
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 535,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setDocMode('full'),
                                                        className: `flex-1 rounded-lg border px-2 py-1.5 text-[12px] ${docMode === 'full' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'border-neutral-300 dark:border-neutral-700'}`,
                                                        children: "📄 Full text in context"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 537,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setDocMode('retrieval'),
                                                        className: `flex-1 rounded-lg border px-2 py-1.5 text-[12px] ${docMode === 'retrieval' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'border-neutral-300 dark:border-neutral-700'}`,
                                                        children: "🔍 Retrieve on demand"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 544,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 536,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-[11px] text-neutral-500 dark:text-neutral-400",
                                                children: docMode === 'full' ? 'The whole file is loaded into context every turn — simple, but limited by size and cost.' : 'The file is NOT loaded. The agent calls the “Search documents” tool to pull only relevant passages — this handles big files.'
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 552,
                                                columnNumber: 15
                                            }, this),
                                            docMode === 'retrieval' && !enabled.searchDocuments && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-[11px] text-amber-600 dark:text-amber-400",
                                                children: "⚠ Enable the “Search documents” tool below for retrieval mode to work."
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 558,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 534,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 506,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                title: "Tools the agent may use",
                                children: CATEGORY_ORDER.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-3 last:mb-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[11px] font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300",
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORY_LABEL"][cat]
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 566,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-1.5 text-[11px] text-neutral-500 dark:text-neutral-400",
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORY_HINT"][cat]
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 567,
                                                columnNumber: 17
                                            }, this),
                                            __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOOL_CATALOG"].filter((t)=>t.category === cat).map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "mb-1 flex cursor-pointer items-start gap-2 text-[13px]",
                                                    title: t.desc,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            className: "mt-0.5",
                                                            checked: !!enabled[t.id],
                                                            onChange: (e)=>setEnabled({
                                                                    ...enabled,
                                                                    [t.id]: e.target.checked
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/agent-lab/page.tsx",
                                                            lineNumber: 570,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                t.label,
                                                                !t.real && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-amber-600 dark:text-amber-400",
                                                                    children: " (demo)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                                    lineNumber: 573,
                                                                    columnNumber: 35
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/agent-lab/page.tsx",
                                                            lineNumber: 571,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, t.id, true, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 569,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, cat, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 565,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 563,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                title: "Advanced (technical)",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex-1 text-[11px] text-neutral-500 dark:text-neutral-400",
                                                children: [
                                                    "Temperature",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        className: `${fieldClass} mt-1`,
                                                        type: "number",
                                                        step: 0.1,
                                                        min: 0,
                                                        max: 2,
                                                        value: temperature,
                                                        onChange: (e)=>setTemperature(Number(e.target.value))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 585,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 583,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex-1 text-[11px] text-neutral-500 dark:text-neutral-400",
                                                children: [
                                                    "Max steps (loop cap)",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        className: `${fieldClass} mt-1`,
                                                        type: "number",
                                                        min: 1,
                                                        max: 20,
                                                        value: maxSteps,
                                                        onChange: (e)=>setMaxSteps(Number(e.target.value))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 589,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 587,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex-1 text-[11px] text-neutral-500 dark:text-neutral-400",
                                                children: [
                                                    "Effort (Anthropic)",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        className: `${fieldClass} mt-1`,
                                                        value: effort,
                                                        onChange: (e)=>setEffort(e.target.value),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "auto",
                                                                children: "auto (model default)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                                lineNumber: 594,
                                                                columnNumber: 19
                                                            }, this),
                                                            __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$model$2d$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EFFORT_LEVELS"].map((lvl)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: lvl,
                                                                    children: lvl
                                                                }, lvl, false, {
                                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                                    lineNumber: 596,
                                                                    columnNumber: 21
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 593,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 591,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 582,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 rounded-lg bg-neutral-100 px-2 py-1.5 text-[11px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: "Effort"
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 602,
                                                columnNumber: 15
                                            }, this),
                                            " is the thinking-depth dial (low → max): low for quick reads/extraction, high/xhigh for tax logic. Applies to Anthropic models only (Opus 4.6+/Sonnet 4.6+/Fable) — ignored by Haiku 4.5, Sonnet 4.5, and non-Anthropic models. Temperature is auto-dropped for models that reject it (Opus 4.7/4.8, Sonnet 5, Fable 5), and the attached-document block is prompt-cached on Anthropic so repeated runs read it cheaply."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 601,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 581,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                title: "What this agent can access right now",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "space-y-1 text-[12px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: "✅ Its system prompt (the sections above)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 609,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    "✅ This conversation (",
                                                    convoCount,
                                                    " message",
                                                    convoCount === 1 ? '' : 's',
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 610,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    "✅ ",
                                                    enabledTools.length,
                                                    " enabled tool",
                                                    enabledTools.length === 1 ? '' : 's',
                                                    enabledTools.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-neutral-500 dark:text-neutral-400",
                                                        children: [
                                                            ": ",
                                                            enabledTools.join(', ')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 613,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 611,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    activeDocs.length > 0 ? '✅' : '❌',
                                                    " ",
                                                    activeDocs.length,
                                                    " attached document",
                                                    activeDocs.length === 1 ? '' : 's',
                                                    activeDocs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-neutral-500 dark:text-neutral-400",
                                                        children: [
                                                            ": ",
                                                            activeDocs.map((d)=>d.name).join(', '),
                                                            docMode === 'retrieval' ? ' — retrieval mode (searched on demand)' : ' — loaded fully into context'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 618,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 615,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 608,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 rounded-lg bg-neutral-100 px-2 py-1.5 text-[11px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
                                        children: [
                                            "Estimated context this turn: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: [
                                                    "~",
                                                    contextChars.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 626,
                                                columnNumber: 44
                                            }, this),
                                            " chars (~",
                                            estTokens.toLocaleString(),
                                            " tokens). Shared across all model columns."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 625,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 607,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                title: "Your notes (saved on this device)",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    className: `${fieldClass} min-h-[90px] resize-y`,
                                    placeholder: "Jot what you notice about the agent as you test…",
                                    value: notes,
                                    onChange: (e)=>setNotes(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/app/agent-lab/page.tsx",
                                    lineNumber: 631,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 630,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: clearAll,
                                className: "rounded-lg border border-neutral-300 px-3 py-2 text-[13px] text-neutral-500 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800",
                                children: "Clear all conversations"
                            }, void 0, false, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 634,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/agent-lab/page.tsx",
                        lineNumber: 399,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex min-w-0 flex-col gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3 overflow-x-auto pb-1",
                                children: [
                                    lanes.map((lane)=>{
                                        const laneModel = lane.customModel.trim() || lane.model;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex min-w-[340px] flex-1 flex-col gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            className: `${fieldClass} flex-1`,
                                                            value: lane.model,
                                                            onChange: (e)=>updateLane(lane.id, {
                                                                    model: e.target.value
                                                                }),
                                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODEL_OPTIONS"].map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: m.id,
                                                                    children: m.id
                                                                }, m.id, false, {
                                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                                    lineNumber: 649,
                                                                    columnNumber: 25
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/agent-lab/page.tsx",
                                                            lineNumber: 647,
                                                            columnNumber: 21
                                                        }, this),
                                                        lanes.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>removeLane(lane.id),
                                                            className: tinyBtn,
                                                            title: "remove column",
                                                            children: "×"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/agent-lab/page.tsx",
                                                            lineNumber: 655,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 646,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    className: `${fieldClass} text-[12px]`,
                                                    placeholder: "…or a custom model id",
                                                    value: lane.customModel,
                                                    onChange: (e)=>updateLane(lane.id, {
                                                            customModel: e.target.value
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 660,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-[10px] text-neutral-400",
                                                    children: laneModel.includes('/') ? 'Gateway (AI_GATEWAY_API_KEY)' : 'Direct OpenAI (OPENAI_API_KEY)'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 666,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "max-h-[60vh] min-h-[300px] flex-1 space-y-3 overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900",
                                                    children: [
                                                        lane.messages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[12px] text-neutral-500 dark:text-neutral-400",
                                                            children: lanes.length > 1 ? 'One message goes to every column — compare the answers.' : `Ask ${__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGENT_NAME"]} anything, or 📎 attach a document.`
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/agent-lab/page.tsx",
                                                            lineNumber: 670,
                                                            columnNumber: 23
                                                        }, this),
                                                        lane.messages.map((m, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: m.role === 'user' ? 'flex justify-end' : 'flex flex-col items-start',
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: m.role === 'user' ? 'max-w-[85%] rounded-lg bg-blue-600 px-3 py-2 text-sm whitespace-pre-wrap text-white' : 'max-w-[95%] rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm whitespace-pre-wrap dark:border-neutral-700 dark:bg-neutral-800',
                                                                        children: m.content
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                                        lineNumber: 676,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    m.role === 'assistant' && m.context && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Provenance, {
                                                                        msg: m
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                                        lineNumber: 685,
                                                                        columnNumber: 65
                                                                    }, this)
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                                lineNumber: 675,
                                                                columnNumber: 23
                                                            }, this)),
                                                        lane.loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-neutral-500 dark:text-neutral-400",
                                                            children: [
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGENT_NAME"],
                                                                " is thinking…"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/agent-lab/page.tsx",
                                                            lineNumber: 688,
                                                            columnNumber: 38
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 668,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, lane.id, true, {
                                            fileName: "[project]/app/agent-lab/page.tsx",
                                            lineNumber: 645,
                                            columnNumber: 17
                                        }, this);
                                    }),
                                    lanes.length < MAX_LANES && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: addLane,
                                        className: "h-10 shrink-0 self-start rounded-lg border border-dashed border-neutral-300 px-3 text-[13px] text-neutral-500 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800",
                                        title: "Add a model column",
                                        children: "+ Model"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 694,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 641,
                                columnNumber: 11
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[13px] text-red-500",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 705,
                                columnNumber: 21
                            }, this),
                            allEmpty && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setInputText('Estimate the Canadian corporate tax on 250,000 USD of income for tax year 2024.'),
                                className: "self-start rounded-lg border border-neutral-300 px-3 py-1.5 text-[12px] text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800",
                                children: "▶ Try: estimate tax on 250,000 USD (2024)"
                            }, void 0, false, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 708,
                                columnNumber: 13
                            }, this),
                            activeDocs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[11px] text-neutral-400",
                                        children: "In context:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 719,
                                        columnNumber: 15
                                    }, this),
                                    docs.map((d, i)=>d.enabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1 rounded-full border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[11px] dark:border-neutral-700 dark:bg-neutral-800",
                                            children: [
                                                "📄 ",
                                                d.name,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>removeDoc(i),
                                                    className: "text-neutral-400 hover:text-red-500",
                                                    title: "remove",
                                                    children: "×"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 724,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/app/agent-lab/page.tsx",
                                            lineNumber: 722,
                                            columnNumber: 19
                                        }, this) : null)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 718,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>fileInputRef.current?.click(),
                                        className: "rounded-lg border border-neutral-300 px-3 text-lg hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800",
                                        title: "Attach a document to memory",
                                        children: "📎"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 734,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: `${fieldClass} flex-1`,
                                        placeholder: lanes.length > 1 ? 'Message all models…' : `Message ${__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGENT_NAME"]}…`,
                                        value: inputText,
                                        onChange: (e)=>setInputText(e.target.value),
                                        onKeyDown: (e)=>{
                                            if (e.key === 'Enter') {
                                                send();
                                            }
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 737,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: send,
                                        disabled: anyLoading,
                                        className: "rounded-lg bg-blue-600 px-5 text-sm text-white disabled:opacity-60",
                                        children: "Send"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 748,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 733,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/agent-lab/page.tsx",
                        lineNumber: 640,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/agent-lab/page.tsx",
                lineNumber: 397,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/agent-lab/page.tsx",
        lineNumber: 381,
        columnNumber: 5
    }, this);
}
_s(AgentLabPage, "SxQeSK8cxl2V65bUHvoSAFh31NE=");
_c = AgentLabPage;
// ── Provenance panel: "where did this answer come from?" ─────────────────────
function Provenance({ msg }) {
    const ctx = msg.context;
    if (!ctx) {
        return null;
    }
    const toolCalls = (msg.steps ?? []).flatMap((s)=>s.toolCalls.map((tc, j)=>({
                tool: tc.tool,
                input: tc.input,
                output: s.toolResults[j]?.output
            })));
    const usedTools = toolCalls.length > 0;
    const docCount = msg.docContext?.count ?? ctx.documents.length;
    const docNames = msg.docContext?.names ?? ctx.documents;
    // What the model router applied this turn (pure fn — recomputed for display).
    const plan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$model$2d$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["planForModel"])(ctx.model, {
        effort: ctx.effort === 'auto' ? undefined : ctx.effort
    });
    const cachedTokens = msg.usage?.cachedInputTokens ?? 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-1.5 w-full max-w-[95%] rounded-lg border border-neutral-200 bg-white p-2 text-[11px] dark:border-neutral-800 dark:bg-neutral-950",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-1 font-semibold text-neutral-600 dark:text-neutral-300",
                children: "Where this came from"
            }, void 0, false, {
                fileName: "[project]/app/agent-lab/page.tsx",
                lineNumber: 774,
                columnNumber: 7
            }, this),
            usedTools ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-1 text-emerald-700 dark:text-emerald-400",
                children: [
                    "Grounded in ",
                    toolCalls.length,
                    " tool call",
                    toolCalls.length === 1 ? '' : 's',
                    ": ",
                    toolCalls.map((t)=>t.tool).join(', ')
                ]
            }, void 0, true, {
                fileName: "[project]/app/agent-lab/page.tsx",
                lineNumber: 777,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-1 text-amber-700 dark:text-amber-400",
                children: [
                    "No tools used — the model’s own knowledge",
                    docCount > 0 ? ' and/or your attached documents' : ' (not memory, documents, or files)',
                    "."
                ]
            }, void 0, true, {
                fileName: "[project]/app/agent-lab/page.tsx",
                lineNumber: 781,
                columnNumber: 9
            }, this),
            docCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-1 text-blue-700 dark:text-blue-400",
                children: [
                    "📄 ",
                    docCount,
                    " document",
                    docCount === 1 ? '' : 's',
                    " in context: ",
                    docNames.join(', ')
                ]
            }, void 0, true, {
                fileName: "[project]/app/agent-lab/page.tsx",
                lineNumber: 787,
                columnNumber: 9
            }, this),
            toolCalls.map((t, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-1 rounded border border-neutral-200 p-1.5 dark:border-neutral-800",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-mono text-blue-600 dark:text-blue-400",
                            children: [
                                "🔧 ",
                                t.tool
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/agent-lab/page.tsx",
                            lineNumber: 794,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                            className: "mt-0.5 overflow-x-auto whitespace-pre-wrap text-neutral-500 dark:text-neutral-400",
                            children: [
                                "in: ",
                                JSON.stringify(t.input)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/agent-lab/page.tsx",
                            lineNumber: 795,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                            className: "overflow-x-auto whitespace-pre-wrap text-neutral-500 dark:text-neutral-400",
                            children: [
                                "out: ",
                                JSON.stringify(t.output)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/agent-lab/page.tsx",
                            lineNumber: 796,
                            columnNumber: 11
                        }, this)
                    ]
                }, j, true, {
                    fileName: "[project]/app/agent-lab/page.tsx",
                    lineNumber: 793,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                className: "mt-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                        className: "cursor-pointer text-neutral-500 dark:text-neutral-400",
                        children: [
                            "What the model received this turn",
                            msg.usage?.totalTokens ? ` · ${msg.usage.totalTokens} tokens` : '',
                            cachedTokens > 0 ? ` · ${cachedTokens.toLocaleString()} cached` : ''
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/agent-lab/page.tsx",
                        lineNumber: 801,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1 space-y-1 text-neutral-500 dark:text-neutral-400",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: "Model:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 807,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    ctx.model
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 806,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: "Model router:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 810,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    plan.provider,
                                    ' · ',
                                    "effort: ",
                                    plan.effort ?? (plan.supportsEffort ? 'model default' : 'n/a'),
                                    ' · ',
                                    "cache: ",
                                    plan.cacheSystem ? cachedTokens > 0 ? `hit (${cachedTokens.toLocaleString()} tok)` : 'on (no hit yet)' : 'off',
                                    ' · ',
                                    "temperature: ",
                                    plan.sendTemperature ? 'sent' : 'dropped (model rejects it)'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 809,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: "Tools available:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 816,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    ctx.enabledTools.length ? ctx.enabledTools.join(', ') : 'none'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 815,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: "Documents in context:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 819,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    docCount ? docNames.join(', ') : 'none'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 818,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: "Conversation:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 822,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    ctx.messageCount,
                                    " message",
                                    ctx.messageCount === 1 ? '' : 's'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 821,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: "System prompt:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 825,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                        className: "mt-0.5 overflow-x-auto whitespace-pre-wrap",
                                        children: ctx.system
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 826,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 824,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/agent-lab/page.tsx",
                        lineNumber: 805,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/agent-lab/page.tsx",
                lineNumber: 800,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/agent-lab/page.tsx",
        lineNumber: 773,
        columnNumber: 5
    }, this);
}
_c1 = Provenance;
const fieldClass = 'w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-2 text-sm text-neutral-900 outline-none focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100';
const tinyBtn = 'rounded border border-neutral-300 px-1.5 text-[11px] text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 dark:border-neutral-700 dark:hover:bg-neutral-800';
const smallBtn = 'rounded-lg border border-neutral-300 px-2.5 py-2 text-[12px] hover:bg-neutral-100 disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-800';
function Section({ title, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400",
                children: title
            }, void 0, false, {
                fileName: "[project]/app/agent-lab/page.tsx",
                lineNumber: 846,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/app/agent-lab/page.tsx",
        lineNumber: 845,
        columnNumber: 5
    }, this);
}
_c2 = Section;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "AgentLabPage");
__turbopack_context__.k.register(_c1, "Provenance");
__turbopack_context__.k.register(_c2, "Section");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_e66bf9cb._.js.map