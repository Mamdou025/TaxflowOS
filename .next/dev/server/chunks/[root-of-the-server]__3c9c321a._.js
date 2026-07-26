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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/platform/integrations/ai-gateway/config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * AI Gateway Managed Keys Configuration
 *
 * This feature allows signed-in users to use their own Vercel AI Gateway
 * API keys (and credits) instead of manually entering an API key.
 *
 * The AI Gateway itself is available to everyone via AI_GATEWAY_API_KEY.
 * This feature flag only controls the ability to create API keys on behalf
 * of users through OAuth - which is an internal Vercel feature.
 *
 * Set AI_GATEWAY_MANAGED_KEYS_ENABLED=true to enable.
 */ __turbopack_context__.s([
    "isAiGatewayManagedKeysEnabled",
    ()=>isAiGatewayManagedKeysEnabled,
    "isAiGatewayManagedKeysEnabledClient",
    ()=>isAiGatewayManagedKeysEnabledClient
]);
function isAiGatewayManagedKeysEnabled() {
    return process.env.AI_GATEWAY_MANAGED_KEYS_ENABLED === "true";
}
function isAiGatewayManagedKeysEnabledClient() {
    if ("TURBOPACK compile-time truthy", 1) {
        return process.env.AI_GATEWAY_MANAGED_KEYS_ENABLED === "true";
    }
    //TURBOPACK unreachable
    ;
}
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/perf_hooks [external] (perf_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("perf_hooks", () => require("perf_hooks"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/lib/utils/id.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateId",
    ()=>generateId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/nanoid@5.1.6/node_modules/nanoid/index.js [app-route] (ecmascript) <locals>");
;
// Create a nanoid generator with lowercase URL-safe characters
const nanoid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["customAlphabet"])("0123456789abcdefghijklmnopqrstuvwxyz", 21);
function generateId() {
    return nanoid();
}
}),
"[project]/platform/db/schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EMBEDDING_DIMENSIONS",
    ()=>EMBEDDING_DIMENSIONS,
    "accounts",
    ()=>accounts,
    "apiKeys",
    ()=>apiKeys,
    "assistantMemories",
    ()=>assistantMemories,
    "chatMessages",
    ()=>chatMessages,
    "chatMessagesRelations",
    ()=>chatMessagesRelations,
    "chatThreads",
    ()=>chatThreads,
    "chatThreadsRelations",
    ()=>chatThreadsRelations,
    "documentChunks",
    ()=>documentChunks,
    "documentChunksRelations",
    ()=>documentChunksRelations,
    "documents",
    ()=>documents,
    "documentsRelations",
    ()=>documentsRelations,
    "integrations",
    ()=>integrations,
    "sessions",
    ()=>sessions,
    "users",
    ()=>users,
    "verifications",
    ()=>verifications,
    "workflowExecutionLogs",
    ()=>workflowExecutionLogs,
    "workflowExecutions",
    ()=>workflowExecutions,
    "workflowExecutionsRelations",
    ()=>workflowExecutionsRelations,
    "workflows",
    ()=>workflows
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@opentel_83c64c1d7edcb9d78a3dfae58927e46e/node_modules/drizzle-orm/relations.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@opentel_83c64c1d7edcb9d78a3dfae58927e46e/node_modules/drizzle-orm/pg-core/columns/boolean.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@opentel_83c64c1d7edcb9d78a3dfae58927e46e/node_modules/drizzle-orm/pg-core/indexes.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@opentel_83c64c1d7edcb9d78a3dfae58927e46e/node_modules/drizzle-orm/pg-core/columns/integer.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@opentel_83c64c1d7edcb9d78a3dfae58927e46e/node_modules/drizzle-orm/pg-core/columns/jsonb.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@opentel_83c64c1d7edcb9d78a3dfae58927e46e/node_modules/drizzle-orm/pg-core/table.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@opentel_83c64c1d7edcb9d78a3dfae58927e46e/node_modules/drizzle-orm/pg-core/columns/text.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@opentel_83c64c1d7edcb9d78a3dfae58927e46e/node_modules/drizzle-orm/pg-core/columns/timestamp.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$vector_extension$2f$vector$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@opentel_83c64c1d7edcb9d78a3dfae58927e46e/node_modules/drizzle-orm/pg-core/columns/vector_extension/vector.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$id$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/id.ts [app-route] (ecmascript)");
;
;
;
const users = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("users", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("id").primaryKey(),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("name"),
    email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("email").unique(),
    emailVerified: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"])("email_verified").notNull().default(false),
    image: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("image"),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("updated_at").notNull(),
    // Anonymous user tracking
    isAnonymous: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"])("is_anonymous").default(false)
});
const sessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("sessions", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("id").primaryKey(),
    expiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("expires_at").notNull(),
    token: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("token").notNull().unique(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("updated_at").notNull(),
    ipAddress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("ip_address"),
    userAgent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("user_agent"),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("user_id").notNull().references(()=>users.id)
});
const accounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("accounts", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("id").primaryKey(),
    accountId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("account_id").notNull(),
    providerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("provider_id").notNull(),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("user_id").notNull().references(()=>users.id),
    accessToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("access_token"),
    refreshToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("refresh_token"),
    idToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("id_token"),
    accessTokenExpiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("access_token_expires_at"),
    refreshTokenExpiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("refresh_token_expires_at"),
    scope: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("scope"),
    password: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("password"),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("updated_at").notNull()
});
const verifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("verifications", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("id").primaryKey(),
    identifier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("identifier").notNull(),
    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("value").notNull(),
    expiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("expires_at").notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at"),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("updated_at")
});
const workflows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("workflows", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("id").primaryKey().$defaultFn(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$id$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateId"])()),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("name").notNull(),
    description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("description"),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("user_id").notNull().references(()=>users.id),
    // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
    nodes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("nodes").notNull().$type(),
    // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
    edges: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("edges").notNull().$type(),
    visibility: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("visibility").notNull().default("private").$type(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").notNull().defaultNow(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("updated_at").notNull().defaultNow()
});
const integrations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("integrations", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("id").primaryKey().$defaultFn(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$id$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateId"])()),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("user_id").notNull().references(()=>users.id),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("name").notNull(),
    type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("type").notNull().$type(),
    // biome-ignore lint/suspicious/noExplicitAny: JSONB type - encrypted credentials stored as JSON
    config: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("config").notNull().$type(),
    // Whether this integration was created via OAuth (managed by app) vs manual entry
    isManaged: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"])("is_managed").default(false),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").notNull().defaultNow(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("updated_at").notNull().defaultNow()
});
const workflowExecutions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("workflow_executions", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("id").primaryKey().$defaultFn(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$id$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateId"])()),
    workflowId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("workflow_id").notNull().references(()=>workflows.id),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("user_id").notNull().references(()=>users.id),
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("status").notNull().$type(),
    // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
    input: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("input").$type(),
    // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
    output: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("output").$type(),
    error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("error"),
    startedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("started_at").notNull().defaultNow(),
    completedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("completed_at"),
    duration: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("duration")
});
const workflowExecutionLogs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("workflow_execution_logs", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("id").primaryKey().$defaultFn(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$id$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateId"])()),
    executionId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("execution_id").notNull().references(()=>workflowExecutions.id),
    nodeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("node_id").notNull(),
    nodeName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("node_name").notNull(),
    nodeType: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("node_type").notNull(),
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("status").notNull().$type(),
    // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
    input: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("input").$type(),
    // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
    output: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("output").$type(),
    error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("error"),
    startedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("started_at").notNull().defaultNow(),
    completedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("completed_at"),
    duration: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("duration"),
    timestamp: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("timestamp").notNull().defaultNow()
});
const apiKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("api_keys", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("id").primaryKey().$defaultFn(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$id$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateId"])()),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("user_id").notNull().references(()=>users.id),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("name"),
    keyHash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("key_hash").notNull(),
    keyPrefix: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("key_prefix").notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").notNull().defaultNow(),
    lastUsedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("last_used_at")
});
const assistantMemories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("assistant_memories", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("id").primaryKey().$defaultFn(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$id$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateId"])()),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("user_id").notNull().references(()=>users.id),
    clientId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("client_id"),
    fiscalYear: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("fiscal_year"),
    workflowId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("workflow_id"),
    kind: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("kind").notNull().default("fact").$type(),
    subject: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("subject"),
    content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("content").notNull(),
    source: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("source").notNull().default("user").$type(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").notNull().defaultNow(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("updated_at").notNull().defaultNow()
});
const chatThreads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("chat_threads", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("id").primaryKey().$defaultFn(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$id$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateId"])()),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("user_id").notNull().references(()=>users.id),
    clientId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("client_id"),
    title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("title"),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").notNull().defaultNow(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("updated_at").notNull().defaultNow(),
    archivedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("archived_at")
}, (t)=>[
        // List a user's threads, most-recently-updated first.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("chat_threads_user_updated_idx").on(t.userId, t.updatedAt)
    ]);
const chatMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("chat_messages", {
    // The CopilotKit message id (stable across turns) — upsert key, not app-generated.
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("id").primaryKey(),
    threadId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("thread_id").notNull().references(()=>chatThreads.id, {
        onDelete: "cascade"
    }),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("user_id").notNull().references(()=>users.id),
    role: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("role").notNull().$type(),
    seq: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("seq").notNull(),
    content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("content").notNull().$type(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").notNull().defaultNow()
}, (t)=>[
        // Fetch a thread's messages in order.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("chat_messages_thread_seq_idx").on(t.threadId, t.seq)
    ]);
const documents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("documents", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("id").primaryKey().$defaultFn(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$id$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateId"])()),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("user_id").notNull().references(()=>users.id),
    clientId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("client_id"),
    fileName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("file_name").notNull(),
    mimeType: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("mime_type"),
    sizeBytes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("size_bytes"),
    storageBucket: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("storage_bucket").notNull(),
    storageKey: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("storage_key").notNull(),
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("status").notNull().default("uploading").$type(),
    extractedChars: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("extracted_chars"),
    pageCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("page_count"),
    error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("error"),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").notNull().defaultNow(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("updated_at").notNull().defaultNow()
}, (t)=>[
        // List a user's documents, newest first.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("documents_user_created_idx").on(t.userId, t.createdAt)
    ]);
const EMBEDDING_DIMENSIONS = 1536;
const documentChunks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("document_chunks", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("id").primaryKey().$defaultFn(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$id$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateId"])()),
    documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("document_id").notNull().references(()=>documents.id, {
        onDelete: "cascade"
    }),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("user_id").notNull().references(()=>users.id),
    clientId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("client_id"),
    chunkIndex: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("chunk_index").notNull(),
    content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("content").notNull(),
    tokens: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("tokens"),
    embedding: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$vector_extension$2f$vector$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["vector"])("embedding", {
        dimensions: EMBEDDING_DIMENSIONS
    }).notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at").notNull().defaultNow()
}, (t)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("document_chunks_document_idx").on(t.documentId),
        // Approximate-nearest-neighbour index for cosine similarity search.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("document_chunks_embedding_idx").using("hnsw", t.embedding.op("vector_cosine_ops"))
    ]);
const workflowExecutionsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(workflowExecutions, ({ one })=>({
        workflow: one(workflows, {
            fields: [
                workflowExecutions.workflowId
            ],
            references: [
                workflows.id
            ]
        })
    }));
const documentsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(documents, ({ many })=>({
        chunks: many(documentChunks)
    }));
const documentChunksRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(documentChunks, ({ one })=>({
        document: one(documents, {
            fields: [
                documentChunks.documentId
            ],
            references: [
                documents.id
            ]
        })
    }));
const chatThreadsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(chatThreads, ({ many })=>({
        messages: many(chatMessages)
    }));
const chatMessagesRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(chatMessages, ({ one })=>({
        thread: one(chatThreads, {
            fields: [
                chatMessages.threadId
            ],
            references: [
                chatThreads.id
            ]
        })
    }));
}),
"[project]/platform/db/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db,
    "migrationClient",
    ()=>migrationClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$postgres$2d$js$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@opentel_83c64c1d7edcb9d78a3dfae58927e46e/node_modules/drizzle-orm/postgres-js/driver.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$postgres$40$3$2e$4$2e$7$2f$node_modules$2f$postgres$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/postgres@3.4.7/node_modules/postgres/src/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/platform/db/schema.ts [app-route] (ecmascript)");
;
;
;
// Construct schema object for drizzle. Every table must be listed here so the
// relational query builder (db.query.*) knows about it; repositories may also
// import tables directly for plain select/insert.
const schema = {
    users: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"],
    sessions: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessions"],
    accounts: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["accounts"],
    verifications: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifications"],
    workflows: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["workflows"],
    workflowExecutions: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["workflowExecutions"],
    workflowExecutionLogs: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["workflowExecutionLogs"],
    workflowExecutionsRelations: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["workflowExecutionsRelations"],
    apiKeys: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiKeys"],
    integrations: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integrations"],
    assistantMemories: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assistantMemories"],
    chatThreads: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["chatThreads"],
    chatMessages: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["chatMessages"],
    chatThreadsRelations: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["chatThreadsRelations"],
    chatMessagesRelations: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["chatMessagesRelations"],
    documents: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["documents"],
    documentChunks: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["documentChunks"],
    documentsRelations: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["documentsRelations"],
    documentChunksRelations: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["documentChunksRelations"]
};
// App queries go through DATABASE_URL. On Supabase + Vercel this MUST be the
// Supavisor *transaction* pooler URL (port 6543) — see the note below on prepare.
const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/workflow";
// Migrations (drizzle-kit + migrationClient) need a *direct* connection that
// supports DDL and prepared statements — the transaction pooler does not.
// DIRECT_URL (Supabase port 5432) is preferred; fall back to DATABASE_URL for
// local/single-connection setups.
const migrationConnectionString = process.env.DIRECT_URL || connectionString;
const migrationClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$postgres$40$3$2e$4$2e$7$2f$node_modules$2f$postgres$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(migrationConnectionString, {
    max: 1
});
// Use global singleton to prevent connection exhaustion during HMR
const globalForDb = globalThis;
// For queries - reuse connection in development.
// `prepare: false` is REQUIRED when DATABASE_URL points at Supabase's transaction
// pooler (pgBouncer transaction mode): it does not support prepared statements, so
// leaving prepare on throws "prepared statement already exists" under load. It is a
// harmless no-op cost on direct/local connections.
const queryClient = globalForDb.queryClient ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$postgres$40$3$2e$4$2e$7$2f$node_modules$2f$postgres$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(connectionString, {
    max: 10,
    prepare: false
});
const db = globalForDb.db ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$postgres$2d$js$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["drizzle"])(queryClient, {
    schema
});
if ("TURBOPACK compile-time truthy", 1) {
    globalForDb.queryClient = queryClient;
    globalForDb.db = db;
}
}),
"[project]/platform/auth/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CDx1PoNO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__b__as__betterAuth$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CDx1PoNO.mjs [app-route] (ecmascript) <export b as betterAuth>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$adapters$2f$drizzle$2d$adapter$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/adapters/drizzle-adapter/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/plugins/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$anonymous$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/plugins/anonymous/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$generic$2d$oauth$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/plugins/generic-oauth/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@opentel_83c64c1d7edcb9d78a3dfae58927e46e/node_modules/drizzle-orm/sql/expressions/conditions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$integrations$2f$ai$2d$gateway$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/platform/integrations/ai-gateway/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/platform/db/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/platform/db/schema.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
// Construct schema object for drizzle adapter
const schema = {
    user: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"],
    session: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessions"],
    account: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["accounts"],
    verification: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifications"],
    workflows: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["workflows"],
    workflowExecutions: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["workflowExecutions"],
    workflowExecutionLogs: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["workflowExecutionLogs"],
    workflowExecutionsRelations: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["workflowExecutionsRelations"]
};
// Determine the base URL for authentication
// This supports Vercel Preview deployments with dynamic URLs
function getBaseURL() {
    // Priority 1: Explicit BETTER_AUTH_URL (set manually for production/dev)
    if (process.env.BETTER_AUTH_URL) {
        return process.env.BETTER_AUTH_URL;
    }
    // Priority 2: NEXT_PUBLIC_APP_URL
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
    }
    // Priority 3: Check if we're on Vercel (for preview deployments)
    if (process.env.VERCEL_URL) {
        // VERCEL_URL doesn't include protocol, so add it
        // Use https for Vercel deployments (both production and preview)
        return `https://${process.env.VERCEL_URL}`;
    }
    // Fallback: Local development
    return "http://localhost:3000";
}
// Build plugins array conditionally
const plugins = [
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$anonymous$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["anonymous"])({
        async onLinkAccount (data) {
            // When an anonymous user links to a real account, migrate their data
            const fromUserId = data.anonymousUser.user.id;
            const toUserId = data.newUser.user.id;
            console.log(`[Anonymous Migration] Migrating from user ${fromUserId} to ${toUserId}`);
            try {
                // Migrate workflows
                await __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["workflows"]).set({
                    userId: toUserId
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["workflows"].userId, fromUserId));
                // Migrate workflow executions
                await __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["workflowExecutions"]).set({
                    userId: toUserId
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["workflowExecutions"].userId, fromUserId));
                // Migrate integrations
                await __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integrations"]).set({
                    userId: toUserId
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integrations"].userId, fromUserId));
                console.log(`[Anonymous Migration] Successfully migrated data from ${fromUserId} to ${toUserId}`);
            } catch (error) {
                console.error("[Anonymous Migration] Error migrating user data:", error);
                throw error;
            }
        }
    }),
    ...process.env.VERCEL_CLIENT_ID ? [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$generic$2d$oauth$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["genericOAuth"])({
            config: [
                {
                    providerId: "vercel",
                    clientId: process.env.VERCEL_CLIENT_ID,
                    clientSecret: process.env.VERCEL_CLIENT_SECRET || "",
                    authorizationUrl: "https://vercel.com/oauth/authorize",
                    tokenUrl: "https://api.vercel.com/login/oauth/token",
                    userInfoUrl: "https://api.vercel.com/login/oauth/userinfo",
                    // Include read-write:team scope when AI Gateway User Keys is enabled
                    // This grants APIKey and APIKeyAiGateway permissions for creating user keys
                    scopes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$integrations$2f$ai$2d$gateway$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAiGatewayManagedKeysEnabled"])() ? [
                        "openid",
                        "email",
                        "profile",
                        "read-write:team"
                    ] : [
                        "openid",
                        "email",
                        "profile"
                    ],
                    discoveryUrl: undefined,
                    pkce: true,
                    getUserInfo: async (tokens)=>{
                        const response = await fetch("https://api.vercel.com/login/oauth/userinfo", {
                            headers: {
                                Authorization: `Bearer ${tokens.accessToken}`
                            }
                        });
                        const profile = await response.json();
                        console.log("[Vercel OAuth] userinfo response:", profile);
                        return {
                            id: profile.sub,
                            email: profile.email,
                            name: profile.name ?? profile.preferred_username,
                            emailVerified: profile.email_verified ?? true,
                            image: profile.picture
                        };
                    }
                }
            ]
        })
    ] : []
];
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CDx1PoNO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__b__as__betterAuth$3e$__["betterAuth"])({
    baseURL: getBaseURL(),
    database: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$adapters$2f$drizzle$2d$adapter$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["drizzleAdapter"])(__TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"], {
        provider: "pg",
        schema
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
            enabled: !!process.env.GITHUB_CLIENT_ID
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            enabled: !!process.env.GOOGLE_CLIENT_ID,
            // Read-only Drive + Gmail so the app can pull a client's trial balance
            // (a workbook in Drive, or an .xlsx email attachment) as a workflow source.
            scope: [
                "https://www.googleapis.com/auth/drive.readonly",
                "https://www.googleapis.com/auth/gmail.readonly"
            ],
            // offline + consent → a refresh token is stored so getAccessToken() can
            // silently refresh for server-side Drive/Gmail calls.
            accessType: "offline",
            prompt: "consent"
        }
    },
    plugins
});
}),
"[project]/shared/workflow-engine/execution/blocks/source/currency-rate/schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAnnualAverageExchangeRate",
    ()=>fetchAnnualAverageExchangeRate,
    "parseCurrencyRateConfig",
    ()=>parseCurrencyRateConfig
]);
function optionalString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function parseNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value !== "string") {
        return;
    }
    const parsed = Number(value.replaceAll(",", "").trim());
    return Number.isFinite(parsed) ? parsed : undefined;
}
function parseCurrencyRateConfig(config) {
    const fapiInputs = typeof config.fapiInputs === "object" && config.fapiInputs !== null ? config.fapiInputs : {};
    const source = {
        ...config,
        ...fapiInputs
    };
    return {
        documentCurrency: optionalString(source.documentCurrency) || optionalString(source.sourceCurrency) || "USD",
        fapiYear: parseNumber(source.fapiYear),
        liveRate: parseNumber(source.liveRate) || parseNumber(source.fetchedRate) || parseNumber(source.valetRate),
        overrideReason: optionalString(source.overrideReason),
        overrideRate: parseNumber(source.overrideRate) || parseNumber(source.fxRate) || parseNumber(source.exchangeRate),
        rateProvider: optionalString(source.rateProvider) || "bank_of_canada",
        rateType: optionalString(source.rateType) || "annual_average",
        reportingCurrency: optionalString(source.reportingCurrency) || optionalString(source.targetCurrency) || "CAD"
    };
}
async function fetchAnnualAverageExchangeRate({ documentCurrency, reportingCurrency, year }) {
    if (documentCurrency === reportingCurrency) {
        return {
            rate: 1,
            rateSource: "same_currency",
            rateType: "same_currency",
            rateYear: year
        };
    }
    if (reportingCurrency !== "CAD") {
        throw new Error("The local Bank of Canada lookup currently supports rates expressed in CAD.");
    }
    const seriesName = `FX${documentCurrency}CAD`;
    const response = await fetch(`https://www.bankofcanada.ca/valet/observations/${encodeURIComponent(seriesName)}/json?start_date=${year}-01-01&end_date=${year}-12-31`);
    if (!response.ok) {
        throw new Error(`FX lookup failed with HTTP ${response.status}.`);
    }
    const payload = await response.json();
    const values = payload.observations?.map((observation)=>{
        const seriesValue = observation[seriesName];
        const rawValue = typeof seriesValue === "object" && seriesValue !== null ? seriesValue.v : seriesValue;
        return typeof rawValue === "string" ? Number(rawValue) : Number.NaN;
    }).filter((value)=>Number.isFinite(value)) || [];
    if (values.length === 0) {
        throw new Error("FX lookup response did not include a usable rate.");
    }
    const rate = values.reduce((total, value)=>total + value, 0) / values.length;
    return {
        rate,
        rateSource: "bank_of_canada_valet",
        rateType: "annual_average",
        rateYear: year,
        seriesName
    };
}
}),
"[project]/platform/agent-tools/registry.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Shared agent-tool registry — ONE implementation, used by BOTH runtimes.
//
// The Agent Lab (features/agent-lab/tools.ts, AI-SDK `tool()`) and Sina's live chat
// (app/api/assistant/tools/route.ts, behind a CopilotKit action) both source these
// tools from here. That is the whole point: prototype/adjust a tool in the Lab and
// Sina inherits the SAME code — no re-implementation, no drift.
//
// SERVER-ONLY: these run outbound fetches, read process.env (FIRECRAWL_API_KEY), and
// import server workflow code. Only server files may import this module (the two
// wrappers above + nothing client-side). The client authors its own arg metadata.
//
// To ADD a tool to the shared set: write one `defineTool(...)` below and add it to
// AGENT_TOOL_REGISTRY. It is then callable from Sina's route immediately; expose it
// in the Lab by wrapping it in tools.ts, and register a CopilotKit action for it in
// use-assistant.tsx. The implementation itself is never written twice.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "AGENT_TOOL_REGISTRY",
    ()=>AGENT_TOOL_REGISTRY,
    "isAgentToolId",
    ()=>isAgentToolId,
    "runAgentTool",
    ()=>runAgentTool
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$currency$2d$rate$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/currency-rate/schema.ts [app-route] (ecmascript)");
;
;
/** Wrap an implementation so its args are validated once, in one place. */ function defineTool(description, inputSchema, impl) {
    return {
        description,
        inputSchema,
        run: async (rawArgs)=>{
            const parsed = inputSchema.safeParse(rawArgs ?? {});
            if (!parsed.success) return {
                error: 'Invalid arguments for this tool.',
                issues: parsed.error.issues
            };
            return impl(parsed.data);
        }
    };
}
// ── searchCanadianTax — Firecrawl search scoped to official Canadian tax sources ─
const OFFICIAL_CA_TAX_HOSTS = [
    'canada.ca',
    'cra-arc.gc.ca'
];
function hostMatches(url, host) {
    try {
        const h = new URL(url).hostname.toLowerCase();
        return h === host || h.endsWith(`.${host}`);
    } catch  {
        return false;
    }
}
const searchCanadianTax = defineTool('Search official Canadian tax sources (canada.ca and the CRA) for CURRENT rules, rates, forms, and deadlines. ' + 'Use whenever the answer depends on up-to-date or authoritative Canadian tax info rather than training data. ' + 'Returns titles, URLs, and snippets — cite the source URL.', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(500).describe('what to look up, e.g. "capital gains inclusion rate 2024"'),
    limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().optional().describe('max results (default 5, max 10)')
}), async ({ query, limit })=>{
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
        return {
            error: 'FIRECRAWL_API_KEY is not set in .env.local — it is required for Canadian tax lookups.'
        };
    }
    const scopedQuery = `${query} (site:canada.ca OR site:cra-arc.gc.ca)`;
    try {
        const res = await fetch('https://api.firecrawl.dev/v1/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                query: scopedQuery,
                limit: Math.min(Math.max(limit ?? 5, 1), 10)
            })
        });
        if (!res.ok) return {
            error: `Search failed: HTTP ${res.status}`
        };
        const json = await res.json();
        if (!json.success) return {
            error: json.error ?? 'Search failed.'
        };
        const items = json.data ?? [];
        const results = items.filter((r)=>typeof r.url === 'string' && OFFICIAL_CA_TAX_HOSTS.some((h)=>hostMatches(r.url, h))).map((r)=>({
                title: r.title ?? '',
                url: r.url,
                snippet: (r.description ?? '').slice(0, 600)
            }));
        return {
            query,
            results,
            instruction: 'Cite the source URL for each fact you use. If the results do not answer the question, say so plainly.',
            note: results.length === 0 ? 'No results from official Canadian sources — try rephrasing the query.' : undefined
        };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : 'Canadian tax lookup failed.'
        };
    }
});
// ── fetchWebPage — read a public URL's text (SSRF-guarded) ───────────────────────
const WEB_PAGE_MAX_CHARS = 15_000;
// Block obvious loopback / private / link-local literals so the authenticated tool
// can't be pointed at internal services or the cloud metadata endpoint. Hostnames
// that only resolve to private IPs via DNS are not caught here — a deliberately
// minimal guard; tighten with DNS resolution if this is ever exposed more widely.
function isBlockedHost(hostname) {
    const h = hostname.toLowerCase();
    if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.internal') || h.endsWith('.local')) return true;
    if (h === '169.254.169.254' || h === '[::1]' || h === '::1') return true;
    const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (m) {
        const [a, b] = [
            Number(m[1]),
            Number(m[2])
        ];
        if (a === 127 || a === 10 || a === 0) return true;
        if (a === 169 && b === 254) return true;
        if (a === 192 && b === 168) return true;
        if (a === 172 && b >= 16 && b <= 31) return true;
    }
    return false;
}
const fetchWebPage = defineTool('Fetch a public web page and return its readable text so you can answer about the whole page. ' + 'Returns up to ~15k characters; if `truncated` is true, the tail was cut. Good follow-up to searchCanadianTax to read a result URL in full.', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().describe('the public http(s) URL to read')
}), async ({ url })=>{
    let target;
    try {
        target = new URL(url);
    } catch  {
        return {
            error: 'Invalid URL.'
        };
    }
    if (target.protocol !== 'http:' && target.protocol !== 'https:') {
        return {
            error: 'Only http(s) URLs are allowed.'
        };
    }
    if (isBlockedHost(target.hostname)) {
        return {
            error: 'That host is not allowed.'
        };
    }
    try {
        const res = await fetch(target, {
            headers: {
                'user-agent': 'Mozilla/5.0 (SinaxeSina)'
            },
            redirect: 'follow'
        });
        const html = await res.text();
        const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const truncated = text.length > WEB_PAGE_MAX_CHARS;
        return {
            url,
            status: res.status,
            totalChars: text.length,
            truncated,
            text: truncated ? text.slice(0, WEB_PAGE_MAX_CHARS) : text
        };
    } catch (error) {
        return {
            url,
            error: error instanceof Error ? error.message : 'fetch failed'
        };
    }
});
// ── getFxRate — live annual-average Bank of Canada rate ──────────────────────────
const getFxRate = defineTool('Get the annual-average exchange rate between two currencies using live Bank of Canada data. ' + 'Use for currency conversions instead of guessing a rate.', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    from: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(8).describe('source currency code, e.g. USD'),
    to: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(8).describe('target currency code, e.g. CAD'),
    year: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().optional().describe('calendar year; defaults to the current year')
}), async ({ from, to, year })=>{
    const resolvedYear = year ?? new Date().getFullYear();
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$currency$2d$rate$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchAnnualAverageExchangeRate"])({
            documentCurrency: from.toUpperCase(),
            reportingCurrency: to.toUpperCase(),
            year: resolvedYear
        });
        return {
            from: from.toUpperCase(),
            to: to.toUpperCase(),
            year: resolvedYear,
            provider: 'bank_of_canada',
            ...result
        };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : 'FX lookup failed.'
        };
    }
});
// ── estimateForeignIncomeTax — template calc (live FX → illustrative CA tax) ──────
const SMALL_BIZ_THRESHOLD_CAD = 500_000;
const SMALL_BIZ_RATE = 0.122; // combined federal+provincial small-business rate (illustrative)
const GENERAL_RATE = 0.265; // combined general corporate rate (illustrative)
const estimateForeignIncomeTax = defineTool('Estimate Canadian corporate tax on foreign-currency income. Requires grossIncome (in its foreign currency), ' + 'currency (code like USD), and taxYear. Converts to CAD with the live Bank of Canada rate and applies an ' + 'illustrative combined rate with a $500k small-business threshold. If any input is missing, ask for it before calling.', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    grossIncome: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe('gross income amount in the foreign currency, e.g. 250000'),
    currency: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(8).describe('the income currency code, e.g. USD'),
    taxYear: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().describe('the tax year, e.g. 2024')
}), async ({ grossIncome, currency, taxYear })=>{
    const from = currency.toUpperCase();
    let fxRate;
    let fxSource;
    try {
        const fx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$currency$2d$rate$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchAnnualAverageExchangeRate"])({
            documentCurrency: from,
            reportingCurrency: 'CAD',
            year: taxYear
        });
        fxRate = fx.rate;
        fxSource = fx.rateSource;
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : 'FX lookup failed — try a currency the Bank of Canada publishes against CAD (e.g. USD, EUR, GBP).'
        };
    }
    const grossCAD = grossIncome * fxRate;
    const smallBizPortion = Math.min(grossCAD, SMALL_BIZ_THRESHOLD_CAD);
    const generalPortion = Math.max(grossCAD - SMALL_BIZ_THRESHOLD_CAD, 0);
    const taxCAD = smallBizPortion * SMALL_BIZ_RATE + generalPortion * GENERAL_RATE;
    const netCAD = grossCAD - taxCAD;
    return {
        inputs: {
            grossIncome,
            currency: from,
            taxYear
        },
        fx: {
            rate: Number(fxRate.toFixed(4)),
            source: fxSource,
            pair: `${from}->CAD`
        },
        grossIncomeCAD: Number(grossCAD.toFixed(2)),
        taxBreakdown: {
            smallBusiness: {
                appliesUpTo: SMALL_BIZ_THRESHOLD_CAD,
                rate: SMALL_BIZ_RATE,
                taxedAmount: Number(smallBizPortion.toFixed(2))
            },
            general: {
                rate: GENERAL_RATE,
                taxedAmount: Number(generalPortion.toFixed(2))
            }
        },
        estimatedTaxCAD: Number(taxCAD.toFixed(2)),
        netIncomeCAD: Number(netCAD.toFixed(2)),
        effectiveRate: Number((taxCAD / grossCAD).toFixed(4)),
        assumptions: 'Illustrative combined federal+provincial rates: 12.2% up to $500k CAD, 26.5% above. Not tax advice.'
    };
});
const AGENT_TOOL_REGISTRY = {
    searchCanadianTax,
    fetchWebPage,
    getFxRate,
    estimateForeignIncomeTax
};
function isAgentToolId(id) {
    return Object.prototype.hasOwnProperty.call(AGENT_TOOL_REGISTRY, id);
}
async function runAgentTool(id, rawArgs) {
    if (!isAgentToolId(id)) return {
        error: `Unknown tool: ${id}`
    };
    return AGENT_TOOL_REGISTRY[id].run(rawArgs);
}
}),
"[project]/app/api/assistant/tools/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Assistant server tools — the live-data / secret-bearing tools Sina can call.
//
//   POST /api/assistant/tools  { tool, args }
//     → tool-specific JSON result
//
// Thin auth-gated dispatcher: the actual tool IMPLEMENTATIONS live in the shared
// registry (platform/agent-tools/registry.ts) so the Agent Lab and Sina run the same
// code. This route just authenticates the caller and delegates. Client registration
// (CopilotKit actions) is in features/assistant/ui/use-assistant.tsx.
//
// Session-gated: the tools proxy outbound fetches, so an unauthenticated caller must
// not be able to use this as an open web proxy.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$auth$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/platform/auth/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$agent$2d$tools$2f$registry$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/platform/agent-tools/registry.ts [app-route] (ecmascript)");
;
;
;
;
const BodySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    tool: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    args: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()).optional().default({})
});
async function getUserId(req) {
    try {
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$auth$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"].api.getSession({
            headers: req.headers
        });
        return session?.user?.id ?? null;
    } catch  {
        return null;
    }
}
async function POST(req) {
    const userId = await getUserId(req);
    if (!userId) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'Not authenticated.'
    }, {
        status: 401
    });
    let body;
    try {
        body = await req.json();
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'INVALID_JSON'
        }, {
            status: 400
        });
    }
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'INVALID_INPUT',
            issues: parsed.error.issues
        }, {
            status: 400
        });
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$agent$2d$tools$2f$registry$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAgentToolId"])(parsed.data.tool)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unknown tool.'
        }, {
            status: 400
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$agent$2d$tools$2f$registry$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runAgentTool"])(parsed.data.tool, parsed.data.args));
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3c9c321a._.js.map