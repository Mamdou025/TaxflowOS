(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/shared/workflow-engine/local-fiscal-workflow.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BLOCK_FAMILY_STAGE",
    ()=>BLOCK_FAMILY_STAGE,
    "CANDIDATE_OUTPUT_RELATIONSHIP_TYPES",
    ()=>CANDIDATE_OUTPUT_RELATIONSHIP_TYPES,
    "EDGE_BINDING_STATUS_VALUES",
    ()=>EDGE_BINDING_STATUS_VALUES,
    "EDGE_STATUS_VALUES",
    ()=>EDGE_STATUS_VALUES,
    "FISCAL_STAGE_OPTIONS",
    ()=>FISCAL_STAGE_OPTIONS,
    "GOVERNED_OUTPUT_RELATIONSHIP_TYPES",
    ()=>GOVERNED_OUTPUT_RELATIONSHIP_TYPES,
    "LOCAL_RUNS_STORAGE_KEY",
    ()=>LOCAL_RUNS_STORAGE_KEY,
    "LOCAL_SAMPLE_DATASET",
    ()=>LOCAL_SAMPLE_DATASET,
    "LOCAL_WORKFLOW_ID",
    ()=>LOCAL_WORKFLOW_ID,
    "LOCAL_WORKFLOW_SCHEMA_VERSION",
    ()=>LOCAL_WORKFLOW_SCHEMA_VERSION,
    "LOCAL_WORKFLOW_STORAGE_KEY",
    ()=>LOCAL_WORKFLOW_STORAGE_KEY,
    "LOGIC_OUTPUT_GOVERNANCE_WARNING",
    ()=>LOGIC_OUTPUT_GOVERNANCE_WARNING,
    "OUTPUT_MAPPING_RELATIONSHIP_TYPES",
    ()=>OUTPUT_MAPPING_RELATIONSHIP_TYPES,
    "WORKFLOW_RELATIONSHIP_LABELS",
    ()=>WORKFLOW_RELATIONSHIP_LABELS,
    "WORKFLOW_RELATIONSHIP_TYPES",
    ()=>WORKFLOW_RELATIONSHIP_TYPES,
    "clearLocalRunRecords",
    ()=>clearLocalRunRecords,
    "createBlankWorkflow",
    ()=>createBlankWorkflow,
    "createCampaignBudgetWorkflow",
    ()=>createCampaignBudgetWorkflow,
    "createCanvasEdgeFromWorkflowEdge",
    ()=>createCanvasEdgeFromWorkflowEdge,
    "createDefaultWorkflowBlockCandidate",
    ()=>createDefaultWorkflowBlockCandidate,
    "createExpandedMappingPipelineDemoWorkflow",
    ()=>createExpandedMappingPipelineDemoWorkflow,
    "createExpenseReimbursementWorkflow",
    ()=>createExpenseReimbursementWorkflow,
    "createFapiSampleWorkflow",
    ()=>createFapiSampleWorkflow,
    "createFapiTemplateWorkflow",
    ()=>createFapiTemplateWorkflow,
    "createLocalRunRecord",
    ()=>createLocalRunRecord,
    "createPendingWorkflowConnection",
    ()=>createPendingWorkflowConnection,
    "createPortfolioWorkflow",
    ()=>createPortfolioWorkflow,
    "createPortfolioWorkflowById",
    ()=>createPortfolioWorkflowById,
    "createRoullementFiscalWorkflow",
    ()=>createRoullementFiscalWorkflow,
    "createSingleItemPipelineDemoWorkflow",
    ()=>createSingleItemPipelineDemoWorkflow,
    "createSplitWorkflowEdgeRecords",
    ()=>createSplitWorkflowEdgeRecords,
    "createWorkflowBlockFromCatalog",
    ()=>createWorkflowBlockFromCatalog,
    "createWorkflowDefinitionFromCanvas",
    ()=>createWorkflowDefinitionFromCanvas,
    "createWorkflowEdgeRecord",
    ()=>createWorkflowEdgeRecord,
    "createWorkflowEvent",
    ()=>createWorkflowEvent,
    "createWorkflowNodeFromBlock",
    ()=>createWorkflowNodeFromBlock,
    "createWorkingSourceRulesDemoWorkflow",
    ()=>createWorkingSourceRulesDemoWorkflow,
    "generateOutputMappingPreview",
    ()=>generateOutputMappingPreview,
    "generateRuntimeUiConfig",
    ()=>generateRuntimeUiConfig,
    "getAllowedWorkflowRelationshipTypes",
    ()=>getAllowedWorkflowRelationshipTypes,
    "getBlockCatalogItem",
    ()=>getBlockCatalogItem,
    "getBlockCatalogItemBySubtype",
    ()=>getBlockCatalogItemBySubtype,
    "getDefaultWorkflowRelationshipType",
    ()=>getDefaultWorkflowRelationshipType,
    "getFamilyForStage",
    ()=>getFamilyForStage,
    "getFiscalPreset",
    ()=>getFiscalPreset,
    "getFiscalStageLabel",
    ()=>getFiscalStageLabel,
    "getFiscalVisualForFamily",
    ()=>getFiscalVisualForFamily,
    "getFiscalVisualForStage",
    ()=>getFiscalVisualForStage,
    "getPendingWorkflowConnection",
    ()=>getPendingWorkflowConnection,
    "getUnsupportedWorkflowRelationshipMessage",
    ()=>getUnsupportedWorkflowRelationshipMessage,
    "getWorkflowEdgeDefaults",
    ()=>getWorkflowEdgeDefaults,
    "getWorkflowRelationshipForValue",
    ()=>getWorkflowRelationshipForValue,
    "isCandidateOutputRelationshipType",
    ()=>isCandidateOutputRelationshipType,
    "isGovernedOutputRelationshipType",
    ()=>isGovernedOutputRelationshipType,
    "isLocalRunExecutionId",
    ()=>isLocalRunExecutionId,
    "isLocalWorkflowId",
    ()=>isLocalWorkflowId,
    "isOutputMappingRelationshipType",
    ()=>isOutputMappingRelationshipType,
    "loadLocalRunRecords",
    ()=>loadLocalRunRecords,
    "loadLocalWorkflowSnapshot",
    ()=>loadLocalWorkflowSnapshot,
    "loadLocalWorkflowSnapshotResult",
    ()=>loadLocalWorkflowSnapshotResult,
    "parseLocalWorkflowJson",
    ()=>parseLocalWorkflowJson,
    "publishLocalWorkflowSnapshot",
    ()=>publishLocalWorkflowSnapshot,
    "publishWorkflowDefinition",
    ()=>publishWorkflowDefinition,
    "saveLocalRunRecord",
    ()=>saveLocalRunRecord,
    "saveLocalWorkflowSnapshot",
    ()=>saveLocalWorkflowSnapshot,
    "saveWorkflowDefinitionSnapshot",
    ()=>saveWorkflowDefinitionSnapshot,
    "updateWorkflowEdgeRecord",
    ()=>updateWorkflowEdgeRecord,
    "workflowDefinitionToCanvas",
    ()=>workflowDefinitionToCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$block$2d$catalog$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/block-catalog-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$block$2d$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/domain/workflow/block-catalog.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$edge$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/domain/workflow/edge-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$protected$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/domain/workflow/protected-rules.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$workflow$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/domain/workflow/workflow-rules.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$workflow$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/domain/workflow/workflow-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$expanded$2d$mapping$2d$pipeline$2d$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/templates/sample-workflows/expanded-mapping-pipeline-demo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$working$2d$source$2d$rules$2d$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/templates/sample-workflows/working-source-rules-demo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$fapi$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/templates/sample-workflows/fapi-template.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$roulement$2d$fiscal$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/templates/sample-workflows/roulement-fiscal-template.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$expense$2d$reimbursement$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/templates/sample-workflows/expense-reimbursement-template.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$campaign$2d$budget$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/templates/sample-workflows/campaign-budget-template.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$portfolio$2f$portfolio$2d$workflows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/templates/portfolio/portfolio-workflows.ts [app-client] (ecmascript)");
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
const BLOCK_FAMILY_STAGE = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$block$2d$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BLOCK_FAMILY_STAGE"];
const FISCAL_STAGE_OPTIONS = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$block$2d$catalog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FISCAL_STAGE_OPTIONS"];
const CANDIDATE_OUTPUT_RELATIONSHIP_TYPES = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$edge$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CANDIDATE_OUTPUT_RELATIONSHIP_TYPES"];
const EDGE_BINDING_STATUS_VALUES = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$edge$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EDGE_BINDING_STATUS_VALUES"];
const EDGE_STATUS_VALUES = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$edge$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EDGE_STATUS_VALUES"];
const GOVERNED_OUTPUT_RELATIONSHIP_TYPES = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$edge$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GOVERNED_OUTPUT_RELATIONSHIP_TYPES"];
const OUTPUT_MAPPING_RELATIONSHIP_TYPES = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$edge$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OUTPUT_MAPPING_RELATIONSHIP_TYPES"];
const WORKFLOW_RELATIONSHIP_LABELS = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$edge$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORKFLOW_RELATIONSHIP_LABELS"];
const WORKFLOW_RELATIONSHIP_TYPES = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$edge$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORKFLOW_RELATIONSHIP_TYPES"];
const isCandidateOutputRelationshipType = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$edge$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCandidateOutputRelationshipType"];
const isGovernedOutputRelationshipType = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$edge$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isGovernedOutputRelationshipType"];
const isOutputMappingRelationshipType = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$edge$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOutputMappingRelationshipType"];
const LOGIC_OUTPUT_GOVERNANCE_WARNING = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$workflow$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOGIC_OUTPUT_GOVERNANCE_WARNING"];
const AI_PROPOSAL_STATUS_VALUES = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$workflow$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AI_PROPOSAL_STATUS_VALUES"];
const WORKFLOW_EVENT_TYPES = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$workflow$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORKFLOW_EVENT_TYPES"];
const LOCAL_WORKFLOW_ID = "local-fiscal-studio";
const LOCAL_WORKFLOW_STORAGE_KEY = "workflow-studio.local-workflow";
const LOCAL_RUNS_STORAGE_KEY = "workflow-studio.local-runs";
const LOCAL_WORKFLOW_SCHEMA_VERSION = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$workflow$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORKFLOW_SCHEMA_VERSION"];
const SYSTEM_USER = "workflow-studio";
const SAMPLE_CREATED_AT = "2026-04-28T12:00:00.000Z";
;
const LOCAL_SAMPLE_DATASET = {
    period: "FY2025 Q4",
    entity: "FAPI Sample Entity",
    sourceDocuments: [
        "trial-balance.xlsx",
        "financial-statements.pdf",
        "notes-to-financial-statements.pdf",
        "fx-rate-source.json",
        "review-overrides.json"
    ],
    rows: [
        {
            jurisdiction: "Canada",
            revenue: 1_280_000,
            deductibleExpenses: 740_000,
            protectedInput: false,
            taxAttribute: "foreign accrual property income"
        },
        {
            jurisdiction: "United States",
            revenue: 840_000,
            deductibleExpenses: 510_000,
            protectedInput: false,
            taxAttribute: "interest allocation"
        },
        {
            jurisdiction: "United Kingdom",
            revenue: 610_000,
            deductibleExpenses: 455_000,
            protectedInput: true,
            taxAttribute: "withholding reserve"
        }
    ]
};
const FISCAL_PRESETS = {
    "preset:source": {
        label: "Source: Reference Evidence",
        description: "Immutable reference set for a fiscal workflow",
        visualLevel: "L3",
        visualRole: "source",
        config: {
            fiscalStage: "source",
            blockFamily: "Source",
            blockSubtype: "Excel / Workbook",
            catalogId: "source:excel-workbook",
            owner: "Tax Operations",
            rulebookRef: "Source records are read-only reference truth.",
            inputs: "source package",
            outputs: "sourceEvidence"
        }
    },
    "preset:logic": {
        label: "Logic: Transform Values",
        description: "Classify, transform, calculate, or derive values",
        visualLevel: "L2",
        visualRole: "logic",
        config: {
            fiscalStage: "logic",
            blockFamily: "Logic",
            blockSubtype: "Transformation",
            catalogId: "logic:transformation",
            owner: "Fiscal Systems",
            rulebookRef: "Logic transforms and derives values from source records.",
            inputs: "sourceEvidence",
            outputs: "derivedValues"
        }
    },
    "preset:review-validation": {
        label: "Review / Validation: Trust Checks",
        description: "Check completeness, thresholds, and review evidence",
        visualLevel: "L2",
        visualRole: "validation",
        config: {
            fiscalStage: "validation",
            blockFamily: "Review / Validation",
            blockSubtype: "Output Readiness Check",
            catalogId: "review:output-readiness-check",
            owner: "Tax Review",
            rulebookRef: "Validation gates decide whether results are trustworthy.",
            inputs: "derivedValues",
            outputs: "reviewFindings"
        }
    },
    "preset:protected": {
        label: "Protected: Governed Value",
        description: "Hold governed inputs, official lines, or result sets",
        visualLevel: "L2",
        visualRole: "protected",
        config: {
            fiscalStage: "protected",
            blockFamily: "Field",
            blockSubtype: "Protected Result",
            catalogId: "protected:protected-result",
            owner: "Data Steward",
            rulebookRef: "Protected blocks contain governed inputs or results.",
            inputs: "reviewFindings",
            outputs: "protectedValue"
        }
    },
    "preset:output": {
        label: "Output: Review Artifact",
        description: "Create handoff artifacts for downstream teams",
        visualLevel: "L2",
        visualRole: "output",
        config: {
            fiscalStage: "output",
            blockFamily: "Output",
            blockSubtype: "Evidence Pack",
            catalogId: "output:evidence-pack",
            owner: "Tax Delivery",
            rulebookRef: "Outputs generate handoff or export artifacts.",
            inputs: "approvedProtectedPacket",
            outputs: "reviewPacket"
        }
    }
};
const BLOCK_SUBTYPE_SET = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$block$2d$catalog$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BLOCK_CATALOG"].map((item)=>item.subtype));
function isLocalWorkflowId(workflowId) {
    return workflowId === LOCAL_WORKFLOW_ID;
}
function getFiscalPreset(presetId) {
    return FISCAL_PRESETS[presetId];
}
function getBlockCatalogItem(catalogId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$block$2d$catalog$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BLOCK_CATALOG"].find((item)=>item.id === catalogId);
}
function getBlockCatalogItemBySubtype(subtype) {
    if (!subtype) {
        return;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$block$2d$catalog$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BLOCK_CATALOG"].find((item)=>item.subtype === subtype);
}
function getFiscalVisualForFamily(family) {
    if (family === "Source") {
        return {
            visualLevel: "L3",
            visualRole: "source"
        };
    }
    if (family === "Review / Validation") {
        return {
            visualLevel: "L2",
            visualRole: "validation"
        };
    }
    if (family === "Field") {
        return {
            visualLevel: "L2",
            visualRole: "field"
        };
    }
    if (family === "Output") {
        return {
            visualLevel: "L2",
            visualRole: "output"
        };
    }
    return {
        visualLevel: "L2",
        visualRole: "logic"
    };
}
function getFiscalVisualForStage(stage) {
    const option = FISCAL_STAGE_OPTIONS.find((item)=>item.stage === stage);
    return getFiscalVisualForFamily(option?.family || "Logic");
}
function getFiscalStageLabel(stage) {
    if (stage === "review") {
        return "Review / Validation";
    }
    const option = FISCAL_STAGE_OPTIONS.find((item)=>item.stage === stage);
    return option?.label || "Fiscal Block";
}
function getFamilyForStage(stage) {
    const option = FISCAL_STAGE_OPTIONS.find((item)=>item.stage === stage);
    return option?.family || "Logic";
}
function isBlockSubtype(value) {
    return Boolean(value && BLOCK_SUBTYPE_SET.has(value));
}
function getSubtypeFromValue(value, fallback) {
    return isBlockSubtype(value) ? value : fallback;
}
function getDefaultCatalogItemForFamily(family) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$block$2d$catalog$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BLOCK_CATALOG"].find((item)=>item.family === family) || __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$block$2d$catalog$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BLOCK_CATALOG"][0];
}
function getProtectedKind(subtype) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$protected$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProtectedKindForSubtype"])(subtype);
}
function getRuntimeDefaults(family, outputKey) {
    return {
        visible: true,
        editableInRuntime: false,
        generatedUiLocked: family === "Source",
        masked: false,
        showInRuns: true,
        outputKey
    };
}
function getSourceMetadata(item, config) {
    if (item.family !== "Source") {
        return;
    }
    return {
        sourceType: item.subtype,
        locator: String(config.sourceLocator || item.defaultConfig.sourceLocator),
        valuePreview: typeof config.valuePreview === "string" ? config.valuePreview : undefined,
        immutable: true,
        treatedAsEvidence: true,
        labelLocked: true,
        locatorLocked: true,
        valuesLocked: true
    };
}
function getGovernanceMetadata(_item, _config) {
    return undefined;
}
function getFormulaForSubtype(subtype, config) {
    if (subtype !== "Formula") {
        return;
    }
    return {
        expression: String(config.formula || "upstreamValue"),
        outputKey: String(config.outputs || "formulaResult"),
        inputs: String(config.inputs || "upstreamValue").split(",").map((item)=>item.trim()).filter(Boolean)
    };
}
function getCodeForSubtype(subtype, config) {
    if (subtype !== "Script" && subtype !== "Condition") {
        return;
    }
    return {
        language: "typescript",
        body: String(config.code || (subtype === "Condition" ? "return Boolean(input.ready);" : "return input;")),
        entrypoint: subtype === "Condition" ? "evaluateCondition" : "runScript"
    };
}
function createWorkflowBlockFromCatalog(catalogId, options = {}) {
    const item = getBlockCatalogItem(catalogId) || getDefaultCatalogItemForFamily("Logic");
    const stage = BLOCK_FAMILY_STAGE[item.family];
    const config = {
        ...item.defaultConfig,
        ...options.config,
        fiscalStage: stage,
        blockFamily: item.family,
        blockSubtype: item.subtype,
        catalogId: item.id
    };
    const outputKey = String(config.outputs || item.defaultConfig.outputs);
    return {
        id: options.id || item.id.replace(":", "-"),
        family: item.family,
        subtype: item.subtype,
        label: options.label || item.label,
        description: options.description || item.description,
        status: options.status || "configured",
        position: options.position || {
            x: 0,
            y: 0
        },
        config,
        code: getCodeForSubtype(item.subtype, config),
        formula: getFormulaForSubtype(item.subtype, config),
        source: getSourceMetadata(item, config),
        governance: getGovernanceMetadata(item, config),
        runtime: getRuntimeDefaults(item.family, outputKey),
        catalogId: item.id,
        sample: options.sample,
        createdBy: options.createdBy || SYSTEM_USER,
        createdAt: options.createdAt || new Date().toISOString(),
        updatedBy: options.updatedBy || options.createdBy || SYSTEM_USER,
        updatedAt: options.updatedAt || new Date().toISOString()
    };
}
function createWorkflowNodeFromBlock(block, options = {}) {
    const visual = getFiscalVisualForFamily(block.family);
    const nodeType = options.type || (block.config.canvasNodeType ?? "action");
    return {
        id: block.id,
        type: nodeType,
        position: block.position,
        selected: options.selected,
        data: {
            label: block.label,
            description: block.description,
            type: nodeType,
            visualLevel: visual.visualLevel,
            visualRole: visual.visualRole,
            config: block.config,
            status: block.status === "running" ? "running" : "idle",
            block
        }
    };
}
function createDefaultWorkflowBlockCandidate({ id, pendingConnection, position }) {
    return {
        id,
        type: "action",
        position,
        data: {
            label: "New Block",
            description: "Choose a typed block from the catalog",
            type: "action",
            config: {
                blockCandidate: true,
                pendingConnection
            },
            status: "idle"
        },
        selected: true
    };
}
function createPendingWorkflowConnection({ sourceBlockId, sourceHandle, targetBlockId, targetHandle }) {
    return {
        sourceBlockId,
        targetBlockId,
        sourceHandle,
        targetHandle,
        createdAt: new Date().toISOString()
    };
}
function getPendingWorkflowConnection(value) {
    if (!(typeof value === "object" && value !== null)) {
        return null;
    }
    const pending = value;
    if (typeof pending.sourceBlockId !== "string" || typeof pending.targetBlockId !== "string" || typeof pending.createdAt !== "string") {
        return null;
    }
    return {
        sourceBlockId: pending.sourceBlockId,
        targetBlockId: pending.targetBlockId,
        sourceHandle: typeof pending.sourceHandle === "string" ? pending.sourceHandle : null,
        targetHandle: typeof pending.targetHandle === "string" ? pending.targetHandle : null,
        createdAt: pending.createdAt
    };
}
function isWorkflowRelationshipType(value) {
    return typeof value === "string" && WORKFLOW_RELATIONSHIP_TYPES.includes(value);
}
function getEdgeStatusFromValue(value) {
    return EDGE_STATUS_VALUES.includes(value) ? value : "active";
}
function getEdgeBindingStatusFromValue(value) {
    return EDGE_BINDING_STATUS_VALUES.includes(value) ? value : "missing";
}
function getAiProposalStatusFromValue(value) {
    return AI_PROPOSAL_STATUS_VALUES.includes(value) ? value : "proposed";
}
function getAllowedWorkflowRelationshipTypes(sourceFamily, targetFamily) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$workflow$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAllowedRelationshipTypesForFamilies"])(sourceFamily, targetFamily);
}
function getDefaultLogicRelationshipType(targetBlock) {
    if (targetBlock.family === "Logic") {
        if (targetBlock.subtype === "Aggregation" || targetBlock.subtype === "Hierarchy Aggregator") {
            return "aggregates_into";
        }
        if (targetBlock.subtype === "Condition") {
            return "branches_to";
        }
        return "transforms_into";
    }
    if (targetBlock.family === "Field") {
        return "provides_data_to";
    }
    return targetBlock.family === "Output" ? "feeds_output_input" : null;
}
function getDefaultWorkflowRelationshipType({ sourceBlock, targetBlock }) {
    if (sourceBlock.family === "AI / Agent") {
        return "proposes";
    }
    if (targetBlock.family === "AI / Agent") {
        return sourceBlock.family === "Logic" ? "feeds_ai_context" : "provides_context_to_ai";
    }
    if (sourceBlock.family === "Logic") {
        return getDefaultLogicRelationshipType(targetBlock) || getAllowedWorkflowRelationshipTypes(sourceBlock.family, targetBlock.family)[0] || null;
    }
    return getAllowedWorkflowRelationshipTypes(sourceBlock.family, targetBlock.family)[0] || null;
}
function getWorkflowRelationshipForValue({ sourceBlock, targetBlock, value }) {
    if (isWorkflowRelationshipType(value)) {
        return value;
    }
    const defaultType = sourceBlock && targetBlock ? getDefaultWorkflowRelationshipType({
        sourceBlock,
        targetBlock
    }) : null;
    if (defaultType) {
        return defaultType;
    }
    switch(value){
        case "feeds":
            return "provides_data_to";
        case "supports":
            return "referenced_by";
        case "validates":
            return "checked_by";
        case "routes":
            return "branches_to";
        case "protects":
            return "approves_for";
        case "summarizes":
            return "depends_on";
        case "feeds_output":
        case "output_preview":
            return "feeds_output_input";
        case "ai_context":
            return "feeds_ai_context";
        case "exports":
            return "maps_to_output";
        case "proposes":
            return "proposes";
        default:
            return "provides_data_to";
    }
}
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Binding defaults mirror the compact v1 workflow rulebook.
function getDefaultBindingRoles({ sourceBlock, targetBlock }) {
    if (targetBlock.config.toolId === "logic.keyword_mapper" || targetBlock.subtype === "Classification / Mapping") {
        if (sourceBlock.config.sourceKind === "keyword_rules") {
            return {
                bindingLabel: "Keyword rules",
                bindingStatus: "valid",
                sourceOutputRole: "keyword_rules",
                targetInputRole: "keyword_rules"
            };
        }
        return {
            bindingLabel: "Data rows",
            bindingStatus: "valid",
            sourceOutputRole: sourceBlock.family === "Logic" ? "mapped_rows" : "selected_rows",
            targetInputRole: "data_rows"
        };
    }
    if (targetBlock.subtype === "Aggregation") {
        return {
            bindingLabel: "Mapped rows",
            bindingStatus: "valid",
            sourceOutputRole: "mapped_rows",
            targetInputRole: "mapped_rows"
        };
    }
    if (targetBlock.subtype === "Hierarchy Aggregator" || targetBlock.config.toolId === "logic.hierarchy_aggregator") {
        if (sourceBlock.config.sourceKind === "aggregation_rules") {
            return {
                bindingLabel: "Aggregation rules",
                bindingStatus: "valid",
                sourceOutputRole: "aggregation_rules",
                targetInputRole: "aggregation_rules"
            };
        }
        return {
            bindingLabel: "Mapped rows",
            bindingStatus: "valid",
            sourceOutputRole: "mapped_rows",
            targetInputRole: "mapped_rows"
        };
    }
    if (targetBlock.subtype === "Category Rollup Aggregator" || targetBlock.config.toolId === "logic.category_rollup_aggregator") {
        if (sourceBlock.config.sourceKind === "rollup_rules") {
            return {
                bindingLabel: "Rollup rules",
                bindingStatus: "valid",
                sourceOutputRole: "rollup_rules",
                targetInputRole: "rollup_rules"
            };
        }
        return {
            bindingLabel: "Mapped rows",
            bindingStatus: "valid",
            sourceOutputRole: "mapped_rows",
            targetInputRole: "mapped_rows"
        };
    }
    if (targetBlock.subtype === "Calculation Engine" || targetBlock.config.toolId === "logic.calculation_engine") {
        if (sourceBlock.config.sourceKind === "calculation_rules") {
            return {
                bindingLabel: "Calculation rules",
                bindingStatus: "valid",
                sourceOutputRole: "calculation_rules",
                targetInputRole: "calculation_rules"
            };
        }
        return {
            bindingLabel: "Named values",
            bindingStatus: "valid",
            sourceOutputRole: "named_values",
            targetInputRole: "named_values"
        };
    }
    if (targetBlock.subtype === "Unmatched Rows Check") {
        return {
            bindingLabel: "Unmatched rows",
            bindingStatus: "valid",
            sourceOutputRole: "unmatched_rows",
            targetInputRole: "checked_items"
        };
    }
    if (targetBlock.subtype === "Low Confidence Warning") {
        return {
            bindingLabel: "Low-confidence rows",
            bindingStatus: "valid",
            sourceOutputRole: "low_confidence_rows",
            targetInputRole: "checked_items"
        };
    }
    if (targetBlock.family === "Field") {
        let sourceOutputRole = "named_values";
        if (sourceBlock.subtype === "Calculation Engine") {
            sourceOutputRole = "calculated_results";
        } else if (sourceBlock.subtype === "Hierarchy Aggregator") {
            sourceOutputRole = "final_totals";
        } else if (sourceBlock.subtype === "Category Rollup Aggregator") {
            sourceOutputRole = "rollup_totals";
        }
        return {
            bindingLabel: "Computed values",
            bindingStatus: "valid",
            sourceOutputRole,
            targetInputRole: "computed_values"
        };
    }
    if (targetBlock.family === "Output") {
        let sourceOutputRole = "mapped_rows";
        if (sourceBlock.family === "Field") {
            sourceOutputRole = "computed_values";
        } else if (sourceBlock.subtype === "Hierarchy Aggregator") {
            sourceOutputRole = "aggregation_summary";
        }
        return {
            bindingLabel: "Field values",
            bindingStatus: "valid",
            sourceOutputRole,
            targetInputRole: "field_values"
        };
    }
    if (targetBlock.family === "Review / Validation") {
        return {
            bindingLabel: "Checked items",
            bindingStatus: "warning",
            targetInputRole: "checked_items"
        };
    }
    return {
        bindingStatus: "missing"
    };
}
function getWorkflowEdgeDefaults({ sourceBlock, targetBlock }) {
    const relationshipType = getDefaultWorkflowRelationshipType({
        sourceBlock,
        targetBlock
    });
    if (!relationshipType) {
        return null;
    }
    return {
        ...getDefaultBindingRoles({
            sourceBlock,
            targetBlock
        }),
        relationshipType,
        reason: `${sourceBlock.label} ${WORKFLOW_RELATIONSHIP_LABELS[relationshipType].toLowerCase()} ${targetBlock.label}.`
    };
}
function getUnsupportedWorkflowRelationshipMessage({ sourceBlock, targetBlock }) {
    if (!(sourceBlock && targetBlock)) {
        return "Both blocks need typed workflow metadata before a relationship can be created.";
    }
    if (sourceBlock.family === "Source" && targetBlock.family !== "Logic") {
        return "Source evidence is immutable. Create downstream Logic to correct, reinterpret, or map it before connecting it to this block.";
    }
    if (targetBlock.family === "Source") {
        return "Source blocks are immutable evidence. Preserve lineage with Source to Logic relationships instead of writing relationships back into a Source.";
    }
    return `${sourceBlock.family} blocks cannot directly connect to ${targetBlock.family} blocks in the typed workflow model. Add a compatible downstream block first.`;
}
function createWorkflowEdgeRecord({ bindingLabel, bindingStatus = "valid", confidence = 1, createdAt = new Date().toISOString(), createdBy = SYSTEM_USER, id, history, notes = "", reason, relationshipType = "provides_data_to", sourceOutputRole, sourceBlockId, status = "active", targetInputRole, targetBlockId }) {
    const edgeId = id || `edge-${sourceBlockId}-${targetBlockId}`;
    return {
        id: edgeId,
        sourceBlockId,
        targetBlockId,
        relationshipType,
        reason,
        ...sourceOutputRole ? {
            sourceOutputRole
        } : {},
        ...targetInputRole ? {
            targetInputRole
        } : {},
        ...bindingLabel ? {
            bindingLabel
        } : {},
        bindingStatus,
        status,
        createdBy,
        createdAt,
        confidence,
        notes,
        history: history && history.length > 0 ? history : [
            {
                id: `${edgeId}-created`,
                action: "created",
                by: createdBy,
                at: createdAt,
                notes: reason
            }
        ]
    };
}
function updateWorkflowEdgeRecord(edge, updates, historyNote = "Relationship metadata updated.") {
    const now = new Date().toISOString();
    const nextStatus = updates.status || edge.status;
    let historyAction = "updated";
    if (nextStatus === "rejected") {
        historyAction = "rejected";
    } else if (nextStatus === "disabled") {
        historyAction = "disabled";
    }
    return {
        ...edge,
        ...updates,
        history: [
            ...edge.history,
            {
                id: `${edge.id}-history-${Date.now()}`,
                action: historyAction,
                by: SYSTEM_USER,
                at: now,
                notes: historyNote
            }
        ]
    };
}
function createSplitWorkflowEdgeRecords({ insertedBlock, originalEdge }) {
    const now = new Date().toISOString();
    const splitHistory = {
        id: `${originalEdge.id}-split-${Date.now()}`,
        action: "split",
        by: SYSTEM_USER,
        at: now,
        notes: `Split by inserting ${insertedBlock.label}. Original relationship: ${originalEdge.reason}`
    };
    const sourceToInserted = createWorkflowEdgeRecord({
        id: `${originalEdge.id}-to-${insertedBlock.id}`,
        sourceBlockId: originalEdge.sourceBlockId,
        targetBlockId: insertedBlock.id,
        relationshipType: originalEdge.relationshipType,
        reason: originalEdge.reason,
        sourceOutputRole: originalEdge.sourceOutputRole,
        bindingLabel: originalEdge.bindingLabel,
        bindingStatus: originalEdge.bindingStatus,
        status: originalEdge.status,
        confidence: originalEdge.confidence,
        notes: originalEdge.notes,
        createdAt: now,
        history: [
            ...originalEdge.history,
            splitHistory
        ]
    });
    const insertedToTarget = createWorkflowEdgeRecord({
        id: `${insertedBlock.id}-to-${originalEdge.targetBlockId}`,
        sourceBlockId: insertedBlock.id,
        targetBlockId: originalEdge.targetBlockId,
        relationshipType: "transforms_into",
        reason: `${insertedBlock.label} continues the split relationship into the original target.`,
        targetInputRole: originalEdge.targetInputRole,
        bindingLabel: originalEdge.bindingLabel,
        bindingStatus: originalEdge.bindingStatus,
        status: originalEdge.status,
        confidence: originalEdge.confidence,
        notes: originalEdge.notes,
        createdAt: now,
        history: [
            ...originalEdge.history,
            splitHistory
        ]
    });
    return [
        sourceToInserted,
        insertedToTarget
    ];
}
function createCanvasEdgeFromWorkflowEdge(edge) {
    return {
        id: edge.id,
        source: edge.sourceBlockId,
        target: edge.targetBlockId,
        type: "animated",
        data: {
            workflowEdge: edge,
            relationshipType: edge.relationshipType,
            status: edge.status,
            confidence: edge.confidence,
            sourceOutputRole: edge.sourceOutputRole,
            targetInputRole: edge.targetInputRole,
            bindingLabel: edge.bindingLabel,
            bindingStatus: edge.bindingStatus,
            label: WORKFLOW_RELATIONSHIP_LABELS[edge.relationshipType]
        }
    };
}
function workflowDefinitionToCanvas(definition) {
    const entryBlockId = definition.structure.entryBlockId || definition.blocks[0]?.id;
    return {
        nodes: definition.blocks.map((block, index)=>createWorkflowNodeFromBlock(block, {
                selected: index === 0,
                type: block.id === entryBlockId || block.config.canvasNodeType === "trigger" ? "trigger" : "action"
            })),
        edges: definition.edges.map(createCanvasEdgeFromWorkflowEdge)
    };
}
function getWorkflowStructure(blocks) {
    const columns = FISCAL_STAGE_OPTIONS.map((option)=>({
            id: option.stage,
            family: option.family,
            label: option.label,
            blockIds: blocks.filter((block)=>block.family === option.family).map((block)=>block.id)
        })).filter((column)=>column.blockIds.length > 0);
    return {
        layout: "canvas-columns",
        entryBlockId: blocks[0]?.id,
        blockOrder: blocks.map((block)=>block.id),
        columns
    };
}
function cloneJson(value) {
    return JSON.parse(JSON.stringify(value));
}
function createWorkflowEvent({ createdAt = new Date().toISOString(), createdBy = SYSTEM_USER, details, message, type }) {
    return {
        id: `event-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        message,
        createdAt,
        createdBy,
        details
    };
}
function appendWorkflowEvent(definition, event) {
    if (!event) {
        return definition.events || [];
    }
    return [
        event,
        ...definition.events || []
    ].slice(0, 50);
}
function getRuntimeAudience(block) {
    return String(block.config.runtimeAudience || block.config.visibility || "");
}
function getAllowedRuntimeActions(block) {
    if (block.family === "Source") {
        return [
            "view_source_trace",
            "create_downstream_logic"
        ];
    }
    if (block.family === "Field") {
        return [
            "view_result",
            "view_trace"
        ];
    }
    if (block.family === "Output") {
        return [
            "preview_output",
            "mock_download"
        ];
    }
    if (block.family === "Review / Validation") {
        return [
            "view_check_result",
            "mock_sign_off"
        ];
    }
    if (block.family === "AI / Agent") {
        return [
            "view_proposal"
        ];
    }
    return [
        "view_result"
    ];
}
function createRuntimeUiRow(block) {
    const audience = getRuntimeAudience(block);
    const sourceReadOnly = block.family === "Source";
    return {
        id: `runtime-row-${block.id}`,
        blockId: block.id,
        label: block.label,
        family: block.family,
        subtype: block.subtype,
        visible: block.runtime.visible,
        readOnly: sourceReadOnly || !block.runtime.editableInRuntime || block.family === "Logic",
        locked: block.runtime.generatedUiLocked,
        reviewerOnly: audience === "reviewer-only",
        advancedOnly: audience === "advanced-only",
        sourceReadOnly,
        protectedLocked: false,
        outputKey: block.runtime.outputKey,
        allowedActions: getAllowedRuntimeActions(block)
    };
}
function generateRuntimeUiConfigFromParts({ blocks, generatedAt = new Date().toISOString(), sourceSnapshotId, sourceWorkflowId, structure }) {
    const blockMap = new Map(blocks.map((block)=>[
            block.id,
            block
        ]));
    const sections = structure.columns.map((column)=>({
            id: `runtime-section-${column.id}`,
            label: column.label,
            family: column.family,
            rows: column.blockIds.map((blockId)=>blockMap.get(blockId)).filter((block)=>Boolean(block)).map(createRuntimeUiRow)
        }));
    const rows = sections.flatMap((section)=>section.rows);
    return {
        runtimeConfigId: `runtime-config-${sourceSnapshotId || sourceWorkflowId}`,
        sourceWorkflowId,
        sourceSnapshotId,
        generatedAt,
        sections,
        visibleRows: rows.filter((row)=>row.visible).map((row)=>row.blockId),
        hiddenRows: rows.filter((row)=>!row.visible).map((row)=>row.blockId),
        reviewerOnlyRows: rows.filter((row)=>row.reviewerOnly).map((row)=>row.blockId),
        advancedRows: rows.filter((row)=>row.advancedOnly).map((row)=>row.blockId),
        allowedActions: [
            "view_read_only_sources",
            "view_locked_protected_fields",
            "preview_outputs",
            "run_mock_only"
        ]
    };
}
function generateRuntimeUiConfig(definition, sourceSnapshotId) {
    return generateRuntimeUiConfigFromParts({
        blocks: definition.blocks,
        sourceSnapshotId,
        sourceWorkflowId: definition.id,
        structure: definition.structure
    });
}
function getActiveGovernedOutputMappings(outputEdges, blockMap) {
    return outputEdges.filter((edge)=>edge.status === "active").map((edge)=>{
        const protectedBlock = blockMap.get(edge.sourceBlockId);
        if (protectedBlock?.family !== "Field" || !isGovernedOutputRelationshipType(edge.relationshipType)) {
            return null;
        }
        return {
            edgeId: edge.id,
            protectedBlockId: protectedBlock.id,
            protectedLabel: protectedBlock.label,
            relationshipType: edge.relationshipType
        };
    }).filter((item)=>Boolean(item));
}
function getActiveCandidateOutputMappings(outputEdges, blockMap) {
    return outputEdges.filter((edge)=>edge.status === "active").map((edge)=>{
        const logicBlock = blockMap.get(edge.sourceBlockId);
        if (logicBlock?.family !== "Logic" || !isCandidateOutputRelationshipType(edge.relationshipType)) {
            return null;
        }
        return {
            edgeId: edge.id,
            logicBlockId: logicBlock.id,
            logicLabel: logicBlock.label,
            relationshipType: edge.relationshipType
        };
    }).filter((item)=>Boolean(item));
}
function getOutputReadinessStatus({ candidateMappingCount, governedMappingCount, ignoredRelationshipCount }) {
    if (governedMappingCount > 0 && candidateMappingCount === 0) {
        return ignoredRelationshipCount === 0 ? "ready" : "warning";
    }
    if (governedMappingCount > 0 || candidateMappingCount > 0) {
        return "warning";
    }
    return ignoredRelationshipCount > 0 ? "warning" : "missing";
}
function generateOutputMappingPreviewFromParts({ blocks, edges, generatedAt = new Date().toISOString(), sourceSnapshotId, sourceWorkflowId }) {
    const blockMap = new Map(blocks.map((block)=>[
            block.id,
            block
        ]));
    const outputBlocks = blocks.filter((block)=>block.family === "Output");
    const outputs = outputBlocks.map((outputBlock)=>{
        const outputEdges = edges.filter((edge)=>edge.targetBlockId === outputBlock.id && isOutputMappingRelationshipType(edge.relationshipType));
        const activeGovernedMappings = getActiveGovernedOutputMappings(outputEdges, blockMap);
        const activeCandidateMappings = getActiveCandidateOutputMappings(outputEdges, blockMap);
        const ignoredRelationshipCount = outputEdges.length - activeGovernedMappings.length - activeCandidateMappings.length;
        const governanceWarnings = activeCandidateMappings.length > 0 ? [
            LOGIC_OUTPUT_GOVERNANCE_WARNING
        ] : [];
        const missingRequirements = [
            outputEdges.length === 0 ? "No output mapping relationship" : "",
            activeGovernedMappings.length === 0 ? "No active Protected value mapping" : "",
            activeGovernedMappings.length === 0 && activeCandidateMappings.length === 0 ? "No active output input mapping" : ""
        ].filter(Boolean);
        const readinessStatus = getOutputReadinessStatus({
            candidateMappingCount: activeCandidateMappings.length,
            governedMappingCount: activeGovernedMappings.length,
            ignoredRelationshipCount
        });
        return {
            outputBlockId: outputBlock.id,
            outputLabel: outputBlock.label,
            outputSubtype: outputBlock.subtype,
            readinessStatus,
            mappedProtectedValues: activeGovernedMappings,
            candidateLogicMappings: activeCandidateMappings,
            governanceWarnings,
            ignoredRelationshipCount,
            missingRequirements,
            includedSourceTraceSetting: String(outputBlock.config.sourceTraceSetting || "include summary"),
            mockPayloadPreview: {
                mockOnly: true,
                outputSubtype: outputBlock.subtype,
                mappedValues: activeGovernedMappings.map((mapping)=>mapping.protectedLabel),
                candidateLogicInputs: activeCandidateMappings.map((mapping)=>mapping.logicLabel),
                noLiveExport: true
            }
        };
    });
    return {
        id: `output-mapping-${sourceSnapshotId || sourceWorkflowId}`,
        sourceWorkflowId,
        sourceSnapshotId,
        generatedAt,
        outputs
    };
}
function generateOutputMappingPreview(definition, sourceSnapshotId) {
    return generateOutputMappingPreviewFromParts({
        blocks: definition.blocks,
        edges: definition.edges,
        sourceSnapshotId,
        sourceWorkflowId: definition.id
    });
}
function resolveCatalogItemForNode(node) {
    const config = node.data.config || {};
    const existingCatalogId = node.data.block?.catalogId || config.catalogId;
    const existingCatalogItem = existingCatalogId ? getBlockCatalogItem(existingCatalogId) : undefined;
    if (existingCatalogItem) {
        return existingCatalogItem;
    }
    const family = node.data.block?.family || (config.blockFamily ?? getFamilyForStage(config.fiscalStage));
    const subtype = getSubtypeFromValue(config.blockSubtype, getDefaultCatalogItemForFamily(family).subtype);
    return getBlockCatalogItemBySubtype(subtype) || getDefaultCatalogItemForFamily(family);
}
function canvasNodeToWorkflowBlock(node, index) {
    const item = resolveCatalogItemForNode(node);
    const existingBlock = node.data.block;
    const label = node.data.label || existingBlock?.label || item.label;
    const config = {
        ...item.defaultConfig,
        ...existingBlock?.config,
        ...node.data.config,
        fiscalStage: BLOCK_FAMILY_STAGE[item.family],
        blockFamily: item.family,
        blockSubtype: item.subtype,
        catalogId: item.id,
        canvasNodeType: node.data.type
    };
    const block = createWorkflowBlockFromCatalog(item.id, {
        id: node.id,
        label,
        description: node.data.description || existingBlock?.description || item.description,
        position: node.position,
        config,
        status: existingBlock?.status || (index === 0 ? "configured" : "draft"),
        createdAt: existingBlock?.createdAt,
        updatedAt: new Date().toISOString(),
        createdBy: existingBlock?.createdBy,
        updatedBy: SYSTEM_USER,
        sample: existingBlock?.sample
    });
    return {
        ...block,
        source: existingBlock?.source || block.source,
        governance: existingBlock?.governance ? {
            ...existingBlock.governance,
            editIntent: typeof config.protectedEditIntent === "string" ? config.protectedEditIntent : existingBlock.governance.editIntent
        } : block.governance,
        runtime: {
            ...block.runtime,
            ...existingBlock?.runtime
        }
    };
}
function normalizeWorkflowEdgeRecord({ edge, sourceBlock, targetBlock }) {
    return {
        ...edge,
        relationshipType: getWorkflowRelationshipForValue({
            sourceBlock,
            targetBlock,
            value: edge.relationshipType
        }),
        status: getEdgeStatusFromValue(edge.status),
        bindingStatus: getEdgeBindingStatusFromValue(edge.bindingStatus),
        confidence: typeof edge.confidence === "number" ? edge.confidence : 1,
        notes: edge.notes || "",
        history: Array.isArray(edge.history) ? edge.history : []
    };
}
function canvasEdgeToWorkflowEdge(edge, blockMap) {
    const sourceBlock = blockMap.get(edge.source);
    const targetBlock = blockMap.get(edge.target);
    const existing = edge.data?.workflowEdge;
    if (existing) {
        return normalizeWorkflowEdgeRecord({
            edge: {
                ...existing,
                id: edge.id,
                sourceBlockId: edge.source,
                targetBlockId: edge.target
            },
            sourceBlock,
            targetBlock
        });
    }
    const defaults = sourceBlock && targetBlock ? getWorkflowEdgeDefaults({
        sourceBlock,
        targetBlock
    }) : null;
    return createWorkflowEdgeRecord({
        id: edge.id,
        sourceBlockId: edge.source,
        targetBlockId: edge.target,
        relationshipType: defaults?.relationshipType || "provides_data_to",
        reason: defaults?.reason || "Canvas connection created by builder",
        sourceOutputRole: defaults?.sourceOutputRole,
        targetInputRole: defaults?.targetInputRole,
        bindingLabel: defaults?.bindingLabel,
        bindingStatus: defaults?.bindingStatus || "missing",
        confidence: 1
    });
}
function createWorkflowDefinitionFromCanvas({ description, edges, existing, name, nodes, status }) {
    const now = new Date().toISOString();
    const blocks = nodes.filter((node)=>node.type !== "add" && Boolean(node.data.block) && !node.data.config?.blockCandidate).map(canvasNodeToWorkflowBlock);
    const blockMap = new Map(blocks.map((block)=>[
            block.id,
            block
        ]));
    const workflowEdges = edges.filter((edge)=>blockMap.has(edge.source) && blockMap.has(edge.target)).map((edge)=>canvasEdgeToWorkflowEdge(edge, blockMap));
    const structure = getWorkflowStructure(blocks);
    const runtimeUiConfig = generateRuntimeUiConfigFromParts({
        blocks,
        sourceWorkflowId: LOCAL_WORKFLOW_ID,
        structure
    });
    const outputMappingPreview = generateOutputMappingPreviewFromParts({
        blocks,
        edges: workflowEdges,
        sourceWorkflowId: LOCAL_WORKFLOW_ID
    });
    return {
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        id: LOCAL_WORKFLOW_ID,
        name: name || existing?.name || "Fiscal Workflow Studio",
        description: description || existing?.description || "Local prototype workflow stored in this browser.",
        status: status || existing?.status || "draft",
        metadata: {
            kind: "generic-fiscal-workflow",
            sampleWorkflow: existing?.metadata.sampleWorkflow,
            tags: existing?.metadata.tags || [
                "local",
                "prototype"
            ],
            createdBy: existing?.metadata.createdBy || SYSTEM_USER,
            createdAt: existing?.metadata.createdAt || now,
            updatedBy: SYSTEM_USER,
            updatedAt: now,
            notes: existing?.metadata.notes
        },
        blocks,
        edges: workflowEdges,
        structure,
        runtimeUiConfig,
        outputMappingPreview,
        mockRuns: existing?.mockRuns || [],
        versionSnapshots: existing?.versionSnapshots || [],
        latestPublishedVersionId: existing?.latestPublishedVersionId,
        publishedVersion: existing?.publishedVersion,
        aiProposals: existing?.aiProposals || [],
        events: existing?.events || []
    };
}
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Import migration normalizes old and current edge shapes in one place.
function getTypedEdgeFromUnknown(value, blockMap) {
    if (!(typeof value === "object" && value !== null)) {
        return null;
    }
    const edge = value;
    if (!(edge.sourceBlockId && edge.targetBlockId)) {
        return null;
    }
    const sourceBlock = blockMap?.get(edge.sourceBlockId);
    const targetBlock = blockMap?.get(edge.targetBlockId);
    const migratedMetadata = !(edge.relationshipType && edge.status && edge.createdAt && edge.createdBy && Array.isArray(edge.history) && edge.history.length > 0);
    const edgeId = edge.id || `edge-${edge.sourceBlockId}-${edge.targetBlockId}`;
    const createdAt = edge.createdAt || new Date().toISOString();
    return normalizeWorkflowEdgeRecord({
        edge: {
            id: edgeId,
            sourceBlockId: edge.sourceBlockId,
            targetBlockId: edge.targetBlockId,
            relationshipType: getWorkflowRelationshipForValue({
                sourceBlock,
                targetBlock,
                value: edge.relationshipType
            }),
            reason: edge.reason || "Imported relationship",
            ...typeof edge.sourceOutputRole === "string" ? {
                sourceOutputRole: edge.sourceOutputRole
            } : {},
            ...typeof edge.targetInputRole === "string" ? {
                targetInputRole: edge.targetInputRole
            } : {},
            ...typeof edge.bindingLabel === "string" ? {
                bindingLabel: edge.bindingLabel
            } : {},
            bindingStatus: getEdgeBindingStatusFromValue(edge.bindingStatus),
            status: getEdgeStatusFromValue(edge.status),
            createdBy: edge.createdBy || SYSTEM_USER,
            createdAt,
            confidence: typeof edge.confidence === "number" ? edge.confidence : 1,
            notes: edge.notes || "",
            history: Array.isArray(edge.history) && edge.history.length > 0 ? edge.history : [
                {
                    id: `${edgeId}-metadata-migrated`,
                    action: "migrated",
                    by: SYSTEM_USER,
                    at: createdAt,
                    notes: migratedMetadata ? "Imported edge metadata was completed with local defaults." : "Imported edge normalized for local Workflow Studio."
                }
            ]
        },
        sourceBlock,
        targetBlock
    });
}
function normalizeAiGeneratedBlock(value, index) {
    if (!(typeof value === "object" && value !== null)) {
        return null;
    }
    const block = value;
    const family = block.family || "Logic";
    const item = (block.catalogId ? getBlockCatalogItem(block.catalogId) : undefined) || getBlockCatalogItemBySubtype(block.subtype) || getDefaultCatalogItemForFamily(family);
    const createdBlock = createWorkflowBlockFromCatalog(item.id, {
        id: block.id || `ai-proposed-block-${index + 1}`,
        label: block.label || item.label,
        description: block.description || item.description,
        position: block.position || {
            x: index * 260,
            y: 0
        },
        config: block.config,
        status: block.status,
        createdAt: block.createdAt,
        updatedAt: block.updatedAt,
        createdBy: block.createdBy,
        updatedBy: block.updatedBy,
        sample: block.sample
    });
    return {
        ...createdBlock,
        ...block,
        config: {
            ...createdBlock.config,
            ...block.config
        },
        runtime: {
            ...createdBlock.runtime,
            ...block.runtime
        },
        source: block.source || createdBlock.source,
        governance: block.governance || createdBlock.governance
    };
}
function normalizeAiProposalHistory(proposalId, value, createdAt, createdBy) {
    if (Array.isArray(value)) {
        const entries = value.map((entry)=>{
            if (!(typeof entry === "object" && entry !== null)) {
                return null;
            }
            const item = entry;
            if (!(item.action && [
                "created",
                "revised",
                "approved",
                "rejected"
            ].includes(item.action))) {
                return null;
            }
            return {
                id: item.id || `${proposalId}-history-${Date.now()}`,
                action: item.action,
                by: item.by || createdBy,
                at: item.at || createdAt,
                notes: item.notes
            };
        }).filter((entry)=>entry !== null);
        if (entries.length > 0) {
            return entries;
        }
    }
    return [
        {
            id: `${proposalId}-created`,
            action: "created",
            by: createdBy,
            at: createdAt,
            notes: "Imported AI proposal history was completed locally."
        }
    ];
}
function normalizeGeneratedCodeOrFormulas(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.map((item)=>{
        if (!(typeof item === "object" && item !== null)) {
            return null;
        }
        const generated = item;
        if (!(generated.blockId && generated.value && (generated.kind === "code" || generated.kind === "formula"))) {
            return null;
        }
        return {
            blockId: generated.blockId,
            kind: generated.kind,
            value: generated.value
        };
    }).filter((item)=>item !== null);
}
function normalizeAiProposal(value, index, blockMap) {
    if (!(typeof value === "object" && value !== null)) {
        return null;
    }
    const proposal = value;
    const createdAt = proposal.createdAt || new Date().toISOString();
    const createdBy = proposal.createdBy || SYSTEM_USER;
    const id = proposal.id || `ai-proposal-imported-${index + 1}-${Date.now()}`;
    const generatedBlocks = Array.isArray(proposal.generatedBlocks) ? proposal.generatedBlocks.map((block, blockIndex)=>normalizeAiGeneratedBlock(block, blockIndex)).filter((block)=>Boolean(block)) : [];
    const proposalBlockMap = new Map(blockMap);
    for (const block of generatedBlocks){
        proposalBlockMap.set(block.id, block);
    }
    const generatedEdges = Array.isArray(proposal.generatedEdges) ? proposal.generatedEdges.map((edge)=>getTypedEdgeFromUnknown(edge, proposalBlockMap)).filter((edge)=>Boolean(edge)) : [];
    return {
        id,
        title: proposal.title || `AI proposal ${index + 1}`,
        originalPrompt: proposal.originalPrompt || "Imported local AI proposal.",
        interpretedPlan: proposal.interpretedPlan || "Review imported proposal details before approval.",
        selectedTools: Array.isArray(proposal.selectedTools) ? proposal.selectedTools.filter((tool)=>typeof tool === "string") : [
            "local mock assistant"
        ],
        generatedBlocks,
        generatedEdges,
        generatedCodeOrFormulas: normalizeGeneratedCodeOrFormulas(proposal.generatedCodeOrFormulas),
        status: getAiProposalStatusFromValue(proposal.status),
        approvalResult: proposal.approvalResult,
        rejectionResult: proposal.rejectionResult,
        createdAt,
        createdBy,
        relatedSelectedBlockId: proposal.relatedSelectedBlockId,
        relatedSelectedEdgeId: proposal.relatedSelectedEdgeId,
        confidence: typeof proposal.confidence === "number" ? proposal.confidence : undefined,
        notes: proposal.notes,
        history: normalizeAiProposalHistory(id, proposal.history, createdAt, createdBy)
    };
}
function normalizeWorkflowEvent(value) {
    if (!(typeof value === "object" && value !== null)) {
        return null;
    }
    const event = value;
    if (!(event.type && WORKFLOW_EVENT_TYPES.includes(event.type) && event.message)) {
        return null;
    }
    return {
        id: event.id || `event-imported-${Date.now()}`,
        type: event.type,
        message: event.message,
        createdAt: event.createdAt || new Date().toISOString(),
        createdBy: event.createdBy || SYSTEM_USER,
        details: event.details
    };
}
function getPublishedVersionReference(snapshots) {
    const latest = snapshots.filter((snapshot)=>snapshot.status === "published").sort((a, b)=>b.versionNumber - a.versionNumber)[0];
    if (!latest) {
        return;
    }
    return {
        id: latest.id,
        versionNumber: latest.versionNumber,
        createdAt: latest.createdAt
    };
}
function normalizeVersionSnapshots({ aiProposals, blocks, edges, mockRuns, snapshots, structure, workflowId, workflowName }) {
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Snapshot migration fills many optional v1 fields from older local exports.
    return (snapshots || []).map((snapshot, index)=>{
        const versionNumber = snapshot.versionNumber || index + 1;
        const snapshotId = snapshot.id || `snapshot-imported-v${versionNumber}-${Date.now()}`;
        const snapshotBlocks = snapshot.blocks || blocks;
        const snapshotEdges = snapshot.edges || edges;
        const snapshotStructure = snapshot.structure || structure;
        const runtimeUiConfig = snapshot.runtimeUiConfig || generateRuntimeUiConfigFromParts({
            blocks: snapshotBlocks,
            sourceSnapshotId: snapshotId,
            sourceWorkflowId: workflowId,
            structure: snapshotStructure
        });
        const outputMappingPreview = generateOutputMappingPreviewFromParts({
            blocks: snapshotBlocks,
            edges: snapshotEdges,
            generatedAt: snapshot.outputMappingPreview?.generatedAt || snapshot.createdAt || new Date().toISOString(),
            sourceSnapshotId: snapshotId,
            sourceWorkflowId: workflowId
        });
        const snapshotBlockMap = new Map(snapshotBlocks.map((block)=>[
                block.id,
                block
            ]));
        const snapshotAiProposals = (snapshot.aiProposals || aiProposals).map((proposal, proposalIndex)=>normalizeAiProposal(proposal, proposalIndex, snapshotBlockMap)).filter((proposal)=>Boolean(proposal));
        return {
            id: snapshotId,
            schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
            workflowId: snapshot.workflowId || workflowId,
            workflowName: snapshot.workflowName || workflowName,
            versionNumber,
            label: snapshot.label || `Imported version ${versionNumber}`,
            status: snapshot.status || "draft",
            createdBy: snapshot.createdBy || SYSTEM_USER,
            createdAt: snapshot.createdAt || new Date().toISOString(),
            changeSummary: snapshot.changeSummary || "Imported version snapshot.",
            blockCount: snapshot.blockCount || snapshotBlocks.length,
            edgeCount: snapshot.edgeCount || snapshotEdges.length,
            blockIds: snapshot.blockIds || snapshotBlocks.map((block)=>block.id),
            edgeIds: snapshot.edgeIds || snapshotEdges.map((edge)=>edge.id),
            blocks: cloneJson(snapshotBlocks),
            edges: cloneJson(snapshotEdges),
            structure: cloneJson(snapshotStructure),
            runtimeUiConfig: cloneJson(runtimeUiConfig),
            outputMappingPreview: cloneJson(outputMappingPreview),
            aiProposals: cloneJson(snapshotAiProposals),
            mockRuns: cloneJson(snapshot.mockRuns || mockRuns),
            notes: snapshot.notes,
            validationWarnings: snapshot.validationWarnings || []
        };
    });
}
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Local import migration intentionally handles typed and older partial schemas together.
function normalizeWorkflowDefinition(parsed) {
    const now = new Date().toISOString();
    const blocks = (parsed.blocks || []).map((block, index)=>{
        const family = block.family || "Logic";
        const item = (block.catalogId ? getBlockCatalogItem(block.catalogId) : undefined) || getBlockCatalogItemBySubtype(block.subtype) || getDefaultCatalogItemForFamily(family);
        const createdBlock = createWorkflowBlockFromCatalog(item.id, {
            id: block.id || `block-${index + 1}`,
            label: block.label || item.label,
            description: block.description || item.description,
            position: block.position || {
                x: index * 260,
                y: 0
            },
            config: block.config,
            status: block.status,
            createdAt: block.createdAt,
            updatedAt: block.updatedAt || now,
            createdBy: block.createdBy,
            updatedBy: block.updatedBy,
            sample: block.sample
        });
        return {
            ...createdBlock,
            ...block,
            config: {
                ...createdBlock.config,
                ...block.config
            },
            runtime: {
                ...createdBlock.runtime,
                ...block.runtime
            },
            source: block.source || createdBlock.source,
            governance: block.governance || createdBlock.governance
        };
    });
    const blockMap = new Map(blocks.map((block)=>[
            block.id,
            block
        ]));
    const edges = (parsed.edges || []).map((edge)=>getTypedEdgeFromUnknown(edge, blockMap)).filter((edge)=>Boolean(edge));
    const structure = parsed.structure || getWorkflowStructure(blocks);
    const runtimeUiConfig = parsed.runtimeUiConfig || generateRuntimeUiConfigFromParts({
        blocks,
        sourceWorkflowId: LOCAL_WORKFLOW_ID,
        structure
    });
    const outputMappingPreview = generateOutputMappingPreviewFromParts({
        blocks,
        edges,
        generatedAt: parsed.outputMappingPreview?.generatedAt,
        sourceWorkflowId: LOCAL_WORKFLOW_ID
    });
    const aiProposals = (parsed.aiProposals || []).map((proposal, index)=>normalizeAiProposal(proposal, index, blockMap)).filter((proposal)=>Boolean(proposal));
    const mockRuns = parsed.mockRuns || [];
    const versionSnapshots = normalizeVersionSnapshots({
        aiProposals,
        blocks,
        edges,
        mockRuns,
        snapshots: parsed.versionSnapshots,
        structure,
        workflowId: LOCAL_WORKFLOW_ID,
        workflowName: parsed.name || "Imported Fiscal Workflow"
    });
    const publishedVersion = parsed.publishedVersion || getPublishedVersionReference(versionSnapshots);
    return {
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        id: LOCAL_WORKFLOW_ID,
        name: parsed.name || "Imported Fiscal Workflow",
        description: parsed.description || "Imported local workflow.",
        status: parsed.status || "draft",
        metadata: {
            kind: "generic-fiscal-workflow",
            sampleWorkflow: parsed.metadata?.sampleWorkflow,
            tags: parsed.metadata?.tags || [
                "imported",
                "local"
            ],
            createdBy: parsed.metadata?.createdBy || SYSTEM_USER,
            createdAt: parsed.metadata?.createdAt || now,
            updatedBy: SYSTEM_USER,
            updatedAt: now,
            notes: parsed.metadata?.notes
        },
        blocks,
        edges,
        structure,
        runtimeUiConfig,
        outputMappingPreview,
        mockRuns,
        versionSnapshots,
        latestPublishedVersionId: parsed.latestPublishedVersionId || publishedVersion?.id,
        publishedVersion,
        aiProposals,
        events: [
            ...(parsed.events || []).map(normalizeWorkflowEvent).filter((event)=>Boolean(event)) || [],
            ...parsed.schemaVersion !== LOCAL_WORKFLOW_SCHEMA_VERSION ? [
                createWorkflowEvent({
                    type: "migration",
                    message: "Imported workflow was migrated to the local v1 schema."
                })
            ] : []
        ]
    };
}
function readStoredWorkflowDefinitionResult() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const stored = window.localStorage.getItem(LOCAL_WORKFLOW_STORAGE_KEY);
    if (!stored) {
        return {
            snapshot: null
        };
    }
    try {
        return {
            snapshot: parseLocalWorkflowJson(stored)
        };
    } catch (error) {
        return {
            snapshot: null,
            warning: error instanceof Error ? error.message : "Saved local workflow could not be loaded."
        };
    }
}
function readStoredWorkflowDefinition() {
    return readStoredWorkflowDefinitionResult().snapshot;
}
const SINGLE_ITEM_PIPELINE_ROWS = [
    {
        account: "4000",
        amount: 100,
        currency: "USD",
        description: "Interest earned on deposit account",
        label: "Interest income",
        rowId: "row-001"
    }
];
const SINGLE_ITEM_PIPELINE_RULES = [
    {
        confidence: 0.95,
        description: "Classifies interest-related income rows.",
        keywords: [
            "interest income",
            "interest earned",
            "deposit interest"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-001",
        sectionId: "income",
        subsectionId: "interest",
        target: "income_interest"
    }
];
function createSingleItemPipelineBlocks() {
    const specs = [
        {
            catalogId: "source:excel-workbook",
            config: {
                outputs: "rows",
                rows: SINGLE_ITEM_PIPELINE_ROWS,
                sourceKind: "manual_table",
                sourceLocator: "excel-template-mock://single-item/row-001",
                toolId: "source.manual_table"
            },
            description: "Immutable Excel-like source row. The demo follows row-001 end to end.",
            id: "single-source-excel-row",
            label: "Excel Template Row Source",
            position: {
                x: 80,
                y: 140
            }
        },
        {
            catalogId: "source:keyword-rules",
            config: {
                keywordRules: SINGLE_ITEM_PIPELINE_RULES,
                outputs: "keyword_rules",
                sourceKind: "keyword_rules",
                sourceLocator: "manual-source://single-item-mapping-rules",
                toolId: "source.keyword_rules"
            },
            description: "Editable Keyword Rulebook used by the mapper. Rules are not hardcoded in Logic.",
            id: "single-source-mapping-rules",
            label: "Keyword Rulebook",
            position: {
                x: 80,
                y: 380
            }
        },
        {
            catalogId: "logic:classification-mapping",
            config: {
                conflictStrategy: "highest_confidence",
                inputs: "data_rows, keyword_rules",
                lowConfidenceThreshold: 0.75,
                matchFields: [
                    "label",
                    "description"
                ],
                matchMode: "contains",
                outputs: "mapped_rows",
                toolId: "logic.keyword_mapper",
                unmatchedStrategy: "send_to_review"
            },
            description: "Reusable no-code Logic tool that maps source rows with connected keyword rules.",
            id: "single-logic-keyword-mapper",
            label: "Keyword Mapper",
            position: {
                x: 380,
                y: 250
            }
        },
        {
            catalogId: "logic:aggregation",
            config: {
                aggregationMethod: "sum",
                amountField: "amount",
                includeSectionIds: [
                    "income"
                ],
                includeSubsectionIds: [
                    "interest"
                ],
                includeTargets: [
                    "income_interest"
                ],
                inputs: "mapped_rows",
                outputs: "subtotal",
                toolId: "logic.aggregation"
            },
            description: "Aggregates the mapped single item into the income / interest subtotal.",
            id: "single-logic-section-aggregator",
            label: "Section Aggregator",
            position: {
                x: 700,
                y: 250
            }
        },
        {
            catalogId: "review:low-confidence-warning",
            config: {
                blocking: true,
                inputs: "mapped_rows",
                outputs: "validation_result",
                threshold: 0.75,
                toolId: "review.confidence_check"
            },
            description: "Review / Validation checkpoint that decides whether the mapping is trustworthy.",
            id: "single-review-confidence-check",
            label: "Confidence Check",
            position: {
                x: 700,
                y: 470
            }
        },
        {
            catalogId: "review:approval-gate",
            config: {
                approved: true,
                inputs: "value_to_approve, validation_result",
                notes: "Approved for single item pipeline demo.",
                outputs: "approval_status",
                reviewer: "demo-reviewer",
                toolId: "review.approval_gate"
            },
            description: "Local mock approval gate that lets the candidate subtotal become governed.",
            id: "single-review-approval-gate",
            label: "Approval Gate",
            position: {
                x: 1020,
                y: 360
            }
        },
        {
            catalogId: "protected:protected-result",
            config: {
                inputs: "candidate_value, approval_status",
                outputs: "protected_result",
                resultName: "Z",
                runtimeLocked: true,
                toolId: "protected.protected_result"
            },
            description: "Governed final result. If approval is removed, Z becomes draft and needs review.",
            id: "single-protected-result-z",
            label: "Protected Result Z",
            position: {
                x: 1340,
                y: 250
            }
        },
        {
            catalogId: "output:evidence-pack",
            config: {
                inputs: "protected_result, mapped_rows, validation_result, approval_status",
                outputs: "preview",
                toolId: "output.evidence_pack_preview"
            },
            description: "Human-readable local evidence preview for the final Z result.",
            id: "single-output-z-evidence-preview",
            label: "Z Evidence Preview",
            position: {
                x: 1660,
                y: 160
            }
        },
        {
            catalogId: "output:canonical-json",
            config: {
                inputs: "protected_result, source_trace",
                outputs: "canonical_json",
                toolId: "output.canonical_json"
            },
            description: "Structured local JSON package for the final Z result and trace.",
            id: "single-output-z-canonical-json",
            label: "Z Canonical JSON",
            position: {
                x: 1660,
                y: 380
            }
        }
    ];
    return specs.map((spec)=>createWorkflowBlockFromCatalog(spec.catalogId, {
            config: spec.config,
            createdAt: SAMPLE_CREATED_AT,
            description: spec.description,
            id: spec.id,
            label: spec.label,
            position: spec.position,
            sample: true,
            status: "configured",
            updatedAt: SAMPLE_CREATED_AT
        }));
}
function getSingleItemPipelineDemoEdges() {
    // biome-ignore lint/nursery/useMaxParams: Compact demo-edge DSL keeps the single-item path readable.
    const edge = (sourceBlockId, targetBlockId, relationshipType, reason, binding)=>createWorkflowEdgeRecord({
            id: `single-edge-${sourceBlockId}-${targetBlockId}-${binding.sourceOutputRole || "out"}-${binding.targetInputRole || "in"}`,
            sourceBlockId,
            targetBlockId,
            relationshipType,
            reason,
            confidence: 1,
            ...binding,
            createdAt: SAMPLE_CREATED_AT
        });
    return [
        edge("single-source-excel-row", "single-logic-keyword-mapper", "provides_data_to", "Keyword Mapper needs data rows.", {
            bindingLabel: "Rows to classify",
            bindingStatus: "valid",
            sourceOutputRole: "rows",
            targetInputRole: "data_rows"
        }),
        edge("single-source-mapping-rules", "single-logic-keyword-mapper", "referenced_by", "Keyword Mapper applies this versioned rulebook.", {
            bindingLabel: "Rules used for classification",
            bindingStatus: "valid",
            sourceOutputRole: "keyword_rules",
            targetInputRole: "keyword_rules"
        }),
        edge("single-logic-keyword-mapper", "single-logic-section-aggregator", "transforms_into", "Aggregator sums mapped rows by section/subsection.", {
            bindingLabel: "Mapped rows to aggregate",
            bindingStatus: "valid",
            sourceOutputRole: "mapped_rows",
            targetInputRole: "mapped_rows"
        }),
        edge("single-logic-keyword-mapper", "single-review-confidence-check", "triggers_validation", "Confidence Check reviews the mapped row confidence.", {
            bindingLabel: "Mapped rows to validate",
            bindingStatus: "valid",
            sourceOutputRole: "mapped_rows",
            targetInputRole: "checked_items"
        }),
        edge("single-logic-section-aggregator", "single-review-approval-gate", "triggers_validation", "Approval Gate reviews the candidate subtotal for Z.", {
            bindingLabel: "Candidate subtotal",
            bindingStatus: "valid",
            sourceOutputRole: "subtotal",
            targetInputRole: "value_to_approve"
        }),
        edge("single-review-confidence-check", "single-review-approval-gate", "depends_on", "Approval Gate considers the validation result.", {
            bindingLabel: "Confidence validation",
            bindingStatus: "valid",
            sourceOutputRole: "validation_result",
            targetInputRole: "validation_result"
        }),
        edge("single-logic-section-aggregator", "single-protected-result-z", "feeds_protected_result", "Subtotal becomes the candidate value for Z.", {
            bindingLabel: "Candidate Z value",
            bindingStatus: "valid",
            sourceOutputRole: "subtotal",
            targetInputRole: "candidate_value"
        }),
        edge("single-review-approval-gate", "single-protected-result-z", "approves_for", "Approval Gate determines whether Z can become final.", {
            bindingLabel: "Approval for Z",
            bindingStatus: "valid",
            sourceOutputRole: "approval_status",
            targetInputRole: "approval_status"
        }),
        edge("single-protected-result-z", "single-output-z-evidence-preview", "maps_to_output", "Evidence preview displays the final protected result.", {
            bindingLabel: "Final Z output",
            bindingStatus: "valid",
            sourceOutputRole: "protected_result",
            targetInputRole: "protected_result"
        }),
        edge("single-logic-keyword-mapper", "single-output-z-evidence-preview", "included_in_output_preview", "Evidence preview lists the mapped row and rule.", {
            bindingLabel: "Mapped row trace",
            bindingStatus: "valid",
            sourceOutputRole: "mapped_rows",
            targetInputRole: "mapped_rows"
        }),
        edge("single-review-confidence-check", "single-output-z-evidence-preview", "included_in_output_preview", "Evidence preview includes validation status.", {
            bindingLabel: "Validation result",
            bindingStatus: "valid",
            sourceOutputRole: "validation_result",
            targetInputRole: "validation_result"
        }),
        edge("single-review-approval-gate", "single-output-z-evidence-preview", "included_in_output_preview", "Evidence preview includes approval status.", {
            bindingLabel: "Approval status",
            bindingStatus: "valid",
            sourceOutputRole: "approval_status",
            targetInputRole: "approval_status"
        }),
        edge("single-protected-result-z", "single-output-z-canonical-json", "maps_to_output", "Canonical JSON includes the final protected Z result.", {
            bindingLabel: "Final Z JSON",
            bindingStatus: "valid",
            sourceOutputRole: "protected_result",
            targetInputRole: "protected_result"
        }),
        edge("single-protected-result-z", "single-output-z-canonical-json", "maps_to_output", "Canonical JSON includes the trace carried by Z.", {
            bindingLabel: "Z source trace",
            bindingStatus: "valid",
            sourceOutputRole: "protected_result",
            targetInputRole: "source_trace"
        })
    ];
}
function createSingleItemPipelineDemoWorkflow() {
    const blocks = createSingleItemPipelineBlocks();
    const edges = getSingleItemPipelineDemoEdges();
    const structure = getWorkflowStructure(blocks);
    const runtimeUiConfig = generateRuntimeUiConfigFromParts({
        blocks,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID,
        structure
    });
    const outputMappingPreview = generateOutputMappingPreviewFromParts({
        blocks,
        edges,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID
    });
    const mockRuns = getSampleBlockRuns(blocks);
    const initialSnapshot = {
        id: "version-single-item-pipeline-demo-v1",
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        workflowId: LOCAL_WORKFLOW_ID,
        workflowName: "Single Item Pipeline Demo",
        versionNumber: 1,
        label: "Initial Single Item Pipeline Demo",
        status: "draft",
        createdBy: SYSTEM_USER,
        createdAt: SAMPLE_CREATED_AT,
        changeSummary: "Tiny executable local demo that carries row-001 through Source, Logic, Review, Protected, and Output.",
        blockCount: blocks.length,
        edgeCount: edges.length,
        blockIds: blocks.map((block)=>block.id),
        edgeIds: edges.map((edge)=>edge.id),
        blocks: cloneJson(blocks),
        edges: cloneJson(edges),
        structure: cloneJson(structure),
        runtimeUiConfig: cloneJson(runtimeUiConfig),
        outputMappingPreview: cloneJson(outputMappingPreview),
        aiProposals: [],
        mockRuns: cloneJson(mockRuns),
        notes: "Local deterministic single item demo. No external integrations.",
        validationWarnings: []
    };
    return {
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        id: LOCAL_WORKFLOW_ID,
        name: "Single Item Pipeline Demo",
        description: "Generic local proof that one Source item can flow through reusable Logic, Review / Validation, Protected governance, and Output artifacts.",
        status: "draft",
        metadata: {
            kind: "generic-fiscal-workflow",
            sampleWorkflow: {
                id: "single-item-pipeline-demo",
                label: "Single Item Pipeline Demo",
                description: "Generic executable demo. The final protected result is Z."
            },
            tags: [
                "local",
                "prototype",
                "single-item-demo"
            ],
            createdBy: SYSTEM_USER,
            createdAt: SAMPLE_CREATED_AT,
            updatedBy: SYSTEM_USER,
            updatedAt: new Date().toISOString(),
            notes: "No live OCR, AI, Taxprep, ONESOURCE, Excel parser, PDF parser, or backend integration is included."
        },
        blocks,
        edges,
        structure,
        runtimeUiConfig,
        outputMappingPreview,
        mockRuns,
        versionSnapshots: [
            initialSnapshot
        ],
        aiProposals: [],
        events: [
            createWorkflowEvent({
                type: "reset_sample",
                message: "Single Item Pipeline Demo initialized locally.",
                createdAt: SAMPLE_CREATED_AT
            })
        ]
    };
}
function createExpandedMappingPipelineBlocks() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$expanded$2d$mapping$2d$pipeline$2d$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPANDED_MAPPING_PIPELINE_BLOCK_SPECS"].map((spec)=>createWorkflowBlockFromCatalog(spec.catalogId, {
            config: cloneJson(spec.config),
            createdAt: SAMPLE_CREATED_AT,
            description: spec.description,
            id: spec.id,
            label: spec.label,
            position: spec.position,
            sample: true,
            status: "configured",
            updatedAt: SAMPLE_CREATED_AT
        }));
}
function getExpandedMappingPipelineDemoEdges() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$expanded$2d$mapping$2d$pipeline$2d$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPANDED_MAPPING_PIPELINE_EDGE_SPECS"].map((spec)=>createWorkflowEdgeRecord({
            bindingLabel: spec.bindingLabel,
            bindingStatus: "valid",
            confidence: 1,
            createdAt: SAMPLE_CREATED_AT,
            id: `expanded-edge-${spec.sourceBlockId}-${spec.targetBlockId}-${spec.sourceOutputRole}-${spec.targetInputRole}`,
            reason: spec.reason,
            relationshipType: spec.relationshipType,
            sourceBlockId: spec.sourceBlockId,
            sourceOutputRole: spec.sourceOutputRole,
            targetBlockId: spec.targetBlockId,
            targetInputRole: spec.targetInputRole
        }));
}
function createExpandedMappingPipelineDemoWorkflow() {
    const blocks = createExpandedMappingPipelineBlocks();
    const edges = getExpandedMappingPipelineDemoEdges();
    const structure = getWorkflowStructure(blocks);
    const runtimeUiConfig = generateRuntimeUiConfigFromParts({
        blocks,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID,
        structure
    });
    const outputMappingPreview = generateOutputMappingPreviewFromParts({
        blocks,
        edges,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID
    });
    const mockRuns = getSampleBlockRuns(blocks);
    const initialSnapshot = {
        aiProposals: [],
        blockCount: blocks.length,
        blockIds: blocks.map((block)=>block.id),
        blocks: cloneJson(blocks),
        changeSummary: "Expanded generic local demo that maps 15 rows, aggregates Z and W, validates warnings, and produces protected outputs.",
        createdAt: SAMPLE_CREATED_AT,
        createdBy: SYSTEM_USER,
        edgeCount: edges.length,
        edgeIds: edges.map((edge)=>edge.id),
        edges: cloneJson(edges),
        id: "version-expanded-mapping-pipeline-demo-v1",
        label: "Initial Expanded Mapping Pipeline Demo",
        mockRuns: cloneJson(mockRuns),
        notes: "Local deterministic expanded mapping demo. No external integrations.",
        outputMappingPreview: cloneJson(outputMappingPreview),
        runtimeUiConfig: cloneJson(runtimeUiConfig),
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        status: "draft",
        structure: cloneJson(structure),
        validationWarnings: [],
        versionNumber: 1,
        workflowId: LOCAL_WORKFLOW_ID,
        workflowName: "Expanded Mapping Pipeline Demo"
    };
    return {
        aiProposals: [],
        blocks,
        description: "Generic local stress-test that maps many Excel-like rows with Source rules, aggregates section results into protected Z and W, and produces local output previews.",
        edges,
        events: [
            createWorkflowEvent({
                createdAt: SAMPLE_CREATED_AT,
                message: "Expanded Mapping Pipeline Demo initialized locally.",
                type: "reset_sample"
            })
        ],
        id: LOCAL_WORKFLOW_ID,
        metadata: {
            createdAt: SAMPLE_CREATED_AT,
            createdBy: SYSTEM_USER,
            kind: "generic-fiscal-workflow",
            notes: "No live OCR, AI, Taxprep, ONESOURCE, Excel parser, PDF parser, or backend integration is included.",
            sampleWorkflow: {
                description: "Generic executable stress-test demo. The final protected results are Z and W.",
                id: "expanded-mapping-pipeline-demo",
                label: "Expanded Mapping Pipeline Demo"
            },
            tags: [
                "local",
                "prototype",
                "expanded-mapping-demo"
            ],
            updatedAt: new Date().toISOString(),
            updatedBy: SYSTEM_USER
        },
        mockRuns,
        name: "Expanded Mapping Pipeline Demo",
        outputMappingPreview,
        runtimeUiConfig,
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        status: "draft",
        structure,
        versionSnapshots: [
            initialSnapshot
        ]
    };
}
function createWorkingSourceRulesDemoBlocks() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$working$2d$source$2d$rules$2d$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORKING_SOURCE_DEMO_BLOCK_SPECS"].map((spec)=>createWorkflowBlockFromCatalog(spec.catalogId, {
            config: cloneJson(spec.config),
            createdAt: SAMPLE_CREATED_AT,
            description: spec.description,
            id: spec.id,
            label: spec.label,
            position: spec.position,
            sample: true,
            status: "configured",
            updatedAt: SAMPLE_CREATED_AT
        }));
}
function getWorkingSourceRulesDemoEdges() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$working$2d$source$2d$rules$2d$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORKING_SOURCE_DEMO_EDGE_SPECS"].map((spec)=>createWorkflowEdgeRecord({
            bindingLabel: spec.bindingLabel,
            bindingStatus: "valid",
            confidence: 1,
            createdAt: SAMPLE_CREATED_AT,
            id: `working-edge-${spec.sourceBlockId}-${spec.targetBlockId}-${spec.sourceOutputRole}-${spec.targetInputRole}`,
            reason: spec.reason,
            relationshipType: spec.relationshipType,
            sourceBlockId: spec.sourceBlockId,
            sourceOutputRole: spec.sourceOutputRole,
            targetBlockId: spec.targetBlockId,
            targetInputRole: spec.targetInputRole
        }));
}
function createWorkingSourceRulesDemoWorkflow() {
    const blocks = createWorkingSourceRulesDemoBlocks();
    const edges = getWorkingSourceRulesDemoEdges();
    const structure = getWorkflowStructure(blocks);
    const runtimeUiConfig = generateRuntimeUiConfigFromParts({
        blocks,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID,
        structure
    });
    const outputMappingPreview = generateOutputMappingPreviewFromParts({
        blocks,
        edges,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID
    });
    const mockRuns = getSampleBlockRuns(blocks);
    const initialSnapshot = {
        aiProposals: [],
        blockCount: blocks.length,
        blockIds: blocks.map((block)=>block.id),
        blocks: cloneJson(blocks),
        changeSummary: "Working local FAPI-style preparation demo with Excel Source rows, imported rulebooks, calculator validation, and protected outputs.",
        createdAt: SAMPLE_CREATED_AT,
        createdBy: SYSTEM_USER,
        edgeCount: edges.length,
        edgeIds: edges.map((edge)=>edge.id),
        edges: cloneJson(edges),
        id: "version-working-source-rules-demo-v1",
        label: "Initial Working FAPI Workbook Preparation Demo",
        mockRuns: cloneJson(mockRuns),
        notes: "Local deterministic working demo. Uploaded Excel rows and draft mapping rules stay local.",
        outputMappingPreview: cloneJson(outputMappingPreview),
        runtimeUiConfig: cloneJson(runtimeUiConfig),
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        status: "draft",
        structure: cloneJson(structure),
        validationWarnings: [],
        versionNumber: 1,
        workflowId: LOCAL_WORKFLOW_ID,
        workflowName: "Working FAPI Workbook Preparation Demo"
    };
    return {
        aiProposals: [],
        blocks,
        description: "Practical generic local demo for preparing a FAPI-style workflow from an uploaded Excel workbook with editable rulebooks and protected outputs.",
        edges,
        events: [
            createWorkflowEvent({
                createdAt: SAMPLE_CREATED_AT,
                message: "Working Excel Source + Rulebooks Demo initialized locally.",
                type: "reset_sample"
            })
        ],
        id: LOCAL_WORKFLOW_ID,
        metadata: {
            createdAt: SAMPLE_CREATED_AT,
            createdBy: SYSTEM_USER,
            kind: "generic-fiscal-workflow",
            notes: "No live OCR, AI, Taxprep, ONESOURCE, PDF parser, or backend integration is included.",
            sampleWorkflow: {
                description: "Generic practical local demo for Excel source rows, editable rulebooks, FAPI-style calculations, and output previews.",
                id: "working-source-rules-demo",
                label: "Working FAPI Workbook Preparation Demo"
            },
            tags: [
                "local",
                "prototype",
                "working-source-rules-demo"
            ],
            updatedAt: new Date().toISOString(),
            updatedBy: SYSTEM_USER
        },
        mockRuns,
        name: "Working FAPI Workbook Preparation Demo",
        outputMappingPreview,
        runtimeUiConfig,
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        status: "draft",
        structure,
        versionSnapshots: [
            initialSnapshot
        ]
    };
}
function createFapiTemplateWorkflow() {
    const blocks = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$fapi$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_TEMPLATE_BLOCK_SPECS"].map((spec)=>createWorkflowBlockFromCatalog(spec.catalogId, {
            config: cloneJson(spec.config),
            createdAt: SAMPLE_CREATED_AT,
            description: spec.description,
            id: spec.id,
            label: spec.label,
            position: spec.position,
            sample: true,
            status: "configured",
            updatedAt: SAMPLE_CREATED_AT
        }));
    const edges = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$fapi$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_TEMPLATE_EDGE_SPECS"].map((spec)=>createWorkflowEdgeRecord({
            bindingLabel: spec.bindingLabel,
            bindingStatus: "valid",
            confidence: 1,
            createdAt: SAMPLE_CREATED_AT,
            id: `fapi-edge-${spec.sourceBlockId}-${spec.targetBlockId}-${spec.sourceOutputRole}`,
            reason: spec.reason,
            relationshipType: spec.relationshipType,
            sourceBlockId: spec.sourceBlockId,
            sourceOutputRole: spec.sourceOutputRole,
            targetBlockId: spec.targetBlockId,
            targetInputRole: spec.targetInputRole
        }));
    const structure = getWorkflowStructure(blocks);
    const runtimeUiConfig = generateRuntimeUiConfigFromParts({
        blocks,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID,
        structure
    });
    const outputMappingPreview = generateOutputMappingPreviewFromParts({
        blocks,
        edges,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID
    });
    const mockRuns = getSampleBlockRuns(blocks);
    const initialSnapshot = {
        aiProposals: [],
        blockCount: blocks.length,
        blockIds: blocks.map((b)=>b.id),
        blocks: cloneJson(blocks),
        changeSummary: "FAPI template: Excel source → keyword mapping → rollup → two-stage calculation → Field displays → output.",
        createdAt: SAMPLE_CREATED_AT,
        createdBy: SYSTEM_USER,
        edgeCount: edges.length,
        edgeIds: edges.map((e)=>e.id),
        edges: cloneJson(edges),
        id: "version-fapi-template-v1",
        label: "FAPI Template v1",
        mockRuns: cloneJson(mockRuns),
        notes: "No validation or rulebook blocks — core pipeline only. Add Review/Validation and Rulebook blocks once the base numbers are confirmed.",
        outputMappingPreview: cloneJson(outputMappingPreview),
        runtimeUiConfig: cloneJson(runtimeUiConfig),
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        status: "draft",
        structure: cloneJson(structure),
        validationWarnings: [],
        versionNumber: 1,
        workflowId: LOCAL_WORKFLOW_ID,
        workflowName: "FAPI Calculation Template"
    };
    return {
        aiProposals: [],
        blocks,
        description: "Core FAPI pipeline: upload a trial balance, classify rows, roll up categories, compute lines A–H then summary totals, and display results in Field blocks.",
        edges,
        events: [
            createWorkflowEvent({
                createdAt: SAMPLE_CREATED_AT,
                message: "FAPI Calculation Template initialized.",
                type: "reset_sample"
            })
        ],
        id: LOCAL_WORKFLOW_ID,
        metadata: {
            createdAt: SAMPLE_CREATED_AT,
            createdBy: SYSTEM_USER,
            kind: "generic-fiscal-workflow",
            notes: "Rulebook and validation blocks intentionally excluded from v1 — add them once base FAPI numbers are confirmed.",
            sampleWorkflow: {
                description: "Core FAPI pipeline: trial balance → keyword mapping → rollup → calculation → Field display → output.",
                id: "fapi-calculation-template",
                label: "FAPI Calculation Template"
            },
            tags: [
                "local",
                "fapi",
                "fapi-calculation-template"
            ],
            updatedAt: new Date().toISOString(),
            updatedBy: SYSTEM_USER
        },
        mockRuns,
        name: "FAPI Calculation Template",
        outputMappingPreview,
        runtimeUiConfig,
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        status: "draft",
        structure,
        versionSnapshots: [
            initialSnapshot
        ]
    };
}
function createRoullementFiscalWorkflow() {
    const blocks = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$roulement$2d$fiscal$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROULEMENT_FISCAL_BLOCK_SPECS"].map((spec)=>createWorkflowBlockFromCatalog(spec.catalogId, {
            config: cloneJson(spec.config),
            createdAt: SAMPLE_CREATED_AT,
            description: spec.description,
            id: spec.id,
            label: spec.label,
            position: spec.position,
            sample: true,
            status: "configured",
            updatedAt: SAMPLE_CREATED_AT
        }));
    const edges = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$roulement$2d$fiscal$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROULEMENT_FISCAL_EDGE_SPECS"].map((spec)=>createWorkflowEdgeRecord({
            bindingLabel: spec.bindingLabel,
            bindingStatus: "valid",
            confidence: 1,
            createdAt: SAMPLE_CREATED_AT,
            id: `roulement-edge-${spec.sourceBlockId}-${spec.targetBlockId}-${spec.sourceOutputRole}`,
            reason: spec.reason,
            relationshipType: spec.relationshipType,
            sourceBlockId: spec.sourceBlockId,
            sourceOutputRole: spec.sourceOutputRole,
            targetBlockId: spec.targetBlockId,
            targetInputRole: spec.targetInputRole
        }));
    const structure = getWorkflowStructure(blocks);
    const runtimeUiConfig = generateRuntimeUiConfigFromParts({
        blocks,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID,
        structure
    });
    const outputMappingPreview = generateOutputMappingPreviewFromParts({
        blocks,
        edges,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID
    });
    const mockRuns = getSampleBlockRuns(blocks);
    const initialSnapshot = {
        aiProposals: [],
        blockCount: blocks.length,
        blockIds: blocks.map((b)=>b.id),
        blocks: cloneJson(blocks),
        changeSummary: "Roulement fiscal art. 85 : tableau des biens → classification → agrégation PBR → calcul de l'élection → sommaire → remise T2057.",
        createdAt: SAMPLE_CREATED_AT,
        createdBy: SYSTEM_USER,
        edgeCount: edges.length,
        edgeIds: edges.map((e)=>e.id),
        edges: cloneJson(edges),
        id: "version-roulement-fiscal-v1",
        label: "Roulement fiscal v1",
        mockRuns: cloneJson(mockRuns),
        notes: "Gabarit de base — aucun bloc de validation ou d'examen inclus. Ajouter des blocs Révision/Validation une fois les montants élus confirmés.",
        outputMappingPreview: cloneJson(outputMappingPreview),
        runtimeUiConfig: cloneJson(runtimeUiConfig),
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        status: "draft",
        structure: cloneJson(structure),
        validationWarnings: [],
        versionNumber: 1,
        workflowId: LOCAL_WORKFLOW_ID,
        workflowName: "Roulement fiscal — art. 85 LIR"
    };
    return {
        aiProposals: [],
        blocks,
        description: "Gabarit de roulement fiscal (art. 85 LIR) : téléverser le tableau des biens, classifier par type, agréger le PBR, calculer les bornes et le gain de l'élection, et produire les données T2057.",
        edges,
        events: [
            createWorkflowEvent({
                createdAt: SAMPLE_CREATED_AT,
                message: "Gabarit Roulement fiscal art. 85 initialisé.",
                type: "reset_sample"
            })
        ],
        id: LOCAL_WORKFLOW_ID,
        metadata: {
            createdAt: SAMPLE_CREATED_AT,
            createdBy: SYSTEM_USER,
            kind: "generic-fiscal-workflow",
            notes: "Blocs de validation et de révision exclus du v1 — à ajouter une fois le montant élu confirmé.",
            sampleWorkflow: {
                description: "Roulement fiscal art. 85 : biens → classification → PBR → élection → sommaire → T2057.",
                id: "roulement-fiscal-template",
                label: "Roulement fiscal — art. 85 LIR"
            },
            tags: [
                "local",
                "roulement",
                "art-85",
                "roulement-fiscal-template"
            ],
            updatedAt: new Date().toISOString(),
            updatedBy: SYSTEM_USER
        },
        mockRuns,
        name: "Roulement fiscal — art. 85 LIR",
        outputMappingPreview,
        runtimeUiConfig,
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        status: "draft",
        structure,
        versionSnapshots: [
            initialSnapshot
        ]
    };
}
function createExpenseReimbursementWorkflow() {
    const blocks = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$expense$2d$reimbursement$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPENSE_TEMPLATE_BLOCK_SPECS"].map((spec)=>createWorkflowBlockFromCatalog(spec.catalogId, {
            config: cloneJson(spec.config),
            createdAt: SAMPLE_CREATED_AT,
            description: spec.description,
            id: spec.id,
            label: spec.label,
            position: spec.position,
            sample: true,
            status: "configured",
            updatedAt: SAMPLE_CREATED_AT
        }));
    const edges = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$expense$2d$reimbursement$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPENSE_TEMPLATE_EDGE_SPECS"].map((spec)=>createWorkflowEdgeRecord({
            bindingLabel: spec.bindingLabel,
            bindingStatus: "valid",
            confidence: 1,
            createdAt: SAMPLE_CREATED_AT,
            id: `expense-edge-${spec.sourceBlockId}-${spec.targetBlockId}-${spec.sourceOutputRole}`,
            reason: spec.reason,
            relationshipType: spec.relationshipType,
            sourceBlockId: spec.sourceBlockId,
            sourceOutputRole: spec.sourceOutputRole,
            targetBlockId: spec.targetBlockId,
            targetInputRole: spec.targetInputRole
        }));
    const structure = getWorkflowStructure(blocks);
    const runtimeUiConfig = generateRuntimeUiConfigFromParts({
        blocks,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID,
        structure
    });
    const outputMappingPreview = generateOutputMappingPreviewFromParts({
        blocks,
        edges,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID
    });
    const mockRuns = getSampleBlockRuns(blocks);
    const initialSnapshot = {
        aiProposals: [],
        blockCount: blocks.length,
        blockIds: blocks.map((b)=>b.id),
        blocks: cloneJson(blocks),
        changeSummary: "Expense reimbursement: expense report → classify receipts → category totals → policy engine → summary → approval pack + payroll export.",
        createdAt: SAMPLE_CREATED_AT,
        createdBy: SYSTEM_USER,
        edgeCount: edges.length,
        edgeIds: edges.map((e)=>e.id),
        edges: cloneJson(edges),
        id: "version-expense-reimbursement-v1",
        label: "Expense Reimbursement v1",
        mockRuns: cloneJson(mockRuns),
        notes: "Non-fiscal demo — four source types, keyword classification, per-category policy caps, and a CAD conversion. No review/validation blocks in v1.",
        outputMappingPreview: cloneJson(outputMappingPreview),
        runtimeUiConfig: cloneJson(runtimeUiConfig),
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        status: "draft",
        structure: cloneJson(structure),
        validationWarnings: [],
        versionNumber: 1,
        workflowId: LOCAL_WORKFLOW_ID,
        workflowName: "Employee Expense Reimbursement"
    };
    return {
        aiProposals: [],
        blocks,
        description: "Process an employee expense report: upload receipts, classify each into a policy category, total per category, apply per-diem caps and reimbursement policy, and compute the net amount payable (with a CAD conversion).",
        edges,
        events: [
            createWorkflowEvent({
                createdAt: SAMPLE_CREATED_AT,
                message: "Employee Expense Reimbursement initialized.",
                type: "reset_sample"
            })
        ],
        id: LOCAL_WORKFLOW_ID,
        metadata: {
            createdAt: SAMPLE_CREATED_AT,
            createdBy: SYSTEM_USER,
            kind: "generic-fiscal-workflow",
            notes: "Business-operations demo (non-tax): expense report → classify → total → policy → net payable.",
            sampleWorkflow: {
                description: "Expense report → classify receipts → category totals → policy caps → net payable.",
                id: "expense-reimbursement-template",
                label: "Employee Expense Reimbursement"
            },
            tags: [
                "local",
                "expense",
                "reimbursement",
                "expense-reimbursement-template"
            ],
            updatedAt: new Date().toISOString(),
            updatedBy: SYSTEM_USER
        },
        mockRuns,
        name: "Employee Expense Reimbursement",
        outputMappingPreview,
        runtimeUiConfig,
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        status: "draft",
        structure,
        versionSnapshots: [
            initialSnapshot
        ]
    };
}
function createCampaignBudgetWorkflow() {
    const blocks = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$campaign$2d$budget$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAMPAIGN_TEMPLATE_BLOCK_SPECS"].map((spec)=>createWorkflowBlockFromCatalog(spec.catalogId, {
            config: cloneJson(spec.config),
            createdAt: SAMPLE_CREATED_AT,
            description: spec.description,
            id: spec.id,
            label: spec.label,
            position: spec.position,
            sample: true,
            status: "configured",
            updatedAt: SAMPLE_CREATED_AT
        }));
    const edges = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$campaign$2d$budget$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAMPAIGN_TEMPLATE_EDGE_SPECS"].map((spec)=>createWorkflowEdgeRecord({
            bindingLabel: spec.bindingLabel,
            bindingStatus: "valid",
            confidence: 1,
            createdAt: SAMPLE_CREATED_AT,
            id: `campaign-edge-${spec.sourceBlockId}-${spec.targetBlockId}-${spec.sourceOutputRole}`,
            reason: spec.reason,
            relationshipType: spec.relationshipType,
            sourceBlockId: spec.sourceBlockId,
            sourceOutputRole: spec.sourceOutputRole,
            targetBlockId: spec.targetBlockId,
            targetInputRole: spec.targetInputRole
        }));
    const structure = getWorkflowStructure(blocks);
    const runtimeUiConfig = generateRuntimeUiConfigFromParts({
        blocks,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID,
        structure
    });
    const outputMappingPreview = generateOutputMappingPreviewFromParts({
        blocks,
        edges,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID
    });
    const mockRuns = getSampleBlockRuns(blocks);
    const initialSnapshot = {
        aiProposals: [],
        blockCount: blocks.length,
        blockIds: blocks.map((b)=>b.id),
        blocks: cloneJson(blocks),
        changeSummary: "Campaign budget: spend requests → classify channels → channel totals → budget election → projection → approval memo + JSON.",
        createdAt: SAMPLE_CREATED_AT,
        createdBy: SYSTEM_USER,
        edgeCount: edges.length,
        edgeIds: edges.map((e)=>e.id),
        edges: cloneJson(edges),
        id: "version-campaign-budget-v1",
        label: "Campaign Budget v1",
        mockRuns: cloneJson(mockRuns),
        notes: "Non-fiscal demo with a human election step — allocate an approved budget between the committed floor and the budget ceiling.",
        outputMappingPreview: cloneJson(outputMappingPreview),
        runtimeUiConfig: cloneJson(runtimeUiConfig),
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        status: "draft",
        structure: cloneJson(structure),
        validationWarnings: [],
        versionNumber: 1,
        workflowId: LOCAL_WORKFLOW_ID,
        workflowName: "Marketing Campaign Budget Allocation"
    };
    return {
        aiProposals: [],
        blocks,
        description: "Allocate a marketing budget: upload channel spend requests, classify each into a channel, total the ask per channel, elect the approved budget between the committed floor and the budget ceiling, then allocate it and project the return.",
        edges,
        events: [
            createWorkflowEvent({
                createdAt: SAMPLE_CREATED_AT,
                message: "Marketing Campaign Budget Allocation initialized.",
                type: "reset_sample"
            })
        ],
        id: LOCAL_WORKFLOW_ID,
        metadata: {
            createdAt: SAMPLE_CREATED_AT,
            createdBy: SYSTEM_USER,
            kind: "generic-fiscal-workflow",
            notes: "Marketing demo (non-tax) with an election intervention: requests → classify → total → elect approved budget → allocate → project.",
            sampleWorkflow: {
                description: "Spend requests → classify channels → totals → elect approved budget → allocate → project.",
                id: "campaign-budget-template",
                label: "Marketing Campaign Budget Allocation"
            },
            tags: [
                "local",
                "campaign",
                "budget",
                "campaign-budget-template"
            ],
            updatedAt: new Date().toISOString(),
            updatedBy: SYSTEM_USER
        },
        mockRuns,
        name: "Marketing Campaign Budget Allocation",
        outputMappingPreview,
        runtimeUiConfig,
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        status: "draft",
        structure,
        versionSnapshots: [
            initialSnapshot
        ]
    };
}
function createFapiSampleWorkflow() {
    const blockSpecs = getFapiSampleBlockSpecs();
    const blocks = blockSpecs.map((spec)=>createWorkflowBlockFromCatalog(spec.catalogId, {
            id: spec.id,
            label: spec.label,
            description: spec.description,
            position: spec.position,
            config: spec.config,
            status: spec.status || "configured",
            createdAt: SAMPLE_CREATED_AT,
            updatedAt: SAMPLE_CREATED_AT,
            sample: true
        }));
    const edges = getFapiSampleEdges();
    const proposalBlock = createWorkflowBlockFromCatalog("ai:ai-workflow-proposal", {
        id: "proposal-ai-review-pack-improvements",
        label: "AI Proposal: Evidence Pack Improvements",
        description: "Proposal object only. Approval would be required before mutating the graph.",
        position: {
            x: 1420,
            y: 740
        },
        createdAt: SAMPLE_CREATED_AT,
        updatedAt: SAMPLE_CREATED_AT,
        sample: true
    });
    const proposalEdge = createWorkflowEdgeRecord({
        id: "proposal-edge-mapping-suggestion",
        sourceBlockId: proposalBlock.id,
        targetBlockId: "logic-classify-source-rows",
        relationshipType: "suggests_mapping",
        reason: "AI proposal suggests a mapping refinement for classified rows.",
        status: "proposed",
        confidence: 0.72,
        createdAt: SAMPLE_CREATED_AT
    });
    const structure = getWorkflowStructure(blocks);
    const runtimeUiConfig = generateRuntimeUiConfigFromParts({
        blocks,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID,
        structure
    });
    const outputMappingPreview = generateOutputMappingPreviewFromParts({
        blocks,
        edges,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID
    });
    const mockRuns = getSampleBlockRuns(blocks);
    const aiProposals = [
        {
            id: "ai-proposal-fapi-review-pack",
            title: "Evidence pack refinement",
            originalPrompt: "Suggest a stronger review pack for the FAPI sample workflow.",
            interpretedPlan: "Add a proposal-only evidence pack refinement after output readiness.",
            selectedTools: [
                "local block catalog",
                "mock proposal writer"
            ],
            generatedBlocks: [
                proposalBlock
            ],
            generatedEdges: [
                proposalEdge
            ],
            generatedCodeOrFormulas: [
                {
                    blockId: proposalBlock.id,
                    kind: "code",
                    value: "return { success: true, data: { proposedArtifact: 'enhancedEvidencePack' } };"
                }
            ],
            status: "proposed",
            createdAt: SAMPLE_CREATED_AT,
            createdBy: "mock-ai-panel",
            confidence: 0.72,
            notes: "Sample proposal object only. Approval is required before graph changes.",
            history: [
                {
                    id: "ai-proposal-fapi-review-pack-created",
                    action: "created",
                    by: "mock-ai-panel",
                    at: SAMPLE_CREATED_AT,
                    notes: "Seeded sample proposal."
                }
            ]
        }
    ];
    const initialSnapshot = {
        id: "version-fapi-sample-v1",
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        workflowId: LOCAL_WORKFLOW_ID,
        workflowName: "Executable Mapping Demo - FAPI-inspired sample",
        versionNumber: 1,
        label: "Initial FAPI-inspired sample",
        status: "draft",
        createdBy: SYSTEM_USER,
        createdAt: SAMPLE_CREATED_AT,
        changeSummary: "Initial schema-driven sample with source, logic, validation, protected, output, and AI proposal objects.",
        blockCount: blocks.length,
        edgeCount: edges.length,
        blockIds: blocks.map((block)=>block.id),
        edgeIds: edges.map((edge)=>edge.id),
        blocks: cloneJson(blocks),
        edges: cloneJson(edges),
        structure: cloneJson(structure),
        runtimeUiConfig: cloneJson(runtimeUiConfig),
        outputMappingPreview: cloneJson(outputMappingPreview),
        aiProposals: cloneJson(aiProposals),
        mockRuns: cloneJson(mockRuns),
        notes: "Original local sample workflow.",
        validationWarnings: []
    };
    return {
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        id: LOCAL_WORKFLOW_ID,
        name: "Executable Mapping Demo - FAPI-inspired sample",
        description: "Schema-driven local prototype sample for a generic fiscal workflow studio.",
        status: "draft",
        metadata: {
            kind: "generic-fiscal-workflow",
            sampleWorkflow: {
                id: "fapi-inspired-sample",
                label: "FAPI-inspired sample",
                description: "First sample workflow only. The studio model remains generic."
            },
            tags: [
                "local",
                "prototype",
                "sample",
                "fapi-inspired"
            ],
            createdBy: SYSTEM_USER,
            createdAt: SAMPLE_CREATED_AT,
            updatedBy: SYSTEM_USER,
            updatedAt: new Date().toISOString(),
            notes: "No live OCR, AI, Taxprep, ONESOURCE, or backend integration is included."
        },
        blocks,
        edges,
        structure,
        runtimeUiConfig,
        outputMappingPreview,
        mockRuns,
        versionSnapshots: [
            initialSnapshot
        ],
        aiProposals,
        events: [
            createWorkflowEvent({
                type: "reset_sample",
                message: "FAPI-inspired sample workflow initialized locally.",
                createdAt: SAMPLE_CREATED_AT
            })
        ]
    };
}
// ─────────────────────────────────────────────────────────────────────────────
// Sinaxe portfolio workflows — generic builder.
//
// Turns any declarative `PortfolioWorkflowDef` (Tier-1 / Foundation portfolio
// workflows + Platform Services, see templates/portfolio/portfolio-workflows.ts)
// into a LocalWorkflowSnapshot the builder can load, edit and save — reusing the
// exact same snapshot pipeline as the FAPI / Roulement templates. One function
// serves all portfolio workflows; block ids are prefixed with the workflow id so
// every id is globally unique, and positions derive from stage (column) + row.
// ─────────────────────────────────────────────────────────────────────────────
const PORTFOLIO_COL_WIDTH = 340;
const PORTFOLIO_ROW_HEIGHT = 150;
function createPortfolioWorkflow(def) {
    const nid = (localId)=>`${def.id}--${localId}`;
    const blocks = def.blocks.map((spec)=>createWorkflowBlockFromCatalog(spec.catalogId, {
            config: cloneJson(spec.config ?? {}),
            createdAt: SAMPLE_CREATED_AT,
            description: spec.description,
            id: nid(spec.id),
            label: spec.label,
            position: {
                x: spec.stage * PORTFOLIO_COL_WIDTH,
                y: spec.row * PORTFOLIO_ROW_HEIGHT
            },
            sample: true,
            status: "configured",
            updatedAt: SAMPLE_CREATED_AT
        }));
    const edges = def.edges.map((spec, index)=>createWorkflowEdgeRecord({
            bindingLabel: spec.label,
            bindingStatus: "valid",
            confidence: 1,
            createdAt: SAMPLE_CREATED_AT,
            id: `${def.id}--edge-${index}-${spec.from}-${spec.to}`,
            reason: spec.reason || spec.label,
            relationshipType: spec.rel ?? "provides_data_to",
            sourceBlockId: nid(spec.from),
            sourceOutputRole: spec.fromRole,
            targetBlockId: nid(spec.to),
            targetInputRole: spec.toRole
        }));
    const structure = getWorkflowStructure(blocks);
    const runtimeUiConfig = generateRuntimeUiConfigFromParts({
        blocks,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID,
        structure
    });
    const outputMappingPreview = generateOutputMappingPreviewFromParts({
        blocks,
        edges,
        generatedAt: SAMPLE_CREATED_AT,
        sourceWorkflowId: LOCAL_WORKFLOW_ID
    });
    const mockRuns = getSampleBlockRuns(blocks);
    const initialSnapshot = {
        aiProposals: [],
        blockCount: blocks.length,
        blockIds: blocks.map((block)=>block.id),
        blocks: cloneJson(blocks),
        changeSummary: `${def.name} — Sinaxe portfolio workflow initialized.`,
        createdAt: SAMPLE_CREATED_AT,
        createdBy: SYSTEM_USER,
        edgeCount: edges.length,
        edgeIds: edges.map((edge)=>edge.id),
        edges: cloneJson(edges),
        id: `version-${def.id}-v1`,
        label: `${def.name} v1`,
        mockRuns: cloneJson(mockRuns),
        notes: "Sinaxe portfolio blueprint — Trigger → Sources → AI/Logic → judgment checkpoints → Field → Output, mapped from the Canadian Corporate Tax Workflow Portfolio.",
        outputMappingPreview: cloneJson(outputMappingPreview),
        runtimeUiConfig: cloneJson(runtimeUiConfig),
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        status: "draft",
        structure: cloneJson(structure),
        validationWarnings: [],
        versionNumber: 1,
        workflowId: LOCAL_WORKFLOW_ID,
        workflowName: def.name
    };
    return {
        aiProposals: [],
        blocks,
        description: def.description,
        edges,
        events: [
            createWorkflowEvent({
                createdAt: SAMPLE_CREATED_AT,
                message: `${def.name} initialized.`,
                type: "reset_sample"
            })
        ],
        id: LOCAL_WORKFLOW_ID,
        metadata: {
            createdAt: SAMPLE_CREATED_AT,
            createdBy: SYSTEM_USER,
            kind: "generic-fiscal-workflow",
            notes: "Sinaxe portfolio blueprint. No live OCR, AI, form-generation or backend integration is included — blocks depict the standardized workflow structure.",
            sampleWorkflow: {
                description: def.description,
                id: def.id,
                label: def.name
            },
            tags: [
                "local",
                "sinaxe-portfolio",
                def.group,
                def.id
            ],
            updatedAt: new Date().toISOString(),
            updatedBy: SYSTEM_USER
        },
        mockRuns,
        name: def.name,
        outputMappingPreview,
        runtimeUiConfig,
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        status: "draft",
        structure,
        versionSnapshots: [
            initialSnapshot
        ]
    };
}
function createPortfolioWorkflowById(id) {
    const def = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$portfolio$2f$portfolio$2d$workflows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPortfolioWorkflowDef"])(id);
    return def ? createPortfolioWorkflow(def) : null;
}
/** A blank starter workflow — a single Start trigger — for "New workflow". */ const BLANK_WORKFLOW_DEF = {
    id: "new-workflow",
    name: "New workflow",
    description: "A blank workflow — add blocks in Build to define it.",
    group: "foundation",
    sub: "New",
    blocks: [
        {
            catalogId: "trigger:manual",
            id: "start",
            label: "Start",
            description: "Manual start of the workflow",
            stage: 0,
            row: 0
        }
    ],
    edges: []
};
function createBlankWorkflow() {
    return createPortfolioWorkflow(BLANK_WORKFLOW_DEF);
}
;
function loadLocalWorkflowSnapshot() {
    return readStoredWorkflowDefinition();
}
function loadLocalWorkflowSnapshotResult() {
    return readStoredWorkflowDefinitionResult();
}
function saveLocalWorkflowSnapshot({ description, edges, event, name, nodes, status }) {
    const existing = readStoredWorkflowDefinition();
    const snapshot = createWorkflowDefinitionFromCanvas({
        description,
        edges,
        existing,
        name,
        nodes,
        status: status || existing?.status || "draft"
    });
    snapshot.events = appendWorkflowEvent(snapshot, event);
    if ("TURBOPACK compile-time truthy", 1) {
        window.localStorage.setItem(LOCAL_WORKFLOW_STORAGE_KEY, JSON.stringify(snapshot, null, 2));
    }
    return snapshot;
}
function saveWorkflowDefinitionSnapshot(snapshot) {
    if ("TURBOPACK compile-time truthy", 1) {
        window.localStorage.setItem(LOCAL_WORKFLOW_STORAGE_KEY, JSON.stringify(snapshot, null, 2));
    }
    return snapshot;
}
function lockProtectedBlocksForRuntime(blocks) {
    return blocks;
}
function validateLocalPublish({ definition, outputMappingPreview }) {
    const warnings = [];
    if (definition.blocks.length === 0) {
        warnings.push("Workflow has no typed blocks.");
    }
    const outputBlocks = definition.blocks.filter((block)=>block.family === "Output");
    if (outputBlocks.length === 0) {
        warnings.push("No Output blocks are represented in the workflow.");
    }
    const blockIds = new Set(definition.blocks.map((block)=>block.id));
    const invalidEdges = definition.edges.filter((edge)=>!(blockIds.has(edge.sourceBlockId) && blockIds.has(edge.targetBlockId)));
    if (invalidEdges.length > 0) {
        warnings.push(`${invalidEdges.length} relationship(s) reference missing blocks.`);
    }
    const proposedOutputEdges = definition.edges.filter((edge)=>edge.status !== "active" && isOutputMappingRelationshipType(edge.relationshipType));
    if (proposedOutputEdges.length > 0) {
        warnings.push("Proposed, rejected, or disabled output mapping relationships were excluded from readiness.");
    }
    const candidateLogicOutputEdges = definition.edges.filter((edge)=>edge.status === "active" && isCandidateOutputRelationshipType(edge.relationshipType));
    if (candidateLogicOutputEdges.length > 0) {
        warnings.push(LOGIC_OUTPUT_GOVERNANCE_WARNING);
    }
    for (const output of outputMappingPreview.outputs){
        if (output.readinessStatus !== "ready") {
            warnings.push(`${output.outputLabel} is ${output.readinessStatus}: ${output.missingRequirements.join(", ")}`);
        }
    }
    return warnings;
}
function publishWorkflowDefinition(definition, options = {}) {
    const now = new Date().toISOString();
    const lockedBlocks = lockProtectedBlocksForRuntime(definition.blocks);
    const structure = getWorkflowStructure(lockedBlocks);
    const nextVersionNumber = Math.max(0, ...definition.versionSnapshots.map((item)=>item.versionNumber)) + 1;
    const snapshotId = `version-${definition.id}-v${nextVersionNumber}-${Date.now()}`;
    const runtimeUiConfig = generateRuntimeUiConfigFromParts({
        blocks: lockedBlocks,
        generatedAt: now,
        sourceSnapshotId: snapshotId,
        sourceWorkflowId: definition.id,
        structure
    });
    const outputMappingPreview = generateOutputMappingPreviewFromParts({
        blocks: lockedBlocks,
        edges: definition.edges,
        generatedAt: now,
        sourceSnapshotId: snapshotId,
        sourceWorkflowId: definition.id
    });
    const workflowForValidation = {
        ...definition,
        blocks: lockedBlocks,
        outputMappingPreview,
        runtimeUiConfig,
        status: "published",
        structure
    };
    const warnings = validateLocalPublish({
        definition: workflowForValidation,
        outputMappingPreview
    });
    const snapshot = {
        id: snapshotId,
        schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
        workflowId: definition.id,
        workflowName: definition.name,
        versionNumber: nextVersionNumber,
        label: `Published v${nextVersionNumber}`,
        status: "published",
        createdBy: SYSTEM_USER,
        createdAt: now,
        changeSummary: options.notes || `Local publish frozen with ${lockedBlocks.length} blocks and ${definition.edges.length} relationships.`,
        blockCount: lockedBlocks.length,
        edgeCount: definition.edges.length,
        blockIds: lockedBlocks.map((block)=>block.id),
        edgeIds: definition.edges.map((edge)=>edge.id),
        blocks: cloneJson(lockedBlocks),
        edges: cloneJson(definition.edges),
        structure: cloneJson(structure),
        runtimeUiConfig: cloneJson(runtimeUiConfig),
        outputMappingPreview: cloneJson(outputMappingPreview),
        aiProposals: cloneJson(definition.aiProposals),
        mockRuns: cloneJson(definition.mockRuns),
        notes: options.notes,
        validationWarnings: warnings
    };
    const workflow = {
        ...workflowForValidation,
        metadata: {
            ...definition.metadata,
            updatedBy: SYSTEM_USER,
            updatedAt: now
        },
        versionSnapshots: [
            ...definition.versionSnapshots,
            snapshot
        ],
        latestPublishedVersionId: snapshot.id,
        publishedVersion: {
            id: snapshot.id,
            versionNumber: snapshot.versionNumber,
            createdAt: snapshot.createdAt
        },
        events: appendWorkflowEvent(definition, createWorkflowEvent({
            type: "publish_snapshot",
            message: `Published local version ${snapshot.versionNumber}.`,
            createdAt: now,
            details: {
                outputPreviewCount: outputMappingPreview.outputs.length,
                runtimeSectionCount: runtimeUiConfig.sections.length,
                validationWarnings: warnings
            }
        }))
    };
    return {
        snapshot,
        workflow,
        warnings
    };
}
function publishLocalWorkflowSnapshot({ description, edges, name, nodes, notes }) {
    const draft = createWorkflowDefinitionFromCanvas({
        description,
        edges,
        existing: readStoredWorkflowDefinition(),
        name,
        nodes,
        status: "published"
    });
    const result = publishWorkflowDefinition(draft, {
        notes
    });
    saveWorkflowDefinitionSnapshot(result.workflow);
    return result;
}
function parseLocalWorkflowJson(text) {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed.blocks)) {
        return normalizeWorkflowDefinition(parsed);
    }
    if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
        const canvasEdges = parsed.edges.map((edge)=>({
                ...edge,
                type: edge.type || "animated"
            }));
        return createWorkflowDefinitionFromCanvas({
            name: parsed.name || "Imported Fiscal Workflow",
            description: parsed.description || "Imported local workflow.",
            nodes: parsed.nodes,
            edges: canvasEdges,
            status: parsed.status || "draft"
        });
    }
    throw new Error("Imported JSON must include typed blocks or legacy nodes.");
}
function loadLocalRunRecords() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const stored = window.localStorage.getItem(LOCAL_RUNS_STORAGE_KEY);
        if (!stored) {
            return [];
        }
        const records = JSON.parse(stored);
        return records.map((record)=>({
                execution: {
                    ...record.execution,
                    startedAt: new Date(record.execution.startedAt),
                    completedAt: record.execution.completedAt ? new Date(record.execution.completedAt) : null
                },
                logs: record.logs.map((log)=>({
                        ...log,
                        startedAt: new Date(log.startedAt),
                        completedAt: log.completedAt ? new Date(log.completedAt) : null
                    }))
            }));
    } catch  {
        return [];
    }
}
const RUN_RECORD_ARRAY_PREVIEW_LIMIT = 120;
const RUN_RECORD_OBJECT_KEY_LIMIT = 80;
const RUN_RECORD_MAX_DEPTH = 7;
function isLocalRunExecutionId(executionId) {
    return Boolean(executionId?.startsWith("local-tool-") || executionId?.startsWith("local-run-"));
}
function compactRunRecordValue(value, depth = 0) {
    if (value === null || value === undefined || typeof value === "boolean" || typeof value === "number" || typeof value === "string") {
        return value;
    }
    if (depth >= RUN_RECORD_MAX_DEPTH) {
        return "[truncated depth]";
    }
    if (Array.isArray(value)) {
        const preview = value.slice(0, RUN_RECORD_ARRAY_PREVIEW_LIMIT).map((item)=>compactRunRecordValue(item, depth + 1));
        return value.length > RUN_RECORD_ARRAY_PREVIEW_LIMIT ? [
            ...preview,
            {
                omittedCount: value.length - RUN_RECORD_ARRAY_PREVIEW_LIMIT,
                truncated: true
            }
        ] : preview;
    }
    if (typeof value !== "object") {
        return String(value);
    }
    const entries = Object.entries(value);
    const compacted = Object.fromEntries(entries.slice(0, RUN_RECORD_OBJECT_KEY_LIMIT).map(([key, item])=>[
            key,
            compactRunRecordValue(item, depth + 1)
        ]));
    return entries.length > RUN_RECORD_OBJECT_KEY_LIMIT ? {
        ...compacted,
        omittedKeyCount: entries.length - RUN_RECORD_OBJECT_KEY_LIMIT,
        truncated: true
    } : compacted;
}
function compactLocalRunRecord(record) {
    return {
        execution: record.execution,
        logs: record.logs.map((log)=>({
                ...log,
                input: compactRunRecordValue(log.input),
                output: compactRunRecordValue(log.output)
            }))
    };
}
function minimalLocalRunRecord(record) {
    return {
        execution: record.execution,
        logs: record.logs.map((log)=>({
                ...log,
                input: undefined,
                output: {
                    compacted: true,
                    message: "Detailed local run payload was too large for browser storage. Re-run the workflow to inspect current results.",
                    status: log.status
                }
            }))
    };
}
function persistLocalRunRecords(records) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        window.localStorage.setItem(LOCAL_RUNS_STORAGE_KEY, JSON.stringify(records, null, 2));
        return true;
    } catch (error) {
        console.warn("Local run history was too large to store.", error);
        return false;
    }
}
function saveLocalRunRecord(record) {
    const records = [
        record,
        ...loadLocalRunRecords()
    ].slice(0, 12);
    if (persistLocalRunRecords(records)) {
        return records;
    }
    if (persistLocalRunRecords([
        record
    ])) {
        return [
            record
        ];
    }
    const compactRecords = records.map(compactLocalRunRecord).slice(0, 4);
    if (persistLocalRunRecords(compactRecords)) {
        return compactRecords;
    }
    const compactCurrentRecord = compactLocalRunRecord(record);
    if (persistLocalRunRecords([
        compactCurrentRecord
    ])) {
        return [
            compactCurrentRecord
        ];
    }
    const minimalRecords = [
        minimalLocalRunRecord(record)
    ];
    persistLocalRunRecords(minimalRecords);
    return minimalRecords;
}
function clearLocalRunRecords() {
    if ("TURBOPACK compile-time truthy", 1) {
        window.localStorage.removeItem(LOCAL_RUNS_STORAGE_KEY);
    }
}
function getFiscalOutputForStage(stage, nodeLabel, block) {
    if (block?.source) {
        return {
            block: block.label,
            family: block.family,
            subtype: block.subtype,
            immutable: block.source.immutable,
            treatedAsEvidence: block.source.treatedAsEvidence,
            locator: block.source.locator,
            valuesLocked: block.source.valuesLocked
        };
    }
    if (block?.governance) {
        return {
            block: block.label,
            family: block.family,
            protectedKind: block.governance.protectedKind,
            lockedInRuntime: block.governance.lockedInRuntime,
            requiresUnlockToEdit: block.governance.requiresUnlockToEdit,
            outputKey: block.runtime.outputKey
        };
    }
    switch(stage){
        case "source":
            return {
                dataset: LOCAL_SAMPLE_DATASET.entity,
                period: LOCAL_SAMPLE_DATASET.period,
                immutable: true,
                sourceDocuments: LOCAL_SAMPLE_DATASET.sourceDocuments,
                rowCount: LOCAL_SAMPLE_DATASET.rows.length
            };
        case "logic":
            return {
                derivedFields: [
                    "jurisdictionClassification",
                    "provisionalTaxBase",
                    "protectedInputFlag"
                ],
                provisionalTaxBase: LOCAL_SAMPLE_DATASET.rows.reduce((total, row)=>total + row.revenue - row.deductibleExpenses, 0),
                method: "local mock calculation"
            };
        case "review":
        case "validation":
            return {
                checksPassed: 5,
                checksWarned: 1,
                warnings: [
                    "UK withholding reserve requires reviewer signoff"
                ],
                trustworthy: true
            };
        case "output":
            return {
                artifacts: [
                    "review_packet.json",
                    "taxprep_bridge.csv"
                ],
                handoffReady: true,
                destination: "download/export only"
            };
        case "ai-agent":
            return {
                proposalOnly: true,
                directMutation: false,
                status: "proposal retained for approval"
            };
        default:
            return {
                block: nodeLabel,
                status: "completed by local mock runner"
            };
    }
}
function createLocalRunRecord(nodes, edges) {
    const startedAt = new Date();
    const completedAt = new Date(startedAt.getTime() + 640);
    const executionId = `local-run-${startedAt.getTime()}`;
    const orderedNodes = nodes.filter((node)=>node.type !== "add");
    const logs = orderedNodes.map((node, index)=>{
        const block = node.data.block;
        const stage = node.data.config?.fiscalStage || (block ? BLOCK_FAMILY_STAGE[block.family] : undefined) || node.data.visualRole || node.data.type;
        const stepStartedAt = new Date(startedAt.getTime() + index * 110);
        const stepCompletedAt = new Date(stepStartedAt.getTime() + 95);
        const nodeLabel = node.data.label || getFiscalStageLabel(stage);
        return {
            id: `${executionId}-${node.id}`,
            executionId,
            nodeId: node.id,
            nodeName: nodeLabel,
            nodeType: block ? `${block.family} / ${block.subtype}` : getFiscalStageLabel(stage),
            status: "success",
            startedAt: stepStartedAt,
            completedAt: stepCompletedAt,
            duration: "95",
            input: {
                upstreamEdges: edges.filter((edge)=>edge.target === node.id).length,
                stage
            },
            output: getFiscalOutputForStage(stage, nodeLabel, block),
            error: null
        };
    });
    return {
        execution: {
            id: executionId,
            workflowId: LOCAL_WORKFLOW_ID,
            status: "success",
            startedAt,
            completedAt,
            duration: String(completedAt.getTime() - startedAt.getTime()),
            error: null
        },
        logs
    };
}
function getSampleBlockRuns(blocks) {
    return blocks.slice(0, 8).map((block, index)=>({
            id: `sample-run-${block.id}`,
            blockId: block.id,
            blockLabel: block.label,
            status: index === 2 ? "warning" : "success",
            startedAt: SAMPLE_CREATED_AT,
            completedAt: SAMPLE_CREATED_AT,
            durationMs: 95,
            input: {
                mock: true
            },
            output: {
                outputKey: block.runtime.outputKey,
                mockOnly: true
            }
        }));
}
function getFapiSampleBlockSpecs() {
    const x = {
        source: -980,
        logic: -620,
        review: -260,
        protectedInput: 100,
        official: 460,
        summary: 820,
        output: 1180
    };
    const y = (row)=>-520 + row * 150;
    return [
        {
            catalogId: "source:excel-workbook",
            id: "source-trial-balance",
            label: "Trial Balance Rows",
            description: "Manual table source for the first sample fiscal workflow",
            position: {
                x: x.source,
                y: y(1)
            },
            config: {
                manualRows: [
                    {
                        account: "4000",
                        amount: 12_000,
                        label: "Interest income",
                        rowId: "tb-row-interest-income"
                    },
                    {
                        account: "4100",
                        amount: 8000,
                        label: "Rental income",
                        rowId: "tb-row-rental-income"
                    },
                    {
                        account: "5000",
                        amount: -600,
                        label: "Bank charges",
                        rowId: "tb-row-bank-charges"
                    },
                    {
                        account: "5200",
                        amount: -1200,
                        label: "Professional fees",
                        rowId: "tb-row-professional-fees"
                    },
                    {
                        account: "6000",
                        amount: 3000,
                        label: "Other revenue",
                        rowId: "tb-row-other-revenue"
                    }
                ],
                outputs: "trialBalanceRows",
                sourceKind: "manual_table",
                sourceLocator: "trial-balance.xlsx#TB!A:K",
                canvasNodeType: "trigger",
                toolId: "source.manual_table"
            }
        },
        {
            catalogId: "source:keyword-rules",
            id: "source-keyword-rules",
            label: "Keyword Rulebook",
            description: "Editable keyword rulebook for local keyword mapping",
            position: {
                x: x.source,
                y: y(0)
            },
            config: {
                keywordRules: [
                    {
                        confidence: 0.9,
                        keywords: [
                            "interest income",
                            "interest earned",
                            "bank interest"
                        ],
                        lineId: "A",
                        ruleId: "keyword-rule-interest-income",
                        subsectionId: "interest_income",
                        target: "interestIncome"
                    },
                    {
                        confidence: 0.9,
                        keywords: [
                            "rental income",
                            "rent income",
                            "lease income"
                        ],
                        lineId: "A",
                        ruleId: "keyword-rule-rents",
                        subsectionId: "rental_income",
                        target: "rents"
                    },
                    {
                        confidence: 0.8,
                        keywords: [
                            "bank charges",
                            "office expenses",
                            "general expenses"
                        ],
                        lineId: "EXPENSES",
                        ruleId: "keyword-rule-general-expenses",
                        subsectionId: "general_expenses",
                        target: "generalExpenses"
                    },
                    {
                        confidence: 0.8,
                        keywords: [
                            "professional fees",
                            "accounting fees",
                            "audit fees"
                        ],
                        lineId: "EXPENSES",
                        ruleId: "keyword-rule-accounting-expenses",
                        subsectionId: "extra_expenses",
                        target: "accountingExpenses"
                    },
                    {
                        confidence: 0.7,
                        keywords: [
                            "other revenue",
                            "miscellaneous income",
                            "sundry income"
                        ],
                        lineId: "A",
                        ruleId: "keyword-rule-other-fapi-income",
                        subsectionId: "other_fapi_income",
                        target: "otherFapiIncome"
                    }
                ],
                outputs: "keywordRules",
                sourceKind: "keyword_rules",
                sourceLocator: "manual-source://keyword-rules",
                toolId: "source.keyword_rules"
            }
        },
        {
            catalogId: "source:pdf-document",
            id: "source-financial-statements-notes",
            label: "Financial statements and notes",
            description: "PDF / Document support for statements and notes",
            position: {
                x: x.source,
                y: y(2)
            },
            config: {
                outputs: "financialStatementEvidence",
                sourceLocator: "financial-statements.pdf#notes"
            }
        },
        {
            catalogId: "source:manual-entry",
            id: "source-fx-rate-override",
            label: "FX Rate",
            description: "Manual value source for the sample FX rate",
            position: {
                x: x.source,
                y: y(3)
            },
            config: {
                toolId: "source.manual_value",
                unit: "CAD/USD",
                value: 1.35,
                valueLabel: "FX Rate",
                outputs: "fxRateOverride",
                sourceLocator: "manual-entry://fx-rate-override",
                valuePreview: "1.3500 CAD/USD"
            }
        },
        {
            catalogId: "source:manual-entry",
            id: "source-inclusion-rate-constant",
            label: "Inclusion rate constant",
            description: "Manual Entry source for inclusion rate or constant",
            position: {
                x: x.source,
                y: y(4)
            },
            config: {
                toolId: "source.manual_value",
                value: 0.5,
                valueLabel: "Inclusion Rate",
                outputs: "inclusionRateConstant",
                sourceLocator: "manual-entry://inclusion-rate",
                valuePreview: "50%"
            }
        },
        {
            catalogId: "source:api-http-request",
            id: "source-fx-rate-api",
            label: "FX rate API source",
            description: "Mock source value for FX rates; no API call is made",
            position: {
                x: x.source,
                y: y(5)
            },
            config: {
                toolId: "source.manual_value",
                unit: "CAD/USD",
                value: 1.34,
                valueLabel: "Reference FX Rate",
                outputs: "fxRateApiResponse",
                sourceLocator: "https://rates.example.test/fx/CAD/USD"
            }
        },
        {
            catalogId: "logic:classification-mapping",
            id: "logic-classify-source-rows",
            label: "Keyword Mapper",
            description: "Map trial balance rows using connected keyword Sources",
            position: {
                x: x.logic,
                y: y(0)
            },
            config: {
                inputs: "trialBalanceRows, keywordRules",
                lowConfidenceThreshold: 0.75,
                outputs: "classifiedRows",
                toolId: "logic.keyword_mapper"
            }
        },
        {
            catalogId: "logic:aggregation",
            id: "logic-property-income",
            label: "Property income aggregation",
            description: "Aggregation of mapped income rows",
            position: {
                x: x.logic,
                y: y(1)
            },
            config: {
                aggregationMethod: "sum",
                amountField: "amount",
                includeTargets: [
                    "interestIncome",
                    "rents",
                    "otherFapiIncome"
                ],
                inputs: "classifiedRows",
                outputs: "propertyIncome",
                toolId: "logic.aggregation"
            }
        },
        {
            catalogId: "logic:aggregation",
            id: "logic-capital-gains-losses",
            label: "Capital gains / losses aggregation",
            description: "Aggregation of capital gains and losses",
            position: {
                x: x.logic,
                y: y(2)
            },
            config: {
                aggregationMethod: "sum",
                includeTargets: [
                    "capital_gain"
                ],
                inputs: "classifiedRows",
                outputs: "capitalGainsLosses",
                toolId: "logic.aggregation"
            }
        },
        {
            catalogId: "logic:aggregation",
            id: "logic-expenses-deductions",
            label: "Expenses and deductions aggregation",
            description: "Aggregation of expense and deduction rows",
            position: {
                x: x.logic,
                y: y(3)
            },
            config: {
                aggregationMethod: "sum",
                includeTargets: [
                    "generalExpenses",
                    "accountingExpenses"
                ],
                inputs: "classifiedRows",
                outputs: "expensesDeductions",
                toolId: "logic.aggregation"
            }
        },
        {
            catalogId: "logic:formula",
            id: "logic-taxable-capital-gains",
            label: "Apply FX Rate Formula",
            description: "Safe local formula applying FX rate to mapped income",
            position: {
                x: x.logic,
                y: y(4)
            },
            config: {
                formula: "propertyIncome * fxRateOverride",
                inputs: "propertyIncome, fxRateOverride",
                operands: [
                    "logic-property-income.subtotal",
                    "source-fx-rate-override.value"
                ],
                operation: "multiply",
                outputs: "sampleFiscalResult",
                toolId: "logic.formula"
            }
        },
        {
            catalogId: "logic:formula",
            id: "logic-fat-deduction",
            label: "FAT deduction calculation",
            description: "Formula for foreign accrual tax deduction",
            position: {
                x: x.logic,
                y: y(5)
            },
            config: {
                formula: "fatPaid * rtf",
                inputs: "fatPaid, relevantTaxFactor",
                outputs: "fatDeduction"
            }
        },
        {
            catalogId: "logic:transformation",
            id: "logic-fx-conversion",
            label: "FX conversion and normalization",
            description: "Transformation for FX conversion or normalization",
            position: {
                x: x.logic,
                y: y(6)
            },
            config: {
                inputs: "fxRateApiResponse, fxRateOverride, documentCurrency",
                outputs: "normalizedAmounts"
            }
        },
        {
            catalogId: "logic:condition",
            id: "logic-missing-source-routing",
            label: "Missing source review routing",
            description: "Condition for missing source or review path routing",
            position: {
                x: x.logic,
                y: y(7)
            },
            config: {
                inputs: "sourceSupportFinding, confidenceWarning",
                outputs: "reviewRoute"
            }
        },
        {
            catalogId: "review:required-input-check",
            id: "review-required-fx-rate",
            label: "FX rate exists",
            description: "Required Input Check for FX rate existence",
            position: {
                x: x.review,
                y: y(1)
            },
            config: {
                inputs: "fxRateApiResponse, fxRateOverride",
                requiredKeys: [
                    "fxRateOverride"
                ],
                toolId: "review.required_input_check"
            }
        },
        {
            catalogId: "review:missing-source-check",
            id: "review-protected-support",
            label: "Protected values have support",
            description: "Missing Source Check for protected values",
            position: {
                x: x.review,
                y: y(2)
            }
        },
        {
            catalogId: "review:low-confidence-warning",
            id: "review-low-confidence",
            label: "Low confidence warning",
            description: "Warning for low-confidence classifications",
            position: {
                x: x.review,
                y: y(3)
            },
            config: {
                threshold: 0.8,
                toolId: "review.low_confidence_warning"
            }
        },
        {
            catalogId: "review:unmatched-rows-check",
            id: "review-unmatched-rows",
            label: "Unmatched rows check",
            description: "Review check for rows not mapped by keyword rules",
            position: {
                x: x.review,
                y: y(4)
            },
            config: {
                toolId: "review.unmatched_rows_check"
            }
        },
        {
            catalogId: "review:manual-override-review",
            id: "review-manual-override",
            label: "Manual override review",
            description: "Review manual override values",
            position: {
                x: x.review,
                y: y(5)
            }
        },
        {
            catalogId: "review:approval-gate",
            id: "review-approval-gate",
            label: "Approval gate",
            description: "Approval Gate before governed outputs",
            position: {
                x: x.review,
                y: y(6)
            },
            config: {
                approved: true,
                notes: "Local sample approval for protected result.",
                reviewer: "Sample Reviewer",
                toolId: "review.approval_gate"
            }
        },
        {
            catalogId: "review:output-readiness-check",
            id: "review-output-readiness",
            label: "Output readiness check",
            description: "Output Readiness Check for handoff artifacts",
            position: {
                x: x.review,
                y: y(7)
            },
            config: {
                toolId: "review.output_readiness_check"
            }
        },
        ...[
            [
                "protected-input-fx-rate",
                "Locked Rate",
                "FX Rate",
                "fxRate"
            ],
            [
                "protected-input-reporting-currency",
                "Protected Input",
                "Reporting Currency",
                "reportingCurrency"
            ],
            [
                "protected-input-document-currency",
                "Protected Input",
                "Document Currency",
                "documentCurrency"
            ],
            [
                "protected-input-fapi-year",
                "Protected Input",
                "FAPI Year / Fiscal Period",
                "fapiFiscalPeriod"
            ],
            [
                "protected-input-inclusion-rate",
                "Locked Rate",
                "Inclusion Rate",
                "inclusionRate"
            ],
            [
                "protected-input-rtf",
                "Locked Rate",
                "RTF / relevant tax factor",
                "relevantTaxFactor"
            ],
            [
                "protected-input-fat-paid",
                "Protected Input",
                "FAT Paid / Foreign Accrual Tax input",
                "fatPaid"
            ]
        ].map(([id, subtype, label, output], index)=>({
                catalogId: subtype === "Locked Rate" ? "protected:locked-rate" : "protected:protected-input",
                id,
                label,
                description: `Protected Input: ${label}`,
                position: {
                    x: x.protectedInput,
                    y: y(index)
                },
                config: {
                    outputs: output
                }
            })),
        ...[
            "A",
            "A.1",
            "A.2",
            "B",
            "C",
            "D",
            "E",
            "F",
            "F.1",
            "G",
            "H"
        ].map((line, index)=>({
                catalogId: "protected:official-line",
                id: `protected-line-${line.toLowerCase().replace(".", "-")}`,
                label: line === "A" ? "Sample Official Fiscal Line A" : `Official Line ${line}`,
                description: `Protected official line ${line}`,
                position: {
                    x: x.official,
                    y: y(index - 1)
                },
                config: {
                    outputs: `officialLine${line.replace(".", "_")}`
                }
            })),
        ...[
            [
                "protected-summary-gross",
                "Gross",
                "gross"
            ],
            [
                "protected-summary-deductions",
                "Deductions",
                "deductions"
            ],
            [
                "protected-summary-fapi-brut",
                "FAPI Brut",
                "fapiBrut"
            ],
            [
                "protected-summary-fat-deduction",
                "FAT Deduction",
                "fatDeduction"
            ],
            [
                "protected-summary-net-fapi",
                "Sample Protected Result",
                "sampleProtectedResult"
            ],
            [
                "protected-summary-fapl-loss",
                "FAPL / loss result",
                "faplLossResult"
            ]
        ].map(([id, label, output], index)=>({
                catalogId: "protected:final-reviewed-amount",
                id,
                label,
                description: `Protected summary result: ${label}`,
                position: {
                    x: x.summary,
                    y: y(index + 1)
                },
                config: {
                    outputs: output,
                    toolId: "protected.protected_result"
                }
            })),
        ...[
            [
                "output-csv-export",
                "output:csv-export",
                "CSV Export"
            ],
            [
                "output-excel-export",
                "output:excel-export",
                "Excel Export"
            ],
            [
                "output-pdf-review-pack",
                "output:pdf-report",
                "PDF Review Pack"
            ],
            [
                "output-evidence-pack",
                "output:evidence-pack",
                "Evidence Pack"
            ],
            [
                "output-canonical-json",
                "output:canonical-json",
                "Canonical JSON"
            ],
            [
                "output-taxprep-handoff",
                "output:taxprep-handoff",
                "Taxprep Handoff"
            ],
            [
                "output-onesource-handoff",
                "output:onesource-handoff",
                "ONESOURCE Handoff"
            ]
        ].map(([id, catalogId, label], index)=>({
                catalogId,
                id,
                label,
                description: `${label} output artifact`,
                position: {
                    x: x.output,
                    y: y(index)
                },
                config: {
                    inputs: "approvedProtectedPacket",
                    toolId: catalogId === "output:canonical-json" ? "output.canonical_json" : "output.evidence_pack_preview"
                }
            }))
    ];
}
function getFapiSampleEdges() {
    // biome-ignore lint/nursery/useMaxParams: Compact sample-edge DSL keeps the graph readable.
    const edge = (sourceBlockId, targetBlockId, relationshipType, reason, confidence = 1, binding)=>createWorkflowEdgeRecord({
            id: `edge-${sourceBlockId}-${targetBlockId}`,
            sourceBlockId,
            targetBlockId,
            relationshipType,
            reason,
            confidence,
            ...binding,
            createdAt: SAMPLE_CREATED_AT
        });
    const edges = [
        edge("source-trial-balance", "logic-classify-source-rows", "extracted_into", "Trial balance rows are extracted into classification logic.", 1, {
            bindingLabel: "Data rows",
            bindingStatus: "valid",
            sourceOutputRole: "rows",
            targetInputRole: "data_rows"
        }),
        edge("source-keyword-rules", "logic-classify-source-rows", "referenced_by", "Keyword rule Source is referenced by the Keyword Mapper.", 1, {
            bindingLabel: "Keyword rules",
            bindingStatus: "valid",
            sourceOutputRole: "keyword_rules",
            targetInputRole: "keyword_rules"
        }),
        edge("source-financial-statements-notes", "logic-classify-source-rows", "referenced_by", "Statements and notes are referenced by source row classification."),
        edge("source-inclusion-rate-constant", "logic-taxable-capital-gains", "provides_data_to", "Inclusion rate provides data to taxable capital gains formula."),
        edge("source-fx-rate-override", "logic-taxable-capital-gains", "provides_data_to", "FX rate source provides the rate for the sample formula."),
        edge("logic-classify-source-rows", "logic-property-income", "aggregates_into", "Classified rows aggregate into property income.", 1, {
            bindingLabel: "Mapped rows",
            bindingStatus: "valid",
            sourceOutputRole: "mapped_rows",
            targetInputRole: "mapped_rows"
        }),
        edge("logic-property-income", "logic-taxable-capital-gains", "transforms_into", "Mapped income aggregation feeds the sample formula."),
        edge("logic-classify-source-rows", "logic-capital-gains-losses", "aggregates_into", "Classified rows aggregate into capital gains and losses.", 1, {
            bindingLabel: "Mapped rows",
            bindingStatus: "valid",
            sourceOutputRole: "mapped_rows",
            targetInputRole: "mapped_rows"
        }),
        edge("logic-classify-source-rows", "logic-expenses-deductions", "aggregates_into", "Classified rows aggregate into expenses and deductions.", 1, {
            bindingLabel: "Mapped rows",
            bindingStatus: "valid",
            sourceOutputRole: "mapped_rows",
            targetInputRole: "mapped_rows"
        }),
        edge("logic-capital-gains-losses", "logic-taxable-capital-gains", "transforms_into", "Capital gains aggregation transforms into taxable capital gains."),
        edge("logic-expenses-deductions", "logic-fat-deduction", "transforms_into", "Deduction aggregation transforms into FAT deduction calculation."),
        edge("source-fx-rate-api", "logic-fx-conversion", "provides_data_to", "API FX source provides data to conversion logic."),
        edge("source-fx-rate-override", "logic-fx-conversion", "referenced_by", "Manual FX override is referenced by conversion logic."),
        edge("logic-fx-conversion", "review-required-fx-rate", "checked_by", "FX conversion is checked for required rate availability."),
        edge("logic-classify-source-rows", "review-low-confidence", "triggers_validation", "Classification confidence requires low-confidence review.", 1, {
            bindingLabel: "Low-confidence rows",
            bindingStatus: "valid",
            sourceOutputRole: "low_confidence_rows",
            targetInputRole: "checked_items"
        }),
        edge("logic-classify-source-rows", "review-unmatched-rows", "triggers_validation", "Unmatched mapped rows require review before governed output.", 1, {
            bindingLabel: "Unmatched rows",
            bindingStatus: "valid",
            sourceOutputRole: "unmatched_rows",
            targetInputRole: "checked_items"
        }),
        edge("logic-missing-source-routing", "review-protected-support", "triggers_validation", "Missing source routing triggers source support validation."),
        edge("logic-missing-source-routing", "review-manual-override", "requires_review_by", "Routing logic requires manual override review when needed."),
        edge("logic-missing-source-routing", "review-approval-gate", "triggers_validation", "Routing logic triggers approval gate validation."),
        edge("logic-missing-source-routing", "review-output-readiness", "triggers_validation", "Routing logic triggers output readiness validation."),
        edge("review-required-fx-rate", "protected-input-fx-rate", "certifies", "Required FX rate check certifies the protected FX Rate input."),
        edge("review-protected-support", "protected-summary-gross", "certifies", "Source support check certifies the protected gross summary."),
        edge("review-manual-override", "protected-input-fx-rate", "approves_for", "Manual override review approves the protected FX Rate input."),
        edge("review-output-readiness", "protected-summary-net-fapi", "certifies", "Output readiness certifies the protected Net FAPI summary.")
    ];
    for (const [source, target] of [
        [
            "logic-fx-conversion",
            "protected-input-fx-rate"
        ],
        [
            "logic-fx-conversion",
            "protected-input-reporting-currency"
        ],
        [
            "logic-fx-conversion",
            "protected-input-document-currency"
        ],
        [
            "logic-taxable-capital-gains",
            "protected-input-inclusion-rate"
        ],
        [
            "logic-fat-deduction",
            "protected-input-rtf"
        ],
        [
            "logic-fat-deduction",
            "protected-input-fat-paid"
        ]
    ]){
        edges.push(edge(source, target, "feeds_protected_input", "Logic feeds a governed protected input."));
    }
    edges.push(edge("logic-taxable-capital-gains", "protected-input-fapi-year", "feeds_protected_input", "Taxable capital gains calculation references the governed fiscal period."));
    for (const target of [
        "protected-input-fx-rate",
        "protected-input-reporting-currency",
        "protected-input-document-currency",
        "protected-input-fapi-year",
        "protected-input-inclusion-rate",
        "protected-input-rtf",
        "protected-input-fat-paid"
    ]){
        edges.push(edge("review-approval-gate", target, "approves_for", "Approval gate approves the governed input."));
    }
    for (const target of [
        "protected-line-a",
        "protected-line-a-1",
        "protected-line-a-2",
        "protected-line-b",
        "protected-line-c",
        "protected-line-d",
        "protected-line-e",
        "protected-line-f",
        "protected-line-f-1",
        "protected-line-g",
        "protected-line-h"
    ]){
        edges.push(edge("review-approval-gate", target, "approves_for", "Approval gate approves the official line."));
    }
    for (const [source, target] of [
        [
            "logic-property-income",
            "protected-line-a"
        ],
        [
            "logic-capital-gains-losses",
            "protected-line-a-1"
        ],
        [
            "logic-taxable-capital-gains",
            "protected-line-a-2"
        ],
        [
            "logic-expenses-deductions",
            "protected-line-b"
        ],
        [
            "logic-fat-deduction",
            "protected-line-c"
        ],
        [
            "logic-fx-conversion",
            "protected-line-d"
        ],
        [
            "logic-fat-deduction",
            "protected-line-e"
        ],
        [
            "logic-taxable-capital-gains",
            "protected-line-f"
        ],
        [
            "logic-fx-conversion",
            "protected-line-f-1"
        ],
        [
            "logic-capital-gains-losses",
            "protected-line-g"
        ],
        [
            "logic-expenses-deductions",
            "protected-line-h"
        ],
        [
            "logic-property-income",
            "protected-summary-gross"
        ],
        [
            "logic-expenses-deductions",
            "protected-summary-deductions"
        ],
        [
            "logic-taxable-capital-gains",
            "protected-summary-fapi-brut"
        ],
        [
            "logic-fat-deduction",
            "protected-summary-fat-deduction"
        ],
        [
            "logic-taxable-capital-gains",
            "protected-summary-net-fapi"
        ],
        [
            "logic-capital-gains-losses",
            "protected-summary-fapl-loss"
        ]
    ]){
        edges.push(edge(source, target, "feeds_protected_result", "Logic feeds a governed protected result."));
    }
    for (const [source, target] of [
        [
            "protected-summary-gross",
            "output-csv-export"
        ],
        [
            "protected-summary-deductions",
            "output-excel-export"
        ],
        [
            "protected-summary-fapi-brut",
            "output-pdf-review-pack"
        ],
        [
            "protected-summary-fat-deduction",
            "output-evidence-pack"
        ],
        [
            "protected-summary-net-fapi",
            "output-canonical-json"
        ],
        [
            "protected-summary-net-fapi",
            "output-evidence-pack"
        ],
        [
            "protected-summary-net-fapi",
            "output-taxprep-handoff"
        ],
        [
            "protected-summary-fapl-loss",
            "output-onesource-handoff"
        ]
    ]){
        edges.push(edge(source, target, target.includes("handoff") ? "included_in_handoff" : "maps_to_output", "Protected summary maps to the local output preview."));
    }
    return edges;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=shared_workflow-engine_local-fiscal-workflow_ts_e5b2ad37._.js.map