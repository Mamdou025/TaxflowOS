(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/features/worksheets/components/expense-worksheet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ExpenseWorksheet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// ─────────────────────────────────────────────────────────────────────────────
// Expense Reimbursement Worksheet — the result surface for the Employee Expense
// Reimbursement workflow.
//
// Computes from the REAL engine (runTemplateCore over EXPENSE_CONFIG) on the
// SHARED uploaded rows + run edits, so the worksheet, the chat run, and the
// builder canvas all show identical numbers. Mounts the generic WorksheetCopilot
// so the assistant can answer questions about every line without pasting it in.
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/git-branch.js [app-client] (ecmascript) <export default as GitBranch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/engine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$expense$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/expense.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$parse$2d$upload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/parse-upload.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$workspace$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/stores/workspace-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/state/workflow-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$ui$2f$worksheet$2d$copilot$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/ui/worksheet-copilot.tsx [app-client] (ecmascript)");
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
;
const INK = '#18181b', MUTED = '#71717a', FAINT = '#a1a1aa';
const LINE = 'rgba(24,24,27,0.10)', HAIRLINE = 'rgba(24,24,27,0.07)';
const TONES = {
    source: '#7fb2d9',
    engine: '#7cc3a6',
    manual: '#dab06c'
};
const money = (n)=>n.toLocaleString('en-CA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
const rate = (n)=>n.toLocaleString('en-CA', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 6
    });
const LINES = 'expense-logic-lines', SUM = 'expense-logic-summary', ROLL = 'expense-logic-rollup', SRC = 'expense-source-fx', POL = 'expense-source-policy';
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
        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
        lineNumber: 35,
        columnNumber: 10
    }, this);
}
_c = Dot;
// The category buckets (from the rollup) shown as the "submitted" breakdown.
const BUCKETS = [
    {
        key: 'travel_total',
        label: 'Travel'
    },
    {
        key: 'lodging_total',
        label: 'Lodging'
    },
    {
        key: 'meals_total',
        label: 'Meals & entertainment'
    },
    {
        key: 'supplies_total',
        label: 'Supplies & software'
    },
    {
        key: 'mileage_total',
        label: 'Personal vehicle mileage'
    },
    {
        key: 'nonreimbursable_total',
        label: 'Non-reimbursable (policy)'
    }
];
const LINE_ROWS = [
    {
        key: 'TRAVEL_REIMBURSABLE',
        label: 'Travel (reimbursable)'
    },
    {
        key: 'LODGING_REIMBURSABLE',
        label: 'Lodging (reimbursable)'
    },
    {
        key: 'MEALS_REIMBURSABLE',
        label: 'Meals (capped at per-diem)'
    },
    {
        key: 'SUPPLIES_REIMBURSABLE',
        label: 'Supplies (reimbursable)'
    },
    {
        key: 'MILEAGE_REIMBURSABLE',
        label: 'Mileage (reimbursable)'
    },
    {
        key: 'MEALS_OVER_CAP',
        label: 'Meals over cap (disallowed)'
    }
];
const SUMMARY_ROWS = [
    {
        key: 'SUBMITTED_TOTAL',
        label: 'Submitted total'
    },
    {
        key: 'TOTAL_REIMBURSABLE',
        label: 'Total reimbursable'
    },
    {
        key: 'POLICY_DISALLOWED',
        label: 'Policy-disallowed'
    },
    {
        key: 'NET_PAYABLE',
        label: 'Net payable to employee',
        strong: true
    }
];
function ExpenseWorksheet() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [uploaded, setUploaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$workspace$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadedRowsAtom"]);
    const setBuilderFocus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["builderFocusTargetAtom"]);
    const [parsing, setParsing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fileInput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const stored = uploaded[__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$expense$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPENSE_CONFIG"].id];
    const rows = stored?.rows?.length ? stored.rows : __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$expense$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPENSE_CONFIG"].sampleRows;
    // Inputs are SHARED with the chat run via runEditsAtom — a cap or FX change made
    // here shows up in the run and vice-versa.
    const edits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$workspace$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runEditsAtom"])[__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$expense$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPENSE_CONFIG"].id] ?? __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$workspace$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_RUN_EDITS"];
    const setRunInput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$workspace$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setRunInputAtom"]);
    const defaults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ExpenseWorksheet.useMemo[defaults]": ()=>Object.fromEntries((__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$expense$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPENSE_CONFIG"].editableInputs ?? []).map({
                "ExpenseWorksheet.useMemo[defaults]": (i)=>[
                        i.key,
                        i.default
                    ]
            }["ExpenseWorksheet.useMemo[defaults]"]))
    }["ExpenseWorksheet.useMemo[defaults]"], []);
    const inputs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ExpenseWorksheet.useMemo[inputs]": ()=>({
                ...defaults,
                ...edits.inputs
            })
    }["ExpenseWorksheet.useMemo[inputs]"], [
        defaults,
        edits.inputs
    ]);
    const core = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ExpenseWorksheet.useMemo[core]": ()=>{
            try {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runTemplateCore"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$expense$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPENSE_CONFIG"], {
                    rows,
                    overrides: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildOverrideRules"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$expense$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPENSE_CONFIG"], rows, edits.overrides),
                    inputs
                });
            } catch  {
                return null;
            }
        }
    }["ExpenseWorksheet.useMemo[core]"], [
        rows,
        inputs,
        edits.overrides
    ]);
    const cur = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$expense$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPENSE_CONFIG"].currency;
    const fx = core?.summaryValues.FX_RATE ?? inputs.fxRate ?? 1;
    const netCad = core?.summaryValues.NET_PAYABLE_CAD ?? 0;
    const bucket = (key)=>core?.detail.buckets.find((b)=>b.key === key)?.value ?? 0;
    const val = (key)=>core ? core.lineValues[key] ?? core.summaryValues[key] ?? 0 : 0;
    const setInput = (key, v)=>setRunInput({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$expense$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPENSE_CONFIG"].id,
            key,
            value: v
        });
    const openBuilder = (blockId)=>{
        setBuilderFocus({
            workflowId: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$expense$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPENSE_CONFIG"].id,
            blockId
        });
        router.push('/builder');
    };
    const onFile = async (file)=>{
        if (!file) return;
        setParsing(true);
        try {
            const { fileName, rows: parsed } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$parse$2d$upload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseUploadToRows"])(file);
            setUploaded((prev)=>({
                    ...prev,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$expense$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPENSE_CONFIG"].id]: {
                        fileName,
                        rows: parsed,
                        at: Date.now()
                    }
                }));
        } catch (e) {
            // eslint-disable-next-line no-alert
            alert(e instanceof Error ? e.message : 'Could not read that workbook.');
        } finally{
            setParsing(false);
        }
    };
    const th = {
        fontSize: 10.5,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
        color: FAINT,
        fontWeight: 600,
        padding: '6px 10px',
        textAlign: 'left'
    };
    const tdL = {
        fontSize: 12.5,
        color: INK,
        padding: '7px 10px'
    };
    const tdR = {
        fontSize: 12.5,
        color: INK,
        padding: '7px 10px',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: 20,
            maxWidth: 860,
            margin: '0 auto',
            color: INK
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$ui$2f$worksheet$2d$copilot$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorksheetCopilot"], {
                config: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$expense$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPENSE_CONFIG"],
                rows: rows,
                inputs: inputs,
                overrides: edits.overrides
            }, void 0, false, {
                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginBottom: 18
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 17,
                                    fontWeight: 600,
                                    letterSpacing: -0.2
                                },
                                children: "Expense Reimbursement"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 12,
                                    color: MUTED,
                                    marginTop: 2
                                },
                                children: [
                                    stored?.rows?.length ? `${stored.fileName} · ${rows.length} receipts` : `Sample report · ${rows.length} receipts`,
                                    core?.unmatched.length ? ` · ${core.unmatched.length} unclassified` : ''
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                lineNumber: 124,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: fileInput,
                                type: "file",
                                accept: ".xlsx,.xls",
                                hidden: true,
                                onChange: (e)=>onFile(e.target.files?.[0])
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                lineNumber: 130,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>fileInput.current?.click(),
                                disabled: parsing,
                                style: btn,
                                children: [
                                    parsing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        size: 13,
                                        className: "animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                        lineNumber: 132,
                                        columnNumber: 24
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                        size: 13
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                        lineNumber: 132,
                                        columnNumber: 73
                                    }, this),
                                    " ",
                                    parsing ? 'Parsing…' : 'Import'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: 10,
                    flexWrap: 'wrap',
                    marginBottom: 20
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InputCard, {
                        label: "Meal per-diem cap",
                        value: inputs.mealCap ?? 250,
                        onCommit: (v)=>setInput('mealCap', v),
                        prefix: cur + ' '
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InputCard, {
                        label: "FX rate (USD → CAD)",
                        value: inputs.fxRate ?? 1.35,
                        onCommit: (v)=>setInput('fxRate', v),
                        isRate: true
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    border: `1px solid ${LINE}`,
                    borderRadius: 12,
                    padding: '16px 18px',
                    marginBottom: 20,
                    background: 'rgba(124,195,166,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 11,
                                    color: MUTED,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                    fontWeight: 600
                                },
                                children: "Net payable to employee"
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 26,
                                    fontWeight: 650,
                                    letterSpacing: -0.4,
                                    marginTop: 3
                                },
                                children: [
                                    money(val('NET_PAYABLE')),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 14,
                                            color: MUTED
                                        },
                                        children: cur
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                        lineNumber: 147,
                                        columnNumber: 121
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            textAlign: 'right'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 11,
                                    color: MUTED
                                },
                                children: [
                                    "≈ CAD @ ",
                                    rate(fx)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                lineNumber: 150,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 18,
                                    fontWeight: 600,
                                    marginTop: 2
                                },
                                children: [
                                    money(netCad),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 12,
                                            color: MUTED
                                        },
                                        children: "CAD"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                        lineNumber: 151,
                                        columnNumber: 88
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                title: "Submitted by category",
                tone: "source",
                onTrace: ()=>openBuilder(ROLL),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    style: {
                        width: '100%',
                        borderCollapse: 'collapse'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: th,
                                        children: "Category"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                        lineNumber: 158,
                                        columnNumber: 22
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            ...th,
                                            textAlign: 'right'
                                        },
                                        children: "Submitted"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                        lineNumber: 158,
                                        columnNumber: 50
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                lineNumber: 158,
                                columnNumber: 18
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                            lineNumber: 158,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: [
                                BUCKETS.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        style: {
                                            borderTop: `1px solid ${HAIRLINE}`
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                style: tdL,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 7
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                                                            tone: "source"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                                            lineNumber: 162,
                                                            columnNumber: 104
                                                        }, this),
                                                        " ",
                                                        b.label
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                                    lineNumber: 162,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                                lineNumber: 162,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                style: tdR,
                                                children: money(bucket(b.key))
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                                lineNumber: 163,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, b.key, true, {
                                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                        lineNumber: 161,
                                        columnNumber: 15
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    style: {
                                        borderTop: `1px solid ${LINE}`
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                ...tdL,
                                                fontWeight: 600
                                            },
                                            children: "Submitted total"
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                            lineNumber: 167,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                ...tdR,
                                                fontWeight: 600
                                            },
                                            children: money(val('SUBMITTED_TOTAL'))
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                            lineNumber: 168,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                    lineNumber: 166,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                            lineNumber: 159,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                    lineNumber: 157,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                title: "Reimbursable after policy",
                tone: "engine",
                onTrace: ()=>openBuilder(LINES),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    style: {
                        width: '100%',
                        borderCollapse: 'collapse'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: th,
                                        children: "Line"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                        lineNumber: 177,
                                        columnNumber: 22
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            ...th,
                                            textAlign: 'right'
                                        },
                                        children: "Amount"
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                        lineNumber: 177,
                                        columnNumber: 46
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                lineNumber: 177,
                                columnNumber: 18
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: LINE_ROWS.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    style: {
                                        borderTop: `1px solid ${HAIRLINE}`
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: tdL,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 7
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                                                        tone: "engine"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                                        lineNumber: 181,
                                                        columnNumber: 104
                                                    }, this),
                                                    " ",
                                                    r.label
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                                lineNumber: 181,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                            lineNumber: 181,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                ...tdR,
                                                color: r.key === 'MEALS_OVER_CAP' && val(r.key) > 0 ? '#b45309' : INK
                                            },
                                            children: money(val(r.key))
                                        }, void 0, false, {
                                            fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                            lineNumber: 182,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, r.key, true, {
                                    fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                    lineNumber: 180,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                            lineNumber: 178,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                    lineNumber: 176,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                title: "Summary",
                tone: "engine",
                onTrace: ()=>openBuilder(SUM),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    style: {
                        width: '100%',
                        borderCollapse: 'collapse'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                        children: SUMMARY_ROWS.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                style: {
                                    borderTop: `1px solid ${HAIRLINE}`
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        style: {
                                            ...tdL,
                                            fontWeight: r.strong ? 600 : 400
                                        },
                                        children: r.label
                                    }, void 0, false, {
                                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                        lineNumber: 195,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        style: {
                                            ...tdR,
                                            fontWeight: r.strong ? 650 : 400
                                        },
                                        children: [
                                            money(val(r.key)),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: FAINT,
                                                    fontSize: 11
                                                },
                                                children: cur
                                            }, void 0, false, {
                                                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                                lineNumber: 196,
                                                columnNumber: 94
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                        lineNumber: 196,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, r.key, true, {
                                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                lineNumber: 194,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                        lineNumber: 192,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                    lineNumber: 191,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                lineNumber: 190,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 11,
                    color: FAINT,
                    marginTop: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"], {
                        size: 11
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                        lineNumber: 204,
                        columnNumber: 9
                    }, this),
                    " Computed live from the workflow engine — the same numbers the chat run and the builder canvas show."
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                lineNumber: 203,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
_s(ExpenseWorksheet, "JQLFrmUjwjP4TNPZzkwZnXlnN6M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"]
    ];
});
_c1 = ExpenseWorksheet;
const btn = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: INK,
    background: '#fff',
    border: `1px solid ${LINE}`,
    borderRadius: 8,
    padding: '6px 11px',
    cursor: 'pointer'
};
function Section({ title, tone, onTrace, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            marginBottom: 20
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 6
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: INK,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 7
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                                tone: tone
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                lineNumber: 216,
                                columnNumber: 124
                            }, this),
                            " ",
                            title
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                        lineNumber: 216,
                        columnNumber: 9
                    }, this),
                    onTrace && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onTrace,
                        style: {
                            fontSize: 11,
                            color: MUTED,
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"], {
                                size: 11
                            }, void 0, false, {
                                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                                lineNumber: 217,
                                columnNumber: 202
                            }, this),
                            " trace"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                        lineNumber: 217,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                lineNumber: 215,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    border: `1px solid ${LINE}`,
                    borderRadius: 10,
                    overflow: 'hidden'
                },
                children: children
            }, void 0, false, {
                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
        lineNumber: 214,
        columnNumber: 5
    }, this);
}
_c2 = Section;
function InputCard({ label, value, onCommit, isRate, prefix }) {
    _s1();
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const text = isRate ? rate(value) : money(value);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            border: `1px solid ${LINE}`,
            borderRadius: 10,
            padding: '9px 12px',
            minWidth: 170
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 10.5,
                    color: MUTED,
                    textTransform: 'uppercase',
                    letterSpacing: 0.4,
                    fontWeight: 600
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                lineNumber: 229,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 3,
                    marginTop: 3
                },
                children: [
                    prefix && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 12,
                            color: FAINT
                        },
                        children: prefix
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                        lineNumber: 231,
                        columnNumber: 20
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                            width: 96,
                            fontSize: 15,
                            fontWeight: 600,
                            color: INK,
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            fontVariantNumeric: 'tabular-nums',
                            padding: 0
                        }
                    }, void 0, false, {
                        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                        lineNumber: 232,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
                lineNumber: 230,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/worksheets/components/expense-worksheet.tsx",
        lineNumber: 228,
        columnNumber: 5
    }, this);
}
_s1(InputCard, "IMJA9vn+YxmdGkFFJr1np5GMSDg=");
_c3 = InputCard;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Dot");
__turbopack_context__.k.register(_c1, "ExpenseWorksheet");
__turbopack_context__.k.register(_c2, "Section");
__turbopack_context__.k.register(_c3, "InputCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=features_02c5d2e7._.js.map