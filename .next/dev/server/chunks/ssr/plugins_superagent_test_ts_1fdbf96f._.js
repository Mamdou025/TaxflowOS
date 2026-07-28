module.exports = [
"[project]/plugins/superagent/test.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "testSuperagent",
    ()=>testSuperagent
]);
async function testSuperagent(credentials) {
    try {
        const apiKey = credentials.SUPERAGENT_API_KEY;
        if (!apiKey) {
            return {
                success: false,
                error: "SUPERAGENT_API_KEY is required"
            };
        }
        const response = await fetch("https://app.superagent.sh/api/guard", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                text: "Hello, this is a test message."
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

//# sourceMappingURL=plugins_superagent_test_ts_1fdbf96f._.js.map