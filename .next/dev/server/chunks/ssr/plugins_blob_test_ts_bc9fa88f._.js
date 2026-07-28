module.exports = [
"[project]/plugins/blob/test.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "testBlob",
    ()=>testBlob
]);
const BLOB_API_URL = "https://blob.vercel-storage.com";
async function testBlob(credentials) {
    try {
        const token = credentials.BLOB_READ_WRITE_TOKEN;
        if (!token) {
            return {
                success: false,
                error: "BLOB_READ_WRITE_TOKEN is required"
            };
        }
        if (!token.startsWith("vercel_blob_rw_")) {
            return {
                success: false,
                error: "Invalid token format. Vercel Blob tokens start with 'vercel_blob_rw_'"
            };
        }
        // Test the token by listing blobs (lightweight read operation)
        const response = await fetch(BLOB_API_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                return {
                    success: false,
                    error: "Invalid token. Please check your Vercel Blob token."
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
}),
];

//# sourceMappingURL=plugins_blob_test_ts_bc9fa88f._.js.map