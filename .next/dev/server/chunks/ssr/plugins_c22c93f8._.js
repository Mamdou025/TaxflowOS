module.exports = [
"[project]/plugins/legacy-mappings.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Legacy Action Mappings
 *
 * This file maps old action type names to new namespaced action IDs.
 * Used for backward compatibility with existing workflows.
 *
 * Format: "Old Label" -> "plugin-type/action-slug"
 *
 * TODO: Remove this file once all workflows have been migrated to the new format.
 */ __turbopack_context__.s([
    "LEGACY_ACTION_MAPPINGS",
    ()=>LEGACY_ACTION_MAPPINGS
]);
const LEGACY_ACTION_MAPPINGS = {
    // Firecrawl
    Scrape: "firecrawl/scrape",
    Search: "firecrawl/search",
    // AI Gateway
    "Generate Text": "ai-gateway/generate-text",
    "Generate Image": "ai-gateway/generate-image",
    // Resend
    "Send Email": "resend/send-email",
    // Linear
    "Create Ticket": "linear/create-ticket",
    "Find Issues": "linear/find-issues",
    // Slack
    "Send Slack Message": "slack/send-message",
    // v0
    "Create Chat": "v0/create-chat",
    "Send Message": "v0/send-message"
};
}),
"[project]/plugins/registry.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeActionId",
    ()=>computeActionId,
    "findActionById",
    ()=>findActionById,
    "flattenConfigFields",
    ()=>flattenConfigFields,
    "generateAIActionPrompts",
    ()=>generateAIActionPrompts,
    "getActionsByCategory",
    ()=>getActionsByCategory,
    "getAllActions",
    ()=>getAllActions,
    "getAllDependencies",
    ()=>getAllDependencies,
    "getAllEnvVars",
    ()=>getAllEnvVars,
    "getAllIntegrations",
    ()=>getAllIntegrations,
    "getCredentialMapping",
    ()=>getCredentialMapping,
    "getDependenciesForActions",
    ()=>getDependenciesForActions,
    "getIntegration",
    ()=>getIntegration,
    "getIntegrationDescriptions",
    ()=>getIntegrationDescriptions,
    "getIntegrationLabels",
    ()=>getIntegrationLabels,
    "getIntegrationTypes",
    ()=>getIntegrationTypes,
    "getPluginEnvVars",
    ()=>getPluginEnvVars,
    "getSortedIntegrationTypes",
    ()=>getSortedIntegrationTypes,
    "isFieldGroup",
    ()=>isFieldGroup,
    "parseActionId",
    ()=>parseActionId,
    "registerIntegration",
    ()=>registerIntegration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$legacy$2d$mappings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/legacy-mappings.ts [app-ssr] (ecmascript)");
;
/**
 * Integration Registry
 * Auto-populated by plugin files
 */ const integrationRegistry = new Map();
function computeActionId(integrationType, actionSlug) {
    return `${integrationType}/${actionSlug}`;
}
function parseActionId(actionId) {
    if (!actionId || typeof actionId !== "string") {
        return null;
    }
    const parts = actionId.split("/");
    if (parts.length !== 2) {
        return null;
    }
    return {
        integration: parts[0],
        slug: parts[1]
    };
}
function registerIntegration(plugin) {
    integrationRegistry.set(plugin.type, plugin);
}
function getIntegration(type) {
    return integrationRegistry.get(type);
}
function getAllIntegrations() {
    return Array.from(integrationRegistry.values());
}
function getIntegrationTypes() {
    return Array.from(integrationRegistry.keys());
}
function getAllActions() {
    const actions = [];
    for (const plugin of integrationRegistry.values()){
        for (const action of plugin.actions){
            actions.push({
                ...action,
                id: computeActionId(plugin.type, action.slug),
                integration: plugin.type
            });
        }
    }
    return actions;
}
function getActionsByCategory() {
    const categories = {};
    for (const plugin of integrationRegistry.values()){
        for (const action of plugin.actions){
            if (!categories[action.category]) {
                categories[action.category] = [];
            }
            categories[action.category].push({
                ...action,
                id: computeActionId(plugin.type, action.slug),
                integration: plugin.type
            });
        }
    }
    return categories;
}
function findActionById(actionId) {
    if (!actionId) {
        return undefined;
    }
    // First try parsing as a namespaced ID
    const parsed = parseActionId(actionId);
    if (parsed) {
        const plugin = integrationRegistry.get(parsed.integration);
        if (plugin) {
            const action = plugin.actions.find((a)=>a.slug === parsed.slug);
            if (action) {
                return {
                    ...action,
                    id: actionId,
                    integration: plugin.type
                };
            }
        }
    }
    // Check legacy mappings for backward compatibility
    const mappedId = __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$legacy$2d$mappings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LEGACY_ACTION_MAPPINGS"][actionId];
    if (mappedId) {
        // Recursively look up the mapped ID
        return findActionById(mappedId);
    }
    // Fall back to legacy label-based lookup (exact label match)
    for (const plugin of integrationRegistry.values()){
        const action = plugin.actions.find((a)=>a.label === actionId);
        if (action) {
            return {
                ...action,
                id: computeActionId(plugin.type, action.slug),
                integration: plugin.type
            };
        }
    }
    return undefined;
}
function getIntegrationLabels() {
    const labels = {};
    for (const plugin of integrationRegistry.values()){
        labels[plugin.type] = plugin.label;
    }
    return labels;
}
function getIntegrationDescriptions() {
    const descriptions = {};
    for (const plugin of integrationRegistry.values()){
        descriptions[plugin.type] = plugin.description;
    }
    return descriptions;
}
function getSortedIntegrationTypes() {
    return Array.from(integrationRegistry.keys()).sort();
}
function getAllDependencies() {
    const deps = {};
    for (const plugin of integrationRegistry.values()){
        if (plugin.dependencies) {
            Object.assign(deps, plugin.dependencies);
        }
    }
    return deps;
}
function getDependenciesForActions(actionIds) {
    const deps = {};
    const integrations = new Set();
    // Find which integrations are used
    for (const actionId of actionIds){
        const action = findActionById(actionId);
        if (action) {
            integrations.add(action.integration);
        }
    }
    // Get dependencies for those integrations
    for (const integrationType of integrations){
        const plugin = integrationRegistry.get(integrationType);
        if (plugin?.dependencies) {
            Object.assign(deps, plugin.dependencies);
        }
    }
    return deps;
}
function getPluginEnvVars(plugin) {
    const envVars = [];
    // Get env vars from form fields
    for (const field of plugin.formFields){
        if (field.envVar) {
            envVars.push({
                name: field.envVar,
                description: field.helpText || field.label
            });
        }
    }
    return envVars;
}
function getAllEnvVars() {
    const envVars = [];
    for (const plugin of integrationRegistry.values()){
        envVars.push(...getPluginEnvVars(plugin));
    }
    return envVars;
}
function getCredentialMapping(plugin, config) {
    const creds = {};
    for (const field of plugin.formFields){
        if (field.envVar && config[field.configKey]) {
            creds[field.envVar] = String(config[field.configKey]);
        }
    }
    return creds;
}
function isFieldGroup(field) {
    return field.type === "group";
}
function flattenConfigFields(fields) {
    const result = [];
    for (const field of fields){
        if (isFieldGroup(field)) {
            result.push(...field.fields);
        } else {
            result.push(field);
        }
    }
    return result;
}
function generateAIActionPrompts() {
    const lines = [];
    for (const plugin of integrationRegistry.values()){
        for (const action of plugin.actions){
            const fullId = computeActionId(plugin.type, action.slug);
            // Build example config from configFields (flatten groups)
            const exampleConfig = {
                actionType: fullId
            };
            const flatFields = flattenConfigFields(action.configFields);
            for (const field of flatFields){
                // Skip conditional fields in the example
                if (field.showWhen) continue;
                // Use example, defaultValue, or a sensible default based on type
                if (field.example !== undefined) {
                    exampleConfig[field.key] = field.example;
                } else if (field.defaultValue !== undefined) {
                    exampleConfig[field.key] = field.defaultValue;
                } else if (field.type === "number") {
                    exampleConfig[field.key] = 10;
                } else if (field.type === "select" && field.options?.[0]) {
                    exampleConfig[field.key] = field.options[0].value;
                } else {
                    exampleConfig[field.key] = `Your ${field.label.toLowerCase()}`;
                }
            }
            lines.push(`- ${action.label} (${fullId}): ${JSON.stringify(exampleConfig)}`);
        }
    }
    return lines.join("\n");
}
}),
"[project]/plugins/ai-gateway/icon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AiGatewayIcon",
    ()=>AiGatewayIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function AiGatewayIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        fill: "currentColor",
        viewBox: "0 0 1155 1000",
        xmlns: "http://www.w3.org/2000/svg",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "m577.3 0 577.4 1000H0z",
            fill: "currentColor"
        }, void 0, false, {
            fileName: "[project]/plugins/ai-gateway/icon.tsx",
            lineNumber: 9,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/plugins/ai-gateway/icon.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/plugins/ai-gateway/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$ai$2d$gateway$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/ai-gateway/icon.tsx [app-ssr] (ecmascript)");
;
;
const aiGatewayPlugin = {
    type: "ai-gateway",
    label: "AI Gateway",
    description: "Generate text and images using AI models",
    icon: __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$ai$2d$gateway$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AiGatewayIcon"],
    formFields: [
        {
            id: "openaiApiKey",
            label: "API Key",
            type: "password",
            placeholder: "Your AI Gateway API key",
            configKey: "apiKey",
            envVar: "AI_GATEWAY_API_KEY",
            helpText: "Get your API key from ",
            helpLink: {
                text: "vercel.com/ai-gateway",
                url: "https://vercel.com/docs/ai-gateway/getting-started"
            }
        }
    ],
    testConfig: {
        getTestFunction: async ()=>{
            const { testAiGateway } = await __turbopack_context__.A("[project]/plugins/ai-gateway/test.ts [app-ssr] (ecmascript, async loader)");
            return testAiGateway;
        }
    },
    dependencies: {
        ai: "^5.0.86",
        openai: "^6.8.0",
        "@google/genai": "^1.28.0",
        zod: "^4.1.12"
    },
    actions: [
        {
            slug: "generate-text",
            label: "Generate Text",
            description: "Generate text using AI models",
            category: "AI Gateway",
            stepFunction: "generateTextStep",
            stepImportPath: "generate-text",
            configFields: [
                {
                    key: "aiFormat",
                    label: "Output Format",
                    type: "select",
                    defaultValue: "text",
                    options: [
                        {
                            value: "text",
                            label: "Text"
                        },
                        {
                            value: "object",
                            label: "Object"
                        }
                    ]
                },
                {
                    key: "aiModel",
                    label: "Model",
                    type: "select",
                    defaultValue: "meta/llama-4-scout",
                    options: [
                        // Current models
                        {
                            value: "anthropic/claude-sonnet-4.5",
                            label: "Claude Sonnet 4.5"
                        },
                        {
                            value: "anthropic/claude-haiku-4.5",
                            label: "Claude Haiku 4.5"
                        },
                        {
                            value: "anthropic/claude-opus-4.5",
                            label: "Claude Opus 4.5"
                        },
                        {
                            value: "meta/llama-4-scout",
                            label: "Llama 4 Scout"
                        },
                        {
                            value: "meta/llama-4-maverick",
                            label: "Llama 4 Maverick"
                        },
                        {
                            value: "openai/gpt-5.2",
                            label: "GPT-5.2"
                        },
                        {
                            value: "openai/gpt-5.2-pro",
                            label: "GPT-5.2 Pro"
                        },
                        {
                            value: "google/gemini-3-pro-preview",
                            label: "Gemini 3 Pro Preview"
                        },
                        {
                            value: "google/gemini-2.5-flash-lite",
                            label: "Gemini 2.5 Flash Lite"
                        },
                        {
                            value: "google/gemini-2.5-flash",
                            label: "Gemini 2.5 Flash"
                        },
                        {
                            value: "google/gemini-2.5-pro",
                            label: "Gemini 2.5 Pro"
                        },
                        // Legacy models (kept for backwards compatibility)
                        {
                            value: "anthropic/claude-sonnet-4.0",
                            label: "Claude Sonnet 4.0"
                        },
                        {
                            value: "anthropic/claude-3.5-sonnet-20241022",
                            label: "Claude 3.5 Sonnet"
                        },
                        {
                            value: "anthropic/claude-3-7-sonnet",
                            label: "Claude 3.7 Sonnet"
                        },
                        {
                            value: "openai/gpt-4o",
                            label: "GPT-4o"
                        },
                        {
                            value: "openai/gpt-4o-mini",
                            label: "GPT-4o Mini"
                        },
                        {
                            value: "openai/o1",
                            label: "o1"
                        },
                        {
                            value: "openai/o1-mini",
                            label: "o1 Mini"
                        },
                        {
                            value: "openai/gpt-4-turbo",
                            label: "GPT-4 Turbo"
                        },
                        {
                            value: "openai/gpt-3.5-turbo",
                            label: "GPT-3.5 Turbo"
                        },
                        {
                            value: "google/gemini-4.0-flash",
                            label: "Gemini 4.0 Flash"
                        },
                        {
                            value: "google/gemini-2.0-flash",
                            label: "Gemini 2.0 Flash"
                        },
                        {
                            value: "google/gemini-2.0-flash-lite",
                            label: "Gemini 2.0 Flash Lite"
                        },
                        {
                            value: "meta/llama-4-instruct",
                            label: "Llama 4 Instruct"
                        }
                    ]
                },
                {
                    key: "aiPrompt",
                    label: "Prompt",
                    type: "template-textarea",
                    placeholder: "Enter your prompt here. Use {{NodeName.field}} to reference previous outputs.",
                    rows: 4,
                    example: "Summarize the following text: {{Scrape.markdown}}",
                    required: true
                },
                {
                    key: "aiSchema",
                    label: "Schema",
                    type: "schema-builder",
                    showWhen: {
                        field: "aiFormat",
                        equals: "object"
                    }
                }
            ]
        },
        {
            slug: "generate-image",
            label: "Generate Image",
            description: "Generate images using AI models",
            category: "AI Gateway",
            stepFunction: "generateImageStep",
            stepImportPath: "generate-image",
            outputFields: [
                {
                    field: "base64",
                    description: "Base64-encoded image data"
                }
            ],
            outputConfig: {
                type: "image",
                field: "base64"
            },
            configFields: [
                {
                    key: "imageModel",
                    label: "Model",
                    type: "select",
                    defaultValue: "google/imagen-4.0-generate-001",
                    options: [
                        {
                            value: "google/imagen-4.0-generate-001",
                            label: "Imagen 4"
                        },
                        {
                            value: "google/imagen-4.0-fast-generate-001",
                            label: "Imagen 4 Fast"
                        },
                        {
                            value: "google/imagen-4.0-ultra-generate-001",
                            label: "Imagen 4 Ultra"
                        },
                        {
                            value: "bfl/flux-kontext-pro",
                            label: "FLUX.1 Kontext Pro"
                        },
                        {
                            value: "bfl/flux-kontext-max",
                            label: "FLUX.1 Kontext Max"
                        }
                    ]
                },
                {
                    key: "imagePrompt",
                    label: "Prompt",
                    type: "template-textarea",
                    placeholder: "Describe the image you want to generate. Use {{NodeName.field}} to reference previous outputs.",
                    rows: 4,
                    example: "A serene mountain landscape at sunset",
                    required: true
                }
            ]
        }
    ]
};
// Auto-register on import
(0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerIntegration"])(aiGatewayPlugin);
const __TURBOPACK__default__export__ = aiGatewayPlugin;
}),
"[project]/plugins/blob/icon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BlobIcon",
    ()=>BlobIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function BlobIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        "aria-label": "Vercel logo",
        className: className,
        fill: "currentColor",
        viewBox: "0 0 1155 1000",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: "Vercel"
            }, void 0, false, {
                fileName: "[project]/plugins/blob/icon.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m577.3 0 577.4 1000H0z"
            }, void 0, false, {
                fileName: "[project]/plugins/blob/icon.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/plugins/blob/icon.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/plugins/blob/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$blob$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/blob/icon.tsx [app-ssr] (ecmascript)");
;
;
const blobPlugin = {
    type: "blob",
    label: "Blob",
    description: "Store and retrieve files with Vercel Blob",
    icon: __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$blob$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BlobIcon"],
    formFields: [
        {
            id: "token",
            label: "Read/Write Token",
            type: "password",
            placeholder: "vercel_blob_rw_...",
            configKey: "token",
            envVar: "BLOB_READ_WRITE_TOKEN",
            helpText: "Get your token from ",
            helpLink: {
                text: "vercel.com/dashboard/stores",
                url: "https://vercel.com/dashboard/stores"
            }
        }
    ],
    testConfig: {
        getTestFunction: async ()=>{
            const { testBlob } = await __turbopack_context__.A("[project]/plugins/blob/test.ts [app-ssr] (ecmascript, async loader)");
            return testBlob;
        }
    },
    actions: [
        {
            slug: "put",
            label: "Put Blob",
            description: "Upload a file to Vercel Blob storage",
            category: "Blob",
            stepFunction: "putBlobStep",
            stepImportPath: "put",
            outputFields: [
                {
                    field: "url",
                    description: "Public URL of the blob"
                },
                {
                    field: "downloadUrl",
                    description: "Direct download URL"
                },
                {
                    field: "pathname",
                    description: "Path where blob was stored"
                }
            ],
            configFields: [
                {
                    key: "pathname",
                    label: "Path",
                    type: "template-input",
                    placeholder: "folder/filename.txt or {{NodeName.path}}",
                    example: "uploads/document.pdf",
                    required: true
                },
                {
                    key: "body",
                    label: "Content",
                    type: "template-textarea",
                    placeholder: "File content or {{NodeName.data}}",
                    rows: 4,
                    example: "Hello, world!",
                    required: true
                },
                {
                    key: "contentType",
                    label: "Content Type",
                    type: "template-input",
                    placeholder: "text/plain",
                    example: "text/plain"
                },
                {
                    type: "group",
                    label: "Options",
                    defaultExpanded: false,
                    fields: [
                        {
                            key: "access",
                            label: "Access",
                            type: "select",
                            options: [
                                {
                                    value: "public",
                                    label: "Public"
                                }
                            ],
                            defaultValue: "public"
                        },
                        {
                            key: "addRandomSuffix",
                            label: "Add Random Suffix",
                            type: "select",
                            options: [
                                {
                                    value: "true",
                                    label: "Yes"
                                },
                                {
                                    value: "false",
                                    label: "No"
                                }
                            ],
                            defaultValue: "true"
                        }
                    ]
                }
            ]
        },
        {
            slug: "list",
            label: "List Blobs",
            description: "List files stored in Vercel Blob storage",
            category: "Blob",
            stepFunction: "listBlobsStep",
            stepImportPath: "list",
            outputFields: [
                {
                    field: "blobs",
                    description: "Array of blob objects"
                },
                {
                    field: "hasMore",
                    description: "Whether more results exist"
                },
                {
                    field: "cursor",
                    description: "Pagination cursor"
                }
            ],
            configFields: [
                {
                    key: "prefix",
                    label: "Prefix",
                    type: "template-input",
                    placeholder: "folder/ or {{NodeName.prefix}}",
                    example: "uploads/"
                },
                {
                    key: "limit",
                    label: "Limit",
                    type: "number",
                    min: 1,
                    defaultValue: "1000"
                }
            ]
        }
    ]
};
(0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerIntegration"])(blobPlugin);
const __TURBOPACK__default__export__ = blobPlugin;
}),
"[project]/plugins/clerk/components/user-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserCard",
    ()=>UserCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function UserCard({ output }) {
    const data = output;
    // Validate we have the expected data shape
    if (!data || typeof data !== "object" || !("id" in data)) {
        return null;
    }
    const initials = [
        data.firstName?.[0],
        data.lastName?.[0]
    ].filter(Boolean).join("").toUpperCase();
    const fullName = [
        data.firstName,
        data.lastName
    ].filter(Boolean).join(" ");
    const createdDate = data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "Unknown";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-600 font-semibold text-lg text-white",
                children: initials || "?"
            }, void 0, false, {
                fileName: "[project]/plugins/clerk/components/user-card.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0 flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "truncate font-medium text-foreground",
                        children: fullName || "Unknown User"
                    }, void 0, false, {
                        fileName: "[project]/plugins/clerk/components/user-card.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    data.primaryEmailAddress && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "truncate text-muted-foreground text-sm",
                        children: data.primaryEmailAddress
                    }, void 0, false, {
                        fileName: "[project]/plugins/clerk/components/user-card.tsx",
                        lineNumber: 40,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-0.5 font-mono text-muted-foreground text-xs",
                        children: [
                            "Created ",
                            createdDate
                        ]
                    }, void 0, true, {
                        fileName: "[project]/plugins/clerk/components/user-card.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/plugins/clerk/components/user-card.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/plugins/clerk/components/user-card.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
}),
"[project]/plugins/clerk/icon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClerkIcon",
    ()=>ClerkIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function ClerkIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        role: "img",
        viewBox: "0 0 128 128",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "64",
                cy: "64",
                r: "20",
                fill: "currentColor"
            }, void 0, false, {
                fileName: "[project]/plugins/clerk/icon.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "currentColor",
                fillOpacity: "0.6",
                d: "M99.5716 10.788C101.571 12.1272 101.742 14.9444 100.04 16.646L85.4244 31.2618C84.1035 32.5828 82.0542 32.7914 80.3915 31.9397C75.4752 29.421 69.9035 28 64 28C44.1177 28 28 44.1177 28 64C28 69.9035 29.421 75.4752 31.9397 80.3915C32.7914 82.0542 32.5828 84.1035 31.2618 85.4244L16.646 100.04C14.9444 101.742 12.1272 101.571 10.788 99.5716C3.97411 89.3989 0 77.1635 0 64C0 28.6538 28.6538 0 64 0C77.1635 0 89.3989 3.97411 99.5716 10.788Z"
            }, void 0, false, {
                fileName: "[project]/plugins/clerk/icon.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "currentColor",
                d: "M100.04 111.354C101.742 113.056 101.571 115.873 99.5717 117.212C89.3989 124.026 77.1636 128 64 128C50.8364 128 38.6011 124.026 28.4283 117.212C26.4289 115.873 26.2581 113.056 27.9597 111.354L42.5755 96.7382C43.8965 95.4172 45.9457 95.2085 47.6084 96.0603C52.5248 98.579 58.0964 100 64 100C69.9036 100 75.4753 98.579 80.3916 96.0603C82.0543 95.2085 84.1036 95.4172 85.4245 96.7382L100.04 111.354Z"
            }, void 0, false, {
                fileName: "[project]/plugins/clerk/icon.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/plugins/clerk/icon.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/plugins/clerk/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$clerk$2f$components$2f$user$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/clerk/components/user-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$clerk$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/clerk/icon.tsx [app-ssr] (ecmascript)");
;
;
;
const clerkPlugin = {
    type: "clerk",
    label: "Clerk",
    description: "User authentication and management",
    icon: __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$clerk$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClerkIcon"],
    formFields: [
        {
            id: "clerkSecretKey",
            label: "Secret Key",
            type: "password",
            placeholder: "sk_live_... or sk_test_...",
            configKey: "clerkSecretKey",
            envVar: "CLERK_SECRET_KEY",
            helpText: "Get your secret key from ",
            helpLink: {
                text: "Clerk Dashboard",
                url: "https://dashboard.clerk.com"
            }
        }
    ],
    testConfig: {
        getTestFunction: async ()=>{
            const { testClerk } = await __turbopack_context__.A("[project]/plugins/clerk/test.ts [app-ssr] (ecmascript, async loader)");
            return testClerk;
        }
    },
    actions: [
        {
            slug: "get-user",
            label: "Get User",
            description: "Fetch a user by ID from Clerk",
            category: "Clerk",
            stepFunction: "clerkGetUserStep",
            stepImportPath: "get-user",
            outputFields: [
                {
                    field: "id",
                    description: "User ID"
                },
                {
                    field: "firstName",
                    description: "First name"
                },
                {
                    field: "lastName",
                    description: "Last name"
                },
                {
                    field: "primaryEmailAddress",
                    description: "Primary email address"
                }
            ],
            outputConfig: {
                type: "component",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$clerk$2f$components$2f$user$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserCard"]
            },
            configFields: [
                {
                    key: "userId",
                    label: "User ID",
                    type: "template-input",
                    placeholder: "user_... or {{NodeName.userId}}",
                    example: "user_2abc123",
                    required: true
                }
            ]
        },
        {
            slug: "create-user",
            label: "Create User",
            description: "Create a new user in Clerk",
            category: "Clerk",
            stepFunction: "clerkCreateUserStep",
            stepImportPath: "create-user",
            outputFields: [
                {
                    field: "id",
                    description: "User ID"
                },
                {
                    field: "firstName",
                    description: "First name"
                },
                {
                    field: "lastName",
                    description: "Last name"
                },
                {
                    field: "primaryEmailAddress",
                    description: "Primary email address"
                }
            ],
            outputConfig: {
                type: "component",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$clerk$2f$components$2f$user$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserCard"]
            },
            configFields: [
                {
                    key: "emailAddress",
                    label: "Email Address",
                    type: "template-input",
                    placeholder: "user@example.com or {{NodeName.email}}",
                    example: "user@example.com",
                    required: true
                },
                {
                    key: "firstName",
                    label: "First Name",
                    type: "template-input",
                    placeholder: "John or {{NodeName.firstName}}",
                    example: "John"
                },
                {
                    key: "lastName",
                    label: "Last Name",
                    type: "template-input",
                    placeholder: "Doe or {{NodeName.lastName}}",
                    example: "Doe"
                },
                {
                    key: "password",
                    label: "Password",
                    type: "template-input",
                    placeholder: "Password (min 8 chars) or leave empty",
                    example: "securepassword123"
                },
                {
                    label: "Metadata",
                    type: "group",
                    defaultExpanded: false,
                    fields: [
                        {
                            key: "publicMetadata",
                            label: "Public Metadata (JSON)",
                            type: "template-textarea",
                            placeholder: '{"role": "admin"} or {{NodeName.metadata}}',
                            rows: 3
                        },
                        {
                            key: "privateMetadata",
                            label: "Private Metadata (JSON)",
                            type: "template-textarea",
                            placeholder: '{"internal_id": "123"}',
                            rows: 3
                        }
                    ]
                }
            ]
        },
        {
            slug: "update-user",
            label: "Update User",
            description: "Update an existing user in Clerk",
            category: "Clerk",
            stepFunction: "clerkUpdateUserStep",
            stepImportPath: "update-user",
            outputFields: [
                {
                    field: "id",
                    description: "User ID"
                },
                {
                    field: "firstName",
                    description: "First name"
                },
                {
                    field: "lastName",
                    description: "Last name"
                },
                {
                    field: "primaryEmailAddress",
                    description: "Primary email address"
                }
            ],
            outputConfig: {
                type: "component",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$clerk$2f$components$2f$user$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserCard"]
            },
            configFields: [
                {
                    key: "userId",
                    label: "User ID",
                    type: "template-input",
                    placeholder: "user_... or {{NodeName.user.id}}",
                    example: "user_2abc123",
                    required: true
                },
                {
                    key: "firstName",
                    label: "First Name",
                    type: "template-input",
                    placeholder: "Jane or {{NodeName.firstName}}"
                },
                {
                    key: "lastName",
                    label: "Last Name",
                    type: "template-input",
                    placeholder: "Doe or {{NodeName.lastName}}"
                },
                {
                    label: "Metadata",
                    type: "group",
                    defaultExpanded: false,
                    fields: [
                        {
                            key: "publicMetadata",
                            label: "Public Metadata (JSON)",
                            type: "template-textarea",
                            placeholder: '{"role": "admin"} or {{NodeName.metadata}}',
                            rows: 3
                        },
                        {
                            key: "privateMetadata",
                            label: "Private Metadata (JSON)",
                            type: "template-textarea",
                            placeholder: '{"internal_id": "123"}',
                            rows: 3
                        }
                    ]
                }
            ]
        },
        {
            slug: "delete-user",
            label: "Delete User",
            description: "Delete a user from Clerk",
            category: "Clerk",
            stepFunction: "clerkDeleteUserStep",
            stepImportPath: "delete-user",
            outputFields: [
                {
                    field: "deleted",
                    description: "Deletion success"
                }
            ],
            configFields: [
                {
                    key: "userId",
                    label: "User ID",
                    type: "template-input",
                    placeholder: "user_... or {{NodeName.user.id}}",
                    example: "user_2abc123",
                    required: true
                }
            ]
        }
    ]
};
// Auto-register on import
(0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerIntegration"])(clerkPlugin);
const __TURBOPACK__default__export__ = clerkPlugin;
}),
"[project]/plugins/fal/icon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FalIcon",
    ()=>FalIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function FalIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        "aria-label": "fal.ai logo",
        className: className,
        fill: "currentColor",
        viewBox: "0 0 120 48",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: "fal.ai"
            }, void 0, false, {
                fileName: "[project]/plugins/fal/icon.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M120 6.46345V41.6633C120 47.2476 119.937 47.4986 119.248 47.4986H110.724C110.034 47.4986 109.909 47.2476 109.909 41.6633V6.46345C109.909 0.879154 110.034 0.628174 110.724 0.628174H119.248C119.937 0.628174 120 0.879154 120 6.46345Z"
            }, void 0, false, {
                fileName: "[project]/plugins/fal/icon.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M96.0997 27.0431V25.7255C96.0997 22.5882 94.6581 21.3333 92.1509 21.3333C89.7065 21.3333 88.3902 22.651 88.0142 24.9725C87.8888 25.6627 87.9515 26.2274 87.5754 26.2274H79.1138C78.6124 26.2274 78.6124 26.1019 78.6124 25.6627C78.6124 22.3372 81.7463 15.4353 92.6524 15.4353C100.362 15.4353 105.878 18.5098 105.878 27.0431V39.5921C105.878 42.4783 107.445 46.5568 107.445 47.1215C107.445 47.3724 107.257 47.4979 107.068 47.4979H97.6667C97.2279 47.4979 97.1652 47.247 96.8518 45.6783L96.6011 44.4862C96.4131 43.545 96.2877 43.2313 95.9117 43.2313C95.4102 43.2313 95.0968 44.3607 93.7179 45.6783C92.2136 47.0587 90.3959 47.9999 87.262 47.9999C82.185 47.9999 77.6095 45.1136 77.6095 38.8391C77.6095 31.8117 83.0625 28.8 91.1481 28.4862C95.3476 28.298 96.0997 28.7372 96.0997 27.0431ZM96.0997 36.1411V34.8862C96.0997 33.6313 95.7863 33.2548 94.7208 33.3176L92.4017 33.4431C89.4558 33.6313 87.7008 35.1372 87.7008 37.9607C87.7008 40.7215 89.205 42.1019 91.3988 42.1019C93.8433 42.1019 96.0997 39.8431 96.0997 36.1411Z"
            }, void 0, false, {
                fileName: "[project]/plugins/fal/icon.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M60.5509 23.6548C60.5509 22.4627 60.0495 22.3372 57.7304 22.3372H56.6021C56.1634 22.3372 56.1007 22.0234 56.1007 19.4509V19.0117C56.1007 16.4392 56.1634 16.1882 56.6021 16.1882H57.9184C60.2375 16.1882 60.5509 15.9999 60.5509 14.8705V10.9804C60.5509 3.6392 64.2489 0 71.3943 0C74.2148 0 76.1579 0.439212 76.4713 0.627448C76.5966 0.752936 76.5966 0.941172 76.5966 3.26273V4.07842C76.5966 6.46272 76.5966 7.02742 76.4086 7.02742C76.2206 7.02742 75.3431 6.46272 73.8388 6.46272C71.8331 6.46272 70.5795 7.46664 70.5795 10.9804V14.8705C70.5795 15.9999 71.0182 16.1882 73.8388 16.1882H76.6593C77.2234 16.1882 77.2234 16.4392 77.2234 19.0117V19.4509C77.2234 22.0234 77.1607 22.3372 76.722 22.3372H73.8388C71.0182 22.3372 70.5795 22.4627 70.5795 23.6548V41.6626C70.5795 47.2469 70.3914 47.4979 69.89 47.4979H61.1777C60.6762 47.4979 60.5509 47.2469 60.5509 41.6626V23.6548Z"
            }, void 0, false, {
                fileName: "[project]/plugins/fal/icon.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fillRule: "evenodd",
                clipRule: "evenodd",
                d: "M30.1574 0.740479C30.9676 0.740479 31.6169 1.39923 31.6944 2.20567C32.3853 9.39891 38.1102 15.1234 45.3039 15.8142C46.1104 15.8917 46.7692 16.541 46.7692 17.3511V30.8959C46.7692 31.706 46.1104 32.3553 45.3039 32.4328C38.1102 33.1236 32.3853 38.8481 31.6944 46.0414C31.6169 46.8478 30.9676 47.5065 30.1574 47.5065H16.6118C15.8016 47.5065 15.1523 46.8478 15.0748 46.0414C14.384 38.8481 8.65901 33.1236 1.46528 32.4328C0.658799 32.3553 0 31.706 0 30.8959V17.3511C0 16.541 0.658803 15.8917 1.46529 15.8142C8.65902 15.1234 14.384 9.39891 15.0748 2.20567C15.1523 1.39923 15.8016 0.740479 16.6118 0.740479H30.1574ZM9.39037 24.0839C9.39037 31.865 15.6915 38.1728 23.4644 38.1728C31.2373 38.1728 37.5385 31.865 37.5385 24.0839C37.5385 16.3028 31.2373 9.99498 23.4644 9.99498C15.6915 9.99498 9.39037 16.3028 9.39037 24.0839Z"
            }, void 0, false, {
                fileName: "[project]/plugins/fal/icon.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/plugins/fal/icon.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/plugins/fal/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$fal$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/fal/icon.tsx [app-ssr] (ecmascript)");
;
;
const falPlugin = {
    type: "fal",
    label: "fal.ai",
    description: "Fast AI inference for image, video, and audio generation",
    icon: __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$fal$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FalIcon"],
    formFields: [
        {
            id: "falApiKey",
            label: "API Key",
            type: "password",
            placeholder: "fal_...",
            configKey: "apiKey",
            envVar: "FAL_API_KEY",
            helpText: "Get your API key from ",
            helpLink: {
                text: "fal.ai/dashboard/keys",
                url: "https://fal.ai/dashboard/keys"
            }
        }
    ],
    testConfig: {
        getTestFunction: async ()=>{
            const { testFal } = await __turbopack_context__.A("[project]/plugins/fal/test.ts [app-ssr] (ecmascript, async loader)");
            return testFal;
        }
    },
    actions: [
        {
            slug: "generate-image",
            label: "Generate Image",
            description: "Generate images using Flux models",
            category: "fal.ai",
            stepFunction: "falGenerateImageStep",
            stepImportPath: "generate-image",
            outputFields: [
                {
                    field: "imageUrl",
                    description: "URL of the generated image"
                },
                {
                    field: "width",
                    description: "Width of the generated image"
                },
                {
                    field: "height",
                    description: "Height of the generated image"
                }
            ],
            outputConfig: {
                type: "image",
                field: "imageUrl"
            },
            configFields: [
                {
                    key: "model",
                    label: "Model",
                    type: "select",
                    defaultValue: "fal-ai/flux/schnell",
                    options: [
                        {
                            value: "fal-ai/flux/schnell",
                            label: "Flux Schnell (Fast)"
                        },
                        {
                            value: "fal-ai/flux/dev",
                            label: "Flux Dev (Quality)"
                        },
                        {
                            value: "fal-ai/flux-pro/v1.1",
                            label: "Flux Pro 1.1"
                        },
                        {
                            value: "fal-ai/flux-pro/v1.1-ultra",
                            label: "Flux Pro 1.1 Ultra"
                        },
                        {
                            value: "fal-ai/flux-lora",
                            label: "Flux LoRA"
                        },
                        {
                            value: "fal-ai/stable-diffusion-v3-medium",
                            label: "Stable Diffusion 3 Medium"
                        },
                        {
                            value: "fal-ai/recraft-v3",
                            label: "Recraft V3"
                        }
                    ]
                },
                {
                    key: "prompt",
                    label: "Prompt",
                    type: "template-textarea",
                    placeholder: "Describe the image you want to generate. Use {{NodeName.field}} to reference previous outputs.",
                    rows: 4,
                    example: "A serene mountain landscape at sunset with dramatic clouds",
                    required: true
                },
                {
                    key: "imageSize",
                    label: "Image Size",
                    type: "select",
                    defaultValue: "landscape_16_9",
                    options: [
                        {
                            value: "square",
                            label: "Square (1024x1024)"
                        },
                        {
                            value: "square_hd",
                            label: "Square HD (1536x1536)"
                        },
                        {
                            value: "portrait_4_3",
                            label: "Portrait 4:3"
                        },
                        {
                            value: "portrait_16_9",
                            label: "Portrait 16:9"
                        },
                        {
                            value: "landscape_4_3",
                            label: "Landscape 4:3"
                        },
                        {
                            value: "landscape_16_9",
                            label: "Landscape 16:9"
                        }
                    ]
                },
                {
                    key: "numImages",
                    label: "Number of Images",
                    type: "number",
                    placeholder: "1",
                    min: 1,
                    defaultValue: "1"
                }
            ]
        },
        {
            slug: "generate-video",
            label: "Generate Video",
            description: "Generate videos from text or images",
            category: "fal.ai",
            stepFunction: "falGenerateVideoStep",
            stepImportPath: "generate-video",
            outputFields: [
                {
                    field: "videoUrl",
                    description: "URL of the generated video"
                }
            ],
            outputConfig: {
                type: "video",
                field: "videoUrl"
            },
            configFields: [
                {
                    key: "model",
                    label: "Model",
                    type: "select",
                    defaultValue: "fal-ai/minimax-video",
                    options: [
                        {
                            value: "fal-ai/minimax-video",
                            label: "MiniMax Video"
                        },
                        {
                            value: "fal-ai/kling-video/v1/standard/text-to-video",
                            label: "Kling 1.0"
                        },
                        {
                            value: "fal-ai/kling-video/v1.5/pro/text-to-video",
                            label: "Kling 1.5 Pro"
                        },
                        {
                            value: "fal-ai/hunyuan-video",
                            label: "Hunyuan Video"
                        },
                        {
                            value: "fal-ai/luma-dream-machine",
                            label: "Luma Dream Machine"
                        },
                        {
                            value: "fal-ai/runway-gen3/turbo/image-to-video",
                            label: "Runway Gen3 (Image to Video)"
                        }
                    ]
                },
                {
                    key: "prompt",
                    label: "Prompt",
                    type: "template-textarea",
                    placeholder: "Describe the video you want to generate. Use {{NodeName.field}} to reference previous outputs.",
                    rows: 4,
                    example: "A cat walking through a garden",
                    required: true
                },
                {
                    key: "imageUrl",
                    label: "Image URL (Optional)",
                    type: "template-input",
                    placeholder: "URL of image to animate (for image-to-video models)"
                }
            ]
        },
        {
            slug: "upscale-image",
            label: "Upscale Image",
            description: "Upscale images to higher resolution",
            category: "fal.ai",
            stepFunction: "falUpscaleImageStep",
            stepImportPath: "upscale-image",
            outputFields: [
                {
                    field: "imageUrl",
                    description: "URL of the upscaled image"
                },
                {
                    field: "width",
                    description: "Width of the upscaled image"
                },
                {
                    field: "height",
                    description: "Height of the upscaled image"
                }
            ],
            outputConfig: {
                type: "image",
                field: "imageUrl"
            },
            configFields: [
                {
                    key: "model",
                    label: "Model",
                    type: "select",
                    defaultValue: "fal-ai/creative-upscaler",
                    options: [
                        {
                            value: "fal-ai/creative-upscaler",
                            label: "Creative Upscaler"
                        },
                        {
                            value: "fal-ai/clarity-upscaler",
                            label: "Clarity Upscaler"
                        },
                        {
                            value: "fal-ai/real-esrgan",
                            label: "Real-ESRGAN"
                        }
                    ]
                },
                {
                    key: "imageUrl",
                    label: "Image URL",
                    type: "template-input",
                    placeholder: "URL of image to upscale or {{NodeName.imageUrl}}",
                    example: "https://example.com/image.jpg",
                    required: true
                },
                {
                    key: "scale",
                    label: "Scale Factor",
                    type: "select",
                    defaultValue: "2",
                    options: [
                        {
                            value: "2",
                            label: "2x"
                        },
                        {
                            value: "4",
                            label: "4x"
                        }
                    ]
                }
            ]
        },
        {
            slug: "remove-background",
            label: "Remove Background",
            description: "Remove background from images",
            category: "fal.ai",
            stepFunction: "falRemoveBackgroundStep",
            stepImportPath: "remove-background",
            outputFields: [
                {
                    field: "imageUrl",
                    description: "URL of the image with background removed"
                }
            ],
            outputConfig: {
                type: "image",
                field: "imageUrl"
            },
            configFields: [
                {
                    key: "imageUrl",
                    label: "Image URL",
                    type: "template-input",
                    placeholder: "URL of image or {{NodeName.imageUrl}}",
                    example: "https://example.com/image.jpg",
                    required: true
                }
            ]
        },
        {
            slug: "image-to-image",
            label: "Image to Image",
            description: "Transform images with text prompts",
            category: "fal.ai",
            stepFunction: "falImageToImageStep",
            stepImportPath: "image-to-image",
            outputFields: [
                {
                    field: "imageUrl",
                    description: "URL of the transformed image"
                },
                {
                    field: "width",
                    description: "Width of the generated image"
                },
                {
                    field: "height",
                    description: "Height of the generated image"
                }
            ],
            outputConfig: {
                type: "image",
                field: "imageUrl"
            },
            configFields: [
                {
                    key: "model",
                    label: "Model",
                    type: "select",
                    defaultValue: "fal-ai/flux/dev/image-to-image",
                    options: [
                        {
                            value: "fal-ai/flux/dev/image-to-image",
                            label: "Flux Dev Image-to-Image"
                        },
                        {
                            value: "fal-ai/flux-pro/v1/redux",
                            label: "Flux Pro Redux"
                        }
                    ]
                },
                {
                    key: "imageUrl",
                    label: "Image URL",
                    type: "template-input",
                    placeholder: "URL of source image or {{NodeName.imageUrl}}",
                    example: "https://example.com/image.jpg",
                    required: true
                },
                {
                    key: "prompt",
                    label: "Prompt",
                    type: "template-textarea",
                    placeholder: "Describe how to transform the image. Use {{NodeName.field}} to reference previous outputs.",
                    rows: 4,
                    example: "Transform into a watercolor painting style",
                    required: true
                },
                {
                    key: "strength",
                    label: "Strength",
                    type: "select",
                    defaultValue: "0.75",
                    options: [
                        {
                            value: "0.25",
                            label: "Subtle (0.25)"
                        },
                        {
                            value: "0.5",
                            label: "Moderate (0.5)"
                        },
                        {
                            value: "0.75",
                            label: "Strong (0.75)"
                        },
                        {
                            value: "0.9",
                            label: "Very Strong (0.9)"
                        }
                    ]
                }
            ]
        }
    ]
};
// Auto-register on import
(0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerIntegration"])(falPlugin);
const __TURBOPACK__default__export__ = falPlugin;
}),
"[project]/plugins/firecrawl/icon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirecrawlIcon",
    ()=>FirecrawlIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function FirecrawlIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        "aria-label": "Firecrawl",
        className: className,
        viewBox: "0 0 50 72",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: "Firecrawl"
            }, void 0, false, {
                fileName: "[project]/plugins/firecrawl/icon.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M41.7154 23.1929C38.9531 24.0129 36.8707 25.8677 35.3457 27.8826C35.0183 28.3151 34.3358 27.9901 34.4658 27.4601C37.3856 15.4534 33.5283 5.47401 21.5039 0.561817C20.894 0.311833 20.259 0.859299 20.419 1.49926C25.8887 23.4604 2.88236 21.608 5.78971 46.504C5.83971 46.9314 5.35973 47.2239 5.00975 46.9739C3.9198 46.1915 2.70237 44.5591 1.86741 43.4116C1.62242 43.0742 1.09245 43.1692 0.979951 43.5716C0.314984 45.9765 0 48.2413 0 50.4912C0 59.2407 4.49727 66.9427 11.3044 71.4074C11.6944 71.6624 12.1944 71.2974 12.0619 70.8499C11.7119 69.675 11.5144 68.4351 11.4994 67.1527C11.4994 66.3652 11.5494 65.5603 11.6719 64.8103C11.9569 62.9254 12.6119 61.1305 13.7118 59.4957C17.4841 53.8335 25.0462 48.3638 23.8388 40.9368C23.7613 40.4668 24.3163 40.1569 24.6663 40.4793C29.9935 45.3465 31.0485 51.8936 30.1735 57.7658C30.0985 58.2757 30.7385 58.5482 31.061 58.1482C31.8759 57.1283 32.8709 56.2334 33.9533 55.5609C34.2233 55.3934 34.5833 55.5209 34.6858 55.8209C35.2882 57.5733 36.1832 59.2182 37.0281 60.8631C38.0381 62.8404 38.5756 65.0978 38.4906 67.4877C38.4481 68.6501 38.2556 69.775 37.9331 70.8449C37.7956 71.2974 38.2906 71.6749 38.6881 71.4149C45.5002 66.9502 50 59.2482 50 50.4937C50 47.4514 49.4675 44.4691 48.4601 41.6743C46.3477 35.8121 40.988 31.4099 42.3429 23.7704C42.4079 23.4054 42.0704 23.0879 41.7154 23.1929Z",
                fill: "#FA5D19"
            }, void 0, false, {
                fileName: "[project]/plugins/firecrawl/icon.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/plugins/firecrawl/icon.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/plugins/firecrawl/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$firecrawl$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/firecrawl/icon.tsx [app-ssr] (ecmascript)");
;
;
const firecrawlPlugin = {
    type: "firecrawl",
    label: "Firecrawl",
    description: "Scrape, search, and crawl the web",
    icon: __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$firecrawl$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirecrawlIcon"],
    formFields: [
        {
            id: "firecrawlApiKey",
            label: "API Key",
            type: "password",
            placeholder: "fc-...",
            configKey: "firecrawlApiKey",
            envVar: "FIRECRAWL_API_KEY",
            helpText: "Get your API key from ",
            helpLink: {
                text: "firecrawl.dev",
                url: "https://firecrawl.dev/app/api-keys"
            }
        }
    ],
    testConfig: {
        getTestFunction: async ()=>{
            const { testFirecrawl } = await __turbopack_context__.A("[project]/plugins/firecrawl/test.ts [app-ssr] (ecmascript, async loader)");
            return testFirecrawl;
        }
    },
    actions: [
        {
            slug: "scrape",
            label: "Scrape URL",
            description: "Scrape content from a URL",
            category: "Firecrawl",
            stepFunction: "firecrawlScrapeStep",
            stepImportPath: "scrape",
            outputFields: [
                {
                    field: "markdown",
                    description: "Scraped content as markdown"
                },
                {
                    field: "metadata",
                    description: "Page metadata object"
                }
            ],
            configFields: [
                {
                    key: "url",
                    label: "URL",
                    type: "template-input",
                    placeholder: "https://example.com or {{NodeName.url}}",
                    example: "https://example.com",
                    required: true
                }
            ]
        },
        {
            slug: "search",
            label: "Search Web",
            description: "Search the web with Firecrawl",
            category: "Firecrawl",
            stepFunction: "firecrawlSearchStep",
            stepImportPath: "search",
            outputFields: [
                {
                    field: "data",
                    description: "Array of search results"
                }
            ],
            configFields: [
                {
                    key: "query",
                    label: "Search Query",
                    type: "template-input",
                    placeholder: "Search query or {{NodeName.query}}",
                    example: "latest AI news",
                    required: true
                },
                {
                    key: "limit",
                    label: "Result Limit",
                    type: "number",
                    placeholder: "10",
                    min: 1,
                    example: "10"
                }
            ]
        }
    ]
};
// Auto-register on import
(0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerIntegration"])(firecrawlPlugin);
const __TURBOPACK__default__export__ = firecrawlPlugin;
}),
"[project]/plugins/github/icon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GitHubIcon",
    ()=>GitHubIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function GitHubIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        "aria-label": "GitHub",
        className: className,
        fill: "currentColor",
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: "GitHub"
            }, void 0, false, {
                fileName: "[project]/plugins/github/icon.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            }, void 0, false, {
                fileName: "[project]/plugins/github/icon.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/plugins/github/icon.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/plugins/github/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$github$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/github/icon.tsx [app-ssr] (ecmascript)");
;
;
const githubPlugin = {
    type: "github",
    label: "GitHub",
    description: "Create and manage issues in GitHub repositories",
    icon: __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$github$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GitHubIcon"],
    formFields: [
        {
            id: "token",
            label: "Personal Access Token",
            type: "password",
            placeholder: "ghp_... or github_pat_...",
            configKey: "token",
            envVar: "GITHUB_TOKEN",
            helpText: "Create a token with 'repo' scope from ",
            helpLink: {
                text: "github.com/settings/tokens",
                url: "https://github.com/settings/tokens"
            }
        }
    ],
    testConfig: {
        getTestFunction: async ()=>{
            const { testGitHub } = await __turbopack_context__.A("[project]/plugins/github/test.ts [app-ssr] (ecmascript, async loader)");
            return testGitHub;
        }
    },
    actions: [
        {
            slug: "create-issue",
            label: "Create Issue",
            description: "Create a new issue in a GitHub repository",
            category: "GitHub",
            stepFunction: "createIssueStep",
            stepImportPath: "create-issue",
            outputFields: [
                {
                    field: "id",
                    description: "Unique ID of the created issue"
                },
                {
                    field: "number",
                    description: "Issue number in the repository"
                },
                {
                    field: "title",
                    description: "Title of the issue"
                },
                {
                    field: "url",
                    description: "URL to view the issue on GitHub"
                },
                {
                    field: "state",
                    description: "State of the issue (open/closed)"
                }
            ],
            configFields: [
                {
                    key: "owner",
                    label: "Repository Owner",
                    type: "template-input",
                    placeholder: "octocat or {{NodeName.owner}}",
                    example: "octocat",
                    required: true
                },
                {
                    key: "repo",
                    label: "Repository Name",
                    type: "template-input",
                    placeholder: "hello-world or {{NodeName.repo}}",
                    example: "hello-world",
                    required: true
                },
                {
                    key: "title",
                    label: "Issue Title",
                    type: "template-input",
                    placeholder: "Bug report or {{NodeName.title}}",
                    example: "Bug: Login button not working",
                    required: true
                },
                {
                    key: "body",
                    label: "Issue Body",
                    type: "template-textarea",
                    placeholder: "Describe the issue. Use {{NodeName.field}} to insert data from previous nodes.",
                    rows: 4,
                    example: "Steps to reproduce:\n1. Go to login page\n2. Click login button"
                },
                {
                    key: "labels",
                    label: "Labels (comma-separated)",
                    type: "template-input",
                    placeholder: "bug, help wanted",
                    example: "bug, help wanted"
                },
                {
                    key: "assignees",
                    label: "Assignees (comma-separated)",
                    type: "template-input",
                    placeholder: "octocat, hubot",
                    example: "octocat"
                }
            ]
        },
        {
            slug: "list-issues",
            label: "List Issues",
            description: "List issues in a GitHub repository",
            category: "GitHub",
            stepFunction: "listIssuesStep",
            stepImportPath: "list-issues",
            outputFields: [
                {
                    field: "issues",
                    description: "Array of issue objects"
                },
                {
                    field: "count",
                    description: "Number of issues returned"
                }
            ],
            configFields: [
                {
                    key: "owner",
                    label: "Repository Owner",
                    type: "template-input",
                    placeholder: "octocat or {{NodeName.owner}}",
                    example: "octocat",
                    required: true
                },
                {
                    key: "repo",
                    label: "Repository Name",
                    type: "template-input",
                    placeholder: "hello-world or {{NodeName.repo}}",
                    example: "hello-world",
                    required: true
                },
                {
                    key: "state",
                    label: "State",
                    type: "select",
                    defaultValue: "open",
                    options: [
                        {
                            value: "open",
                            label: "Open"
                        },
                        {
                            value: "closed",
                            label: "Closed"
                        },
                        {
                            value: "all",
                            label: "All"
                        }
                    ]
                },
                {
                    key: "labels",
                    label: "Labels (comma-separated)",
                    type: "template-input",
                    placeholder: "bug, help wanted"
                },
                {
                    key: "assignee",
                    label: "Assignee",
                    type: "template-input",
                    placeholder: "octocat or {{NodeName.assignee}}"
                },
                {
                    key: "perPage",
                    label: "Results per page",
                    type: "number",
                    min: 1,
                    defaultValue: "30"
                }
            ]
        },
        {
            slug: "get-issue",
            label: "Get Issue",
            description: "Get details of a specific issue",
            category: "GitHub",
            stepFunction: "getIssueStep",
            stepImportPath: "get-issue",
            outputFields: [
                {
                    field: "id",
                    description: "Unique ID of the issue"
                },
                {
                    field: "number",
                    description: "Issue number in the repository"
                },
                {
                    field: "title",
                    description: "Title of the issue"
                },
                {
                    field: "url",
                    description: "URL to view the issue on GitHub"
                },
                {
                    field: "state",
                    description: "State of the issue (open/closed)"
                },
                {
                    field: "body",
                    description: "Body content of the issue"
                },
                {
                    field: "labels",
                    description: "Array of label names"
                },
                {
                    field: "assignees",
                    description: "Array of assignee usernames"
                },
                {
                    field: "author",
                    description: "Username of the issue creator"
                },
                {
                    field: "createdAt",
                    description: "ISO timestamp when issue was created"
                },
                {
                    field: "updatedAt",
                    description: "ISO timestamp when issue was last updated"
                },
                {
                    field: "closedAt",
                    description: "ISO timestamp when issue was closed"
                },
                {
                    field: "commentsCount",
                    description: "Number of comments on the issue"
                }
            ],
            configFields: [
                {
                    key: "owner",
                    label: "Repository Owner",
                    type: "template-input",
                    placeholder: "octocat or {{NodeName.owner}}",
                    example: "octocat",
                    required: true
                },
                {
                    key: "repo",
                    label: "Repository Name",
                    type: "template-input",
                    placeholder: "hello-world or {{NodeName.repo}}",
                    example: "hello-world",
                    required: true
                },
                {
                    key: "issueNumber",
                    label: "Issue Number",
                    type: "template-input",
                    placeholder: "123 or {{NodeName.issueNumber}}",
                    example: "123",
                    required: true
                }
            ]
        },
        {
            slug: "update-issue",
            label: "Update Issue",
            description: "Update an existing issue in a GitHub repository",
            category: "GitHub",
            stepFunction: "updateIssueStep",
            stepImportPath: "update-issue",
            outputFields: [
                {
                    field: "id",
                    description: "Unique ID of the updated issue"
                },
                {
                    field: "number",
                    description: "Issue number in the repository"
                },
                {
                    field: "title",
                    description: "Title of the issue"
                },
                {
                    field: "url",
                    description: "URL to view the issue on GitHub"
                },
                {
                    field: "state",
                    description: "State of the issue (open/closed)"
                }
            ],
            configFields: [
                {
                    key: "owner",
                    label: "Repository Owner",
                    type: "template-input",
                    placeholder: "octocat or {{NodeName.owner}}",
                    example: "octocat",
                    required: true
                },
                {
                    key: "repo",
                    label: "Repository Name",
                    type: "template-input",
                    placeholder: "hello-world or {{NodeName.repo}}",
                    example: "hello-world",
                    required: true
                },
                {
                    key: "issueNumber",
                    label: "Issue Number",
                    type: "template-input",
                    placeholder: "123 or {{NodeName.issueNumber}}",
                    example: "123",
                    required: true
                },
                {
                    key: "title",
                    label: "New Title (optional)",
                    type: "template-input",
                    placeholder: "Updated title or {{NodeName.title}}"
                },
                {
                    key: "body",
                    label: "New Body (optional)",
                    type: "template-textarea",
                    placeholder: "Updated description. Use {{NodeName.field}} to insert data.",
                    rows: 4
                },
                {
                    key: "state",
                    label: "State",
                    type: "select",
                    options: [
                        {
                            value: "",
                            label: "No change"
                        },
                        {
                            value: "open",
                            label: "Open"
                        },
                        {
                            value: "closed",
                            label: "Closed"
                        }
                    ]
                },
                {
                    key: "labels",
                    label: "Labels (comma-separated, replaces existing)",
                    type: "template-input",
                    placeholder: "bug, help wanted"
                },
                {
                    key: "assignees",
                    label: "Assignees (comma-separated, replaces existing)",
                    type: "template-input",
                    placeholder: "octocat, hubot"
                }
            ]
        }
    ]
};
(0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerIntegration"])(githubPlugin);
const __TURBOPACK__default__export__ = githubPlugin;
}),
"[project]/plugins/linear/icon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LinearIcon",
    ()=>LinearIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function LinearIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        "aria-label": "Linear",
        className: className,
        fill: "none",
        viewBox: "0 0 100 100",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: "Linear"
            }, void 0, false, {
                fileName: "[project]/plugins/linear/icon.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M1.225 61.523c-.222-.949.908-1.546 1.597-.857l36.512 36.512c.69.69.092 1.82-.857 1.597-18.425-4.323-32.93-18.827-37.252-37.252ZM.002 46.889a.99.99 0 0 0 .29.76L52.35 99.71c.201.2.478.307.76.29 2.37-.149 4.695-.46 6.963-.927.765-.157 1.03-1.096.478-1.648L2.576 39.448c-.552-.551-1.491-.286-1.648.479a50.067 50.067 0 0 0-.926 6.962ZM4.21 29.705a.988.988 0 0 0 .208 1.1l64.776 64.776c.289.29.726.375 1.1.208a49.908 49.908 0 0 0 5.185-2.684.981.981 0 0 0 .183-1.54L8.436 24.336a.981.981 0 0 0-1.541.183 49.896 49.896 0 0 0-2.684 5.185Zm8.448-11.631a.986.986 0 0 1-.045-1.354C21.78 6.46 35.111 0 49.952 0 77.592 0 100 22.407 100 50.048c0 14.84-6.46 28.172-16.72 37.338a.986.986 0 0 1-1.354-.045L12.659 18.074Z",
                fill: "#5E6AD2"
            }, void 0, false, {
                fileName: "[project]/plugins/linear/icon.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/plugins/linear/icon.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/plugins/linear/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$linear$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/linear/icon.tsx [app-ssr] (ecmascript)");
;
;
const linearPlugin = {
    type: "linear",
    label: "Linear",
    description: "Create and manage issues in Linear",
    icon: __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$linear$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LinearIcon"],
    formFields: [
        {
            id: "apiKey",
            label: "API Key",
            type: "password",
            placeholder: "lin_api_...",
            configKey: "apiKey",
            envVar: "LINEAR_API_KEY",
            helpText: "Get your API key from ",
            helpLink: {
                text: "linear.app",
                url: "https://linear.app/settings/account/security/api-keys/new"
            }
        },
        {
            id: "teamId",
            label: "Team ID (Optional)",
            type: "text",
            placeholder: "Will use first team if not specified",
            configKey: "teamId",
            envVar: "LINEAR_TEAM_ID",
            helpText: "The team ID to create issues in. Leave blank to use your first team."
        }
    ],
    testConfig: {
        getTestFunction: async ()=>{
            const { testLinear } = await __turbopack_context__.A("[project]/plugins/linear/test.ts [app-ssr] (ecmascript, async loader)");
            return testLinear;
        }
    },
    actions: [
        {
            slug: "create-ticket",
            label: "Create Ticket",
            description: "Create an issue in Linear",
            category: "Linear",
            stepFunction: "createTicketStep",
            stepImportPath: "create-ticket",
            outputFields: [
                {
                    field: "id",
                    description: "Ticket ID"
                },
                {
                    field: "url",
                    description: "Ticket URL"
                },
                {
                    field: "title",
                    description: "Ticket title"
                }
            ],
            configFields: [
                {
                    key: "ticketTitle",
                    label: "Ticket Title",
                    type: "template-input",
                    placeholder: "Bug report or {{NodeName.title}}",
                    example: "Bug: Login button not working",
                    required: true
                },
                {
                    key: "ticketDescription",
                    label: "Description",
                    type: "template-textarea",
                    placeholder: "Description. Use {{NodeName.field}} to insert data from previous nodes.",
                    rows: 4,
                    example: "Users are unable to click the login button on mobile."
                },
                {
                    key: "ticketPriority",
                    label: "Priority",
                    type: "select",
                    defaultValue: "2",
                    options: [
                        {
                            value: "0",
                            label: "No Priority"
                        },
                        {
                            value: "1",
                            label: "Urgent"
                        },
                        {
                            value: "2",
                            label: "High"
                        },
                        {
                            value: "3",
                            label: "Normal"
                        },
                        {
                            value: "4",
                            label: "Low"
                        }
                    ]
                }
            ]
        },
        {
            slug: "find-issues",
            label: "Find Issues",
            description: "Search for issues in Linear",
            category: "Linear",
            stepFunction: "findIssuesStep",
            stepImportPath: "find-issues",
            outputFields: [
                {
                    field: "issues",
                    description: "Array of issues found"
                },
                {
                    field: "count",
                    description: "Number of issues"
                }
            ],
            configFields: [
                {
                    key: "linearAssigneeId",
                    label: "Assignee (User ID)",
                    type: "template-input",
                    placeholder: "user-id-123 or {{NodeName.userId}}"
                },
                {
                    key: "linearTeamId",
                    label: "Team ID (optional)",
                    type: "template-input",
                    placeholder: "team-id-456 or {{NodeName.teamId}}"
                },
                {
                    key: "linearStatus",
                    label: "Status (optional)",
                    type: "select",
                    defaultValue: "any",
                    placeholder: "Any status",
                    options: [
                        {
                            value: "any",
                            label: "Any"
                        },
                        {
                            value: "backlog",
                            label: "Backlog"
                        },
                        {
                            value: "todo",
                            label: "Todo"
                        },
                        {
                            value: "in_progress",
                            label: "In Progress"
                        },
                        {
                            value: "done",
                            label: "Done"
                        },
                        {
                            value: "canceled",
                            label: "Canceled"
                        }
                    ]
                },
                {
                    key: "linearLabel",
                    label: "Label (optional)",
                    type: "template-input",
                    placeholder: "bug, feature, etc. or {{NodeName.label}}"
                }
            ]
        }
    ]
};
// Auto-register on import
(0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerIntegration"])(linearPlugin);
const __TURBOPACK__default__export__ = linearPlugin;
}),
"[project]/plugins/perplexity/icon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PerplexityIcon",
    ()=>PerplexityIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function PerplexityIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        "aria-label": "Perplexity logo",
        className: className,
        fill: "none",
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        viewBox: "0 0 48 48",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: "Perplexity"
            }, void 0, false, {
                fileName: "[project]/plugins/perplexity/icon.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M24 4.5v39M13.73 16.573v-9.99L24 16.573m0 14.5L13.73 41.417V27.01L24 16.573m0 0l10.27-9.99v9.99"
            }, void 0, false, {
                fileName: "[project]/plugins/perplexity/icon.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M13.73 31.396H9.44V16.573h29.12v14.823h-4.29"
            }, void 0, false, {
                fileName: "[project]/plugins/perplexity/icon.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M24 16.573L34.27 27.01v14.407L24 31.073"
            }, void 0, false, {
                fileName: "[project]/plugins/perplexity/icon.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/plugins/perplexity/icon.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/plugins/perplexity/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$perplexity$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/perplexity/icon.tsx [app-ssr] (ecmascript)");
;
;
const perplexityPlugin = {
    type: "perplexity",
    label: "Perplexity",
    description: "AI-powered search and research with real-time web access",
    icon: __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$perplexity$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PerplexityIcon"],
    formFields: [
        {
            id: "perplexityApiKey",
            label: "API Key",
            type: "password",
            placeholder: "pplx-...",
            configKey: "apiKey",
            envVar: "PERPLEXITY_API_KEY",
            helpText: "Get your API key from ",
            helpLink: {
                text: "perplexity.ai/settings/api",
                url: "https://www.perplexity.ai/settings/api"
            }
        }
    ],
    testConfig: {
        getTestFunction: async ()=>{
            const { testPerplexity } = await __turbopack_context__.A("[project]/plugins/perplexity/test.ts [app-ssr] (ecmascript, async loader)");
            return testPerplexity;
        }
    },
    actions: [
        {
            slug: "search",
            label: "Search Web",
            description: "Search the web with AI-powered answers and citations from Perplexity",
            category: "Perplexity",
            stepFunction: "perplexitySearchStep",
            stepImportPath: "search",
            outputFields: [
                {
                    field: "answer",
                    description: "AI-generated answer to the query"
                },
                {
                    field: "citations",
                    description: "Array of source URLs"
                },
                {
                    field: "model",
                    description: "Model used for the response"
                }
            ],
            configFields: [
                {
                    key: "query",
                    label: "Search Query",
                    type: "template-input",
                    placeholder: "Enter your search query or use {{NodeName.field}}",
                    example: "What are the latest developments in AI?",
                    required: true
                },
                {
                    key: "searchFocus",
                    label: "Search Focus",
                    type: "select",
                    defaultValue: "internet",
                    options: [
                        {
                            value: "internet",
                            label: "General Web"
                        },
                        {
                            value: "academic",
                            label: "Academic Sources"
                        },
                        {
                            value: "news",
                            label: "News Articles"
                        },
                        {
                            value: "youtube",
                            label: "YouTube"
                        },
                        {
                            value: "reddit",
                            label: "Reddit"
                        }
                    ]
                }
            ]
        },
        {
            slug: "ask",
            label: "Ask Question",
            description: "Ask a question and get an AI-powered response with web sources",
            category: "Perplexity",
            stepFunction: "perplexityAskStep",
            stepImportPath: "ask",
            outputFields: [
                {
                    field: "answer",
                    description: "AI-generated answer"
                },
                {
                    field: "citations",
                    description: "Array of source URLs"
                },
                {
                    field: "model",
                    description: "Model used for the response"
                }
            ],
            configFields: [
                {
                    key: "question",
                    label: "Question",
                    type: "template-textarea",
                    placeholder: "Enter your question or use {{NodeName.field}}",
                    example: "Explain quantum computing in simple terms",
                    rows: 3,
                    required: true
                },
                {
                    key: "systemPrompt",
                    label: "System Prompt",
                    type: "template-textarea",
                    placeholder: "Optional: customize how Perplexity responds",
                    rows: 2
                },
                {
                    key: "model",
                    label: "Model",
                    type: "select",
                    defaultValue: "sonar",
                    options: [
                        {
                            value: "sonar",
                            label: "Sonar (Fast)"
                        },
                        {
                            value: "sonar-pro",
                            label: "Sonar Pro (Advanced)"
                        },
                        {
                            value: "sonar-reasoning",
                            label: "Sonar Reasoning (Complex)"
                        }
                    ]
                }
            ]
        },
        {
            slug: "research",
            label: "Research Topic",
            description: "Conduct deep research on a topic with comprehensive analysis and citations",
            category: "Perplexity",
            stepFunction: "perplexityResearchStep",
            stepImportPath: "research",
            outputFields: [
                {
                    field: "report",
                    description: "Comprehensive research report"
                },
                {
                    field: "citations",
                    description: "Array of source URLs"
                },
                {
                    field: "model",
                    description: "Model used for the response"
                }
            ],
            configFields: [
                {
                    key: "topic",
                    label: "Research Topic",
                    type: "template-textarea",
                    placeholder: "Enter the topic to research or use {{NodeName.field}}",
                    example: "The impact of artificial intelligence on healthcare",
                    rows: 3,
                    required: true
                },
                {
                    key: "depth",
                    label: "Research Depth",
                    type: "select",
                    defaultValue: "detailed",
                    options: [
                        {
                            value: "brief",
                            label: "Brief Overview"
                        },
                        {
                            value: "detailed",
                            label: "Detailed Analysis"
                        },
                        {
                            value: "comprehensive",
                            label: "Comprehensive Report"
                        }
                    ]
                }
            ]
        }
    ]
};
// Auto-register on import
(0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerIntegration"])(perplexityPlugin);
const __TURBOPACK__default__export__ = perplexityPlugin;
}),
"[project]/plugins/resend/icon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ResendIcon",
    ()=>ResendIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function ResendIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        fill: "currentColor",
        viewBox: "0 0 1800 1800",
        xmlns: "http://www.w3.org/2000/svg",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M1000.46 450C1174.77 450 1278.43 553.669 1278.43 691.282C1278.43 828.896 1174.77 932.563 1000.46 932.563H912.382L1350 1350H1040.82L707.794 1033.48C683.944 1011.47 672.936 985.781 672.935 963.765C672.935 932.572 694.959 905.049 737.161 893.122L908.712 847.244C973.85 829.812 1018.81 779.353 1018.81 713.298C1018.8 632.567 952.745 585.78 871.095 585.78H450V450H1000.46Z",
            fill: "currentColor"
        }, void 0, false, {
            fileName: "[project]/plugins/resend/icon.tsx",
            lineNumber: 9,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/plugins/resend/icon.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/plugins/resend/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$resend$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/resend/icon.tsx [app-ssr] (ecmascript)");
;
;
const resendPlugin = {
    type: "resend",
    label: "Resend",
    description: "Send transactional emails",
    icon: __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$resend$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResendIcon"],
    formFields: [
        {
            id: "apiKey",
            label: "API Key",
            type: "password",
            placeholder: "re_...",
            configKey: "apiKey",
            envVar: "RESEND_API_KEY",
            helpText: "Get your API key from ",
            helpLink: {
                text: "resend.com/api-keys",
                url: "https://resend.com/api-keys"
            }
        },
        {
            id: "fromEmail",
            label: "Default Sender",
            type: "text",
            placeholder: "Your Name <noreply@yourdomain.com>",
            configKey: "fromEmail",
            envVar: "RESEND_FROM_EMAIL",
            helpText: "The name and email that will appear as the sender"
        }
    ],
    testConfig: {
        getTestFunction: async ()=>{
            const { testResend } = await __turbopack_context__.A("[project]/plugins/resend/test.ts [app-ssr] (ecmascript, async loader)");
            return testResend;
        }
    },
    actions: [
        {
            slug: "send-email",
            label: "Send Email",
            description: "Send an email via Resend",
            category: "Resend",
            stepFunction: "sendEmailStep",
            stepImportPath: "send-email",
            outputFields: [
                {
                    field: "id",
                    description: "Email ID"
                }
            ],
            configFields: [
                {
                    key: "emailFrom",
                    label: "From (Sender)",
                    type: "template-input",
                    placeholder: "Your Name <noreply@example.com>",
                    example: "Support <support@example.com>"
                },
                {
                    key: "emailTo",
                    label: "To",
                    type: "template-input",
                    placeholder: "recipient@example.com",
                    example: "user@example.com",
                    required: true
                },
                {
                    key: "emailSubject",
                    label: "Subject",
                    type: "template-input",
                    placeholder: "Subject or {{NodeName.title}}",
                    example: "Hello from my workflow",
                    required: true
                },
                {
                    key: "emailBody",
                    label: "Body",
                    type: "template-textarea",
                    placeholder: "Email content or {{NodeName.description}}",
                    rows: 5,
                    example: "This is the email body content.",
                    required: true
                },
                {
                    type: "group",
                    label: "Additional Recipients",
                    fields: [
                        {
                            key: "emailCc",
                            label: "CC",
                            type: "template-input",
                            placeholder: "cc@example.com",
                            example: "manager@example.com"
                        },
                        {
                            key: "emailBcc",
                            label: "BCC",
                            type: "template-input",
                            placeholder: "bcc@example.com",
                            example: "archive@example.com"
                        },
                        {
                            key: "emailReplyTo",
                            label: "Reply-To",
                            type: "template-input",
                            placeholder: "reply@example.com",
                            example: "support@example.com"
                        }
                    ]
                },
                {
                    type: "group",
                    label: "Scheduling",
                    fields: [
                        {
                            key: "emailScheduledAt",
                            label: "Schedule At (ISO 8601)",
                            type: "template-input",
                            placeholder: "2024-12-25T09:00:00Z",
                            example: "2024-12-25T09:00:00Z"
                        },
                        {
                            key: "emailTopicId",
                            label: "Topic ID",
                            type: "template-input",
                            placeholder: "topic_abc123",
                            example: "topic_abc123"
                        }
                    ]
                }
            ]
        }
    ]
};
// Auto-register on import
(0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerIntegration"])(resendPlugin);
const __TURBOPACK__default__export__ = resendPlugin;
}),
"[project]/plugins/slack/icon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SlackIcon",
    ()=>SlackIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function SlackIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        "aria-label": "Slack",
        className: className,
        viewBox: "0 0 2447.6 2452.5",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: "Slack"
            }, void 0, false, {
                fileName: "[project]/plugins/slack/icon.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                clipRule: "evenodd",
                fillRule: "evenodd",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z",
                        fill: "#36c5f0"
                    }, void 0, false, {
                        fileName: "[project]/plugins/slack/icon.tsx",
                        lineNumber: 11,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z",
                        fill: "#2eb67d"
                    }, void 0, false, {
                        fileName: "[project]/plugins/slack/icon.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z",
                        fill: "#ecb22e"
                    }, void 0, false, {
                        fileName: "[project]/plugins/slack/icon.tsx",
                        lineNumber: 19,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0",
                        fill: "#e01e5a"
                    }, void 0, false, {
                        fileName: "[project]/plugins/slack/icon.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/plugins/slack/icon.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/plugins/slack/icon.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/plugins/slack/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$slack$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/slack/icon.tsx [app-ssr] (ecmascript)");
;
;
const slackPlugin = {
    type: "slack",
    label: "Slack",
    description: "Send messages to Slack channels",
    icon: __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$slack$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SlackIcon"],
    formFields: [
        {
            id: "apiKey",
            label: "Bot Token",
            type: "password",
            placeholder: "xoxb-...",
            configKey: "apiKey",
            envVar: "SLACK_API_KEY",
            helpText: "Create a Slack app and get your Bot Token from ",
            helpLink: {
                text: "api.slack.com/apps",
                url: "https://api.slack.com/apps"
            }
        }
    ],
    testConfig: {
        getTestFunction: async ()=>{
            const { testSlack } = await __turbopack_context__.A("[project]/plugins/slack/test.ts [app-ssr] (ecmascript, async loader)");
            return testSlack;
        }
    },
    actions: [
        {
            slug: "send-message",
            label: "Send Slack Message",
            description: "Send a message to a Slack channel",
            category: "Slack",
            stepFunction: "sendSlackMessageStep",
            stepImportPath: "send-slack-message",
            outputFields: [
                {
                    field: "ts",
                    description: "Message timestamp"
                },
                {
                    field: "channel",
                    description: "Channel ID"
                }
            ],
            configFields: [
                {
                    key: "slackChannel",
                    label: "Channel",
                    type: "text",
                    placeholder: "#general or {{NodeName.channel}}",
                    example: "#general",
                    required: true
                },
                {
                    key: "slackMessage",
                    label: "Message",
                    type: "template-textarea",
                    placeholder: "Your message. Use {{NodeName.field}} to insert data from previous nodes.",
                    rows: 4,
                    example: "Hello from my workflow!",
                    required: true
                }
            ]
        }
    ]
};
// Auto-register on import
(0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerIntegration"])(slackPlugin);
const __TURBOPACK__default__export__ = slackPlugin;
}),
"[project]/plugins/stripe/icon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StripeIcon",
    ()=>StripeIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function StripeIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        "aria-label": "Stripe logo",
        className: className,
        fill: "currentColor",
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: "Stripe"
            }, void 0, false, {
                fileName: "[project]/plugins/stripe/icon.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"
            }, void 0, false, {
                fileName: "[project]/plugins/stripe/icon.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/plugins/stripe/icon.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/plugins/stripe/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$stripe$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/stripe/icon.tsx [app-ssr] (ecmascript)");
;
;
const stripePlugin = {
    type: "stripe",
    label: "Stripe",
    description: "Payment processing and billing",
    icon: __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$stripe$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StripeIcon"],
    formFields: [
        {
            id: "apiKey",
            label: "Secret Key",
            type: "password",
            placeholder: "sk_live_... or sk_test_...",
            configKey: "apiKey",
            envVar: "STRIPE_SECRET_KEY",
            helpText: "Get your secret key from ",
            helpLink: {
                text: "dashboard.stripe.com/apikeys",
                url: "https://dashboard.stripe.com/apikeys"
            }
        }
    ],
    testConfig: {
        getTestFunction: async ()=>{
            const { testStripe } = await __turbopack_context__.A("[project]/plugins/stripe/test.ts [app-ssr] (ecmascript, async loader)");
            return testStripe;
        }
    },
    actions: [
        {
            slug: "create-customer",
            label: "Create Customer",
            description: "Create a new customer in Stripe",
            category: "Stripe",
            stepFunction: "createCustomerStep",
            stepImportPath: "create-customer",
            outputFields: [
                {
                    field: "id",
                    description: "Customer ID"
                },
                {
                    field: "email",
                    description: "Customer email"
                }
            ],
            configFields: [
                {
                    key: "email",
                    label: "Email",
                    type: "template-input",
                    placeholder: "customer@example.com or {{NodeName.email}}",
                    example: "customer@example.com",
                    required: true
                },
                {
                    key: "name",
                    label: "Name",
                    type: "template-input",
                    placeholder: "John Doe or {{NodeName.name}}",
                    example: "John Doe"
                },
                {
                    key: "phone",
                    label: "Phone",
                    type: "template-input",
                    placeholder: "+1234567890",
                    example: "+1234567890"
                },
                {
                    type: "group",
                    label: "Additional Details",
                    fields: [
                        {
                            key: "description",
                            label: "Description",
                            type: "template-input",
                            placeholder: "Internal notes about this customer",
                            example: "VIP customer"
                        },
                        {
                            key: "metadata",
                            label: "Metadata (JSON)",
                            type: "template-textarea",
                            placeholder: '{"key": "value"}',
                            example: '{"plan": "enterprise", "source": "website"}',
                            rows: 3
                        }
                    ]
                }
            ]
        },
        {
            slug: "get-customer",
            label: "Get Customer",
            description: "Retrieve a customer by ID or email",
            category: "Stripe",
            stepFunction: "getCustomerStep",
            stepImportPath: "get-customer",
            outputFields: [
                {
                    field: "id",
                    description: "Customer ID"
                },
                {
                    field: "email",
                    description: "Customer email"
                },
                {
                    field: "name",
                    description: "Customer name"
                },
                {
                    field: "created",
                    description: "Creation timestamp"
                }
            ],
            configFields: [
                {
                    key: "customerId",
                    label: "Customer ID",
                    type: "template-input",
                    placeholder: "cus_... or {{NodeName.customerId}}",
                    example: "cus_ABC123"
                },
                {
                    key: "email",
                    label: "Email (alternative lookup)",
                    type: "template-input",
                    placeholder: "customer@example.com",
                    example: "customer@example.com"
                }
            ]
        },
        {
            slug: "create-invoice",
            label: "Create Invoice",
            description: "Create and optionally send an invoice",
            category: "Stripe",
            stepFunction: "createInvoiceStep",
            stepImportPath: "create-invoice",
            outputFields: [
                {
                    field: "id",
                    description: "Invoice ID"
                },
                {
                    field: "number",
                    description: "Invoice number"
                },
                {
                    field: "hostedInvoiceUrl",
                    description: "Hosted invoice URL"
                },
                {
                    field: "status",
                    description: "Invoice status"
                }
            ],
            configFields: [
                {
                    key: "customerId",
                    label: "Customer ID",
                    type: "template-input",
                    placeholder: "cus_... or {{NodeName.customerId}}",
                    example: "cus_ABC123",
                    required: true
                },
                {
                    key: "description",
                    label: "Description",
                    type: "template-input",
                    placeholder: "Invoice description",
                    example: "Professional services - January 2024"
                },
                {
                    key: "lineItems",
                    label: "Line Items (JSON array)",
                    type: "template-textarea",
                    placeholder: '[{"description": "Item", "amount": 1000, "quantity": 1}]',
                    example: '[{"description": "Consulting", "amount": 15000, "quantity": 2}]',
                    rows: 4,
                    required: true
                },
                {
                    type: "group",
                    label: "Invoice Options",
                    fields: [
                        {
                            key: "daysUntilDue",
                            label: "Days Until Due",
                            type: "number",
                            defaultValue: "30",
                            min: 1
                        },
                        {
                            key: "autoAdvance",
                            label: "Auto-finalize",
                            type: "select",
                            options: [
                                {
                                    value: "true",
                                    label: "Yes"
                                },
                                {
                                    value: "false",
                                    label: "No (draft)"
                                }
                            ],
                            defaultValue: "true"
                        },
                        {
                            key: "collectionMethod",
                            label: "Collection Method",
                            type: "select",
                            options: [
                                {
                                    value: "send_invoice",
                                    label: "Send Invoice"
                                },
                                {
                                    value: "charge_automatically",
                                    label: "Charge Automatically"
                                }
                            ],
                            defaultValue: "send_invoice"
                        },
                        {
                            key: "metadata",
                            label: "Metadata (JSON)",
                            type: "template-textarea",
                            placeholder: '{"key": "value"}',
                            example: '{"project": "website-redesign"}',
                            rows: 3
                        }
                    ]
                }
            ]
        }
    ]
};
(0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerIntegration"])(stripePlugin);
const __TURBOPACK__default__export__ = stripePlugin;
}),
"[project]/plugins/superagent/icon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SuperagentIcon",
    ()=>SuperagentIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function SuperagentIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        "aria-label": "Superagent",
        className: className,
        width: "48",
        height: "48",
        viewBox: "0 0 690 690",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: "Superagent"
            }, void 0, false, {
                fileName: "[project]/plugins/superagent/icon.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M331.167 126.514L660.346 456.95L331.167 383.373L331.167 126.514Z",
                fill: "#0671A2"
            }, void 0, false, {
                fileName: "[project]/plugins/superagent/icon.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M330.539 124L34.0258 456.949L330.539 380.307L330.539 124Z",
                fill: "#FDCCD1"
            }, void 0, false, {
                fileName: "[project]/plugins/superagent/icon.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M333.68 565L29.0002 455.692L333.68 381.564L654.12 455.692L333.68 565Z",
                fill: "#181818"
            }, void 0, false, {
                fileName: "[project]/plugins/superagent/icon.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/plugins/superagent/icon.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/plugins/superagent/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$superagent$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/superagent/icon.tsx [app-ssr] (ecmascript)");
;
;
const superagentPlugin = {
    type: "superagent",
    label: "Superagent",
    description: "AI guardrails for prompt injection detection and PII redaction",
    icon: __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$superagent$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SuperagentIcon"],
    formFields: [
        {
            id: "superagentApiKey",
            label: "API Key",
            type: "password",
            placeholder: "sa-...",
            configKey: "superagentApiKey",
            envVar: "SUPERAGENT_API_KEY",
            helpText: "Get your API key from ",
            helpLink: {
                text: "superagent.sh",
                url: "https://app.superagent.sh"
            }
        }
    ],
    testConfig: {
        getTestFunction: async ()=>{
            const { testSuperagent } = await __turbopack_context__.A("[project]/plugins/superagent/test.ts [app-ssr] (ecmascript, async loader)");
            return testSuperagent;
        }
    },
    actions: [
        {
            slug: "guard",
            label: "Guard",
            description: "Detect prompt injection, system prompt extraction, or data exfiltration attempts",
            category: "Superagent",
            stepFunction: "superagentGuardStep",
            stepImportPath: "guard",
            outputFields: [
                {
                    field: "classification",
                    description: "Threat classification"
                },
                {
                    field: "violationTypes",
                    description: "Array of violation types"
                },
                {
                    field: "cweCodes",
                    description: "Array of CWE codes"
                },
                {
                    field: "reasoning",
                    description: "Analysis reasoning"
                }
            ],
            configFields: [
                {
                    key: "text",
                    label: "Text",
                    type: "template-textarea",
                    placeholder: "Text to analyze or {{NodeName.text}}",
                    example: "Analyze this user input for security threats",
                    required: true,
                    rows: 4
                }
            ]
        },
        {
            slug: "redact",
            label: "Redact",
            description: "Remove sensitive information (PII/PHI) like SSNs, emails, and phone numbers from text",
            category: "Superagent",
            stepFunction: "superagentRedactStep",
            stepImportPath: "redact",
            outputFields: [
                {
                    field: "redactedText",
                    description: "Text with PII redacted"
                },
                {
                    field: "reasoning",
                    description: "Redaction reasoning"
                }
            ],
            configFields: [
                {
                    key: "text",
                    label: "Text",
                    type: "template-textarea",
                    placeholder: "Text to redact or {{NodeName.text}}",
                    example: "My email is john@example.com and SSN is 123-45-6789",
                    required: true,
                    rows: 4
                },
                {
                    key: "entities",
                    label: "Entity Types",
                    type: "text",
                    placeholder: "Optional: SSN, EMAIL, PHONE (comma-separated)",
                    example: ""
                }
            ]
        }
    ]
};
// Auto-register on import
(0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerIntegration"])(superagentPlugin);
const __TURBOPACK__default__export__ = superagentPlugin;
}),
"[project]/plugins/v0/icon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "V0Icon",
    ()=>V0Icon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function V0Icon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        fill: "currentColor",
        viewBox: "0 0 147 70",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M56 50.2031V14H70V60.1562C70 65.5928 65.5928 70 60.1562 70C57.5605 70 54.9982 68.9992 53.1562 67.1573L0 14H19.7969L56 50.2031Z"
            }, void 0, false, {
                fileName: "[project]/plugins/v0/icon.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M147 56H133V23.9531L100.953 56H133V70H96.6875C85.8144 70 77 61.1856 77 50.3125V14H91V46.1562L123.156 14H91V0H127.312C138.186 0 147 8.81439 147 19.6875V56Z"
            }, void 0, false, {
                fileName: "[project]/plugins/v0/icon.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/plugins/v0/icon.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/plugins/v0/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$v0$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/v0/icon.tsx [app-ssr] (ecmascript)");
;
;
const v0Plugin = {
    type: "v0",
    label: "v0",
    description: "Generate UI components with AI",
    icon: __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$v0$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["V0Icon"],
    formFields: [
        {
            id: "apiKey",
            label: "API Key",
            type: "password",
            placeholder: "v0_...",
            configKey: "apiKey",
            envVar: "V0_API_KEY",
            helpText: "Get your API key from ",
            helpLink: {
                text: "v0.dev/chat/settings/keys",
                url: "https://v0.dev/chat/settings/keys"
            }
        }
    ],
    testConfig: {
        getTestFunction: async ()=>{
            const { testV0 } = await __turbopack_context__.A("[project]/plugins/v0/test.ts [app-ssr] (ecmascript, async loader)");
            return testV0;
        }
    },
    dependencies: {},
    actions: [
        {
            slug: "create-chat",
            label: "Create Chat",
            description: "Create a new chat in v0",
            category: "v0",
            stepFunction: "createChatStep",
            stepImportPath: "create-chat",
            outputFields: [
                {
                    field: "chatId",
                    description: "v0 chat ID"
                },
                {
                    field: "url",
                    description: "v0 chat URL"
                },
                {
                    field: "demoUrl",
                    description: "Demo preview URL"
                }
            ],
            outputConfig: {
                type: "url",
                field: "demoUrl"
            },
            configFields: [
                {
                    key: "message",
                    label: "Message",
                    type: "template-textarea",
                    placeholder: "Create a landing page for a new product",
                    rows: 4,
                    example: "Create a dashboard with a line chart showing DAU over time",
                    required: true
                },
                {
                    key: "system",
                    label: "System Prompt (Optional)",
                    type: "template-textarea",
                    placeholder: "You are an expert coder",
                    rows: 3
                }
            ]
        },
        {
            slug: "send-message",
            label: "Send Message",
            description: "Send a message to an existing v0 chat",
            category: "v0",
            stepFunction: "sendMessageStep",
            stepImportPath: "send-message",
            outputFields: [
                {
                    field: "chatId",
                    description: "v0 chat ID"
                },
                {
                    field: "demoUrl",
                    description: "Demo preview URL"
                }
            ],
            outputConfig: {
                type: "url",
                field: "demoUrl"
            },
            configFields: [
                {
                    key: "chatId",
                    label: "Chat ID",
                    type: "template-input",
                    placeholder: "chat_123 or {{CreateChat.chatId}}",
                    example: "{{CreateChat.chatId}}",
                    required: true
                },
                {
                    key: "message",
                    label: "Message",
                    type: "template-textarea",
                    placeholder: "Add dark mode",
                    rows: 4,
                    example: "Add dark mode support",
                    required: true
                }
            ]
        }
    ]
};
// Auto-register on import
(0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerIntegration"])(v0Plugin);
const __TURBOPACK__default__export__ = v0Plugin;
}),
"[project]/plugins/webflow/icon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WebflowIcon",
    ()=>WebflowIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function WebflowIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        "aria-label": "Webflow logo",
        className: className,
        fill: "currentColor",
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: "Webflow"
            }, void 0, false, {
                fileName: "[project]/plugins/webflow/icon.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m24 4.515-7.658 14.97H9.149l3.205-6.204h-.144C9.566 16.713 5.621 18.973 0 19.485v-6.118s3.596-.213 5.71-2.435H0V4.515h6.417v5.278l.144-.001 2.622-5.277h4.854v5.244h.144l2.72-5.244H24Z"
            }, void 0, false, {
                fileName: "[project]/plugins/webflow/icon.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/plugins/webflow/icon.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/plugins/webflow/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$webflow$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/webflow/icon.tsx [app-ssr] (ecmascript)");
;
;
const webflowPlugin = {
    type: "webflow",
    label: "Webflow",
    description: "Publish and manage Webflow sites",
    icon: __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$webflow$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WebflowIcon"],
    formFields: [
        {
            id: "apiKey",
            label: "API Token",
            type: "password",
            placeholder: "your-api-token",
            configKey: "apiKey",
            envVar: "WEBFLOW_API_KEY",
            helpText: "Generate an API token from ",
            helpLink: {
                text: "Webflow Dashboard",
                url: "https://webflow.com/dashboard"
            }
        }
    ],
    testConfig: {
        getTestFunction: async ()=>{
            const { testWebflow } = await __turbopack_context__.A("[project]/plugins/webflow/test.ts [app-ssr] (ecmascript, async loader)");
            return testWebflow;
        }
    },
    actions: [
        {
            slug: "list-sites",
            label: "List Sites",
            description: "Get all sites accessible with the API token",
            category: "Webflow",
            stepFunction: "listSitesStep",
            stepImportPath: "list-sites",
            outputFields: [
                {
                    field: "sites",
                    description: "Array of site objects"
                },
                {
                    field: "count",
                    description: "Number of sites returned"
                }
            ],
            configFields: []
        },
        {
            slug: "get-site",
            label: "Get Site",
            description: "Get details of a specific Webflow site",
            category: "Webflow",
            stepFunction: "getSiteStep",
            stepImportPath: "get-site",
            outputFields: [
                {
                    field: "id",
                    description: "Site ID"
                },
                {
                    field: "displayName",
                    description: "Display name of the site"
                },
                {
                    field: "shortName",
                    description: "Short name (subdomain)"
                },
                {
                    field: "previewUrl",
                    description: "Preview URL"
                },
                {
                    field: "lastPublished",
                    description: "Last published timestamp"
                },
                {
                    field: "customDomains",
                    description: "Array of custom domains"
                }
            ],
            configFields: [
                {
                    key: "siteId",
                    label: "Site ID",
                    type: "template-input",
                    placeholder: "site-id or {{NodeName.id}}",
                    example: "580e63e98c9a982ac9b8b741",
                    required: true
                }
            ]
        },
        {
            slug: "publish-site",
            label: "Publish Site",
            description: "Publish a site to one or more domains",
            category: "Webflow",
            stepFunction: "publishSiteStep",
            stepImportPath: "publish-site",
            outputFields: [
                {
                    field: "publishedDomains",
                    description: "Array of published domain URLs"
                },
                {
                    field: "publishedToSubdomain",
                    description: "Whether published to Webflow subdomain"
                }
            ],
            configFields: [
                {
                    key: "siteId",
                    label: "Site ID",
                    type: "template-input",
                    placeholder: "site-id or {{NodeName.id}}",
                    example: "580e63e98c9a982ac9b8b741",
                    required: true
                },
                {
                    key: "publishToWebflowSubdomain",
                    label: "Publish to Webflow Subdomain",
                    type: "select",
                    options: [
                        {
                            value: "true",
                            label: "Yes"
                        },
                        {
                            value: "false",
                            label: "No"
                        }
                    ],
                    defaultValue: "true"
                },
                {
                    key: "customDomainIds",
                    label: "Custom Domain IDs (comma-separated)",
                    type: "template-input",
                    placeholder: "domain-id-1, domain-id-2",
                    example: "589a331aa51e760df7ccb89d"
                }
            ]
        }
    ]
};
(0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerIntegration"])(webflowPlugin);
const __TURBOPACK__default__export__ = webflowPlugin;
}),
"[project]/plugins/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Plugins Index (Auto-Generated)
 *
 * This file is automatically generated by scripts/discover-plugins.ts
 * DO NOT EDIT MANUALLY - your changes will be overwritten!
 *
 * To add a new integration:
 * 1. Create a new directory in plugins/ (e.g., plugins/my-integration/)
 * 2. Add your plugin files (index.tsx, steps/, codegen/, etc.)
 * 3. Run: pnpm discover-plugins (or it runs automatically on build)
 *
 * To remove an integration:
 * 1. Delete the plugin directory
 * 2. Run: pnpm discover-plugins (or it runs automatically on build)
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$ai$2d$gateway$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/ai-gateway/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$blob$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/blob/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$clerk$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/clerk/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$fal$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/fal/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$firecrawl$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/firecrawl/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$github$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/github/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$linear$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/linear/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$perplexity$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/perplexity/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$resend$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/resend/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$slack$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/slack/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$stripe$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/stripe/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$superagent$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/superagent/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$v0$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/v0/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$webflow$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/webflow/index.ts [app-ssr] (ecmascript)");
// Export the registry utilities
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/registry.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
}),
];

//# sourceMappingURL=plugins_c22c93f8._.js.map