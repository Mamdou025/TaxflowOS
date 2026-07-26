(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/shared/workflow-engine/audit/change-log.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "appendWorkflowChangeEvent",
    ()=>appendWorkflowChangeEvent,
    "appendWorkflowChangeEvents",
    ()=>appendWorkflowChangeEvents,
    "clearWorkflowChangeLog",
    ()=>clearWorkflowChangeLog,
    "getWorkflowChangeLogStorageKey",
    ()=>getWorkflowChangeLogStorageKey,
    "readWorkflowChangeLog",
    ()=>readWorkflowChangeLog
]);
const CHANGE_LOG_STORAGE_KEY = "workflow-studio.change-log.v1";
const MAX_STORED_EVENTS = 500;
let memoryChangeLog = [];
function canUseLocalStorage() {
    return ("TURBOPACK compile-time value", "object") !== "undefined" && Boolean(window.localStorage);
}
function readStoredEvents() {
    if (!canUseLocalStorage()) {
        return memoryChangeLog;
    }
    try {
        const stored = window.localStorage.getItem(CHANGE_LOG_STORAGE_KEY);
        if (!stored) {
            return [];
        }
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch  {
        return [];
    }
}
function writeStoredEvents(events) {
    const cappedEvents = events.slice().sort((a, b)=>b.timestamp.localeCompare(a.timestamp)).slice(0, MAX_STORED_EVENTS);
    memoryChangeLog = cappedEvents;
    if (!canUseLocalStorage()) {
        return;
    }
    try {
        window.localStorage.setItem(CHANGE_LOG_STORAGE_KEY, JSON.stringify(cappedEvents));
    } catch  {
    // The audit log is intentionally best-effort for v1 and must not block UI progress.
    }
}
function getWorkflowChangeLogStorageKey() {
    return CHANGE_LOG_STORAGE_KEY;
}
function readWorkflowChangeLog(workflowId) {
    const events = readStoredEvents();
    return workflowId ? events.filter((event)=>event.workflowId === workflowId) : events;
}
function appendWorkflowChangeEvent(event) {
    writeStoredEvents([
        event,
        ...readStoredEvents()
    ]);
}
function appendWorkflowChangeEvents(events) {
    if (events.length === 0) {
        return;
    }
    writeStoredEvents([
        ...events,
        ...readStoredEvents()
    ]);
}
function clearWorkflowChangeLog(workflowId) {
    if (!workflowId) {
        writeStoredEvents([]);
        return;
    }
    writeStoredEvents(readStoredEvents().filter((event)=>event.workflowId !== workflowId));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/audit/workflow-events.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WORKFLOW_AUDIT_EVENT_TYPES",
    ()=>WORKFLOW_AUDIT_EVENT_TYPES,
    "createWorkflowAuditEvent",
    ()=>createWorkflowAuditEvent,
    "summarizeBlockForAudit",
    ()=>summarizeBlockForAudit,
    "summarizeEdgeForAudit",
    ()=>summarizeEdgeForAudit,
    "summarizeWorkflowForAudit",
    ()=>summarizeWorkflowForAudit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$protected$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/domain/workflow/protected-rules.ts [app-client] (ecmascript)");
;
const WORKFLOW_AUDIT_EVENT_TYPES = [
    "ai_proposal_approved",
    "ai_proposal_created",
    "ai_proposal_rejected",
    "block_created",
    "block_deleted",
    "block_duplicated",
    "block_updated",
    "edge_created",
    "edge_deleted",
    "edge_split",
    "edge_updated",
    "protected_block_unlocked",
    "protected_block_updated",
    "source_derived_logic_created",
    "workflow_exported",
    "workflow_imported",
    "workflow_published"
];
function createAuditEventId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return `audit-${crypto.randomUUID()}`;
    }
    return `audit-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
function createWorkflowAuditEvent({ id, timestamp, ...input }) {
    return {
        ...input,
        id: id || createAuditEventId(),
        timestamp: timestamp || new Date().toISOString()
    };
}
function summarizeBlockForAudit(node) {
    if (!node) {
        return;
    }
    const block = node.data.block;
    const config = node.data.config || block?.config || {};
    return {
        configKeys: Object.keys(config).sort(),
        family: block?.family,
        id: node.id,
        immutableSource: block?.source?.immutable || undefined,
        label: node.data.label,
        protected: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$protected$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isGovernedValueBlock"])(block) || undefined,
        status: block?.status,
        subtype: block?.subtype,
        x: Math.round(node.position.x),
        y: Math.round(node.position.y)
    };
}
function summarizeEdgeForAudit(edge) {
    if (!edge) {
        return;
    }
    const workflowEdge = edge.data?.workflowEdge;
    return {
        bindingLabel: edge.data?.bindingLabel || workflowEdge?.bindingLabel,
        bindingStatus: edge.data?.bindingStatus || workflowEdge?.bindingStatus,
        id: edge.id,
        relationshipType: edge.data?.relationshipType || workflowEdge?.relationshipType,
        source: edge.source,
        sourceOutputRole: edge.data?.sourceOutputRole || workflowEdge?.sourceOutputRole,
        status: edge.data?.status || workflowEdge?.status,
        target: edge.target,
        targetInputRole: edge.data?.targetInputRole || workflowEdge?.targetInputRole
    };
}
function summarizeWorkflowForAudit({ edgeCount, name, nodeCount, status }) {
    return {
        edgeCount,
        name,
        nodeCount,
        status
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/block-catalog-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BLOCK_CATALOG",
    ()=>BLOCK_CATALOG
]);
const BLOCK_CATALOG = [
    {
        id: "trigger:manual",
        family: "Trigger",
        subtype: "Manual / On Demand",
        label: "Manual Trigger",
        description: "Start the workflow manually on demand",
        defaultConfig: {
            fiscalStage: "trigger",
            blockFamily: "Trigger",
            outputs: "triggerPayload"
        }
    },
    {
        id: "trigger:schedule",
        family: "Trigger",
        subtype: "Schedule / Cron",
        label: "Schedule Trigger",
        description: "Fire the workflow on a recurring schedule or cron expression",
        defaultConfig: {
            fiscalStage: "trigger",
            blockFamily: "Trigger",
            schedule: "0 9 * * 1",
            outputs: "triggerPayload"
        }
    },
    {
        id: "trigger:webhook",
        family: "Trigger",
        subtype: "Webhook / API Event",
        label: "Webhook Trigger",
        description: "Fire the workflow when an inbound HTTP event is received",
        defaultConfig: {
            fiscalStage: "trigger",
            blockFamily: "Trigger",
            outputs: "triggerPayload"
        }
    },
    {
        id: "source:manual-entry",
        family: "Source",
        subtype: "Manual Entry",
        label: "Manual Entry",
        description: "Evidence value entered by a builder or reviewer",
        defaultConfig: {
            owner: "Builder",
            inputs: "manual value",
            outputs: "manualEntry",
            rulebookRef: "Manual source values are locked as evidence.",
            sourceLocator: "manual-entry",
            toolId: "source.manual_value"
        }
    },
    {
        id: "source:excel-workbook",
        family: "Source",
        subtype: "Excel / Workbook",
        label: "Excel / Workbook",
        description: "Workbook, worksheet, named range, or tabular evidence",
        defaultConfig: {
            owner: "Tax Operations",
            inputs: "workbook",
            outputs: "workbookRows",
            rulebookRef: "Workbook rows are immutable source evidence.",
            sourceLocator: "workbook://sheet/range",
            toolId: "source.manual_table"
        }
    },
    {
        id: "source:pdf-document",
        family: "Source",
        subtype: "PDF / Document",
        label: "PDF / Document",
        description: "Document, statement, note, schedule, or support package",
        defaultConfig: {
            owner: "Tax Operations",
            inputs: "document",
            outputs: "documentEvidence",
            rulebookRef: "Document facts are referenced, not overwritten.",
            sourceLocator: "document://page/section",
            toolId: "source.manual_value"
        }
    },
    {
        id: "source:api-http-request",
        family: "Source",
        subtype: "API / HTTP Request",
        label: "API / HTTP Request",
        description: "Reference value fetched from an external API",
        defaultConfig: {
            owner: "Tax Operations",
            inputs: "request",
            outputs: "apiReference",
            rulebookRef: "API responses are stored as reference evidence.",
            sourceLocator: "https://api.example.test/reference",
            toolId: "source.manual_value"
        }
    },
    {
        id: "source:currency-rate",
        family: "Source",
        subtype: "Currency Rate",
        label: "Bank of Canada FX Rate",
        description: "External FX rate reference for local calculation",
        defaultConfig: {
            documentCurrency: "USD",
            fapiYear: 2025,
            inputs: "Bank of Canada rate lookup",
            outputs: "exchange_rate, rate_metadata",
            overrideRate: 1.35,
            rateProvider: "bank_of_canada",
            rateType: "annual_average",
            reportingCurrency: "CAD",
            rulebookRef: "FX rates are captured as source references, then reviewed/protected downstream.",
            sourceKind: "currency_rate",
            sourceLocator: "bank-of-canada://annual-average/USD-CAD",
            toolId: "source.currency_rate"
        }
    },
    {
        id: "source:database-query",
        family: "Source",
        subtype: "Database Query",
        label: "Database Query",
        description: "Read-only query result used as workflow evidence",
        defaultConfig: {
            owner: "Data Operations",
            inputs: "read-only query",
            outputs: "queryRows",
            rulebookRef: "Database source rows are immutable in the builder.",
            sourceLocator: "database://connection/query",
            toolId: "source.manual_table"
        }
    },
    {
        id: "source:web-url",
        family: "Source",
        subtype: "Web / URL",
        label: "Web / URL",
        description: "Reference page or URL captured as evidence",
        defaultConfig: {
            owner: "Research",
            inputs: "url",
            outputs: "webReference",
            rulebookRef: "Web references are captured as source evidence.",
            sourceLocator: "https://example.test/source",
            toolId: "source.manual_value"
        }
    },
    {
        id: "source:ai-search-result",
        family: "Source",
        subtype: "AI Search Result",
        label: "AI Search Result",
        description: "Search result proposed by an AI or agent, then reviewed",
        defaultConfig: {
            owner: "Review",
            inputs: "reviewed search result",
            outputs: "aiSearchEvidence",
            rulebookRef: "AI search results require downstream review.",
            sourceLocator: "proposal://ai-search-result",
            toolId: "source.manual_value"
        }
    },
    {
        id: "source:keyword-rules",
        family: "Source",
        subtype: "Keyword Rules",
        label: "Keyword Rulebook",
        description: "Editable keyword-to-category rulebook for mapping review",
        defaultConfig: {
            keywordRules: [
                {
                    categoryId: "interest_income",
                    categoryLabel: "Interest Income",
                    confidence: 0.9,
                    keywords: [
                        "interest income",
                        "interest earned",
                        "bank interest"
                    ],
                    ruleId: "keyword-rule-interest-income",
                    suggestedLine: "A"
                },
                {
                    categoryId: "rental_income",
                    categoryLabel: "Rental Income",
                    confidence: 0.9,
                    keywords: [
                        "rental income",
                        "rent income",
                        "lease income"
                    ],
                    ruleId: "keyword-rule-rents",
                    suggestedLine: "A"
                },
                {
                    categoryId: "bank_fees",
                    categoryLabel: "Bank Fees",
                    confidence: 0.8,
                    keywords: [
                        "bank charges",
                        "office expenses",
                        "general expenses"
                    ],
                    ruleId: "keyword-rule-general-expenses",
                    suggestedLine: "EXPENSES"
                },
                {
                    categoryId: "professional_fees",
                    categoryLabel: "Professional Fees",
                    confidence: 0.8,
                    keywords: [
                        "professional fees",
                        "accounting fees",
                        "audit fees"
                    ],
                    ruleId: "keyword-rule-accounting-expenses",
                    suggestedLine: "EXPENSES"
                },
                {
                    categoryId: "other_income",
                    categoryLabel: "Other Income",
                    confidence: 0.7,
                    keywords: [
                        "other revenue",
                        "miscellaneous income",
                        "sundry income"
                    ],
                    ruleId: "keyword-rule-other-fapi-income",
                    suggestedLine: "A"
                }
            ],
            owner: "Fiscal Systems",
            inputs: "draft keyword rulebook",
            outputs: "keyword_rules, rule_metadata, rule_version",
            rulebookRef: "Keyword rulebooks are editable in draft and versioned after use.",
            sourceKind: "keyword_rules",
            sourceLocator: "manual-source://keyword-rules",
            toolId: "source.keyword_rules"
        }
    },
    {
        id: "source:aggregation-rules",
        family: "Source",
        subtype: "Aggregation Rules",
        label: "Aggregation Rulebook",
        description: "Editable rollup and formula rulebook for calculation review",
        defaultConfig: {
            aggregationRules: [
                {
                    children: [],
                    description: "Base income rollup from mapped atomic categories.",
                    includeCategoryIds: [
                        "interest_income",
                        "rental_income",
                        "service_income",
                        "other_income"
                    ],
                    label: "Income Base",
                    nodeId: "income_base",
                    nodeType: "group",
                    operation: "sum",
                    order: 10
                },
                {
                    children: [],
                    description: "Base expense rollup from mapped atomic categories.",
                    includeCategoryIds: [
                        "bank_fees",
                        "professional_fees",
                        "interest_expense"
                    ],
                    label: "Expense Base",
                    nodeId: "expense_base",
                    nodeType: "group",
                    operation: "sum",
                    order: 20
                },
                {
                    children: [],
                    description: "Demonstrates subtracting one rollup from another.",
                    label: "Income After Expenses",
                    nodeId: "income_after_expenses",
                    nodeType: "group",
                    operands: [
                        {
                            label: "Income Base",
                            refId: "income_base",
                            refType: "node"
                        },
                        {
                            label: "Expense Base",
                            refId: "expense_base",
                            refType: "node"
                        }
                    ],
                    operation: "subtract",
                    order: 30
                },
                {
                    children: [],
                    description: "Draft adjustment factor used by Result Z.",
                    label: "Z Adjustment Factor",
                    nodeId: "z_adjustment_factor",
                    nodeType: "constant",
                    operation: "pass_through",
                    order: 40,
                    value: 1
                },
                {
                    children: [],
                    label: "Result Z",
                    nodeId: "Z",
                    nodeType: "final_result",
                    operands: [
                        {
                            label: "Income Base",
                            refId: "income_base",
                            refType: "node"
                        },
                        {
                            label: "Z Adjustment Factor",
                            refId: "z_adjustment_factor",
                            refType: "node"
                        }
                    ],
                    operation: "multiply",
                    order: 50,
                    resultName: "Z"
                },
                {
                    children: [],
                    label: "Result W",
                    nodeId: "W",
                    nodeType: "final_result",
                    operands: [
                        {
                            label: "Expense Base",
                            refId: "expense_base",
                            refType: "node"
                        }
                    ],
                    operation: "sum",
                    order: 60,
                    resultName: "W"
                },
                {
                    children: [],
                    description: "Demonstrates addition of two rollups.",
                    label: "Optional Check Total",
                    nodeId: "optional_check_total",
                    nodeType: "formula",
                    operands: [
                        {
                            label: "Income Base",
                            refId: "income_base",
                            refType: "node"
                        },
                        {
                            label: "Expense Base",
                            refId: "expense_base",
                            refType: "node"
                        }
                    ],
                    operation: "add",
                    order: 70
                }
            ],
            owner: "Fiscal Systems",
            inputs: "draft aggregation rulebook",
            outputs: "aggregation_rules, aggregation_tree, rule_metadata, rule_version",
            rulebookRef: "Aggregation rulebooks are editable in draft and versioned after use.",
            sourceKind: "aggregation_rules",
            sourceLocator: "manual-source://aggregation-rules",
            toolId: "source.aggregation_rules"
        }
    },
    {
        id: "source:rollup-rules",
        family: "Source",
        subtype: "Rollup Rules",
        label: "Rollup Rules Source",
        description: "Editable rulebook for grouping mapped categories into totals",
        defaultConfig: {
            owner: "Fiscal Systems",
            inputs: "draft rollup rulebook",
            outputs: "rollup_rules, rule_metadata, rule_version",
            rollupRules: [
                {
                    description: "Adds income mapped categories.",
                    includeCategoryIds: [
                        "interestIncome",
                        "rents",
                        "royalties",
                        "dividends",
                        "otherFapiIncome"
                    ],
                    label: "Income Bucket",
                    operation: "sum",
                    rollupId: "income_bucket"
                },
                {
                    description: "Adds expenses using absolute values.",
                    includeCategoryIds: [
                        "generalExpenses",
                        "legalExpenses",
                        "accountingExpenses"
                    ],
                    label: "Expense Bucket",
                    operation: "sum_abs",
                    rollupId: "expense_bucket"
                }
            ],
            rulebookRef: "Rollup rulebooks group mapped categories without owning final formulas.",
            sourceKind: "rollup_rules",
            sourceLocator: "manual-source://rollup-rules",
            toolId: "source.rollup_rules"
        }
    },
    {
        id: "source:calculation-rules",
        family: "Source",
        subtype: "Calculation Rules",
        label: "Calculation Rules Source",
        description: "Editable formula rules over named rollup and protected inputs",
        defaultConfig: {
            calculationRules: [
                {
                    calculationId: "A",
                    description: "A = max(income_bucket - expense_bucket, 0)",
                    label: "A",
                    operands: [
                        "income_bucket",
                        "expense_bucket"
                    ],
                    operation: "max_subtract_zero",
                    resultKey: "A"
                },
                {
                    calculationId: "GROSS",
                    description: "Gross = A + A1 + A2 + B + C",
                    label: "Gross",
                    operands: [
                        "A",
                        "A1",
                        "A2",
                        "B",
                        "C"
                    ],
                    operation: "add",
                    resultKey: "GROSS"
                },
                {
                    calculationId: "DEDUCTIONS",
                    description: "Deductions = D + E + F + F1 + G + H",
                    label: "Deductions",
                    operands: [
                        "D",
                        "E",
                        "F",
                        "F1",
                        "G",
                        "H"
                    ],
                    operation: "add",
                    resultKey: "DEDUCTIONS"
                },
                {
                    calculationId: "FAPI_BRUT",
                    description: "FAPI Brut = max(GROSS - DEDUCTIONS, 0)",
                    label: "FAPI Brut",
                    operands: [
                        "GROSS",
                        "DEDUCTIONS"
                    ],
                    operation: "max_subtract_zero",
                    resultKey: "FAPI_BRUT"
                },
                {
                    calculationId: "FAT_DEDUCTION",
                    description: "FAT Deduction = min(max(FAT_PAID, 0) * RTF, FAPI_BRUT)",
                    label: "FAT Deduction",
                    operands: [
                        "FAT_PAID",
                        "RTF",
                        "FAPI_BRUT"
                    ],
                    operation: "min_multiply_cap",
                    resultKey: "FAT_DEDUCTION"
                },
                {
                    calculationId: "NET_FAPI",
                    description: "Net FAPI = max(FAPI_BRUT - FAT_DEDUCTION, 0)",
                    label: "Net FAPI",
                    operands: [
                        "FAPI_BRUT",
                        "FAT_DEDUCTION"
                    ],
                    operation: "max_subtract_zero",
                    resultKey: "NET_FAPI"
                },
                {
                    calculationId: "NET_FAPI_CAD",
                    description: "Net FAPI CAD = NET_FAPI * FX_RATE",
                    label: "Net FAPI CAD",
                    operands: [
                        "NET_FAPI",
                        "FX_RATE"
                    ],
                    operation: "multiply",
                    resultKey: "NET_FAPI_CAD"
                }
            ],
            owner: "Fiscal Systems",
            inputs: "draft calculation rulebook",
            outputs: "calculation_rules, rule_metadata, rule_version",
            rulebookRef: "Calculation rulebooks define formulas over named values without changing Sources.",
            sourceKind: "calculation_rules",
            sourceLocator: "manual-source://calculation-rules",
            toolId: "source.calculation_rules"
        }
    },
    {
        id: "logic:hierarchy-aggregator",
        family: "Logic",
        subtype: "Hierarchy Aggregator",
        label: "Rollup & Calculation Engine",
        description: "Roll up mapped categories and calculate formula/final result nodes",
        defaultConfig: {
            owner: "Fiscal Systems",
            inputs: "mapped_rows, aggregation_rules",
            operation: "sum",
            outputs: "category_totals, node_totals, group_totals, final_totals, aggregation_tree, formula_trace",
            rulebookRef: "Rollup & Calculation Engine applies Source aggregation rules without mutating source rows.",
            toolGroup: "calculation",
            toolId: "logic.hierarchy_aggregator"
        }
    },
    {
        id: "logic:category-rollup-aggregator",
        family: "Logic",
        subtype: "Category Rollup Aggregator",
        label: "Category Rollup Aggregator",
        description: "Group mapped rows into category and rollup totals",
        defaultConfig: {
            owner: "Fiscal Systems",
            inputs: "mapped_rows, rollup_rules",
            outputs: "category_totals, rollup_totals, named_values, included_rows_by_category, included_rows_by_rollup, excluded_rows, rollup_formula_trace, rollup_summary",
            rulebookRef: "Category Rollup Aggregator only groups and sums mapped rows.",
            toolGroup: "calculation",
            toolId: "logic.category_rollup_aggregator"
        }
    },
    {
        id: "logic:calculation-engine",
        family: "Logic",
        subtype: "Calculation Engine",
        label: "Calculation Engine",
        description: "Apply formula rules to named values and protected inputs",
        defaultConfig: {
            owner: "Fiscal Systems",
            inputs: "named_values, protected_inputs",
            outputs: "calculated_results, formula_trace, calculation_summary, named_values",
            rulebookRef: "Calculation Engine evaluates formulas without grouping source rows.",
            toolGroup: "calculation",
            toolId: "logic.calculation_engine",
            mode: "auto",
            outputCurrency: "USD",
            rounding: {
                moneyDecimals: 2
            },
            formulas: [
                {
                    calculationId: "A",
                    label: "A",
                    operation: "max_subtract_zero",
                    operands: [
                        "income_bucket",
                        "expense_bucket"
                    ],
                    resultKey: "A",
                    description: "A = max(income_bucket - expense_bucket, 0)"
                },
                {
                    calculationId: "A1",
                    label: "A1",
                    operation: "multiply",
                    operands: [
                        "debtForgiveness",
                        2
                    ],
                    resultKey: "A1",
                    description: "A1 = debtForgiveness * 2"
                },
                {
                    calculationId: "A2",
                    label: "A2",
                    operation: "pass_through",
                    operands: [
                        "priorYearG"
                    ],
                    resultKey: "A2",
                    description: "A2 = priorYearG"
                },
                {
                    calculationId: "B",
                    label: "B",
                    operation: "multiply",
                    operands: [
                        "capGains",
                        "inclusionRate"
                    ],
                    resultKey: "B",
                    description: "B = capGains * inclusionRate"
                },
                {
                    calculationId: "C",
                    label: "C",
                    operation: "pass_through",
                    operands: [
                        "cfaIncome"
                    ],
                    resultKey: "C",
                    description: "C = cfaIncome"
                },
                {
                    calculationId: "D",
                    label: "D",
                    operation: "pass_through",
                    operands: [
                        "businessLosses"
                    ],
                    resultKey: "D",
                    description: "D = businessLosses"
                },
                {
                    calculationId: "E",
                    label: "E",
                    operation: "pass_through",
                    operands: [
                        "faclCarryforward"
                    ],
                    resultKey: "E",
                    description: "E = faclCarryforward"
                },
                {
                    calculationId: "F",
                    label: "F",
                    operation: "pass_through",
                    operands: [
                        "prescribedAmount"
                    ],
                    resultKey: "F",
                    description: "F = prescribedAmount"
                },
                {
                    calculationId: "F1",
                    label: "F1",
                    operation: "pass_through",
                    operands: [
                        "prescribedAmountF1"
                    ],
                    resultKey: "F1",
                    description: "F1 = prescribedAmountF1"
                },
                {
                    calculationId: "G",
                    label: "G",
                    operation: "pass_through",
                    operands: [
                        "dividendDeductions"
                    ],
                    resultKey: "G",
                    description: "G = dividendDeductions"
                },
                {
                    calculationId: "H",
                    label: "H",
                    operation: "pass_through",
                    operands: [
                        "partnershipDividends"
                    ],
                    resultKey: "H",
                    description: "H = partnershipDividends"
                },
                {
                    calculationId: "FAT_PAID",
                    label: "FAT Paid",
                    operation: "pass_through",
                    operands: [
                        "fatPaid"
                    ],
                    resultKey: "FAT_PAID",
                    description: "FAT_PAID = fatPaid"
                },
                {
                    calculationId: "RTF",
                    label: "RTF",
                    operation: "pass_through",
                    operands: [
                        "rtf"
                    ],
                    resultKey: "RTF",
                    description: "RTF = rtf"
                },
                {
                    calculationId: "FX_RATE",
                    label: "FX Rate",
                    operation: "pass_through",
                    operands: [
                        "fxRate"
                    ],
                    resultKey: "FX_RATE",
                    description: "FX_RATE = fxRate"
                },
                {
                    calculationId: "GROSS",
                    label: "Gross",
                    operation: "add",
                    operands: [
                        "A",
                        "A1",
                        "A2",
                        "B",
                        "C"
                    ],
                    resultKey: "GROSS",
                    description: "Gross = A + A1 + A2 + B + C"
                },
                {
                    calculationId: "DEDUCTIONS",
                    label: "Deductions",
                    operation: "add",
                    operands: [
                        "D",
                        "E",
                        "F",
                        "F1",
                        "G",
                        "H"
                    ],
                    resultKey: "DEDUCTIONS",
                    description: "Deductions = D + E + F + F1 + G + H"
                },
                {
                    calculationId: "FAPI_BRUT",
                    label: "FAPI Brut",
                    operation: "max_subtract_zero",
                    operands: [
                        "GROSS",
                        "DEDUCTIONS"
                    ],
                    resultKey: "FAPI_BRUT",
                    description: "FAPI Brut = max(GROSS - DEDUCTIONS, 0)"
                },
                {
                    calculationId: "FAT_DEDUCTION",
                    label: "FAT Deduction",
                    operation: "min_multiply_cap",
                    operands: [
                        "FAT_PAID",
                        "RTF",
                        "FAPI_BRUT"
                    ],
                    resultKey: "FAT_DEDUCTION",
                    description: "FAT Deduction = min(max(FAT_PAID, 0) * RTF, FAPI_BRUT)"
                },
                {
                    calculationId: "NET_FAPI",
                    label: "Net FAPI",
                    operation: "max_subtract_zero",
                    operands: [
                        "FAPI_BRUT",
                        "FAT_DEDUCTION"
                    ],
                    resultKey: "NET_FAPI",
                    description: "Net FAPI = max(FAPI_BRUT - FAT_DEDUCTION, 0)"
                },
                {
                    calculationId: "NET_FAPI_CAD",
                    label: "Net FAPI CAD",
                    operation: "multiply",
                    operands: [
                        "NET_FAPI",
                        "FX_RATE"
                    ],
                    resultKey: "NET_FAPI_CAD",
                    description: "Net FAPI CAD = NET_FAPI * FX_RATE"
                }
            ]
        }
    },
    {
        id: "logic:classification-mapping",
        family: "Logic",
        subtype: "Classification / Mapping",
        label: "Classification / Mapping",
        description: "Classify rows or map source values to canonical fields",
        defaultConfig: {
            owner: "Fiscal Systems",
            inputs: "source rows",
            outputs: "mappedRows",
            rulebookRef: "Mappings are downstream annotations, not source edits.",
            toolGroup: "mapping",
            toolId: "logic.keyword_mapper"
        }
    },
    {
        id: "field:field-block",
        family: "Field",
        subtype: "Field Block",
        label: "Field Block",
        description: "Display named results and their category breakdowns in the user-facing UI",
        defaultConfig: {
            fields: [],
            toolId: "field.field_block"
        }
    },
    {
        id: "output:csv-export",
        family: "Output",
        subtype: "CSV Export",
        label: "CSV Export",
        description: "Delimited export for downstream review",
        defaultConfig: {
            owner: "Tax Delivery",
            inputs: "approved values",
            outputs: "csvExport",
            rulebookRef: "CSV output is generated from approved data.",
            toolId: "output.evidence_pack_preview"
        }
    },
    {
        id: "output:excel-export",
        family: "Output",
        subtype: "Excel Export",
        label: "Excel Export",
        description: "Workbook output for review or handoff",
        defaultConfig: {
            owner: "Tax Delivery",
            inputs: "approved values",
            outputs: "excelExport",
            rulebookRef: "Excel output is generated from approved data.",
            toolId: "output.evidence_pack_preview"
        }
    },
    {
        id: "output:pdf-report",
        family: "Output",
        subtype: "PDF Report",
        label: "PDF Report",
        description: "Review-ready PDF package",
        defaultConfig: {
            owner: "Tax Delivery",
            inputs: "approved values",
            outputs: "pdfReport",
            rulebookRef: "PDF reports are generated from approved values.",
            toolId: "output.evidence_pack_preview"
        }
    },
    {
        id: "output:evidence-pack",
        family: "Output",
        subtype: "Evidence Pack",
        label: "Evidence Pack",
        description: "Source references, validations, and approvals bundle",
        defaultConfig: {
            owner: "Tax Delivery",
            inputs: "sources and approvals",
            outputs: "evidencePack",
            rulebookRef: "Evidence packs preserve source support.",
            toolId: "output.evidence_pack_preview"
        }
    },
    {
        id: "output:canonical-json",
        family: "Output",
        subtype: "Canonical JSON",
        label: "Canonical JSON",
        description: "Canonical machine-readable workflow output",
        defaultConfig: {
            owner: "Tax Delivery",
            inputs: "approved graph state",
            outputs: "canonicalJson",
            rulebookRef: "Canonical JSON is a local v1 export artifact.",
            toolId: "output.canonical_json"
        }
    },
    {
        id: "output:taxprep-handoff",
        family: "Output",
        subtype: "Taxprep Handoff",
        label: "Taxprep Handoff",
        description: "Placeholder handoff artifact for Taxprep",
        defaultConfig: {
            owner: "Tax Delivery",
            inputs: "approved values",
            outputs: "taxprepHandoff",
            rulebookRef: "V1 exports a placeholder, not a live integration.",
            toolId: "output.evidence_pack_preview"
        }
    },
    {
        id: "output:onesource-handoff",
        family: "Output",
        subtype: "ONESOURCE Handoff",
        label: "ONESOURCE Handoff",
        description: "Placeholder handoff artifact for ONESOURCE",
        defaultConfig: {
            owner: "Tax Delivery",
            inputs: "approved values",
            outputs: "onesourceHandoff",
            rulebookRef: "V1 exports a placeholder, not a live integration.",
            toolId: "output.evidence_pack_preview"
        }
    },
    {
        id: "ai:ai-search",
        family: "AI / Agent",
        subtype: "AI Search",
        label: "AI Search",
        description: "Proposal-only AI search block",
        defaultConfig: {
            owner: "Builder",
            inputs: "search prompt",
            outputs: "aiSearchProposal",
            rulebookRef: "AI proposals require approval before changing workflow."
        }
    },
    {
        id: "ai:ai-mapping-suggestion",
        family: "AI / Agent",
        subtype: "AI Mapping Suggestion",
        label: "AI Mapping Suggestion",
        description: "Proposal-only mapping suggestion",
        defaultConfig: {
            owner: "Builder",
            inputs: "source rows",
            outputs: "aiMappingProposal",
            rulebookRef: "AI mapping suggestions do not mutate the workflow."
        }
    },
    {
        id: "ai:ai-formula-proposal",
        family: "AI / Agent",
        subtype: "AI Formula Proposal",
        label: "AI Formula Proposal",
        description: "Proposal-only formula candidate",
        defaultConfig: {
            owner: "Builder",
            inputs: "calculation prompt",
            outputs: "aiFormulaProposal",
            rulebookRef: "AI formula proposals require approval."
        }
    },
    {
        id: "ai:ai-workflow-proposal",
        family: "AI / Agent",
        subtype: "AI Workflow Proposal",
        label: "AI Workflow Proposal",
        description: "Proposal-only workflow change package",
        defaultConfig: {
            owner: "Builder",
            inputs: "workflow prompt",
            outputs: "aiWorkflowProposal",
            rulebookRef: "AI workflow proposals stay separate until approved."
        }
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/domain/workflow/block-catalog.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BLOCK_FAMILY_STAGE",
    ()=>BLOCK_FAMILY_STAGE,
    "FISCAL_STAGE_OPTIONS",
    ()=>FISCAL_STAGE_OPTIONS
]);
const BLOCK_FAMILY_STAGE = {
    Trigger: "trigger",
    Source: "source",
    Logic: "logic",
    "Review / Validation": "validation",
    Field: "field",
    Output: "output",
    "AI / Agent": "ai-agent",
    // "Protected" is an internal governed-value family with no dedicated FiscalStage;
    // bucket it with "output" (governed/locked final values), matching the worksheet
    // ordering in generate-structure-view. Revisit at the kernel node-model step.
    Protected: "output"
};
const FISCAL_STAGE_OPTIONS = [
    {
        id: "preset:trigger",
        stage: "trigger",
        family: "Trigger",
        label: "Trigger",
        description: "Initiates the workflow — schedule, webhook, or manual start"
    },
    {
        id: "preset:source",
        stage: "source",
        family: "Source",
        label: "Source",
        description: "Immutable truth or reference data"
    },
    {
        id: "preset:logic",
        stage: "logic",
        family: "Logic",
        label: "Logic",
        description: "Transform, calculate, classify, or derive values"
    },
    {
        id: "preset:review-validation",
        stage: "validation",
        family: "Review / Validation",
        label: "Review / Validation",
        description: "Check whether the workflow is trustworthy"
    },
    {
        id: "preset:field",
        stage: "field",
        family: "Field",
        label: "Field",
        description: "Display computed values and their category breakdowns in the user-facing UI"
    },
    {
        id: "preset:output",
        stage: "output",
        family: "Output",
        label: "Output",
        description: "Generate handoff or export artifacts"
    },
    {
        id: "preset:ai-agent",
        stage: "ai-agent",
        family: "AI / Agent",
        label: "AI / Agent",
        description: "Propose searches, mappings, formulas, or workflow changes"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/domain/workflow/edge-types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CANDIDATE_OUTPUT_RELATIONSHIP_TYPES",
    ()=>CANDIDATE_OUTPUT_RELATIONSHIP_TYPES,
    "EDGE_BINDING_STATUS_VALUES",
    ()=>EDGE_BINDING_STATUS_VALUES,
    "EDGE_STATUS_VALUES",
    ()=>EDGE_STATUS_VALUES,
    "GOVERNED_OUTPUT_RELATIONSHIP_TYPES",
    ()=>GOVERNED_OUTPUT_RELATIONSHIP_TYPES,
    "OUTPUT_MAPPING_RELATIONSHIP_TYPES",
    ()=>OUTPUT_MAPPING_RELATIONSHIP_TYPES,
    "WORKFLOW_RELATIONSHIP_LABELS",
    ()=>WORKFLOW_RELATIONSHIP_LABELS,
    "WORKFLOW_RELATIONSHIP_TYPES",
    ()=>WORKFLOW_RELATIONSHIP_TYPES,
    "isCandidateOutputRelationshipType",
    ()=>isCandidateOutputRelationshipType,
    "isGovernedOutputRelationshipType",
    ()=>isGovernedOutputRelationshipType,
    "isOutputMappingRelationshipType",
    ()=>isOutputMappingRelationshipType,
    "isWorkflowRelationshipType",
    ()=>isWorkflowRelationshipType
]);
const WORKFLOW_RELATIONSHIP_TYPES = [
    "provides_data_to",
    "extracted_into",
    "referenced_by",
    "transforms_into",
    "aggregates_into",
    "branches_to",
    "depends_on",
    "checked_by",
    "requires_review_by",
    "triggers_validation",
    "approves_for",
    "blocks_until_resolved",
    "certifies",
    "feeds_protected_input",
    "feeds_protected_result",
    "feeds_output_input",
    "included_in_output_preview",
    "maps_to_output_candidate",
    "feeds_ai_context",
    "provides_context_to_ai",
    "requests_ai_review",
    "supplies_candidate_data",
    "maps_to_output",
    "included_in_handoff",
    "proposes",
    "suggests_mapping",
    "suggests_formula",
    "suggests_workflow_change",
    "initiates"
];
const EDGE_STATUS_VALUES = [
    "active",
    "proposed",
    "disabled",
    "rejected"
];
const EDGE_BINDING_STATUS_VALUES = [
    "valid",
    "missing",
    "warning",
    "invalid"
];
const GOVERNED_OUTPUT_RELATIONSHIP_TYPES = [
    "maps_to_output",
    "included_in_handoff"
];
const CANDIDATE_OUTPUT_RELATIONSHIP_TYPES = [
    "feeds_output_input",
    "included_in_output_preview",
    "maps_to_output_candidate"
];
const OUTPUT_MAPPING_RELATIONSHIP_TYPES = [
    ...GOVERNED_OUTPUT_RELATIONSHIP_TYPES,
    ...CANDIDATE_OUTPUT_RELATIONSHIP_TYPES
];
const WORKFLOW_RELATIONSHIP_LABELS = {
    aggregates_into: "Aggregates into",
    approves_for: "Approves for",
    blocks_until_resolved: "Blocks until resolved",
    branches_to: "Branches to",
    certifies: "Certifies",
    checked_by: "Checked by",
    depends_on: "Depends on",
    extracted_into: "Extracted into",
    feeds_ai_context: "Feeds AI context",
    feeds_output_input: "Feeds output input",
    feeds_protected_input: "Feeds protected input",
    feeds_protected_result: "Feeds protected result",
    initiates: "Initiates",
    included_in_output_preview: "Included in output preview",
    included_in_handoff: "Included in handoff",
    maps_to_output: "Maps to output",
    maps_to_output_candidate: "Maps to output candidate",
    proposes: "Proposes",
    provides_context_to_ai: "Provides context to AI",
    provides_data_to: "Provides data to",
    referenced_by: "Referenced by",
    requires_review_by: "Requires review by",
    requests_ai_review: "Requests AI review",
    suggests_formula: "Suggests formula",
    suggests_mapping: "Suggests mapping",
    suggests_workflow_change: "Suggests workflow change",
    supplies_candidate_data: "Supplies candidate data",
    transforms_into: "Transforms into",
    triggers_validation: "Triggers validation"
};
function isWorkflowRelationshipType(value) {
    return typeof value === "string" && WORKFLOW_RELATIONSHIP_TYPES.includes(value);
}
function isGovernedOutputRelationshipType(relationshipType) {
    return GOVERNED_OUTPUT_RELATIONSHIP_TYPES.includes(relationshipType);
}
function isCandidateOutputRelationshipType(relationshipType) {
    return CANDIDATE_OUTPUT_RELATIONSHIP_TYPES.includes(relationshipType);
}
function isOutputMappingRelationshipType(relationshipType) {
    return OUTPUT_MAPPING_RELATIONSHIP_TYPES.includes(relationshipType);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/domain/workflow/protected-rules.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getProtectedKindForSubtype",
    ()=>getProtectedKindForSubtype,
    "isGovernedValueBlock",
    ()=>isGovernedValueBlock
]);
function getProtectedKindForSubtype(subtype) {
    if (subtype === "Protected Input") {
        return "input";
    }
    if (subtype === "Official Line") {
        return "official-line";
    }
    if (subtype === "Locked Rate") {
        return "locked-rate";
    }
    if (subtype === "Final Reviewed Amount") {
        return "final-reviewed-amount";
    }
    return "result";
}
function isGovernedValueBlock(block) {
    if (!block) {
        return false;
    }
    return block.governance?.protected === true || block.family === "Protected";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/domain/workflow/workflow-rules.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AI_CONTEXT_RELATIONSHIP_TYPES",
    ()=>AI_CONTEXT_RELATIONSHIP_TYPES,
    "AI_PROPOSAL_RELATIONSHIP_TYPES",
    ()=>AI_PROPOSAL_RELATIONSHIP_TYPES,
    "BLOCK_FAMILY_RULES",
    ()=>BLOCK_FAMILY_RULES,
    "LOGIC_OUTPUT_GOVERNANCE_WARNING",
    ()=>LOGIC_OUTPUT_GOVERNANCE_WARNING,
    "RELATIONSHIP_TYPES_BY_FAMILY_PAIR",
    ()=>RELATIONSHIP_TYPES_BY_FAMILY_PAIR,
    "getAllowedRelationshipTypesForFamilies",
    ()=>getAllowedRelationshipTypesForFamilies,
    "getBlockFamilyRule",
    ()=>getBlockFamilyRule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$edge$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/domain/workflow/edge-types.ts [app-client] (ecmascript)");
;
const BLOCK_FAMILY_RULES = {
    Trigger: {
        family: "Trigger",
        responsibility: "Initiates the workflow via schedule, webhook, or manual start.",
        mustNot: "Trigger blocks do not process, transform, or store data — they only fire the workflow."
    },
    Source: {
        family: "Source",
        responsibility: "Immutable truth or reference objects.",
        mustNot: "Sources do not classify, calculate, correct, or finalize values."
    },
    Logic: {
        family: "Logic",
        responsibility: "Transforms, calculates, classifies, aggregates, or branches data.",
        mustNot: "Logic does not overwrite Source truth or lock final governance."
    },
    "Review / Validation": {
        family: "Review / Validation",
        responsibility: "Judges readiness, trust, approval, completeness, or warnings.",
        mustNot: "Review blocks do not mutate evidence or perform primary calculations."
    },
    Field: {
        family: "Field",
        responsibility: "Displays computed values and category breakdowns in the user-facing UI.",
        mustNot: "Field blocks do not compute or transform data — they only display results from upstream blocks."
    },
    Output: {
        family: "Output",
        responsibility: "Generates deliverables, handoffs, previews, and exports.",
        mustNot: "Output blocks do not become the source of workflow truth."
    },
    "AI / Agent": {
        family: "AI / Agent",
        responsibility: "Proposes changes, mappings, formulas, or reviews.",
        mustNot: "AI / Agent blocks do not silently mutate workflows."
    },
    Protected: {
        family: "Protected",
        responsibility: "Holds governed, locked values — approved inputs, official lines, locked rates, and final reviewed amounts.",
        mustNot: "Protected values are not recalculated or edited without an explicit unlock or approval."
    }
};
const LOGIC_OUTPUT_GOVERNANCE_WARNING = "Final governed handoffs should usually map from Protected values. This Logic mapping is treated as a draft/candidate mapping.";
const AI_PROPOSAL_RELATIONSHIP_TYPES = [
    "proposes",
    "suggests_mapping",
    "suggests_formula",
    "suggests_workflow_change"
];
const AI_CONTEXT_RELATIONSHIP_TYPES = [
    "feeds_ai_context",
    "provides_context_to_ai",
    "requests_ai_review",
    "supplies_candidate_data"
];
const RELATIONSHIP_TYPES_BY_FAMILY_PAIR = {
    Logic: {
        "AI / Agent": AI_CONTEXT_RELATIONSHIP_TYPES,
        Logic: [
            "transforms_into",
            "aggregates_into",
            "branches_to",
            "depends_on"
        ],
        Output: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$edge$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CANDIDATE_OUTPUT_RELATIONSHIP_TYPES"],
        Protected: [
            "feeds_protected_input",
            "feeds_protected_result"
        ],
        "Review / Validation": [
            "checked_by",
            "requires_review_by",
            "triggers_validation"
        ]
    },
    Output: {
        "AI / Agent": AI_CONTEXT_RELATIONSHIP_TYPES
    },
    Protected: {
        "AI / Agent": AI_CONTEXT_RELATIONSHIP_TYPES,
        Output: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$edge$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GOVERNED_OUTPUT_RELATIONSHIP_TYPES"]
    },
    "Review / Validation": {
        "AI / Agent": AI_CONTEXT_RELATIONSHIP_TYPES,
        Output: [
            "included_in_output_preview"
        ],
        Protected: [
            "approves_for",
            "blocks_until_resolved",
            "certifies"
        ],
        "Review / Validation": [
            "depends_on",
            "blocks_until_resolved",
            "certifies"
        ]
    },
    Source: {
        "AI / Agent": AI_CONTEXT_RELATIONSHIP_TYPES,
        Logic: [
            "provides_data_to",
            "extracted_into",
            "referenced_by"
        ]
    },
    Trigger: {
        Source: [
            "initiates",
            "provides_data_to"
        ],
        Logic: [
            "initiates",
            "provides_data_to"
        ]
    }
};
function getBlockFamilyRule(family) {
    return BLOCK_FAMILY_RULES[family];
}
function getAllowedRelationshipTypesForFamilies(sourceFamily, targetFamily) {
    if (sourceFamily === "AI / Agent") {
        return [
            ...AI_PROPOSAL_RELATIONSHIP_TYPES
        ];
    }
    return [
        ...RELATIONSHIP_TYPES_BY_FAMILY_PAIR[sourceFamily]?.[targetFamily] || []
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/domain/workflow/workflow-types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AI_PROPOSAL_STATUS_VALUES",
    ()=>AI_PROPOSAL_STATUS_VALUES,
    "WORKFLOW_EVENT_TYPES",
    ()=>WORKFLOW_EVENT_TYPES,
    "WORKFLOW_SCHEMA_VERSION",
    ()=>WORKFLOW_SCHEMA_VERSION
]);
const WORKFLOW_SCHEMA_VERSION = "workflow-studio.local.v1";
const AI_PROPOSAL_STATUS_VALUES = [
    "proposed",
    "approved",
    "rejected"
];
const WORKFLOW_EVENT_TYPES = [
    "ai_proposal_approved",
    "ai_proposal_created",
    "ai_proposal_rejected",
    "export_workflow",
    "import_workflow",
    "migration",
    "publish_snapshot",
    "reset_sample",
    "save_draft",
    "validation_warning",
    "workflow_command"
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/domain/workflow/source-rules.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SOURCE_LOCKED_CONFIG_KEYS",
    ()=>SOURCE_LOCKED_CONFIG_KEYS,
    "canMutateSourceEvidence",
    ()=>canMutateSourceEvidence,
    "hasExcelSourceEvidence",
    ()=>hasExcelSourceEvidence,
    "isExcelWorkbookSource",
    ()=>isExcelWorkbookSource,
    "isSourceEvidenceImmutable",
    ()=>isSourceEvidenceImmutable,
    "sourceHasLockableEvidence",
    ()=>sourceHasLockableEvidence
]);
const SOURCE_LOCKED_CONFIG_KEYS = [
    "sourceLabel",
    "sourceLocator",
    "sourceValue",
    "valuePreview"
];
function isSourceEvidenceImmutable(block) {
    return Boolean(block.source?.treatedAsEvidence && block.source.immutable);
}
function canMutateSourceEvidence(block) {
    return !isSourceEvidenceImmutable(block);
}
function isExcelWorkbookSource(block) {
    const sourceKind = String(block?.config.sourceKind || "").toLowerCase();
    return block?.family === "Source" && (block.subtype === "Excel / Workbook" || sourceKind.includes("excel") || sourceKind.includes("workbook"));
}
function hasExcelSourceEvidence(config) {
    const rowCount = typeof config.selectedRowsCount === "number" ? config.selectedRowsCount : Number(config.selectedRowsCount || 0);
    const workbookFile = typeof config.workbookFile === "object" && config.workbookFile !== null ? config.workbookFile : null;
    const workbook = typeof config.excelWorkbook === "object" && config.excelWorkbook !== null ? config.excelWorkbook : null;
    return Boolean(workbook && Array.isArray(workbook.sheets) || Array.isArray(config.rows) && config.rows.length > 0 || Number.isFinite(rowCount) && rowCount > 0 || config.fileName || config.workbookId || config.uploadTimestamp || workbookFile && Object.keys(workbookFile).length > 0);
}
function sourceHasLockableEvidence(block) {
    if (!block) {
        return false;
    }
    return !isExcelWorkbookSource(block) || hasExcelSourceEvidence(block.config);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/domain/workflow/workflow-validation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isKnownWorkflowRelationshipType",
    ()=>isKnownWorkflowRelationshipType,
    "isWorkflowRelationshipAllowed",
    ()=>isWorkflowRelationshipAllowed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$edge$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/domain/workflow/edge-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$workflow$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/domain/workflow/workflow-rules.ts [app-client] (ecmascript)");
;
;
function isKnownWorkflowRelationshipType(value) {
    return typeof value === "string" && __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$edge$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORKFLOW_RELATIONSHIP_TYPES"].includes(value);
}
function isWorkflowRelationshipAllowed({ sourceFamily, targetFamily, relationshipType }) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$workflow$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAllowedRelationshipTypesForFamilies"])(sourceFamily, targetFamily).includes(relationshipType);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/domain/workflow/inspector-rules.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "INSPECTOR_TABS",
    ()=>INSPECTOR_TABS,
    "LOGIC_CODE_MODES",
    ()=>LOGIC_CODE_MODES,
    "getDefaultInspectorTabForFamily",
    ()=>getDefaultInspectorTabForFamily,
    "getDefaultInspectorTabForSelection",
    ()=>getDefaultInspectorTabForSelection,
    "isInspectorTab",
    ()=>isInspectorTab
]);
const INSPECTOR_TABS = [
    "properties",
    "code",
    "runs"
];
const LOGIC_CODE_MODES = [
    "Formula",
    "Script",
    "Condition",
    "Aggregation",
    "Transformation",
    "AI-assisted logic",
    "Classification / Mapping"
];
function isInspectorTab(value) {
    return typeof value === "string" && INSPECTOR_TABS.includes(value);
}
function getDefaultInspectorTabForFamily(family) {
    return family === "Logic" ? "code" : "properties";
}
function getDefaultInspectorTabForSelection({ family, selectionKind }) {
    if (selectionKind === "edge") {
        return "properties";
    }
    return getDefaultInspectorTabForFamily(family);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/domain/workflow/block-types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BLOCK_FAMILIES",
    ()=>BLOCK_FAMILIES,
    "PUBLIC_BLOCK_FAMILIES",
    ()=>PUBLIC_BLOCK_FAMILIES,
    "isPublicBlockFamily",
    ()=>isPublicBlockFamily
]);
const PUBLIC_BLOCK_FAMILIES = [
    "Trigger",
    "Source",
    "Logic",
    "Review / Validation",
    "Field",
    "Output",
    "AI / Agent"
];
const BLOCK_FAMILIES = [
    ...PUBLIC_BLOCK_FAMILIES,
    "Protected"
];
function isPublicBlockFamily(value) {
    return typeof value === "string" && PUBLIC_BLOCK_FAMILIES.includes(value);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/state/workflow-commands.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runWorkflowCommand",
    ()=>runWorkflowCommand
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$xyflow$2b$react$40$12$2e$9$2e$2_$40$types_0af40127334b0ccd3fe2226190750a6f$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@xyflow+react@12.9.2_@types_0af40127334b0ccd3fe2226190750a6f/node_modules/@xyflow/react/dist/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/nanoid@5.1.6/node_modules/nanoid/index.browser.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/shared/workflow-engine/local-fiscal-workflow.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$protected$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/domain/workflow/protected-rules.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/audit/workflow-events.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$source$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/domain/workflow/source-rules.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$workflow$2d$validation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/domain/workflow/workflow-validation.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
function event({ message, metadata, subjectId, type }) {
    return {
        id: `change-${Date.now()}-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(6)}`,
        type,
        message,
        createdAt: new Date().toISOString(),
        createdBy: "workflow-studio",
        subjectId,
        ...metadata ? {
            metadata
        } : {}
    };
}
function auditEvent({ after, before, metadata, proposalId, reason, sourceId, state, targetObjectId, targetObjectType, type }) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createWorkflowAuditEvent"])({
        actor: state.actor || "workflow-studio",
        after,
        before,
        metadata,
        proposalId,
        reason,
        sourceId,
        targetObjectId,
        targetObjectType,
        type,
        workflowId: state.workflowId
    });
}
function unchanged(state, message) {
    return {
        auditEvents: [],
        events: message ? [
            event({
                message,
                type: "update-block"
            })
        ] : [],
        history: false,
        message,
        ok: false,
        saveMode: "none",
        state
    };
}
function changed({ auditEvents = [], events, history = false, saveMode = "debounced", state }) {
    return {
        auditEvents,
        events,
        history,
        ok: true,
        saveMode,
        state
    };
}
function getConfigWithLockedSourceFields(node, config) {
    if (!(config && isSourceLockedByConfig(node.data.block, node.data.config))) {
        return config;
    }
    const currentConfig = node.data.config || {};
    const nextConfig = {
        ...config
    };
    for (const key of __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$source$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOURCE_LOCKED_CONFIG_KEYS"]){
        if (key in currentConfig) {
            nextConfig[key] = currentConfig[key];
        }
    }
    return nextConfig;
}
function isSourceLockedByConfig(block, config) {
    if (!(block?.source?.immutable && (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$source$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sourceHasLockableEvidence"])(block))) {
        return false;
    }
    return Boolean(config?.sourceStatus === "published" || config?.sourceUsedInRun === true);
}
function getUpdatedSourceMetadata(block, nextConfig) {
    if (!block.source) {
        return;
    }
    const sourceLocked = isSourceLockedByConfig({
        ...block,
        config: nextConfig
    }, nextConfig);
    return {
        ...block.source,
        locator: sourceLocked && block.source.locatorLocked ? block.source.locator : String(nextConfig.sourceLocator || block.source.locator),
        valuePreview: sourceLocked && block.source.valuesLocked || typeof nextConfig.valuePreview !== "string" ? block.source.valuePreview : nextConfig.valuePreview
    };
}
function getUpdatedGovernanceMetadata(block, nextConfig) {
    if (!block.governance) {
        return;
    }
    return {
        ...block.governance,
        editIntent: typeof nextConfig.protectedEditIntent === "string" ? nextConfig.protectedEditIntent : block.governance.editIntent
    };
}
function getUpdatedEmbeddedBlock(node, nextData) {
    if (!node.data.block) {
        return nextData.block;
    }
    const block = nextData.block || node.data.block;
    const nextConfig = nextData.config || block.config;
    return {
        ...block,
        label: nextData.label,
        description: nextData.description || "",
        position: node.position,
        config: nextConfig,
        source: getUpdatedSourceMetadata(block, nextConfig),
        governance: getUpdatedGovernanceMetadata(block, nextConfig),
        runtime: {
            ...block.runtime,
            outputKey: typeof nextConfig.outputs === "string" ? nextConfig.outputs : block.runtime.outputKey
        },
        updatedBy: "workflow-studio",
        updatedAt: new Date().toISOString()
    };
}
function getUpdatedNodeData(node, data) {
    const sourceLabelLocked = Boolean(node.data.block?.source?.treatedAsEvidence && node.data.block.source.labelLocked && isSourceLockedByConfig(node.data.block, node.data.config));
    const nextConfig = getConfigWithLockedSourceFields(node, data.config || node.data.config);
    const nextData = {
        ...node.data,
        ...data,
        config: nextConfig,
        label: sourceLabelLocked && data.label !== undefined ? node.data.label : data.label ?? node.data.label
    };
    return {
        ...nextData,
        block: getUpdatedEmbeddedBlock(node, nextData)
    };
}
function updateTemplatesInConfig(config, nodeId, oldLabel, newLabel) {
    let hasChanges = false;
    const updated = {};
    for (const [key, value] of Object.entries(config)){
        if (typeof value === "string") {
            const pattern = new RegExp(`\\{\\{@${escapeRegex(nodeId)}:${escapeRegex(oldLabel)}(\\.[^}]+)?\\}\\}`, "g");
            const newValue = value.replace(pattern, (_match, fieldPart)=>{
                hasChanges = true;
                return `{{@${nodeId}:${newLabel}${fieldPart || ""}}}`;
            });
            updated[key] = newValue;
        } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            const nestedUpdated = updateTemplatesInConfig(value, nodeId, oldLabel, newLabel);
            if (nestedUpdated !== value) {
                hasChanges = true;
            }
            updated[key] = nestedUpdated;
        } else {
            updated[key] = value;
        }
    }
    return hasChanges ? updated : config;
}
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function getInsertedBlockPosition({ sourceNode, targetNode }) {
    return {
        x: (sourceNode.position.x + targetNode.position.x) / 2,
        y: (sourceNode.position.y + targetNode.position.y) / 2
    };
}
function getCatalogItemOrFallback(catalogId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getBlockCatalogItem"])(catalogId) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getBlockCatalogItem"])("logic:transformation") || null;
}
function assertRelationshipUpdateAllowed({ currentEdge, nextRelationshipType, state }) {
    const sourceBlock = state.nodes.find((node)=>node.id === currentEdge.source)?.data.block;
    const targetBlock = state.nodes.find((node)=>node.id === currentEdge.target)?.data.block;
    if (!(sourceBlock && targetBlock)) {
        return {
            ok: false,
            message: "Both blocks need typed workflow metadata before relationship metadata can be updated."
        };
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$workflow$2d$validation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWorkflowRelationshipAllowed"])({
        relationshipType: nextRelationshipType,
        sourceFamily: sourceBlock.family,
        targetFamily: targetBlock.family
    })) {
        return {
            ok: false,
            message: `${sourceBlock.family} blocks cannot use ${nextRelationshipType} relationships to ${targetBlock.family} blocks.`
        };
    }
    return {
        ok: true
    };
}
function runWorkflowCommand(state, command) {
    switch(command.type){
        case "add-block":
            {
                const updatedNodes = state.nodes.map((node)=>({
                        ...node,
                        selected: false
                    }));
                const newNode = {
                    ...command.node,
                    selected: true,
                    data: command.node.data.block ? {
                        ...command.node.data,
                        block: {
                            ...command.node.data.block,
                            position: command.node.position,
                            updatedAt: new Date().toISOString()
                        }
                    } : command.node.data
                };
                return changed({
                    auditEvents: [
                        auditEvent({
                            after: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["summarizeBlockForAudit"])(newNode),
                            state,
                            targetObjectId: newNode.id,
                            targetObjectType: "block",
                            type: "block_created"
                        })
                    ],
                    events: [
                        event({
                            message: `Added block ${newNode.data.label}.`,
                            metadata: {
                                family: newNode.data.block?.family
                            },
                            subjectId: newNode.id,
                            type: command.type
                        })
                    ],
                    history: true,
                    saveMode: "immediate",
                    state: {
                        ...state,
                        edges: state.edges.map((edge)=>({
                                ...edge,
                                selected: false
                            })),
                        newlyCreatedNodeId: newNode.data.type === "action" && !newNode.data.config?.actionType ? newNode.id : state.newlyCreatedNodeId,
                        nodes: [
                            ...updatedNodes,
                            newNode
                        ],
                        selectedEdgeId: null,
                        selectedNodeId: newNode.id
                    }
                });
            }
        case "apply-node-changes":
            {
                const filteredChanges = command.changes.filter((change)=>{
                    if (change.type !== "remove") {
                        return true;
                    }
                    const nodeToRemove = state.nodes.find((node)=>node.id === change.id);
                    return nodeToRemove?.data.type !== "trigger";
                });
                const changedNodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$xyflow$2b$react$40$12$2e$9$2e$2_$40$types_0af40127334b0ccd3fe2226190750a6f$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["applyNodeChanges"])(filteredChanges, state.nodes);
                const nextNodes = changedNodes.map((node)=>node.data.block ? {
                        ...node,
                        data: {
                            ...node.data,
                            block: {
                                ...node.data.block,
                                position: node.position,
                                updatedAt: new Date().toISOString()
                            }
                        }
                    } : node);
                const selectedNode = nextNodes.find((node)=>node.selected);
                const selectedNodeStillExists = nextNodes.some((node)=>node.id === state.selectedNodeId);
                const hadDeletions = filteredChanges.some((change)=>change.type === "remove");
                const hadPositionChanges = filteredChanges.some((change)=>change.type === "position" && change.dragging === false);
                const events = [];
                let saveMode = "none";
                if (hadDeletions) {
                    events.push(event({
                        message: "Deleted selected block from canvas.",
                        type: command.type
                    }));
                    saveMode = "immediate";
                } else if (hadPositionChanges) {
                    events.push(event({
                        message: "Moved block on canvas.",
                        type: command.type
                    }));
                    saveMode = "debounced";
                }
                const auditEvents = [];
                for (const change of filteredChanges){
                    if (change.type === "remove") {
                        const removedNode = state.nodes.find((node)=>node.id === change.id);
                        if (removedNode) {
                            auditEvents.push(auditEvent({
                                before: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["summarizeBlockForAudit"])(removedNode),
                                state,
                                targetObjectId: removedNode.id,
                                targetObjectType: "block",
                                type: "block_deleted"
                            }));
                        }
                    }
                    if (change.type === "position" && change.dragging === false) {
                        const beforeNode = state.nodes.find((node)=>node.id === change.id);
                        const afterNode = nextNodes.find((node)=>node.id === change.id);
                        if (beforeNode && afterNode) {
                            auditEvents.push(auditEvent({
                                after: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["summarizeBlockForAudit"])(afterNode),
                                before: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["summarizeBlockForAudit"])(beforeNode),
                                reason: "Canvas position changed.",
                                state,
                                targetObjectId: afterNode.id,
                                targetObjectType: "block",
                                type: "block_updated"
                            }));
                        }
                    }
                }
                let newlyCreatedNodeId = null;
                if (selectedNode && state.newlyCreatedNodeId === selectedNode.id) {
                    newlyCreatedNodeId = state.newlyCreatedNodeId;
                }
                let selectedNodeId = null;
                if (selectedNode) {
                    selectedNodeId = selectedNode.id;
                } else if (selectedNodeStillExists) {
                    selectedNodeId = state.selectedNodeId;
                }
                return changed({
                    auditEvents,
                    events,
                    history: hadDeletions,
                    saveMode,
                    state: {
                        ...state,
                        newlyCreatedNodeId,
                        nodes: nextNodes,
                        selectedEdgeId: selectedNode ? null : state.selectedEdgeId,
                        selectedNodeId
                    }
                });
            }
        case "apply-edge-changes":
            {
                const nextEdges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$xyflow$2b$react$40$12$2e$9$2e$2_$40$types_0af40127334b0ccd3fe2226190750a6f$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["applyEdgeChanges"])(command.changes, state.edges);
                const selectedEdge = nextEdges.find((edge)=>edge.selected);
                const selectedEdgeStillExists = nextEdges.some((edge)=>edge.id === state.selectedEdgeId);
                const hadDeletions = command.changes.some((change)=>change.type === "remove");
                let selectedEdgeId = null;
                if (selectedEdge) {
                    selectedEdgeId = selectedEdge.id;
                } else if (selectedEdgeStillExists) {
                    selectedEdgeId = state.selectedEdgeId;
                }
                const auditEvents = command.changes.flatMap((change)=>{
                    if (change.type !== "remove") {
                        return [];
                    }
                    const removedEdge = state.edges.find((edge)=>edge.id === change.id);
                    return removedEdge ? [
                        auditEvent({
                            before: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["summarizeEdgeForAudit"])(removedEdge),
                            state,
                            targetObjectId: removedEdge.id,
                            targetObjectType: "edge",
                            type: "edge_deleted"
                        })
                    ] : [];
                });
                return changed({
                    auditEvents,
                    events: hadDeletions ? [
                        event({
                            message: "Deleted selected relationship from canvas.",
                            type: command.type
                        })
                    ] : [],
                    history: hadDeletions,
                    saveMode: hadDeletions ? "immediate" : "none",
                    state: {
                        ...state,
                        activeTab: selectedEdge ? "properties" : state.activeTab,
                        edges: nextEdges,
                        selectedEdgeId,
                        selectedNodeId: selectedEdge ? null : state.selectedNodeId
                    }
                });
            }
        case "connect-blocks":
            {
                const sourceNode = state.nodes.find((node)=>node.id === command.connection.source);
                const targetNode = state.nodes.find((node)=>node.id === command.connection.target);
                const sourceBlock = sourceNode?.data.block;
                const targetBlock = targetNode?.data.block;
                const edgeDefaults = sourceBlock && targetBlock ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getWorkflowEdgeDefaults"])({
                    sourceBlock,
                    targetBlock
                }) : null;
                if (!(edgeDefaults && sourceBlock && targetBlock)) {
                    return unchanged(state, "This relationship is not valid for the selected block families.");
                }
                const workflowEdge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createWorkflowEdgeRecord"])({
                    id: command.id || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    bindingLabel: edgeDefaults.bindingLabel,
                    bindingStatus: edgeDefaults.bindingStatus,
                    sourceBlockId: command.connection.source,
                    sourceOutputRole: edgeDefaults.sourceOutputRole,
                    targetBlockId: command.connection.target,
                    targetInputRole: edgeDefaults.targetInputRole,
                    relationshipType: edgeDefaults.relationshipType,
                    reason: edgeDefaults.reason
                });
                const canvasEdge = {
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createCanvasEdgeFromWorkflowEdge"])(workflowEdge),
                    sourceHandle: command.connection.sourceHandle,
                    targetHandle: command.connection.targetHandle
                };
                return changed({
                    auditEvents: [
                        auditEvent({
                            after: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["summarizeEdgeForAudit"])(canvasEdge),
                            metadata: {
                                relationshipType: workflowEdge.relationshipType,
                                sourceBlockId: sourceBlock.id,
                                targetBlockId: targetBlock.id
                            },
                            reason: workflowEdge.reason,
                            state,
                            targetObjectId: workflowEdge.id,
                            targetObjectType: "edge",
                            type: "edge_created"
                        })
                    ],
                    events: [
                        event({
                            message: `Connected ${sourceBlock.label} to ${targetBlock.label}.`,
                            metadata: {
                                relationshipType: workflowEdge.relationshipType,
                                sourceFamily: sourceBlock.family,
                                targetFamily: targetBlock.family
                            },
                            subjectId: workflowEdge.id,
                            type: command.type
                        })
                    ],
                    history: true,
                    saveMode: "immediate",
                    state: {
                        ...state,
                        edges: [
                            ...state.edges,
                            canvasEdge
                        ]
                    }
                });
            }
        case "delete-block":
            {
                const nodeToDelete = state.nodes.find((node)=>node.id === command.nodeId);
                if (!nodeToDelete || nodeToDelete.data.type === "trigger") {
                    return unchanged(state, "Trigger blocks cannot be deleted.");
                }
                return changed({
                    auditEvents: [
                        auditEvent({
                            before: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["summarizeBlockForAudit"])(nodeToDelete),
                            state,
                            targetObjectId: nodeToDelete.id,
                            targetObjectType: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$protected$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isGovernedValueBlock"])(nodeToDelete.data.block) ? "protected_block" : "block",
                            type: "block_deleted"
                        })
                    ],
                    events: [
                        event({
                            message: `Deleted block ${nodeToDelete.data.label}.`,
                            metadata: {
                                family: nodeToDelete.data.block?.family
                            },
                            subjectId: nodeToDelete.id,
                            type: command.type
                        })
                    ],
                    history: true,
                    saveMode: "immediate",
                    state: {
                        ...state,
                        edges: state.edges.filter((edge)=>edge.source !== command.nodeId && edge.target !== command.nodeId),
                        nodes: state.nodes.filter((node)=>node.id !== command.nodeId),
                        selectedNodeId: state.selectedNodeId === command.nodeId ? null : state.selectedNodeId
                    }
                });
            }
        case "delete-edge":
            {
                const edgeToDelete = state.edges.find((edge)=>edge.id === command.edgeId);
                if (!edgeToDelete) {
                    return unchanged(state, "Relationship was not found.");
                }
                return changed({
                    auditEvents: [
                        auditEvent({
                            before: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["summarizeEdgeForAudit"])(edgeToDelete),
                            state,
                            targetObjectId: edgeToDelete.id,
                            targetObjectType: "edge",
                            type: "edge_deleted"
                        })
                    ],
                    events: [
                        event({
                            message: "Deleted relationship.",
                            subjectId: edgeToDelete.id,
                            type: command.type
                        })
                    ],
                    history: true,
                    saveMode: "immediate",
                    state: {
                        ...state,
                        edges: state.edges.filter((edge)=>edge.id !== command.edgeId),
                        selectedEdgeId: state.selectedEdgeId === command.edgeId ? null : state.selectedEdgeId
                    }
                });
            }
        case "delete-selected":
            {
                const selectedNodeIds = state.nodes.filter((node)=>node.selected && node.data.type !== "trigger").map((node)=>node.id);
                const selectedEdgeIds = state.edges.filter((edge)=>edge.selected).map((edge)=>edge.id);
                if (selectedNodeIds.length + selectedEdgeIds.length === 0) {
                    return unchanged(state);
                }
                const auditEvents = [
                    ...selectedNodeIds.flatMap((nodeId)=>{
                        const node = state.nodes.find((item)=>item.id === nodeId);
                        return node ? [
                            auditEvent({
                                before: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["summarizeBlockForAudit"])(node),
                                state,
                                targetObjectId: node.id,
                                targetObjectType: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$protected$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isGovernedValueBlock"])(node.data.block) ? "protected_block" : "block",
                                type: "block_deleted"
                            })
                        ] : [];
                    }),
                    ...selectedEdgeIds.flatMap((edgeId)=>{
                        const edge = state.edges.find((item)=>item.id === edgeId);
                        return edge ? [
                            auditEvent({
                                before: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["summarizeEdgeForAudit"])(edge),
                                state,
                                targetObjectId: edge.id,
                                targetObjectType: "edge",
                                type: "edge_deleted"
                            })
                        ] : [];
                    })
                ];
                return changed({
                    auditEvents,
                    events: [
                        event({
                            message: "Deleted selected workflow items.",
                            metadata: {
                                edgeCount: selectedEdgeIds.length,
                                nodeCount: selectedNodeIds.length
                            },
                            type: command.type
                        })
                    ],
                    history: true,
                    saveMode: "immediate",
                    state: {
                        ...state,
                        edges: state.edges.filter((edge)=>!(edge.selected || selectedNodeIds.includes(edge.source) || selectedNodeIds.includes(edge.target))),
                        nodes: state.nodes.filter((node)=>{
                            if (node.data.type === "trigger") {
                                return true;
                            }
                            return !node.selected;
                        }),
                        selectedEdgeId: null,
                        selectedNodeId: null
                    }
                });
            }
        case "update-block":
            {
                const oldNode = state.nodes.find((node)=>node.id === command.id);
                if (!oldNode) {
                    return unchanged(state, "Block was not found.");
                }
                const oldLabel = oldNode.data.label;
                const newLabel = oldNode.data.block?.source?.treatedAsEvidence && oldNode.data.block.source.labelLocked && command.data.label !== undefined ? oldNode.data.label : command.data.label;
                const isLabelChange = newLabel !== undefined && oldLabel !== newLabel;
                const nextNodes = state.nodes.map((node)=>{
                    if (node.id === command.id) {
                        return {
                            ...node,
                            data: getUpdatedNodeData(node, command.data)
                        };
                    }
                    if (isLabelChange && oldLabel) {
                        const updatedConfig = updateTemplatesInConfig(node.data.config || {}, command.id, oldLabel, newLabel);
                        if (updatedConfig !== node.data.config) {
                            return {
                                ...node,
                                data: {
                                    ...node.data,
                                    config: updatedConfig
                                }
                            };
                        }
                    }
                    return node;
                });
                const blockFamily = oldNode.data.block?.family;
                const updatedNode = nextNodes.find((node)=>node.id === command.id);
                const isGoverned = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$protected$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isGovernedValueBlock"])(oldNode.data.block);
                const wasProtectedUnlock = isGoverned && !oldNode.data.config?.protectedEditIntent && Boolean(updatedNode?.data.config?.protectedEditIntent);
                let updateAuditType = "block_updated";
                if (isGoverned) {
                    updateAuditType = wasProtectedUnlock ? "protected_block_unlocked" : "protected_block_updated";
                }
                const auditEvents = command.data.status || !updatedNode ? [] : [
                    auditEvent({
                        after: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["summarizeBlockForAudit"])(updatedNode),
                        before: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["summarizeBlockForAudit"])(oldNode),
                        metadata: {
                            configKeysChanged: Object.keys(command.data.config || {}),
                            family: blockFamily,
                            sourceFieldsPreserved: oldNode.data.block?.source?.immutable || undefined
                        },
                        reason: command.data.config?.protectedEditIntent && typeof command.data.config.protectedEditIntent === "string" ? command.data.config.protectedEditIntent : undefined,
                        state,
                        targetObjectId: command.id,
                        targetObjectType: isGoverned ? "protected_block" : "block",
                        type: updateAuditType
                    })
                ];
                return changed({
                    auditEvents,
                    events: command.data.status ? [] : [
                        event({
                            message: `Updated block ${oldNode.data.label}.`,
                            metadata: {
                                family: blockFamily,
                                protectedEditIntent: oldNode.data.block?.governance?.requiresUnlockToEdit ? command.data.config?.protectedEditIntent : undefined,
                                sourceFieldsPreserved: oldNode.data.block?.source?.immutable || undefined
                            },
                            subjectId: command.id,
                            type: command.type
                        })
                    ],
                    saveMode: command.data.status ? "none" : "debounced",
                    state: {
                        ...state,
                        nodes: nextNodes
                    }
                });
            }
        case "update-edge":
            {
                const currentEdge = state.edges.find((edge)=>edge.id === command.id);
                if (!currentEdge) {
                    return unchanged(state, "Relationship was not found.");
                }
                const currentWorkflowEdge = currentEdge.data?.workflowEdge || (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createWorkflowEdgeRecord"])({
                    id: currentEdge.id,
                    sourceBlockId: currentEdge.source,
                    targetBlockId: currentEdge.target,
                    reason: "Migrated visual connection to typed relationship."
                });
                const relationshipType = command.updates.relationshipType || currentWorkflowEdge.relationshipType;
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$workflow$2d$validation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isKnownWorkflowRelationshipType"])(relationshipType)) {
                    return unchanged(state, "Relationship type is not recognized.");
                }
                const validation = assertRelationshipUpdateAllowed({
                    currentEdge,
                    nextRelationshipType: relationshipType,
                    state
                });
                if (!validation.ok) {
                    return unchanged(state, validation.message);
                }
                const workflowEdge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["updateWorkflowEdgeRecord"])(currentWorkflowEdge, command.updates);
                const canvasEdge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createCanvasEdgeFromWorkflowEdge"])(workflowEdge);
                const nextEdge = {
                    ...currentEdge,
                    ...canvasEdge
                };
                return changed({
                    auditEvents: [
                        auditEvent({
                            after: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["summarizeEdgeForAudit"])(nextEdge),
                            before: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["summarizeEdgeForAudit"])(currentEdge),
                            metadata: {
                                relationshipType: workflowEdge.relationshipType,
                                status: workflowEdge.status,
                                updatedKeys: Object.keys(command.updates)
                            },
                            reason: workflowEdge.reason,
                            state,
                            targetObjectId: command.id,
                            targetObjectType: "edge",
                            type: "edge_updated"
                        })
                    ],
                    events: [
                        event({
                            message: "Updated relationship metadata.",
                            metadata: {
                                relationshipType: workflowEdge.relationshipType,
                                status: workflowEdge.status
                            },
                            subjectId: command.id,
                            type: command.type
                        })
                    ],
                    saveMode: "debounced",
                    state: {
                        ...state,
                        edges: state.edges.map((edge)=>{
                            if (edge.id !== command.id) {
                                return edge;
                            }
                            return {
                                ...edge,
                                ...canvasEdge,
                                selected: edge.selected,
                                sourceHandle: edge.sourceHandle,
                                targetHandle: edge.targetHandle
                            };
                        })
                    }
                });
            }
        case "split-edge":
            {
                const edge = state.edges.find((item)=>item.id === command.edgeId);
                const sourceNode = edge ? state.nodes.find((node)=>node.id === edge.source) : undefined;
                const targetNode = edge ? state.nodes.find((node)=>node.id === edge.target) : undefined;
                const sourceBlock = sourceNode?.data.block;
                const targetBlock = targetNode?.data.block;
                const catalogItem = getCatalogItemOrFallback(command.catalogId);
                if (!(edge && sourceNode && targetNode && sourceBlock && targetBlock && catalogItem)) {
                    return unchanged(state, "Unable to split this relationship safely.");
                }
                const insertedBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createWorkflowBlockFromCatalog"])(catalogItem.id, {
                    id: command.insertedId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    label: `${catalogItem.label} between ${sourceBlock.label} and ${targetBlock.label}`,
                    description: "Inserted between an existing typed workflow relationship.",
                    position: getInsertedBlockPosition({
                        sourceNode,
                        targetNode
                    }),
                    status: "draft"
                });
                const sourceDefaults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getWorkflowEdgeDefaults"])({
                    sourceBlock,
                    targetBlock: insertedBlock
                });
                const targetDefaults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getWorkflowEdgeDefaults"])({
                    sourceBlock: insertedBlock,
                    targetBlock
                });
                if (!(sourceDefaults && targetDefaults)) {
                    return unchanged(state, "That block cannot be inserted between this source and target with supported relationship types.");
                }
                const originalWorkflowEdge = edge.data?.workflowEdge || (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createWorkflowEdgeRecord"])({
                    id: edge.id,
                    sourceBlockId: edge.source,
                    targetBlockId: edge.target,
                    reason: "Migrated visual connection before splitting."
                });
                const [sourceToInserted, insertedToTarget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSplitWorkflowEdgeRecords"])({
                    insertedBlock,
                    originalEdge: {
                        ...originalWorkflowEdge,
                        relationshipType: sourceDefaults.relationshipType,
                        reason: `${sourceDefaults.reason} Split from ${originalWorkflowEdge.id}.`
                    }
                });
                const targetEdge = {
                    ...insertedToTarget,
                    relationshipType: targetDefaults.relationshipType,
                    reason: `${targetDefaults.reason} Split from ${originalWorkflowEdge.id}.`
                };
                const insertedNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createWorkflowNodeFromBlock"])(insertedBlock, {
                    selected: true
                });
                const auditEvents = [
                    auditEvent({
                        after: {
                            insertedBlockId: insertedBlock.id,
                            sourceEdgeId: sourceToInserted.id,
                            targetEdgeId: targetEdge.id
                        },
                        before: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["summarizeEdgeForAudit"])(edge),
                        metadata: {
                            catalogId: catalogItem.id,
                            insertedFamily: insertedBlock.family,
                            originalEdgeId: originalWorkflowEdge.id
                        },
                        reason: "Inserted a block into an existing relationship.",
                        state,
                        targetObjectId: originalWorkflowEdge.id,
                        targetObjectType: "edge",
                        type: "edge_split"
                    })
                ];
                if (sourceBlock.family === "Source" && insertedBlock.family === "Logic") {
                    auditEvents.push(auditEvent({
                        after: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$workflow$2d$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["summarizeBlockForAudit"])(insertedNode),
                        metadata: {
                            catalogId: catalogItem.id,
                            sourceBlockId: sourceBlock.id
                        },
                        reason: "Created downstream Logic from Source evidence.",
                        sourceId: sourceBlock.id,
                        state,
                        targetObjectId: insertedBlock.id,
                        targetObjectType: "block",
                        type: "source_derived_logic_created"
                    }));
                }
                return changed({
                    auditEvents,
                    events: [
                        event({
                            message: `Inserted ${insertedBlock.label} between relationship endpoints.`,
                            metadata: {
                                catalogId: catalogItem.id,
                                originalEdgeId: originalWorkflowEdge.id
                            },
                            subjectId: insertedBlock.id,
                            type: command.type
                        })
                    ],
                    history: true,
                    saveMode: "immediate",
                    state: {
                        ...state,
                        activeTab: "properties",
                        edges: [
                            ...state.edges.filter((item)=>item.id !== edge.id).map((item)=>({
                                    ...item,
                                    selected: false
                                })),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createCanvasEdgeFromWorkflowEdge"])(sourceToInserted),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createCanvasEdgeFromWorkflowEdge"])(targetEdge)
                        ],
                        nodes: [
                            ...state.nodes.map((node)=>({
                                    ...node,
                                    selected: false
                                })),
                            insertedNode
                        ],
                        selectedEdgeId: null,
                        selectedNodeId: insertedBlock.id
                    }
                });
            }
        case "clear-workflow":
            {
                return changed({
                    events: [
                        event({
                            message: "Cleared workflow draft.",
                            metadata: {
                                edgeCount: state.edges.length,
                                nodeCount: state.nodes.length
                            },
                            type: command.type
                        })
                    ],
                    history: true,
                    saveMode: "none",
                    state: {
                        ...state,
                        edges: [],
                        nodes: [],
                        selectedEdgeId: null,
                        selectedNodeId: null
                    }
                });
            }
        default:
            return unchanged(state);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/state/workflow-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "activeRightPanelAtom",
    ()=>activeRightPanelAtom,
    "addNodeAtom",
    ()=>addNodeAtom,
    "autosaveAtom",
    ()=>autosaveAtom,
    "builderFocusTargetAtom",
    ()=>builderFocusTargetAtom,
    "canRedoAtom",
    ()=>canRedoAtom,
    "canUndoAtom",
    ()=>canUndoAtom,
    "clearNodeStatusesAtom",
    ()=>clearNodeStatusesAtom,
    "clearWorkflowAtom",
    ()=>clearWorkflowAtom,
    "connectBlocksAtom",
    ()=>connectBlocksAtom,
    "currentWorkflowIdAtom",
    ()=>currentWorkflowIdAtom,
    "currentWorkflowNameAtom",
    ()=>currentWorkflowNameAtom,
    "currentWorkflowVisibilityAtom",
    ()=>currentWorkflowVisibilityAtom,
    "deleteEdgeAtom",
    ()=>deleteEdgeAtom,
    "deleteNodeAtom",
    ()=>deleteNodeAtom,
    "deleteSelectedItemsAtom",
    ()=>deleteSelectedItemsAtom,
    "edgesAtom",
    ()=>edgesAtom,
    "executionLogsAtom",
    ()=>executionLogsAtom,
    "focusNodeIdAtom",
    ()=>focusNodeIdAtom,
    "hasSidebarBeenShownAtom",
    ()=>hasSidebarBeenShownAtom,
    "hasUnsavedChangesAtom",
    ()=>hasUnsavedChangesAtom,
    "insertBlockBetweenEdgeAtom",
    ()=>insertBlockBetweenEdgeAtom,
    "isBottomPanelExpandedAtom",
    ()=>isBottomPanelExpandedAtom,
    "isExecutingAtom",
    ()=>isExecutingAtom,
    "isGeneratingAtom",
    ()=>isGeneratingAtom,
    "isLoadingAtom",
    ()=>isLoadingAtom,
    "isPanelAnimatingAtom",
    ()=>isPanelAnimatingAtom,
    "isSavingAtom",
    ()=>isSavingAtom,
    "isSidebarCollapsedAtom",
    ()=>isSidebarCollapsedAtom,
    "isTransitioningFromHomepageAtom",
    ()=>isTransitioningFromHomepageAtom,
    "isWorkflowOwnerAtom",
    ()=>isWorkflowOwnerAtom,
    "loadWorkflowAtom",
    ()=>loadWorkflowAtom,
    "localWorkflowRevisionAtom",
    ()=>localWorkflowRevisionAtom,
    "newlyCreatedNodeIdAtom",
    ()=>newlyCreatedNodeIdAtom,
    "nodesAtom",
    ()=>nodesAtom,
    "onEdgesChangeAtom",
    ()=>onEdgesChangeAtom,
    "onNodesChangeAtom",
    ()=>onNodesChangeAtom,
    "pendingIntegrationNodesAtom",
    ()=>pendingIntegrationNodesAtom,
    "propertiesPanelActiveTabAtom",
    ()=>propertiesPanelActiveTabAtom,
    "redoAtom",
    ()=>redoAtom,
    "rightPanelWidthAtom",
    ()=>rightPanelWidthAtom,
    "saveWorkflowAsAtom",
    ()=>saveWorkflowAsAtom,
    "selectedEdgeAtom",
    ()=>selectedEdgeAtom,
    "selectedExecutionIdAtom",
    ()=>selectedExecutionIdAtom,
    "selectedNodeAtom",
    ()=>selectedNodeAtom,
    "showClearDialogAtom",
    ()=>showClearDialogAtom,
    "showDeleteDialogAtom",
    ()=>showDeleteDialogAtom,
    "showMinimapAtom",
    ()=>showMinimapAtom,
    "triggerExecuteAtom",
    ()=>triggerExecuteAtom,
    "triggerFitViewAtom",
    ()=>triggerFitViewAtom,
    "undoAtom",
    ()=>undoAtom,
    "updateEdgeDataAtom",
    ()=>updateEdgeDataAtom,
    "updateNodeDataAtom",
    ()=>updateNodeDataAtom,
    "workflowAuditEventsAtom",
    ()=>workflowAuditEventsAtom,
    "workflowChangeEventsAtom",
    ()=>workflowChangeEventsAtom,
    "workflowNotFoundAtom",
    ()=>workflowNotFoundAtom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$change$2d$log$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/audit/change-log.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$commands$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/state/workflow-commands.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/platform/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/shared/workflow-engine/local-fiscal-workflow.ts [app-client] (ecmascript) <locals>");
;
;
;
;
;
const nodesAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])([]);
const edgesAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])([]);
const selectedNodeAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null);
const selectedEdgeAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null);
const localWorkflowRevisionAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(0);
const isExecutingAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
const isLoadingAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
const isGeneratingAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
const currentWorkflowIdAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null);
const currentWorkflowNameAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])("");
const currentWorkflowVisibilityAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])("private");
const isWorkflowOwnerAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(true); // Whether current user owns this workflow
const propertiesPanelActiveTabAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])("properties");
const showMinimapAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
const selectedExecutionIdAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null);
const rightPanelWidthAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null);
const isPanelAnimatingAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
const hasSidebarBeenShownAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
const isSidebarCollapsedAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(true);
const isBottomPanelExpandedAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
const isTransitioningFromHomepageAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
const activeRightPanelAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null);
const triggerFitViewAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
const builderFocusTargetAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null);
const focusNodeIdAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null);
const pendingIntegrationNodesAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(new Set());
const newlyCreatedNodeIdAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null);
const triggerExecuteAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
const executionLogsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])({});
const workflowChangeEventsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])([]);
const workflowAuditEventsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])([]);
function toWorkflowEvent(change) {
    return {
        id: change.id,
        type: "workflow_command",
        message: change.message,
        createdAt: change.createdAt,
        createdBy: change.createdBy,
        details: {
            commandType: change.type,
            ...change.subjectId ? {
                subjectId: change.subjectId
            } : {},
            ...change.metadata ? change.metadata : {}
        }
    };
}
function getWorkflowCommandState(get) {
    return {
        activeTab: get(propertiesPanelActiveTabAtom),
        edges: get(edgesAtom),
        newlyCreatedNodeId: get(newlyCreatedNodeIdAtom),
        nodes: get(nodesAtom),
        selectedEdgeId: get(selectedEdgeAtom),
        selectedNodeId: get(selectedNodeAtom),
        workflowId: get(currentWorkflowIdAtom) || __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LOCAL_WORKFLOW_ID"]
    };
}
function commitWorkflowCommand(get, set, command) {
    const currentNodes = get(nodesAtom);
    const currentEdges = get(edgesAtom);
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$state$2f$workflow$2d$commands$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runWorkflowCommand"])(getWorkflowCommandState(get), command);
    if (!result.ok) {
        return result;
    }
    if (result.history) {
        set(historyAtom, [
            ...get(historyAtom),
            {
                edges: currentEdges,
                nodes: currentNodes
            }
        ]);
        set(futureAtom, []);
    }
    set(nodesAtom, result.state.nodes);
    set(edgesAtom, result.state.edges);
    set(selectedNodeAtom, result.state.selectedNodeId);
    set(selectedEdgeAtom, result.state.selectedEdgeId);
    if (result.state.activeTab) {
        set(propertiesPanelActiveTabAtom, result.state.activeTab);
    }
    if (result.state.newlyCreatedNodeId !== undefined) {
        set(newlyCreatedNodeIdAtom, result.state.newlyCreatedNodeId);
    }
    if (result.events.length > 0) {
        set(workflowChangeEventsAtom, [
            ...get(workflowChangeEventsAtom),
            ...result.events
        ]);
    }
    if (result.auditEvents.length > 0) {
        set(workflowAuditEventsAtom, [
            ...result.auditEvents,
            ...get(workflowAuditEventsAtom)
        ]);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$audit$2f$change$2d$log$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["appendWorkflowChangeEvents"])(result.auditEvents);
    }
    if (result.saveMode !== "none") {
        const latestEvent = result.events.at(-1);
        set(hasUnsavedChangesAtom, true);
        set(autosaveAtom, {
            event: latestEvent ? toWorkflowEvent(latestEvent) : undefined,
            immediate: result.saveMode === "immediate"
        });
    }
    return result;
}
// Autosave functionality
let autosaveTimeoutId = null;
const AUTOSAVE_DELAY = 1000; // 1 second debounce for field typing
const autosaveAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, async (get, set, options)=>{
    const workflowId = get(currentWorkflowIdAtom);
    const nodes = get(nodesAtom);
    const edges = get(edgesAtom);
    const workflowName = get(currentWorkflowNameAtom);
    // Only autosave if we have a workflow ID
    if (!workflowId) {
        return;
    }
    const saveFunc = async ()=>{
        try {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["isLocalWorkflowId"])(workflowId)) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["saveLocalWorkflowSnapshot"])({
                    edges,
                    event: options?.event,
                    name: workflowName,
                    nodes,
                    status: "draft"
                });
                set(localWorkflowRevisionAtom, get(localWorkflowRevisionAtom) + 1);
                set(hasUnsavedChangesAtom, false);
                return;
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].workflow.update(workflowId, {
                nodes,
                edges
            });
            // Clear the unsaved changes indicator after successful save
            set(hasUnsavedChangesAtom, false);
        } catch (error) {
            console.error("Autosave failed:", error);
        }
    };
    if (options?.immediate) {
        // Save immediately (for add/delete/connect operations)
        await saveFunc();
    } else {
        // Debounce for typing operations
        if (autosaveTimeoutId) {
            clearTimeout(autosaveTimeoutId);
        }
        autosaveTimeoutId = setTimeout(saveFunc, AUTOSAVE_DELAY);
    }
});
const onNodesChangeAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, changes)=>{
    commitWorkflowCommand(get, set, {
        changes,
        type: "apply-node-changes"
    });
});
const onEdgesChangeAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, changes)=>{
    commitWorkflowCommand(get, set, {
        changes,
        type: "apply-edge-changes"
    });
});
const addNodeAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, node)=>{
    commitWorkflowCommand(get, set, {
        node,
        type: "add-block"
    });
});
const connectBlocksAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, connection)=>commitWorkflowCommand(get, set, {
        connection,
        type: "connect-blocks"
    }));
const updateNodeDataAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, { id, data })=>{
    commitWorkflowCommand(get, set, {
        data,
        id,
        type: "update-block"
    });
});
const deleteNodeAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, nodeId)=>{
    commitWorkflowCommand(get, set, {
        nodeId,
        type: "delete-block"
    });
});
const deleteEdgeAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, edgeId)=>{
    commitWorkflowCommand(get, set, {
        edgeId,
        type: "delete-edge"
    });
});
const updateEdgeDataAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, { id, updates })=>{
    commitWorkflowCommand(get, set, {
        id,
        type: "update-edge",
        updates
    });
});
const insertBlockBetweenEdgeAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set, { catalogId, edgeId })=>{
    const result = commitWorkflowCommand(get, set, {
        catalogId,
        edgeId,
        type: "split-edge"
    });
    return {
        ok: result.ok,
        message: result.message || result.events.at(-1)?.message || "Relationship split completed."
    };
});
const deleteSelectedItemsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set)=>{
    commitWorkflowCommand(get, set, {
        type: "delete-selected"
    });
});
const clearWorkflowAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set)=>{
    commitWorkflowCommand(get, set, {
        type: "clear-workflow"
    });
});
const loadWorkflowAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, async (_get, set)=>{
    try {
        set(isLoadingAtom, true);
        const workflow = await __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].workflow.getCurrent();
        set(nodesAtom, workflow.nodes);
        set(edgesAtom, workflow.edges);
        if (workflow.id) {
            set(currentWorkflowIdAtom, workflow.id);
        }
    } catch (error) {
        console.error("Failed to load workflow:", error);
    } finally{
        set(isLoadingAtom, false);
    }
});
const saveWorkflowAsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, async (get, _set, { name, description })=>{
    const nodes = get(nodesAtom);
    const edges = get(edgesAtom);
    try {
        const workflow = await __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].workflow.create({
            name,
            description,
            nodes,
            edges
        });
        return workflow;
    } catch (error) {
        console.error("Failed to save workflow:", error);
        throw error;
    }
});
const showClearDialogAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
const showDeleteDialogAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
const isSavingAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
const hasUnsavedChangesAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
const workflowNotFoundAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
const historyAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])([]);
const futureAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])([]);
const undoAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set)=>{
    const history = get(historyAtom);
    if (history.length === 0) {
        return;
    }
    const currentNodes = get(nodesAtom);
    const currentEdges = get(edgesAtom);
    const future = get(futureAtom);
    // Save current state to future
    set(futureAtom, [
        ...future,
        {
            nodes: currentNodes,
            edges: currentEdges
        }
    ]);
    // Pop from history and set as current
    const newHistory = [
        ...history
    ];
    const previousState = newHistory.pop();
    if (!previousState) {
        return; // No history to undo
    }
    set(historyAtom, newHistory);
    set(nodesAtom, previousState.nodes);
    set(edgesAtom, previousState.edges);
    // Mark as having unsaved changes
    set(hasUnsavedChangesAtom, true);
});
const redoAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set)=>{
    const future = get(futureAtom);
    if (future.length === 0) {
        return;
    }
    const currentNodes = get(nodesAtom);
    const currentEdges = get(edgesAtom);
    const history = get(historyAtom);
    // Save current state to history
    set(historyAtom, [
        ...history,
        {
            nodes: currentNodes,
            edges: currentEdges
        }
    ]);
    // Pop from future and set as current
    const newFuture = [
        ...future
    ];
    const nextState = newFuture.pop();
    if (!nextState) {
        return; // No future to redo
    }
    set(futureAtom, newFuture);
    set(nodesAtom, nextState.nodes);
    set(edgesAtom, nextState.edges);
    // Mark as having unsaved changes
    set(hasUnsavedChangesAtom, true);
});
const canUndoAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])((get)=>get(historyAtom).length > 0);
const canRedoAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])((get)=>get(futureAtom).length > 0);
const clearNodeStatusesAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null, (get, set)=>{
    const currentNodes = get(nodesAtom);
    const newNodes = currentNodes.map((node)=>({
            ...node,
            data: {
                ...node.data,
                status: "idle"
            }
        }));
    set(nodesAtom, newNodes);
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/local-tool-runner.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runLocalWorkflowTools",
    ()=>runLocalWorkflowTools
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/shared/workflow-engine/local-fiscal-workflow.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$tool$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/local-tool-registry.ts [app-client] (ecmascript)");
;
;
function makeRunId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function toExecutionStatus(status) {
    return status === "error" ? "error" : "success";
}
function toWorkflowStatus(status) {
    return status === "error" ? "error" : "success";
}
function getWorkflowStatus(results) {
    if (results.some((result)=>result.status === "error")) {
        return "error";
    }
    if (results.some((result)=>result.status === "needs_review")) {
        return "needs_review";
    }
    if (results.some((result)=>result.status === "warning")) {
        return "warning";
    }
    if (results.some((result)=>result.status === "skipped")) {
        return "warning";
    }
    return "success";
}
function dedupeMessages(messages) {
    return [
        ...new Set(messages.filter(Boolean))
    ];
}
function getEdgeRunStatus({ sourceResult, targetResult }) {
    if (!(sourceResult && targetResult)) {
        return null;
    }
    if (sourceResult.status === "error" || targetResult.status === "error") {
        return "error";
    }
    if (sourceResult.status === "needs_review" || sourceResult.status === "warning" || sourceResult.status === "skipped" || targetResult.status === "needs_review" || targetResult.status === "warning" || targetResult.status === "skipped") {
        return "warning";
    }
    return "success";
}
function dedupeEvidence(refs) {
    return [
        ...new Map(refs.map((ref)=>[
                ref.evidenceId,
                ref
            ])).values()
    ];
}
function dedupeTrace(refs) {
    return [
        ...new Map(refs.map((ref)=>[
                `${ref.sourceBlockId}:${ref.rowId || ""}:${ref.evidenceRefId || ""}`,
                ref
            ])).values()
    ];
}
function getActiveSchemaEdges(definition) {
    return definition.edges.filter((edge)=>edge.status === "active");
}
function collectAncestorBlockIds({ blockId, edges }) {
    const ancestors = new Set([
        blockId
    ]);
    let changed = true;
    while(changed){
        changed = false;
        for (const edge of edges){
            if (ancestors.has(edge.targetBlockId) && !ancestors.has(edge.sourceBlockId)) {
                ancestors.add(edge.sourceBlockId);
                changed = true;
            }
        }
    }
    return ancestors;
}
function collectDescendantBlockIds({ blockId, edges }) {
    const descendants = new Set([
        blockId
    ]);
    let changed = true;
    while(changed){
        changed = false;
        for (const edge of edges){
            if (descendants.has(edge.sourceBlockId) && !descendants.has(edge.targetBlockId)) {
                descendants.add(edge.targetBlockId);
                changed = true;
            }
        }
    }
    return descendants;
}
function getExecutionBlocks({ definition, mode, selectedBlockId }) {
    if (mode === "selected" && selectedBlockId) {
        const ancestors = collectAncestorBlockIds({
            blockId: selectedBlockId,
            edges: getActiveSchemaEdges(definition)
        });
        return definition.blocks.filter((block)=>ancestors.has(block.id));
    }
    if (mode === "downstream" && selectedBlockId) {
        const activeEdges = getActiveSchemaEdges(definition);
        const ancestors = collectAncestorBlockIds({
            blockId: selectedBlockId,
            edges: activeEdges
        });
        const descendants = collectDescendantBlockIds({
            blockId: selectedBlockId,
            edges: activeEdges
        });
        return definition.blocks.filter((block)=>ancestors.has(block.id) || descendants.has(block.id));
    }
    return definition.blocks;
}
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Kahn ordering is kept explicit for this local runner.
function orderBlocks({ blocks, edges }) {
    const blockIds = new Set(blocks.map((block)=>block.id));
    const incomingCounts = new Map(blocks.map((block)=>[
            block.id,
            0
        ]));
    const outgoing = new Map();
    for (const edge of edges){
        if (!(blockIds.has(edge.sourceBlockId) && blockIds.has(edge.targetBlockId))) {
            continue;
        }
        incomingCounts.set(edge.targetBlockId, (incomingCounts.get(edge.targetBlockId) || 0) + 1);
        outgoing.set(edge.sourceBlockId, [
            ...outgoing.get(edge.sourceBlockId) || [],
            edge
        ]);
    }
    const byPosition = [
        ...blocks
    ].sort((a, b)=>a.position.x - b.position.x || a.position.y - b.position.y);
    const queue = byPosition.filter((block)=>incomingCounts.get(block.id) === 0);
    const ordered = [];
    while(queue.length > 0){
        const block = queue.shift();
        if (!block) {
            continue;
        }
        ordered.push(block);
        for (const edge of outgoing.get(block.id) || []){
            const nextCount = (incomingCounts.get(edge.targetBlockId) || 0) - 1;
            incomingCounts.set(edge.targetBlockId, nextCount);
            if (nextCount === 0) {
                const nextBlock = byPosition.find((item)=>item.id === edge.targetBlockId);
                if (nextBlock) {
                    queue.push(nextBlock);
                    queue.sort((a, b)=>a.position.x - b.position.x || a.position.y - b.position.y);
                }
            }
        }
    }
    const orderedIds = new Set(ordered.map((block)=>block.id));
    return [
        ...ordered,
        ...byPosition.filter((block)=>!orderedIds.has(block.id))
    ];
}
function createSkippedResult({ block, message, runId, startedAt, toolId }) {
    const completedAt = new Date().toISOString();
    const log = {
        at: completedAt,
        id: `tool-log-${block.id}-${Date.now()}`,
        level: "warning",
        message
    };
    return {
        blockId: block.id,
        completedAt,
        errors: [],
        evidenceRefs: [],
        logs: [
            log
        ],
        output: {
            reason: message,
            skipped: true
        },
        runId,
        sourceTrace: [],
        startedAt,
        status: "skipped",
        toolId,
        warnings: [
            message
        ]
    };
}
function getIncomingEdges({ blockId, edges, subsetIds }) {
    return edges.filter((edge)=>edge.targetBlockId === blockId && subsetIds.has(edge.sourceBlockId));
}
function createExecutionLog({ block, executionId, index, result, startedAt }) {
    const stepStartedAt = new Date(startedAt.getTime() + index * 80);
    const completedAt = new Date(stepStartedAt.getTime() + 72);
    return {
        completedAt,
        duration: String(completedAt.getTime() - stepStartedAt.getTime()),
        error: result.errors.join("\n") || null,
        executionId,
        id: `${executionId}-${block.id}`,
        input: {
            sourceTrace: result.sourceTrace,
            toolId: result.toolId,
            upstream: result.output.upstreamBlockIds
        },
        nodeId: block.id,
        nodeName: block.label,
        nodeType: `${block.family} / ${block.subtype}`,
        output: result,
        startedAt: stepStartedAt,
        status: toExecutionStatus(result.status)
    };
}
function createWorkflowDefinition({ edges, nodes, workflowName }) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createWorkflowDefinitionFromCanvas"])({
        edges,
        name: workflowName || "Fiscal Workflow Studio",
        nodes,
        status: "draft"
    });
}
function runLocalWorkflowTools({ edges, mode = "workflow", nodes, selectedBlockId, workflowName }) {
    const definition = createWorkflowDefinition({
        edges,
        nodes,
        workflowName
    });
    const schemaEdges = getActiveSchemaEdges(definition);
    const executionId = makeRunId(mode === "workflow" ? "local-tool-workflow" : `local-tool-${mode}`);
    const startedAt = new Date();
    const startedAtIso = startedAt.toISOString();
    const runnableBlocks = getExecutionBlocks({
        definition,
        mode,
        selectedBlockId
    });
    const subsetIds = new Set(runnableBlocks.map((block)=>block.id));
    const orderedBlocks = orderBlocks({
        blocks: runnableBlocks,
        edges: schemaEdges
    });
    const allResults = {};
    const logs = [];
    orderedBlocks.forEach((block, index)=>{
        const tool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$tool$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getToolForBlock"])(block);
        const toolId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$tool$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getToolIdForBlock"])(block);
        const incomingEdges = getIncomingEdges({
            blockId: block.id,
            edges: schemaEdges,
            subsetIds
        });
        const upstreamResults = incomingEdges.map((edge)=>allResults[edge.sourceBlockId]).filter((upstreamResult)=>Boolean(upstreamResult));
        const upstreamBlocks = incomingEdges.map((edge)=>definition.blocks.find((candidate)=>candidate.id === edge.sourceBlockId)).filter((candidate)=>Boolean(candidate));
        const resultStartedAt = new Date(startedAt.getTime() + index * 80).toISOString();
        const result = !tool ? createSkippedResult({
            block,
            message: `No local deterministic tool is registered for ${block.family} / ${block.subtype}.`,
            runId: executionId,
            startedAt: resultStartedAt,
            toolId
        }) : tool.execute({
            allResults,
            block,
            config: {
                ...tool.defaultConfig,
                ...block.config,
                toolId
            },
            evidenceRefs: dedupeEvidence(upstreamResults.flatMap((item)=>item.evidenceRefs)),
            runId: executionId,
            sourceTrace: dedupeTrace(upstreamResults.flatMap((item)=>item.sourceTrace)),
            startedAt: resultStartedAt,
            upstreamBlocks,
            upstreamOutputs: Object.fromEntries(upstreamResults.map((item)=>[
                    item.blockId,
                    item.output
                ])),
            upstreamResults,
            workflow: definition
        });
        allResults[block.id] = {
            ...result,
            output: {
                bindingValidation: incomingEdges.map((edge)=>({
                        bindingLabel: edge.bindingLabel,
                        bindingStatus: edge.bindingStatus,
                        sourceBlockId: edge.sourceBlockId,
                        sourceOutputRole: edge.sourceOutputRole,
                        targetInputRole: edge.targetInputRole
                    })),
                ...result.output,
                upstreamBlockIds: upstreamBlocks.map((item)=>item.id)
            }
        };
        logs.push(createExecutionLog({
            block,
            executionId,
            index,
            result: allResults[block.id],
            startedAt
        }));
    });
    const completedAt = new Date(startedAt.getTime() + logs.length * 90 + 120);
    const results = orderedBlocks.map((block)=>allResults[block.id]).filter((result)=>Boolean(result));
    const edgeStatuses = Object.fromEntries(schemaEdges.map((edge)=>{
        const status = getEdgeRunStatus({
            sourceResult: allResults[edge.sourceBlockId],
            targetResult: allResults[edge.targetBlockId]
        });
        return status ? [
            edge.id,
            status
        ] : null;
    }).filter((entry)=>Boolean(entry)));
    const workflowStatus = getWorkflowStatus(results);
    const workflowResult = {
        completedAt: completedAt.toISOString(),
        errors: dedupeMessages(results.flatMap((result)=>result.errors)),
        logs: results.flatMap((result)=>result.logs),
        results,
        runId: executionId,
        startedAt: startedAtIso,
        status: workflowStatus,
        warnings: dedupeMessages(results.flatMap((result)=>result.warnings)),
        workflowId: definition.id || __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LOCAL_WORKFLOW_ID"],
        workflowName: definition.name
    };
    const record = {
        execution: {
            completedAt,
            duration: String(completedAt.getTime() - startedAt.getTime()),
            error: workflowResult.errors.join("\n") || null,
            id: executionId,
            startedAt,
            status: toWorkflowStatus(workflowStatus),
            workflowId: definition.id || __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LOCAL_WORKFLOW_ID"]
        },
        logs
    };
    return {
        blockStatuses: Object.fromEntries(results.map((result)=>[
                result.blockId,
                toExecutionStatus(result.status)
            ])),
        edgeStatuses,
        record,
        result: workflowResult
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/codegen/workflow-codegen-shared.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ARRAY_INDEX_PATTERN",
    ()=>ARRAY_INDEX_PATTERN,
    "NON_ALPHANUMERIC_PATTERN",
    ()=>NON_ALPHANUMERIC_PATTERN,
    "NUMBER_START_PATTERN",
    ()=>NUMBER_START_PATTERN,
    "TEMPLATE_PATTERN",
    ()=>TEMPLATE_PATTERN,
    "VALID_IDENTIFIER_PATTERN",
    ()=>VALID_IDENTIFIER_PATTERN,
    "WHITESPACE_PATTERN",
    ()=>WHITESPACE_PATTERN,
    "analyzeNodeUsage",
    ()=>analyzeNodeUsage,
    "buildAccessPath",
    ()=>buildAccessPath,
    "buildEdgeMap",
    ()=>buildEdgeMap,
    "escapeForTemplateLiteral",
    ()=>escapeForTemplateLiteral,
    "extractRefsFromConfigValue",
    ()=>extractRefsFromConfigValue,
    "findNodeReferences",
    ()=>findNodeReferences,
    "findTriggerNodes",
    ()=>findTriggerNodes,
    "getStepInfo",
    ()=>getStepInfo,
    "processAiSchema",
    ()=>processAiSchema,
    "removeInvisibleChars",
    ()=>removeInvisibleChars,
    "sanitizeFunctionName",
    ()=>sanitizeFunctionName,
    "sanitizeStepName",
    ()=>sanitizeStepName,
    "sanitizeVarName",
    ()=>sanitizeVarName,
    "toFriendlyVarName",
    ()=>toFriendlyVarName,
    "toTypeScriptLiteral",
    ()=>toTypeScriptLiteral
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/plugins/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/registry.ts [app-client] (ecmascript)");
;
const TEMPLATE_PATTERN = /\{\{([^}]+)\}\}/g;
const WHITESPACE_PATTERN = /\s+/;
const NON_ALPHANUMERIC_PATTERN = /[^a-zA-Z0-9]/g;
const ARRAY_INDEX_PATTERN = /^([^[]+)\[(\d+)\]$/;
const VALID_IDENTIFIER_PATTERN = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
const NUMBER_START_PATTERN = /^[0-9]/;
function findNodeReferences(template) {
    const refs = new Set();
    if (!template || typeof template !== "string") {
        return refs;
    }
    let match;
    // biome-ignore lint/suspicious/noAssignInExpressions: pattern.exec() is the standard way to iterate regex matches
    while((match = TEMPLATE_PATTERN.exec(template)) !== null){
        const expression = match[1].trim();
        // Handle @nodeId:DisplayName.field format
        if (expression.startsWith("@")) {
            const withoutAt = expression.substring(1);
            const colonIndex = withoutAt.indexOf(":");
            if (colonIndex !== -1) {
                const nodeId = withoutAt.substring(0, colonIndex);
                refs.add(nodeId);
            }
        } else if (expression.startsWith("$")) {
            const withoutDollar = expression.substring(1);
            const parts = withoutDollar.split(".");
            if (parts.length > 0) {
                refs.add(parts[0]);
            }
        }
    }
    return refs;
}
function extractRefsFromConfigValue(value) {
    const refs = new Set();
    if (typeof value === "string") {
        const foundRefs = findNodeReferences(value);
        for (const ref of foundRefs){
            refs.add(ref);
        }
    }
    return refs;
}
function analyzeNodeUsage(nodes) {
    const usedNodes = new Set();
    for (const node of nodes){
        if (node.data.type !== "action") {
            continue;
        }
        const config = node.data.config || {};
        for (const value of Object.values(config)){
            const refs = extractRefsFromConfigValue(value);
            for (const ref of refs){
                usedNodes.add(ref);
            }
        }
    }
    return usedNodes;
}
function buildEdgeMap(edges) {
    const edgesBySource = new Map();
    for (const edge of edges){
        const targets = edgesBySource.get(edge.source) || [];
        targets.push(edge.target);
        edgesBySource.set(edge.source, targets);
    }
    return edgesBySource;
}
function findTriggerNodes(nodes, edges) {
    const nodesWithIncoming = new Set(edges.map((e)=>e.target));
    return nodes.filter((node)=>node.data.type === "trigger" && !nodesWithIncoming.has(node.id));
}
function buildAccessPath(fieldPath) {
    return fieldPath.split(".").map((part)=>{
        const arrayMatch = ARRAY_INDEX_PATTERN.exec(part);
        if (arrayMatch) {
            return `.${arrayMatch[1]}[${arrayMatch[2]}]`;
        }
        return `.${part}`;
    }).join("");
}
function toFriendlyVarName(label, actionType) {
    // Use label if available, otherwise fall back to action type
    const baseName = label || actionType || "result";
    // Convert to camelCase: "Generate Friendly Greeting Email" -> "generateFriendlyGreetingEmail"
    const camelCase = baseName.split(WHITESPACE_PATTERN).map((word, index)=>{
        const cleaned = word.replace(NON_ALPHANUMERIC_PATTERN, "");
        if (!cleaned) {
            return "";
        }
        if (index === 0) {
            return cleaned.toLowerCase();
        }
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
    }).filter((word)=>word.length > 0).join("");
    // Add "Result" suffix
    return `${camelCase}Result`;
}
function removeInvisibleChars(str) {
    // Replace non-breaking space (U+00a0) and other invisible spaces with regular space
    return str.replace(/\u00a0/g, " ") // Non-breaking space
    .replace(/[\u2000-\u200B\u2028\u2029]/g, " "); // Various invisible space characters
}
function escapeForTemplateLiteral(str) {
    if (!str) {
        return "";
    }
    return str.replace(/\\/g, "\\\\") // Escape backslashes first
    .replace(/`/g, "\\`"); // Escape backticks
}
function sanitizeFunctionName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, "_").replace(NUMBER_START_PATTERN, "_$&").replace(/_+/g, "_");
}
function sanitizeStepName(name) {
    // Create a more readable function name from the label
    // e.g., "Find Issues" -> "findIssuesStep", "Generate Email Text" -> "generateEmailTextStep"
    const result = name.split(WHITESPACE_PATTERN) // Split by whitespace
    .filter((word)=>word.length > 0) // Remove empty strings
    .map((word, index)=>{
        // Remove non-alphanumeric characters
        const cleaned = word.replace(/[^a-zA-Z0-9]/g, "");
        if (!cleaned) {
            return "";
        }
        // Capitalize first letter of each word except the first
        if (index === 0) {
            return cleaned.toLowerCase();
        }
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
    }).filter((word)=>word.length > 0) // Remove empty results
    .join("");
    // Ensure we have a valid identifier
    if (!result || result.length === 0) {
        return "unnamedStep";
    }
    // Prefix with underscore if starts with number
    const sanitized = result.replace(NUMBER_START_PATTERN, "_$&");
    // Add "Step" suffix to avoid conflicts with imports (e.g., generateText from 'ai')
    return `${sanitized}Step`;
}
function sanitizeVarName(id) {
    return id.replace(/[^a-zA-Z0-9]/g, "_");
}
function toTypeScriptLiteral(value) {
    if (value === null) {
        return "null";
    }
    if (value === undefined) {
        return "undefined";
    }
    if (typeof value === "string") {
        return JSON.stringify(value);
    }
    if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }
    if (Array.isArray(value)) {
        const items = value.map((item)=>toTypeScriptLiteral(item));
        return `[${items.join(", ")}]`;
    }
    if (typeof value === "object") {
        const entries = Object.entries(value).map(([key, val])=>{
            // Use quoted key only if it's not a valid identifier
            const keyStr = VALID_IDENTIFIER_PATTERN.test(key) ? key : JSON.stringify(key);
            return `${keyStr}: ${toTypeScriptLiteral(val)}`;
        });
        return `{${entries.join(", ")}}`;
    }
    return String(value);
}
function processAiSchema(aiSchema) {
    if (!aiSchema) {
        return null;
    }
    try {
        const parsedSchema = JSON.parse(aiSchema);
        // Remove id field from each schema object
        const schemaWithoutIds = Array.isArray(parsedSchema) ? parsedSchema.map((field)=>{
            const { id: _id, ...rest } = field;
            return rest;
        }) : parsedSchema;
        return toTypeScriptLiteral(schemaWithoutIds);
    } catch  {
        // If schema is invalid JSON, skip it
        return null;
    }
}
// System actions that don't have plugins (step info for generated code)
const SYSTEM_STEP_INFO = {
    "Database Query": {
        functionName: "databaseQueryStep",
        importPath: "./steps/database-query-step"
    },
    "HTTP Request": {
        functionName: "httpRequestStep",
        importPath: "./steps/http-request-step"
    },
    Condition: {
        functionName: "conditionStep",
        importPath: "./steps/condition-step"
    }
};
function getStepInfo(actionType) {
    // Check system actions first
    const systemInfo = SYSTEM_STEP_INFO[actionType];
    if (systemInfo) {
        return systemInfo;
    }
    // Look up in plugin registry
    const action = (0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findActionById"])(actionType);
    if (action) {
        return {
            functionName: action.stepFunction,
            // Convert plugin's stepImportPath to generated code import path
            // Plugin uses "send-email", generated code uses "./steps/send-email-step"
            importPath: `./steps/${action.stepImportPath}-step`
        };
    }
    // Fallback for unknown actions
    return {
        functionName: "unknownStep",
        importPath: "./steps/unknown-step"
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/codegen/workflow-codegen.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateWorkflowCode",
    ()=>generateWorkflowCode,
    "generateWorkflowModule",
    ()=>generateWorkflowModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/plugins/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/plugins/registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/codegen/workflow-codegen-shared.ts [app-client] (ecmascript)");
;
;
// Local constants not shared
const CONST_ASSIGNMENT_PATTERN = /^(\s*)(const\s+\w+\s*=\s*)(.*)$/;
function generateWorkflowCode(nodes, edges, options = {}) {
    const { functionName = "executeWorkflow" } = options;
    // Analyze which node outputs are actually used
    const usedNodeOutputs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["analyzeNodeUsage"])(nodes);
    // Track required imports
    const imports = new Set();
    // Build a map of node connections
    const nodeMap = new Map(nodes.map((n)=>[
            n.id,
            n
        ]));
    const edgesBySource = new Map();
    for (const edge of edges){
        const targets = edgesBySource.get(edge.source) || [];
        targets.push(edge.target);
        edgesBySource.set(edge.source, targets);
    }
    // Find trigger nodes (nodes with no incoming edges)
    const nodesWithIncoming = new Set(edges.map((e)=>e.target));
    const triggerNodes = nodes.filter((node)=>node.data.type === "trigger" && !nodesWithIncoming.has(node.id));
    // Check if any trigger's output is used (meaning input param is needed)
    const inputIsUsed = triggerNodes.some((trigger)=>usedNodeOutputs.has(trigger.id));
    // Generate code for each node
    const codeLines = [];
    const visited = new Set();
    // Generate function signature
    const functionSignature = inputIsUsed ? `export async function ${functionName}<TInput>(input: TInput) {` : `export async function ${functionName}() {`;
    codeLines.push(functionSignature);
    codeLines.push(`  "use workflow";`);
    codeLines.push("");
    // Build a map of nodeId to variable name for template references
    const nodeIdToVarName = new Map();
    const usedVarNames = new Set();
    for (const node of nodes){
        let varName;
        if (node.data.type === "action") {
            const actionType = node.data.config?.actionType;
            const label = node.data.label || "";
            const baseVarName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toFriendlyVarName"])(label, actionType);
            // Ensure uniqueness
            varName = baseVarName;
            let counter = 1;
            while(usedVarNames.has(varName)){
                varName = `${baseVarName}${counter}`;
                counter += 1;
            }
            usedVarNames.add(varName);
        } else {
            // For triggers, use `input` directly - no intermediate variable needed
            varName = "input";
        }
        nodeIdToVarName.set(node.id, varName);
    }
    // Helper to process @nodeId:DisplayName.field format for template strings
    function processAtFormat(trimmed, match) {
        const withoutAt = trimmed.substring(1);
        const colonIndex = withoutAt.indexOf(":");
        if (colonIndex === -1) {
            return match;
        }
        const nodeId = withoutAt.substring(0, colonIndex);
        const rest = withoutAt.substring(colonIndex + 1);
        const dotIndex = rest.indexOf(".");
        const fieldPath = dotIndex !== -1 ? rest.substring(dotIndex + 1) : "";
        const varName = nodeIdToVarName.get(nodeId);
        if (!varName) {
            return match; // Node not found, keep original
        }
        if (!fieldPath) {
            return `\${${varName}}`;
        }
        const accessPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildAccessPath"])(fieldPath);
        return `\${${varName}${accessPath}}`;
    }
    // Helper to process $nodeId.field format for template strings
    function processDollarFormat(trimmed, match) {
        const withoutDollar = trimmed.substring(1);
        const parts = withoutDollar.split(".");
        const nodeId = parts[0];
        const fieldPath = parts.slice(1).join(".");
        const varName = nodeIdToVarName.get(nodeId);
        if (!varName) {
            return match; // Node not found, keep original
        }
        if (!fieldPath) {
            return `\${${varName}}`;
        }
        const accessPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildAccessPath"])(fieldPath);
        return `\${${varName}${accessPath}}`;
    }
    // Helper to process @nodeId:DisplayName.field format for JavaScript expressions (not template strings)
    function processAtFormatForExpression(trimmed, match) {
        const withoutAt = trimmed.substring(1);
        const colonIndex = withoutAt.indexOf(":");
        if (colonIndex === -1) {
            return match;
        }
        const nodeId = withoutAt.substring(0, colonIndex);
        const rest = withoutAt.substring(colonIndex + 1);
        const dotIndex = rest.indexOf(".");
        const fieldPath = dotIndex !== -1 ? rest.substring(dotIndex + 1) : "";
        const varName = nodeIdToVarName.get(nodeId);
        if (!varName) {
            return match; // Node not found, keep original
        }
        if (!fieldPath) {
            return varName;
        }
        const accessPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildAccessPath"])(fieldPath);
        return `${varName}${accessPath}`;
    }
    // Helper to process $nodeId.field format for JavaScript expressions (not template strings)
    function processDollarFormatForExpression(trimmed, match) {
        const withoutDollar = trimmed.substring(1);
        const parts = withoutDollar.split(".");
        const nodeId = parts[0];
        const fieldPath = parts.slice(1).join(".");
        const varName = nodeIdToVarName.get(nodeId);
        if (!varName) {
            return match; // Node not found, keep original
        }
        if (!fieldPath) {
            return varName;
        }
        const accessPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildAccessPath"])(fieldPath);
        return `${varName}${accessPath}`;
    }
    // Helper to convert template variables to JavaScript expressions for template strings
    function convertTemplateToJS(template) {
        if (!template || typeof template !== "string") {
            return template;
        }
        return template.replace(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEMPLATE_PATTERN"], (match, expression)=>{
            const trimmed = expression.trim();
            if (trimmed.startsWith("@")) {
                return processAtFormat(trimmed, match);
            }
            if (trimmed.startsWith("$")) {
                return processDollarFormat(trimmed, match);
            }
            return match;
        });
    }
    // Helper to convert template variables to JavaScript expressions (not template literal syntax)
    function convertConditionToJS(condition) {
        if (!condition || typeof condition !== "string") {
            return condition;
        }
        // First remove invisible characters (non-breaking spaces, etc.)
        const cleaned = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeInvisibleChars"])(condition);
        // Then convert template references
        const converted = cleaned.replace(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEMPLATE_PATTERN"], (match, expression)=>{
            const trimmed = expression.trim();
            if (trimmed.startsWith("@")) {
                return processAtFormatForExpression(trimmed, match);
            }
            if (trimmed.startsWith("$")) {
                return processDollarFormatForExpression(trimmed, match);
            }
            return match;
        });
        // Final cleanup to ensure no non-breaking spaces remain
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeInvisibleChars"])(converted);
    }
    // Helper functions to generate code for different action types
    function generateEmailActionCode(node, indent, varName) {
        const stepInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStepInfo"])("Send Email");
        imports.add(`import { ${stepInfo.functionName} } from '${stepInfo.importPath}';`);
        const config = node.data.config || {};
        const emailTo = config.emailTo || "user@example.com";
        const emailSubject = config.emailSubject || "Notification";
        const emailBody = config.emailBody || "No content";
        const convertedEmailTo = convertTemplateToJS(emailTo);
        const convertedSubject = convertTemplateToJS(emailSubject);
        const convertedBody = convertTemplateToJS(emailBody);
        // Check if template references are used (converted string contains ${)
        const hasTemplateRefs = (str)=>str.includes("${");
        // Escape template expressions for the outer template literal (use $$ to escape $)
        const escapeForOuterTemplate = (str)=>str.replace(/\$\{/g, "$${");
        // Build values - use template literals if references exist, otherwise use string literals
        const emailToValue = hasTemplateRefs(convertedEmailTo) ? `\`${escapeForOuterTemplate(convertedEmailTo).replace(/`/g, "\\`")}\`` : `'${emailTo.replace(/'/g, "\\'")}'`;
        const subjectValue = hasTemplateRefs(convertedSubject) ? `\`${escapeForOuterTemplate(convertedSubject).replace(/`/g, "\\`")}\`` : `'${emailSubject.replace(/'/g, "\\'")}'`;
        const bodyValue = hasTemplateRefs(convertedBody) ? `\`${escapeForOuterTemplate(convertedBody).replace(/`/g, "\\`")}\`` : `'${emailBody.replace(/'/g, "\\'")}'`;
        return [
            `${indent}const ${varName} = await ${stepInfo.functionName}({`,
            `${indent}  emailTo: ${emailToValue},`,
            `${indent}  emailSubject: ${subjectValue},`,
            `${indent}  emailBody: ${bodyValue},`,
            `${indent}});`
        ];
    }
    function generateTicketActionCode(node, indent, varName) {
        const stepInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStepInfo"])("Create Ticket");
        imports.add(`import { ${stepInfo.functionName} } from '${stepInfo.importPath}';`);
        const config = node.data.config || {};
        const ticketTitle = config.ticketTitle || "New Ticket";
        const ticketDescription = config.ticketDescription || "";
        const convertedTitle = convertTemplateToJS(ticketTitle);
        const convertedDescription = convertTemplateToJS(ticketDescription);
        const hasTemplateRefs = (str)=>str.includes("${");
        const escapeForOuterTemplate = (str)=>str.replace(/\$\{/g, "$${");
        const titleValue = hasTemplateRefs(convertedTitle) ? `\`${escapeForOuterTemplate(convertedTitle).replace(/`/g, "\\`")}\`` : `'${ticketTitle.replace(/'/g, "\\'")}'`;
        const descValue = hasTemplateRefs(convertedDescription) ? `\`${escapeForOuterTemplate(convertedDescription).replace(/`/g, "\\`")}\`` : `'${ticketDescription.replace(/'/g, "\\'")}'`;
        return [
            `${indent}const ${varName} = await ${stepInfo.functionName}({`,
            `${indent}  ticketTitle: ${titleValue},`,
            `${indent}  ticketDescription: ${descValue},`,
            `${indent}});`
        ];
    }
    function generateDatabaseActionCode(node, indent, varName) {
        const stepInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStepInfo"])("Database Query");
        imports.add(`import { ${stepInfo.functionName} } from '${stepInfo.importPath}';`);
        const config = node.data.config || {};
        const dbQuery = config.dbQuery || "";
        const dataSource = config.dataSource || "";
        const tableName = config.dbTable || config.tableName || "your_table";
        const lines = [
            `${indent}const ${varName} = await ${stepInfo.functionName}({`
        ];
        // dataSource as an object
        if (dataSource) {
            lines.push(`${indent}  dataSource: { name: "${dataSource}" },`);
        } else {
            lines.push(`${indent}  dataSource: {},`);
        }
        // query: SQL query if provided, otherwise table name
        if (dbQuery) {
            // Convert template references in SQL query
            const convertedQuery = convertTemplateToJS(dbQuery);
            const hasTemplateRefs = convertedQuery.includes("${");
            // Escape backticks and template literal syntax for SQL query
            const escapeForOuterTemplate = (str)=>str.replace(/\$\{/g, "$${");
            const queryValue = hasTemplateRefs ? `\`${escapeForOuterTemplate(convertedQuery).replace(/`/g, "\\`")}\`` : `\`${dbQuery.replace(/`/g, "\\`")}\``;
            lines.push(`${indent}  query: ${queryValue},`);
        } else {
            // Use table name as query string
            lines.push(`${indent}  query: "${tableName}",`);
        }
        lines.push(`${indent}});`);
        return lines;
    }
    function generateHTTPActionCode(node, indent, varName) {
        const stepInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStepInfo"])("HTTP Request");
        imports.add(`import { ${stepInfo.functionName} } from '${stepInfo.importPath}';`);
        const config = node.data.config || {};
        const endpoint = config.endpoint || "https://api.example.com/endpoint";
        const method = config.httpMethod || "POST";
        return [
            `${indent}const ${varName} = await ${stepInfo.functionName}({`,
            `${indent}  url: '${endpoint}',`,
            `${indent}  method: '${method}',`,
            `${indent}  body: {},`,
            `${indent}});`
        ];
    }
    // Helper to process AI schema and convert to TypeScript literal
    function processAiSchema(aiSchema) {
        if (!aiSchema) {
            return null;
        }
        try {
            const parsedSchema = JSON.parse(aiSchema);
            // Remove id field from each schema object
            const schemaWithoutIds = Array.isArray(parsedSchema) ? parsedSchema.map((field)=>{
                const { id: _id, ...rest } = field;
                return rest;
            }) : parsedSchema;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toTypeScriptLiteral"])(schemaWithoutIds);
        } catch  {
            // If schema is invalid JSON, skip it
            return null;
        }
    }
    // Helper to generate prompt value with template handling
    function generatePromptValue(aiPrompt) {
        const convertedPrompt = convertTemplateToJS(aiPrompt);
        const hasTemplateRefs = convertedPrompt.includes("${");
        const escapeForOuterTemplate = (str)=>str.replace(/\$\{/g, "$${");
        if (hasTemplateRefs) {
            return `\`${escapeForOuterTemplate(convertedPrompt).replace(/`/g, "\\`")}\``;
        }
        return `\`${aiPrompt.replace(/`/g, "\\`")}\``;
    }
    function generateAiTextActionCode(node, indent, varName) {
        const stepInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStepInfo"])("Generate Text");
        imports.add(`import { ${stepInfo.functionName} } from '${stepInfo.importPath}';`);
        const config = node.data.config || {};
        const aiPrompt = config.aiPrompt || "Generate a summary";
        const aiModel = config.aiModel || "meta/llama-4-scout";
        const aiFormat = config.aiFormat || "text";
        const aiSchema = config.aiSchema;
        const promptValue = generatePromptValue(aiPrompt);
        const lines = [
            `${indent}// Generate text using AI`,
            `${indent}const ${varName} = await ${stepInfo.functionName}({`,
            `${indent}  model: "${aiModel}",`,
            `${indent}  prompt: ${promptValue},`
        ];
        if (aiFormat === "object") {
            lines.push(`${indent}  format: "object",`);
            const schemaString = processAiSchema(aiSchema);
            if (schemaString) {
                lines.push(`${indent}  schema: ${schemaString},`);
            }
        }
        lines.push(`${indent}});`);
        return lines;
    }
    function generateAiImageActionCode(node, indent, varName) {
        imports.add("import { experimental_generateImage as generateImage } from 'ai';");
        const imagePrompt = node.data.config?.imagePrompt || "A beautiful landscape";
        const imageModel = node.data.config?.imageModel || "google/imagen-4.0-generate";
        return [
            `${indent}// Generate image using AI`,
            `${indent}const ${varName} = await generateImage({`,
            `${indent}  model: "${imageModel}",`,
            `${indent}  prompt: \`${imagePrompt}\`,`,
            `${indent}  size: "1024x1024",`,
            `${indent}});`
        ];
    }
    function generateSlackActionCode(node, indent, varName) {
        const stepInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStepInfo"])("Send Slack Message");
        imports.add(`import { ${stepInfo.functionName} } from '${stepInfo.importPath}';`);
        const config = node.data.config || {};
        const slackChannel = config.slackChannel || "#general";
        const slackMessage = config.slackMessage || "Message content";
        const convertedChannel = convertTemplateToJS(slackChannel);
        const convertedMessage = convertTemplateToJS(slackMessage);
        const hasTemplateRefs = (str)=>str.includes("${");
        const escapeForOuterTemplate = (str)=>str.replace(/\$\{/g, "$${");
        const channelValue = hasTemplateRefs(convertedChannel) ? `\`${escapeForOuterTemplate(convertedChannel).replace(/`/g, "\\`")}\`` : `"${slackChannel}"`;
        const messageValue = hasTemplateRefs(convertedMessage) ? `\`${escapeForOuterTemplate(convertedMessage).replace(/`/g, "\\`")}\`` : `"${slackMessage}"`;
        return [
            `${indent}const ${varName} = await ${stepInfo.functionName}({`,
            `${indent}  slackChannel: ${channelValue},`,
            `${indent}  slackMessage: ${messageValue},`,
            `${indent}});`
        ];
    }
    function formatTemplateValue(value) {
        const converted = convertTemplateToJS(value);
        const hasTemplateRefs = converted.includes("${");
        const escaped = converted.replace(/\$\{/g, "$${").replace(/`/g, "\\`");
        return hasTemplateRefs ? `\`${escaped}\`` : `\`${value.replace(/`/g, "\\`")}\``;
    }
    function generateFirecrawlActionCode(node, indent, varName) {
        const actionType = node.data.config?.actionType;
        const stepInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStepInfo"])(actionType);
        imports.add(`import { ${stepInfo.functionName} } from '${stepInfo.importPath}';`);
        const config = node.data.config || {};
        const url = config.url || "";
        const query = config.query || "";
        const limit = config.limit ? Number(config.limit) : undefined;
        const lines = [
            `${indent}const ${varName} = await ${stepInfo.functionName}({`
        ];
        if (url) {
            lines.push(`${indent}  url: ${formatTemplateValue(url)},`);
        }
        if (query) {
            lines.push(`${indent}  query: ${formatTemplateValue(query)},`);
        }
        if (limit) {
            lines.push(`${indent}  limit: ${limit},`);
        }
        lines.push(`${indent}});`);
        return lines;
    }
    function generateV0CreateChatActionCode(node, indent, varName) {
        const stepInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStepInfo"])("Create Chat");
        imports.add(`import { ${stepInfo.functionName} } from '${stepInfo.importPath}';`);
        const config = node.data.config || {};
        const message = config.message || "";
        const system = config.system || "";
        const lines = [
            `${indent}const ${varName} = await ${stepInfo.functionName}({`,
            `${indent}  message: ${formatTemplateValue(message)},`
        ];
        if (system) {
            lines.push(`${indent}  system: ${formatTemplateValue(system)},`);
        }
        lines.push(`${indent}});`);
        return lines;
    }
    function generateV0SendMessageActionCode(node, indent, varName) {
        const stepInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStepInfo"])("Send Message");
        imports.add(`import { ${stepInfo.functionName} } from '${stepInfo.importPath}';`);
        const config = node.data.config || {};
        const chatId = config.chatId || "";
        const message = config.message || "";
        const lines = [
            `${indent}const ${varName} = await ${stepInfo.functionName}({`,
            `${indent}  chatId: ${formatTemplateValue(chatId)},`,
            `${indent}  message: ${formatTemplateValue(message)},`,
            `${indent}});`
        ];
        return lines;
    }
    /**
   * Format a config field value based on its type
   */ function formatFieldValue(fieldType, value, indent, key) {
        const fieldTypeFormatters = {
            "template-input": ()=>`${indent}  ${key}: ${formatTemplateValue(String(value))},`,
            "template-textarea": ()=>`${indent}  ${key}: ${formatTemplateValue(String(value))},`,
            number: ()=>`${indent}  ${key}: ${value},`,
            select: ()=>`${indent}  ${key}: "${value}",`,
            "schema-builder": ()=>`${indent}  ${key}: ${JSON.stringify(value)},`
        };
        const formatter = fieldTypeFormatters[fieldType];
        return formatter ? formatter() : `${indent}  ${key}: "${value}",`;
    }
    /**
   * Generate code for plugin-based actions discovered from the plugin registry
   */ function generatePluginActionCode(node, actionType, indent, varName) {
        const action = (0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findActionById"])(actionType);
        if (!action) {
            return null;
        }
        const stepInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStepInfo"])(actionType);
        imports.add(`import { ${stepInfo.functionName} } from '${stepInfo.importPath}';`);
        const config = node.data.config || {};
        const configFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flattenConfigFields"])(action.configFields);
        // Build parameter lines from config fields
        const paramLines = [];
        for (const field of configFields){
            const value = config[field.key];
            if (value === undefined || value === null || value === "") {
                continue;
            }
            paramLines.push(formatFieldValue(field.type, value, indent, field.key));
        }
        // Generate the function call
        const lines = [];
        if (paramLines.length > 0) {
            lines.push(`${indent}const ${varName} = await ${stepInfo.functionName}({`);
            lines.push(...paramLines);
            lines.push(`${indent}});`);
        } else {
            lines.push(`${indent}const ${varName} = await ${stepInfo.functionName}({});`);
        }
        return lines;
    }
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Action type routing requires many conditionals
    function generateActionNodeCode(node, nodeId, indent, varName) {
        const actionType = node.data.config?.actionType;
        // Use label if available, otherwise fall back to action type
        const actionLabel = node.data.label || actionType || "Unknown Action";
        const lines = [
            `${indent}// Action: ${actionLabel}`
        ];
        if (node.data.description) {
            lines.push(`${indent}// ${node.data.description}`);
        }
        // Check if this node's output is used
        const outputIsUsed = usedNodeOutputs.has(nodeId);
        // Helper to process a line with await statement
        function processAwaitLine(line) {
            const match = CONST_ASSIGNMENT_PATTERN.exec(line);
            if (match) {
                const [, lineIndent, , rest] = match;
                return `${lineIndent}${rest}`;
            }
            return line;
        }
        // Helper to process a line with const assignment
        function processConstLine(line) {
            const match = CONST_ASSIGNMENT_PATTERN.exec(line);
            if (match) {
                const [, lineIndent, , rest] = match;
                return `${lineIndent}void ${rest}`;
            }
            return line;
        }
        // Helper to remove variable assignment from action lines
        function removeVariableAssignment(actionLines) {
            const result = [];
            for (const line of actionLines){
                if (line.includes("await")) {
                    result.push(processAwaitLine(line));
                } else if (line.trim().startsWith("const") && line.includes("{")) {
                    result.push(processConstLine(line));
                } else {
                    result.push(line);
                }
            }
            return result;
        }
        // Helper to conditionally wrap action call with variable assignment
        const wrapActionCall = (actionLines)=>{
            if (outputIsUsed) {
                // Keep variable assignment
                return actionLines;
            }
            // Remove variable assignment, just call the function
            return removeVariableAssignment(actionLines);
        };
        // Check explicit actionType first
        if (actionType === "Generate Text") {
            lines.push(...wrapActionCall(generateAiTextActionCode(node, indent, varName)));
        } else if (actionType === "Generate Image") {
            lines.push(...wrapActionCall(generateAiImageActionCode(node, indent, varName)));
        } else if (actionType === "Send Email") {
            lines.push(...wrapActionCall(generateEmailActionCode(node, indent, varName)));
        } else if (actionType === "Send Slack Message") {
            lines.push(...wrapActionCall(generateSlackActionCode(node, indent, varName)));
        } else if (actionType === "Create Ticket") {
            lines.push(...wrapActionCall(generateTicketActionCode(node, indent, varName)));
        } else if (actionType === "Scrape" || actionType === "Search") {
            lines.push(...wrapActionCall(generateFirecrawlActionCode(node, indent, varName)));
        } else if (actionType === "Create Chat") {
            lines.push(...wrapActionCall(generateV0CreateChatActionCode(node, indent, varName)));
        } else if (actionType === "Send Message") {
            lines.push(...wrapActionCall(generateV0SendMessageActionCode(node, indent, varName)));
        } else if (actionType === "Database Query") {
            lines.push(...wrapActionCall(generateDatabaseActionCode(node, indent, varName)));
        } else if (actionType === "HTTP Request") {
            lines.push(...wrapActionCall(generateHTTPActionCode(node, indent, varName)));
        } else {
            // Try to find the action in the plugin registry
            const pluginCode = generatePluginActionCode(node, actionType, indent, varName);
            if (pluginCode) {
                lines.push(...wrapActionCall(pluginCode));
            } else if (outputIsUsed) {
                // Unknown action type - generate placeholder
                lines.push(`${indent}// TODO: Implement action type "${actionType}"`);
                lines.push(`${indent}const ${varName} = { status: 'pending', actionType: "${actionType}" };`);
            } else {
                lines.push(`${indent}// TODO: Implement action type "${actionType}"`);
                lines.push(`${indent}void ({ status: 'pending', actionType: "${actionType}" });`);
            }
        }
        return lines;
    }
    function generateConditionNodeCode(node, nodeId, indent) {
        const lines = [
            `${indent}// Condition: ${node.data.label}`
        ];
        if (node.data.description) {
            lines.push(`${indent}// ${node.data.description}`);
        }
        const condition = node.data.config?.condition;
        const nextNodes = edgesBySource.get(nodeId) || [];
        if (nextNodes.length > 0) {
            const trueNode = nextNodes[0];
            const falseNode = nextNodes[1];
            // Convert template references in condition to JavaScript expressions (not template literal syntax)
            const convertedCondition = condition ? convertConditionToJS(condition) : "true";
            lines.push(`${indent}if (${convertedCondition}) {`);
            if (trueNode) {
                const trueNodeCode = generateNodeCode(trueNode, `${indent}  `);
                lines.push(...trueNodeCode);
            }
            if (falseNode) {
                lines.push(`${indent}} else {`);
                const falseNodeCode = generateNodeCode(falseNode, `${indent}  `);
                lines.push(...falseNodeCode);
            }
            lines.push(`${indent}}`);
        }
        return lines;
    }
    // Helper to process trigger node - triggers use the `input` parameter directly
    // so no code generation is needed, just process next nodes
    function processTriggerNode(nodeId, indent) {
        const nextNodes = edgesBySource.get(nodeId) || [];
        const lines = generateParallelNodeCode(nextNodes, indent);
        return {
            lines,
            wasSkipped: true
        };
    }
    // Helper to process action node
    function processActionNode(node, nodeId, varName, indent) {
        const lines = [];
        const actionType = node.data.config?.actionType;
        // Handle condition as an action type
        if (actionType === "Condition") {
            lines.push(...generateConditionNodeCode(node, nodeId, indent));
            return lines;
        }
        lines.push(...generateActionNodeCode(node, nodeId, indent, varName));
        return lines;
    }
    /**
   * Generate code for a complete branch (node + all descendants)
   * Used inside async IIFEs for parallel branches
   */ function generateBranchCode(nodeId, indent, branchVisited) {
        if (branchVisited.has(nodeId)) {
            return [];
        }
        branchVisited.add(nodeId);
        const node = nodeMap.get(nodeId);
        if (!node) {
            return [];
        }
        const lines = [];
        if (node.data.type === "action") {
            const actionType = node.data.config?.actionType;
            if (actionType === "Condition") {
                // Generate condition as if/else
                lines.push(...generateConditionBranchCode(node, nodeId, indent, branchVisited));
            } else {
                // Generate regular action
                lines.push(...generateActionCallCode(node, indent));
                // Process children
                const children = edgesBySource.get(nodeId) || [];
                if (children.length > 0) {
                    lines.push("");
                    lines.push(...generateChildrenCode(children, indent, branchVisited));
                }
            }
        }
        return lines;
    }
    /**
   * Generate condition branch code with if/else
   */ function generateConditionBranchCode(node, nodeId, indent, branchVisited) {
        const lines = [
            `${indent}// Condition: ${node.data.label}`
        ];
        const condition = node.data.config?.condition;
        const nextNodes = edgesBySource.get(nodeId) || [];
        if (nextNodes.length > 0) {
            const convertedCondition = condition ? convertConditionToJS(condition) : "true";
            lines.push(`${indent}if (${convertedCondition}) {`);
            if (nextNodes[0]) {
                lines.push(...generateBranchCode(nextNodes[0], `${indent}  `, branchVisited));
            }
            if (nextNodes[1]) {
                lines.push(`${indent}} else {`);
                lines.push(...generateBranchCode(nextNodes[1], `${indent}  `, branchVisited));
            }
            lines.push(`${indent}}`);
        }
        return lines;
    }
    /**
   * Generate a single action call with await
   */ function generateActionCallCode(node, indent) {
        const actionType = node.data.config?.actionType;
        const actionLabel = node.data.label || actionType || "Unknown Action";
        const stepInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$codegen$2f$workflow$2d$codegen$2d$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStepInfo"])(actionType);
        const configParams = buildActionConfigParams(node, `${indent}  `);
        imports.add(`import { ${stepInfo.functionName} } from '${stepInfo.importPath}';`);
        const lines = [
            `${indent}// ${actionLabel}`
        ];
        if (configParams.length > 0) {
            lines.push(`${indent}await ${stepInfo.functionName}({`);
            lines.push(...configParams);
            lines.push(`${indent}});`);
        } else {
            lines.push(`${indent}await ${stepInfo.functionName}({});`);
        }
        return lines;
    }
    /**
   * Generate code for children nodes, handling parallel branches
   */ function generateChildrenCode(childIds, indent, branchVisited) {
        const unvisited = childIds.filter((id)=>!branchVisited.has(id));
        if (unvisited.length === 0) {
            return [];
        }
        if (unvisited.length === 1) {
            return generateBranchCode(unvisited[0], indent, branchVisited);
        }
        // Multiple children - generate Promise.all with async IIFEs
        const lines = [
            `${indent}await Promise.all([`
        ];
        for(let i = 0; i < unvisited.length; i++){
            const childId = unvisited[i];
            const isLast = i === unvisited.length - 1;
            const comma = isLast ? "" : ",";
            // Create a new visited set for this branch
            const childBranchVisited = new Set(branchVisited);
            const branchCode = generateBranchCode(childId, `${indent}    `, childBranchVisited);
            if (branchCode.length > 0) {
                lines.push(`${indent}  (async () => {`);
                lines.push(...branchCode);
                lines.push(`${indent}  })()${comma}`);
            }
        }
        lines.push(`${indent}]);`);
        return lines;
    }
    /**
   * Generate a single async IIFE branch for Promise.all
   */ function generateAsyncIIFEBranch(nodeId, indent, isLast) {
        const branchVisited = new Set(visited);
        branchVisited.delete(nodeId);
        const branchCode = generateBranchCode(nodeId, `${indent}    `, branchVisited);
        const comma = isLast ? "" : ",";
        if (branchCode.length === 0) {
            return [];
        }
        return [
            `${indent}  (async () => {`,
            ...branchCode,
            `${indent}  })()${comma}`
        ];
    }
    /**
   * Generate code for multiple nodes from trigger
   */ function generateParallelNodeCode(nodeIds, indent) {
        if (nodeIds.length === 0) {
            return [];
        }
        const unvisited = nodeIds.filter((id)=>!visited.has(id) && nodeMap.get(id)?.data.type === "action");
        if (unvisited.length === 0) {
            return [];
        }
        if (unvisited.length === 1) {
            const branchVisited = new Set(visited);
            visited.add(unvisited[0]);
            return generateBranchCode(unvisited[0], indent, branchVisited);
        }
        // Mark all as visited first to prevent cross-branch processing
        for (const id of unvisited){
            visited.add(id);
        }
        // Multiple branches - wrap each in async IIFE
        const lines = [
            `${indent}await Promise.all([`
        ];
        for(let i = 0; i < unvisited.length; i++){
            lines.push(...generateAsyncIIFEBranch(unvisited[i], indent, i === unvisited.length - 1));
        }
        lines.push(`${indent}]);`);
        return lines;
    }
    /**
   * Build config parameters for plugin-based action
   */ function buildPluginConfigParams(config, actionType, indent) {
        const action = (0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findActionById"])(actionType);
        if (!action) {
            return [];
        }
        const params = [];
        for (const field of (0, __TURBOPACK__imported__module__$5b$project$5d2f$plugins$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flattenConfigFields"])(action.configFields)){
            const value = config[field.key];
            if (value === undefined || value === null || value === "") {
                continue;
            }
            params.push(formatFieldValue(field.type, value, indent, field.key));
        }
        return params;
    }
    // Keys to exclude from generated code (internal app fields)
    const EXCLUDED_CONFIG_KEYS = new Set([
        "actionType",
        "integrationId"
    ]);
    /**
   * Build config parameters using fallback logic
   */ function buildFallbackConfigParams(config, indent) {
        const params = [];
        for (const [key, value] of Object.entries(config)){
            if (EXCLUDED_CONFIG_KEYS.has(key) || value === undefined || value === null) {
                continue;
            }
            if (typeof value === "string") {
                params.push(`${indent}${key}: ${formatTemplateValue(value)},`);
            } else if (typeof value === "number" || typeof value === "boolean") {
                params.push(`${indent}${key}: ${value},`);
            } else {
                params.push(`${indent}${key}: ${JSON.stringify(value)},`);
            }
        }
        return params;
    }
    /**
   * Build config parameters for an action node
   */ function buildActionConfigParams(node, indent) {
        const actionType = node.data.config?.actionType;
        const config = node.data.config || {};
        const pluginParams = buildPluginConfigParams(config, actionType, indent);
        if (pluginParams.length > 0) {
            return pluginParams;
        }
        return buildFallbackConfigParams(config, indent);
    }
    // Helper to process next nodes recursively
    function processNextNodes(nodeId, currentLines, indent) {
        const nextNodes = edgesBySource.get(nodeId) || [];
        const result = [
            ...currentLines
        ];
        // Only add blank line if we actually generated code for this node AND there are more nodes
        if (currentLines.length > 0 && nextNodes.length > 0) {
            result.push("");
        }
        result.push(...generateParallelNodeCode(nextNodes, indent));
        return result;
    }
    // Generate code for each node in the workflow
    function generateNodeCode(nodeId, indent = "  ") {
        if (visited.has(nodeId)) {
            return [
                `${indent}// Already processed: ${nodeId}`
            ];
        }
        visited.add(nodeId);
        const node = nodeMap.get(nodeId);
        if (!node) {
            return [];
        }
        // Use friendly variable name from map, fallback to node type + id if not found
        const varName = nodeIdToVarName.get(nodeId) || `${node.data.type}_${nodeId.replace(/-/g, "_")}`;
        let lines = [];
        switch(node.data.type){
            case "trigger":
                {
                    const { lines: triggerLines, wasSkipped } = processTriggerNode(nodeId, indent);
                    // If trigger was skipped, triggerLines already contains next nodes
                    if (wasSkipped) {
                        return triggerLines; // Already processed next nodes
                    }
                    return processNextNodes(nodeId, triggerLines, indent);
                }
            case "action":
                {
                    const actionLines = processActionNode(node, nodeId, varName, indent);
                    // Conditions return early from processActionNode, so check if it's a condition
                    const actionType = node.data.config?.actionType;
                    if (actionType === "Condition") {
                        return actionLines; // Already processed, don't process next nodes
                    }
                    lines = actionLines;
                    break;
                }
            default:
                lines.push(`${indent}// Unknown node type: ${node.data.type}`);
                break;
        }
        return processNextNodes(nodeId, lines, indent);
    }
    // Generate code starting from trigger nodes
    if (triggerNodes.length === 0) {
        codeLines.push("  // No trigger nodes found");
    } else {
        for (const trigger of triggerNodes){
            const triggerCode = generateNodeCode(trigger.id, "  ");
            codeLines.push(...triggerCode);
        }
    }
    codeLines.push("}");
    // Build final code
    const importStatements = Array.from(imports).join("\n");
    const code = `${importStatements}\n\n${codeLines.join("\n")}\n`;
    return {
        code,
        functionName,
        imports: Array.from(imports)
    };
}
function generateWorkflowModule(workflowName, nodes, edges, options = {}) {
    const { code } = generateWorkflowCode(nodes, edges, options);
    return `/**
 * Generated Workflow: ${workflowName}
 * 
 * This file was automatically generated from a workflow definition.
 * DO NOT EDIT MANUALLY - regenerate from the workflow editor instead.
 */

${code}
`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/codegen/codegen-templates/condition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Code template for Condition action step
 * This is a string template used for code generation - keep as string export
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = `export async function conditionStep(input: {
  condition: boolean;
}) {
  "use step";
  
  // Evaluate condition
  return { condition: input.condition };
}`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/codegen/codegen-templates/database-query.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Code template for Database Query action step
 * This is a string template used for code generation - keep as string export
 *
 * Requires: pnpm add postgres
 * Environment: DATABASE_URL
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = `export async function databaseQueryStep(input: {
  query: string;
}) {
  "use step";
  
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return { success: false, error: "DATABASE_URL environment variable is not set" };
  }
  
  const postgres = await import("postgres");
  const sql = postgres.default(databaseUrl, { max: 1 });
  
  try {
    const result = await sql.unsafe(input.query);
    await sql.end();
    return { success: true, rows: result, count: result.length };
  } catch (error) {
    await sql.end();
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: \`Database query failed: \${message}\` };
  }
}`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/codegen/codegen-templates/http-request.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Code template for HTTP Request action step
 * This is a string template used for code generation - keep as string export
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = `export async function httpRequestStep(input: {
  endpoint: string;
  httpMethod: string;
  httpHeaders?: string;
  httpBody?: string;
}) {
  "use step";
  
  let headers = {};
  if (input.httpHeaders) {
    try {
      headers = JSON.parse(input.httpHeaders);
    } catch {
      // If parsing fails, use empty headers
    }
  }
  
  let body: string | undefined;
  if (input.httpMethod !== "GET" && input.httpBody) {
    try {
      const parsedBody = JSON.parse(input.httpBody);
      if (Object.keys(parsedBody).length > 0) {
        body = JSON.stringify(parsedBody);
      }
    } catch {
      if (input.httpBody.trim() && input.httpBody.trim() !== "{}") {
        body = input.httpBody;
      }
    }
  }
  
  const response = await fetch(input.endpoint, {
    method: input.httpMethod,
    headers,
    body,
  });
  
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return await response.json();
  }
  return await response.text();
}`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/parsing/excel-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildExcelSourceConfigPatch",
    ()=>buildExcelSourceConfigPatch,
    "buildFapiWorkbookImportPatch",
    ()=>buildFapiWorkbookImportPatch,
    "detectExcelColumnMapping",
    ()=>detectExcelColumnMapping,
    "findExcelSheetByName",
    ()=>findExcelSheetByName,
    "formatFileSize",
    ()=>formatFileSize,
    "getExcelColumnMappingFromConfig",
    ()=>getExcelColumnMappingFromConfig,
    "getExcelSheet",
    ()=>getExcelSheet,
    "getExcelTableSelection",
    ()=>getExcelTableSelection,
    "getExcelWorkbookFromConfig",
    ()=>getExcelWorkbookFromConfig,
    "getNormalizedRowsForSheet",
    ()=>getNormalizedRowsForSheet,
    "hasExcelSourceEvidence",
    ()=>hasExcelSourceEvidence,
    "parseAggregationRulesSheet",
    ()=>parseAggregationRulesSheet,
    "parseExcelWorkbookFile",
    ()=>parseExcelWorkbookFile,
    "parseExpectedResultsSheet",
    ()=>parseExpectedResultsSheet,
    "parseFapiInputsSheet",
    ()=>parseFapiInputsSheet,
    "parseKeywordRulesSheet",
    ()=>parseKeywordRulesSheet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$source$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/domain/workflow/source-rules.ts [app-client] (ecmascript)");
"use client";
;
const ACCOUNT_ALIASES = [
    "account",
    "accountcode",
    "accountnumber",
    "code",
    "acct"
];
const FINANCIAL_ROW_ALIASES = [
    "financialrow",
    "financialline",
    "financialstatementrow",
    "rowlabel",
    "line",
    "lineitem"
];
const LABEL_ALIASES = [
    "label",
    "name",
    "accountlabel",
    "accountname",
    ...FINANCIAL_ROW_ALIASES
];
const DESCRIPTION_ALIASES = [
    "description",
    "memo",
    "notes",
    "details",
    ...FINANCIAL_ROW_ALIASES
];
const AMOUNT_ALIASES = [
    "amount",
    "value",
    "balance"
];
const CURRENCY_ALIASES = [
    "currency",
    "curr"
];
const DEBIT_ALIASES = [
    "debit",
    "debits"
];
const CREDIT_ALIASES = [
    "credit",
    "credits"
];
const ACCOUNT_TYPE_ALIASES = [
    "accounttype",
    "statementtype",
    "postingtype"
];
// Balance-sheet account types — dropped from a trial balance, since only P&L
// (Revenue/Expense) accounts are relevant to value-extraction workflows (FAPI).
// Applied ONLY to an explicit account-type column value, never to the label.
const BALANCE_SHEET_TYPE_REGEX = /\b(asset|liabilit|equity)/i;
const DELIMITED_LIST_REGEX = /[,;\n|]/;
const NUMBER_PATTERN = /-?\d+(\.\d+)?/;
const MAX_PERSISTED_ROWS_PER_SHEET = 1000;
const MAX_HEADER_SCAN_ROWS = 50;
const SIGN_PREFIX_REGEX = /^[+-]/;
const LEADING_ACCOUNT_REGEX = /^\s*([0-9]{3,})\b/;
const PARENTHETICAL_NUMBER_REGEX = /^\(.*\)$/;
const LETTER_REGEX = /[A-Za-zÀ-ÖØ-öø-ÿ]/;
const DIGIT_REGEX = /\d/;
const CURRENCY_AND_TEXT_REGEX = /[^\d.,()\-+\s]/g;
const WHITESPACE_REGEX = /\s+/g;
const TOTAL_ROW_REGEX = /^(totals?|subtotals?|grand totals?|sous-totals?|total(?:s|aux)?|totals? g[ée]n[ée]ra(?:l|ux))\b/i;
// Currency-code suffixes seen on trial-balance headers like "Debit (USD)".
const CURRENCY_SUFFIX_KEYS = new Set([
    "usd",
    "cad",
    "eur",
    "gbp",
    "aud",
    "jpy",
    "chf",
    "us",
    "ca"
]);
function normalizeKey(key) {
    return key.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}
// Match a header against an alias, tolerating a trailing currency code — so
// "Debit (USD)" matches "debit" and "Balance (USD)" matches "balance", while
// "Account Type" does NOT match "account" (remainder "type" isn't a currency).
function headerMatchesAlias(header, alias) {
    const normalizedHeader = normalizeKey(header);
    const normalizedAlias = normalizeKey(alias);
    if (!normalizedAlias) {
        return false;
    }
    if (normalizedHeader === normalizedAlias) {
        return true;
    }
    if (normalizedHeader.startsWith(normalizedAlias)) {
        const rest = normalizedHeader.slice(normalizedAlias.length);
        return rest.length === 0 || CURRENCY_SUFFIX_KEYS.has(rest);
    }
    return false;
}
function normalizeSheetToken(value) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function columnName(index) {
    let value = "";
    let current = index + 1;
    while(current > 0){
        const remainder = (current - 1) % 26;
        value = String.fromCharCode(65 + remainder) + value;
        current = Math.floor((current - remainder) / 26);
    }
    return value;
}
function formatCellValue(value) {
    if (value === undefined || value === null) {
        return "";
    }
    if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
    }
    return String(value);
}
function normalizeNumericText(value) {
    const numericText = value.replace(CURRENCY_AND_TEXT_REGEX, "").replace(WHITESPACE_REGEX, "");
    const lastComma = numericText.lastIndexOf(",");
    const lastDot = numericText.lastIndexOf(".");
    if (lastComma >= 0 && lastDot >= 0) {
        return lastComma > lastDot ? numericText.replaceAll(".", "").replace(",", ".") : numericText.replaceAll(",", "");
    }
    if (lastComma < 0) {
        return numericText;
    }
    const decimalDigits = numericText.length - lastComma - 1;
    return decimalDigits > 0 && decimalDigits <= 2 ? numericText.replace(",", ".") : numericText.replaceAll(",", "");
}
function parseFallbackNumber(trimmed, negativeByParentheses) {
    const match = trimmed.replaceAll(",", "").match(NUMBER_PATTERN);
    if (!match) {
        return null;
    }
    const fallback = Number(match[0]);
    if (!Number.isFinite(fallback)) {
        return null;
    }
    return negativeByParentheses ? -fallback : fallback;
}
function parseNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value !== "string") {
        return null;
    }
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }
    const negativeByParentheses = PARENTHETICAL_NUMBER_REGEX.test(trimmed);
    const numericText = trimmed.replace(CURRENCY_AND_TEXT_REGEX, "").replace(WHITESPACE_REGEX, "");
    const normalized = normalizeNumericText(trimmed);
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed)) {
        return parseFallbackNumber(trimmed, negativeByParentheses);
    }
    if (!DIGIT_REGEX.test(numericText)) {
        return null;
    }
    return negativeByParentheses ? -parsed : parsed;
}
function getRecordValue(record, columnNameValue) {
    return columnNameValue ? record[columnNameValue] : undefined;
}
function findAlias(headers, aliases) {
    return headers.find((header)=>aliases.some((alias)=>headerMatchesAlias(header, alias)));
}
function detectExcelColumnMapping(headers) {
    return {
        account: findAlias(headers, ACCOUNT_ALIASES),
        accountType: findAlias(headers, ACCOUNT_TYPE_ALIASES),
        amount: findAlias(headers, AMOUNT_ALIASES),
        credit: findAlias(headers, CREDIT_ALIASES),
        currency: findAlias(headers, CURRENCY_ALIASES),
        debit: findAlias(headers, DEBIT_ALIASES),
        description: findAlias(headers, DESCRIPTION_ALIASES),
        label: findAlias(headers, LABEL_ALIASES)
    };
}
function getAmount(valuesByColumn, mapping) {
    // Trial balance: when BOTH debit and credit columns exist, the signed amount is
    // credit − debit (income → positive, expense → negative). A "Balance" column is
    // ambiguous/sign-flipped for credit accounts, so it must NOT override this.
    if (mapping.debit && mapping.credit) {
        const debit = parseNumber(getRecordValue(valuesByColumn, mapping.debit)) ?? 0;
        const credit = parseNumber(getRecordValue(valuesByColumn, mapping.credit)) ?? 0;
        return credit - debit;
    }
    const amount = parseNumber(getRecordValue(valuesByColumn, mapping.amount));
    if (amount !== null) {
        return amount;
    }
    const debit = parseNumber(getRecordValue(valuesByColumn, mapping.debit)) ?? 0;
    const credit = parseNumber(getRecordValue(valuesByColumn, mapping.credit)) ?? 0;
    return credit - debit;
}
function hasMappedAmount(valuesByColumn, mapping) {
    return [
        mapping.amount,
        mapping.debit,
        mapping.credit
    ].some((column)=>{
        const value = getRecordValue(valuesByColumn, column);
        return value !== undefined && String(value).trim().length > 0;
    });
}
function inferCurrency(value, fallback = "USD") {
    const text = String(value || "").toLowerCase();
    if (text.includes("€") || text.includes("eur") || text.includes("euro")) {
        return "EUR";
    }
    if (text.includes("cad") || text.includes("c$")) {
        return "CAD";
    }
    if (text.includes("usd") || text.includes("us$") || text.includes("$")) {
        return "USD";
    }
    if (text.includes("gbp") || text.includes("£")) {
        return "GBP";
    }
    return fallback;
}
function detectSheetCurrency(cells) {
    const headerText = cells.slice(0, 12).flat().map(String).join(" ");
    return inferCurrency(headerText, "USD");
}
function getCurrency({ defaultCurrency, mapping, valuesByColumn }) {
    const explicitCurrency = getRecordValue(valuesByColumn, mapping.currency);
    if (explicitCurrency) {
        return String(explicitCurrency);
    }
    return inferCurrency(getRecordValue(valuesByColumn, mapping.amount), defaultCurrency);
}
function getAccountFromLabel(value) {
    const match = String(value || "").match(LEADING_ACCOUNT_REGEX);
    return match?.[1] || "";
}
function getCellRef(rowNumber, columnIndex) {
    return `${columnName(columnIndex)}${rowNumber}`;
}
function isLikelyLabelCell(value) {
    const text = String(value || "").trim();
    return text.length > 0 && LETTER_REGEX.test(text);
}
function isHeaderLikeLabel(value) {
    const normalized = normalizeKey(String(value || ""));
    return LABEL_ALIASES.some((alias)=>normalizeKey(alias) === normalized) || DESCRIPTION_ALIASES.some((alias)=>normalizeKey(alias) === normalized) || ACCOUNT_ALIASES.some((alias)=>normalizeKey(alias) === normalized);
}
function isDebitHeader(value) {
    return DEBIT_ALIASES.some((alias)=>headerMatchesAlias(String(value || ""), alias));
}
function isCreditHeader(value) {
    return CREDIT_ALIASES.some((alias)=>headerMatchesAlias(String(value || ""), alias));
}
function normalizeExcelRow({ defaultCurrency, mapping, rowIndex, rowNumber, sheetName, valuesByColumn, workbookId }) {
    const label = getRecordValue(valuesByColumn, mapping.label) || getRecordValue(valuesByColumn, mapping.description) || `Excel row ${rowNumber}`;
    const account = getRecordValue(valuesByColumn, mapping.account) || getAccountFromLabel(label);
    const rowId = `${normalizeSheetToken(sheetName) || "sheet"}-row-${String(rowNumber).padStart(3, "0")}`;
    const raw = {
        ...valuesByColumn
    };
    const amount = getAmount(valuesByColumn, mapping);
    const labelText = String(label);
    return {
        account: String(account || ""),
        amount,
        currency: getCurrency({
            defaultCurrency,
            mapping,
            valuesByColumn
        }),
        description: String(getRecordValue(valuesByColumn, mapping.description) || labelText),
        label: labelText,
        metadata: {
            accountType: String(getRecordValue(valuesByColumn, mapping.accountType) || ""),
            hasMappedAmount: hasMappedAmount(valuesByColumn, mapping),
            isBalanceSheetRow: BALANCE_SHEET_TYPE_REGEX.test(String(getRecordValue(valuesByColumn, mapping.accountType) || "")),
            isTotalRow: TOTAL_ROW_REGEX.test(labelText.trim()),
            raw,
            rowIndex,
            rowNumber,
            sheetName,
            workbookId
        },
        raw,
        rowId,
        rowNumber
    };
}
function normalizeExtractedExcelRow({ amount, amountColumnIndex, credit, creditColumnIndex, debit, debitColumnIndex, defaultCurrency, extractionMode, label, labelColumnIndex, rawRow, rowIndex, rowNumber, sheetName, workbookId }) {
    const amountCell = amountColumnIndex === undefined ? undefined : rawRow[amountColumnIndex] || "";
    const debitCell = debitColumnIndex === undefined ? undefined : rawRow[debitColumnIndex] || "";
    const creditCell = creditColumnIndex === undefined ? undefined : rawRow[creditColumnIndex] || "";
    const raw = {
        amount,
        amountCell,
        credit,
        creditCell,
        debit,
        debitCell,
        extractedLabel: label,
        label
    };
    const rowId = `${normalizeSheetToken(sheetName) || "sheet"}-row-${String(rowNumber).padStart(3, "0")}-${columnName(labelColumnIndex).toLowerCase()}`;
    return {
        account: getAccountFromLabel(label),
        amount,
        currency: inferCurrency(String(amountCell || debitCell || creditCell || ""), defaultCurrency),
        description: label,
        label,
        metadata: {
            amountCellRef: amountColumnIndex === undefined ? undefined : getCellRef(rowNumber, amountColumnIndex),
            creditCellRef: creditColumnIndex === undefined ? undefined : getCellRef(rowNumber, creditColumnIndex),
            debitCellRef: debitColumnIndex === undefined ? undefined : getCellRef(rowNumber, debitColumnIndex),
            extractionMode,
            hasMappedAmount: true,
            isTotalRow: TOTAL_ROW_REGEX.test(label.trim()),
            labelCellRef: getCellRef(rowNumber, labelColumnIndex),
            rawRow,
            rowIndex,
            rowNumber,
            sheetName,
            workbookId
        },
        raw,
        rowId,
        rowNumber
    };
}
function getBestLabelIndex(row, maxColumnIndex) {
    for(let index = Math.min(maxColumnIndex - 1, row.length - 1); index >= 0; index -= 1){
        const value = row[index];
        if (isLikelyLabelCell(value) && !isHeaderLikeLabel(value)) {
            return index;
        }
    }
    return -1;
}
function detectLooseDebitCreditLayout(cells) {
    const scanRows = Math.min(cells.length, MAX_HEADER_SCAN_ROWS);
    for(let rowIndex = 0; rowIndex < scanRows; rowIndex += 1){
        const row = cells[rowIndex] || [];
        const debitIndex = row.findIndex(isDebitHeader);
        const creditIndex = row.findIndex(isCreditHeader);
        if (debitIndex >= 0 || creditIndex >= 0) {
            return {
                creditIndex,
                debitIndex,
                headerRowNumber: rowIndex + 1
            };
        }
    }
    return null;
}
function normalizeDebitCreditExtractedRow({ amountStartIndex, defaultCurrency, includeTotalRows, layout, row, rowNumber, rowOffset, sheetName, workbookId }) {
    const debit = layout.debitIndex >= 0 ? parseNumber(row[layout.debitIndex]) : null;
    const credit = layout.creditIndex >= 0 ? parseNumber(row[layout.creditIndex]) : null;
    if (debit === null && credit === null) {
        return null;
    }
    const labelIndex = getBestLabelIndex(row, amountStartIndex);
    if (labelIndex < 0) {
        return null;
    }
    const label = String(row[labelIndex] || "").trim();
    if (!(includeTotalRows || !TOTAL_ROW_REGEX.test(label))) {
        return null;
    }
    return normalizeExtractedExcelRow({
        amount: (credit ?? 0) - (debit ?? 0),
        credit,
        creditColumnIndex: layout.creditIndex >= 0 ? layout.creditIndex : undefined,
        debit,
        debitColumnIndex: layout.debitIndex >= 0 ? layout.debitIndex : undefined,
        defaultCurrency,
        extractionMode: "debit_credit",
        label,
        labelColumnIndex: labelIndex,
        rawRow: row,
        rowIndex: rowOffset,
        rowNumber,
        sheetName,
        workbookId
    });
}
function extractDebitCreditRows({ cells, defaultCurrency, includeTotalRows, sheetName, workbookId }) {
    const layout = detectLooseDebitCreditLayout(cells);
    if (!layout) {
        return [];
    }
    const amountStartIndex = Math.min(...[
        layout.debitIndex,
        layout.creditIndex
    ].filter((index)=>index >= 0));
    return cells.slice(layout.headerRowNumber).map((row, rowOffset)=>normalizeDebitCreditExtractedRow({
            amountStartIndex,
            defaultCurrency,
            includeTotalRows,
            layout,
            row,
            rowNumber: layout.headerRowNumber + rowOffset + 1,
            rowOffset,
            sheetName,
            workbookId
        })).filter((row)=>Boolean(row));
}
function extractAdjacentAmountRows({ cells, defaultCurrency, includeTotalRows, sheetName, workbookId }) {
    return cells.flatMap((row, rowIndex)=>{
        const rowNumber = rowIndex + 1;
        const extractedRows = [];
        row.forEach((cell, columnIndex)=>{
            if (!(isLikelyLabelCell(cell) && !isHeaderLikeLabel(cell))) {
                return;
            }
            const amountColumnIndex = columnIndex + 1;
            const amount = parseNumber(row[amountColumnIndex]);
            if (amount === null) {
                return;
            }
            const label = String(cell || "").trim();
            if (!(includeTotalRows || !TOTAL_ROW_REGEX.test(label))) {
                return;
            }
            extractedRows.push(normalizeExtractedExcelRow({
                amount,
                amountColumnIndex,
                defaultCurrency,
                extractionMode: "adjacent_amount",
                label,
                labelColumnIndex: columnIndex,
                rawRow: row,
                rowIndex,
                rowNumber,
                sheetName,
                workbookId
            }));
        });
        return extractedRows;
    });
}
function getLooseExtractedRows({ defaultCurrency, includeTotalRows, sheet, workbook }) {
    const debitCreditRows = extractDebitCreditRows({
        cells: sheet.cells,
        defaultCurrency,
        includeTotalRows,
        sheetName: sheet.sheetName,
        workbookId: workbook.workbookId
    });
    const debitCreditLabelCells = new Set(debitCreditRows.map((row)=>row.metadata.labelCellRef));
    const adjacentRows = extractAdjacentAmountRows({
        cells: sheet.cells,
        defaultCurrency,
        includeTotalRows,
        sheetName: sheet.sheetName,
        workbookId: workbook.workbookId
    }).filter((row)=>!debitCreditLabelCells.has(row.metadata.labelCellRef));
    const rowsByKey = new Map();
    for (const row of [
        ...debitCreditRows,
        ...adjacentRows
    ]){
        const metadata = row.metadata;
        const key = `${row.rowNumber}:${metadata.labelCellRef}:${row.amount}`;
        rowsByKey.set(key, row);
    }
    return [
        ...rowsByKey.values()
    ].slice(0, MAX_PERSISTED_ROWS_PER_SHEET);
}
function shouldUseLooseExtraction({ fallbackRows, mapping, tableRows }) {
    if (fallbackRows.length === 0) {
        return false;
    }
    const hasTableLabel = Boolean(mapping.account || mapping.description || mapping.label);
    const hasTableAmount = Boolean(mapping.amount || mapping.debit || mapping.credit);
    if (!(hasTableLabel && hasTableAmount)) {
        return true;
    }
    if (tableRows.length === 0) {
        return true;
    }
    const generatedLabelRows = tableRows.filter((row)=>row.label.startsWith("Excel row ")).length;
    return generatedLabelRows > tableRows.length / 2;
}
function getUsedRowCount(rows) {
    let lastUsedIndex = rows.length - 1;
    while(lastUsedIndex > 0 && rows[lastUsedIndex].every((cell)=>!String(cell).trim())){
        lastUsedIndex -= 1;
    }
    return lastUsedIndex + 1;
}
function getUsedColumnCount(rows) {
    return rows.reduce((max, row)=>{
        let lastUsedIndex = row.length - 1;
        while(lastUsedIndex > 0 && !String(row[lastUsedIndex]).trim()){
            lastUsedIndex -= 1;
        }
        return Math.max(max, lastUsedIndex + 1);
    }, 0);
}
function normalizeHeader(value, index) {
    return value.trim() || columnName(index);
}
function getHeadersForRow(cells, rowIndex, columnCount) {
    return Array.from({
        length: columnCount
    }, (_, index)=>normalizeHeader(cells[rowIndex]?.[index] || "", index));
}
function getColumnIndex(headers, columnNameValue) {
    return columnNameValue ? headers.indexOf(columnNameValue) : -1;
}
function hasText(value) {
    return String(value || "").trim().length > 0;
}
function scoreHeaderCandidate({ cells, columnCount, rowIndex, rowCount }) {
    const headers = getHeadersForRow(cells, rowIndex, columnCount);
    const mapping = detectExcelColumnMapping(headers);
    const amountIndex = getColumnIndex(headers, mapping.amount);
    const debitIndex = getColumnIndex(headers, mapping.debit);
    const creditIndex = getColumnIndex(headers, mapping.credit);
    const labelIndex = Math.max(getColumnIndex(headers, mapping.label), getColumnIndex(headers, mapping.description), getColumnIndex(headers, mapping.account));
    const hasAmountMapping = amountIndex >= 0 || debitIndex >= 0 || creditIndex >= 0;
    const hasLabelMapping = labelIndex >= 0;
    let numericRows = 0;
    let textRows = 0;
    const sampleEnd = Math.min(rowCount, rowIndex + 26);
    for(let index = rowIndex + 1; index < sampleEnd; index += 1){
        const row = cells[index] || [];
        if (amountIndex >= 0 && parseNumber(row[amountIndex]) !== null) {
            numericRows += 1;
        }
        if (amountIndex < 0 && (parseNumber(row[debitIndex]) !== null || parseNumber(row[creditIndex]) !== null)) {
            numericRows += 1;
        }
        if (labelIndex >= 0 && hasText(row[labelIndex])) {
            textRows += 1;
        }
    }
    let score = 0;
    if (hasAmountMapping) {
        score += 12;
    }
    if (hasLabelMapping) {
        score += 8;
    }
    score += Math.min(numericRows, 8) * 2;
    score += Math.min(textRows, 8);
    score -= rowIndex * 0.05;
    return {
        headers,
        mapping,
        score
    };
}
function detectTableSelection({ cells, columnCount, rowCount }) {
    const scanRows = Math.min(rowCount, MAX_HEADER_SCAN_ROWS);
    let best = {
        headers: getHeadersForRow(cells, 0, columnCount),
        headerRowNumber: 1,
        score: Number.NEGATIVE_INFINITY
    };
    for(let rowIndex = 0; rowIndex < scanRows; rowIndex += 1){
        if (!cells[rowIndex]?.some(hasText)) {
            continue;
        }
        const candidate = scoreHeaderCandidate({
            cells,
            columnCount,
            rowCount,
            rowIndex
        });
        if (candidate.score > best.score) {
            best = {
                headers: candidate.headers,
                headerRowNumber: rowIndex + 1,
                score: candidate.score
            };
        }
    }
    return {
        firstDataRowNumber: best.headerRowNumber + 1,
        headerRowNumber: best.headerRowNumber,
        headers: best.headers
    };
}
function getExcelTableSelection(sheet, options = {}) {
    const headerRowNumber = Math.max(1, Math.min(Number(options.headerRowNumber || sheet.detectedHeaderRowNumber || 1), sheet.cells.length || 1));
    const firstDataRowNumber = Math.max(headerRowNumber + 1, Number(options.firstDataRowNumber || sheet.detectedFirstDataRowNumber || headerRowNumber + 1));
    const columnCount = Math.max(1, sheet.columnCount);
    const headers = getHeadersForRow(sheet.cells, headerRowNumber - 1, columnCount);
    const inferredRange = `${sheet.sheetName}!A${headerRowNumber}:${columnName(columnCount - 1)}${Math.max(firstDataRowNumber, sheet.cells.length)}`;
    return {
        columnCount,
        firstDataRowNumber,
        headerRowNumber,
        headers,
        inferredRange
    };
}
function createSheetData({ cells, sheetName, workbookId }) {
    const rowCount = getUsedRowCount(cells);
    const columnCount = Math.max(1, getUsedColumnCount(cells));
    const detectedTable = detectTableSelection({
        cells,
        columnCount,
        rowCount
    });
    const headers = detectedTable.headers;
    const mapping = detectExcelColumnMapping(headers);
    const defaultCurrency = detectSheetCurrency(cells);
    const dataStartIndex = detectedTable.firstDataRowNumber - 1;
    const persistedRows = cells.slice(dataStartIndex, Math.min(rowCount, dataStartIndex + MAX_PERSISTED_ROWS_PER_SHEET)).map((row, rowIndex)=>{
        const rowNumber = dataStartIndex + rowIndex + 1;
        const valuesByColumn = Object.fromEntries(headers.map((header, index)=>[
                header,
                row[index] || ""
            ]));
        const normalized = normalizeExcelRow({
            defaultCurrency,
            mapping,
            rowIndex,
            rowNumber,
            sheetName,
            valuesByColumn,
            workbookId
        });
        return {
            normalized,
            raw: valuesByColumn,
            rowId: normalized.rowId,
            rowNumber,
            valuesByColumn
        };
    }).filter((row)=>Object.values(row.valuesByColumn).some((value)=>String(value).trim()));
    const inferredRange = `${sheetName}!A${detectedTable.headerRowNumber}:${columnName(columnCount - 1)}${rowCount}`;
    return {
        cells: cells.slice(0, Math.min(rowCount, MAX_PERSISTED_ROWS_PER_SHEET + 1)).map((row)=>Array.from({
                length: columnCount
            }, (_, index)=>row[index] || "")),
        columnCount,
        detectedFirstDataRowNumber: detectedTable.firstDataRowNumber,
        detectedHeaderRowNumber: detectedTable.headerRowNumber,
        headers,
        inferredRange,
        persistedRowLimit: MAX_PERSISTED_ROWS_PER_SHEET,
        rowCount: persistedRows.length,
        rows: persistedRows,
        sheetName,
        truncated: rowCount > MAX_PERSISTED_ROWS_PER_SHEET + 1
    };
}
async function parseExcelWorkbookFile(file) {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension !== "xlsx" && extension !== "xls") {
        throw new Error("Upload a normal Excel workbook (.xlsx).");
    }
    const XLSX = await __turbopack_context__.A("[project]/node_modules/.pnpm/xlsx@0.18.5/node_modules/xlsx/xlsx.mjs [app-client] (ecmascript, async loader)");
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, {
        cellDates: true,
        type: "array"
    });
    const uploadedAt = new Date().toISOString();
    const workbookId = `workbook-${Date.now().toString(36)}`;
    const sheets = workbook.SheetNames.map((sheetName)=>{
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, {
            blankrows: false,
            defval: "",
            header: 1,
            raw: false
        });
        const cells = rows.map((row)=>Array.isArray(row) ? row.map(formatCellValue) : []);
        return createSheetData({
            cells,
            sheetName,
            workbookId
        });
    }).filter((sheet)=>sheet.columnCount > 0);
    if (sheets.length === 0) {
        throw new Error("No readable sheets were found in this workbook.");
    }
    return {
        fileName: file.name,
        fileSize: file.size,
        sheets,
        uploadedAt,
        workbookId
    };
}
function getExcelWorkbookFromConfig(config) {
    const workbook = config.excelWorkbook;
    if (typeof workbook === "object" && workbook !== null && Array.isArray(workbook.sheets)) {
        return workbook;
    }
    return null;
}
function hasExcelSourceEvidence(config) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$source$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasExcelSourceEvidence"])(config);
}
function getExcelSheet(workbook, sheetName) {
    if (!workbook) {
        return null;
    }
    return workbook.sheets.find((sheet)=>sheet.sheetName === sheetName) || workbook.sheets[0] || null;
}
function getExcelColumnMappingFromConfig(config, headers) {
    const mapping = config.columnMapping;
    if (typeof mapping === "object" && mapping !== null) {
        return {
            ...detectExcelColumnMapping(headers),
            ...mapping
        };
    }
    return detectExcelColumnMapping(headers);
}
function getNormalizedRowsForSheet({ defaultCurrency, firstDataRowNumber, headerRowNumber, includeRowsWithoutAmount = false, includeTotalRows = false, mapping, sheet, workbook }) {
    const table = getExcelTableSelection(sheet, {
        firstDataRowNumber,
        headerRowNumber
    });
    const currency = defaultCurrency || detectSheetCurrency(sheet.cells);
    const tableRows = sheet.cells.slice(table.firstDataRowNumber - 1, Math.min(sheet.cells.length, table.firstDataRowNumber - 1 + MAX_PERSISTED_ROWS_PER_SHEET)).map((row, rowIndex)=>{
        const rowNumber = table.firstDataRowNumber + rowIndex;
        const valuesByColumn = Object.fromEntries(table.headers.map((header, index)=>[
                header,
                row[index] || ""
            ]));
        return normalizeExcelRow({
            defaultCurrency: currency,
            mapping,
            rowIndex,
            rowNumber,
            sheetName: sheet.sheetName,
            valuesByColumn,
            workbookId: workbook.workbookId
        });
    }).filter((row)=>Object.values(row.raw).some((value)=>hasText(value))).filter((row)=>includeRowsWithoutAmount || Boolean(row.metadata.hasMappedAmount)).filter((row)=>includeTotalRows || !row.metadata.isTotalRow)// Trial balance: drop balance-sheet (Asset/Liability/Equity) rows — only P&L
    // accounts feed the calculation. Only triggers when an account-type column
    // is present and says so; files without it are unaffected.
    .filter((row)=>!row.metadata.isBalanceSheetRow);
    const fallbackRows = getLooseExtractedRows({
        defaultCurrency: currency,
        includeTotalRows,
        sheet,
        workbook
    });
    return shouldUseLooseExtraction({
        fallbackRows,
        mapping,
        tableRows
    }) ? fallbackRows : tableRows;
}
function buildExcelSourceConfigPatch({ existingConfig = {}, firstDataRowNumber, headerRowNumber, includeRowsWithoutAmount, includeTotalRows, mapping, selectedRange, selectedSheetName, workbook }) {
    const sheet = getExcelSheet(workbook, selectedSheetName);
    if (!sheet) {
        throw new Error("Select a readable workbook sheet.");
    }
    const table = getExcelTableSelection(sheet, {
        firstDataRowNumber: firstDataRowNumber ?? (typeof existingConfig.firstDataRowNumber === "number" ? existingConfig.firstDataRowNumber : undefined),
        headerRowNumber: headerRowNumber ?? (typeof existingConfig.headerRowNumber === "number" ? existingConfig.headerRowNumber : undefined)
    });
    const columnMapping = {
        ...detectExcelColumnMapping(table.headers),
        ...mapping || {}
    };
    const nextIncludeTotalRows = includeTotalRows ?? existingConfig.includeTotalRows === true;
    const nextIncludeRowsWithoutAmount = includeRowsWithoutAmount ?? existingConfig.includeRowsWithoutAmount === true;
    const rows = getNormalizedRowsForSheet({
        firstDataRowNumber: table.firstDataRowNumber,
        headerRowNumber: table.headerRowNumber,
        includeRowsWithoutAmount: nextIncludeRowsWithoutAmount,
        includeTotalRows: nextIncludeTotalRows,
        mapping: columnMapping,
        sheet,
        workbook
    });
    const range = selectedRange || table.inferredRange;
    return {
        columnMapping,
        columns: table.headers,
        excelWorkbook: workbook,
        fileName: workbook.fileName,
        fileSize: workbook.fileSize,
        firstDataRowNumber: table.firstDataRowNumber,
        headerRowNumber: table.headerRowNumber,
        includeRowsWithoutAmount: nextIncludeRowsWithoutAmount,
        includeTotalRows: nextIncludeTotalRows,
        outputs: "selected_rows",
        rows,
        selectedRange: range,
        selectedRowsCount: rows.length,
        selectedSheet: sheet.sheetName,
        sheets: workbook.sheets.map((item)=>item.sheetName),
        sourceKind: "excel_workbook",
        sourceLocator: `local-excel://${workbook.workbookId}/${encodeURIComponent(sheet.sheetName)}/${encodeURIComponent(range)}`,
        sourceStatus: "draft",
        sourceVersion: existingConfig.sourceVersion || 1,
        toolId: "source.manual_table",
        uploadTimestamp: workbook.uploadedAt,
        workbookFile: {
            fileName: workbook.fileName,
            fileSize: workbook.fileSize,
            uploadedAt: workbook.uploadedAt,
            workbookId: workbook.workbookId
        },
        workbookId: workbook.workbookId,
        workbookName: workbook.fileName
    };
}
const KEYWORD_RULE_SHEET_NAMES = [
    "Keyword Rules",
    "Keyword Rulebook"
];
const AGGREGATION_RULE_SHEET_NAMES = [
    "Aggregation Rules",
    "Aggregation Rulebook",
    "Calculation Rules"
];
const FAPI_INPUT_SHEET_NAMES = [
    "FAPI Inputs",
    "Inputs"
];
const EXPECTED_RESULT_SHEET_NAMES = [
    "Expected Results",
    "Expected"
];
const TRIAL_BALANCE_SHEET_NAMES = [
    "Trial Balance",
    "TrialBalance",
    "TB"
];
function getRecordValueByAliases(record, aliases) {
    const normalizedAliases = new Set(aliases.map(normalizeKey));
    const entry = Object.entries(record).find(([key])=>normalizedAliases.has(normalizeKey(key)));
    return entry?.[1];
}
function stringValue(value) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function parseSheetNumber(value) {
    return parseNumber(value) ?? undefined;
}
function parseDelimitedList(value) {
    if (Array.isArray(value)) {
        return value.map(String).map((item)=>item.trim()).filter(Boolean);
    }
    if (typeof value !== "string") {
        return [];
    }
    return value.split(DELIMITED_LIST_REGEX).map((item)=>item.trim()).filter(Boolean);
}
function parseJsonArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value !== "string" || !value.trim().startsWith("[")) {
        return null;
    }
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : null;
    } catch  {
        return null;
    }
}
function humanizeId(value) {
    return value.replace(/[_-]/g, " ").replace(/\b\w/g, (letter)=>letter.toUpperCase());
}
function parseMatchModeValue(value) {
    const normalized = normalizeKey(String(value || "contains"));
    if (normalized === "exact") {
        return "exact";
    }
    if (normalized === "startswith") {
        return "starts_with";
    }
    return "contains";
}
function parseNodeTypeValue(value) {
    const normalized = normalizeKey(String(value || "group"));
    if (normalized === "category" || normalized === "categorytotal") {
        return "category_total";
    }
    if (normalized === "final" || normalized === "finalresult") {
        return "final_result";
    }
    if (normalized === "constant" || normalized === "formula" || normalized === "group") {
        return normalized;
    }
    return "group";
}
function parseOperationValue(value) {
    const normalized = normalizeKey(String(value || "sum"));
    const operationByToken = {
        add: "add",
        divide: "divide",
        maxsubtractzero: "max_subtract_zero",
        minmultiplycap: "min_multiply_cap",
        multiply: "multiply",
        passthrough: "pass_through",
        subtract: "subtract",
        sum: "sum",
        sumabs: "sum_abs"
    };
    return operationByToken[normalized] || "sum";
}
function parseOperandToken(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return {
            refType: "constant",
            value
        };
    }
    if (typeof value !== "string") {
        return null;
    }
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }
    const numericValue = Number(trimmed);
    if (Number.isFinite(numericValue)) {
        return {
            refType: "constant",
            value: numericValue
        };
    }
    const sign = trimmed.startsWith("-") ? -1 : 1;
    const unsigned = trimmed.replace(SIGN_PREFIX_REGEX, "").trim();
    const [prefix, ...rest] = unsigned.split(":");
    const refId = rest.length > 0 ? rest.join(":").trim() : unsigned;
    const normalizedPrefix = rest.length > 0 ? normalizeKey(prefix) : "node";
    if (normalizedPrefix === "category") {
        return {
            refId,
            refType: "category",
            sign
        };
    }
    if (normalizedPrefix === "input" || normalizedPrefix === "fapi") {
        return {
            refId,
            refType: "input",
            sign
        };
    }
    if (normalizedPrefix === "constant" || normalizedPrefix === "value") {
        return {
            refType: "constant",
            sign,
            value: Number(refId) || 0
        };
    }
    return {
        refId,
        refType: "node",
        sign
    };
}
function parseOperandsValue(value) {
    const jsonArray = parseJsonArray(value);
    if (jsonArray) {
        return jsonArray;
    }
    return parseDelimitedList(value).map(parseOperandToken).filter(Boolean);
}
function sheetRecords(sheet) {
    if (!sheet) {
        return [];
    }
    return sheet.rows.map((row)=>row.valuesByColumn);
}
function findExcelSheetByName(workbook, candidates) {
    const candidateSet = new Set(candidates.map(normalizeKey));
    return workbook.sheets.find((sheet)=>candidateSet.has(normalizeKey(sheet.sheetName))) || null;
}
function parseKeywordRulesSheet(sheet) {
    return sheetRecords(sheet).flatMap((record, index)=>{
        const categoryId = stringValue(getRecordValueByAliases(record, [
            "categoryId",
            "category",
            "target",
            "subsectionId"
        ]));
        const keywords = parseDelimitedList(getRecordValueByAliases(record, [
            "keywords",
            "keyword",
            "contains",
            "containsKeywords"
        ]));
        const exactKeywords = parseDelimitedList(getRecordValueByAliases(record, [
            "exact",
            "exactKeywords"
        ]));
        const containsKeywords = parseDelimitedList(getRecordValueByAliases(record, [
            "contains",
            "containsKeywords"
        ]));
        const excludeKeywords = parseDelimitedList(getRecordValueByAliases(record, [
            "exclude",
            "excludeKeywords",
            "exclusions"
        ]));
        const allKeywords = exactKeywords.length + containsKeywords.length > 0 ? [
            ...exactKeywords,
            ...containsKeywords
        ] : keywords;
        if (!categoryId || allKeywords.length === 0) {
            return [];
        }
        return [
            {
                categoryId,
                categoryLabel: stringValue(getRecordValueByAliases(record, [
                    "categoryLabel",
                    "label",
                    "name"
                ])) || humanizeId(categoryId),
                confidence: parseSheetNumber(getRecordValueByAliases(record, [
                    "confidence"
                ])) ?? 0.85,
                containsKeywords: containsKeywords.length > 0 ? containsKeywords : undefined,
                description: stringValue(getRecordValueByAliases(record, [
                    "description",
                    "notes"
                ])),
                exactKeywords: exactKeywords.length > 0 ? exactKeywords : undefined,
                excludeKeywords: excludeKeywords.length > 0 ? excludeKeywords : undefined,
                keywords: allKeywords,
                matchMode: parseMatchModeValue(getRecordValueByAliases(record, [
                    "matchMode",
                    "mode"
                ])),
                priority: parseSheetNumber(getRecordValueByAliases(record, [
                    "priority",
                    "order"
                ])),
                ruleId: stringValue(getRecordValueByAliases(record, [
                    "ruleId",
                    "id"
                ])) || `keyword-rule-${index + 1}`,
                suggestedLine: stringValue(getRecordValueByAliases(record, [
                    "suggestedLine",
                    "line"
                ])),
                suggestedSection: stringValue(getRecordValueByAliases(record, [
                    "suggestedSection",
                    "section"
                ])),
                suggestedSubsection: stringValue(getRecordValueByAliases(record, [
                    "suggestedSubsection",
                    "subsection"
                ]))
            }
        ];
    });
}
function parseAggregationRulesSheet(sheet) {
    return sheetRecords(sheet).flatMap((record, index)=>{
        const nodeId = stringValue(getRecordValueByAliases(record, [
            "nodeId",
            "node id",
            "id"
        ]));
        if (!nodeId) {
            return [];
        }
        return [
            {
                children: parseDelimitedList(getRecordValueByAliases(record, [
                    "children",
                    "childNodes"
                ])),
                description: stringValue(getRecordValueByAliases(record, [
                    "description",
                    "notes"
                ])),
                formulaExpression: stringValue(getRecordValueByAliases(record, [
                    "formulaExpression",
                    "expression",
                    "formula"
                ])),
                includeCategoryIds: parseDelimitedList(getRecordValueByAliases(record, [
                    "includeCategoryIds",
                    "includeCategories",
                    "categoryIds",
                    "categories"
                ])),
                label: stringValue(getRecordValueByAliases(record, [
                    "label",
                    "name"
                ])) || humanizeId(nodeId),
                nodeId,
                nodeType: parseNodeTypeValue(getRecordValueByAliases(record, [
                    "nodeType",
                    "type"
                ])),
                operands: parseOperandsValue(getRecordValueByAliases(record, [
                    "operands",
                    "terms"
                ])),
                operation: parseOperationValue(getRecordValueByAliases(record, [
                    "operation",
                    "operator"
                ])),
                order: parseSheetNumber(getRecordValueByAliases(record, [
                    "order"
                ])) ?? (index + 1) * 10,
                outputRole: stringValue(getRecordValueByAliases(record, [
                    "outputRole",
                    "output role"
                ])),
                resultName: stringValue(getRecordValueByAliases(record, [
                    "resultName",
                    "result",
                    "line"
                ])),
                value: parseSheetNumber(getRecordValueByAliases(record, [
                    "value"
                ]))
            }
        ];
    });
}
function normalizeInputName(value) {
    const normalized = normalizeKey(value);
    const aliasByName = {
        documentcurrency: "documentCurrency",
        exchangerate: "overrideRate",
        fapiyear: "fapiYear",
        fat: "fatPaid",
        fatpaid: "fatPaid",
        fxoverride: "overrideRate",
        fxrate: "overrideRate",
        inclusionrate: "inclusionRate",
        reportingcurrency: "reportingCurrency",
        rtf: "rtf",
        rtfrate: "rtf",
        sourcecurrency: "documentCurrency",
        targetcurrency: "reportingCurrency",
        year: "fapiYear"
    };
    return aliasByName[normalized] || value;
}
function parseKeyValueSheet(sheet) {
    const values = {};
    for (const record of sheetRecords(sheet)){
        const key = stringValue(getRecordValueByAliases(record, [
            "key",
            "name",
            "input",
            "field"
        ])) || stringValue(Object.values(record)[0]);
        const value = getRecordValueByAliases(record, [
            "value",
            "amount",
            "rate"
        ]) ?? Object.values(record)[1];
        if (key) {
            values[normalizeInputName(key)] = value;
        }
    }
    return values;
}
function parseFapiInputsSheet(sheet) {
    const keyValueInputs = parseKeyValueSheet(sheet);
    const tableInputs = Object.assign({}, ...sheetRecords(sheet));
    const source = {
        ...tableInputs,
        ...keyValueInputs
    };
    const result = {
        rawInputs: source
    };
    for (const [key, value] of Object.entries(source)){
        const normalizedKey = normalizeInputName(key);
        const numericValue = parseSheetNumber(value);
        result[normalizedKey] = numericValue ?? value;
    }
    if (result.overrideRate !== undefined) {
        result.fxRate = result.overrideRate;
    }
    return result;
}
function parseExpectedResultsSheet(sheet) {
    const expectedResults = {};
    for (const record of sheetRecords(sheet)){
        const resultName = stringValue(getRecordValueByAliases(record, [
            "resultName",
            "line",
            "name",
            "key"
        ])) || stringValue(Object.values(record)[0]);
        const value = parseSheetNumber(getRecordValueByAliases(record, [
            "expected",
            "value",
            "amount"
        ])) ?? parseSheetNumber(Object.values(record)[1]);
        if (resultName && value !== undefined) {
            expectedResults[resultName] = value;
        }
    }
    return expectedResults;
}
function buildFapiWorkbookImportPatch(workbook, existingExcelConfig = {}) {
    const trialBalanceSheet = findExcelSheetByName(workbook, TRIAL_BALANCE_SHEET_NAMES) || workbook.sheets[0];
    const keywordRulesSheet = findExcelSheetByName(workbook, KEYWORD_RULE_SHEET_NAMES);
    const aggregationRulesSheet = findExcelSheetByName(workbook, AGGREGATION_RULE_SHEET_NAMES);
    const fapiInputsSheet = findExcelSheetByName(workbook, FAPI_INPUT_SHEET_NAMES);
    const expectedResultsSheet = findExcelSheetByName(workbook, EXPECTED_RESULT_SHEET_NAMES);
    const expectedResults = parseExpectedResultsSheet(expectedResultsSheet);
    const fapiInputs = {
        ...parseFapiInputsSheet(fapiInputsSheet),
        expectedResults
    };
    return {
        aggregationRules: parseAggregationRulesSheet(aggregationRulesSheet),
        excelSourcePatch: buildExcelSourceConfigPatch({
            existingConfig: existingExcelConfig,
            selectedSheetName: trialBalanceSheet?.sheetName,
            workbook
        }),
        expectedResults,
        fapiInputs,
        importedSheets: {
            aggregationRules: aggregationRulesSheet?.sheetName || null,
            expectedResults: expectedResultsSheet?.sheetName || null,
            fapiInputs: fapiInputsSheet?.sheetName || null,
            keywordRules: keywordRulesSheet?.sheetName || null,
            trialBalance: trialBalanceSheet?.sheetName || null
        },
        keywordRules: parseKeywordRulesSheet(keywordRulesSheet)
    };
}
function formatFileSize(size) {
    if (typeof size !== "number") {
        return "unknown";
    }
    if (size < 1024) {
        return `${size} B`;
    }
    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/runtime/workflow-runs/parse-upload.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseUploadToRows",
    ()=>parseUploadToRows
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$parsing$2f$excel$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/parsing/excel-utils.ts [app-client] (ecmascript)");
'use client';
;
async function parseUploadToRows(file) {
    const workbook = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$parsing$2f$excel$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseExcelWorkbookFile"])(file);
    const patch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$parsing$2f$excel$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildExcelSourceConfigPatch"])({
        workbook
    });
    const raw = Array.isArray(patch.rows) ? patch.rows : [];
    const rows = raw.map((r, i)=>({
            rowId: String(r.rowId ?? `upload-row-${i + 1}`),
            account: r.account ? String(r.account) : undefined,
            label: String(r.label ?? r.description ?? `Row ${i + 1}`),
            description: r.description ? String(r.description) : undefined,
            amount: Number(r.amount) || 0,
            currency: r.currency ? String(r.currency) : undefined
        }));
    return {
        fileName: workbook.fileName,
        rows
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/runtime/workflow-runs/fapi-concept-cards.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("[{\"fieldName\":\"interestIncome\",\"lineId\":\"A\",\"subsectionId\":\"interest_income\",\"label\":\"Interest income\",\"shortDefinition\":\"Interest earned or receivable on deposits, loans, bonds, or other investment assets.\",\"businessMeaning\":\"Represents income from lending, deposits, or investment balances rather than costs of borrowing or balance-sheet liabilities.\",\"fapiTreatmentHint\":\"Treat as property income component A when the account reflects incoming interest, earned interest, or interest receivable tied to investment assets.\",\"accountingFamilies\":[\"revenue\"],\"positiveIndicators\":[\"interest income\",\"interest earned\",\"bank interest\",\"bond interest\",\"interest receivable\",\"investment interest income\"],\"negativeIndicators\":[\"interest expense\",\"interest payable\",\"accrued interest liability\",\"financing costs\",\"borrowing costs\",\"loan interest\"],\"frenchPositiveIndicators\":[\"revenu d'intérêts\",\"intérêts créditeurs\",\"produits d'intérêts\",\"intérêt gagné\",\"intérêts sur placements\"],\"frenchNegativeIndicators\":[\"charge d'intérêts\",\"intérêts à payer\",\"passif d'intérêts courus\",\"frais de financement\",\"intérêts sur emprunt\"],\"positiveExamples\":[\"Interest earned on term deposits\",\"Bank interest on surplus cash\",\"Coupon interest from bonds\"],\"negativeExamples\":[\"Interest payable on shareholder loan\",\"Accrued interest liability at year-end\",\"Financing costs on bank borrowing\"],\"ambiguityWarnings\":[\"The word 'interest' alone is unsafe because it can describe income, expense, receivable, or payable.\",\"Accrued or receivable balances need confirmation that the item belongs to property income rather than a balance-sheet accrual.\"],\"reviewQuestions\":[\"Is the amount earned on cash, deposits, bonds, loans, or other investment assets rather than paid on borrowings?\",\"Does the source label indicate income, earned, received, or receivable instead of expense, payable, or accrued liability?\"],\"routingNotes\":\"Routes to line A / subsection interest_income. Use this card only for property-income interest, not for financing costs or balance-sheet interest liabilities.\",\"riskLevel\":\"medium\"},{\"fieldName\":\"dividends\",\"lineId\":\"A\",\"subsectionId\":\"dividends\",\"label\":\"Dividend income\",\"shortDefinition\":\"Distributions received because the entity owns shares or similar equity interests.\",\"businessMeaning\":\"Represents income from share ownership, not operating reimbursements, office costs, repairs, or liabilities for dividends payable.\",\"fapiTreatmentHint\":\"Treat as property income component A only when the source clearly reflects dividends received or receivable from an equity investment.\",\"accountingFamilies\":[\"revenue\"],\"positiveIndicators\":[\"dividend income\",\"dividends received\",\"cash dividends\",\"share dividends\",\"portfolio dividends\",\"equity dividends\"],\"negativeIndicators\":[\"office expenses\",\"repairs and maintenance\",\"professional fees\",\"return of capital\",\"distribution payable\",\"management fees\"],\"frenchPositiveIndicators\":[\"revenu de dividendes\",\"dividendes reçus\",\"dividendes\",\"produit de dividendes\"],\"frenchNegativeIndicators\":[\"frais de bureau\",\"réparation & entretien local\",\"réparations et entretien\",\"honoraires professionnels\",\"dividendes à payer\"],\"positiveExamples\":[\"Dividends received from portfolio shares\",\"Cash dividends from foreign affiliate shares\",\"Preferred share dividends received\"],\"negativeExamples\":[\"Frais de bureau\",\"Réparation & entretien local\",\"Dividends payable to shareholders\"],\"ambiguityWarnings\":[\"Distributions can represent dividends, returns of capital, partnership allocations, or intercompany settlements; text alone may be insufficient.\",\"Known bad historical exact matches show some French expense labels can be mistaken for dividends.\"],\"reviewQuestions\":[\"Is the amount a distribution received because the entity owns shares, rather than an operating expense or reimbursement?\",\"Could the label refer to a payable, a return of capital, or a partnership distribution instead of dividend income?\"],\"routingNotes\":\"Routes to line A / subsection dividends. Explicitly exclude office/admin and repair labels even if legacy keyword mappings still contain bad dividend matches.\",\"riskLevel\":\"high\"},{\"fieldName\":\"rents\",\"lineId\":\"A\",\"subsectionId\":\"rental_income\",\"label\":\"Rental income\",\"shortDefinition\":\"Income earned from renting or leasing property or assets to another party.\",\"businessMeaning\":\"Represents incoming rent or lease revenue, not occupancy costs, lease liabilities, or prepaid rent balances.\",\"fapiTreatmentHint\":\"Treat as property income component A when the source reflects rent received, rent receivable, or lease income earned.\",\"accountingFamilies\":[\"revenue\"],\"positiveIndicators\":[\"rental income\",\"rent income\",\"lease income\",\"rent receivable\",\"property rent\",\"tenant rent\"],\"negativeIndicators\":[\"rent expense\",\"lease liability\",\"prepaid rent\",\"rent payable\",\"property maintenance\",\"property tax\"],\"frenchPositiveIndicators\":[\"revenus locatifs\",\"loyers reçus\",\"revenus de location\",\"produits de location\",\"loyers\"],\"frenchNegativeIndicators\":[\"loyer payé\",\"loyer à payer\",\"passif locatif\",\"charges locatives\",\"taxes foncières\"],\"positiveExamples\":[\"Rental income from third-party tenants\",\"Lease income from investment property\",\"Monthly rent billed to tenant\"],\"negativeExamples\":[\"Office rent expense\",\"Lease liability for office premises\",\"Prepaid rent asset\"],\"ambiguityWarnings\":[\"The words 'rent' or 'lease' can describe either income or occupancy costs.\",\"Property-related labels may bundle rent with taxes or repairs and need review.\"],\"reviewQuestions\":[\"Is the entity receiving rent from letting property or assets to others?\",\"Does the label point to rent receivable or income rather than rent paid or lease obligations?\"],\"routingNotes\":\"Routes to line A / subsection rental_income. Use only for gross rental-type income, not occupancy costs or lease liabilities.\",\"riskLevel\":\"medium\"},{\"fieldName\":\"royalties\",\"lineId\":\"A\",\"subsectionId\":\"royalties\",\"label\":\"Royalty income\",\"shortDefinition\":\"Income earned when another party pays to use intellectual property, rights, or similar intangible assets.\",\"businessMeaning\":\"Represents incoming royalty or licensing income, not software license expense, royalty payable, or bundled service revenue.\",\"fapiTreatmentHint\":\"Treat as property income component A when the source reflects royalties received for the use of IP, rights, or know-how.\",\"accountingFamilies\":[\"revenue\"],\"positiveIndicators\":[\"royalty income\",\"royalties\",\"licensing income\",\"license fee income\",\"patent royalty\",\"trademark royalty\"],\"negativeIndicators\":[\"royalty expense\",\"license expense\",\"software subscription\",\"service fee revenue\",\"management fee\",\"royalty payable\"],\"frenchPositiveIndicators\":[\"redevances\",\"revenus de redevances\",\"redevances de licence\",\"redevances de brevet\",\"redevances de marque\"],\"frenchNegativeIndicators\":[\"frais de licence\",\"redevances à payer\",\"abonnement logiciel\",\"honoraires de gestion\",\"revenus de services\"],\"positiveExamples\":[\"Trademark royalty income from licensees\",\"Patent royalty receipts\",\"License fee income for intellectual property\"],\"negativeExamples\":[\"Software license expense\",\"Royalty payable to third-party licensor\",\"Service revenue under licensing contract\"],\"ambiguityWarnings\":[\"License-related wording can refer to outgoing software costs, service revenue, or true royalty income.\",\"Intercompany IP arrangements often require contract context to separate royalties from service charges.\"],\"reviewQuestions\":[\"Is the amount consideration for another party's use of IP, rights, or know-how?\",\"Could the label instead describe a software or license expense, a payable, or bundled service revenue?\"],\"routingNotes\":\"Routes to line A / subsection royalties. Prefer this only when the source clearly reflects incoming royalty or licensing income.\",\"riskLevel\":\"high\"},{\"fieldName\":\"otherFapiIncome\",\"lineId\":\"A\",\"subsectionId\":\"other_fapi_income\",\"label\":\"Other FAPI income\",\"shortDefinition\":\"Residual FAPI-relevant income that does not clearly belong to interest, dividends, rents, or royalties.\",\"businessMeaning\":\"Acts as a catch-all income bucket for property-income-like items after the named categories have been ruled out.\",\"fapiTreatmentHint\":\"Use as component A only after excluding the more specific property-income concepts and confirming the amount is still income rather than a reimbursement or clearing item.\",\"accountingFamilies\":[\"revenue\",\"unknown\"],\"positiveIndicators\":[\"other income\",\"miscellaneous income\",\"other revenue\",\"sundry income\",\"incidental income\",\"misc income\"],\"negativeIndicators\":[\"sales revenue\",\"service revenue\",\"dividend income\",\"interest income\",\"rental income\",\"royalty income\"],\"frenchPositiveIndicators\":[\"autres revenus\",\"revenus divers\",\"produits divers\",\"autres produits\",\"revenus accessoires\"],\"frenchNegativeIndicators\":[\"ventes\",\"revenus de services\",\"dividendes\",\"revenu d'intérêts\",\"loyers\",\"redevances\"],\"positiveExamples\":[\"Sundry income related to investment activities\",\"Miscellaneous property income\",\"Other revenue not captured in named property income buckets\"],\"negativeExamples\":[\"Sales revenue from product inventory\",\"Service revenue from consulting contract\",\"Dividend income from shares held\"],\"ambiguityWarnings\":[\"'Miscellaneous income' and 'other revenue' are catch-all labels that are rarely safe from text alone.\",\"Intercompany charges, rebates, and recoveries may look like other income but belong elsewhere after context review.\"],\"reviewQuestions\":[\"After ruling out interest, dividends, rents, royalties, and capital gains, does this still look like FAPI-relevant income?\",\"Is the amount truly income rather than a reimbursement, balance-sheet clearing item, or operating revenue outside this workflow?\"],\"routingNotes\":\"Routes to line A / subsection other_fapi_income. Treat as a residual income bucket only after excluding the named property-income categories.\",\"riskLevel\":\"high\"},{\"fieldName\":\"capGains\",\"lineId\":\"CAP_GAINS\",\"subsectionId\":null,\"label\":\"Capital gains\",\"shortDefinition\":\"Realized gains from the disposition of capital property or other non-excluded property.\",\"businessMeaning\":\"Represents realized disposition gains rather than ordinary revenue, unrealized revaluations, or capital losses.\",\"fapiTreatmentHint\":\"Use this direct capital-gains line only when the source indicates a realized gain on disposition and not an operating or unrealized gain.\",\"accountingFamilies\":[\"capital\"],\"positiveIndicators\":[\"capital gain\",\"capital gains\",\"gain on sale\",\"gain on disposition\",\"realized gain\",\"investment gains\"],\"negativeIndicators\":[\"capital loss\",\"unrealized gain\",\"depreciation\",\"dividend income\",\"gain on foreign exchange\",\"loss on sale\"],\"frenchPositiveIndicators\":[\"gain en capital\",\"gains en capital\",\"gain sur disposition\",\"gain sur vente\",\"gain réalisé sur placement\"],\"frenchNegativeIndicators\":[\"perte en capital\",\"perte sur disposition\",\"gain non réalisé\",\"amortissement\",\"dividendes\"],\"positiveExamples\":[\"Gain on sale of marketable securities\",\"Realized gain on disposition of shares\",\"Gain on sale of non-excluded property\"],\"negativeExamples\":[\"Capital loss on disposed shares\",\"Unrealized gain on investment revaluation\",\"Dividend income from portfolio holdings\"],\"ambiguityWarnings\":[\"'Gain' alone is unsafe because it can describe capital, FX, operating, or unrealized movements.\",\"Disposition labels may still need confirmation that the asset is non-excluded property for this runtime line.\"],\"reviewQuestions\":[\"Was there a realized disposition event creating a capital gain rather than ordinary revenue?\",\"Does the record indicate a gain, not a loss, and is it appropriate for the capital gains line rather than another component?\"],\"routingNotes\":\"Routes to top-level line CAP_GAINS with no subsection. This is a direct capital-gains line, not a general other-income fallback.\",\"riskLevel\":\"high\"},{\"fieldName\":\"fatPaid\",\"lineId\":\"FAT_PAID\",\"subsectionId\":null,\"label\":\"Foreign tax paid / FAT paid\",\"shortDefinition\":\"Foreign taxes paid or withheld on relevant income streams for FAT review purposes.\",\"businessMeaning\":\"Represents foreign tax already paid or withheld, not a domestic sales tax, tax provision, or simple tax payable balance.\",\"fapiTreatmentHint\":\"Use this line when the source clearly reflects foreign tax paid or withheld on income relevant to FAPI review.\",\"accountingFamilies\":[\"tax\"],\"positiveIndicators\":[\"foreign tax paid\",\"foreign withholding tax\",\"tax withheld abroad\",\"withholding tax on income\",\"foreign tax withheld\",\"non-resident withholding\"],\"negativeIndicators\":[\"tax payable\",\"income tax expense\",\"sales tax\",\"gst\",\"vat\",\"tax provision\"],\"frenchPositiveIndicators\":[\"impôt étranger payé\",\"retenue d'impôt étranger\",\"impôt retenu à la source\",\"impôt payé à l'étranger\",\"retenue étrangère\"],\"frenchNegativeIndicators\":[\"impôt à payer\",\"provision pour impôts\",\"TPS\",\"TVQ\",\"taxe de vente\",\"charge d'impôt\"],\"positiveExamples\":[\"Foreign withholding tax on dividends received\",\"Tax withheld abroad on royalty income\",\"Foreign tax paid on investment income\"],\"negativeExamples\":[\"Foreign tax payable at year-end\",\"Provision for income taxes\",\"GST collected on sales\"],\"ambiguityWarnings\":[\"Tax labels often fail to distinguish tax paid, tax payable, tax expense, and sales taxes.\",\"Withholding may attach to different income streams, so confirm the tax is foreign and relevant to FAPI review.\"],\"reviewQuestions\":[\"Is the amount a foreign tax already paid or withheld, rather than a payable or provision?\",\"Does the tax relate to the income being reviewed for FAPI or FAT purposes rather than domestic sales or payroll taxes?\"],\"routingNotes\":\"Routes to top-level line FAT_PAID with no subsection. Use for foreign tax paid or withheld amounts, not generic tax expense or liabilities.\",\"riskLevel\":\"medium\"},{\"fieldName\":\"generalExpenses\",\"lineId\":\"EXPENSES\",\"subsectionId\":\"general_expenses\",\"label\":\"General / office / administrative expenses\",\"shortDefinition\":\"Ordinary general, office, and administrative costs that support the business but are not legal, accounting, tax, or financing items.\",\"businessMeaning\":\"Represents the current catch-all expense bucket for office-type and other general operating costs, including some repair or maintenance labels when no narrower route exists.\",\"fapiTreatmentHint\":\"Use this expense bucket for office/admin-style costs after excluding legal, accounting, foreign tax, and interest-specific items.\",\"accountingFamilies\":[\"expense\"],\"positiveIndicators\":[\"general expenses\",\"administrative expenses\",\"office expenses\",\"office supplies\",\"bank charges\",\"repairs and maintenance\"],\"negativeIndicators\":[\"legal fees\",\"accounting fees\",\"interest expense\",\"foreign tax paid\",\"dividend income\",\"capital gain\"],\"frenchPositiveIndicators\":[\"frais généraux\",\"dépenses administratives\",\"frais de bureau\",\"fournitures de bureau\",\"réparation & entretien local\",\"frais bancaires\"],\"frenchNegativeIndicators\":[\"honoraires d'avocat\",\"honoraires comptables\",\"charge d'intérêts\",\"impôt étranger payé\",\"dividendes\",\"gain en capital\"],\"positiveExamples\":[\"Office supplies for affiliate administration\",\"Frais de bureau du siège étranger\",\"Réparation & entretien local du bureau\"],\"negativeExamples\":[\"Legal fees for external counsel\",\"Accounting fees for year-end audit\",\"Foreign withholding tax paid\"],\"ambiguityWarnings\":[\"General and admin labels are broad and may hide legal, accounting, tax, or financing items that deserve a narrower field.\",\"Management fees and intercompany charges should not default here without context on the underlying service.\"],\"reviewQuestions\":[\"Does the label describe ordinary general or administrative costs rather than legal, accounting, tax, or interest items?\",\"Is there any contract or intercompany context suggesting the amount is actually a service charge or reimbursement instead of a general expense?\"],\"routingNotes\":\"Routes to line EXPENSES / subsection general_expenses. This is the current catch-all for office/admin-type expenses because no narrower office-only runtime route exists.\",\"riskLevel\":\"high\"},{\"fieldName\":\"legalExpenses\",\"lineId\":\"EXPENSES\",\"subsectionId\":\"extra_expenses\",\"label\":\"Legal expenses\",\"shortDefinition\":\"Fees for lawyers, legal counsel, litigation, notarial work, or other clearly legal services.\",\"businessMeaning\":\"Represents legal service costs rather than accounting, audit, bookkeeping, or routine office administration.\",\"fapiTreatmentHint\":\"Use this expense concept only when the source clearly points to legal service providers or legal work performed.\",\"accountingFamilies\":[\"expense\"],\"positiveIndicators\":[\"legal expenses\",\"legal fees\",\"attorney fees\",\"counsel fees\",\"litigation costs\",\"notary fees\"],\"negativeIndicators\":[\"accounting fees\",\"audit fees\",\"bookkeeping\",\"tax preparation\",\"management consulting\",\"general office expense\"],\"frenchPositiveIndicators\":[\"frais juridiques\",\"honoraires d'avocat\",\"honoraires juridiques\",\"frais de notaire\",\"contentieux\"],\"frenchNegativeIndicators\":[\"honoraires comptables\",\"frais d'audit\",\"tenue de livres\",\"consultation en gestion\",\"frais de bureau\"],\"positiveExamples\":[\"Legal fees for contract review\",\"External counsel fees for dispute settlement\",\"Notary fees on legal documentation\"],\"negativeExamples\":[\"External audit fees\",\"Bookkeeping charges from CPA firm\",\"Office administration supplies\"],\"ambiguityWarnings\":[\"'Professional fees' is not safe on its own because it can mean legal, accounting, audit, or consulting services.\",\"Some advisors issue blended invoices, so supporting documents may be needed to separate legal from accounting work.\"],\"reviewQuestions\":[\"Does the label point to lawyers, counsel, litigation, contracts, compliance, or notarial services?\",\"Is the amount better characterized as accounting or audit fees instead of legal work?\"],\"routingNotes\":\"Routes to line EXPENSES / subsection extra_expenses. Runtime currently collapses legal and accounting into the same subsection, so this card preserves the distinction only at the concept layer.\",\"riskLevel\":\"high\"},{\"fieldName\":\"accountingExpenses\",\"lineId\":\"EXPENSES\",\"subsectionId\":\"extra_expenses\",\"label\":\"Accounting / audit / professional fees\",\"shortDefinition\":\"Fees for accounting, audit, bookkeeping, tax compliance, or similar professional finance work.\",\"businessMeaning\":\"Represents accounting and audit support rather than legal counsel, management advisory, or general office spending.\",\"fapiTreatmentHint\":\"Use this expense concept when the label indicates accounting, bookkeeping, audit, or tax-return preparation services.\",\"accountingFamilies\":[\"expense\"],\"positiveIndicators\":[\"accounting expenses\",\"accounting fees\",\"audit fees\",\"bookkeeping\",\"tax preparation fees\",\"cpa fees\"],\"negativeIndicators\":[\"legal fees\",\"attorney fees\",\"litigation\",\"general office expense\",\"management fees\",\"interest expense\"],\"frenchPositiveIndicators\":[\"honoraires comptables\",\"frais de comptabilité\",\"frais d'audit\",\"tenue de livres\",\"préparation fiscale\"],\"frenchNegativeIndicators\":[\"honoraires d'avocat\",\"contentieux\",\"frais de bureau\",\"honoraires de gestion\",\"charge d'intérêts\"],\"positiveExamples\":[\"External audit fees\",\"Bookkeeping and accounting fees\",\"Tax preparation fees for affiliate returns\"],\"negativeExamples\":[\"Legal fees for contract dispute\",\"Office supplies expense\",\"Interest on shareholder loan\"],\"ambiguityWarnings\":[\"'Professional fees' may belong here, to legal, or to another service category; text alone is often insufficient.\",\"Management or advisory fees can resemble accounting support but may reflect a different business relationship.\"],\"reviewQuestions\":[\"Does the label refer to accounting, bookkeeping, audit, compliance, or tax return preparation work?\",\"Could this instead be legal counsel, management advisory, or a broader intercompany service charge?\"],\"routingNotes\":\"Routes to line EXPENSES / subsection extra_expenses. Like legalExpenses, this currently collapses at Level 2, but keeping a separate concept card supports future AI suggestions.\",\"riskLevel\":\"high\"}]"));}),
"[project]/shared/workflow-engine/runtime/workflow-runs/fapi-mapping.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// FAPI mapping rules — ported from the authoritative Platform repo.
//
// `fapi-concept-cards.json` is a copy of Platform's
// backend/config/fapi-concept-cards.json (the source of truth for how accounts
// are classified into FAPI lines). This transforms each concept card into the
// keyword-rule shape the TaxflowOS keyword mapper consumes:
//   • positiveIndicators + frenchPositiveIndicators → keywords
//   • negativeIndicators + frenchNegativeIndicators → excludeKeywords (disqualify)
//   • lineId / fieldName → the mapper's line + category targets
//
// So Sofi now classifies with Platform's exact vocabulary (bilingual, with
// negative indicators), instead of the old 18 static demo keywords.
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "FAPI_MAPPING_RULES",
    ()=>FAPI_MAPPING_RULES,
    "FAPI_PLATFORM_RULES",
    ()=>FAPI_PLATFORM_RULES,
    "FAPI_PLATFORM_RULE_SUMMARY",
    ()=>FAPI_PLATFORM_RULE_SUMMARY,
    "FAPI_SUPPLEMENTAL_RULES",
    ()=>FAPI_SUPPLEMENTAL_RULES
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2d$concept$2d$cards$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/fapi-concept-cards.json (json)");
;
const lc = (arr)=>(arr ?? []).map((s)=>s.toLowerCase().trim()).filter(Boolean);
const FAPI_PLATFORM_RULES = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2d$concept$2d$cards$2e$json__$28$json$29$__["default"].map(_c = (c)=>({
        ruleId: `platform-${c.fieldName}`,
        categoryId: c.fieldName,
        categoryLabel: c.label,
        keywords: lc([
            ...c.positiveIndicators ?? [],
            ...c.frenchPositiveIndicators ?? []
        ]),
        excludeKeywords: lc([
            ...c.negativeIndicators ?? [],
            ...c.frenchNegativeIndicators ?? []
        ]),
        confidence: 0.9,
        // Word-order- + plural-tolerant matching so real GL labels like
        // "Investment Income - Interest" match the "interest income" indicator.
        matchMode: 'all_words',
        lineId: c.lineId,
        target: c.fieldName
    }));
_c1 = FAPI_PLATFORM_RULES;
const FAPI_SUPPLEMENTAL_RULES = [
    {
        ruleId: 'supp-cfaIncome',
        categoryId: 'cfaIncome',
        categoryLabel: 'Controlled foreign affiliate income (C)',
        keywords: [
            'controlled foreign corporation income',
            'controlled foreign affiliate income',
            'controlled foreign corporation',
            'controlled foreign affiliate',
            'cfc income',
            'cfa income'
        ],
        excludeKeywords: [
            'loss',
            'expense',
            'payable'
        ],
        confidence: 0.9,
        matchMode: 'all_words',
        lineId: 'C',
        target: 'cfaIncome'
    },
    {
        ruleId: 'supp-debtForgiveness',
        categoryId: 'debtForgiveness',
        categoryLabel: 'Debt forgiveness (A1)',
        keywords: [
            'debt forgiveness income',
            'debt forgiveness',
            'forgiveness of debt'
        ],
        excludeKeywords: [
            'expense',
            'payable'
        ],
        confidence: 0.9,
        matchMode: 'all_words',
        lineId: 'A1',
        target: 'debtForgiveness'
    },
    {
        ruleId: 'supp-businessLosses',
        categoryId: 'businessLosses',
        categoryLabel: 'Business losses (D)',
        keywords: [
            'business investment losses',
            'business investment loss',
            'allowable business investment loss',
            'business loss'
        ],
        excludeKeywords: [
            'income',
            'gain'
        ],
        confidence: 0.9,
        matchMode: 'all_words',
        lineId: 'D',
        target: 'businessLosses'
    },
    {
        ruleId: 'supp-faclCarryforward',
        categoryId: 'faclCarryforward',
        categoryLabel: 'Foreign accrual capital losses (E)',
        keywords: [
            'foreign accrual capital losses',
            'foreign accrual capital loss',
            'facl carryforward'
        ],
        excludeKeywords: [
            'income',
            'gain',
            'property'
        ],
        confidence: 0.9,
        matchMode: 'all_words',
        lineId: 'E',
        target: 'faclCarryforward'
    },
    {
        ruleId: 'supp-otherFapiIncome',
        categoryId: 'otherFapiIncome',
        categoryLabel: 'Other FAPI income',
        keywords: [
            'foreign accrual property income',
            'foreign exchange gains',
            'foreign exchange gain',
            'fapi income'
        ],
        excludeKeywords: [
            'loss',
            'expense',
            'payable'
        ],
        confidence: 0.9,
        matchMode: 'all_words',
        lineId: 'A',
        target: 'otherFapiIncome'
    }
];
const FAPI_MAPPING_RULES = [
    ...FAPI_PLATFORM_RULES,
    ...FAPI_SUPPLEMENTAL_RULES
];
const FAPI_PLATFORM_RULE_SUMMARY = FAPI_MAPPING_RULES.map(_c2 = (r)=>`${r.categoryId} → line ${r.lineId} (+${r.keywords.length} / -${r.excludeKeywords.length})`);
_c3 = FAPI_PLATFORM_RULE_SUMMARY;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "FAPI_PLATFORM_RULES$(conceptCards as ConceptCard[]).map");
__turbopack_context__.k.register(_c1, "FAPI_PLATFORM_RULES");
__turbopack_context__.k.register(_c2, "FAPI_PLATFORM_RULE_SUMMARY$FAPI_MAPPING_RULES.map");
__turbopack_context__.k.register(_c3, "FAPI_PLATFORM_RULE_SUMMARY");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/runtime/workflow-runs/fapi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FAPI_CONFIG",
    ()=>FAPI_CONFIG
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/shared/workflow-engine/local-fiscal-workflow.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$fapi$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/templates/sample-workflows/fapi-template.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2d$mapping$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/fapi-mapping.ts [app-client] (ecmascript)");
'use client';
;
;
;
const ROWS = [
    {
        rowId: 'tb-1',
        account: '4000',
        label: 'Interest income',
        description: 'Bank interest earned on deposits',
        amount: 12000,
        currency: 'USD'
    },
    {
        rowId: 'tb-2',
        account: '4100',
        label: 'Rental income',
        description: 'Lease income from real property',
        amount: 8000,
        currency: 'USD'
    },
    {
        rowId: 'tb-3',
        account: '4200',
        label: 'Dividend income',
        description: 'Dividend income from portfolio shares',
        amount: 5000,
        currency: 'USD'
    },
    {
        rowId: 'tb-4',
        account: '4300',
        label: 'Capital gains',
        description: 'Capital gains on disposition of shares',
        amount: 6000,
        currency: 'USD'
    },
    {
        rowId: 'tb-5',
        account: '5000',
        label: 'General expenses',
        description: 'Operating expenses for the period',
        amount: -1500,
        currency: 'USD'
    },
    {
        rowId: 'tb-6',
        account: '5100',
        label: 'Legal expenses',
        description: 'Legal advisory fees',
        amount: -900,
        currency: 'USD'
    },
    {
        rowId: 'tb-7',
        account: '5200',
        label: 'Accounting expenses',
        description: 'Accounting service fees',
        amount: -600,
        currency: 'USD'
    },
    {
        rowId: 'tb-8',
        account: '4900',
        label: 'Management fees from CFA',
        description: 'Intercompany management fee income',
        amount: 4500,
        currency: 'USD'
    }
];
const CATEGORIES = [
    {
        id: 'otherFapiIncome',
        label: 'Other FAPI Income'
    },
    {
        id: 'interestIncome',
        label: 'Interest Income'
    },
    {
        id: 'capGains',
        label: 'Capital Gains'
    },
    {
        id: 'generalExpenses',
        label: 'General Expense'
    },
    {
        id: '__skip__',
        label: 'Leave unmatched'
    }
];
const FAPI_CONFIG = {
    id: 'fapi',
    name: 'FAPI',
    agentId: 'sofi',
    documentLabel: 'foreign-affiliate trial balance',
    resultPage: 'fapi',
    steps: [
        {
            label: 'Collect source documents',
            sub: 'Foreign-affiliate trial balance'
        },
        {
            label: 'Classify & categorize income',
            sub: 'Keyword mapper → FAPI categories'
        },
        {
            label: 'Compute FAPI',
            sub: 'Rollup + two-stage calculation engine'
        },
        {
            label: 'Review & approve',
            sub: 'Human sign-off on the figures'
        }
    ],
    buildSnapshot: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createFapiTemplateWorkflow"],
    sampleRows: ROWS,
    sourceBlockId: 'fapi-source-trial-balance',
    mapperBlockId: 'fapi-logic-keyword-mapper',
    rollupBlockId: 'fapi-logic-category-rollup',
    linesBlockId: 'fapi-logic-lines-engine',
    summaryBlockId: 'fapi-logic-summary-engine',
    linesRules: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$fapi$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_LINES_CALC_RULES"],
    summaryRules: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$fapi$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_SUMMARY_CALC_RULES"],
    mapperRules: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2d$mapping$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_MAPPING_RULES"],
    // Unmatched rows don't hard-block the run — they're left out of the calc and
    // surfaced as a non-blocking review banner; categorizing them is optional.
    defaultRouteUnmatched: true,
    bucketKeys: [
        'income_bucket',
        'expense_bucket',
        'capGains',
        'debtForgiveness',
        'priorYearG',
        'cfaIncome',
        'businessLosses'
    ],
    lineKeys: [
        'A',
        'EXPENSES',
        'COMPUTATION_95_4',
        'A1',
        'A2',
        'B',
        'C',
        'D',
        'E',
        'F',
        'F1',
        'G',
        'H'
    ],
    categoryOptions: CATEGORIES,
    headlineKey: 'GROSS',
    currency: 'USD',
    editableInputs: [
        {
            key: 'fxRate',
            label: 'FX rate (USD → CAD)',
            default: 1.35,
            step: 0.01,
            hint: 'Bank of Canada annual average',
            block: {
                blockId: 'fapi-source-fx-rate',
                configKey: 'overrideRate'
            }
        },
        {
            key: 'inclusionRate',
            label: 'Inclusion rate',
            default: 0.5,
            step: 0.05,
            hint: 'Taxable portion of capital gains',
            block: {
                blockId: 'fapi-source-inputs',
                configKey: 'inclusionRate'
            }
        },
        {
            key: 'pCoefficient',
            label: 'P-coefficient',
            default: 1,
            step: 0.05,
            hint: 'Participating % applied to property income & expenses (line A)',
            block: {
                blockId: 'fapi-source-inputs',
                configKey: 'pCoefficient'
            }
        },
        {
            key: 'canadianRules95_4',
            label: '95(2) amount',
            default: 0,
            step: 100,
            hint: 'Canadian 95(2) rules amount (flows into line A)',
            block: {
                blockId: 'fapi-source-inputs',
                configKey: 'canadianRules95_4'
            }
        },
        // Lines A.1 / C / D / E are produced by CLASSIFYING trial-balance rows (the
        // rollup emits them as named values). They're editable overrides, but must
        // stay `classificationFed` so leaving them at 0 doesn't clobber the classified
        // figure — otherwise the worksheet (which seeds every input) and the chat run
        // (which seeds none) disagree. See engine.ts injection guard.
        {
            key: 'debtForgiveness',
            label: 'Line A.1 · Debt forgiveness',
            default: 0,
            step: 100,
            hint: 'A1 = 2 × debt forgiveness',
            classificationFed: true,
            block: {
                blockId: 'fapi-source-inputs',
                configKey: 'debtForgiveness'
            }
        },
        {
            key: 'priorYearG',
            label: 'Line A.2 · Prior-year G',
            default: 0,
            step: 100,
            hint: 'Prior-year G carried forward',
            block: {
                blockId: 'fapi-source-inputs',
                configKey: 'priorYearG'
            }
        },
        {
            key: 'cfaIncome',
            label: 'Line C · CFA income',
            default: 0,
            step: 100,
            hint: 'Controlled foreign affiliate income',
            classificationFed: true,
            block: {
                blockId: 'fapi-source-inputs',
                configKey: 'cfaIncome'
            }
        },
        {
            key: 'businessLosses',
            label: 'Line D · Business losses',
            default: 0,
            step: 100,
            hint: 'Deductible business losses',
            classificationFed: true,
            block: {
                blockId: 'fapi-source-inputs',
                configKey: 'businessLosses'
            }
        },
        {
            key: 'faclCarryforward',
            label: 'Line E · FACL carryforward',
            default: 0,
            step: 100,
            hint: 'Foreign accrual capital loss carryforward',
            classificationFed: true,
            block: {
                blockId: 'fapi-source-inputs',
                configKey: 'faclCarryforward'
            }
        },
        {
            key: 'prescribedAmount',
            label: 'Line F · Prescribed amount',
            default: 0,
            step: 100,
            hint: 'Prescribed deductible amount',
            block: {
                blockId: 'fapi-source-inputs',
                configKey: 'prescribedAmount'
            }
        },
        {
            key: 'prescribedAmountF1',
            label: 'Line F.1 · Prescribed amount',
            default: 0,
            step: 100,
            hint: 'Prescribed deductible amount (F.1)',
            block: {
                blockId: 'fapi-source-inputs',
                configKey: 'prescribedAmountF1'
            }
        },
        {
            key: 'dividendDeductions',
            label: 'Line G · Dividend deductions',
            default: 0,
            step: 100,
            hint: 'Deductions for dividends',
            block: {
                blockId: 'fapi-source-inputs',
                configKey: 'dividendDeductions'
            }
        },
        {
            key: 'partnershipDividends',
            label: 'Line H · Partnership dividends',
            default: 0,
            step: 100,
            hint: 'Partnership dividend deductions',
            block: {
                blockId: 'fapi-source-inputs',
                configKey: 'partnershipDividends'
            }
        },
        {
            key: 'fatPaid',
            label: 'FAT · Foreign accrual tax paid',
            default: 100,
            step: 50,
            hint: 'Feeds FAT deduction = min(FAT × RTF, FAPI brut)',
            block: {
                blockId: 'fapi-source-inputs',
                configKey: 'fatPaid'
            }
        }
    ],
    // The three bucket-backed lines carry per-row provenance from the keyword mapper.
    // Mirrors the worksheet's subRows() filter so "what rows feed line A" matches the UI.
    worksheetProvenance: ({ lineKey, core })=>{
        const kind = lineKey === 'A' ? 'income' : lineKey === 'EXPENSES' ? 'expense' : lineKey === 'B' ? 'capgains' : null;
        if (!kind) return [];
        const isCap = (c)=>/cap|gain/i.test(c);
        const rows = kind === 'income' ? core.detail.mapped.filter((r)=>r.amount > 0 && !isCap(r.category)) : kind === 'expense' ? core.detail.mapped.filter((r)=>r.amount < 0) : core.detail.mapped.filter((r)=>isCap(r.category));
        return rows.map((r)=>({
                label: r.label,
                amount: Number(r.amount.toFixed(2)),
                category: r.category,
                keyword: r.keyword || null,
                confidence: Math.round((r.confidence || 0) * 100)
            }));
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/runtime/workflow-runs/roulement.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ROULEMENT_CONFIG",
    ()=>ROULEMENT_CONFIG
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/shared/workflow-engine/local-fiscal-workflow.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$roulement$2d$fiscal$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/templates/sample-workflows/roulement-fiscal-template.ts [app-client] (ecmascript)");
'use client';
;
;
// Sample "biens transférés" — the property being rolled into the corporation.
// The Roulement classification mapper matches on `description`, so each row's
// description carries both the classification keyword AND the label prefix (so a
// user categorization override — which keys off the label — also matches on
// re-run). The last row is ambiguous, so the run must ask how to classify it.
const ROWS = [
    {
        rowId: 'b-1',
        label: 'Actions ordinaires de Filiale',
        description: 'Actions ordinaires de Filiale — titres de participation',
        amount: 40000,
        currency: 'USD'
    },
    {
        rowId: 'b-2',
        label: 'Équipement de production classe 8',
        description: 'Équipement de production classe 8 — machinerie amortissable',
        amount: 60000,
        currency: 'USD'
    },
    {
        rowId: 'b-3',
        label: 'Terrain commercial',
        description: 'Terrain commercial — fonds de terre non amortissable',
        amount: 80000,
        currency: 'USD'
    },
    {
        rowId: 'b-4',
        label: 'Inventaire de marchandises',
        description: 'Inventaire de marchandises — stock de produits finis',
        amount: 30000,
        currency: 'USD'
    },
    {
        rowId: 'b-5',
        label: 'Achalandage de l’entreprise',
        description: 'Achalandage de l’entreprise — goodwill incorporel',
        amount: 20000,
        currency: 'USD'
    },
    {
        rowId: 'b-6',
        label: 'Contrat de service exclusif',
        description: 'Contrat de service exclusif — droit contractuel non classé',
        amount: 15000,
        currency: 'USD'
    }
];
const CATEGORIES = [
    {
        id: 'actions',
        label: 'Actions / Titres'
    },
    {
        id: 'immobilisationAmortissable',
        label: 'Immobilisation amortissable'
    },
    {
        id: 'bienEnCapitalNonAmortissable',
        label: 'Bien en capital non amortissable'
    },
    {
        id: 'biensInventaire',
        label: 'Biens en inventaire'
    },
    {
        id: 'immobilisationIncorporelle',
        label: 'Incorporel / Achalandage'
    },
    {
        id: '__skip__',
        label: 'Laisser non classé'
    }
];
const ROULEMENT_CONFIG = {
    id: 'roulement',
    name: 'Roulement fiscal (art. 85)',
    agentId: 'theo',
    documentLabel: 'tableau des biens transférés (PBR / JVM)',
    steps: [
        {
            label: 'Biens transférés',
            sub: 'Tableau des biens · PBR / JVM'
        },
        {
            label: 'Classer les biens',
            sub: 'Classification par catégorie'
        },
        {
            label: 'Élection art. 85',
            sub: 'Bornes + montant élu'
        },
        {
            label: 'Réviser & approuver',
            sub: 'Signature des chiffres'
        }
    ],
    buildSnapshot: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createRoullementFiscalWorkflow"],
    sampleRows: ROWS,
    sourceBlockId: 'roulement-source-biens',
    mapperBlockId: 'roulement-logic-classification',
    rollupBlockId: 'roulement-logic-rollup',
    linesBlockId: 'roulement-logic-election',
    summaryBlockId: 'roulement-logic-sommaire',
    linesRules: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$roulement$2d$fiscal$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROULEMENT_ELECTION_CALC_RULES"],
    summaryRules: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$roulement$2d$fiscal$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROULEMENT_SUMMARY_CALC_RULES"],
    bucketKeys: [
        'pbr_immo_amortissable',
        'pbr_bien_capital',
        'pbr_actions',
        'pbr_inventaire',
        'pbr_incorporel',
        'pbr_total'
    ],
    lineKeys: [
        'BORNE_MIN',
        'BORNE_MAX',
        'MONTANT_ELU',
        'PRODUIT_ALIENATION',
        'GAIN_CAPITAL_BRUT',
        'GAIN_IMPOSABLE',
        'COUT_ACTIONS_RECUES'
    ],
    categoryOptions: CATEGORIES,
    headlineKey: 'GAIN_DIFFERE',
    currency: 'USD',
    elect: {
        paramBlockId: 'roulement-source-params',
        paramKey: 'montant_elu',
        minKey: 'BORNE_MIN',
        maxKey: 'BORNE_MAX',
        label: 'montant élu (art. 85)'
    },
    // The template's params source (fapi_inputs tool) doesn't emit jvm_total /
    // contrepartie / taux_inclusion, so the deterministic art. 85 election math is
    // computed here from the engine's real PBR total + these fixed params.
    params: {
        jvm_total: 500000,
        contrepartie_autre: 0,
        taux_inclusion: 0.5,
        fx_rate: 1.35,
        impot_rate: 0.265
    },
    editableInputs: [
        {
            key: 'jvm_total',
            label: 'JVM totale des biens',
            default: 500000,
            step: 10000,
            hint: 'Juste valeur marchande des biens transférés'
        },
        {
            key: 'contrepartie_autre',
            label: 'Contrepartie autre que des actions',
            default: 0,
            step: 5000
        },
        {
            key: 'taux_inclusion',
            label: 'Taux d’inclusion',
            default: 0.5,
            step: 0.05
        }
    ],
    computeExtra: ({ rollup, params, elected })=>{
        const pbrTotal = rollup.pbr_total ?? 0;
        const borneMin = Math.max(pbrTotal, params.contrepartie_autre);
        const borneMax = params.jvm_total;
        const montantElu = elected ?? borneMin;
        const gainBrut = Math.max(montantElu - pbrTotal, 0);
        const gainImposable = gainBrut * params.taux_inclusion;
        const coutActions = montantElu - params.contrepartie_autre;
        const gainDiffere = params.jvm_total - montantElu;
        const impotDiffere = gainDiffere * params.impot_rate;
        const lines = [
            {
                key: 'BORNE_MIN',
                label: 'Borne minimale',
                value: borneMin,
                formula: 'max(PBR total, contrepartie)'
            },
            {
                key: 'BORNE_MAX',
                label: 'Borne maximale (JVM)',
                value: borneMax,
                formula: 'JVM totale des biens'
            },
            {
                key: 'MONTANT_ELU',
                label: 'Montant élu',
                value: montantElu,
                formula: 'choisi entre les bornes (art. 85(1)a))'
            },
            {
                key: 'GAIN_CAPITAL_BRUT',
                label: 'Gain en capital brut',
                value: gainBrut,
                formula: 'max(montant élu − PBR total, 0)'
            },
            {
                key: 'GAIN_IMPOSABLE',
                label: 'Gain imposable',
                value: gainImposable,
                formula: 'gain brut × taux d’inclusion (50 %)'
            },
            {
                key: 'COUT_ACTIONS_RECUES',
                label: 'Coût des actions reçues',
                value: coutActions,
                formula: 'montant élu − contrepartie autre'
            }
        ];
        const summary = [
            {
                key: 'PBR_TOTAL',
                label: 'PBR total des biens',
                value: pbrTotal,
                formula: 'somme des PBR classés'
            },
            {
                key: 'GAIN_DIFFERE',
                label: 'Gain différé (non reconnu)',
                value: gainDiffere,
                formula: 'JVM totale − montant élu'
            },
            {
                key: 'IMPOT_ESTIME_DIFFERE',
                label: 'Impôt reporté estimé',
                value: impotDiffere,
                formula: 'gain différé × 26,5 %'
            },
            {
                key: 'JVM_TOTAL',
                label: 'JVM totale des biens',
                value: params.jvm_total,
                formula: 'juste valeur marchande (donnée)'
            }
        ];
        return {
            lines,
            summary,
            boundsMin: borneMin,
            boundsMax: borneMax
        };
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/runtime/workflow-runs/expense.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EXPENSE_CONFIG",
    ()=>EXPENSE_CONFIG
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/shared/workflow-engine/local-fiscal-workflow.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$expense$2d$reimbursement$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/templates/sample-workflows/expense-reimbursement-template.ts [app-client] (ecmascript)");
'use client';
;
;
// Sample expense report — one row per receipt. The classifier matches on label +
// description, so each carries a channel-obvious keyword.
const ROWS = [
    {
        rowId: 'exp-1',
        account: 'T-100',
        label: 'Flight to Denver client site',
        description: 'Air travel — economy airfare',
        amount: 820,
        currency: 'USD'
    },
    {
        rowId: 'exp-2',
        account: 'L-100',
        label: 'Marriott — 3 nights',
        description: 'Hotel lodging near the client office',
        amount: 540,
        currency: 'USD'
    },
    {
        rowId: 'exp-3',
        account: 'M-100',
        label: 'Team dinner with client',
        description: 'Restaurant meal — business dinner',
        amount: 210,
        currency: 'USD'
    },
    {
        rowId: 'exp-4',
        account: 'T-101',
        label: 'Airport taxi',
        description: 'Ground transport taxi to the airport',
        amount: 65,
        currency: 'USD'
    },
    {
        rowId: 'exp-5',
        account: 'S-100',
        label: 'USB-C docking station',
        description: 'Computer equipment and supplies',
        amount: 180,
        currency: 'USD'
    },
    {
        rowId: 'exp-6',
        account: 'M-101',
        label: 'Client working lunch',
        description: 'Restaurant meal — working lunch',
        amount: 95,
        currency: 'USD'
    },
    {
        rowId: 'exp-7',
        account: 'K-100',
        label: 'Mileage — warehouse visit',
        description: 'Personal vehicle mileage reimbursement',
        amount: 120,
        currency: 'USD'
    },
    {
        rowId: 'exp-8',
        account: 'S-101',
        label: 'Analytics software subscription',
        description: 'Annual software subscription license',
        amount: 350,
        currency: 'USD'
    },
    {
        rowId: 'exp-9',
        account: 'X-100',
        label: 'Client gift — bottle of wine',
        description: 'Client gift — alcohol (non-reimbursable)',
        amount: 60,
        currency: 'USD'
    },
    {
        rowId: 'exp-10',
        account: 'M-102',
        label: 'Coffee with prospect',
        description: 'Restaurant meal — coffee meeting',
        amount: 22,
        currency: 'USD'
    }
];
const CATEGORIES = [
    {
        id: 'travel',
        label: 'Travel'
    },
    {
        id: 'lodging',
        label: 'Lodging'
    },
    {
        id: 'meals',
        label: 'Meals & entertainment'
    },
    {
        id: 'supplies',
        label: 'Supplies & software'
    },
    {
        id: 'mileage',
        label: 'Personal vehicle mileage'
    },
    {
        id: 'nonReimbursable',
        label: 'Non-reimbursable (policy)'
    },
    {
        id: '__skip__',
        label: 'Leave unclassified'
    }
];
const money = (n)=>Number(n.toFixed(2));
const EXPENSE_CONFIG = {
    id: 'expense',
    name: 'Employee Expense Reimbursement',
    agentId: 'mira',
    documentLabel: 'employee expense report',
    resultPage: 'expense',
    steps: [
        {
            label: 'Collect the expense report',
            sub: 'Receipts uploaded as rows'
        },
        {
            label: 'Classify each receipt',
            sub: 'Keyword classifier → policy categories'
        },
        {
            label: 'Apply policy & total',
            sub: 'Per-diem caps + net payable'
        },
        {
            label: 'Review & approve',
            sub: 'Sign off before payroll'
        }
    ],
    buildSnapshot: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createExpenseReimbursementWorkflow"],
    sampleRows: ROWS,
    sourceBlockId: 'expense-source-receipts',
    mapperBlockId: 'expense-logic-classifier',
    rollupBlockId: 'expense-logic-rollup',
    linesBlockId: 'expense-logic-lines',
    summaryBlockId: 'expense-logic-summary',
    linesRules: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$expense$2d$reimbursement$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPENSE_LINES_CALC_RULES"],
    summaryRules: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$expense$2d$reimbursement$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPENSE_SUMMARY_CALC_RULES"],
    // Unmatched receipts don't block — they're flagged for review and left out of
    // the reimbursable total until categorized.
    defaultRouteUnmatched: true,
    bucketKeys: [
        'travel_total',
        'lodging_total',
        'meals_total',
        'supplies_total',
        'mileage_total',
        'nonreimbursable_total',
        'submitted_total'
    ],
    lineKeys: [
        'TRAVEL_REIMBURSABLE',
        'LODGING_REIMBURSABLE',
        'MEALS_REIMBURSABLE',
        'SUPPLIES_REIMBURSABLE',
        'MILEAGE_REIMBURSABLE',
        'MEALS_OVER_CAP'
    ],
    categoryOptions: CATEGORIES,
    headlineKey: 'NET_PAYABLE',
    currency: 'USD',
    // No `block` → these override computeExtra's params (the fapi_inputs source
    // can't emit arbitrary policy keys, so the domain math is done in computeExtra).
    params: {
        mealCap: 250,
        fxRate: 1.35
    },
    editableInputs: [
        {
            key: 'mealCap',
            label: 'Meal per-diem cap',
            default: 250,
            step: 25,
            hint: 'Maximum reimbursable meals total'
        },
        {
            key: 'fxRate',
            label: 'FX rate (USD → CAD)',
            default: 1.35,
            step: 0.01,
            hint: 'Annual average USD→CAD (Bank of Canada)'
        }
    ],
    // The real reimbursement math: driven by the live classification/rollup buckets
    // + the editable policy params. Overrides the calc-engine blocks' output.
    computeExtra: ({ rollup, params })=>{
        const travel = rollup.travel_total ?? 0;
        const lodging = rollup.lodging_total ?? 0;
        const meals = rollup.meals_total ?? 0;
        const supplies = rollup.supplies_total ?? 0;
        const mileage = rollup.mileage_total ?? 0;
        const nonReimb = rollup.nonreimbursable_total ?? 0;
        const submitted = rollup.submitted_total ?? travel + lodging + meals + supplies + mileage + nonReimb;
        const mealCap = params.mealCap ?? 250;
        const fx = params.fxRate ?? 1.35;
        const mealsReimb = Math.min(meals, mealCap);
        const mealsOver = Math.max(meals - mealCap, 0);
        const totalReimb = travel + lodging + mealsReimb + supplies + mileage;
        const disallowed = nonReimb + mealsOver;
        const netPayable = totalReimb;
        const netPayableCad = netPayable * fx;
        const lines = [
            {
                key: 'TRAVEL_REIMBURSABLE',
                label: 'Travel (reimbursable)',
                value: money(travel),
                formula: 'travel_total (100% policy)'
            },
            {
                key: 'LODGING_REIMBURSABLE',
                label: 'Lodging (reimbursable)',
                value: money(lodging),
                formula: 'lodging_total (100% policy)'
            },
            {
                key: 'MEALS_REIMBURSABLE',
                label: 'Meals (capped)',
                value: money(mealsReimb),
                formula: `min(meals_total ${money(meals)}, cap ${money(mealCap)})`
            },
            {
                key: 'SUPPLIES_REIMBURSABLE',
                label: 'Supplies (reimbursable)',
                value: money(supplies),
                formula: 'supplies_total (100% policy)'
            },
            {
                key: 'MILEAGE_REIMBURSABLE',
                label: 'Mileage (reimbursable)',
                value: money(mileage),
                formula: 'mileage_total (corporate rate)'
            },
            {
                key: 'MEALS_OVER_CAP',
                label: 'Meals over cap (disallowed)',
                value: money(mealsOver),
                formula: `max(meals_total − cap, 0)`
            }
        ];
        const summary = [
            {
                key: 'SUBMITTED_TOTAL',
                label: 'Submitted total',
                value: money(submitted),
                formula: 'sum of all receipts'
            },
            {
                key: 'TOTAL_REIMBURSABLE',
                label: 'Total reimbursable',
                value: money(totalReimb),
                formula: 'travel + lodging + meals(capped) + supplies + mileage'
            },
            {
                key: 'POLICY_DISALLOWED',
                label: 'Policy-disallowed',
                value: money(disallowed),
                formula: 'non-reimbursable + meals over cap'
            },
            {
                key: 'NET_PAYABLE',
                label: 'Net payable to employee',
                value: money(netPayable),
                formula: 'total reimbursable'
            },
            {
                key: 'FX_RATE',
                label: 'FX rate (USD → CAD)',
                value: fx,
                formula: 'annual average (Bank of Canada)'
            },
            {
                key: 'NET_PAYABLE_CAD',
                label: 'Net payable (CAD)',
                value: money(netPayableCad),
                formula: `net payable × ${fx}`
            }
        ];
        return {
            lines,
            summary,
            boundsMin: 0,
            boundsMax: 0
        };
    },
    // Per-line provenance: which receipts feed each reimbursable category line.
    worksheetProvenance: ({ lineKey, core })=>{
        const map = {
            TRAVEL_REIMBURSABLE: 'travel',
            LODGING_REIMBURSABLE: 'lodging',
            MEALS_REIMBURSABLE: 'meals',
            SUPPLIES_REIMBURSABLE: 'supplies',
            MILEAGE_REIMBURSABLE: 'mileage'
        };
        const cat = map[lineKey];
        if (!cat) return [];
        return core.detail.mapped.filter((r)=>/* categoryLabel or id contains the category token */ r.category.toLowerCase().includes(cat) || cat === 'meals' && /meal/i.test(r.category) || cat === 'supplies' && /suppl|software/i.test(r.category) || cat === 'mileage' && /mileage|vehicle/i.test(r.category)).map((r)=>({
                label: r.label,
                amount: Number(r.amount.toFixed(2)),
                category: r.category,
                keyword: r.keyword || null,
                confidence: Math.round((r.confidence || 0) * 100)
            }));
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/runtime/workflow-runs/campaign.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CAMPAIGN_CONFIG",
    ()=>CAMPAIGN_CONFIG
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/shared/workflow-engine/local-fiscal-workflow.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$campaign$2d$budget$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/templates/sample-workflows/campaign-budget-template.ts [app-client] (ecmascript)");
'use client';
;
;
// Sample channel spend requests — one row per proposed campaign line. The
// classifier matches on label + description.
const ROWS = [
    {
        rowId: 'ch-1',
        account: 'PS',
        label: 'Google Ads — Q3 search',
        description: 'Paid search PPC campaign — brand + non-brand',
        amount: 120000,
        currency: 'USD'
    },
    {
        rowId: 'ch-2',
        account: 'SO',
        label: 'LinkedIn sponsored posts',
        description: 'Paid social media — B2B lead generation',
        amount: 60000,
        currency: 'USD'
    },
    {
        rowId: 'ch-3',
        account: 'CT',
        label: 'SEO content program',
        description: 'Content marketing blog and editorial SEO',
        amount: 45000,
        currency: 'USD'
    },
    {
        rowId: 'ch-4',
        account: 'EV',
        label: 'SaaStr conference booth',
        description: 'Event sponsorship — trade show booth',
        amount: 80000,
        currency: 'USD'
    },
    {
        rowId: 'ch-5',
        account: 'IN',
        label: 'Creator partnership program',
        description: 'Influencer and creator UGC campaign',
        amount: 35000,
        currency: 'USD'
    },
    {
        rowId: 'ch-6',
        account: 'SO',
        label: 'Instagram + TikTok ads',
        description: 'Paid social media performance ads',
        amount: 40000,
        currency: 'USD'
    },
    {
        rowId: 'ch-7',
        account: 'OT',
        label: 'Marketing tooling & contingency',
        description: 'Other tools and contingency reserve',
        amount: 20000,
        currency: 'USD'
    }
];
const CATEGORIES = [
    {
        id: 'paidSearch',
        label: 'Paid search'
    },
    {
        id: 'socialMedia',
        label: 'Paid social'
    },
    {
        id: 'contentSeo',
        label: 'Content & SEO'
    },
    {
        id: 'events',
        label: 'Events & sponsorship'
    },
    {
        id: 'influencer',
        label: 'Influencer & creator'
    },
    {
        id: 'other',
        label: 'Other / contingency'
    },
    {
        id: '__skip__',
        label: 'Leave unclassified'
    }
];
const money = (n)=>Number(n.toFixed(2));
const CAMPAIGN_CONFIG = {
    id: 'campaign',
    name: 'Marketing Campaign Budget Allocation',
    agentId: 'nova',
    documentLabel: 'channel spend requests',
    // No resultPage → this workflow has NO dedicated worksheet (results live in the
    // run + summoned output card).
    steps: [
        {
            label: 'Collect spend requests',
            sub: 'One row per channel line'
        },
        {
            label: 'Classify by channel',
            sub: 'Keyword classifier → channels'
        },
        {
            label: 'Elect the approved budget',
            sub: 'Floor ↔ ceiling'
        },
        {
            label: 'Review & approve',
            sub: 'Sign off the allocation'
        }
    ],
    buildSnapshot: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createCampaignBudgetWorkflow"],
    sampleRows: ROWS,
    sourceBlockId: 'campaign-source-requests',
    mapperBlockId: 'campaign-logic-classifier',
    rollupBlockId: 'campaign-logic-rollup',
    linesBlockId: 'campaign-logic-election',
    summaryBlockId: 'campaign-logic-summary',
    linesRules: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$campaign$2d$budget$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAMPAIGN_ELECTION_CALC_RULES"],
    summaryRules: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$campaign$2d$budget$2d$template$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAMPAIGN_SUMMARY_CALC_RULES"],
    defaultRouteUnmatched: true,
    bucketKeys: [
        'paidsearch_total',
        'social_total',
        'content_total',
        'events_total',
        'influencer_total',
        'other_total',
        'requested_total'
    ],
    lineKeys: [
        'ALLOC_PAIDSEARCH',
        'ALLOC_SOCIAL',
        'ALLOC_CONTENT',
        'ALLOC_EVENTS',
        'ALLOC_INFLUENCER',
        'ALLOC_OTHER',
        'APPROVED_BUDGET'
    ],
    categoryOptions: CATEGORIES,
    headlineKey: 'PROJECTED_REVENUE',
    currency: 'USD',
    elect: {
        paramBlockId: 'campaign-source-params',
        paramKey: 'montant_elu',
        minKey: 'BORNE_MIN',
        maxKey: 'BORNE_MAX',
        label: 'approved campaign budget',
        ceilingWord: 'budget',
        floorLabel: 'Committed',
        ceilingLabel: 'Full cap',
        floorNote: ' · minimum spend',
        ceilingNote: ' · maximum reach',
        promptSuffix: ' This sets the approved budget and its projected return.'
    },
    params: {
        budget_cap: 300000,
        committed_spend: 150000,
        target_roas: 3.5
    },
    editableInputs: [
        {
            key: 'budget_cap',
            label: 'Total budget cap',
            default: 300000,
            step: 10000,
            hint: 'The maximum the budget owner can approve'
        },
        {
            key: 'committed_spend',
            label: 'Already-committed spend',
            default: 150000,
            step: 10000,
            hint: 'The floor — cannot approve below this'
        },
        {
            key: 'target_roas',
            label: 'Target ROAS',
            default: 3.5,
            step: 0.1,
            hint: 'Projected revenue = approved budget × ROAS'
        }
    ],
    // The election math: bounds from committed floor + budget cap, then allocate the
    // approved amount across channels by requested share and project the return.
    computeExtra: ({ rollup, params, elected })=>{
        const requested = rollup.requested_total ?? 0;
        const cap = params.budget_cap ?? 300000;
        const committed = params.committed_spend ?? 150000;
        const roas = params.target_roas ?? 3.5;
        const ceiling = Math.min(cap, requested);
        const floor = Math.min(committed, ceiling);
        const approved = elected ?? floor;
        const share = (bucket)=>requested > 0 ? bucket / requested * approved : 0;
        const paidSearch = share(rollup.paidsearch_total ?? 0);
        const social = share(rollup.social_total ?? 0);
        const content = share(rollup.content_total ?? 0);
        const events = share(rollup.events_total ?? 0);
        const influencer = share(rollup.influencer_total ?? 0);
        const other = share(rollup.other_total ?? 0);
        const projectedRevenue = approved * roas;
        const unfunded = Math.max(requested - approved, 0);
        const remaining = cap - approved;
        const lines = [
            {
                key: 'ALLOC_PAIDSEARCH',
                label: 'Paid search allocation',
                value: money(paidSearch),
                formula: 'requested share × approved budget'
            },
            {
                key: 'ALLOC_SOCIAL',
                label: 'Paid social allocation',
                value: money(social),
                formula: 'requested share × approved budget'
            },
            {
                key: 'ALLOC_CONTENT',
                label: 'Content & SEO allocation',
                value: money(content),
                formula: 'requested share × approved budget'
            },
            {
                key: 'ALLOC_EVENTS',
                label: 'Events allocation',
                value: money(events),
                formula: 'requested share × approved budget'
            },
            {
                key: 'ALLOC_INFLUENCER',
                label: 'Influencer allocation',
                value: money(influencer),
                formula: 'requested share × approved budget'
            },
            {
                key: 'ALLOC_OTHER',
                label: 'Other allocation',
                value: money(other),
                formula: 'requested share × approved budget'
            },
            {
                key: 'APPROVED_BUDGET',
                label: 'Approved budget',
                value: money(approved),
                formula: 'elected between floor and ceiling'
            }
        ];
        const summary = [
            {
                key: 'REQUESTED_TOTAL',
                label: 'Total requested',
                value: money(requested),
                formula: 'sum of every channel ask'
            },
            {
                key: 'APPROVED_BUDGET',
                label: 'Approved budget',
                value: money(approved),
                formula: 'elected amount'
            },
            {
                key: 'PROJECTED_REVENUE',
                label: 'Projected revenue',
                value: money(projectedRevenue),
                formula: `approved budget × ROAS ${roas}`
            },
            {
                key: 'UNFUNDED_REQUESTS',
                label: 'Unfunded requests',
                value: money(unfunded),
                formula: 'max(requested − approved, 0)'
            },
            {
                key: 'BUDGET_REMAINING',
                label: 'Budget remaining',
                value: money(remaining),
                formula: 'budget cap − approved budget'
            }
        ];
        return {
            lines,
            summary,
            boundsMin: floor,
            boundsMax: ceiling
        };
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/runtime/workflow-runs/blueprint-runs.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BLUEPRINT_RUN_CONFIGS",
    ()=>BLUEPRINT_RUN_CONFIGS
]);
// ─────────────────────────────────────────────────────────────────────────────
// Representative run configs for the calculation-type portfolio blueprints.
//
// The 15 portfolio workflows are STRUCTURAL blueprints. The calculation ones
// (T1134, surplus, T106, EIFEL, T2, provision, Part XIII) get a runnable
// TemplateConfig here so the full Run → Results flow works end-to-end — using the
// SAME generic deterministic engine the FAPI/expense demos use: real classify →
// rollup of the uploaded/sample rows, then a `computeExtra` that nets income vs
// expense. The FIGURES ARE REPRESENTATIVE (a demo income/expense pipeline), NOT
// authoritative tax computation — a real per-workflow engine (real T1134/EIFEL/…
// math) is a separate, domain-specific build. The Build tab still shows each
// workflow's full structural graph. Foundation/Platform blueprints (ownership
// graph, ledgers, portfolio ops, the platform services) are not calculations, so
// they stay structural (no run config).
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/shared/workflow-engine/local-fiscal-workflow.ts [app-client] (ecmascript) <locals>");
'use client';
;
const money = (n)=>Number(n.toFixed(2));
const CATEGORIES = [
    {
        id: 'income',
        label: 'Income'
    },
    {
        id: 'expense',
        label: 'Expense'
    },
    {
        id: '__skip__',
        label: 'Leave unclassified'
    }
];
const KEYWORD_RULES = [
    {
        ruleId: 'r-income',
        categoryId: 'income',
        categoryLabel: 'Income',
        keywords: [
            'income',
            'revenue',
            'interest income',
            'dividend',
            'gain',
            'earnings',
            'management fee',
            'royalty',
            'rent',
            'proceeds'
        ],
        confidence: 0.9
    },
    {
        ruleId: 'r-expense',
        categoryId: 'expense',
        categoryLabel: 'Expense',
        keywords: [
            'expense',
            'cost',
            'loss',
            'deduction',
            'interest expense',
            'charge',
            'salaries',
            'professional fees',
            'depreciation',
            'amortization'
        ],
        confidence: 0.9
    }
];
const ROLLUP_RULES = [
    {
        rollupId: 'income_bucket',
        label: 'Income',
        includeCategoryIds: [
            'income'
        ],
        operation: 'sum'
    },
    {
        rollupId: 'expense_bucket',
        label: 'Expense',
        includeCategoryIds: [
            'expense'
        ],
        operation: 'sum_abs'
    }
];
const STEPS = [
    {
        label: 'Collect source data',
        sub: 'Upload the workbook (or use the sample)'
    },
    {
        label: 'Classify rows',
        sub: 'Keyword classifier → income / expense'
    },
    {
        label: 'Compute (representative)',
        sub: 'Aggregate + net the classified amounts'
    },
    {
        label: 'Review & approve',
        sub: 'Sign off on the figures'
    }
];
function sampleRows(scale, currency) {
    const s = (n)=>Math.round(n * scale);
    return [
        {
            rowId: 'r1',
            label: 'Operating revenue',
            description: 'Business income for the period',
            amount: s(480000),
            currency
        },
        {
            rowId: 'r2',
            label: 'Interest income',
            description: 'Interest earned on balances',
            amount: s(32000),
            currency
        },
        {
            rowId: 'r3',
            label: 'Dividend income',
            description: 'Dividends received',
            amount: s(18000),
            currency
        },
        {
            rowId: 'r4',
            label: 'Salaries expense',
            description: 'Operating cost — salaries',
            amount: s(-210000),
            currency
        },
        {
            rowId: 'r5',
            label: 'Interest expense',
            description: 'Financing cost — interest',
            amount: s(-45000),
            currency
        },
        {
            rowId: 'r6',
            label: 'Professional fees',
            description: 'Advisory and professional fees',
            amount: s(-28000),
            currency
        }
    ];
}
function runDef(id, name) {
    return {
        id: `bp-run-${id}`,
        name,
        description: '',
        group: 'foundation',
        sub: '',
        blocks: [
            {
                catalogId: 'trigger:manual',
                id: 'start',
                label: 'Start',
                description: 'Manual start',
                stage: 0,
                row: 0
            },
            {
                catalogId: 'source:excel-workbook',
                id: 'src',
                label: 'Source data',
                description: 'Uploaded / sample rows',
                stage: 0,
                row: 1,
                config: {
                    rows: [],
                    requireUpload: true,
                    columns: [
                        'rowId',
                        'account',
                        'label',
                        'description',
                        'amount',
                        'currency'
                    ],
                    sourceKind: 'excel_workbook',
                    sourceLocator: 'local-excel://awaiting-upload',
                    sourceStatus: 'draft',
                    toolId: 'source.manual_table',
                    outputs: 'selected_rows'
                }
            },
            {
                catalogId: 'logic:classification-mapping',
                id: 'classify',
                label: 'Classify',
                description: 'Income vs expense',
                stage: 1,
                row: 1,
                config: {
                    keywordRules: KEYWORD_RULES,
                    matchFields: [
                        'label',
                        'description',
                        'account'
                    ],
                    matchMode: 'contains',
                    conflictStrategy: 'highest_confidence',
                    unmatchedStrategy: 'send_to_review',
                    toolId: 'logic.keyword_mapper',
                    inputs: 'data_rows, keyword_rules',
                    outputs: 'mapped_rows, unmatched_rows'
                }
            },
            {
                catalogId: 'logic:category-rollup-aggregator',
                id: 'rollup',
                label: 'Aggregate',
                description: 'Income & expense buckets',
                stage: 2,
                row: 1,
                config: {
                    rollupRules: ROLLUP_RULES,
                    operation: 'sum',
                    toolId: 'logic.category_rollup_aggregator',
                    inputs: 'mapped_rows, rollup_rules',
                    outputs: 'category_totals, rollup_totals, named_values, rollup_summary'
                }
            },
            {
                catalogId: 'logic:calculation-engine',
                id: 'lines',
                label: 'Compute',
                description: 'Representative computation',
                stage: 3,
                row: 1,
                config: {
                    formulas: [],
                    mode: 'auto',
                    toolId: 'logic.calculation_engine',
                    outputs: 'calculated_results'
                }
            },
            {
                catalogId: 'logic:calculation-engine',
                id: 'summary',
                label: 'Summary',
                description: 'Totals',
                stage: 4,
                row: 1,
                config: {
                    formulas: [],
                    mode: 'auto',
                    toolId: 'logic.calculation_engine',
                    outputs: 'calculated_results'
                }
            },
            {
                catalogId: 'output:evidence-pack',
                id: 'out',
                label: 'Result',
                description: 'Manager result',
                stage: 5,
                row: 1,
                config: {
                    toolId: 'output.evidence_pack_preview',
                    outputs: 'preview'
                }
            }
        ],
        edges: [
            {
                from: 'start',
                to: 'src',
                label: 'Start',
                reason: 'Manual start',
                rel: 'initiates'
            },
            {
                from: 'src',
                to: 'classify',
                label: 'Rows',
                reason: 'Classify rows'
            },
            {
                from: 'classify',
                to: 'rollup',
                label: 'Mapped',
                reason: 'Aggregate',
                rel: 'aggregates_into'
            },
            {
                from: 'rollup',
                to: 'lines',
                label: 'Buckets',
                reason: 'Compute'
            },
            {
                from: 'lines',
                to: 'summary',
                label: 'Lines',
                reason: 'Summarize'
            },
            {
                from: 'summary',
                to: 'out',
                label: 'Result',
                reason: 'Output',
                rel: 'included_in_output_preview'
            }
        ]
    };
}
function makeConfig(spec) {
    const P = `bp-run-${spec.id}`;
    const currency = spec.currency ?? 'USD';
    const def = runDef(spec.id, spec.name);
    return {
        id: spec.id,
        name: spec.name,
        documentLabel: spec.documentLabel,
        steps: STEPS,
        buildSnapshot: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createPortfolioWorkflow"])(def),
        sampleRows: sampleRows(spec.scale ?? 1, currency),
        sourceBlockId: `${P}--src`,
        mapperBlockId: `${P}--classify`,
        rollupBlockId: `${P}--rollup`,
        linesBlockId: `${P}--lines`,
        summaryBlockId: `${P}--summary`,
        linesRules: [],
        summaryRules: [],
        defaultRouteUnmatched: true,
        bucketKeys: [
            'income_bucket',
            'expense_bucket'
        ],
        lineKeys: [
            'INCOME',
            'EXPENSE'
        ],
        categoryOptions: CATEGORIES,
        headlineKey: 'NET',
        currency,
        params: {
            fxRate: 1.35
        },
        editableInputs: [
            {
                key: 'fxRate',
                label: 'FX rate (→ CAD)',
                default: 1.35,
                step: 0.01,
                hint: 'Annual average (Bank of Canada)'
            }
        ],
        computeExtra: ({ rollup, params })=>{
            const income = rollup.income_bucket ?? 0;
            const expense = rollup.expense_bucket ?? 0;
            const net = Math.max(income - expense, 0);
            const fx = params.fxRate ?? 1.35;
            const lines = [
                {
                    key: 'INCOME',
                    label: 'Income (classified)',
                    value: money(income),
                    formula: 'sum of income-classified rows'
                },
                {
                    key: 'EXPENSE',
                    label: 'Expense (classified)',
                    value: money(expense),
                    formula: 'sum of expense-classified rows'
                }
            ];
            const summary = [
                {
                    key: 'GROSS',
                    label: 'Gross income',
                    value: money(income),
                    formula: 'income bucket'
                },
                {
                    key: 'DEDUCTIONS',
                    label: 'Deductions',
                    value: money(expense),
                    formula: 'expense bucket'
                },
                {
                    key: 'NET',
                    label: spec.headline,
                    value: money(net),
                    formula: 'max(income − expense, 0)'
                },
                {
                    key: 'FX_RATE',
                    label: 'FX rate',
                    value: fx,
                    formula: 'annual average (Bank of Canada)'
                },
                {
                    key: 'NET_CAD',
                    label: `${spec.headline} (CAD)`,
                    value: money(net * fx),
                    formula: `net × ${fx}`
                }
            ];
            return {
                lines,
                summary,
                boundsMin: 0,
                boundsMax: 0
            };
        }
    };
}
const BLUEPRINT_RUN_CONFIGS = {
    t1134: makeConfig({
        id: 't1134',
        name: 'T1134 Foreign Affiliate Reporting',
        headline: 'Affiliate net income',
        documentLabel: 'affiliate financial data',
        scale: 1.0
    }),
    surplus: makeConfig({
        id: 'surplus',
        name: 'Foreign Affiliate Surplus',
        headline: 'Net surplus movement',
        documentLabel: 'current-year affiliate activity',
        scale: 0.7
    }),
    t106: makeConfig({
        id: 't106',
        name: 'T106 Related-Party Transaction Reporting',
        headline: 'Net reportable amount',
        documentLabel: 'intercompany ledger',
        scale: 0.5
    }),
    eifel: makeConfig({
        id: 'eifel',
        name: 'EIFEL',
        headline: 'Adjusted taxable income',
        documentLabel: 'entity financing data',
        scale: 1.3
    }),
    't2-suite': makeConfig({
        id: 't2-suite',
        name: 'T2 Corporate Income Tax Compliance Suite',
        headline: 'Net income for tax',
        documentLabel: 'trial balance',
        scale: 1.1
    }),
    'tax-provision': makeConfig({
        id: 'tax-provision',
        name: 'Corporate Tax Provision',
        headline: 'Current tax base',
        documentLabel: 'entity financial data',
        scale: 0.9
    }),
    'part-xiii': makeConfig({
        id: 'part-xiii',
        name: 'Part XIII Withholding Tax',
        headline: 'Net payments to non-residents',
        documentLabel: 'payments to non-residents',
        scale: 0.3
    })
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/runtime/workflow-runs/engine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildOverrideRules",
    ()=>buildOverrideRules,
    "initialRunState",
    ()=>initialRunState,
    "resolveBlocker",
    ()=>resolveBlocker,
    "runTemplateCore",
    ()=>runTemplateCore,
    "runTemplateLoop",
    ()=>runTemplateLoop,
    "runToCompletion",
    ()=>runToCompletion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$tool$2d$runner$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/local-tool-runner.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/shared/workflow-engine/local-fiscal-workflow.ts [app-client] (ecmascript) <locals>");
'use client';
;
;
function asNumberRecord(value) {
    if (!value || typeof value !== 'object') return {};
    const out = {};
    for (const [k, v] of Object.entries(value)){
        const n = typeof v === 'number' ? v : Number(v);
        if (Number.isFinite(n)) out[k] = n;
    }
    return out;
}
function buildOverrideRules(config, rows, overrides) {
    const rules = [];
    for (const row of rows){
        const cat = overrides[row.rowId];
        if (cat && cat !== '__skip__') {
            const opt = config.categoryOptions.find((o)=>o.id === cat);
            rules.push({
                rowLabel: row.label,
                categoryId: cat,
                categoryLabel: opt?.label ?? cat
            });
        }
    }
    return rules;
}
function runTemplateCore(config, opts) {
    const snapshot = config.buildSnapshot();
    const inputVals = opts.inputs ?? {};
    const rawRows = config.toRawRow ? opts.rows.map(config.toRawRow) : opts.rows;
    const source = snapshot.blocks.find((b)=>b.id === config.sourceBlockId);
    if (source) source.config = {
        ...source.config,
        rows: rawRows,
        requireUpload: false,
        selectedRowsCount: rawRows.length,
        sourceStatus: 'ready'
    };
    // Replace the template's built-in mapper rules with the config's (Platform-ported) set.
    if (config.mapperRules) {
        const mapper = snapshot.blocks.find((b)=>b.id === config.mapperBlockId);
        if (mapper) mapper.config = {
            ...mapper.config,
            keywordRules: config.mapperRules
        };
    }
    // Editable inputs → inject into their block config (params → computeExtra handled below).
    const paramOverrides = {};
    for (const inp of config.editableInputs ?? []){
        if (!(inp.key in inputVals)) continue;
        // Classification-fed inputs left at their default must NOT be injected — the
        // block config would win over the rollup's classified value and zero the line.
        if (inp.classificationFed && inputVals[inp.key] === inp.default) continue;
        if (inp.block) {
            const b = snapshot.blocks.find((x)=>x.id === inp.block.blockId);
            if (b) b.config = {
                ...b.config,
                [inp.block.configKey]: inputVals[inp.key]
            };
        } else {
            paramOverrides[inp.key] = inputVals[inp.key];
        }
    }
    if (opts.overrides.length) {
        const mapper = snapshot.blocks.find((b)=>b.id === config.mapperBlockId);
        if (mapper) {
            const existing = Array.isArray(mapper.config?.keywordRules) ? mapper.config.keywordRules : [];
            const added = opts.overrides.map((o, i)=>({
                    ruleId: `override-${i}-${o.categoryId}`,
                    categoryId: o.categoryId,
                    categoryLabel: o.categoryLabel,
                    target: o.categoryId,
                    keywords: [
                        o.rowLabel.toLowerCase()
                    ],
                    confidence: 1
                }));
            mapper.config = {
                ...mapper.config,
                keywordRules: [
                    ...added,
                    ...existing
                ]
            };
        }
    }
    if (opts.elected != null && config.elect) {
        const paramBlock = snapshot.blocks.find((b)=>b.id === config.elect.paramBlockId);
        if (paramBlock) paramBlock.config = {
            ...paramBlock.config,
            [config.elect.paramKey]: opts.elected
        };
    }
    const canvas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["workflowDefinitionToCanvas"])(snapshot);
    const run = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$tool$2d$runner$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runLocalWorkflowTools"])({
        edges: canvas.edges,
        nodes: canvas.nodes,
        workflowName: snapshot.name
    });
    const results = run.result.results;
    const outputOf = (id)=>results.find((r)=>r.blockId === id)?.output ?? {};
    const summaryValues = asNumberRecord(outputOf(config.summaryBlockId).calculatedResults);
    const lineValues = asNumberRecord(outputOf(config.linesBlockId).calculatedResults);
    const mapperOut = outputOf(config.mapperBlockId);
    const rawMapped = mapperOut.mappedRows ?? [];
    const mapped = rawMapped.map((r)=>({
            rowId: String(r.rowId ?? ''),
            label: String(r.label ?? r.rowId ?? 'row'),
            amount: Number(r.amount ?? 0),
            category: String(r.categoryLabel ?? r.categoryId ?? '—'),
            keyword: String(r.matchedKeyword ?? ''),
            confidence: Number(r.confidence ?? 0)
        }));
    const rawUnmatched = mapperOut.unmatchedRows ?? [];
    const unmatched = rawUnmatched.map((r)=>({
            rowId: String(r.rowId ?? ''),
            label: String(r.label ?? r.description ?? r.rowId ?? 'row'),
            amount: Number(r.amount ?? 0)
        }));
    const named = asNumberRecord(outputOf(config.rollupBlockId).namedValues);
    const buckets = config.bucketKeys.filter((k)=>k in named).map((k)=>({
            key: k,
            value: named[k]
        }));
    const derive = (rules, calc)=>rules.filter((r)=>r.resultKey in calc).map((r)=>({
                key: r.resultKey,
                label: r.label,
                value: calc[r.resultKey],
                formula: r.description
            }));
    let lines = derive(config.linesRules, lineValues).filter((d)=>config.lineKeys.includes(d.key));
    let summary = derive(config.summaryRules, summaryValues);
    let bounds;
    if (config.computeExtra) {
        // Real classification + rollup from the engine; deterministic domain math here.
        const ex = config.computeExtra({
            rollup: named,
            params: {
                ...config.params ?? {},
                ...paramOverrides
            },
            elected: opts.elected ?? null
        });
        lines = ex.lines;
        summary = ex.summary;
        bounds = {
            min: ex.boundsMin,
            max: ex.boundsMax
        };
        for (const s of ex.summary)summaryValues[s.key] = s.value;
        for (const l of ex.lines)lineValues[l.key] = l.value;
    } else if (config.elect) {
        bounds = {
            min: lineValues[config.elect.minKey] ?? 0,
            max: lineValues[config.elect.maxKey] ?? 0
        };
    }
    const detail = {
        sourceRows: opts.rows,
        mapped,
        unmatched,
        buckets,
        lines,
        summary
    };
    const status = run.result.status === 'error' ? 'error' : run.result.status === 'warning' ? 'warning' : 'success';
    return {
        status,
        summaryValues,
        lineValues,
        detail,
        unmatched,
        bounds,
        blockCount: results.length,
        runId: run.result.runId
    };
}
const initialRunState = ()=>({
        uploaded: false,
        overrides: {},
        elected: null,
        approved: false,
        inputs: {}
    });
const ELECT_CHOICE = '__elect__';
function runTemplateLoop(config, state) {
    if (!state.uploaded) {
        return {
            detail: null,
            done: false,
            activeStage: 0,
            blocker: {
                kind: 'upload',
                message: 'This workflow needs its source document before it can classify anything. Upload the workbook (or use the sample) to continue.'
            }
        };
    }
    // Real uploaded rows (shared with the builder) when present; else the sample.
    const rows = state.rows && state.rows.length > 0 ? state.rows : config.sampleRows;
    const overrideRules = buildOverrideRules(config, rows, state.overrides);
    const core = runTemplateCore(config, {
        rows,
        overrides: overrideRules,
        elected: state.elected ?? undefined,
        inputs: state.inputs
    });
    // Rows the mapper couldn't classify (and the user hasn't decided on).
    const unresolved = core.unmatched.filter((u)=>!(u.rowId in state.overrides));
    // Legacy behaviour: each unmatched row is a blocking per-row checkpoint.
    if (unresolved.length && !config.defaultRouteUnmatched) {
        const pending = unresolved[0];
        return {
            detail: core.detail,
            done: false,
            activeStage: 1,
            blocker: {
                kind: 'choice',
                choiceId: pending.rowId,
                message: `“${pending.label}” didn’t match any classification rule. Where does it belong?`,
                options: config.categoryOptions
            }
        };
    }
    // Option 1: default-route — unmatched rows are left OUT of the calc (they're
    // never added to overrideRules) and surfaced as a non-blocking banner. The run
    // proceeds to compute + approval; categorizing them later is optional.
    const needsReview = config.defaultRouteUnmatched && unresolved.length ? {
        count: unresolved.length,
        rows: unresolved.map((u)=>({
                rowId: u.rowId,
                label: u.label,
                amount: u.amount
            }))
    } : undefined;
    // Optional election (roulement, campaign budget…): choose the elected amount
    // within bounds. The wording is config-driven; defaults reproduce the rollover.
    if (config.elect && state.elected == null) {
        const lo = core.bounds?.min ?? core.lineValues[config.elect.minKey] ?? 0;
        const hi = core.bounds?.max ?? core.lineValues[config.elect.maxKey] ?? 0;
        const mid = Math.round((lo + hi) / 2);
        const e = config.elect;
        const ceilingWord = e.ceilingWord ?? 'JVM';
        const floorLabel = e.floorLabel ?? 'Floor';
        const ceilingLabel = e.ceilingLabel ?? 'JVM';
        const floorNote = e.floorNote ?? ' · defer all gain';
        const ceilingNote = e.ceilingNote ?? ' · realize gain';
        const promptSuffix = e.promptSuffix ?? ' This sets how much gain is deferred.';
        return {
            detail: core.detail,
            done: false,
            activeStage: 3,
            needsReview,
            blocker: {
                kind: 'choice',
                choiceId: ELECT_CHOICE,
                message: `Choose the ${e.label} — anywhere between the floor (${lo.toLocaleString()}) and ${ceilingWord} ceiling (${hi.toLocaleString()}).${promptSuffix}`,
                options: [
                    {
                        id: String(lo),
                        label: `${floorLabel} ${lo.toLocaleString()}${floorNote}`
                    },
                    {
                        id: String(mid),
                        label: `Midpoint ${mid.toLocaleString()}`
                    },
                    {
                        id: String(hi),
                        label: `${ceilingLabel} ${hi.toLocaleString()}${ceilingNote}`
                    }
                ]
            }
        };
    }
    const headlineVal = core.summaryValues[config.headlineKey] ?? core.lineValues[config.headlineKey] ?? 0;
    if (!state.approved) {
        return {
            detail: core.detail,
            done: false,
            activeStage: config.elect ? 3 : 3,
            needsReview,
            blocker: {
                kind: 'approval',
                message: 'All inputs are resolved and computed. Each figure below shows how it was derived. Approve to finalize.',
                figures: core.detail.summary
            },
            headline: {
                label: headlineLabel(config),
                value: headlineVal,
                currency: config.currency
            }
        };
    }
    return {
        detail: core.detail,
        done: true,
        activeStage: 4,
        needsReview,
        headline: {
            label: headlineLabel(config),
            value: headlineVal,
            currency: config.currency
        },
        summaryText: `${config.id.toUpperCase()} complete. ${headlineLabel(config)} = ${headlineVal.toLocaleString()} ${config.currency}.`
    };
}
function headlineLabel(config) {
    return config.summaryRules.find((r)=>r.resultKey === config.headlineKey)?.label ?? config.headlineKey;
}
function runToCompletion(config) {
    let state = initialRunState();
    for(let guard = 0; guard < 30; guard++){
        const o = runTemplateLoop(config, state);
        if (o.done || !o.blocker) return o;
        if (o.blocker.kind === 'upload') state = {
            ...state,
            uploaded: true
        };
        else if (o.blocker.kind === 'approval') state = {
            ...state,
            approved: true
        };
        else if (o.blocker.choiceId === '__elect__') state = {
            ...state,
            elected: Number(o.blocker.options[0]?.id ?? 0)
        };
        else state = {
            ...state,
            overrides: {
                ...state.overrides,
                [o.blocker.choiceId]: '__skip__'
            }
        };
    }
    return runTemplateLoop(config, state);
}
function resolveBlocker(state, blocker, choiceId) {
    if (blocker.kind === 'upload') return {
        ...state,
        uploaded: true
    };
    if (blocker.kind === 'approval') return {
        ...state,
        approved: true
    };
    // choice
    if (blocker.choiceId === ELECT_CHOICE) return {
        ...state,
        elected: Number(choiceId)
    };
    return {
        ...state,
        overrides: {
            ...state.overrides,
            [blocker.choiceId]: String(choiceId)
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/runtime/workflow-runs/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WORKFLOW_CONFIGS",
    ()=>WORKFLOW_CONFIGS,
    "getWorkflowConfig",
    ()=>getWorkflowConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/fapi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$roulement$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/roulement.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$expense$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/expense.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$campaign$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/campaign.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$blueprint$2d$runs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/blueprint-runs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/runtime/workflow-runs/engine.ts [app-client] (ecmascript)");
;
;
;
;
;
const WORKFLOW_CONFIGS = {
    fapi: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$fapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FAPI_CONFIG"],
    roulement: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$roulement$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROULEMENT_CONFIG"],
    expense: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$expense$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXPENSE_CONFIG"],
    campaign: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$campaign$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAMPAIGN_CONFIG"],
    // Representative runnable configs for the calculation-type portfolio blueprints
    // (T1134, surplus, T106, EIFEL, T2, provision, Part XIII). Demo figures — see
    // blueprint-runs.ts. The workflow page resolves these by the pf-stripped id.
    ...__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$runtime$2f$workflow$2d$runs$2f$blueprint$2d$runs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BLUEPRINT_RUN_CONFIGS"]
};
function getWorkflowConfig(id) {
    return WORKFLOW_CONFIGS[id] ?? null;
}
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=shared_workflow-engine_651c13e4._.js.map