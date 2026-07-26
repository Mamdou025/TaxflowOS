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
    "accounts",
    ()=>accounts,
    "apiKeys",
    ()=>apiKeys,
    "assistantMemories",
    ()=>assistantMemories,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@opentel_83c64c1d7edcb9d78a3dfae58927e46e/node_modules/drizzle-orm/pg-core/columns/integer.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@opentel_83c64c1d7edcb9d78a3dfae58927e46e/node_modules/drizzle-orm/pg-core/columns/jsonb.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@opentel_83c64c1d7edcb9d78a3dfae58927e46e/node_modules/drizzle-orm/pg-core/table.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@opentel_83c64c1d7edcb9d78a3dfae58927e46e/node_modules/drizzle-orm/pg-core/columns/text.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$opentel_83c64c1d7edcb9d78a3dfae58927e46e$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@opentel_83c64c1d7edcb9d78a3dfae58927e46e/node_modules/drizzle-orm/pg-core/columns/timestamp.js [app-route] (ecmascript)");
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
// Construct schema object for drizzle
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
    integrations: __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integrations"]
};
const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/workflow";
const migrationClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$postgres$40$3$2e$4$2e$7$2f$node_modules$2f$postgres$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(connectionString, {
    max: 1
});
// Use global singleton to prevent connection exhaustion during HMR
const globalForDb = globalThis;
// For queries - reuse connection in development
const queryClient = globalForDb.queryClient ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$postgres$40$3$2e$4$2e$7$2f$node_modules$2f$postgres$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(connectionString, {
    max: 10
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
"[project]/features/agent-lab/catalog.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
const AGENT_NAME = 'Sina';
const DEFAULT_SYSTEM_PROMPT = `You are ${AGENT_NAME}, a helpful, precise agent used to evaluate how agents work. ` + `You have tools available — call a tool whenever it helps you answer accurately ` + `instead of guessing. When you use a tool, briefly say what you did and what you ` + `found. Be concise and honest about uncertainty.`;
const MODEL_OPTIONS = [
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
}),
"[project]/features/agent-lab/model-router.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
    "EFFORT_LEVELS",
    ()=>EFFORT_LEVELS,
    "planForModel",
    ()=>planForModel
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
"[project]/features/agent-lab/tools.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Agent Lab — TOOL IMPLEMENTATIONS (server only).
//
// A tool = description + inputSchema (what it needs) + execute (the code that runs).
// The model is only ever handed the tools that are checked in the builder UI.
//
// To ADD a tool: write a new tool() below, add it to the TOOLS registry at the
// bottom, and add a matching row to TOOL_CATALOG in catalog.ts so a checkbox shows.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "TOOLS",
    ()=>TOOLS,
    "createSearchDocumentsTool",
    ()=>createSearchDocumentsTool
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@ai-sdk+provider-utils@3.0.17_zod@4.1.12/node_modules/@ai-sdk/provider-utils/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$currency$2d$rate$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/currency-rate/schema.ts [app-route] (ecmascript)");
;
;
;
// ── TEMPLATE TOOLS (safe sandbox) ────────────────────────────────────────────
const getCurrentDateTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: 'Get the current date and time.',
    inputSchema: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({}),
    execute: ()=>{
        const now = new Date();
        return Promise.resolve({
            iso: now.toISOString(),
            readable: now.toString()
        });
    }
});
const calculate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: 'Evaluate a basic arithmetic expression, e.g. "0.18 * 240" or "3 * (4 + 5)".',
    inputSchema: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        expression: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('A math expression using only numbers and + - * / ( ) .')
    }),
    // `async` so every branch shares one Promise<union> return type (tool() needs that).
    execute: async ({ expression })=>{
        if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
            return {
                error: 'Only numbers and + - * / ( ) are allowed.'
            };
        }
        try {
            // Sandboxed: the regex above guarantees only arithmetic characters reach here.
            const result = Function(`"use strict"; return (${expression});`)();
            return {
                expression,
                result
            };
        } catch  {
            return {
                error: 'Could not evaluate that expression.'
            };
        }
    }
});
const getWeatherDemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: 'Get the current weather for a city. (DEMO: returns fake data, not a real API.)',
    inputSchema: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        city: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
    }),
    execute: ({ city })=>Promise.resolve({
            city,
            tempC: 21,
            condition: 'sunny',
            note: 'demo data — wire a real API here later'
        })
});
// Simple in-memory memory. Resets on server restart / serverless cold start —
// swap for your Postgres (drizzle) tables to make it durable in the cloud.
const savedNotes = [];
const rememberNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: 'Save a short note so it can be recalled later this session.',
    inputSchema: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        note: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
    }),
    execute: ({ note })=>{
        savedNotes.push({
            note,
            at: new Date().toISOString()
        });
        return Promise.resolve({
            saved: true,
            totalNotes: savedNotes.length
        });
    }
});
const recallNotes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: 'List all notes saved this session with the remember tool.',
    inputSchema: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({}),
    execute: ()=>Promise.resolve({
            notes: savedNotes
        })
});
// ── REAL CAPABILITIES (live data / your integrations) ────────────────────────
const getFxRate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: 'Get the annual-average exchange rate between two currencies using live Bank of Canada data.',
    inputSchema: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        from: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('source currency code, e.g. USD'),
        to: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('target currency code, e.g. CAD'),
        year: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().describe('calendar year; defaults to the current year')
    }),
    execute: async ({ from, to, year })=>{
        const resolvedYear = year ?? new Date().getFullYear();
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$currency$2d$rate$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchAnnualAverageExchangeRate"])({
                documentCurrency: from.toUpperCase(),
                reportingCurrency: to.toUpperCase(),
                year: resolvedYear
            });
            return {
                from,
                to,
                year: resolvedYear,
                provider: 'bank_of_canada',
                ...result
            };
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : 'FX lookup failed.'
            };
        }
    }
});
const WEB_PAGE_MAX_CHARS = 15_000;
const fetchWebPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: 'Fetch a public web page and return its readable text so you can answer about the WHOLE page (not just the top). ' + 'Returns up to ~15k characters; if `truncated` is true, the tail was cut — say so if the answer might be past it.',
    inputSchema: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url()
    }),
    execute: async ({ url })=>{
        try {
            const res = await fetch(url, {
                headers: {
                    'user-agent': 'Mozilla/5.0 (AgentLab)'
                }
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
    }
});
// ── CANADIAN TAX: live lookup on official sources (CRA / canada.ca) ──────────
// Uses Firecrawl search (same REST endpoint as plugins/firecrawl), but scopes the
// query to official Canadian tax domains and hard-filters results to them — so the
// agent answers current/authoritative Canadian tax questions with a citable URL
// instead of relying on frozen training data.
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
const searchCanadianTax = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: 'Search official Canadian tax sources (canada.ca and the CRA) for current rules, rates, forms, and deadlines. ' + 'Use this whenever the answer depends on up-to-date or authoritative Canadian tax info rather than your training ' + 'data. Returns titles, URLs, and snippets — cite the source URL in your answer.',
    inputSchema: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('what to look up, e.g. "capital gains inclusion rate 2024"'),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().describe('max results (default 5, max 10)')
    }),
    execute: async ({ query, limit })=>{
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
            if (!res.ok) {
                return {
                    error: `Search failed: HTTP ${res.status}`
                };
            }
            const json = await res.json();
            if (!json.success) {
                return {
                    error: json.error ?? 'Search failed.'
                };
            }
            const items = json.data ?? [];
            const results = items.filter((r)=>typeof r.url === 'string' && OFFICIAL_CA_TAX_HOSTS.some((h)=>hostMatches(r.url, h))).map((r)=>({
                    title: r.title ?? '',
                    url: r.url,
                    snippet: (r.description ?? '').slice(0, 600)
                }));
            return {
                query,
                results,
                note: results.length === 0 ? 'No results from official Canadian sources — try rephrasing the query.' : undefined
            };
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : 'Canadian tax lookup failed.'
            };
        }
    }
});
// ── TEMPLATE WORKFLOW: 3 inputs → a calculation with context ─────────────────
// A small, self-contained example. Give it three inputs (type them in chat or
// attach a file with them): a gross income amount, its currency, and a tax year.
// It converts to CAD with the LIVE Bank of Canada rate, then estimates combined
// corporate tax using a $500k small-business threshold. The rates are illustrative
// (returned in `assumptions` so you see the "context") — not tax advice.
const SMALL_BIZ_THRESHOLD_CAD = 500_000;
const SMALL_BIZ_RATE = 0.122; // combined federal+provincial small-business rate (illustrative)
const GENERAL_RATE = 0.265; // combined general corporate rate (illustrative)
const estimateForeignIncomeTax = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: 'TEMPLATE (3 inputs → result): estimate Canadian corporate tax on foreign-currency income. ' + 'Requires grossIncome (amount in its foreign currency), currency (code like USD), and taxYear. ' + 'Converts to CAD with the live Bank of Canada rate, applies a combined corporate rate with a ' + '$500k small-business threshold, and returns a full breakdown. If any of the three inputs is ' + 'missing, ask the user for it before calling.',
    inputSchema: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        grossIncome: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe('gross income amount in the foreign currency, e.g. 250000'),
        currency: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('the income currency code, e.g. USD'),
        taxYear: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe('the tax year, e.g. 2024')
    }),
    execute: async ({ grossIncome, currency, taxYear })=>{
        const from = currency.toUpperCase();
        // 1) Convert to CAD using the live annual-average FX rate.
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
        // 2) Progressive combined-rate estimate — this is the "context"/rules.
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
    }
});
// ── WORKFLOW-BUILDER ACTIONS (demo echoes on this page) ──────────────────────
// These mirror your real useCopilotAction tools. On the Agent Lab page there is no
// canvas, so they just echo what they WOULD do — which lets you watch the agent
// decide to call them. On the real builder these act on the workflow.
const focusBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: 'Focus a block on the workflow-builder canvas by id.',
    inputSchema: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        blockId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
    }),
    execute: ({ blockId })=>Promise.resolve({
            wouldFocus: blockId,
            note: 'demo on Agent Lab — acts for real on the builder canvas'
        })
});
const addBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: 'Add a block to the workflow by its catalog id.',
    inputSchema: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        catalogId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('catalog id of the block type to add'),
        label: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('optional custom label')
    }),
    execute: ({ catalogId, label })=>Promise.resolve({
            wouldAdd: catalogId,
            label: label ?? null,
            note: 'demo on Agent Lab — acts for real on the builder canvas'
        })
});
const editBlockConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: 'Edit a config value on a block.',
    inputSchema: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        blockId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        key: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('the config key to set, e.g. "overrideRate"'),
        value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('the new value (JSON-encoded where applicable)')
    }),
    execute: ({ blockId, key, value })=>Promise.resolve({
            wouldEdit: {
                blockId,
                key,
                value
            },
            note: 'demo on Agent Lab — acts for real on the builder canvas'
        })
});
function chunkDocument(name, text, size = 700) {
    const lines = text.split('\n');
    const chunks = [];
    let buf = '';
    let index = 0;
    for (const line of lines){
        if (buf.length + line.length + 1 > size && buf) {
            chunks.push({
                doc: name,
                index,
                text: buf
            });
            index += 1;
            buf = line;
        } else {
            buf = buf ? `${buf}\n${line}` : line;
        }
    }
    if (buf.trim()) {
        chunks.push({
            doc: name,
            index,
            text: buf
        });
    }
    return chunks;
}
function scoreChunk(text, terms) {
    const lower = text.toLowerCase();
    let score = 0;
    for (const term of terms){
        let pos = lower.indexOf(term);
        while(pos !== -1){
            score += 1;
            pos = lower.indexOf(term, pos + term.length);
        }
    }
    return score;
}
function createSearchDocumentsTool(documents) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
        description: "Search the user's attached documents for a query and return only the most relevant passages. " + 'Use this to read files that are too big to load whole. Call it with a focused query (keywords work best), ' + 'then answer from the passages it returns.',
        inputSchema: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('what to look for — keywords or a short phrase'),
            maxResults: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().describe('how many passages to return (default 5, max 10)')
        }),
        execute: async ({ query, maxResults })=>{
            if (documents.length === 0) {
                return {
                    matches: [],
                    note: 'No documents are attached — ask the user to attach a file first.'
                };
            }
            const terms = [
                ...new Set(query.toLowerCase().match(/[a-z0-9]{2,}/g) ?? [])
            ];
            if (terms.length === 0) {
                return {
                    matches: [],
                    note: 'The query had no searchable keywords.'
                };
            }
            const chunks = documents.flatMap((d)=>chunkDocument(d.name, d.text));
            const limit = Math.min(Math.max(maxResults ?? 5, 1), 10);
            const matches = chunks.map((c)=>({
                    document: c.doc,
                    passage: c.text.slice(0, 800),
                    score: scoreChunk(c.text, terms)
                })).filter((c)=>c.score > 0).sort((a, b)=>b.score - a.score).slice(0, limit);
            return {
                query,
                chunksSearched: chunks.length,
                matches,
                note: matches.length === 0 ? 'No passages matched those keywords — try different terms.' : undefined
            };
        }
    });
}
const TOOLS = {
    getCurrentDateTime,
    calculate,
    getWeatherDemo,
    rememberNote,
    recallNotes,
    getFxRate,
    fetchWebPage,
    searchCanadianTax,
    estimateForeignIncomeTax,
    focusBlock,
    addBlock,
    editBlockConfig
};
}),
"[project]/features/agent-lab/agent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Agent Lab — THE AGENT LOOP (server only).
//
// This is the whole "agent": give the model tools + a stop condition, and it will
// call tools and re-think until it can answer. Everything the builder page can
// configure (model, system prompt, temperature, step cap, enabled tools, attached
// documents) is just an argument here.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "resolveModel",
    ()=>resolveModel,
    "runAgent",
    ()=>runAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$102_zod$40$4$2e$1$2e$12$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/ai@5.0.102_zod@4.1.12/node_modules/ai/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$openai$40$2$2e$0$2e$111_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@ai-sdk+openai@2.0.111_zod@4.1.12/node_modules/@ai-sdk/openai/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/agent-lab/catalog.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$model$2d$router$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/agent-lab/model-router.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/agent-lab/tools.ts [app-route] (ecmascript)");
;
;
;
;
;
function resolveModel(modelId) {
    if (modelId.includes('/')) {
        return modelId; // a bare string routes through the AI Gateway
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$openai$40$2$2e$0$2e$111_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["openai"])(modelId);
}
// Cap how much attached-document text we inject. The whole thing is sent on EVERY
// turn, so an unbounded set would balloon cost/latency (this is context management).
const MAX_DOC_CONTEXT_CHARS = 90_000;
// Build the "knowledge" block from the attached documents + report what actually
// fit within the cap, so the UI can show the truth.
function buildKnowledge(documents) {
    if (documents.length === 0) {
        return {
            block: '',
            context: {
                count: 0,
                chars: 0,
                names: []
            }
        };
    }
    let budget = MAX_DOC_CONTEXT_CHARS;
    const parts = [];
    const names = [];
    for (const doc of documents){
        if (budget <= 0) {
            break;
        }
        const slice = doc.text.slice(0, budget);
        budget -= slice.length;
        parts.push(`### ${doc.name}\n${slice}`);
        names.push(doc.name);
    }
    const block = '\n\n## Attached documents (knowledge the user gave you)\n' + 'Use these to answer when relevant and cite the document name. ' + "If the answer is not in them, say so — don't invent it.\n\n" + parts.join('\n\n');
    const chars = parts.reduce((sum, p)=>sum + p.length, 0);
    return {
        block,
        context: {
            count: names.length,
            chars,
            names
        }
    };
}
async function runAgent(opts) {
    // Hand the model only the tools that are checked in the builder. searchDocuments
    // is document-aware, so it's built per request with the current documents.
    const activeTools = {};
    for (const id of opts.enabledTools){
        if (id === 'searchDocuments') {
            activeTools[id] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSearchDocumentsTool"])(opts.documents);
        } else if (__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TOOLS"][id]) {
            activeTools[id] = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TOOLS"][id];
        }
    }
    // Build the system prompt. In "full" mode the whole documents are injected; in
    // "retrieval" mode they are NOT (that's the point) — we tell the model they exist
    // and to call searchDocuments to read only the relevant passages.
    let system = opts.system || __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$catalog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_SYSTEM_PROMPT"];
    let docContext;
    if (opts.docMode === 'retrieval' && opts.documents.length > 0) {
        const names = opts.documents.map((d)=>d.name);
        system += '\n\n## Attached documents (NOT loaded here)\n' + `The user attached ${names.length} document(s): ${names.join(', ')}. ` + 'Their full text is NOT in your context. To answer questions about them, call the ' + '`searchDocuments` tool with a focused query, then answer from the passages it returns. ' + 'If nothing relevant comes back, say so.';
        docContext = {
            count: names.length,
            chars: 0,
            names
        };
    } else {
        const knowledge = buildKnowledge(opts.documents);
        system += knowledge.block;
        docContext = knowledge.context;
    }
    // Model router: decide the provider knobs for THIS model (features/agent-lab/model-router.ts).
    //   • sendTemperature=false → omit it (the Opus 4.7/4.8 · Sonnet 5 · Fable 5 family 400s on it)
    //   • providerOptions       → Anthropic `effort` (thinking depth), when the model supports it
    //   • cacheSystem           → cache the big system/doc block so re-runs read it at ~10% price
    const plan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$model$2d$router$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["planForModel"])(opts.model || 'gpt-4o', {
        effort: opts.effort
    });
    // Prompt caching attaches to a message part, so when caching we move the system prompt
    // (which carries the attached documents in "full" mode) into a cached system MESSAGE and
    // drop the top-level `system` string. Non-cached models keep the plain `system` param.
    const messages = plan.cacheSystem ? [
        {
            role: 'system',
            content: system,
            providerOptions: {
                anthropic: {
                    cacheControl: {
                        type: 'ephemeral'
                    }
                }
            }
        },
        ...opts.messages
    ] : opts.messages;
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$102_zod$40$4$2e$1$2e$12$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generateText"])({
        model: resolveModel(opts.model || 'gpt-4o'),
        ...plan.cacheSystem ? {} : {
            system
        },
        ...plan.sendTemperature ? {
            temperature: opts.temperature
        } : {},
        ...plan.providerOptions ? {
            providerOptions: plan.providerOptions
        } : {},
        tools: activeTools,
        stopWhen: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$102_zod$40$4$2e$1$2e$12$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["stepCountIs"])(opts.maxSteps || 6),
        messages
    });
    // Flatten the steps so the page can SHOW exactly what the agent did each step.
    const steps = result.steps.map((s, i)=>({
            step: i + 1,
            text: s.text ?? '',
            toolCalls: s.toolCalls.map((tc)=>({
                    tool: tc.toolName,
                    input: tc.input
                })),
            toolResults: s.toolResults.map((tr)=>({
                    tool: tr.toolName,
                    output: tr.output
                }))
        }));
    return {
        text: result.text,
        steps,
        docContext,
        usage: {
            inputTokens: result.usage.inputTokens,
            outputTokens: result.usage.outputTokens,
            totalTokens: result.usage.totalTokens,
            cachedInputTokens: result.usage.cachedInputTokens
        },
        applied: {
            provider: plan.provider,
            effort: plan.effort,
            cache: plan.cacheSystem,
            temperatureSent: plan.sendTemperature
        }
    };
}
}),
"[project]/app/api/agent-lab/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/agent-lab — the backend the Agent Lab page calls.
//
// Self-contained: it does NOT touch the CopilotKit chat pipeline
// (app/api/copilotkit/route.ts). It reuses the same OPENAI_API_KEY, plus the AI
// Gateway (AI_GATEWAY_API_KEY) for switching to non-OpenAI models.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$auth$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/platform/auth/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/agent-lab/agent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$model$2d$router$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/agent-lab/model-router.ts [app-route] (ecmascript)");
;
;
;
const runtime = 'nodejs';
async function POST(req) {
    try {
        // Protect the deployed (Vercel) endpoint so it can't spend your credits
        // anonymously. Left open in local dev so you can test without signing in.
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$auth$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"].api.getSession({
            headers: req.headers
        });
        if (!session?.user && ("TURBOPACK compile-time value", "development") === 'production') //TURBOPACK unreachable
        ;
        const body = await req.json();
        const messages = (body.messages ?? []).map((m)=>({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content
            }));
        const documents = (Array.isArray(body.documents) ? body.documents : []).filter((d)=>typeof d?.name === 'string' && typeof d?.text === 'string');
        const out = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runAgent"])({
            model: body.model ?? 'gpt-4o',
            system: body.system ?? '',
            temperature: typeof body.temperature === 'number' ? body.temperature : 0.7,
            maxSteps: typeof body.maxSteps === 'number' ? body.maxSteps : 6,
            enabledTools: Array.isArray(body.enabledTools) ? body.enabledTools : [],
            messages,
            documents,
            docMode: body.docMode === 'retrieval' ? 'retrieval' : 'full',
            effort: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$agent$2d$lab$2f$model$2d$router$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EFFORT_LEVELS"].includes(body.effort) ? body.effort : undefined
        });
        return Response.json(out);
    } catch (err) {
        // Send the error back so the page can show it (missing key, bad model id, …).
        return Response.json({
            error: err instanceof Error ? err.message : String(err)
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bb96e549._.js.map