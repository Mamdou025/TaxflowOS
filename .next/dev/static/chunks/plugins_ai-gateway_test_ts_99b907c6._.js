(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/plugins/ai-gateway/test.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "testAiGateway",
    ()=>testAiGateway
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$gateway$40$2$2e$0$2e$15_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$gateway$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@ai-sdk+gateway@2.0.15_zod@4.1.12/node_modules/@ai-sdk/gateway/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$102_zod$40$4$2e$1$2e$12$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/ai@5.0.102_zod@4.1.12/node_modules/ai/dist/index.mjs [app-client] (ecmascript) <locals>");
;
async function testAiGateway(credentials) {
    try {
        const apiKey = credentials.AI_GATEWAY_API_KEY;
        if (!apiKey) {
            return {
                success: false,
                error: "AI_GATEWAY_API_KEY is required"
            };
        }
        // Try a simple text generation to verify the API key works
        const gateway = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$gateway$40$2$2e$0$2e$15_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$gateway$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createGateway"])({
            apiKey
        });
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$102_zod$40$4$2e$1$2e$12$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generateText"])({
            model: gateway("openai/gpt-4o-mini"),
            prompt: "Say 'test' if you can read this."
        });
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=plugins_ai-gateway_test_ts_99b907c6._.js.map