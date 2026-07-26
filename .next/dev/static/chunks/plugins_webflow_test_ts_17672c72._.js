(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/plugins/webflow/test.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "testWebflow",
    ()=>testWebflow
]);
const WEBFLOW_API_URL = "https://api.webflow.com/v2";
async function testWebflow(credentials) {
    try {
        const apiKey = credentials.WEBFLOW_API_KEY;
        if (!apiKey) {
            return {
                success: false,
                error: "WEBFLOW_API_KEY is required"
            };
        }
        // Use the list sites endpoint to validate the API key
        const response = await fetch(`${WEBFLOW_API_URL}/sites`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${apiKey}`
            }
        });
        if (!response.ok) {
            if (response.status === 401) {
                return {
                    success: false,
                    error: "Invalid API key. Please check your Webflow API token."
                };
            }
            return {
                success: false,
                error: `API validation failed: HTTP ${response.status}`
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

//# sourceMappingURL=plugins_webflow_test_ts_17672c72._.js.map