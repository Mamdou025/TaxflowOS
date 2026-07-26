(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/shared/stores/page-menu-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pageMenusAtom",
    ()=>pageMenusAtom,
    "usePageMenu",
    ()=>usePageMenu
]);
// Page-menu contract — lets an inline page publish its menu into the shared panel
// header (instead of drawing its own toolbar/sidebar inside the narrow panel body
// that shares width with the chat). The page calls usePageMenu(pageKey, menu, deps)
// and the ChatWorkspace panel header renders the ACTIVE tab's menu.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const pageMenusAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])({});
function usePageMenu(key, menu, deps = []) {
    _s();
    const set = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(pageMenusAtom);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePageMenu.useEffect": ()=>{
            set({
                "usePageMenu.useEffect": (prev)=>({
                        ...prev,
                        [key]: menu
                    })
            }["usePageMenu.useEffect"]);
            return ({
                "usePageMenu.useEffect": ()=>set({
                        "usePageMenu.useEffect": (prev)=>{
                            const next = {
                                ...prev
                            };
                            delete next[key];
                            return next;
                        }
                    }["usePageMenu.useEffect"])
            })["usePageMenu.useEffect"];
        // menu is intentionally rebuilt from `deps`; key/set are stable.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["usePageMenu.useEffect"], [
        key,
        set,
        ...deps
    ]);
}
_s(usePageMenu, "mSVZZ4ARpDvkpdwEttaC21+3Wyo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/agent-hub/agent-hub-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "agentTabAtom",
    ()=>agentTabAtom
]);
// Shared state for the Agent surface — the header tabs (usePageMenu) and the body
// read one source of truth for the active tab.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-client] (ecmascript)");
'use client';
;
const agentTabAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])('overview');
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
"[project]/features/agent-hub/agent-page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AgentPage",
    ()=>AgentPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// AgentPage — the "Agent" surface: see EVERYTHING about the one live agent (Sina) and
// configure it. Mirrors the Workflows surface: the tabs (Overview · Build) are published
// into the panel header via usePageMenu; the body is just the active tab's content.
//   • Overview — what Sina knows, what it can do (tools), what it sees (context), its
//     models/routing, and its active fiscal guardrails + prompt layers. Read-only truth.
//   • Build — the live-agent config (fiscal mode + context · extra instructions · model ·
//     effort). Writes agentConfigAtom, which the live chat reads. Reset restores defaults.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/wrench.js [app-client] (ecmascript) <export default as Wrench>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/cpu.js [app-client] (ecmascript) <export default as Cpu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/neumorphic-sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$page$2d$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/stores/page-menu-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$hub$2f$agent$2d$hub$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/agent-hub/agent-hub-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$agent$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/runtime/agent-config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/agent-lab/fiscal.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$model$2d$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/agent-lab/model-router.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
const TAB_LABELS = [
    {
        id: 'overview',
        label: 'Overview'
    },
    {
        id: 'build',
        label: 'Build'
    },
    {
        id: 'lab',
        label: 'Lab'
    }
];
// ── Curated introspection data (kept in sync with the live wiring) ───────────────
// The domains Sina absorbed (was Sofi/Théo/Mira/Nova), from agents/specialists.ts.
const DOMAINS = [
    'FAPI — foreign accrual property income (classify the trial balance, the FAPI line build, FX → CAD, reviewed net FAPI)',
    'Section 85 rollover (roulement, art. 85) — elected-amount bounds PBR↔FMV, deferred gain, T2057',
    'Employee expense reimbursement — per-diem caps, policy, net payable',
    'Marketing campaign budgets — channel classification, elect the approved budget'
];
// The system-prompt sections Sina always carries (from INSTRUCTIONS() in assistant-thread.tsx).
const PROMPT_SECTIONS = [
    'Identity — "You are Sina, the assistant inside InScope"',
    'Style — acknowledge first, then act; concise, professional',
    'Intent — ask vs. do (a workflow NAME is not a command; never act on a guess)',
    'Tool routing — runWorkflow / openPage / focusAnchor / editField / generateUI',
    'Grounding — never invent a value; read from the provided contexts',
    'Memory — use remembered facts; save only when asked',
    'Expertise — the four domains above (per-turn "domain focus")',
    'Registered pages + editable fields (only reference ids that exist)'
];
// Actions the live agent can call (client-executed useCopilotAction, from use-assistant.tsx + friends).
const TOOLS = [
    [
        'runWorkflow',
        'Propose / start a workflow run in the chat (FAPI · rollover · expense · campaign)'
    ],
    [
        'editField',
        'Bring an editable worksheet field into the chat (e.g. the FX rate)'
    ],
    [
        'openPage',
        'Open a registered worksheet / page beside the chat'
    ],
    [
        'focusAnchor',
        'Scroll to + highlight a figure or section on a page'
    ],
    [
        'generateUI',
        'Generate a one-off view — dashboard, chart, table, or form (OpenUI)'
    ],
    [
        'explainWorksheetLine · whyWorksheetValue',
        'Explain a computed line / the operands behind a value'
    ],
    [
        'searchWorksheet',
        'Search the open worksheet'
    ],
    [
        'commandPage · bringIntoChat',
        'Drive a page from the chat / pull a page surface in'
    ],
    [
        'showWorkflowElement',
        'Pin a workflow source or output into the thread'
    ],
    [
        'rememberFact · forgetFact',
        'Durable, per-client memory (Postgres)'
    ],
    [
        'focusBlock · addBlock · editBlockConfig · connectBlocks',
        'Builder actions (only on the workflow builder)'
    ]
];
// Context the live agent is given each turn (useCopilotReadable).
const CONTEXT = [
    'Current route / open pages & windows',
    'The active workflow run + its LIVE figures (categories, computed lines, summary)',
    'Attached documents — full extracted text (PDF / Word / Excel / text)',
    'Every editable field + its current value (FX rate, inclusion rate, …)',
    'Live snapshots of all workflows (engine-computed on-screen numbers)',
    'The Sinaxe portfolio blueprints (15 workflows)',
    'Remembered facts & preferences (durable memory, scoped to the current client)'
];
function Section({ icon, title, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].surface,
            borderRadius: 16,
            boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].shadowSm,
            padding: '18px 20px',
            marginBottom: 14
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            display: 'grid',
                            placeItems: 'center',
                            width: 26,
                            height: 26,
                            borderRadius: 8,
                            background: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].bg,
                            boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].shadowSm,
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].accent
                        },
                        children: icon
                    }, void 0, false, {
                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 14,
                            fontWeight: 700,
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].text
                        },
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/agent-hub/agent-page.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/features/agent-hub/agent-page.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
_c = Section;
function Bullets({ items }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 7
        },
        children: items.map((it, i)=>{
            const [head, tail] = Array.isArray(it) ? it : [
                null,
                it
            ];
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: 8,
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].muted
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].accent,
                            flexShrink: 0
                        },
                        children: "•"
                    }, void 0, false, {
                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                        lineNumber: 100,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            head && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                style: {
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].text,
                                    fontWeight: 600
                                },
                                children: head
                            }, void 0, false, {
                                fileName: "[project]/features/agent-hub/agent-page.tsx",
                                lineNumber: 102,
                                columnNumber: 24
                            }, this),
                            head && ' — ',
                            tail
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                        lineNumber: 101,
                        columnNumber: 13
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/features/agent-hub/agent-page.tsx",
                lineNumber: 99,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/features/agent-hub/agent-page.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_c1 = Bullets;
// ── Overview tab ─────────────────────────────────────────────────────────────
function AgentOverview() {
    _s();
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$agent$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["agentConfigAtom"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'absolute',
            inset: 0,
            overflowY: 'auto'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                maxWidth: 860,
                margin: '0 auto',
                padding: '24px 28px 56px'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                        size: 15
                    }, void 0, false, {
                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                        lineNumber: 119,
                        columnNumber: 24
                    }, void 0),
                    title: "Identity — one unified agent",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 13,
                                lineHeight: 1.6,
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].muted,
                                marginBottom: 10
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                    style: {
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].text
                                    },
                                    children: "Sina"
                                }, void 0, false, {
                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                    lineNumber: 121,
                                    columnNumber: 13
                                }, this),
                                " is the single assistant in the workspace. It absorbed the former specialists (Sofi / Théo / Mira / Nova) — there are no separate agents. Each turn it applies the relevant ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                    style: {
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].text
                                    },
                                    children: "domain focus"
                                }, void 0, false, {
                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                    lineNumber: 122,
                                    columnNumber: 107
                                }, this),
                                ":"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Bullets, {
                            items: DOMAINS
                        }, void 0, false, {
                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                        size: 15
                    }, void 0, false, {
                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                        lineNumber: 127,
                        columnNumber: 24
                    }, void 0),
                    title: "What it's told — system-prompt layers",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 12.5,
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].muted,
                                marginBottom: 8
                            },
                            children: [
                                "Every turn the live prompt = base instructions ",
                                config.fiscalMode ? '+ fiscal guardrails ' : '',
                                config.extraInstructions.trim() ? '+ operator additions' : '',
                                ". Base sections:"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                            lineNumber: 128,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Bullets, {
                            items: PROMPT_SECTIONS
                        }, void 0, false, {
                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                            lineNumber: 129,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: 12,
                                display: 'flex',
                                gap: 8,
                                flexWrap: 'wrap'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                                    on: config.fiscalMode,
                                    label: config.fiscalMode ? `Fiscal guardrails: ON · ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fiscalSummary"])(config.fiscal)}` : 'Fiscal guardrails: off'
                                }, void 0, false, {
                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                    lineNumber: 131,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                                    on: !!config.extraInstructions.trim(),
                                    label: config.extraInstructions.trim() ? 'Operator additions: set' : 'Operator additions: none'
                                }, void 0, false, {
                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                    lineNumber: 132,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                            lineNumber: 130,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"], {
                        size: 15
                    }, void 0, false, {
                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                        lineNumber: 136,
                        columnNumber: 24
                    }, void 0),
                    title: "What it can do — tools",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Bullets, {
                        items: TOOLS
                    }, void 0, false, {
                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                        lineNumber: 137,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                    lineNumber: 136,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                        size: 15
                    }, void 0, false, {
                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                        lineNumber: 140,
                        columnNumber: 24
                    }, void 0),
                    title: "What it sees — context each turn",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Bullets, {
                        items: CONTEXT
                    }, void 0, false, {
                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                        lineNumber: 141,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                    lineNumber: 140,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"], {
                        size: 15
                    }, void 0, false, {
                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                        lineNumber: 144,
                        columnNumber: 24
                    }, void 0),
                    title: "Models & routing",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Bullets, {
                        items: [
                            [
                                'Live model',
                                'the app default (env OPENAI_CHAT_MODEL, e.g. gpt-4o), via the Vercel AI Gateway when AI_GATEWAY_API_KEY is set'
                            ],
                            [
                                'Tiering',
                                'model-policy can pick fast (navigation) / standard / deep (tax reasoning) per turn — off until ASSISTANT_MODEL_FAST/DEEP are set'
                            ],
                            [
                                'Config override',
                                config.modelSpec ? `${config.modelSpec} · effort ${config.effort}  (stored; not yet driving the live model)` : 'none set (uses the app default)'
                            ]
                        ]
                    }, void 0, false, {
                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                        lineNumber: 145,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                    lineNumber: 144,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                        size: 15
                    }, void 0, false, {
                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                        lineNumber: 154,
                        columnNumber: 24
                    }, void 0),
                    title: "Fiscal guardrails (the non-negotiables)",
                    children: config.fiscalMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 12.5,
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].muted,
                                    marginBottom: 8
                                },
                                children: [
                                    "Active, pinned to ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].text
                                        },
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fiscalSummary"])(config.fiscal)
                                    }, void 0, false, {
                                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                                        lineNumber: 157,
                                        columnNumber: 100
                                    }, this),
                                    ". The live prompt carries:"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/agent-hub/agent-page.tsx",
                                lineNumber: 157,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                style: {
                                    whiteSpace: 'pre-wrap',
                                    fontSize: 11.5,
                                    lineHeight: 1.55,
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].muted,
                                    background: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].bg,
                                    boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].shadowSm,
                                    borderRadius: 10,
                                    padding: '12px 14px',
                                    margin: 0,
                                    maxHeight: 260,
                                    overflowY: 'auto'
                                },
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fiscalPreamble"])(config.fiscal)
                            }, void 0, false, {
                                fileName: "[project]/features/agent-hub/agent-page.tsx",
                                lineNumber: 158,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12.5,
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].muted
                        },
                        children: [
                            "Off. Turn it on in ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                style: {
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].text
                                },
                                children: "Build"
                            }, void 0, false, {
                                fileName: "[project]/features/agent-hub/agent-page.tsx",
                                lineNumber: 161,
                                columnNumber: 82
                            }, this),
                            " to make Sina cite its authority, never self-compute figures, pin every answer to a tax year/jurisdiction, and defer on elections."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                        lineNumber: 161,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                    lineNumber: 154,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/agent-hub/agent-page.tsx",
            lineNumber: 118,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/agent-hub/agent-page.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, this);
}
_s(AgentOverview, "Tbgf2Ocz1pjYurusPHuETRVileg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"]
    ];
});
_c2 = AgentOverview;
function Pill({ on, label }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            fontSize: 11,
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: 999,
            background: on ? 'var(--sx-accent-soft)' : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].bg,
            boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].shadowSm,
            color: on ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].accent : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].faint
        },
        children: label
    }, void 0, false, {
        fileName: "[project]/features/agent-hub/agent-page.tsx",
        lineNumber: 171,
        columnNumber: 5
    }, this);
}
_c3 = Pill;
// ── Build tab — writes the live-agent config ─────────────────────────────────
const inputStyle = {
    width: '100%',
    background: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].bg,
    boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].shadowIn,
    border: 'none',
    borderRadius: 10,
    padding: '9px 11px',
    fontSize: 13,
    color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].text,
    outline: 'none'
};
const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].muted,
    display: 'block',
    marginBottom: 5
};
function AgentBuild() {
    _s1();
    const [config, setConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$agent$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["agentConfigAtom"]);
    const set = (k, v)=>setConfig((c)=>({
                ...c,
                [k]: v
            }));
    const setFiscal = (k, v)=>setConfig((c)=>({
                ...c,
                fiscal: {
                    ...c.fiscal,
                    [k]: v
                }
            }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'absolute',
            inset: 0,
            overflowY: 'auto'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                maxWidth: 720,
                margin: '0 auto',
                padding: '24px 28px 56px'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 12.5,
                        color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].muted,
                        marginBottom: 16
                    },
                    children: [
                        "These settings configure the ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                            style: {
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].text
                            },
                            children: "live"
                        }, void 0, false, {
                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                            lineNumber: 187,
                            columnNumber: 106
                        }, this),
                        " Sina — they persist and take effect in the chat immediately (fiscal + instructions). Model & effort are stored but do not yet drive the live model."
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                    lineNumber: 187,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                        size: 15
                    }, void 0, false, {
                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                        lineNumber: 189,
                        columnNumber: 24
                    }, void 0),
                    title: "Fiscal guardrails",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            style: {
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 8,
                                fontSize: 12.5,
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].text
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "checkbox",
                                    style: {
                                        marginTop: 2
                                    },
                                    checked: config.fiscalMode,
                                    onChange: (e)=>set('fiscalMode', e.target.checked)
                                }, void 0, false, {
                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                    lineNumber: 191,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Enforce the fiscalist non-negotiables — cite the authority · never self-compute figures · pin tax year / jurisdiction / entity · defer on elections · flag uncertainty."
                                }, void 0, false, {
                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                    lineNumber: 192,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                            lineNumber: 190,
                            columnNumber: 11
                        }, this),
                        config.fiscalMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: 14,
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 10
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: labelStyle,
                                            children: "Tax year"
                                        }, void 0, false, {
                                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                                            lineNumber: 196,
                                            columnNumber: 20
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            style: inputStyle,
                                            type: "number",
                                            min: 2000,
                                            max: 2100,
                                            value: config.fiscal.taxYear,
                                            onChange: (e)=>setFiscal('taxYear', Number(e.target.value))
                                        }, void 0, false, {
                                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                                            lineNumber: 196,
                                            columnNumber: 60
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                    lineNumber: 196,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: labelStyle,
                                            children: "Province / jurisdiction"
                                        }, void 0, false, {
                                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                                            lineNumber: 197,
                                            columnNumber: 20
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            style: inputStyle,
                                            value: config.fiscal.province,
                                            onChange: (e)=>setFiscal('province', e.target.value),
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROVINCES"].map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: p.code,
                                                    children: p.label
                                                }, p.code, false, {
                                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 211
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                                            lineNumber: 197,
                                            columnNumber: 75
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                    lineNumber: 197,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: labelStyle,
                                            children: "Entity type"
                                        }, void 0, false, {
                                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                                            lineNumber: 198,
                                            columnNumber: 20
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            style: inputStyle,
                                            value: config.fiscal.entityType,
                                            onChange: (e)=>setFiscal('entityType', e.target.value),
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_TYPES"].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: t,
                                                    children: t
                                                }, t, false, {
                                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                                    lineNumber: 198,
                                                    columnNumber: 206
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                                            lineNumber: 198,
                                            columnNumber: 63
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                    lineNumber: 198,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: labelStyle,
                                            children: "Residency"
                                        }, void 0, false, {
                                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                                            lineNumber: 199,
                                            columnNumber: 20
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            style: inputStyle,
                                            value: config.fiscal.residency,
                                            onChange: (e)=>setFiscal('residency', e.target.value),
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RESIDENCY"].map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: r,
                                                    children: r
                                                }, r, false, {
                                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                                    lineNumber: 199,
                                                    columnNumber: 199
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                                            lineNumber: 199,
                                            columnNumber: 61
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                    lineNumber: 199,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: labelStyle,
                                            children: "Reporting currency"
                                        }, void 0, false, {
                                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                                            lineNumber: 200,
                                            columnNumber: 20
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            style: inputStyle,
                                            value: config.fiscal.currency,
                                            onChange: (e)=>setFiscal('currency', e.target.value),
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$fiscal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CURRENCIES"].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: c,
                                                    children: c
                                                }, c, false, {
                                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                                    lineNumber: 200,
                                                    columnNumber: 207
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                                            lineNumber: 200,
                                            columnNumber: 70
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                    lineNumber: 200,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                            lineNumber: 195,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                    lineNumber: 189,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                        size: 15
                    }, void 0, false, {
                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                        lineNumber: 205,
                        columnNumber: 24
                    }, void 0),
                    title: "Operator instructions",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: labelStyle,
                            children: "Appended to Sina's system prompt for every turn."
                        }, void 0, false, {
                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                            lineNumber: 206,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            style: {
                                ...inputStyle,
                                minHeight: 96,
                                resize: 'vertical',
                                fontFamily: 'inherit',
                                lineHeight: 1.5
                            },
                            value: config.extraInstructions,
                            onChange: (e)=>set('extraInstructions', e.target.value),
                            placeholder: "e.g. Always answer in French. Prefer Revenu Québec sources for provincial questions."
                        }, void 0, false, {
                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                            lineNumber: 207,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                    lineNumber: 205,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"], {
                        size: 15
                    }, void 0, false, {
                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                        lineNumber: 210,
                        columnNumber: 24
                    }, void 0),
                    title: "Model & effort",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 11.5,
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].faint,
                                marginBottom: 10
                            },
                            children: "Stored + shown in Overview. Not yet driving the live model (a verified CopilotKit client→forwardedProps path is a follow-up)."
                        }, void 0, false, {
                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                            lineNumber: 211,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 10
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: labelStyle,
                                            children: "Model spec"
                                        }, void 0, false, {
                                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                                            lineNumber: 213,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            style: inputStyle,
                                            value: config.modelSpec,
                                            onChange: (e)=>set('modelSpec', e.target.value),
                                            placeholder: "app default (e.g. anthropic/claude-opus-4-8)"
                                        }, void 0, false, {
                                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                                            lineNumber: 213,
                                            columnNumber: 60
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                    lineNumber: 213,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: labelStyle,
                                            children: "Effort (Anthropic)"
                                        }, void 0, false, {
                                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                                            lineNumber: 214,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            style: inputStyle,
                                            value: config.effort,
                                            onChange: (e)=>set('effort', e.target.value),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "auto",
                                                    children: "auto"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 189
                                                }, this),
                                                __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$model$2d$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EFFORT_LEVELS"].map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: l,
                                                        children: l
                                                    }, l, false, {
                                                        fileName: "[project]/features/agent-hub/agent-page.tsx",
                                                        lineNumber: 214,
                                                        columnNumber: 249
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                                            lineNumber: 214,
                                            columnNumber: 68
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                                    lineNumber: 214,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                            lineNumber: 212,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                    lineNumber: 210,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setConfig(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$agent$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_LIVE_AGENT_CONFIG"]),
                    style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 7,
                        border: 'none',
                        cursor: 'pointer',
                        background: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].bg,
                        boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].shadowSm,
                        color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].muted,
                        fontSize: 12.5,
                        fontWeight: 600,
                        borderRadius: 11,
                        padding: '9px 15px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/features/agent-hub/agent-page.tsx",
                            lineNumber: 219,
                            columnNumber: 11
                        }, this),
                        " Reset to defaults"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/agent-hub/agent-page.tsx",
                    lineNumber: 218,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/agent-hub/agent-page.tsx",
            lineNumber: 186,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/agent-hub/agent-page.tsx",
        lineNumber: 185,
        columnNumber: 5
    }, this);
}
_s1(AgentBuild, "DXKx7S4h9o1T6uS1a3GdS02Zm38=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"]
    ];
});
_c4 = AgentBuild;
function AgentPage() {
    _s2();
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$hub$2f$agent$2d$hub$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["agentTabAtom"]);
    const left = [
        {
            kind: 'label',
            id: 'agent-name',
            text: 'Sina',
            strong: true,
            width: 120
        },
        {
            kind: 'separator',
            id: 'sep'
        },
        ...TAB_LABELS.map((t)=>({
                kind: 'button',
                id: `tab-${t.id}`,
                label: t.label,
                active: tab === t.id,
                onClick: ()=>setTab(t.id)
            }))
    ];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$page$2d$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageMenu"])('agent', {
        left
    }, [
        tab
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'relative',
            height: '100%',
            background: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].bg,
            fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif"
        },
        children: tab === 'build' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AgentBuild, {}, void 0, false, {
            fileName: "[project]/features/agent-hub/agent-page.tsx",
            lineNumber: 239,
            columnNumber: 26
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AgentOverview, {}, void 0, false, {
            fileName: "[project]/features/agent-hub/agent-page.tsx",
            lineNumber: 239,
            columnNumber: 43
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/agent-hub/agent-page.tsx",
        lineNumber: 238,
        columnNumber: 5
    }, this);
}
_s2(AgentPage, "dqds8GtAautbB4DOfdWX0V/sYj0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$page$2d$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageMenu"]
    ];
});
_c5 = AgentPage;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "Section");
__turbopack_context__.k.register(_c1, "Bullets");
__turbopack_context__.k.register(_c2, "AgentOverview");
__turbopack_context__.k.register(_c3, "Pill");
__turbopack_context__.k.register(_c4, "AgentBuild");
__turbopack_context__.k.register(_c5, "AgentPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/agent-hub/agent-hub.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AgentHub
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// Thin default export for the resource registry's lazyPage loader.
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$hub$2f$agent$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/agent-hub/agent-page.tsx [app-client] (ecmascript)");
'use client';
;
;
function AgentHub() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$hub$2f$agent$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AgentPage"], {}, void 0, false, {
        fileName: "[project]/features/agent-hub/agent-hub.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, this);
}
_c = AgentHub;
var _c;
__turbopack_context__.k.register(_c, "AgentHub");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_4efddf3a._.js.map