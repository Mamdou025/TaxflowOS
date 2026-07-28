(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/.pnpm/@copilotkit+react-core@1.62_2b5035863a1cfdc26d5a4a9b28e91607/node_modules/@copilotkit/react-core/dist/index.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CopilotTask",
    ()=>CopilotTask,
    "SUGGESTION_RETRY_CONFIG",
    ()=>SUGGESTION_RETRY_CONFIG,
    "useCoAgent",
    ()=>useCoAgent,
    "useCoAgentStateRender",
    ()=>useCoAgentStateRender,
    "useCopilotAction",
    ()=>useCopilotAction,
    "useCopilotAdditionalInstructions",
    ()=>useCopilotAdditionalInstructions,
    "useCopilotAuthenticatedAction_c",
    ()=>useCopilotAuthenticatedAction_c,
    "useCopilotChat",
    ()=>useCopilotChat,
    "useCopilotChatHeadless_c",
    ()=>useCopilotChatHeadless_c,
    "useCopilotChatInternal",
    ()=>useCopilotChatInternal,
    "useCopilotChatSuggestions",
    ()=>useCopilotChatSuggestions,
    "useCopilotReadable",
    ()=>useCopilotReadable,
    "useCopilotRuntimeClient",
    ()=>useCopilotRuntimeClient,
    "useDefaultTool",
    ()=>useDefaultTool,
    "useFrontendTool",
    ()=>useFrontendTool,
    "useHumanInTheLoop",
    ()=>useHumanInTheLoop,
    "useLangGraphInterrupt",
    ()=>useLangGraphInterrupt,
    "useLazyToolRenderer",
    ()=>useLazyToolRenderer,
    "useMakeCopilotDocumentReadable",
    ()=>useMakeCopilotDocumentReadable,
    "useRenderToolCall",
    ()=>useRenderToolCall
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@copilotkit+react-core@1.62_2b5035863a1cfdc26d5a4a9b28e91607/node_modules/@copilotkit/react-core/dist/copilotkit-ympAovXs.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$core$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$copilotkit$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@copilotkit+core@1.62.3_@ag-ui+core@0.0.57_zod@4.1.12/node_modules/@copilotkit/core/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@ag-ui+core@0.0.57/node_modules/@ag-ui/core/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ag$2d$ui$2b$client$40$0$2e$0$2e$57$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@ag-ui+client@0.0.57/node_modules/@ag-ui/client/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@copilotkit+shared@1.62.3_@ag-ui+core@0.0.57/node_modules/@copilotkit/shared/dist/utils/errors.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$json$2d$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@copilotkit+shared@1.62.3_@ag-ui+core@0.0.57/node_modules/@copilotkit/shared/dist/utils/json-schema.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@copilotkit+shared@1.62.3_@ag-ui+core@0.0.57/node_modules/@copilotkit/shared/dist/utils/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$random$2d$id$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@copilotkit+shared@1.62.3_@ag-ui+core@0.0.57/node_modules/@copilotkit/shared/dist/utils/random-id.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$console$2d$styling$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@copilotkit+shared@1.62.3_@ag-ui+core@0.0.57/node_modules/@copilotkit/shared/dist/utils/console-styling.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$graphql$2f40$generated$2f$graphql$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@copilotkit+runtime-client-_5e8b47a518e506d2fdf369f9e6a68d19/node_modules/@copilotkit/runtime-client-gql/dist/graphql/@generated/graphql.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$client$2f$CopilotRuntimeClient$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@copilotkit+runtime-client-_5e8b47a518e506d2fdf369f9e6a68d19/node_modules/@copilotkit/runtime-client-gql/dist/client/CopilotRuntimeClient.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$client$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@copilotkit+runtime-client-_5e8b47a518e506d2fdf369f9e6a68d19/node_modules/@copilotkit/runtime-client-gql/dist/client/types.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$client$2f$conversion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@copilotkit+runtime-client-_5e8b47a518e506d2fdf369f9e6a68d19/node_modules/@copilotkit/runtime-client-gql/dist/client/conversion.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$message$2d$conversion$2f$gql$2d$to$2d$agui$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@copilotkit+runtime-client-_5e8b47a518e506d2fdf369f9e6a68d19/node_modules/@copilotkit/runtime-client-gql/dist/message-conversion/gql-to-agui.mjs [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
//#region src/utils/suggestions-constants.ts
/**
* Constants for suggestions retry logic
*/ const SUGGESTION_RETRY_CONFIG = {
    MAX_RETRIES: 3,
    COOLDOWN_MS: 5e3
};
//#endregion
//#region src/hooks/use-lazy-tool-renderer.tsx
function useLazyToolRenderer() {
    const renderToolCall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["vt"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLazyToolRenderer.useCallback": (message, messages)=>{
            if (!message?.toolCalls?.length) return null;
            const toolCall = message.toolCalls[0];
            if (!toolCall) return null;
            const toolMessage = messages?.find({
                "useLazyToolRenderer.useCallback": (m)=>m.role === "tool" && m.toolCallId === toolCall.id
            }["useLazyToolRenderer.useCallback"]);
            return ({
                "useLazyToolRenderer.useCallback": ()=>renderToolCall({
                        toolCall,
                        toolMessage
                    })
            })["useLazyToolRenderer.useCallback"];
        }
    }["useLazyToolRenderer.useCallback"], [
        renderToolCall
    ]);
}
//#endregion
//#region src/hooks/use-copilot-chat_internal.ts
function useCopilotChatInternal({ suggestions, onInProgress, onSubmitMessage, onStopGeneration, onReloadMessages } = {}) {
    const { copilotkit } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yt"])();
    const { threadId, agentSession } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["g"])();
    const existingConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tt"])();
    const [agentAvailable, setAgentAvailable] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const resolvedAgentId = existingConfig?.agentId ?? "default";
    const { agent } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tt"])({
        agentId: resolvedAgentId
    });
    const lastConnectedAgentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCopilotChatInternal.useEffect": ()=>{
            let detached = false;
            const connectAbortController = new AbortController();
            if (agent instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ag$2d$ui$2b$client$40$0$2e$0$2e$57$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HttpAgent"]) agent.abortController = connectAbortController;
            const connect = {
                "useCopilotChatInternal.useEffect.connect": async (agent)=>{
                    setAgentAvailable(false);
                    try {
                        await copilotkit.connectAgent({
                            agent
                        });
                        if (!detached) setAgentAvailable(true);
                    } catch (error) {
                        if (detached) return;
                        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIConnectNotImplementedError"]) {} else console.error("CopilotChat: connectAgent failed", error);
                    }
                }
            }["useCopilotChatInternal.useEffect.connect"];
            if (agent && agent !== lastConnectedAgentRef.current && copilotkit.runtimeConnectionStatus === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$core$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$copilotkit$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotKitCoreRuntimeConnectionStatus"].Connected) {
                lastConnectedAgentRef.current = agent;
                connect(agent);
            }
            return ({
                "useCopilotChatInternal.useEffect": ()=>{
                    lastConnectedAgentRef.current = null;
                    detached = true;
                    connectAbortController.abort();
                    agent?.detachActiveRun();
                }
            })["useCopilotChatInternal.useEffect"];
        }
    }["useCopilotChatInternal.useEffect"], [
        existingConfig?.threadId,
        agent,
        copilotkit,
        copilotkit.runtimeConnectionStatus,
        resolvedAgentId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCopilotChatInternal.useEffect": ()=>{
            onInProgress?.(Boolean(agent?.isRunning));
        }
    }["useCopilotChatInternal.useEffect"], [
        agent?.isRunning,
        onInProgress
    ]);
    const [interrupt, setInterrupt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCopilotChatInternal.useEffect": ()=>{
            setInterrupt(copilotkit.interruptElement);
            const subscription = copilotkit.subscribe({
                onInterruptElementChanged: {
                    "useCopilotChatInternal.useEffect.subscription": ({ interruptElement })=>{
                        setInterrupt(interruptElement);
                    }
                }["useCopilotChatInternal.useEffect.subscription"]
            });
            return ({
                "useCopilotChatInternal.useEffect": ()=>subscription.unsubscribe()
            })["useCopilotChatInternal.useEffect"];
        }
    }["useCopilotChatInternal.useEffect"], [
        copilotkit
    ]);
    const reset = ()=>{
        agent?.setMessages([]);
        agent?.setState(null);
    };
    const latestDelete = useUpdatedRef((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCopilotChatInternal.useUpdatedRef[latestDelete]": (messageId)=>{
            const filteredMessages = (agent?.messages ?? []).filter({
                "useCopilotChatInternal.useUpdatedRef[latestDelete].filteredMessages": (message)=>message.id !== messageId
            }["useCopilotChatInternal.useUpdatedRef[latestDelete].filteredMessages"]);
            agent?.setMessages(filteredMessages);
        }
    }["useCopilotChatInternal.useUpdatedRef[latestDelete]"], [
        agent?.setMessages,
        agent?.messages
    ]));
    const latestDeleteFunc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCopilotChatInternal.useCallback[latestDeleteFunc]": (messageId)=>{
            return latestDelete.current(messageId);
        }
    }["useCopilotChatInternal.useCallback[latestDeleteFunc]"], [
        latestDelete
    ]);
    const currentSuggestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Z"])({
        agentId: resolvedAgentId
    });
    const reload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u"])({
        "useCopilotChatInternal.useAsyncCallback[reload]": async (reloadMessageId)=>{
            if (!agent) return;
            const messages = agent?.messages ?? [];
            if (agent.isRunning || messages.length === 0) return;
            const reloadMessageIndex = messages.findIndex({
                "useCopilotChatInternal.useAsyncCallback[reload].reloadMessageIndex": (msg)=>msg.id === reloadMessageId
            }["useCopilotChatInternal.useAsyncCallback[reload].reloadMessageIndex"]);
            if (reloadMessageIndex === -1) {
                console.warn(`Message with id ${reloadMessageId} not found`);
                return;
            }
            const reloadMessageRole = messages[reloadMessageIndex].role;
            if (reloadMessageRole !== "assistant") {
                console.warn(`Regenerate cannot be performed on ${reloadMessageRole} role`);
                return;
            }
            let historyCutoff = [
                messages[0]
            ];
            if (messages.length > 2 && reloadMessageIndex !== 0) {
                const lastUserMessageBeforeRegenerate = messages.slice(0, reloadMessageIndex).toReversed().find({
                    "useCopilotChatInternal.useAsyncCallback[reload].lastUserMessageBeforeRegenerate": (msg)=>msg.role === "user"
                }["useCopilotChatInternal.useAsyncCallback[reload].lastUserMessageBeforeRegenerate"]);
                if (!lastUserMessageBeforeRegenerate) historyCutoff = [
                    messages[0]
                ];
                else {
                    const indexOfLastUserMessageBeforeRegenerate = messages.findIndex({
                        "useCopilotChatInternal.useAsyncCallback[reload].indexOfLastUserMessageBeforeRegenerate": (msg)=>msg.id === lastUserMessageBeforeRegenerate.id
                    }["useCopilotChatInternal.useAsyncCallback[reload].indexOfLastUserMessageBeforeRegenerate"]);
                    historyCutoff = messages.slice(0, indexOfLastUserMessageBeforeRegenerate + 1);
                }
            } else if (messages.length > 2 && reloadMessageIndex === 0) historyCutoff = [
                messages[0],
                messages[1]
            ];
            agent?.setMessages(historyCutoff);
            if (agent) try {
                await copilotkit.runAgent({
                    agent
                });
            } catch (error) {
                console.error("CopilotChat: runAgent failed during reload", error);
            }
        }
    }["useCopilotChatInternal.useAsyncCallback[reload]"], [
        agent?.messages.length,
        agent?.isRunning,
        agent?.setMessages,
        copilotkit?.runAgent
    ]);
    const latestSendMessageFunc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u"])({
        "useCopilotChatInternal.useAsyncCallback[latestSendMessageFunc]": async (message, options)=>{
            if (!agent) return;
            const followUp = options?.followUp ?? true;
            if (options?.clearSuggestions) copilotkit.clearSuggestions(resolvedAgentId);
            if (onSubmitMessage) {
                const content = typeof message.content === "string" ? message.content : message.content && "text" in message.content ? message.content.text : message.content && "filename" in message.content ? message.content.filename : "";
                try {
                    await onSubmitMessage(content);
                } catch (error) {
                    console.error("Error in onSubmitMessage:", error);
                }
            }
            agent?.addMessage(message);
            if (followUp) try {
                await copilotkit.runAgent({
                    agent
                });
            } catch (error) {
                console.error("CopilotChat: runAgent failed", error);
            }
        }
    }["useCopilotChatInternal.useAsyncCallback[latestSendMessageFunc]"], [
        agent,
        copilotkit,
        resolvedAgentId,
        onSubmitMessage
    ]);
    const latestAppendFunc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u"])({
        "useCopilotChatInternal.useAsyncCallback[latestAppendFunc]": async (message, options)=>{
            return latestSendMessageFunc((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$message$2d$conversion$2f$gql$2d$to$2d$agui$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gqlToAGUI"])([
                message
            ])[0], options);
        }
    }["useCopilotChatInternal.useAsyncCallback[latestAppendFunc]"], [
        latestSendMessageFunc
    ]);
    const latestSetMessagesFunc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCopilotChatInternal.useCallback[latestSetMessagesFunc]": (messages)=>{
            if (messages.every({
                "useCopilotChatInternal.useCallback[latestSetMessagesFunc]": (message)=>message instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$client$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Message"]
            }["useCopilotChatInternal.useCallback[latestSetMessagesFunc]"])) return agent?.setMessages?.((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$message$2d$conversion$2f$gql$2d$to$2d$agui$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gqlToAGUI"])(messages));
            return agent?.setMessages?.(messages);
        }
    }["useCopilotChatInternal.useCallback[latestSetMessagesFunc]"], [
        agent?.setMessages,
        agent
    ]);
    const latestReload = useUpdatedRef(reload);
    const latestReloadFunc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u"])({
        "useCopilotChatInternal.useAsyncCallback[latestReloadFunc]": async (messageId)=>{
            onReloadMessages?.({
                messageId,
                currentAgentName: agent?.agentId,
                messages: agent?.messages ?? []
            });
            return await latestReload.current(messageId);
        }
    }["useCopilotChatInternal.useAsyncCallback[latestReloadFunc]"], [
        latestReload,
        agent,
        onReloadMessages
    ]);
    const latestStopFunc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCopilotChatInternal.useCallback[latestStopFunc]": ()=>{
            onStopGeneration?.({
                currentAgentName: agent?.agentId,
                messages: agent?.messages ?? []
            });
            return agent?.abortRun?.();
        }
    }["useCopilotChatInternal.useCallback[latestStopFunc]"], [
        onStopGeneration,
        agent
    ]);
    const latestReset = useUpdatedRef(reset);
    const latestResetFunc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCopilotChatInternal.useCallback[latestResetFunc]": ()=>{
            return latestReset.current();
        }
    }["useCopilotChatInternal.useCallback[latestResetFunc]"], [
        latestReset
    ]);
    const lazyToolRendered = useLazyToolRenderer();
    const renderCustomMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ct"])();
    const legacyCustomMessageRenderer = useLegacyCoagentRenderer({
        copilotkit,
        agent,
        agentId: resolvedAgentId,
        threadId: existingConfig?.threadId ?? threadId
    });
    const allMessages = agent?.messages ?? [];
    const resolvedMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useCopilotChatInternal.useMemo[resolvedMessages]": ()=>{
            let processedMessages = allMessages.map({
                "useCopilotChatInternal.useMemo[resolvedMessages].processedMessages": (message)=>{
                    if (message.role !== "assistant") return message;
                    const lazyRendered = lazyToolRendered(message, allMessages);
                    if (lazyRendered) {
                        const renderedGenUi = lazyRendered();
                        if (renderedGenUi) return {
                            ...message,
                            generativeUI: ({
                                "useCopilotChatInternal.useMemo[resolvedMessages].processedMessages": ()=>renderedGenUi
                            })["useCopilotChatInternal.useMemo[resolvedMessages].processedMessages"]
                        };
                    }
                    const bridgeRenderer = legacyCustomMessageRenderer || renderCustomMessage ? ({
                        "useCopilotChatInternal.useMemo[resolvedMessages].processedMessages": ()=>{
                            if (legacyCustomMessageRenderer) return legacyCustomMessageRenderer({
                                message,
                                position: "before"
                            });
                            try {
                                return renderCustomMessage?.({
                                    message,
                                    position: "before"
                                }) ?? null;
                            } catch (error) {
                                console.warn("[CopilotKit] renderCustomMessages failed, falling back to legacy renderer", error);
                                return null;
                            }
                        }
                    })["useCopilotChatInternal.useMemo[resolvedMessages].processedMessages"] : null;
                    if (bridgeRenderer) return {
                        ...message,
                        generativeUI: bridgeRenderer,
                        generativeUIPosition: "before"
                    };
                    return message;
                }
            }["useCopilotChatInternal.useMemo[resolvedMessages].processedMessages"]);
            const hasAssistantMessages = processedMessages.some({
                "useCopilotChatInternal.useMemo[resolvedMessages].hasAssistantMessages": (msg)=>msg.role === "assistant"
            }["useCopilotChatInternal.useMemo[resolvedMessages].hasAssistantMessages"]);
            const canUseCustomRenderer = Boolean(renderCustomMessage && copilotkit?.getAgent?.(resolvedAgentId));
            const placeholderRenderer = legacyCustomMessageRenderer ? legacyCustomMessageRenderer : canUseCustomRenderer ? renderCustomMessage : null;
            const shouldRenderPlaceholder = Boolean(agent?.isRunning) || Boolean(agent?.state && Object.keys(agent.state).length);
            const effectiveThreadId = threadId ?? agent?.threadId ?? "default";
            let latestUserIndex = -1;
            for(let i = processedMessages.length - 1; i >= 0; i -= 1)if (processedMessages[i].role === "user") {
                latestUserIndex = i;
                break;
            }
            const latestUserMessageId = latestUserIndex >= 0 ? processedMessages[latestUserIndex].id : void 0;
            const currentRunId = latestUserMessageId ? copilotkit.getRunIdForMessage(resolvedAgentId, effectiveThreadId, latestUserMessageId) || `pending:${latestUserMessageId}` : void 0;
            const hasAssistantForCurrentRun = latestUserIndex >= 0 ? processedMessages.slice(latestUserIndex + 1).some({
                "useCopilotChatInternal.useMemo[resolvedMessages]": (msg)=>msg.role === "assistant"
            }["useCopilotChatInternal.useMemo[resolvedMessages]"]) : hasAssistantMessages;
            if (placeholderRenderer && shouldRenderPlaceholder && !hasAssistantForCurrentRun) {
                const placeholderMessage = {
                    id: currentRunId ? `coagent-state-render-${resolvedAgentId}-${currentRunId}` : `coagent-state-render-${resolvedAgentId}`,
                    role: "assistant",
                    content: "",
                    name: "coagent-state-render",
                    runId: currentRunId
                };
                processedMessages = [
                    ...processedMessages,
                    {
                        ...placeholderMessage,
                        generativeUIPosition: "before",
                        generativeUI: {
                            "useCopilotChatInternal.useMemo[resolvedMessages]": ()=>placeholderRenderer({
                                    message: placeholderMessage,
                                    position: "before"
                                })
                        }["useCopilotChatInternal.useMemo[resolvedMessages]"]
                    }
                ];
            }
            return processedMessages;
        }
    }["useCopilotChatInternal.useMemo[resolvedMessages]"], [
        agent?.messages,
        lazyToolRendered,
        allMessages,
        renderCustomMessage,
        legacyCustomMessageRenderer,
        resolvedAgentId,
        copilotkit,
        agent?.isRunning,
        agent?.state
    ]);
    const renderedSuggestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useCopilotChatInternal.useMemo[renderedSuggestions]": ()=>{
            if (Array.isArray(suggestions)) return {
                suggestions: suggestions.map({
                    "useCopilotChatInternal.useMemo[renderedSuggestions]": (s)=>({
                            ...s,
                            isLoading: false
                        })
                }["useCopilotChatInternal.useMemo[renderedSuggestions]"]),
                isLoading: false
            };
            return currentSuggestions;
        }
    }["useCopilotChatInternal.useMemo[renderedSuggestions]"], [
        suggestions,
        currentSuggestions
    ]);
    return {
        messages: resolvedMessages,
        sendMessage: latestSendMessageFunc,
        appendMessage: latestAppendFunc,
        setMessages: latestSetMessagesFunc,
        reloadMessages: latestReloadFunc,
        stopGeneration: latestStopFunc,
        reset: latestResetFunc,
        deleteMessage: latestDeleteFunc,
        isAvailable: agentAvailable,
        isLoading: Boolean(agent?.isRunning),
        suggestions: renderedSuggestions.suggestions,
        setSuggestions: (suggestions)=>copilotkit.addSuggestionsConfig({
                suggestions
            }),
        generateSuggestions: async ()=>copilotkit.reloadSuggestions(resolvedAgentId),
        resetSuggestions: ()=>copilotkit.clearSuggestions(resolvedAgentId),
        isLoadingSuggestions: renderedSuggestions.isLoading,
        interrupt,
        agent,
        threadId
    };
}
function useUpdatedRef(value) {
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(value);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useUpdatedRef.useEffect": ()=>{
            ref.current = value;
        }
    }["useUpdatedRef.useEffect"], [
        value
    ]);
    return ref;
}
function useLegacyCoagentRenderer({ copilotkit, agent, agentId, threadId }) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useLegacyCoagentRenderer.useMemo": ()=>{
            if (!copilotkit || !agent) return null;
            return ({
                "useLegacyCoagentRenderer.useMemo": ({ message, position })=>{
                    const effectiveThreadId = threadId ?? agent.threadId ?? "default";
                    const providedRunId = message.runId;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["r"], {
                        message,
                        position,
                        runId: (providedRunId ? providedRunId : copilotkit.getRunIdForMessage(agentId, effectiveThreadId, message.id)) || `pending:${message.id}`,
                        messageIndex: Math.max(agent.messages.findIndex({
                            "useLegacyCoagentRenderer.useMemo": (msg)=>msg.id === message.id
                        }["useLegacyCoagentRenderer.useMemo"]), 0),
                        messageIndexInRun: 0,
                        numberOfMessagesInRun: 1,
                        agentId,
                        stateSnapshot: message.state
                    });
                }
            })["useLegacyCoagentRenderer.useMemo"];
        }
    }["useLegacyCoagentRenderer.useMemo"], [
        agent,
        agentId,
        copilotkit,
        threadId
    ]);
}
//#endregion
//#region src/hooks/use-copilot-chat.ts
/**
* A lightweight React hook for headless chat interactions.
* Perfect for programmatic messaging, background operations, and custom UI implementations.
*
* **Open Source Friendly** - Works without requiring a `publicApiKey`.
*/ function useCopilotChat(options = {}) {
    const { visibleMessages, appendMessage, reloadMessages, stopGeneration, reset, isLoading, isAvailable, runChatCompletion, mcpServers, setMcpServers } = useCopilotChatInternal(options);
    return {
        visibleMessages,
        appendMessage,
        reloadMessages,
        stopGeneration,
        reset,
        isLoading,
        isAvailable,
        runChatCompletion,
        mcpServers,
        setMcpServers
    };
}
//#endregion
//#region src/hooks/use-copilot-chat-headless_c.ts
/**
* `useCopilotChatHeadless_c` is for building fully custom UI (headless UI) implementations.
*
* <Callout title="This is an Enterprise Intelligence Platform feature">
* Read more about <a href="/premium/overview">the Enterprise Intelligence Platform</a>.
*
* Usage is generous and **free** to get started.
* </Callout>
*
* ## Key Features
*
* - **Fully headless**: Build your own fully custom UI's for your agentic applications.
* - **Advanced Suggestions**: Direct access to suggestions array with full control
* - **Interrupt Handling**: Support for advanced interrupt functionality
* - **MCP Server Support**: Model Context Protocol server configurations
* - **Chat Controls**: Complete set of chat management functions
* - **Loading States**: Comprehensive loading state management
*
*
* ## Usage
*
* ### Basic Setup
*
* ```tsx
* import { CopilotKit } from "@copilotkit/react-core";
* import { useCopilotChatHeadless_c } from "@copilotkit/react-core";
*
* export function App() {
*   return (
*     <CopilotKit runtimeUrl="/api/copilotkit">
*       <YourComponent />
*     </CopilotKit>
*   );
* }
*
* export function YourComponent() {
*   const { messages, sendMessage, isLoading } = useCopilotChatHeadless_c();
*
*   const handleSendMessage = async () => {
*     await sendMessage({
*       id: "123",
*       role: "user",
*       content: "Hello World",
*     });
*   };
*
*   return (
*     <div>
*       {messages.map(msg => <div key={msg.id}>{msg.content}</div>)}
*       <button onClick={handleSendMessage} disabled={isLoading}>
*         Send Message
*       </button>
*     </div>
*   );
* }
* ```
*
* ### Working with Suggestions
*
* ```tsx
* import { useCopilotChatHeadless_c, useCopilotChatSuggestions } from "@copilotkit/react-core";
*
* export function SuggestionExample() {
*   const {
*     suggestions,
*     setSuggestions,
*     generateSuggestions,
*     isLoadingSuggestions
*   } = useCopilotChatHeadless_c();
*
*   // Configure AI suggestion generation
*   useCopilotChatSuggestions({
*     instructions: "Suggest helpful actions based on the current context",
*     maxSuggestions: 3
*   });
*
*   return (
*     <div>
*       {suggestions.map(suggestion => (
*         <button key={suggestion.title}>{suggestion.title}</button>
*       ))}
*       <button onClick={generateSuggestions} disabled={isLoadingSuggestions}>
*         Generate Suggestions
*       </button>
*     </div>
*   );
* }
* ```
*
* ## Return Values
* The following properties are returned from the hook:
*
* <PropertyReference name="messages" type="Message[]">
* The messages currently in the chat in AG-UI format
* </PropertyReference>
*
* <PropertyReference name="sendMessage" type="(message: Message, options?) => Promise<void>">
* Send a new message to the chat and trigger AI response
* </PropertyReference>
*
* <PropertyReference name="setMessages" type="(messages: Message[] | DeprecatedGqlMessage[]) => void">
* Replace all messages in the chat with new array
* </PropertyReference>
*
* <PropertyReference name="deleteMessage" type="(messageId: string) => void">
* Remove a specific message by ID from the chat
* </PropertyReference>
*
* <PropertyReference name="reloadMessages" type="(messageId: string) => Promise<void>">
* Regenerate the response for a specific message by ID
* </PropertyReference>
*
* <PropertyReference name="stopGeneration" type="() => void">
* Stop the current message generation process
* </PropertyReference>
*
* <PropertyReference name="reset" type="() => void">
* Clear all messages and reset chat state completely
* </PropertyReference>
*
* <PropertyReference name="isLoading" type="boolean">
* Whether the chat is currently generating a response
* </PropertyReference>
*
* <PropertyReference name="runChatCompletion" type="() => Promise<Message[]>">
* Manually trigger chat completion for advanced usage
* </PropertyReference>
*
* <PropertyReference name="mcpServers" type="MCPServerConfig[]">
* Array of Model Context Protocol server configurations
* </PropertyReference>
*
* <PropertyReference name="setMcpServers" type="(servers: MCPServerConfig[]) => void">
* Update MCP server configurations for enhanced context
* </PropertyReference>
*
* <PropertyReference name="suggestions" type="SuggestionItem[]">
* Current suggestions array for reading or manual control
* </PropertyReference>
*
* <PropertyReference name="setSuggestions" type="(suggestions: SuggestionItem[]) => void">
* Manually set suggestions for custom workflows
* </PropertyReference>
*
* <PropertyReference name="generateSuggestions" type="() => Promise<void>">
* Trigger AI-powered suggestion generation using configured settings
* </PropertyReference>
*
* <PropertyReference name="resetSuggestions" type="() => void">
* Clear all current suggestions and reset generation state
* </PropertyReference>
*
* <PropertyReference name="isLoadingSuggestions" type="boolean">
* Whether suggestions are currently being generated
* </PropertyReference>
*
* <PropertyReference name="interrupt" type="string | React.ReactElement | null">
* Interrupt content for human-in-the-loop workflows
* </PropertyReference>
*/ const createNonFunctionalReturn = ()=>({
        visibleMessages: [],
        messages: [],
        sendMessage: async ()=>{},
        appendMessage: async ()=>{},
        setMessages: ()=>{},
        deleteMessage: ()=>{},
        reloadMessages: async ()=>{},
        stopGeneration: ()=>{},
        reset: ()=>{},
        isLoading: false,
        isAvailable: false,
        runChatCompletion: async ()=>[],
        mcpServers: [],
        setMcpServers: ()=>{},
        suggestions: [],
        setSuggestions: ()=>{},
        generateSuggestions: async ()=>{},
        resetSuggestions: ()=>{},
        isLoadingSuggestions: false,
        interrupt: null
    });
/**
* Enterprise Intelligence Platform React hook that provides complete chat functionality for fully custom UI implementations.
* Includes all advanced features like direct message access, suggestions array, interrupt handling, and MCP support.
*
* @param options - Configuration options for the chat
* @returns Complete chat interface with all Enterprise Intelligence Platform features
*
* @example
* ```tsx
* const { messages, sendMessage, suggestions, interrupt } = useCopilotChatHeadless_c();
* ```
*/ function useCopilotChatHeadless_c(options = {}) {
    const { copilotApiConfig, setBannerError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["g"])();
    const hasPublicApiKey = Boolean(copilotApiConfig.publicApiKey);
    const internalResult = useCopilotChatInternal(options);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCopilotChatHeadless_c.useEffect": ()=>{
            if (!hasPublicApiKey) {
                setBannerError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotKitError"]({
                    message: "You're using useCopilotChatHeadless_c, an Enterprise Intelligence Platform feature that offers extensive headless chat capabilities. To continue, you'll need to provide a free public license key.",
                    code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotKitErrorCode"].MISSING_PUBLIC_API_KEY_ERROR,
                    severity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Severity"].WARNING,
                    visibility: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorVisibility"].BANNER
                }));
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$console$2d$styling$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["styledConsole"].logCopilotKitPlatformMessage();
            } else setBannerError(null);
        }
    }["useCopilotChatHeadless_c.useEffect"], [
        hasPublicApiKey
    ]);
    if (hasPublicApiKey) return internalResult;
    return createNonFunctionalReturn();
}
//#endregion
//#region src/hooks/use-frontend-tool.ts
function useFrontendTool(tool, dependencies) {
    const { name, description, parameters, render, followUp, available } = tool;
    const zodParameters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$json$2d$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getZodParameters"])(parameters);
    const renderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(render);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useFrontendTool.useEffect": ()=>{
            renderRef.current = render;
        }
    }["useFrontendTool.useEffect"], [
        render,
        ...dependencies ?? []
    ]);
    const normalizedRender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useFrontendTool.useMemo[normalizedRender]": ()=>{
            if (typeof render === "undefined") return;
            return ({
                "useFrontendTool.useMemo[normalizedRender]": (args)=>{
                    const currentRender = renderRef.current;
                    if (typeof currentRender === "undefined") return null;
                    if (typeof currentRender === "string") return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, null, currentRender);
                    const rendered = currentRender({
                        ...args,
                        result: typeof args.result === "string" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseJson"])(args.result, args.result) : args.result
                    });
                    if (typeof rendered === "string") return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, null, rendered);
                    return rendered ?? null;
                }
            })["useFrontendTool.useMemo[normalizedRender]"];
        }
    }["useFrontendTool.useMemo[normalizedRender]"], []);
    const handlerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(tool.handler);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useFrontendTool.useEffect": ()=>{
            handlerRef.current = tool.handler;
        }
    }["useFrontendTool.useEffect"], [
        tool.handler,
        ...dependencies ?? []
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ot"])({
        name,
        description,
        parameters: zodParameters,
        handler: tool.handler ? ({
            "useFrontendTool.useFrontendTool$1": (args)=>handlerRef.current?.(args)
        })["useFrontendTool.useFrontendTool$1"] : void 0,
        followUp,
        render: normalizedRender,
        available: available === void 0 ? void 0 : available !== "disabled"
    });
}
//#endregion
//#region src/hooks/use-render-tool-call.ts
function useRenderToolCall(tool, dependencies) {
    const { copilotkit } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yt"])();
    const hasAddedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useRenderToolCall.useEffect": ()=>{
            const { name, parameters, render } = tool;
            const zodParameters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$json$2d$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getZodParameters"])(parameters);
            const renderToolCall = name === "*" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ut"])({
                name: "*",
                render: {
                    "useRenderToolCall.useEffect": (args)=>{
                        return render({
                            ...args,
                            result: args.result ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseJson"])(args.result, args.result) : args.result
                        });
                    }
                }["useRenderToolCall.useEffect"]
            }) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ut"])({
                name,
                args: zodParameters,
                render: {
                    "useRenderToolCall.useEffect": (args)=>{
                        return render({
                            ...args,
                            result: args.result ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseJson"])(args.result, args.result) : args.result
                        });
                    }
                }["useRenderToolCall.useEffect"]
            });
            const existingIndex = copilotkit.renderToolCalls.findIndex({
                "useRenderToolCall.useEffect.existingIndex": (r)=>r.name === name
            }["useRenderToolCall.useEffect.existingIndex"]);
            if (existingIndex !== -1) copilotkit.renderToolCalls.splice(existingIndex, 1);
            copilotkit.renderToolCalls.push(renderToolCall);
            hasAddedRef.current = true;
            return ({
                "useRenderToolCall.useEffect": ()=>{
                    if (hasAddedRef.current) {
                        const index = copilotkit.renderToolCalls.findIndex({
                            "useRenderToolCall.useEffect.index": (r)=>r.name === name
                        }["useRenderToolCall.useEffect.index"]);
                        if (index !== -1) copilotkit.renderToolCalls.splice(index, 1);
                        hasAddedRef.current = false;
                    }
                }
            })["useRenderToolCall.useEffect"];
        }
    }["useRenderToolCall.useEffect"], [
        tool,
        ...dependencies ?? []
    ]);
}
//#endregion
//#region src/hooks/use-human-in-the-loop.ts
function useHumanInTheLoop(tool, dependencies) {
    const { render, ...toolRest } = tool;
    const { name, description, parameters, followUp } = toolRest;
    const zodParameters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$json$2d$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getZodParameters"])(parameters);
    const renderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useHumanInTheLoop.useEffect": ()=>{
            renderRef.current = ({
                "useHumanInTheLoop.useEffect": (args)=>{
                    if (typeof render === "string") return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, null, render);
                    if (!render) return null;
                    const rendered = render(({
                        "useHumanInTheLoop.useEffect.rendered": ()=>{
                            const mappedArgs = args.args;
                            switch(args.status){
                                case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$core$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$copilotkit$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToolCallStatus"].InProgress:
                                    return {
                                        args: mappedArgs,
                                        respond: args.respond,
                                        status: args.status,
                                        handler: void 0
                                    };
                                case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$core$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$copilotkit$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToolCallStatus"].Executing:
                                    return {
                                        args: mappedArgs,
                                        respond: args.respond,
                                        status: args.status,
                                        handler: ({
                                            "useHumanInTheLoop.useEffect.rendered": ()=>{}
                                        })["useHumanInTheLoop.useEffect.rendered"]
                                    };
                                case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$core$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$copilotkit$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToolCallStatus"].Complete:
                                    return {
                                        args: mappedArgs,
                                        respond: args.respond,
                                        status: args.status,
                                        result: args.result ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseJson"])(args.result, args.result) : args.result,
                                        handler: void 0
                                    };
                                default:
                                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotKitError"]({
                                        code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotKitErrorCode"].UNKNOWN,
                                        message: `Invalid tool call status: ${args.status}`
                                    });
                            }
                        }
                    })["useHumanInTheLoop.useEffect.rendered"]());
                    if (typeof rendered === "string") return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, null, rendered);
                    return rendered ?? null;
                }
            })["useHumanInTheLoop.useEffect"];
        }
    }["useHumanInTheLoop.useEffect"], [
        render,
        ...dependencies ?? []
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nt"])({
        name,
        description,
        followUp,
        parameters: zodParameters,
        render: {
            "useHumanInTheLoop.useHumanInTheLoop$1": (args)=>renderRef.current?.(args) ?? null
        }["useHumanInTheLoop.useHumanInTheLoop$1"]
    });
}
//#endregion
//#region src/hooks/use-copilot-action.ts
/**
* Example usage of useCopilotAction with complex parameters:
*
* @example
* useCopilotAction({
*   name: "myAction",
*   parameters: [
*     { name: "arg1", type: "string", enum: ["option1", "option2", "option3"], required: false },
*     { name: "arg2", type: "number" },
*     {
*       name: "arg3",
*       type: "object",
*       attributes: [
*         { name: "nestedArg1", type: "boolean" },
*         { name: "xyz", required: false },
*       ],
*     },
*     { name: "arg4", type: "number[]" },
*   ],
*   handler: ({ arg1, arg2, arg3, arg4 }) => {
*     const x = arg3.nestedArg1;
*     const z = arg3.xyz;
*     console.log(arg1, arg2, arg3);
*   },
* });
*
* @example
* // Simple action without parameters
* useCopilotAction({
*   name: "myAction",
*   handler: () => {
*     console.log("No parameters provided.");
*   },
* });
*
* @example
* // Interactive action with UI rendering and response handling
* useCopilotAction({
*   name: "handleMeeting",
*   description: "Handle a meeting by booking or canceling",
*   parameters: [
*     {
*       name: "meeting",
*       type: "string",
*       description: "The meeting to handle",
*       required: true,
*     },
*     {
*       name: "date",
*       type: "string",
*       description: "The date of the meeting",
*       required: true,
*     },
*     {
*       name: "title",
*       type: "string",
*       description: "The title of the meeting",
*       required: true,
*     },
*   ],
*   renderAndWaitForResponse: ({ args, respond, status }) => {
*     const { meeting, date, title } = args;
*     return (
*       <MeetingConfirmationDialog
*         meeting={meeting}
*         date={date}
*         title={title}
*         onConfirm={() => respond('meeting confirmed')}
*         onCancel={() => respond('meeting canceled')}
*       />
*     );
*   },
* });
*
* @example
* // Catch all action allows you to render actions that are not defined in the frontend
* useCopilotAction({
*   name: "*",
*   render: ({ name, args, status, result, handler, respond }) => {
*     return <div>Rendering action: {name}</div>;
*   },
* });
*/ /**
* <img src="https://cdn.copilotkit.ai/docs/copilotkit/images/use-copilot-action/useCopilotAction.gif" width="500" />
* `useCopilotAction` is a React hook that you can use in your application to provide
* custom actions that can be called by the AI. Essentially, it allows the Copilot to
* execute these actions contextually during a chat, based on the user's interactions
* and needs.
*
* Here's how it works:
*
* Use `useCopilotAction` to set up actions that the Copilot can call. To provide
* more context to the Copilot, you can provide it with a `description` (for example to explain
* what the action does, under which conditions it can be called, etc.).
*
* Then you define the parameters of the action, which can be simple, e.g. primitives like strings or numbers,
* or complex, e.g. objects or arrays.
*
* Finally, you provide a `handler` function that receives the parameters and returns a result.
* CopilotKit takes care of automatically inferring the parameter types, so you get type safety
* and autocompletion for free.
*
* To render a custom UI for the action, you can provide a `render()` function. This function
* lets you render a custom component or return a string to display.
*
* ## Usage
*
* ### Simple Usage
*
* ```tsx
* useCopilotAction({
*   name: "sayHello",
*   description: "Say hello to someone.",
*   parameters: [
*     {
*       name: "name",
*       type: "string",
*       description: "name of the person to say greet",
*     },
*   ],
*   handler: async ({ name }) => {
*     alert(`Hello, ${name}!`);
*   },
* });
* ```
*
* ## Generative UI
*
* This hooks enables you to dynamically generate UI elements and render them in the copilot chat. For more information, check out the [Generative UI](/guides/generative-ui) page.
*/ function getActionConfig(action) {
    if (action.name === "*") return {
        type: "render",
        action
    };
    if ("renderAndWaitForResponse" in action || "renderAndWait" in action) {
        let render = action.render;
        if (!render && "renderAndWaitForResponse" in action) render = action.renderAndWaitForResponse;
        if (!render && "renderAndWait" in action) render = action.renderAndWait;
        return {
            type: "hitl",
            action: {
                ...action,
                render
            }
        };
    }
    if ("available" in action) {
        if (action.available === "enabled" || action.available === "remote") return {
            type: "frontend",
            action
        };
        if (action.available === "frontend" || action.available === "disabled") return {
            type: "render",
            action
        };
    }
    if ("handler" in action) return {
        type: "frontend",
        action
    };
    throw new Error("Invalid action configuration");
}
/**
* useCopilotAction is a legacy hook maintained for backwards compatibility.
*
* To avoid violating React's Rules of Hooks (which prohibit conditional hook calls),
* we use a registration pattern:
* 1. This hook registers the action configuration with the CopilotContext
* 2. A renderer component in CopilotKit actually renders the appropriate hook wrapper
* 3. React properly manages hook state since components are rendered, not conditionally called
*
* This allows action types to change between renders without corrupting React's hook state.
*/ function useCopilotAction(action, dependencies) {
    const [initialActionConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(getActionConfig(action));
    const currentActionConfig = getActionConfig(action);
    /**
	* Calling hooks conditionally violates React's Rules of Hooks. This rule exists because
	* React maintains the call stack for hooks like useEffect or useState, and conditionally
	* calling a hook would result in inconsistent call stacks between renders.
	*
	* Unfortunately, useCopilotAction _has_ to conditionally call a hook based on the
	* supplied parameters. In order to avoid breaking React's call stack tracking, while
	* breaking the Rule of Hooks, we use a ref to store the initial action configuration
	* and throw an error if the _configuration_ changes such that we would call a different hook.
	*/ if (initialActionConfig.type !== currentActionConfig.type) throw new Error("Action configuration changed between renders");
    switch(currentActionConfig.type){
        case "render":
            return useRenderToolCall(currentActionConfig.action, dependencies);
        case "hitl":
            return useHumanInTheLoop(currentActionConfig.action, dependencies);
        case "frontend":
            return useFrontendTool(currentActionConfig.action, dependencies);
        default:
            throw new Error("Invalid action configuration");
    }
}
//#endregion
//#region src/hooks/use-coagent-state-render.ts
/**
* The useCoAgentStateRender hook allows you to render UI or text based components on a Agentic Copilot's state in the chat.
* This is particularly useful for showing intermediate state or progress during Agentic Copilot operations.
*
* ## Usage
*
* ### Simple Usage
*
* ```tsx
* import { useCoAgentStateRender } from "@copilotkit/react-core";
*
* type YourAgentState = {
*   agent_state_property: string;
* }
*
* useCoAgentStateRender<YourAgentState>({
*   name: "basic_agent",
*   nodeName: "optionally_specify_a_specific_node",
*   render: ({ status, state, nodeName }) => {
*     return (
*       <YourComponent
*         agentStateProperty={state.agent_state_property}
*         status={status}
*         nodeName={nodeName}
*       />
*     );
*   },
* });
* ```
*
* This allows for you to render UI components or text based on what is happening within the agent.
*
* ### Example
* A great example of this is in our Perplexity Clone where we render the progress of an agent's internet search as it is happening.
* You can play around with it below or learn how to build it with its [demo](/coagents/videos/perplexity-clone).
*
* <Callout type="info">
*   This example is hosted on Vercel and may take a few seconds to load.
* </Callout>
*
* <iframe src="https://examples-coagents-ai-researcher-ui.vercel.app/" className="w-full rounded-lg border h-[700px] my-4" />
*/ /**
* This hook is used to render agent state with custom UI components or text. This is particularly
* useful for showing intermediate state or progress during Agentic Copilot operations.
* To get started using rendering intermediate state through this hook, checkout the documentation.
*
* https://docs.copilotkit.ai/langgraph-python/shared-state/predictive-state-updates
*/ function useCoAgentStateRender(action, dependencies) {
    const { chatComponentsCache, availableAgents } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["h"]);
    const { setCoAgentStateRender, removeCoAgentStateRender, coAgentStateRenders } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["l"])();
    const idRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$random$2d$id$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomId"])());
    const { setBannerError, addToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["f"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCoAgentStateRender.useEffect": ()=>{
            if (availableAgents?.length && !availableAgents.some({
                "useCoAgentStateRender.useEffect": (a)=>a.name === action.name
            }["useCoAgentStateRender.useEffect"])) {
                `${action.name}`;
                setBannerError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotKitAgentDiscoveryError"]({
                    agentName: action.name,
                    availableAgents: availableAgents.map({
                        "useCoAgentStateRender.useEffect": (a)=>({
                                name: a.name,
                                id: a.id
                            })
                    }["useCoAgentStateRender.useEffect"])
                }));
            }
        }
    }["useCoAgentStateRender.useEffect"], [
        availableAgents
    ]);
    const key = `${action.name}-${action.nodeName || "global"}`;
    if (dependencies === void 0) {
        if (coAgentStateRenders[idRef.current]) {
            coAgentStateRenders[idRef.current].handler = action.handler;
            if (typeof action.render === "function") {
                if (chatComponentsCache.current !== null) chatComponentsCache.current.coAgentStateRenders[key] = action.render;
            }
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCoAgentStateRender.useEffect": ()=>{
            const currentId = idRef.current;
            if (Object.entries(coAgentStateRenders).some({
                "useCoAgentStateRender.useEffect": ([id, otherAction])=>{
                    if (id === currentId) return false;
                    if (otherAction.name !== action.name) return false;
                    const hasNodeName = !!action.nodeName;
                    const hasOtherNodeName = !!otherAction.nodeName;
                    if (!hasNodeName && !hasOtherNodeName) return true;
                    if (hasNodeName !== hasOtherNodeName) return false;
                    return action.nodeName === otherAction.nodeName;
                }
            }["useCoAgentStateRender.useEffect"])) addToast({
                type: "warning",
                message: action.nodeName ? `Found multiple state renders for agent ${action.name} and node ${action.nodeName}. State renders might get overridden` : `Found multiple state renders for agent ${action.name}. State renders might get overridden`,
                id: `dup-action-${action.name}`
            });
        }
    }["useCoAgentStateRender.useEffect"], [
        coAgentStateRenders
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCoAgentStateRender.useEffect": ()=>{
            setCoAgentStateRender(idRef.current, action);
            if (chatComponentsCache.current !== null && action.render !== void 0) chatComponentsCache.current.coAgentStateRenders[key] = action.render;
            return ({
                "useCoAgentStateRender.useEffect": ()=>{
                    removeCoAgentStateRender(idRef.current);
                }
            })["useCoAgentStateRender.useEffect"];
        }
    }["useCoAgentStateRender.useEffect"], [
        setCoAgentStateRender,
        removeCoAgentStateRender,
        action.name,
        typeof action.render === "string" ? action.render : void 0,
        ...dependencies || []
    ]);
}
//#endregion
//#region src/hooks/use-make-copilot-document-readable.ts
/**
* Makes a document readable by Copilot.
* @param document The document to make readable.
* @param categories The categories to associate with the document.
* @param dependencies The dependencies to use for the effect.
* @returns The id of the document.
*/ function useMakeCopilotDocumentReadable(document, categories, dependencies = []) {
    const { addDocumentContext, removeDocumentContext } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["g"])();
    const idRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(void 0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMakeCopilotDocumentReadable.useEffect": ()=>{
            const id = addDocumentContext(document, categories);
            idRef.current = id;
            return ({
                "useMakeCopilotDocumentReadable.useEffect": ()=>{
                    removeDocumentContext(id);
                }
            })["useMakeCopilotDocumentReadable.useEffect"];
        }
    }["useMakeCopilotDocumentReadable.useEffect"], [
        addDocumentContext,
        removeDocumentContext,
        ...dependencies
    ]);
    return idRef.current;
}
//#endregion
//#region src/hooks/use-copilot-readable.ts
/**
* `useCopilotReadable` is a React hook that provides app-state and other information
* to the Copilot. Optionally, the hook can also handle hierarchical state within your
* application, passing these parent-child relationships to the Copilot.
*
* ## Usage
*
* ### Simple Usage
*
* In its most basic usage, useCopilotReadable accepts a single string argument
* representing any piece of app state, making it available for the Copilot to use
* as context when responding to user input.
*
* ```tsx
* import { useCopilotReadable } from "@copilotkit/react-core";
*
* export function MyComponent() {
*   const [employees, setEmployees] = useState([]);
*
*   useCopilotReadable({
*     description: "The list of employees",
*     value: employees,
*   });
* }
* ```
*
* ### Nested Components
*
* Optionally, you can maintain the hierarchical structure of information by passing
* `parentId`. This allows you to use `useCopilotReadable` in nested components:
*
* ```tsx /employeeContextId/1 {17,23}
* import { useCopilotReadable } from "@copilotkit/react-core";
*
* function Employee(props: EmployeeProps) {
*   const { employeeName, workProfile, metadata } = props;
*
*   // propagate any information to copilot
*   const employeeContextId = useCopilotReadable({
*     description: "Employee name",
*     value: employeeName
*   });
*
*   // Pass a parentID to maintain a hierarchical structure.
*   // Especially useful with child React components, list elements, etc.
*   useCopilotReadable({
*     description: "Work profile",
*     value: workProfile.description(),
*     parentId: employeeContextId
*   });
*
*   useCopilotReadable({
*     description: "Employee metadata",
*     value: metadata.description(),
*     parentId: employeeContextId
*   });
*
*   return (
*     // Render as usual...
*   );
* }
* ```
*/ /**
* Adds the given information to the Copilot context to make it readable by Copilot.
*/ function useCopilotReadable({ description, value, convert, available }, dependencies) {
    const { copilotkit } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yt"])();
    const ctxIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(void 0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCopilotReadable.useEffect": ()=>{
            if (!copilotkit) return;
            const found = Object.entries(copilotkit.context).find({
                "useCopilotReadable.useEffect.found": ([id, ctxItem])=>{
                    return JSON.stringify({
                        description,
                        value
                    }) == JSON.stringify(ctxItem);
                }
            }["useCopilotReadable.useEffect.found"]);
            if (found) {
                ctxIdRef.current = found[0];
                if (available === "disabled") copilotkit.removeContext(ctxIdRef.current);
                return;
            }
            if (!found && available === "disabled") return;
            ctxIdRef.current = copilotkit.addContext({
                description,
                value: (convert ?? JSON.stringify)(value)
            });
            return ({
                "useCopilotReadable.useEffect": ()=>{
                    if (!ctxIdRef.current) return;
                    copilotkit.removeContext(ctxIdRef.current);
                }
            })["useCopilotReadable.useEffect"];
        }
    }["useCopilotReadable.useEffect"], [
        description,
        value,
        convert
    ]);
    return ctxIdRef.current;
}
//#endregion
//#region src/hooks/use-agent-nodename.ts
function useAgentNodeName(agentName) {
    const { agent } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tt"])({
        agentId: agentName
    });
    const nodeNameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("start");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAgentNodeName.useEffect": ()=>{
            if (!agent) return;
            const subscription = agent.subscribe({
                onStepStartedEvent: {
                    "useAgentNodeName.useEffect.subscription": ({ event })=>{
                        nodeNameRef.current = event.stepName;
                    }
                }["useAgentNodeName.useEffect.subscription"],
                onRunStartedEvent: {
                    "useAgentNodeName.useEffect.subscription": ()=>{
                        nodeNameRef.current = "start";
                    }
                }["useAgentNodeName.useEffect.subscription"],
                onRunFinishedEvent: {
                    "useAgentNodeName.useEffect.subscription": ()=>{
                        nodeNameRef.current = "end";
                    }
                }["useAgentNodeName.useEffect.subscription"],
                onRunErrorEvent: {
                    "useAgentNodeName.useEffect.subscription": ()=>{
                        nodeNameRef.current = "end";
                    }
                }["useAgentNodeName.useEffect.subscription"]
            });
            return ({
                "useAgentNodeName.useEffect": ()=>{
                    subscription.unsubscribe();
                }
            })["useAgentNodeName.useEffect"];
        }
    }["useAgentNodeName.useEffect"], [
        agent
    ]);
    return nodeNameRef.current;
}
//#endregion
//#region src/hooks/use-coagent.ts
/**
* <Callout type="info">
*   Usage of this hook assumes some additional setup in your application, for more information
*   on that see the CoAgents <span className="text-blue-500">[getting started guide](/langgraph-python/quickstart)</span>.
* </Callout>
* <Frame className="my-12">
*   <img
*     src="https://cdn.copilotkit.ai/docs/copilotkit/images/coagents/SharedStateCoAgents.gif"
*     alt="CoAgents demonstration"
*     className="w-auto"
*   />
* </Frame>
*
* This hook is used to integrate an agent into your application. With its use, you can
* render and update the state of an agent, allowing for a dynamic and interactive experience.
* We call these shared state experiences agentic copilots, or CoAgents for short.
*
* ## Usage
*
* ### Simple Usage
*
* ```tsx
* import { useCoAgent } from "@copilotkit/react-core";
*
* type AgentState = {
*   count: number;
* }
*
* const agent = useCoAgent<AgentState>({
*   name: "my-agent",
*   initialState: {
*     count: 0,
*   },
* });
*
* ```
*
* In CopilotKit v2, `useCoAgent` is a thin compatibility wrapper over the v2
* [`useAgent`](/reference/hooks/useAgent) hook. It returns an object with the
* following properties:
*
* ```tsx
* const {
*   name,     // The name of the agent currently being used.
*   nodeName, // The name of the current LangGraph node.
*   threadId, // The ID of the thread the agent is running in.
*   state,    // The current state of the agent.
*   setState, // A function to update the state of the agent.
*   running,  // A boolean indicating if the agent is currently running.
*   start,    // A function to start the agent.
*   stop,     // A function to stop the agent.
*   run,      // A function to (re-)run the agent. Maps to the v2 agent's `runAgent()`.
* } = agent;
* ```
*
* Finally we can leverage these properties to create reactive experiences with the agent!
*
* ```tsx
* const { state, setState } = useCoAgent<AgentState>({
*   name: "my-agent",
*   initialState: {
*     count: 0,
*   },
* });
*
* return (
*   <div>
*     <p>Count: {state.count}</p>
*     <button onClick={() => setState({ count: state.count + 1 })}>Increment</button>
*   </div>
* );
* ```
*
* This reactivity is bidirectional, meaning that changes to the state from the agent will be reflected in the UI and vice versa.
*
* ## Parameters
* <PropertyReference name="options" type="UseCoagentOptions<T>" required>
*   The options to use when creating the coagent.
*   <PropertyReference name="name" type="string" required>
*     The name of the agent to use.
*   </PropertyReference>
*   <PropertyReference name="initialState" type="T | any">
*     The initial state of the agent.
*   </PropertyReference>
*   <PropertyReference name="state" type="T | any">
*     State to manage externally if you are using this hook with external state management.
*   </PropertyReference>
*   <PropertyReference name="setState" type="(newState: T | ((prevState: T | undefined) => T)) => void">
*     A function to update the state of the agent if you are using this hook with external state management.
*   </PropertyReference>
* </PropertyReference>
*/ /**
* This hook is used to integrate an agent into your application. With its use, you can
* render and update the state of the agent, allowing for a dynamic and interactive experience.
* We call these shared state experiences "agentic copilots". To get started using agentic copilots, which
* we refer to as CoAgents, checkout the documentation at https://docs.copilotkit.ai/langgraph-python/quickstart.
*/ function useCoAgent(options) {
    const { agent } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tt"])({
        agentId: options.name
    });
    const { copilotkit } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yt"])();
    const nodeName = useAgentNodeName(options.name);
    const handleStateUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCoAgent.useCallback[handleStateUpdate]": (newState)=>{
            if (!agent) return;
            if (typeof newState === "function") {
                const updater = newState;
                agent.setState(updater(agent.state));
            } else agent.setState({
                ...agent.state,
                ...newState
            });
        }
    }["useCoAgent.useCallback[handleStateUpdate]"], [
        agent?.state,
        agent?.setState
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCoAgent.useEffect": ()=>{
            if (!options.config && !options.configurable) return;
            let config = options.config ?? {};
            if (options.configurable) config = {
                ...config,
                configurable: {
                    ...options.configurable,
                    ...config.configurable
                }
            };
            copilotkit.setProperties(config);
        }
    }["useCoAgent.useEffect"], [
        options.config,
        options.configurable
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCoAgent.useEffect": ()=>{
            if (agent?.state && isExternalStateManagement(options) && JSON.stringify(options.state) !== JSON.stringify(agent.state)) handleStateUpdate(options.state);
        }
    }["useCoAgent.useEffect"], [
        agent,
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
            "useCoAgent.useEffect.useMemo": ()=>isExternalStateManagement(options) ? JSON.stringify(options.state) : void 0
        }["useCoAgent.useEffect.useMemo"], [
            isExternalStateManagement(options) ? JSON.stringify(options.state) : void 0
        ]),
        handleStateUpdate
    ]);
    const hasStateValues = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCoAgent.useCallback[hasStateValues]": (value)=>{
            return Boolean(value && Object.keys(value).length);
        }
    }["useCoAgent.useCallback[hasStateValues]"], []);
    const initialStateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(isExternalStateManagement(options) ? options.state : "initialState" in options ? options.initialState : void 0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCoAgent.useEffect": ()=>{
            if (isExternalStateManagement(options)) initialStateRef.current = options.state;
            else if ("initialState" in options) initialStateRef.current = options.initialState;
        }
    }["useCoAgent.useEffect"], [
        isExternalStateManagement(options) ? JSON.stringify(options.state) : "initialState" in options ? JSON.stringify(options.initialState) : void 0
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCoAgent.useEffect": ()=>{
            if (!agent) return;
            const subscription = agent.subscribe({
                onStateChanged: {
                    "useCoAgent.useEffect.subscription": (args)=>{
                        if (isExternalStateManagement(options)) options.setState(args.state);
                    }
                }["useCoAgent.useEffect.subscription"],
                onRunInitialized: {
                    "useCoAgent.useEffect.subscription": (args)=>{
                        if (hasStateValues(args.state)) {
                            handleStateUpdate(args.state);
                            return;
                        }
                        if (hasStateValues(agent.state)) return;
                        if (initialStateRef.current !== void 0) handleStateUpdate(initialStateRef.current);
                    }
                }["useCoAgent.useEffect.subscription"]
            });
            return ({
                "useCoAgent.useEffect": ()=>{
                    subscription.unsubscribe();
                }
            })["useCoAgent.useEffect"];
        }
    }["useCoAgent.useEffect"], [
        agent,
        handleStateUpdate,
        hasStateValues
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useCoAgent.useMemo": ()=>{
            if (!agent) {
                const noop = {
                    "useCoAgent.useMemo.noop": ()=>{}
                }["useCoAgent.useMemo.noop"];
                const noopAsync = {
                    "useCoAgent.useMemo.noopAsync": async ()=>{}
                }["useCoAgent.useMemo.noopAsync"];
                const initialState = ("state" in options && options.state) ?? ("initialState" in options && options.initialState) ?? {};
                return {
                    name: options.name,
                    nodeName,
                    threadId: void 0,
                    running: false,
                    state: initialState,
                    setState: noop,
                    start: noop,
                    stop: noop,
                    run: noopAsync
                };
            }
            return {
                name: agent?.agentId ?? options.name,
                nodeName,
                threadId: agent.threadId,
                running: agent.isRunning,
                state: agent.state,
                setState: handleStateUpdate,
                start: agent.runAgent,
                stop: agent.abortRun,
                run: agent.runAgent
            };
        }
    }["useCoAgent.useMemo"], [
        agent?.state,
        agent?.runAgent,
        agent?.abortRun,
        agent?.runAgent,
        agent?.threadId,
        agent?.isRunning,
        agent?.agentId,
        handleStateUpdate,
        options.name
    ]);
}
const isExternalStateManagement = (options)=>{
    return "state" in options && "setState" in options;
};
//#endregion
//#region src/hooks/use-copilot-runtime-client.ts
const useCopilotRuntimeClient = (options)=>{
    const { setBannerError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["f"])();
    const { showDevConsole, onError, ...runtimeOptions } = options;
    const lastStructuredErrorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const traceUIError = async (error, originalError)=>{
        try {
            await onError({
                type: "error",
                timestamp: Date.now(),
                context: {
                    source: "ui",
                    request: {
                        operation: "runtimeClient",
                        url: runtimeOptions.url,
                        startTime: Date.now()
                    },
                    technical: {
                        environment: "browser",
                        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : void 0,
                        stackTrace: originalError instanceof Error ? originalError.stack : void 0
                    }
                },
                error
            });
        } catch (error) {
            console.error("Error in onError handler:", error);
        }
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useCopilotRuntimeClient.useMemo": ()=>{
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$client$2f$CopilotRuntimeClient$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotRuntimeClient"]({
                ...runtimeOptions,
                handleGQLErrors: {
                    "useCopilotRuntimeClient.useMemo": (error)=>{
                        if (error.graphQLErrors?.length) {
                            const graphQLErrors = error.graphQLErrors;
                            const routeError = {
                                "useCopilotRuntimeClient.useMemo.routeError": (gqlError)=>{
                                    if (gqlError.extensions?.visibility === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorVisibility"].SILENT) {
                                        console.error("CopilotKit Silent Error:", gqlError.message);
                                        return;
                                    }
                                    const now = Date.now();
                                    const errorMessage = gqlError.message;
                                    if (lastStructuredErrorRef.current && lastStructuredErrorRef.current.message === errorMessage && now - lastStructuredErrorRef.current.timestamp < 150) return;
                                    lastStructuredErrorRef.current = {
                                        message: errorMessage,
                                        timestamp: now
                                    };
                                    const ckError = createStructuredError(gqlError);
                                    if (ckError) {
                                        setBannerError(ckError);
                                        traceUIError(ckError, gqlError);
                                    } else {
                                        const fallbackError = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotKitError"]({
                                            message: gqlError.message,
                                            code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotKitErrorCode"].UNKNOWN
                                        });
                                        setBannerError(fallbackError);
                                        traceUIError(fallbackError, gqlError);
                                    }
                                }
                            }["useCopilotRuntimeClient.useMemo.routeError"];
                            graphQLErrors.forEach(routeError);
                        } else {
                            const fallbackError = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotKitError"]({
                                message: error?.message || String(error),
                                code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotKitErrorCode"].UNKNOWN
                            });
                            setBannerError(fallbackError);
                            traceUIError(fallbackError, error);
                        }
                    }
                }["useCopilotRuntimeClient.useMemo"],
                handleGQLWarning: {
                    "useCopilotRuntimeClient.useMemo": (message)=>{
                        console.warn(message);
                        setBannerError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotKitError"]({
                            message,
                            code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotKitErrorCode"].UNKNOWN
                        }));
                    }
                }["useCopilotRuntimeClient.useMemo"]
            });
        }
    }["useCopilotRuntimeClient.useMemo"], [
        runtimeOptions,
        setBannerError,
        onError
    ]);
};
function createStructuredError(gqlError) {
    const extensions = gqlError.extensions;
    const originalError = extensions?.originalError;
    const message = originalError?.message || gqlError.message;
    const code = extensions?.code;
    if (code) return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotKitError"]({
        message,
        code
    });
    if (originalError?.stack?.includes("CopilotApiDiscoveryError")) return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotKitApiDiscoveryError"]({
        message
    });
    if (originalError?.stack?.includes("CopilotKitRemoteEndpointDiscoveryError")) return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotKitRemoteEndpointDiscoveryError"]({
        message
    });
    if (originalError?.stack?.includes("CopilotKitAgentDiscoveryError")) return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotKitAgentDiscoveryError"]({
        agentName: "",
        availableAgents: []
    });
    return null;
}
//#endregion
//#region src/hooks/use-copilot-authenticated-action.ts
/**
* Hook to create an authenticated action that requires user sign-in before execution.
*
* @internal Defunct — retained for backward compatibility.
*
* @param action - The frontend action to be wrapped with authentication
* @param dependencies - Optional array of dependencies that will trigger recreation of the action when changed
*/ function useCopilotAuthenticatedAction_c(action, dependencies) {
    const { authConfig_c, authStates_c, setAuthStates_c } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["g"])();
    const pendingActionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const executeAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCopilotAuthenticatedAction_c.useCallback[executeAction]": (props)=>{
            if (typeof action.render === "function") return action.render(props);
            return action.render || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"]);
        }
    }["useCopilotAuthenticatedAction_c.useCallback[executeAction]"], [
        action
    ]);
    const wrappedRender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCopilotAuthenticatedAction_c.useCallback[wrappedRender]": (props)=>{
            if (!Object.values(authStates_c || {}).some({
                "useCopilotAuthenticatedAction_c.useCallback[wrappedRender]": (state)=>state.status === "authenticated"
            }["useCopilotAuthenticatedAction_c.useCallback[wrappedRender]"])) {
                pendingActionRef.current = props;
                return authConfig_c?.SignInComponent ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(authConfig_c.SignInComponent, {
                    onSignInComplete: {
                        "useCopilotAuthenticatedAction_c.useCallback[wrappedRender]": (authState)=>{
                            setAuthStates_c?.({
                                "useCopilotAuthenticatedAction_c.useCallback[wrappedRender]": (prev)=>({
                                        ...prev,
                                        [action.name]: authState
                                    })
                            }["useCopilotAuthenticatedAction_c.useCallback[wrappedRender]"]);
                            if (pendingActionRef.current) {
                                executeAction(pendingActionRef.current);
                                pendingActionRef.current = null;
                            }
                        }
                    }["useCopilotAuthenticatedAction_c.useCallback[wrappedRender]"]
                }) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"]);
            }
            return executeAction(props);
        }
    }["useCopilotAuthenticatedAction_c.useCallback[wrappedRender]"], [
        action,
        authStates_c,
        setAuthStates_c
    ]);
    useCopilotAction({
        ...action,
        render: wrappedRender
    }, dependencies);
}
//#endregion
//#region src/hooks/use-langgraph-interrupt.ts
/**
* Transforms a v2 InterruptEvent into the v1 LangGraphInterruptEvent shape
* expected by existing useLangGraphInterrupt callbacks.
*/ function toV1Event(event) {
    const value = typeof event.value === "string" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseJson"])(event.value, event.value) : event.value;
    return {
        name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$graphql$2f40$generated$2f$graphql$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetaEventName"].LangGraphInterruptEvent,
        type: "MetaEvent",
        value
    };
}
function useLangGraphInterrupt(action, _dependencies) {
    const actionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(action);
    actionRef.current = action;
    const existingConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tt"])();
    const resolvedAgentId = action.agentId ?? existingConfig?.agentId ?? "default";
    const threadId = existingConfig?.threadId;
    const nodeName = useAgentNodeName(resolvedAgentId);
    const metadataRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        agentName: resolvedAgentId,
        threadId,
        nodeName
    });
    metadataRef.current = {
        agentName: resolvedAgentId,
        threadId,
        nodeName
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Y"])({
        render: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useLangGraphInterrupt.useInterrupt.useCallback": ({ event, result, resolve })=>{
                const renderFn = actionRef.current.render;
                if (!renderFn) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment);
                const rendered = renderFn({
                    event: toV1Event(event),
                    result,
                    resolve: {
                        "useLangGraphInterrupt.useInterrupt.useCallback.rendered": (r)=>resolve(r)
                    }["useLangGraphInterrupt.useInterrupt.useCallback.rendered"]
                });
                if (typeof rendered === "string") return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, null, rendered);
                return rendered;
            }
        }["useLangGraphInterrupt.useInterrupt.useCallback"], []),
        handler: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useLangGraphInterrupt.useInterrupt.useCallback": ({ event, resolve })=>{
                return actionRef.current.handler?.({
                    event: toV1Event(event),
                    resolve: {
                        "useLangGraphInterrupt.useInterrupt.useCallback": (r)=>resolve(r)
                    }["useLangGraphInterrupt.useInterrupt.useCallback"]
                });
            }
        }["useLangGraphInterrupt.useInterrupt.useCallback"], []),
        enabled: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useLangGraphInterrupt.useInterrupt.useCallback": (event)=>{
                if (!actionRef.current.enabled) return true;
                return actionRef.current.enabled({
                    eventValue: toV1Event(event).value,
                    agentMetadata: metadataRef.current
                });
            }
        }["useLangGraphInterrupt.useInterrupt.useCallback"], []),
        agentId: resolvedAgentId
    });
}
//#endregion
//#region src/hooks/use-copilot-additional-instructions.ts
/**
* `useCopilotAdditionalInstructions` is a React hook that provides additional instructions
* to the Copilot.
*
* ## Usage
*
* ### Simple Usage
*
* In its most basic usage, useCopilotAdditionalInstructions accepts a single string argument
* representing the instructions to be added to the Copilot.
*
* ```tsx
* import { useCopilotAdditionalInstructions } from "@copilotkit/react-core";
*
* export function MyComponent() {
*   useCopilotAdditionalInstructions({
*     instructions: "Do not answer questions about the weather.",
*   });
* }
* ```
*
* ### Conditional Usage
*
* You can also conditionally add instructions based on the state of your app.
*
* ```tsx
* import { useCopilotAdditionalInstructions } from "@copilotkit/react-core";
*
* export function MyComponent() {
*   const [showInstructions, setShowInstructions] = useState(false);
*
*   useCopilotAdditionalInstructions({
*     available: showInstructions ? "enabled" : "disabled",
*     instructions: "Do not answer questions about the weather.",
*   });
* }
* ```
*/ /**
* Adds the given instructions to the Copilot context.
*/ function useCopilotAdditionalInstructions({ instructions, available = "enabled" }, dependencies) {
    const { setAdditionalInstructions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["g"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCopilotAdditionalInstructions.useEffect": ()=>{
            if (available === "disabled") return;
            setAdditionalInstructions({
                "useCopilotAdditionalInstructions.useEffect": (prevInstructions)=>[
                        ...prevInstructions || [],
                        instructions
                    ]
            }["useCopilotAdditionalInstructions.useEffect"]);
            return ({
                "useCopilotAdditionalInstructions.useEffect": ()=>{
                    setAdditionalInstructions({
                        "useCopilotAdditionalInstructions.useEffect": (prevInstructions)=>prevInstructions?.filter({
                                "useCopilotAdditionalInstructions.useEffect": (instruction)=>instruction !== instructions
                            }["useCopilotAdditionalInstructions.useEffect"]) || []
                    }["useCopilotAdditionalInstructions.useEffect"]);
                }
            })["useCopilotAdditionalInstructions.useEffect"];
        }
    }["useCopilotAdditionalInstructions.useEffect"], [
        available,
        instructions,
        setAdditionalInstructions,
        ...dependencies || []
    ]);
}
//#endregion
//#region src/hooks/use-default-tool.ts
function useDefaultTool(tool, dependencies) {
    useCopilotAction({
        ...tool,
        name: "*"
    }, dependencies);
}
//#endregion
//#region src/hooks/use-copilot-chat-suggestions.tsx
/**
* <Callout type="warning">
*   useCopilotChatSuggestions is experimental. The interface is not final and
*   can change without notice.
* </Callout>
*
* `useCopilotReadable` is a React hook that provides app-state and other information
* to the Copilot. Optionally, the hook can also handle hierarchical state within your
* application, passing these parent-child relationships to the Copilot.
*
* <br/>
* <img src="https://cdn.copilotkit.ai/docs/copilotkit/images/use-copilot-chat-suggestions/use-copilot-chat-suggestions.gif" width="500" />
*
* ## Usage
*
* ### Install Dependencies
*
* This component is part of the [@copilotkit/react-ui](https://npmjs.com/package/@copilotkit/react-ui) package.
*
* ```shell npm2yarn \"@copilotkit/react-ui"\
* npm install @copilotkit/react-core @copilotkit/react-ui
* ```
*
* ### Simple Usage
*
* ```tsx
* import { useCopilotChatSuggestions } from "@copilotkit/react-ui";
*
* export function MyComponent() {
*   const [employees, setEmployees] = useState([]);
*
*   useCopilotChatSuggestions({
*     instructions: `The following employees are on duty: ${JSON.stringify(employees)}`,
*   });
* }
* ```
*
* ### Dependency Management
*
* ```tsx
* import { useCopilotChatSuggestions } from "@copilotkit/react-ui";
*
* export function MyComponent() {
*   useCopilotChatSuggestions(
*     {
*       instructions: "Suggest the most relevant next actions.",
*     },
*     [appState],
*   );
* }
* ```
*
* In the example above, the suggestions are generated based on the given instructions.
* The hook monitors `appState`, and updates suggestions accordingly whenever it changes.
*
* ### Behavior and Lifecycle
*
* The hook registers the configuration with the chat context upon component mount and
* removes it on unmount, ensuring a clean and efficient lifecycle management.
*/ function useCopilotChatSuggestions(config, dependencies = []) {
    const resolvedAgentId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tt"])()?.agentId ?? "default";
    const available = (config.available === "enabled" ? "always" : config.available) ?? "before-first-message";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["X"])({
        ...config,
        available,
        consumerAgentId: resolvedAgentId
    }, dependencies);
}
//#endregion
//#region src/types/frontend-action.ts
function processActionsForRuntimeRequest(actions) {
    return actions.filter((action)=>action.available !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$graphql$2f40$generated$2f$graphql$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInputAvailability"].Disabled && action.disabled !== true && action.name !== "*" && action.available != "frontend" && !action.pairedAction).map((action)=>{
        let available = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$graphql$2f40$generated$2f$graphql$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInputAvailability"].Enabled;
        if (action.disabled) available = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$graphql$2f40$generated$2f$graphql$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInputAvailability"].Disabled;
        else if (action.available === "disabled") available = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$graphql$2f40$generated$2f$graphql$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInputAvailability"].Disabled;
        else if (action.available === "remote") available = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$graphql$2f40$generated$2f$graphql$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionInputAvailability"].Remote;
        return {
            name: action.name,
            description: action.description || "",
            jsonSchema: JSON.stringify((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$shared$40$1$2e$62$2e$3_$40$ag$2d$ui$2b$core$40$0$2e$0$2e$57$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$json$2d$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["actionParametersToJsonSchema"])(action.parameters || [])),
            available
        };
    });
}
//#endregion
//#region src/lib/copilot-task.ts
/**
* This class is used to execute one-off tasks, for example on button press. It can use the context available via [useCopilotReadable](/reference/v1/hooks/useCopilotReadable) and the actions provided by [useCopilotAction](/reference/v1/hooks/useCopilotAction), or you can provide your own context and actions.
*
* ## Example
* In the simplest case, use CopilotTask in the context of your app by giving it instructions on what to do.
*
* ```tsx
* import { CopilotTask, useCopilotContext } from "@copilotkit/react-core";
*
* export function MyComponent() {
*   const context = useCopilotContext();
*
*   const task = new CopilotTask({
*     instructions: "Set a random message",
*     actions: [
*       {
*         name: "setMessage",
*       description: "Set the message.",
*       argumentAnnotations: [
*         {
*           name: "message",
*           type: "string",
*           description:
*             "A message to display.",
*           required: true,
*         },
*       ],
*      }
*     ]
*   });
*
*   const executeTask = async () => {
*     await task.run(context, action);
*   }
*
*   return (
*     <>
*       <button onClick={executeTask}>
*         Execute task
*       </button>
*     </>
*   )
* }
* ```
*
* Have a look at the [Presentation Example App](https://github.com/CopilotKit/CopilotKit/blob/main/examples/v1/next-openai/src/app/presentation/page.tsx) for a more complete example.
*/ var CopilotTask = class {
    constructor(config){
        this.instructions = config.instructions;
        this.actions = config.actions || [];
        this.includeCopilotReadable = config.includeCopilotReadable !== false;
        this.includeCopilotActions = config.includeCopilotActions !== false;
        this.forwardedParameters = config.forwardedParameters;
    }
    /**
	* Run the task.
	* @param context The CopilotContext to use for the task. Use `useCopilotContext` to obtain the current context.
	* @param data The data to use for the task.
	*/ async run(context, data) {
        const actions = this.includeCopilotActions ? Object.assign({}, context.actions) : {};
        for (const fn of this.actions)actions[fn.name] = fn;
        let contextString = "";
        if (data) contextString = (typeof data === "string" ? data : JSON.stringify(data)) + "\n\n";
        if (this.includeCopilotReadable) contextString += context.getContextString([], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$react$2d$core$40$1$2e$62_2b5035863a1cfdc26d5a4a9b28e91607$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$ympAovXs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["n"]);
        const messages = [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$client$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextMessage"]({
                content: taskSystemMessage(contextString, this.instructions),
                role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$client$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Role"].System
            })
        ];
        const response = await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$client$2f$CopilotRuntimeClient$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotRuntimeClient"]({
            url: context.copilotApiConfig.chatApiEndpoint,
            publicApiKey: context.copilotApiConfig.publicApiKey,
            headers: context.copilotApiConfig.headers,
            credentials: context.copilotApiConfig.credentials
        }).generateCopilotResponse({
            data: {
                frontend: {
                    actions: processActionsForRuntimeRequest(Object.values(actions)),
                    url: window.location.href
                },
                messages: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$client$2f$conversion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertMessagesToGqlInput"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$client$2f$conversion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filterAgentStateMessages"])(messages)),
                metadata: {
                    requestType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$graphql$2f40$generated$2f$graphql$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotRequestType"].Task
                },
                forwardedParameters: {
                    toolChoice: "required",
                    ...this.forwardedParameters
                }
            },
            properties: context.copilotApiConfig.properties
        }).toPromise();
        const functionCallHandler = context.getFunctionCallHandler(actions);
        const functionCalls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$copilotkit$2b$runtime$2d$client$2d$_5e8b47a518e506d2fdf369f9e6a68d19$2f$node_modules$2f40$copilotkit$2f$runtime$2d$client$2d$gql$2f$dist$2f$client$2f$conversion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertGqlOutputToMessages"])(response.data?.generateCopilotResponse?.messages || []).filter((m)=>m.isActionExecutionMessage());
        for (const functionCall of functionCalls)await functionCallHandler({
            messages,
            name: functionCall.name,
            args: functionCall.arguments
        });
    }
};
function taskSystemMessage(contextString, instructions) {
    return `
Please act as an efficient, competent, conscientious, and industrious professional assistant.

Help the user achieve their goals, and you do so in a way that is as efficient as possible, without unnecessary fluff, but also without sacrificing professionalism.
Always be polite and respectful, and prefer brevity over verbosity.

The user has provided you with the following context:
\`\`\`
${contextString}
\`\`\`

They have also provided you with functions you can call to initiate actions on their behalf.

Please assist them as best you can.

This is not a conversation, so please do not ask questions. Just call a function without saying anything else.

The user has given you the following task to complete:

\`\`\`
${instructions}
\`\`\`
`;
}
;
 //# sourceMappingURL=index.mjs.map
}),
]);

//# sourceMappingURL=27ee8_%40copilotkit_react-core_dist_index_mjs_de01369f._.js.map