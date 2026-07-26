(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/theme-toggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_240c807d63df3e5f63e6bf0e23d1485e$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-themes@0.4.6_react-dom_240c807d63df3e5f63e6bf0e23d1485e/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const seg = (active)=>({
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '6px 8px',
        borderRadius: 9,
        border: 'none',
        cursor: 'pointer',
        fontSize: 11.5,
        fontWeight: active ? 700 : 550,
        fontFamily: 'inherit',
        color: active ? 'var(--sx-accent)' : 'var(--sx-muted)',
        background: active ? 'var(--sx-surface)' : 'transparent',
        boxShadow: active ? 'var(--sx-shadow-in)' : 'none',
        transition: 'color 160ms ease-out'
    });
function ThemeToggle({ collapsed = false }) {
    _s();
    const { resolvedTheme, setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_240c807d63df3e5f63e6bf0e23d1485e$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Theme is only known on the client — render a stable placeholder until mount
    // so SSR and the first client paint match (no hydration warning).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeToggle.useEffect": ()=>setMounted(true)
    }["ThemeToggle.useEffect"], []);
    const isDark = mounted && resolvedTheme === 'dark';
    if (collapsed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: ()=>setTheme(isDark ? 'light' : 'dark'),
            title: isDark ? 'Switch to light theme' : 'Switch to dark theme',
            "aria-label": isDark ? 'Switch to light theme' : 'Switch to dark theme',
            style: {
                width: 40,
                height: 40,
                borderRadius: 12,
                border: 'none',
                background: 'var(--sx-raised)',
                boxShadow: 'var(--sx-shadow-sm)',
                color: 'var(--sx-muted)',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto'
            },
            children: isDark ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                size: 15
            }, void 0, false, {
                fileName: "[project]/components/theme-toggle.tsx",
                lineNumber: 70,
                columnNumber: 19
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                size: 15
            }, void 0, false, {
                fileName: "[project]/components/theme-toggle.tsx",
                lineNumber: 70,
                columnNumber: 40
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/theme-toggle.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "group",
        "aria-label": "Theme",
        style: {
            display: 'flex',
            gap: 4,
            padding: 4,
            borderRadius: 12,
            background: 'var(--sx-surface)',
            boxShadow: 'var(--sx-shadow-in)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setTheme('light'),
                style: seg(mounted && !isDark),
                "aria-pressed": mounted && !isDark,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                        size: 14
                    }, void 0, false, {
                        fileName: "[project]/components/theme-toggle.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this),
                    " Light"
                ]
            }, void 0, true, {
                fileName: "[project]/components/theme-toggle.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setTheme('dark'),
                style: seg(isDark),
                "aria-pressed": isDark,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                        size: 14
                    }, void 0, false, {
                        fileName: "[project]/components/theme-toggle.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    " Dark"
                ]
            }, void 0, true, {
                fileName: "[project]/components/theme-toggle.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/theme-toggle.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_s(ThemeToggle, "t8+WCtmY6Q/K+YFmVfyga28+HWc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_240c807d63df3e5f63e6bf0e23d1485e$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = ThemeToggle;
var _c;
__turbopack_context__.k.register(_c, "ThemeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/neumorphic-sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NEU",
    ()=>NEU,
    "NeuButton",
    ()=>NeuButton,
    "NeuRow",
    ()=>NeuRow,
    "NeuSectionLabel",
    ()=>NeuSectionLabel,
    "NeuSidebarHeader",
    ()=>NeuSidebarHeader,
    "NeumorphicSidebar",
    ()=>NeumorphicSidebar,
    "sidebarCollapsedAtom",
    ()=>sidebarCollapsedAtom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla/utils.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/theme-toggle.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const sidebarCollapsedAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atomWithStorage"])('inscope.sidebar.collapsed', false);
const NEU = {
    bg: 'var(--sx-surface)',
    surface: 'var(--sx-raised)',
    text: 'var(--sx-ink)',
    muted: 'var(--sx-muted)',
    faint: 'var(--sx-faint)',
    accent: 'var(--sx-accent)',
    shadowOut: 'var(--sx-shadow-out)',
    shadowSm: 'var(--sx-shadow-sm)',
    shadowIn: 'var(--sx-shadow-in)'
};
const COLLAPSED_W = 60;
const toggleStyle = {
    width: 28,
    height: 28,
    borderRadius: 9,
    border: 'none',
    background: NEU.surface,
    boxShadow: NEU.shadowSm,
    color: NEU.muted,
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0
};
function NeumorphicSidebar({ header, footer, children, width = 248, floating = false, contentClassName, collapseHideLabels = false }) {
    _s();
    const [collapsed, setCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"])(sidebarCollapsedAtom);
    const w = collapsed ? COLLAPSED_W : width;
    // NB: `absolute` (floating) IS a positioning context for the absolute toggle,
    // so we don't add `relative` on top of it (that would clobber the stretch).
    const posClass = floating ? 'pointer-events-auto absolute left-3 top-16 bottom-3 z-30' : 'relative shrink-0';
    // For raw content (the Builder toolbar): force every descendant's text to 0
    // (the buttons set their own font-size, so a parent text-[0px] won't cascade),
    // which hides labels while the fixed-size SVG icons stay.
    const rawIconCls = collapsed && collapseHideLabels ? 'items-center [&_*]:!text-[0px] [&_.neu-action]:!justify-center [&_.neu-action]:!px-0 [&_.neu-action]:!gap-0' : '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: `flex flex-col ${posClass}`,
        style: {
            width: w,
            margin: floating ? 0 : 12,
            borderRadius: 20,
            background: NEU.bg,
            boxShadow: 'none',
            overflow: 'hidden',
            transition: 'width 220ms cubic-bezier(0.23,1,0.32,1)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `.neu-row:hover { background: var(--sx-hover-tint) !important; }`
            }, void 0, false, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            collapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center shrink-0",
                style: {
                    padding: '12px 0 8px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setCollapsed(false),
                    title: "Expand sidebar",
                    "aria-label": "Expand sidebar",
                    style: toggleStyle,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                        size: 15
                    }, void 0, false, {
                        fileName: "[project]/components/neumorphic-sidebar.tsx",
                        lineNumber: 61,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/neumorphic-sidebar.tsx",
                    lineNumber: 60,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 59,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            zIndex: 3
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setCollapsed(true),
                            title: "Collapse sidebar",
                            "aria-label": "Collapse sidebar",
                            style: toggleStyle,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/components/neumorphic-sidebar.tsx",
                                lineNumber: 68,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/neumorphic-sidebar.tsx",
                            lineNumber: 67,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/neumorphic-sidebar.tsx",
                        lineNumber: 66,
                        columnNumber: 11
                    }, this),
                    header && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "shrink-0",
                        style: {
                            padding: '16px 46px 10px 16px'
                        },
                        children: header
                    }, void 0, false, {
                        fileName: "[project]/components/neumorphic-sidebar.tsx",
                        lineNumber: 71,
                        columnNumber: 22
                    }, this)
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex-1 overflow-y-auto flex flex-col ${rawIconCls} ${contentClassName ?? ''}`,
                style: {
                    padding: collapsed ? '2px 8px 12px' : '4px 10px 12px',
                    scrollbarWidth: 'thin'
                },
                children: children
            }, void 0, false, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "shrink-0",
                style: {
                    padding: collapsed ? '6px 8px 10px' : '8px 12px 10px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeToggle"], {
                    collapsed: collapsed
                }, void 0, false, {
                    fileName: "[project]/components/neumorphic-sidebar.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            !collapsed && footer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "shrink-0",
                style: {
                    padding: '0 12px 12px'
                },
                children: footer
            }, void 0, false, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 82,
                columnNumber: 32
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/neumorphic-sidebar.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_s(NeumorphicSidebar, "/vdFswE6/e2M9z1uCUeO9wS34L4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"]
    ];
});
_c = NeumorphicSidebar;
function NeuSidebarHeader({ title, subtitle, dotColor = NEU.accent }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: dotColor
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/neumorphic-sidebar.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 13,
                            fontWeight: 700,
                            color: NEU.text,
                            letterSpacing: '-0.01em'
                        },
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/neumorphic-sidebar.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 11,
                    color: NEU.faint,
                    marginTop: 2,
                    marginLeft: 15
                },
                children: subtitle
            }, void 0, false, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 94,
                columnNumber: 20
            }, this)
        ]
    }, void 0, true);
}
_c1 = NeuSidebarHeader;
function NeuSectionLabel({ children }) {
    _s1();
    const collapsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(sidebarCollapsedAtom);
    if (collapsed) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            height: 1,
            background: 'var(--sx-divider)',
            margin: '7px 6px'
        }
    }, void 0, false, {
        fileName: "[project]/components/neumorphic-sidebar.tsx",
        lineNumber: 101,
        columnNumber: 25
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 10,
            fontWeight: 650,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: NEU.faint,
            padding: '10px 8px 5px'
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/components/neumorphic-sidebar.tsx",
        lineNumber: 102,
        columnNumber: 10
    }, this);
}
_s1(NeuSectionLabel, "vtR2c2qPeIJXqPisig/bfdk9vnA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"]
    ];
});
_c2 = NeuSectionLabel;
const iconSquare = (active)=>({
        width: 24,
        height: 24,
        borderRadius: 8,
        background: NEU.surface,
        boxShadow: NEU.shadowSm,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: active ? NEU.accent : NEU.muted
    });
const ROW = {
    padding: '8px 9px',
    borderRadius: 10,
    border: 'none',
    marginBottom: 2,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    textAlign: 'left'
};
function NeuRow({ icon, rawIcon, label, sub, active, badge, dim, onClick }) {
    _s2();
    const collapsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(sidebarCollapsedAtom);
    if (collapsed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onClick,
            disabled: dim,
            title: label,
            className: "neu-row",
            style: {
                width: 40,
                height: 40,
                borderRadius: 11,
                border: 'none',
                background: active ? 'var(--sx-accent-soft)' : 'transparent',
                display: 'grid',
                placeItems: 'center',
                margin: '2px auto',
                cursor: dim ? 'default' : 'pointer',
                opacity: dim ? 0.5 : 1
            },
            children: rawIcon ?? (icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: iconSquare(active),
                children: icon
            }, void 0, false, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 115,
                columnNumber: 30
            }, this))
        }, void 0, false, {
            fileName: "[project]/components/neumorphic-sidebar.tsx",
            lineNumber: 114,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        disabled: dim,
        className: "neu-row",
        style: {
            ...ROW,
            background: active ? 'var(--sx-accent-soft)' : 'transparent',
            opacity: dim ? 0.5 : 1,
            cursor: dim ? 'default' : 'pointer'
        },
        children: [
            rawIcon ?? (icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: iconSquare(active),
                children: icon
            }, void 0, false, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 121,
                columnNumber: 28
            }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "min-w-0 flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            display: 'block',
                            fontSize: 12.5,
                            fontWeight: active ? 650 : 600,
                            color: active ? NEU.accent : NEU.text,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        },
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/components/neumorphic-sidebar.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    sub && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            display: 'block',
                            fontSize: 10.5,
                            color: NEU.muted,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        },
                        children: sub
                    }, void 0, false, {
                        fileName: "[project]/components/neumorphic-sidebar.tsx",
                        lineNumber: 124,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            badge
        ]
    }, void 0, true, {
        fileName: "[project]/components/neumorphic-sidebar.tsx",
        lineNumber: 120,
        columnNumber: 5
    }, this);
}
_s2(NeuRow, "vtR2c2qPeIJXqPisig/bfdk9vnA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"]
    ];
});
_c3 = NeuRow;
function NeuButton({ icon, label, onClick }) {
    _s3();
    const collapsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(sidebarCollapsedAtom);
    if (collapsed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onClick,
            title: label,
            style: {
                width: 40,
                height: 40,
                borderRadius: 12,
                border: 'none',
                background: NEU.surface,
                boxShadow: NEU.shadowSm,
                color: NEU.text,
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 4px'
            },
            children: icon
        }, void 0, false, {
            fileName: "[project]/components/neumorphic-sidebar.tsx",
            lineNumber: 135,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: "w-full flex items-center gap-2",
        style: {
            padding: '9px 12px',
            borderRadius: 12,
            border: 'none',
            background: NEU.surface,
            boxShadow: NEU.shadowSm,
            color: NEU.text,
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer'
        },
        children: [
            icon,
            " ",
            label
        ]
    }, void 0, true, {
        fileName: "[project]/components/neumorphic-sidebar.tsx",
        lineNumber: 141,
        columnNumber: 5
    }, this);
}
_s3(NeuButton, "vtR2c2qPeIJXqPisig/bfdk9vnA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"]
    ];
});
_c4 = NeuButton;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "NeumorphicSidebar");
__turbopack_context__.k.register(_c1, "NeuSidebarHeader");
__turbopack_context__.k.register(_c2, "NeuSectionLabel");
__turbopack_context__.k.register(_c3, "NeuRow");
__turbopack_context__.k.register(_c4, "NeuButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/folder-tree.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Folder tree — the Scope sidebar's organizer for companies/clients and their
// chat history. Top-level nodes are client/company folders; they nest arbitrary
// subfolders (engagements, years); chats are the leaves (the chat history, filed
// under whichever folder they belong to). Persisted to localStorage.
//
// Display/seed data for now — chats aren't backed by a real transcript store yet,
// so selecting one highlights it (the wiring point is `selectedChatAtom`).
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "addChild",
    ()=>addChild,
    "expandedFoldersAtom",
    ()=>expandedFoldersAtom,
    "folderTreeAtom",
    ()=>folderTreeAtom,
    "removeNode",
    ()=>removeNode,
    "renameNode",
    ()=>renameNode,
    "selectedChatAtom",
    ()=>selectedChatAtom,
    "uid",
    ()=>uid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla/utils.mjs [app-client] (ecmascript)");
;
;
// Client names mirror lib/nav-store CLIENTS so the active-client folder highlights.
const SEED = [
    {
        id: 'cl-northstar',
        name: 'Northstar Inc.',
        kind: 'folder',
        children: [
            {
                id: 'f-northstar-fapi',
                name: 'FAPI · 2025',
                kind: 'folder',
                children: [
                    {
                        id: 'ch-1',
                        name: 'FAPI readiness review',
                        kind: 'chat',
                        updated: '2h ago'
                    },
                    {
                        id: 'ch-2',
                        name: 'Trial balance classification',
                        kind: 'chat',
                        updated: 'Yesterday'
                    }
                ]
            },
            {
                id: 'f-northstar-t1134',
                name: 'T1134 · 2025',
                kind: 'folder',
                children: [
                    {
                        id: 'ch-3',
                        name: 'Foreign affiliate disclosures',
                        kind: 'chat',
                        updated: '3d ago'
                    }
                ]
            },
            {
                id: 'ch-4',
                name: 'GROSS approval — $538,100',
                kind: 'chat',
                updated: '1w ago'
            }
        ]
    },
    {
        id: 'cl-meridian',
        name: 'Meridian Energy Corp.',
        kind: 'folder',
        children: [
            {
                id: 'f-meridian-q2',
                name: 'Q2 Provision',
                kind: 'folder',
                children: [
                    {
                        id: 'ch-5',
                        name: 'Provision review',
                        kind: 'chat',
                        updated: '18m ago'
                    }
                ]
            },
            {
                id: 'ch-6',
                name: '3 rows need a category',
                kind: 'chat',
                updated: '2d ago'
            }
        ]
    },
    {
        id: 'cl-cascade',
        name: 'Cascade Technologies Ltd.',
        kind: 'folder',
        children: [
            {
                id: 'ch-7',
                name: 'T1134 compliance review',
                kind: 'chat',
                updated: '1w ago'
            }
        ]
    }
];
const folderTreeAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atomWithStorage"])('inscope.folders.v1', SEED);
const expandedFoldersAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atomWithStorage"])('inscope.folders.expanded.v1', {
    'cl-northstar': true
});
const selectedChatAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null);
function uid(prefix) {
    const rnd = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10);
    return `${prefix}-${rnd}`;
}
// ── Pure tree transforms (immutable) ────────────────────────────────────────────
function mapNode(nodes, id, fn) {
    return nodes.map((n)=>n.id === id ? fn(n) : n.children ? {
            ...n,
            children: mapNode(n.children, id, fn)
        } : n);
}
function addChild(nodes, parentId, child) {
    if (parentId === null) return [
        ...nodes,
        child
    ];
    return mapNode(nodes, parentId, (n)=>({
            ...n,
            children: [
                ...n.children ?? [],
                child
            ]
        }));
}
function removeNode(nodes, id) {
    return nodes.filter((n)=>n.id !== id).map((n)=>n.children ? {
            ...n,
            children: removeNode(n.children, id)
        } : n);
}
function renameNode(nodes, id, name) {
    return mapNode(nodes, id, (n)=>({
            ...n,
            name
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/assistant/workspace/client-folders.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClientFolders",
    ()=>ClientFolders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// ─────────────────────────────────────────────────────────────────────────────
// ClientFolders — the sidebar's folder tree for companies/clients + chat history.
// Client folders (top level) nest subfolders and chats. Expand/collapse, create
// (folder · subfolder · chat), rename (double-click), delete. Clicking a top-level
// folder also makes it the active client (drives the composer's client context).
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Folder$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/folder.js [app-client] (ecmascript) <export default as Folder>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/folder-open.js [app-client] (ecmascript) <export default as FolderOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderPlus$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/folder-plus.js [app-client] (ecmascript) <export default as FolderPlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquarePlus$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/message-square-plus.js [app-client] (ecmascript) <export default as MessageSquarePlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/neumorphic-sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$nav$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/stores/nav-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$folder$2d$tree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/folder-tree.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const ACCENT = '#8B5CF6';
function ClientFolders() {
    _s();
    const [tree, setTree] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$folder$2d$tree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["folderTreeAtom"]);
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$folder$2d$tree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["expandedFoldersAtom"]);
    const [selectedChat, setSelectedChat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$folder$2d$tree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectedChatAtom"]);
    const [client, setClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$nav$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectedClientAtom"]);
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const toggle = (id)=>setExpanded((e)=>({
                ...e,
                [id]: !e[id]
            }));
    const expand = (id)=>setExpanded((e)=>({
                ...e,
                [id]: true
            }));
    const addFolder = (parentId)=>{
        const node = {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$folder$2d$tree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])('f'),
            name: 'New folder',
            kind: 'folder',
            children: []
        };
        setTree((t)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$folder$2d$tree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addChild"])(t, parentId, node));
        if (parentId) expand(parentId);
        setEditingId(node.id);
    };
    const addChat = (parentId)=>{
        const node = {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$folder$2d$tree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])('ch'),
            name: 'New chat',
            kind: 'chat',
            updated: 'now'
        };
        setTree((t)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$folder$2d$tree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addChild"])(t, parentId, node));
        expand(parentId);
        setEditingId(node.id);
    };
    const commitRename = (id, name)=>{
        setTree((t)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$folder$2d$tree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["renameNode"])(t, id, name.trim() || 'Untitled'));
        setEditingId(null);
    };
    const remove = (id)=>setTree((t)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$folder$2d$tree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeNode"])(t, id));
    const iconBtn = {
        display: 'grid',
        placeItems: 'center',
        width: 21,
        height: 21,
        borderRadius: 6,
        border: 'none',
        background: 'transparent',
        color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].faint,
        cursor: 'pointer',
        flexShrink: 0
    };
    const renderNode = (node, depth)=>{
        const isFolder = node.kind === 'folder';
        const open = !!expanded[node.id];
        const isTop = depth === 0;
        const isActiveClient = isTop && isFolder && node.name === client;
        const isSelectedChat = node.kind === 'chat' && selectedChat === node.id;
        const onRowClick = ()=>{
            if (isFolder) {
                toggle(node.id);
                if (isTop) setClient(node.name);
            } else setSelectedChat(node.id);
        };
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "cf-row",
                    onClick: onRowClick,
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        borderRadius: 8,
                        paddingRight: 5,
                        paddingLeft: 8 + depth * 13,
                        minHeight: 30,
                        cursor: 'pointer',
                        background: isSelectedChat || isActiveClient ? 'rgba(139,92,246,0.10)' : 'transparent'
                    },
                    children: [
                        isFolder ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                display: 'grid',
                                placeItems: 'center',
                                width: 15,
                                height: 15,
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].faint,
                                flexShrink: 0,
                                transition: 'transform 150ms',
                                transform: open ? 'rotate(90deg)' : 'none'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                size: 13
                            }, void 0, false, {
                                fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                                lineNumber: 69,
                                columnNumber: 200
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                            lineNumber: 69,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                width: 15,
                                flexShrink: 0
                            }
                        }, void 0, false, {
                            fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                            lineNumber: 71,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                display: 'flex',
                                color: isActiveClient ? ACCENT : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].faint,
                                flexShrink: 0
                            },
                            children: isFolder ? open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__["FolderOpen"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                                lineNumber: 75,
                                columnNumber: 33
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Folder$3e$__["Folder"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                                lineNumber: 75,
                                columnNumber: 60
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                                lineNumber: 75,
                                columnNumber: 84
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this),
                        editingId === node.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            autoFocus: true,
                            defaultValue: node.name,
                            onClick: (e)=>e.stopPropagation(),
                            onBlur: (e)=>commitRename(node.id, e.currentTarget.value),
                            onKeyDown: (e)=>{
                                if (e.key === 'Enter') commitRename(node.id, e.currentTarget.value);
                                else if (e.key === 'Escape') setEditingId(null);
                            },
                            style: {
                                flex: 1,
                                minWidth: 0,
                                fontSize: 12.5,
                                fontWeight: isFolder ? 600 : 500,
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].text,
                                background: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].surface,
                                border: `1px solid ${ACCENT}`,
                                borderRadius: 6,
                                padding: '2px 6px',
                                outline: 'none'
                            }
                        }, void 0, false, {
                            fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                            lineNumber: 79,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            onDoubleClick: (e)=>{
                                e.stopPropagation();
                                setEditingId(node.id);
                            },
                            title: node.name,
                            style: {
                                flex: 1,
                                minWidth: 0,
                                fontSize: 12.5,
                                fontWeight: isFolder ? 600 : 500,
                                color: isFolder ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].text : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].muted,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            },
                            children: [
                                node.name,
                                node.kind === 'chat' && node.updated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].faint,
                                        fontWeight: 400,
                                        marginLeft: 6,
                                        fontSize: 10.5
                                    },
                                    children: node.updated
                                }, void 0, false, {
                                    fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                                    lineNumber: 98,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                            lineNumber: 91,
                            columnNumber: 13
                        }, this),
                        editingId !== node.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "cf-actions",
                            style: {
                                display: 'inline-flex',
                                gap: 0,
                                flexShrink: 0
                            },
                            onClick: (e)=>e.stopPropagation(),
                            children: [
                                isFolder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    title: "New subfolder",
                                    style: iconBtn,
                                    className: "cf-act",
                                    onClick: ()=>addFolder(node.id),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderPlus$3e$__["FolderPlus"], {
                                        size: 13
                                    }, void 0, false, {
                                        fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                                        lineNumber: 105,
                                        columnNumber: 128
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                                    lineNumber: 105,
                                    columnNumber: 28
                                }, this),
                                isFolder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    title: "New chat",
                                    style: iconBtn,
                                    className: "cf-act",
                                    onClick: ()=>addChat(node.id),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquarePlus$3e$__["MessageSquarePlus"], {
                                        size: 13
                                    }, void 0, false, {
                                        fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                                        lineNumber: 106,
                                        columnNumber: 121
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                                    lineNumber: 106,
                                    columnNumber: 28
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    title: isFolder ? 'Delete folder' : 'Delete chat',
                                    style: iconBtn,
                                    className: "cf-act",
                                    onClick: ()=>remove(node.id),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        size: 12.5
                                    }, void 0, false, {
                                        fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                                        lineNumber: 107,
                                        columnNumber: 141
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                                    lineNumber: 107,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                            lineNumber: 104,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this),
                isFolder && open && node.children?.map((c)=>renderNode(c, depth + 1))
            ]
        }, node.id, true, {
            fileName: "[project]/features/assistant/workspace/client-folders.tsx",
            lineNumber: 62,
            columnNumber: 7
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        .cf-row:hover { background: rgba(158,158,178,0.14) !important; }
        .cf-actions { opacity: 0; transition: opacity 120ms ease; }
        .cf-row:hover .cf-actions { opacity: 1; }
        .cf-act:hover { background: rgba(158,158,178,0.30); color: ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].text} !important; }
      `
            }, void 0, false, {
                fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            tree.map((n)=>renderNode(n, 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>addFolder(null),
                className: "cf-row",
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    width: '100%',
                    padding: '7px 9px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'transparent',
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].muted,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    marginTop: 2
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderPlus$3e$__["FolderPlus"], {
                        size: 14
                    }, void 0, false, {
                        fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this),
                    " New client folder"
                ]
            }, void 0, true, {
                fileName: "[project]/features/assistant/workspace/client-folders.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/assistant/workspace/client-folders.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
_s(ClientFolders, "aJgpNus9Wg5l7ztCbdgdft+2sGE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"]
    ];
});
_c = ClientFolders;
var _c;
__turbopack_context__.k.register(_c, "ClientFolders");
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
"[project]/shared/stores/page-sidebar-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pageSidebarsAtom",
    ()=>pageSidebarsAtom,
    "usePageSidebar",
    ()=>usePageSidebar
]);
// Page-sidebar contract — lets an inline page publish a CONTEXTUAL section into
// the Scope left sidebar (below "Clients & Chats"), instead of drawing its own
// second sidebar inside the panel body (which steals width from the canvas). The
// page calls usePageSidebar(pageKey, Component) and the ChatWorkspace sidebar
// renders the ACTIVE page's section. Mirrors usePageMenu (header) for the sidebar.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const pageSidebarsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])({});
function usePageSidebar(key, Component) {
    _s();
    const set = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(pageSidebarsAtom);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePageSidebar.useEffect": ()=>{
            set({
                "usePageSidebar.useEffect": (prev)=>({
                        ...prev,
                        [key]: Component
                    })
            }["usePageSidebar.useEffect"]);
            return ({
                "usePageSidebar.useEffect": ()=>set({
                        "usePageSidebar.useEffect": (prev)=>{
                            const next = {
                                ...prev
                            };
                            delete next[key];
                            return next;
                        }
                    }["usePageSidebar.useEffect"])
            })["usePageSidebar.useEffect"];
        }
    }["usePageSidebar.useEffect"], [
        key,
        set,
        Component
    ]);
}
_s(usePageSidebar, "mSVZZ4ARpDvkpdwEttaC21+3Wyo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/assistant/workspace/page-menu-bar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PageMenuBar",
    ()=>PageMenuBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// PageMenuBar — renders a page's published PageMenu in the shared panel header
// (dark LibreChat style). Left items sit near the tabs, right items at the far
// end. Dropdowns open a small popover; keep visible items to a few and push the
// rest into a ⋯ dropdown so the header stays un-busy.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/librechat-theme.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function Dropdown({ item }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dropdown.useEffect": ()=>{
            if (!open) return;
            const onDoc = {
                "Dropdown.useEffect.onDoc": (e)=>{
                    if (ref.current && !ref.current.contains(e.target)) setOpen(false);
                }
            }["Dropdown.useEffect.onDoc"];
            document.addEventListener('mousedown', onDoc);
            return ({
                "Dropdown.useEffect": ()=>document.removeEventListener('mousedown', onDoc)
            })["Dropdown.useEffect"];
        }
    }["Dropdown.useEffect"], [
        open
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        style: {
            position: 'relative',
            flexShrink: 0
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setOpen((o)=>!o),
                title: item.title,
                className: "hover:bg-black/5",
                style: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    height: 28,
                    padding: item.label ? '0 8px' : '0 6px',
                    borderRadius: 7,
                    border: 'none',
                    background: open ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].surface : 'transparent',
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].body,
                    cursor: 'pointer',
                    fontSize: 12.5,
                    fontWeight: 500
                },
                children: [
                    item.icon,
                    item.label,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                        size: 12,
                        style: {
                            opacity: 0.55
                        }
                    }, void 0, false, {
                        fileName: "[project]/features/assistant/workspace/page-menu-bar.tsx",
                        lineNumber: 30,
                        columnNumber: 32
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/assistant/workspace/page-menu-bar.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    minWidth: 168,
                    zIndex: 40,
                    background: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].surface,
                    border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].border}`,
                    borderRadius: 10,
                    boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].shadowOut,
                    overflow: 'hidden',
                    padding: 4
                },
                children: item.items.map((it)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            if (!it.disabled) {
                                it.onClick();
                                setOpen(false);
                            }
                        },
                        disabled: it.disabled,
                        className: "hover:bg-black/5",
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 10px',
                            borderRadius: 7,
                            border: 'none',
                            background: 'transparent',
                            color: it.danger ? '#f87171' : it.disabled ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].faint : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].body,
                            cursor: it.disabled ? 'default' : 'pointer',
                            fontSize: 13,
                            opacity: it.disabled ? 0.6 : 1
                        },
                        children: it.label
                    }, it.id, false, {
                        fileName: "[project]/features/assistant/workspace/page-menu-bar.tsx",
                        lineNumber: 35,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/features/assistant/workspace/page-menu-bar.tsx",
                lineNumber: 33,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/assistant/workspace/page-menu-bar.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_s(Dropdown, "wl9VvfhnMVWQ+kCekFjcRPEi3/0=");
_c = Dropdown;
function Item({ item }) {
    if (item.kind === 'separator') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            width: 1,
            height: 18,
            background: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].border,
            margin: '0 4px',
            flexShrink: 0
        }
    }, void 0, false, {
        fileName: "[project]/features/assistant/workspace/page-menu-bar.tsx",
        lineNumber: 52,
        columnNumber: 41
    }, this);
    if (item.kind === 'label') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            flexShrink: 0,
            padding: '0 8px',
            fontSize: 13,
            fontWeight: item.strong ? 700 : 600,
            color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].body,
            whiteSpace: 'nowrap',
            ...item.width ? {
                width: item.width
            } : {
                maxWidth: 260
            },
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        children: item.text
    }, void 0, false, {
        fileName: "[project]/features/assistant/workspace/page-menu-bar.tsx",
        lineNumber: 53,
        columnNumber: 37
    }, this);
    if (item.kind === 'dropdown') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dropdown, {
        item: item
    }, void 0, false, {
        fileName: "[project]/features/assistant/workspace/page-menu-bar.tsx",
        lineNumber: 54,
        columnNumber: 40
    }, this);
    // button
    const primary = item.primary;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: item.onClick,
        disabled: item.disabled,
        title: item.title ?? item.label,
        className: primary ? '' : 'hover:bg-black/5',
        style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 28,
            padding: item.label ? '0 11px' : '0 7px',
            borderRadius: 7,
            border: primary ? 'none' : item.active ? `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].border}` : 'none',
            background: primary ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].accent : item.active ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].surface : 'transparent',
            color: primary ? '#1a1030' : item.disabled ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].faint : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].body,
            cursor: item.disabled ? 'default' : 'pointer',
            fontSize: 12.5,
            fontWeight: primary ? 650 : 500,
            opacity: item.disabled ? 0.55 : 1,
            flexShrink: 0
        },
        children: [
            item.icon,
            item.label
        ]
    }, void 0, true, {
        fileName: "[project]/features/assistant/workspace/page-menu-bar.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_c1 = Item;
function PageMenuBar({ menu }) {
    const left = menu.left ?? [];
    const right = menu.right ?? [];
    if (left.length === 0 && right.length === 0) return null;
    return(// flex '1 1 auto' — grow to fill AND shrink when the panel is narrow (chat
    // open). The tab strip is now fixed-width (flex 0 0 auto), so ALL squeeze is
    // absorbed here by the inner spacer collapsing — the fixed buttons never
    // shrink — which keeps the left group (title + tabs) anchored at a constant x
    // regardless of the panel width or the right-side controls.
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            flex: '1 1 auto',
            minWidth: 0,
            paddingLeft: 6
        },
        children: [
            left.map((it)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Item, {
                    item: it
                }, it.id, false, {
                    fileName: "[project]/features/assistant/workspace/page-menu-bar.tsx",
                    lineNumber: 88,
                    columnNumber: 25
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1
                }
            }, void 0, false, {
                fileName: "[project]/features/assistant/workspace/page-menu-bar.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            right.map((it)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Item, {
                    item: it
                }, it.id, false, {
                    fileName: "[project]/features/assistant/workspace/page-menu-bar.tsx",
                    lineNumber: 90,
                    columnNumber: 26
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/features/assistant/workspace/page-menu-bar.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this));
}
_c2 = PageMenuBar;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Dropdown");
__turbopack_context__.k.register(_c1, "Item");
__turbopack_context__.k.register(_c2, "PageMenuBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/features/assistant/workspace/copilot-workspace-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatWorkspace",
    ()=>ChatWorkspace
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// ─────────────────────────────────────────────────────────────────────────────
// ChatWorkspace — the Scope page (route "/"), LibreChat-style (dark):
//   [ left nav sidebar ] · [ inline page panel ] · [ chat on the RIGHT ]
//
// The chat is the always-present element. Opening a page from the sidebar expands
// a panel; the chat docks to the right and never leaves, so you keep asking the
// assistant about the open page (they share one CopilotKit tree). Pages render
// inline; the builder is the real canvas (InlineBuilder). Palette: librechat-theme.
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla/utils.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/workflow.js [app-client] (ecmascript) <export default as Workflow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$right$2d$close$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelRightClose$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/panel-right-close.js [app-client] (ecmascript) <export default as PanelRightClose>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/maximize-2.js [app-client] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/minimize-2.js [app-client] (ecmascript) <export default as Minimize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$files$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Files$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/files.js [app-client] (ecmascript) <export default as Files>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$close$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftClose$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/panel-left-close.js [app-client] (ecmascript) <export default as PanelLeftClose>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/panel-left-open.js [app-client] (ecmascript) <export default as PanelLeftOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/stores/chat-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$workspace$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/stores/workspace-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$resource$2d$registry$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/stores/resource-registry.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/agents.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$ui$2f$use$2d$assistant$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/ui/use-assistant.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$ui$2f$assistant$2d$thread$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/ui/assistant-thread.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$inscope$2d$neu$2d$mark$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/inscope-neu-mark.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$workspace$2f$client$2d$folders$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/workspace/client-folders.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/librechat-theme.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/neumorphic-sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/theme-toggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$page$2d$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/stores/page-menu-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$page$2d$sidebar$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/stores/page-sidebar-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$workspace$2f$page$2d$menu$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/workspace/page-menu-bar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$inline$2d$page$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/stores/inline-page-context.tsx [app-client] (ecmascript)");
;
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
// The builder is a heavy ReactFlow canvas — load it on demand so @xyflow/react
// stays out of the Scope page's first-load JS. It's only rendered when a
// 'workflow-builder' tab is opened (PageBody below), never at landing.
const InlineBuilder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/features/workflow-builder/ui/inline-builder.tsx [app-client] (ecmascript, next/dynamic entry, async loader)").then((m)=>m.InlineBuilder), {
    loadableGenerated: {
        modules: [
            "[project]/features/workflow-builder/ui/inline-builder.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 32,
                fontSize: 13,
                color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].muted
            },
            children: "Loading builder…"
        }, void 0, false, {
            fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
            lineNumber: 46,
            columnNumber: 32
        }, ("TURBOPACK compile-time value", void 0))
});
_c = InlineBuilder;
// Foldable Scope sidebar — persisted so it stays folded across navigation.
const scopeSidebarCollapsedAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atomWithStorage"])('inscope.scope-sidebar.collapsed', false);
// Persisted split ratio — the chat's fraction of the page↔chat split. The width the
// user drags to is remembered across sessions (replaces the old hardcoded clamp), so
// the chat settles at a predictable size instead of an arbitrary one on every open.
const scopeSplitRatioAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atomWithStorage"])('inscope.scope-split.chat-ratio', 0.4);
// The ground for the inline page bodies — a flat darker neumorphic gray (no grid)
// that reads as the recessed space behind the menus, a shade darker than the
// #F4F5F8 sidebar/chat surface and tuned to the neumorphic shadow tone
// (rgba(158,158,178)). The light sidebar + chat float on it so the chat stays the
// prominent surface. Matches the standalone routes' background (app-shell).
const PORTAL_GROUND = 'var(--sx-ground)';
const foldBtn = {
    width: 26,
    height: 26,
    borderRadius: 9,
    border: 'none',
    background: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].surface,
    boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].shadowSm,
    color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].muted,
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0
};
// "Portal" chrome — an opened page is a recessed gray slot wedged between the
// light neumorphic sidebar and chat. These theme its tab strip + tabs against the
// light PORTAL_GROUND: dark ink for the active tab, muted for the rest, a faint
// shadow-tone hairline. (Pages render in their normal LIGHT form.)
const PORTAL_INK = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].text; // active tab / underline
const PORTAL_MUTED = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].muted; // inactive tabs / close icons
const PORTAL_BORDER = 'var(--sx-divider)';
// The workflow builder + worksheets are now MODES of the Workflows surface (its
// Build + Results tabs), not standalone destinations — so they're not sidebar
// items. Their code lives on (Build reuses InlineBuilder; Results the worksheet).
const WORKSPACE_ITEMS = [
    {
        key: 'workflows',
        title: 'Workflows',
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__["Workflow"]
    },
    {
        key: 'agent',
        title: 'Agent',
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"]
    },
    {
        key: 'dashboard',
        title: 'Dashboard',
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        key: 'viewer',
        title: 'Documents',
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$files$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Files$3e$__["Files"]
    }
];
// The workflow(s) each open page can run — drives the contextual "Run" group,
// which now follows the active tab instead of a permanent global list. Pages not
// listed here show no Run group (workflows without a page — roulement, campaign —
// stay reachable from the chat launcher / agents).
const PAGE_WORKFLOWS = {
    fapi: [
        'fapi'
    ],
    expense: [
        'expense'
    ],
    surplus: [
        'surplus'
    ]
};
function runsForPage(pageKey) {
    if (!pageKey) return [];
    return (PAGE_WORKFLOWS[pageKey] ?? []).map((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORKFLOWS"].find((w)=>w.id === id)).filter((w)=>Boolean(w));
}
function titleFor(key) {
    const local = WORKSPACE_ITEMS.find((i)=>i.key === key);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$resource$2d$registry$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPage"])(key)?.title ?? local?.title ?? key;
}
function PageBody({ pageKey }) {
    // Render the page directly — do NOT wrap in a nested component defined here, or
    // every render creates a new component type and remounts the page (which, with
    // usePageMenu writing an atom this tree reads, loops infinitely).
    let content;
    if (pageKey === 'workflow-builder') content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InlineBuilder, {}, void 0, false, {
        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
        lineNumber: 109,
        columnNumber: 49
    }, this);
    else {
        const Comp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$resource$2d$registry$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPage"])(pageKey)?.Component ?? null;
        content = Comp ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {}, void 0, false, {
            fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
            lineNumber: 112,
            columnNumber: 22
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 32,
                fontSize: 13,
                color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].muted
            },
            children: "Page unavailable."
        }, void 0, false, {
            fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
            lineNumber: 112,
            columnNumber: 33
        }, this);
    }
    // Pages read useInlinePage() to hide their own chrome + publish a header menu.
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$inline$2d$page$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InlinePageProvider"], {
        children: content
    }, void 0, false, {
        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
        lineNumber: 115,
        columnNumber: 10
    }, this);
}
_c1 = PageBody;
// ── Neumorphic sidebar bits (light NEU rail on the dark Scope canvas) ───────────
function SideLabel({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '13px 10px 5px',
            fontSize: 10,
            fontWeight: 650,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].faint
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
        lineNumber: 120,
        columnNumber: 10
    }, this);
}
_c2 = SideLabel;
function SideRow({ icon, label, sub, dim, collapsed, onClick }) {
    if (collapsed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onClick,
            title: label,
            className: "lc-siderow",
            style: {
                display: 'grid',
                placeItems: 'center',
                width: 46,
                height: 46,
                borderRadius: 12,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                margin: '2px auto',
                opacity: dim ? 0.55 : 1
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    background: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].surface,
                    boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].shadowSm,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].muted
                },
                children: icon
            }, void 0, false, {
                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                lineNumber: 126,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
            lineNumber: 125,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: "lc-siderow",
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            textAlign: 'left',
            padding: '7px 9px',
            borderRadius: 10,
            border: 'none',
            background: 'transparent',
            color: dim ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].faint : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].text,
            cursor: 'pointer',
            opacity: dim ? 0.65 : 1,
            marginBottom: 1
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    background: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].surface,
                    boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].shadowSm,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].muted
                },
                children: icon
            }, void 0, false, {
                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    minWidth: 0,
                    flex: 1
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            display: 'block',
                            fontSize: 13,
                            fontWeight: 600,
                            color: dim ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].faint : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].text,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        },
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this),
                    sub && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            display: 'block',
                            fontSize: 10.5,
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].muted,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        },
                        children: sub
                    }, void 0, false, {
                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                        lineNumber: 139,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
        lineNumber: 131,
        columnNumber: 5
    }, this);
}
_c3 = SideRow;
// A collapsible menu group — click the header to expand/collapse its rows.
function SideSection({ label, defaultOpen = true, children }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultOpen);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setOpen((v)=>!v),
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    width: '100%',
                    padding: '13px 10px 5px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 10,
                            fontWeight: 650,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].faint
                        },
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                        size: 12,
                        style: {
                            marginLeft: 'auto',
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].faint,
                            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
                            transition: 'transform 180ms ease'
                        }
                    }, void 0, false, {
                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this),
            open && children
        ]
    }, void 0, true);
}
_s(SideSection, "pG0khZI24VrkSmCZcWM9qqrVMh4=");
_c4 = SideSection;
function ChatWorkspace() {
    _s1();
    const windows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$workspace$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workspaceWindowsAtom"]);
    const [activeId, setActiveId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$workspace$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["activeWindowIdAtom"]);
    const openWindow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$workspace$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openWorkspaceWindowAtom"]);
    const closeWindow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$workspace$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closeWorkspaceWindowAtom"]);
    const focusWindow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$workspace$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["focusWorkspaceWindowAtom"]);
    const [focus, setFocus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const pageBodyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const a = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$ui$2f$use$2d$assistant$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAssistant"])();
    const pageMenus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$page$2d$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pageMenusAtom"]);
    const pageSidebars = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$page$2d$sidebar$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pageSidebarsAtom"]);
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatPanelModeAtom"]);
    const [collapsed, setCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"])(scopeSidebarCollapsedAtom);
    const [splitRatio, setSplitRatio] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"])(scopeSplitRatioAtom);
    const splitRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [dragging, setDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const hasPages = windows.length > 0;
    const active = windows.find((w)=>w.id === activeId) ?? windows[windows.length - 1] ?? null;
    const activeMenu = active ? pageMenus[active.pageKey] : undefined;
    const activeRuns = runsForPage(active?.pageKey); // contextual Run group — follows the open tab
    // Closing the *last* page collapses the page panel to zero width and lets the
    // chat glide into the freed space (a slide), then removes the window once the
    // transition finishes — so the panel doesn't just blink out of existence.
    const [closingLast, setClosingLast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const closeTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatWorkspace.useEffect": ()=>({
                "ChatWorkspace.useEffect": ()=>{
                    if (closeTimer.current) window.clearTimeout(closeTimer.current);
                }
            })["ChatWorkspace.useEffect"]
    }["ChatWorkspace.useEffect"], []);
    // Reset the split when the last page closes.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatWorkspace.useEffect": ()=>{
            if (!hasPages && mode !== 'split') setMode('split');
        }
    }["ChatWorkspace.useEffect"], [
        hasPages,
        mode,
        setMode
    ]);
    const showPage = hasPages && mode !== 'expanded' && !closingLast;
    const showChat = !hasPages || mode !== 'collapsed';
    // The chat takes the whole surface: no page open, chat expanded, or the last
    // page is mid-slide-out.
    const chatFull = !hasPages || mode === 'expanded' || closingLast;
    // The chat's flex-basis in split mode — the remembered ratio, floored/capped so
    // the composer and the page each keep a usable minimum. The same expression
    // positions the drag handle over the seam (chat width + its 10px right margin).
    const chatBasis = `clamp(360px, ${(splitRatio * 100).toFixed(1)}%, calc(100% - 420px))`;
    // Drag the page↔chat seam. Measures the split container once at pointer-down, then
    // maps the pointer's distance from the right edge to the chat's fraction (clamped).
    // Listeners live on window so the drag survives the pointer leaving the thin handle.
    const startSplitDrag = (e)=>{
        e.preventDefault();
        const el = splitRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setDragging(true);
        const onMove = (ev)=>{
            const r = (rect.right - ev.clientX) / rect.width;
            setSplitRatio(Math.min(0.72, Math.max(0.24, r)));
        };
        const onUp = ()=>{
            setDragging(false);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatWorkspace.useEffect": ()=>{
            if (hasPages && !windows.some({
                "ChatWorkspace.useEffect": (w)=>w.id === activeId
            }["ChatWorkspace.useEffect"])) setActiveId(windows[windows.length - 1].id);
        }
    }["ChatWorkspace.useEffect"], [
        windows,
        activeId,
        hasPages,
        setActiveId
    ]);
    const open = (key)=>openWindow({
            pageKey: key,
            title: titleFor(key)
        });
    // Close a tab. More than one open → just drop it (we land on a sibling, nothing
    // to reveal). Closing the last one plays the slide: collapse now, remove after.
    const requestClose = (id)=>{
        if (windows.length > 1) {
            closeWindow(id);
            return;
        }
        setClosingLast(true);
        if (closeTimer.current) window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(()=>{
            closeWindow(id);
            setClosingLast(false);
            closeTimer.current = null;
        }, 320);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatWorkspace.useEffect": ()=>{
            const onFocus = {
                "ChatWorkspace.useEffect.onFocus": (e)=>{
                    const d = e.detail;
                    setFocus({
                        ...d,
                        nonce: Date.now()
                    });
                    const win = windows.find({
                        "ChatWorkspace.useEffect.onFocus.win": (w)=>w.pageKey === d.pageKey
                    }["ChatWorkspace.useEffect.onFocus.win"]);
                    if (win) setActiveId(win.id);
                }
            }["ChatWorkspace.useEffect.onFocus"];
            window.addEventListener('cwp-focus-anchor', onFocus);
            return ({
                "ChatWorkspace.useEffect": ()=>window.removeEventListener('cwp-focus-anchor', onFocus)
            })["ChatWorkspace.useEffect"];
        }
    }["ChatWorkspace.useEffect"], [
        windows,
        setActiveId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatWorkspace.useEffect": ()=>{
            if (!focus || !active || active.pageKey !== focus.pageKey) return;
            let raf = 0, tries = 0;
            const attempt = {
                "ChatWorkspace.useEffect.attempt": ()=>{
                    const el = pageBodyRef.current?.querySelector(`[data-anchor="${focus.anchor}"]`) ?? null;
                    if (el) {
                        el.scrollIntoView({
                            block: 'center',
                            behavior: 'smooth'
                        });
                        el.classList.add('cwp-anchor-flash');
                        window.setTimeout({
                            "ChatWorkspace.useEffect.attempt": ()=>el.classList.remove('cwp-anchor-flash')
                        }["ChatWorkspace.useEffect.attempt"], 1700);
                        return;
                    }
                    if (tries++ < 120) raf = requestAnimationFrame(attempt);
                }
            }["ChatWorkspace.useEffect.attempt"];
            raf = requestAnimationFrame(attempt);
            return ({
                "ChatWorkspace.useEffect": ()=>cancelAnimationFrame(raf)
            })["ChatWorkspace.useEffect"];
        }
    }["ChatWorkspace.useEffect"], [
        focus,
        active
    ]);
    return(// Exterior ground — a cooler/darker tone than the chat + sidebar panels (both
    // #F4F5F8 / NEU.bg), so those read as one continuous lighter surface on it.
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full flex",
        style: {
            background: 'var(--sx-ground-outer)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @keyframes cwp-anchor-flash { 0% { background: var(--sx-accent-soft);} 100% { background: transparent;} }
        .cwp-anchor-flash { animation: cwp-anchor-flash 1.7s ease-out; border-radius: 8px; }
        .lc-siderow:hover { background: var(--sx-hover-tint) !important; }
        .lc-tab { position: relative; }
        .lc-tab[data-active="true"]::after { content:''; position:absolute; left:10px; right:10px; bottom:-1px; height:2px; background:${PORTAL_INK}; border-radius:2px; }
        .cwp-card { transition: flex-basis 300ms cubic-bezier(0.23,1,0.32,1), flex-grow 300ms cubic-bezier(0.23,1,0.32,1), margin 260ms cubic-bezier(0.23,1,0.32,1), border-radius 260ms cubic-bezier(0.23,1,0.32,1); }
        @keyframes cwp-page-in { from { opacity: 0; transform: translateY(8px) scale(0.99); } to { opacity: 1; transform: none; } }
        .cwp-page-in { animation: cwp-page-in 300ms cubic-bezier(0.23,1,0.32,1) both; }
        /* Page↔chat drag handle — a transparent grab strip over the seam with a
           subtle grip that brightens to the accent on hover/drag. */
        .cwp-split-handle { display: grid; place-items: center; }
        .cwp-split-grip { width: 3px; height: 32px; border-radius: 3px; background: var(--sx-divider); transition: background 140ms ease, height 140ms ease; }
        .cwp-split-handle:hover .cwp-split-grip, .cwp-split-handle.dragging .cwp-split-grip { background: var(--sx-accent); height: 48px; }
        /* Collapsed logo doubles as the expand control: the dial shows at rest and
           crossfades to the panel-open icon on hover; clicking expands the sidebar. */
        .cwp-logo-btn .cwp-logo-mark, .cwp-logo-btn .cwp-logo-expand { transition: opacity 150ms ease; }
        .cwp-logo-btn .cwp-logo-expand { opacity: 0; }
        .cwp-logo-btn:hover .cwp-logo-mark { opacity: 0; }
        .cwp-logo-btn:hover .cwp-logo-expand { opacity: 1; }
      `
            }, void 0, false, {
                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                lineNumber: 281,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: collapsed ? 66 : 258,
                    flexShrink: 0,
                    margin: 10,
                    borderRadius: 12,
                    background: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].bg,
                    boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].shadowOut,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: collapsed ? '12px 8px' : '12px 10px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    scrollbarWidth: 'thin',
                    transition: 'width 240ms cubic-bezier(0.23,1,0.32,1)'
                },
                children: [
                    collapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 10,
                            padding: '2px 0 10px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setCollapsed(false),
                            title: "Expand sidebar",
                            "aria-label": "Expand sidebar",
                            className: "cwp-logo-btn",
                            style: {
                                position: 'relative',
                                width: 46,
                                height: 46,
                                background: 'transparent',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                display: 'grid',
                                placeItems: 'center'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "cwp-logo-mark",
                                    style: {
                                        display: 'grid',
                                        placeItems: 'center'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$inscope$2d$neu$2d$mark$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InScopeNeuMark"], {
                                        size: 34
                                    }, void 0, false, {
                                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                        lineNumber: 314,
                                        columnNumber: 97
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                    lineNumber: 314,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "cwp-logo-expand",
                                    style: {
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'grid',
                                        placeItems: 'center',
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].muted
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftOpen$3e$__["PanelLeftOpen"], {
                                        size: 19
                                    }, void 0, false, {
                                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                        lineNumber: 315,
                                        columnNumber: 149
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                    lineNumber: 315,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                            lineNumber: 308,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                        lineNumber: 306,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '4px 6px 12px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setMode('split'),
                                title: "Open chat",
                                "aria-label": "Open chat",
                                style: {
                                    background: 'transparent',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                },
                                className: "hover:brightness-105",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "isneu-wordmark",
                                    style: {
                                        fontSize: 21,
                                        fontWeight: 400,
                                        letterSpacing: '-0.02em'
                                    },
                                    children: "InScope"
                                }, void 0, false, {
                                    fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                    lineNumber: 322,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                lineNumber: 321,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setCollapsed(true),
                                title: "Collapse sidebar",
                                "aria-label": "Collapse sidebar",
                                style: foldBtn,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$close$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftClose$3e$__["PanelLeftClose"], {
                                    size: 15
                                }, void 0, false, {
                                    fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                    lineNumber: 324,
                                    columnNumber: 127
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                lineNumber: 324,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                        lineNumber: 319,
                        columnNumber: 11
                    }, this),
                    collapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>a.newChat(),
                        title: "New chat",
                        "aria-label": "New chat",
                        style: {
                            width: 46,
                            height: 46,
                            borderRadius: 12,
                            border: 'none',
                            background: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].surface,
                            boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].shadowSm,
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].text,
                            cursor: 'pointer',
                            display: 'grid',
                            placeItems: 'center',
                            margin: '0 auto 4px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                            lineNumber: 329,
                            columnNumber: 301
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                        lineNumber: 329,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>a.newChat(),
                        className: "hover:brightness-105",
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: 12,
                            border: 'none',
                            background: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].surface,
                            boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].shadowSm,
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].text,
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 600
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                lineNumber: 336,
                                columnNumber: 13
                            }, this),
                            " New chat"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                        lineNumber: 331,
                        columnNumber: 11
                    }, this),
                    collapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    height: 1,
                                    background: 'var(--sx-divider)',
                                    margin: '8px 8px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                lineNumber: 342,
                                columnNumber: 13
                            }, this),
                            WORKSPACE_ITEMS.map((it)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SideRow, {
                                    collapsed: true,
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(it.Icon, {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                        lineNumber: 343,
                                        columnNumber: 80
                                    }, void 0),
                                    label: it.title,
                                    onClick: ()=>open(it.key)
                                }, it.key, false, {
                                    fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                    lineNumber: 343,
                                    columnNumber: 42
                                }, this)),
                            activeRuns.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    height: 1,
                                    background: 'rgba(158,158,178,0.28)',
                                    margin: '8px 8px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                lineNumber: 344,
                                columnNumber: 39
                            }, this),
                            activeRuns.map((w)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SideRow, {
                                    collapsed: true,
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__["Workflow"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                        lineNumber: 346,
                                        columnNumber: 51
                                    }, void 0),
                                    label: w.name,
                                    dim: !w.ready,
                                    onClick: ()=>a.launchStartWorkflow(w.id)
                                }, w.id, false, {
                                    fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                    lineNumber: 346,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SideSection, {
                                label: "Workspace",
                                children: WORKSPACE_ITEMS.map((it)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SideRow, {
                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(it.Icon, {
                                            size: 15
                                        }, void 0, false, {
                                            fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                            lineNumber: 352,
                                            columnNumber: 72
                                        }, void 0),
                                        label: it.title,
                                        onClick: ()=>open(it.key)
                                    }, it.key, false, {
                                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                        lineNumber: 352,
                                        columnNumber: 44
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                lineNumber: 351,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SideSection, {
                                label: "Clients & Chats",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$workspace$2f$client$2d$folders$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClientFolders"], {}, void 0, false, {
                                    fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                    lineNumber: 356,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                lineNumber: 355,
                                columnNumber: 13
                            }, this),
                            (()=>{
                                const SideComp = active ? pageSidebars[active.pageKey] : undefined;
                                return SideComp ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SideSection, {
                                    label: active?.title ?? 'Page',
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SideComp, {}, void 0, false, {
                                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                        lineNumber: 366,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                    lineNumber: 365,
                                    columnNumber: 17
                                }, this) : null;
                            })(),
                            activeRuns.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SideLabel, {
                                        children: `Run · ${active?.title ?? ''}`
                                    }, void 0, false, {
                                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                        lineNumber: 374,
                                        columnNumber: 17
                                    }, this),
                                    activeRuns.map((w)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SideRow, {
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__["Workflow"], {
                                                size: 15
                                            }, void 0, false, {
                                                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                                lineNumber: 377,
                                                columnNumber: 38
                                            }, void 0),
                                            label: w.name,
                                            sub: `${w.sub}${!w.ready ? ' · soon' : ''}`,
                                            dim: !w.ready,
                                            onClick: ()=>a.launchStartWorkflow(w.id)
                                        }, w.id, false, {
                                            fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                            lineNumber: 376,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: 'auto',
                            paddingTop: 10
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    height: 1,
                                    background: 'var(--sx-divider)',
                                    margin: collapsed ? '0 8px 10px' : '0 4px 10px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                lineNumber: 389,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeToggle"], {
                                collapsed: collapsed
                            }, void 0, false, {
                                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                lineNumber: 390,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                        lineNumber: 388,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                lineNumber: 304,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: splitRef,
                className: "flex-1 min-w-0 flex relative",
                style: {
                    userSelect: dragging ? 'none' : undefined,
                    cursor: dragging ? 'col-resize' : undefined
                },
                children: [
                    hasPages && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex flex-col cwp-card cwp-page-in flat-surface",
                        style: {
                            flex: showPage ? '1 1 0px' : '0 0 0px',
                            overflow: 'hidden',
                            margin: showPage ? '10px 0 10px 8px' : 0,
                            borderRadius: showPage ? '3px 0 0 3px' : 0,
                            background: PORTAL_GROUND,
                            boxShadow: 'none',
                            transition: dragging ? 'none' : undefined
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "shrink-0 flex items-center px-3",
                                style: {
                                    height: 40,
                                    background: 'var(--sx-portal-strip)',
                                    borderBottom: `1px solid ${PORTAL_BORDER}`
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1",
                                        style: {
                                            overflowX: 'auto',
                                            scrollbarWidth: 'none',
                                            flex: '0 0 auto',
                                            minWidth: 0,
                                            maxWidth: 360
                                        },
                                        children: windows.map((w)=>{
                                            const isActive = active?.id === w.id;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "lc-tab flex items-center gap-1.5 shrink-0",
                                                "data-active": isActive,
                                                onClick: ()=>focusWindow(w.id),
                                                style: {
                                                    padding: '9px 10px',
                                                    fontSize: 12.5,
                                                    fontWeight: 500,
                                                    color: isActive ? PORTAL_INK : PORTAL_MUTED,
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "max-w-40 truncate",
                                                        children: w.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                                        lineNumber: 404,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            requestClose(w.id);
                                                        },
                                                        className: "flex items-center justify-center rounded hover:bg-black/5",
                                                        style: {
                                                            width: 16,
                                                            height: 16
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                            size: 11,
                                                            style: {
                                                                color: PORTAL_MUTED
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                                            lineNumber: 405,
                                                            columnNumber: 195
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                                        lineNumber: 405,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, w.id, true, {
                                                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                                lineNumber: 403,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                        lineNumber: 399,
                                        columnNumber: 15
                                    }, this),
                                    activeMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$workspace$2f$page$2d$menu$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageMenuBar"], {
                                        menu: activeMenu
                                    }, void 0, false, {
                                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                        lineNumber: 411,
                                        columnNumber: 30
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                lineNumber: 398,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: pageBodyRef,
                                className: "flex-1 min-h-0 relative",
                                style: {
                                    background: PORTAL_GROUND
                                },
                                children: windows.map((w)=>// Inactive tabs use display:none, NOT visibility:hidden — a hidden
                                    // InlineBuilder is a ReactFlow canvas, and @xyflow forces
                                    // `visibility:visible` on each measured node, which overrides an
                                    // ancestor's `visibility:hidden` and makes the builder's node boxes
                                    // bleed through over the active tab. display:none can't be overridden
                                    // by descendants, and still keeps the tab mounted (state preserved).
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0",
                                        style: {
                                            display: active?.id === w.id ? 'block' : 'none',
                                            overflow: 'auto'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PageBody, {
                                            pageKey: w.pageKey
                                        }, void 0, false, {
                                            fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                            lineNumber: 422,
                                            columnNumber: 19
                                        }, this)
                                    }, w.id, false, {
                                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                        lineNumber: 421,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                lineNumber: 413,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                        lineNumber: 397,
                        columnNumber: 11
                    }, this),
                    showPage && showChat && !closingLast && mode === 'split' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onPointerDown: startSplitDrag,
                        className: `cwp-split-handle${dragging ? ' dragging' : ''}`,
                        role: "separator",
                        "aria-orientation": "vertical",
                        title: "Drag to resize",
                        style: {
                            position: 'absolute',
                            top: 10,
                            bottom: 10,
                            right: `calc(${chatBasis} + 10px)`,
                            width: 14,
                            transform: 'translateX(50%)',
                            cursor: 'col-resize',
                            zIndex: 6,
                            touchAction: 'none'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "cwp-split-grip"
                        }, void 0, false, {
                            fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                            lineNumber: 441,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                        lineNumber: 433,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative min-w-0 flex flex-col cwp-card",
                        style: {
                            flex: chatFull ? '1 1 0px' : mode === 'collapsed' ? '0 0 0px' : `0 0 ${chatBasis}`,
                            overflow: 'hidden',
                            margin: mode === 'collapsed' ? 0 : 10,
                            marginLeft: hasPages && showPage ? 0 : 10,
                            borderRadius: mode === 'collapsed' ? 0 : hasPages && showPage ? '0 3px 3px 0' : 12,
                            background: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].bg,
                            // No dark shadow cast onto the page panel on its left — only the chat's
                            // own soft neumorphic elevation (and none while docked flush to a page).
                            boxShadow: mode === 'collapsed' ? 'none' : hasPages && showPage ? 'none' : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$neumorphic$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEU"].shadowOut,
                            transition: dragging ? 'none' : undefined,
                            zIndex: 1
                        },
                        children: [
                            hasPages && showChat && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute flex items-center gap-1",
                                style: {
                                    top: 17,
                                    left: 12,
                                    zIndex: 5
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setMode('collapsed'),
                                        title: "Focus the page — hide the chat",
                                        className: "hover:bg-black/5",
                                        style: {
                                            display: 'grid',
                                            placeItems: 'center',
                                            width: 28,
                                            height: 28,
                                            borderRadius: 7,
                                            border: 'none',
                                            background: 'transparent',
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].muted,
                                            cursor: 'pointer'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$right$2d$close$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelRightClose$3e$__["PanelRightClose"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                            lineNumber: 469,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                        lineNumber: 468,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setMode(mode === 'expanded' ? 'split' : 'expanded'),
                                        title: mode === 'expanded' ? 'Back to split view' : 'Focus the chat — hide the page',
                                        className: "hover:bg-black/5",
                                        style: {
                                            display: 'grid',
                                            placeItems: 'center',
                                            width: 28,
                                            height: 28,
                                            borderRadius: 7,
                                            border: 'none',
                                            background: 'transparent',
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].muted,
                                            cursor: 'pointer'
                                        },
                                        children: mode === 'expanded' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__["Minimize2"], {
                                            size: 15
                                        }, void 0, false, {
                                            fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                            lineNumber: 472,
                                            columnNumber: 40
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
                                            size: 15
                                        }, void 0, false, {
                                            fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                            lineNumber: 472,
                                            columnNumber: 66
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                        lineNumber: 471,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                lineNumber: 467,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-h-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$ui$2f$assistant$2d$thread$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AssistantThread"], {
                                    assistant: a,
                                    variant: "focus"
                                }, void 0, false, {
                                    fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                    lineNumber: 477,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                lineNumber: 476,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                        lineNumber: 447,
                        columnNumber: 9
                    }, this),
                    hasPages && mode === 'collapsed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setMode('split'),
                        title: "Open chat",
                        style: {
                            position: 'absolute',
                            right: 14,
                            bottom: 18,
                            zIndex: 30,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 7,
                            height: 38,
                            padding: '0 14px',
                            borderRadius: 999,
                            background: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].surface,
                            border: 'none',
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].text,
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 600,
                            boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$librechat$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LC"].shadowOut
                        },
                        className: "hover:brightness-[0.98]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$inscope$2d$neu$2d$mark$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InScopeNeuMark"], {
                                size: 22
                            }, void 0, false, {
                                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                                lineNumber: 489,
                                columnNumber: 13
                            }, this),
                            " Chat"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                        lineNumber: 483,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
                lineNumber: 395,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/assistant/workspace/copilot-workspace-panel.tsx",
        lineNumber: 280,
        columnNumber: 5
    }, this));
}
_s1(ChatWorkspace, "l+tM/7Oin78CdwszPVS3Y5hCITk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$ui$2f$use$2d$assistant$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAssistant"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"]
    ];
});
_c5 = ChatWorkspace;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "InlineBuilder");
__turbopack_context__.k.register(_c1, "PageBody");
__turbopack_context__.k.register(_c2, "SideLabel");
__turbopack_context__.k.register(_c3, "SideRow");
__turbopack_context__.k.register(_c4, "SideSection");
__turbopack_context__.k.register(_c5, "ChatWorkspace");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_209a44d4._.js.map