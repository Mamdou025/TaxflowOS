(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
// ── Request / response shapes shared by the page and the route ────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$model$2d$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/agent-lab/model-router.ts [app-client] (ecmascript)");
const AGENT_NAME = 'Sina';
const DEFAULT_SYSTEM_PROMPT = `You are ${AGENT_NAME}, a helpful, precise agent used to evaluate how agents work. ` + `You have tools available — call a tool whenever it helps you answer accurately ` + `instead of guessing. When you use a tool, briefly say what you did and what you ` + `found. Be concise and honest about uncertainty.`;
const MODEL_OPTIONS = [
    // Sina (auto): don't pin a model — Sina reads the question and routes to the right tier.
    {
        id: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$model$2d$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTO_MODEL_ID"],
        label: 'Sina (auto — picks the model per question)',
        via: 'auto',
        blurb: 'Sina reads each question and routes it: Haiku 4.5 (quick reads/lookups), Sonnet 5 (Q&A/analysis), Opus 4.8 (tax logic & calculations). Uses the gateway (AI_GATEWAY_API_KEY).'
    },
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
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/agent-lab/context-router.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Agent Lab — CONTEXT ROUTER (client-safe: pure logic, no secrets, no server imports).
//
// "Send only what this question needs." A stateless model re-receives the FULL system
// prompt + EVERY tool schema on every turn — cheap with caching, but it dilutes the
// model's attention when most of it is irrelevant. This picks, per question, which
// prompt folders + tools to include, so you can compare "send everything" vs "send only
// the relevant slice" (tokens + answer quality) in the Lab.
//
// v1 is a deterministic keyword matcher (transparent, free, always works) — the same
// lexical approach as searchDocuments. Its blind spot is identical: it matches literal
// words, not meaning, so it works best when your folders/tools are keyword-rich and
// domain-specific. The intelligent upgrade is an LLM/embedding "intent router" (matches
// by meaning) — swap `selectContext` for that later without touching the call sites.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "selectContext",
    ()=>selectContext
]);
// Very small stoplist so matches key off meaningful words, not "the/what/how".
const STOPWORDS = new Set([
    'the',
    'and',
    'for',
    'you',
    'your',
    'are',
    'was',
    'with',
    'this',
    'that',
    'have',
    'has',
    'can',
    'will',
    'what',
    'when',
    'where',
    'which',
    'who',
    'how',
    'why',
    'from',
    'into',
    'about',
    'please',
    'give',
    'tell',
    'show',
    'need',
    'want',
    'help',
    'make',
    'does',
    'did',
    'not',
    'but',
    'all',
    'any',
    'get',
    'use',
    'using',
    'should',
    'would',
    'could',
    'them',
    'they',
    'our'
]);
function keywords(text) {
    const words = (text.toLowerCase().match(/[a-z0-9]{3,}/g) ?? []).filter((w)=>!STOPWORDS.has(w));
    return [
        ...new Set(words)
    ];
}
function overlap(haystack, terms) {
    const lower = haystack.toLowerCase();
    let n = 0;
    for (const t of terms){
        if (lower.includes(t)) {
            n++;
        }
    }
    return n;
}
function selectContext(question, sections, tools) {
    const terms = keywords(question);
    // Folders: keep the identity folder (index 0) + any that share a keyword.
    let sectionIds;
    if (sections.length === 0) {
        sectionIds = [];
    } else {
        const matched = sections.filter((s, i)=>i === 0 || overlap(`${s.name} ${s.content}`, terms) > 0).map((s)=>s.id);
        // Only the identity folder matched → we couldn't classify → keep everything.
        sectionIds = matched.length > 1 ? matched : sections.map((s)=>s.id);
    }
    // Tools: keep those whose id/label/description share a keyword; none → keep all.
    const matchedTools = tools.filter((t)=>overlap(`${t.id} ${t.label} ${t.desc}`, terms) > 0).map((t)=>t.id);
    const toolIds = matchedTools.length > 0 ? matchedTools : tools.map((t)=>t.id);
    const trimmed = sectionIds.length < sections.length || toolIds.length < tools.length;
    const reason = !terms.length ? 'no keywords to match — sent everything' : trimmed ? `matched on: ${terms.slice(0, 8).join(', ')}` : 'everything was relevant — sent all';
    return {
        sectionIds,
        toolIds,
        reason
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/agent-lab/fiscal.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Agent Lab — FISCAL MODE (client-safe: pure data + policy text, no secrets).
//
// Encodes the non-negotiables for a tax/fiscalist tool as an injected prompt layer:
//   #1 Cite the authority for every rule/figure — or say you can't verify it.
//   #2 Never compute figures freehand — use a calculation tool / the engine.
//   #3 Pin every answer to a tax year + jurisdiction + entity (temporal/jurisdictional).
//   + Defer on professional judgment (elections/positions) and flag uncertainty.
//
// Delivered as a preamble PREPENDED to the system prompt so it is always present
// (never pruned by context-scope) and sits first (highest priority). Defaults are
// Canadian / Québec (CRA + Revenu Québec) to match this codebase's domain.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "CURRENCIES",
    ()=>CURRENCIES,
    "DEFAULT_FISCAL_CONTEXT",
    ()=>DEFAULT_FISCAL_CONTEXT,
    "ENTITY_TYPES",
    ()=>ENTITY_TYPES,
    "PROVINCES",
    ()=>PROVINCES,
    "RESIDENCY",
    ()=>RESIDENCY,
    "fiscalPreamble",
    ()=>fiscalPreamble,
    "fiscalSummary",
    ()=>fiscalSummary
]);
const PROVINCES = [
    {
        code: 'FED',
        label: 'Federal only'
    },
    {
        code: 'AB',
        label: 'Alberta'
    },
    {
        code: 'BC',
        label: 'British Columbia'
    },
    {
        code: 'MB',
        label: 'Manitoba'
    },
    {
        code: 'NB',
        label: 'New Brunswick'
    },
    {
        code: 'NL',
        label: 'Newfoundland and Labrador'
    },
    {
        code: 'NS',
        label: 'Nova Scotia'
    },
    {
        code: 'NT',
        label: 'Northwest Territories'
    },
    {
        code: 'NU',
        label: 'Nunavut'
    },
    {
        code: 'ON',
        label: 'Ontario'
    },
    {
        code: 'PE',
        label: 'Prince Edward Island'
    },
    {
        code: 'QC',
        label: 'Québec'
    },
    {
        code: 'SK',
        label: 'Saskatchewan'
    },
    {
        code: 'YT',
        label: 'Yukon'
    }
];
const ENTITY_TYPES = [
    'CCPC (Canadian-controlled private corporation)',
    'Other private corporation',
    'Public corporation',
    'Individual',
    'Trust',
    'Partnership'
];
const RESIDENCY = [
    'Canadian resident',
    'Non-resident',
    'Deemed resident'
];
const CURRENCIES = [
    'CAD',
    'USD',
    'EUR',
    'GBP'
];
const DEFAULT_FISCAL_CONTEXT = {
    taxYear: 2025,
    province: 'QC',
    entityType: ENTITY_TYPES[0],
    residency: RESIDENCY[0],
    currency: 'CAD'
};
function jurisdictionLabel(province) {
    if (province === 'FED') {
        return 'Canada (federal — CRA)';
    }
    const p = PROVINCES.find((x)=>x.code === province);
    const name = p ? p.label : province;
    // Québec administers its own provincial tax (Revenu Québec) alongside the CRA.
    const admin = province === 'QC' ? 'CRA (federal) + Revenu Québec (provincial)' : `CRA (federal) + ${name} (provincial)`;
    return `${name}, Canada — ${admin}`;
}
function fiscalSummary(ctx) {
    const p = PROVINCES.find((x)=>x.code === ctx.province);
    return `${ctx.taxYear} · ${p ? p.label : ctx.province} · ${ctx.entityType.split(' (')[0]} · ${ctx.residency} · ${ctx.currency}`;
}
function fiscalPreamble(ctx) {
    return [
        '## Fiscal context (authoritative — scope every answer to this)',
        `- Tax year: ${ctx.taxYear}`,
        `- Jurisdiction: ${jurisdictionLabel(ctx.province)}`,
        `- Entity type: ${ctx.entityType}`,
        `- Residency: ${ctx.residency}`,
        `- Reporting currency: ${ctx.currency}`,
        '',
        'Every answer applies ONLY to this context. If the question implies a different tax year, jurisdiction, or entity type, say so and ask to update the fiscal context before answering. Open each substantive answer by stating the tax year and jurisdiction it relies on.',
        '',
        '## Non-negotiable rules (fiscal)',
        "1. CITE THE AUTHORITY. For every rule, rate, threshold, deadline, or legal conclusion, cite the source — the statute section (e.g. ITA s. 85), the CRA / Revenu Québec publication, or the attached document + the passage it came from. If you cannot ground a claim in a provided source or a tool result, say plainly \"I can't verify this — it needs a source or a professional\" rather than stating it as fact.",
        '2. NEVER COMPUTE FIGURES YOURSELF. Do not perform tax or financial arithmetic in your head. Use a calculation tool or the workflow engine. If no tool exists for a required calculation, state exactly which calculation is needed and the inputs it requires — do NOT invent or estimate a number.',
        '3. CURRENCY OF LAW. Rates, thresholds, brackets, and deadlines change by tax year and jurisdiction. Do not rely on memory for them — verify against a current authoritative source (CRA / Revenu Québec) and note the date you checked.',
        '4. DEFER ON JUDGMENT. For elections, filing positions, or anything requiring professional judgment (e.g. the elected amount in a s. 85 rollover), present the options and the bounds, then STOP for the professional to decide. Do not choose for them.',
        '5. FLAG UNCERTAINTY. State your confidence. It is better to say "uncertain — verify X" than to be confidently wrong. This output is a draft for professional review, not final client advice.'
    ].join('\n');
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
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$context$2d$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/agent-lab/context-router.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/agent-lab/fiscal.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
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
    // Context scope. 'full' = send all folders + tools every turn; 'auto' = a per-turn
    // intent step (context-router) picks only the relevant folders + tools for the question.
    const [scope, setScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('full');
    // Fiscal mode = the tax/fiscalist non-negotiables (features/agent-lab/fiscal.ts). When on,
    // the pinned fiscal context + policy is prepended (un-prunable) to the system prompt.
    const [fiscalMode, setFiscalMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fiscal, setFiscal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_FISCAL_CONTEXT"]);
    const [fiscalLoaded, setFiscalLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
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
            model: 'gpt-4o',
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
    // Fiscal mode + context — load once, then persist any change.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgentLabPage.useEffect": ()=>{
            try {
                const raw = localStorage.getItem('agent-lab-fiscal');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (typeof parsed.mode === 'boolean') {
                        setFiscalMode(parsed.mode);
                    }
                    if (parsed.ctx) {
                        setFiscal({
                            ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_FISCAL_CONTEXT"],
                            ...parsed.ctx
                        });
                    }
                }
            } catch  {
            // ignore malformed storage
            }
            setFiscalLoaded(true);
        }
    }["AgentLabPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgentLabPage.useEffect": ()=>{
            if (!fiscalLoaded) {
                return;
            }
            localStorage.setItem('agent-lab-fiscal', JSON.stringify({
                mode: fiscalMode,
                ctx: fiscal
            }));
        }
    }["AgentLabPage.useEffect"], [
        fiscalMode,
        fiscal,
        fiscalLoaded
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
        // Context scope: in 'auto', a per-turn intent step picks only the folders + tools
        // relevant to THIS question (shared across lanes — same prompt/tools, only model differs).
        const enabledSections = sections.filter((s)=>s.enabled && s.content.trim());
        let sentSystem = system;
        let sentTools = enabledTools;
        let selection;
        if (scope === 'auto') {
            const sel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$context$2d$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectContext"])(text, enabledSections.map((s)=>({
                    id: s.id,
                    name: s.name,
                    content: s.content
                })), enabledTools.map((id)=>{
                const c = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOOL_CATALOG"].find((t)=>t.id === id);
                return {
                    id,
                    label: c?.label ?? id,
                    desc: c?.desc ?? ''
                };
            }));
            sentSystem = assembleSystemPrompt(sections.filter((s)=>sel.sectionIds.includes(s.id)));
            sentTools = enabledTools.filter((id)=>sel.toolIds.includes(id));
            selection = {
                reason: sel.reason,
                sentSections: sel.sectionIds.length,
                totalSections: enabledSections.length,
                sentTools: sentTools.length,
                totalTools: enabledTools.length
            };
        }
        // Fiscal mode: prepend the non-negotiables preamble AFTER scoping, so it is always
        // present (never pruned) and sits first in the system prompt.
        const fiscalStamp = fiscalMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fiscalSummary"])(fiscal) : undefined;
        if (fiscalMode) {
            sentSystem = `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fiscalPreamble"])(fiscal)}\n\n${sentSystem}`;
        }
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
                system: sentSystem,
                enabledTools: sentTools,
                messageCount: nextMessages.length,
                documents: docNames,
                effort,
                scope,
                selection,
                fiscal: fiscalStamp
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
                            system: sentSystem,
                            temperature,
                            maxSteps,
                            enabledTools: sentTools,
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
                        applied: data.applied,
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
                lineNumber: 460,
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
                        lineNumber: 464,
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
                                lineNumber: 468,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] text-neutral-500 dark:text-neutral-400",
                                children: "Configure the agent once, then compare it across models side by side."
                            }, void 0, false, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 469,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/agent-lab/page.tsx",
                        lineNumber: 467,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/agent-lab/page.tsx",
                lineNumber: 463,
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
                                                lineNumber: 481,
                                                columnNumber: 15
                                            }, this),
                                            ". Gateway models need ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: "AI_GATEWAY_API_KEY"
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 484,
                                                columnNumber: 37
                                            }, this),
                                            "; type any ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: "provider/model"
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 484,
                                                columnNumber: 79
                                            }, this),
                                            " id in a column's custom box."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 479,
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
                                                                lineNumber: 490,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `rounded px-1 text-[10px] ${m.via === 'auto' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : m.via === 'gateway' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}`,
                                                                children: m.via === 'auto' ? 'Auto' : m.via === 'gateway' ? 'Gateway' : 'Direct'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                                lineNumber: 491,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 489,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-neutral-500 dark:text-neutral-400",
                                                        children: m.blurb
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 497,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, m.id, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 488,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 486,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 478,
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
                                                                lineNumber: 507,
                                                                columnNumber: 19
                                                            }, this),
                                                            savedPrompts.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: p.id,
                                                                    children: p.name
                                                                }, p.id, false, {
                                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                                    lineNumber: 509,
                                                                    columnNumber: 21
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 506,
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
                                                        lineNumber: 514,
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
                                                        lineNumber: 526,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 505,
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
                                                        lineNumber: 540,
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
                                                        lineNumber: 541,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 539,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 504,
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
                                                            lineNumber: 549,
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
                                                            lineNumber: 550,
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
                                                            lineNumber: 556,
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
                                                            lineNumber: 559,
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
                                                            lineNumber: 562,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 548,
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
                                                    lineNumber: 566,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, s.id, true, {
                                            fileName: "[project]/app/agent-lab/page.tsx",
                                            lineNumber: 547,
                                            columnNumber: 15
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: addSection,
                                        className: "rounded-lg border border-neutral-300 px-3 py-1.5 text-[13px] hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800",
                                        children: "+ Add section"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 574,
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
                                                lineNumber: 579,
                                                columnNumber: 52
                                            }, this),
                                            " above to keep multiple named versions."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 577,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 503,
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
                                        lineNumber: 585,
                                        columnNumber: 13
                                    }, this),
                                    extracting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400",
                                        children: "Reading file(s)…"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 588,
                                        columnNumber: 28
                                    }, this),
                                    docs.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400",
                                        children: "No documents yet. Add PDF / Word / Excel / text files — their text becomes context every column reads."
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 590,
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
                                                    lineNumber: 596,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex-1 truncate",
                                                    title: d.name,
                                                    children: d.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 597,
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
                                                    lineNumber: 600,
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
                                                    lineNumber: 603,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/app/agent-lab/page.tsx",
                                            lineNumber: 595,
                                            columnNumber: 15
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-[11px] text-neutral-500 dark:text-neutral-400",
                                        children: "Reads PDF, Word, Excel (.xlsx/.xls) and text. Excel sheets are flattened to CSV. Large files are capped so context stays affordable."
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 608,
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
                                                lineNumber: 613,
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
                                                        lineNumber: 615,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setDocMode('retrieval'),
                                                        className: `flex-1 rounded-lg border px-2 py-1.5 text-[12px] ${docMode === 'retrieval' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'border-neutral-300 dark:border-neutral-700'}`,
                                                        children: "🔍 Retrieve on demand"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 622,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 614,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-[11px] text-neutral-500 dark:text-neutral-400",
                                                children: docMode === 'full' ? 'The whole file is loaded into context every turn — simple, but limited by size and cost.' : 'The file is NOT loaded. The agent calls the “Search documents” tool to pull only relevant passages — this handles big files.'
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 630,
                                                columnNumber: 15
                                            }, this),
                                            docMode === 'retrieval' && !enabled.searchDocuments && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-[11px] text-amber-600 dark:text-amber-400",
                                                children: "⚠ Enable the “Search documents” tool below for retrieval mode to work."
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 636,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 612,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 584,
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
                                                lineNumber: 644,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-1.5 text-[11px] text-neutral-500 dark:text-neutral-400",
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORY_HINT"][cat]
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 645,
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
                                                            lineNumber: 648,
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
                                                                    lineNumber: 651,
                                                                    columnNumber: 35
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/agent-lab/page.tsx",
                                                            lineNumber: 649,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, t.id, true, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 647,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, cat, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 643,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 641,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                title: "Fiscal mode (tax guardrails)",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-start gap-2 text-[12px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                className: "mt-0.5",
                                                checked: fiscalMode,
                                                onChange: (e)=>setFiscalMode(e.target.checked)
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 661,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Enforce the fiscalist non-negotiables — cite the authority · never self-compute figures · pin tax year / jurisdiction / entity · defer on elections & positions · flag uncertainty."
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 662,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 660,
                                        columnNumber: 13
                                    }, this),
                                    fiscalMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-3 grid grid-cols-2 gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-[11px] text-neutral-500 dark:text-neutral-400",
                                                        children: [
                                                            "Tax year",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                className: `${fieldClass} mt-1`,
                                                                type: "number",
                                                                min: 2000,
                                                                max: 2100,
                                                                value: fiscal.taxYear,
                                                                onChange: (e)=>setFiscal((f)=>({
                                                                            ...f,
                                                                            taxYear: Number(e.target.value)
                                                                        }))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                                lineNumber: 669,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 667,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-[11px] text-neutral-500 dark:text-neutral-400",
                                                        children: [
                                                            "Province / jurisdiction",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                className: `${fieldClass} mt-1`,
                                                                value: fiscal.province,
                                                                onChange: (e)=>setFiscal((f)=>({
                                                                            ...f,
                                                                            province: e.target.value
                                                                        })),
                                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROVINCES"].map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: p.code,
                                                                        children: p.label
                                                                    }, p.code, false, {
                                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                                        lineNumber: 675,
                                                                        columnNumber: 25
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                                lineNumber: 673,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 671,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-[11px] text-neutral-500 dark:text-neutral-400",
                                                        children: [
                                                            "Entity type",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                className: `${fieldClass} mt-1`,
                                                                value: fiscal.entityType,
                                                                onChange: (e)=>setFiscal((f)=>({
                                                                            ...f,
                                                                            entityType: e.target.value
                                                                        })),
                                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_TYPES"].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: t,
                                                                        children: t
                                                                    }, t, false, {
                                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                                        lineNumber: 683,
                                                                        columnNumber: 25
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                                lineNumber: 681,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 679,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-[11px] text-neutral-500 dark:text-neutral-400",
                                                        children: [
                                                            "Residency",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                className: `${fieldClass} mt-1`,
                                                                value: fiscal.residency,
                                                                onChange: (e)=>setFiscal((f)=>({
                                                                            ...f,
                                                                            residency: e.target.value
                                                                        })),
                                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RESIDENCY"].map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: r,
                                                                        children: r
                                                                    }, r, false, {
                                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                                        lineNumber: 691,
                                                                        columnNumber: 25
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                                lineNumber: 689,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 687,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-[11px] text-neutral-500 dark:text-neutral-400",
                                                        children: [
                                                            "Reporting currency",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                className: `${fieldClass} mt-1`,
                                                                value: fiscal.currency,
                                                                onChange: (e)=>setFiscal((f)=>({
                                                                            ...f,
                                                                            currency: e.target.value
                                                                        })),
                                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CURRENCIES"].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: c,
                                                                        children: c
                                                                    }, c, false, {
                                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                                        lineNumber: 699,
                                                                        columnNumber: 25
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                                lineNumber: 697,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 695,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 666,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 rounded-lg bg-emerald-50 px-2 py-1.5 text-[11px] text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
                                                children: [
                                                    "Prepended (un-prunable) to the top of the system prompt: the pinned context + 5 non-negotiable rules. This turn's stamp: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fiscalSummary"])(fiscal)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 705,
                                                        columnNumber: 140
                                                    }, this),
                                                    ". Testable guardrails here — graduate them into the live assistant runtime once tuned."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 704,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 659,
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
                                                        lineNumber: 715,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 713,
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
                                                        lineNumber: 719,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 717,
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
                                                                lineNumber: 724,
                                                                columnNumber: 19
                                                            }, this),
                                                            __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$model$2d$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EFFORT_LEVELS"].map((lvl)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: lvl,
                                                                    children: lvl
                                                                }, lvl, false, {
                                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                                    lineNumber: 726,
                                                                    columnNumber: 21
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 723,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 721,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 712,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 rounded-lg bg-neutral-100 px-2 py-1.5 text-[11px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: "Effort"
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 732,
                                                columnNumber: 15
                                            }, this),
                                            " is the thinking-depth dial (low → max): low for quick reads/extraction, high/xhigh for tax logic. Applies to Anthropic models only (Opus 4.6+/Sonnet 4.6+/Fable) — ignored by Haiku 4.5, Sonnet 4.5, and non-Anthropic models. Temperature is auto-dropped for models that reject it (Opus 4.7/4.8, Sonnet 5, Fable 5), and the attached-document block is prompt-cached on Anthropic so repeated runs read it cheaply."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 731,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-300",
                                                children: "Context scope"
                                            }, void 0, false, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 736,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setScope('full'),
                                                        className: `flex-1 rounded-lg border px-2 py-1.5 text-[12px] ${scope === 'full' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'border-neutral-300 dark:border-neutral-700'}`,
                                                        children: "Send all"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 738,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setScope('auto'),
                                                        className: `flex-1 rounded-lg border px-2 py-1.5 text-[12px] ${scope === 'auto' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'border-neutral-300 dark:border-neutral-700'}`,
                                                        children: "Auto (relevant only)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 745,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 737,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 rounded-lg bg-neutral-100 px-2 py-1.5 text-[11px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                        children: "Send all"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 754,
                                                        columnNumber: 17
                                                    }, this),
                                                    " gives the model every enabled folder + tool each turn (best prompt-cache reuse). ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                        children: "Auto"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                        lineNumber: 754,
                                                        columnNumber: 114
                                                    }, this),
                                                    " runs a per-turn intent step that keeps only the folders/tools whose keywords match the question — smaller, sharper context, but it can miss a relevant one (keyword match, same blind spot as the doc search) and it lowers cache reuse since the prefix changes per question. Compare tokens + answers in the provenance panel. Works best with domain-specific folders."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 753,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 735,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 711,
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
                                                lineNumber: 762,
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
                                                lineNumber: 763,
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
                                                        lineNumber: 766,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 764,
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
                                                        lineNumber: 771,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                lineNumber: 768,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 761,
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
                                                lineNumber: 779,
                                                columnNumber: 44
                                            }, this),
                                            " chars (~",
                                            estTokens.toLocaleString(),
                                            " tokens). Shared across all model columns."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 778,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 760,
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
                                    lineNumber: 784,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 783,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: clearAll,
                                className: "rounded-lg border border-neutral-300 px-3 py-2 text-[13px] text-neutral-500 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800",
                                children: "Clear all conversations"
                            }, void 0, false, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 787,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/agent-lab/page.tsx",
                        lineNumber: 477,
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
                                                                    lineNumber: 802,
                                                                    columnNumber: 25
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/agent-lab/page.tsx",
                                                            lineNumber: 800,
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
                                                            lineNumber: 808,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 799,
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
                                                    lineNumber: 813,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-[10px] text-neutral-400",
                                                    children: laneModel === __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$model$2d$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTO_MODEL_ID"] ? 'Auto — Sina picks the model per question (needs AI_GATEWAY_API_KEY)' : laneModel.includes('/') ? 'Gateway (AI_GATEWAY_API_KEY)' : 'Direct OpenAI (OPENAI_API_KEY)'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 819,
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
                                                            lineNumber: 823,
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
                                                                        lineNumber: 829,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    m.role === 'assistant' && m.context && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Provenance, {
                                                                        msg: m
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/agent-lab/page.tsx",
                                                                        lineNumber: 838,
                                                                        columnNumber: 65
                                                                    }, this)
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/app/agent-lab/page.tsx",
                                                                lineNumber: 828,
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
                                                            lineNumber: 841,
                                                            columnNumber: 38
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/agent-lab/page.tsx",
                                                    lineNumber: 821,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, lane.id, true, {
                                            fileName: "[project]/app/agent-lab/page.tsx",
                                            lineNumber: 798,
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
                                        lineNumber: 847,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 794,
                                columnNumber: 11
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[13px] text-red-500",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 858,
                                columnNumber: 21
                            }, this),
                            allEmpty && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setInputText('Estimate the Canadian corporate tax on 250,000 USD of income for tax year 2024.'),
                                className: "self-start rounded-lg border border-neutral-300 px-3 py-1.5 text-[12px] text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800",
                                children: "▶ Try: estimate tax on 250,000 USD (2024)"
                            }, void 0, false, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 861,
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
                                        lineNumber: 872,
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
                                                    lineNumber: 877,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/app/agent-lab/page.tsx",
                                            lineNumber: 875,
                                            columnNumber: 19
                                        }, this) : null)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 871,
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
                                        lineNumber: 887,
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
                                        lineNumber: 890,
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
                                        lineNumber: 901,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 886,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/agent-lab/page.tsx",
                        lineNumber: 793,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/agent-lab/page.tsx",
                lineNumber: 475,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/agent-lab/page.tsx",
        lineNumber: 459,
        columnNumber: 5
    }, this);
}
_s(AgentLabPage, "LK3vThyQZVrfvU5luFobfalUcm4=");
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
    const cachedTokens = msg.usage?.cachedInputTokens ?? 0;
    // Prefer the server's applied plan (authoritative — it knows Sina's auto pick); fall
    // back to a client recompute for older messages that predate the router.
    const applied = msg.applied ?? (()=>{
        const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$model$2d$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["planForModel"])(ctx.model, {
            effort: ctx.effort === 'auto' ? undefined : ctx.effort
        });
        return {
            model: ctx.model,
            auto: false,
            provider: p.provider,
            effort: p.effort,
            cache: p.cacheSystem,
            temperatureSent: p.sendTemperature
        };
    })();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-1.5 w-full max-w-[95%] rounded-lg border border-neutral-200 bg-white p-2 text-[11px] dark:border-neutral-800 dark:bg-neutral-950",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-1 font-semibold text-neutral-600 dark:text-neutral-300",
                children: "Where this came from"
            }, void 0, false, {
                fileName: "[project]/app/agent-lab/page.tsx",
                lineNumber: 933,
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
                lineNumber: 936,
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
                lineNumber: 940,
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
                lineNumber: 946,
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
                            lineNumber: 953,
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
                            lineNumber: 954,
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
                            lineNumber: 955,
                            columnNumber: 11
                        }, this)
                    ]
                }, j, true, {
                    fileName: "[project]/app/agent-lab/page.tsx",
                    lineNumber: 952,
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
                        lineNumber: 960,
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
                                        lineNumber: 966,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    applied.model,
                                    applied.auto ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-blue-600 dark:text-blue-400",
                                        children: [
                                            " · Sina auto → ",
                                            applied.tier,
                                            " (",
                                            applied.reason,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 967,
                                        columnNumber: 29
                                    }, this) : ''
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 965,
                                columnNumber: 11
                            }, this),
                            ctx.fiscal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: "Fiscal mode:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 971,
                                        columnNumber: 15
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-emerald-700 dark:text-emerald-400",
                                        children: "on"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 971,
                                        columnNumber: 35
                                    }, this),
                                    " · ",
                                    ctx.fiscal,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-neutral-400",
                                        children: " — non-negotiables enforced (cite · no self-computed figures · pinned · defer)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 972,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 970,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: "Model router:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 976,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    applied.provider,
                                    ' · ',
                                    "effort: ",
                                    applied.effort ?? 'model default',
                                    ' · ',
                                    "cache: ",
                                    applied.cache ? cachedTokens > 0 ? `hit (${cachedTokens.toLocaleString()} tok)` : 'on (no hit yet)' : 'off',
                                    ' · ',
                                    "temperature: ",
                                    applied.temperatureSent ? 'sent' : 'dropped (model rejects it)'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 975,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: "Context scope:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 982,
                                        columnNumber: 13
                                    }, this),
                                    ' ',
                                    ctx.scope === 'auto' && ctx.selection ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-blue-600 dark:text-blue-400",
                                        children: [
                                            "auto → folders ",
                                            ctx.selection.sentSections,
                                            "/",
                                            ctx.selection.totalSections,
                                            ", tools ",
                                            ctx.selection.sentTools,
                                            "/",
                                            ctx.selection.totalTools,
                                            " (",
                                            ctx.selection.reason,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 984,
                                        columnNumber: 15
                                    }, this) : 'send all (every enabled folder + tool)'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 981,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: "Tools available:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 992,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    ctx.enabledTools.length ? ctx.enabledTools.join(', ') : 'none'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 991,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: "Documents in context:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 995,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    docCount ? docNames.join(', ') : 'none'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 994,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: "Conversation:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 998,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    ctx.messageCount,
                                    " message",
                                    ctx.messageCount === 1 ? '' : 's'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 997,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: "System prompt:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 1001,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                        className: "mt-0.5 overflow-x-auto whitespace-pre-wrap",
                                        children: ctx.system
                                    }, void 0, false, {
                                        fileName: "[project]/app/agent-lab/page.tsx",
                                        lineNumber: 1002,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/agent-lab/page.tsx",
                                lineNumber: 1000,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/agent-lab/page.tsx",
                        lineNumber: 964,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/agent-lab/page.tsx",
                lineNumber: 959,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/agent-lab/page.tsx",
        lineNumber: 932,
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
                lineNumber: 1022,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/app/agent-lab/page.tsx",
        lineNumber: 1021,
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

//# sourceMappingURL=_745512dd._.js.map