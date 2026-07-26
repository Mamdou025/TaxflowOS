(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "getErrorMessage",
    ()=>getErrorMessage,
    "getErrorMessageAsync",
    ()=>getErrorMessageAsync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$3$2e$1$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@3.3.1/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$3$2e$1$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function getErrorMessage(error) {
    // Handle null/undefined
    if (error === null || error === undefined) {
        return "Unknown error";
    }
    // Handle Error instances (and their subclasses)
    if (error instanceof Error) {
        // Some errors have a cause property with more details
        if (error.cause && error.cause instanceof Error) {
            return `${error.message}: ${error.cause.message}`;
        }
        return error.message;
    }
    // Handle strings
    if (typeof error === "string") {
        return error;
    }
    // Handle objects
    if (typeof error === "object") {
        const obj = error;
        // Check for common error message properties
        if (typeof obj.message === "string" && obj.message) {
            return obj.message;
        }
        // AI SDK often wraps errors in responseBody or data
        if (obj.responseBody && typeof obj.responseBody === "object") {
            const body = obj.responseBody;
            if (typeof body.error === "string") {
                return body.error;
            }
            if (body.error && typeof body.error === "object" && typeof body.error.message === "string") {
                return body.error.message;
            }
        }
        // Check for nested error property
        if (typeof obj.error === "string" && obj.error) {
            return obj.error;
        }
        if (obj.error && typeof obj.error === "object") {
            const nestedError = obj.error;
            if (typeof nestedError.message === "string") {
                return nestedError.message;
            }
        }
        // Check for data.error pattern (common in API responses)
        if (obj.data && typeof obj.data === "object") {
            const data = obj.data;
            if (typeof data.error === "string") {
                return data.error;
            }
            if (typeof data.message === "string") {
                return data.message;
            }
        }
        // Check for reason property (common in some error types)
        if (typeof obj.reason === "string" && obj.reason) {
            return obj.reason;
        }
        // Check for statusText (HTTP errors)
        if (typeof obj.statusText === "string" && obj.statusText) {
            const status = typeof obj.status === "number" ? ` (${obj.status})` : "";
            return `${obj.statusText}${status}`;
        }
        // Try to stringify the error object (but avoid [object Object])
        try {
            const stringified = JSON.stringify(error, null, 0);
            if (stringified && stringified !== "{}" && stringified.length < 500) {
                return stringified;
            }
        } catch  {
        // Ignore stringify errors
        }
        // Last resort: use Object.prototype.toString
        const toString = Object.prototype.toString.call(error);
        if (toString !== "[object Object]") {
            return toString;
        }
    }
    return "Unknown error";
}
async function getErrorMessageAsync(error) {
    // If error is a Promise, await it to get the actual error
    if (error instanceof Promise) {
        try {
            const resolvedValue = await error;
            // The promise resolved - check if it contains error info
            return getErrorMessage(resolvedValue);
        } catch (rejectedError) {
            return getErrorMessage(rejectedError);
        }
    }
    // Check if it's a thenable (Promise-like)
    if (error && typeof error === "object" && "then" in error && typeof error.then === "function") {
        try {
            const resolvedValue = await error;
            // The promise resolved - check if it contains error info
            return getErrorMessage(resolvedValue);
        } catch (rejectedError) {
            return getErrorMessage(rejectedError);
        }
    }
    return getErrorMessage(error);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/atoms/overlay.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "closeAllOverlaysAtom",
    ()=>closeAllOverlaysAtom,
    "closeOverlayAtom",
    ()=>closeOverlayAtom,
    "hasOverlaysAtom",
    ()=>hasOverlaysAtom,
    "openOverlayAtom",
    ()=>openOverlayAtom,
    "overlayDepthAtom",
    ()=>overlayDepthAtom,
    "overlayStackAtom",
    ()=>overlayStackAtom,
    "popOverlayAtom",
    ()=>popOverlayAtom,
    "pushOverlayAtom",
    ()=>pushOverlayAtom,
    "replaceOverlayAtom",
    ()=>replaceOverlayAtom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-client] (ecmascript)");
;
const overlayStackAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])([]);
const hasOverlaysAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])((get)=>get(overlayStackAtom).length > 0);
const overlayDepthAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])((get)=>get(overlayStackAtom).length);
/**
 * Generate a unique ID for overlay instances
 */ function generateOverlayId() {
    return `overlay-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
const openOverlayAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (_get, set, params)=>{
    const id = generateOverlayId();
    const item = {
        id,
        component: params.component,
        props: params.props ?? {},
        options: params.options ?? {}
    };
    set(overlayStackAtom, [
        item
    ]);
    return id;
});
const pushOverlayAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, params)=>{
    const id = generateOverlayId();
    const item = {
        id,
        component: params.component,
        props: params.props ?? {},
        options: params.options ?? {}
    };
    set(overlayStackAtom, [
        ...get(overlayStackAtom),
        item
    ]);
    return id;
});
const popOverlayAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set)=>{
    const stack = get(overlayStackAtom);
    if (stack.length <= 1) {
        // Call onClose for the last item
        const item = stack[0];
        item?.options.onClose?.();
        set(overlayStackAtom, []);
        return;
    }
    // Pop the top item and call its onClose
    const poppedItem = stack.at(-1);
    poppedItem?.options.onClose?.();
    set(overlayStackAtom, stack.slice(0, -1));
});
const replaceOverlayAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, params)=>{
    const stack = get(overlayStackAtom);
    const id = generateOverlayId();
    const item = {
        id,
        component: params.component,
        props: params.props ?? {},
        options: params.options ?? {}
    };
    if (stack.length === 0) {
        set(overlayStackAtom, [
            item
        ]);
    } else {
        // Call onClose for the replaced item
        const poppedItem = stack.at(-1);
        poppedItem?.options.onClose?.();
        set(overlayStackAtom, [
            ...stack.slice(0, -1),
            item
        ]);
    }
    return id;
});
const closeAllOverlaysAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set)=>{
    const stack = get(overlayStackAtom);
    // Call onClose for all items
    for (const item of stack){
        item.options.onClose?.();
    }
    set(overlayStackAtom, []);
});
const closeOverlayAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, id)=>{
    const stack = get(overlayStackAtom);
    const index = stack.findIndex((item)=>item.id === id);
    if (index === -1) {
        return;
    }
    // Call onClose for all items from this index onwards
    for(let i = index; i < stack.length; i++){
        stack[i].options.onClose?.();
    }
    set(overlayStackAtom, stack.slice(0, index));
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/view-transition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Client-side View Transition helper.
//
// `@view-transition { navigation: auto }` (globals.css) only animates
// cross-document navigations — Next's client-side router.push never triggers it.
// So to transition between routes on a SPA nav (e.g. the /home → / "Scope" move)
// we explicitly wrap the navigation in document.startViewTransition(). The root
// crossfade is styled in globals.css (::view-transition-old/new(root)).
//
// The VT snapshots the "new" DOM when the callback's promise resolves, so we give
// React a couple of frames to commit the destination route before resolving.
__turbopack_context__.s([
    "viewTransitionNav",
    ()=>viewTransitionNav
]);
function viewTransitionNav(navigate) {
    if (typeof document === 'undefined') {
        navigate();
        return;
    }
    const doc = document;
    const reduced = ("TURBOPACK compile-time value", "object") !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!doc.startViewTransition || reduced) {
        navigate();
        return;
    }
    doc.startViewTransition(()=>new Promise((resolve)=>{
            navigate();
            // Wait for React to commit + paint the new route before the VT captures
            // its "new" snapshot; the timeout is a safety net if paint is slow.
            requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(resolve, 90)));
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/librechat-theme.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Chat palette — LIGHT NEUMORPHIC. The chat (Scope focus mode + the docked
// AssistantPanel) is a light neumorphic surface, matching the sidebar and the nav
// pill; the OTHER pages keep their dark grid background (that bg is NOT driven by
// this palette). One place to swap the chat's look. Aligned to the NEU tokens
// (components/neumorphic-sidebar.tsx).
// Theme-aware: every key maps to a --sx-* token (globals.css) whose :root value
// is the original light value and whose .dark value is the dark counterpart, so
// the chat re-skins with the `.dark` class (these are used in inline style).
__turbopack_context__.s([
    "LC",
    ()=>LC
]);
const LC = {
    bg: 'var(--sx-surface)',
    sidebar: 'var(--sx-surface)',
    panel: 'var(--sx-panel)',
    surface: 'var(--sx-raised)',
    surfaceHover: 'var(--sx-raised-hover)',
    border: 'var(--sx-hairline)',
    borderSubtle: 'var(--sx-hairline-subtle)',
    title: 'var(--sx-ink)',
    text: 'var(--sx-ink)',
    body: 'var(--sx-body)',
    muted: 'var(--sx-muted)',
    faint: 'var(--sx-faint)',
    accent: 'var(--sx-accent)',
    // Neumorphic depth (dual light/dark soft shadows) — for raised chat elements.
    shadowOut: 'var(--sx-chat-shadow-out)',
    shadowSm: 'var(--sx-chat-shadow-sm)',
    shadowIn: 'var(--sx-chat-shadow-in)'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/monaco-theme.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Monaco editor theme configuration for Vercel-like dark mode
__turbopack_context__.s([
    "vercelDarkTheme",
    ()=>vercelDarkTheme
]);
const vercelDarkTheme = {
    base: "vs-dark",
    inherit: true,
    rules: [
        // Default foreground
        {
            token: "",
            foreground: "ededed"
        },
        // Comments
        {
            token: "comment",
            foreground: "a1a1a1",
            fontStyle: "italic"
        },
        // Keywords (pink)
        {
            token: "keyword",
            foreground: "ff4d8d"
        },
        {
            token: "keyword.operator",
            foreground: "ff4d8d"
        },
        // Strings (green)
        {
            token: "string",
            foreground: "00ca50"
        },
        {
            token: "string.escape",
            foreground: "00ca50"
        },
        // Numbers (white)
        {
            token: "number",
            foreground: "ffffff"
        },
        // Types (blue)
        {
            token: "type",
            foreground: "47a8ff"
        },
        {
            token: "type.identifier",
            foreground: "47a8ff"
        },
        // Identifiers and parameters (light gray - default)
        {
            token: "identifier",
            foreground: "ededed"
        },
        {
            token: "parameter",
            foreground: "ededed"
        },
        {
            token: "variable",
            foreground: "ededed"
        },
        {
            token: "variable.parameter",
            foreground: "ededed"
        },
        // Functions (purple)
        {
            token: "function",
            foreground: "c472fb"
        },
        {
            token: "identifier.function",
            foreground: "c472fb"
        },
        {
            token: "member.function",
            foreground: "c472fb"
        },
        // Built-in constants like true/false/null (blue)
        {
            token: "constant.language",
            foreground: "47a8ff"
        },
        {
            token: "keyword.json",
            foreground: "47a8ff"
        },
        // Built-in objects like console (light gray)
        {
            token: "variable.predefined",
            foreground: "ededed"
        },
        {
            token: "support.variable",
            foreground: "ededed"
        },
        {
            token: "support.constant",
            foreground: "ededed"
        },
        // Delimiters and punctuation (light gray)
        {
            token: "delimiter",
            foreground: "ededed"
        },
        {
            token: "delimiter.bracket",
            foreground: "ededed"
        },
        {
            token: "delimiter.parenthesis",
            foreground: "ededed"
        },
        {
            token: "delimiter.curly",
            foreground: "ededed"
        },
        {
            token: "delimiter.array",
            foreground: "ededed"
        },
        {
            token: "punctuation",
            foreground: "ededed"
        },
        // Operators (light gray)
        {
            token: "operator",
            foreground: "ededed"
        },
        // JSON-specific tokens
        {
            token: "string.key.json",
            foreground: "47a8ff"
        },
        {
            token: "string.value.json",
            foreground: "00ca50"
        },
        {
            token: "number.json",
            foreground: "ffffff"
        },
        {
            token: "keyword.json",
            foreground: "47a8ff"
        }
    ],
    colors: {
        "editor.background": "#000000",
        "editor.foreground": "#ededed",
        "editorLineNumber.foreground": "#444444",
        "editorLineNumber.activeForeground": "#888888",
        "editor.lineHighlightBackground": "#0A0A0A",
        "editor.selectionBackground": "#264F78",
        "editor.inactiveSelectionBackground": "#1A1A1A",
        "editorCursor.foreground": "#FFFFFF",
        "editorWhitespace.foreground": "#333333",
        "editorIndentGuide.background": "#1A1A1A",
        "editorIndentGuide.activeBackground": "#333333",
        "editorBracketMatch.background": "#0A0A0A",
        "editorBracketMatch.border": "#444444"
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/keyword-rulebook-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getRulebookEntries",
    ()=>getRulebookEntries,
    "removeFromRulebook",
    ()=>removeFromRulebook,
    "saveToRulebook",
    ()=>saveToRulebook
]);
const STORAGE_KEY = "workflow-keyword-rulebook-v1";
function parseStorage() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch  {
        return [];
    }
}
function writeStorage(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
function toStringArray(value) {
    if (Array.isArray(value)) return value.map(String).filter(Boolean);
    if (typeof value === "string") return value.split(/[,;\n|]/).map((s)=>s.trim()).filter(Boolean);
    return [];
}
function getRulebookEntries() {
    return parseStorage();
}
function saveToRulebook(rule) {
    const entries = parseStorage();
    const entry = {
        id: `rb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: String(rule.categoryLabel || rule.categoryId || "Unnamed Rule"),
        savedAt: new Date().toISOString(),
        categoryId: String(rule.categoryId || ""),
        categoryLabel: String(rule.categoryLabel || ""),
        confidence: Number(rule.confidence ?? 0.9),
        priority: Number(rule.priority ?? 1),
        scope: String(rule.scope || "company"),
        description: String(rule.description || ""),
        exactKeywords: toStringArray(rule.exactKeywords),
        containsKeywords: toStringArray(rule.containsKeywords),
        excludeKeywords: toStringArray(rule.excludeKeywords),
        ruleVersion: String(rule.ruleVersion || "v1")
    };
    writeStorage([
        ...entries,
        entry
    ]);
    return entry;
}
function removeFromRulebook(id) {
    writeStorage(parseStorage().filter((e)=>e.id !== id));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/integrations-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "integrationIdsAtom",
    ()=>integrationIdsAtom,
    "integrationsAtom",
    ()=>integrationsAtom,
    "integrationsLoadedAtom",
    ()=>integrationsLoadedAtom,
    "integrationsVersionAtom",
    ()=>integrationsVersionAtom,
    "selectedIntegrationAtom",
    ()=>selectedIntegrationAtom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-client] (ecmascript)");
;
const integrationsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])([]);
const integrationsLoadedAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
const selectedIntegrationAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null);
const integrationsVersionAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(0);
const integrationIdsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])((get)=>{
    const integrations = get(integrationsAtom);
    return new Set(integrations.map((i)=>i.id));
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/codegen-registry.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Codegen Registry (Auto-Generated)
 *
 * This file is automatically generated by scripts/discover-plugins.ts
 * DO NOT EDIT MANUALLY - your changes will be overwritten!
 *
 * Contains auto-generated codegen templates for steps with stepHandler.
 * These templates are used when exporting workflows to standalone projects.
 *
 * Generated templates: 36
 */ /**
 * Auto-generated codegen templates
 * Maps action IDs to their generated export code templates
 */ __turbopack_context__.s([
    "AUTO_GENERATED_TEMPLATES",
    ()=>AUTO_GENERATED_TEMPLATES,
    "getAutoGeneratedTemplate",
    ()=>getAutoGeneratedTemplate
]);
const AUTO_GENERATED_TEMPLATES = {
    "ai-gateway/generate-text": `import { createGateway, generateObject, generateText } from "ai";
import { z } from "zod";
import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type GenerateTextResult =
  | { success: true; text: string }
  | { success: true; object: Record<string, unknown> }
  | { success: false; error: string };

export type GenerateTextCoreInput = {
  aiModel?: string;
  aiPrompt?: string;
  aiFormat?: string;
  aiSchema?: string;
};

export async function generateTextStep(
  input: GenerateTextCoreInput,
): Promise<GenerateTextResult> {
  "use step";
  const credentials = await fetchCredentials("ai-gateway");
  const apiKey = credentials.AI_GATEWAY_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "AI_GATEWAY_API_KEY is not configured. Please add it in Project Integrations.",
    };
  }

  const modelId = input.aiModel || "meta/llama-4-scout";
  const promptText = input.aiPrompt || "";

  if (!promptText || promptText.trim() === "") {
    return {
      success: false,
      error: "Prompt is required for text generation",
    };
  }

  const modelString = getModelString(modelId);

  try {
    const gateway = createGateway({
      apiKey,
    });

    if (input.aiFormat === "object" && input.aiSchema) {
      const schema = JSON.parse(input.aiSchema) as SchemaField[];
      const zodSchema = buildZodSchema(schema);

      const { object } = await generateObject({
        model: gateway(modelString),
        prompt: promptText,
        schema: zodSchema,
      });

      return { success: true, object };
    }

    const { text } = await generateText({
      model: gateway(modelString),
      prompt: promptText,
    });

    return { success: true, text };
  } catch (error) {
    const message = await getErrorMessageAsync(error);
    return {
      success: false,
      error: \`Text generation failed: \${message}\`,
    };
  }
}
`,
    "ai-gateway/generate-image": `import { createGateway, experimental_generateImage as generateImage } from "ai";
import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type GenerateImageResult =
  | { success: true; base64: string }
  | { success: false; error: string };

export type GenerateImageCoreInput = {
  imageModel?: string;
  imagePrompt?: string;
};

export async function generateImageStep(
  input: GenerateImageCoreInput,
): Promise<GenerateImageResult> {
  "use step";
  const credentials = await fetchCredentials("ai-gateway");
  const apiKey = credentials.AI_GATEWAY_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "AI_GATEWAY_API_KEY is not configured. Please add it in Project Integrations.",
    };
  }

  const modelId = input.imageModel || "google/imagen-4.0-generate-001";
  const promptText = input.imagePrompt || "";

  if (!promptText || promptText.trim() === "") {
    return {
      success: false,
      error: "Prompt is required for image generation",
    };
  }

  try {
    const gateway = createGateway({
      apiKey,
    });
    const result = await generateImage({
      // biome-ignore lint/suspicious/noExplicitAny: AI gateway model ID is dynamic
      model: gateway.imageModel(modelId as any),
      prompt: promptText,
      size: "1024x1024",
    });

    if (!result.image) {
      return {
        success: false,
        error: "Failed to generate image: No image returned",
      };
    }

    const base64 = result.image.base64;

    return { success: true, base64 };
  } catch (error) {
    const message = await getErrorMessageAsync(error);
    return {
      success: false,
      error: \`Image generation failed: \${message}\`,
    };
  }
}
`,
    "blob/put": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type PutBlobResult =
  | { success: true; url: string; downloadUrl: string; pathname: string }
  | { success: false; error: string };

export type PutBlobCoreInput = {
  pathname: string;
  body: string;
  contentType?: string;
  access?: string;
  addRandomSuffix?: string;
};

export async function putBlobStep(
  input: PutBlobCoreInput,
): Promise<PutBlobResult> {
  "use step";
  const credentials = await fetchCredentials("blob");
  const token = credentials.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    return {
      success: false,
      error:
        "BLOB_READ_WRITE_TOKEN is not configured. Please add it in Project Integrations.",
    };
  }

  if (!input.pathname) {
    return {
      success: false,
      error: "Pathname is required",
    };
  }

  if (!input.body) {
    return {
      success: false,
      error: "Content body is required",
    };
  }

  try {
    const url = new URL(\`/\${input.pathname}\`, BLOB_API_URL);

    // Add query parameters
    const addRandomSuffix = input.addRandomSuffix !== "false";
    if (!addRandomSuffix) {
      url.searchParams.set("addRandomSuffix", "false");
    }

    const headers: Record<string, string> = {
      Authorization: \`Bearer \${token}\`,
      "x-api-version": "7",
    };

    if (input.contentType) {
      headers["x-content-type"] = input.contentType;
    }

    const response = await fetch(url.toString(), {
      method: "PUT",
      headers,
      body: input.body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage: string;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorText;
      } catch {
        errorMessage = errorText || \`HTTP \${response.status}\`;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }

    const data = (await response.json()) as PutBlobResponse;
    return {
      success: true,
      url: data.url,
      downloadUrl: data.downloadUrl,
      pathname: data.pathname,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: \`Failed to upload blob: \${message}\`,
    };
  }
}
`,
    "blob/list": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type ListBlobsResult =
  | {
      success: true;
      blobs: BlobItem[];
      cursor?: string;
      hasMore: boolean;
    }
  | { success: false; error: string };

export type ListBlobsCoreInput = {
  prefix?: string;
  limit?: number;
  cursor?: string;
};

export async function listBlobsStep(
  input: ListBlobsCoreInput,
): Promise<ListBlobsResult> {
  "use step";
  const credentials = await fetchCredentials("blob");
  const token = credentials.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    return {
      success: false,
      error:
        "BLOB_READ_WRITE_TOKEN is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const url = new URL(BLOB_API_URL);

    if (input.prefix) {
      url.searchParams.set("prefix", input.prefix);
    }

    if (input.limit) {
      url.searchParams.set("limit", String(input.limit));
    }

    if (input.cursor) {
      url.searchParams.set("cursor", input.cursor);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "x-api-version": "7",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage: string;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorText;
      } catch {
        errorMessage = errorText || \`HTTP \${response.status}\`;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }

    const data = (await response.json()) as ListBlobsResponse;
    return {
      success: true,
      blobs: data.blobs,
      cursor: data.cursor,
      hasMore: data.hasMore,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: \`Failed to list blobs: \${message}\`,
    };
  }
}
`,
    "clerk/get-user": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export type ClerkGetUserCoreInput = {
  userId: string;
};

export async function clerkGetUserStep(
  input: ClerkGetUserCoreInput,
): Promise<ClerkUserResult> {
  "use step";
  const credentials = await fetchCredentials("clerk");
  const secretKey = credentials.CLERK_SECRET_KEY;

  if (!secretKey) {
    return {
      success: false,
      error: {
        message:
          "CLERK_SECRET_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  if (!input.userId) {
    return {
      success: false,
      error: { message: "User ID is required." },
    };
  }

  try {
    const response = await fetch(
      \`https://api.clerk.com/v1/users/\${encodeURIComponent(input.userId)}\`,
      {
        headers: {
          Authorization: \`Bearer \${secretKey}\`,
          "Content-Type": "application/json",
          "User-Agent": "workflow-builder.dev",
        },
      },
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        success: false,
        error: {
          message:
            errorBody.errors?.[0]?.message ||
            \`Failed to get user: \${response.status}\`,
        },
      };
    }

    const apiUser = await response.json();
    return { success: true, data: toClerkUserData(apiUser) };
  } catch (err) {
    return {
      success: false,
      error: { message: \`Failed to get user: \${getErrorMessage(err)}\` },
    };
  }
}
`,
    "clerk/create-user": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export type ClerkCreateUserCoreInput = {
  emailAddress: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  publicMetadata?: string;
  privateMetadata?: string;
};

export async function clerkCreateUserStep(
  input: ClerkCreateUserCoreInput,
): Promise<ClerkUserResult> {
  "use step";
  const credentials = await fetchCredentials("clerk");
  const secretKey = credentials.CLERK_SECRET_KEY;

  if (!secretKey) {
    return {
      success: false,
      error: {
        message:
          "CLERK_SECRET_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  if (!input.emailAddress) {
    return {
      success: false,
      error: { message: "Email address is required." },
    };
  }

  try {
    // Build the request body
    const body: Record<string, unknown> = {
      email_address: [input.emailAddress],
    };

    if (input.firstName) {
      body.first_name = input.firstName;
    }
    if (input.lastName) {
      body.last_name = input.lastName;
    }
    if (input.password) {
      body.password = input.password;
    }
    if (input.publicMetadata) {
      try {
        body.public_metadata = JSON.parse(input.publicMetadata);
      } catch {
        return {
          success: false,
          error: { message: "Invalid JSON format for publicMetadata" },
        };
      }
    }
    if (input.privateMetadata) {
      try {
        body.private_metadata = JSON.parse(input.privateMetadata);
      } catch {
        return {
          success: false,
          error: { message: "Invalid JSON format for privateMetadata" },
        };
      }
    }

    const response = await fetch("https://api.clerk.com/v1/users", {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${secretKey}\`,
        "Content-Type": "application/json",
        "User-Agent": "workflow-builder.dev",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        success: false,
        error: {
          message:
            errorBody.errors?.[0]?.message ||
            \`Failed to create user: \${response.status}\`,
        },
      };
    }

    const apiUser = await response.json();
    return { success: true, data: toClerkUserData(apiUser) };
  } catch (err) {
    return {
      success: false,
      error: { message: \`Failed to create user: \${getErrorMessage(err)}\` },
    };
  }
}
`,
    "clerk/update-user": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export type ClerkUpdateUserCoreInput = {
  userId: string;
  firstName?: string;
  lastName?: string;
  publicMetadata?: string;
  privateMetadata?: string;
};

export async function clerkUpdateUserStep(
  input: ClerkUpdateUserCoreInput,
): Promise<ClerkUserResult> {
  "use step";
  const credentials = await fetchCredentials("clerk");
  const secretKey = credentials.CLERK_SECRET_KEY;

  if (!secretKey) {
    return {
      success: false,
      error: {
        message:
          "CLERK_SECRET_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  if (!input.userId) {
    return {
      success: false,
      error: { message: "User ID is required." },
    };
  }

  try {
    // Build the request body
    const body: Record<string, unknown> = {};

    if (input.firstName !== undefined) {
      body.first_name = input.firstName;
    }
    if (input.lastName !== undefined) {
      body.last_name = input.lastName;
    }
    if (input.publicMetadata) {
      try {
        body.public_metadata = JSON.parse(input.publicMetadata);
      } catch {
        return {
          success: false,
          error: { message: "Invalid JSON format for publicMetadata" },
        };
      }
    }
    if (input.privateMetadata) {
      try {
        body.private_metadata = JSON.parse(input.privateMetadata);
      } catch {
        return {
          success: false,
          error: { message: "Invalid JSON format for privateMetadata" },
        };
      }
    }

    const response = await fetch(
      \`https://api.clerk.com/v1/users/\${encodeURIComponent(input.userId)}\`,
      {
        method: "PATCH",
        headers: {
          Authorization: \`Bearer \${secretKey}\`,
          "Content-Type": "application/json",
          "User-Agent": "workflow-builder.dev",
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        success: false,
        error: {
          message:
            errorBody.errors?.[0]?.message ||
            \`Failed to update user: \${response.status}\`,
        },
      };
    }

    const apiUser = await response.json();
    return { success: true, data: toClerkUserData(apiUser) };
  } catch (err) {
    return {
      success: false,
      error: { message: \`Failed to update user: \${getErrorMessage(err)}\` },
    };
  }
}
`,
    "clerk/delete-user": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type DeleteUserResult =
  | { success: true; data: { deleted: true } }
  | { success: false; error: { message: string } };

export type ClerkDeleteUserCoreInput = {
  userId: string;
};

export async function clerkDeleteUserStep(
  input: ClerkDeleteUserCoreInput,
): Promise<DeleteUserResult> {
  "use step";
  const credentials = await fetchCredentials("clerk");
  const secretKey = credentials.CLERK_SECRET_KEY;

  if (!secretKey) {
    return {
      success: false,
      error: {
        message:
          "CLERK_SECRET_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  if (!input.userId) {
    return {
      success: false,
      error: { message: "User ID is required." },
    };
  }

  try {
    const response = await fetch(
      \`https://api.clerk.com/v1/users/\${encodeURIComponent(input.userId)}\`,
      {
        method: "DELETE",
        headers: {
          Authorization: \`Bearer \${secretKey}\`,
          "Content-Type": "application/json",
          "User-Agent": "workflow-builder.dev",
        },
      },
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        success: false,
        error: {
          message:
            errorBody.errors?.[0]?.message ||
            \`Failed to delete user: \${response.status}\`,
        },
      };
    }

    return { success: true, data: { deleted: true } };
  } catch (err) {
    return {
      success: false,
      error: { message: \`Failed to delete user: \${getErrorMessage(err)}\` },
    };
  }
}
`,
    "fal/generate-image": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type GenerateImageResult =
  | {
      success: true;
      data: { imageUrl: string; width?: number; height?: number };
    }
  | { success: false; error: { message: string } };

export type FalGenerateImageCoreInput = {
  model: string;
  prompt: string;
  imageSize?: string;
  numImages?: number;
};

export async function falGenerateImageStep(
  input: FalGenerateImageCoreInput,
): Promise<GenerateImageResult> {
  "use step";
  const credentials = await fetchCredentials("fal");
  const apiKey = credentials.FAL_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "FAL_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  try {
    const model = input.model || "fal-ai/flux/schnell";
    const response = await fetch(\`\${FAL_API_URL}/\${model}\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Key \${apiKey}\`,
      },
      body: JSON.stringify({
        prompt: input.prompt,
        image_size: input.imageSize || "landscape_16_9",
        num_images: input.numImages || 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: { message: \`HTTP \${response.status}: \${errorText}\` },
      };
    }

    const queueResponse = (await response.json()) as FalQueueResponse;

    // If the response is queued, poll for the result
    let result: FalImageResponse;
    if (
      queueResponse.status === "IN_QUEUE" ||
      queueResponse.status === "IN_PROGRESS"
    ) {
      result = await pollForResult(
        queueResponse.status_url,
        queueResponse.response_url,
        apiKey,
      );
    } else {
      // Immediate response (shouldn't happen with queue endpoint, but handle it)
      result = queueResponse as unknown as FalImageResponse;
    }

    if (result.error) {
      return { success: false, error: { message: result.error } };
    }

    if (!result.images || result.images.length === 0) {
      return {
        success: false,
        error: { message: "No images returned from fal.ai" },
      };
    }

    const image = result.images[0];
    return {
      success: true,
      data: { imageUrl: image.url, width: image.width, height: image.height },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to generate image: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "fal/generate-video": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type GenerateVideoResult =
  | { success: true; data: { videoUrl: string } }
  | { success: false; error: { message: string } };

export type FalGenerateVideoCoreInput = {
  model: string;
  prompt: string;
  imageUrl?: string;
};

export async function falGenerateVideoStep(
  input: FalGenerateVideoCoreInput,
): Promise<GenerateVideoResult> {
  "use step";
  const credentials = await fetchCredentials("fal");
  const apiKey = credentials.FAL_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "FAL_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  try {
    const model = input.model || "fal-ai/minimax-video";

    const requestBody: Record<string, unknown> = {
      prompt: input.prompt,
    };

    if (input.imageUrl) {
      requestBody.image_url = input.imageUrl;
    }

    const response = await fetch(\`\${FAL_API_URL}/\${model}\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Key \${apiKey}\`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: { message: \`HTTP \${response.status}: \${errorText}\` },
      };
    }

    const queueResponse = (await response.json()) as FalQueueResponse;

    let result: FalVideoResponse;
    if (
      queueResponse.status === "IN_QUEUE" ||
      queueResponse.status === "IN_PROGRESS"
    ) {
      result = await pollForResult(
        queueResponse.status_url,
        queueResponse.response_url,
        apiKey,
      );
    } else {
      result = queueResponse as unknown as FalVideoResponse;
    }

    if (result.error) {
      return { success: false, error: { message: result.error } };
    }

    if (!result.video?.url) {
      return {
        success: false,
        error: { message: "No video returned from fal.ai" },
      };
    }

    return { success: true, data: { videoUrl: result.video.url } };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to generate video: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "fal/upscale-image": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type UpscaleImageResult =
  | {
      success: true;
      data: { imageUrl: string; width?: number; height?: number };
    }
  | { success: false; error: { message: string } };

export type FalUpscaleImageCoreInput = {
  model: string;
  imageUrl: string;
  scale?: string;
};

export async function falUpscaleImageStep(
  input: FalUpscaleImageCoreInput,
): Promise<UpscaleImageResult> {
  "use step";
  const credentials = await fetchCredentials("fal");
  const apiKey = credentials.FAL_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "FAL_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  try {
    const model = input.model || "fal-ai/creative-upscaler";
    const scale = Number.parseInt(input.scale || "2", 10);

    const response = await fetch(\`\${FAL_API_URL}/\${model}\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Key \${apiKey}\`,
      },
      body: JSON.stringify({
        image_url: input.imageUrl,
        scale,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: { message: \`HTTP \${response.status}: \${errorText}\` },
      };
    }

    const queueResponse = (await response.json()) as FalQueueResponse;

    let result: FalUpscaleResponse;
    if (
      queueResponse.status === "IN_QUEUE" ||
      queueResponse.status === "IN_PROGRESS"
    ) {
      result = await pollForResult(
        queueResponse.status_url,
        queueResponse.response_url,
        apiKey,
      );
    } else {
      result = queueResponse as unknown as FalUpscaleResponse;
    }

    if (result.error) {
      return { success: false, error: { message: result.error } };
    }

    if (!result.image?.url) {
      return {
        success: false,
        error: { message: "No image returned from fal.ai" },
      };
    }

    return {
      success: true,
      data: {
        imageUrl: result.image.url,
        width: result.image.width,
        height: result.image.height,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to upscale image: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "fal/remove-background": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type RemoveBackgroundResult =
  | { success: true; data: { imageUrl: string } }
  | { success: false; error: { message: string } };

export type FalRemoveBackgroundCoreInput = {
  imageUrl: string;
};

export async function falRemoveBackgroundStep(
  input: FalRemoveBackgroundCoreInput,
): Promise<RemoveBackgroundResult> {
  "use step";
  const credentials = await fetchCredentials("fal");
  const apiKey = credentials.FAL_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "FAL_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  try {
    const response = await fetch(\`\${FAL_API_URL}/fal-ai/birefnet\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Key \${apiKey}\`,
      },
      body: JSON.stringify({
        image_url: input.imageUrl,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: { message: \`HTTP \${response.status}: \${errorText}\` },
      };
    }

    const queueResponse = (await response.json()) as FalQueueResponse;

    let result: FalRemoveBackgroundResponse;
    if (
      queueResponse.status === "IN_QUEUE" ||
      queueResponse.status === "IN_PROGRESS"
    ) {
      result = await pollForResult(
        queueResponse.status_url,
        queueResponse.response_url,
        apiKey,
      );
    } else {
      result = queueResponse as unknown as FalRemoveBackgroundResponse;
    }

    if (result.error) {
      return { success: false, error: { message: result.error } };
    }

    if (!result.image?.url) {
      return {
        success: false,
        error: { message: "No image returned from fal.ai" },
      };
    }

    return { success: true, data: { imageUrl: result.image.url } };
  } catch (error) {
    return {
      success: false,
      error: {
        message: \`Failed to remove background: \${getErrorMessage(error)}\`,
      },
    };
  }
}
`,
    "fal/image-to-image": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type ImageToImageResult =
  | {
      success: true;
      data: { imageUrl: string; width?: number; height?: number };
    }
  | { success: false; error: { message: string } };

export type FalImageToImageCoreInput = {
  model: string;
  imageUrl: string;
  prompt: string;
  strength?: string;
};

export async function falImageToImageStep(
  input: FalImageToImageCoreInput,
): Promise<ImageToImageResult> {
  "use step";
  const credentials = await fetchCredentials("fal");
  const apiKey = credentials.FAL_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "FAL_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  try {
    const model = input.model || "fal-ai/flux/dev/image-to-image";
    const strength = Number.parseFloat(input.strength || "0.75");

    const response = await fetch(\`\${FAL_API_URL}/\${model}\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Key \${apiKey}\`,
      },
      body: JSON.stringify({
        image_url: input.imageUrl,
        prompt: input.prompt,
        strength,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: { message: \`HTTP \${response.status}: \${errorText}\` },
      };
    }

    const queueResponse = (await response.json()) as FalQueueResponse;

    let result: FalImageToImageResponse;
    if (
      queueResponse.status === "IN_QUEUE" ||
      queueResponse.status === "IN_PROGRESS"
    ) {
      result = await pollForResult(
        queueResponse.status_url,
        queueResponse.response_url,
        apiKey,
      );
    } else {
      result = queueResponse as unknown as FalImageToImageResponse;
    }

    if (result.error) {
      return { success: false, error: { message: result.error } };
    }

    // Handle both array format (images) and single image format
    const image = result.images?.[0] || result.image;
    if (!image?.url) {
      return {
        success: false,
        error: { message: "No image returned from fal.ai" },
      };
    }

    return {
      success: true,
      data: { imageUrl: image.url, width: image.width, height: image.height },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: \`Failed to transform image: \${getErrorMessage(error)}\`,
      },
    };
  }
}
`,
    "firecrawl/scrape": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type ScrapeResult = {
  markdown?: string;
  metadata?: Record<string, unknown>;
};

export type FirecrawlScrapeCoreInput = {
  url: string;
  formats?: ("markdown" | "html" | "rawHtml" | "links" | "screenshot")[];
};

export async function firecrawlScrapeStep(
  input: FirecrawlScrapeCoreInput,
): Promise<ScrapeResult> {
  "use step";
  const credentials = await fetchCredentials("firecrawl");
  const apiKey = credentials.FIRECRAWL_API_KEY;

  if (!apiKey) {
    throw new Error("Firecrawl API Key is not configured.");
  }

  try {
    const response = await fetch(\`\${FIRECRAWL_API_URL}/scrape\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        url: input.url,
        formats: input.formats || ["markdown"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(\`HTTP \${response.status}: \${errorText}\`);
    }

    const result = (await response.json()) as FirecrawlScrapeResponse;

    if (!result.success) {
      throw new Error(result.error || "Scrape failed");
    }

    return {
      markdown: result.data?.markdown,
      metadata: result.data?.metadata,
    };
  } catch (error) {
    throw new Error(\`Failed to scrape: \${getErrorMessage(error)}\`);
  }
}
`,
    "firecrawl/search": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type SearchResult = {
  data?: unknown[];
};

export type FirecrawlSearchCoreInput = {
  query: string;
  limit?: number;
  scrapeOptions?: {
    formats?: ("markdown" | "html" | "rawHtml" | "links" | "screenshot")[];
  };
};

export async function firecrawlSearchStep(
  input: FirecrawlSearchCoreInput,
): Promise<SearchResult> {
  "use step";
  const credentials = await fetchCredentials("firecrawl");
  const apiKey = credentials.FIRECRAWL_API_KEY;

  if (!apiKey) {
    throw new Error("Firecrawl API Key is not configured.");
  }

  try {
    const response = await fetch(\`\${FIRECRAWL_API_URL}/search\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        query: input.query,
        limit: input.limit ? Number(input.limit) : undefined,
        scrapeOptions: input.scrapeOptions,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(\`HTTP \${response.status}: \${errorText}\`);
    }

    const result = (await response.json()) as FirecrawlSearchResponse;

    if (!result.success) {
      throw new Error(result.error || "Search failed");
    }

    return {
      data: result.data,
    };
  } catch (error) {
    throw new Error(\`Failed to search: \${getErrorMessage(error)}\`);
  }
}
`,
    "github/create-issue": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type CreateIssueResult =
  | {
      success: true;
      id: number;
      number: number;
      title: string;
      url: string;
      state: string;
    }
  | { success: false; error: string };

export type CreateIssueCoreInput = {
  owner: string;
  repo: string;
  title: string;
  body?: string;
  labels?: string;
  assignees?: string;
};

export async function createIssueStep(
  input: CreateIssueCoreInput,
): Promise<CreateIssueResult> {
  "use step";
  const credentials = await fetchCredentials("github");
  const token = credentials.GITHUB_TOKEN;

  if (!token) {
    return {
      success: false,
      error:
        "GITHUB_TOKEN is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const body: Record<string, unknown> = {
      title: input.title,
    };

    if (input.body) {
      body.body = input.body;
    }

    const labels = parseCommaSeparated(input.labels);
    if (labels.length > 0) {
      body.labels = labels;
    }

    const assignees = parseCommaSeparated(input.assignees);
    if (assignees.length > 0) {
      body.assignees = assignees;
    }

    const response = await fetch(
      \`\${GITHUB_API_URL}/repos/\${input.owner}/\${input.repo}/issues\`,
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: \`Bearer \${token}\`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      return {
        success: false,
        error: errorData.message || \`HTTP \${response.status}\`,
      };
    }

    const issue = (await response.json()) as GitHubIssue;

    return {
      success: true,
      id: issue.id,
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      state: issue.state,
    };
  } catch (error) {
    return {
      success: false,
      error: \`Failed to create issue: \${getErrorMessage(error)}\`,
    };
  }
}
`,
    "github/list-issues": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type ListIssuesResult =
  | {
      success: true;
      issues: Array<{
        id: number;
        number: number;
        title: string;
        url: string;
        state: string;
        body?: string;
        labels: string[];
        assignees: string[];
        createdAt: string;
        updatedAt: string;
      }>;
      count: number;
    }
  | { success: false; error: string };

export type ListIssuesCoreInput = {
  owner: string;
  repo: string;
  state?: string;
  labels?: string;
  assignee?: string;
  perPage?: number;
};

export async function listIssuesStep(
  input: ListIssuesCoreInput,
): Promise<ListIssuesResult> {
  "use step";
  const credentials = await fetchCredentials("github");
  const token = credentials.GITHUB_TOKEN;

  if (!token) {
    return {
      success: false,
      error:
        "GITHUB_TOKEN is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const params = new URLSearchParams();

    if (input.state && input.state !== "open") {
      params.set("state", input.state);
    }

    if (input.labels) {
      params.set("labels", input.labels);
    }

    if (input.assignee) {
      params.set("assignee", input.assignee);
    }

    if (input.perPage) {
      params.set("per_page", String(input.perPage));
    }

    const url = \`\${GITHUB_API_URL}/repos/\${input.owner}/\${input.repo}/issues\${
      params.toString() ? \`?\${params.toString()}\` : ""
    }\`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: \`Bearer \${token}\`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      return {
        success: false,
        error: errorData.message || \`HTTP \${response.status}\`,
      };
    }

    const rawIssues = (await response.json()) as GitHubIssue[];

    const issues = rawIssues.map((issue) => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      state: issue.state,
      body: issue.body,
      labels: issue.labels.map((l) => l.name),
      assignees: issue.assignees.map((a) => a.login),
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
    }));

    return {
      success: true,
      issues,
      count: issues.length,
    };
  } catch (error) {
    return {
      success: false,
      error: \`Failed to list issues: \${getErrorMessage(error)}\`,
    };
  }
}
`,
    "github/get-issue": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type GetIssueResult =
  | {
      success: true;
      id: number;
      number: number;
      title: string;
      url: string;
      state: string;
      body?: string;
      labels: string[];
      assignees: string[];
      author: string;
      createdAt: string;
      updatedAt: string;
      closedAt?: string;
      commentsCount: number;
    }
  | { success: false; error: string };

export type GetIssueCoreInput = {
  owner: string;
  repo: string;
  issueNumber: string;
};

export async function getIssueStep(
  input: GetIssueCoreInput,
): Promise<GetIssueResult> {
  "use step";
  const credentials = await fetchCredentials("github");
  const token = credentials.GITHUB_TOKEN;

  if (!token) {
    return {
      success: false,
      error:
        "GITHUB_TOKEN is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const issueNum = Number.parseInt(input.issueNumber, 10);
    if (Number.isNaN(issueNum)) {
      return {
        success: false,
        error: "Invalid issue number",
      };
    }

    const response = await fetch(
      \`\${GITHUB_API_URL}/repos/\${input.owner}/\${input.repo}/issues/\${issueNum}\`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: \`Bearer \${token}\`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      return {
        success: false,
        error: errorData.message || \`HTTP \${response.status}\`,
      };
    }

    const issue = (await response.json()) as GitHubIssue;

    return {
      success: true,
      id: issue.id,
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      state: issue.state,
      body: issue.body,
      labels: issue.labels.map((l) => l.name),
      assignees: issue.assignees.map((a) => a.login),
      author: issue.user.login,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      closedAt: issue.closed_at,
      commentsCount: issue.comments,
    };
  } catch (error) {
    return {
      success: false,
      error: \`Failed to get issue: \${getErrorMessage(error)}\`,
    };
  }
}
`,
    "github/update-issue": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type UpdateIssueResult =
  | {
      success: true;
      id: number;
      number: number;
      title: string;
      url: string;
      state: string;
    }
  | { success: false; error: string };

export type UpdateIssueCoreInput = {
  owner: string;
  repo: string;
  issueNumber: string;
  title?: string;
  body?: string;
  state?: string;
  labels?: string;
  assignees?: string;
};

export async function updateIssueStep(
  input: UpdateIssueCoreInput,
): Promise<UpdateIssueResult> {
  "use step";
  const credentials = await fetchCredentials("github");
  const token = credentials.GITHUB_TOKEN;

  if (!token) {
    return {
      success: false,
      error:
        "GITHUB_TOKEN is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const issueNum = Number.parseInt(input.issueNumber, 10);
    if (Number.isNaN(issueNum)) {
      return {
        success: false,
        error: "Invalid issue number",
      };
    }

    const body: Record<string, unknown> = {};

    if (input.title) {
      body.title = input.title;
    }

    if (input.body) {
      body.body = input.body;
    }

    if (input.state && input.state !== "") {
      body.state = input.state;
    }

    if (input.labels !== undefined) {
      const labels = parseCommaSeparated(input.labels);
      body.labels = labels;
    }

    if (input.assignees !== undefined) {
      const assignees = parseCommaSeparated(input.assignees);
      body.assignees = assignees;
    }

    if (Object.keys(body).length === 0) {
      return {
        success: false,
        error: "No fields to update. Please provide at least one field.",
      };
    }

    const response = await fetch(
      \`\${GITHUB_API_URL}/repos/\${input.owner}/\${input.repo}/issues/\${issueNum}\`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: \`Bearer \${token}\`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      return {
        success: false,
        error: errorData.message || \`HTTP \${response.status}\`,
      };
    }

    const issue = (await response.json()) as GitHubIssue;

    return {
      success: true,
      id: issue.id,
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      state: issue.state,
    };
  } catch (error) {
    return {
      success: false,
      error: \`Failed to update issue: \${getErrorMessage(error)}\`,
    };
  }
}
`,
    "linear/create-ticket": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type CreateTicketResult =
  | { success: true; data: { id: string; url: string; title: string } }
  | { success: false; error: { message: string } };

export type CreateTicketCoreInput = {
  ticketTitle: string;
  ticketDescription: string;
};

export async function createTicketStep(
  input: CreateTicketCoreInput,
): Promise<CreateTicketResult> {
  "use step";
  const credentials = await fetchCredentials("linear");
  const apiKey = credentials.LINEAR_API_KEY;
  const teamId = credentials.LINEAR_TEAM_ID;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "LINEAR_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  try {
    let targetTeamId = teamId;

    if (!targetTeamId) {
      const teamsResult = await linearQuery<TeamsQueryResponse>(
        apiKey,
        \`query { teams { nodes { id name } } }\`,
      );

      if (teamsResult.errors?.length) {
        return {
          success: false,
          error: { message: teamsResult.errors[0].message },
        };
      }

      const firstTeam = teamsResult.data?.teams.nodes[0];
      if (!firstTeam) {
        return {
          success: false,
          error: { message: "No teams found in Linear workspace" },
        };
      }
      targetTeamId = firstTeam.id;
    }

    const createResult = await linearQuery<CreateIssueMutationResponse>(
      apiKey,
      \`mutation CreateIssue($title: String!, $description: String, $teamId: String!) {
        issueCreate(input: { title: $title, description: $description, teamId: $teamId }) {
          success
          issue {
            id
            title
            url
          }
        }
      }\`,
      {
        title: input.ticketTitle,
        description: input.ticketDescription,
        teamId: targetTeamId,
      },
    );

    if (createResult.errors?.length) {
      return {
        success: false,
        error: { message: createResult.errors[0].message },
      };
    }

    const issue = createResult.data?.issueCreate.issue;
    if (!issue) {
      return {
        success: false,
        error: { message: "Failed to create issue" },
      };
    }

    return {
      success: true,
      data: {
        id: issue.id,
        url: issue.url,
        title: issue.title,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to create ticket: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "linear/find-issues": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type FindIssuesResult =
  | { success: true; data: { issues: LinearIssue[]; count: number } }
  | { success: false; error: { message: string } };

export type FindIssuesCoreInput = {
  linearAssigneeId?: string;
  linearTeamId?: string;
  linearStatus?: string;
  linearLabel?: string;
};

export async function findIssuesStep(
  input: FindIssuesCoreInput,
): Promise<FindIssuesResult> {
  "use step";
  const credentials = await fetchCredentials("linear");
  const apiKey = credentials.LINEAR_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "LINEAR_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  try {
    // Build filter object for Linear's GraphQL API
    const filter: Record<string, unknown> = {};

    if (input.linearAssigneeId) {
      filter.assignee = { id: { eq: input.linearAssigneeId } };
    }

    if (input.linearTeamId) {
      filter.team = { id: { eq: input.linearTeamId } };
    }

    if (input.linearStatus && input.linearStatus !== "any") {
      filter.state = { name: { eqIgnoreCase: input.linearStatus } };
    }

    if (input.linearLabel) {
      filter.labels = { name: { eqIgnoreCase: input.linearLabel } };
    }

    const result = await linearQuery<IssuesQueryResponse>(
      apiKey,
      \`query FindIssues($filter: IssueFilter) {
        issues(filter: $filter) {
          nodes {
            id
            title
            url
            priority
            assignee {
              id
            }
            state {
              name
            }
          }
        }
      }\`,
      { filter: Object.keys(filter).length > 0 ? filter : undefined },
    );

    if (result.errors?.length) {
      return {
        success: false,
        error: { message: result.errors[0].message },
      };
    }

    const mappedIssues: LinearIssue[] = (result.data?.issues.nodes || []).map(
      (issue) => ({
        id: issue.id,
        title: issue.title,
        url: issue.url,
        state: issue.state?.name || "Unknown",
        priority: issue.priority,
        assigneeId: issue.assignee?.id || undefined,
      }),
    );

    return {
      success: true,
      data: {
        issues: mappedIssues,
        count: mappedIssues.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to find issues: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "perplexity/search": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type SearchResult =
  | {
      success: true;
      data: { answer: string; citations: string[]; model: string };
    }
  | { success: false; error: { message: string } };

export type PerplexitySearchCoreInput = {
  query: string;
  searchFocus?: "internet" | "academic" | "news" | "youtube" | "reddit";
};

export async function perplexitySearchStep(
  input: PerplexitySearchCoreInput,
): Promise<SearchResult> {
  "use step";
  const credentials = await fetchCredentials("perplexity");
  const apiKey = credentials.PERPLEXITY_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: { message: "Perplexity API Key is not configured." },
    };
  }

  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful search assistant. Provide concise, accurate answers with relevant sources.",
          },
          {
            role: "user",
            content: input.query,
          },
        ],
        search_domain_filter: getSearchDomains(input.searchFocus),
        return_citations: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: { message: \`HTTP \${response.status}: \${errorText}\` },
      };
    }

    const result = (await response.json()) as PerplexityResponse;

    const answer = result.choices[0]?.message?.content || "";
    const citations = (result.citations || []).map((c) =>
      typeof c === "string" ? c : c.url,
    );

    return {
      success: true,
      data: { answer, citations, model: result.model },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to search: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "perplexity/ask": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type AskResult =
  | {
      success: true;
      data: { answer: string; citations: string[]; model: string };
    }
  | { success: false; error: { message: string } };

export type PerplexityAskCoreInput = {
  question: string;
  systemPrompt?: string;
  model?: string;
};

export async function perplexityAskStep(
  input: PerplexityAskCoreInput,
): Promise<AskResult> {
  "use step";
  const credentials = await fetchCredentials("perplexity");
  const apiKey = credentials.PERPLEXITY_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: { message: "Perplexity API Key is not configured." },
    };
  }

  try {
    const messages: PerplexityMessage[] = [];

    if (input.systemPrompt) {
      messages.push({
        role: "system",
        content: input.systemPrompt,
      });
    } else {
      messages.push({
        role: "system",
        content:
          "You are a helpful AI assistant. Provide accurate, well-researched answers with citations when available.",
      });
    }

    messages.push({
      role: "user",
      content: input.question,
    });

    const response = await fetch(PERPLEXITY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        model: input.model || "sonar",
        messages,
        return_citations: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: { message: \`HTTP \${response.status}: \${errorText}\` },
      };
    }

    const result = (await response.json()) as PerplexityResponse;

    const answer = result.choices[0]?.message?.content || "";
    const citations = (result.citations || []).map((c) =>
      typeof c === "string" ? c : c.url,
    );

    return {
      success: true,
      data: { answer, citations, model: result.model },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to ask: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "perplexity/research": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type ResearchResult =
  | {
      success: true;
      data: { report: string; citations: string[]; model: string };
    }
  | { success: false; error: { message: string } };

export type PerplexityResearchCoreInput = {
  topic: string;
  depth?: "brief" | "detailed" | "comprehensive";
};

export async function perplexityResearchStep(
  input: PerplexityResearchCoreInput,
): Promise<ResearchResult> {
  "use step";
  const credentials = await fetchCredentials("perplexity");
  const apiKey = credentials.PERPLEXITY_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: { message: "Perplexity API Key is not configured." },
    };
  }

  const depthInstructions = getDepthInstructions(input.depth);

  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content: \`You are an expert research analyst. Your task is to provide \${depthInstructions} research on the given topic. Structure your response with clear sections, include relevant data and statistics when available, and cite your sources. Focus on accuracy, comprehensiveness, and actionable insights.\`,
          },
          {
            role: "user",
            content: \`Research the following topic thoroughly: \${input.topic}\`,
          },
        ],
        return_citations: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: { message: \`HTTP \${response.status}: \${errorText}\` },
      };
    }

    const result = (await response.json()) as PerplexityResponse;

    const report = result.choices[0]?.message?.content || "";
    const citations = (result.citations || []).map((c) =>
      typeof c === "string" ? c : c.url,
    );

    return {
      success: true,
      data: { report, citations, model: result.model },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to research: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "resend/send-email": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type SendEmailResult =
  | { success: true; data: { id: string } }
  | { success: false; error: { message: string } };

export type SendEmailCoreInput = {
  emailFrom?: string;
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  emailCc?: string;
  emailBcc?: string;
  emailReplyTo?: string;
  emailScheduledAt?: string;
  emailTopicId?: string;
  idempotencyKey?: string;
};

export async function sendEmailStep(
  input: SendEmailCoreInput,
): Promise<SendEmailResult> {
  "use step";
  const credentials = await fetchCredentials("resend");
  const apiKey = credentials.RESEND_API_KEY;
  const fromEmail = credentials.RESEND_FROM_EMAIL;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "RESEND_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  const senderEmail = input.emailFrom || fromEmail;

  if (!senderEmail) {
    return {
      success: false,
      error: {
        message:
          "No sender is configured. Please add it in the action or in Project Integrations.",
      },
    };
  }

  try {
    const headers: Record<string, string> = {
      Authorization: \`Bearer \${apiKey}\`,
      "Content-Type": "application/json",
    };

    if (input.idempotencyKey) {
      headers["Idempotency-Key"] = input.idempotencyKey;
    }

    const response = await fetch(\`\${RESEND_API_URL}/emails\`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        from: senderEmail,
        to: input.emailTo,
        subject: input.emailSubject,
        text: input.emailBody,
        ...(input.emailCc && { cc: input.emailCc }),
        ...(input.emailBcc && { bcc: input.emailBcc }),
        ...(input.emailReplyTo && { reply_to: input.emailReplyTo }),
        ...(input.emailScheduledAt && { scheduled_at: input.emailScheduledAt }),
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ResendErrorResponse;
      return {
        success: false,
        error: {
          message:
            errorData.message ||
            \`HTTP \${response.status}: Failed to send email\`,
        },
      };
    }

    const data = (await response.json()) as ResendEmailResponse;
    return { success: true, data: { id: data.id } };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: { message: \`Failed to send email: \${errorMessage}\` },
    };
  }
}
`,
    "slack/send-message": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type SendSlackMessageResult =
  | { success: true; ts: string; channel: string }
  | { success: false; error: string };

export type SendSlackMessageCoreInput = {
  slackChannel: string;
  slackMessage: string;
};

export async function sendSlackMessageStep(
  input: SendSlackMessageCoreInput,
): Promise<SendSlackMessageResult> {
  "use step";
  const credentials = await fetchCredentials("slack");
  const apiKey = credentials.SLACK_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "SLACK_API_KEY is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const response = await fetch(\`\${SLACK_API_URL}/chat.postMessage\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        channel: input.slackChannel,
        text: input.slackMessage,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: \`HTTP \${response.status}: Failed to send Slack message\`,
      };
    }

    const result = (await response.json()) as SlackPostMessageResponse;

    if (!result.ok) {
      return {
        success: false,
        error: result.error || "Failed to send Slack message",
      };
    }

    return {
      success: true,
      ts: result.ts || "",
      channel: result.channel || "",
    };
  } catch (error) {
    return {
      success: false,
      error: \`Failed to send Slack message: \${getErrorMessage(error)}\`,
    };
  }
}
`,
    "stripe/create-customer": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type CreateCustomerResult =
  | { success: true; id: string; email: string }
  | { success: false; error: string };

export type CreateCustomerCoreInput = {
  email: string;
  name?: string;
  phone?: string;
  description?: string;
  metadata?: string;
};

export async function createCustomerStep(
  input: CreateCustomerCoreInput,
): Promise<CreateCustomerResult> {
  "use step";
  const credentials = await fetchCredentials("stripe");
  const apiKey = credentials.STRIPE_SECRET_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "STRIPE_SECRET_KEY is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const params = new URLSearchParams();
    params.append("email", input.email);

    if (input.name) {
      params.append("name", input.name);
    }
    if (input.phone) {
      params.append("phone", input.phone);
    }
    if (input.description) {
      params.append("description", input.description);
    }
    if (input.metadata) {
      try {
        const metadataObj = JSON.parse(input.metadata) as Record<
          string,
          string
        >;
        for (const [key, value] of Object.entries(metadataObj)) {
          params.append(\`metadata[\${key}]\`, String(value));
        }
      } catch {
        return {
          success: false,
          error: "Invalid metadata JSON format",
        };
      }
    }

    const response = await fetch(\`\${STRIPE_API_URL}/customers\`, {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${apiKey}\`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as StripeErrorResponse;
      return {
        success: false,
        error:
          errorData.error?.message ||
          \`HTTP \${response.status}: Failed to create customer\`,
      };
    }

    const data = (await response.json()) as StripeCustomerResponse;
    return { success: true, id: data.id, email: data.email };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: \`Failed to create customer: \${message}\`,
    };
  }
}
`,
    "stripe/get-customer": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type GetCustomerResult =
  | {
      success: true;
      id: string;
      email: string;
      name: string | null;
      created: number;
    }
  | { success: false; error: string };

export type GetCustomerCoreInput = {
  customerId?: string;
  email?: string;
};

export async function getCustomerStep(
  input: GetCustomerCoreInput,
): Promise<GetCustomerResult> {
  "use step";
  const credentials = await fetchCredentials("stripe");
  const apiKey = credentials.STRIPE_SECRET_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "STRIPE_SECRET_KEY is not configured. Please add it in Project Integrations.",
    };
  }

  if (!input.customerId && !input.email) {
    return {
      success: false,
      error: "Either Customer ID or Email is required",
    };
  }

  try {
    let customer: StripeCustomerResponse | null = null;

    if (input.customerId) {
      // Direct lookup by ID
      const response = await fetch(
        \`\${STRIPE_API_URL}/customers/\${input.customerId}\`,
        {
          method: "GET",
          headers: {
            Authorization: \`Bearer \${apiKey}\`,
          },
        },
      );

      if (!response.ok) {
        const errorData = (await response.json()) as StripeErrorResponse;
        return {
          success: false,
          error:
            errorData.error?.message ||
            \`HTTP \${response.status}: Failed to get customer\`,
        };
      }

      customer = (await response.json()) as StripeCustomerResponse;
    } else if (input.email) {
      // Search by email
      const params = new URLSearchParams();
      params.append("email", input.email);
      params.append("limit", "1");

      const response = await fetch(
        \`\${STRIPE_API_URL}/customers?\${params.toString()}\`,
        {
          method: "GET",
          headers: {
            Authorization: \`Bearer \${apiKey}\`,
          },
        },
      );

      if (!response.ok) {
        const errorData = (await response.json()) as StripeErrorResponse;
        return {
          success: false,
          error:
            errorData.error?.message ||
            \`HTTP \${response.status}: Failed to search customers\`,
        };
      }

      const data = (await response.json()) as StripeCustomerListResponse;
      if (data.data.length === 0) {
        return {
          success: false,
          error: \`No customer found with email: \${input.email}\`,
        };
      }
      customer = data.data[0];
    }

    if (!customer) {
      return {
        success: false,
        error: "Customer not found",
      };
    }

    return {
      success: true,
      id: customer.id,
      email: customer.email,
      name: customer.name,
      created: customer.created,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: \`Failed to get customer: \${message}\`,
    };
  }
}
`,
    "stripe/create-invoice": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type CreateInvoiceResult =
  | {
      success: true;
      id: string;
      number: string | null;
      hostedInvoiceUrl: string | null;
      status: string;
    }
  | { success: false; error: string };

export type CreateInvoiceCoreInput = {
  customerId: string;
  description?: string;
  lineItems: string;
  daysUntilDue?: number;
  autoAdvance?: string;
  collectionMethod?: "send_invoice" | "charge_automatically";
  metadata?: string;
};

export async function createInvoiceStep(
  input: CreateInvoiceCoreInput,
): Promise<CreateInvoiceResult> {
  "use step";
  const credentials = await fetchCredentials("stripe");
  const apiKey = credentials.STRIPE_SECRET_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "STRIPE_SECRET_KEY is not configured. Please add it in Project Integrations.",
    };
  }

  let lineItems: LineItem[];
  try {
    lineItems = JSON.parse(input.lineItems) as LineItem[];
    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return {
        success: false,
        error: "Line items must be a non-empty JSON array",
      };
    }
  } catch {
    return {
      success: false,
      error:
        'Invalid line items JSON format. Expected: [{"description": "Item", "amount": 1000, "quantity": 1}]',
    };
  }

  try {
    // Step 1: Create the invoice
    const invoiceParams = new URLSearchParams();
    invoiceParams.append("customer", input.customerId);
    invoiceParams.append(
      "collection_method",
      input.collectionMethod || "send_invoice",
    );
    invoiceParams.append("days_until_due", String(input.daysUntilDue || 30));
    invoiceParams.append(
      "auto_advance",
      input.autoAdvance === "false" ? "false" : "true",
    );

    if (input.description) {
      invoiceParams.append("description", input.description);
    }
    if (input.metadata) {
      try {
        const metadataObj = JSON.parse(input.metadata) as Record<
          string,
          string
        >;
        for (const [key, value] of Object.entries(metadataObj)) {
          invoiceParams.append(\`metadata[\${key}]\`, String(value));
        }
      } catch {
        return {
          success: false,
          error: "Invalid metadata JSON format",
        };
      }
    }

    const invoiceResponse = await fetch(\`\${STRIPE_API_URL}/invoices\`, {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${apiKey}\`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: invoiceParams.toString(),
    });

    if (!invoiceResponse.ok) {
      const errorData = (await invoiceResponse.json()) as StripeErrorResponse;
      return {
        success: false,
        error:
          errorData.error?.message ||
          \`HTTP \${invoiceResponse.status}: Failed to create invoice\`,
      };
    }

    const invoice = (await invoiceResponse.json()) as StripeInvoiceResponse;

    // Step 2: Add line items
    for (const item of lineItems) {
      const itemParams = new URLSearchParams();
      itemParams.append("invoice", invoice.id);
      itemParams.append("description", item.description);
      itemParams.append("quantity", String(item.quantity || 1));
      itemParams.append("unit_amount", String(item.amount));
      itemParams.append("currency", "usd");

      const itemResponse = await fetch(\`\${STRIPE_API_URL}/invoiceitems\`, {
        method: "POST",
        headers: {
          Authorization: \`Bearer \${apiKey}\`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: itemParams.toString(),
      });

      if (!itemResponse.ok) {
        const errorData = (await itemResponse.json()) as StripeErrorResponse;
        return {
          success: false,
          error:
            errorData.error?.message ||
            \`HTTP \${itemResponse.status}: Failed to add line item\`,
        };
      }
    }

    // Step 3: Finalize invoice if auto_advance is true
    let finalInvoice = invoice;
    if (input.autoAdvance !== "false") {
      const finalizeResponse = await fetch(
        \`\${STRIPE_API_URL}/invoices/\${invoice.id}/finalize\`,
        {
          method: "POST",
          headers: {
            Authorization: \`Bearer \${apiKey}\`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      if (!finalizeResponse.ok) {
        const errorData =
          (await finalizeResponse.json()) as StripeErrorResponse;
        return {
          success: false,
          error:
            errorData.error?.message ||
            \`HTTP \${finalizeResponse.status}: Failed to finalize invoice\`,
        };
      }

      finalInvoice = (await finalizeResponse.json()) as StripeInvoiceResponse;
    }

    return {
      success: true,
      id: finalInvoice.id,
      number: finalInvoice.number,
      hostedInvoiceUrl: finalInvoice.hosted_invoice_url,
      status: finalInvoice.status,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: \`Failed to create invoice: \${message}\`,
    };
  }
}
`,
    "superagent/guard": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type GuardResult = {
  classification: GuardClassification;
  violationTypes: string[];
  cweCodes: string[];
  reasoning?: string;
};

export type SuperagentGuardCoreInput = {
  text: string;
};

export async function superagentGuardStep(
  input: SuperagentGuardCoreInput,
): Promise<GuardResult> {
  "use step";
  const credentials = await fetchCredentials("superagent");
  const apiKey = credentials.SUPERAGENT_API_KEY;

  if (!apiKey) {
    throw new Error("Superagent API Key is not configured.");
  }

  try {
    const response = await fetch("https://app.superagent.sh/api/guard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        text: input.text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(\`Guard API error: \${error}\`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    const content = choice?.message?.content;

    if (!content || typeof content !== "object") {
      throw new Error(
        "Invalid Guard API response: missing or invalid content structure",
      );
    }

    const classification = content.classification;
    if (
      !classification ||
      (classification !== "pass" && classification !== "block")
    ) {
      throw new Error(
        \`Invalid Guard API response: missing or invalid classification (received: \${JSON.stringify(classification)})\`,
      );
    }

    return {
      classification,
      violationTypes: content?.violation_types || [],
      cweCodes: content?.cwe_codes || [],
      reasoning: choice?.message?.reasoning,
    };
  } catch (error) {
    throw new Error(\`Failed to analyze text: \${getErrorMessage(error)}\`);
  }
}
`,
    "superagent/redact": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type RedactResult = {
  redactedText: string;
  reasoning?: string;
};

export type SuperagentRedactCoreInput = {
  text: string;
  entities?: string[] | string;
};

export async function superagentRedactStep(
  input: SuperagentRedactCoreInput,
): Promise<RedactResult> {
  "use step";
  const credentials = await fetchCredentials("superagent");
  const apiKey = credentials.SUPERAGENT_API_KEY;

  if (!apiKey) {
    throw new Error("Superagent API Key is not configured.");
  }

  try {
    const body: { text: string; entities?: string[] } = {
      text: input.text,
    };

    if (input.entities) {
      let entitiesArray: string[];

      if (typeof input.entities === "string") {
        entitiesArray = input.entities.split(",").map((e) => e.trim());
      } else if (Array.isArray(input.entities)) {
        entitiesArray = input.entities.map((e) => String(e).trim());
      } else {
        entitiesArray = [];
      }

      const validEntities = entitiesArray.filter((e) => e.length > 0);

      if (validEntities.length > 0) {
        body.entities = validEntities;
      }
    }

    const response = await fetch("https://app.superagent.sh/api/redact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(\`Redact API error: \${error}\`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    return {
      redactedText: choice?.message?.content || input.text,
      reasoning: choice?.message?.reasoning,
    };
  } catch (error) {
    throw new Error(\`Failed to redact text: \${getErrorMessage(error)}\`);
  }
}
`,
    "v0/create-chat": `import { createClient, type ChatsCreateResponse } from "v0-sdk";
import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type CreateChatResult =
  | { success: true; chatId: string; url: string; demoUrl?: string }
  | { success: false; error: string };

export type CreateChatCoreInput = {
  message: string;
  system?: string;
};

export async function createChatStep(
  input: CreateChatCoreInput,
): Promise<CreateChatResult> {
  "use step";
  const credentials = await fetchCredentials("v0");
  const apiKey = credentials.V0_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "V0_API_KEY is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const client = createClient({ apiKey });

    const result = (await client.chats.create({
      message: input.message,
      system: input.system,
    })) as ChatsCreateResponse;

    return {
      success: true,
      chatId: result.id,
      url: result.webUrl,
      demoUrl: result.latestVersion?.demoUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: \`Failed to create chat: \${getErrorMessage(error)}\`,
    };
  }
}
`,
    "v0/send-message": `import { createClient, type ChatsSendMessageResponse } from "v0-sdk";
import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type SendMessageResult =
  | { success: true; chatId: string; demoUrl?: string }
  | { success: false; error: string };

export type SendMessageCoreInput = {
  chatId: string;
  message: string;
};

export async function sendMessageStep(
  input: SendMessageCoreInput,
): Promise<SendMessageResult> {
  "use step";
  const credentials = await fetchCredentials("v0");
  const apiKey = credentials.V0_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "V0_API_KEY is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const client = createClient({ apiKey });

    const result = (await client.chats.sendMessage({
      chatId: input.chatId,
      message: input.message,
    })) as ChatsSendMessageResponse;

    return {
      success: true,
      chatId: result.id,
      demoUrl: result.latestVersion?.demoUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: \`Failed to send message: \${getErrorMessage(error)}\`,
    };
  }
}
`,
    "webflow/list-sites": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type ListSitesResult =
  | { success: true; data: { sites: SiteData[]; count: number } }
  | { success: false; error: { message: string } };

export type ListSitesCoreInput = Record<string, never>;

export async function listSitesStep(
  input: ListSitesCoreInput,
): Promise<ListSitesResult> {
  "use step";
  const credentials = await fetchCredentials("webflow");
  const apiKey = credentials.WEBFLOW_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "WEBFLOW_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  try {
    const response = await fetch(\`\${WEBFLOW_API_URL}/sites\`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      return {
        success: false,
        error: { message: errorData.message || \`HTTP \${response.status}\` },
      };
    }

    const data = (await response.json()) as { sites: WebflowSite[] };

    const sites = data.sites.map((site) => ({
      id: site.id,
      displayName: site.displayName,
      shortName: site.shortName,
      previewUrl: site.previewUrl,
      lastPublished: site.lastPublished,
      lastUpdated: site.lastUpdated,
      customDomains: site.customDomains?.map((d) => d.url) || [],
    }));

    return {
      success: true,
      data: { sites, count: sites.length },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to list sites: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "webflow/get-site": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type GetSiteResult =
  | { success: true; data: GetSiteData }
  | { success: false; error: { message: string } };

export type GetSiteCoreInput = {
  siteId: string;
};

export async function getSiteStep(
  input: GetSiteCoreInput,
): Promise<GetSiteResult> {
  "use step";
  const credentials = await fetchCredentials("webflow");
  const apiKey = credentials.WEBFLOW_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "WEBFLOW_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  if (!input.siteId) {
    return {
      success: false,
      error: { message: "Site ID is required" },
    };
  }

  try {
    const response = await fetch(
      \`\${WEBFLOW_API_URL}/sites/\${encodeURIComponent(input.siteId)}\`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: \`Bearer \${apiKey}\`,
        },
      },
    );

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      return {
        success: false,
        error: { message: errorData.message || \`HTTP \${response.status}\` },
      };
    }

    const site = (await response.json()) as WebflowSiteResponse;

    return {
      success: true,
      data: {
        id: site.id,
        displayName: site.displayName,
        shortName: site.shortName,
        previewUrl: site.previewUrl,
        lastPublished: site.lastPublished,
        lastUpdated: site.lastUpdated,
        timeZone: site.timeZone,
        customDomains: site.customDomains || [],
      },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to get site: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "webflow/publish-site": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type PublishSiteResult =
  | {
      success: true;
      data: { publishedDomains: string[]; publishedToSubdomain: boolean };
    }
  | { success: false; error: { message: string } };

export type PublishSiteCoreInput = {
  siteId: string;
  publishToWebflowSubdomain?: string;
  customDomainIds?: string;
};

export async function publishSiteStep(
  input: PublishSiteCoreInput,
): Promise<PublishSiteResult> {
  "use step";
  const credentials = await fetchCredentials("webflow");
  const apiKey = credentials.WEBFLOW_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "WEBFLOW_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  if (!input.siteId) {
    return {
      success: false,
      error: { message: "Site ID is required" },
    };
  }

  try {
    const body: {
      publishToWebflowSubdomain?: boolean;
      customDomains?: string[];
    } = {};

    // Parse custom domain IDs if provided
    const customDomains = input.customDomainIds
      ? input.customDomainIds
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      : [];

    if (customDomains.length > 0) {
      body.customDomains = customDomains;
    }

    // Default to publishing to subdomain if no custom domains specified
    // or if explicitly set to true
    const publishToSubdomain =
      input.publishToWebflowSubdomain === "false" ? false : true;

    if (publishToSubdomain || customDomains.length === 0) {
      body.publishToWebflowSubdomain = true;
    } else {
      body.publishToWebflowSubdomain = false;
    }

    const response = await fetch(
      \`\${WEBFLOW_API_URL}/sites/\${encodeURIComponent(input.siteId)}/publish\`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: \`Bearer \${apiKey}\`,
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      return {
        success: false,
        error: { message: errorData.message || \`HTTP \${response.status}\` },
      };
    }

    const result = (await response.json()) as PublishResponse;

    return {
      success: true,
      data: {
        publishedDomains: result.customDomains?.map((d) => d.url) || [],
        publishedToSubdomain: result.publishToWebflowSubdomain ?? false,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to publish site: \${getErrorMessage(error)}\` },
    };
  }
}
`
};
function getAutoGeneratedTemplate(actionId) {
    return AUTO_GENERATED_TEMPLATES[actionId];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/output-display-configs.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Output Display Configs (Auto-Generated)
 *
 * This file is automatically generated by scripts/discover-plugins.ts
 * DO NOT EDIT MANUALLY - your changes will be overwritten!
 *
 * This file is CLIENT-SAFE and can be imported in client components.
 * It maps action IDs to their output display configuration.
 *
 * Generated configs: 8
 */ __turbopack_context__.s([
    "OUTPUT_DISPLAY_CONFIGS",
    ()=>OUTPUT_DISPLAY_CONFIGS,
    "getOutputDisplayConfig",
    ()=>getOutputDisplayConfig
]);
const OUTPUT_DISPLAY_CONFIGS = {
    "ai-gateway/generate-image": {
        type: "image",
        field: "base64"
    },
    "fal/generate-image": {
        type: "image",
        field: "imageUrl"
    },
    "fal/generate-video": {
        type: "video",
        field: "videoUrl"
    },
    "fal/upscale-image": {
        type: "image",
        field: "imageUrl"
    },
    "fal/remove-background": {
        type: "image",
        field: "imageUrl"
    },
    "fal/image-to-image": {
        type: "image",
        field: "imageUrl"
    },
    "v0/create-chat": {
        type: "url",
        field: "demoUrl"
    },
    "v0/send-message": {
        type: "url",
        field: "demoUrl"
    }
};
function getOutputDisplayConfig(actionType) {
    return OUTPUT_DISPLAY_CONFIGS[actionType];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils/time.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getRelativeTime",
    ()=>getRelativeTime
]);
function formatTimeDifference(value, unit) {
    return `${value} ${unit}${value === 1 ? "" : "s"} ago`;
}
function getRelativeTime(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    if (diffInSeconds < 60) {
        return "just now";
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return formatTimeDifference(diffInMinutes, "min");
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return formatTimeDifference(diffInHours, "hour");
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return formatTimeDifference(diffInDays, "day");
    }
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return formatTimeDifference(diffInWeeks, "week");
    }
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return formatTimeDifference(diffInMonths, "month");
    }
    const diffInYears = Math.floor(diffInDays / 365);
    return formatTimeDifference(diffInYears, "year");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/builder-bridge.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "builderBridgeAtom",
    ()=>builderBridgeAtom,
    "builderEmbeddedAtom",
    ()=>builderEmbeddedAtom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-client] (ecmascript)");
;
const builderBridgeAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null);
const builderEmbeddedAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Vercel deployment configuration
__turbopack_context__.s([
    "VERCEL_DEPLOY_BUTTON_URL",
    ()=>VERCEL_DEPLOY_BUTTON_URL,
    "VERCEL_DEPLOY_URL",
    ()=>VERCEL_DEPLOY_URL
]);
const VERCEL_DEPLOY_URL = "https://vercel.new/workflow-builder";
const VERCEL_DEPLOY_BUTTON_URL = `[![Deploy with Vercel](https://vercel.com/button)](${VERCEL_DEPLOY_URL})`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils/format-number.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Formats a number into an abbreviated form (e.g., 1.1k, 2.5M)
 *
 * @param num - The number to format
 * @returns The formatted string
 *
 * @example
 * formatAbbreviatedNumber(1109) // "1.1k"
 * formatAbbreviatedNumber(1500) // "1.5k"
 * formatAbbreviatedNumber(1000000) // "1M"
 * formatAbbreviatedNumber(500) // "500"
 */ __turbopack_context__.s([
    "formatAbbreviatedNumber",
    ()=>formatAbbreviatedNumber
]);
function formatAbbreviatedNumber(num) {
    if (num >= 1_000_000) {
        const formatted = (num / 1_000_000).toFixed(1);
        // Remove .0 if present
        return formatted.endsWith(".0") ? `${Math.floor(num / 1_000_000)}M` : `${formatted}M`;
    }
    if (num >= 1000) {
        const formatted = (num / 1000).toFixed(1);
        // Remove .0 if present
        return formatted.endsWith(".0") ? `${Math.floor(num / 1000)}k` : `${formatted}k`;
    }
    return num.toString();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/page-chat-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pageChatSurfacesAtom",
    ()=>pageChatSurfacesAtom,
    "usePageChat",
    ()=>usePageChat
]);
// ─────────────────────────────────────────────────────────────────────────────
// Page ⇄ Chat contract — the general pattern behind "the chat can command any
// page/panel next to it, and can bring any page/panel into the chat".
//
// Sibling of `page-menu-store.ts` (which publishes a page's *menu* into the shared
// header). Here a page publishes a *chat surface* into a registry while it's open:
//   • context  — a live snapshot the chat reads to ground answers about the page
//   • commands — named verbs the chat can invoke on the page (commandPage)
//   • Embed    — a compact React view to render the page INLINE in the chat
//                (bringIntoChat) without leaving the conversation
//
// The assistant (`use-assistant.tsx`) dispatches two GENERIC actions against this
// registry, so ANY page becomes commandable + summonable with one hook call —
// exactly how `usePageMenu` made any page's toolbar live in the shared header.
// Bespoke per-page copilots (BuilderCopilot, WorksheetCopilot) still work; this is
// the uniform contract, especially for pages with no bespoke copilot.
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const pageChatSurfacesAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])({});
function usePageChat(surface, deps = []) {
    _s();
    const set = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(pageChatSurfacesAtom);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePageChat.useEffect": ()=>{
            set({
                "usePageChat.useEffect": (prev)=>({
                        ...prev,
                        [surface.pageKey]: surface
                    })
            }["usePageChat.useEffect"]);
            return ({
                "usePageChat.useEffect": ()=>set({
                        "usePageChat.useEffect": (prev)=>{
                            const next = {
                                ...prev
                            };
                            delete next[surface.pageKey];
                            return next;
                        }
                    }["usePageChat.useEffect"])
            })["usePageChat.useEffect"];
        // surface is intentionally rebuilt from `deps`; pageKey/set are stable.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["usePageChat.useEffect"], [
        surface.pageKey,
        set,
        ...deps
    ]);
}
_s(usePageChat, "mSVZZ4ARpDvkpdwEttaC21+3Wyo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/agents.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Agent shells + workflow catalog for the chat launcher.
//
// "Agents" are named specialists the chat can hand off to. Today they are shells
// (display + which workflow they own); Sofi is the only live one — she takes over
// when the user chooses to calculate FAPI. Later each agent gets its own tools /
// CoAgent. "Workflows" are the runnable procedures surfaced as suggestions.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "AGENTS",
    ()=>AGENTS,
    "WORKFLOWS",
    ()=>WORKFLOWS,
    "agentGreeting",
    ()=>agentGreeting,
    "agentThinking",
    ()=>agentThinking,
    "getAgent",
    ()=>getAgent,
    "getAgentForWorkflow",
    ()=>getAgentForWorkflow
]);
function agentGreeting(agent) {
    return agent.greeting ?? `Hi — I'm ${agent.name}, your ${agent.role.toLowerCase()}. Tell me what you'd like and I'll get to work.`;
}
function agentThinking(agent) {
    return agent.thinking?.length ? agent.thinking : [
        'Got it — let me take a look.',
        'Reviewing what you’ve shared…',
        'Lining up the steps…'
    ];
}
const AGENTS = [
    {
        id: 'sofi',
        name: 'Sofi',
        role: 'FAPI specialist',
        tagline: 'Runs the FAPI calculation end-to-end and pauses whenever a judgment call is yours.',
        accent: '#18181b',
        initials: 'So',
        workflow: 'fapi',
        live: true,
        greeting: 'Hi — I’m Sofi, your FAPI specialist. Tell me what you’d like to work on and I’ll take it from there.',
        thinking: [
            'Got it — let me take a look.',
            'Reviewing what you’ve shared…',
            'Lining up the FAPI steps…'
        ]
    },
    {
        id: 'theo',
        name: 'Théo',
        role: 'Rollover specialist (art. 85)',
        tagline: 'Runs the art. 85 rollover — classifies transferred property, computes the election bounds, and pauses for you to elect the amount.',
        accent: '#1e3a2f',
        initials: 'Th',
        workflow: 'roulement',
        live: true,
        greeting: 'Bonjour — I’m Théo, I handle the art. 85 rollover. What would you like me to work on?',
        thinking: [
            'On it — let me take a look.',
            'Checking the property to transfer…',
            'Setting up the election steps…'
        ]
    },
    {
        id: 'mira',
        name: 'Mira',
        role: 'Expense reimbursement',
        tagline: 'Classifies an expense report, applies the per-diem cap and reimbursement policy, and computes the net payable to the employee.',
        accent: '#1e3a5f',
        initials: 'Mi',
        workflow: 'expense',
        live: true,
        greeting: 'Hi — I’m Mira, I handle expense reimbursements. Tell me what you need and I’ll get started.',
        thinking: [
            'Sure — let me take a look.',
            'Going through the receipts…',
            'Applying the policy caps…'
        ]
    },
    {
        id: 'nova',
        name: 'Nova',
        role: 'Marketing budget planner',
        tagline: 'Classifies channel spend requests, then pauses for you to elect the approved budget between the committed floor and the cap.',
        accent: '#4a2f5f',
        initials: 'No',
        workflow: 'campaign',
        live: true,
        greeting: 'Hey — I’m Nova, your marketing budget planner. What should I work on?',
        thinking: [
            'Got it — let me take a look.',
            'Reviewing the channel requests…',
            'Framing the budget options…'
        ]
    },
    {
        id: 'remy',
        name: 'Rémy',
        role: 'Surplus & T1134',
        tagline: 'Surplus accounts and foreign-affiliate reporting. Coming soon.',
        accent: '#a1a1aa',
        initials: 'Ré',
        live: false
    }
];
function getAgent(id) {
    return AGENTS.find((a)=>a.id === id) ?? null;
}
function getAgentForWorkflow(workflowId) {
    return AGENTS.find((a)=>a.workflow === workflowId) ?? null;
}
const WORKFLOWS = [
    {
        id: 'fapi',
        name: 'Calculate FAPI',
        sub: 'Foreign accrual property income',
        agentId: 'sofi',
        ready: true
    },
    {
        id: 'roulement',
        name: 'Roulement fiscal (art. 85)',
        sub: 'Rollover election → T2057',
        agentId: 'theo',
        ready: true
    },
    {
        id: 'expense',
        name: 'Expense reimbursement',
        sub: 'Receipts → policy caps → net payable',
        agentId: 'mira',
        ready: true
    },
    {
        id: 'campaign',
        name: 'Campaign budget allocation',
        sub: 'Requests → elect budget → projection',
        agentId: 'nova',
        ready: true
    },
    {
        id: 'surplus',
        name: 'Surplus continuity',
        sub: 'Exempt / taxable surplus',
        ready: false
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/coworkers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Coworkers — the business-role "AI coworkers" the workspace surfaces.
//
// A Coworker is a labeled actor the user sees working: a persona agent (Sofi,
// Théo, …, derived from lib/agents.ts), the coordinating Workspace Assistant, the
// UI Concierge / Composer, or the DETERMINISTIC Workflow Engine. Every coworker
// carries an `ActorKind` so activity can be attributed truthfully — the workflow
// engine is a `workflow` actor, never mislabeled as an `agent`.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "ACTOR_KIND_LABEL",
    ()=>ACTOR_KIND_LABEL,
    "SINA",
    ()=>SINA,
    "SYSTEM",
    ()=>SYSTEM,
    "UI_COMPOSER",
    ()=>UI_COMPOSER,
    "UI_CONCIERGE",
    ()=>UI_CONCIERGE,
    "WORKFLOW_ENGINE",
    ()=>WORKFLOW_ENGINE,
    "WORKSPACE_ASSISTANT",
    ()=>WORKSPACE_ASSISTANT,
    "YOU",
    ()=>YOU,
    "coworkerForAgent",
    ()=>coworkerForAgent,
    "coworkerForMessage",
    ()=>coworkerForMessage,
    "coworkerForWorkflow",
    ()=>coworkerForWorkflow,
    "coworkerKindLabel",
    ()=>coworkerKindLabel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/agents.ts [app-client] (ecmascript)");
;
const ACTOR_KIND_LABEL = {
    human: 'Human',
    agent: 'Agent',
    workflow: 'Workflow',
    tool: 'Tool',
    system: 'System'
};
const WORKSPACE_ASSISTANT = {
    kind: 'agent',
    id: 'workspace-assistant',
    name: 'Workspace Assistant',
    role: 'Coordinates your workspace',
    accent: '#3b3b46',
    initials: 'WA'
};
const SINA = {
    kind: 'agent',
    id: 'sina',
    name: 'Sina',
    role: 'Your tax specialist',
    accent: '#18181b',
    initials: 'Si'
};
const WORKFLOW_ENGINE = {
    kind: 'workflow',
    id: 'workflow-engine',
    name: 'Workflow Engine',
    role: 'Deterministic',
    accent: '#26382c',
    initials: 'WE'
};
const UI_CONCIERGE = {
    kind: 'tool',
    id: 'ui-concierge',
    name: 'UI Concierge',
    role: 'Opens pages & components',
    accent: '#26314d',
    initials: 'UC'
};
const UI_COMPOSER = {
    kind: 'tool',
    id: 'ui-composer',
    name: 'UI Composer',
    role: 'Generates views',
    accent: '#3a274c',
    initials: 'UX'
};
const YOU = {
    kind: 'human',
    id: 'you',
    name: 'You',
    role: '',
    accent: '#52525b',
    initials: 'You'
};
const SYSTEM = {
    kind: 'system',
    id: 'system',
    name: 'System',
    role: '',
    accent: '#3f3f46',
    initials: 'Sy'
};
function coworkerForAgent(agent) {
    return {
        kind: 'agent',
        id: agent.id,
        name: agent.name,
        role: agent.role,
        accent: agent.accent,
        initials: agent.initials
    };
}
function coworkerForWorkflow(workflowId) {
    const agent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAgentForWorkflow"])(workflowId);
    return agent ? coworkerForAgent(agent) : null;
}
function coworkerKindLabel(coworker) {
    const base = ACTOR_KIND_LABEL[coworker.kind];
    if (coworker.kind === 'workflow' && coworker.role) {
        return `${base} · ${coworker.role}`;
    }
    return base;
}
// Tool names the UI Concierge is responsible for (opening/summoning existing surfaces).
const UI_CONCIERGE_TOOLS = new Set([
    'openPage',
    'bringIntoChat',
    'showWorkflowElement',
    'editField',
    'focusAnchor',
    'commandPage',
    'closePage',
    'closeAll',
    'openWorkflowBuilder'
]);
function coworkerForMessage(message) {
    const call = message?.toolCalls?.[0]?.function;
    const name = call?.name;
    // One unified agent (Sina): a plain reply and a workflow proposal are both Sina; only
    // the truthful non-agent actors (generated view / page ops) get their own attribution.
    if (!name) return SINA;
    if (name === 'generateUI') return UI_COMPOSER;
    if (name === 'runWorkflow') return SINA;
    if (UI_CONCIERGE_TOOLS.has(name)) return UI_CONCIERGE;
    return SINA;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/work-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "activeWorkCountAtom",
    ()=>activeWorkCountAtom,
    "clearWorkItemsAtom",
    ()=>clearWorkItemsAtom,
    "jumpToWork",
    ()=>jumpToWork,
    "reconcileStaleWorkAtom",
    ()=>reconcileStaleWorkAtom,
    "recordWorkItemAtom",
    ()=>recordWorkItemAtom,
    "workIdFor",
    ()=>workIdFor,
    "workItemsAtom",
    ()=>workItemsAtom,
    "workItemsChronoAtom",
    ()=>workItemsChronoAtom,
    "workItemsListAtom",
    ()=>workItemsListAtom,
    "workKeyFromText",
    ()=>workKeyFromText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla/utils.mjs [app-client] (ecmascript)");
;
;
function workIdFor(type, key) {
    return `${type}:${key}`;
}
function workKeyFromText(text) {
    let h = 2166136261;
    for(let i = 0; i < text.length; i++){
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
}
const STATUS_ORDER = {
    awaiting: 0,
    running: 1,
    open: 2,
    done: 3
};
const workItemsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atomWithStorage"])('taxflow:work-items', {});
const workItemsListAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])((get)=>{
    const items = Object.values(get(workItemsAtom));
    return items.sort((a, b)=>STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || b.updatedAt - a.updatedAt);
});
const workItemsChronoAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])((get)=>{
    const items = Object.values(get(workItemsAtom));
    return items.sort((a, b)=>b.updatedAt - a.updatedAt);
});
const activeWorkCountAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])((get)=>Object.values(get(workItemsAtom)).filter((w)=>w.status === 'awaiting' || w.status === 'running').length);
const recordWorkItemAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (_get, set, patch)=>{
    set(workItemsAtom, (prev)=>{
        const now = Date.now();
        const existing = prev[patch.id];
        const next = {
            ...existing,
            ...patch,
            createdAt: existing?.createdAt ?? now,
            updatedAt: now
        };
        return {
            ...prev,
            [patch.id]: next
        };
    });
});
const clearWorkItemsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (_get, set)=>set(workItemsAtom, {}));
const reconcileStaleWorkAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set)=>{
    const items = get(workItemsAtom);
    let changed = false;
    const next = {
        ...items
    };
    for (const [id, item] of Object.entries(items)){
        if (item.status === 'running' || item.status === 'awaiting') {
            next[id] = {
                ...item,
                status: 'open',
                detail: item.detail ? `${item.detail} · interrupted` : 'Interrupted'
            };
            changed = true;
        }
    }
    if (changed) set(workItemsAtom, next);
});
function jumpToWork(id) {
    if (typeof document === 'undefined') return false;
    const el = document.querySelector(`[data-work-id="${cssEscape(id)}"]`) ?? null;
    if (!el) return false;
    el.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
    });
    el.classList.add('cwp-anchor-flash');
    window.setTimeout(()=>el.classList.remove('cwp-anchor-flash'), 1700);
    return true;
}
function cssEscape(value) {
    // work ids are `type:key` — escape the colon for a valid attribute selector.
    const anyWin = window;
    return anyWin.CSS?.escape ? anyWin.CSS.escape(value) : value.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/composer-intent.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Composer intent — a deterministic, client-side PREVIEW of what Scope will do
// with the message you're typing. It labels the send button and names the
// specialist BEFORE you send, so an action never comes as a surprise.
//
// Advisory only. The assistant + its proposal card stay authoritative: a run
// still renders a proposal you Start, page/field ops still go through the tools.
// This never executes anything — it only mirrors the assistant's routing so the
// UI can preview it. It deliberately honours the ask-vs-act gate: a workflow
// *mention* is NOT a command — only an imperative ("run/calculate/…") is — so we
// don't promise a run when the user is only asking about FAPI.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "detectComposerIntent",
    ()=>detectComposerIntent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/agents.ts [app-client] (ecmascript)");
;
// Hypotheticals, negations and explicit holds are NEVER an action — answer instead.
const HOLD = /\b(don'?t|do not|not yet|only explain|just explain|sans lancer|ne lance pas|pas encore|what ?if|hypothetical|might|maybe|could we|would it)\b/i;
const RUN_VERB = /\b(run|start|launch|calculate|calc|compute|execute|kick off|d[ée]marre[rz]?|lance[rz]?|calcule[rz]?|ex[ée]cute[rz]?)\b/i;
const OPEN_VERB = /\b(open|show|view|display|go to|take me to|pull up|ouvre|ouvrir|montre|affiche|voir)\b/i;
const GEN_VERB = /\b(generate|create|make|build|mock|draw|plot|chart|graph|visuali[sz]e)\b/i;
// Workflow keyword → id + copy target. Mirrors the assistant's valid ids
// (fapi · roulement · expense · campaign).
const WF_KEYWORD = [
    {
        re: /\bfapi\b/i,
        id: 'fapi',
        target: 'FAPI'
    },
    {
        re: /roulement|rollover|art\.?\s*85|section\s*85|\bs\.?\s*85\b/i,
        id: 'roulement',
        target: 'the art. 85 rollover'
    },
    {
        re: /\bexpenses?\b|d[ée]penses?|reimburs|per[- ]?diem/i,
        id: 'expense',
        target: 'expenses'
    },
    {
        re: /\bcampaign\b|marketing budget|budget allocation|channel spend/i,
        id: 'campaign',
        target: 'campaign budgets'
    }
];
const PAGE_NOUN = /\b(dashboard|worksheet|worksheets|t1134|surplus|viewer|documents?)\b/i;
const VIEW_NOUN = /\b(chart|graph|dashboard|table|kpi|tiles?|view|report|form|breakdown)\b/i;
function detectComposerIntent(text) {
    const t = text.trim();
    if (!t) return null;
    // A hold / hypothetical / negation always resolves to an answer.
    if (HOLD.test(t)) return {
        action: 'answer',
        verb: 'Answer',
        sendLabel: 'Send'
    };
    const wf = WF_KEYWORD.find((w)=>w.re.test(t));
    // Run: an imperative + a known workflow → that workflow's specialist proposes it.
    if (wf && RUN_VERB.test(t)) {
        const agent = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGENTS"].find((a)=>a.workflow === wf.id && a.live);
        return {
            action: 'run',
            verb: 'Run workflow',
            sendLabel: 'Run',
            workflowId: wf.id,
            agentId: agent?.id,
            target: wf.target
        };
    }
    // Generate a one-off view (chart / table / KPIs / dashboard-of).
    if (GEN_VERB.test(t) && VIEW_NOUN.test(t)) {
        return {
            action: 'generate',
            verb: 'Generate a view',
            sendLabel: 'Build'
        };
    }
    // Open a registered page.
    if (OPEN_VERB.test(t) || PAGE_NOUN.test(t)) {
        return {
            action: 'open',
            verb: 'Open',
            sendLabel: 'Open'
        };
    }
    // A bare imperative "run the workflow" without a recognised name.
    if (RUN_VERB.test(t) && /\bworkflow\b/i.test(t)) {
        return {
            action: 'run',
            verb: 'Run workflow',
            sendLabel: 'Run'
        };
    }
    // Everything else — including a bare workflow mention or a question — is answered.
    return {
        action: 'answer',
        verb: 'Answer',
        sendLabel: 'Send'
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_33bfcb9b._.js.map