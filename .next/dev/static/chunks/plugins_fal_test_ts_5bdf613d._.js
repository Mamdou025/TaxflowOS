(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/plugins/fal/test.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "testFal",
    ()=>testFal
]);
async function testFal(credentials) {
    try {
        const apiKey = credentials.FAL_API_KEY;
        if (!apiKey) {
            return {
                success: false,
                error: "FAL_API_KEY is required"
            };
        }
        // Test with a simple API call to check credentials
        const response = await fetch("https://queue.fal.run/fal-ai/flux/schnell", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Key ${apiKey}`
            },
            body: JSON.stringify({
                prompt: "test",
                num_images: 1,
                image_size: "square"
            })
        });
        if (response.ok) {
            return {
                success: true
            };
        }
        // Check for auth errors specifically
        if (response.status === 401 || response.status === 403) {
            return {
                success: false,
                error: "Invalid API key"
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

//# sourceMappingURL=plugins_fal_test_ts_5bdf613d._.js.map