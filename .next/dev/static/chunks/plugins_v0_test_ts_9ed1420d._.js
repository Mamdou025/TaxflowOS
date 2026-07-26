(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/plugins/v0/test.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "testV0",
    ()=>testV0
]);
async function testV0(credentials) {
    try {
        const apiKey = credentials.V0_API_KEY;
        if (!apiKey) {
            return {
                success: false,
                error: "API key is required"
            };
        }
        // Test the API key by making a request to get user info
        const { createClient } = await __turbopack_context__.A("[project]/node_modules/.pnpm/v0-sdk@0.15.1/node_modules/v0-sdk/dist/index.js [app-client] (ecmascript, async loader)");
        const client = createClient({
            apiKey
        });
        await client.user.get();
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

//# sourceMappingURL=plugins_v0_test_ts_9ed1420d._.js.map