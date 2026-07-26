(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/platform/auth/ui/provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function AuthProvider({ children }) {
    // No automatic session creation - let users browse anonymously
    // Anonymous sessions will be created on-demand when needed
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/platform/api-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API Client for making type-safe API calls to the backend
 * Replaces server actions with API endpoints
 */ __turbopack_context__.s([
    "ApiError",
    ()=>ApiError,
    "aiApi",
    ()=>aiApi,
    "aiGatewayApi",
    ()=>aiGatewayApi,
    "api",
    ()=>api,
    "integrationApi",
    ()=>integrationApi,
    "userApi",
    ()=>userApi,
    "workflowApi",
    ()=>workflowApi
]);
class ApiError extends Error {
    status;
    constructor(status, message){
        super(message);
        this.status = status;
        this.name = "ApiError";
    }
}
// Helper function to make API calls
async function apiCall(endpoint, options) {
    const response = await fetch(endpoint, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers
        }
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({
                error: "Unknown error"
            }));
        throw new ApiError(response.status, error.error || "Request failed");
    }
    return response.json();
}
function handleSetName(op, state) {
    if (op?.name) {
        state.currentData.name = op.name;
    }
}
function handleSetDescription(op, state) {
    if (op?.description) {
        state.currentData.description = op.description;
    }
}
function handleAddNode(op, state) {
    if (op?.node) {
        state.currentData.nodes = [
            ...state.currentData.nodes,
            op.node
        ];
    }
}
function handleAddEdge(op, state) {
    if (op?.edge) {
        state.currentData.edges = [
            ...state.currentData.edges,
            op.edge
        ];
    }
}
function handleRemoveNode(op, state) {
    if (op?.nodeId) {
        state.currentData.nodes = state.currentData.nodes.filter((n)=>n.id !== op.nodeId);
        state.currentData.edges = state.currentData.edges.filter((e)=>e.source !== op.nodeId && e.target !== op.nodeId);
    }
}
function handleRemoveEdge(op, state) {
    if (op?.edgeId) {
        state.currentData.edges = state.currentData.edges.filter((e)=>e.id !== op.edgeId);
    }
}
function handleUpdateNode(op, state) {
    if (op?.nodeId && op.updates) {
        state.currentData.nodes = state.currentData.nodes.map((n)=>{
            if (n.id === op.nodeId) {
                return {
                    ...n,
                    ...op.updates?.position ? {
                        position: op.updates.position
                    } : {},
                    ...op.updates?.data ? {
                        data: {
                            ...n.data,
                            ...op.updates.data
                        }
                    } : {}
                };
            }
            return n;
        });
    }
}
const operationHandlers = {
    setName: handleSetName,
    setDescription: handleSetDescription,
    addNode: handleAddNode,
    addEdge: handleAddEdge,
    removeNode: handleRemoveNode,
    removeEdge: handleRemoveEdge,
    updateNode: handleUpdateNode
};
function applyOperation(op, state) {
    if (!op?.op) {
        return;
    }
    const handler = operationHandlers[op.op];
    if (handler) {
        handler(op, state);
    }
}
function processStreamLine(line, onUpdate, state) {
    if (!line.trim()) {
        return;
    }
    try {
        const message = JSON.parse(line);
        if (message.type === "operation" && message.operation) {
            applyOperation(message.operation, state);
            onUpdate({
                ...state.currentData
            });
        } else if (message.type === "error") {
            console.error("[API Client] Error:", message.error);
            throw new Error(message.error);
        }
    } catch (error) {
        console.error("[API Client] Failed to parse JSONL line:", error);
    }
}
function processStreamChunk(value, decoder, onUpdate, state) {
    state.buffer += decoder.decode(value, {
        stream: true
    });
    // Process complete JSONL lines
    const lines = state.buffer.split("\n");
    state.buffer = lines.pop() || "";
    for (const line of lines){
        processStreamLine(line, onUpdate, state);
    }
}
const aiApi = {
    generate: (prompt, existingWorkflow)=>apiCall("/api/ai/generate", {
            method: "POST",
            body: JSON.stringify({
                prompt,
                existingWorkflow
            })
        }),
    generateStream: async (prompt, onUpdate, existingWorkflow)=>{
        const response = await fetch("/api/ai/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt,
                existingWorkflow
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (!response.body) {
            throw new Error("No response body");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        const state = {
            buffer: "",
            currentData: existingWorkflow ? {
                nodes: existingWorkflow.nodes || [],
                edges: existingWorkflow.edges || [],
                name: existingWorkflow.name
            } : {
                nodes: [],
                edges: []
            }
        };
        try {
            while(true){
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                processStreamChunk(value, decoder, onUpdate, state);
            }
            return state.currentData;
        } finally{
            reader.releaseLock();
        }
    }
};
const integrationApi = {
    // List all integrations
    getAll: (type)=>apiCall(`/api/integrations${type ? `?type=${type}` : ""}`),
    // Get single integration with config
    get: (id)=>apiCall(`/api/integrations/${id}`),
    // Create integration
    create: (data)=>apiCall("/api/integrations", {
            method: "POST",
            body: JSON.stringify(data)
        }),
    // Update integration
    update: (id, data)=>apiCall(`/api/integrations/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }),
    // Delete integration
    delete: (id)=>apiCall(`/api/integrations/${id}`, {
            method: "DELETE"
        }),
    // Test existing integration connection
    testConnection: (integrationId)=>apiCall(`/api/integrations/${integrationId}/test`, {
            method: "POST"
        }),
    // Test credentials without saving
    testCredentials: (data)=>apiCall("/api/integrations/test", {
            method: "POST",
            body: JSON.stringify(data)
        })
};
const userApi = {
    get: ()=>apiCall("/api/user"),
    update: (data)=>apiCall("/api/user", {
            method: "PATCH",
            body: JSON.stringify(data)
        })
};
const workflowApi = {
    // Get all workflows
    getAll: ()=>apiCall("/api/workflows"),
    // Get a specific workflow
    getById: (id)=>apiCall(`/api/workflows/${id}`),
    // Create a new workflow
    create: (workflow)=>apiCall("/api/workflows/create", {
            method: "POST",
            body: JSON.stringify(workflow)
        }),
    // Update a workflow
    update: (id, workflow)=>apiCall(`/api/workflows/${id}`, {
            method: "PATCH",
            body: JSON.stringify(workflow)
        }),
    // Delete a workflow
    delete: (id)=>apiCall(`/api/workflows/${id}`, {
            method: "DELETE"
        }),
    // Duplicate a workflow
    duplicate: (id)=>apiCall(`/api/workflows/${id}/duplicate`, {
            method: "POST"
        }),
    // Get current workflow state
    getCurrent: ()=>apiCall("/api/workflows/current"),
    // Save current workflow state
    saveCurrent: (nodes, edges)=>apiCall("/api/workflows/current", {
            method: "POST",
            body: JSON.stringify({
                nodes,
                edges
            })
        }),
    // Execute workflow
    execute: (id, input = {})=>apiCall(`/api/workflow/${id}/execute`, {
            method: "POST",
            body: JSON.stringify({
                input
            })
        }),
    // Trigger workflow via webhook
    triggerWebhook: (id, input = {})=>apiCall(`/api/workflows/${id}/webhook`, {
            method: "POST",
            body: JSON.stringify(input)
        }),
    // Get workflow code
    getCode: (id)=>apiCall(`/api/workflows/${id}/code`),
    // Get executions
    getExecutions: (id)=>apiCall(`/api/workflows/${id}/executions`),
    // Delete executions
    deleteExecutions: (id)=>apiCall(`/api/workflows/${id}/executions`, {
            method: "DELETE"
        }),
    // Get execution logs
    getExecutionLogs: (executionId)=>apiCall(`/api/workflows/executions/${executionId}/logs`),
    // Get execution status
    getExecutionStatus: (executionId)=>apiCall(`/api/workflows/executions/${executionId}/status`),
    // Download workflow
    download: (id)=>apiCall(`/api/workflows/${id}/download`),
    // Auto-save with debouncing (kept for backwards compatibility)
    autoSaveCurrent: (()=>{
        let autosaveTimeout = null;
        const AUTOSAVE_DELAY = 2000;
        return (nodes, edges)=>{
            if (autosaveTimeout) {
                clearTimeout(autosaveTimeout);
            }
            autosaveTimeout = setTimeout(()=>{
                workflowApi.saveCurrent(nodes, edges).catch((error)=>{
                    console.error("Auto-save failed:", error);
                });
            }, AUTOSAVE_DELAY);
        };
    })(),
    // Auto-save specific workflow with debouncing
    autoSaveWorkflow: (()=>{
        let autosaveTimeout = null;
        const AUTOSAVE_DELAY = 2000;
        return (id, data, debounce = true)=>{
            if (!debounce) {
                return workflowApi.update(id, data);
            }
            if (autosaveTimeout) {
                clearTimeout(autosaveTimeout);
            }
            autosaveTimeout = setTimeout(()=>{
                workflowApi.update(id, data).catch((error)=>{
                    console.error("Auto-save failed:", error);
                });
            }, AUTOSAVE_DELAY);
        };
    })()
};
const aiGatewayApi = {
    // Get status (whether feature is enabled, user has managed key, etc.)
    getStatus: ()=>apiCall("/api/ai-gateway/status"),
    // Get available Vercel teams
    getTeams: ()=>apiCall("/api/ai-gateway/teams"),
    // Grant consent and create managed API key
    consent: (teamId, teamName)=>apiCall("/api/ai-gateway/consent", {
            method: "POST",
            body: JSON.stringify({
                teamId,
                teamName
            })
        }),
    // Revoke consent and delete managed API key
    revokeConsent: ()=>apiCall("/api/ai-gateway/consent", {
            method: "DELETE"
        })
};
const api = {
    ai: aiApi,
    aiGateway: aiGatewayApi,
    integration: integrationApi,
    user: userApi,
    workflow: workflowApi
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/platform/auth/auth-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authClient",
    ()=>authClient,
    "linkSocial",
    ()=>linkSocial,
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut,
    "signUp",
    ()=>signUp,
    "useSession",
    ()=>useSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$plugins$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/client/plugins/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/client/react/index.mjs [app-client] (ecmascript)");
;
;
const authClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createAuthClient"])({
    baseURL: ("TURBOPACK compile-time truthy", 1) ? window.location.origin : "TURBOPACK unreachable",
    plugins: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$plugins$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["anonymousClient"])()
    ]
});
const { signIn, signOut, signUp, useSession, linkSocial } = authClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "getErrorMessage",
    ()=>getErrorMessage,
    "getErrorMessageAsync",
    ()=>getErrorMessageAsync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$3$2e$1$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@3.3.1/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$3$2e$1$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function getErrorMessage(error) {
    // Handle null/undefined
    if (error === null || error === undefined) {
        return "Unknown error";
    }
    // Handle Error instances (and their subclasses)
    if (error instanceof Error) {
        // Some errors have a cause property with more details
        if (error.cause && error.cause instanceof Error) {
            return `${error.message}: ${error.cause.message}`;
        }
        return error.message;
    }
    // Handle strings
    if (typeof error === "string") {
        return error;
    }
    // Handle objects
    if (typeof error === "object") {
        const obj = error;
        // Check for common error message properties
        if (typeof obj.message === "string" && obj.message) {
            return obj.message;
        }
        // AI SDK often wraps errors in responseBody or data
        if (obj.responseBody && typeof obj.responseBody === "object") {
            const body = obj.responseBody;
            if (typeof body.error === "string") {
                return body.error;
            }
            if (body.error && typeof body.error === "object" && typeof body.error.message === "string") {
                return body.error.message;
            }
        }
        // Check for nested error property
        if (typeof obj.error === "string" && obj.error) {
            return obj.error;
        }
        if (obj.error && typeof obj.error === "object") {
            const nestedError = obj.error;
            if (typeof nestedError.message === "string") {
                return nestedError.message;
            }
        }
        // Check for data.error pattern (common in API responses)
        if (obj.data && typeof obj.data === "object") {
            const data = obj.data;
            if (typeof data.error === "string") {
                return data.error;
            }
            if (typeof data.message === "string") {
                return data.message;
            }
        }
        // Check for reason property (common in some error types)
        if (typeof obj.reason === "string" && obj.reason) {
            return obj.reason;
        }
        // Check for statusText (HTTP errors)
        if (typeof obj.statusText === "string" && obj.statusText) {
            const status = typeof obj.status === "number" ? ` (${obj.status})` : "";
            return `${obj.statusText}${status}`;
        }
        // Try to stringify the error object (but avoid [object Object])
        try {
            const stringified = JSON.stringify(error, null, 0);
            if (stringified && stringified !== "{}" && stringified.length < 500) {
                return stringified;
            }
        } catch  {
        // Ignore stringify errors
        }
        // Last resort: use Object.prototype.toString
        const toString = Object.prototype.toString.call(error);
        if (toString !== "[object Object]") {
            return toString;
        }
    }
    return "Unknown error";
}
async function getErrorMessageAsync(error) {
    // If error is a Promise, await it to get the actual error
    if (error instanceof Promise) {
        try {
            const resolvedValue = await error;
            // The promise resolved - check if it contains error info
            return getErrorMessage(resolvedValue);
        } catch (rejectedError) {
            return getErrorMessage(rejectedError);
        }
    }
    // Check if it's a thenable (Promise-like)
    if (error && typeof error === "object" && "then" in error && typeof error.then === "function") {
        try {
            const resolvedValue = await error;
            // The promise resolved - check if it contains error info
            return getErrorMessage(resolvedValue);
        } catch (rejectedError) {
            return getErrorMessage(rejectedError);
        }
    }
    return getErrorMessage(error);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/atoms/overlay.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "closeAllOverlaysAtom",
    ()=>closeAllOverlaysAtom,
    "closeOverlayAtom",
    ()=>closeOverlayAtom,
    "hasOverlaysAtom",
    ()=>hasOverlaysAtom,
    "openOverlayAtom",
    ()=>openOverlayAtom,
    "overlayDepthAtom",
    ()=>overlayDepthAtom,
    "overlayStackAtom",
    ()=>overlayStackAtom,
    "popOverlayAtom",
    ()=>popOverlayAtom,
    "pushOverlayAtom",
    ()=>pushOverlayAtom,
    "replaceOverlayAtom",
    ()=>replaceOverlayAtom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-client] (ecmascript)");
;
const overlayStackAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])([]);
const hasOverlaysAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])((get)=>get(overlayStackAtom).length > 0);
const overlayDepthAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])((get)=>get(overlayStackAtom).length);
/**
 * Generate a unique ID for overlay instances
 */ function generateOverlayId() {
    return `overlay-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
const openOverlayAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (_get, set, params)=>{
    const id = generateOverlayId();
    const item = {
        id,
        component: params.component,
        props: params.props ?? {},
        options: params.options ?? {}
    };
    set(overlayStackAtom, [
        item
    ]);
    return id;
});
const pushOverlayAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, params)=>{
    const id = generateOverlayId();
    const item = {
        id,
        component: params.component,
        props: params.props ?? {},
        options: params.options ?? {}
    };
    set(overlayStackAtom, [
        ...get(overlayStackAtom),
        item
    ]);
    return id;
});
const popOverlayAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set)=>{
    const stack = get(overlayStackAtom);
    if (stack.length <= 1) {
        // Call onClose for the last item
        const item = stack[0];
        item?.options.onClose?.();
        set(overlayStackAtom, []);
        return;
    }
    // Pop the top item and call its onClose
    const poppedItem = stack.at(-1);
    poppedItem?.options.onClose?.();
    set(overlayStackAtom, stack.slice(0, -1));
});
const replaceOverlayAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, params)=>{
    const stack = get(overlayStackAtom);
    const id = generateOverlayId();
    const item = {
        id,
        component: params.component,
        props: params.props ?? {},
        options: params.options ?? {}
    };
    if (stack.length === 0) {
        set(overlayStackAtom, [
            item
        ]);
    } else {
        // Call onClose for the replaced item
        const poppedItem = stack.at(-1);
        poppedItem?.options.onClose?.();
        set(overlayStackAtom, [
            ...stack.slice(0, -1),
            item
        ]);
    }
    return id;
});
const closeAllOverlaysAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set)=>{
    const stack = get(overlayStackAtom);
    // Call onClose for all items
    for (const item of stack){
        item.options.onClose?.();
    }
    set(overlayStackAtom, []);
});
const closeOverlayAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, id)=>{
    const stack = get(overlayStackAtom);
    const index = stack.findIndex((item)=>item.id === id);
    if (index === -1) {
        return;
    }
    // Call onClose for all items from this index onwards
    for(let i = index; i < stack.length; i++){
        stack[i].options.onClose?.();
    }
    set(overlayStackAtom, stack.slice(0, index));
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/view-transition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Client-side View Transition helper.
//
// `@view-transition { navigation: auto }` (globals.css) only animates
// cross-document navigations — Next's client-side router.push never triggers it.
// So to transition between routes on a SPA nav (e.g. the /home → / "Scope" move)
// we explicitly wrap the navigation in document.startViewTransition(). The root
// crossfade is styled in globals.css (::view-transition-old/new(root)).
//
// The VT snapshots the "new" DOM when the callback's promise resolves, so we give
// React a couple of frames to commit the destination route before resolving.
__turbopack_context__.s([
    "viewTransitionNav",
    ()=>viewTransitionNav
]);
function viewTransitionNav(navigate) {
    if (typeof document === 'undefined') {
        navigate();
        return;
    }
    const doc = document;
    const reduced = ("TURBOPACK compile-time value", "object") !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!doc.startViewTransition || reduced) {
        navigate();
        return;
    }
    doc.startViewTransition(()=>new Promise((resolve)=>{
            navigate();
            // Wait for React to commit + paint the new route before the VT captures
            // its "new" snapshot; the timeout is a safety net if paint is slow.
            requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(resolve, 90)));
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/librechat-theme.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Chat palette — LIGHT NEUMORPHIC. The chat (Scope focus mode + the docked
// AssistantPanel) is a light neumorphic surface, matching the sidebar and the nav
// pill; the OTHER pages keep their dark grid background (that bg is NOT driven by
// this palette). One place to swap the chat's look. Aligned to the NEU tokens
// (components/neumorphic-sidebar.tsx).
// Theme-aware: every key maps to a --sx-* token (globals.css) whose :root value
// is the original light value and whose .dark value is the dark counterpart, so
// the chat re-skins with the `.dark` class (these are used in inline style).
__turbopack_context__.s([
    "LC",
    ()=>LC
]);
const LC = {
    bg: 'var(--sx-surface)',
    sidebar: 'var(--sx-surface)',
    panel: 'var(--sx-panel)',
    surface: 'var(--sx-raised)',
    surfaceHover: 'var(--sx-raised-hover)',
    border: 'var(--sx-hairline)',
    borderSubtle: 'var(--sx-hairline-subtle)',
    title: 'var(--sx-ink)',
    text: 'var(--sx-ink)',
    body: 'var(--sx-body)',
    muted: 'var(--sx-muted)',
    faint: 'var(--sx-faint)',
    accent: 'var(--sx-accent)',
    // Neumorphic depth (dual light/dark soft shadows) — for raised chat elements.
    shadowOut: 'var(--sx-chat-shadow-out)',
    shadowSm: 'var(--sx-chat-shadow-sm)',
    shadowIn: 'var(--sx-chat-shadow-in)'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/page-chat-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pageChatSurfacesAtom",
    ()=>pageChatSurfacesAtom,
    "usePageChat",
    ()=>usePageChat
]);
// ─────────────────────────────────────────────────────────────────────────────
// Page ⇄ Chat contract — the general pattern behind "the chat can command any
// page/panel next to it, and can bring any page/panel into the chat".
//
// Sibling of `page-menu-store.ts` (which publishes a page's *menu* into the shared
// header). Here a page publishes a *chat surface* into a registry while it's open:
//   • context  — a live snapshot the chat reads to ground answers about the page
//   • commands — named verbs the chat can invoke on the page (commandPage)
//   • Embed    — a compact React view to render the page INLINE in the chat
//                (bringIntoChat) without leaving the conversation
//
// The assistant (`use-assistant.tsx`) dispatches two GENERIC actions against this
// registry, so ANY page becomes commandable + summonable with one hook call —
// exactly how `usePageMenu` made any page's toolbar live in the shared header.
// Bespoke per-page copilots (BuilderCopilot, WorksheetCopilot) still work; this is
// the uniform contract, especially for pages with no bespoke copilot.
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const pageChatSurfacesAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])({});
function usePageChat(surface, deps = []) {
    _s();
    const set = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"])(pageChatSurfacesAtom);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePageChat.useEffect": ()=>{
            set({
                "usePageChat.useEffect": (prev)=>({
                        ...prev,
                        [surface.pageKey]: surface
                    })
            }["usePageChat.useEffect"]);
            return ({
                "usePageChat.useEffect": ()=>set({
                        "usePageChat.useEffect": (prev)=>{
                            const next = {
                                ...prev
                            };
                            delete next[surface.pageKey];
                            return next;
                        }
                    }["usePageChat.useEffect"])
            })["usePageChat.useEffect"];
        // surface is intentionally rebuilt from `deps`; pageKey/set are stable.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["usePageChat.useEffect"], [
        surface.pageKey,
        set,
        ...deps
    ]);
}
_s(usePageChat, "mSVZZ4ARpDvkpdwEttaC21+3Wyo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetAtom"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/agents.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Workflow catalog + per-workflow domain roles.
//
// There is ONE assistant in the workspace — Sina (see lib/coworkers.ts). This file
// is NOT a roster of separate personas (it used to be Sofi/Théo/Mira/Nova). It is
// the catalog of the workspace's runnable workflows and the per-workflow DOMAIN
// (label + role + live flag) that Sina applies. The detailed domain EXPERTISE text
// lives in features/assistant/runtime/agents/specialists.ts, keyed by the same
// workflow id. `WORKFLOWS` is the suggestion list shown in the composer/sidebar.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "AGENTS",
    ()=>AGENTS,
    "WORKFLOWS",
    ()=>WORKFLOWS
]);
const AGENTS = [
    {
        id: 'fapi',
        name: 'FAPI',
        role: 'Foreign accrual property income',
        workflow: 'fapi',
        live: true
    },
    {
        id: 'roulement',
        name: 'Section 85 rollover',
        role: 'Roulement fiscal (art. 85)',
        workflow: 'roulement',
        live: true
    },
    {
        id: 'expense',
        name: 'Expense reimbursement',
        role: 'Employee expense reimbursement',
        workflow: 'expense',
        live: true
    },
    {
        id: 'campaign',
        name: 'Campaign budget',
        role: 'Marketing budget allocation',
        workflow: 'campaign',
        live: true
    },
    {
        id: 'surplus',
        name: 'Surplus & T1134',
        role: 'Surplus accounts & foreign-affiliate reporting',
        live: false
    }
];
const WORKFLOWS = [
    {
        id: 'fapi',
        name: 'Calculate FAPI',
        sub: 'Foreign accrual property income',
        ready: true
    },
    {
        id: 'roulement',
        name: 'Roulement fiscal (art. 85)',
        sub: 'Rollover election → T2057',
        ready: true
    },
    {
        id: 'expense',
        name: 'Expense reimbursement',
        sub: 'Receipts → policy caps → net payable',
        ready: true
    },
    {
        id: 'campaign',
        name: 'Campaign budget allocation',
        sub: 'Requests → elect budget → projection',
        ready: true
    },
    {
        id: 'surplus',
        name: 'Surplus continuity',
        sub: 'Exempt / taxable surplus',
        ready: false
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/coworkers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Coworkers — the business-role "AI coworkers" the workspace surfaces.
//
// A Coworker is a labeled actor the user sees working: a persona agent (Sofi,
// Théo, …, derived from lib/agents.ts), the coordinating Workspace Assistant, the
// UI Concierge / Composer, or the DETERMINISTIC Workflow Engine. Every coworker
// carries an `ActorKind` so activity can be attributed truthfully — the workflow
// engine is a `workflow` actor, never mislabeled as an `agent`.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "ACTOR_KIND_LABEL",
    ()=>ACTOR_KIND_LABEL,
    "SINA",
    ()=>SINA,
    "SYSTEM",
    ()=>SYSTEM,
    "UI_COMPOSER",
    ()=>UI_COMPOSER,
    "UI_CONCIERGE",
    ()=>UI_CONCIERGE,
    "WORKFLOW_ENGINE",
    ()=>WORKFLOW_ENGINE,
    "WORKSPACE_ASSISTANT",
    ()=>WORKSPACE_ASSISTANT,
    "YOU",
    ()=>YOU,
    "coworkerForAgent",
    ()=>coworkerForAgent,
    "coworkerForMessage",
    ()=>coworkerForMessage,
    "coworkerForWorkflow",
    ()=>coworkerForWorkflow,
    "coworkerKindLabel",
    ()=>coworkerKindLabel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/agents.ts [app-client] (ecmascript)");
;
const ACTOR_KIND_LABEL = {
    human: 'Human',
    agent: 'Agent',
    workflow: 'Workflow',
    tool: 'Tool',
    system: 'System'
};
const WORKSPACE_ASSISTANT = {
    kind: 'agent',
    id: 'workspace-assistant',
    name: 'Workspace Assistant',
    role: 'Coordinates your workspace',
    accent: '#3b3b46',
    initials: 'WA'
};
const SINA = {
    kind: 'agent',
    id: 'sina',
    name: 'Sina',
    role: 'Your tax specialist',
    accent: '#18181b',
    initials: 'Si'
};
const WORKFLOW_ENGINE = {
    kind: 'workflow',
    id: 'workflow-engine',
    name: 'Workflow Engine',
    role: 'Deterministic',
    accent: '#26382c',
    initials: 'WE'
};
const UI_CONCIERGE = {
    kind: 'tool',
    id: 'ui-concierge',
    name: 'UI Concierge',
    role: 'Opens pages & components',
    accent: '#26314d',
    initials: 'UC'
};
const UI_COMPOSER = {
    kind: 'tool',
    id: 'ui-composer',
    name: 'UI Composer',
    role: 'Generates views',
    accent: '#3a274c',
    initials: 'UX'
};
const YOU = {
    kind: 'human',
    id: 'you',
    name: 'You',
    role: '',
    accent: '#52525b',
    initials: 'You'
};
const SYSTEM = {
    kind: 'system',
    id: 'system',
    name: 'System',
    role: '',
    accent: '#3f3f46',
    initials: 'Sy'
};
function coworkerForAgent(agent) {
    return {
        kind: 'agent',
        id: agent.id,
        name: agent.name,
        role: agent.role,
        accent: agent.accent,
        initials: agent.initials
    };
}
function coworkerForWorkflow(workflowId) {
    const agent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAgentForWorkflow"])(workflowId);
    return agent ? coworkerForAgent(agent) : null;
}
function coworkerKindLabel(coworker) {
    const base = ACTOR_KIND_LABEL[coworker.kind];
    if (coworker.kind === 'workflow' && coworker.role) {
        return `${base} · ${coworker.role}`;
    }
    return base;
}
// Tool names the UI Concierge is responsible for (opening/summoning existing surfaces).
const UI_CONCIERGE_TOOLS = new Set([
    'openPage',
    'bringIntoChat',
    'showWorkflowElement',
    'editField',
    'focusAnchor',
    'commandPage',
    'closePage',
    'closeAll',
    'openWorkflowBuilder'
]);
function coworkerForMessage(message) {
    const call = message?.toolCalls?.[0]?.function;
    const name = call?.name;
    // One unified agent (Sina): a plain reply and a workflow proposal are both Sina; only
    // the truthful non-agent actors (generated view / page ops) get their own attribution.
    if (!name) return SINA;
    if (name === 'generateUI') return UI_COMPOSER;
    if (name === 'runWorkflow') return SINA;
    if (UI_CONCIERGE_TOOLS.has(name)) return UI_CONCIERGE;
    return SINA;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/work-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "activeWorkCountAtom",
    ()=>activeWorkCountAtom,
    "clearWorkItemsAtom",
    ()=>clearWorkItemsAtom,
    "jumpToWork",
    ()=>jumpToWork,
    "reconcileStaleWorkAtom",
    ()=>reconcileStaleWorkAtom,
    "recordWorkItemAtom",
    ()=>recordWorkItemAtom,
    "workIdFor",
    ()=>workIdFor,
    "workItemsAtom",
    ()=>workItemsAtom,
    "workItemsChronoAtom",
    ()=>workItemsChronoAtom,
    "workItemsListAtom",
    ()=>workItemsListAtom,
    "workKeyFromText",
    ()=>workKeyFromText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla/utils.mjs [app-client] (ecmascript)");
;
;
function workIdFor(type, key) {
    return `${type}:${key}`;
}
function workKeyFromText(text) {
    let h = 2166136261;
    for(let i = 0; i < text.length; i++){
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
}
const STATUS_ORDER = {
    awaiting: 0,
    running: 1,
    open: 2,
    done: 3
};
const workItemsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atomWithStorage"])('taxflow:work-items', {});
const workItemsListAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])((get)=>{
    const items = Object.values(get(workItemsAtom));
    return items.sort((a, b)=>STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || b.updatedAt - a.updatedAt);
});
const workItemsChronoAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])((get)=>{
    const items = Object.values(get(workItemsAtom));
    return items.sort((a, b)=>b.updatedAt - a.updatedAt);
});
const activeWorkCountAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])((get)=>Object.values(get(workItemsAtom)).filter((w)=>w.status === 'awaiting' || w.status === 'running').length);
const recordWorkItemAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (_get, set, patch)=>{
    set(workItemsAtom, (prev)=>{
        const now = Date.now();
        const existing = prev[patch.id];
        const next = {
            ...existing,
            ...patch,
            createdAt: existing?.createdAt ?? now,
            updatedAt: now
        };
        return {
            ...prev,
            [patch.id]: next
        };
    });
});
const clearWorkItemsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (_get, set)=>set(workItemsAtom, {}));
const reconcileStaleWorkAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set)=>{
    const items = get(workItemsAtom);
    let changed = false;
    const next = {
        ...items
    };
    for (const [id, item] of Object.entries(items)){
        if (item.status === 'running' || item.status === 'awaiting') {
            next[id] = {
                ...item,
                status: 'open',
                detail: item.detail ? `${item.detail} · interrupted` : 'Interrupted'
            };
            changed = true;
        }
    }
    if (changed) set(workItemsAtom, next);
});
function jumpToWork(id) {
    if (typeof document === 'undefined') return false;
    const el = document.querySelector(`[data-work-id="${cssEscape(id)}"]`) ?? null;
    if (!el) return false;
    el.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
    });
    el.classList.add('cwp-anchor-flash');
    window.setTimeout(()=>el.classList.remove('cwp-anchor-flash'), 1700);
    return true;
}
function cssEscape(value) {
    // work ids are `type:key` — escape the colon for a valid attribute selector.
    const anyWin = window;
    return anyWin.CSS?.escape ? anyWin.CSS.escape(value) : value.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/composer-intent.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Composer intent — a deterministic, client-side PREVIEW of what Scope will do
// with the message you're typing. It labels the send button and names the
// specialist BEFORE you send, so an action never comes as a surprise.
//
// Advisory only. The assistant + its proposal card stay authoritative: a run
// still renders a proposal you Start, page/field ops still go through the tools.
// This never executes anything — it only mirrors the assistant's routing so the
// UI can preview it. It deliberately honours the ask-vs-act gate: a workflow
// *mention* is NOT a command — only an imperative ("run/calculate/…") is — so we
// don't promise a run when the user is only asking about FAPI.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "detectComposerIntent",
    ()=>detectComposerIntent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/agents.ts [app-client] (ecmascript)");
;
// Hypotheticals, negations and explicit holds are NEVER an action — answer instead.
const HOLD = /\b(don'?t|do not|not yet|only explain|just explain|sans lancer|ne lance pas|pas encore|what ?if|hypothetical|might|maybe|could we|would it)\b/i;
const RUN_VERB = /\b(run|start|launch|calculate|calc|compute|execute|kick off|d[ée]marre[rz]?|lance[rz]?|calcule[rz]?|ex[ée]cute[rz]?)\b/i;
const OPEN_VERB = /\b(open|show|view|display|go to|take me to|pull up|ouvre|ouvrir|montre|affiche|voir)\b/i;
const GEN_VERB = /\b(generate|create|make|build|mock|draw|plot|chart|graph|visuali[sz]e)\b/i;
// Workflow keyword → id + copy target. Mirrors the assistant's valid ids
// (fapi · roulement · expense · campaign).
const WF_KEYWORD = [
    {
        re: /\bfapi\b/i,
        id: 'fapi',
        target: 'FAPI'
    },
    {
        re: /roulement|rollover|art\.?\s*85|section\s*85|\bs\.?\s*85\b/i,
        id: 'roulement',
        target: 'the art. 85 rollover'
    },
    {
        re: /\bexpenses?\b|d[ée]penses?|reimburs|per[- ]?diem/i,
        id: 'expense',
        target: 'expenses'
    },
    {
        re: /\bcampaign\b|marketing budget|budget allocation|channel spend/i,
        id: 'campaign',
        target: 'campaign budgets'
    }
];
const PAGE_NOUN = /\b(dashboard|worksheet|worksheets|t1134|surplus|viewer|documents?)\b/i;
const VIEW_NOUN = /\b(chart|graph|dashboard|table|kpi|tiles?|view|report|form|breakdown)\b/i;
function detectComposerIntent(text) {
    const t = text.trim();
    if (!t) return null;
    // A hold / hypothetical / negation always resolves to an answer.
    if (HOLD.test(t)) return {
        action: 'answer',
        verb: 'Answer',
        sendLabel: 'Send'
    };
    const wf = WF_KEYWORD.find((w)=>w.re.test(t));
    // Run: an imperative + a known workflow → that workflow's specialist proposes it.
    if (wf && RUN_VERB.test(t)) {
        const agent = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGENTS"].find((a)=>a.workflow === wf.id && a.live);
        return {
            action: 'run',
            verb: 'Run workflow',
            sendLabel: 'Run',
            workflowId: wf.id,
            agentId: agent?.id,
            target: wf.target
        };
    }
    // Generate a one-off view (chart / table / KPIs / dashboard-of).
    if (GEN_VERB.test(t) && VIEW_NOUN.test(t)) {
        return {
            action: 'generate',
            verb: 'Generate a view',
            sendLabel: 'Build'
        };
    }
    // Open a registered page.
    if (OPEN_VERB.test(t) || PAGE_NOUN.test(t)) {
        return {
            action: 'open',
            verb: 'Open',
            sendLabel: 'Open'
        };
    }
    // A bare imperative "run the workflow" without a recognised name.
    if (RUN_VERB.test(t) && /\bworkflow\b/i.test(t)) {
        return {
            action: 'run',
            verb: 'Run workflow',
            sendLabel: 'Run'
        };
    }
    // Everything else — including a bare workflow mention or a question — is answered.
    return {
        action: 'answer',
        verb: 'Answer',
        sendLabel: 'Send'
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-mobile.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useIsMobile",
    ()=>useIsMobile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
    _s();
    const [isMobile, setIsMobile] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](undefined);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useIsMobile.useEffect": ()=>{
            const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
            const onChange = {
                "useIsMobile.useEffect.onChange": ()=>{
                    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
                }
            }["useIsMobile.useEffect.onChange"];
            mql.addEventListener("change", onChange);
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
            return ({
                "useIsMobile.useEffect": ()=>mql.removeEventListener("change", onChange)
            })["useIsMobile.useEffect"];
        }
    }["useIsMobile.useEffect"], []);
    return !!isMobile;
}
_s(useIsMobile, "D6B2cPXNCaIbeOx+abFr1uxLRM0=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_23a5049a._.js.map