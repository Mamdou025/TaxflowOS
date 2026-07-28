(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/plugins/linear/test.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "testLinear",
    ()=>testLinear
]);
const LINEAR_API_URL = "https://api.linear.app/graphql";
async function testLinear(credentials) {
    try {
        const apiKey = credentials.LINEAR_API_KEY;
        if (!apiKey) {
            return {
                success: false,
                error: "LINEAR_API_KEY is required"
            };
        }
        // Validate API key by fetching viewer (lightweight query)
        const response = await fetch(LINEAR_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: apiKey
            },
            body: JSON.stringify({
                query: `query { viewer { id name } }`
            })
        });
        if (!response.ok) {
            if (response.status === 401) {
                return {
                    success: false,
                    error: "Invalid API key. Please check your Linear API key."
                };
            }
            return {
                success: false,
                error: `API validation failed: HTTP ${response.status}`
            };
        }
        const result = await response.json();
        if (result.errors?.length) {
            return {
                success: false,
                error: result.errors[0].message
            };
        }
        if (!result.data?.viewer) {
            return {
                success: false,
                error: "Failed to verify Linear connection"
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

//# sourceMappingURL=plugins_linear_test_ts_6aabdea4._.js.map