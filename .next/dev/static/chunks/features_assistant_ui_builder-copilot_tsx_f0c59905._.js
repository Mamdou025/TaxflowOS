(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/assistant/ui/builder-copilot.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BuilderCopilot",
    ()=>BuilderCopilot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// ─────────────────────────────────────────────────────────────────────────────
// BuilderCopilot — headless per-page instrumentation for the Workflow Builder.
//
// Mounted by the builder page (inside the app-shell CopilotKit provider), it
// teaches the ambient assistant what's on the canvas and what the user has
// selected ("the thing they clicked on"), and gives it a full set of build verbs
// so the chat can command the builder end-to-end: focus/edit a block, add blocks
// from the catalog, wire them, delete, rename, load a built workflow, save, run.
// Renders nothing.
//
// GROUNDING: it also publishes the block catalog (valid block types the chat may
// add), the built workflows it can load, and a live health check (missing
// source/output, blocks not wired in) — so the model only proposes valid moves
// and can proactively surface + fix gaps.
//
// This is the Phase-4 pattern: each page registers its own useCopilotReadable
// (context) + useCopilotAction (capabilities); the follow-you-everywhere panel
// adapts for free because it reads whatever the current page published.
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@copilotkit+react-core@1.62_2b5035863a1cfdc26d5a4a9b28e91607/node_modules/@copilotkit/react-core/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/nanoid@5.1.6/node_modules/nanoid/index.browser.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/sonner@2.0.7_react-dom@19.2.1_react@19.2.1__react@19.2.1/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$builder$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/builder-bridge.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/shared/workflow-engine/local-fiscal-workflow.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$block$2d$catalog$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/block-catalog-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$portfolio$2f$portfolio$2d$workflows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/templates/portfolio/portfolio-workflows.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$page$2d$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/page-chat-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/state/workflow-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
// Config values can be huge (e.g. a source block's parsed rows). Summarize so the
// model gets shape, not a data dump.
function summarizeConfig(config) {
    if (!config) return {};
    const out = {};
    for (const [k, v] of Object.entries(config)){
        if (Array.isArray(v)) out[k] = `[${v.length} item${v.length === 1 ? '' : 's'}]`;
        else if (v && typeof v === 'object') out[k] = '{…}';
        else if (typeof v === 'string' && v.length > 120) out[k] = `${v.slice(0, 117)}…`;
        else out[k] = v;
    }
    return out;
}
// Parse an LLM-supplied config value: JSON when it parses, otherwise the raw string.
function parseValue(raw) {
    try {
        return JSON.parse(raw);
    } catch  {
        return raw;
    }
}
// The block types the chat may add, distilled from BLOCK_CATALOG once. `catalogId`
// is what addBlock takes. Static — the catalog doesn't change at runtime.
const CATALOG_SUMMARY = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$block$2d$catalog$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BLOCK_CATALOG"].map(_c = (item)=>({
        catalogId: item.id,
        family: item.family,
        subtype: item.subtype,
        label: item.label,
        description: item.description
    }));
_c1 = CATALOG_SUMMARY;
// The built workflows the chat can load onto the canvas (the run-config registry).
const BUILT_WORKFLOWS = Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WORKFLOW_CONFIGS"]).map(_c2 = ([id, cfg])=>({
        workflowId: id,
        name: cfg.name
    }));
_c3 = BUILT_WORKFLOWS;
// Sinaxe portfolio blueprints — also loadable onto the canvas via loadWorkflow,
// but structural (not runnable). Canadian Corporate Tax Portfolio + Platform Services.
const PORTFOLIO_BLUEPRINTS = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$portfolio$2f$portfolio$2d$workflows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PORTFOLIO_WORKFLOWS"].map(_c4 = (w)=>({
        workflowId: w.id,
        name: w.name,
        group: w.group,
        summary: w.sub
    }));
_c5 = PORTFOLIO_BLUEPRINTS;
// Cheap, deterministic structural health check — grounds the chat so it can say
// "your Currency Rate block isn't wired into anything" and offer to fix it.
function computeWorkflowHealth(nodes, edges) {
    const ids = new Set(nodes.map((n)=>n.id));
    const inbound = new Set(edges.map((e)=>e.target));
    const outbound = new Set(edges.map((e)=>e.source));
    const familyCounts = {};
    const notWiredIn = [];
    const noDownstream = [];
    for (const n of nodes){
        const family = n.data?.block?.family ?? 'Unknown';
        familyCounts[family] = (familyCounts[family] ?? 0) + 1;
        const label = n.data?.label ?? n.id;
        // Triggers/Sources legitimately have no input; Outputs/Review legitimately
        // have no output — everything else with a dangling side is a wiring gap.
        if (family !== 'Trigger' && family !== 'Source' && !inbound.has(n.id)) {
            notWiredIn.push({
                id: n.id,
                label
            });
        }
        if (family !== 'Output' && family !== 'Review / Validation' && !outbound.has(n.id)) {
            noDownstream.push({
                id: n.id,
                label
            });
        }
    }
    const danglingEdges = edges.filter((e)=>!ids.has(e.source) || !ids.has(e.target)).map((e)=>e.id);
    const hasSource = (familyCounts.Source ?? 0) > 0;
    const hasOutput = (familyCounts.Output ?? 0) > 0;
    const issues = [];
    if (!hasSource) issues.push('No Source block — the workflow has no evidence input.');
    if (!hasOutput) issues.push('No Output block — the workflow produces no final result.');
    for (const b of notWiredIn)issues.push(`"${b.label}" has no incoming connection (not wired into the flow).`);
    for (const b of noDownstream)issues.push(`"${b.label}" has no outgoing connection (its result feeds nothing downstream).`);
    for (const id of danglingEdges)issues.push(`Edge ${id} references a block that no longer exists.`);
    return {
        familyCounts,
        hasSource,
        hasOutput,
        notWiredIn,
        noDownstream,
        issues
    };
}
// Compact "workflow at a glance" card — what the builder looks like when the chat
// brings it INTO the conversation (the Page ⇄ Chat Embed). Reads the live atoms so
// it stays in sync while docked in the thread.
function WorkflowGlance() {
    _s();
    const nodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nodesAtom"]);
    const edges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["edgesAtom"]);
    const name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["currentWorkflowNameAtom"]);
    const health = computeWorkflowHealth(nodes, edges);
    const families = Object.entries(health.familyCounts);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '14px 16px',
            color: '#27272a'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 13.5,
                    fontWeight: 650
                },
                children: name || 'Untitled workflow'
            }, void 0, false, {
                fileName: "[project]/features/assistant/ui/builder-copilot.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 12,
                    color: '#71717a',
                    marginTop: 2
                },
                children: [
                    nodes.length,
                    " block",
                    nodes.length === 1 ? '' : 's',
                    " · ",
                    edges.length,
                    " connection",
                    edges.length === 1 ? '' : 's'
                ]
            }, void 0, true, {
                fileName: "[project]/features/assistant/ui/builder-copilot.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                    marginTop: 10
                },
                children: families.map(([fam, n])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 11,
                            padding: '2px 8px',
                            borderRadius: 999,
                            background: 'rgba(0,0,0,0.05)',
                            color: '#3f3f46'
                        },
                        children: [
                            fam,
                            " · ",
                            n
                        ]
                    }, fam, true, {
                        fileName: "[project]/features/assistant/ui/builder-copilot.tsx",
                        lineNumber: 159,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/features/assistant/ui/builder-copilot.tsx",
                lineNumber: 157,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 12
                },
                children: health.issues.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 12,
                        color: '#15803d'
                    },
                    children: "✓ No structural issues."
                }, void 0, false, {
                    fileName: "[project]/features/assistant/ui/builder-copilot.tsx",
                    lineNumber: 166,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 11,
                                fontWeight: 600,
                                color: '#b45309',
                                marginBottom: 4
                            },
                            children: [
                                health.issues.length,
                                " issue",
                                health.issues.length === 1 ? '' : 's'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/assistant/ui/builder-copilot.tsx",
                            lineNumber: 169,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            style: {
                                margin: 0,
                                paddingLeft: 16,
                                fontSize: 12,
                                color: '#71717a',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            },
                            children: health.issues.slice(0, 6).map((issue)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: issue
                                }, issue, false, {
                                    fileName: "[project]/features/assistant/ui/builder-copilot.tsx",
                                    lineNumber: 174,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/features/assistant/ui/builder-copilot.tsx",
                            lineNumber: 172,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/features/assistant/ui/builder-copilot.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/assistant/ui/builder-copilot.tsx",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
_s(WorkflowGlance, "D/2Z94q51tgUWVn57AaaAxKx2ww=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"]
    ];
});
_c6 = WorkflowGlance;
function BuilderCopilot() {
    _s1();
    const nodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nodesAtom"]);
    const edges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["edgesAtom"]);
    const selectedId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectedNodeAtom"]);
    const workflowName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["currentWorkflowNameAtom"]);
    const unsaved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasUnsavedChangesAtom"]);
    const bridge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$builder$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["builderBridgeAtom"]);
    const setNodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nodesAtom"]);
    const setEdges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["edgesAtom"]);
    const setSelectedNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectedNodeAtom"]);
    const setSelectedEdge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectedEdgeAtom"]);
    const setSelectedExecutionId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectedExecutionIdAtom"]);
    const setFocusNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["focusNodeIdAtom"]);
    const setCurrentWorkflowName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["currentWorkflowNameAtom"]);
    const setHasUnsavedChanges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasUnsavedChangesAtom"]);
    const updateNodeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateNodeDataAtom"]);
    const addNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addNodeAtom"]);
    const connectBlocks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["connectBlocksAtom"]);
    const deleteNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteNodeAtom"]);
    const blocks = nodes.map((n)=>({
            id: n.id,
            label: n.data?.label ?? n.id,
            family: n.data?.block?.family,
            subtype: n.data?.block?.subtype,
            status: n.data?.status ?? 'idle'
        }));
    const selectedNode = nodes.find((n)=>n.id === selectedId) ?? null;
    const health = computeWorkflowHealth(nodes, edges);
    // The whole workflow on the canvas — name, block roster, wiring, selection.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotReadable"])({
        description: 'The workflow currently open in the Workflow Builder canvas: its name, whether it has unsaved changes, every block (id, label, family, subtype, status), the connections between blocks, and which block is selected. This is what the user is building right now.',
        value: {
            workflowName,
            unsavedChanges: unsaved,
            blockCount: blocks.length,
            blocks,
            connections: edges.map({
                "BuilderCopilot.useCopilotReadable": (e)=>({
                        from: e.source,
                        to: e.target
                    })
            }["BuilderCopilot.useCopilotReadable"]),
            selectedBlockId: selectedId
        }
    });
    // The selected block ("the thing they clicked on") in full detail.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotReadable"])({
        description: 'The block the user has selected/clicked in the builder, with its editable config. Null when nothing is selected. Use this to answer "what is this block / what does it do" and to edit the right block.',
        value: selectedNode ? {
            id: selectedNode.id,
            label: selectedNode.data?.label,
            family: selectedNode.data?.block?.family,
            subtype: selectedNode.data?.block?.subtype,
            description: selectedNode.data?.block?.description,
            status: selectedNode.data?.status,
            config: summarizeConfig(selectedNode.data?.config)
        } : 'No block is selected on the canvas.'
    });
    // GROUNDING — the valid block types the chat may add via addBlock. The model
    // must pass one of these catalogId values; families group them.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotReadable"])({
        description: 'The catalog of block types that can be added to the builder with the addBlock action. Each entry has a catalogId (pass this to addBlock), family, subtype, label and description. Only these catalogIds are valid.',
        value: CATALOG_SUMMARY
    });
    // GROUNDING — the pre-built (runnable) workflows the chat can open with loadWorkflow.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotReadable"])({
        description: 'The pre-built RUNNABLE workflows that can be opened onto the canvas with the loadWorkflow action, by workflowId (fapi, roulement, expense, campaign). Loading one replaces whatever is currently open.',
        value: BUILT_WORKFLOWS
    });
    // GROUNDING — the Sinaxe portfolio blueprints, also loadable via loadWorkflow.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotReadable"])({
        description: 'The Sinaxe portfolio blueprints (Canadian Corporate Tax Workflow Portfolio + Platform Services) that can ALSO be opened onto the canvas with loadWorkflow, by workflowId (e.g. "pf-t1134", "pf-scope-service"). These are structural, editable templates — not runnable. Loading one replaces whatever is open.',
        value: PORTFOLIO_BLUEPRINTS
    });
    // GROUNDING — live health/validation so the chat can flag + fix gaps proactively.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotReadable"])({
        description: "A live validation check of the open workflow: family counts, whether it has a Source and an Output, which blocks are not wired in / feed nothing downstream, and a human-readable list of issues. Use this to proactively tell the user what's incomplete and offer to fix it.",
        value: health
    });
    // ── Page ⇄ Chat surface ──────────────────────────────────────────────────────
    // Opt the builder into the general contract: the chat can COMMAND it (checkHealth
    // / listBlocks, dispatched via commandPage) and BRING IT INTO the chat (the
    // WorkflowGlance Embed). The bespoke actions below stay the fine-grained edit
    // path; this is the uniform, discoverable page-level surface. Rebuilt only when
    // the workflow's structure/name changes (sig), so the chat hook stays quiet.
    const sig = nodes.map((n)=>`${n.id}:${n.data?.label}:${n.data?.block?.family}`).join('|') + '#' + edges.map((e)=>`${e.source}>${e.target}`).join('|');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$page$2d$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageChat"])({
        pageKey: 'workflow-builder',
        title: 'Workflow Builder',
        context: {
            workflowName,
            blockCount: blocks.length,
            connectionCount: edges.length,
            familyCounts: health.familyCounts,
            issues: health.issues
        },
        commands: [
            {
                id: 'checkHealth',
                label: 'Check workflow health',
                description: 'Return the structural issues in the open workflow (missing Source/Output, blocks not wired in or feeding nothing).',
                run: {
                    "BuilderCopilot.usePageChat": ()=>health.issues.length ? `Found ${health.issues.length} issue(s):\n- ${health.issues.join('\n- ')}` : 'No structural issues — the workflow looks well-formed.'
                }["BuilderCopilot.usePageChat"]
            },
            {
                id: 'listBlocks',
                label: 'List blocks',
                description: 'List every block on the canvas with its id, family and subtype.',
                run: {
                    "BuilderCopilot.usePageChat": ()=>blocks.length ? blocks.map({
                            "BuilderCopilot.usePageChat": (b)=>`${b.label} [${b.id}] — ${b.family} / ${b.subtype}`
                        }["BuilderCopilot.usePageChat"]).join('\n') : 'The canvas is empty.'
                }["BuilderCopilot.usePageChat"]
            }
        ],
        Embed: WorkflowGlance
    }, [
        workflowName,
        sig,
        blocks.length,
        edges.length,
        health.issues.length
    ]);
    // ── Actions ──────────────────────────────────────────────────────────────────
    // Select + scroll to + highlight a block by id.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"])({
        name: 'focusBlock',
        description: 'Select a block on the builder canvas and scroll to + center + highlight it. Use when the user wants to go to / look at / work on a specific block. blockId must be one of the block ids from the builder-workflow context.',
        followUp: false,
        parameters: [
            {
                name: 'blockId',
                type: 'string',
                description: 'the block id to focus',
                required: true
            }
        ],
        handler: {
            "BuilderCopilot.useCopilotAction": async ({ blockId })=>{
                const node = nodes.find({
                    "BuilderCopilot.useCopilotAction.node": (n)=>n.id === blockId
                }["BuilderCopilot.useCopilotAction.node"]);
                if (!node) return `No block "${blockId}" on the canvas.`;
                setSelectedNode(blockId);
                setFocusNode(blockId);
                return `Focused ${node.data?.label ?? blockId}.`;
            }
        }["BuilderCopilot.useCopilotAction"]
    });
    // Edit one config value on a block (merges into node.data.config, same path as
    // the inspector → autosaves + re-flows the engine).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"])({
        name: 'editBlockConfig',
        description: 'Change one configuration value on a builder block. Use for "set the FX rate on the currency block to 1.5", "rename this block", etc. value is parsed as JSON when possible (numbers/booleans/objects), else kept as text. blockId + key must exist in the builder context.',
        followUp: false,
        parameters: [
            {
                name: 'blockId',
                type: 'string',
                description: 'the block id to edit',
                required: true
            },
            {
                name: 'key',
                type: 'string',
                description: 'the config key to set (e.g. "overrideRate", "label")',
                required: true
            },
            {
                name: 'value',
                type: 'string',
                description: 'the new value (JSON-encoded where applicable)',
                required: true
            }
        ],
        handler: {
            "BuilderCopilot.useCopilotAction": async ({ blockId, key, value })=>{
                const node = nodes.find({
                    "BuilderCopilot.useCopilotAction.node": (n)=>n.id === blockId
                }["BuilderCopilot.useCopilotAction.node"]);
                if (!node) return `No block "${blockId}" on the canvas.`;
                const parsed = parseValue(value);
                // "label" lives on node.data directly; everything else is a config key.
                if (key === 'label') {
                    updateNodeData({
                        id: blockId,
                        data: {
                            label: String(parsed)
                        }
                    });
                } else {
                    updateNodeData({
                        id: blockId,
                        data: {
                            config: {
                                ...node.data?.config ?? {},
                                [key]: parsed
                            }
                        }
                    });
                }
                setSelectedNode(blockId);
                setFocusNode(blockId);
                return `Set ${key} = ${JSON.stringify(parsed)} on ${node.data?.label ?? blockId}.`;
            }
        }["BuilderCopilot.useCopilotAction"]
    });
    // Add a new block from the catalog onto the canvas.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"])({
        name: 'addBlock',
        description: 'Add a new block to the builder canvas from the catalog. catalogId MUST be one of the catalogId values in the block-catalog context (e.g. "source:currency-rate", "logic:transformation", "output:canonical-json"). Optionally give it a label. Returns the new block id — use it with connectBlocks to wire it in.',
        followUp: false,
        parameters: [
            {
                name: 'catalogId',
                type: 'string',
                description: 'catalog id of the block type to add (from the block-catalog context)',
                required: true
            },
            {
                name: 'label',
                type: 'string',
                description: 'optional custom label for the block',
                required: false
            }
        ],
        handler: {
            "BuilderCopilot.useCopilotAction": async ({ catalogId, label })=>{
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getBlockCatalogItem"])(catalogId)) {
                    return `"${catalogId}" is not a valid catalogId. Pick one from the block-catalog context (e.g. "source:currency-rate", "logic:transformation").`;
                }
                const maxX = nodes.length ? Math.max(...nodes.map({
                    "BuilderCopilot.useCopilotAction": (n)=>n.position?.x ?? 0
                }["BuilderCopilot.useCopilotAction"])) : 0;
                const baseY = nodes[0]?.position?.y ?? 160;
                const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])();
                const block = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createWorkflowBlockFromCatalog"])(catalogId, {
                    id,
                    label,
                    position: {
                        x: maxX + 320,
                        y: baseY + nodes.length % 4 * 90
                    }
                });
                addNode((0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createWorkflowNodeFromBlock"])(block, {
                    selected: true
                }));
                setSelectedNode(id);
                setFocusNode(id);
                setHasUnsavedChanges(true);
                return `Added ${block.label} (${block.family} / ${block.subtype}) as block "${id}". Wire it in with connectBlocks.`;
            }
        }["BuilderCopilot.useCopilotAction"]
    });
    // Connect two blocks (creates an edge source → target).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"])({
        name: 'connectBlocks',
        description: 'Wire one block into another by creating a connection from sourceBlockId to targetBlockId (data flows source → target). Both ids must exist on the canvas (see the builder-workflow context).',
        followUp: false,
        parameters: [
            {
                name: 'sourceBlockId',
                type: 'string',
                description: 'the upstream block the connection comes FROM',
                required: true
            },
            {
                name: 'targetBlockId',
                type: 'string',
                description: 'the downstream block the connection goes TO',
                required: true
            }
        ],
        handler: {
            "BuilderCopilot.useCopilotAction": async ({ sourceBlockId, targetBlockId })=>{
                if (sourceBlockId === targetBlockId) return 'A block cannot be connected to itself.';
                const source = nodes.find({
                    "BuilderCopilot.useCopilotAction.source": (n)=>n.id === sourceBlockId
                }["BuilderCopilot.useCopilotAction.source"]);
                const target = nodes.find({
                    "BuilderCopilot.useCopilotAction.target": (n)=>n.id === targetBlockId
                }["BuilderCopilot.useCopilotAction.target"]);
                if (!source) return `No block "${sourceBlockId}" on the canvas.`;
                if (!target) return `No block "${targetBlockId}" on the canvas.`;
                if (edges.some({
                    "BuilderCopilot.useCopilotAction": (e)=>e.source === sourceBlockId && e.target === targetBlockId
                }["BuilderCopilot.useCopilotAction"])) {
                    return `${source.data?.label ?? sourceBlockId} is already connected to ${target.data?.label ?? targetBlockId}.`;
                }
                connectBlocks({
                    source: sourceBlockId,
                    target: targetBlockId
                });
                setHasUnsavedChanges(true);
                return `Connected ${source.data?.label ?? sourceBlockId} → ${target.data?.label ?? targetBlockId}.`;
            }
        }["BuilderCopilot.useCopilotAction"]
    });
    // Delete a block (Source evidence is protected, mirroring the studio's rule).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"])({
        name: 'deleteBlock',
        description: 'Delete a block from the canvas by id (also removes its connections). Source blocks are read-only evidence and cannot be deleted — add downstream Logic to correct them instead.',
        followUp: false,
        parameters: [
            {
                name: 'blockId',
                type: 'string',
                description: 'the block id to delete',
                required: true
            }
        ],
        handler: {
            "BuilderCopilot.useCopilotAction": async ({ blockId })=>{
                const node = nodes.find({
                    "BuilderCopilot.useCopilotAction.node": (n)=>n.id === blockId
                }["BuilderCopilot.useCopilotAction.node"]);
                if (!node) return `No block "${blockId}" on the canvas.`;
                if (node.data?.block?.family === 'Source') {
                    return `"${node.data?.label ?? blockId}" is a Source (read-only evidence) and cannot be deleted. Add downstream Logic to correct or reinterpret it instead.`;
                }
                deleteNode(blockId);
                setHasUnsavedChanges(true);
                return `Deleted ${node.data?.label ?? blockId}.`;
            }
        }["BuilderCopilot.useCopilotAction"]
    });
    // Rename the whole workflow.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"])({
        name: 'renameWorkflow',
        description: 'Rename the workflow currently open in the builder.',
        followUp: false,
        parameters: [
            {
                name: 'name',
                type: 'string',
                description: 'the new workflow name',
                required: true
            }
        ],
        handler: {
            "BuilderCopilot.useCopilotAction": async ({ name })=>{
                const trimmed = name.trim();
                if (!trimmed) return 'Workflow name cannot be empty.';
                setCurrentWorkflowName(trimmed);
                setHasUnsavedChanges(true);
                return `Renamed the workflow to "${trimmed}".`;
            }
        }["BuilderCopilot.useCopilotAction"]
    });
    // Load a pre-built workflow onto the canvas (replaces what's open).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"])({
        name: 'loadWorkflow',
        description: 'Open a pre-built workflow OR a Sinaxe portfolio blueprint onto the builder canvas, replacing whatever is currently open. workflowId is either a runnable id ("fapi", "roulement", "expense", "campaign") or a blueprint id from the portfolio-blueprints context (e.g. "pf-t1134", "pf-scope-service", "pf-eifel").',
        followUp: false,
        parameters: [
            {
                name: 'workflowId',
                type: 'string',
                description: 'id of the workflow or blueprint to open',
                required: true
            }
        ],
        handler: {
            "BuilderCopilot.useCopilotAction": async ({ workflowId })=>{
                const cfg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getWorkflowConfig"])(workflowId);
                const snapshot = cfg ? cfg.buildSnapshot() : (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createPortfolioWorkflowById"])(workflowId);
                if (!snapshot) {
                    return `"${workflowId}" is not a known workflow. Runnable: ${BUILT_WORKFLOWS.map({
                        "BuilderCopilot.useCopilotAction": (w)=>w.workflowId
                    }["BuilderCopilot.useCopilotAction"]).join(', ')}. Blueprints: ${PORTFOLIO_BLUEPRINTS.map({
                        "BuilderCopilot.useCopilotAction": (w)=>w.workflowId
                    }["BuilderCopilot.useCopilotAction"]).join(', ')}.`;
                }
                const canvas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["workflowDefinitionToCanvas"])(snapshot);
                const selected = canvas.nodes.find({
                    "BuilderCopilot.useCopilotAction": (n)=>n.selected
                }["BuilderCopilot.useCopilotAction"]) || canvas.nodes[0];
                setNodes(canvas.nodes.map({
                    "BuilderCopilot.useCopilotAction": (node)=>({
                            ...node,
                            selected: selected ? node.id === selected.id : false,
                            data: {
                                ...node.data,
                                status: 'idle'
                            }
                        })
                }["BuilderCopilot.useCopilotAction"]));
                setEdges(canvas.edges);
                setCurrentWorkflowName(snapshot.name);
                setSelectedNode(selected?.id ?? null);
                setSelectedEdge(null);
                setSelectedExecutionId(null);
                setHasUnsavedChanges(false);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["saveWorkflowDefinitionSnapshot"])(snapshot);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Opened ${snapshot.name}`);
                return `Opened "${snapshot.name}" (${canvas.nodes.length} blocks) on the canvas.`;
            }
        }["BuilderCopilot.useCopilotAction"]
    });
    // Save the current draft.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"])({
        name: 'saveWorkflow',
        description: 'Save the workflow currently open in the builder (persists the local draft).',
        followUp: false,
        parameters: [],
        handler: {
            "BuilderCopilot.useCopilotAction": async ()=>{
                if (!bridge) return "The builder isn't ready yet — try again in a moment.";
                bridge.save();
                return 'Saved the workflow.';
            }
        }["BuilderCopilot.useCopilotAction"]
    });
    // Run the current workflow. NB: named distinctly from the chat's `runWorkflow`
    // (use-assistant) — both register on /builder (docked panel + this), and two
    // CopilotKit actions sharing a name collide, one silently shadowing the other.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"])({
        name: 'runBuilderWorkflow',
        description: 'Run/execute the workflow currently open in the visual builder canvas (no arguments — it runs whatever is on the canvas). For running a NAMED workflow from the chat, use runWorkflow instead.',
        followUp: false,
        parameters: [],
        handler: {
            "BuilderCopilot.useCopilotAction": async ()=>{
                if (!bridge) return "The builder isn't ready yet — try again in a moment.";
                if (bridge.isExecuting) return 'The workflow is already running.';
                bridge.run();
                return 'Started the workflow run.';
            }
        }["BuilderCopilot.useCopilotAction"]
    });
    return null;
}
_s1(BuilderCopilot, "tef6guRsUmB1PM5mqIi7jLmQUbI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotReadable"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotReadable"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotReadable"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotReadable"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotReadable"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotReadable"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$page$2d$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageChat"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotAction"]
    ];
});
_c7 = BuilderCopilot;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "CATALOG_SUMMARY$BLOCK_CATALOG.map");
__turbopack_context__.k.register(_c1, "CATALOG_SUMMARY");
__turbopack_context__.k.register(_c2, "BUILT_WORKFLOWS$Object.entries(WORKFLOW_CONFIGS).map");
__turbopack_context__.k.register(_c3, "BUILT_WORKFLOWS");
__turbopack_context__.k.register(_c4, "PORTFOLIO_BLUEPRINTS$PORTFOLIO_WORKFLOWS.map");
__turbopack_context__.k.register(_c5, "PORTFOLIO_BLUEPRINTS");
__turbopack_context__.k.register(_c6, "WorkflowGlance");
__turbopack_context__.k.register(_c7, "BuilderCopilot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=features_assistant_ui_builder-copilot_tsx_f0c59905._.js.map