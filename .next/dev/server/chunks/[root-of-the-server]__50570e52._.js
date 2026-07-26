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
"[externals]/@copilotkit/runtime [external] (@copilotkit/runtime, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("@copilotkit/runtime");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/@copilotkit/runtime/v2 [external] (@copilotkit/runtime/v2, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("@copilotkit/runtime/v2");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/lib/copilot-orphan-repair.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Server-side orphaned-tool-call repair for the CopilotKit runtime.
//
// Why: with an explicit default BuiltInAgent, CopilotKit converts the WHOLE persisted
// thread and hands it to the Vercel AI SDK (ai@6, the copy @copilotkit/runtime pulls),
// whose `convertToLanguageModelPrompt` walks the messages and THROWS
// MissingToolResultsError ("Tool result is missing for tool call …") at any user/system
// message — or the end of the thread — while an assistant tool-call id has no matching
// tool result. Such an orphan is created whenever the stream that emitted a tool call
// is aborted before the client handler emits its result (Stop, route navigation,
// unmount/hot-reload) — very common right AFTER a workflow run, where the user navigates
// away to inspect results while the run is still mounted. One orphan then poisons EVERY
// later message.
//
// This mirrors the AI SDK's own pairing walk but, instead of throwing, INJECTS a
// synthetic tool result for each still-pending call right before the boundary — so the
// thread the server sends is always valid, deterministically, for orphans from ANY
// source. It runs as a runtime middleware (app/api/copilotkit/route.ts) on every run,
// replacing the former client-side heal (removed), which failed because agent.setMessages()
// deep-clones via structuredClone and throws DataCloneError on the render closure that a
// workflow's assistant message always carries.
// ─────────────────────────────────────────────────────────────────────────────
/** Minimal structural shape of an AG-UI chat message (only the pairing fields matter). */ __turbopack_context__.s([
    "repairOrphanToolCalls",
    ()=>repairOrphanToolCalls,
    "syntheticToolResult",
    ()=>syntheticToolResult
]);
function syntheticToolResult(toolCallId) {
    return {
        id: `synthetic-tool-${toolCallId}`,
        role: 'tool',
        toolCallId,
        content: JSON.stringify({
            status: 'unavailable',
            note: 'This tool call was not completed (the run was aborted or the user navigated away). See the run panel in the chat.'
        })
    };
}
function repairOrphanToolCalls(messages) {
    const src = messages ?? [];
    const out = [];
    const pending = new Set();
    let changed = false;
    const flushBoundary = ()=>{
        if (pending.size === 0) return;
        for (const id of pending){
            out.push(syntheticToolResult(id));
        }
        pending.clear();
        changed = true;
    };
    for (const m of src){
        const role = m?.role;
        // The AI SDK checks its pending-tool-call set at each user/system message and at
        // end-of-array — close out any unanswered calls right before this boundary.
        // ('developer' maps to a system message downstream when forwardDeveloperMessages
        // is enabled, so treat it as a boundary too.)
        if (role === 'user' || role === 'system' || role === 'developer') {
            flushBoundary();
            out.push(m);
            continue;
        }
        out.push(m);
        if (role === 'assistant' && Array.isArray(m.toolCalls)) {
            for (const tc of m.toolCalls){
                const id = tc?.id;
                if (typeof id === 'string' && id) pending.add(id);
            }
        } else if (role === 'tool') {
            const id = m.toolCallId;
            if (typeof id === 'string') pending.delete(id);
        }
    }
    flushBoundary();
    return changed ? out : src;
}
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[project]/lib/copilot-trace.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Copilot trace — "what does the AI actually see?"
//
// When COPILOT_TRACE is set (e.g. `COPILOT_TRACE=1 pnpm dev`), every request that
// reaches the CopilotKit runtime dumps the EXACT input handed to the model — the
// full message thread, which carries the system instructions, the useCopilotReadable
// context (the grounding: field values, live workflow snapshots, active run, open
// pages), and the tool calls/results — to a timestamped file under `.copilot-trace/`,
// plus a one-line console summary. This is the ground-truth answer to "where did the
// AI get that value?": open the newest file and read what was in context that turn.
//
// Off by default and a no-op unless the env var is set — zero overhead in normal runs.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "traceCopilotInput",
    ()=>traceCopilotInput
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
;
;
/** JSON.stringify that survives circular refs + functions (agent inputs have both). */ function safeStringify(value, space = 2) {
    const seen = new WeakSet();
    return JSON.stringify(value, (_key, val)=>{
        if (typeof val === 'function') return '[Function]';
        if (typeof val === 'object' && val !== null) {
            if (seen.has(val)) return '[Circular]';
            seen.add(val);
        }
        return val;
    }, space);
}
function traceCopilotInput(input) {
    if (!process.env.COPILOT_TRACE) return;
    try {
        const dir = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(process.cwd(), '.copilot-trace');
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["mkdirSync"])(dir, {
            recursive: true
        });
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        const file = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(dir, `${stamp}.json`);
        const typed = input ?? {};
        const messages = Array.isArray(typed.messages) ? typed.messages : [];
        const payload = {
            capturedAt: new Date().toISOString(),
            inputKeys: input && typeof input === 'object' ? Object.keys(input) : [],
            messageCount: messages.length,
            input
        };
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["appendFileSync"])(file, safeStringify(payload));
        const roles = messages.map((m)=>{
            const rec = m;
            return String(rec?.role ?? rec?.type ?? '?');
        }).join(', ');
        // eslint-disable-next-line no-console
        console.log(`[copilot-trace] captured ${messages.length} messages (${roles}) → ${file}`);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[copilot-trace] failed to write trace', err);
    }
}
}),
"[project]/features/assistant/runtime/config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Assistant-runtime configuration — feature flags + model policy, in ONE place.
//
// This module is the single, server-readable source of truth for how the intent
// layer behaves. Nothing here reaches into React/jotai; it only reads env once so
// the whole runtime can be re-tuned (or fully disabled) without touching agent,
// route, or UI code. Import from server code only.
//
// The central knob is the INTENT GATE mode:
//   'off'      → the gate is inert; the chat behaves exactly as before this feature.
//   'shadow'   → the gate classifies every user turn and logs its decision, but does
//                NOT change which tools the model sees (safe to run in production to
//                collect routing accuracy before enforcing).
//   'enforce'  → the gate additionally scopes the tool set / adds a routing directive
//                so a workflow MENTION can no longer trigger a run and an explicit
//                command is reliably caught. Always fail-open: any error → no change.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "getAssistantRuntimeConfig",
    ()=>getAssistantRuntimeConfig,
    "intentGateActive",
    ()=>intentGateActive
]);
function readGateMode() {
    const raw = (process.env.ASSISTANT_INTENT_GATE ?? '').trim().toLowerCase();
    if (raw === 'off' || raw === 'shadow' || raw === 'enforce') return raw;
    // Default: enforce. The gate is surgical and fail-open, so the safe default is the
    // one that actually fixes the reported behavior. Set ASSISTANT_INTENT_GATE=off to
    // revert to the pre-feature chat with zero code changes.
    return 'enforce';
}
function readReasoning(envKey, fallback) {
    const raw = (process.env[envKey] ?? '').trim().toLowerCase();
    if (raw === 'minimal' || raw === 'low' || raw === 'medium' || raw === 'high') return raw;
    return fallback;
}
function getAssistantRuntimeConfig() {
    // The chat baseline model — the same value the CopilotKit route already uses.
    const chatModel = process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o';
    return {
        intentGate: readGateMode(),
        intentDirectives: (process.env.ASSISTANT_INTENT_DIRECTIVES ?? '').trim().toLowerCase() !== 'off',
        // Default ON, but a no-op until FAST/DEEP are set to models distinct from the chat model.
        modelTiering: (process.env.ASSISTANT_MODEL_TIERING ?? '').trim().toLowerCase() !== 'off',
        specialists: (process.env.ASSISTANT_SPECIALISTS ?? '').trim().toLowerCase() !== 'off',
        // Off by default: reasoningEffort only applies to reasoning-capable models.
        reasoningEnabled: (process.env.ASSISTANT_REASONING_ENABLED ?? '').trim().toLowerCase() === 'on',
        router: {
            // The optional structured router prefers accuracy; use the fast chat model by default.
            model: process.env.ASSISTANT_MODEL_ROUTER ?? chatModel,
            reasoning: readReasoning('ASSISTANT_REASONING_ROUTER', 'low')
        },
        conductor: {
            model: chatModel,
            reasoning: readReasoning('ASSISTANT_REASONING_CONDUCTOR', 'medium')
        },
        fast: {
            // Simple navigation turns. Defaults to the chat model (→ no change) until set.
            model: process.env.ASSISTANT_MODEL_FAST ?? chatModel,
            reasoning: readReasoning('ASSISTANT_REASONING_FAST', 'low')
        },
        deep: {
            // Hard tax/analysis turns. Defaults to the chat model (→ no change) until set.
            model: process.env.ASSISTANT_MODEL_DEEP ?? chatModel,
            reasoning: readReasoning('ASSISTANT_REASONING_DEEP', 'high')
        }
    };
}
function intentGateActive(mode) {
    return mode === 'shadow' || mode === 'enforce';
}
}),
"[project]/features/assistant/runtime/routing/route-schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// AssistantRoute — the shared, runtime-validated classification of one user turn.
//
// This is the contract BOTH the deterministic classifier (classify.ts) and the
// optional structured LLM router (intent-router.ts) produce, so the enforcement
// layer (gate.ts + route-policy.ts) never has to care which produced it.
//
// The core distinction is principle #2: a workflow keyword identifies a TARGET,
// it is never on its own an EXECUTE command. `mode` (ask/propose/execute) and
// `target` are separate fields for exactly that reason.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "AssistantIntentSchema",
    ()=>AssistantIntentSchema,
    "AssistantModeSchema",
    ()=>AssistantModeSchema,
    "AssistantRouteSchema",
    ()=>AssistantRouteSchema,
    "ExplicitnessSchema",
    ()=>ExplicitnessSchema,
    "ROUTE_SCHEMA_VERSION",
    ()=>ROUTE_SCHEMA_VERSION,
    "RouteTargetKindSchema",
    ()=>RouteTargetKindSchema,
    "RouteTargetSchema",
    ()=>RouteTargetSchema,
    "fallbackRoute",
    ()=>fallbackRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
const ROUTE_SCHEMA_VERSION = 'route.v1';
const AssistantModeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    'ask',
    'propose',
    'execute'
]);
const AssistantIntentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    'general_conversation',
    'answer_question',
    'explain_workflow',
    'find_workflow',
    'start_workflow',
    'continue_workflow',
    'pause_workflow',
    'cancel_workflow',
    'get_workflow_status',
    'run_calculation',
    'inspect_calculation',
    'search_evidence',
    'open_page',
    'open_artifact',
    'edit_field',
    'modify_protected_value',
    'create_ui_view',
    'approve_action',
    'reject_action',
    'cancel_pending_action',
    'unknown'
]);
const ExplicitnessSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    'explicit_action',
    'implicit_request',
    'hypothetical',
    'mention_only',
    'ambiguous'
]);
const RouteTargetKindSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    'workflow',
    'workflow_run',
    'calculation',
    'artifact',
    'page',
    'field',
    'evidence',
    'pending_action',
    'none'
]);
const RouteTargetSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    kind: RouteTargetKindSchema,
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().nullable(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().nullable(),
    confidence: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0).max(1)
});
const AssistantRouteSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    mode: AssistantModeSchema,
    intent: AssistantIntentSchema,
    explicitness: ExplicitnessSchema,
    target: RouteTargetSchema,
    detectedNegation: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    referencesPendingAction: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    /** Named facts the turn is missing before an action could safely run. */ missingContext: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(10),
    /** Tool RISK groups the conductor may use this turn (see tool-groups.ts). */ allowedToolGroups: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).max(12),
    requiresApproval: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    confidence: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0).max(1),
    /** Short, log-safe classification rationale. Never chain-of-thought. */ auditSummary: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(400),
    /** Which layer produced this route, for observability. */ source: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'deterministic',
        'llm',
        'downgraded',
        'fallback'
    ])
});
function fallbackRoute(reason) {
    return {
        mode: 'ask',
        intent: 'unknown',
        explicitness: 'ambiguous',
        target: {
            kind: 'none',
            id: null,
            name: null,
            confidence: 0
        },
        detectedNegation: false,
        referencesPendingAction: false,
        missingContext: [],
        allowedToolGroups: [],
        requiresApproval: false,
        confidence: 0,
        auditSummary: `fallback: ${reason}`.slice(0, 400),
        source: 'fallback'
    };
}
}),
"[project]/features/assistant/runtime/routing/command-parser.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic command parser (EN + FR).
//
// Turns a raw user turn into primitive linguistic SIGNALS — negation, question,
// hypothetical, explicit action verb, pronoun-run, read/open, field-edit — that
// classify.ts combines into an AssistantRoute. The guiding rule (principle #2):
// detecting an ACTION is about verbs and sentence shape, never about a workflow
// name. Target resolution lives in workflow-targets.ts.
//
// Precedence enforced by the classifier: negation > information-question >
// hypothetical > explicit-action > read/open > mention-only.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "detectExplicitAction",
    ()=>detectExplicitAction,
    "detectNegation",
    ()=>detectNegation,
    "detectPronounRun",
    ()=>detectPronounRun,
    "isHypothetical",
    ()=>isHypothetical,
    "isInformationQuestion",
    ()=>isInformationQuestion,
    "isPoliteRequest",
    ()=>isPoliteRequest,
    "neutralizeNounRun",
    ()=>neutralizeNounRun,
    "parseSlashCommand",
    ()=>parseSlashCommand,
    "stripQuotedAndReported",
    ()=>stripQuotedAndReported
]);
// Reported-speech frames — content after these is quoted DATA, not a user command.
const REPORTING_FRAME = /\b(?:the\s+)?(?:document|documents|memo|email|e-mail|attachment|note|file|pdf|message|letter|report|it|they|client|user)\s+(?:say|says|said|reads?|read|states?|stated|mention[s]?|mentioned|noted?|notes|writes?|wrote|asks?|asked|instructs?|instructed)\b/i;
function stripQuotedAndReported(text) {
    let s = text;
    s = s.replace(/"""[\s\S]*?"""/g, ' ');
    s = s.replace(/"[^"]*"/g, ' ');
    s = s.replace(/[“][^”]*[”]/g, ' '); // “ … ”
    s = s.replace(/«[^»]*»/g, ' ');
    const m = s.match(REPORTING_FRAME);
    if (m && m.index !== undefined) s = s.slice(0, m.index);
    return s.trim();
}
function neutralizeNounRun(text) {
    return text.replace(/\b(the|this|that|a|an|my|our|its|current|last|previous|latest|fapi|roulement|rollover|expense|campaign)\s+runs?\b/gi, '$1 _run_');
}
function parseSlashCommand(text) {
    const m = text.trim().match(/^\/([a-zA-Z][\w-]*)\s*([\s\S]*)$/);
    if (!m) return null;
    return {
        command: m[1].toLowerCase(),
        args: m[2].trim()
    };
}
// ── Phrase banks ───────────────────────────────────────────────────────────────
// Each verb group lists whole-word triggers. Order within a group is irrelevant;
// the classifier resolves cross-group precedence.
const VERB_GROUPS = {
    start: [
        'start',
        'run',
        'launch',
        'execute',
        'begin',
        'kick off',
        'kickoff',
        'fire up',
        'spin up',
        'initiate',
        'démarre',
        'démarrer',
        'démarrez',
        'lance',
        'lancer',
        'lancez',
        'exécute',
        'exécuter',
        'exécutez',
        'commence',
        'commencer',
        'lancons',
        'lançons'
    ],
    continue: [
        'continue',
        'resume',
        'proceed',
        'keep going',
        'carry on',
        'pick up',
        'go on',
        'continuer',
        'continue',
        'reprends',
        'reprendre',
        'reprenez',
        'poursuis',
        'poursuivre'
    ],
    pause: [
        'pause',
        'hold',
        'suspend',
        'freeze',
        'suspends',
        'suspendre',
        'mets en pause',
        'mettre en pause'
    ],
    cancel: [
        'cancel',
        'abort',
        'kill',
        'discard',
        'scrap',
        'throw away',
        'delete the run',
        'annule',
        'annuler',
        'abandonne',
        'abandonner',
        'supprime le',
        'arrête le',
        'arrêter le'
    ],
    calculate: [
        'calculate',
        'compute',
        'recalculate',
        'recompute',
        'tally',
        'tabulate',
        'work out',
        'calcule',
        'calculer',
        'calculez',
        'recalcule',
        'recalculer',
        'chiffre',
        'chiffrer'
    ],
    approve: [
        'approve',
        'accept',
        'sign off',
        'sign-off',
        'confirm',
        'authorize',
        'authorise',
        'approuve',
        'approuver',
        'accepte',
        'accepter',
        'valide',
        'valider',
        'confirme',
        'confirmer',
        'autorise'
    ],
    reject: [
        'reject',
        'decline',
        'deny',
        'refuse',
        'turn down',
        'rejette',
        'rejeter',
        'refuse',
        'refuser',
        'décline',
        'décliner'
    ],
    finalize: [
        'finalize',
        'finalise',
        'lock',
        'apply',
        'publish',
        'submit',
        'commit',
        'seal',
        'freeze the worksheet',
        'finalise',
        'finaliser',
        'verrouille',
        'verrouiller',
        'applique',
        'appliquer',
        'publie',
        'publier',
        'soumets',
        'soumettre'
    ],
    open: [
        'open',
        'show',
        'display',
        'view',
        'pull up',
        'bring up',
        'reopen',
        're-open',
        'take me to',
        'go to',
        'ouvre',
        'ouvrir',
        'montre',
        'montrer',
        'affiche',
        'afficher',
        'voir',
        'accède',
        'accéder'
    ],
    edit: [
        'change',
        'set',
        'update',
        'edit',
        'adjust',
        'modify',
        'override',
        'use',
        'change',
        'modifie',
        'modifier',
        'mets',
        'mettre',
        'ajuste',
        'ajuster',
        'remplace',
        'remplacer',
        'utilise'
    ]
};
const NEGATION_PATTERNS = [
    /\bonly (want to )?(explain|understand|see|look|know|review|read)\b/i,
    /\bjust (want to )?(explain|understand|see|look|know|review|read)\b/i,
    /\bi (just|only) want to understand\b/i,
    /\bfor now\b.*\b(understand|explain|see|know)\b/i,
    /\b(understand|explain|see|know)\b.*\bfor now\b/i,
    /\bnot yet\b/i,
    /\bnot now\b/i,
    /\bdon'?t (run|start|launch|execute|begin|do)\b/i,
    /\bdo not (run|start|launch|execute|begin|do)\b/i,
    /\bno need to (run|start|launch|execute)\b/i,
    /\bwithout (running|starting|executing|launching)\b/i,
    /\b(instead of|rather than) (running|starting|executing)\b/i,
    /\bhold off\b/i,
    /\bnever mind\b/i,
    // FR
    /\bne (lance|démarre|exécute|fais)\b.*\bpas\b/i,
    /\bn'(exécute|execute)\b.*\bpas\b/i,
    /\bpas encore\b/i,
    /\bpas maintenant\b/i,
    /\bjuste (comprendre|expliquer|voir|savoir)\b/i,
    /\bseulement (comprendre|expliquer|voir)\b/i,
    /\bsans (lancer|démarrer|exécuter)\b/i,
    /\bpas besoin de (lancer|démarrer|exécuter)\b/i
];
const HYPOTHETICAL_PATTERNS = [
    /\bwhat if\b/i,
    /\bif the\b.*\bwere\b/i,
    /\bif we (were|had|used)\b/i,
    /\bhow would\b/i,
    /\bwould (it|the|that|this|net|gross)\b/i,
    /\bcould we\b/i,
    /\bmight (have|be|need)\b/i,
    /\bmay have\b/i,
    /\bmaybe\b/i,
    /\bperhaps\b/i,
    /\bsuppose\b/i,
    /\bhypothetical/i,
    /\broughly\b/i,
    /\bapproximate/i,
    /\bballpark\b/i,
    /\bi(?:'m| am) (thinking|considering)\b/i,
    /\bi think\b/i,
    /\bwe (may|might)\b/i,
    // FR
    /\bet si\b/i,
    /\bsi (le|la|les|on|nous)\b.*\b(était|avait|étaient)\b/i,
    /\bpourrait\b/i,
    /\bpeut-être\b/i,
    /\bà peu près\b/i,
    /\benviron\b/i,
    /\bje (pense|considère)\b/i,
    /\bon pourrait\b/i,
    /\bil se peut\b/i
];
// Information-seeking (explanation) verbs → the turn is a QUESTION, never execute.
const EXPLANATION_PATTERNS = [
    /\bexplain\b/i,
    /\bdescribe\b/i,
    /\bwalk me through\b/i,
    /\btell me about\b/i,
    /\bwhat (is|are|does|do|'s|s)\b/i,
    /\bwhat inputs?\b/i,
    /\bhow (does|do|is|are|can i|would i|to)\b/i,
    /\bwhy (is|are|does|do|did)\b/i,
    /\bwhich\b/i,
    /\bwhen (does|do|is)\b/i,
    /\bclarify\b/i,
    /\bremind me\b/i,
    /\bwhat'?s wrong\b/i,
    // FR
    /\bexplique/i,
    /\bdécris/i,
    /\bc'est quoi\b/i,
    /\bqu'est-ce (que|qu')\b/i,
    /\bqu'est ce que\b/i,
    /\bcomment (fonctionne|marche|ça|faire|est-ce)\b/i,
    /\bpourquoi\b/i,
    /\bquel(le|s|les)?\b/i
];
// Note: bare "do"/"does" are intentionally excluded — "Do it." is a command, not a
// question. Genuine "do you / does the …?" questions still resolve via the trailing
// "?" rule and the EXPLANATION patterns ("what does", "how do").
const INTERROGATIVE_START = /^(what|what's|whats|how|why|which|who|when|where|is|are|can i|should i|qu'est|quoi|comment|pourquoi|quel|quelle|quels|quelles|qui|quand|où|est-ce)\b/i;
// "can you / could you / please …" — polite. It's a QUESTION only if paired with an
// explanation verb; paired with an action verb it's a polite command.
const POLITE_PREFIX = /^(can|could|would|will) you\b|^please\b|^could you please\b|^peux-tu\b|^pouvez-vous\b|^pourriez-vous\b|^peux tu\b/i;
const PRONOUN_RUN_PATTERNS = [
    /^\s*(yes[,!.]?\s*)?(run|do|start|launch|execute|proceed|continue|go)\s+it\b/i,
    /^\s*(yes[,!.]?\s*)?go ahead\b/i,
    /^\s*let'?s (do|run|start|go) (it|ahead)\b/i,
    /^\s*(yes[,!.]?\s*)?proceed\b/i,
    // FR: require the hyphenated object-pronoun form ("lance-le", "démarre-le") so a
    // bare article ("démarre le calcul …") is NOT mistaken for a pronoun-run.
    /^\s*(oui[,!.]?\s*)?(lance|fais|démarre|exécute|continue)-(le|la|ça)\b/i,
    /^\s*vas-y\b/i
];
function anyMatch(text, patterns) {
    return patterns.some((re)=>re.test(text));
}
/** Whole-word (accent-aware) membership test for a verb phrase. */ function containsPhrase(text, phrase) {
    const p = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?:^|[^a-zà-ÿ0-9])${p}(?:$|[^a-zà-ÿ0-9])`, 'i');
    return re.test(text);
}
function detectNegation(text) {
    return anyMatch(text, NEGATION_PATTERNS);
}
function isHypothetical(text) {
    return anyMatch(text, HYPOTHETICAL_PATTERNS);
}
function isInformationQuestion(text) {
    const t = text.trim();
    const explanation = anyMatch(t, EXPLANATION_PATTERNS);
    if (explanation) return true;
    if (POLITE_PREFIX.test(t)) {
        // Polite request: a question only if it's asking to explain/describe, not to act.
        return anyMatch(t, EXPLANATION_PATTERNS);
    }
    if (INTERROGATIVE_START.test(t)) return true;
    // A trailing '?' makes it a question UNLESS it opens with a bare execution verb.
    if (/\?\s*$/.test(t) && !startsWithExecutionVerb(t)) return true;
    return false;
}
function startsWithExecutionVerb(text) {
    const t = text.trim().toLowerCase();
    const execGroups = [
        'start',
        'continue',
        'pause',
        'cancel',
        'calculate',
        'approve',
        'reject',
        'finalize'
    ];
    return execGroups.some((g)=>VERB_GROUPS[g].some((v)=>t.startsWith(v + ' ') || t === v));
}
function detectPronounRun(text) {
    return anyMatch(text, PRONOUN_RUN_PATTERNS);
}
function detectExplicitAction(text) {
    const t = ` ${text.toLowerCase()} `;
    const order = [
        'cancel',
        'pause',
        'continue',
        'finalize',
        'approve',
        'reject',
        'calculate',
        'start',
        'edit',
        'open'
    ];
    for (const group of order){
        for (const verb of VERB_GROUPS[group]){
            if (containsPhrase(t, verb)) return {
                verb,
                group
            };
        }
    }
    return null;
}
function isPoliteRequest(text) {
    return POLITE_PREFIX.test(text.trim());
}
}),
"[project]/features/assistant/runtime/routing/workflow-targets.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Workflow TARGET resolution — "which workflow is this text about?"
//
// Deliberately separate from action detection (command-parser.ts): resolving a
// target NEVER implies the user wants to run it. Ids mirror the keys of
// WORKFLOW_CONFIGS (lib/workflow-runs/index.ts): fapi | roulement | expense |
// campaign. Kept as a static table (no engine import) so the classifier stays
// light and the eval harness runs standalone under tsx.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "WORKFLOW_TARGETS",
    ()=>WORKFLOW_TARGETS,
    "resolveWorkflowTarget",
    ()=>resolveWorkflowTarget
]);
const WORKFLOW_TARGETS = [
    {
        id: 'fapi',
        name: 'FAPI',
        aliases: [
            'fapi',
            'foreign accrual property income',
            'revenu étranger accumulé',
            'reaimp',
            'reatb'
        ]
    },
    {
        id: 'roulement',
        name: 'Roulement fiscal (art. 85)',
        aliases: [
            'roulement',
            'rollover',
            'roll over',
            'article 85',
            'art. 85',
            'art 85',
            'section 85',
            's. 85',
            't2057',
            'election 85',
            'élection 85'
        ]
    },
    {
        id: 'expense',
        name: 'Expense reimbursement',
        aliases: [
            'expense',
            'expense report',
            'expense reimbursement',
            'employee expense',
            'reimbursement',
            'remboursement',
            'note de frais',
            'dépenses',
            'per diem',
            'per-diem'
        ]
    },
    {
        id: 'campaign',
        name: 'Campaign budget allocation',
        aliases: [
            'campaign',
            'campaign budget',
            'marketing budget',
            'budget marketing',
            'budget de campagne',
            'channel spend',
            'allocation budget'
        ]
    }
];
/** Escape a literal for use inside a RegExp. */ function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
/**
 * A word-ish boundary match so "expense" hits in "run the expense report" but
 * "fapi" does NOT hit inside an unrelated longer token. Handles the "art. 85"
 * style aliases (which contain punctuation) by anchoring on non-alphanumerics.
 */ function aliasHits(haystack, alias) {
    const a = escapeRegExp(alias);
    const re = new RegExp(`(?:^|[^a-z0-9])${a}(?:$|[^a-z0-9])`, 'i');
    return re.test(haystack);
}
/** Extract a 20xx / 19xx fiscal year, if present. */ function extractYear(text) {
    const m = text.match(/\b(19|20)\d{2}\b/);
    if (!m) return null;
    const y = Number(m[0]);
    return Number.isFinite(y) ? y : null;
}
/** Very light "for <Name>" / "pour <Name>" capture — just enough to know scope was named. */ function extractClientName(original) {
    const m = original.match(/\b(?:for|pour)\s+([A-ZÀ-Ý][\w&.'-]*(?:\s+[A-ZÀ-Ý][\w&.'-]*){0,3})/);
    return m ? m[1].trim() : null;
}
function resolveWorkflowTarget(original) {
    const text = ` ${original.toLowerCase()} `;
    const matched = [];
    for (const t of WORKFLOW_TARGETS){
        if (t.aliases.some((a)=>aliasHits(text, a))) matched.push(t.id);
    }
    const ambiguous = matched.length > 1;
    const id = matched.length >= 1 ? matched[0] : null;
    const name = id ? WORKFLOW_TARGETS.find((t)=>t.id === id)?.name ?? null : null;
    return {
        id: ambiguous ? null : id,
        name: ambiguous ? null : name,
        matchedIds: matched,
        ambiguous,
        // One clean match → high confidence; none → 0; several → 0 (ambiguous, caller asks).
        confidence: matched.length === 1 ? 0.95 : 0,
        fiscalYear: extractYear(original),
        clientName: extractClientName(original)
    };
}
}),
"[project]/features/assistant/runtime/routing/tool-groups.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Tool RISK groups + mode policy.
//
// Maps the app's real CopilotKit action names (registered in use-assistant.tsx and
// builder-copilot.tsx) to risk groups, and declares which groups the conductor may
// use in each mode. The gate uses this to compute the DENY set for a turn.
//
// Design bias: keep read / navigation / answer / propose tools available almost
// always; only the genuinely state-starting tools (`runWorkflow`) and destructive
// builder-mutation tools are withheld on non-execute turns. That is the smallest
// intervention that stops "a mention starts a workflow" without degrading the
// assistant's ability to explain, open, search, or show an inline value.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "MODE_DENIED_GROUPS",
    ()=>MODE_DENIED_GROUPS,
    "TOOL_GROUP_OF",
    ()=>TOOL_GROUP_OF,
    "deniedToolNames",
    ()=>deniedToolNames,
    "groupOfTool",
    ()=>groupOfTool
]);
const TOOL_GROUP_OF = {
    // execute
    runWorkflow: 'execute',
    runBuilderWorkflow: 'execute',
    // builder_mutate
    addBlock: 'builder_mutate',
    connectBlocks: 'builder_mutate',
    deleteBlock: 'builder_mutate',
    editBlockConfig: 'builder_mutate',
    renameWorkflow: 'builder_mutate',
    saveWorkflow: 'builder_mutate',
    loadWorkflow: 'builder_mutate',
    // field_edit
    editField: 'field_edit',
    // page_command
    commandPage: 'page_command',
    // generate_ui
    generateUI: 'generate_ui',
    // read_nav
    openPage: 'read_nav',
    focusAnchor: 'read_nav',
    closePage: 'read_nav',
    closeAll: 'read_nav',
    openWorkflowBuilder: 'read_nav',
    showWorkflowElement: 'read_nav',
    bringIntoChat: 'read_nav',
    explainWorksheetLine: 'read_nav',
    whyWorksheetValue: 'read_nav',
    searchWorksheet: 'read_nav',
    focusBlock: 'read_nav',
    listBlocks: 'read_nav',
    checkHealth: 'read_nav'
};
function groupOfTool(name) {
    return TOOL_GROUP_OF[name] ?? 'unknown';
}
const MODE_DENIED_GROUPS = {
    ask: [
        'execute',
        'builder_mutate'
    ],
    propose: [
        'execute',
        'builder_mutate'
    ],
    execute: []
};
function deniedToolNames(availableToolNames, mode) {
    const denyGroups = new Set(MODE_DENIED_GROUPS[mode]);
    if (denyGroups.size === 0) return [];
    return availableToolNames.filter((n)=>denyGroups.has(groupOfTool(n)));
}
}),
"[project]/features/assistant/runtime/routing/classify.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic classifier — turns one user turn into an AssistantRoute.
//
// This is the ENFORCED routing layer (the LLM router in intent-router.ts is an
// optional escalation, not in the hot path). It is pure, synchronous, and fully
// unit-testable offline (see evals/). Precedence, per principle #2 and §13.4:
//
//   slash-command > negation > information-question > hypothetical >
//   pronoun-run("run it") > explicit-action-verb > mention-only > general
//
// A workflow NAME only ever sets the target; it never, by itself, produces an
// execute route.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "classifyDeterministic",
    ()=>classifyDeterministic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$route$2d$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/runtime/routing/route-schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$command$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/runtime/routing/command-parser.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$workflow$2d$targets$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/runtime/routing/workflow-targets.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$tool$2d$groups$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/runtime/routing/tool-groups.ts [app-route] (ecmascript)");
;
;
;
;
const ALL_GROUPS = [
    'read_nav',
    'field_edit',
    'generate_ui',
    'page_command',
    'execute',
    'builder_mutate'
];
function allowedGroupsFor(mode) {
    const denied = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$tool$2d$groups$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MODE_DENIED_GROUPS"][mode]);
    return ALL_GROUPS.filter((g)=>!denied.has(g));
}
function workflowTargetFrom(res) {
    return {
        kind: 'workflow',
        id: res.id,
        name: res.name,
        confidence: res.confidence
    };
}
const NO_TARGET = {
    kind: 'none',
    id: null,
    name: null,
    confidence: 0
};
function build(mode, intent, explicitness, target, opts) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$route$2d$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AssistantRouteSchema"].parse({
        mode,
        intent,
        explicitness,
        target,
        detectedNegation: opts.negation ?? false,
        referencesPendingAction: opts.pending ?? false,
        missingContext: opts.missing ?? [],
        allowedToolGroups: allowedGroupsFor(mode),
        requiresApproval: opts.requiresApproval ?? false,
        confidence: opts.confidence,
        auditSummary: opts.audit,
        source: 'deterministic'
    });
}
const LIFECYCLE_INTENT = {
    start: 'start_workflow',
    continue: 'continue_workflow',
    pause: 'pause_workflow',
    cancel: 'cancel_workflow'
};
function looksLikeCalcInspection(text) {
    return /\b(calcul|calculation|math|number|figure|result|total|amount|montant|chiffre|résultat)\b/i.test(text);
}
/** Map a slash command to a route. A typed command is treated as an explicit action. */ function classifySlash(command, args, target) {
    const t = workflowTargetFrom(target);
    switch(command){
        case 'run':
        case 'start':
        case 'launch':
        case 'execute':
            if (target.ambiguous) {
                return build('propose', 'start_workflow', 'explicit_action', NO_TARGET, {
                    missing: [
                        'workflow_target'
                    ],
                    confidence: 0.6,
                    audit: `slash /${command} but multiple workflows matched`
                });
            }
            if (!target.id) {
                return build('propose', 'start_workflow', 'explicit_action', NO_TARGET, {
                    missing: [
                        'workflow_target'
                    ],
                    confidence: 0.6,
                    audit: `slash /${command} without a resolvable workflow`
                });
            }
            return build('execute', 'start_workflow', 'explicit_action', t, {
                confidence: 0.98,
                audit: `slash /${command} → start ${target.id}`
            });
        case 'explain':
        case 'help':
        case 'what':
            return build('ask', target.id ? 'explain_workflow' : 'answer_question', 'explicit_action', t, {
                confidence: 0.95,
                audit: `slash /${command} → explain`
            });
        case 'open':
        case 'show':
            return build('ask', 'open_page', 'explicit_action', t, {
                confidence: 0.9,
                audit: `slash /${command} → open`
            });
        default:
            // Unknown slash command → don't restrict; let the model handle it.
            return build('ask', 'unknown', 'ambiguous', t, {
                confidence: 0.3,
                audit: `unknown slash /${command}`
            });
    }
}
function classifyDeterministic(ctx) {
    const text = (ctx.text ?? '').trim();
    if (!text) {
        return build('ask', 'general_conversation', 'ambiguous', NO_TARGET, {
            confidence: 0.4,
            audit: 'empty message'
        });
    }
    const target = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$workflow$2d$targets$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveWorkflowTarget"])(text);
    const targetRoute = workflowTargetFrom(target);
    const mentionsWorkflow = target.matchedIds.length > 0;
    // 1. Slash command — a typed command has the highest authority.
    const slash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$command$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSlashCommand"])(text);
    if (slash) return classifySlash(slash.command, slash.args, target);
    const negation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$command$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectNegation"])(text);
    const question = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$command$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isInformationQuestion"])(text);
    const hypo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$command$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isHypothetical"])(text);
    // Action + pronoun-run are detected on the DE-QUOTED text so an imperative that
    // only appears inside quoted/reported content cannot be read as a command; and
    // with noun-"run" neutralized so "the FAPI run" is not read as "run".
    const actionText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$command$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["neutralizeNounRun"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$command$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stripQuotedAndReported"])(text));
    const pronounRun = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$command$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectPronounRun"])(actionText);
    const action = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$command$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectExplicitAction"])(actionText);
    // 2. Negation — blocks execution outright (§13.4). Answer/explain instead.
    if (negation) {
        const intent = ctx.hasPendingProposal ? 'cancel_pending_action' : mentionsWorkflow ? 'explain_workflow' : 'answer_question';
        return build('ask', intent, 'mention_only', mentionsWorkflow ? targetRoute : NO_TARGET, {
            negation: true,
            pending: ctx.hasPendingProposal,
            confidence: 0.9,
            audit: `negation present → ask (${intent})`
        });
    }
    // 3. Information question — explain/inspect/answer. Never execute.
    if (question) {
        const intent = mentionsWorkflow ? 'explain_workflow' : looksLikeCalcInspection(text) ? 'inspect_calculation' : 'answer_question';
        return build('ask', intent, 'mention_only', mentionsWorkflow ? targetRoute : NO_TARGET, {
            confidence: 0.9,
            audit: `information question → ask (${intent})`
        });
    }
    // 4. Hypothetical — "what if…", "roughly…". Ask/propose, clearly non-official.
    if (hypo) {
        const isCalc = action?.group === 'calculate' || looksLikeCalcInspection(text);
        return build(isCalc ? 'propose' : 'ask', isCalc ? 'run_calculation' : mentionsWorkflow ? 'explain_workflow' : 'answer_question', 'hypothetical', mentionsWorkflow ? targetRoute : NO_TARGET, {
            confidence: 0.85,
            audit: `hypothetical → ${isCalc ? 'propose non-official calc' : 'ask'}`
        });
    }
    // 5. "Run it" / "go ahead" — only executes against a single unambiguous pending
    //    action or an active run; otherwise it is a safe proposal (ask which).
    if (pronounRun) {
        if (ctx.hasPendingProposal || ctx.hasActiveRun) {
            const intent = ctx.hasActiveRun && !ctx.hasPendingProposal ? 'continue_workflow' : 'start_workflow';
            return build('execute', intent, 'explicit_action', NO_TARGET, {
                pending: true,
                confidence: 0.85,
                audit: `pronoun-run resolved against pending/active`
            });
        }
        return build('propose', 'start_workflow', 'ambiguous', NO_TARGET, {
            missing: [
                'pending_action'
            ],
            confidence: 0.6,
            audit: `pronoun-run with nothing pending → propose`
        });
    }
    // 6. Explicit action verb.
    if (action) {
        return classifyAction(action.group, text, target, targetRoute, mentionsWorkflow, ctx);
    }
    // 7. Workflow mentioned, no action → explain (mention ≠ command).
    if (mentionsWorkflow) {
        const first = target.matchedIds[0];
        const name = target.name ?? first;
        return build('ask', 'explain_workflow', 'mention_only', {
            kind: 'workflow',
            id: target.ambiguous ? null : first,
            name,
            confidence: 0.7
        }, {
            confidence: 0.75,
            audit: `workflow mentioned, no action verb → ask/explain`
        });
    }
    // 8. Nothing actionable → general conversation.
    return build('ask', 'general_conversation', 'ambiguous', NO_TARGET, {
        confidence: 0.5,
        audit: `no action/target signals → general`
    });
}
function classifyAction(group, text, target, targetRoute, mentionsWorkflow, ctx) {
    const explicitness = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$command$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPoliteRequest"])(text) ? 'implicit_request' : 'explicit_action';
    // Read/open → ASK read. Opening/showing is never an execute.
    if (group === 'open') {
        return build('ask', mentionsWorkflow ? 'open_artifact' : 'open_page', explicitness, mentionsWorkflow ? targetRoute : NO_TARGET, {
            confidence: 0.85,
            audit: `open/show → ask read`
        });
    }
    // Field edit → PROPOSE (reversible inline change, not a run).
    if (group === 'edit') {
        return build('propose', 'edit_field', explicitness, mentionsWorkflow ? targetRoute : NO_TARGET, {
            confidence: 0.8,
            audit: `edit/set value → propose edit_field`
        });
    }
    // Finalize / lock / apply / publish → PROPOSE + approval (protected change).
    if (group === 'finalize') {
        return build('propose', 'modify_protected_value', explicitness, mentionsWorkflow ? targetRoute : NO_TARGET, {
            requiresApproval: true,
            confidence: 0.8,
            audit: `finalize/protected change → propose + approval`
        });
    }
    // Approve / reject → only meaningful against a pending action.
    if (group === 'approve' || group === 'reject') {
        const intent = group === 'approve' ? 'approve_action' : 'reject_action';
        if (ctx.hasPendingProposal || ctx.hasActiveRun) {
            return build('execute', intent, explicitness, NO_TARGET, {
                pending: true,
                confidence: 0.85,
                audit: `${group} against pending/active`
            });
        }
        return build('ask', intent, 'mention_only', NO_TARGET, {
            missing: [
                'pending_action'
            ],
            confidence: 0.6,
            audit: `${group} but nothing pending → ask`
        });
    }
    // Calculate — in this app the runnable unit IS the workflow, so a calculate verb
    // with a resolved workflow behaves like start. Without a workflow it's a
    // (rare) standalone calc request; still explicit, still execute-mode.
    if (group === 'calculate') {
        if (target.ambiguous) {
            return build('propose', 'run_calculation', explicitness, NO_TARGET, {
                missing: [
                    'workflow_target'
                ],
                confidence: 0.6,
                audit: `calculate but multiple workflows matched → propose`
            });
        }
        return build('execute', 'run_calculation', explicitness, mentionsWorkflow ? targetRoute : NO_TARGET, {
            confidence: 0.9,
            audit: `calculate → execute (workflow ${target.id ?? 'n/a'})`
        });
    }
    // Lifecycle verbs: start / continue / pause / cancel.
    const intent = LIFECYCLE_INTENT[group];
    if (target.ambiguous) {
        return build('propose', intent, explicitness, NO_TARGET, {
            missing: [
                'workflow_target'
            ],
            confidence: 0.6,
            audit: `${group} but multiple workflows matched → propose (ask which)`
        });
    }
    if (!target.id) {
        // Execution verb, no named workflow. Continue can resolve against an active run.
        if (group === 'continue' && ctx.hasActiveRun) {
            return build('execute', 'continue_workflow', explicitness, NO_TARGET, {
                pending: true,
                confidence: 0.8,
                audit: `continue against active run`
            });
        }
        return build('propose', intent, explicitness, NO_TARGET, {
            missing: [
                'workflow_target'
            ],
            confidence: 0.6,
            audit: `${group} without a resolvable workflow → propose`
        });
    }
    return build('execute', intent, explicitness, targetRoute, {
        confidence: 0.95,
        audit: `${group} ${target.id} → execute`
    });
}
}),
"[project]/features/assistant/runtime/routing/route-policy.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Route policy — deterministic safety thresholds applied AFTER classification.
//
// The classifier is already conservative; this is the final guard that makes
// "ambiguity fails safe" (principle #5) a property of the CODE, not the prompt.
// It can only ever make a route SAFER (execute → propose/ask), never escalate.
//
// Thresholds live here (not scattered) so they can be tuned with the eval set.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "EXECUTE_CONFIDENCE_THRESHOLD",
    ()=>EXECUTE_CONFIDENCE_THRESHOLD,
    "applyRoutePolicy",
    ()=>applyRoutePolicy
]);
const EXECUTE_CONFIDENCE_THRESHOLD = 0.85;
function applyRoutePolicy(route, ctx = {}) {
    if (route.mode !== 'execute') return route;
    // An explicit clicked UI control is trusted regardless of language confidence.
    if (ctx.explicitUiAction) return route;
    const reasons = [];
    // Negation must never co-exist with execute.
    if (route.detectedNegation) reasons.push('negation');
    // A workflow-lifecycle execute needs a resolved, unambiguous target.
    const needsTarget = route.intent === 'start_workflow' || route.intent === 'pause_workflow' || route.intent === 'cancel_workflow';
    if (needsTarget && route.target.kind === 'workflow' && !route.target.id && !route.referencesPendingAction) {
        reasons.push('missing_or_ambiguous_target');
    }
    // Low-confidence natural-language execute (explicit slash commands are ~0.98).
    if (route.explicitness !== 'explicit_action' && route.confidence < EXECUTE_CONFIDENCE_THRESHOLD) {
        reasons.push('low_confidence');
    }
    if (reasons.length === 0) return route;
    const missing = route.missingContext.slice();
    if (reasons.includes('missing_or_ambiguous_target') && !missing.includes('workflow_target')) {
        missing.push('workflow_target');
    }
    return {
        ...route,
        // Negation drops all the way to ask; other doubts drop to propose.
        mode: reasons.includes('negation') ? 'ask' : 'propose',
        missingContext: missing,
        allowedToolGroups: route.allowedToolGroups.filter((g)=>g !== 'execute' && g !== 'builder_mutate'),
        source: 'downgraded',
        auditSummary: `downgraded (${reasons.join(', ')}): ${route.auditSummary}`.slice(0, 400)
    };
}
}),
"[project]/features/assistant/runtime/routing/gate.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// The intent gate — the enforced layer wired into the CopilotKit runtime.
//
// Split into two pure functions so the analysis is decoupled from the ag-ui types
// and easy to test:
//   • computeGateDecision(input, opts) — reads the turn (messages/tools/context),
//     classifies it, and returns PRIMITIVES: which tool names to withhold and an
//     optional routing directive (+ the message index to append it to).
//   • applyGateDecision(messages, tools, decision) — applies those primitives while
//     preserving the caller's concrete element types.
//
// Both are SYNCHRONOUS (the middleware must return an Observable synchronously) and
// the decision is FAIL-OPEN: any doubt or error → withhold nothing, inject nothing,
// so the chat is never worse than before this feature.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "applyGateDecision",
    ()=>applyGateDecision,
    "classifyTurn",
    ()=>classifyTurn,
    "computeGateDecision",
    ()=>computeGateDecision,
    "decideEnforcement",
    ()=>decideEnforcement
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$classify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/runtime/routing/classify.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$route$2d$policy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/runtime/routing/route-policy.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$tool$2d$groups$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/runtime/routing/tool-groups.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$route$2d$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/runtime/routing/route-schema.ts [app-route] (ecmascript)");
;
;
;
;
/** Below this confidence the gate never restricts — it fails open to current behavior. */ const RESTRICT_MIN_CONFIDENCE = 0.7;
const DIRECTIVE_TAG = '[assistant-routing]';
function toStr(v) {
    return typeof v === 'string' ? v : null;
}
/** The current user turn = the last message, only if it's a user message with text. */ function currentUserText(messages) {
    if (messages.length === 0) return null;
    const last = messages[messages.length - 1];
    if (last?.role !== 'user') return null; // mid tool-loop or assistant turn → don't gate
    const text = toStr(last.content);
    if (!text || !text.trim()) return null;
    return {
        index: messages.length - 1,
        text
    };
}
/** Best-effort read of whether a live run exists, from the readable context. */ function contextSignals(context) {
    let hasActiveRun = false;
    if (context) {
        for (const c of context){
            const desc = toStr(c.description)?.toLowerCase() ?? '';
            const val = toStr(c.value);
            if (desc.includes('active') && desc.includes('run') && val && val !== 'null' && val !== '{}' && val.length > 4) {
                hasActiveRun = true;
            }
        }
    }
    // Pending-proposal detection needs client proposal state; conservatively false
    // (so "run it" fails safe to a proposal rather than executing on nothing).
    return {
        hasActiveRun,
        hasPendingProposal: false
    };
}
function verbForIntent(route) {
    switch(route.intent){
        case 'continue_workflow':
            return 'continue';
        case 'pause_workflow':
            return 'pause';
        case 'cancel_workflow':
            return 'cancel';
        case 'run_calculation':
            return 'run the calculation for';
        default:
            return 'start';
    }
}
function executeDirective(route) {
    if (route.target.kind === 'workflow' && route.target.id) {
        return `${DIRECTIVE_TAG} The user is explicitly asking to ${verbForIntent(route)} the "${route.target.id}"${route.target.name ? ` (${route.target.name})` : ''} workflow. Call runWorkflow with workflowId "${route.target.id}" — do not merely describe it.`;
    }
    return null;
}
function restrictDirective() {
    return `${DIRECTIVE_TAG} This turn is a question or a mention, not a command. Answer or explain; do NOT start, run, finalize, or modify any workflow or protected value this turn.`;
}
const INERT = {
    withheldToolNames: [],
    directive: null,
    directiveIndex: null
};
function classifyTurn(input) {
    try {
        const messages = input.messages ?? [];
        const turn = currentUserText(messages);
        if (!turn) return null;
        const signals = contextSignals(input.context);
        const route = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$route$2d$policy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["applyRoutePolicy"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$classify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["classifyDeterministic"])({
            text: turn.text,
            ...signals
        }));
        return {
            route,
            userIndex: turn.index
        };
    } catch  {
        return null;
    }
}
function decideEnforcement(route, userIndex, availableToolNames, opts) {
    const shouldRestrict = (route.mode === 'ask' || route.mode === 'propose') && route.confidence >= RESTRICT_MIN_CONFIDENCE && !route.referencesPendingAction;
    let withheld = [];
    if (shouldRestrict && availableToolNames.length > 0) {
        const denied = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$tool$2d$groups$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deniedToolNames"])(availableToolNames, route.mode);
        // Guard: never strip the whole tool set.
        if (denied.length > 0 && denied.length < availableToolNames.length) withheld = denied;
    }
    let directive = null;
    if (opts.directives) {
        if (route.mode === 'execute') directive = executeDirective(route);
        else if (withheld.length > 0) directive = restrictDirective();
    }
    return {
        withheldToolNames: withheld,
        directive,
        directiveIndex: directive ? userIndex : null
    };
}
function computeGateDecision(input, opts) {
    if (opts.mode === 'off') {
        return {
            route: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$route$2d$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fallbackRoute"])('gate off'),
            mode: opts.mode,
            ...INERT
        };
    }
    const turn = classifyTurn(input);
    if (!turn) return {
        route: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$route$2d$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fallbackRoute"])('not a fresh user turn'),
        mode: opts.mode,
        ...INERT
    };
    if (opts.mode === 'shadow') {
        return {
            route: turn.route,
            mode: opts.mode,
            ...INERT
        };
    }
    const availableNames = (input.tools ?? []).map((t)=>toStr(t.name)).filter((n)=>!!n);
    const enf = decideEnforcement(turn.route, turn.userIndex, availableNames, {
        directives: opts.directives
    });
    return {
        route: turn.route,
        mode: opts.mode,
        ...enf
    };
}
function applyGateDecision(messages, tools, decision) {
    let outTools = tools;
    if (decision.withheldToolNames.length > 0) {
        const filtered = tools.filter((t)=>{
            const n = t.name;
            return typeof n !== 'string' || !decision.withheldToolNames.includes(n);
        });
        if (filtered.length > 0) outTools = filtered; // final safety net: never strip all
    }
    let outMessages = messages;
    if (decision.directive && decision.directiveIndex != null && decision.directiveIndex < messages.length) {
        const idx = decision.directiveIndex;
        const dir = decision.directive;
        outMessages = messages.map((m, i)=>{
            if (i !== idx) return m;
            const base = typeof m.content === 'string' ? m.content : '';
            return {
                ...m,
                content: `${base}\n\n${dir}`
            };
        });
    }
    return {
        messages: outMessages,
        tools: outTools
    };
}
}),
"[project]/features/assistant/runtime/model-policy.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Model policy — pick the per-turn model tier from the route.
//
// "Smarter answers, cheaper navigation": use a stronger model for hard tax/analysis
// questions, a fast one for pure navigation, the standard chat model otherwise. The
// decision is driven by the AssistantRoute the intent layer already computes.
//
// SAFE BY DEFAULT: every tier defaults to the chat model, so this is a NO-OP until
// ASSISTANT_MODEL_FAST / ASSISTANT_MODEL_DEEP are set to distinct models. When a tier
// equals the baseline we return modelSpec=null (no override → the base model is used).
//
// CopilotKit's BuiltInAgent override (input.forwardedProps.model) resolves a
// PROVIDER-PREFIXED string ("openai/gpt-4o", "anthropic/claude-…"), so bare ids are
// normalized here.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "normalizeModelSpec",
    ()=>normalizeModelSpec,
    "pickModelDecision",
    ()=>pickModelDecision,
    "tierForRoute",
    ()=>tierForRoute
]);
function normalizeModelSpec(model) {
    const s = model.trim();
    if (!s) return s;
    if (s.includes('/') || s.includes(':')) return s; // already "provider/model"
    if (/^claude/i.test(s)) return `anthropic/${s}`;
    if (/^gemini/i.test(s) || s.startsWith('models/')) return `google/${s}`;
    return `openai/${s}`; // OpenAI-centric app default (gpt-*, o-series, etc.)
}
// Hard-reasoning intents get the strong model; navigation gets the fast model.
const DEEP_INTENTS = new Set([
    'explain_workflow',
    'inspect_calculation',
    'run_calculation',
    'search_evidence',
    'answer_question',
    'modify_protected_value',
    'find_workflow'
]);
const FAST_INTENTS = new Set([
    'open_page',
    'open_artifact',
    'edit_field',
    'general_conversation',
    'get_workflow_status',
    'cancel_pending_action',
    'approve_action',
    'reject_action',
    'create_ui_view'
]);
function tierForRoute(route) {
    if (DEEP_INTENTS.has(route.intent)) return 'deep';
    if (FAST_INTENTS.has(route.intent)) return 'fast';
    return 'standard';
}
function pickModelDecision(route, config) {
    const tier = tierForRoute(route);
    const chosen = tier === 'deep' ? config.deep : tier === 'fast' ? config.fast : config.conductor;
    const baseSpec = normalizeModelSpec(config.conductor.model);
    const chosenSpec = normalizeModelSpec(chosen.model);
    const modelSpec = chosenSpec === baseSpec ? null : chosenSpec;
    // Only attach reasoningEffort when explicitly enabled and we're actually overriding
    // to a (presumably reasoning-capable) deep model — otherwise leave it to the model.
    let providerOptions;
    if (config.reasoningEnabled && tier === 'deep' && modelSpec) {
        providerOptions = {
            openai: {
                reasoningEffort: chosen.reasoning
            }
        };
    }
    return {
        tier,
        modelSpec,
        providerOptions
    };
}
}),
"[project]/lib/agents.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/features/assistant/runtime/agents/specialists.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Specialists — "one assistant, many hats".
//
// The single conductor becomes the right domain specialist based on the route the
// intent layer already computed: a FAPI turn is answered as Sofi, a rollover as
// Théo, an expense report as Mira, a campaign budget as Nova. There is ONE agent
// loop and ONE conversation — the persona + domain expertise + the (already
// route-scoped) tools are what change. This is the recommended multi-agent shape:
// no competing independent agents, no separate memory.
//
// Pure + isomorphic (no server-only, no React): the server injects the persona into
// the model context (app/api/copilotkit/route.ts) and the client uses it to show
// who's working (components/assistant/specialist-presence.tsx).
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "SPECIALISTS",
    ()=>SPECIALISTS,
    "selectSpecialist",
    ()=>selectSpecialist,
    "specialistDirective",
    ()=>specialistDirective,
    "specialistForWorkflow",
    ()=>specialistForWorkflow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/agents.ts [app-route] (ecmascript)");
;
// Domain expertise per specialist — kept concise and factual (the workspace's real
// domain), keyed by the workflow id each agent owns.
const EXPERTISE = {
    fapi: 'You specialize in FAPI (foreign accrual property income) for controlled foreign affiliates: classifying trial-balance rows into income/expense buckets, the FAPI line build (A, EXPENSES, the 95(2) amount, A.1/A.2/C–H, FAT), the P-coefficient, the FX rate and CAD conversion, and the reviewed net FAPI. You can explain what inputs a FAPI run needs and read results from the run or worksheet.',
    roulement: 'You specialize in the section 85 rollover (roulement fiscal, art. 85): classifying the transferred property, computing the elected-amount bounds between the PBR (tax cost) floor and the FMV/JVM ceiling, the resulting deferred gain, and the T2057 election — pausing for the user to elect the amount.',
    expense: 'You specialize in employee expense reimbursement: classifying receipts, applying per-diem caps and the reimbursement policy, and computing the net amount payable to the employee (with CAD conversion).',
    campaign: 'You specialize in marketing campaign budget allocation: classifying channel spend requests, the human election of the approved budget between the committed floor and the ceiling, and projecting the resulting allocation.'
};
const SPECIALISTS = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AGENTS"].filter((a)=>a.workflow && EXPERTISE[a.workflow]).map((a)=>({
        id: a.id,
        name: a.name,
        role: a.role,
        workflowId: a.workflow,
        expertise: EXPERTISE[a.workflow]
    }));
const BY_WORKFLOW = Object.fromEntries(SPECIALISTS.map((s)=>[
        s.workflowId,
        s
    ]));
function specialistForWorkflow(workflowId) {
    return workflowId ? BY_WORKFLOW[workflowId] ?? null : null;
}
function selectSpecialist(route) {
    if (route.target.kind === 'workflow' && route.target.id) {
        return specialistForWorkflow(route.target.id);
    }
    return null;
}
function specialistDirective(s) {
    return `SPECIALIST FOR THIS TURN — You are ${s.name}, the ${s.role} for this workspace. ${s.expertise} Answer this turn with that expertise and perspective; you may speak in the first person as ${s.name} when it feels natural. Stay within your domain — if the user clearly shifts to another area, switch to the right specialist or hand back to general assistance. Never fabricate figures: ground them in the provided context and use the deterministic workflow/calculation tools for official numbers.`;
}
}),
"[project]/app/api/copilotkit/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$copilotkit$2f$runtime__$5b$external$5d$__$2840$copilotkit$2f$runtime$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@copilotkit/runtime [external] (@copilotkit/runtime, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$copilotkit$2f$runtime$2f$v2__$5b$external$5d$__$2840$copilotkit$2f$runtime$2f$v2$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@copilotkit/runtime/v2 [external] (@copilotkit/runtime/v2, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$6$2e$8$2e$1_ws$40$8$2e$18$2e$3_zod$40$4$2e$1$2e$12$2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/openai@6.8.1_ws@8.18.3_zod@4.1.12/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$6$2e$8$2e$1_ws$40$8$2e$18$2e$3_zod$40$4$2e$1$2e$12$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/openai@6.8.1_ws@8.18.3_zod@4.1.12/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$copilot$2d$orphan$2d$repair$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/copilot-orphan-repair.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$copilot$2d$trace$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/copilot-trace.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/runtime/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$gate$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/runtime/routing/gate.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$model$2d$policy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/runtime/model-policy.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$agents$2f$specialists$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/assistant/runtime/agents/specialists.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$copilotkit$2f$runtime__$5b$external$5d$__$2840$copilotkit$2f$runtime$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f40$copilotkit$2f$runtime$2f$v2__$5b$external$5d$__$2840$copilotkit$2f$runtime$2f$v2$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$copilotkit$2f$runtime__$5b$external$5d$__$2840$copilotkit$2f$runtime$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f40$copilotkit$2f$runtime$2f$v2__$5b$external$5d$__$2840$copilotkit$2f$runtime$2f$v2$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
const POST = async (req)=>{
    // Prefer the Vercel AI Gateway when its key is set: one key unlocks every
    // provider/model (vercel.com/ai-gateway/models). The OpenAI SDK talks to the
    // gateway's OpenAI-compatible endpoint, where models must be "provider/model" —
    // so a bare OPENAI_CHAT_MODEL like "gpt-5.6-terra" is normalized to "openai/…".
    // Falls back to calling OpenAI directly with OPENAI_API_KEY (previous behavior).
    const gatewayKey = process.env.AI_GATEWAY_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!gatewayKey && !openaiKey) {
        return new Response(JSON.stringify({
            error: 'Set AI_GATEWAY_API_KEY or OPENAI_API_KEY in .env.local'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    const configuredModel = process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o';
    const openai = gatewayKey ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$6$2e$8$2e$1_ws$40$8$2e$18$2e$3_zod$40$4$2e$1$2e$12$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
        apiKey: gatewayKey,
        baseURL: 'https://ai-gateway.vercel.sh/v1'
    }) : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$6$2e$8$2e$1_ws$40$8$2e$18$2e$3_zod$40$4$2e$1$2e$12$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
        apiKey: openaiKey
    });
    const model = gatewayKey ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$model$2d$policy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeModelSpec"])(configuredModel) : configuredModel;
    const serviceAdapter = new __TURBOPACK__imported__module__$5b$externals$5d2f40$copilotkit$2f$runtime__$5b$external$5d$__$2840$copilotkit$2f$runtime$2c$__esm_import$29$__["OpenAIAdapter"]({
        openai,
        model
    });
    // Explicit default agent + orphan-repair middleware. The middleware runs before
    // BuiltInAgent converts input.messages for the AI SDK, so the exact thread the SDK
    // validates is always tool-call/result paired. Frontend useCopilotAction tools are
    // unaffected — they arrive per-request as input.tools and stream to the client as
    // before; we rewrite only input.messages.
    const runtimeConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAssistantRuntimeConfig"])();
    // `overridableProperties` lets the middleware pick the model/reasoning per turn via
    // input.forwardedProps (model tiering below). Without it BuiltInAgent ignores them.
    const agent = new __TURBOPACK__imported__module__$5b$externals$5d2f40$copilotkit$2f$runtime$2f$v2__$5b$external$5d$__$2840$copilotkit$2f$runtime$2f$v2$2c$__esm_import$29$__["BuiltInAgent"]({
        model: serviceAdapter.getLanguageModel(),
        overridableProperties: [
            'model',
            'providerOptions'
        ]
    });
    agent.use((input, next)=>{
        // Trace what the model receives this turn (no-op unless COPILOT_TRACE is set).
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$copilot$2d$trace$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["traceCopilotInput"])(input);
        // Ask/Propose/Execute intent gate (lib/assistant-runtime). Deterministic, sync,
        // fail-open: on ask/mention/negation turns it withholds the state-starting tools
        // (so a workflow MENTION can't trigger a run) and on explicit commands it steers
        // to the right workflow. Controlled by ASSISTANT_INTENT_GATE (off|shadow|enforce,
        // default enforce). See docs/assistant-routing-policy.md.
        const decision = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$gate$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeGateDecision"])(input, {
            mode: runtimeConfig.intentGate,
            directives: runtimeConfig.intentDirectives
        });
        const gated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$gate$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["applyGateDecision"])(input.messages, input.tools, decision);
        // The route the gate computed for this turn (reused for tiering + specialist).
        const route = decision.route.source !== 'fallback' ? decision.route : (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$routing$2f$gate$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["classifyTurn"])(input)?.route ?? null;
        // Model tiering (lib/assistant-runtime/model-policy). Pick a stronger model for
        // hard tax/analysis questions and a fast one for navigation. NO-OP until
        // ASSISTANT_MODEL_FAST/DEEP are set to distinct models.
        let forwardedProps = input.forwardedProps;
        let tierLabel;
        if (runtimeConfig.modelTiering && route) {
            const md = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$model$2d$policy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pickModelDecision"])(route, runtimeConfig);
            tierLabel = md.tier;
            if (md.modelSpec) {
                forwardedProps = {
                    ...input.forwardedProps ?? {},
                    model: md.modelSpec,
                    ...md.providerOptions ? {
                        providerOptions: md.providerOptions
                    } : {}
                };
            }
        }
        // Specialist "hat" (lib/assistant-runtime/agents/specialists). A turn about a
        // resolved workflow is answered AS that workflow's specialist (Sofi/Théo/Mira/
        // Nova) — one conductor, one thread, but the domain persona + expertise for this
        // turn. Injected as a context item so it reaches the model without touching the
        // message thread. Controlled by ASSISTANT_SPECIALISTS (default on).
        let context = input.context;
        let specialistLabel;
        if (runtimeConfig.specialists && route) {
            const specialist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$agents$2f$specialists$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["selectSpecialist"])(route);
            if (specialist) {
                specialistLabel = specialist.name;
                context = [
                    ...input.context ?? [],
                    {
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$assistant$2f$runtime$2f$agents$2f$specialists$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["specialistDirective"])(specialist),
                        description: 'Active specialist persona for this turn (wear this hat)'
                    }
                ];
            }
        }
        if (decision.route.source !== 'fallback') {
            // Log-safe, single-line observability (no message content, no chain-of-thought).
            console.log('[assistant-route]', JSON.stringify({
                mode: decision.route.mode,
                intent: decision.route.intent,
                target: decision.route.target.id,
                conf: decision.route.confidence,
                withheld: decision.withheldToolNames,
                directive: decision.directive != null,
                tier: tierLabel,
                specialist: specialistLabel,
                gate: decision.mode,
                audit: decision.route.auditSummary
            }));
        }
        // Orphan repair still runs last, on the (possibly gated) messages, so the thread
        // handed to the AI SDK is always tool-call/result paired.
        return next.run({
            ...input,
            tools: gated.tools,
            messages: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$copilot$2d$orphan$2d$repair$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["repairOrphanToolCalls"])(gated.messages),
            forwardedProps,
            context
        });
    });
    const runtime = new __TURBOPACK__imported__module__$5b$externals$5d2f40$copilotkit$2f$runtime__$5b$external$5d$__$2840$copilotkit$2f$runtime$2c$__esm_import$29$__["CopilotRuntime"]({
        agents: {
            default: agent
        }
    });
    const { handleRequest } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$copilotkit$2f$runtime__$5b$external$5d$__$2840$copilotkit$2f$runtime$2c$__esm_import$29$__["copilotRuntimeNextJSAppRouterEndpoint"])({
        runtime,
        serviceAdapter,
        endpoint: '/api/copilotkit'
    });
    return handleRequest(req);
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__50570e52._.js.map