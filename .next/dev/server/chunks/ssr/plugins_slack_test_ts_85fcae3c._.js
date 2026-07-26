module.exports = [
"[project]/plugins/slack/test.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "testSlack",
    ()=>testSlack
]);
const SLACK_API_URL = "https://slack.com/api";
async function testSlack(credentials) {
    try {
        const apiKey = credentials.SLACK_API_KEY;
        if (!apiKey) {
            return {
                success: false,
                error: "SLACK_API_KEY is required"
            };
        }
        const response = await fetch(`${SLACK_API_URL}/auth.test`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });
        if (!response.ok) {
            return {
                success: false,
                error: `API validation failed: HTTP ${response.status}`
            };
        }
        const result = await response.json();
        if (!result.ok) {
            return {
                success: false,
                error: result.error || "Invalid Slack Bot Token"
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
}),
];

//# sourceMappingURL=plugins_slack_test_ts_85fcae3c._.js.map