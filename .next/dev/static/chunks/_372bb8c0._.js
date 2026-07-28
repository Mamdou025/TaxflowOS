(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/shared/stores/inline-page-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InlinePageProvider",
    ()=>InlinePageProvider,
    "useInlinePage",
    ()=>useInlinePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// Tells a page whether it's rendered INLINE inside the Scope panel (vs its own
// full-page route). Inline pages hide their own chrome (toolbar/sidebar) and
// publish their menu into the shared panel header via usePageMenu instead.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const InlinePageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(false);
function InlinePageProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InlinePageContext.Provider, {
        value: true,
        children: children
    }, void 0, false, {
        fileName: "[project]/shared/stores/inline-page-context.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = InlinePageProvider;
function useInlinePage() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(InlinePageContext);
}
_s(useInlinePage, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "InlinePageProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/features/assistant/ui/worksheet-copilot.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorksheetCopilot",
    ()=>WorksheetCopilot
]);
// ─────────────────────────────────────────────────────────────────────────────
// WorksheetCopilot — generic, headless per-worksheet instrumentation.
//
// Mount this inside ANY template-driven worksheet (pass its TemplateConfig + live
// rows/inputs) and the assistant can answer questions about it — values, formulas,
// operand breakdowns, provenance, and derivation traces — WITHOUT the sheet being
// pasted into context. Renders nothing.
//
//   • Publishes ONE ambient readable: the live computed snapshot (Layer 1).
//   • Registers a live `WorksheetIntel` in the shared registry so the assistant's
//     global explainWorksheetLine / whyWorksheetValue / searchWorksheet actions
//     (in use-assistant) can dispatch to it. Action NAMES stay unique + support
//     any number of worksheets open at once; the readable tells the model the id.
//
// Backed by createTemplateIntel → the SAME runTemplateCore the sheet renders, so
// the numbers the assistant reports always match the UI. Replaces the FAPI-only
// FapiWorksheetCopilot; works for FAPI, Roulement, and any future TemplateConfig
// with zero per-worksheet code. See audit/UI.md · audit/FEATURES.md.
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@copilotkit+react-core@1.62_2b5035863a1cfdc26d5a4a9b28e91607/node_modules/@copilotkit/react-core/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$intel$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/worksheets/intel/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$intel$2f$template$2d$adapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/worksheets/intel/template-adapter.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$intel$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/worksheets/intel/registry.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function WorksheetCopilot({ config, rows, inputs, overrides }) {
    _s();
    const register = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$intel$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerWorksheetIntelAtom"]);
    const unregister = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$intel$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unregisterWorksheetIntelAtom"]);
    // Rebuild (and recompute the run once) whenever the sheet's rows/inputs/overrides change.
    const intel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WorksheetCopilot.useMemo[intel]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$worksheets$2f$intel$2f$template$2d$adapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTemplateIntel"])(config, {
                rows,
                inputs,
                overrides,
                live: true
            })
    }["WorksheetCopilot.useMemo[intel]"], [
        config,
        rows,
        inputs,
        overrides
    ]);
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WorksheetCopilot.useMemo[snapshot]": ()=>intel.describe()
    }["WorksheetCopilot.useMemo[snapshot]"], [
        intel
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorksheetCopilot.useEffect": ()=>{
            register(intel);
            return ({
                "WorksheetCopilot.useEffect": ()=>unregister(intel.id)
            })["WorksheetCopilot.useEffect"];
        }
    }["WorksheetCopilot.useEffect"], [
        intel,
        register,
        unregister
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotReadable"])({
        description: `The "${config.name}" worksheet the user is looking at, fully computed from the live engine (worksheet id "${config.id}"): every line (code, label, current value), the results summary (with a CAD column where the sheet converts), the FX rate, whether the source is an uploaded file or the sample, how many source rows were classified vs left unmatched, and the classification buckets. These ARE the on-screen numbers — answer questions about current values from this. For the exact formula, the operand values behind a line, or the source rows mapped into it, call explainWorksheetLine / whyWorksheetValue with worksheet="${config.id}".`,
        value: snapshot
    });
    return null;
}
_s(WorksheetCopilot, "XDfggL5i8YBHrCpvGV2pyi6xYlE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useCopilotReadable"]
    ];
});
_c = WorksheetCopilot;
var _c;
__turbopack_context__.k.register(_c, "WorksheetCopilot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/worksheets/components/fapi-worksheet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FapiWorksheet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// ─────────────────────────────────────────────────────────────────────────────
// FAPI Worksheet — the fiscalist's worksheet, rebuilt in the main app.
//
// Platform's line structure (FX · A · EXP · B · 95(2) · A.1 · A.2 · C · D · E ·
// F · F.1 · G · H · FAT) rendered in our design language: monochrome, refined
// hairlines + soft elevation, and TONED DOTS as the only colour (source · engine
// · manual · AI-mapped). Wired to the REAL engine over the shared uploaded rows,
// so the worksheet, chat run, and builder canvas all show identical numbers.
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/git-branch.js [app-client] (ecmascript) <export default as GitBranch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/engine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/fapi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$parse$2d$upload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/parse-upload.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$workspace$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/stores/workspace-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/state/workflow-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$inline$2d$page$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/stores/inline-page-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$page$2d$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/stores/page-menu-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$ui$2f$worksheet$2d$copilot$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/ui/worksheet-copilot.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
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
;
;
;
const INK = 'var(--sx-ink)', MUTED = 'var(--sx-muted)', FAINT = 'var(--sx-faint)';
const LINE = 'var(--sx-hairline)', HAIRLINE = 'var(--sx-hairline-subtle)';
// Pastel, discreet — dots read as a quiet accent, not a signal light.
const TONES = {
    source: '#7fb2d9',
    engine: '#7cc3a6',
    manual: '#dab06c',
    ai: '#a892d6'
};
function hexA(hex, a) {
    const h = hex.replace('#', '');
    return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}
const money = (n)=>n.toLocaleString('en-CA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
const rate = (n)=>n.toLocaleString('en-CA', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 6
    });
const SRC = 'fapi-source-fx-rate', INP = 'fapi-source-inputs', LINES = 'fapi-logic-lines-engine', SUM = 'fapi-logic-summary-engine';
const SECTIONS = [
    {
        title: 'Currency conversion',
        lines: [
            {
                code: 'FX',
                key: 'FX_RATE',
                label: 'Annual average FX rate (USD → CAD)',
                tone: 'source',
                block: SRC,
                edit: {
                    key: 'fxRate'
                },
                isRate: true
            }
        ]
    },
    {
        title: 'Property income',
        lines: [
            {
                code: 'A',
                key: 'A',
                label: 'Property income',
                tone: 'engine',
                block: LINES,
                sub: 'income'
            }
        ]
    },
    {
        title: 'Deductible expenses',
        lines: [
            {
                code: 'EXP',
                key: 'EXPENSES',
                label: 'Deductible expenses',
                tone: 'engine',
                block: LINES,
                sub: 'expense'
            }
        ]
    },
    {
        title: 'Component B',
        lines: [
            {
                code: 'B',
                key: 'B',
                label: 'Gains on disposition (derived)',
                tone: 'engine',
                block: LINES,
                sub: 'capgains'
            }
        ]
    },
    {
        title: 'Canadian 95(2) rules',
        lines: [
            {
                code: '95(2)',
                key: 'COMPUTATION_95_4',
                label: 'Canadian 95(2) rules amount',
                tone: 'manual',
                block: INP,
                edit: {
                    key: 'canadianRules95_4'
                }
            }
        ]
    },
    {
        title: 'Other income components',
        lines: [
            {
                code: 'A.1',
                key: 'A1',
                label: 'Debt forgiveness (× 2)',
                tone: 'manual',
                block: INP,
                edit: {
                    key: 'debtForgiveness',
                    toInput: (v)=>v / 2
                }
            },
            {
                code: 'A.2',
                key: 'A2',
                label: 'Prior-year G',
                tone: 'manual',
                block: INP,
                edit: {
                    key: 'priorYearG'
                }
            },
            {
                code: 'C',
                key: 'C',
                label: 'Controlled foreign affiliate income',
                tone: 'manual',
                block: INP,
                edit: {
                    key: 'cfaIncome'
                }
            }
        ]
    },
    {
        title: 'Advanced deductions',
        lines: [
            {
                code: 'D',
                key: 'D',
                label: 'Business losses',
                tone: 'manual',
                block: INP,
                edit: {
                    key: 'businessLosses'
                }
            },
            {
                code: 'E',
                key: 'E',
                label: 'FACL carryforward',
                tone: 'manual',
                block: INP,
                edit: {
                    key: 'faclCarryforward'
                }
            },
            {
                code: 'F',
                key: 'F',
                label: 'Prescribed amount',
                tone: 'manual',
                block: INP,
                edit: {
                    key: 'prescribedAmount'
                }
            },
            {
                code: 'F.1',
                key: 'F1',
                label: 'Prescribed amount (F.1)',
                tone: 'manual',
                block: INP,
                edit: {
                    key: 'prescribedAmountF1'
                }
            },
            {
                code: 'G',
                key: 'G',
                label: 'Dividend deductions',
                tone: 'manual',
                block: INP,
                edit: {
                    key: 'dividendDeductions'
                }
            },
            {
                code: 'H',
                key: 'H',
                label: 'Partnership dividends',
                tone: 'manual',
                block: INP,
                edit: {
                    key: 'partnershipDividends'
                }
            }
        ]
    },
    {
        title: 'FAT calculation',
        lines: [
            {
                code: 'FAT',
                key: 'FAT_PAID',
                label: 'Foreign accrual tax paid',
                tone: 'manual',
                block: INP,
                edit: {
                    key: 'fatPaid'
                }
            }
        ]
    }
];
const TONE_LABEL = {
    source: 'Source',
    engine: 'Engine',
    manual: 'Manual',
    ai: 'AI mapped'
};
function Dot({ tone }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: TONES[tone],
            flexShrink: 0
        }
    }, void 0, false, {
        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
        lineNumber: 81,
        columnNumber: 10
    }, this);
}
_c = Dot;
function AmountCell({ value, edit, onCommit, isRate }) {
    _s();
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const text = isRate ? rate(value) : money(value);
    if (!edit) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            fontSize: 12.5,
            color: INK,
            fontVariantNumeric: 'tabular-nums'
        },
        children: text
    }, void 0, false, {
        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
        lineNumber: 87,
        columnNumber: 21
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        value: draft ?? text,
        onChange: (e)=>setDraft(e.target.value),
        onFocus: (e)=>{
            setDraft(String(value));
            e.currentTarget.select();
        },
        onBlur: ()=>{
            if (draft != null) {
                const n = Number(draft.replace(/,/g, ''));
                if (Number.isFinite(n)) onCommit(n);
            }
            setDraft(null);
        },
        onKeyDown: (e)=>{
            if (e.key === 'Enter') e.target.blur();
        },
        inputMode: "decimal",
        style: {
            width: 110,
            textAlign: 'right',
            fontSize: 12.5,
            fontVariantNumeric: 'tabular-nums',
            color: INK,
            background: 'transparent',
            border: `1px solid transparent`,
            borderRadius: 6,
            padding: '3px 7px',
            outline: 'none',
            cursor: 'text'
        },
        onMouseEnter: (e)=>{
            e.currentTarget.style.borderColor = LINE;
        },
        onMouseLeave: (e)=>{
            if (document.activeElement !== e.currentTarget) e.currentTarget.style.borderColor = 'transparent';
        }
    }, void 0, false, {
        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
_s(AmountCell, "IMJA9vn+YxmdGkFFJr1np5GMSDg=");
_c1 = AmountCell;
function FapiWorksheet() {
    _s1();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [uploaded, setUploaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$workspace$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadedRowsAtom"]);
    const setBuilderFocus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["builderFocusTargetAtom"]);
    const [parsing, setParsing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fileInput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const stored = uploaded[__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_CONFIG"].id];
    const rows = stored?.rows?.length ? stored.rows : __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_CONFIG"].sampleRows;
    // Inputs + category overrides are SHARED with the chat run via runEditsAtom, so a
    // rate change, live-fetched FX, or re-categorization made during the run shows up
    // here too — and edits here flow back to the run. Rows already share via
    // uploadedRowsAtom; these are the run's other two decision surfaces.
    //
    // Only inputs that are SAFE to default are seeded. Classification-fed inputs
    // (lines A.1 / C / D / E) are produced by the rollup — seeding their default here
    // would inject it into the block config and clobber the classified value. They
    // enter `inputs` only once the user actually edits that line (via the shared
    // edits); until then the line shows the classified figure via `val()`, and
    // runTemplateCore's guard still protects it if it lands at its default.
    const edits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$workspace$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runEditsAtom"])[__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_CONFIG"].id] ?? __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$workspace$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_RUN_EDITS"];
    const setRunInput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$workspace$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setRunInputAtom"]);
    const defaults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FapiWorksheet.useMemo[defaults]": ()=>Object.fromEntries((__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_CONFIG"].editableInputs ?? []).filter({
                "FapiWorksheet.useMemo[defaults]": (i)=>!i.classificationFed
            }["FapiWorksheet.useMemo[defaults]"]).map({
                "FapiWorksheet.useMemo[defaults]": (i)=>[
                        i.key,
                        i.default
                    ]
            }["FapiWorksheet.useMemo[defaults]"]))
    }["FapiWorksheet.useMemo[defaults]"], []);
    const inputs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FapiWorksheet.useMemo[inputs]": ()=>({
                ...defaults,
                ...edits.inputs
            })
    }["FapiWorksheet.useMemo[inputs]"], [
        defaults,
        edits.inputs
    ]);
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sourcesOpen, setSourcesOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const core = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FapiWorksheet.useMemo[core]": ()=>{
            try {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runTemplateCore"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_CONFIG"], {
                    rows,
                    overrides: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildOverrideRules"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_CONFIG"], rows, edits.overrides),
                    inputs
                });
            } catch  {
                return null;
            }
        }
    }["FapiWorksheet.useMemo[core]"], [
        rows,
        inputs,
        edits.overrides
    ]);
    const cur = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_CONFIG"].currency;
    const fx = core?.summaryValues.FX_RATE ?? inputs.fxRate ?? 1;
    const val = (key)=>core ? core.lineValues[key] ?? core.summaryValues[key] ?? 0 : 0;
    const setInput = (key, v)=>setRunInput({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_CONFIG"].id,
            key,
            value: v
        });
    const openBuilder = (blockId)=>{
        setBuilderFocus({
            workflowId: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_CONFIG"].id,
            blockId
        });
        router.push('/builder');
    };
    // Inline in the Scope panel → publish the toolbar into the shared header instead
    // of drawing it in the worksheet body (which shares width with the chat).
    const embedded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$inline$2d$page$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInlinePage"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$page$2d$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageMenu"])('fapi', embedded ? {
        right: [
            {
                kind: 'button',
                id: 'import',
                label: parsing ? 'Parsing…' : 'Import',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                    lineNumber: 150,
                    columnNumber: 85
                }, this),
                onClick: {
                    "FapiWorksheet.usePageMenu": ()=>fileInput.current?.click()
                }["FapiWorksheet.usePageMenu"],
                disabled: parsing
            },
            {
                kind: 'button',
                id: 'sources',
                label: 'Sources',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                    lineNumber: 151,
                    columnNumber: 64
                }, this),
                active: sourcesOpen,
                onClick: {
                    "FapiWorksheet.usePageMenu": ()=>setSourcesOpen({
                            "FapiWorksheet.usePageMenu": (o)=>!o
                        }["FapiWorksheet.usePageMenu"])
                }["FapiWorksheet.usePageMenu"]
            },
            {
                kind: 'button',
                id: 'builder',
                label: 'Builder',
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                    lineNumber: 152,
                    columnNumber: 64
                }, this),
                onClick: {
                    "FapiWorksheet.usePageMenu": ()=>openBuilder(LINES)
                }["FapiWorksheet.usePageMenu"]
            }
        ]
    } : {}, [
        embedded,
        parsing,
        sourcesOpen
    ]);
    const onImport = async (e)=>{
        const f = e.target.files?.[0];
        if (e.target) e.target.value = '';
        if (!f) return;
        setParsing(true);
        try {
            const { rows: parsed, fileName } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$parse$2d$upload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseUploadToRows"])(f);
            if (parsed.length) setUploaded((p)=>({
                    ...p,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_CONFIG"].id]: {
                        fileName,
                        rows: parsed,
                        at: Date.now()
                    }
                }));
        } catch  {} finally{
            setParsing(false);
        }
    };
    const subRows = (kind)=>{
        const m = core?.detail.mapped ?? [];
        const isCap = (c)=>/cap|gain/i.test(c);
        if (kind === 'income') return m.filter((r)=>r.amount > 0 && !isCap(r.category));
        if (kind === 'expense') return m.filter((r)=>r.amount < 0);
        if (kind === 'capgains') return m.filter((r)=>isCap(r.category));
        return [];
    };
    const summaryRows = [
        {
            key: 'GROSS',
            label: 'Gross',
            bold: false
        },
        {
            key: 'DEDUCTIONS',
            label: 'Deductions',
            bold: false
        },
        {
            key: 'FAPI_BRUT',
            label: 'FAPI brut',
            bold: true
        },
        {
            key: 'FAT_DEDUCTION',
            label: 'FAT deduction',
            bold: false
        },
        {
            key: 'NET_FAPI',
            label: 'Net FAPI',
            bold: true
        }
    ];
    const cadOf = (key, v)=>key === 'NET_FAPI' ? core?.summaryValues.NET_FAPI_CAD ?? v * fx : v * fx;
    const chipStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11.5,
        fontWeight: 500,
        color: MUTED,
        background: 'var(--sx-card)',
        border: `1px solid ${LINE}`,
        borderRadius: 8,
        padding: '5px 11px'
    };
    const toolBtn = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        fontWeight: 500,
        color: INK,
        background: 'var(--sx-card)',
        border: `1px solid ${LINE}`,
        borderRadius: 8,
        padding: '6px 11px',
        cursor: 'pointer'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: '100%',
            background: 'var(--sx-raised)',
            padding: '28px 20px 80px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$ui$2f$worksheet$2d$copilot$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorksheetCopilot"], {
                config: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_CONFIG"],
                rows: rows,
                inputs: inputs,
                overrides: edits.overrides
            }, void 0, false, {
                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                lineNumber: 191,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `@keyframes wsspin{to{transform:rotate(360deg)}} .ws-spin{animation:wsspin .9s linear infinite} .ws-row:hover{background:rgba(24,24,27,0.022)} .dark .ws-row:hover{background:rgba(255,255,255,0.03)} .ws-row:hover .ws-trace{opacity:1} .ws-src-sel{background:rgba(24,24,27,0.035)} .dark .ws-src-sel{background:rgba(255,255,255,0.06)}`
            }, void 0, false, {
                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                lineNumber: 192,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    maxWidth: sourcesOpen ? 1400 : 960,
                    margin: '0 auto',
                    display: 'flex',
                    gap: 16,
                    alignItems: 'flex-start',
                    transition: 'max-width 220ms'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            minWidth: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 18
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 10.5,
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                            color: FAINT
                                        },
                                        children: "FAPI Worksheet"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                        lineNumber: 198,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 22,
                                            fontWeight: 680,
                                            color: INK,
                                            letterSpacing: '-0.01em',
                                            marginTop: 3
                                        },
                                        children: "Foreign accrual property income"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                        lineNumber: 199,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            alignItems: 'center',
                                            gap: 8,
                                            marginTop: 13
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: chipStyle,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: FAINT,
                                                            fontSize: 9.5,
                                                            fontWeight: 700,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.04em'
                                                        },
                                                        children: "Company"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                        lineNumber: 201,
                                                        columnNumber: 37
                                                    }, this),
                                                    " CANCO"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                lineNumber: 201,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: chipStyle,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: FAINT,
                                                            fontSize: 9.5,
                                                            fontWeight: 700,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.04em'
                                                        },
                                                        children: "Affiliate"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                        lineNumber: 202,
                                                        columnNumber: 37
                                                    }, this),
                                                    " SAS Paris"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                lineNumber: 202,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: chipStyle,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: FAINT,
                                                            fontSize: 9.5,
                                                            fontWeight: 700,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.04em'
                                                        },
                                                        children: "FAPI year"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                        lineNumber: 203,
                                                        columnNumber: 37
                                                    }, this),
                                                    " 2025"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                lineNumber: 203,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    flex: 1
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                lineNumber: 204,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                ref: fileInput,
                                                type: "file",
                                                accept: ".xlsx,.xls",
                                                style: {
                                                    display: 'none'
                                                },
                                                onChange: onImport,
                                                disabled: parsing
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                lineNumber: 206,
                                                columnNumber: 13
                                            }, this),
                                            !embedded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        style: {
                                                            ...toolBtn,
                                                            background: parsing ? MUTED : '#18181b',
                                                            color: '#fff',
                                                            border: 'none'
                                                        },
                                                        onClick: ()=>fileInput.current?.click(),
                                                        disabled: parsing,
                                                        children: [
                                                            parsing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                size: 13,
                                                                className: "ws-spin"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                lineNumber: 210,
                                                                columnNumber: 30
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                                size: 13
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                lineNumber: 210,
                                                                columnNumber: 74
                                                            }, this),
                                                            " ",
                                                            parsing ? 'Parsing…' : 'Import'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                        lineNumber: 209,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        style: toolBtn,
                                                        onClick: ()=>openBuilder(LINES),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"], {
                                                                size: 13
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                lineNumber: 212,
                                                                columnNumber: 76
                                                            }, this),
                                                            " Builder"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                        lineNumber: 212,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        style: sourcesOpen ? {
                                                            ...toolBtn,
                                                            background: '#18181b',
                                                            color: '#fff',
                                                            border: 'none'
                                                        } : toolBtn,
                                                        onClick: ()=>setSourcesOpen((o)=>!o),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                                                size: 13
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                lineNumber: 213,
                                                                columnNumber: 168
                                                            }, this),
                                                            " Sources"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                        lineNumber: 213,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        style: {
                                                            ...toolBtn,
                                                            color: FAINT,
                                                            cursor: 'not-allowed'
                                                        },
                                                        title: "Assistant — coming soon",
                                                        disabled: true,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                                size: 13
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                lineNumber: 214,
                                                                columnNumber: 126
                                                            }, this),
                                                            " Assistant"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                        lineNumber: 214,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                        lineNumber: 200,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 11,
                                            color: FAINT,
                                            marginTop: 9
                                        },
                                        children: stored?.rows?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                "Source: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    style: {
                                                        color: MUTED,
                                                        fontWeight: 600
                                                    },
                                                    children: stored.fileName
                                                }, void 0, false, {
                                                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                    lineNumber: 219,
                                                    columnNumber: 47
                                                }, this),
                                                " · ",
                                                stored.rows.length,
                                                " rows"
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                "Source: sample trial balance (",
                                                __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_CONFIG"].sampleRows.length,
                                                " rows) — Import a workbook to use your own."
                                            ]
                                        }, void 0, true)
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                        lineNumber: 218,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                lineNumber: 197,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: 'var(--sx-card)',
                                    border: `1px solid ${LINE}`,
                                    borderRadius: 16,
                                    boxShadow: '0 1px 2px rgba(24,24,27,0.04), 0 12px 32px rgba(24,24,27,0.05)',
                                    overflow: 'hidden'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '10px 20px',
                                            borderBottom: `1px solid ${HAIRLINE}`,
                                            background: 'var(--sx-raised)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: 74,
                                                    fontSize: 9.5,
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    color: FAINT
                                                },
                                                children: "Line"
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                lineNumber: 227,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    flex: 1,
                                                    fontSize: 9.5,
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    color: FAINT
                                                },
                                                children: "Description"
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                lineNumber: 228,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: 130,
                                                    textAlign: 'right',
                                                    fontSize: 9.5,
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    color: FAINT
                                                },
                                                children: "Amount"
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                lineNumber: 229,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: 48,
                                                    textAlign: 'right',
                                                    fontSize: 9.5,
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    color: FAINT
                                                },
                                                children: "Ccy"
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                lineNumber: 230,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                        lineNumber: 226,
                                        columnNumber: 11
                                    }, this),
                                    SECTIONS.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        padding: '11px 20px 4px',
                                                        fontSize: 9.5,
                                                        fontWeight: 700,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.06em',
                                                        color: FAINT
                                                    },
                                                    children: section.title
                                                }, void 0, false, {
                                                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                    lineNumber: 235,
                                                    columnNumber: 15
                                                }, this),
                                                section.lines.map((ln)=>{
                                                    const isOpen = expanded === ln.key;
                                                    const canExpand = Boolean(ln.sub);
                                                    const v = val(ln.key);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "ws-row",
                                                                style: {
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    padding: '9px 20px',
                                                                    borderTop: `1px solid ${HAIRLINE}`,
                                                                    cursor: canExpand ? 'pointer' : 'default',
                                                                    transition: 'background 140ms'
                                                                },
                                                                onClick: canExpand ? ()=>setExpanded(isOpen ? null : ln.key) : undefined,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            width: 74,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 8
                                                                        },
                                                                        children: [
                                                                            canExpand ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                                size: 13,
                                                                                style: {
                                                                                    color: FAINT,
                                                                                    transform: isOpen ? 'rotate(90deg)' : 'none',
                                                                                    transition: 'transform 150ms',
                                                                                    flexShrink: 0
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                                lineNumber: 244,
                                                                                columnNumber: 38
                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    width: 13,
                                                                                    flexShrink: 0
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                                lineNumber: 244,
                                                                                columnNumber: 184
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                                                                                tone: ln.tone
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                                lineNumber: 245,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontSize: 10.5,
                                                                                    fontWeight: 650,
                                                                                    color: MUTED,
                                                                                    background: 'var(--sx-panel)',
                                                                                    border: `1px solid ${HAIRLINE}`,
                                                                                    borderRadius: 5,
                                                                                    padding: '1px 6px',
                                                                                    fontVariantNumeric: 'tabular-nums'
                                                                                },
                                                                                children: ln.code
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                                lineNumber: 246,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                        lineNumber: 243,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            flex: 1,
                                                                            minWidth: 0,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 8
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontSize: 12.5,
                                                                                    color: INK
                                                                                },
                                                                                children: ln.label
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                                lineNumber: 249,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                className: "ws-trace",
                                                                                onClick: (e)=>{
                                                                                    e.stopPropagation();
                                                                                    openBuilder(ln.block);
                                                                                },
                                                                                title: `Trace ${ln.code} in the builder`,
                                                                                style: {
                                                                                    opacity: 0,
                                                                                    transition: 'opacity 140ms',
                                                                                    display: 'inline-flex',
                                                                                    alignItems: 'center',
                                                                                    gap: 3,
                                                                                    fontSize: 10,
                                                                                    color: FAINT,
                                                                                    background: 'none',
                                                                                    border: 'none',
                                                                                    cursor: 'pointer',
                                                                                    padding: 0
                                                                                },
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"], {
                                                                                        size: 10
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                                        lineNumber: 250,
                                                                                        columnNumber: 362
                                                                                    }, this),
                                                                                    " trace"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                                lineNumber: 250,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                        lineNumber: 248,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            width: 130,
                                                                            display: 'flex',
                                                                            justifyContent: 'flex-end'
                                                                        },
                                                                        onClick: (e)=>e.stopPropagation(),
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AmountCell, {
                                                                            value: v,
                                                                            edit: ln.edit,
                                                                            isRate: ln.isRate,
                                                                            onCommit: (n)=>setInput(ln.edit.key, ln.edit.toInput ? ln.edit.toInput(n) : n)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                            lineNumber: 253,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                        lineNumber: 252,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            width: 48,
                                                                            textAlign: 'right',
                                                                            fontSize: 10.5,
                                                                            fontWeight: 600,
                                                                            color: FAINT
                                                                        },
                                                                        children: ln.isRate ? 'RATE' : cur
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                        lineNumber: 255,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                lineNumber: 242,
                                                                columnNumber: 21
                                                            }, this),
                                                            isOpen && canExpand && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    padding: '4px 20px 10px 102px',
                                                                    background: 'var(--sx-raised)',
                                                                    borderTop: `1px solid ${HAIRLINE}`
                                                                },
                                                                children: [
                                                                    subRows(ln.sub).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontSize: 11,
                                                                            color: FAINT,
                                                                            padding: '6px 0'
                                                                        },
                                                                        children: "No classified rows in this bucket yet."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                        lineNumber: 259,
                                                                        columnNumber: 58
                                                                    }, this),
                                                                    subRows(ln.sub).map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            style: {
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                gap: 8,
                                                                                padding: '4px 0'
                                                                            },
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                                                                                    tone: "ai"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                                    lineNumber: 262,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    style: {
                                                                                        fontSize: 11.5,
                                                                                        color: INK,
                                                                                        flex: 1,
                                                                                        minWidth: 0
                                                                                    },
                                                                                    children: [
                                                                                        r.label,
                                                                                        r.keyword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            style: {
                                                                                                color: FAINT,
                                                                                                fontSize: 10,
                                                                                                marginLeft: 6
                                                                                            },
                                                                                            children: [
                                                                                                "matched “",
                                                                                                r.keyword,
                                                                                                "” · ",
                                                                                                Math.round((r.confidence || 0) * 100),
                                                                                                "%"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                                            lineNumber: 264,
                                                                                            columnNumber: 45
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                                    lineNumber: 263,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    style: {
                                                                                        fontSize: 11.5,
                                                                                        color: MUTED,
                                                                                        fontVariantNumeric: 'tabular-nums'
                                                                                    },
                                                                                    children: [
                                                                                        money(Math.abs(r.amount)),
                                                                                        " ",
                                                                                        cur
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                                    lineNumber: 266,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, r.rowId, true, {
                                                                            fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                            lineNumber: 261,
                                                                            columnNumber: 27
                                                                        }, this)),
                                                                    ln.sub === 'income' && (core?.detail.unmatched.length ?? 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 8,
                                                                            padding: '4px 0',
                                                                            color: '#b08248'
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    width: 5,
                                                                                    height: 5,
                                                                                    borderRadius: '50%',
                                                                                    border: `1px solid ${hexA(TONES.manual, 0.85)}`,
                                                                                    boxSizing: 'border-box'
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                                lineNumber: 271,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontSize: 11,
                                                                                    flex: 1
                                                                                },
                                                                                children: [
                                                                                    core?.detail.unmatched.length,
                                                                                    " unclassified row(s) — not in any line"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                                lineNumber: 272,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                        lineNumber: 270,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    ln.sub === 'income' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AssumptionRow, {
                                                                        label: "P-coefficient",
                                                                        value: inputs.pCoefficient,
                                                                        step: 0.05,
                                                                        onCommit: (n)=>setInput('pCoefficient', n)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                        lineNumber: 275,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    ln.sub === 'capgains' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AssumptionRow, {
                                                                        label: "Inclusion rate",
                                                                        value: inputs.inclusionRate,
                                                                        step: 0.05,
                                                                        onCommit: (n)=>setInput('inclusionRate', n)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                        lineNumber: 276,
                                                                        columnNumber: 51
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                lineNumber: 258,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, ln.key, true, {
                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                        lineNumber: 241,
                                                        columnNumber: 19
                                                    }, this);
                                                })
                                            ]
                                        }, section.title, true, {
                                            fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                            lineNumber: 234,
                                            columnNumber: 13
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            borderTop: `2px solid ${LINE}`,
                                            background: 'var(--sx-raised)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '11px 20px 6px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: 9.5,
                                                            fontWeight: 700,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.06em',
                                                            color: FAINT
                                                        },
                                                        children: "Results summary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                        lineNumber: 288,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            marginLeft: 'auto',
                                                            fontSize: 10.5,
                                                            color: FAINT
                                                        },
                                                        children: [
                                                            "FX ",
                                                            rate(fx),
                                                            " · Net FAPI shown at the annual-average rate"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                        lineNumber: 289,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        style: {
                                                            marginLeft: 12,
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: 5,
                                                            fontSize: 11,
                                                            color: MUTED,
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                size: 11
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                lineNumber: 290,
                                                                columnNumber: 187
                                                            }, this),
                                                            " Export"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                        lineNumber: 290,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                lineNumber: 287,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    padding: '0 20px 4px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            flex: 1
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                        lineNumber: 293,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: 150,
                                                            textAlign: 'right',
                                                            fontSize: 9.5,
                                                            fontWeight: 700,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.04em',
                                                            color: FAINT
                                                        },
                                                        children: cur
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                        lineNumber: 294,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: 150,
                                                            textAlign: 'right',
                                                            fontSize: 9.5,
                                                            fontWeight: 700,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.04em',
                                                            color: FAINT
                                                        },
                                                        children: "CAD"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                        lineNumber: 295,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                lineNumber: 292,
                                                columnNumber: 13
                                            }, this),
                                            summaryRows.map((r)=>{
                                                const v = core?.summaryValues[r.key] ?? 0;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "ws-row",
                                                    style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '7px 20px'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                flex: 1,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 8
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                                                                    tone: "engine"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                    lineNumber: 302,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        fontSize: 12.5,
                                                                        color: r.bold ? INK : MUTED,
                                                                        fontWeight: r.bold ? 680 : 500
                                                                    },
                                                                    children: r.label
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                    lineNumber: 303,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    className: "ws-trace",
                                                                    onClick: ()=>openBuilder(SUM),
                                                                    style: {
                                                                        opacity: 0,
                                                                        transition: 'opacity 140ms',
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: 3,
                                                                        fontSize: 10,
                                                                        color: FAINT,
                                                                        background: 'none',
                                                                        border: 'none',
                                                                        cursor: 'pointer',
                                                                        padding: 0
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"], {
                                                                            size: 10
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                            lineNumber: 304,
                                                                            columnNumber: 284
                                                                        }, this),
                                                                        " trace"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                                    lineNumber: 304,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                            lineNumber: 301,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                width: 150,
                                                                textAlign: 'right',
                                                                fontSize: 12.5,
                                                                fontWeight: r.bold ? 700 : 500,
                                                                color: r.bold ? INK : MUTED,
                                                                fontVariantNumeric: 'tabular-nums'
                                                            },
                                                            children: money(v)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                            lineNumber: 306,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                width: 150,
                                                                textAlign: 'right',
                                                                fontSize: 12.5,
                                                                fontWeight: r.bold ? 700 : 500,
                                                                color: r.bold ? INK : MUTED,
                                                                fontVariantNumeric: 'tabular-nums'
                                                            },
                                                            children: money(cadOf(r.key, v))
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                            lineNumber: 307,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, r.key, true, {
                                                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                    lineNumber: 300,
                                                    columnNumber: 17
                                                }, this);
                                            }),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    height: 12
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                lineNumber: 311,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                        lineNumber: 286,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                lineNumber: 224,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 16,
                                    marginTop: 14,
                                    padding: '0 4px'
                                },
                                children: Object.keys(TONES).map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            fontSize: 10.5,
                                            color: MUTED
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                                                tone: t
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                lineNumber: 318,
                                                columnNumber: 122
                                            }, this),
                                            " ",
                                            TONE_LABEL[t]
                                        ]
                                    }, t, true, {
                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                        lineNumber: 318,
                                        columnNumber: 13
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                lineNumber: 316,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                        lineNumber: 194,
                        columnNumber: 9
                    }, this),
                    sourcesOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SourcesPanel, {
                        rows: rows,
                        mapped: core?.detail.mapped ?? [],
                        unmatched: core?.detail.unmatched ?? [],
                        fileName: stored?.fileName,
                        cur: cur,
                        onClose: ()=>setSourcesOpen(false),
                        onTrace: ()=>openBuilder('fapi-logic-keyword-mapper')
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                        lineNumber: 324,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                lineNumber: 193,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
        lineNumber: 188,
        columnNumber: 5
    }, this);
}
_s1(FapiWorksheet, "5jn4BL7ssmvQg9HdYq/JuLwYlSA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$inline$2d$page$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInlinePage"],
        __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$page$2d$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageMenu"]
    ];
});
_c2 = FapiWorksheet;
// ── Docked Sources file-viewer — the raw trial balance + per-row provenance ────
function SourcesPanel({ rows, mapped, unmatched, fileName, cur, onClose, onTrace }) {
    _s2();
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const mapById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SourcesPanel.useMemo[mapById]": ()=>new Map(mapped.map({
                "SourcesPanel.useMemo[mapById]": (m)=>[
                        m.rowId,
                        m
                    ]
            }["SourcesPanel.useMemo[mapById]"]))
    }["SourcesPanel.useMemo[mapById]"], [
        mapped
    ]);
    const unmatchedIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SourcesPanel.useMemo[unmatchedIds]": ()=>new Set(unmatched.map({
                "SourcesPanel.useMemo[unmatchedIds]": (u)=>u.rowId
            }["SourcesPanel.useMemo[unmatchedIds]"]))
    }["SourcesPanel.useMemo[unmatchedIds]"], [
        unmatched
    ]);
    const sel = selected ? rows.find((r)=>r.rowId === selected) : null;
    const selMap = selected ? mapById.get(selected) : undefined;
    const kv = (l, v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                padding: '2px 0'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontSize: 11,
                        color: MUTED
                    },
                    children: l
                }, void 0, false, {
                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                    lineNumber: 352,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontSize: 11,
                        color: INK,
                        fontWeight: 600,
                        textAlign: 'right'
                    },
                    children: v
                }, void 0, false, {
                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                    lineNumber: 353,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
            lineNumber: 351,
            columnNumber: 5
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: 400,
            flexShrink: 0,
            position: 'sticky',
            top: 20,
            maxHeight: 'calc(100vh - 40px)',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--sx-card)',
            border: `1px solid ${LINE}`,
            borderRadius: 16,
            boxShadow: '0 1px 2px rgba(24,24,27,0.04), 0 12px 32px rgba(24,24,27,0.05)',
            overflow: 'hidden'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    padding: '12px 16px',
                    borderBottom: `1px solid ${HAIRLINE}`
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                        size: 14,
                        style: {
                            color: MUTED
                        }
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                        lineNumber: 360,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            minWidth: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 9.5,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    color: FAINT
                                },
                                children: "Sources · file viewer"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                lineNumber: 362,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 12,
                                    color: INK,
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: 300
                                },
                                children: fileName ?? 'Sample trial balance'
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                lineNumber: 363,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                        lineNumber: 361,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        title: "Close",
                        style: {
                            marginLeft: 'auto',
                            display: 'inline-flex',
                            color: MUTED,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 2
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            size: 15
                        }, void 0, false, {
                            fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                            lineNumber: 365,
                            columnNumber: 185
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                        lineNumber: 365,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                lineNumber: 359,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    overflow: 'auto',
                    flex: 1
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '7px 16px',
                            position: 'sticky',
                            top: 0,
                            background: 'var(--sx-raised)',
                            borderBottom: `1px solid ${HAIRLINE}`,
                            zIndex: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    width: 6,
                                    flexShrink: 0
                                }
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                lineNumber: 370,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    flex: 1,
                                    fontSize: 9,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: FAINT
                                },
                                children: "Account / description"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                lineNumber: 371,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    width: 92,
                                    textAlign: 'right',
                                    fontSize: 9,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: FAINT
                                },
                                children: "Amount"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                lineNumber: 372,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                        lineNumber: 369,
                        columnNumber: 9
                    }, this),
                    rows.map((r)=>{
                        const m = mapById.get(r.rowId);
                        const un = unmatchedIds.has(r.rowId) || !m;
                        const isSel = selected === r.rowId;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: isSel ? 'ws-src-sel' : undefined,
                            onClick: ()=>setSelected(isSel ? null : r.rowId),
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '7px 16px',
                                borderBottom: `1px solid ${HAIRLINE}`,
                                cursor: 'pointer'
                            },
                            children: [
                                un ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        width: 5,
                                        height: 5,
                                        borderRadius: '50%',
                                        border: `1px solid ${hexA(TONES.manual, 0.85)}`,
                                        boxSizing: 'border-box',
                                        flexShrink: 0
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                    lineNumber: 381,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                                    tone: "ai"
                                }, void 0, false, {
                                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                    lineNumber: 382,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        flex: 1,
                                        minWidth: 0
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 11.5,
                                                color: INK,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            },
                                            children: r.label
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                            lineNumber: 384,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 10,
                                                color: FAINT,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            },
                                            children: [
                                                r.account ? `acct ${r.account} · ` : '',
                                                m ? m.category : 'unclassified'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                            lineNumber: 385,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                    lineNumber: 383,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: 11.5,
                                        color: MUTED,
                                        fontVariantNumeric: 'tabular-nums',
                                        flexShrink: 0
                                    },
                                    children: money(r.amount)
                                }, void 0, false, {
                                    fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                    lineNumber: 387,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, r.rowId, true, {
                            fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                            lineNumber: 379,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                lineNumber: 368,
                columnNumber: 7
            }, this),
            sel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    borderTop: `1px solid ${LINE}`,
                    background: 'var(--sx-raised)',
                    padding: '12px 16px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12.5,
                            fontWeight: 650,
                            color: INK
                        },
                        children: sel.label
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                        lineNumber: 395,
                        columnNumber: 11
                    }, this),
                    sel.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 11,
                            color: MUTED,
                            marginTop: 1,
                            marginBottom: 6
                        },
                        children: sel.description
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                        lineNumber: 396,
                        columnNumber: 31
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: 6
                        },
                        children: [
                            selMap ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    kv('Classified as', /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 5
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                                                tone: "ai"
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                                lineNumber: 400,
                                                columnNumber: 111
                                            }, this),
                                            " ",
                                            selMap.category
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                        lineNumber: 400,
                                        columnNumber: 40
                                    }, this)),
                                    selMap.keyword ? kv('Matched keyword', `“${selMap.keyword}”`) : null,
                                    kv('Confidence', `${Math.round((selMap.confidence || 0) * 100)}%`)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 11.5,
                                    color: '#b08248',
                                    padding: '2px 0'
                                },
                                children: "Not matched by any rule — not included in any FAPI line."
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                lineNumber: 404,
                                columnNumber: 17
                            }, this),
                            kv('Amount', `${money(sel.amount)} ${sel.currency ?? cur}`)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                        lineNumber: 397,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onTrace,
                        style: {
                            marginTop: 10,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: 11.5,
                            fontWeight: 550,
                            color: INK,
                            background: 'var(--sx-card)',
                            border: `1px solid ${LINE}`,
                            borderRadius: 7,
                            padding: '5px 10px',
                            cursor: 'pointer'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"], {
                                size: 11
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                                lineNumber: 407,
                                columnNumber: 278
                            }, this),
                            " See the mapper in the builder"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                        lineNumber: 407,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                lineNumber: 394,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
        lineNumber: 358,
        columnNumber: 5
    }, this);
}
_s2(SourcesPanel, "oDE+jLZkybgUeN5tGO0SNsBQYN4=");
_c3 = SourcesPanel;
function AssumptionRow({ label, value, step, onCommit }) {
    _s3();
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 0 2px',
            marginTop: 4,
            borderTop: `1px dashed ${HAIRLINE}`
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: 10.5,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: FAINT
                },
                children: "Assumption"
            }, void 0, false, {
                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                lineNumber: 418,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: 11.5,
                    color: MUTED,
                    flex: 1
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                lineNumber: 419,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                value: draft ?? String(value),
                onChange: (e)=>setDraft(e.target.value),
                onFocus: (e)=>{
                    setDraft(String(value));
                    e.currentTarget.select();
                },
                onBlur: ()=>{
                    if (draft != null) {
                        const n = Number(draft.replace(/,/g, ''));
                        if (Number.isFinite(n)) onCommit(n);
                    }
                    setDraft(null);
                },
                onKeyDown: (e)=>{
                    if (e.key === 'Enter') e.target.blur();
                },
                inputMode: "decimal",
                step: step,
                style: {
                    width: 80,
                    textAlign: 'right',
                    fontSize: 11.5,
                    fontVariantNumeric: 'tabular-nums',
                    color: INK,
                    border: `1px solid ${LINE}`,
                    borderRadius: 6,
                    padding: '3px 8px',
                    outline: 'none'
                }
            }, void 0, false, {
                fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
                lineNumber: 420,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/worksheets/components/fapi-worksheet.tsx",
        lineNumber: 417,
        columnNumber: 5
    }, this);
}
_s3(AssumptionRow, "IMJA9vn+YxmdGkFFJr1np5GMSDg=");
_c4 = AssumptionRow;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "Dot");
__turbopack_context__.k.register(_c1, "AmountCell");
__turbopack_context__.k.register(_c2, "FapiWorksheet");
__turbopack_context__.k.register(_c3, "SourcesPanel");
__turbopack_context__.k.register(_c4, "AssumptionRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/worksheet-shell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WORKSHEETS",
    ()=>WORKSHEETS,
    "WorksheetShell",
    ()=>WorksheetShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/calculator.js [app-client] (ecmascript) <export default as Calculator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-client] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/neumorphic-sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$nav$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/stores/nav-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const WORKSHEETS = [
    {
        label: 'FAPI Workpaper',
        href: '/fapi',
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"],
        description: 'Foreign accrual property income — classify trial-balance rows, apply FX, and compute net FAPI.'
    },
    {
        label: 'T1134 Workpaper',
        href: '/t1134',
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
        description: 'Information return for foreign affiliates — organize disclosures and supporting figures.'
    },
    {
        label: 'Surplus Continuity',
        href: '/surplus',
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"],
        description: 'Track exempt / taxable / hybrid surplus balances and their continuity across years.'
    },
    {
        label: 'Executive Overview',
        href: '/bu-overview',
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
        description: 'Business-unit roll-up — the high-level view across the engagement.'
    }
];
function WorksheetShell({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$nav$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectedClientAtom"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full flex",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        /* Force wrapped worksheet roots to flow at natural height so the card
           scrolls (they otherwise use h-screen / their own overflow). */
        .worksheet-card > * { height: auto !important; min-height: 100% !important; overflow: visible !important; }
      `
            }, void 0, false, {
                fileName: "[project]/components/worksheet-shell.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeumorphicSidebar"], {
                header: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeuSidebarHeader"], {
                    title: "Worksheets",
                    subtitle: client
                }, void 0, false, {
                    fileName: "[project]/components/worksheet-shell.tsx",
                    lineNumber: 44,
                    columnNumber: 34
                }, void 0),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeuRow"], {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/components/worksheet-shell.tsx",
                            lineNumber: 45,
                            columnNumber: 23
                        }, void 0),
                        label: "All worksheets",
                        active: pathname === '/worksheets',
                        onClick: ()=>router.push('/worksheets')
                    }, void 0, false, {
                        fileName: "[project]/components/worksheet-shell.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeuSectionLabel"], {
                        children: "Worksheets"
                    }, void 0, false, {
                        fileName: "[project]/components/worksheet-shell.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    WORKSHEETS.map(({ label, href, Icon })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeuRow"], {
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/components/worksheet-shell.tsx",
                                lineNumber: 48,
                                columnNumber: 36
                            }, void 0),
                            label: label,
                            active: pathname === href,
                            onClick: ()=>router.push(href)
                        }, href, false, {
                            fileName: "[project]/components/worksheet-shell.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeuSectionLabel"], {
                        children: "Workspace"
                    }, void 0, false, {
                        fileName: "[project]/components/worksheet-shell.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeuRow"], {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/components/worksheet-shell.tsx",
                            lineNumber: 51,
                            columnNumber: 23
                        }, void 0),
                        label: "Client file",
                        onClick: ()=>router.push('/client/northstar')
                    }, void 0, false, {
                        fileName: "[project]/components/worksheet-shell.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeuRow"], {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/components/worksheet-shell.tsx",
                            lineNumber: 52,
                            columnNumber: 23
                        }, void 0),
                        label: "Dashboard",
                        onClick: ()=>router.push('/dashboard')
                    }, void 0, false, {
                        fileName: "[project]/components/worksheet-shell.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/worksheet-shell.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-w-0 overflow-auto",
                style: {
                    padding: 12
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "worksheet-card",
                    style: {
                        background: 'var(--sx-card)',
                        borderRadius: 16,
                        boxShadow: 'var(--sx-drop-panel)',
                        overflow: 'hidden',
                        minHeight: '100%'
                    },
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/worksheet-shell.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/worksheet-shell.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/worksheet-shell.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_s(WorksheetShell, "1eUvbnvEGlOxQG3WJRJy+UBkqeM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"]
    ];
});
_c = WorksheetShell;
var _c;
__turbopack_context__.k.register(_c, "WorksheetShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_372bb8c0._.js.map