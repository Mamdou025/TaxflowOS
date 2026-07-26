module.exports = [
"[project]/shared/stores/nav-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CLIENTS",
    ()=>CLIENTS,
    "navActionsAtom",
    ()=>navActionsAtom,
    "scopeYearAtom",
    ()=>scopeYearAtom,
    "selectedClientAtom",
    ()=>selectedClientAtom,
    "showClientSwitcherAtom",
    ()=>showClientSwitcherAtom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-ssr] (ecmascript)");
;
const CLIENTS = [
    'Northstar Inc.',
    'Meridian Energy Corp.',
    'Atlas Financial Group',
    'Cascade Technologies Ltd.',
    'Vantage Capital Partners',
    'Solaris Group',
    'Pinnacle Holdings',
    'Redwood Industries'
];
const selectedClientAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])('Northstar Inc.');
const showClientSwitcherAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(false);
const scopeYearAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(2025);
const navActionsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])([]);
}),
"[project]/shared/stores/chat-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assistantOpenAtom",
    ()=>assistantOpenAtom,
    "chatPageContextAtom",
    ()=>chatPageContextAtom,
    "chatPanelModeAtom",
    ()=>chatPanelModeAtom,
    "chatWorkspaceOpenAtom",
    ()=>chatWorkspaceOpenAtom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-ssr] (ecmascript)");
;
const chatPageContextAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])({
    page: 'home',
    label: 'InScope'
});
const chatWorkspaceOpenAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(false);
const assistantOpenAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(false);
const chatPanelModeAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])('split');
}),
"[project]/shared/stores/workspace-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EMPTY_RUN_EDITS",
    ()=>EMPTY_RUN_EDITS,
    "activeCoworkerAtom",
    ()=>activeCoworkerAtom,
    "activeRunAtom",
    ()=>activeRunAtom,
    "activeWindowIdAtom",
    ()=>activeWindowIdAtom,
    "activeWorkspaceWindowAtom",
    ()=>activeWorkspaceWindowAtom,
    "attachedDocsAtom",
    ()=>attachedDocsAtom,
    "closeAllWorkspaceWindowsAtom",
    ()=>closeAllWorkspaceWindowsAtom,
    "closeWorkspaceWindowAtom",
    ()=>closeWorkspaceWindowAtom,
    "closeWorkspaceWindowByKeyAtom",
    ()=>closeWorkspaceWindowByKeyAtom,
    "focusWorkspaceWindowAtom",
    ()=>focusWorkspaceWindowAtom,
    "openWorkspaceWindowAtom",
    ()=>openWorkspaceWindowAtom,
    "pushTrailAtom",
    ()=>pushTrailAtom,
    "runEditsAtom",
    ()=>runEditsAtom,
    "setActiveCoworkerAtom",
    ()=>setActiveCoworkerAtom,
    "setRunEditsAtom",
    ()=>setRunEditsAtom,
    "setRunInputAtom",
    ()=>setRunInputAtom,
    "setRunOverrideAtom",
    ()=>setRunOverrideAtom,
    "setThinkingCoworkerAtom",
    ()=>setThinkingCoworkerAtom,
    "thinkingCoworkerAtom",
    ()=>thinkingCoworkerAtom,
    "uploadedRowsAtom",
    ()=>uploadedRowsAtom,
    "workspaceTrailAtom",
    ()=>workspaceTrailAtom,
    "workspaceWindowsAtom",
    ()=>workspaceWindowsAtom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla/utils.mjs [app-ssr] (ecmascript)");
;
;
let seq = 0;
const nextId = ()=>`${Date.now().toString(36)}-${(seq++).toString(36)}`;
const workspaceWindowsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])([]);
const activeWindowIdAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(null);
const workspaceTrailAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])([]);
const activeRunAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(null);
const activeCoworkerAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(null);
const setActiveCoworkerAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(null, (_get, set, payload)=>{
    set(activeCoworkerAtom, payload ? {
        coworker: payload.coworker,
        status: payload.status,
        since: Date.now()
    } : null);
});
const thinkingCoworkerAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(null);
const setThinkingCoworkerAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(null, (_get, set, payload)=>{
    set(thinkingCoworkerAtom, payload ? {
        coworker: payload.coworker,
        lines: payload.lines,
        since: Date.now()
    } : null);
});
const uploadedRowsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atomWithStorage"])('taxflow:uploaded-source-rows', {});
const attachedDocsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])([]);
const EMPTY_RUN_EDITS = {
    inputs: {},
    overrides: {}
};
const runEditsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atomWithStorage"])('taxflow:run-edits', {});
const setRunInputAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, { id, key, value })=>{
    set(runEditsAtom, (prev)=>{
        const cur = prev[id] ?? EMPTY_RUN_EDITS;
        return {
            ...prev,
            [id]: {
                ...cur,
                inputs: {
                    ...cur.inputs,
                    [key]: value
                }
            }
        };
    });
});
const setRunOverrideAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, { id, rowId, categoryId })=>{
    set(runEditsAtom, (prev)=>{
        const cur = prev[id] ?? EMPTY_RUN_EDITS;
        return {
            ...prev,
            [id]: {
                ...cur,
                overrides: {
                    ...cur.overrides,
                    [rowId]: categoryId
                }
            }
        };
    });
});
const setRunEditsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, { id, edits })=>{
    set(runEditsAtom, (prev)=>({
            ...prev,
            [id]: edits
        }));
});
const activeWorkspaceWindowAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])((get)=>{
    const windows = get(workspaceWindowsAtom);
    if (windows.length === 0) return null;
    const activeId = get(activeWindowIdAtom);
    return windows.find((w)=>w.id === activeId) ?? windows[windows.length - 1];
});
// Append an entry to the trail. Loosely typed so Jotai's setter generics don't
// leak into every call site.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function record(set, kind, text, tone = 'navigation', actor) {
    set(workspaceTrailAtom, (prev)=>[
            ...prev,
            {
                id: nextId(),
                kind,
                tone,
                text,
                timestamp: Date.now(),
                actor
            }
        ]);
}
const pushTrailAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(null, (_get, set, payload)=>{
    record(set, payload.kind ?? 'note', payload.text, payload.tone, payload.actor);
});
const openWorkspaceWindowAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, payload)=>{
    const existing = get(workspaceWindowsAtom).find((w)=>w.pageKey === payload.pageKey);
    if (existing) {
        set(activeWindowIdAtom, existing.id);
        record(set, 'focus', `Reopened ${payload.title}`);
        return existing.id;
    }
    const win = {
        id: nextId(),
        pageKey: payload.pageKey,
        title: payload.title,
        openedAt: Date.now()
    };
    set(workspaceWindowsAtom, (prev)=>[
            ...prev,
            win
        ]);
    set(activeWindowIdAtom, win.id);
    record(set, 'open', `Opened ${payload.title}`);
    return win.id;
});
const closeWorkspaceWindowAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, id)=>{
    const windows = get(workspaceWindowsAtom);
    const win = windows.find((w)=>w.id === id);
    const remaining = windows.filter((w)=>w.id !== id);
    set(workspaceWindowsAtom, remaining);
    if (get(activeWindowIdAtom) === id) {
        set(activeWindowIdAtom, remaining.length ? remaining[remaining.length - 1].id : null);
    }
    if (win) record(set, 'close', `Closed ${win.title}`);
});
const closeWorkspaceWindowByKeyAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, pageKey)=>{
    const windows = get(workspaceWindowsAtom);
    let target;
    if (pageKey) {
        target = windows.find((w)=>w.pageKey === pageKey);
    } else {
        const activeId = get(activeWindowIdAtom);
        target = windows.find((w)=>w.id === activeId) ?? windows[windows.length - 1];
    }
    if (!target) return;
    const remaining = windows.filter((w)=>w.id !== target.id);
    set(workspaceWindowsAtom, remaining);
    if (get(activeWindowIdAtom) === target.id) {
        set(activeWindowIdAtom, remaining.length ? remaining[remaining.length - 1].id : null);
    }
    record(set, 'close', `Closed ${target.title}`);
});
const closeAllWorkspaceWindowsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(null, (get, set)=>{
    const count = get(workspaceWindowsAtom).length;
    if (count === 0) return;
    set(workspaceWindowsAtom, []);
    set(activeWindowIdAtom, null);
    record(set, 'close', `Closed all pages (${count})`);
});
const focusWorkspaceWindowAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, id)=>{
    const win = get(workspaceWindowsAtom).find((w)=>w.id === id);
    if (!win) return;
    set(activeWindowIdAtom, id);
    record(set, 'focus', `Switched to ${win.title}`);
});
}),
"[project]/shared/stores/resource-registry.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KIND_COLOR",
    ()=>KIND_COLOR,
    "KIND_LABEL",
    ()=>KIND_LABEL,
    "RESOURCES",
    ()=>RESOURCES,
    "anchorToPage",
    ()=>anchorToPage,
    "buildAgentCatalog",
    ()=>buildAgentCatalog,
    "fieldValuesAtom",
    ()=>fieldValuesAtom,
    "getFieldContext",
    ()=>getFieldContext,
    "getPage",
    ()=>getPage,
    "getResource",
    ()=>getResource,
    "isEditableField",
    ()=>isEditableField,
    "listPages",
    ()=>listPages,
    "resolveFieldEdit",
    ()=>resolveFieldEdit,
    "resolveFieldId",
    ()=>resolveFieldId,
    "resolveIntent",
    ()=>resolveIntent,
    "resolveTarget",
    ()=>resolveTarget,
    "splitMentions",
    ()=>splitMentions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla/utils.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-ssr] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/globe.js [app-ssr] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/layers.js [app-ssr] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Receipt$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/receipt.js [app-ssr] (ecmascript) <export default as Receipt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$files$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Files$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/files.js [app-ssr] (ecmascript) <export default as Files>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-ssr] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/workflow.js [app-ssr] (ecmascript) <export default as Workflow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/bot.js [app-ssr] (ecmascript) <export default as Bot>");
'use client';
;
;
;
;
const KIND_COLOR = {
    tool: '#0891B2',
    integration: '#2563EB',
    workflow: '#6B21A8',
    agent: '#C2410C',
    persona: '#B45309',
    value: '#059669',
    worksheet: '#6B21A8'
};
const KIND_LABEL = {
    tool: 'Tool',
    integration: 'Integration',
    workflow: 'Workflow',
    agent: 'AI agent',
    persona: 'Persona',
    value: 'Value',
    worksheet: 'Worksheet'
};
// ─── Lazy page loading ──────────────────────────────────────────────────────
const Loading = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: 32,
            fontSize: 13,
            color: '#6B7280'
        },
        children: "Loading page…"
    }, void 0, false, {
        fileName: "[project]/shared/stores/resource-registry.tsx",
        lineNumber: 126,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const lazyPage = (loader)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(loader, {
        ssr: false,
        loading: Loading
    });
const RESOURCES = [
    // ── Integrations / tools / values / agents (chip-only entities) ────────────
    {
        id: 'email',
        kind: 'integration',
        token: 'EMAIL',
        mentions: [
            'email',
            'inbox',
            'outlook'
        ],
        note: 'Email integration'
    },
    {
        id: 'workflow-builder',
        kind: 'tool',
        token: 'WORKFLOW-BUILDER',
        mentions: [
            'workflow-builder',
            'workflow builder',
            'the builder'
        ],
        note: 'Visual workflow canvas',
        open: {
            as: 'route',
            href: '/builder'
        }
    },
    {
        id: 'viewer',
        kind: 'tool',
        token: 'DOCUMENTS',
        mentions: [
            'documents',
            'document viewer',
            'the viewer'
        ],
        keywords: [
            'open pdf',
            'open excel',
            'open word',
            'view document',
            'view file',
            'read pdf',
            'read document',
            'documents',
            'viewer'
        ],
        note: 'Open & view PDF / Excel / Word files',
        open: {
            as: 'page',
            pageKey: 'viewer'
        },
        page: {
            title: 'Documents',
            subtitle: 'Open PDF, Excel & Word files',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$files$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Files$3e$__["Files"],
            Component: lazyPage(()=>__turbopack_context__.A("[project]/features/assistant/workspace/document-viewer.tsx [app-ssr] (ecmascript, async loader)"))
        }
    },
    {
        id: 'worksheets',
        kind: 'tool',
        token: 'WORKSHEETS',
        mentions: [
            'worksheets',
            'the worksheets',
            'all worksheets'
        ],
        keywords: [
            'worksheets',
            'all worksheets',
            'open worksheet',
            'worksheet list'
        ],
        note: 'All worksheets — pick one to open',
        open: {
            as: 'page',
            pageKey: 'worksheets'
        },
        page: {
            title: 'Worksheets',
            subtitle: 'FAPI · T1134 · Surplus · Executive Overview',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"],
            Component: lazyPage(()=>__turbopack_context__.A("[project]/features/assistant/workspace/worksheets-hub.tsx [app-ssr] (ecmascript, async loader)"))
        }
    },
    {
        id: 'workflows',
        kind: 'tool',
        token: 'WORKFLOWS',
        mentions: [
            'workflows',
            'the workflows',
            'all workflows',
            'workflow portfolio'
        ],
        keywords: [
            'workflows',
            'all workflows',
            'workflow portfolio',
            'tax workflows',
            'open workflow',
            'workflow list'
        ],
        note: 'The workflow portfolio — procedures to view, run and review',
        open: {
            as: 'page',
            pageKey: 'workflows'
        },
        page: {
            title: 'Workflows',
            subtitle: 'Canadian Corporate Tax portfolio · Platform services',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__["Workflow"],
            Component: lazyPage(()=>__turbopack_context__.A("[project]/features/workflows-hub/workflows-hub.tsx [app-ssr] (ecmascript, async loader)"))
        }
    },
    {
        id: 'agent',
        kind: 'tool',
        token: 'AGENT',
        mentions: [
            'agent',
            'sina',
            'the agent',
            'agent settings'
        ],
        keywords: [
            'agent',
            'sina',
            'agent settings',
            'assistant settings',
            'configure the agent',
            'agent overview',
            'what the agent knows'
        ],
        note: 'Sina — the one live agent: see everything it knows / sees / can do, and configure it',
        open: {
            as: 'page',
            pageKey: 'agent'
        },
        page: {
            title: 'Agent',
            subtitle: 'Sina — overview & configuration',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"],
            Component: lazyPage(()=>__turbopack_context__.A("[project]/features/agent-hub/agent-hub.tsx [app-ssr] (ecmascript, async loader)"))
        }
    },
    {
        id: 'gross-fapi',
        kind: 'value',
        token: 'GROSS FAPI',
        mentions: [
            'gross fapi',
            'gross-fapi'
        ],
        note: 'Computed value'
    },
    {
        id: 'sophia',
        kind: 'agent',
        token: 'SOPHIA',
        mentions: [
            'sophia'
        ],
        note: 'IRL research agent'
    },
    // ── FAPI — one resource that is a chip (FAPI-WORKFLOW), a page (fapi), and a
    //    set of addressable/editable anchors. Previously split across all four
    //    registries; now a single entry. ────────────────────────────────────────
    {
        id: 'fapi',
        kind: 'workflow',
        token: 'FAPI-WORKFLOW',
        mentions: [
            'fapi-workflow',
            'fapi workflow'
        ],
        keywords: [
            'fapi',
            'foreign accrual',
            'accrual property'
        ],
        note: 'FAPI calculation workflow',
        open: {
            as: 'page',
            pageKey: 'fapi'
        },
        page: {
            title: 'FAPI Worksheet',
            subtitle: 'Foreign accrual property income',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"],
            Component: lazyPage(()=>__turbopack_context__.A("[project]/features/worksheets/components/fapi-worksheet.tsx [app-ssr] (ecmascript, async loader)"))
        },
        anchors: [
            // Order: most specific first (first keyword match wins on navigate).
            {
                anchor: 'fapi:fx',
                label: 'Annual Average FX Rate',
                keywords: [
                    'fx rate',
                    'exchange rate',
                    'annual average',
                    'currency conversion',
                    'fx'
                ],
                field: {
                    id: 'fx',
                    tag: 'FX',
                    ccy: 'RATE',
                    default: '1.35',
                    hint: 'USD → CAD annual average',
                    editKeywords: [
                        'fx rate',
                        'exchange rate',
                        'fx',
                        'annual average'
                    ],
                    // Bridge to the FAPI engine's fxRate input — one value across chat, sheet, run.
                    binding: {
                        workflowId: 'fapi',
                        inputKey: 'fxRate'
                    }
                }
            },
            {
                anchor: 'fapi:a',
                label: 'Property Income (A)',
                keywords: [
                    'property income',
                    'dividend',
                    'component a',
                    'line a'
                ]
            },
            {
                anchor: 'fapi:a-div',
                label: 'Property Income — Dividendes',
                keywords: [],
                field: {
                    id: 'a-div',
                    tag: 'A',
                    ccy: 'CAD',
                    default: '0.00',
                    hint: 'Manual entry',
                    editKeywords: [
                        'dividend',
                        'dividendes',
                        'property income'
                    ]
                }
            },
            {
                anchor: 'fapi:allowable-expenses',
                label: 'Allowable Expenses',
                keywords: [
                    'allowable expenses',
                    'expenses',
                    'deductions'
                ]
            },
            {
                anchor: 'fapi:b',
                label: 'Gains From Disposition (B)',
                keywords: [
                    'component b',
                    'gains from disposition',
                    'disposition',
                    'gains'
                ]
            },
            {
                anchor: 'fapi:95-2',
                label: 'Canadian Rules 95(2)',
                keywords: [
                    '95(2)',
                    '95-2',
                    'canadian rules',
                    'recharacterization',
                    'recharacterize'
                ]
            },
            {
                anchor: 'fapi:a1',
                label: 'Debt Forgiveness (A.1)',
                keywords: [
                    'debt forgiveness',
                    'a.1',
                    'a1'
                ]
            },
            {
                anchor: 'fapi:a2',
                label: 'Prior Year G (A.2)',
                keywords: [
                    'prior year',
                    'a.2',
                    'a2'
                ]
            }
        ]
    },
    // ── Expense Reimbursement — a non-fiscal workflow that HAS its own worksheet.
    //    A chip (EXPENSE-WORKFLOW), a page (expense), and the run's result surface.
    {
        id: 'expense',
        kind: 'workflow',
        token: 'EXPENSE-WORKFLOW',
        mentions: [
            'expense-workflow',
            'expense workflow',
            'reimbursement workflow'
        ],
        keywords: [
            'expense',
            'reimbursement',
            'expense report',
            'receipts',
            'per diem',
            'per-diem'
        ],
        note: 'Employee expense reimbursement workflow',
        open: {
            as: 'page',
            pageKey: 'expense'
        },
        page: {
            title: 'Expense Reimbursement',
            subtitle: 'Receipts · policy caps · net payable',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Receipt$3e$__["Receipt"],
            Component: lazyPage(()=>__turbopack_context__.A("[project]/features/worksheets/components/expense-worksheet.tsx [app-ssr] (ecmascript, async loader)"))
        }
    },
    // ── Other registered pages ─────────────────────────────────────────────────
    {
        id: 'dashboard',
        kind: 'worksheet',
        keywords: [
            'dashboard',
            'portfolio',
            'work items',
            'review queue',
            'kpi',
            'my work'
        ],
        open: {
            as: 'page',
            pageKey: 'dashboard'
        },
        page: {
            title: 'Practitioner Dashboard',
            subtitle: 'Portfolio · work items · review queue',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"],
            Component: lazyPage(()=>__turbopack_context__.A("[project]/features/worksheets/legacy/pages/Dashboard.tsx [app-ssr] (ecmascript, async loader)"))
        },
        anchors: [
            {
                anchor: 'dashboard:ai-summary',
                label: 'AI Workspace Summary',
                keywords: [
                    'ai summary',
                    'workspace summary'
                ]
            },
            {
                anchor: 'dashboard:review-queue',
                label: 'Review Queue',
                keywords: [
                    'review queue'
                ]
            },
            {
                anchor: 'dashboard:work-items',
                label: 'My Work Items',
                keywords: [
                    'work items',
                    'my work',
                    'sign-off',
                    'sign off'
                ]
            },
            {
                anchor: 'dashboard:portfolio',
                label: 'Client Portfolio',
                keywords: [
                    'client portfolio',
                    'portfolio'
                ]
            },
            {
                anchor: 'dashboard:deadlines',
                label: 'Upcoming Deadlines',
                keywords: [
                    'deadlines',
                    'upcoming deadlines'
                ]
            },
            {
                anchor: 'dashboard:activity',
                label: 'Recent Activity',
                keywords: [
                    'recent activity',
                    'activity feed'
                ]
            },
            {
                anchor: 'dashboard:kpis',
                label: 'KPI metrics',
                keywords: [
                    'kpi',
                    'key metrics',
                    'pending reviews',
                    'at risk',
                    'at-risk',
                    'completed',
                    'metrics'
                ]
            }
        ]
    },
    {
        id: 'bu-overview',
        kind: 'worksheet',
        keywords: [
            'overview',
            'executive',
            'business unit',
            'bu overview',
            'executive overview'
        ],
        open: {
            as: 'page',
            pageKey: 'bu-overview'
        },
        page: {
            title: 'Executive Overview',
            subtitle: 'Business-unit tax overview',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
            Component: lazyPage(()=>__turbopack_context__.A("[project]/features/worksheets/legacy/pages/ExecutiveOverview.tsx [app-ssr] (ecmascript, async loader)"))
        },
        anchors: [
            {
                anchor: 'bu:revenue',
                label: 'Revenue Attainment by LOS',
                keywords: [
                    'revenue attainment',
                    'attainment',
                    'revenue by los'
                ]
            },
            {
                anchor: 'bu:lines-of-service',
                label: 'Lines of Service',
                keywords: [
                    'lines of service',
                    'control tower'
                ]
            },
            {
                anchor: 'bu:kpis',
                label: 'Executive KPIs',
                keywords: [
                    'executive kpi',
                    'executive metrics',
                    'revenue ytd'
                ]
            }
        ]
    },
    {
        id: 'surplus',
        kind: 'worksheet',
        keywords: [
            'surplus',
            'exempt surplus',
            'taxable surplus'
        ],
        open: {
            as: 'page',
            pageKey: 'surplus'
        },
        page: {
            title: 'Surplus Worksheet',
            subtitle: 'Exempt / taxable surplus',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"],
            Component: lazyPage(()=>__turbopack_context__.A("[project]/features/worksheets/legacy/pages/SurplusWorksheet.tsx [app-ssr] (ecmascript, async loader)"))
        },
        anchors: [
            {
                anchor: 'surplus:opening',
                label: 'Opening Balance',
                keywords: [
                    'opening balance',
                    'opening surplus'
                ]
            },
            {
                anchor: 'surplus:fs-income',
                label: 'Income per Financial Statements',
                keywords: [
                    'income per financial',
                    'financial statements income',
                    'net income'
                ]
            },
            {
                anchor: 'surplus:book-tax',
                label: 'Book-to-Tax Adjustments',
                keywords: [
                    'book-to-tax',
                    'book to tax'
                ]
            },
            {
                anchor: 'surplus:reg-5907',
                label: 'Reg. 5907(2) Adjustments',
                keywords: [
                    'reg. 5907',
                    'reg 5907',
                    '5907'
                ]
            },
            {
                anchor: 'surplus:taxes',
                label: 'Income Taxes Paid / Refunded',
                keywords: [
                    'income taxes',
                    'taxes paid',
                    'withholding'
                ]
            },
            {
                anchor: 'surplus:dividends',
                label: 'Dividends Paid / Received',
                keywords: [
                    'dividends paid',
                    'dividends received',
                    'dividends'
                ]
            }
        ]
    },
    {
        id: 't1134',
        kind: 'worksheet',
        keywords: [
            't1134',
            '1134',
            'foreign affiliate',
            'affiliate reporting'
        ],
        open: {
            as: 'page',
            pageKey: 't1134'
        },
        page: {
            title: 'T1134 Workpaper',
            subtitle: 'Foreign affiliate reporting',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
            Component: lazyPage(()=>__turbopack_context__.A("[project]/features/worksheets/legacy/pages/T1134Worksheet.tsx [app-ssr] (ecmascript, async loader)"))
        },
        anchors: [
            {
                anchor: 't1134:part1',
                label: 'Part I — Summary',
                keywords: [
                    'part i',
                    'part 1',
                    't1134 summary',
                    'summary form'
                ]
            },
            {
                anchor: 't1134:part2-s1',
                label: 'Part II · Section 1 — Foreign Affiliate Information',
                keywords: [
                    'foreign affiliate information',
                    'section 1',
                    'fa information'
                ]
            },
            {
                anchor: 't1134:part2-s2',
                label: 'Part II · Section 2 — Financial Information',
                keywords: [
                    'financial information',
                    'section 2'
                ]
            },
            {
                anchor: 't1134:part2-s3a',
                label: 'Part II · Section 3A — Surplus Accounts & Dividends',
                keywords: [
                    'surplus accounts',
                    'section 3a'
                ]
            },
            {
                anchor: 't1134:part3-fapi',
                label: 'Part III · Section 3 — FAPI / FAPL / FACL',
                keywords: [
                    'facl',
                    'fapl',
                    'fapi section',
                    'part iii section 3'
                ]
            },
            {
                anchor: 't1134:part4',
                label: 'Part IV — Disclosure',
                keywords: [
                    'disclosure',
                    'part iv',
                    'part 4'
                ]
            }
        ]
    },
    {
        id: 'client',
        kind: 'worksheet',
        keywords: [
            'client workspace',
            'client file',
            'northstar',
            'client overview'
        ],
        open: {
            as: 'page',
            pageKey: 'client'
        },
        page: {
            title: 'Client Workspace',
            subtitle: 'Client file overview',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"],
            Component: lazyPage(()=>__turbopack_context__.A("[project]/features/worksheets/legacy/pages/ClientWorkspace.tsx [app-ssr] (ecmascript, async loader)"))
        }
    }
];
// ─── Indexes ─────────────────────────────────────────────────────────────────
const BY_ID = new Map();
const BY_FIELD_ID = new Map();
const ANCHOR_TO_PAGE = new Map();
for (const r of RESOURCES){
    BY_ID.set(r.id, r);
    for (const a of r.anchors ?? []){
        ANCHOR_TO_PAGE.set(a.anchor, r.id);
        if (a.field) BY_FIELD_ID.set(a.field.id, {
            pageKey: r.id,
            anchor: a,
            field: a.field
        });
    }
}
function getResource(id) {
    return BY_ID.get(id) ?? null;
}
function anchorToPage(anchor) {
    return ANCHOR_TO_PAGE.get(anchor) ?? null;
}
function toPageView(r) {
    if (!r.page) return null;
    return {
        key: r.id,
        title: r.page.title,
        subtitle: r.page.subtitle,
        icon: r.page.icon,
        Component: r.page.Component
    };
}
function getPage(key) {
    const r = BY_ID.get(key);
    return r ? toPageView(r) : null;
}
function listPages() {
    return RESOURCES.map(toPageView).filter((p)=>p !== null);
}
// ─── Chip rendering (was chat-entities.splitEntities) ────────────────────────
const MENTION_TO_RESOURCE = new Map();
for (const r of RESOURCES){
    if (!r.token) continue;
    for (const m of r.mentions ?? [])MENTION_TO_RESOURCE.set(m.toLowerCase(), r);
    MENTION_TO_RESOURCE.set(r.token.toLowerCase(), r);
}
// Longest mentions first so "fapi workflow" wins over "fapi".
const MENTIONS = [
    ...MENTION_TO_RESOURCE.keys()
].sort((a, b)=>b.length - a.length);
const escapeRe = (s)=>s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const MENTION_RE = new RegExp(`(${MENTIONS.map(escapeRe).join('|')})`, 'gi');
function splitMentions(text) {
    const parts = [];
    let last = 0;
    MENTION_RE.lastIndex = 0;
    let m;
    while((m = MENTION_RE.exec(text)) !== null){
        if (m.index > last) parts.push({
            type: 'text',
            value: text.slice(last, m.index)
        });
        const resource = MENTION_TO_RESOURCE.get(m[0].toLowerCase());
        if (resource) parts.push({
            type: 'chip',
            resource,
            matched: m[0]
        });
        else parts.push({
            type: 'text',
            value: m[0]
        });
        last = m.index + m[0].length;
    }
    if (last < text.length) parts.push({
        type: 'text',
        value: text.slice(last)
    });
    return parts;
}
const OPEN_VERB = /\b(open|show|bring|pull up|go to|navigate|launch|display|view)\b/;
const CLOSE_VERB = /\b(close|dismiss|hide|exit|leave)\b/;
const ALL_WORD = /\b(all|everything|them)\b/;
const SURFACE_WORD = /\b(page|window|tab|workspace|it|this|that)\b/;
function resolveIntent(raw) {
    const t = raw.toLowerCase().trim();
    if (!t) return {
        type: 'none'
    };
    const match = listPages().find((p)=>{
        const r = BY_ID.get(p.key);
        return (r.keywords ?? []).some((k)=>t.includes(k)) || t.includes(p.title.toLowerCase()) || t.includes(p.key);
    });
    const wantsClose = CLOSE_VERB.test(t);
    const wantsOpen = OPEN_VERB.test(t);
    if (wantsClose && ALL_WORD.test(t)) return {
        type: 'closeAll'
    };
    if (wantsClose && (match || SURFACE_WORD.test(t))) {
        return {
            type: 'close',
            pageKey: match ? match.key : null
        };
    }
    if (match && (wantsOpen || !wantsClose)) return {
        type: 'open',
        pageKey: match.key
    };
    return {
        type: 'none'
    };
}
function resolveTarget(text) {
    const t = text.toLowerCase();
    for (const r of RESOURCES){
        for (const a of r.anchors ?? []){
            if (a.keywords.some((k)=>t.includes(k))) {
                return {
                    pageKey: r.id,
                    anchor: a.anchor,
                    label: a.label
                };
            }
        }
    }
    return null;
}
const fieldValuesAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atomWithStorage"])('inscope.fapi.values', {});
function getFieldContext(fieldId) {
    const hit = BY_FIELD_ID.get(fieldId);
    if (!hit) return null;
    return {
        pageKey: hit.pageKey,
        anchor: hit.anchor.anchor,
        field: hit.field,
        label: hit.anchor.label
    };
}
function resolveFieldId(query) {
    if (!query) return null;
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const strip = (s)=>s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const qs = strip(query);
    if (BY_FIELD_ID.has(query)) return query;
    for (const [id] of BY_FIELD_ID)if (id.toLowerCase() === q) return id;
    for (const [id, ctx] of BY_FIELD_ID){
        if (strip(id) === qs) return id;
        if (strip(ctx.field.tag) === qs) return id;
        if (ctx.field.binding && strip(ctx.field.binding.inputKey) === qs) return id;
        if (ctx.anchor.label.toLowerCase() === q) return id;
    }
    for (const [id, ctx] of BY_FIELD_ID){
        if (ctx.anchor.label.toLowerCase().includes(q)) return id;
        if (ctx.field.editKeywords.some((k)=>q.includes(k) || k.includes(q))) return id;
    }
    return null;
}
function isEditableField(id) {
    return BY_FIELD_ID.has(id);
}
const EDIT_VERB = /\b(edit|change|set|update|modify|add|enter|input|put|adjust)\b/;
function resolveFieldEdit(text) {
    const t = text.toLowerCase();
    if (!EDIT_VERB.test(t)) return null;
    for (const [, ctx] of BY_FIELD_ID){
        if (ctx.field.editKeywords.some((k)=>t.includes(k))) {
            const m = t.match(/(-?\d[\d,]*\.?\d*)/);
            return {
                pageKey: ctx.pageKey,
                anchor: ctx.anchor.anchor,
                fieldId: ctx.field.id,
                preset: m ? m[1].replace(/,/g, '') : undefined
            };
        }
    }
    return null;
}
function buildAgentCatalog() {
    const pages = [];
    const anchors = [];
    const fields = [];
    const routes = [];
    for (const r of RESOURCES){
        if (r.page) pages.push({
            key: r.id,
            title: r.page.title,
            subtitle: r.page.subtitle
        });
        if (r.open?.as === 'route') routes.push({
            id: r.id,
            label: r.token ?? r.id,
            href: r.open.href
        });
        for (const a of r.anchors ?? []){
            anchors.push({
                anchor: a.anchor,
                pageKey: r.id,
                label: a.label
            });
            if (a.field) fields.push({
                fieldId: a.field.id,
                pageKey: r.id,
                anchor: a.anchor,
                label: a.label
            });
        }
    }
    return {
        pages,
        anchors,
        fields,
        routes
    };
}
}),
];

//# sourceMappingURL=shared_stores_4e85d318._.js.map