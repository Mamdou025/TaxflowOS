(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/plugins/clerk/test.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "testClerk",
    ()=>testClerk
]);
async function testClerk(credentials) {
    try {
        const secretKey = credentials.CLERK_SECRET_KEY;
        if (!secretKey) {
            return {
                success: false,
                error: "Secret key is required"
            };
        }
        // Validate format - Clerk secret keys start with sk_live_ or sk_test_
        if (!secretKey.startsWith("sk_live_") && !secretKey.startsWith("sk_test_")) {
            return {
                success: false,
                error: "Invalid secret key format. Clerk secret keys start with 'sk_live_' or 'sk_test_'"
            };
        }
        // Test the connection by fetching users list (limit 1)
        const response = await fetch("https://api.clerk.com/v1/users?limit=1", {
            headers: {
                Authorization: `Bearer ${secretKey}`,
                "Content-Type": "application/json",
                "User-Agent": "workflow-builder.dev"
            }
        });
        if (!response.ok) {
            const error = await response.json().catch(()=>({}));
            return {
                success: false,
                error: error.errors?.[0]?.message || `API error: ${response.status}`
            };
        }
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

//# sourceMappingURL=plugins_clerk_test_ts_dde2f7f2._.js.map