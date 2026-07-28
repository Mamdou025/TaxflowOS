(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/shared/workflow-engine/local-tool-registry.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LOCAL_TOOL_REGISTRY",
    ()=>LOCAL_TOOL_REGISTRY,
    "getSampleKeywordRules",
    ()=>getSampleKeywordRules,
    "getSampleManualRows",
    ()=>getSampleManualRows,
    "getSampleSourceDocuments",
    ()=>getSampleSourceDocuments,
    "getToolForBlock",
    ()=>getToolForBlock,
    "getToolIdForBlock",
    ()=>getToolIdForBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/shared/workflow-engine/local-fiscal-workflow.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$protected$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/domain/workflow/protected-rules.ts [app-client] (ecmascript)");
;
;
;
const DEFAULT_TABLE_ROWS = [
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
];
const DEFAULT_KEYWORD_RULES = [
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
];
const NUMBER_PATTERN = /-?\d+(\.\d+)?/;
function makeLog({ blockId, details, level = "info", message }) {
    return {
        at: new Date().toISOString(),
        details,
        id: `tool-log-${blockId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        level,
        message
    };
}
function completeResult({ confidence, context, errors = [], evidenceRefs, logs = [], output, sourceTrace, status, warnings = [] }) {
    return {
        blockId: context.block.id,
        completedAt: new Date().toISOString(),
        confidence,
        errors,
        evidenceRefs: evidenceRefs ?? context.evidenceRefs,
        logs,
        output,
        runId: context.runId,
        sourceTrace: sourceTrace ?? context.sourceTrace,
        startedAt: context.startedAt,
        status,
        toolId: String(context.config.toolId || getToolIdForBlock(context.block)),
        warnings
    };
}
function asRecord(value) {
    return typeof value === "object" && value !== null ? value : null;
}
function asStringArray(value) {
    if (Array.isArray(value)) {
        return value.map(String).map((item)=>item.trim()).filter(Boolean);
    }
    if (typeof value === "string") {
        return value.split(",").map((item)=>item.trim()).filter(Boolean);
    }
    return [];
}
function parseNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    const record = asRecord(value);
    if (record) {
        return parseNumber(record.value) ?? parseNumber(record.amount) ?? parseNumber(record.subtotal) ?? null;
    }
    if (typeof value !== "string") {
        return null;
    }
    const trimmed = value.trim();
    const match = trimmed.match(NUMBER_PATTERN);
    if (!match) {
        return null;
    }
    const parsed = Number(match[0]);
    if (!Number.isFinite(parsed)) {
        return null;
    }
    return trimmed.includes("%") ? parsed / 100 : parsed;
}
function getConfiguredRows(config) {
    const rowSource = config.manualRows || config.tableRows || config.rows || config.sampleRows;
    if (!Array.isArray(rowSource)) {
        return DEFAULT_TABLE_ROWS;
    }
    const rows = rowSource.map((item, index)=>{
        const record = asRecord(item);
        if (!record) {
            return null;
        }
        const amount = parseNumber(record.amount) ?? parseNumber(record.value) ?? parseNumber(record.balance) ?? 0;
        let account;
        if (typeof record.account === "string") {
            account = record.account;
        } else if (typeof record.accountNumber === "string") {
            account = record.accountNumber;
        }
        const row = {
            amount,
            currency: typeof record.currency === "string" ? record.currency : undefined,
            description: typeof record.description === "string" ? record.description : undefined,
            label: String(record.label || record.name || `Source row ${index + 1}`),
            rowId: String(record.rowId || record.id || `source-row-${index + 1}`)
        };
        if (account) {
            row.account = account;
        }
        return row;
    }).filter((item)=>Boolean(item));
    return rows.length > 0 ? rows : DEFAULT_TABLE_ROWS;
}
function getConfiguredScalar({ block, config }) {
    const fromConfig = parseNumber(config.value) ?? parseNumber(config.manualValue) ?? parseNumber(config.scalarValue) ?? parseNumber(config.valuePreview) ?? parseNumber(block.source?.valuePreview);
    if (fromConfig !== null) {
        return fromConfig;
    }
    const label = `${block.label} ${block.runtime.outputKey}`.toLowerCase();
    if (label.includes("fx")) {
        return 1.35;
    }
    if (label.includes("rate") || label.includes("percentage")) {
        return 0.5;
    }
    if (label.includes("year")) {
        return 2025;
    }
    return 1;
}
function sourceEvidenceForRow({ block, row }) {
    return {
        evidenceId: `${block.id}:${row.rowId}`,
        immutable: true,
        label: row.label,
        locator: block.source?.locator || String(block.config.sourceLocator || ""),
        rowId: row.rowId,
        sourceBlockId: block.id,
        sourceLabel: block.label,
        valuePreview: String(row.amount)
    };
}
function sourceTraceForEvidence(evidence) {
    return {
        evidenceRefId: evidence.evidenceId,
        relationshipPath: [
            evidence.sourceBlockId
        ],
        rowId: evidence.rowId,
        sourceBlockId: evidence.sourceBlockId,
        sourceLabel: evidence.sourceLabel,
        valuePreview: evidence.valuePreview
    };
}
function sourceEvidenceForKeywordRule({ block, rule }) {
    return {
        evidenceId: `${block.id}:${rule.ruleId}`,
        immutable: true,
        label: `${rule.categoryLabel} keyword rule`,
        locator: block.source?.locator || String(block.config.sourceLocator || "keyword-rules"),
        rowId: rule.ruleId,
        sourceBlockId: block.id,
        sourceLabel: block.label,
        valuePreview: rule.keywords.join(", ")
    };
}
function getStringField(record, key) {
    return typeof record[key] === "string" ? record[key] : undefined;
}
function getKeywordRuleMatchMode(value) {
    if (value === "exact" || value === "starts_with") {
        return value;
    }
    if (value === "starts with") {
        return "starts_with";
    }
    return "contains";
}
function fiscalRowFromOutputRecord({ record, result }) {
    const row = {
        amount: parseNumber(record.amount) ?? parseNumber(record.value) ?? parseNumber(record.subtotal) ?? 0,
        evidenceRefs: Array.isArray(record.evidenceRefs) ? record.evidenceRefs : result.evidenceRefs,
        label: String(record.label || record.name || record.rowId || "Row"),
        rowId: String(record.rowId || record.id || `${result.blockId}-row`),
        sourceTrace: Array.isArray(record.sourceTrace) ? record.sourceTrace : result.sourceTrace
    };
    row.account = getStringField(record, "account");
    row.categoryId = getStringField(record, "categoryId");
    row.categoryLabel = getStringField(record, "categoryLabel");
    row.confidence = parseNumber(record.confidence) ?? undefined;
    row.currency = getStringField(record, "currency");
    row.description = getStringField(record, "description");
    row.lineId = getStringField(record, "lineId");
    row.matchedKeyword = getStringField(record, "matchedKeyword");
    row.matchedRuleId = getStringField(record, "matchedRuleId");
    row.ruleId = getStringField(record, "ruleId");
    row.ruleTrace = Array.isArray(record.ruleTrace) ? record.ruleTrace : undefined;
    row.ruleSourceTrace = Array.isArray(record.ruleSourceTrace) ? record.ruleSourceTrace : undefined;
    row.sectionId = getStringField(record, "sectionId");
    row.sourceRow = asRecord(record.sourceRow) || undefined;
    row.status = getStringField(record, "status");
    row.subsectionId = getStringField(record, "subsectionId");
    row.suggestedLine = getStringField(record, "suggestedLine");
    row.suggestedSection = getStringField(record, "suggestedSection");
    row.suggestedSubsection = getStringField(record, "suggestedSubsection");
    row.target = getStringField(record, "target");
    return row;
}
function collectRowsFromResult(result) {
    const rows = [];
    const candidates = [
        result.output.rows,
        result.output.mappedRows,
        result.output.transformedRows,
        result.output.includedRows
    ];
    for (const candidate of candidates){
        if (!Array.isArray(candidate)) {
            continue;
        }
        for (const item of candidate){
            const record = asRecord(item);
            if (!record) {
                continue;
            }
            rows.push(fiscalRowFromOutputRecord({
                record,
                result
            }));
        }
    }
    return rows;
}
function collectRows(context) {
    return context.upstreamResults.flatMap(collectRowsFromResult);
}
function collectUnmatchedRows(context) {
    return context.upstreamResults.flatMap((result)=>{
        if (!Array.isArray(result.output.unmatchedRows)) {
            return [];
        }
        return result.output.unmatchedRows.map((item)=>{
            const record = asRecord(item);
            return record ? fiscalRowFromOutputRecord({
                record,
                result
            }) : null;
        }).filter((item)=>Boolean(item));
    });
}
function collectEvidence(context) {
    const byId = new Map();
    for (const evidence of [
        ...context.evidenceRefs,
        ...context.upstreamResults.flatMap((result)=>result.evidenceRefs)
    ]){
        byId.set(evidence.evidenceId, evidence);
    }
    return [
        ...byId.values()
    ];
}
function collectSourceTrace(context) {
    const byKey = new Map();
    for (const trace of [
        ...context.sourceTrace,
        ...context.upstreamResults.flatMap((result)=>result.sourceTrace)
    ]){
        byKey.set(`${trace.sourceBlockId}:${trace.rowId || "value"}:${trace.evidenceRefId || ""}`, trace);
    }
    return [
        ...byKey.values()
    ];
}
function keywordRuleFromConfigRecord(record, index) {
    const exactKeywords = asStringArray(record.exactKeywords);
    const containsKeywords = asStringArray(record.containsKeywords);
    const hasExplicitBuckets = exactKeywords.length + containsKeywords.length > 0;
    const legacyKeywords = asStringArray(record.keywords || record.keyword);
    const keywords = hasExplicitBuckets ? [
        ...exactKeywords,
        ...containsKeywords
    ] : legacyKeywords;
    const categoryId = String(record.categoryId || record.category || record.target || record.subsectionId || "").trim();
    if (keywords.length === 0) {
        return null;
    }
    if (!categoryId) {
        return null;
    }
    return {
        categoryId,
        categoryLabel: String(record.categoryLabel || record.label || categoryId.replaceAll("_", " ")),
        comment: getStringField(record, "comment"),
        containsKeywords,
        confidence: parseNumber(record.confidence) ?? 0.85,
        description: getStringField(record, "description"),
        exactKeywords,
        excludeKeywords: asStringArray(record.excludeKeywords),
        keywords,
        lineId: getStringField(record, "lineId"),
        matchMode: getKeywordRuleMatchMode(record.matchMode),
        ruleId: String(record.ruleId || record.id || `keyword-rule-${String(categoryId || index + 1)}`),
        sectionId: getStringField(record, "sectionId"),
        scope: getStringField(record, "scope"),
        suggestedLine: getStringField(record, "suggestedLine") || getStringField(record, "lineId"),
        suggestedSection: getStringField(record, "suggestedSection") || getStringField(record, "sectionId"),
        suggestedSubsection: getStringField(record, "suggestedSubsection") || getStringField(record, "subsectionId"),
        suggestedUse: getStringField(record, "suggestedUse"),
        subsectionId: getStringField(record, "subsectionId"),
        tags: asStringArray(record.tags),
        target: getStringField(record, "target")
    };
}
function parseKeywordRules(value) {
    if (!Array.isArray(value)) {
        return DEFAULT_KEYWORD_RULES;
    }
    const rules = value.map((item, index)=>{
        const record = asRecord(item);
        return record ? keywordRuleFromConfigRecord(record, index) : null;
    }).filter((item)=>Boolean(item));
    return rules.length > 0 ? rules : DEFAULT_KEYWORD_RULES;
}
function collectKeywordRules(context) {
    const fromUpstream = context.upstreamResults.flatMap((result)=>{
        if (!Array.isArray(result.output.keywordRules)) {
            return [];
        }
        return parseKeywordRules(result.output.keywordRules).map((rule)=>({
                ...rule,
                evidenceRefs: Array.isArray(result.output.keywordRuleEvidence?.[rule.ruleId]) ? result.output.keywordRuleEvidence[rule.ruleId] : result.evidenceRefs.filter((ref)=>ref.rowId === rule.ruleId),
                sourceTrace: Array.isArray(result.output.keywordRuleTrace?.[rule.ruleId]) ? result.output.keywordRuleTrace[rule.ruleId] : result.sourceTrace.filter((trace)=>trace.rowId === rule.ruleId)
            }));
    });
    if (fromUpstream.length > 0) return fromUpstream;
    if (Array.isArray(context.config.keywordRules) && context.config.keywordRules.length > 0) {
        return parseKeywordRules(context.config.keywordRules);
    }
    return [];
}
function findKeywordRuleMatches(row, rules) {
    return rules.filter((rule)=>Boolean(getRuleMatchedKeyword(row, rule)));
}
function getMatchedKeyword(row, rule) {
    return getRuleMatchedKeyword(row, rule) || rule.keywords[0] || "";
}
function getRuleMatchedKeyword(row, rule) {
    const fields = getKeywordSearchFields(row);
    const excluded = (rule.excludeKeywords || []).some((keyword)=>keywordMatchesFields(fields, keyword, "contains"));
    if (excluded) {
        return;
    }
    return getKeywordCandidates(rule).find((candidate)=>keywordMatchesFields(fields, candidate.keyword, candidate.mode))?.keyword;
}
function normalizeKeywordText(value) {
    return value.trim().toLowerCase();
}
function getKeywordSearchFields(row) {
    return [
        row.account,
        row.label,
        row.description
    ].filter((value)=>typeof value === "string").map(normalizeKeywordText);
}
function keywordMatchesFields(fields, keyword, mode = "contains") {
    const normalizedKeyword = normalizeKeywordText(keyword);
    if (mode === "exact") {
        return fields.some((field)=>field === normalizedKeyword);
    }
    if (mode === "starts_with") {
        return fields.some((field)=>field.startsWith(normalizedKeyword));
    }
    return fields.some((field)=>field.includes(normalizedKeyword));
}
function getKeywordCandidates(rule) {
    const exactKeywords = rule.exactKeywords || [];
    const containsKeywords = rule.containsKeywords || [];
    const hasExplicitBuckets = exactKeywords.length + containsKeywords.length > 0;
    if (hasExplicitBuckets) {
        return [
            ...exactKeywords.map((keyword)=>({
                    keyword,
                    mode: "exact"
                })),
            ...containsKeywords.map((keyword)=>({
                    keyword,
                    mode: "contains"
                }))
        ];
    }
    return rule.keywords.map((keyword)=>({
            keyword,
            mode: rule.matchMode || "contains"
        }));
}
function createMappedKeywordRow({ matchedKeyword, row, rule }) {
    const rowTrace = row.sourceTrace || [];
    const ruleTrace = rule.sourceTrace || [];
    const mappedRow = {
        ...row,
        categoryId: rule.categoryId,
        categoryLabel: rule.categoryLabel,
        confidence: rule.confidence,
        matchedKeyword,
        matchedRuleId: rule.ruleId,
        ruleId: rule.ruleId,
        sourceRow: {
            ...row
        },
        status: "mapped",
        target: rule.target || rule.categoryId
    };
    if (rule.lineId) {
        mappedRow.lineId = rule.lineId;
    }
    if (rule.sectionId) {
        mappedRow.sectionId = rule.sectionId;
    }
    if (ruleTrace.length > 0) {
        mappedRow.ruleTrace = ruleTrace;
        mappedRow.ruleSourceTrace = ruleTrace;
    }
    if (rowTrace.length + ruleTrace.length > 0) {
        mappedRow.sourceTrace = [
            ...rowTrace,
            ...ruleTrace
        ];
    }
    if (rule.subsectionId) {
        mappedRow.subsectionId = rule.subsectionId;
    }
    if (rule.suggestedLine) {
        mappedRow.suggestedLine = rule.suggestedLine;
    }
    if (rule.suggestedSection) {
        mappedRow.suggestedSection = rule.suggestedSection;
    }
    if (rule.suggestedSubsection) {
        mappedRow.suggestedSubsection = rule.suggestedSubsection;
    }
    return mappedRow;
}
function createKeywordMapperWarnings({ conflicts, lowConfidenceRows, rules, threshold, unmatchedRows }) {
    return [
        rules.length === 0 ? "Keyword Mapper needs a connected Keyword Rulebook." : "",
        unmatchedRows.length > 0 ? `${unmatchedRows.length} row(s) were not matched by keyword rules.` : "",
        lowConfidenceRows.length > 0 ? `${lowConfidenceRows.length} mapped row(s) are below confidence ${threshold}.` : "",
        conflicts.length > 0 ? `${conflicts.length} row(s) matched more than one keyword rule.` : ""
    ].filter(Boolean);
}
function getKeywordRuleSourceLabels(context) {
    return context.upstreamBlocks.filter((block)=>block.config.sourceKind === "keyword_rules").map((block)=>block.label);
}
function average(values) {
    if (values.length === 0) {
        return;
    }
    return values.reduce((total, value)=>total + value, 0) / values.length;
}
function collectScalarNumericValues({ label, output, result }) {
    return [
        "value",
        "subtotal",
        "total",
        "amount",
        "protectedValue",
        "governedValue"
    ].flatMap((key)=>{
        const value = parseNumber(output[key]);
        return value === null ? [] : [
            {
                key: `${result.blockId}.${key}`,
                label,
                value
            }
        ];
    });
}
function collectFinalTotalNumericValues({ label, output, result }) {
    const finalTotals = asRecord(output.finalTotals);
    if (!finalTotals) {
        return [];
    }
    return Object.entries(finalTotals).flatMap(([resultName, totalValue])=>{
        const value = parseNumber(totalValue);
        return value === null ? [] : [
            {
                key: `${result.blockId}.final_totals.${resultName}`,
                label: `${label} ${resultName}`,
                value
            }
        ];
    });
}
function collectNumericValues(context) {
    const values = [];
    for (const result of context.upstreamResults){
        const block = context.workflow.blocks.find((item)=>item.id === result.blockId);
        const output = result.output;
        const label = block?.label || result.blockId;
        values.push(...collectScalarNumericValues({
            label,
            output,
            result
        }));
        values.push(...collectFinalTotalNumericValues({
            label,
            output,
            result
        }));
    }
    return values;
}
function getExchangeRateCandidate(context) {
    for (const result of context.upstreamResults){
        const output = result.output;
        const exchangeRateInfo = asRecord(output.exchangeRateInfo) || asRecord(output.exchange_rate) || asRecord(asRecord(output.backendOutputs)?.exchange_rate);
        const rate = parseNumber(exchangeRateInfo?.rate) ?? parseNumber(exchangeRateInfo?.exchange_rate) ?? parseNumber(output.exchangeRate) ?? parseNumber(output.value);
        if (rate !== null) {
            return {
                documentCurrency: typeof exchangeRateInfo?.documentCurrency === "string" ? exchangeRateInfo.documentCurrency : undefined,
                exchangeRateInfo,
                rate,
                reportingCurrency: typeof exchangeRateInfo?.reportingCurrency === "string" ? exchangeRateInfo.reportingCurrency : undefined,
                sourceBlockId: result.blockId
            };
        }
    }
}
function getFxRateReviewDraft(context) {
    const candidate = getExchangeRateCandidate(context);
    const useOverride = context.config.useOverride === true || context.config.useOverride === "true";
    const overrideRate = parseNumber(context.config.overrideRate);
    const overrideReason = typeof context.config.overrideReason === "string" ? context.config.overrideReason.trim() : "";
    const reviewedRate = useOverride && overrideRate !== null ? overrideRate : candidate?.rate;
    const approved = context.config.approved !== false;
    return {
        approved,
        candidate,
        overrideRate,
        overrideReason,
        reviewedRate,
        useOverride
    };
}
function getFxRateReviewWarnings({ approved, candidate, overrideRate, overrideReason, reviewedRate, useOverride }) {
    return [
        candidate ? "" : "No source FX rate was available for review.",
        reviewedRate === undefined ? "No reviewed FX rate is available." : "",
        useOverride && overrideRate === null ? "Override is enabled, but no numeric override rate was supplied." : "",
        useOverride && !overrideReason ? "Override reason is required when changing the source FX rate." : "",
        approved ? "" : "FX rate review is not approved."
    ].filter(Boolean);
}
function getFxRateReviewOutput({ context, pass, warnings }) {
    const draft = getFxRateReviewDraft(context);
    const reviewer = context.config.reviewer || context.config.owner || "Reviewer";
    const exchangeRateInfo = {
        ...draft.candidate?.exchangeRateInfo || {},
        exchange_rate: draft.reviewedRate,
        original_rate: draft.candidate?.rate,
        override_applied: Boolean(draft.useOverride && draft.overrideRate !== null),
        override_reason: draft.overrideReason || undefined,
        rate: draft.reviewedRate,
        review_source: context.block.label,
        sourceBlockId: draft.candidate?.sourceBlockId
    };
    const approvalStatus = {
        approved: pass,
        notes: draft.overrideReason,
        overrideApplied: exchangeRateInfo.override_applied,
        reviewer,
        status: pass ? "approved" : "needs_review"
    };
    const validationResult = {
        message: pass ? "FX rate is reviewed and ready for protected use." : warnings[0],
        status: pass ? "pass" : "warning"
    };
    return {
        approvalStatus,
        exchangeRateInfo,
        reviewedRate: draft.reviewedRate,
        validationResult
    };
}
function resolveOperand(operand, values) {
    const literal = parseNumber(operand);
    if (literal !== null) {
        return literal;
    }
    const ref = String(operand || "").toLowerCase();
    const match = values.find((item)=>item.key.toLowerCase() === ref || item.key.toLowerCase().endsWith(`.${ref}`) || item.label.toLowerCase() === ref || item.label.toLowerCase().includes(ref));
    return match?.value;
}
function getFormulaOperation(config) {
    const operation = String(config.operation || "").toLowerCase();
    if ([
        "add",
        "divide",
        "multiply",
        "percentage",
        "subtract"
    ].includes(operation)) {
        return operation;
    }
    const formula = String(config.formula || "");
    if (formula.includes("*")) {
        return "multiply";
    }
    if (formula.includes("/")) {
        return "divide";
    }
    if (formula.includes("-")) {
        return "subtract";
    }
    return "add";
}
function calculateFormula(operation, operands) {
    if (operands.length === 0) {
        return null;
    }
    if (operation === "multiply") {
        return operands.reduce((result, value)=>result * value, 1);
    }
    if (operation === "subtract") {
        return operands.slice(1).reduce((result, value)=>result - value, operands[0]);
    }
    if (operation === "divide") {
        return operands.slice(1).reduce((result, value)=>value === 0 ? result : result / value, operands[0]);
    }
    if (operation === "percentage") {
        const [base, rate = 1] = operands;
        return base * (rate > 1 ? rate / 100 : rate);
    }
    return operands.reduce((result, value)=>result + value, 0);
}
function getFinalTotalForResult(context, resultName) {
    const normalizedResultName = normalizeResultLookupKey(resultName);
    for (const result of context.upstreamResults){
        const calculatedResults = asRecord(result.output.calculatedResults);
        const calculatedResult = parseNumber(calculatedResults?.[resultName]) ?? parseNumber(calculatedResults?.[normalizedResultName]);
        if (calculatedResult !== null) {
            return calculatedResult;
        }
        const finalTotals = asRecord(result.output.finalTotals);
        const finalTotal = asRecord(finalTotals?.[resultName]);
        const value = parseNumber(finalTotal) ?? parseNumber(finalTotals?.[resultName]);
        if (value !== null) {
            return value;
        }
        const officialLineValues = asRecord(result.output.officialLineValues);
        const officialLineValue = parseNumber(officialLineValues?.[resultName]);
        if (officialLineValue !== null) {
            return officialLineValue;
        }
    }
    return null;
}
function getProtectedValue(context, resultName) {
    const configured = parseNumber(context.config.currentValue) ?? parseNumber(context.config.value) ?? parseNumber(context.config.protectedValue);
    if (configured !== null) {
        return configured;
    }
    if (resultName) {
        const finalTotal = getFinalTotalForResult(context, resultName);
        if (finalTotal !== null) {
            return finalTotal;
        }
    }
    const numericValues = collectNumericValues(context);
    return numericValues[0]?.value ?? null;
}
function dedupeStrings(values) {
    return [
        ...new Set(values.filter(Boolean))
    ];
}
function formatSourceTraceRef(trace) {
    const itemId = trace.rowId || trace.evidenceRefId?.split(":").at(-1);
    return itemId ? `${trace.sourceLabel}.${itemId}` : trace.sourceLabel;
}
function getPipelineTrace(context, resultName) {
    if (isDualResultMappingWorkflow(context.workflow.name) && (resultName === "Z" || resultName === "W")) {
        return getDualResultPipelineTrace(context.workflow.name, resultName);
    }
    if (resultName === "Z" || context.workflow.name === "Single Item Pipeline Demo") {
        return [
            "Excel Template Row Source.row-001",
            "Mapping Rules Source.rule-001",
            "Keyword Mapper.mapped_rows",
            "Section Aggregator.subtotal",
            "Confidence Check.validation_result",
            "Approval Gate.approval_status",
            "Protected Result Z.protected_result"
        ];
    }
    return dedupeStrings(collectSourceTrace(context).map(formatSourceTraceRef));
}
function getCurrencyForNamedResult(result, resultName) {
    const finalTotals = asRecord(result.output.finalTotals);
    const finalTotal = asRecord(finalTotals?.[resultName]);
    if (typeof finalTotal?.currency === "string") {
        return finalTotal.currency;
    }
    const finalTotalDetails = asRecord(result.output.finalTotalDetails);
    const finalTotalDetail = asRecord(finalTotalDetails?.[resultName]);
    if (typeof finalTotalDetail?.currency === "string") {
        return finalTotalDetail.currency;
    }
    const officialLineDetails = asRecord(result.output.officialLineDetails);
    const officialLineDetail = asRecord(officialLineDetails?.[resultName]);
    return typeof officialLineDetail?.currency === "string" ? officialLineDetail.currency : null;
}
function getUpstreamCurrency(context, resultName) {
    for (const result of context.upstreamResults){
        if (resultName) {
            const namedCurrency = getCurrencyForNamedResult(result, resultName);
            if (namedCurrency) {
                return namedCurrency;
            }
        }
        const subtotal = asRecord(result.output.subtotal);
        if (typeof subtotal?.currency === "string") {
            return subtotal.currency;
        }
        const rows = collectRowsFromResult(result);
        const rowCurrency = rows.find((row)=>row.currency)?.currency;
        if (rowCurrency) {
            return rowCurrency;
        }
    }
    return typeof context.config.currency === "string" ? context.config.currency : undefined;
}
function findProtectedResult(results) {
    for (const result of results){
        const protectedResult = asRecord(result.output.protectedResult) || asRecord(result.output.protected_result);
        if (protectedResult) {
            return protectedResult;
        }
    }
}
function findValidationResult(results) {
    for (const result of results){
        const validationResult = asRecord(result.output.validationResult) || asRecord(result.output.validation_result);
        if (validationResult) {
            return validationResult;
        }
    }
}
function findApprovalStatus(results) {
    for (const result of results){
        const approvalStatus = asRecord(result.output.approvalStatus) || asRecord(result.output.approval_status);
        if (approvalStatus) {
            return approvalStatus;
        }
    }
}
function getValidationResultRecord(result) {
    return asRecord(result.output.validationResult) || asRecord(result.output.validation_result) || asRecord(result.output.outputReadinessResult) || asRecord(result.output.output_readiness_result) || asRecord(result.output.requiredInputResult) || asRecord(result.output.required_input_result);
}
function getReviewerOverrides(results) {
    const overrides = {};
    for (const result of results){
        const approvalStatus = asRecord(result.output.approvalStatus) || asRecord(result.output.approval_status);
        const reviewOverride = asRecord(result.output.reviewerOverrides) || asRecord(result.output.reviewOverride) || asRecord(approvalStatus?.reviewerOverrides) || asRecord(approvalStatus?.reviewOverride);
        if (reviewOverride) {
            Object.assign(overrides, reviewOverride);
        }
        if (approvalStatus?.overrideUnmatchedRows !== undefined) {
            overrides.overrideUnmatchedRows = approvalStatus.overrideUnmatchedRows;
        }
        if (approvalStatus?.overrideReason) {
            overrides.overrideReason = approvalStatus.overrideReason;
        }
    }
    return overrides;
}
function isTruthy(value) {
    return value === true || value === "true";
}
function hasUnmatchedRowsOverride(overrides) {
    return isTruthy(overrides.overrideUnmatchedRows);
}
function isUnmatchedRowsReview({ block, result }) {
    return result.toolId === "review.unmatched_rows_check" || block?.subtype === "Unmatched Rows Check";
}
function getValidationPass({ result, validationResult }) {
    if (typeof result.output.pass === "boolean") {
        return result.output.pass;
    }
    if (typeof result.output.ready === "boolean") {
        return result.output.ready;
    }
    if (validationResult?.status === "pass") {
        return true;
    }
    if (validationResult?.status === "fail" || validationResult?.status === "error" || result.status === "error" || result.status === "needs_review") {
        return false;
    }
    return result.status !== "warning";
}
function getValidationMessage({ result, validationResult }) {
    if (typeof validationResult?.message === "string") {
        return validationResult.message;
    }
    return result.warnings[0] || result.errors[0] || "Review needs attention.";
}
function summarizeValidationGateResults({ results, workflow }) {
    const reviewerOverrides = getReviewerOverrides(results);
    const validationSummary = results.flatMap((result)=>{
        const block = workflow.blocks.find((item)=>item.id === result.blockId);
        if (block?.family !== "Review / Validation" || Object.hasOwn(result.output, "approved")) {
            return [];
        }
        const validationResult = getValidationResultRecord(result);
        const blocking = result.output.blocking !== false && validationResult?.blocking !== false;
        const overridden = isUnmatchedRowsReview({
            block,
            result
        }) && hasUnmatchedRowsOverride(reviewerOverrides);
        const pass = overridden || getValidationPass({
            result,
            validationResult
        });
        const status = String(validationResult?.status || result.output.reviewStatus || result.output.review_status || result.status);
        const message = overridden && !getValidationPass({
            result,
            validationResult
        }) ? `${getValidationMessage({
            result,
            validationResult
        })} Reviewer override applied.` : getValidationMessage({
            result,
            validationResult
        });
        return [
            {
                blockId: result.blockId,
                blocking,
                label: block.label,
                message,
                overridden,
                pass,
                status
            }
        ];
    });
    const blockingIssues = validationSummary.filter((item)=>item.blocking && !item.pass);
    const nonBlockingWarnings = validationSummary.filter((item)=>!item.blocking && (!item.pass || item.status === "warning"));
    return {
        blockingIssues,
        nonBlockingWarnings,
        reviewerOverrides,
        validationSummary
    };
}
function getProtectedResultsFinality(protectedResults) {
    return protectedResults.map((result)=>({
            blockId: result.blockId,
            final: result.final === true,
            finalityStatus: String(result.finalityStatus || (result.final === true ? "final" : "review_ready")),
            name: result.name,
            runtimeLocked: result.runtimeLocked === true,
            status: result.status,
            value: result.value
        }));
}
function getOutputFinalitySummary({ protectedResults, results, workflow }) {
    const validationGate = summarizeValidationGateResults({
        results,
        workflow
    });
    const protectedResultsFinality = getProtectedResultsFinality(protectedResults);
    const hasExecutionError = results.some((result)=>result.status === "error" || result.status === "skipped");
    const hasNonFinalProtectedResult = protectedResultsFinality.some((result)=>result.runtimeLocked !== true || result.finalityStatus !== "final");
    let finalityStatus = "final";
    if (hasExecutionError) {
        finalityStatus = "failed";
    } else if (protectedResults.length === 0) {
        finalityStatus = "draft";
    } else if (validationGate.blockingIssues.length > 0 || hasNonFinalProtectedResult) {
        finalityStatus = "review_ready";
    }
    return {
        ...validationGate,
        finalityStatus,
        protectedResultsFinality,
        reason: getOutputFinalityReason(finalityStatus)
    };
}
function getOutputFinalityReason(finalityStatus) {
    if (finalityStatus === "final") {
        return "All blocking validations passed and protected results are final.";
    }
    if (finalityStatus === "review_ready") {
        return "This package is review-ready, not final, because unresolved validation findings remain.";
    }
    if (finalityStatus === "failed") {
        return "One or more workflow steps failed.";
    }
    return "The workflow has not produced protected results yet.";
}
function getFinalityLabel(status) {
    if (status === "final") {
        return "Final";
    }
    if (status === "review_ready") {
        return "Review-ready";
    }
    if (status === "failed") {
        return "Failed";
    }
    return "Draft";
}
function buildFinalityPreviewHeader(finality) {
    return [
        `Workflow state: ${getFinalityLabel(finality.finalityStatus)}`,
        `Reason: ${finality.reason}`,
        "",
        "Blocking issues:",
        ...finality.blockingIssues.length > 0 ? finality.blockingIssues.map((issue)=>`- ${issue.label}: ${issue.message}`) : [
            "- None"
        ],
        "",
        "Non-blocking warnings:",
        ...finality.nonBlockingWarnings.length > 0 ? finality.nonBlockingWarnings.map((issue)=>`- ${issue.label}: ${issue.message}`) : [
            "- None"
        ]
    ].join("\n");
}
function withCanonicalFinality(value, finality) {
    return {
        ...asRecord(value) || {},
        blockingIssues: finality.blockingIssues,
        finalityStatus: finality.finalityStatus,
        nonBlockingWarnings: finality.nonBlockingWarnings,
        protectedResultsFinality: finality.protectedResultsFinality,
        reviewerOverrides: finality.reviewerOverrides,
        validationSummary: finality.validationSummary
    };
}
function hasRecordEntries(value) {
    const record = asRecord(value);
    return Boolean(record && Object.keys(record).length > 0);
}
function getBackendOutputRole(result, role) {
    return asRecord(asRecord(result.output.backendOutputs)?.[role]);
}
function getFapiInputsFromResult(result) {
    return asRecord(result.output.fapiInputs) || asRecord(getBackendOutputRole(result, "fapi_inputs")?.fapiInputs) || asRecord(getBackendOutputRole(result, "fapi_inputs"));
}
function hasRowsOutput(result) {
    const backendRows = getBackendOutputRole(result, "rows");
    const selectedRows = getBackendOutputRole(result, "selected_rows");
    return Array.isArray(result.output.rows) && result.output.rows.length > 0 || Array.isArray(result.output.selectedRows) && result.output.selectedRows.length > 0 || (parseNumber(result.output.rowCount) ?? 0) > 0 || (parseNumber(result.output.selectedRowsCount) ?? 0) > 0 || (parseNumber(backendRows?.rowCount) ?? 0) > 0 || (parseNumber(selectedRows?.rowCount) ?? 0) > 0;
}
function hasKeywordRulesOutput(result) {
    return Array.isArray(result.output.keywordRules) && result.output.keywordRules.length > 0 || (parseNumber(result.output.ruleCount) ?? 0) > 0;
}
function hasAggregationRulesOutput(result) {
    return Array.isArray(result.output.aggregationRules) && result.output.aggregationRules.length > 0 || (parseNumber(result.output.ruleCount) ?? 0) > 0;
}
function hasRollupRulesOutput(result) {
    return Array.isArray(result.output.rollupRules) && result.output.rollupRules.length > 0;
}
function hasCalculationRulesOutput(result) {
    return Array.isArray(result.output.calculationRules) && result.output.calculationRules.length > 0;
}
function hasExchangeRateOutput({ exchangeRateInfo, fapiInputs, result }) {
    return parseNumber(fapiInputs?.fxRate) !== null || parseNumber(exchangeRateInfo?.rate) !== null || parseNumber(exchangeRateInfo?.exchange_rate) !== null || parseNumber(result.output.governedValue) !== null;
}
function hasKnownRequiredInput({ exchangeRateInfo, fapiInputs, normalized, result }) {
    if ([
        "datarows",
        "rows",
        "selectedrows",
        "trialbalancerows"
    ].includes(normalized)) {
        return hasRowsOutput(result);
    }
    if ([
        "keywordrules",
        "keywordrulebook"
    ].includes(normalized)) {
        return hasKeywordRulesOutput(result);
    }
    if ([
        "aggregationrules",
        "aggregationrulebook"
    ].includes(normalized)) {
        return hasAggregationRulesOutput(result);
    }
    if ([
        "rolluprules",
        "rolluprulebook"
    ].includes(normalized)) {
        return hasRollupRulesOutput(result);
    }
    if ([
        "calculationrules",
        "calculationrulebook"
    ].includes(normalized)) {
        return hasCalculationRulesOutput(result);
    }
    if (normalized === "expectedresults") {
        return hasRecordEntries(result.output.expectedResults) || hasRecordEntries(fapiInputs?.expectedResults);
    }
    if ([
        "fatpaid",
        "fatpaidusd"
    ].includes(normalized)) {
        return parseNumber(fapiInputs?.fatPaid) !== null;
    }
    if (normalized === "rtf" || normalized === "rtfrate") {
        return parseNumber(fapiInputs?.rtf) !== null;
    }
    if (normalized === "inclusionrate") {
        return parseNumber(fapiInputs?.inclusionRate) !== null;
    }
    if ([
        "fxrate",
        "exchangerate"
    ].includes(normalized)) {
        return hasExchangeRateOutput({
            exchangeRateInfo,
            fapiInputs,
            result
        });
    }
}
function hasRequiredInputKey(context, key) {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    return context.upstreamResults.some((result)=>{
        const fapiInputs = getFapiInputsFromResult(result);
        const exchangeRateInfo = asRecord(result.output.exchangeRateInfo) || getBackendOutputRole(result, "exchange_rate");
        const knownMatch = hasKnownRequiredInput({
            exchangeRateInfo,
            fapiInputs,
            normalized,
            result
        });
        if (typeof knownMatch === "boolean") {
            return knownMatch;
        }
        return parseNumber(fapiInputs?.[key]) !== null || result.output[key] !== undefined;
    });
}
function getUnmatchedRowsReviewConfig(context) {
    const reviewOverride = asRecord(context.config.reviewOverride);
    const overrideUnmatchedRows = context.config.overrideUnmatchedRows === true || reviewOverride?.overrideUnmatchedRows === true;
    const overrideReason = String(context.config.overrideReason || reviewOverride?.overrideReason || "").trim() || undefined;
    return {
        blocking: context.config.blocking !== false,
        overrideReason,
        overrideUnmatchedRows
    };
}
function getUnmatchedRowsWarning({ count, overrideUnmatchedRows }) {
    if (count === 0) {
        return;
    }
    if (overrideUnmatchedRows) {
        return `${count} row(s) remain unmatched but reviewer override was applied.`;
    }
    return `${count} row(s) remain unmatched.`;
}
function getUnmatchedRowsMessage({ hasUnmatchedRows, pass, warning }) {
    if (!pass) {
        return warning;
    }
    if (hasUnmatchedRows) {
        return "Unmatched rows were reviewed and overridden.";
    }
    return "No unmatched rows remain.";
}
function getUnmatchedRowsStatus({ pass, warnings }) {
    if (!pass) {
        return "needs_review";
    }
    if (warnings.length > 0) {
        return "warning";
    }
    return "success";
}
function getProtectedApprovalState(upstreamResults) {
    const approvalResults = upstreamResults.filter((result)=>Object.hasOwn(result.output, "approved"));
    const approvalPresent = approvalResults.length > 0;
    const approved = approvalPresent && approvalResults.every((result)=>result.output.approved === true);
    const approvedBy = approvalResults.find((result)=>result.output.approved === true)?.output.reviewer;
    return {
        approvalPresent,
        approved,
        approvedBy
    };
}
function getProtectedFinalityStatus({ approvalPresent, approved, blockingIssues, value }) {
    if (value !== null && approved && blockingIssues.length === 0) {
        return "final";
    }
    if (value === null || !approvalPresent) {
        return "draft";
    }
    if (approved) {
        return "review_ready";
    }
    return "failed";
}
function getProtectedFinalityReason(finalityStatus) {
    if (finalityStatus === "final") {
        return "Approved and all blocking validations passed.";
    }
    if (finalityStatus === "review_ready") {
        return "Candidate value exists, but blocking validation findings remain unresolved.";
    }
    if (finalityStatus === "failed") {
        return "Approval is false or failed.";
    }
    return "Candidate value or approval is missing.";
}
function getProtectedWarnings({ approvalPresent, approved, blockingIssues, value }) {
    return [
        value === null ? "No protected result value found." : "",
        approvalPresent ? "" : "Upstream approval is missing.",
        approved || !approvalPresent ? "" : "Upstream approval is not complete.",
        ...blockingIssues.map((issue)=>issue.message)
    ].filter(Boolean);
}
function buildSingleItemPipelineTrace() {
    return [
        "row-001",
        "matched by rule-001",
        "mapped to income_interest",
        "aggregated into subtotal 100",
        "confidence check passed",
        "approved",
        "protected as Z",
        "output generated"
    ];
}
const Z_SOURCE_TRACE = [
    "Excel Template Row Source.row-001",
    "Mapping Rules Source.rule-001",
    "Keyword Mapper.mapped_rows",
    "Section Aggregator.subtotal",
    "Confidence Check.validation_result",
    "Approval Gate.approval_status",
    "Protected Result Z.protected_result"
];
const EXPANDED_MAPPING_PIPELINE_NAME = "Expanded Mapping Pipeline Demo";
const WORKING_SOURCE_RULES_DEMO_NAME = "Working Excel Source + Rulebooks Demo";
const EXPANDED_MAPPING_TRACE_COMMON = [
    "Expanded Excel Rows",
    "Expanded Mapping Rules",
    "Keyword Mapper",
    "Mapping Quality Check",
    "Unmatched Rows Check"
];
const WORKING_SOURCE_RULES_TRACE_COMMON = [
    "Uploaded Workbook",
    "Keyword Rulebook",
    "Keyword Mapper",
    "Aggregation Rulebook",
    "Rollup & Calculation Engine",
    "Mapping Quality Check",
    "Unmatched Rows Check"
];
function isDualResultMappingWorkflow(workflowName) {
    return workflowName === EXPANDED_MAPPING_PIPELINE_NAME || workflowName === WORKING_SOURCE_RULES_DEMO_NAME;
}
function getDualResultTraceCommon(workflowName) {
    return workflowName === WORKING_SOURCE_RULES_DEMO_NAME ? WORKING_SOURCE_RULES_TRACE_COMMON : EXPANDED_MAPPING_TRACE_COMMON;
}
function getDualResultPipelineTrace(workflowName, resultName) {
    const common = getDualResultTraceCommon(workflowName);
    const workingDemo = workflowName === WORKING_SOURCE_RULES_DEMO_NAME;
    let aggregateStep = workingDemo ? "Final total Z" : "Aggregate Z Sections";
    if (resultName === "W") {
        aggregateStep = workingDemo ? "Final total W" : "Aggregate W Sections";
    }
    const approvalStep = resultName === "W" ? "Approval Gate W" : "Approval Gate Z";
    const protectedStep = resultName === "W" ? "Protected Result W" : "Protected Result Z";
    return [
        ...common.slice(0, workingDemo ? 5 : 3),
        aggregateStep,
        ...common.slice(workingDemo ? 5 : 3),
        approvalStep,
        protectedStep
    ];
}
function firstPresent(...values) {
    return values.find((value)=>value !== undefined && value !== null && value !== "");
}
function getZOutputDetails({ approvalStatus, mappedRows, protectedResult, ruleUsed, validationResult }) {
    const mappedRow = asRecord(mappedRows[0]) || {};
    const sourceRow = asRecord(mappedRow.sourceRow) || mappedRow;
    const final = protectedResult.final !== false;
    return {
        account: firstPresent(sourceRow.account, "4000"),
        amount: firstPresent(sourceRow.amount, protectedResult.value, 100),
        approved: firstPresent(approvalStatus?.approved, true),
        confidence: firstPresent(mappedRow.confidence, 0.95),
        currency: firstPresent(protectedResult.currency, sourceRow.currency, "USD"),
        final,
        label: firstPresent(sourceRow.label, "Interest income"),
        matchedKeyword: firstPresent(mappedRow.matchedKeyword, "interest income"),
        reviewer: firstPresent(approvalStatus?.reviewer, protectedResult.approvedBy),
        rowId: firstPresent(sourceRow.rowId, "row-001"),
        ruleId: firstPresent(ruleUsed?.ruleId, mappedRow.ruleId, "rule-001"),
        sectionId: firstPresent(mappedRow.sectionId, ruleUsed?.sectionId, "income"),
        status: firstPresent(protectedResult.status, final ? "locked" : "needs_review"),
        subsectionId: firstPresent(mappedRow.subsectionId, ruleUsed?.subsectionId, "interest"),
        target: firstPresent(mappedRow.target, ruleUsed?.target, "income_interest"),
        threshold: firstPresent(validationResult?.threshold, 0.75),
        validationStatus: firstPresent(validationResult?.status, "pass"),
        value: firstPresent(protectedResult.value, 100)
    };
}
function buildZEvidencePreview({ approvalStatus, mappedRows, protectedResult, ruleUsed, validationResult }) {
    const details = getZOutputDetails({
        approvalStatus,
        mappedRows,
        protectedResult,
        ruleUsed,
        validationResult
    });
    const status = details.final ? "Final / locked" : "Draft / needs review";
    const approvalLine = details.reviewer ? `approved the result (${details.reviewer}).` : "approved the result.";
    return [
        "Z Evidence Preview",
        "",
        "Final result:",
        `Z = ${details.value} ${details.currency}`,
        `Status: ${status}`,
        "",
        "Input item:",
        `${details.rowId} | ${details.account} | ${details.label} | ${details.amount} ${details.currency}`,
        "",
        "Rule used:",
        `${details.ruleId} | ${details.matchedKeyword} -> ${details.target} / ${details.sectionId} / ${details.subsectionId}`,
        "",
        "Transformations:",
        "1. Keyword Mapper classified row-001 as income_interest.",
        "2. Section Aggregator included row-001 in income / interest.",
        "3. Section Aggregator calculated subtotal = 100.",
        `4. Confidence Check passed because confidence ${details.confidence} >= threshold ${details.threshold}.`,
        `5. Approval Gate ${approvalLine}`,
        "6. Protected Result Z locked the final value.",
        "",
        "Trace:",
        Z_SOURCE_TRACE.join("\n-> ")
    ].join("\n");
}
function buildZCanonicalJson({ approvalStatus, context, mappedRows, protectedResult, ruleUsed, validationResult }) {
    const details = getZOutputDetails({
        approvalStatus,
        mappedRows,
        protectedResult,
        ruleUsed,
        validationResult
    });
    const trace = getPipelineTrace(context, "Z");
    return {
        approval: {
            approved: details.approved,
            reviewer: details.reviewer
        },
        finalResult: {
            currency: details.currency,
            final: details.final,
            name: "Z",
            status: details.status,
            value: details.value
        },
        inputItem: {
            amount: details.amount,
            currency: details.currency,
            label: details.label,
            rowId: details.rowId
        },
        ruleUsed: {
            matchedKeyword: details.matchedKeyword,
            ruleId: details.ruleId,
            sectionId: details.sectionId,
            subsectionId: details.subsectionId,
            target: details.target
        },
        trace,
        validation: {
            confidence: details.confidence,
            status: details.validationStatus,
            threshold: details.threshold
        },
        workflowName: context.workflow.name
    };
}
function dedupeRowsById(rows) {
    return [
        ...new Map(rows.map((row)=>[
                row.rowId,
                row
            ])).values()
    ];
}
function collectRowsByOutputKey(results, key) {
    return dedupeRowsById(results.flatMap((result)=>{
        const rows = result.output[key];
        if (!Array.isArray(rows)) {
            return [];
        }
        return rows.map((item)=>{
            const record = asRecord(item);
            return record ? fiscalRowFromOutputRecord({
                record,
                result
            }) : null;
        }).filter((row)=>Boolean(row));
    }));
}
function getProtectedResults(results) {
    return results.map((result)=>{
        const protectedResult = asRecord(result.output.protectedResult) || asRecord(result.output.protected_result);
        if (!protectedResult) {
            return null;
        }
        return {
            ...protectedResult,
            blockId: result.blockId
        };
    }).filter((result)=>Boolean(result));
}
function findProtectedResultByName(results, name) {
    return results.find((result)=>result.name === name);
}
function getSectionRows(rows, sectionId) {
    return rows.filter((row)=>row.sectionId === sectionId);
}
const WORKING_Z_CATEGORY_IDS = new Set([
    "interest_income",
    "rental_income",
    "service_income",
    "other_income"
]);
const WORKING_W_CATEGORY_IDS = new Set([
    "bank_fees",
    "professional_fees",
    "interest_expense"
]);
function getResultRows({ resultName, rows, workflowName }) {
    if (workflowName === WORKING_SOURCE_RULES_DEMO_NAME) {
        const categoryIds = resultName === "Z" ? WORKING_Z_CATEGORY_IDS : WORKING_W_CATEGORY_IDS;
        return rows.filter((row)=>categoryIds.has(row.categoryId || ""));
    }
    return getSectionRows(rows, resultName);
}
function getCurrencyFromRows(rows) {
    return rows.find((row)=>row.currency)?.currency || "USD";
}
function formatAmount(value) {
    const numberValue = parseNumber(value);
    return numberValue === null ? String(value ?? "") : String(numberValue);
}
function formatExpandedRow(row) {
    return `${row.rowId} ${row.label} ${formatAmount(row.amount)} ${row.currency || "USD"}`;
}
function sumRows(rows) {
    return rows.reduce((total, row)=>total + row.amount, 0);
}
function getExpandedWarnings({ lowConfidenceRows, unmatchedRows }) {
    return [
        ...lowConfidenceRows.map((row)=>`${row.rowId} confidence below threshold`),
        ...unmatchedRows.map((row)=>`${row.rowId} unmatched`)
    ];
}
function findMappingSummary(results) {
    return results.map((result)=>asRecord(result.output.mappingSummary)).find(Boolean);
}
function applyCombinedAggregationDetails(details, result) {
    const aggregationSummary = asRecord(result.output.aggregationSummary);
    if (!aggregationSummary) {
        return;
    }
    details.aggregationSummary = aggregationSummary;
    details.aggregationTree = result.output.aggregationTree;
    details.categoryTotalDetails = result.output.categoryTotalDetails;
    details.categoryTotals = result.output.categoryTotals;
    details.finalTotalDetails = result.output.finalTotalDetails;
    details.finalTotals = result.output.finalTotals;
    details.formulaTrace = result.output.formulaTrace;
    details.formulaTraceText = result.output.formulaTraceText;
    details.groupTotals = result.output.groupTotals;
    details.nodeTotalDetails = result.output.nodeTotalDetails;
    details.nodeTotals = result.output.nodeTotals;
    details.officialLineDetails = result.output.officialLineDetails;
    details.officialLineValues = result.output.officialLineValues;
}
function applySplitRollupDetails(details, result) {
    const rollupSummary = asRecord(result.output.rollupSummary);
    if (!(rollupSummary || result.output.rollupTotals)) {
        return;
    }
    details.categoryTotalDetails = result.output.categoryTotalDetails || details.categoryTotalDetails;
    details.categoryTotals = result.output.categoryTotals || details.categoryTotals;
    details.excludedRows = result.output.excludedRows;
    details.includedRowsByCategory = result.output.includedRowsByCategory;
    details.includedRowsByRollup = result.output.includedRowsByRollup;
    details.namedValues = result.output.namedValues || details.namedValues;
    details.rollupFormulaTrace = result.output.rollupFormulaTrace;
    details.rollupSummary = rollupSummary || result.output.rollupSummary;
    details.rollupTotals = result.output.rollupTotals;
    details.rollupTotalDetails = result.output.rollupTotalDetails;
}
function applySplitCalculationDetails(details, result) {
    const calculationSummary = asRecord(result.output.calculationSummary);
    if (!(calculationSummary || result.output.calculatedResults)) {
        return;
    }
    details.calculatedResults = result.output.calculatedResults;
    details.calculationSummary = calculationSummary;
    details.formulaTrace = result.output.formulaTrace || details.formulaTrace;
    details.namedValues = result.output.namedValues || details.namedValues;
    details.resultDetails = result.output.resultDetails;
}
function findAggregationDetails(results) {
    const details = {};
    for (const result of results){
        applyCombinedAggregationDetails(details, result);
        applySplitRollupDetails(details, result);
        applySplitCalculationDetails(details, result);
    }
    return Object.keys(details).length > 0 ? details : null;
}
function getAggregationRuleCount(results) {
    const details = findAggregationDetails(results);
    const summary = asRecord(details?.aggregationSummary);
    const ruleCount = parseNumber(summary?.ruleCount);
    if (ruleCount !== null) {
        return ruleCount;
    }
    return Array.isArray(details?.aggregationTree) ? details.aggregationTree.length : 0;
}
function buildExpandedMappingSummary({ lowConfidenceRows, mappedRows, results, unmatchedRows }) {
    const summary = findMappingSummary(results);
    const totalRows = parseNumber(summary?.totalRows) ?? mappedRows.length + unmatchedRows.length;
    return {
        lowConfidenceRows: parseNumber(summary?.lowConfidenceCount) ?? lowConfidenceRows.length,
        mappedRows: parseNumber(summary?.mappedCount) ?? mappedRows.length,
        categoryAmountTotals: asRecord(summary?.categoryAmountTotals),
        categoryCounts: asRecord(summary?.categoryCounts),
        totalRows,
        unmatchedRows: parseNumber(summary?.unmatchedCount) ?? unmatchedRows.length
    };
}
function getSourceBlockSummary(context) {
    return context.workflow.blocks.filter((block)=>block.family === "Source").map((block)=>{
        const rows = Array.isArray(block.config.rows) ? block.config.rows : [];
        const rules = Array.isArray(block.config.keywordRules) ? block.config.keywordRules : [];
        const aggregationRules = Array.isArray(block.config.aggregationRules) ? block.config.aggregationRules : [];
        return {
            blockId: block.id,
            columns: block.config.columns,
            fileName: block.config.fileName || block.config.workbookName,
            label: block.label,
            rowCount: rows.length || undefined,
            ruleCount: rules.length || aggregationRules.length || undefined,
            sourceKind: block.config.sourceKind || block.subtype,
            sourceLocator: block.config.sourceLocator,
            sourceVersion: block.config.sourceVersion || block.config.ruleVersion,
            status: block.config.sourceStatus || block.status
        };
    });
}
function getProtectedResultDetails(protectedResult, fallbackName, fallbackValue, fallbackCurrency) {
    const final = protectedResult?.final !== false;
    return {
        currency: firstPresent(protectedResult?.currency, fallbackCurrency),
        final,
        name: firstPresent(protectedResult?.name, fallbackName),
        runtimeLocked: protectedResult?.runtimeLocked === true,
        status: firstPresent(protectedResult?.status, final ? "locked" : "needs_review"),
        value: firstPresent(protectedResult?.value, fallbackValue)
    };
}
function formatPreviewTotals(value) {
    const record = asRecord(value);
    if (!record || Object.keys(record).length === 0) {
        return [
            "- None"
        ];
    }
    return Object.entries(record).map(([key, total])=>`- ${key} = ${String(total)}`);
}
function formatFormulaTracePreview(value) {
    if (Array.isArray(value) && value.length > 0) {
        return value.map((entry)=>`- ${String(entry)}`);
    }
    const record = asRecord(value);
    if (!record || Object.keys(record).length === 0) {
        return [
            "- None"
        ];
    }
    return Object.entries(record).map(([key, trace])=>{
        const traceRecord = asRecord(trace);
        return `- ${key}: ${String(traceRecord?.expression || trace)}`;
    });
}
function buildExpandedEvidencePreview({ aggregationRuleCount, keywordRuleCount, mappedRows, protectedResults, results, sourceRows, sourceWarnings, workflowName }) {
    const zRows = getResultRows({
        resultName: "Z",
        rows: mappedRows,
        workflowName
    });
    const wRows = getResultRows({
        resultName: "W",
        rows: mappedRows,
        workflowName
    });
    const zResult = getProtectedResultDetails(findProtectedResultByName(protectedResults, "Z"), "Z", sumRows(zRows), getCurrencyFromRows(zRows));
    const wResult = getProtectedResultDetails(findProtectedResultByName(protectedResults, "W"), "W", sumRows(wRows), getCurrencyFromRows(wRows));
    const trace = [
        ...getDualResultPipelineTrace(workflowName, "Z"),
        ...getDualResultPipelineTrace(workflowName, "W").filter((step)=>!getDualResultPipelineTrace(workflowName, "Z").includes(step))
    ];
    const title = workflowName === WORKING_SOURCE_RULES_DEMO_NAME ? "Working Demo Evidence Preview" : "Z/W Evidence Preview";
    const aggregationDetails = findAggregationDetails(results);
    return [
        title,
        "",
        "Final protected results:",
        `- Z = ${zResult.value} ${zResult.currency}`,
        `- W = ${wResult.value} ${wResult.currency}`,
        "",
        "Source rows:",
        ...sourceRows.map((row)=>`- ${formatExpandedRow(row)}`),
        "",
        "Rule Sources:",
        `- Keyword rules used: ${keywordRuleCount}`,
        `- Aggregation rules used: ${aggregationRuleCount}`,
        "",
        "Z included rows:",
        ...zRows.map((row)=>`- ${formatExpandedRow(row)}`),
        "",
        "W included rows:",
        ...wRows.map((row)=>`- ${formatExpandedRow(row)}`),
        "",
        "Rollup & calculation results:",
        "Category totals:",
        ...formatPreviewTotals(aggregationDetails?.categoryTotals),
        "Rollup / formula node totals:",
        ...formatPreviewTotals(aggregationDetails?.nodeTotals),
        "Formula totals:",
        ...formatPreviewTotals(aggregationDetails?.finalTotals),
        "Official line values:",
        ...formatPreviewTotals(aggregationDetails?.officialLineValues),
        "",
        "Formula trace:",
        ...formatFormulaTracePreview(aggregationDetails?.formulaTraceText || aggregationDetails?.formulaTrace),
        "",
        "Warnings:",
        ...sourceWarnings.length > 0 ? sourceWarnings.map((warning)=>`- ${warning}`) : [
            "- None"
        ],
        "",
        "Trace:",
        ...trace.map((step)=>`- ${step}`)
    ].join("\n");
}
function buildExpandedCanonicalJson({ context, keywordRulesUsed, lowConfidenceRows, mappedRows, protectedResults, results, unmatchedRows }) {
    const zRows = getResultRows({
        resultName: "Z",
        rows: mappedRows,
        workflowName: context.workflow.name
    });
    const wRows = getResultRows({
        resultName: "W",
        rows: mappedRows,
        workflowName: context.workflow.name
    });
    const zResult = getProtectedResultDetails(findProtectedResultByName(protectedResults, "Z"), "Z", sumRows(zRows), getCurrencyFromRows(zRows));
    const wResult = getProtectedResultDetails(findProtectedResultByName(protectedResults, "W"), "W", sumRows(wRows), getCurrencyFromRows(wRows));
    const zTrace = getDualResultPipelineTrace(context.workflow.name, "Z");
    const aggregationDetails = findAggregationDetails(results);
    return {
        finalResults: {
            W: {
                currency: wResult.currency,
                final: wResult.final,
                status: wResult.status,
                value: wResult.value
            },
            Z: {
                currency: zResult.currency,
                final: zResult.final,
                status: zResult.status,
                value: zResult.value
            }
        },
        protected_results: protectedResults,
        mappingSummary: buildExpandedMappingSummary({
            lowConfidenceRows,
            mappedRows,
            results,
            unmatchedRows
        }),
        ruleSources: {
            aggregationRuleCount: getAggregationRuleCount(results),
            keywordRuleCount: keywordRulesUsed.length
        },
        aggregation: aggregationDetails,
        aggregation_summary: aggregationDetails?.aggregationSummary,
        category_totals: aggregationDetails?.categoryTotals,
        final_totals: aggregationDetails?.finalTotals,
        formula_trace: aggregationDetails?.formulaTraceText || aggregationDetails?.formulaTrace,
        group_totals: aggregationDetails?.groupTotals,
        node_totals: aggregationDetails?.nodeTotals,
        official_line_values: aggregationDetails?.officialLineValues,
        sourceMetadata: getSourceBlockSummary(context),
        trace: [
            ...zTrace,
            ...getDualResultPipelineTrace(context.workflow.name, "W").filter((step)=>!zTrace.includes(step))
        ],
        warnings: getExpandedWarnings({
            lowConfidenceRows,
            unmatchedRows
        }),
        workflowName: context.workflow.name
    };
}
function buildGenericEvidencePreview({ mappedRows, protectedResults, results, sourceRows, warnings, workflowName }) {
    const aggregationDetails = findAggregationDetails(results);
    const protectedLines = protectedResults.length > 0 ? protectedResults.map((result)=>{
        const name = String(result.name || "Result");
        const value = result.value ?? "-";
        const currency = result.currency ? ` ${String(result.currency)}` : "";
        const status = String(result.status || (result.final === false ? "needs_review" : "final"));
        return `- ${name} = ${String(value)}${currency} (${status})`;
    }) : [
        "- None"
    ];
    return [
        `${workflowName} Evidence Preview`,
        "",
        "Source rows:",
        ...sourceRows.length > 0 ? sourceRows.map((row)=>`- ${formatExpandedRow(row)}`) : [
            "- None"
        ],
        "",
        "Mapped categories:",
        ...mappedRows.length > 0 ? mappedRows.map((row)=>`- ${formatExpandedRow(row)}`) : [
            "- None"
        ],
        "",
        "Rollup & calculation results:",
        "Category totals:",
        ...formatPreviewTotals(aggregationDetails?.categoryTotals),
        "Rollup totals:",
        ...formatPreviewTotals(aggregationDetails?.rollupTotals || aggregationDetails?.groupTotals),
        "Rollup / formula node totals:",
        ...formatPreviewTotals(aggregationDetails?.nodeTotals),
        "Formula totals:",
        ...formatPreviewTotals(aggregationDetails?.calculatedResults || aggregationDetails?.finalTotals),
        "Official line values:",
        ...formatPreviewTotals(aggregationDetails?.officialLineValues),
        "",
        "Formula trace:",
        ...formatFormulaTracePreview(aggregationDetails?.formulaTraceText || aggregationDetails?.formulaTrace),
        "Rollup trace:",
        ...formatFormulaTracePreview(aggregationDetails?.rollupFormulaTrace),
        "",
        "Protected results:",
        ...protectedLines,
        "",
        "Warnings:",
        ...warnings.length > 0 ? warnings.map((warning)=>`- ${warning}`) : [
            "- None"
        ]
    ].join("\n");
}
function buildGenericCanonicalJson({ context, lowConfidenceRows, mappedRows, protectedResults, results, unmatchedRows }) {
    const aggregationDetails = findAggregationDetails(results);
    return {
        aggregation: aggregationDetails,
        aggregation_summary: aggregationDetails?.aggregationSummary,
        calculated_results: aggregationDetails?.calculatedResults,
        calculation_summary: aggregationDetails?.calculationSummary,
        category_totals: aggregationDetails?.categoryTotals,
        finalTotals: aggregationDetails?.finalTotals,
        node_totals: aggregationDetails?.nodeTotals,
        group_totals: aggregationDetails?.groupTotals,
        final_totals: aggregationDetails?.finalTotals,
        formulaTrace: aggregationDetails?.formulaTraceText || aggregationDetails?.formulaTrace,
        named_values: aggregationDetails?.namedValues,
        official_line_values: aggregationDetails?.officialLineValues,
        rollup_formula_trace: aggregationDetails?.rollupFormulaTrace,
        rollup_summary: aggregationDetails?.rollupSummary,
        rollup_totals: aggregationDetails?.rollupTotals,
        formula_trace: aggregationDetails?.formulaTraceText || aggregationDetails?.formulaTrace,
        mappingSummary: buildExpandedMappingSummary({
            lowConfidenceRows,
            mappedRows,
            results,
            unmatchedRows
        }),
        protectedResults,
        protected_results: protectedResults,
        sourceMetadata: getSourceBlockSummary(context),
        trace: dedupeStrings(collectSourceTrace(context).map(formatSourceTraceRef)),
        warnings: dedupeStrings([
            ...getExpandedWarnings({
                lowConfidenceRows,
                unmatchedRows
            }),
            ...results.flatMap((result)=>result.warnings)
        ]),
        workflowName: context.workflow.name
    };
}
function getToolInputSchema(fields) {
    return {
        fields
    };
}
function getToolOutputSchema(fields) {
    return {
        fields
    };
}
const DATA_ROWS_INPUT_ROLE = {
    acceptedFamilies: [
        "Logic",
        "Source"
    ],
    acceptedOutputTypes: [
        "rows",
        "mapped_rows",
        "parsed_table"
    ],
    acceptedSourceKinds: [
        "excel_template_mock",
        "manual_table",
        "parsed_table",
        "uploaded_rows_mock"
    ],
    allowMultiple: true,
    description: "Tabular fiscal rows from a Source or upstream Logic tool.",
    id: "data_rows",
    label: "Data rows",
    required: true
};
const KEYWORD_RULES_INPUT_ROLE = {
    acceptedFamilies: [
        "Source"
    ],
    acceptedSourceKinds: [
        "keyword_rules"
    ],
    allowMultiple: true,
    description: "Keyword-to-category rules from a Keyword Rulebook.",
    id: "keyword_rules",
    label: "Keyword rules",
    required: true
};
const MAPPED_ROWS_INPUT_ROLE = {
    acceptedFamilies: [
        "Logic"
    ],
    acceptedOutputTypes: [
        "mapped_rows"
    ],
    allowMultiple: true,
    description: "Rows already classified or mapped by upstream Logic.",
    id: "mapped_rows",
    label: "Mapped rows",
    required: true
};
const CHECKED_ITEMS_INPUT_ROLE = {
    acceptedFamilies: [
        "Logic",
        "Review / Validation"
    ],
    acceptedOutputTypes: [
        "aggregation_summary",
        "calculated_results",
        "calculation_summary",
        "conflicts",
        "final_totals",
        "low_confidence_rows",
        "mapped_rows",
        "node_totals",
        "official_line_values",
        "unmatched_rows"
    ],
    allowMultiple: true,
    description: "Rows or findings that should be reviewed.",
    id: "checked_items",
    label: "Checked items",
    required: true
};
const REVIEW_FINDINGS_INPUT_ROLE = {
    acceptedFamilies: [
        "Logic",
        "Review / Validation"
    ],
    acceptedOutputTypes: [
        "aggregation_summary",
        "calculation_summary",
        "review_status"
    ],
    allowMultiple: true,
    description: "Review findings and upstream results considered by the gate.",
    id: "review_findings",
    label: "Review findings",
    required: false
};
const APPROVED_VALUE_INPUT_ROLE = {
    acceptedFamilies: [
        "Logic",
        "Review / Validation"
    ],
    acceptedOutputTypes: [
        "calculated_results",
        "final_totals",
        "subtotal",
        "value",
        "review_status"
    ],
    allowMultiple: true,
    description: "Approved or review-ready upstream value.",
    id: "approved_value",
    label: "Approved value",
    required: true
};
const VALUE_TO_APPROVE_INPUT_ROLE = {
    acceptedFamilies: [
        "Logic",
        "Source",
        "Protected"
    ],
    acceptedOutputTypes: [
        "calculated_results",
        "exchange_rate",
        "final_totals",
        "governed_value",
        "subtotal",
        "value"
    ],
    allowMultiple: false,
    description: "Candidate Logic value that the gate is approving.",
    id: "value_to_approve",
    label: "Value to approve",
    required: true
};
const VALIDATION_RESULT_INPUT_ROLE = {
    acceptedFamilies: [
        "Review / Validation"
    ],
    acceptedOutputTypes: [
        "validation_result",
        "review_status"
    ],
    allowMultiple: true,
    description: "Validation result considered by this review gate.",
    id: "validation_result",
    label: "Validation result",
    required: false
};
const CANDIDATE_VALUE_INPUT_ROLE = {
    acceptedFamilies: [
        "Logic"
    ],
    acceptedOutputTypes: [
        "calculated_results",
        "final_totals",
        "subtotal",
        "value"
    ],
    allowMultiple: false,
    description: "Candidate Logic result that may become protected.",
    id: "candidate_value",
    label: "Candidate value",
    required: true
};
const APPROVAL_STATUS_INPUT_ROLE = {
    acceptedFamilies: [
        "Review / Validation"
    ],
    acceptedOutputTypes: [
        "approval_status",
        "review_status"
    ],
    allowMultiple: false,
    description: "Approval status required before final locking.",
    id: "approval_status",
    label: "Approval status",
    required: false
};
const PROTECTED_VALUES_INPUT_ROLE = {
    acceptedFamilies: [
        "Logic",
        "Protected"
    ],
    acceptedOutputTypes: [
        "calculated_results",
        "final_totals",
        "governed_value",
        "mapped_rows",
        "protected_result"
    ],
    allowMultiple: true,
    description: "Governed values and candidate Logic outputs for preview.",
    id: "protected_values",
    label: "Protected values",
    required: false
};
const PROTECTED_RESULT_INPUT_ROLE = {
    acceptedFamilies: [
        "Protected"
    ],
    acceptedOutputTypes: [
        "protected_result",
        "governed_value"
    ],
    allowMultiple: true,
    description: "Final or draft protected result for output preview.",
    id: "protected_result",
    label: "Protected result",
    required: true
};
const SOURCE_TRACE_INPUT_ROLE = {
    acceptedFamilies: [
        "Logic",
        "Protected",
        "Source"
    ],
    acceptedOutputTypes: [
        "protected_result",
        "source_trace"
    ],
    allowMultiple: true,
    description: "Lineage metadata to include in the output artifact.",
    id: "source_trace",
    label: "Source trace",
    required: false
};
const ROWS_OUTPUT_ROLE = {
    canRouteToFamilies: [
        "Logic"
    ],
    description: "Immutable source rows with evidence references.",
    id: "rows",
    label: "Rows",
    outputKey: "rows",
    outputType: "rows",
    samplePreview: "5 source rows"
};
const KEYWORD_RULES_OUTPUT_ROLE = {
    canRouteToFamilies: [
        "Logic"
    ],
    description: "Keyword rules for downstream mapping tools.",
    id: "keyword_rules",
    label: "Keyword rules",
    outputKey: "keywordRules",
    outputType: "keyword_rules",
    samplePreview: "5 keyword rules"
};
const VALUE_OUTPUT_ROLE = {
    canRouteToFamilies: [
        "Logic",
        "Protected"
    ],
    description: "Immutable scalar source value.",
    id: "value",
    label: "Value",
    outputKey: "value",
    outputType: "value",
    samplePreview: 1
};
const MAPPED_ROWS_OUTPUT_ROLE = {
    canRouteToFamilies: [
        "Logic",
        "Output",
        "Review / Validation"
    ],
    description: "Rows mapped to atomic categories.",
    id: "mapped_rows",
    label: "Mapped rows",
    outputKey: "mappedRows",
    outputType: "mapped_rows",
    samplePreview: "5 mapped rows"
};
const UNMATCHED_ROWS_OUTPUT_ROLE = {
    canRouteToFamilies: [
        "Review / Validation"
    ],
    description: "Rows that did not match any keyword rule.",
    id: "unmatched_rows",
    label: "Unmatched rows",
    outputKey: "unmatchedRows",
    outputType: "unmatched_rows",
    samplePreview: "0 rows"
};
const LOW_CONFIDENCE_ROWS_OUTPUT_ROLE = {
    canRouteToFamilies: [
        "Review / Validation"
    ],
    description: "Rows below the configured confidence threshold.",
    id: "low_confidence_rows",
    label: "Low-confidence rows",
    outputKey: "lowConfidenceRows",
    outputType: "low_confidence_rows",
    samplePreview: "1 row"
};
const CONFLICTS_OUTPUT_ROLE = {
    canRouteToFamilies: [
        "Review / Validation"
    ],
    description: "Rows that matched multiple mapping rules.",
    id: "conflicts",
    label: "Conflicts",
    outputKey: "conflicts",
    outputType: "conflicts",
    samplePreview: "0 conflicts"
};
const SUBTOTAL_OUTPUT_ROLE = {
    canRouteToFamilies: [
        "Protected",
        "Review / Validation"
    ],
    description: "Deterministic aggregation subtotal.",
    id: "subtotal",
    label: "Subtotal",
    outputKey: "subtotal",
    outputType: "subtotal",
    samplePreview: 23_000
};
const INCLUDED_ROWS_OUTPUT_ROLE = {
    canRouteToFamilies: [
        "Output",
        "Review / Validation"
    ],
    description: "Rows included in the aggregation.",
    id: "included_rows",
    label: "Included rows",
    outputKey: "includedRows",
    outputType: "included_rows"
};
const EXCLUDED_ROWS_OUTPUT_ROLE = {
    canRouteToFamilies: [
        "Output",
        "Review / Validation"
    ],
    description: "Rows excluded from the aggregation.",
    id: "excluded_rows",
    label: "Excluded rows",
    outputKey: "excludedRows",
    outputType: "excluded_rows"
};
const REVIEW_STATUS_OUTPUT_ROLE = {
    canRouteToFamilies: [
        "Protected",
        "Output"
    ],
    description: "Pass, warning, or approval status from local review.",
    id: "review_status",
    label: "Review status",
    outputType: "review_status",
    samplePreview: "pass"
};
const VALIDATION_RESULT_OUTPUT_ROLE = {
    canRouteToFamilies: [
        "Review / Validation",
        "Protected",
        "Output"
    ],
    description: "Structured validation result from a review check.",
    id: "validation_result",
    label: "Validation result",
    outputKey: "validationResult",
    outputType: "validation_result",
    samplePreview: "pass"
};
const APPROVAL_STATUS_OUTPUT_ROLE = {
    canRouteToFamilies: [
        "Protected",
        "Output"
    ],
    description: "Explicit approval decision for a candidate value.",
    id: "approval_status",
    label: "Approval status",
    outputKey: "approvalStatus",
    outputType: "approval_status",
    samplePreview: "approved"
};
const REVIEWED_EXCHANGE_RATE_OUTPUT_ROLE = {
    canRouteToFamilies: [
        "Logic",
        "Protected",
        "Output"
    ],
    description: "Reviewed FX rate, including override metadata when used.",
    id: "reviewed_exchange_rate",
    label: "Reviewed exchange rate",
    outputKey: "exchangeRateInfo",
    outputType: "exchange_rate",
    samplePreview: "USD -> CAD 1.35"
};
const GOVERNED_VALUE_OUTPUT_ROLE = {
    canRouteToFamilies: [
        "Output"
    ],
    description: "Governed value with runtime lock metadata when final.",
    id: "governed_value",
    label: "Governed value",
    outputKey: "governedValue",
    outputType: "governed_value",
    samplePreview: 23_000
};
const PROTECTED_RESULT_OUTPUT_ROLE = {
    canRouteToFamilies: [
        "Output"
    ],
    description: "Named protected result with finality and runtime lock state.",
    id: "protected_result",
    label: "Protected result",
    outputKey: "protectedResult",
    outputType: "protected_result",
    samplePreview: "Z = 100 USD"
};
const OUTPUT_PACKAGE_ROLE = {
    canRouteToFamilies: [],
    description: "Local preview package only; no external export.",
    id: "output_package",
    label: "Output package",
    outputType: "output_package",
    samplePreview: "local preview"
};
function createMockParserTool({ displayName, subtype, toolId }) {
    return {
        defaultConfig: {},
        description: "Local parser stub that preserves Source lineage until real parser integration is added.",
        displayName,
        execute: (context)=>{
            const upstreamRows = collectRows(context);
            const rows = upstreamRows.length > 0 ? upstreamRows : DEFAULT_TABLE_ROWS;
            const warning = "Mock parser only in v1. Real parser integration comes later.";
            return completeResult({
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        details: {
                            rowCount: rows.length
                        },
                        level: "warning",
                        message: warning
                    })
                ],
                output: {
                    mockOnly: true,
                    parserNotice: warning,
                    rows: rows.map((row)=>({
                            ...row,
                            parsedBy: toolId,
                            sourceMutation: false
                        })),
                    sourceMutation: false
                },
                sourceTrace: collectSourceTrace(context),
                status: "warning",
                warnings: [
                    warning
                ]
            });
        },
        family: "Logic",
        inputRoles: [
            {
                acceptedFamilies: [
                    "Source"
                ],
                allowMultiple: true,
                description: "Immutable document, workbook, or API response Source.",
                id: "source_evidence",
                label: "Source evidence",
                required: true
            }
        ],
        inputSchema: getToolInputSchema([
            {
                key: "sourceEvidence",
                type: "object"
            }
        ]),
        outputRoles: [
            {
                ...ROWS_OUTPUT_ROLE,
                description: "Mock parser output rows that preserve lineage to the Source.",
                outputType: "parsed_table"
            }
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "rows",
                type: "array"
            },
            {
                key: "parserNotice",
                type: "string"
            }
        ]),
        runMode: "local_mock",
        subtype,
        toolGroup: "data_extraction",
        toolId
    };
}
function collectNumberRecord(target, value) {
    const record = asRecord(value);
    if (!record) {
        return;
    }
    for (const [key, item] of Object.entries(record)){
        const numericValue = parseNumber(item);
        if (numericValue !== null) {
            target[key] = numericValue;
        }
    }
}
function normalizeResultLookupKey(resultName) {
    return resultName.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function getNumberRecordValueByResultName(record, resultName) {
    return record[resultName] ?? record[normalizeResultLookupKey(resultName)];
}
function collectExpectedResultValues(context) {
    const expectedResults = {};
    collectNumberRecord(expectedResults, context.config.expectedResults);
    for (const result of context.upstreamResults){
        collectNumberRecord(expectedResults, result.output.expectedResults);
        collectNumberRecord(expectedResults, asRecord(result.output.aggregationSummary)?.expectedResults);
        collectNumberRecord(expectedResults, asRecord(result.output.fapiInputs)?.expectedResults);
    }
    return expectedResults;
}
function collectActualResultValues(context) {
    const actualResults = {};
    for (const result of context.upstreamResults){
        collectNumberRecord(actualResults, result.output.calculatedResults);
        collectNumberRecord(actualResults, result.output.categoryTotals);
        collectNumberRecord(actualResults, result.output.nodeTotals);
        collectNumberRecord(actualResults, result.output.officialLineValues);
        collectNumberRecord(actualResults, result.output.finalTotals);
        const protectedResult = asRecord(result.output.protectedResult);
        const protectedName = String(protectedResult?.resultName || protectedResult?.name || "");
        const protectedValue = parseNumber(protectedResult?.value);
        if (protectedName && protectedValue !== null) {
            actualResults[protectedName] = protectedValue;
        }
    }
    return actualResults;
}
const localTools = [
    {
        defaultConfig: {
            rows: DEFAULT_TABLE_ROWS
        },
        description: "Reads immutable tabular source evidence from local config.",
        displayName: "Manual Table Source",
        execute: (context)=>{
            const rows = getConfiguredRows(context.config);
            const evidenceRefs = rows.map((row)=>sourceEvidenceForRow({
                    block: context.block,
                    row
                }));
            const sourceTrace = evidenceRefs.map(sourceTraceForEvidence);
            return completeResult({
                context,
                evidenceRefs,
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        details: {
                            rowCount: rows.length
                        },
                        message: "Immutable source table read from local config."
                    })
                ],
                output: {
                    immutable: true,
                    readOnlyEvidence: true,
                    rowCount: rows.length,
                    rows: rows.map((row)=>({
                            ...row,
                            evidenceRefs: evidenceRefs.filter((evidence)=>evidence.rowId === row.rowId),
                            sourceTrace: sourceTrace.filter((trace)=>trace.rowId === row.rowId)
                        })),
                    sourceSubtype: context.block.subtype
                },
                sourceTrace,
                status: "success"
            });
        },
        family: "Source",
        inputRoles: [],
        inputSchema: getToolInputSchema([]),
        outputRoles: [
            ROWS_OUTPUT_ROLE
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "rows",
                required: true,
                type: "array"
            },
            {
                key: "immutable",
                required: true,
                type: "boolean"
            }
        ]),
        runMode: "local_mock",
        subtype: "Excel / Workbook",
        toolGroup: "data_extraction",
        toolId: "source.manual_table"
    },
    {
        defaultConfig: {
            value: 1
        },
        description: "Reads an immutable scalar source value from local config.",
        displayName: "Manual Value Source",
        execute: (context)=>{
            const value = getConfiguredScalar({
                block: context.block,
                config: context.config
            });
            const evidence = {
                evidenceId: `${context.block.id}:value`,
                immutable: true,
                label: context.block.label,
                locator: context.block.source?.locator || String(context.config.sourceLocator || "manual-value"),
                sourceBlockId: context.block.id,
                sourceLabel: context.block.label,
                valuePreview: String(value)
            };
            return completeResult({
                context,
                evidenceRefs: [
                    evidence
                ],
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        message: "Immutable source value read from local config."
                    })
                ],
                output: {
                    immutable: true,
                    label: String(context.config.valueLabel || context.block.label),
                    readOnlyEvidence: true,
                    unit: context.config.unit || context.config.currency || null,
                    value
                },
                sourceTrace: [
                    sourceTraceForEvidence(evidence)
                ],
                status: "success"
            });
        },
        family: "Source",
        inputRoles: [],
        inputSchema: getToolInputSchema([]),
        outputRoles: [
            VALUE_OUTPUT_ROLE
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "value",
                required: true,
                type: "number"
            },
            {
                key: "immutable",
                required: true,
                type: "boolean"
            }
        ]),
        runMode: "local_mock",
        subtype: "Manual Entry",
        toolGroup: "data_extraction",
        toolId: "source.manual_value"
    },
    {
        defaultConfig: {
            keywordRules: DEFAULT_KEYWORD_RULES,
            sourceKind: "keyword_rules"
        },
        description: "Reads keyword mapping rules from a Keyword Rulebook.",
        displayName: "Keyword Rulebook",
        execute: (context)=>{
            const rules = parseKeywordRules(context.config.keywordRules);
            const evidenceRefs = rules.map((rule)=>sourceEvidenceForKeywordRule({
                    block: context.block,
                    rule
                }));
            const sourceTrace = evidenceRefs.map(sourceTraceForEvidence);
            const keywordRuleEvidence = Object.fromEntries(rules.map((rule)=>[
                    rule.ruleId,
                    evidenceRefs.filter((ref)=>ref.rowId === rule.ruleId)
                ]));
            const keywordRuleTrace = Object.fromEntries(rules.map((rule)=>[
                    rule.ruleId,
                    sourceTrace.filter((trace)=>trace.rowId === rule.ruleId)
                ]));
            return completeResult({
                context,
                evidenceRefs,
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        details: {
                            ruleCount: rules.length
                        },
                        message: "Keyword rulebook read from local config."
                    })
                ],
                output: {
                    immutable: true,
                    keywordRuleEvidence,
                    keywordRules: rules.map((rule)=>({
                            ...rule,
                            evidenceRefs: keywordRuleEvidence[rule.ruleId],
                            sourceTrace: keywordRuleTrace[rule.ruleId]
                        })),
                    keywordRuleTrace,
                    readOnlyEvidence: true,
                    sourceKind: "keyword_rules"
                },
                sourceTrace,
                status: "success"
            });
        },
        family: "Source",
        inputRoles: [],
        inputSchema: getToolInputSchema([]),
        outputRoles: [
            KEYWORD_RULES_OUTPUT_ROLE
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "keywordRules",
                required: true,
                type: "array"
            },
            {
                key: "immutable",
                required: true,
                type: "boolean"
            }
        ]),
        runMode: "local_mock",
        subtype: "Keyword Rules",
        toolGroup: "data_extraction",
        toolId: "source.keyword_rules"
    },
    {
        defaultConfig: {
            lowConfidenceThreshold: 0.75
        },
        description: "Maps upstream rows using a connected Keyword Rulebook.",
        displayName: "Keyword Mapper",
        execute: (context)=>{
            const rows = collectRows(context);
            const rules = collectKeywordRules(context);
            const lowConfidenceThreshold = parseNumber(context.config.lowConfidenceThreshold) ?? 0.75;
            const mappedRows = [];
            const unmatchedRows = [];
            const conflicts = [];
            for (const row of rows){
                const matchedRules = findKeywordRuleMatches(row, rules);
                const matchedRule = matchedRules[0];
                if (!matchedRule) {
                    unmatchedRows.push({
                        ...row,
                        categoryId: "unmatched",
                        categoryLabel: "Unmatched",
                        confidence: 0.35,
                        status: "unmatched"
                    });
                    continue;
                }
                if (matchedRules.length > 1) {
                    conflicts.push({
                        label: row.label,
                        matchedRuleIds: matchedRules.map((rule)=>rule.ruleId),
                        rowId: row.rowId
                    });
                }
                mappedRows.push(createMappedKeywordRow({
                    matchedKeyword: getMatchedKeyword(row, matchedRule),
                    row,
                    rule: matchedRule
                }));
            }
            const lowConfidenceRows = mappedRows.filter((row)=>(row.confidence ?? 1) < lowConfidenceThreshold);
            const confidence = average(mappedRows.map((row)=>row.confidence || 0).filter(Boolean)) ?? 0;
            const categoryCounts = mappedRows.reduce((counts, row)=>{
                const categoryId = row.categoryId || "uncategorized";
                counts[categoryId] = (counts[categoryId] || 0) + 1;
                return counts;
            }, {});
            const categoryAmountTotals = mappedRows.reduce((totals, row)=>{
                const categoryId = row.categoryId || "uncategorized";
                totals[categoryId] = (totals[categoryId] || 0) + row.amount;
                return totals;
            }, {});
            const mappingSummary = {
                categoryAmountTotals,
                categoryCounts,
                conflictCount: conflicts.length,
                lowConfidenceCount: lowConfidenceRows.length,
                mappedCount: mappedRows.length,
                totalRows: rows.length,
                unmatchedCount: unmatchedRows.length
            };
            const warnings = createKeywordMapperWarnings({
                conflicts,
                lowConfidenceRows,
                rules,
                threshold: lowConfidenceThreshold,
                unmatchedRows
            });
            return completeResult({
                confidence,
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        details: {
                            conflicts: conflicts.length,
                            lowConfidenceRows: lowConfidenceRows.length,
                            mappedRows: mappedRows.length,
                            ruleSources: getKeywordRuleSourceLabels(context),
                            unmatchedRows: unmatchedRows.length
                        },
                        level: warnings.length > 0 ? "warning" : "info",
                        message: "Keyword mapping completed from connected Source rules."
                    })
                ],
                output: {
                    conflicts,
                    lowConfidenceRows,
                    mappingSummary,
                    mapping_summary: mappingSummary,
                    mappedRows,
                    rulesUsed: rules.map((rule)=>({
                            categoryId: rule.categoryId,
                            categoryLabel: rule.categoryLabel,
                            confidence: rule.confidence,
                            keywords: rule.keywords,
                            ruleId: rule.ruleId,
                            suggestedLine: rule.suggestedLine,
                            suggestedSection: rule.suggestedSection,
                            suggestedSubsection: rule.suggestedSubsection
                        })),
                    unmatchedRows
                },
                sourceTrace: collectSourceTrace(context),
                status: warnings.length > 0 ? "warning" : "success",
                warnings
            });
        },
        family: "Logic",
        inputRoles: [
            DATA_ROWS_INPUT_ROLE,
            KEYWORD_RULES_INPUT_ROLE
        ],
        inputSchema: getToolInputSchema([
            {
                key: "rows",
                required: true,
                type: "array"
            },
            {
                key: "keywordRules",
                required: true,
                type: "array"
            }
        ]),
        outputRoles: [
            MAPPED_ROWS_OUTPUT_ROLE,
            UNMATCHED_ROWS_OUTPUT_ROLE,
            LOW_CONFIDENCE_ROWS_OUTPUT_ROLE,
            CONFLICTS_OUTPUT_ROLE,
            {
                canRouteToFamilies: [
                    "Output",
                    "Review / Validation"
                ],
                description: "Counts and totals for mapped categories.",
                id: "mapping_summary",
                label: "Mapping summary",
                outputKey: "mappingSummary",
                outputType: "mapping_summary",
                samplePreview: "category counts and totals"
            }
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "mappedRows",
                required: true,
                type: "array"
            },
            {
                key: "lowConfidenceRows",
                type: "array"
            },
            {
                key: "unmatchedRows",
                type: "array"
            }
        ]),
        runMode: "local_mock",
        subtype: "Classification / Mapping",
        toolGroup: "mapping",
        toolId: "logic.keyword_mapper"
    },
    {
        defaultConfig: {
            aggregationMethod: "sum",
            amountField: "amount"
        },
        description: "Aggregates mapped or numeric rows with local sum logic.",
        displayName: "Aggregation",
        execute: (context)=>{
            const rows = collectRows(context);
            const includeTargets = asStringArray(context.config.includeTargets);
            const includeSectionIds = asStringArray(context.config.includeSectionIds);
            const includeSubsectionIds = asStringArray(context.config.includeSubsectionIds);
            const excludeTargets = asStringArray(context.config.excludeTargets);
            const includedRows = rows.filter((row)=>{
                const target = row.target || "";
                const sectionId = row.sectionId || row.lineId || "";
                const subsectionId = row.subsectionId || "";
                const included = (includeTargets.length === 0 || includeTargets.includes(target)) && (includeSectionIds.length === 0 || includeSectionIds.includes(sectionId)) && (includeSubsectionIds.length === 0 || includeSubsectionIds.includes(subsectionId));
                const excluded = excludeTargets.length > 0 && excludeTargets.includes(target);
                return included && !excluded;
            });
            const excludedRows = rows.filter((row)=>!includedRows.some((included)=>included.rowId === row.rowId));
            const subtotal = includedRows.reduce((total, row)=>total + row.amount, 0);
            const currency = includedRows.find((row)=>row.currency)?.currency || String(context.config.currency || "");
            const subtotalResult = {
                currency: currency || undefined,
                excludedRows: excludedRows.map((row)=>row.rowId),
                formulaTrace: includedRows.length === 0 ? "0 = no included rows" : `${subtotal} = ${includedRows.map((row)=>row.amount).join(" + ")}`,
                includedRows: includedRows.map((row)=>row.rowId),
                sectionId: includeSectionIds[0],
                subsectionId: includeSubsectionIds[0],
                value: subtotal
            };
            const aggregationSummary = {
                excludedCount: excludedRows.length,
                includedCount: includedRows.length,
                subtotal
            };
            const warnings = includedRows.length === 0 ? [
                "No rows matched the aggregation filters."
            ] : [];
            return completeResult({
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        details: {
                            includedRows: includedRows.length,
                            subtotal
                        },
                        level: warnings.length > 0 ? "warning" : "info",
                        message: "Aggregation completed with deterministic sum."
                    })
                ],
                output: {
                    aggregationSummary,
                    aggregation_summary: aggregationSummary,
                    aggregationMethod: "sum",
                    excludedRows,
                    formulaTrace: subtotalResult.formulaTrace,
                    includedRows,
                    subtotal: subtotalResult,
                    subtotalValue: subtotal,
                    value: subtotal
                },
                sourceTrace: collectSourceTrace(context),
                status: warnings.length > 0 ? "warning" : "success",
                warnings
            });
        },
        family: "Logic",
        inputRoles: [
            MAPPED_ROWS_INPUT_ROLE
        ],
        inputSchema: getToolInputSchema([
            {
                key: "mappedRows",
                type: "array"
            }
        ]),
        outputRoles: [
            SUBTOTAL_OUTPUT_ROLE,
            INCLUDED_ROWS_OUTPUT_ROLE,
            EXCLUDED_ROWS_OUTPUT_ROLE,
            {
                canRouteToFamilies: [
                    "Output",
                    "Review / Validation"
                ],
                description: "Formula trace and aggregation metadata.",
                id: "aggregation_summary",
                label: "Aggregation summary",
                outputKey: "aggregationSummary",
                outputType: "aggregation_summary",
                samplePreview: "5 row(s) summed by amount"
            }
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "subtotal",
                type: "object"
            }
        ]),
        runMode: "local_mock",
        subtype: "Aggregation",
        toolGroup: "calculation",
        toolId: "logic.aggregation"
    },
    {
        defaultConfig: {
            operation: "multiply"
        },
        description: "Calculates a value using safe local operations only.",
        displayName: "Formula",
        execute: (context)=>{
            const numericValues = collectNumericValues(context);
            const configuredOperands = Array.isArray(context.config.operands) ? context.config.operands : [];
            const operands = configuredOperands.length > 0 ? configuredOperands.map((operand)=>resolveOperand(operand, numericValues)).filter((resolvedValue)=>typeof resolvedValue === "number") : numericValues.map((item)=>item.value);
            const operation = getFormulaOperation(context.config);
            const formulaValue = calculateFormula(operation, operands);
            const warnings = formulaValue === null ? [
                "No numeric operands were available."
            ] : [];
            return completeResult({
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        details: {
                            operands,
                            operation,
                            value: formulaValue
                        },
                        level: warnings.length > 0 ? "warning" : "info",
                        message: "Safe formula operation completed."
                    })
                ],
                output: {
                    formulaTrace: `${operation}(${operands.join(", ")})`,
                    inputValues: numericValues,
                    operation,
                    value: formulaValue
                },
                sourceTrace: collectSourceTrace(context),
                status: warnings.length > 0 ? "warning" : "success",
                warnings
            });
        },
        family: "Logic",
        inputRoles: [
            {
                acceptedFamilies: [
                    "Logic",
                    "Source"
                ],
                acceptedOutputTypes: [
                    "subtotal",
                    "value"
                ],
                allowMultiple: true,
                description: "Numeric values from upstream Sources or Logic.",
                id: "values",
                label: "Values",
                required: true
            }
        ],
        inputSchema: getToolInputSchema([
            {
                key: "values",
                type: "array"
            }
        ]),
        outputRoles: [
            {
                ...VALUE_OUTPUT_ROLE,
                canRouteToFamilies: [
                    "Protected",
                    "Review / Validation"
                ],
                description: "Calculated value from safe local operations."
            },
            {
                canRouteToFamilies: [
                    "Output",
                    "Review / Validation"
                ],
                description: "Readable trace for the safe formula operation.",
                id: "formula_trace",
                label: "Formula trace",
                outputKey: "formulaTrace",
                outputType: "formula_trace"
            }
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "value",
                type: "number"
            }
        ]),
        runMode: "local_mock",
        subtype: "Formula",
        toolGroup: "calculation",
        toolId: "logic.formula"
    },
    {
        defaultConfig: {
            transformation: "pass_through_editable_copy"
        },
        description: "Creates downstream transformed copies while preserving lineage.",
        displayName: "Transformation",
        execute: (context)=>{
            const rows = collectRows(context);
            const transformation = String(context.config.transformation || context.config.transformationMode || "pass_through_editable_copy");
            const transformedRows = rows.map((row)=>{
                if (transformation === "normalize_sign") {
                    return {
                        ...row,
                        amount: Math.abs(row.amount),
                        transformed: true
                    };
                }
                if (transformation === "normalize_currency_label") {
                    return {
                        ...row,
                        currency: context.config.currency || "CAD",
                        transformed: true
                    };
                }
                return {
                    ...row,
                    editableCopy: true,
                    transformed: true
                };
            });
            return completeResult({
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        details: {
                            transformation
                        },
                        message: "Transformation created downstream editable data."
                    })
                ],
                output: {
                    sourceMutation: false,
                    transformation,
                    transformedRows
                },
                sourceTrace: collectSourceTrace(context),
                status: "success"
            });
        },
        family: "Logic",
        inputRoles: [
            DATA_ROWS_INPUT_ROLE
        ],
        inputSchema: getToolInputSchema([
            {
                key: "upstream",
                type: "object"
            }
        ]),
        outputRoles: [
            {
                ...ROWS_OUTPUT_ROLE,
                canRouteToFamilies: [
                    "Logic",
                    "Review / Validation"
                ],
                description: "Transformed downstream rows with Source lineage.",
                id: "transformed_rows",
                outputKey: "transformedRows",
                outputType: "transformed_rows"
            }
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "transformedRows",
                type: "array"
            },
            {
                key: "sourceMutation",
                type: "boolean"
            }
        ]),
        runMode: "local_mock",
        subtype: "Transformation",
        toolGroup: "data_preparation",
        toolId: "logic.transformation"
    },
    createMockParserTool({
        displayName: "Excel Table Reader",
        subtype: "Excel Table Reader",
        toolId: "logic.excel_table_reader"
    }),
    createMockParserTool({
        displayName: "PDF Text Parser",
        subtype: "PDF Text Parser",
        toolId: "logic.pdf_text_parser"
    }),
    createMockParserTool({
        displayName: "PDF Table Parser",
        subtype: "PDF Table Parser",
        toolId: "logic.pdf_table_parser"
    }),
    createMockParserTool({
        displayName: "OCR Extractor",
        subtype: "OCR Extractor",
        toolId: "logic.ocr_extract"
    }),
    createMockParserTool({
        displayName: "API Response Parser",
        subtype: "API Response Parser",
        toolId: "logic.api_response_parser"
    }),
    {
        defaultConfig: {
            requiredKeys: []
        },
        description: "Checks whether required upstream values are available.",
        displayName: "Required Input Check",
        execute: (context)=>{
            const requiredKeys = asStringArray(context.config.requiredKeys);
            const missingRequiredKeys = requiredKeys.filter((key)=>!hasRequiredInputKey(context, key));
            const missingUpstream = context.upstreamResults.length === 0 ? [
                "No upstream tool results were available."
            ] : [];
            const errored = context.upstreamResults.filter((result)=>result.status === "error" || result.status === "skipped");
            const warnings = [
                ...missingUpstream,
                ...missingRequiredKeys.map((key)=>`Missing required input: ${key}.`),
                ...errored.map((result)=>`${result.blockId} did not complete.`)
            ];
            const pass = warnings.length === 0;
            const validationResult = {
                blocking: true,
                checkedBlockIds: context.upstreamBlocks.map((block)=>block.id),
                checkedKeys: requiredKeys,
                failedCount: warnings.length,
                message: pass ? "Required FAPI workflow inputs are present." : warnings[0],
                missingItems: warnings,
                missingRequiredKeys,
                pass,
                status: pass ? "pass" : "fail"
            };
            return completeResult({
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        level: warnings.length > 0 ? "warning" : "info",
                        message: "Required input check completed."
                    })
                ],
                output: {
                    blocking: true,
                    missingItems: warnings,
                    missingRequiredKeys,
                    pass,
                    checkedBlockIds: context.upstreamBlocks.map((block)=>block.id),
                    requiredInputResult: validationResult,
                    required_input_result: validationResult,
                    validationResult,
                    validation_result: validationResult
                },
                sourceTrace: collectSourceTrace(context),
                status: pass ? "success" : "needs_review",
                warnings
            });
        },
        family: "Review / Validation",
        inputRoles: [
            REVIEW_FINDINGS_INPUT_ROLE
        ],
        inputSchema: getToolInputSchema([
            {
                key: "upstream",
                type: "object"
            }
        ]),
        outputRoles: [
            VALIDATION_RESULT_OUTPUT_ROLE,
            {
                ...REVIEW_STATUS_OUTPUT_ROLE,
                outputKey: "pass",
                samplePreview: true
            }
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "pass",
                type: "boolean"
            }
        ]),
        runMode: "local_mock",
        subtype: "Required Input Check",
        toolGroup: "review",
        toolId: "review.required_input_check"
    },
    {
        defaultConfig: {},
        description: "Flags mapped workflows that still have unmatched rows.",
        displayName: "Unmatched Rows Check",
        execute: (context)=>{
            const unmatchedRows = collectUnmatchedRows(context);
            const { blocking, overrideReason, overrideUnmatchedRows } = getUnmatchedRowsReviewConfig(context);
            const hasUnmatchedRows = unmatchedRows.length > 0;
            const warning = getUnmatchedRowsWarning({
                count: unmatchedRows.length,
                overrideUnmatchedRows
            });
            const warnings = warning ? [
                warning
            ] : [];
            const pass = !hasUnmatchedRows || overrideUnmatchedRows;
            const validationResult = {
                blocking,
                checkedCount: unmatchedRows.length,
                failedCount: pass ? 0 : unmatchedRows.length,
                message: getUnmatchedRowsMessage({
                    hasUnmatchedRows,
                    pass,
                    warning
                }),
                overrideApplied: overrideUnmatchedRows && hasUnmatchedRows,
                overrideReason,
                pass,
                status: pass ? "pass" : "fail"
            };
            return completeResult({
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        details: {
                            unmatchedRows: unmatchedRows.length
                        },
                        level: warnings.length > 0 ? "warning" : "info",
                        message: "Unmatched row review check completed."
                    })
                ],
                output: {
                    blocking,
                    pass,
                    reviewOverride: {
                        overrideReason,
                        overrideUnmatchedRows
                    },
                    validationResult,
                    validation_result: validationResult,
                    unmatchedRows
                },
                sourceTrace: collectSourceTrace(context),
                status: getUnmatchedRowsStatus({
                    pass,
                    warnings
                }),
                warnings
            });
        },
        family: "Review / Validation",
        inputRoles: [
            CHECKED_ITEMS_INPUT_ROLE
        ],
        inputSchema: getToolInputSchema([
            {
                key: "unmatchedRows",
                type: "array"
            }
        ]),
        outputRoles: [
            REVIEW_STATUS_OUTPUT_ROLE,
            {
                ...UNMATCHED_ROWS_OUTPUT_ROLE,
                canRouteToFamilies: [
                    "Output"
                ]
            }
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "unmatchedRows",
                type: "array"
            },
            {
                key: "pass",
                type: "boolean"
            }
        ]),
        runMode: "local_mock",
        subtype: "Unmatched Rows Check",
        toolGroup: "review",
        toolId: "review.unmatched_rows_check"
    },
    {
        defaultConfig: {
            threshold: 0.8
        },
        description: "Flags mapped rows below the configured confidence threshold.",
        displayName: "Low Confidence Warning",
        execute: (context)=>{
            const threshold = parseNumber(context.config.threshold) ?? 0.8;
            const lowConfidenceRows = collectRows(context).filter((row)=>(row.confidence ?? 1) < threshold);
            const warnings = lowConfidenceRows.length > 0 ? [
                `${lowConfidenceRows.length} row(s) are below confidence ${threshold}.`
            ] : [];
            return completeResult({
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        details: {
                            lowConfidenceRows: lowConfidenceRows.length,
                            threshold
                        },
                        level: warnings.length > 0 ? "warning" : "info",
                        message: "Low-confidence review check completed."
                    })
                ],
                output: {
                    blocking: false,
                    lowConfidenceRows,
                    pass: warnings.length === 0,
                    threshold,
                    validationResult: {
                        blocking: false,
                        checkedCount: collectRows(context).length,
                        failedCount: lowConfidenceRows.length,
                        message: warnings[0] || "All mapped rows meet the low-confidence warning threshold.",
                        pass: warnings.length === 0,
                        status: warnings.length > 0 ? "warning" : "pass",
                        threshold
                    }
                },
                sourceTrace: collectSourceTrace(context),
                status: warnings.length > 0 ? "warning" : "success",
                warnings
            });
        },
        family: "Review / Validation",
        inputRoles: [
            CHECKED_ITEMS_INPUT_ROLE
        ],
        inputSchema: getToolInputSchema([
            {
                key: "mappedRows",
                type: "array"
            }
        ]),
        outputRoles: [
            REVIEW_STATUS_OUTPUT_ROLE,
            {
                ...LOW_CONFIDENCE_ROWS_OUTPUT_ROLE,
                canRouteToFamilies: [
                    "Output"
                ]
            }
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "lowConfidenceRows",
                type: "array"
            }
        ]),
        runMode: "local_mock",
        subtype: "Low Confidence Warning",
        toolGroup: "review",
        toolId: "review.low_confidence_warning"
    },
    {
        defaultConfig: {
            blocking: true,
            threshold: 0.75
        },
        description: "Checks whether mapped rows meet a configured confidence threshold.",
        displayName: "Confidence Check",
        execute: (context)=>{
            const threshold = parseNumber(context.config.threshold) ?? 0.75;
            const rows = collectRows(context);
            const failedRows = rows.filter((row)=>(row.confidence ?? 1) < threshold);
            const blocking = context.config.blocking !== false;
            const pass = failedRows.length === 0;
            let reviewStatus = "pass";
            let runStatus = "success";
            if (!pass) {
                reviewStatus = blocking ? "fail" : "warning";
                runStatus = blocking ? "needs_review" : "warning";
            }
            const validationResult = {
                checkedCount: rows.length,
                failedCount: failedRows.length,
                message: pass ? "All mapped rows meet the confidence threshold." : `${failedRows.length} mapped row(s) are below confidence ${threshold}.`,
                status: reviewStatus,
                threshold
            };
            const warnings = pass ? [] : [
                validationResult.message
            ];
            return completeResult({
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        details: validationResult,
                        level: pass ? "info" : "warning",
                        message: "Confidence review check completed."
                    })
                ],
                output: {
                    blocking,
                    failedRows,
                    lowConfidenceRows: failedRows,
                    pass,
                    threshold,
                    validationResult: {
                        ...validationResult,
                        blocking,
                        pass
                    },
                    validation_result: {
                        ...validationResult,
                        blocking,
                        pass
                    }
                },
                sourceTrace: collectSourceTrace(context),
                status: runStatus,
                warnings
            });
        },
        family: "Review / Validation",
        inputRoles: [
            CHECKED_ITEMS_INPUT_ROLE
        ],
        inputSchema: getToolInputSchema([
            {
                key: "mappedRows",
                type: "array"
            }
        ]),
        outputRoles: [
            VALIDATION_RESULT_OUTPUT_ROLE,
            {
                ...LOW_CONFIDENCE_ROWS_OUTPUT_ROLE,
                canRouteToFamilies: [
                    "Output"
                ]
            }
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "validationResult",
                type: "object"
            },
            {
                key: "lowConfidenceRows",
                type: "array"
            }
        ]),
        runMode: "local_mock",
        subtype: "Low Confidence Warning",
        toolGroup: "review",
        toolId: "review.confidence_check"
    },
    {
        defaultConfig: {
            tolerance: 0.01
        },
        description: "Compares actual calculator results against expected workbook results.",
        displayName: "Formula Consistency Check",
        execute: (context)=>{
            const tolerance = parseNumber(context.config.tolerance) ?? 0.01;
            const expectedResults = collectExpectedResultValues(context);
            const actualResults = collectActualResultValues(context);
            const checks = Object.entries(expectedResults).map(([resultName, expected])=>{
                const actual = getNumberRecordValueByResultName(actualResults, resultName);
                const delta = typeof actual === "number" ? Number((actual - expected).toFixed(6)) : null;
                return {
                    actual,
                    delta,
                    expected,
                    pass: actual !== undefined && Math.abs(actual - expected) <= tolerance,
                    resultName
                };
            });
            const mismatches = checks.filter((check)=>!check.pass);
            const warnings = checks.length === 0 ? [
                "No expected results were available for formula comparison."
            ] : mismatches.map((check)=>`${check.resultName} expected ${check.expected} but got ${check.actual ?? "missing"}.`);
            const pass = checks.length > 0 && mismatches.length === 0;
            const validationResult = {
                blocking: true,
                checkedCount: checks.length,
                failedCount: mismatches.length,
                message: pass ? "Formula results match the expected workbook values." : warnings[0],
                pass,
                status: pass ? "pass" : "warning",
                tolerance
            };
            return completeResult({
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        details: validationResult,
                        level: pass ? "info" : "warning",
                        message: "Formula consistency check completed."
                    })
                ],
                output: {
                    actualResults,
                    blocking: true,
                    expectedResults,
                    formulaConsistency: {
                        checks,
                        mismatches,
                        tolerance
                    },
                    mismatches,
                    pass,
                    validationResult,
                    validation_result: validationResult
                },
                sourceTrace: collectSourceTrace(context),
                status: pass ? "success" : "warning",
                warnings: pass ? [] : warnings
            });
        },
        family: "Review / Validation",
        inputRoles: [
            CHECKED_ITEMS_INPUT_ROLE
        ],
        inputSchema: getToolInputSchema([
            {
                key: "results",
                type: "object"
            }
        ]),
        outputRoles: [
            VALIDATION_RESULT_OUTPUT_ROLE,
            REVIEW_STATUS_OUTPUT_ROLE
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "formulaConsistency",
                type: "object"
            },
            {
                key: "mismatches",
                type: "array"
            },
            {
                key: "validationResult",
                type: "object"
            }
        ]),
        runMode: "local_mock",
        subtype: "Formula Consistency Check",
        toolGroup: "review",
        toolId: "review.formula_consistency_check"
    },
    {
        defaultConfig: {
            approved: true,
            overrideRate: undefined,
            overrideReason: "",
            reviewer: "fx-reviewer",
            useOverride: false
        },
        description: "Reviews a source FX rate and optionally emits a reviewer override downstream without mutating the source.",
        displayName: "FX Rate Review",
        execute: (context)=>{
            const draft = getFxRateReviewDraft(context);
            const warnings = getFxRateReviewWarnings(draft);
            const pass = warnings.length === 0;
            const { approvalStatus, exchangeRateInfo, reviewedRate, validationResult } = getFxRateReviewOutput({
                context,
                pass,
                warnings
            });
            return completeResult({
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        details: exchangeRateInfo,
                        level: pass ? "info" : "warning",
                        message: "FX rate review completed."
                    })
                ],
                output: {
                    approved: pass,
                    approvalStatus,
                    approval_status: approvalStatus,
                    exchangeRateInfo,
                    fapiInputs: {
                        fxRate: reviewedRate
                    },
                    reviewedExchangeRate: exchangeRateInfo,
                    validationResult,
                    validation_result: validationResult,
                    value: reviewedRate
                },
                sourceTrace: collectSourceTrace(context),
                status: pass ? "success" : "needs_review",
                warnings
            });
        },
        family: "Review / Validation",
        inputRoles: [
            VALUE_TO_APPROVE_INPUT_ROLE
        ],
        inputSchema: getToolInputSchema([
            {
                key: "exchangeRate",
                required: true,
                type: "object"
            }
        ]),
        outputRoles: [
            REVIEWED_EXCHANGE_RATE_OUTPUT_ROLE,
            {
                canRouteToFamilies: [
                    "Logic",
                    "Protected",
                    "Output"
                ],
                description: "Reviewed FX rate as calculator input.",
                id: "fapi_inputs",
                label: "Reviewed FAPI inputs",
                outputKey: "fapiInputs",
                outputType: "fapi_inputs",
                samplePreview: "fxRate 1.35"
            },
            APPROVAL_STATUS_OUTPUT_ROLE,
            VALIDATION_RESULT_OUTPUT_ROLE
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "exchangeRateInfo",
                type: "object"
            },
            {
                key: "fapiInputs",
                type: "object"
            },
            {
                key: "validationResult",
                type: "object"
            }
        ]),
        runMode: "local_mock",
        subtype: "Manual Override Review",
        toolGroup: "review",
        toolId: "review.fx_rate_review"
    },
    {
        defaultConfig: {
            approved: true
        },
        description: "Records a local mock approval decision.",
        displayName: "Approval Gate",
        execute: (context)=>{
            const approved = context.config.approved !== false;
            const approvedWithWarnings = context.config.approvedWithWarnings === true;
            const reviewOverride = asRecord(context.config.reviewOverride);
            const overrideUnmatchedRows = context.config.overrideUnmatchedRows === true || reviewOverride?.overrideUnmatchedRows === true;
            const overrideReason = String(context.config.overrideReason || reviewOverride?.overrideReason || "").trim() || undefined;
            const reviewerOverrides = {
                approvedWithWarnings,
                overrideReason,
                overrideUnmatchedRows
            };
            const warnings = approved ? [] : [
                "Approval gate is not approved."
            ];
            const reviewer = context.config.reviewer || context.config.owner || "Reviewer";
            const notes = context.config.notes || context.config.approvalNotes || "";
            const approvalStatus = {
                approved,
                approvedWithWarnings,
                notes,
                overrideReason,
                overrideUnmatchedRows,
                reviewer,
                reviewerOverrides,
                status: approved ? "approved" : "not_approved"
            };
            return completeResult({
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        level: approved ? "info" : "warning",
                        message: approved ? "Approval gate approved locally." : "Approval gate needs review."
                    })
                ],
                output: {
                    approved,
                    approvedWithWarnings,
                    approvalStatus,
                    approval_status: approvalStatus,
                    notes,
                    reviewOverride: reviewerOverrides,
                    reviewer,
                    reviewerOverrides
                },
                sourceTrace: collectSourceTrace(context),
                status: approved ? "success" : "needs_review",
                warnings
            });
        },
        family: "Review / Validation",
        inputRoles: [
            VALUE_TO_APPROVE_INPUT_ROLE,
            VALIDATION_RESULT_INPUT_ROLE,
            REVIEW_FINDINGS_INPUT_ROLE
        ],
        inputSchema: getToolInputSchema([
            {
                key: "reviewFindings",
                type: "object"
            }
        ]),
        outputRoles: [
            APPROVAL_STATUS_OUTPUT_ROLE,
            {
                ...REVIEW_STATUS_OUTPUT_ROLE,
                outputKey: "approved",
                samplePreview: true
            }
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "approved",
                type: "boolean"
            }
        ]),
        runMode: "local_mock",
        subtype: "Approval Gate",
        toolGroup: "review",
        toolId: "review.approval_gate"
    },
    {
        defaultConfig: {},
        description: "Checks whether protected values and outputs are present.",
        displayName: "Output Readiness Check",
        execute: (context)=>{
            const protectedBlocks = context.workflow.blocks.filter((block)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$protected$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isGovernedValueBlock"])(block));
            const outputBlocks = context.workflow.blocks.filter((block)=>block.family === "Output");
            const protectedResults = getProtectedResults(context.upstreamResults);
            const requiredProtectedResults = asStringArray(context.config.requiredProtectedResults);
            const protectedResultNames = new Set(protectedResults.map((result)=>String(result.name || "")));
            const missingProtectedResults = requiredProtectedResults.filter((name)=>!protectedResultNames.has(name));
            const finality = getOutputFinalitySummary({
                protectedResults,
                results: context.upstreamResults,
                workflow: context.workflow
            });
            const missingItems = [
                protectedBlocks.length === 0 ? "No Protected blocks are present." : "",
                outputBlocks.length === 0 ? "No Output blocks are present." : "",
                ...missingProtectedResults.map((name)=>`Missing required protected result: ${name}.`),
                ...finality.blockingIssues.map((issue)=>issue.message)
            ].filter(Boolean);
            const pass = missingItems.length === 0;
            const outputReadinessResult = {
                blocking: true,
                finalityStatus: pass ? "final" : "review_ready",
                message: pass ? "Outputs are ready for final handoff." : "Outputs are review-ready, but blocking findings remain.",
                missingItems,
                missingProtectedResults,
                pass,
                protectedCount: protectedBlocks.length,
                protectedResultCount: protectedResults.length,
                requiredProtectedResults,
                status: pass ? "pass" : "fail",
                validationSummary: finality.validationSummary
            };
            return completeResult({
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        level: missingItems.length > 0 ? "warning" : "info",
                        message: "Output readiness check completed."
                    })
                ],
                output: {
                    blocking: true,
                    finalityStatus: outputReadinessResult.finalityStatus,
                    missingItems,
                    missingProtectedResults,
                    outputReadinessResult,
                    output_readiness_result: outputReadinessResult,
                    outputCount: outputBlocks.length,
                    pass,
                    protectedCount: protectedBlocks.length,
                    protectedResultsFinality: finality.protectedResultsFinality,
                    ready: pass,
                    validationResult: outputReadinessResult,
                    validation_result: outputReadinessResult
                },
                sourceTrace: collectSourceTrace(context),
                status: pass ? "success" : "needs_review",
                warnings: missingItems
            });
        },
        family: "Review / Validation",
        inputRoles: [
            PROTECTED_VALUES_INPUT_ROLE,
            VALIDATION_RESULT_INPUT_ROLE,
            REVIEW_FINDINGS_INPUT_ROLE
        ],
        inputSchema: getToolInputSchema([
            {
                key: "workflow",
                type: "object"
            }
        ]),
        outputRoles: [
            VALIDATION_RESULT_OUTPUT_ROLE,
            {
                ...REVIEW_STATUS_OUTPUT_ROLE,
                outputKey: "ready"
            }
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "ready",
                type: "boolean"
            }
        ]),
        runMode: "local_mock",
        subtype: "Output Readiness Check",
        toolGroup: "review",
        toolId: "review.output_readiness_check"
    },
    {
        defaultConfig: {
            runtimeLocked: true
        },
        description: "Creates a governed runtime-locked input value.",
        displayName: "Protected Input",
        execute: (context)=>{
            const value = getProtectedValue(context);
            const warnings = value === null ? [
                "No protected input value found."
            ] : [];
            const fapiInputKey = typeof context.config.fapiInputKey === "string" ? context.config.fapiInputKey : undefined;
            const fapiInputs = fapiInputKey && value !== null ? {
                [fapiInputKey]: value
            } : undefined;
            return completeResult({
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        level: warnings.length > 0 ? "warning" : "info",
                        message: "Protected input emitted with runtime lock metadata."
                    })
                ],
                output: {
                    fapiInputs,
                    governedValue: value,
                    protectedKind: context.block.governance?.protectedKind || "input",
                    runtimeLocked: true,
                    sourceTrace: collectSourceTrace(context)
                },
                sourceTrace: collectSourceTrace(context),
                status: warnings.length > 0 ? "needs_review" : "success",
                warnings
            });
        },
        family: "Protected",
        inputRoles: [
            APPROVED_VALUE_INPUT_ROLE
        ],
        inputSchema: getToolInputSchema([
            {
                key: "approvedValue",
                type: "object"
            }
        ]),
        outputRoles: [
            GOVERNED_VALUE_OUTPUT_ROLE
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "governedValue",
                type: "number"
            },
            {
                key: "runtimeLocked",
                type: "boolean"
            }
        ]),
        runMode: "local_mock",
        subtype: "Protected Input",
        toolGroup: "protected",
        toolId: "protected.protected_input"
    },
    {
        defaultConfig: {
            runtimeLocked: true
        },
        description: "Creates a governed runtime-locked result value.",
        displayName: "Protected Result",
        execute: (context)=>{
            const resultName = String(context.config.resultName || context.config.name || context.block.label);
            const value = getProtectedValue(context, resultName);
            const validationGate = summarizeValidationGateResults({
                results: context.upstreamResults,
                workflow: context.workflow
            });
            const { approvalPresent, approved, approvedBy } = getProtectedApprovalState(context.upstreamResults);
            const blockingIssues = validationGate.blockingIssues;
            const finalityStatus = getProtectedFinalityStatus({
                approvalPresent,
                approved,
                blockingIssues,
                value
            });
            const finalLocked = finalityStatus === "final";
            const finalityReason = getProtectedFinalityReason(finalityStatus);
            const warnings = getProtectedWarnings({
                approvalPresent,
                approved,
                blockingIssues,
                value
            });
            const protectedResult = {
                approved,
                approvedBy,
                blockingIssues,
                currency: getUpstreamCurrency(context, resultName),
                final: finalLocked,
                finalityReason,
                finalityStatus,
                name: resultName,
                nonBlockingWarnings: validationGate.nonBlockingWarnings,
                reviewerOverrides: validationGate.reviewerOverrides,
                runtimeLocked: finalLocked,
                sourceTrace: getPipelineTrace(context, resultName),
                status: finalLocked ? "locked" : finalityStatus,
                validationSummary: validationGate.validationSummary,
                value
            };
            return completeResult({
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        level: warnings.length > 0 ? "warning" : "info",
                        message: "Protected result emitted with runtime lock metadata."
                    })
                ],
                output: {
                    approvalStatus: finalLocked ? "approved" : finalityStatus,
                    blockingIssues,
                    draftOnly: !finalLocked,
                    finalityReason,
                    finalityStatus,
                    formulaTrace: context.upstreamResults.map((result)=>result.output.formulaTrace).filter(Boolean),
                    governedValue: value,
                    nonBlockingWarnings: validationGate.nonBlockingWarnings,
                    protectedKind: context.block.governance?.protectedKind || "result",
                    protectedResult,
                    protected_result: protectedResult,
                    reviewerOverrides: validationGate.reviewerOverrides,
                    runtimeLocked: finalLocked,
                    sourceTrace: collectSourceTrace(context),
                    validationSummary: validationGate.validationSummary
                },
                sourceTrace: collectSourceTrace(context),
                status: warnings.length > 0 ? "needs_review" : "success",
                warnings
            });
        },
        family: "Protected",
        inputRoles: [
            CANDIDATE_VALUE_INPUT_ROLE,
            APPROVAL_STATUS_INPUT_ROLE,
            APPROVED_VALUE_INPUT_ROLE,
            VALIDATION_RESULT_INPUT_ROLE
        ],
        inputSchema: getToolInputSchema([
            {
                key: "approvedLogicResult",
                type: "object"
            }
        ]),
        outputRoles: [
            PROTECTED_RESULT_OUTPUT_ROLE,
            GOVERNED_VALUE_OUTPUT_ROLE
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "governedValue",
                type: "number"
            },
            {
                key: "runtimeLocked",
                type: "boolean"
            }
        ]),
        runMode: "local_mock",
        subtype: "Protected Result",
        toolGroup: "protected",
        toolId: "protected.protected_result"
    },
    {
        defaultConfig: {},
        description: "Creates a local canonical JSON package.",
        displayName: "Canonical JSON",
        execute: (context)=>{
            const allResults = Object.values(context.allResults);
            const sourceResults = allResults.filter((result)=>{
                const block = context.workflow.blocks.find((item)=>item.id === result.blockId);
                return block?.family !== "Output";
            });
            const protectedValues = sourceResults.filter((result)=>{
                const block = context.workflow.blocks.find((item)=>item.id === result.blockId);
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$protected$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isGovernedValueBlock"])(block);
            }).map((result)=>({
                    blockId: result.blockId,
                    value: result.output.governedValue,
                    runtimeLocked: result.output.runtimeLocked
                }));
            const candidateLogicOutputs = sourceResults.filter((result)=>{
                const block = context.workflow.blocks.find((item)=>item.id === result.blockId);
                return block?.family === "Logic";
            }).map((result)=>({
                    blockId: result.blockId,
                    output: result.output
                }));
            const reviewResults = sourceResults.filter((result)=>{
                const block = context.workflow.blocks.find((item)=>item.id === result.blockId);
                return block?.family === "Review / Validation";
            }).map((result)=>({
                    blockId: result.blockId,
                    output: result.output
                }));
            const mappedRows = sourceResults.flatMap((result)=>Array.isArray(result.output.mappedRows) ? result.output.mappedRows : []);
            const mappedFiscalRows = collectRowsByOutputKey(sourceResults, "mappedRows");
            const lowConfidenceRows = collectRowsByOutputKey(sourceResults, "lowConfidenceRows");
            const unmatchedRows = collectRowsByOutputKey(sourceResults, "unmatchedRows");
            const keywordRulesUsed = sourceResults.flatMap((result)=>Array.isArray(result.output.rulesUsed) ? result.output.rulesUsed : []);
            const protectedResult = findProtectedResult(sourceResults);
            const protectedResults = getProtectedResults(sourceResults);
            const validationResult = findValidationResult(sourceResults);
            const approvalStatus = findApprovalStatus(sourceResults);
            const finalitySummary = getOutputFinalitySummary({
                protectedResults,
                results: sourceResults,
                workflow: context.workflow
            });
            const expandedCanonicalJson = isDualResultMappingWorkflow(context.workflow.name) ? buildExpandedCanonicalJson({
                context,
                keywordRulesUsed,
                lowConfidenceRows,
                mappedRows: mappedFiscalRows,
                protectedResults,
                results: sourceResults,
                unmatchedRows
            }) : null;
            const zCanonicalJson = protectedResult?.name === "Z" ? buildZCanonicalJson({
                approvalStatus,
                context,
                mappedRows,
                protectedResult,
                ruleUsed: asRecord(keywordRulesUsed[0]) || undefined,
                validationResult
            }) : null;
            const genericCanonicalJson = expandedCanonicalJson || zCanonicalJson ? null : buildGenericCanonicalJson({
                context,
                lowConfidenceRows,
                mappedRows: mappedFiscalRows,
                protectedResults,
                results: sourceResults,
                unmatchedRows
            });
            const protectedNeedsReview = protectedValues.some((value)=>value.runtimeLocked !== true);
            const warnings = dedupeStrings([
                ...sourceResults.flatMap((result)=>result.warnings),
                finalitySummary.finalityStatus !== "final" || protectedNeedsReview ? "Output preview includes results that still need review." : ""
            ]);
            const canonicalPayload = {};
            if (expandedCanonicalJson) {
                canonicalPayload.canonicalJson = withCanonicalFinality(expandedCanonicalJson, finalitySummary);
                canonicalPayload.canonical_json = canonicalPayload.canonicalJson;
                canonicalPayload.pipelineTrace = expandedCanonicalJson.trace;
            } else if (zCanonicalJson) {
                canonicalPayload.canonicalJson = withCanonicalFinality(zCanonicalJson, finalitySummary);
                canonicalPayload.canonical_json = canonicalPayload.canonicalJson;
                canonicalPayload.pipelineTrace = buildSingleItemPipelineTrace();
            } else if (genericCanonicalJson) {
                canonicalPayload.canonicalJson = withCanonicalFinality(genericCanonicalJson, finalitySummary);
                canonicalPayload.canonical_json = canonicalPayload.canonicalJson;
                canonicalPayload.pipelineTrace = genericCanonicalJson.trace;
            }
            return completeResult({
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        details: {
                            protectedValues: protectedValues.length
                        },
                        message: "Canonical JSON package generated locally."
                    })
                ],
                output: {
                    ...canonicalPayload,
                    blockingIssues: finalitySummary.blockingIssues,
                    candidateLogicOutputs,
                    finalityStatus: finalitySummary.finalityStatus,
                    generatedAt: new Date().toISOString(),
                    keywordRulesUsed,
                    mappedRows,
                    nonBlockingWarnings: finalitySummary.nonBlockingWarnings,
                    outputFinality: finalitySummary.finalityStatus,
                    protectedValues,
                    protectedResult,
                    protectedResults,
                    protectedResultsFinality: finalitySummary.protectedResultsFinality,
                    reviewResults,
                    reviewerOverrides: finalitySummary.reviewerOverrides,
                    runId: context.runId,
                    sourceTrace: collectSourceTrace(context),
                    validationSummary: finalitySummary.validationSummary,
                    warnings,
                    workflowId: context.workflow.id,
                    workflowName: context.workflow.name
                },
                sourceTrace: collectSourceTrace(context),
                status: protectedNeedsReview || warnings.length > 0 ? "warning" : "success",
                warnings
            });
        },
        family: "Output",
        inputRoles: [
            PROTECTED_RESULT_INPUT_ROLE,
            MAPPED_ROWS_INPUT_ROLE,
            REVIEW_FINDINGS_INPUT_ROLE,
            SOURCE_TRACE_INPUT_ROLE,
            PROTECTED_VALUES_INPUT_ROLE
        ],
        inputSchema: getToolInputSchema([
            {
                key: "protectedValues",
                type: "array"
            }
        ]),
        outputRoles: [
            {
                ...OUTPUT_PACKAGE_ROLE,
                id: "canonical_json",
                label: "Canonical JSON",
                outputKey: "canonicalJson",
                outputType: "canonical_json"
            }
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "protectedValues",
                type: "array"
            }
        ]),
        runMode: "local_mock",
        subtype: "Canonical JSON",
        toolGroup: "output",
        toolId: "output.canonical_json"
    },
    {
        defaultConfig: {},
        description: "Creates a local evidence pack preview payload.",
        displayName: "Evidence Pack Preview",
        execute: (context)=>{
            const allResults = Object.values(context.allResults);
            const sourceResults = allResults.filter((result)=>{
                const block = context.workflow.blocks.find((item)=>item.id === result.blockId);
                return block?.family !== "Output";
            });
            const warnings = dedupeStrings(sourceResults.flatMap((result)=>result.warnings));
            const protectedValues = sourceResults.filter((result)=>{
                const block = context.workflow.blocks.find((item)=>item.id === result.blockId);
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$domain$2f$workflow$2f$protected$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isGovernedValueBlock"])(block);
            }).map((result)=>({
                    blockId: result.blockId,
                    runtimeLocked: result.output.runtimeLocked,
                    value: result.output.governedValue
                }));
            const formulas = sourceResults.map((result)=>result.output.formulaTrace).filter(Boolean);
            const reviewDecisions = sourceResults.filter((result)=>Object.hasOwn(result.output, "approved")).map((result)=>result.output);
            const mappedRows = sourceResults.flatMap((result)=>Array.isArray(result.output.mappedRows) ? result.output.mappedRows : []);
            const mappedFiscalRows = collectRowsByOutputKey(sourceResults, "mappedRows");
            const sourceRows = collectRowsByOutputKey(sourceResults, "rows");
            const lowConfidenceRows = collectRowsByOutputKey(sourceResults, "lowConfidenceRows");
            const unmatchedRows = collectRowsByOutputKey(sourceResults, "unmatchedRows");
            const keywordRulesUsed = sourceResults.flatMap((result)=>Array.isArray(result.output.rulesUsed) ? result.output.rulesUsed : []);
            const protectedResult = findProtectedResult(sourceResults);
            const protectedResults = getProtectedResults(sourceResults);
            const validationResult = findValidationResult(sourceResults);
            const approvalStatus = findApprovalStatus(sourceResults);
            const finalitySummary = getOutputFinalitySummary({
                protectedResults,
                results: sourceResults,
                workflow: context.workflow
            });
            const expandedPreview = isDualResultMappingWorkflow(context.workflow.name) ? buildExpandedEvidencePreview({
                aggregationRuleCount: getAggregationRuleCount(sourceResults),
                keywordRuleCount: keywordRulesUsed.length,
                mappedRows: mappedFiscalRows,
                protectedResults,
                results: sourceResults,
                sourceRows,
                sourceWarnings: getExpandedWarnings({
                    lowConfidenceRows,
                    unmatchedRows
                }),
                workflowName: context.workflow.name
            }) : null;
            const zPreview = protectedResult?.name === "Z" ? buildZEvidencePreview({
                approvalStatus,
                mappedRows,
                protectedResult,
                ruleUsed: asRecord(keywordRulesUsed[0]) || undefined,
                validationResult
            }) : null;
            const genericPreview = expandedPreview || zPreview ? null : buildGenericEvidencePreview({
                mappedRows: mappedFiscalRows,
                protectedResults,
                results: sourceResults,
                sourceRows,
                warnings,
                workflowName: context.workflow.name
            });
            const protectedNeedsReview = protectedValues.some((value)=>value.runtimeLocked !== true);
            const outputWarnings = dedupeStrings([
                ...warnings,
                finalitySummary.finalityStatus !== "final" || protectedNeedsReview ? "Output preview includes results that still need review." : ""
            ]);
            let pipelineTrace;
            if (isDualResultMappingWorkflow(context.workflow.name)) {
                const zTrace = getDualResultPipelineTrace(context.workflow.name, "Z");
                pipelineTrace = [
                    ...zTrace,
                    ...getDualResultPipelineTrace(context.workflow.name, "W").filter((step)=>!zTrace.includes(step))
                ];
            } else if (protectedResult?.name === "Z") {
                pipelineTrace = buildSingleItemPipelineTrace();
            }
            return completeResult({
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        message: "Evidence pack preview generated locally."
                    })
                ],
                output: {
                    blockingIssues: finalitySummary.blockingIssues,
                    finalityStatus: finalitySummary.finalityStatus,
                    formulas,
                    keywordRulesUsed,
                    mappedRows,
                    nonBlockingWarnings: finalitySummary.nonBlockingWarnings,
                    outputFinality: finalitySummary.finalityStatus,
                    pipelineTrace,
                    preview: [
                        buildFinalityPreviewHeader(finalitySummary),
                        "",
                        expandedPreview || zPreview || genericPreview || `Workflow: ${context.workflow.name}`
                    ].join("\n"),
                    protectedValues,
                    protectedResult,
                    protectedResults,
                    protectedResultsFinality: finalitySummary.protectedResultsFinality,
                    reviewDecisions,
                    reviewerOverrides: finalitySummary.reviewerOverrides,
                    sourceRows: collectRows(context),
                    sourceTrace: collectSourceTrace(context),
                    validationSummary: finalitySummary.validationSummary,
                    warnings: outputWarnings
                },
                sourceTrace: collectSourceTrace(context),
                status: protectedNeedsReview || outputWarnings.length > 0 ? "warning" : "success",
                warnings: outputWarnings
            });
        },
        family: "Output",
        inputRoles: [
            PROTECTED_RESULT_INPUT_ROLE,
            MAPPED_ROWS_INPUT_ROLE,
            VALIDATION_RESULT_INPUT_ROLE,
            APPROVAL_STATUS_INPUT_ROLE,
            REVIEW_FINDINGS_INPUT_ROLE,
            PROTECTED_VALUES_INPUT_ROLE
        ],
        inputSchema: getToolInputSchema([
            {
                key: "workflowRun",
                type: "object"
            }
        ]),
        outputRoles: [
            {
                ...OUTPUT_PACKAGE_ROLE,
                outputKey: "preview"
            }
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "preview",
                type: "string"
            }
        ]),
        runMode: "local_mock",
        subtype: "Evidence Pack",
        toolGroup: "output",
        toolId: "output.evidence_pack_preview"
    },
    {
        defaultConfig: {},
        description: "Displays computed values sourced from upstream logic blocks.",
        displayName: "Field Block",
        execute: (context)=>{
            const computedValues = {};
            for (const result of context.upstreamResults){
                const output = asRecord(result.output) ?? {};
                const namedValues = asRecord(output.namedValues ?? output.calculatedResults) ?? {};
                for (const [k, v] of Object.entries(namedValues)){
                    computedValues[k] = v;
                }
            }
            return completeResult({
                context,
                evidenceRefs: collectEvidence(context),
                logs: [
                    makeLog({
                        blockId: context.block.id,
                        level: "info",
                        message: `Field block displaying ${Object.keys(computedValues).length} computed value(s).`
                    })
                ],
                output: {
                    computedValues
                },
                sourceTrace: collectSourceTrace(context),
                status: "success",
                warnings: []
            });
        },
        family: "Field",
        inputRoles: [
            {
                acceptedFamilies: [
                    "Logic",
                    "Field"
                ],
                acceptedOutputTypes: [
                    "named_values",
                    "calculated_results",
                    "rollup_totals",
                    "final_totals",
                    "computed_values"
                ],
                allowMultiple: true,
                description: "Computed values produced by an upstream logic block.",
                id: "computed_values",
                label: "Computed values",
                required: false
            }
        ],
        inputSchema: getToolInputSchema([
            {
                key: "computedValues",
                type: "object"
            }
        ]),
        outputRoles: [
            {
                canRouteToFamilies: [
                    "Output"
                ],
                description: "Computed field values passed downstream.",
                id: "computed_values",
                label: "Computed values",
                outputKey: "computedValues",
                outputType: "computed_values"
            }
        ],
        outputSchema: getToolOutputSchema([
            {
                key: "computedValues",
                type: "object"
            }
        ]),
        runMode: "local_mock",
        subtype: "Field Block",
        toolGroup: "field",
        toolId: "field.field_block"
    }
];
const BACKEND_ADAPTED_TOOL_IDS = [
    "source.manual_table",
    "source.keyword_rules",
    "source.aggregation_rules",
    "source.rollup_rules",
    "source.calculation_rules",
    "source.fapi_inputs",
    "source.currency_rate",
    "logic.keyword_mapper",
    "logic.category_rollup_aggregator",
    "logic.calculation_engine",
    "logic.hierarchy_aggregator"
];
function pushInputRole(inputsByRole, role, value) {
    inputsByRole[role] = [
        ...inputsByRole[role] || [],
        value
    ];
}
function pushBackendOutputAsInputs({ inputsByRole, role, value }) {
    pushInputRole(inputsByRole, role, value);
    if (role === "rows" || role === "selected_rows") {
        pushInputRole(inputsByRole, "data_rows", value);
    }
}
function pushBackendOutputsAsInputs(inputsByRole, backendOutputs) {
    for (const [role, value] of Object.entries(backendOutputs)){
        if (role === "selected_rows" && backendOutputs.rows !== undefined) {
            continue;
        }
        pushBackendOutputAsInputs({
            inputsByRole,
            role,
            value
        });
    }
}
function pushFlattenedResultAsInputs(inputsByRole, result) {
    if (Array.isArray(result.output.rows)) {
        pushInputRole(inputsByRole, "data_rows", {
            evidenceRefs: result.evidenceRefs,
            rows: result.output.rows,
            sourceTrace: result.sourceTrace
        });
    }
    if (Array.isArray(result.output.keywordRules)) {
        pushInputRole(inputsByRole, "keyword_rules", {
            evidenceRefs: result.evidenceRefs,
            keywordRules: result.output.keywordRules,
            sourceTrace: result.sourceTrace
        });
    }
    if (Array.isArray(result.output.aggregationRules)) {
        pushInputRole(inputsByRole, "aggregation_rules", {
            aggregationRules: result.output.aggregationRules,
            evidenceRefs: result.evidenceRefs,
            sourceTrace: result.sourceTrace
        });
    }
    if (Array.isArray(result.output.rollupRules)) {
        pushInputRole(inputsByRole, "rollup_rules", {
            evidenceRefs: result.evidenceRefs,
            rollupRules: result.output.rollupRules,
            sourceTrace: result.sourceTrace
        });
    }
    if (Array.isArray(result.output.calculationRules)) {
        pushInputRole(inputsByRole, "calculation_rules", {
            calculationRules: result.output.calculationRules,
            evidenceRefs: result.evidenceRefs,
            sourceTrace: result.sourceTrace
        });
    }
    if (typeof result.output.namedValues === "object" && result.output.namedValues) {
        pushInputRole(inputsByRole, "named_values", {
            evidenceRefs: result.evidenceRefs,
            namedValues: result.output.namedValues,
            sourceTrace: result.sourceTrace
        });
    }
    if (typeof result.output.calculatedResults === "object" && result.output.calculatedResults) {
        pushInputRole(inputsByRole, "named_values", {
            calculatedResults: result.output.calculatedResults,
            evidenceRefs: result.evidenceRefs,
            sourceTrace: result.sourceTrace
        });
    }
    if (typeof result.output.fapiInputs === "object" && result.output.fapiInputs) {
        pushInputRole(inputsByRole, "fapi_inputs", {
            evidenceRefs: result.evidenceRefs,
            fapiInputs: result.output.fapiInputs,
            sourceTrace: result.sourceTrace
        });
    }
    if (Array.isArray(result.output.mappedRows)) {
        const mappedInput = {
            evidenceRefs: result.evidenceRefs,
            mappedRows: result.output.mappedRows,
            sourceTrace: result.sourceTrace
        };
        pushInputRole(inputsByRole, "mapped_rows", mappedInput);
        pushInputRole(inputsByRole, "data_rows", {
            evidenceRefs: result.evidenceRefs,
            rows: result.output.mappedRows,
            sourceTrace: result.sourceTrace
        });
    }
}
function toBackendInputsByRole(context) {
    const inputsByRole = {};
    for (const result of context.upstreamResults){
        const backendOutputs = asRecord(result.output.backendOutputs);
        if (backendOutputs) {
            pushBackendOutputsAsInputs(inputsByRole, backendOutputs);
            continue;
        }
        pushFlattenedResultAsInputs(inputsByRole, result);
    }
    return inputsByRole;
}
function toBackendExecutionContext(context) {
    return {
        block: context.block,
        config: context.config,
        evidenceRefs: context.evidenceRefs,
        inputsByRole: toBackendInputsByRole(context),
        runId: context.runId,
        sourceTrace: context.sourceTrace,
        startedAt: context.startedAt,
        upstreamBlocks: context.upstreamBlocks,
        workflow: context.workflow
    };
}
function getBackendOutputRecord(result, role) {
    return asRecord(result.outputs[role]) || {};
}
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Backend adapter intentionally flattens each public output role for legacy local viewers.
function flattenBackendResultOutput(result) {
    const output = {
        backendOutputs: result.outputs,
        primaryOutputRole: result.primaryOutputRole
    };
    const rowsOutput = getBackendOutputRecord(result, "rows");
    if (Object.keys(rowsOutput).length > 0) {
        output.immutable = rowsOutput.immutable;
        output.readOnlyEvidence = rowsOutput.readOnlyEvidence;
        output.rowCount = rowsOutput.rowCount;
        output.rows = rowsOutput.rows;
        output.sourceKind = rowsOutput.sourceKind;
        output.sourceSubtype = rowsOutput.sourceSubtype;
    }
    const rawRowsOutput = getBackendOutputRecord(result, "raw_rows");
    if (Object.keys(rawRowsOutput).length > 0) {
        output.rawRows = rawRowsOutput.rawRows;
        output.rawRowsCount = rawRowsOutput.rowCount;
    }
    const selectedRowsOutput = getBackendOutputRecord(result, "selected_rows");
    if (Object.keys(selectedRowsOutput).length > 0) {
        output.selectedRows = selectedRowsOutput.rows;
        output.selectedRowsCount = selectedRowsOutput.rowCount;
    }
    const workbookFileOutput = getBackendOutputRecord(result, "workbook_file");
    if (Object.keys(workbookFileOutput).length > 0) {
        output.workbookFile = workbookFileOutput.workbookFile || workbookFileOutput;
    }
    const selectedSheetOutput = getBackendOutputRecord(result, "selected_sheet");
    if (Object.keys(selectedSheetOutput).length > 0) {
        output.selectedSheet = selectedSheetOutput;
    }
    const selectedRangeOutput = getBackendOutputRecord(result, "selected_range");
    if (Object.keys(selectedRangeOutput).length > 0) {
        output.selectedRange = selectedRangeOutput;
    }
    const sourceMetadataOutput = getBackendOutputRecord(result, "source_metadata");
    if (Object.keys(sourceMetadataOutput).length > 0) {
        output.sourceMetadata = sourceMetadataOutput;
    }
    const sourceLocatorOutput = getBackendOutputRecord(result, "source_locator");
    if (Object.keys(sourceLocatorOutput).length > 0) {
        output.sourceLocator = sourceLocatorOutput.sourceLocator;
    }
    const keywordRulesOutput = getBackendOutputRecord(result, "keyword_rules");
    if (Object.keys(keywordRulesOutput).length > 0) {
        output.immutable = keywordRulesOutput.immutable;
        output.keywordRuleEvidence = keywordRulesOutput.keywordRuleEvidence;
        output.keywordRules = keywordRulesOutput.keywordRules;
        output.keywordRuleTrace = keywordRulesOutput.keywordRuleTrace;
        output.readOnlyEvidence = keywordRulesOutput.readOnlyEvidence;
        output.ruleMetadata = keywordRulesOutput.ruleMetadata;
        output.ruleVersion = keywordRulesOutput.ruleVersion;
        output.ruleCount = keywordRulesOutput.ruleCount;
        output.sourceKind = keywordRulesOutput.sourceKind;
    }
    const aggregationRulesOutput = getBackendOutputRecord(result, "aggregation_rules");
    if (Object.keys(aggregationRulesOutput).length > 0) {
        output.aggregationRuleEvidence = aggregationRulesOutput.aggregationRuleEvidence;
        output.aggregationTree = aggregationRulesOutput.aggregationTree;
        output.aggregationRules = aggregationRulesOutput.aggregationRules;
        output.aggregationRuleTrace = aggregationRulesOutput.aggregationRuleTrace;
        output.immutable = aggregationRulesOutput.immutable;
        output.readOnlyEvidence = aggregationRulesOutput.readOnlyEvidence;
        output.ruleMetadata = aggregationRulesOutput.ruleMetadata;
        output.ruleVersion = aggregationRulesOutput.ruleVersion;
        output.ruleCount = aggregationRulesOutput.ruleCount;
        output.sourceKind = aggregationRulesOutput.sourceKind;
    }
    const rollupRulesOutput = getBackendOutputRecord(result, "rollup_rules");
    if (Object.keys(rollupRulesOutput).length > 0) {
        output.immutable = rollupRulesOutput.immutable;
        output.readOnlyEvidence = rollupRulesOutput.readOnlyEvidence;
        output.rollupRuleEvidence = rollupRulesOutput.rollupRuleEvidence;
        output.rollupRules = rollupRulesOutput.rollupRules;
        output.rollupRuleTrace = rollupRulesOutput.rollupRuleTrace;
        output.ruleMetadata = rollupRulesOutput.ruleMetadata;
        output.ruleVersion = rollupRulesOutput.ruleVersion;
        output.ruleCount = rollupRulesOutput.ruleCount;
        output.sourceKind = rollupRulesOutput.sourceKind;
    }
    const calculationRulesOutput = getBackendOutputRecord(result, "calculation_rules");
    if (Object.keys(calculationRulesOutput).length > 0) {
        output.calculationRuleEvidence = calculationRulesOutput.calculationRuleEvidence;
        output.calculationRules = calculationRulesOutput.calculationRules;
        output.calculationRuleTrace = calculationRulesOutput.calculationRuleTrace;
        output.immutable = calculationRulesOutput.immutable;
        output.readOnlyEvidence = calculationRulesOutput.readOnlyEvidence;
        output.ruleMetadata = calculationRulesOutput.ruleMetadata;
        output.ruleVersion = calculationRulesOutput.ruleVersion;
        output.ruleCount = calculationRulesOutput.ruleCount;
        output.sourceKind = calculationRulesOutput.sourceKind;
    }
    const ruleMetadataOutput = getBackendOutputRecord(result, "rule_metadata");
    if (Object.keys(ruleMetadataOutput).length > 0) {
        output.ruleMetadata = ruleMetadataOutput;
    }
    const ruleVersionOutput = getBackendOutputRecord(result, "rule_version");
    if (Object.keys(ruleVersionOutput).length > 0) {
        output.ruleVersion = ruleVersionOutput.ruleVersion || ruleVersionOutput;
        output.ruleVersionMetadata = ruleVersionOutput;
    }
    const mappedRowsOutput = getBackendOutputRecord(result, "mapped_rows");
    if (Object.keys(mappedRowsOutput).length > 0) {
        output.mappedRows = mappedRowsOutput.mappedRows;
        output.mappedRowsCount = mappedRowsOutput.rowCount;
    }
    const unmatchedRowsOutput = getBackendOutputRecord(result, "unmatched_rows");
    if (Object.keys(unmatchedRowsOutput).length > 0) {
        output.unmatchedRows = unmatchedRowsOutput.unmatchedRows;
        output.unmatchedRowsCount = unmatchedRowsOutput.rowCount;
    }
    const lowConfidenceRowsOutput = getBackendOutputRecord(result, "low_confidence_rows");
    if (Object.keys(lowConfidenceRowsOutput).length > 0) {
        output.lowConfidenceRows = lowConfidenceRowsOutput.lowConfidenceRows;
        output.lowConfidenceRowsCount = lowConfidenceRowsOutput.rowCount;
    }
    const conflictsOutput = getBackendOutputRecord(result, "conflicts");
    if (Object.keys(conflictsOutput).length > 0) {
        output.conflictCount = conflictsOutput.conflictCount;
        output.conflicts = conflictsOutput.conflicts;
    }
    const mappingSummaryOutput = getBackendOutputRecord(result, "mapping_summary");
    if (Object.keys(mappingSummaryOutput).length > 0) {
        output.mappingSummary = mappingSummaryOutput;
        output.rulesUsed = mappingSummaryOutput.rulesUsed;
    }
    const categoryTotalsOutput = getBackendOutputRecord(result, "category_totals");
    if (Object.keys(categoryTotalsOutput).length > 0) {
        output.categoryTotalDetails = categoryTotalsOutput.categoryTotalDetails;
        output.categoryTotals = categoryTotalsOutput.categoryTotals;
    }
    const nodeTotalsOutput = getBackendOutputRecord(result, "node_totals");
    if (Object.keys(nodeTotalsOutput).length > 0) {
        output.nodeTotalDetails = nodeTotalsOutput.nodeTotalDetails;
        output.nodeTotals = nodeTotalsOutput.nodeTotals;
    }
    const groupTotalsOutput = getBackendOutputRecord(result, "group_totals");
    if (Object.keys(groupTotalsOutput).length > 0) {
        output.groupTotals = groupTotalsOutput.groupTotals;
    }
    const rollupTotalsOutput = getBackendOutputRecord(result, "rollup_totals");
    if (Object.keys(rollupTotalsOutput).length > 0) {
        output.rollupTotalDetails = rollupTotalsOutput.rollupTotalDetails;
        output.rollupTotals = rollupTotalsOutput.rollupTotals;
    }
    const namedValuesOutput = getBackendOutputRecord(result, "named_values");
    if (Object.keys(namedValuesOutput).length > 0) {
        output.namedValues = namedValuesOutput.namedValues;
        output.namedValuesSourceKind = namedValuesOutput.sourceKind;
    }
    const finalTotalsOutput = getBackendOutputRecord(result, "final_totals");
    if (Object.keys(finalTotalsOutput).length > 0) {
        output.finalTotalDetails = finalTotalsOutput.finalTotalDetails;
        output.finalTotals = finalTotalsOutput.finalTotals;
    }
    const officialLineValuesOutput = getBackendOutputRecord(result, "official_line_values");
    if (Object.keys(officialLineValuesOutput).length > 0) {
        output.officialLineDetails = officialLineValuesOutput.officialLineDetails;
        output.officialLineValues = officialLineValuesOutput.officialLineValues;
    }
    const exchangeRateOutput = getBackendOutputRecord(result, "exchange_rate");
    if (Object.keys(exchangeRateOutput).length > 0) {
        output.exchangeRate = exchangeRateOutput.rate;
        output.exchangeRateInfo = exchangeRateOutput;
        output.value = exchangeRateOutput.rate;
    }
    const fapiInputsOutput = getBackendOutputRecord(result, "fapi_inputs");
    if (Object.keys(fapiInputsOutput).length > 0) {
        output.expectedResults = asRecord(fapiInputsOutput.fapiInputs)?.expectedResults;
        output.fapiInputs = fapiInputsOutput.fapiInputs || fapiInputsOutput;
    }
    const inputMetadataOutput = getBackendOutputRecord(result, "input_metadata");
    if (Object.keys(inputMetadataOutput).length > 0) {
        output.inputMetadata = inputMetadataOutput;
    }
    const rateMetadataOutput = getBackendOutputRecord(result, "rate_metadata");
    if (Object.keys(rateMetadataOutput).length > 0) {
        output.rateMetadata = rateMetadataOutput;
    }
    const aggregationTreeOutput = getBackendOutputRecord(result, "aggregation_tree");
    if (Object.keys(aggregationTreeOutput).length > 0) {
        output.aggregationTree = aggregationTreeOutput.aggregationTree;
    }
    const includedRowsByNodeOutput = getBackendOutputRecord(result, "included_rows_by_node");
    if (Object.keys(includedRowsByNodeOutput).length > 0) {
        output.includedRowsByNode = includedRowsByNodeOutput.includedRowsByNode;
    }
    const hierarchyExcludedRowsOutput = getBackendOutputRecord(result, "excluded_rows");
    if (Object.keys(hierarchyExcludedRowsOutput).length > 0) {
        output.excludedRows = hierarchyExcludedRowsOutput.excludedRows;
        output.excludedRowsCount = hierarchyExcludedRowsOutput.rowCount;
    }
    const includedRowsByCategoryOutput = getBackendOutputRecord(result, "included_rows_by_category");
    if (Object.keys(includedRowsByCategoryOutput).length > 0) {
        output.includedRowsByCategory = includedRowsByCategoryOutput.includedRowsByCategory;
    }
    const includedRowsByRollupOutput = getBackendOutputRecord(result, "included_rows_by_rollup");
    if (Object.keys(includedRowsByRollupOutput).length > 0) {
        output.includedRowsByRollup = includedRowsByRollupOutput.includedRowsByRollup;
    }
    const formulaTraceOutput = getBackendOutputRecord(result, "formula_trace");
    if (Object.keys(formulaTraceOutput).length > 0) {
        output.formulaTrace = formulaTraceOutput.formulaTrace;
        output.formulaTraceText = formulaTraceOutput.formulaTraceText;
    }
    const rollupFormulaTraceOutput = getBackendOutputRecord(result, "rollup_formula_trace");
    if (Object.keys(rollupFormulaTraceOutput).length > 0) {
        output.rollupFormulaTrace = rollupFormulaTraceOutput.rollupFormulaTrace;
    }
    const aggregationSummaryOutput = getBackendOutputRecord(result, "aggregation_summary");
    if (Object.keys(aggregationSummaryOutput).length > 0) {
        output.aggregationSummary = aggregationSummaryOutput;
        output.aggregation_summary = aggregationSummaryOutput;
    }
    const calculatedResultsOutput = getBackendOutputRecord(result, "calculated_results");
    if (Object.keys(calculatedResultsOutput).length > 0) {
        output.calculatedResults = calculatedResultsOutput.calculatedResults;
        output.resultDetails = calculatedResultsOutput.resultDetails;
    }
    const calculationSummaryOutput = getBackendOutputRecord(result, "calculation_summary");
    if (Object.keys(calculationSummaryOutput).length > 0) {
        output.calculationSummary = calculationSummaryOutput;
    }
    const rollupSummaryOutput = getBackendOutputRecord(result, "rollup_summary");
    if (Object.keys(rollupSummaryOutput).length > 0) {
        output.rollupSummary = rollupSummaryOutput;
    }
    return output;
}
function adaptBackendResult(result) {
    return {
        blockId: result.blockId,
        completedAt: result.completedAt,
        confidence: result.confidence,
        errors: result.errors,
        evidenceRefs: result.evidenceRefs,
        logs: result.logs,
        output: flattenBackendResultOutput(result),
        runId: result.runId,
        sourceTrace: result.sourceTrace,
        startedAt: result.startedAt,
        status: result.status,
        toolId: result.toolId,
        warnings: result.warnings
    };
}
function createBackendAdaptedTool(toolId) {
    const backendDefinition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getToolDefinition"])(toolId);
    if (!backendDefinition) {
        return null;
    }
    return {
        defaultConfig: backendDefinition.defaultConfig,
        description: backendDefinition.description,
        displayName: backendDefinition.displayName,
        execute: (context)=>adaptBackendResult((0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["executeTool"])(toolId, toBackendExecutionContext(context))),
        family: backendDefinition.family,
        inputRoles: backendDefinition.inputRoles,
        inputSchema: getToolInputSchema(backendDefinition.inputRoles.map((role)=>({
                key: role.id,
                required: role.required,
                type: "object"
            }))),
        outputRoles: backendDefinition.outputRoles,
        outputSchema: getToolOutputSchema(backendDefinition.outputRoles.map((role)=>({
                key: role.outputKey || role.id,
                type: role.outputType === "value" ? "number" : "object"
            }))),
        runMode: "local_mock",
        subtype: backendDefinition.subtype,
        toolGroup: backendDefinition.toolGroup,
        toolId: backendDefinition.toolId
    };
}
const LOCAL_TOOLS_BY_ID = Object.fromEntries(_c1 = localTools.map(_c = (tool)=>[
        tool.toolId,
        tool
    ]));
_c2 = LOCAL_TOOLS_BY_ID;
const BACKEND_ADAPTED_TOOL_ENTRIES = BACKEND_ADAPTED_TOOL_IDS.flatMap(_c3 = (toolId)=>{
    const tool = createBackendAdaptedTool(toolId);
    return tool ? [
        [
            toolId,
            tool
        ]
    ] : [];
});
_c4 = BACKEND_ADAPTED_TOOL_ENTRIES;
const BACKEND_ADAPTED_TOOLS = Object.fromEntries(BACKEND_ADAPTED_TOOL_ENTRIES);
_c5 = BACKEND_ADAPTED_TOOLS;
const LOCAL_TOOL_REGISTRY = {
    ...LOCAL_TOOLS_BY_ID,
    ...BACKEND_ADAPTED_TOOLS,
    "logic.keyword_classifier": BACKEND_ADAPTED_TOOLS["logic.keyword_mapper"]
};
const TABLE_SOURCE_CATALOG_IDS = new Set([
    "source:database-query",
    "source:excel-workbook"
]);
const TABLE_SOURCE_SUBTYPES = new Set([
    "Database Query",
    "Excel / Workbook"
]);
const LOGIC_TOOL_BY_SUBTYPE = {
    Aggregation: "logic.aggregation",
    "API Response Parser": "logic.api_response_parser",
    "Calculation Engine": "logic.calculation_engine",
    "Category Rollup Aggregator": "logic.category_rollup_aggregator",
    "Classification / Mapping": "logic.keyword_mapper",
    "Excel Table Reader": "logic.excel_table_reader",
    Formula: "logic.formula",
    "Hierarchy Aggregator": "logic.hierarchy_aggregator",
    "OCR Extractor": "logic.ocr_extract",
    "PDF Table Parser": "logic.pdf_table_parser",
    "PDF Text Parser": "logic.pdf_text_parser",
    Transformation: "logic.transformation"
};
const REVIEW_TOOL_BY_SUBTYPE = {
    "Approval Gate": "review.approval_gate",
    "Formula Consistency Check": "review.formula_consistency_check",
    "Low Confidence Warning": "review.low_confidence_warning",
    "Output Readiness Check": "review.output_readiness_check",
    "Unmatched Rows Check": "review.unmatched_rows_check"
};
const OUTPUT_TOOL_BY_SUBTYPE = {
    "Canonical JSON": "output.canonical_json"
};
function getSourceToolId(block) {
    if (block.config.sourceKind === "fapi_inputs" || block.config.toolId === "source.fapi_inputs") {
        return "source.fapi_inputs";
    }
    if (block.config.sourceKind === "currency_rate" || block.catalogId === "source:currency-rate") {
        return "source.currency_rate";
    }
    if (block.config.sourceKind === "aggregation_rules" || block.catalogId === "source:aggregation-rules") {
        return "source.aggregation_rules";
    }
    if (block.config.sourceKind === "rollup_rules" || block.catalogId === "source:rollup-rules") {
        return "source.rollup_rules";
    }
    if (block.config.sourceKind === "calculation_rules" || block.catalogId === "source:calculation-rules") {
        return "source.calculation_rules";
    }
    if (block.config.sourceKind === "keyword_rules" || block.catalogId === "source:keyword-rules") {
        return "source.keyword_rules";
    }
    if (TABLE_SOURCE_CATALOG_IDS.has(block.catalogId || "") || TABLE_SOURCE_SUBTYPES.has(block.subtype)) {
        return "source.manual_table";
    }
    return "source.manual_value";
}
const TOOL_RESOLVERS_BY_FAMILY = {
    Field: ()=>"field.field_block",
    Logic: (block)=>LOGIC_TOOL_BY_SUBTYPE[block.subtype] || "logic.transformation",
    Output: (block)=>OUTPUT_TOOL_BY_SUBTYPE[block.subtype] || "output.evidence_pack_preview",
    Protected: (block)=>block.subtype === "Protected Input" || block.subtype === "Locked Rate" ? "protected.protected_input" : "protected.protected_result",
    "Review / Validation": (block)=>REVIEW_TOOL_BY_SUBTYPE[block.subtype] || "review.required_input_check",
    Source: getSourceToolId
};
function getToolIdForBlock(block) {
    if (typeof block.config.toolId === "string") {
        return block.config.toolId;
    }
    return TOOL_RESOLVERS_BY_FAMILY[block.family]?.(block) || "ai.proposal_only";
}
function getToolForBlock(block) {
    return LOCAL_TOOL_REGISTRY[getToolIdForBlock(block)] || null;
}
function getSampleManualRows() {
    return DEFAULT_TABLE_ROWS.map((row)=>({
            ...row
        }));
}
function getSampleKeywordRules() {
    return DEFAULT_KEYWORD_RULES.map((rule)=>({
            ...rule
        }));
}
function getSampleSourceDocuments() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$local$2d$fiscal$2d$workflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LOCAL_SAMPLE_DATASET"].sourceDocuments;
}
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "LOCAL_TOOLS_BY_ID$Object.fromEntries$localTools.map");
__turbopack_context__.k.register(_c1, "LOCAL_TOOLS_BY_ID$Object.fromEntries");
__turbopack_context__.k.register(_c2, "LOCAL_TOOLS_BY_ID");
__turbopack_context__.k.register(_c3, "BACKEND_ADAPTED_TOOL_ENTRIES$BACKEND_ADAPTED_TOOL_IDS.flatMap");
__turbopack_context__.k.register(_c4, "BACKEND_ADAPTED_TOOL_ENTRIES");
__turbopack_context__.k.register(_c5, "BACKEND_ADAPTED_TOOLS");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=shared_workflow-engine_local-tool-registry_ts_340e85de._.js.map