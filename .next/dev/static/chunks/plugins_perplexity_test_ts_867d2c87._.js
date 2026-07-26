(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/plugins/perplexity/test.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "testPerplexity",
    ()=>testPerplexity
]);
async function testPerplexity(credentials) {
    try {
        const apiKey = credentials.PERPLEXITY_API_KEY;
        if (!apiKey) {
            return {
                success: false,
                error: "PERPLEXITY_API_KEY is required"
            };
        }
        // Make a lightweight API call to verify the key works
        const response = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    {
                        role: "user",
                        content: "ping"
                    }
                ],
                max_tokens: 1
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
            error: error || "Invalid API key"
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

//# sourceMappingURL=plugins_perplexity_test_ts_867d2c87._.js.map