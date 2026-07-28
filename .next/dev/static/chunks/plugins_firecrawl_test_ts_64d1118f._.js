(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/plugins/firecrawl/test.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "testFirecrawl",
    ()=>testFirecrawl
]);
async function testFirecrawl(credentials) {
    try {
        const apiKey = credentials.FIRECRAWL_API_KEY;
        if (!apiKey) {
            return {
                success: false,
                error: "FIRECRAWL_API_KEY is required"
            };
        }
        const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                url: "https://example.com",
                formats: [
                    "markdown"
                ]
            })
        });
        if (response.ok) {
            return {
                success: true
            };
        }
        const error = await response.text();
        return {
            success: false,
            error
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

//# sourceMappingURL=plugins_firecrawl_test_ts_64d1118f._.js.map