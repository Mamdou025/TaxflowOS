module.exports = [
"[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BlockDataFlowColumn",
    ()=>BlockDataFlowColumn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/maximize-2.js [app-ssr] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/sonner@2.0.7_react-dom@19.2.1_react@19.2.1__react@19.2.1/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$tool$2d$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/local-tool-registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$data$2d$viewer$2f$data$2d$preview$2d$summary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/data-viewer/data-preview-summary.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$data$2d$viewer$2f$data$2d$view$2d$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/data-viewer/data-view-tabs.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$data$2d$viewer$2f$data$2d$viewer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/data-viewer/data-viewer.tsx [app-ssr] (ecmascript)");
"use client";
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
const ROW_OUTPUT_ROLE_IDS = new Set([
    "rows",
    "selected_rows"
]);
const WORKBOOK_OUTPUT_ROLE_IDS = new Set([
    "workbook_file",
    "selected_sheet",
    "selected_range"
]);
function asRecord(value) {
    return typeof value === "object" && value !== null ? value : {};
}
function getConfiguredRows(config) {
    const rows = config.rows || config.manualRows || config.tableRows || config.sampleRows;
    return Array.isArray(rows) ? rows : undefined;
}
function isRowsPreviewRole(block, roleId) {
    return ROW_OUTPUT_ROLE_IDS.has(roleId || "") || !roleId && block.family === "Source";
}
function getConfiguredSourceMetadata(block, config) {
    return {
        columns: config.columns,
        fileName: config.fileName || config.workbookName,
        rowCount: Array.isArray(config.rows) ? config.rows.length : undefined,
        selectedRange: config.selectedRange,
        selectedSheet: config.selectedSheet,
        sourceId: block.id,
        sourceKind: config.sourceKind,
        sourceLocator: config.sourceLocator || block.source?.locator,
        sourceName: block.label,
        sourceStatus: config.sourceStatus || block.status,
        sourceSubtype: block.subtype,
        sourceVersion: config.sourceVersion || 1,
        uploadTimestamp: config.uploadTimestamp,
        updatedAt: block.updatedAt,
        workbookId: config.workbookId
    };
}
function getConfiguredWorkbookFile(config) {
    const workbookFile = asRecord(config.workbookFile);
    if (Object.keys(workbookFile).length > 0) {
        return workbookFile;
    }
    if (!(config.fileName || config.workbookName || config.workbookId)) {
        return;
    }
    return {
        fileName: config.fileName || config.workbookName,
        fileSize: config.fileSize,
        uploadedAt: config.uploadTimestamp,
        workbookId: config.workbookId
    };
}
function getConfiguredSelectedSheet(config) {
    if (!config.selectedSheet) {
        return;
    }
    return {
        sheetName: config.selectedSheet,
        sheetCount: Array.isArray(config.sheets) ? config.sheets.length : undefined,
        workbookId: config.workbookId
    };
}
function getConfiguredSelectedRange(config) {
    if (!config.selectedRange) {
        return;
    }
    return {
        range: config.selectedRange,
        rowCount: config.selectedRowsCount,
        selectedSheet: config.selectedSheet
    };
}
function getConfiguredRules(config) {
    const rules = config.keywordRules || config.rules || config.manualRules;
    return Array.isArray(rules) ? rules : undefined;
}
function getConfiguredAggregationRules(config) {
    const rules = config.aggregationRules || config.aggregation_rules;
    return Array.isArray(rules) ? rules : undefined;
}
function getConfiguredRuleMetadata(block, config) {
    const keywordRules = getConfiguredRules(config);
    const aggregationRules = getConfiguredAggregationRules(config);
    return {
        ruleCount: keywordRules?.length || aggregationRules?.length || 0,
        ruleVersion: config.ruleVersion || `v${config.sourceVersion || 1}`,
        sourceId: block.id,
        sourceKind: config.sourceKind || block.subtype,
        sourceLocator: config.sourceLocator || block.source?.locator,
        sourceName: block.label,
        sourceStatus: config.sourceStatus || block.status,
        sourceSubtype: block.subtype,
        sourceVersion: config.sourceVersion || 1,
        updatedAt: block.updatedAt
    };
}
function getConfiguredRuleVersion(config) {
    return {
        ruleVersion: config.ruleVersion || `v${config.sourceVersion || 1}`,
        sourceStatus: config.sourceStatus || "draft",
        sourceVersion: config.sourceVersion || 1
    };
}
function getConfiguredRawRows(config) {
    const rows = config.rows || config.manualRows || config.tableRows;
    return Array.isArray(rows) ? rows.map((row)=>asRecord(row).metadata || row) : undefined;
}
function getConfiguredScalar(config) {
    return config.value || config.manualValue || config.scalarValue;
}
function getToolResultOutput(selectedOutput) {
    return asRecord(selectedOutput?.output);
}
function getRoleOutputValue(role, output) {
    return output[role.outputKey || role.id] ?? output[role.id];
}
function getConfiguredPreviewValue(block, roleId) {
    const config = block.config || {};
    if (isRowsPreviewRole(block, roleId)) {
        const rows = getConfiguredRows(config);
        if (Array.isArray(rows)) {
            return rows;
        }
    }
    const previewByRole = {
        aggregation_tree: ()=>getConfiguredAggregationRules(config),
        aggregation_rules: ()=>getConfiguredAggregationRules(config),
        calculation_rules: ()=>Array.isArray(config.calculationRules) ? config.calculationRules : config.calculation_rules,
        keyword_rules: ()=>getConfiguredRules(config),
        raw_rows: ()=>getConfiguredRawRows(config),
        rollup_rules: ()=>{
            const v = config.rollupRules ?? config.rollup_rules;
            return Array.isArray(v) ? v : getConfiguredAggregationRules(config);
        },
        rule_metadata: ()=>getConfiguredRuleMetadata(block, config),
        rule_version: ()=>getConfiguredRuleVersion(config),
        selected_range: ()=>getConfiguredSelectedRange(config),
        selected_sheet: ()=>getConfiguredSelectedSheet(config),
        source_locator: ()=>config.sourceLocator || block.source?.locator,
        source_metadata: ()=>getConfiguredSourceMetadata(block, config),
        value: ()=>getConfiguredScalar(config),
        workbook_file: ()=>getConfiguredWorkbookFile(config)
    };
    const rolePreview = roleId ? previewByRole[roleId]?.() : undefined;
    return rolePreview ?? getConfiguredRules(config);
}
function getToolOutputRoleById(block, roleId) {
    if (!roleId) {
        return;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$tool$2d$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getToolForBlock"])(block)?.outputRoles.find((role)=>role.id === roleId);
}
function getLatestOutputValueForRole({ block, lastRun, roleId }) {
    const output = getLatestToolOutput({
        blockId: block.id,
        lastRun
    });
    const role = getToolOutputRoleById(block, roleId);
    if (role) {
        const value = getRoleOutputValue(role, output);
        if (value !== undefined) {
            return value;
        }
    }
    if (roleId && output[roleId] !== undefined) {
        return output[roleId];
    }
    return getConfiguredPreviewValue(block, roleId);
}
function getOutputTypeForRole({ block, roleId }) {
    return getToolOutputRoleById(block, roleId)?.outputType || roleId;
}
function getToolRunStatus({ blockId, lastRun }) {
    const selectedLog = lastRun?.logs.find((log)=>log.nodeId === blockId);
    const output = asRecord(selectedLog?.output);
    return String(output.status || selectedLog?.status || "not-run");
}
function getStatusFromRun({ blockId, lastRun, hasValue, missing }) {
    if (missing) {
        return "missing";
    }
    const status = getToolRunStatus({
        blockId,
        lastRun
    });
    if (status === "error") {
        return "error";
    }
    if (status === "warning" || status === "needs_review") {
        return "warning";
    }
    return hasValue ? "ready" : "warning";
}
function getBlockLabel(nodes, blockId) {
    return nodes.find((node)=>node.id === blockId)?.data.block?.label || blockId;
}
function getFlowKind({ block, roleId, side }) {
    if (roleId?.includes("rule")) {
        return "reference";
    }
    const labelsByFamily = {
        "AI / Agent": {
            inputs: "context data",
            outputs: "proposal"
        },
        Field: {
            inputs: "computed values",
            outputs: "field values"
        },
        Logic: {
            inputs: "data",
            outputs: "derived data"
        },
        Output: {
            inputs: "handoff data",
            outputs: "deliverable"
        },
        Protected: {
            inputs: "approved data",
            outputs: "governed data"
        },
        "Review / Validation": {
            inputs: "items to judge",
            outputs: "review info"
        },
        Source: {
            inputs: "setup",
            outputs: "immutable data"
        },
        Trigger: {
            inputs: "trigger",
            outputs: "start signal"
        }
    };
    return (labelsByFamily[block.family] ?? {
        inputs: "data",
        outputs: "data"
    })[side];
}
function getLatestToolOutput({ blockId, lastRun }) {
    const selectedLog = lastRun?.logs.find((log)=>log.nodeId === blockId);
    const selectedOutput = typeof selectedLog?.output === "object" && selectedLog.output !== null ? selectedLog.output : null;
    return getToolResultOutput(selectedOutput);
}
const DATA_FLOW_VIEWS = [
    "schema",
    "table",
    "json",
    "trace"
];
const CALCULATION_TERM_GROUP_KEYS = [
    "namedValues",
    "named_values",
    "categoryTotals",
    "category_totals",
    "rollupTotals",
    "rollup_totals",
    "fapiInputs",
    "fapi_inputs",
    "calculatedResults",
    "calculated_results"
];
function getInlineCalculationFormulas(config) {
    const raw = config.formulas ?? config.calculationRules ?? config.inlineFormulas;
    return Array.isArray(raw) ? raw.map(asRecord) : [];
}
function isCalculationEngineBlock(block) {
    return block.config.toolId === "logic.calculation_engine" || block.subtype === "Calculation Engine";
}
function addCalculationDataTerm({ key, seen, terms, value }) {
    if (seen.has(key)) {
        return;
    }
    seen.add(key);
    terms.push({
        key,
        source: "data",
        value: typeof value === "number" && Number.isFinite(value) ? value : null
    });
}
function collectTermsFromRecord({ record, seen, terms }) {
    for (const [key, value] of Object.entries(record)){
        if (typeof value === "number" && Number.isFinite(value)) {
            addCalculationDataTerm({
                key,
                seen,
                terms,
                value
            });
        }
    }
    for (const key of CALCULATION_TERM_GROUP_KEYS){
        const group = asRecord(record[key]);
        for (const [termKey, value] of Object.entries(group)){
            addCalculationDataTerm({
                key: termKey,
                seen,
                terms,
                value
            });
        }
    }
}
function getCalculationInputTerms({ block, groups }) {
    const dataSeen = new Set();
    const dataTerms = [];
    for (const group of groups){
        collectTermsFromRecord({
            record: asRecord(group.value),
            seen: dataSeen,
            terms: dataTerms
        });
        collectTermsFromRecord({
            record: asRecord(group.contextData),
            seen: dataSeen,
            terms: dataTerms
        });
    }
    const createdTerms = getInlineCalculationFormulas(block.config || {}).map((formula)=>({
            key: String(formula.resultKey || formula.calculationId || "TERM"),
            label: String(formula.label || formula.description || ""),
            source: "created"
        }));
    return {
        createdTerms,
        dataTerms
    };
}
function combineDataFlowValues(values) {
    if (values.length === 0) {
        return;
    }
    if (values.length === 1) {
        return values[0];
    }
    if (values.every(Array.isArray)) {
        return values.flat();
    }
    return values;
}
function getNamedProtectedInputValue({ block, roleId, sourceOutputRole, value }) {
    if (block.family !== "Field" || ![
        "approved_value",
        "candidate_value"
    ].includes(roleId)) {
        return value;
    }
    const resultName = typeof block.config.resultName === "string" ? block.config.resultName : undefined;
    const normalizedResultName = resultName?.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    const record = asRecord(value);
    if (resultName && [
        "calculated_results",
        "final_totals",
        "official_line_values"
    ].includes(sourceOutputRole) && record[resultName] !== undefined) {
        return record[resultName];
    }
    if (normalizedResultName && sourceOutputRole === "calculated_results" && record[normalizedResultName] !== undefined) {
        return record[normalizedResultName];
    }
    if (sourceOutputRole === "reviewed_exchange_rate" && record.rate !== undefined) {
        return record.rate;
    }
    if (sourceOutputRole === "exchange_rate" && record.exchange_rate !== undefined) {
        return record.exchange_rate;
    }
    return value;
}
function hasDataValue(value) {
    return value !== undefined && value !== null;
}
function getGroupStatusClasses(status) {
    if (status === "ready") {
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
    }
    if (status === "warning") {
        return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300";
    }
    return "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300";
}
function getConsumerLabels({ edges, nodes, roleId }) {
    const matchingEdges = edges.filter((edge)=>sourceOutputRoleMatches(roleId, edge.data?.workflowEdge?.sourceOutputRole));
    return matchingEdges.map((edge)=>`${getBlockLabel(nodes, edge.target)}.${edge.data?.workflowEdge?.targetInputRole || "input"}`);
}
function sourceOutputRoleMatches(roleId, sourceOutputRole) {
    if (ROW_OUTPUT_ROLE_IDS.has(roleId)) {
        return !sourceOutputRole || sourceOutputRole === "output" || ROW_OUTPUT_ROLE_IDS.has(sourceOutputRole);
    }
    return sourceOutputRole === roleId;
}
function getStringConfig(config, keys, fallback) {
    for (const key of keys){
        const value = config[key];
        if (typeof value === "string" && value.trim()) {
            return value;
        }
    }
    return fallback;
}
function getArrayConfig(config, keys) {
    for (const key of keys){
        const value = config[key];
        if (Array.isArray(value)) {
            return value;
        }
    }
}
function getSourceArtifactKind(block) {
    const sourceKind = String(block.config.sourceKind || "").toLowerCase();
    if (block.subtype === "Excel / Workbook" || sourceKind.includes("excel") || sourceKind.includes("workbook") || sourceKind.includes("manual_table")) {
        return "workbook";
    }
    if (block.subtype === "PDF / Document" || sourceKind.includes("pdf") || sourceKind.includes("document")) {
        return "document";
    }
    if (block.subtype === "Keyword Rules" || block.subtype === "Aggregation Rules" || block.subtype === "Rollup Rules" || block.subtype === "Calculation Rules" || sourceKind.includes("keyword_rules") || sourceKind.includes("aggregation_rules") || sourceKind.includes("rollup_rules") || sourceKind.includes("calculation_rules") || sourceKind.includes("rule_knowledge")) {
        return "rules";
    }
    if (sourceKind.includes("currency_rate")) {
        return "fx_rate";
    }
    if (sourceKind.includes("fapi_inputs")) {
        return "calculation_inputs";
    }
    return "source";
}
function getSourcePaneTitle(block) {
    const artifactKind = getSourceArtifactKind(block);
    if (artifactKind === "workbook") {
        return "Workbook";
    }
    if (artifactKind === "document") {
        return "Document";
    }
    if (artifactKind === "rules") {
        return "Rulebook";
    }
    if (artifactKind === "fx_rate") {
        return "FX Rate Source";
    }
    if (artifactKind === "calculation_inputs") {
        return "Calculation Inputs";
    }
    return "Source Artifact";
}
function getSourcePaneDescription(block) {
    const artifactKind = getSourceArtifactKind(block);
    if (artifactKind === "workbook") {
        return "Original workbook evidence";
    }
    if (artifactKind === "document") {
        return "Original document evidence";
    }
    if (artifactKind === "rules") {
        return "Editable governance rules";
    }
    if (artifactKind === "fx_rate") {
        return "External rate evidence";
    }
    if (artifactKind === "calculation_inputs") {
        return "Workbook calculation assumptions";
    }
    return "Original source evidence";
}
function getSourceArtifactValue(block, artifactKind) {
    if (artifactKind === "rules") {
        const sourceKind = String(block.config.sourceKind || "").toLowerCase();
        if (sourceKind.includes("aggregation_rules")) {
            return getConfiguredPreviewValue(block, "aggregation_rules");
        }
        if (sourceKind.includes("rollup_rules")) {
            return getConfiguredPreviewValue(block, "rollup_rules");
        }
        if (sourceKind.includes("calculation_rules")) {
            return getConfiguredPreviewValue(block, "calculation_rules");
        }
        return getConfiguredPreviewValue(block, "keyword_rules");
    }
    if (artifactKind === "workbook") {
        return getConfiguredPreviewValue(block, "rows");
    }
    if (artifactKind === "fx_rate") {
        return {
            documentCurrency: block.config.documentCurrency,
            overrideRate: block.config.overrideRate,
            provider: block.config.rateProvider || "bank_of_canada",
            rateType: block.config.rateType || "annual_average",
            reportingCurrency: block.config.reportingCurrency,
            year: block.config.fapiYear
        };
    }
    if (artifactKind === "calculation_inputs") {
        return {
            expectedResults: block.config.expectedResults,
            fatPaid: block.config.fatPaid,
            fapiYear: block.config.fapiYear,
            inclusionRate: block.config.inclusionRate,
            rtf: block.config.rtf
        };
    }
    return asRecord(block.config || {});
}
function getSourceArtifactOutputType(block, artifactKind) {
    if (artifactKind === "rules") {
        const sourceKind = String(block.config.sourceKind || "").toLowerCase();
        if (sourceKind.includes("rollup_rules")) {
            return "rollup_rules";
        }
        if (sourceKind.includes("calculation_rules")) {
            return "calculation_rules";
        }
        if (sourceKind.includes("aggregation_rules")) {
            return "aggregation_rules";
        }
        return "keyword_rules";
    }
    if (artifactKind === "workbook") {
        return "table_rows";
    }
    if (artifactKind === "document") {
        return "document_source";
    }
    if (artifactKind === "fx_rate") {
        return "exchange_rate";
    }
    if (artifactKind === "calculation_inputs") {
        return "fapi_inputs";
    }
    return "source_artifact";
}
function getSourceArtifactRoleId(block, artifactKind) {
    if (artifactKind === "rules") {
        const sourceKind = String(block.config.sourceKind || "").toLowerCase();
        if (sourceKind.includes("rollup_rules")) {
            return "rollup_rules_source";
        }
        if (sourceKind.includes("calculation_rules")) {
            return "calculation_rules_source";
        }
        if (sourceKind.includes("aggregation_rules")) {
            return "aggregation_rules_source";
        }
        return "keyword_rules_source";
    }
    if (artifactKind === "workbook") {
        return "workbook_artifact";
    }
    if (artifactKind === "fx_rate") {
        return "exchange_rate_source";
    }
    if (artifactKind === "calculation_inputs") {
        return "fapi_inputs_source";
    }
    return "source_artifact";
}
function getWorkbookArtifactContext({ block, config, locator, selectedRange, selectedSheet }) {
    const sheets = getArrayConfig(config, [
        "sheets",
        "availableSheets"
    ]) || [
        "Trial Balance",
        "Notes",
        "FX Rates"
    ];
    return {
        sourceKind: config.sourceKind || "excel_template_mock",
        sourceLocator: locator,
        sourceTrace: [
            `${block.label}.${selectedRange}`
        ],
        workbookName: getStringConfig(config, [
            "workbookName",
            "fileName",
            "sourceFileName"
        ], `${block.label}.xlsx`),
        selectedRange,
        selectedSheet,
        sheets
    };
}
function getDocumentArtifactContext({ block, config, locator }) {
    const selectedPages = getArrayConfig(config, [
        "selectedPages",
        "pages"
    ]) || getStringConfig(config, [
        "selectedPage",
        "page"
    ], "Page 1");
    return {
        documentName: getStringConfig(config, [
            "documentName",
            "fileName",
            "sourceFileName"
        ], `${block.label}.pdf`),
        documentLocator: locator,
        selectedPages,
        sourceKind: config.sourceKind || "pdf_document",
        sourceTrace: [
            `${block.label}.${locator}`
        ]
    };
}
function getRuleArtifactContext({ block, config, locator }) {
    return {
        ruleVersion: getStringConfig(config, [
            "ruleVersion",
            "sourceVersion",
            "version"
        ], "v1"),
        sourceKind: config.sourceKind || "Rule / Knowledge Source",
        sourceLocator: locator,
        sourceTrace: [
            `${block.label}.${config.sourceKind || "rules"}`
        ],
        sourceStatus: config.sourceStatus || block.status
    };
}
function getFxRateArtifactContext({ block, config, locator }) {
    return {
        rateProvider: config.rateProvider || "bank_of_canada",
        rateType: config.rateType || "annual_average",
        sourceKind: "currency_rate",
        sourceLocator: locator,
        sourceTrace: [
            `${block.label}.exchange_rate`
        ],
        sourceVersion: config.sourceVersion || 1
    };
}
function getCalculationInputsArtifactContext({ block, config, locator }) {
    return {
        sourceKind: "fapi_inputs",
        sourceLocator: locator,
        sourceTrace: [
            `${block.label}.fapi_inputs`
        ],
        sourceVersion: config.sourceVersion || 1
    };
}
function getSourceArtifactContext({ block, value }) {
    const config = block.config || {};
    const artifactKind = getSourceArtifactKind(block);
    const itemCount = Array.isArray(value) ? value.length : undefined;
    const selectedSheet = getStringConfig(config, [
        "selectedSheet",
        "sheet",
        "worksheet"
    ], "Trial Balance");
    const selectedRange = getStringConfig(config, [
        "selectedRange",
        "range",
        "namedRange"
    ], itemCount ? `${selectedSheet}!A1:F${itemCount + 1}` : `${selectedSheet}!A:F`);
    const locator = getStringConfig(config, [
        "sourceLocator",
        "locator",
        "documentLocator"
    ], block.source?.locator || `${block.label}.${selectedRange}`);
    const contextByArtifactKind = {
        calculation_inputs: getCalculationInputsArtifactContext({
            block,
            config,
            locator
        }),
        document: getDocumentArtifactContext({
            block,
            config,
            locator
        }),
        fx_rate: getFxRateArtifactContext({
            block,
            config,
            locator
        }),
        rules: getRuleArtifactContext({
            block,
            config,
            locator
        }),
        workbook: getWorkbookArtifactContext({
            block,
            config,
            locator,
            selectedRange,
            selectedSheet
        })
    };
    const artifactContext = contextByArtifactKind[artifactKind];
    if (artifactContext) {
        return artifactContext;
    }
    return {
        sourceKind: config.sourceKind || block.subtype,
        sourceLocator: locator,
        sourceTrace: [
            `${block.label}.${locator}`
        ]
    };
}
function createSourceArtifactGroups({ block, lastRun }) {
    const artifactKind = getSourceArtifactKind(block);
    const value = getSourceArtifactValue(block, artifactKind);
    const outputType = getSourceArtifactOutputType(block, artifactKind);
    const contextData = getSourceArtifactContext({
        block,
        value
    });
    const summary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$data$2d$viewer$2f$data$2d$preview$2d$summary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDataPreviewSummary"])({
        contextData,
        outputType,
        value
    });
    const hasData = hasDataValue(value);
    return [
        {
            contextData,
            count: summary.count,
            description: artifactKind === "rules" ? "Editable rulebook. Logic tools consume these governed rules downstream." : "Original immutable Source artifact. Selections expose evidence slices downstream.",
            hasData,
            id: `source-artifact-${block.id}`,
            outputType,
            preview: hasData ? summary.preview : "No source artifact preview",
            roleId: getSourceArtifactRoleId(block, artifactKind),
            roleLabel: getSourcePaneTitle(block),
            status: getStatusFromRun({
                blockId: block.id,
                hasValue: hasData,
                lastRun
            }),
            statusLabel: artifactKind === "rules" ? "rulebook" : "source evidence",
            value
        }
    ];
}
function getCombinedContextData(contextValues) {
    if (contextValues.length === 1) {
        return contextValues[0];
    }
    if (contextValues.length > 1) {
        return {
            inputs: contextValues
        };
    }
}
function createInputGroups({ block, incomingEdges, lastRun, nodes, onCreateSourceForInput, tool }) {
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Input binding summary has to reconcile roles, edges, source values, missing state, and preview metadata in one pass.
    return tool.inputRoles.map((role)=>{
        const boundEdges = incomingEdges.filter((edge)=>edge.data?.workflowEdge?.targetInputRole === role.id);
        const acceptedTypes = [
            ...role.acceptedFamilies,
            ...role.acceptedSourceKinds || [],
            ...role.acceptedOutputTypes || []
        ];
        const values = [];
        const contextValues = [];
        const connectedLabels = [];
        const sourceOutputRoles = [];
        const bindingLabels = [];
        let status = role.required ? "missing" : "warning";
        for (const edge of boundEdges){
            const sourceBlock = nodes.find((node)=>node.id === edge.source)?.data.block;
            const sourceOutputRole = edge.data?.workflowEdge?.sourceOutputRole || "output";
            const rawValue = sourceBlock ? getLatestOutputValueForRole({
                block: sourceBlock,
                lastRun,
                roleId: sourceOutputRole
            }) : undefined;
            const value = getNamedProtectedInputValue({
                block,
                roleId: role.id,
                sourceOutputRole,
                value: rawValue
            });
            const contextData = sourceBlock ? getLatestToolOutput({
                blockId: sourceBlock.id,
                lastRun
            }) : undefined;
            if (hasDataValue(value)) {
                values.push(value);
            }
            if (contextData) {
                contextValues.push(contextData);
            }
            connectedLabels.push(`${getBlockLabel(nodes, edge.source)}.${sourceOutputRole}`);
            sourceOutputRoles.push(sourceOutputRole);
            if (edge.data?.workflowEdge?.bindingLabel) {
                bindingLabels.push(edge.data.workflowEdge.bindingLabel);
            }
            status = getStatusFromRun({
                blockId: sourceBlock?.id || edge.source,
                hasValue: hasDataValue(value),
                lastRun
            });
        }
        // When no edge is connected, check if the block self-configures this role via its own config.
        const configFallbackValue = boundEdges.length === 0 ? getConfiguredPreviewValue(block, role.id) : undefined;
        const hasSelfConfig = Array.isArray(configFallbackValue) ? configFallbackValue.length > 0 : hasDataValue(configFallbackValue);
        const value = values.length > 0 ? combineDataFlowValues(values) : configFallbackValue;
        const contextData = getCombinedContextData(contextValues);
        const outputType = boundEdges.length === 1 ? getOutputTypeForRole({
            block: nodes.find((node)=>node.id === boundEdges[0].source)?.data.block,
            roleId: sourceOutputRoles[0]
        }) : role.acceptedOutputTypes?.[0] || role.id;
        const summary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$data$2d$viewer$2f$data$2d$preview$2d$summary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDataPreviewSummary"])({
            contextData,
            outputType,
            value
        });
        const missing = role.required && boundEdges.length === 0 && !hasSelfConfig;
        return {
            acceptedTypes,
            bindingLabel: bindingLabels.join(", "),
            connectedLabel: connectedLabels.length > 0 ? connectedLabels.join(", ") : undefined,
            contextData,
            count: summary.count,
            description: missing ? `Missing required input. Suggested: ${acceptedTypes.join(", ")}` : hasSelfConfig && boundEdges.length === 0 ? "Configured directly in this block." : role.description,
            hasData: hasDataValue(value),
            id: `input-${role.id}`,
            outputType,
            preview: missing ? "Missing required input" : summary.preview,
            roleId: role.id,
            roleLabel: role.label,
            sourceOutputRole: sourceOutputRoles.join(", "),
            status: missing ? "missing" : hasSelfConfig && boundEdges.length === 0 ? "ready" : status,
            statusLabel: missing ? "missing" : hasSelfConfig && boundEdges.length === 0 ? "inline" : getFlowKind({
                block,
                roleId: role.id,
                side: "inputs"
            }),
            value,
            ...missing && onCreateSourceForInput ? {
                createSourceInputRole: role.id
            } : {}
        };
    });
}
function createOutputGroup({ block, lastRun, latestOutput, nodes, outgoingEdges, role }) {
    const value = getRoleOutputValue(role, latestOutput);
    const sourceFallback = block.family === "Source" ? getConfiguredPreviewValue(block, role.id) : undefined;
    const displayValue = hasDataValue(value) ? value : sourceFallback;
    const hasLatestValue = hasDataValue(value);
    const hasDisplayValue = hasDataValue(displayValue);
    const sourceOutputReady = block.family === "Source" && hasDisplayValue;
    const sourceRowsOutput = block.family === "Source" && ROW_OUTPUT_ROLE_IDS.has(role.id);
    const outputType = sourceRowsOutput ? "table_rows" : role.outputType;
    const summary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$data$2d$viewer$2f$data$2d$preview$2d$summary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDataPreviewSummary"])({
        contextData: latestOutput,
        outputType,
        value: displayValue
    });
    let statusLabel = "not executed";
    if (sourceOutputReady) {
        statusLabel = getSourceOutputStatusLabel(role.id);
    } else if (hasLatestValue) {
        statusLabel = getFlowKind({
            block,
            roleId: role.id,
            side: "outputs"
        });
    }
    return {
        consumers: getConsumerLabels({
            edges: outgoingEdges,
            nodes,
            roleId: role.id
        }),
        contextData: latestOutput,
        count: summary.count,
        description: role.description,
        hasData: hasDisplayValue,
        id: `output-${role.id}`,
        outputType,
        preview: hasDisplayValue ? summary.preview : "No output data",
        roleId: role.id,
        roleLabel: role.label,
        status: getStatusFromRun({
            blockId: block.id,
            hasValue: hasLatestValue || sourceOutputReady,
            lastRun
        }),
        statusLabel,
        value: displayValue
    };
}
function getSourceOutputStatusLabel(roleId) {
    if (ROW_OUTPUT_ROLE_IDS.has(roleId)) {
        return "selected evidence";
    }
    if (roleId === "raw_rows") {
        return "raw evidence";
    }
    if (roleId === "source_metadata") {
        return "metadata";
    }
    if (roleId === "source_locator") {
        return "locator";
    }
    if (WORKBOOK_OUTPUT_ROLE_IDS.has(roleId)) {
        return "workbook";
    }
    return "source evidence";
}
function getDisplayOutputRoles({ block, tool }) {
    if (block.family !== "Source") {
        return tool.outputRoles;
    }
    const selectedRowsRole = tool.outputRoles.find((role)=>role.id === "selected_rows");
    if (!selectedRowsRole) {
        return tool.outputRoles;
    }
    let insertedRowsRole = false;
    return tool.outputRoles.flatMap((role)=>{
        if (!ROW_OUTPUT_ROLE_IDS.has(role.id)) {
            return [
                role
            ];
        }
        if (insertedRowsRole) {
            return [];
        }
        insertedRowsRole = true;
        return [
            selectedRowsRole
        ];
    });
}
function createOutputGroups({ block, lastRun, latestOutput, nodes, outgoingEdges, tool }) {
    return getDisplayOutputRoles({
        block,
        tool
    }).map((role)=>createOutputGroup({
            block,
            lastRun,
            latestOutput,
            nodes,
            outgoingEdges,
            role
        }));
}
function OutputRoleCard({ group, initiallyExpanded, onCreateSourceForInput, onExecuteStep, onOpenLarge, side }) {
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initiallyExpanded ?? false);
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("table");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-md border bg-background/70 text-xs",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "w-full px-2.5 py-2.5 text-left",
                onClick: ()=>setExpanded((prev)=>!prev),
                type: "button",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            expanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: "size-3.5 shrink-0 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1322,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                className: "size-3.5 shrink-0 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1324,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex-1 truncate font-medium text-sm",
                                children: group.roleLabel
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1326,
                                columnNumber: 11
                            }, this),
                            group.count !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "shrink-0 tabular-nums text-[10px] text-muted-foreground",
                                children: group.count
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1330,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `shrink-0 rounded-full border px-1.5 py-0.5 font-medium text-[10px] uppercase ${getGroupStatusClasses(group.status)}`,
                                children: group.statusLabel
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1334,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 1320,
                        columnNumber: 9
                    }, this),
                    !expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "ml-[22px] mt-0.5 truncate text-muted-foreground",
                        children: group.preview
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 1341,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                lineNumber: 1315,
                columnNumber: 7
            }, this),
            expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 border-t p-2.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-0.5 text-[10px] text-muted-foreground",
                        children: [
                            group.connectedLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    "From: ",
                                    group.connectedLabel
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1350,
                                columnNumber: 38
                            }, this),
                            group.bindingLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    "Binding: ",
                                    group.bindingLabel
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1351,
                                columnNumber: 36
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    "Type: ",
                                    group.outputType || "local_data"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1352,
                                columnNumber: 13
                            }, this),
                            group.consumers && group.consumers.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    "To: ",
                                    group.consumers.join(", ")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1354,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 1349,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center gap-0.5",
                        children: [
                            DATA_FLOW_VIEWS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    className: "h-6 px-2 text-[10px]",
                                    onClick: ()=>setView(item),
                                    size: "sm",
                                    type: "button",
                                    variant: view === item ? "secondary" : "ghost",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$data$2d$viewer$2f$data$2d$view$2d$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DATA_VIEW_LABELS"][item]
                                }, item, false, {
                                    fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                    lineNumber: 1359,
                                    columnNumber: 15
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                className: "ml-auto h-6 px-2 text-[10px]",
                                onClick: onOpenLarge,
                                size: "sm",
                                type: "button",
                                variant: "ghost",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
                                        className: "mr-1 size-3"
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                        lineNumber: 1377,
                                        columnNumber: 15
                                    }, this),
                                    "Full"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1370,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 1357,
                        columnNumber: 11
                    }, this),
                    group.hasData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$data$2d$viewer$2f$data$2d$viewer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataDisplayViewer"], {
                        className: "min-h-[220px]",
                        contextData: group.contextData,
                        outputType: group.outputType,
                        value: group.value,
                        view: view
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 1382,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2 rounded-md border bg-muted/30 p-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-muted-foreground",
                                children: side === "outputs" ? "Execute this step to inspect emitted data." : group.description || "Connect a compatible upstream block to this input role."
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1391,
                                columnNumber: 15
                            }, this),
                            side === "outputs" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                disabled: !onExecuteStep,
                                onClick: onExecuteStep,
                                size: "sm",
                                type: "button",
                                variant: "secondary",
                                children: "Execute step"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1398,
                                columnNumber: 17
                            }, this),
                            side !== "outputs" && group.createSourceInputRole && onCreateSourceForInput && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>onCreateSourceForInput(group.createSourceInputRole),
                                size: "sm",
                                type: "button",
                                variant: "secondary",
                                children: "Create Source"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1411,
                                columnNumber: 19
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 1390,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                lineNumber: 1348,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
        lineNumber: 1314,
        columnNumber: 5
    }, this);
}
function DataFlowLargeViewer({ group, onOpenChange, open, side }) {
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("table");
    const copyJson = async ()=>{
        await navigator.clipboard.writeText(JSON.stringify(group?.value, null, 2));
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$1_react$40$19$2e$2$2e$1_$5f$react$40$19$2e$2$2e$1$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success("Copied data JSON");
    };
    let roleDescriptor = "Output role";
    if (side === "source") {
        roleDescriptor = "Source artifact";
    } else if (side === "inputs") {
        roleDescriptor = "Input role";
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
        onOpenChange: onOpenChange,
        open: open,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "max-h-[88vh] max-w-[min(1200px,calc(100vw-2rem))] overflow-hidden p-0",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    className: "border-b px-5 py-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: group?.roleLabel || "Data viewer"
                        }, void 0, false, {
                            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                            lineNumber: 1457,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: [
                                roleDescriptor,
                                " ",
                                group?.roleId || "selected",
                                " ·",
                                " ",
                                group?.outputType || "local_data",
                                group?.count !== undefined ? ` · ${group.count} item(s)` : ""
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                            lineNumber: 1458,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                    lineNumber: 1456,
                    columnNumber: 9
                }, this),
                group && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex min-h-0 flex-col gap-3 overflow-hidden p-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-1 text-muted-foreground text-xs",
                            children: [
                                group.connectedLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        "From: ",
                                        group.connectedLabel
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                    lineNumber: 1467,
                                    columnNumber: 40
                                }, this),
                                group.bindingLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        "Binding: ",
                                        group.bindingLabel
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                    lineNumber: 1468,
                                    columnNumber: 38
                                }, this),
                                group.consumers && group.consumers.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        "Consumers: ",
                                        group.consumers.join(", ")
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                    lineNumber: 1470,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        "Preview: ",
                                        group.preview
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                    lineNumber: 1472,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                            lineNumber: 1466,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap items-center gap-1",
                            children: [
                                DATA_FLOW_VIEWS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        className: "h-8 px-3 text-xs",
                                        onClick: ()=>setView(item),
                                        size: "sm",
                                        type: "button",
                                        variant: view === item ? "secondary" : "ghost",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$data$2d$viewer$2f$data$2d$view$2d$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DATA_VIEW_LABELS"][item]
                                    }, item, false, {
                                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                        lineNumber: 1476,
                                        columnNumber: 17
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    className: "ml-auto h-8 px-3 text-xs",
                                    onClick: copyJson,
                                    size: "sm",
                                    type: "button",
                                    variant: "outline",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                            className: "mr-1 size-3"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                            lineNumber: 1494,
                                            columnNumber: 17
                                        }, this),
                                        "Copy JSON"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                    lineNumber: 1487,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                            lineNumber: 1474,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$data$2d$viewer$2f$data$2d$viewer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataDisplayViewer"], {
                            className: "min-h-0",
                            contextData: group.contextData,
                            expanded: true,
                            outputType: group.outputType,
                            value: group.value,
                            view: view
                        }, void 0, false, {
                            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                            lineNumber: 1498,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                    lineNumber: 1465,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
            lineNumber: 1455,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
        lineNumber: 1454,
        columnNumber: 5
    }, this);
}
function DataFlowPaneHeader({ description: providedDescription, side, title }) {
    let description = "What this block emits";
    if (side === "source") {
        description = "Original artifact evidence";
    } else if (side === "inputs") {
        description = "What enters this block";
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-start justify-between gap-2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "font-semibold text-sm",
                    children: title
                }, void 0, false, {
                    fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                    lineNumber: 1532,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-muted-foreground text-xs",
                    children: providedDescription || description
                }, void 0, false, {
                    fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                    lineNumber: 1533,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
            lineNumber: 1531,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
        lineNumber: 1530,
        columnNumber: 5
    }, this);
}
function getGroupedCalculationInputTerms({ block, groups }) {
    const globalSeen = new Set();
    const groupedDataTerms = [];
    for (const group of groups){
        const terms = [];
        const addTerm = (key, val)=>{
            if (globalSeen.has(key)) return;
            globalSeen.add(key);
            terms.push({
                key,
                source: "data",
                value: typeof val === "number" && Number.isFinite(val) ? val : null
            });
        };
        const valueRecord = asRecord(group.value);
        for (const [k, v] of Object.entries(valueRecord)){
            if (typeof v === "number") addTerm(k, v);
        }
        for (const groupKey of CALCULATION_TERM_GROUP_KEYS){
            for (const [k, v] of Object.entries(asRecord(valueRecord[groupKey]))){
                addTerm(k, v);
            }
        }
        const contextRecord = asRecord(group.contextData);
        for (const [k, v] of Object.entries(contextRecord)){
            if (typeof v === "number") addTerm(k, v);
        }
        for (const groupKey of CALCULATION_TERM_GROUP_KEYS){
            for (const [k, v] of Object.entries(asRecord(contextRecord[groupKey]))){
                addTerm(k, v);
            }
        }
        groupedDataTerms.push({
            category: group.roleLabel || group.connectedLabel || "Data",
            terms
        });
    }
    const createdTerms = getInlineCalculationFormulas(block.config || {}).map((formula)=>({
            key: String(formula.resultKey || formula.calculationId || "TERM"),
            label: String(formula.label || formula.description || ""),
            source: "created"
        }));
    return {
        createdTerms,
        groupedDataTerms
    };
}
// Renders incoming data grouped by category using the same card design as DataFlowGroupRow.
function CalculationIncomingDataSection({ disabled, groupedDataTerms, onInsertTerm }) {
    const [expandedIds, setExpandedIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const toggleExpanded = (category)=>{
        setExpandedIds((prev)=>prev.includes(category) ? prev.filter((id)=>id !== category) : [
                ...prev,
                category
            ]);
    };
    if (groupedDataTerms.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-md border bg-background/70 p-3 text-muted-foreground text-xs",
            children: "Connect upstream blocks to see incoming data categories and values."
        }, void 0, false, {
            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
            lineNumber: 1629,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-1.5",
        children: groupedDataTerms.map((group)=>{
            const isExpanded = expandedIds.includes(group.category);
            const hasTerms = group.terms.length > 0;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-md border bg-background/70 text-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "w-full px-2 py-2 text-left",
                        onClick: ()=>toggleExpanded(group.category),
                        type: "button",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "truncate font-medium text-sm",
                                            children: group.category
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                            lineNumber: 1654,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "truncate text-muted-foreground",
                                            children: hasTerms ? `${group.terms.length} value${group.terms.length === 1 ? "" : "s"}` : "no data yet"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                            lineNumber: 1657,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                    lineNumber: 1653,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `shrink-0 rounded-full border px-1.5 py-0.5 font-medium text-[10px] uppercase ${hasTerms ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"}`,
                                    children: hasTerms ? "data" : "pending"
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                    lineNumber: 1661,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                            lineNumber: 1652,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 1647,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1 border-t px-2 py-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "flex h-7 items-center gap-1 rounded px-2 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                            onClick: ()=>toggleExpanded(group.category),
                            type: "button",
                            children: isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        className: "size-3"
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                        lineNumber: 1682,
                                        columnNumber: 21
                                    }, this),
                                    "Collapse"
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                        className: "size-3"
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                        lineNumber: 1687,
                                        columnNumber: 21
                                    }, this),
                                    "Expand"
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                            lineNumber: 1675,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 1674,
                        columnNumber: 13
                    }, this),
                    isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-t p-2",
                        children: !hasTerms ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "px-1 py-1 text-[10px] text-muted-foreground italic",
                            children: "No latest data yet. Run upstream blocks to populate values."
                        }, void 0, false, {
                            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                            lineNumber: 1698,
                            columnNumber: 19
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-px",
                            children: group.terms.map((term)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "flex w-full items-center gap-2 rounded px-1.5 py-1 text-left transition-colors hover:bg-sky-500/10 disabled:opacity-40",
                                    disabled: disabled || !onInsertTerm,
                                    onClick: ()=>onInsertTerm?.(term.key),
                                    title: term.value !== null ? `${term.key} = ${term.value}` : term.key,
                                    type: "button",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex-1 truncate font-mono font-semibold text-[11px] text-sky-700 dark:text-sky-400",
                                            children: term.key
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                            lineNumber: 1716,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "shrink-0 tabular-nums text-[10px] text-muted-foreground",
                                            children: term.value != null ? term.value.toLocaleString() : "–"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                            lineNumber: 1719,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, term.key, true, {
                                    fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                    lineNumber: 1704,
                                    columnNumber: 23
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                            lineNumber: 1702,
                            columnNumber: 19
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 1696,
                        columnNumber: 15
                    }, this)
                ]
            }, group.category, true, {
                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                lineNumber: 1642,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
        lineNumber: 1636,
        columnNumber: 5
    }, this);
}
function CalculationTermsInputPanel({ createdTerms, dataTerms, disabled, onCreateTerm, onInsertTerm, onSelectTerm, selectedTermId }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2 rounded-md border bg-background/70 p-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-medium text-xs",
                                children: "Formula term helper"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1758,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[10px] text-muted-foreground",
                                children: "Click terms to edit or insert into the selected formula"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1759,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 1757,
                        columnNumber: 9
                    }, this),
                    onCreateTerm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        className: "h-7 px-2 text-[11px]",
                        disabled: disabled,
                        onClick: onCreateTerm,
                        size: "sm",
                        type: "button",
                        variant: "ghost",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "mr-1 size-3"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1772,
                                columnNumber: 13
                            }, this),
                            "New"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 1764,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                lineNumber: 1756,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-semibold text-[9px] text-emerald-700 uppercase tracking-widest",
                        children: "Created"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 1779,
                        columnNumber: 9
                    }, this),
                    createdTerms.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded border border-dashed p-2 text-[10px] text-muted-foreground",
                        children: "No created terms yet."
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 1783,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1",
                        children: createdTerms.map((term)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex items-center gap-1 rounded border px-2 py-1 ${selectedTermId === term.key ? "border-primary bg-primary/10" : "bg-background/70"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "min-w-0 flex-1 text-left",
                                        onClick: ()=>onSelectTerm?.(term.key),
                                        type: "button",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block truncate font-mono font-semibold text-[11px]",
                                                children: term.key
                                            }, void 0, false, {
                                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                                lineNumber: 1802,
                                                columnNumber: 19
                                            }, this),
                                            term.label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block truncate text-[10px] text-muted-foreground",
                                                children: term.label
                                            }, void 0, false, {
                                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                                lineNumber: 1806,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                        lineNumber: 1797,
                                        columnNumber: 17
                                    }, this),
                                    onInsertTerm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "aria-label": `Insert ${term.key}`,
                                        className: "rounded p-1 text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-700 disabled:opacity-40",
                                        disabled: disabled,
                                        onClick: ()=>onInsertTerm(term.key),
                                        title: `Insert ${term.key}`,
                                        type: "button",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "size-3"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                            lineNumber: 1820,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                        lineNumber: 1812,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, term.key, true, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1789,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 1787,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                lineNumber: 1778,
                columnNumber: 7
            }, this),
            dataTerms.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-semibold text-[9px] text-sky-700 uppercase tracking-widest",
                        children: "From data"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 1831,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-h-44 space-y-1 overflow-auto",
                        children: dataTerms.map((term)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "block w-full rounded border bg-background/70 px-2 py-1 text-left hover:border-sky-500/50 hover:bg-sky-500/10 disabled:opacity-40",
                                disabled: disabled || !onInsertTerm,
                                onClick: ()=>onInsertTerm?.(term.key),
                                title: term.value !== null && term.value !== undefined ? `${term.key} = ${term.value}` : term.key,
                                type: "button",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block truncate font-mono font-semibold text-[11px] text-sky-700 dark:text-sky-400",
                                        children: term.key
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                        lineNumber: 1848,
                                        columnNumber: 17
                                    }, this),
                                    term.value !== null && term.value !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block truncate text-[10px] text-muted-foreground",
                                        children: term.value
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                        lineNumber: 1852,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, term.key, true, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 1836,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 1834,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                lineNumber: 1830,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
        lineNumber: 1755,
        columnNumber: 5
    }, this);
}
function BlockDataFlowColumn({ block, calculationInsertDisabled, calculationInsertRequest, calculationTermCreateRequest, calculationTermSelectRequest, edges, lastRun, nodes, onCreateSourceForInput, onExecuteStep, selectedCalculationTermId, side }) {
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [largeGroupId, setLargeGroupId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const tool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$tool$2d$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getToolForBlock"])(block);
    const latestOutput = getLatestToolOutput({
        blockId: block.id,
        lastRun
    });
    const incomingEdges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>edges.filter((edge)=>edge.target === block.id), [
        block.id,
        edges
    ]);
    const outgoingEdges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>edges.filter((edge)=>edge.source === block.id), [
        block.id,
        edges
    ]);
    const isSourceArtifactPane = block.family === "Source" && side === "inputs";
    const isRulebookArtifactPane = isSourceArtifactPane && getSourceArtifactKind(block) === "rules";
    const displaySide = isSourceArtifactPane ? "source" : side;
    let title = "Outputs";
    if (isSourceArtifactPane) {
        title = getSourcePaneTitle(block);
    } else if (side === "inputs") {
        title = "Inputs";
    }
    const groups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (isSourceArtifactPane) {
            return createSourceArtifactGroups({
                block,
                lastRun
            });
        }
        if (!tool) {
            const connectedEdges = side === "inputs" ? incomingEdges : outgoingEdges;
            return connectedEdges.map((edge)=>({
                    connectedLabel: side === "inputs" ? getBlockLabel(nodes, edge.source) : getBlockLabel(nodes, edge.target),
                    hasData: false,
                    id: edge.id,
                    preview: edge.data?.workflowEdge?.bindingLabel || edge.data?.relationshipType || "Connected relationship",
                    roleId: edge.data?.workflowEdge?.targetInputRole || "relationship",
                    roleLabel: side === "inputs" ? getBlockLabel(nodes, edge.source) : getBlockLabel(nodes, edge.target),
                    status: "warning",
                    statusLabel: "relationship"
                }));
        }
        return side === "inputs" ? createInputGroups({
            block,
            incomingEdges,
            lastRun,
            nodes,
            onCreateSourceForInput,
            tool
        }) : createOutputGroups({
            block,
            lastRun,
            latestOutput,
            nodes,
            outgoingEdges,
            tool
        });
    }, [
        block,
        incomingEdges,
        isSourceArtifactPane,
        lastRun,
        latestOutput,
        nodes,
        onCreateSourceForInput,
        outgoingEdges,
        side,
        tool
    ]);
    const filteredGroups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const query = search.trim().toLowerCase();
        if (!query) {
            return groups;
        }
        return groups.filter((group)=>[
                group.roleLabel,
                group.roleId,
                group.connectedLabel,
                group.outputType,
                group.preview
            ].filter(Boolean).join(" ").toLowerCase().includes(query));
    }, [
        groups,
        search
    ]);
    const groupedCalculationInputs = side === "inputs" && isCalculationEngineBlock(block) ? getGroupedCalculationInputTerms({
        block,
        groups
    }) : undefined;
    const calculationInputTerms = groupedCalculationInputs ? {
        createdTerms: groupedCalculationInputs.createdTerms,
        dataTerms: []
    } : undefined;
    const isCalculationInputPane = Boolean(calculationInputTerms);
    const largeGroup = groups.find((group)=>group.id === largeGroupId);
    const filterGroupKind = side === "inputs" ? "input" : "output";
    const emptyFilteredMessage = tool ? `No ${filterGroupKind} groups match this filter.` : "No typed tool roles are registered for this block yet.";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "flex min-h-0 flex-col gap-3 overflow-hidden bg-card/50 p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DataFlowPaneHeader, {
                description: isSourceArtifactPane ? getSourcePaneDescription(block) : undefined,
                side: displaySide,
                title: title
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                lineNumber: 2011,
                columnNumber: 7
            }, this),
            isSourceArtifactPane && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-md border bg-background/70 p-2 text-muted-foreground text-xs",
                children: isRulebookArtifactPane ? "Rulebooks are editable in draft and versioned after use or publish." : "Source evidence is view-only after use or publish. Corrections should be modeled downstream in Logic."
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                lineNumber: 2019,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                className: "h-8 bg-background/70 text-xs",
                onChange: (event)=>setSearch(event.target.value),
                placeholder: `Search ${displaySide === "source" ? "source" : side}`,
                value: search
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                lineNumber: 2025,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1",
                children: [
                    isCalculationInputPane && groupedCalculationInputs ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-semibold text-[9px] text-muted-foreground uppercase tracking-widest",
                                children: "Incoming data"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 2034,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CalculationIncomingDataSection, {
                                disabled: calculationInsertDisabled,
                                groupedDataTerms: groupedCalculationInputs.groupedDataTerms,
                                onInsertTerm: calculationInsertRequest
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 2037,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1.5",
                        children: filteredGroups.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-md border bg-background/70 p-3 text-muted-foreground text-xs",
                            children: emptyFilteredMessage
                        }, void 0, false, {
                            fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                            lineNumber: 2046,
                            columnNumber: 15
                        }, this) : filteredGroups.map((group, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(OutputRoleCard, {
                                group: group,
                                initiallyExpanded: index === 0,
                                onCreateSourceForInput: onCreateSourceForInput,
                                onExecuteStep: onExecuteStep,
                                onOpenLarge: ()=>setLargeGroupId(group.id),
                                side: displaySide
                            }, group.id, false, {
                                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                                lineNumber: 2051,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 2044,
                        columnNumber: 11
                    }, this),
                    calculationInputTerms && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CalculationTermsInputPanel, {
                        createdTerms: calculationInputTerms.createdTerms,
                        dataTerms: calculationInputTerms.dataTerms,
                        disabled: calculationInsertDisabled,
                        onCreateTerm: calculationTermCreateRequest,
                        onInsertTerm: calculationInsertRequest,
                        onSelectTerm: calculationTermSelectRequest,
                        selectedTermId: selectedCalculationTermId
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                        lineNumber: 2067,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                lineNumber: 2031,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DataFlowLargeViewer, {
                group: largeGroup,
                onOpenChange: (open)=>{
                    if (!open) {
                        setLargeGroupId(null);
                    }
                },
                open: Boolean(largeGroupId),
                side: displaySide
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
                lineNumber: 2078,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx",
        lineNumber: 2010,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/workflow-builder/ui/workspace/latest-local-run.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getLatestLocalRunForBlock",
    ()=>getLatestLocalRunForBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/shared/workflow-engine/local-fiscal-workflow.ts [app-ssr] (ecmascript) <locals>");
;
function createRunRecordFromExecutionLogs({ executionId, executionLogs, workflowId }) {
    const entries = Object.values(executionLogs);
    if (!(executionId && entries.length > 0)) {
        return;
    }
    const now = new Date();
    const hasRunningStep = entries.some((entry)=>entry.status === "pending" || entry.status === "running");
    const hasError = entries.some((entry)=>entry.status === "error");
    let executionStatus = "success";
    if (hasError) {
        executionStatus = "error";
    } else if (hasRunningStep) {
        executionStatus = "running";
    }
    return {
        execution: {
            completedAt: hasRunningStep ? null : now,
            duration: null,
            error: hasError ? "One or more local workflow steps failed." : null,
            id: executionId,
            startedAt: now,
            status: executionStatus,
            workflowId: workflowId || __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LOCAL_WORKFLOW_ID"]
        },
        logs: entries.map((entry, index)=>({
                completedAt: entry.status === "running" ? null : now,
                duration: null,
                error: entry.status === "error" ? "Local step failed." : null,
                executionId,
                id: `${executionId}-${entry.nodeId}-${index}`,
                input: undefined,
                nodeId: entry.nodeId,
                nodeName: entry.nodeName,
                nodeType: entry.nodeType,
                output: entry.output,
                startedAt: now,
                status: entry.status
            }))
    };
}
function getLatestLocalRunForBlock({ blockId, executionLogs, selectedExecutionId, storedRecords, workflowId }) {
    const inMemoryRecord = createRunRecordFromExecutionLogs({
        executionId: selectedExecutionId,
        executionLogs,
        workflowId
    });
    if (inMemoryRecord?.logs.some((log)=>log.nodeId === blockId)) {
        return inMemoryRecord;
    }
    const selectedStoredRecord = selectedExecutionId ? storedRecords.find((record)=>record.execution.id === selectedExecutionId && record.logs.some((log)=>log.nodeId === blockId)) : undefined;
    return selectedStoredRecord || storedRecords.find((record)=>record.logs.some((log)=>log.nodeId === blockId));
}
}),
"[project]/features/workflow-builder/ui/workspace/workspace-pane-sizing.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkspaceResizeHandle",
    ()=>WorkspaceResizeHandle,
    "getWorkspaceGridColumns",
    ()=>getWorkspaceGridColumns,
    "useWorkspacePaneSizing",
    ()=>useWorkspacePaneSizing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/grip-vertical.js [app-ssr] (ecmascript) <export default as GripVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const WORKSPACE_PANE_WIDTHS_STORAGE_KEY = "workflow-studio.block-workspace-pane-widths";
const DEFAULT_WORKSPACE_PANE_WIDTHS = {
    center: 34,
    input: 33,
    output: 33
};
const MIN_WORKSPACE_PANE_WIDTHS = {
    center: 24,
    input: 18,
    output: 18
};
function normalizeWorkspacePaneWidths(value) {
    const input = typeof value?.input === "number" && Number.isFinite(value.input) ? value.input : DEFAULT_WORKSPACE_PANE_WIDTHS.input;
    const center = typeof value?.center === "number" && Number.isFinite(value.center) ? value.center : DEFAULT_WORKSPACE_PANE_WIDTHS.center;
    const output = typeof value?.output === "number" && Number.isFinite(value.output) ? value.output : DEFAULT_WORKSPACE_PANE_WIDTHS.output;
    const total = input + center + output || 100;
    return {
        center: Math.max(MIN_WORKSPACE_PANE_WIDTHS.center, center / total * 100),
        input: Math.max(MIN_WORKSPACE_PANE_WIDTHS.input, input / total * 100),
        output: Math.max(MIN_WORKSPACE_PANE_WIDTHS.output, output / total * 100)
    };
}
function getInitialWorkspacePaneWidths() {
    if ("TURBOPACK compile-time truthy", 1) {
        return DEFAULT_WORKSPACE_PANE_WIDTHS;
    }
    //TURBOPACK unreachable
    ;
}
function getWorkspaceGridColumns(widths) {
    return `minmax(220px, ${widths.input}fr) 10px minmax(280px, ${widths.center}fr) 10px minmax(220px, ${widths.output}fr)`;
}
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
function resizeWorkspacePaneWidths({ deltaPercent, divider, widths }) {
    if (divider === "input-center") {
        const pairTotal = widths.input + widths.center;
        const input = clamp(widths.input + deltaPercent, MIN_WORKSPACE_PANE_WIDTHS.input, pairTotal - MIN_WORKSPACE_PANE_WIDTHS.center);
        return {
            center: pairTotal - input,
            input,
            output: widths.output
        };
    }
    const pairTotal = widths.center + widths.output;
    const center = clamp(widths.center + deltaPercent, MIN_WORKSPACE_PANE_WIDTHS.center, pairTotal - MIN_WORKSPACE_PANE_WIDTHS.output);
    return {
        center,
        input: widths.input,
        output: pairTotal - center
    };
}
function useWorkspacePaneSizing() {
    const [workspacePaneWidths, setWorkspacePaneWidths] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(getInitialWorkspacePaneWidths);
    const workspaceGridRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        window.localStorage.setItem(WORKSPACE_PANE_WIDTHS_STORAGE_KEY, JSON.stringify(workspacePaneWidths));
    }, [
        workspacePaneWidths
    ]);
    const handleWorkspaceResizeStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((divider, event)=>{
        event.preventDefault();
        const grid = workspaceGridRef.current;
        if (!grid) {
            return;
        }
        const startX = event.clientX;
        const startWidths = workspacePaneWidths;
        const gridWidth = grid.getBoundingClientRect().width;
        const handlePointerMove = (moveEvent)=>{
            const deltaPercent = (moveEvent.clientX - startX) / Math.max(gridWidth, 1) * 100;
            setWorkspacePaneWidths(resizeWorkspacePaneWidths({
                deltaPercent,
                divider,
                widths: startWidths
            }));
        };
        const handlePointerUp = ()=>{
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
    }, [
        workspacePaneWidths
    ]);
    return {
        handleWorkspaceResizeStart,
        workspaceGridRef,
        workspacePaneWidths
    };
}
function WorkspaceResizeHandle({ label, onPointerDown }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        "aria-label": label,
        className: "group flex h-full cursor-col-resize items-center justify-center bg-border/60 outline-none transition-colors hover:bg-primary/30 focus-visible:ring-2 focus-visible:ring-ring",
        onPointerDown: onPointerDown,
        title: label,
        type: "button",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "flex h-10 w-4 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition-colors group-hover:text-foreground",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__["GripVertical"], {
                className: "size-3"
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/workspace/workspace-pane-sizing.tsx",
                lineNumber: 187,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/workflow-builder/ui/workspace/workspace-pane-sizing.tsx",
            lineNumber: 186,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/workflow-builder/ui/workspace/workspace-pane-sizing.tsx",
        lineNumber: 179,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=features_workflow-builder_ui_workspace_b96bbcdd._.js.map