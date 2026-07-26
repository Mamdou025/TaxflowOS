module.exports = [
"[project]/plugins/firecrawl/test.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
];

//# sourceMappingURL=plugins_firecrawl_test_ts_c249bd63._.js.map