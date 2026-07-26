(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/shared/workflow-engine/execution/blocks/logic/calculation-engine/definition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculationEngineDefinition",
    ()=>calculationEngineDefinition
]);
const calculationEngineDefinition = {
    defaultConfig: {},
    description: "Applies calculation rules to named values and source/protected inputs.",
    displayName: "Calculation Engine",
    family: "Logic",
    inputRoles: [
        {
            acceptedFamilies: [
                "Logic",
                "Source",
                "Protected"
            ],
            acceptedOutputTypes: [
                "named_values",
                "calculated_results",
                "fapi_inputs",
                "protected_result",
                "governed_value"
            ],
            allowMultiple: true,
            description: "Named numeric values from rollups, inputs, or protected values.",
            id: "named_values",
            label: "Named values",
            required: true
        },
        {
            acceptedFamilies: [
                "Source"
            ],
            acceptedOutputTypes: [
                "calculation_rules"
            ],
            acceptedSourceKinds: [
                "calculation_rules"
            ],
            allowMultiple: true,
            description: "Optional external formula rules. When connected, overrides inline formulas (auto mode) or is required (external_rules mode).",
            id: "calculation_rules",
            label: "Calculation rules (optional)",
            required: false
        },
        {
            acceptedFamilies: [
                "Source",
                "Review / Validation",
                "Protected"
            ],
            acceptedOutputTypes: [
                "fapi_inputs",
                "exchange_rate",
                "reviewed_exchange_rate",
                "governed_value"
            ],
            allowMultiple: true,
            description: "Optional source or protected fiscal inputs.",
            id: "protected_inputs",
            label: "Protected/source inputs",
            required: false
        }
    ],
    outputRoles: [
        {
            canRouteToFamilies: [
                "Protected",
                "Review / Validation",
                "Output"
            ],
            description: "Calculated formula results keyed by result name.",
            id: "calculated_results",
            label: "Calculated results",
            outputKey: "calculatedResults",
            outputType: "calculated_results"
        },
        {
            canRouteToFamilies: [
                "Review / Validation",
                "Output"
            ],
            description: "Formula trace for every calculated result.",
            id: "formula_trace",
            label: "Formula trace",
            outputKey: "formulaTrace",
            outputType: "formula_trace"
        },
        {
            canRouteToFamilies: [
                "Review / Validation",
                "Output"
            ],
            description: "Calculation execution summary.",
            id: "calculation_summary",
            label: "Calculation summary",
            outputKey: "calculationSummary",
            outputType: "calculation_summary"
        },
        {
            canRouteToFamilies: [
                "Logic",
                "Output",
                "Review / Validation"
            ],
            description: "Input and calculated values exposed for downstream formulas.",
            id: "named_values",
            label: "Named values",
            outputKey: "namedValues",
            outputType: "named_values"
        }
    ],
    runMode: "local_mock",
    subtype: "Calculation Engine",
    toolGroup: "calculation",
    toolId: "logic.calculation_engine"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/runtime/events.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "error",
    ()=>error,
    "info",
    ()=>info,
    "warning",
    ()=>warning
]);
function makeToolLog({ details, level, message }) {
    return {
        at: new Date().toISOString(),
        details,
        id: `tool-log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        level,
        message
    };
}
function info(message, details) {
    return makeToolLog({
        details,
        level: "info",
        message
    });
}
function warning(message, details) {
    return makeToolLog({
        details,
        level: "warning",
        message
    });
}
function error(message, details) {
    return makeToolLog({
        details,
        level: "error",
        message
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/runtime/lineage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createEvidenceRef",
    ()=>createEvidenceRef,
    "createSourceTraceRef",
    ()=>createSourceTraceRef,
    "dedupeEvidenceRefs",
    ()=>dedupeEvidenceRefs,
    "dedupeSourceTrace",
    ()=>dedupeSourceTrace
]);
function getLocator(block) {
    return block.source?.locator || String(block.config.sourceLocator || block.config.locator || "");
}
function getEvidenceItemId(input) {
    return input.rowId || input.ruleId || input.field || "value";
}
function createEvidenceRef(input) {
    const itemId = getEvidenceItemId(input);
    return {
        evidenceId: `${input.block.id}:${itemId}`,
        field: input.field,
        immutable: true,
        label: input.label,
        locator: getLocator(input.block) || input.sourceKind,
        rowId: input.rowId,
        ruleId: input.ruleId,
        sourceBlockId: input.block.id,
        sourceKind: input.sourceKind,
        sourceLabel: input.block.label,
        valuePreview: input.valuePreview
    };
}
function createSourceTraceRef({ evidenceRef, relationshipPath }) {
    return {
        edgeId: undefined,
        evidenceRefId: evidenceRef.evidenceId,
        field: evidenceRef.field,
        relationshipPath: relationshipPath || [
            evidenceRef.sourceBlockId
        ],
        rowId: evidenceRef.rowId,
        ruleId: evidenceRef.ruleId,
        sourceBlockId: evidenceRef.sourceBlockId,
        sourceKind: evidenceRef.sourceKind,
        sourceLabel: evidenceRef.sourceLabel,
        valuePreview: evidenceRef.valuePreview
    };
}
function dedupeEvidenceRefs(refs) {
    return [
        ...new Map(refs.map((ref)=>[
                ref.evidenceId,
                ref
            ])).values()
    ];
}
function dedupeSourceTrace(refs) {
    return [
        ...new Map(refs.map((ref)=>[
                [
                    ref.sourceBlockId,
                    ref.rowId || "",
                    ref.ruleId || "",
                    ref.field || "",
                    ref.evidenceRefId || ""
                ].join(":"),
                ref
            ])).values()
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/calculation-rules/schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "normalizeCalculationRule",
    ()=>normalizeCalculationRule,
    "parseCalculationRules",
    ()=>parseCalculationRules
]);
const LIST_DELIMITER_REGEX = /[,;\n|]/;
function asRecord(value) {
    return typeof value === "object" && value !== null ? value : null;
}
function optionalString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function parseNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value !== "string") {
        return null;
    }
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
}
function parseOperand(value) {
    const numericValue = parseNumber(value);
    if (numericValue !== null) {
        return numericValue;
    }
    return optionalString(value) || null;
}
function parseOperands(value) {
    if (Array.isArray(value)) {
        return value.map(parseOperand).filter((operand)=>operand !== null);
    }
    if (typeof value === "string") {
        return value.split(LIST_DELIMITER_REGEX).map(parseOperand).filter((operand)=>operand !== null);
    }
    return [];
}
function parseOperation(value) {
    if (value === "abs" || value === "add" || value === "divide" || value === "max" || value === "max_subtract_zero" || value === "min" || value === "min_multiply_cap" || value === "multiply" || value === "pass_through" || value === "round" || value === "subtract") {
        return value;
    }
    return "add";
}
function humanizeId(value) {
    return value.replaceAll("_", " ").replace(/\b\w/g, (letter)=>letter.toUpperCase());
}
function normalizeCalculationRule(value, index) {
    const record = asRecord(value);
    if (!record) {
        return null;
    }
    const calculationId = optionalString(record.calculationId) || optionalString(record.nodeId) || optionalString(record.id);
    const resultKey = optionalString(record.resultKey) || optionalString(record.resultName) || calculationId;
    const operands = parseOperands(record.operands);
    if (!(calculationId && resultKey)) {
        return null;
    }
    return {
        calculationId,
        description: optionalString(record.description),
        formulaExpression: optionalString(record.formulaExpression) || optionalString(record.expression),
        label: optionalString(record.label) || optionalString(record.name) || humanizeId(calculationId || `calculation_${index + 1}`),
        operands,
        operation: parseOperation(record.operation),
        resultKey
    };
}
function parseCalculationRules({ config, fallbackRules }) {
    const ruleSource = config.calculationRules || config.calculation_rules || config.rules || config.nodes;
    if (!Array.isArray(ruleSource)) {
        return fallbackRules.map((rule)=>({
                ...rule,
                operands: [
                    ...rule.operands
                ]
            }));
    }
    const rules = ruleSource.map(normalizeCalculationRule).filter((rule)=>Boolean(rule));
    return rules.length > 0 ? rules : fallbackRules.map((rule)=>({
            ...rule,
            operands: [
                ...rule.operands
            ]
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/logic/calculation-engine/schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "collectCalculationRulesFromBackendInput",
    ()=>collectCalculationRulesFromBackendInput,
    "collectNamedValuesFromBackendInput",
    ()=>collectNamedValuesFromBackendInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$calculation$2d$rules$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/calculation-rules/schema.ts [app-client] (ecmascript)");
;
function asRecord(value) {
    return typeof value === "object" && value !== null ? value : null;
}
function parseNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value !== "string") {
        return null;
    }
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
}
function calculationRuleFromRecord(record, index) {
    const rule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$calculation$2d$rules$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeCalculationRule"])(record, index);
    return rule ? {
        ...rule,
        evidenceRefs: Array.isArray(record.evidenceRefs) ? record.evidenceRefs : undefined,
        sourceTrace: Array.isArray(record.sourceTrace) ? record.sourceTrace : undefined
    } : null;
}
function collectCalculationRulesFromBackendInput(value) {
    if (Array.isArray(value)) {
        return value.map((item)=>asRecord(item)).filter((item)=>Boolean(item)).map(calculationRuleFromRecord).filter((rule)=>Boolean(rule));
    }
    const record = asRecord(value);
    if (!record) {
        return [];
    }
    for (const key of [
        "calculationRules",
        "calculation_rules",
        "rules",
        "nodes"
    ]){
        const rules = record[key];
        if (Array.isArray(rules)) {
            return collectCalculationRulesFromBackendInput(rules);
        }
    }
    return [];
}
function collectNumericEntries(target, value) {
    const record = asRecord(value);
    if (!record) {
        return;
    }
    for (const [key, item] of Object.entries(record)){
        const numberValue = parseNumber(item);
        // Skip null AND undefined — an absent value must not clobber a value
        // supplied by an earlier input role (e.g. rollup-derived named values).
        if (numberValue !== null && numberValue !== undefined) {
            target[key] = numberValue;
        }
    }
}
function collectNumericEntryGroups(target, record) {
    for (const key of [
        "namedValues",
        "named_values",
        "categoryTotals",
        "category_totals",
        "rollupTotals",
        "rollup_totals",
        "calculatedResults",
        "calculated_results",
        "finalTotals",
        "final_totals",
        "officialLineValues",
        "official_line_values",
        "fapiInputs",
        "fapi_inputs"
    ]){
        collectNumericEntries(target, record[key]);
        const nestedRecord = asRecord(record[key]);
        if (nestedRecord) {
            collectInputAliases(target, nestedRecord);
            collectRateAliases(target, nestedRecord);
        }
    }
}
function collectInputAliases(target, record) {
    const fatPaid = parseNumber(record.fatPaid) ?? parseNumber(record.FAT_PAID);
    if (fatPaid !== null) {
        target.FAT_PAID = fatPaid;
        target.fatPaid = fatPaid;
    }
    const rtf = parseNumber(record.rtf) ?? parseNumber(record.RTF);
    if (rtf !== null) {
        target.RTF = rtf;
        target.rtf = rtf;
    }
    const inclusionRate = parseNumber(record.inclusionRate) ?? parseNumber(record.INCLUSION_RATE);
    if (inclusionRate !== null) {
        target.INCLUSION_RATE = inclusionRate;
        target.inclusionRate = inclusionRate;
    }
}
function collectRateAliases(target, record) {
    const rate = parseNumber(record.rate) ?? parseNumber(record.exchange_rate) ?? parseNumber(record.exchangeRate) ?? parseNumber(record.overrideRate) ?? parseNumber(record.fxRate) ?? parseNumber(record.FX_RATE);
    if (rate !== null) {
        target.FX_RATE = rate;
        target.fxRate = rate;
    }
}
function getProtectedResultName(protectedResult) {
    if (typeof protectedResult.name === "string") {
        return protectedResult.name;
    }
    if (typeof protectedResult.resultName === "string") {
        return protectedResult.resultName;
    }
    return "";
}
function collectProtectedResultValue(target, record) {
    const protectedResult = asRecord(record.protectedResult);
    if (!protectedResult) {
        return;
    }
    const protectedName = getProtectedResultName(protectedResult);
    const protectedValue = parseNumber(protectedResult.value);
    if (protectedName && protectedValue !== null) {
        target[protectedName] = protectedValue;
    }
}
function collectNamedValuesFromBackendInput(value) {
    const namedValues = {};
    if (Array.isArray(value)) {
        for (const item of value){
            for (const [key, itemValue] of collectNamedValuesFromBackendInput(item)){
                namedValues[key] = itemValue;
            }
        }
        return Object.entries(namedValues);
    }
    const record = asRecord(value);
    if (!record) {
        return [];
    }
    collectNumericEntryGroups(namedValues, record);
    collectNumericEntries(namedValues, record);
    collectInputAliases(namedValues, record);
    collectProtectedResultValue(namedValues, record);
    collectRateAliases(namedValues, record);
    return Object.entries(namedValues);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/logic/calculation-engine/run.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runCalculationEngine",
    ()=>runCalculationEngine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/events.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/lineage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$calculation$2d$engine$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/logic/calculation-engine/schema.ts [app-client] (ecmascript)");
;
;
;
const REFERENCE_PART_REGEX = /[A-Za-z0-9_:.@-]/;
const REFERENCE_START_REGEX = /[A-Za-z_]/;
const WHITESPACE_REGEX = /\s/;
const SUPPORTED_FORMULA_FUNCTIONS = new Set([
    "abs",
    "max",
    "max_subtract_zero",
    "min",
    "min_multiply_cap",
    "round"
]);
function getRoleInputs(context, role) {
    return context.inputsByRole[role] || [];
}
function getInlineRulesFromConfig(context) {
    const config = context.block.config;
    const formulas = config.formulas ?? config.calculationRules ?? config.inlineFormulas;
    if (!formulas) {
        return [];
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$calculation$2d$engine$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectCalculationRulesFromBackendInput"])(Array.isArray(formulas) ? formulas : {
        calculationRules: formulas
    });
}
function getCalculationMode(context) {
    const config = context.block.config;
    const mode = config.mode;
    if (mode === "inline" || mode === "external_rules") {
        return mode;
    }
    return "auto";
}
function getRules(context) {
    const mode = getCalculationMode(context);
    const externalRules = getRoleInputs(context, "calculation_rules").flatMap((input)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$calculation$2d$engine$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectCalculationRulesFromBackendInput"])(input));
    const inlineRules = getInlineRulesFromConfig(context);
    if (mode === "external_rules") {
        return {
            rules: externalRules,
            mode: "external_rules"
        };
    }
    if (mode === "inline") {
        return {
            rules: inlineRules,
            mode: "inline"
        };
    }
    // auto: prefer external if connected, else inline
    if (externalRules.length > 0) {
        return {
            rules: externalRules,
            mode: "auto:external"
        };
    }
    return {
        rules: inlineRules,
        mode: "auto:inline"
    };
}
function getNamedValues(context) {
    const values = {};
    for (const role of [
        "named_values",
        "protected_inputs",
        "fapi_inputs"
    ]){
        for (const input of getRoleInputs(context, role)){
            for (const [key, value] of (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$calculation$2d$engine$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectNamedValuesFromBackendInput"])(input)){
                values[key] = value;
            }
        }
    }
    return values;
}
function createErrorResult({ context, errors }) {
    return {
        blockId: context.block.id,
        completedAt: new Date().toISOString(),
        errors,
        evidenceRefs: [],
        logs: errors.map((message)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])(message)),
        outputs: {
            calculated_results: {
                calculatedResults: {},
                resultDetails: {}
            },
            calculation_summary: {
                calculatedCount: 0,
                inputCount: 0,
                ruleCount: 0,
                warningCount: 0
            },
            formula_trace: {
                formulaTrace: {}
            },
            named_values: {
                namedValues: {}
            }
        },
        primaryOutputRole: "calculation_summary",
        runId: context.runId,
        sourceTrace: [],
        startedAt: context.startedAt,
        status: "error",
        toolId: "logic.calculation_engine",
        warnings: []
    };
}
function getMissingInputErrors({ configMode, namedValues, rules }) {
    const errors = [];
    if (Object.keys(namedValues).length === 0) {
        errors.push("Calculation Engine needs named_values input.");
    }
    if (rules.length === 0) {
        if (configMode === "external_rules") {
            errors.push("external_rules mode requires a connected Calculation Rules Source.");
        } else if (configMode === "inline") {
            errors.push("inline mode requires formulas in the block config. Add at least one formula.");
        } else {
            errors.push("No formulas found. Add inline formulas to the Calculation Engine block config, or connect a Calculation Rules Source.");
        }
    }
    return errors;
}
function roundMoney(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}
// A RATE result (an FX / conversion factor) must NOT be rounded to money cents:
// 2dp rounding destroys its precision (1.3978 → 1.40) and then corrupts every
// amount multiplied by it — e.g. the *_CAD conversions FX_RATE feeds. Rates flow
// through at FULL precision here; only money amounts round to 2dp, and the final
// DISPLAY rounding happens at the surface (worksheet / snapshot formatting). The
// key heuristic matches the worksheet-intel `isRateKey` convention (_RATE suffix
// or FX prefix), so no money line is ever mistaken for a rate.
const RATE_RESULT_KEY = /_RATE$|^FX/i;
function roundResult(value, resultKey) {
    if (!Number.isFinite(value)) {
        return 0;
    }
    return RATE_RESULT_KEY.test(resultKey) ? value : roundMoney(value);
}
function isDigit(character) {
    return character >= "0" && character <= "9";
}
function isReferenceStart(character) {
    return REFERENCE_START_REGEX.test(character);
}
function isReferencePart(character) {
    return REFERENCE_PART_REGEX.test(character);
}
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Tokenization is deliberately local and supports calculator-style numbers, refs, operators, parentheses, and function commas.
function tokenizeFormulaExpression(expression) {
    const tokens = [];
    const warnings = [];
    let index = 0;
    while(index < expression.length){
        const character = expression[index];
        if (WHITESPACE_REGEX.test(character)) {
            index += 1;
            continue;
        }
        if (character === "(" || character === ")") {
            tokens.push({
                text: character,
                type: "paren",
                value: character
            });
            index += 1;
            continue;
        }
        if (character === ",") {
            tokens.push({
                text: character,
                type: "comma",
                value: character
            });
            index += 1;
            continue;
        }
        if (character === "+" || character === "-" || character === "*" || character === "/") {
            tokens.push({
                text: character,
                type: "operator",
                value: character
            });
            index += 1;
            continue;
        }
        if (isDigit(character) || character === ".") {
            let end = index + 1;
            while(end < expression.length && (isDigit(expression[end]) || expression[end] === ".")){
                end += 1;
            }
            const text = expression.slice(index, end);
            const value = Number(text);
            if (Number.isFinite(value)) {
                tokens.push({
                    text,
                    type: "number",
                    value
                });
            } else {
                warnings.push(`Invalid number "${text}" in formula expression.`);
            }
            index = end;
            continue;
        }
        if (isReferenceStart(character)) {
            let end = index + 1;
            while(end < expression.length && isReferencePart(expression[end])){
                end += 1;
            }
            const text = expression.slice(index, end);
            tokens.push({
                text,
                type: "identifier",
                value: text
            });
            index = end;
            continue;
        }
        warnings.push(`Unsupported formula character "${character}" was ignored.`);
        index += 1;
    }
    return {
        tokens,
        warnings
    };
}
function isSupportedFormulaFunction(name) {
    return SUPPORTED_FORMULA_FUNCTIONS.has(name.toLowerCase());
}
function collectFormulaReferences(expression) {
    const { tokens } = tokenizeFormulaExpression(expression);
    const refs = tokens.flatMap((token, index)=>{
        if (token.type !== "identifier") {
            return [];
        }
        const next = tokens[index + 1];
        if (next?.type === "paren" && next.value === "(" && isSupportedFormulaFunction(token.value)) {
            return [];
        }
        return [
            token.value
        ];
    });
    return [
        ...new Set(refs)
    ];
}
function resolveOperand({ namedValues, operand }) {
    if (typeof operand === "number") {
        return {
            missing: false,
            operand,
            value: operand
        };
    }
    const value = namedValues[operand];
    return {
        missing: value === undefined,
        operand,
        value: value ?? 0
    };
}
function createNumberFormulaValue(token) {
    return {
        display: token.text,
        resolvedOperands: [
            {
                missing: false,
                operand: token.value,
                value: token.value
            }
        ],
        value: token.value,
        warnings: []
    };
}
function createReferenceFormulaValue({ namedValues, reference }) {
    const resolved = resolveOperand({
        namedValues,
        operand: reference
    });
    return {
        display: `${reference}(${resolved.value})`,
        resolvedOperands: [
            resolved
        ],
        value: resolved.value,
        warnings: resolved.missing ? [
            `Missing operand ${reference}.`
        ] : []
    };
}
function mergeFormulaValues({ display, values, value, warnings }) {
    return {
        display,
        resolvedOperands: values.flatMap((item)=>item.resolvedOperands),
        value,
        warnings: [
            ...new Set([
                ...values.flatMap((item)=>item.warnings),
                ...warnings || []
            ])
        ]
    };
}
function applyFormulaFunction({ args, name, ruleId }) {
    const normalizedName = name.toLowerCase();
    const values = args.map((arg)=>arg.value);
    const warnings = [];
    const evaluators = {
        abs: ()=>Math.abs(values[0] ?? 0),
        max: ()=>values.length > 0 ? Math.max(...values) : 0,
        max_subtract_zero: ()=>Math.max((values[0] ?? 0) - (values[1] ?? 0), 0),
        min: ()=>values.length > 0 ? Math.min(...values) : 0,
        min_multiply_cap: ()=>Math.min(Math.max(values[0] ?? 0, 0) * (values[1] ?? 0), values[2] ?? 0),
        round: ()=>roundMoney(values[0] ?? 0)
    };
    const evaluator = evaluators[normalizedName];
    if (!evaluator) {
        warnings.push(`Unsupported formula function ${name} in ${ruleId}.`);
    }
    const value = evaluator ? evaluator() : values[0] ?? 0;
    return mergeFormulaValues({
        display: `${name}(${args.map((arg)=>arg.display).join(", ")})`,
        value,
        values: args,
        warnings
    });
}
function createFormulaParser({ namedValues, ruleId, tokens }) {
    let index = 0;
    const warnings = [];
    const peek = ()=>tokens[index];
    const consume = ()=>{
        const token = tokens[index];
        index += 1;
        return token;
    };
    const parseExpression = ()=>parseAdditive();
    const parseAdditive = ()=>{
        let left = parseMultiplicative();
        let operator = peek();
        while(operator?.type === "operator" && (operator.value === "+" || operator.value === "-")){
            const currentOperator = consume();
            if (currentOperator?.type !== "operator") {
                break;
            }
            const right = parseMultiplicative();
            const value = currentOperator.value === "+" ? left.value + right.value : left.value - right.value;
            left = mergeFormulaValues({
                display: `(${left.display} ${currentOperator.value} ${right.display})`,
                value,
                values: [
                    left,
                    right
                ]
            });
            operator = peek();
        }
        return left;
    };
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Multiplicative parsing handles multiply/divide precedence plus divide-by-zero recovery.
    const parseMultiplicative = ()=>{
        let left = parseUnary();
        let operator = peek();
        while(operator?.type === "operator" && (operator.value === "*" || operator.value === "/")){
            const currentOperator = consume();
            if (currentOperator?.type !== "operator") {
                break;
            }
            const right = parseUnary();
            const operationWarnings = [];
            let value = left.value * right.value;
            if (currentOperator.value === "/" && right.value !== 0) {
                value = left.value / right.value;
            }
            if (currentOperator.value === "/" && right.value === 0) {
                value = 0;
            }
            if (currentOperator.value === "/" && right.value === 0) {
                operationWarnings.push(`Divide by zero in ${ruleId}.`);
            }
            left = mergeFormulaValues({
                display: `(${left.display} ${currentOperator.value} ${right.display})`,
                value,
                values: [
                    left,
                    right
                ],
                warnings: operationWarnings
            });
            operator = peek();
        }
        return left;
    };
    const parseUnary = ()=>{
        const token = peek();
        if (token?.type === "operator" && token.value === "-") {
            consume();
            const value = parseUnary();
            return mergeFormulaValues({
                display: `-${value.display}`,
                value: -value.value,
                values: [
                    value
                ]
            });
        }
        return parsePrimary();
    };
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Function calls need to parse comma-separated nested expressions and recover from malformed input.
    const parseFunctionCall = (name)=>{
        consume();
        const args = [];
        while(index < tokens.length){
            const token = peek();
            if (token?.type === "paren" && token.value === ")") {
                consume();
                break;
            }
            args.push(parseExpression());
            if (peek()?.type === "comma") {
                consume();
                continue;
            }
            if (peek()?.type === "paren" && peek().value === ")") {
                continue;
            }
            if (index < tokens.length) {
                warnings.push(`Expected comma or closing parenthesis in ${ruleId}.`);
                break;
            }
        }
        return applyFormulaFunction({
            args,
            name,
            ruleId
        });
    };
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Primary parsing handles all base token types for the local expression grammar.
    const parsePrimary = ()=>{
        const token = consume();
        if (!token) {
            warnings.push(`Formula expression in ${ruleId} is missing a value.`);
            return {
                display: "0",
                resolvedOperands: [],
                value: 0,
                warnings: []
            };
        }
        if (token.type === "number") {
            return createNumberFormulaValue(token);
        }
        if (token.type === "identifier") {
            const next = peek();
            if (next?.type === "paren" && next.value === "(" && isSupportedFormulaFunction(token.value)) {
                return parseFunctionCall(token.value);
            }
            return createReferenceFormulaValue({
                namedValues,
                reference: token.value
            });
        }
        if (token.type === "paren" && token.value === "(") {
            const value = parseExpression();
            if (peek()?.type === "paren" && peek().value === ")") {
                consume();
            } else {
                warnings.push(`Formula expression in ${ruleId} has an unmatched parenthesis.`);
            }
            return value;
        }
        warnings.push(`Unexpected token "${token.text}" in ${ruleId}.`);
        return {
            display: "0",
            resolvedOperands: [],
            value: 0,
            warnings: []
        };
    };
    return {
        parse () {
            const value = parseExpression();
            if (index < tokens.length) {
                warnings.push(`Formula expression in ${ruleId} has unused tokens.`);
            }
            return {
                ...value,
                warnings: [
                    ...new Set([
                        ...warnings,
                        ...value.warnings
                    ])
                ]
            };
        }
    };
}
function evaluateFormulaExpression({ expression, namedValues, resultKey, ruleId }) {
    const tokenized = tokenizeFormulaExpression(expression);
    const parsed = createFormulaParser({
        namedValues,
        ruleId,
        tokens: tokenized.tokens
    }).parse();
    const warnings = [
        ...new Set([
            ...tokenized.warnings,
            ...parsed.warnings
        ])
    ];
    const result = roundResult(parsed.value, resultKey);
    return {
        expression: `${parsed.display} = ${result}`,
        resolvedOperands: parsed.resolvedOperands,
        result,
        warnings
    };
}
const OPERATION_EVALUATORS = {
    abs: (values)=>Math.abs(values[0] ?? 0),
    add: (values)=>values.reduce((result, value)=>result + value, 0),
    divide: (values)=>values.slice(1).reduce((result, value)=>value === 0 ? Number.NaN : result / value, values[0]),
    max: (values)=>Math.max(...values),
    max_subtract_zero: (values)=>Math.max((values[0] ?? 0) - (values[1] ?? 0), 0),
    min: (values)=>Math.min(...values),
    min_multiply_cap: (values)=>Math.min(Math.max(values[0] ?? 0, 0) * (values[1] ?? 0), values[2] ?? 0),
    multiply: (values)=>values.reduce((result, value)=>result * value, 1),
    pass_through: (values)=>values[0] ?? 0,
    round: (values)=>roundMoney(values[0] ?? 0),
    subtract: (values)=>values.slice(1).reduce((result, value)=>result - value, values[0])
};
function applyOperation(rule, values) {
    return OPERATION_EVALUATORS[rule.operation](values);
}
function ruleCanRun({ namedValues, rule }) {
    const formulaExpression = rule.formulaExpression?.trim();
    if (formulaExpression) {
        return collectFormulaReferences(formulaExpression).every((reference)=>namedValues[reference] !== undefined);
    }
    return rule.operands.every((operand)=>typeof operand === "number" || namedValues[operand] !== undefined);
}
function evaluateRule({ namedValues, rule }) {
    const formulaExpression = rule.formulaExpression?.trim();
    if (formulaExpression) {
        return evaluateFormulaExpression({
            expression: formulaExpression,
            namedValues,
            resultKey: rule.resultKey,
            ruleId: rule.calculationId
        });
    }
    const resolvedOperands = rule.operands.map((operand)=>resolveOperand({
            namedValues,
            operand
        }));
    const warnings = resolvedOperands.filter((operand)=>operand.missing).map((operand)=>`Missing operand ${String(operand.operand)}.`);
    const divideByZero = rule.operation === "divide" && resolvedOperands.slice(1).some((operand)=>operand.value === 0);
    if (divideByZero) {
        warnings.push(`Divide by zero in ${rule.calculationId}.`);
    }
    const rawResult = divideByZero ? 0 : applyOperation(rule, resolvedOperands.map((operand)=>operand.value));
    const result = roundResult(rawResult, rule.resultKey);
    return {
        resolvedOperands,
        result,
        warnings
    };
}
function getRuleExpression(rule) {
    if (rule.formulaExpression?.trim()) {
        return `${rule.resultKey} = ${rule.formulaExpression.trim()}`;
    }
    return `${rule.resultKey} = ${rule.operation}(${rule.operands.map(String).join(", ")})`;
}
function runCalculationEngine(context) {
    const { rules, mode: resolvedMode } = getRules(context);
    const configMode = getCalculationMode(context);
    const namedValues = getNamedValues(context);
    const missingErrors = getMissingInputErrors({
        configMode,
        namedValues,
        rules
    });
    if (missingErrors.length > 0) {
        return createErrorResult({
            context,
            errors: missingErrors
        });
    }
    const pendingRules = [
        ...rules
    ];
    const calculatedResults = {};
    const resultDetails = {};
    const formulaTrace = {};
    const warnings = [];
    let progressed = true;
    while(pendingRules.length > 0 && progressed){
        progressed = false;
        for(let index = pendingRules.length - 1; index >= 0; index -= 1){
            const rule = pendingRules[index];
            if (!ruleCanRun({
                namedValues,
                rule
            })) {
                continue;
            }
            const evaluation = evaluateRule({
                namedValues,
                rule
            });
            namedValues[rule.resultKey] = evaluation.result;
            calculatedResults[rule.resultKey] = evaluation.result;
            resultDetails[rule.resultKey] = {
                calculationId: rule.calculationId,
                description: rule.description,
                label: rule.label,
                operation: rule.operation,
                result: evaluation.result,
                resultKey: rule.resultKey,
                warnings: evaluation.warnings
            };
            formulaTrace[rule.resultKey] = {
                calculationId: rule.calculationId,
                expression: getRuleExpression(rule),
                inputValues: evaluation.resolvedOperands.map((operand)=>({
                        operand: operand.operand,
                        value: operand.value
                    })),
                operation: rule.operation,
                result: evaluation.result,
                warnings: evaluation.warnings
            };
            warnings.push(...evaluation.warnings);
            pendingRules.splice(index, 1);
            progressed = true;
        }
    }
    for (const rule of pendingRules){
        const evaluation = evaluateRule({
            namedValues,
            rule
        });
        namedValues[rule.resultKey] = evaluation.result;
        calculatedResults[rule.resultKey] = evaluation.result;
        resultDetails[rule.resultKey] = {
            calculationId: rule.calculationId,
            description: rule.description,
            label: rule.label,
            operation: rule.operation,
            result: evaluation.result,
            resultKey: rule.resultKey,
            warnings: evaluation.warnings
        };
        formulaTrace[rule.resultKey] = {
            calculationId: rule.calculationId,
            expression: getRuleExpression(rule),
            inputValues: evaluation.resolvedOperands.map((operand)=>({
                    operand: operand.operand,
                    value: operand.value
                })),
            operation: rule.operation,
            result: evaluation.result,
            warnings: evaluation.warnings
        };
        warnings.push(`Calculation ${rule.calculationId} ran with unresolved dependency values.`, ...evaluation.warnings);
    }
    const sourceTrace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dedupeSourceTrace"])(context.sourceTrace || []);
    const evidenceRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dedupeEvidenceRefs"])(context.evidenceRefs || []);
    const calculationSummary = {
        calculatedCount: Object.keys(calculatedResults).length,
        formulaMode: resolvedMode,
        inputCount: Object.keys(namedValues).length,
        ruleCount: rules.length,
        warningCount: warnings.length
    };
    return {
        blockId: context.block.id,
        completedAt: new Date().toISOString(),
        errors: [],
        evidenceRefs,
        logs: [
            warnings.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warning"])("Calculation Engine completed with warnings.", calculationSummary) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["info"])("Calculation Engine completed.", calculationSummary)
        ],
        outputs: {
            calculated_results: {
                calculatedResults,
                resultDetails
            },
            calculation_summary: calculationSummary,
            formula_trace: {
                formulaTrace
            },
            named_values: {
                namedValues
            }
        },
        primaryOutputRole: "calculated_results",
        runId: context.runId,
        sourceTrace,
        startedAt: context.startedAt,
        status: warnings.length > 0 ? "warning" : "success",
        toolId: "logic.calculation_engine",
        warnings
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/logic/calculation-engine/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculationEngineToolModule",
    ()=>calculationEngineToolModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$calculation$2d$engine$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/logic/calculation-engine/definition.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$calculation$2d$engine$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/logic/calculation-engine/run.ts [app-client] (ecmascript)");
;
;
const calculationEngineToolModule = {
    definition: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$calculation$2d$engine$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculationEngineDefinition"],
    run: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$calculation$2d$engine$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runCalculationEngine"]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/logic/category-rollup-aggregator/definition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categoryRollupAggregatorDefinition",
    ()=>categoryRollupAggregatorDefinition
]);
const categoryRollupAggregatorDefinition = {
    defaultConfig: {},
    description: "Groups mapped rows by category and applies rollup rules to produce subtotal buckets.",
    displayName: "Category Rollup Aggregator",
    family: "Logic",
    inputRoles: [
        {
            acceptedFamilies: [
                "Logic"
            ],
            acceptedOutputTypes: [
                "mapped_rows"
            ],
            allowMultiple: true,
            description: "Rows mapped by Keyword Mapper into atomic categories.",
            id: "mapped_rows",
            label: "Mapped rows",
            required: true
        },
        {
            acceptedFamilies: [
                "Source"
            ],
            acceptedOutputTypes: [
                "rollup_rules",
                "aggregation_rules"
            ],
            acceptedSourceKinds: [
                "rollup_rules",
                "aggregation_rules"
            ],
            allowMultiple: true,
            description: "Rollup rules that group mapped categories into subtotals.",
            id: "rollup_rules",
            label: "Rollup rules",
            required: true
        }
    ],
    outputRoles: [
        {
            canRouteToFamilies: [
                "Logic",
                "Output",
                "Review / Validation"
            ],
            description: "Totals by mapped category.",
            id: "category_totals",
            label: "Category totals",
            outputKey: "categoryTotals",
            outputType: "category_totals"
        },
        {
            canRouteToFamilies: [
                "Logic",
                "Output",
                "Review / Validation"
            ],
            description: "Totals by rollup rule.",
            id: "rollup_totals",
            label: "Rollup totals",
            outputKey: "rollupTotals",
            outputType: "rollup_totals"
        },
        {
            canRouteToFamilies: [
                "Logic",
                "Output",
                "Review / Validation"
            ],
            description: "Category and rollup totals exposed as named numeric values.",
            id: "named_values",
            label: "Named values",
            outputKey: "namedValues",
            outputType: "named_values"
        },
        {
            canRouteToFamilies: [
                "Output",
                "Review / Validation"
            ],
            description: "Rows included by category.",
            id: "included_rows_by_category",
            label: "Included rows by category",
            outputKey: "includedRowsByCategory",
            outputType: "included_rows"
        },
        {
            canRouteToFamilies: [
                "Output",
                "Review / Validation"
            ],
            description: "Rows included by rollup.",
            id: "included_rows_by_rollup",
            label: "Included rows by rollup",
            outputKey: "includedRowsByRollup",
            outputType: "included_rows"
        },
        {
            canRouteToFamilies: [
                "Output",
                "Review / Validation"
            ],
            description: "Mapped rows not included by any rollup rule.",
            id: "excluded_rows",
            label: "Excluded rows",
            outputKey: "excludedRows",
            outputType: "excluded_rows"
        },
        {
            canRouteToFamilies: [
                "Output",
                "Review / Validation"
            ],
            description: "Trace of category summing and rollup calculations.",
            id: "rollup_formula_trace",
            label: "Rollup trace",
            outputKey: "rollupFormulaTrace",
            outputType: "rollup_formula_trace"
        },
        {
            canRouteToFamilies: [
                "Output",
                "Review / Validation"
            ],
            description: "Summary of rollup execution.",
            id: "rollup_summary",
            label: "Rollup summary",
            outputKey: "rollupSummary",
            outputType: "rollup_summary"
        }
    ],
    runMode: "local_mock",
    subtype: "Category Rollup Aggregator",
    toolGroup: "calculation",
    toolId: "logic.category_rollup_aggregator"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/rollup-rules/schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "normalizeRollupRule",
    ()=>normalizeRollupRule,
    "parseRollupRules",
    ()=>parseRollupRules
]);
const LIST_DELIMITER_REGEX = /[,;\n|]/;
function asRecord(value) {
    return typeof value === "object" && value !== null ? value : null;
}
function asStringArray(value) {
    if (Array.isArray(value)) {
        return value.flatMap((item)=>String(item).split(LIST_DELIMITER_REGEX)).map((item)=>item.trim()).filter(Boolean);
    }
    if (typeof value === "string") {
        return value.split(LIST_DELIMITER_REGEX).map((item)=>item.trim()).filter(Boolean);
    }
    return [];
}
function optionalString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function parseOperation(value) {
    return value === "sum_abs" ? "sum_abs" : "sum";
}
function humanizeId(value) {
    return value.replaceAll("_", " ").replace(/\b\w/g, (letter)=>letter.toUpperCase());
}
function normalizeRollupRule(value, index) {
    const record = asRecord(value);
    if (!record) {
        return null;
    }
    const rollupId = optionalString(record.rollupId) || optionalString(record.nodeId) || optionalString(record.id);
    const includeCategoryIds = asStringArray(record.includeCategoryIds || record.categories || record.categoryIds);
    if (!(rollupId && includeCategoryIds.length > 0)) {
        return null;
    }
    return {
        description: optionalString(record.description),
        includeCategoryIds,
        label: optionalString(record.label) || optionalString(record.name) || humanizeId(rollupId || `rollup_${index + 1}`),
        operation: parseOperation(record.operation),
        rollupId
    };
}
function parseRollupRules({ config, fallbackRules }) {
    const ruleSource = config.rollupRules || config.rollup_rules || config.aggregationRules || config.rules;
    if (!Array.isArray(ruleSource)) {
        return fallbackRules.map((rule)=>({
                ...rule,
                includeCategoryIds: [
                    ...rule.includeCategoryIds
                ]
            }));
    }
    const rules = ruleSource.map(normalizeRollupRule).filter((rule)=>Boolean(rule));
    return rules.length > 0 ? rules : fallbackRules.map((rule)=>({
            ...rule,
            includeCategoryIds: [
                ...rule.includeCategoryIds
            ]
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/aggregation-rules/schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "normalizeAggregationRule",
    ()=>normalizeAggregationRule,
    "parseAggregationRules",
    ()=>parseAggregationRules
]);
const SIGN_PREFIX_REGEX = /^[+-]/;
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
function optionalString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function parseNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value !== "string") {
        return;
    }
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : undefined;
}
function parseNodeType(value) {
    if (value === "category_total" || value === "constant" || value === "final_result" || value === "formula" || value === "group") {
        return value;
    }
    if (value === "category") {
        return "category_total";
    }
    return "group";
}
function parseOperation(value) {
    if (value === "add" || value === "divide" || value === "max_subtract_zero" || value === "min_multiply_cap" || value === "multiply" || value === "pass_through" || value === "subtract" || value === "sum" || value === "sum_abs") {
        return value;
    }
    return "sum";
}
function normalizeStringOperand(value) {
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }
    const sign = trimmed.startsWith("-") ? -1 : 1;
    const token = trimmed.replace(SIGN_PREFIX_REGEX, "").trim();
    const [prefix, ...rest] = token.split(":");
    const body = rest.length > 0 ? rest.join(":").trim() : prefix.trim();
    const normalizedPrefix = rest.length > 0 ? prefix.trim().toLowerCase() : "";
    if (normalizedPrefix === "category") {
        return {
            refId: body,
            refType: "category",
            sign
        };
    }
    if (normalizedPrefix === "constant" || normalizedPrefix === "value") {
        return {
            refType: "constant",
            sign,
            value: parseNumber(body) ?? 0
        };
    }
    if (normalizedPrefix === "input") {
        return {
            refId: body,
            refType: "input",
            sign
        };
    }
    return {
        refId: body,
        refType: "node",
        sign
    };
}
function normalizeRecordOperand(record) {
    const refType = record.refType === "category" || record.refType === "constant" || record.refType === "input" ? record.refType : "node";
    const operand = {
        label: optionalString(record.label),
        refId: optionalString(record.refId),
        refType,
        sign: record.sign === -1 || record.sign === "-1" ? -1 : 1,
        value: parseNumber(record.value)
    };
    return operand.refId || operand.value !== undefined ? operand : null;
}
function normalizeOperand(value) {
    if (typeof value === "string") {
        return normalizeStringOperand(value);
    }
    if (typeof value === "number" && Number.isFinite(value)) {
        return {
            refType: "constant",
            value
        };
    }
    const record = asRecord(value);
    return record ? normalizeRecordOperand(record) : null;
}
function parseOperands(value) {
    if (Array.isArray(value)) {
        return value.map(normalizeOperand).filter((operand)=>Boolean(operand));
    }
    const refs = asStringArray(value);
    return refs.map((refId)=>({
            refId,
            refType: "node"
        }));
}
function normalizeAggregationRule(value, index) {
    const record = asRecord(value);
    if (!record) {
        return null;
    }
    const nodeId = optionalString(record.nodeId) || optionalString(record.id);
    if (!nodeId) {
        return null;
    }
    return {
        children: asStringArray(record.children),
        description: optionalString(record.description),
        includeCategoryIds: asStringArray(record.includeCategoryIds),
        label: optionalString(record.label) || `Aggregation node ${index + 1}`,
        nodeId,
        nodeType: parseNodeType(record.nodeType),
        operands: parseOperands(record.operands),
        formulaExpression: optionalString(record.formulaExpression) || optionalString(record.expression),
        operation: parseOperation(record.operation),
        order: parseNumber(record.order),
        outputRole: optionalString(record.outputRole),
        resultName: optionalString(record.resultName),
        value: parseNumber(record.value)
    };
}
function parseAggregationRules({ config, fallbackRules }) {
    const ruleSource = config.aggregationRules || config.aggregation_rules || config.rules || config.nodes;
    if (!Array.isArray(ruleSource)) {
        return fallbackRules.map((rule)=>({
                ...rule,
                children: [
                    ...rule.children
                ],
                includeCategoryIds: [
                    ...rule.includeCategoryIds || []
                ],
                operands: [
                    ...rule.operands || []
                ],
                formulaExpression: rule.formulaExpression
            }));
    }
    const rules = ruleSource.map(normalizeAggregationRule).filter((rule)=>Boolean(rule));
    return rules.length > 0 ? rules : fallbackRules.map((rule)=>({
            ...rule,
            children: [
                ...rule.children
            ],
            includeCategoryIds: [
                ...rule.includeCategoryIds || []
            ],
            operands: [
                ...rule.operands || []
            ],
            formulaExpression: rule.formulaExpression
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/logic/hierarchy-aggregator/schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "collectAggregationRulesFromBackendInput",
    ()=>collectAggregationRulesFromBackendInput,
    "collectMappedRowsFromBackendInput",
    ()=>collectMappedRowsFromBackendInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$aggregation$2d$rules$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/aggregation-rules/schema.ts [app-client] (ecmascript)");
;
const NUMBER_PATTERN = /-?\d+(\.\d+)?/;
function asRecord(value) {
    return typeof value === "object" && value !== null ? value : null;
}
function parseNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value !== "string") {
        return null;
    }
    const match = value.trim().match(NUMBER_PATTERN);
    if (!match) {
        return null;
    }
    const parsed = Number(match[0]);
    return Number.isFinite(parsed) ? parsed : null;
}
function optionalString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function optionalTraceArray(value) {
    return Array.isArray(value) ? value : undefined;
}
function optionalRowNumber(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
function rowFromRecord(record, index) {
    const amount = parseNumber(record.amount) ?? parseNumber(record.value) ?? parseNumber(record.subtotal);
    const categoryId = optionalString(record.categoryId) || optionalString(record.target) || optionalString(record.subsectionId);
    if (amount === null || !categoryId) {
        return null;
    }
    return {
        account: optionalString(record.account),
        amount,
        categoryId,
        categoryLabel: optionalString(record.categoryLabel) || categoryId.replaceAll("_", " "),
        confidence: parseNumber(record.confidence) ?? undefined,
        currency: optionalString(record.currency),
        description: optionalString(record.description),
        evidenceRefs: Array.isArray(record.evidenceRefs) ? record.evidenceRefs : undefined,
        label: String(record.label || record.name || `Mapped row ${index + 1}`),
        matchedKeyword: optionalString(record.matchedKeyword),
        matchedRuleId: optionalString(record.matchedRuleId),
        metadata: asRecord(record.metadata) || undefined,
        raw: asRecord(record.raw) || undefined,
        rowId: String(record.rowId || record.id || `mapped-row-${index + 1}`),
        rowNumber: optionalRowNumber(record.rowNumber),
        ruleId: optionalString(record.ruleId),
        ruleSourceTrace: optionalTraceArray(record.ruleSourceTrace),
        ruleTrace: optionalTraceArray(record.ruleTrace),
        sourceRow: asRecord(record.sourceRow),
        sourceTrace: optionalTraceArray(record.sourceTrace),
        status: optionalString(record.status)
    };
}
function collectMappedRowsFromBackendInput(value) {
    if (Array.isArray(value)) {
        return value.map((item)=>asRecord(item)).filter((item)=>Boolean(item)).map(rowFromRecord).filter((row)=>Boolean(row));
    }
    const record = asRecord(value);
    if (!record) {
        return [];
    }
    for (const key of [
        "mappedRows",
        "mapped_rows",
        "rows"
    ]){
        const rows = record[key];
        if (Array.isArray(rows)) {
            return collectMappedRowsFromBackendInput(rows);
        }
    }
    return [];
}
function aggregationRuleFromRecord(record, index) {
    const rule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$aggregation$2d$rules$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAggregationRule"])(record, index);
    return rule ? {
        ...rule,
        evidenceRefs: Array.isArray(record.evidenceRefs) ? record.evidenceRefs : undefined,
        sourceTrace: optionalTraceArray(record.sourceTrace)
    } : null;
}
function collectAggregationRulesFromBackendInput(value) {
    if (Array.isArray(value)) {
        return value.map((item)=>asRecord(item)).filter((item)=>Boolean(item)).map(aggregationRuleFromRecord).filter((rule)=>Boolean(rule));
    }
    const record = asRecord(value);
    if (!record) {
        return [];
    }
    for (const key of [
        "aggregationRules",
        "aggregation_rules",
        "rules",
        "nodes"
    ]){
        const rules = record[key];
        if (Array.isArray(rules)) {
            return collectAggregationRulesFromBackendInput(rules);
        }
    }
    return [];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/logic/category-rollup-aggregator/schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "collectMappedRowsFromRollupInput",
    ()=>collectMappedRowsFromRollupInput,
    "collectRollupRulesFromBackendInput",
    ()=>collectRollupRulesFromBackendInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$rollup$2d$rules$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/rollup-rules/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$hierarchy$2d$aggregator$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/logic/hierarchy-aggregator/schema.ts [app-client] (ecmascript)");
;
;
function asRecord(value) {
    return typeof value === "object" && value !== null ? value : null;
}
function rollupRuleFromRecord(record, index) {
    const rule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$rollup$2d$rules$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeRollupRule"])(record, index);
    return rule ? {
        ...rule,
        evidenceRefs: Array.isArray(record.evidenceRefs) ? record.evidenceRefs : undefined,
        sourceTrace: Array.isArray(record.sourceTrace) ? record.sourceTrace : undefined
    } : null;
}
function collectRollupRulesFromBackendInput(value) {
    if (Array.isArray(value)) {
        return value.map((item)=>asRecord(item)).filter((item)=>Boolean(item)).map(rollupRuleFromRecord).filter((rule)=>Boolean(rule));
    }
    const record = asRecord(value);
    if (!record) {
        return [];
    }
    for (const key of [
        "rollupRules",
        "rollup_rules",
        "aggregationRules",
        "aggregation_rules",
        "rules"
    ]){
        const rules = record[key];
        if (Array.isArray(rules)) {
            return collectRollupRulesFromBackendInput(rules);
        }
    }
    return [];
}
function collectMappedRowsFromRollupInput(value) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$hierarchy$2d$aggregator$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectMappedRowsFromBackendInput"])(value);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/logic/category-rollup-aggregator/run.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runCategoryRollupAggregator",
    ()=>runCategoryRollupAggregator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/events.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/lineage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$category$2d$rollup$2d$aggregator$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/logic/category-rollup-aggregator/schema.ts [app-client] (ecmascript)");
;
;
;
function getRoleInputs(context, role) {
    return context.inputsByRole[role] || [];
}
function getMappedRows(context) {
    return getRoleInputs(context, "mapped_rows").flatMap((input)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$category$2d$rollup$2d$aggregator$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectMappedRowsFromRollupInput"])(input));
}
function getRollupRules(context) {
    const fromUpstream = getRoleInputs(context, "rollup_rules").flatMap((input)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$category$2d$rollup$2d$aggregator$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectRollupRulesFromBackendInput"])(input));
    if (fromUpstream.length > 0) return fromUpstream;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$category$2d$rollup$2d$aggregator$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectRollupRulesFromBackendInput"])(context.config);
}
function sumRows(rows) {
    return rows.reduce((total, row)=>total + row.amount, 0);
}
function traceRows(rows) {
    return rows.flatMap((row)=>row.sourceTrace || []);
}
function evidenceRows(rows) {
    return rows.flatMap((row)=>row.evidenceRefs || []);
}
function traceRules(rules) {
    return rules.flatMap((rule)=>rule.sourceTrace || []);
}
function evidenceRules(rules) {
    return rules.flatMap((rule)=>rule.evidenceRefs || []);
}
function createErrorResult({ context, errors }) {
    return {
        blockId: context.block.id,
        completedAt: new Date().toISOString(),
        errors,
        evidenceRefs: [],
        logs: errors.map((message)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])(message)),
        outputs: {
            category_totals: {
                categoryTotals: {},
                categoryTotalDetails: {}
            },
            excluded_rows: {
                excludedRows: [],
                rowCount: 0
            },
            included_rows_by_category: {
                includedRowsByCategory: {}
            },
            included_rows_by_rollup: {
                includedRowsByRollup: {}
            },
            named_values: {
                namedValues: {}
            },
            rollup_formula_trace: {
                rollupFormulaTrace: {}
            },
            rollup_summary: {
                categoryCount: 0,
                mappedRowCount: 0,
                rollupCount: 0,
                warningCount: 0
            },
            rollup_totals: {
                rollupTotals: {},
                rollupTotalDetails: {}
            }
        },
        primaryOutputRole: "rollup_summary",
        runId: context.runId,
        sourceTrace: [],
        startedAt: context.startedAt,
        status: "error",
        toolId: "logic.category_rollup_aggregator",
        warnings: []
    };
}
function getMissingInputErrors({ rows, rules }) {
    return [
        rows.length === 0 ? "Category Rollup Aggregator needs mapped_rows input." : "",
        rules.length === 0 ? "Category Rollup Aggregator needs rollup_rules input." : ""
    ].filter(Boolean);
}
function getCategoryDetails(rows) {
    const byCategory = new Map();
    for (const row of rows){
        byCategory.set(row.categoryId, [
            ...byCategory.get(row.categoryId) || [],
            row
        ]);
    }
    return Object.fromEntries([
        ...byCategory.entries()
    ].map(([categoryId, categoryRows])=>{
        const first = categoryRows[0];
        const detail = {
            categoryId,
            categoryLabel: first?.categoryLabel || categoryId,
            includedRows: categoryRows.map((row)=>row.rowId),
            rowCount: categoryRows.length,
            value: sumRows(categoryRows)
        };
        return [
            categoryId,
            detail
        ];
    }));
}
function getCategoryTotals(details) {
    return Object.fromEntries(Object.entries(details).map(([categoryId, detail])=>[
            categoryId,
            detail.value
        ]));
}
function evaluateRollup({ categoryDetails, rule }) {
    const inputValues = rule.includeCategoryIds.map((categoryId)=>({
            categoryId,
            value: categoryDetails[categoryId]?.value ?? 0
        }));
    const missingCategoryIds = rule.includeCategoryIds.filter((categoryId)=>!categoryDetails[categoryId]);
    const result = inputValues.reduce((total, input)=>{
        const value = rule.operation === "sum_abs" ? Math.abs(input.value) : input.value;
        return total + value;
    }, 0);
    const warnings = missingCategoryIds.map((categoryId)=>`Missing category reference: ${categoryId}.`);
    return {
        inputValues,
        result,
        warnings
    };
}
function runCategoryRollupAggregator(context) {
    const rows = getMappedRows(context);
    const rules = getRollupRules(context);
    const missingErrors = getMissingInputErrors({
        rows,
        rules
    });
    if (missingErrors.length > 0) {
        return createErrorResult({
            context,
            errors: missingErrors
        });
    }
    const categoryDetails = getCategoryDetails(rows);
    const categoryTotals = getCategoryTotals(categoryDetails);
    const rollupTotals = {};
    const rollupTotalDetails = {};
    const includedRowsByRollup = {};
    const rollupFormulaTrace = {};
    const warnings = [];
    const includedCategoryIds = new Set();
    for (const rule of rules){
        const rollup = evaluateRollup({
            categoryDetails,
            rule
        });
        rollupTotals[rule.rollupId] = rollup.result;
        for (const categoryId of rule.includeCategoryIds){
            includedCategoryIds.add(categoryId);
        }
        const rollupRows = rows.filter((row)=>rule.includeCategoryIds.includes(row.categoryId));
        includedRowsByRollup[rule.rollupId] = rollupRows;
        rollupTotalDetails[rule.rollupId] = {
            includedCategoryIds: rule.includeCategoryIds,
            label: rule.label,
            operation: rule.operation,
            result: rollup.result,
            rollupId: rule.rollupId,
            warnings: rollup.warnings
        };
        rollupFormulaTrace[rule.rollupId] = {
            description: rule.description,
            formula: rule.operation === "sum_abs" ? `sum_abs(${rule.includeCategoryIds.join(", ")})` : `sum(${rule.includeCategoryIds.join(", ")})`,
            inputValues: rollup.inputValues,
            operation: rule.operation,
            result: rollup.result,
            rollupId: rule.rollupId,
            warnings: rollup.warnings
        };
        warnings.push(...rollup.warnings);
    }
    const excludedRows = rows.filter((row)=>!includedCategoryIds.has(row.categoryId));
    const includedRowsByCategory = Object.fromEntries(Object.entries(categoryDetails).map(([categoryId, detail])=>[
            categoryId,
            rows.filter((row)=>detail.includedRows.includes(row.rowId))
        ]));
    const namedValues = {
        ...categoryTotals,
        ...rollupTotals
    };
    const sourceTrace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dedupeSourceTrace"])([
        ...traceRows(rows),
        ...traceRules(rules)
    ]);
    const evidenceRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dedupeEvidenceRefs"])([
        ...evidenceRows(rows),
        ...evidenceRules(rules)
    ]);
    const rollupSummary = {
        categoryCount: Object.keys(categoryTotals).length,
        excludedRowCount: excludedRows.length,
        mappedRowCount: rows.length,
        namedValueCount: Object.keys(namedValues).length,
        rollupCount: rules.length,
        warningCount: warnings.length
    };
    return {
        blockId: context.block.id,
        completedAt: new Date().toISOString(),
        errors: [],
        evidenceRefs,
        logs: [
            warnings.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warning"])("Category rollup completed with warnings.", rollupSummary) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["info"])("Category rollup completed.", rollupSummary)
        ],
        outputs: {
            category_totals: {
                categoryTotalDetails: categoryDetails,
                categoryTotals
            },
            excluded_rows: {
                excludedRows,
                rowCount: excludedRows.length
            },
            included_rows_by_category: {
                includedRowsByCategory
            },
            included_rows_by_rollup: {
                includedRowsByRollup
            },
            named_values: {
                namedValues,
                sourceKind: "rollup_named_values"
            },
            rollup_formula_trace: {
                rollupFormulaTrace
            },
            rollup_summary: rollupSummary,
            rollup_totals: {
                rollupTotalDetails,
                rollupTotals
            }
        },
        primaryOutputRole: "named_values",
        runId: context.runId,
        sourceTrace,
        startedAt: context.startedAt,
        status: warnings.length > 0 ? "warning" : "success",
        toolId: "logic.category_rollup_aggregator",
        warnings
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/logic/category-rollup-aggregator/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categoryRollupAggregatorToolModule",
    ()=>categoryRollupAggregatorToolModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$category$2d$rollup$2d$aggregator$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/logic/category-rollup-aggregator/definition.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$category$2d$rollup$2d$aggregator$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/logic/category-rollup-aggregator/run.ts [app-client] (ecmascript)");
;
;
const categoryRollupAggregatorToolModule = {
    definition: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$category$2d$rollup$2d$aggregator$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categoryRollupAggregatorDefinition"],
    run: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$category$2d$rollup$2d$aggregator$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runCategoryRollupAggregator"]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/logic/hierarchy-aggregator/definition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hierarchyAggregatorDefinition",
    ()=>hierarchyAggregatorDefinition
]);
const hierarchyAggregatorDefinition = {
    defaultConfig: {
        missingReferenceStrategy: "warn_and_zero",
        operation: "sum"
    },
    description: "Groups mapped categories into rollups and evaluates calculator/formula nodes to produce final totals.",
    displayName: "Rollup & Calculation Engine",
    family: "Logic",
    inputRoles: [
        {
            acceptedFamilies: [
                "Logic"
            ],
            acceptedOutputTypes: [
                "mapped_rows"
            ],
            allowMultiple: true,
            description: "Rows classified by Keyword Mapper.",
            id: "mapped_rows",
            label: "Mapped rows",
            required: true
        },
        {
            acceptedFamilies: [
                "Source"
            ],
            acceptedOutputTypes: [
                "aggregation_rules"
            ],
            acceptedSourceKinds: [
                "aggregation_rules",
                "rule_knowledge_source"
            ],
            allowMultiple: true,
            description: "Rulebook with rollup, formula, constant, official-line, and final-result nodes.",
            id: "aggregation_rules",
            label: "Aggregation rules",
            required: true
        },
        {
            acceptedFamilies: [
                "Source",
                "Review / Validation",
                "Protected"
            ],
            acceptedOutputTypes: [
                "exchange_rate",
                "fapi_inputs",
                "governed_value",
                "reviewed_exchange_rate"
            ],
            acceptedSourceKinds: [
                "currency_rate",
                "excel_workbook",
                "fapi_inputs"
            ],
            allowMultiple: true,
            description: "Workbook calculation inputs plus reviewed/protected FX assumptions.",
            id: "fapi_inputs",
            label: "FAPI inputs",
            required: false
        }
    ],
    outputRoles: [
        {
            canRouteToFamilies: [
                "Output",
                "Review / Validation"
            ],
            description: "Totals for each mapped category.",
            id: "category_totals",
            label: "Category totals",
            outputKey: "categoryTotals",
            outputType: "category_totals",
            samplePreview: "category totals"
        },
        {
            canRouteToFamilies: [
                "Output",
                "Review / Validation"
            ],
            description: "Totals for every evaluated rollup, formula, constant, and final-result node.",
            id: "node_totals",
            label: "Rollup / formula node totals",
            outputKey: "nodeTotals",
            outputType: "node_totals",
            samplePreview: "node totals"
        },
        {
            canRouteToFamilies: [
                "Output",
                "Review / Validation"
            ],
            description: "Totals for rollup/group hierarchy nodes.",
            id: "group_totals",
            label: "Rollup totals",
            outputKey: "groupTotals",
            outputType: "group_totals",
            samplePreview: "group totals"
        },
        {
            canRouteToFamilies: [
                "Protected",
                "Output",
                "Review / Validation"
            ],
            description: "Named final result totals such as Z and W.",
            id: "final_totals",
            label: "Final totals",
            outputKey: "finalTotals",
            outputType: "final_totals",
            samplePreview: "Z = 765, W = -155"
        },
        {
            canRouteToFamilies: [
                "Protected",
                "Output",
                "Review / Validation"
            ],
            description: "Calculated official line values such as A, A1, and B.",
            id: "official_line_values",
            label: "Official line values",
            outputKey: "officialLineValues",
            outputType: "official_line_values",
            samplePreview: "A = 4950"
        },
        {
            canRouteToFamilies: [
                "Output"
            ],
            description: "Aggregation hierarchy with computed totals.",
            id: "aggregation_tree",
            label: "Aggregation tree",
            outputKey: "aggregationTree",
            outputType: "aggregation_tree"
        },
        {
            canRouteToFamilies: [
                "Output",
                "Review / Validation"
            ],
            description: "Rows included by each hierarchy node.",
            id: "included_rows_by_node",
            label: "Included rows by node",
            outputKey: "includedRowsByNode",
            outputType: "included_rows_by_node"
        },
        {
            canRouteToFamilies: [
                "Output",
                "Review / Validation"
            ],
            description: "Mapped rows not included in any final result.",
            id: "excluded_rows",
            label: "Excluded rows",
            outputKey: "excludedRows",
            outputType: "excluded_rows"
        },
        {
            canRouteToFamilies: [
                "Output",
                "Protected",
                "Review / Validation"
            ],
            description: "Readable formulas for each hierarchy node and final total.",
            id: "formula_trace",
            label: "Formula trace",
            outputKey: "formulaTrace",
            outputType: "formula_trace"
        },
        {
            canRouteToFamilies: [
                "Output",
                "Review / Validation"
            ],
            description: "Summary counts for the hierarchy aggregation.",
            id: "aggregation_summary",
            label: "Aggregation summary",
            outputKey: "aggregationSummary",
            outputType: "aggregation_summary"
        }
    ],
    runMode: "local_mock",
    subtype: "Hierarchy Aggregator",
    toolGroup: "calculation",
    toolId: "logic.hierarchy_aggregator"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/logic/hierarchy-aggregator/run.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runHierarchyAggregator",
    ()=>runHierarchyAggregator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/events.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/lineage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$hierarchy$2d$aggregator$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/logic/hierarchy-aggregator/schema.ts [app-client] (ecmascript)");
;
;
;
const REFERENCE_PART_REGEX = /[A-Za-z0-9_:.@-]/;
const REFERENCE_START_REGEX = /[A-Za-z_]/;
const WHITESPACE_REGEX = /\s/;
function getRoleInputs(context, role) {
    return context.inputsByRole[role] || [];
}
function getMappedRows(context) {
    return getRoleInputs(context, "mapped_rows").flatMap((input)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$hierarchy$2d$aggregator$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectMappedRowsFromBackendInput"])(input));
}
function getAggregationRules(context) {
    return getRoleInputs(context, "aggregation_rules").flatMap((input)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$hierarchy$2d$aggregator$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectAggregationRulesFromBackendInput"])(input));
}
function parseFapiInputs(value) {
    if (typeof value !== "object" || value === null) {
        return {};
    }
    const record = value;
    const nested = typeof record.fapiInputs === "object" && record.fapiInputs !== null ? record.fapiInputs : record;
    return {
        documentCurrency: optionalString(nested.documentCurrency),
        expectedResults: typeof nested.expectedResults === "object" && nested.expectedResults ? Object.fromEntries(Object.entries(nested.expectedResults).map(([key, item])=>[
                key,
                parseNumber(item)
            ]).filter((entry)=>entry[1] !== null)) : undefined,
        fatPaid: parseNumber(nested.fatPaid) ?? parseNumber(nested.fat_paid) ?? parseNumber(nested.fatPaidUsd) ?? undefined,
        fapiYear: parseNumber(nested.fapiYear) ?? undefined,
        fxRate: parseNumber(nested.fxRate) ?? parseNumber(nested.exchangeRate) ?? parseNumber(nested.exchange_rate) ?? parseNumber(nested.rate) ?? parseNumber(nested.overrideRate) ?? undefined,
        inclusionRate: parseNumber(nested.inclusionRate) ?? undefined,
        reportingCurrency: optionalString(nested.reportingCurrency),
        rtf: parseNumber(nested.rtf) ?? parseNumber(nested.rtfRate) ?? undefined
    };
}
function getFapiInputs(context) {
    const inputs = [
        ...getRoleInputs(context, "fapi_inputs"),
        ...getRoleInputs(context, "exchange_rate"),
        ...getRoleInputs(context, "reviewed_exchange_rate")
    ].map(parseFapiInputs);
    const merged = {};
    for (const input of inputs){
        for (const [key, value] of Object.entries(input)){
            if (key !== "expectedResults" && value !== undefined) {
                merged[key] = value;
            }
        }
        merged.expectedResults = {
            ...merged.expectedResults || {},
            ...input.expectedResults || {}
        };
    }
    return merged;
}
function groupRowsByCategory(rows) {
    return rows.reduce((groups, row)=>{
        groups[row.categoryId] = [
            ...groups[row.categoryId] || [],
            row
        ];
        return groups;
    }, {});
}
function getCurrency(rows) {
    return rows.find((row)=>row.currency)?.currency;
}
function sumRows(rows) {
    return rows.reduce((total, row)=>total + row.amount, 0);
}
function optionalString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function parseNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value !== "string") {
        return null;
    }
    const normalized = value.replaceAll(",", "").trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
}
function getRowTrace(rows) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dedupeSourceTrace"])(rows.flatMap((row)=>row.sourceTrace || []));
}
function getRowEvidence(rows) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dedupeEvidenceRefs"])(rows.flatMap((row)=>row.evidenceRefs || []));
}
function formatNumber(value) {
    if (Number.isInteger(value)) {
        return String(value);
    }
    return String(Number(value.toFixed(6)));
}
function getOperandRef(operand) {
    return operand.refType === "constant" ? `constant:${operand.label}` : `${operand.refType}:${operand.refId || operand.label}`;
}
function getOperator(operation) {
    if (operation === "sum_abs") {
        return "+ abs";
    }
    if (operation === "subtract") {
        return "-";
    }
    if (operation === "multiply") {
        return "*";
    }
    if (operation === "divide") {
        return "/";
    }
    return "+";
}
function getExpression({ operation, operands, result }) {
    if (operands.length === 0) {
        return `0 = ${formatNumber(result)}`;
    }
    const formattedOperands = operands.map((operand)=>{
        const label = operand.refId || operand.label;
        return `${label}(${formatNumber(operand.signedValue)})`;
    });
    if (operation === "pass_through") {
        return `${formattedOperands[0]} = ${formatNumber(result)}`;
    }
    if (operation === "max_subtract_zero") {
        return `max(${formattedOperands.join(" - ")}, 0) = ${formatNumber(result)}`;
    }
    if (operation === "min_multiply_cap") {
        const [base, multiplier, cap] = formattedOperands;
        return `min(max(${base || "0"}, 0) * ${multiplier || "1"}, ${cap || "0"}) = ${formatNumber(result)}`;
    }
    return `${formattedOperands.join(` ${getOperator(operation)} `)} = ${formatNumber(result)}`;
}
function isDigit(character) {
    return character >= "0" && character <= "9";
}
function isReferenceStart(character) {
    return REFERENCE_START_REGEX.test(character);
}
function isReferencePart(character) {
    return REFERENCE_PART_REGEX.test(character);
}
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Formula tokenization has several token types but stays local and deterministic.
function tokenizeFormulaExpression(expression) {
    const tokens = [];
    const warnings = [];
    let index = 0;
    while(index < expression.length){
        const character = expression[index];
        if (WHITESPACE_REGEX.test(character)) {
            index += 1;
            continue;
        }
        if (character === "(" || character === ")") {
            tokens.push({
                text: character,
                type: "paren",
                value: character
            });
            index += 1;
            continue;
        }
        if (character === "+" || character === "-" || character === "*" || character === "/") {
            tokens.push({
                text: character,
                type: "operator",
                value: character
            });
            index += 1;
            continue;
        }
        if (isDigit(character) || character === ".") {
            let end = index + 1;
            while(end < expression.length && (isDigit(expression[end]) || expression[end] === ".")){
                end += 1;
            }
            const text = expression.slice(index, end);
            const value = Number(text);
            if (Number.isFinite(value)) {
                tokens.push({
                    text,
                    type: "number",
                    value
                });
            } else {
                warnings.push(`Invalid number "${text}" in formula expression.`);
            }
            index = end;
            continue;
        }
        if (isReferenceStart(character)) {
            let end = index + 1;
            while(end < expression.length && isReferencePart(expression[end])){
                end += 1;
            }
            const text = expression.slice(index, end);
            tokens.push({
                text,
                type: "ref",
                value: text
            });
            index = end;
            continue;
        }
        warnings.push(`Unsupported formula character "${character}" was ignored.`);
        index += 1;
    }
    return {
        tokens,
        warnings
    };
}
function getExpressionOperatorPrecedence(operator) {
    if (operator === "neg") {
        return 3;
    }
    if (operator === "*" || operator === "/") {
        return 2;
    }
    return 1;
}
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Shunting-yard parsing is branchy by nature and isolated to formula expressions.
function toFormulaRpn(tokens) {
    const output = [];
    const operators = [];
    const warnings = [];
    let expectsValue = true;
    for (const token of tokens){
        if (token.type === "number" || token.type === "ref") {
            output.push(token);
            expectsValue = false;
            continue;
        }
        if (token.type === "paren" && token.value === "(") {
            operators.push(token);
            expectsValue = true;
            continue;
        }
        if (token.type === "paren" && token.value === ")") {
            while(operators.length > 0 && operators.at(-1)?.type !== "paren"){
                const operator = operators.pop();
                if (operator) {
                    output.push(operator);
                }
            }
            if (operators.at(-1)?.type === "paren") {
                operators.pop();
            } else {
                warnings.push("Formula expression has an unmatched closing parenthesis.");
            }
            expectsValue = false;
            continue;
        }
        if (token.type === "operator") {
            const operator = token.value === "-" && expectsValue ? {
                ...token,
                text: "-",
                value: "neg"
            } : token;
            const precedence = getExpressionOperatorPrecedence(operator.value);
            const rightAssociative = operator.value === "neg";
            while(operators.length > 0){
                const top = operators.at(-1);
                if (!top) {
                    break;
                }
                if (top.type !== "operator") {
                    break;
                }
                const topPrecedence = getExpressionOperatorPrecedence(top.value);
                if (topPrecedence > precedence || !rightAssociative && topPrecedence === precedence) {
                    const popped = operators.pop();
                    if (popped) {
                        output.push(popped);
                    }
                    continue;
                }
                break;
            }
            operators.push(operator);
            expectsValue = true;
        }
    }
    while(operators.length > 0){
        const operator = operators.pop();
        if (!operator) {
            continue;
        }
        if (operator.type === "paren") {
            warnings.push("Formula expression has an unmatched opening parenthesis.");
            continue;
        }
        output.push(operator);
    }
    return {
        rpn: output,
        warnings
    };
}
function mergeFormulaValues({ display, value, values, warnings }) {
    return {
        display,
        includedRows: [
            ...new Set(values.flatMap((item)=>item.includedRows))
        ],
        inputValues: values.flatMap((item)=>item.inputValues),
        value,
        warnings: [
            ...new Set([
                ...values.flatMap((item)=>item.warnings),
                ...warnings || []
            ])
        ]
    };
}
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Evaluator handles refs, constants, unary, and binary operators in one small stack machine.
function evaluateFormulaExpression({ expression, resolveReference, ruleId }) {
    const tokenized = tokenizeFormulaExpression(expression);
    const { rpn, warnings: rpnWarnings } = toFormulaRpn(tokenized.tokens);
    const stack = [];
    const warnings = [
        ...tokenized.warnings,
        ...rpnWarnings
    ];
    for (const token of rpn){
        if (token.type === "number") {
            stack.push({
                display: token.text,
                includedRows: [],
                inputValues: [
                    {
                        label: token.text,
                        refType: "constant",
                        sign: 1,
                        signedValue: token.value,
                        value: token.value
                    }
                ],
                value: token.value,
                warnings: []
            });
            continue;
        }
        if (token.type === "ref") {
            const resolved = resolveReference(token.value);
            stack.push({
                display: `${resolved.refId || resolved.label}(${formatNumber(resolved.signedValue)})`,
                includedRows: resolved.includedRows,
                inputValues: [
                    toFormulaInputValue(resolved)
                ],
                value: resolved.signedValue,
                warnings: resolved.warnings
            });
            continue;
        }
        if (token.type !== "operator") {
            continue;
        }
        if (token.value === "neg") {
            const operand = stack.pop();
            if (!operand) {
                warnings.push(`Missing value after unary minus in ${ruleId}.`);
                continue;
            }
            stack.push(mergeFormulaValues({
                display: `-${operand.display}`,
                value: -operand.value,
                values: [
                    operand
                ]
            }));
            continue;
        }
        const right = stack.pop();
        const left = stack.pop();
        if (!(left && right)) {
            warnings.push(`Formula expression in ${ruleId} is missing an operand.`);
            continue;
        }
        let value = 0;
        const operationWarnings = [];
        if (token.value === "+") {
            value = left.value + right.value;
        } else if (token.value === "-") {
            value = left.value - right.value;
        } else if (token.value === "*") {
            value = left.value * right.value;
        } else if (right.value === 0) {
            operationWarnings.push(`Divide by zero in ${ruleId}; result was set to 0.`);
            value = 0;
        } else {
            value = left.value / right.value;
        }
        stack.push(mergeFormulaValues({
            display: `(${left.display} ${token.value} ${right.display})`,
            value,
            values: [
                left,
                right
            ],
            warnings: operationWarnings
        }));
    }
    if (stack.length !== 1) {
        warnings.push(`Formula expression in ${ruleId} could not be fully evaluated.`);
    }
    const result = stack.at(-1) || {
        display: "0",
        includedRows: [],
        inputValues: [],
        value: 0,
        warnings: []
    };
    return {
        expression: `${result.display} = ${formatNumber(result.value)}`,
        includedRows: result.includedRows,
        inputValues: result.inputValues,
        value: result.value,
        warnings: [
            ...new Set([
                ...warnings,
                ...result.warnings
            ])
        ]
    };
}
function buildImplicitOperands(rule) {
    if (rule.operands && rule.operands.length > 0) {
        return rule.operands;
    }
    const categoryIds = rule.nodeType === "category_total" && (rule.includeCategoryIds || []).length === 0 ? [
        rule.nodeId
    ] : rule.includeCategoryIds || [];
    const operands = [
        ...categoryIds.map((refId)=>({
                refId,
                refType: "category"
            })),
        ...rule.children.map((refId)=>({
                refId,
                refType: "node"
            }))
    ];
    if (operands.length === 0 && (rule.nodeType === "constant" || rule.value !== undefined)) {
        return [
            {
                label: rule.nodeId,
                refType: "constant",
                value: rule.value ?? 0
            }
        ];
    }
    return operands;
}
function applyOperation({ operation, operands, rule }) {
    const warnings = [];
    const values = operands.map((operand)=>operand.signedValue);
    if (values.length === 0) {
        return {
            value: rule.value ?? 0,
            warnings
        };
    }
    if (operation === "pass_through") {
        return {
            value: values[0] ?? rule.value ?? 0,
            warnings
        };
    }
    if (operation === "sum_abs") {
        return {
            value: values.reduce((total, value)=>total + Math.abs(value), 0),
            warnings
        };
    }
    if (operation === "multiply") {
        return {
            value: values.reduce((total, value)=>total * value, 1),
            warnings
        };
    }
    if (operation === "subtract") {
        return {
            value: values.slice(1).reduce((total, value)=>total - value, values[0] ?? 0),
            warnings
        };
    }
    if (operation === "divide") {
        const value = values.slice(1).reduce((total, divisor)=>{
            if (divisor === 0) {
                warnings.push(`Divide by zero in ${rule.nodeId}; result was set to 0.`);
                return 0;
            }
            return total / divisor;
        }, values[0] ?? 0);
        return {
            value,
            warnings
        };
    }
    if (operation === "max_subtract_zero") {
        const value = values.slice(1).reduce((total, item)=>total - item, values[0] ?? 0);
        return {
            value: Math.max(value, 0),
            warnings
        };
    }
    if (operation === "min_multiply_cap") {
        const [base = 0, multiplier = 1, cap = Number.POSITIVE_INFINITY] = values;
        return {
            value: Math.min(Math.max(base, 0) * multiplier, cap),
            warnings
        };
    }
    return {
        value: values.reduce((total, value)=>total + value, 0),
        warnings
    };
}
function createEmptyNodeTotal(rule, message) {
    const trace = {
        expression: `${rule.nodeId} = 0`,
        inputRefs: [],
        inputValues: [],
        label: rule.label,
        nodeId: rule.nodeId,
        nodeType: rule.nodeType,
        operation: rule.operation,
        result: 0,
        warnings: [
            message
        ]
    };
    return {
        amount: 0,
        formulaTrace: trace,
        includedRows: [],
        label: rule.label,
        nodeId: rule.nodeId,
        nodeType: rule.nodeType,
        operation: rule.operation,
        resultName: rule.resultName,
        rowCount: 0,
        value: 0,
        warnings: [
            message
        ]
    };
}
function toFormulaInputValue(operand) {
    return {
        label: operand.label,
        refId: operand.refId,
        refType: operand.refType,
        sign: operand.sign,
        signedValue: operand.signedValue,
        value: operand.value
    };
}
function sortAggregationRules(rules) {
    return rules.map((rule, index)=>({
            index,
            rule
        })).sort((left, right)=>(left.rule.order ?? left.index) - (right.rule.order ?? right.index)).map(({ rule })=>rule);
}
function getOperandSign(operand) {
    return operand.sign === -1 ? -1 : 1;
}
function resolveConstantOperand(operand, sign) {
    const value = operand.value ?? 0;
    return {
        includedRows: [],
        label: operand.label || String(value),
        refType: "constant",
        sign,
        signedValue: value * sign,
        value,
        warnings: []
    };
}
function resolveCategoryOperand({ allWarnings, categoryTotalDetails, operand, ruleId, sign }) {
    const label = operand.label || operand.refId || "missing_category";
    const detail = operand.refId ? categoryTotalDetails[operand.refId] : undefined;
    const warnings = detail ? [] : [
        `Missing category reference ${operand.refId || label} in ${ruleId}; treated as 0.`
    ];
    allWarnings.push(...warnings);
    const value = detail?.value ?? 0;
    return {
        includedRows: detail?.includedRows || [],
        label,
        refId: operand.refId,
        refType: "category",
        sign,
        signedValue: value * sign,
        value,
        warnings
    };
}
function getFapiInputValue(inputs, refId) {
    if (!refId) {
        return;
    }
    const normalized = refId.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const aliases = {
        documentcurrency: "documentCurrency",
        exchange_rate: "fxRate",
        exchangerate: "fxRate",
        fapiperiod: "fapiYear",
        fapiyear: "fapiYear",
        fatpaid: "fatPaid",
        fxoverride: "fxRate",
        fxrate: "fxRate",
        inclusionrate: "inclusionRate",
        reportingcurrency: "reportingCurrency",
        rtf: "rtf",
        rtfrate: "rtf"
    };
    const key = aliases[normalized] || refId;
    const value = inputs[key];
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
function resolveInputOperand({ allWarnings, fapiInputs, operand, ruleId, sign }) {
    const label = operand.label || operand.refId || "missing_input";
    const value = getFapiInputValue(fapiInputs, operand.refId);
    const warnings = value === undefined ? [
        `Missing FAPI input ${operand.refId || label} in ${ruleId}; treated as 0.`
    ] : [];
    allWarnings.push(...warnings);
    return {
        includedRows: [],
        label,
        refId: operand.refId,
        refType: "input",
        sign,
        signedValue: (value ?? 0) * sign,
        value: value ?? 0,
        warnings
    };
}
function resolveNodeOperand({ allWarnings, computeRuleTotal, operand, ruleId, rulesById, sign, visiting }) {
    const label = operand.label || operand.refId || "missing_node";
    const childRule = operand.refId ? rulesById.get(operand.refId) : null;
    const warnings = childRule ? [] : [
        `Missing node reference ${operand.refId || label} in ${ruleId}; treated as 0.`
    ];
    allWarnings.push(...warnings);
    const total = childRule ? computeRuleTotal(childRule, visiting) : undefined;
    const value = total?.value ?? 0;
    return {
        includedRows: total?.includedRows || [],
        label,
        refId: operand.refId,
        refType: "node",
        sign,
        signedValue: value * sign,
        value,
        warnings: [
            ...warnings,
            ...total?.warnings || []
        ]
    };
}
function runHierarchyAggregator(context) {
    const mappedRows = getMappedRows(context);
    const aggregationRules = sortAggregationRules(getAggregationRules(context));
    const fapiInputs = getFapiInputs(context);
    const errors = [
        mappedRows.length === 0 ? "Rollup & Calculation Engine needs mapped_rows input." : "",
        aggregationRules.length === 0 ? "Rollup & Calculation Engine needs aggregation_rules input." : ""
    ].filter(Boolean);
    if (errors.length > 0) {
        return {
            blockId: context.block.id,
            completedAt: new Date().toISOString(),
            errors,
            evidenceRefs: [],
            logs: errors.map((message)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])(message)),
            outputs: {
                aggregation_summary: {
                    excludedCount: 0,
                    finalResultCount: 0,
                    formulaTraceCount: 0,
                    mappedCount: mappedRows.length,
                    nodeCount: aggregationRules.length,
                    ruleCount: aggregationRules.length,
                    warnings: errors
                },
                aggregation_tree: {
                    aggregationTree: []
                },
                category_totals: {
                    categoryTotalDetails: {},
                    categoryTotals: {}
                },
                excluded_rows: {
                    excludedRows: [],
                    rowCount: 0
                },
                final_totals: {
                    finalTotalDetails: {},
                    finalTotals: {}
                },
                formula_trace: {
                    formulaTrace: {},
                    formulaTraceText: []
                },
                group_totals: {
                    groupTotals: {}
                },
                included_rows_by_node: {
                    includedRowsByNode: {}
                },
                node_totals: {
                    nodeTotalDetails: {},
                    nodeTotals: {}
                },
                official_line_values: {
                    officialLineDetails: {},
                    officialLineValues: {}
                }
            },
            primaryOutputRole: "aggregation_summary",
            runId: context.runId,
            sourceTrace: [],
            startedAt: context.startedAt,
            status: "error",
            toolId: "logic.hierarchy_aggregator",
            warnings: []
        };
    }
    const rowsByCategory = groupRowsByCategory(mappedRows);
    const categoryTotalDetails = Object.fromEntries(Object.entries(rowsByCategory).map(([categoryId, rows])=>[
            categoryId,
            {
                amount: sumRows(rows),
                categoryId,
                categoryLabel: rows[0]?.categoryLabel || categoryId,
                currency: getCurrency(rows),
                includedRows: rows.map((row)=>row.rowId),
                rowCount: rows.length,
                value: sumRows(rows)
            }
        ]));
    const categoryTotals = Object.fromEntries(Object.entries(categoryTotalDetails).map(([categoryId, detail])=>[
            categoryId,
            detail.value
        ]));
    const rulesById = new Map(aggregationRules.map((rule)=>[
            rule.nodeId,
            rule
        ]));
    const nodeTotalDetails = new Map();
    const includedRowsByNode = {};
    const allWarnings = [];
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Rule evaluation coordinates legacy operands, formula expressions, cycle checks, and trace assembly.
    function computeRuleTotal(rule, visiting = new Set()) {
        const cached = nodeTotalDetails.get(rule.nodeId);
        if (cached) {
            return cached;
        }
        if (visiting.has(rule.nodeId)) {
            const message = `Circular aggregation reference detected at ${rule.nodeId}; treated as 0.`;
            allWarnings.push(message);
            const empty = createEmptyNodeTotal(rule, message);
            nodeTotalDetails.set(rule.nodeId, empty);
            return empty;
        }
        const nextVisiting = new Set(visiting);
        nextVisiting.add(rule.nodeId);
        const directOperands = buildImplicitOperands(rule);
        const resolveOperand = (operand)=>{
            const sign = getOperandSign(operand);
            if (operand.refType === "constant") {
                return resolveConstantOperand(operand, sign);
            }
            if (operand.refType === "category") {
                return resolveCategoryOperand({
                    allWarnings,
                    categoryTotalDetails,
                    operand,
                    ruleId: rule.nodeId,
                    sign
                });
            }
            if (operand.refType === "input") {
                return resolveInputOperand({
                    allWarnings,
                    fapiInputs,
                    operand,
                    ruleId: rule.nodeId,
                    sign
                });
            }
            return resolveNodeOperand({
                allWarnings,
                computeRuleTotal,
                operand,
                ruleId: rule.nodeId,
                rulesById,
                sign,
                visiting: nextVisiting
            });
        };
        // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Reference resolution supports explicit prefixes and inferred category/node refs.
        const resolveFormulaReference = (reference)=>{
            const [prefix, ...rest] = reference.split(":");
            const hasPrefix = rest.length > 0;
            const normalizedPrefix = hasPrefix ? prefix.toLowerCase() : "";
            const refId = hasPrefix ? rest.join(":") : reference;
            if (normalizedPrefix === "constant" || normalizedPrefix === "value") {
                return resolveConstantOperand({
                    refType: "constant",
                    value: Number(refId) || 0
                }, 1);
            }
            if (normalizedPrefix === "category") {
                return resolveCategoryOperand({
                    allWarnings,
                    categoryTotalDetails,
                    operand: {
                        refId,
                        refType: "category"
                    },
                    ruleId: rule.nodeId,
                    sign: 1
                });
            }
            if (normalizedPrefix === "input" || normalizedPrefix === "fapi") {
                return resolveInputOperand({
                    allWarnings,
                    fapiInputs,
                    operand: {
                        refId,
                        refType: "input"
                    },
                    ruleId: rule.nodeId,
                    sign: 1
                });
            }
            if (normalizedPrefix === "node") {
                return resolveNodeOperand({
                    allWarnings,
                    computeRuleTotal,
                    operand: {
                        refId,
                        refType: "node"
                    },
                    ruleId: rule.nodeId,
                    rulesById,
                    sign: 1,
                    visiting: nextVisiting
                });
            }
            if (categoryTotalDetails[reference]) {
                return resolveCategoryOperand({
                    allWarnings,
                    categoryTotalDetails,
                    operand: {
                        refId: reference,
                        refType: "category"
                    },
                    ruleId: rule.nodeId,
                    sign: 1
                });
            }
            return resolveNodeOperand({
                allWarnings,
                computeRuleTotal,
                operand: {
                    refId: reference,
                    refType: "node"
                },
                ruleId: rule.nodeId,
                rulesById,
                sign: 1,
                visiting: nextVisiting
            });
        };
        const formulaExpression = rule.formulaExpression?.trim();
        const expressionResult = formulaExpression ? evaluateFormulaExpression({
            expression: formulaExpression,
            resolveReference: resolveFormulaReference,
            ruleId: rule.nodeId
        }) : null;
        const resolvedOperands = expressionResult ? [] : directOperands.map(resolveOperand);
        const operationResult = expressionResult || applyOperation({
            operands: resolvedOperands,
            operation: rule.operation,
            rule
        });
        allWarnings.push(...operationResult.warnings);
        const includedRows = expressionResult ? [
            ...new Set(expressionResult.includedRows)
        ] : [
            ...new Set(resolvedOperands.flatMap((operand)=>operand.includedRows))
        ];
        const formulaWarnings = [
            ...new Set([
                ...resolvedOperands.flatMap((operand)=>operand.warnings),
                ...operationResult.warnings
            ])
        ];
        const formulaTrace = {
            expression: expressionResult?.expression || getExpression({
                operands: resolvedOperands,
                operation: rule.operation,
                result: operationResult.value
            }),
            inputRefs: expressionResult ? expressionResult.inputValues.map(getOperandRef) : resolvedOperands.map(getOperandRef),
            inputValues: expressionResult?.inputValues || resolvedOperands.map(toFormulaInputValue),
            label: rule.label,
            nodeId: rule.nodeId,
            nodeType: rule.nodeType,
            operation: rule.operation,
            result: operationResult.value,
            warnings: formulaWarnings
        };
        const nodeTotal = {
            amount: operationResult.value,
            currency: getCurrency(mappedRows.filter((row)=>includedRows.includes(row.rowId))) || getCurrency(mappedRows),
            formulaTrace,
            includedRows,
            label: rule.label,
            nodeId: rule.nodeId,
            nodeType: rule.nodeType,
            operation: rule.operation,
            resultName: rule.resultName,
            rowCount: includedRows.length,
            value: operationResult.value,
            warnings: formulaWarnings
        };
        includedRowsByNode[rule.nodeId] = includedRows;
        nodeTotalDetails.set(rule.nodeId, nodeTotal);
        return nodeTotal;
    }
    for (const rule of aggregationRules){
        computeRuleTotal(rule);
    }
    const nodeTotalDetailRecord = Object.fromEntries(nodeTotalDetails);
    const nodeTotals = Object.fromEntries([
        ...nodeTotalDetails.values()
    ].map((total)=>[
            total.nodeId,
            total.value
        ]));
    const officialLineDetails = Object.fromEntries(aggregationRules.filter((rule)=>rule.outputRole === "official_line").map((rule)=>[
            rule.resultName || rule.nodeId,
            nodeTotalDetails.get(rule.nodeId)
        ]).filter((entry)=>Boolean(entry[1])));
    const officialLineValues = Object.fromEntries(Object.entries(officialLineDetails).map(([resultName, detail])=>[
            resultName,
            detail.value
        ]));
    const groupTotals = Object.fromEntries([
        ...nodeTotalDetails.values()
    ].filter((total)=>total.nodeType === "group").map((total)=>[
            total.nodeId,
            total.value
        ]));
    const finalTotalDetails = Object.fromEntries(aggregationRules.filter((rule)=>rule.nodeType === "final_result").map((rule)=>[
            rule.resultName || rule.nodeId,
            nodeTotalDetails.get(rule.nodeId)
        ]).filter((entry)=>Boolean(entry[1])));
    const finalTotals = Object.fromEntries(Object.entries(finalTotalDetails).map(([resultName, detail])=>[
            resultName,
            detail.value
        ]));
    const finalIncludedRows = new Set(Object.values(finalTotalDetails).flatMap((total)=>total.includedRows));
    const excludedRows = mappedRows.filter((row)=>!finalIncludedRows.has(row.rowId));
    const formulaTrace = Object.fromEntries([
        ...nodeTotalDetails.values()
    ].map((total)=>[
            total.nodeId,
            total.formulaTrace
        ]));
    const formulaTraceText = [
        ...nodeTotalDetails.values()
    ].map((total)=>`${total.nodeId}: ${total.formulaTrace.expression}`);
    const aggregationTree = aggregationRules.map((rule)=>({
            ...rule,
            formulaTrace: nodeTotalDetails.get(rule.nodeId)?.formulaTrace,
            total: nodeTotalDetails.get(rule.nodeId)?.value ?? 0
        }));
    const warnings = [
        ...new Set([
            ...allWarnings,
            ...excludedRows.length > 0 ? [
                `${excludedRows.length} mapped row(s) were not included in final results.`
            ] : []
        ])
    ];
    const aggregationSummary = {
        categoryCount: Object.keys(categoryTotals).length,
        excludedCount: excludedRows.length,
        expectedResults: fapiInputs.expectedResults || {},
        finalResultCount: Object.keys(finalTotals).length,
        formulaTraceCount: Object.keys(formulaTrace).length,
        groupCount: Object.keys(groupTotals).length,
        mappedCount: mappedRows.length,
        nodeCount: Object.keys(nodeTotals).length,
        officialLineCount: Object.keys(officialLineValues).length,
        ruleCount: aggregationRules.length,
        warnings
    };
    const hasCalculationWarning = warnings.some((message)=>message.includes("Divide by zero"));
    let status = "success";
    if (hasCalculationWarning) {
        status = "needs_review";
    } else if (warnings.length > 0) {
        status = "warning";
    }
    return {
        blockId: context.block.id,
        completedAt: new Date().toISOString(),
        errors: [],
        evidenceRefs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dedupeEvidenceRefs"])([
            ...getRowEvidence(mappedRows),
            ...aggregationRules.flatMap((rule)=>rule.evidenceRefs || [])
        ]),
        logs: [
            warnings.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warning"])("Rollup & Calculation Engine completed with warnings.", {
                ...aggregationSummary
            }) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["info"])("Rollup & Calculation Engine completed through aggregation rules.", {
                ...aggregationSummary
            })
        ],
        outputs: {
            aggregation_summary: aggregationSummary,
            aggregation_tree: {
                aggregationTree
            },
            category_totals: {
                categoryTotalDetails,
                categoryTotals
            },
            excluded_rows: {
                excludedRows,
                rowCount: excludedRows.length
            },
            final_totals: {
                finalTotalDetails,
                finalTotals
            },
            fapi_inputs: {
                fapiInputs
            },
            formula_trace: {
                formulaTrace,
                formulaTraceText
            },
            group_totals: {
                groupTotals
            },
            included_rows_by_node: {
                includedRowsByNode
            },
            node_totals: {
                nodeTotalDetails: nodeTotalDetailRecord,
                nodeTotals
            },
            official_line_values: {
                officialLineDetails,
                officialLineValues
            }
        },
        primaryOutputRole: "final_totals",
        runId: context.runId,
        sourceTrace: (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dedupeSourceTrace"])([
            ...getRowTrace(mappedRows),
            ...aggregationRules.flatMap((rule)=>rule.sourceTrace || [])
        ]),
        startedAt: context.startedAt,
        status,
        toolId: "logic.hierarchy_aggregator",
        warnings
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/logic/hierarchy-aggregator/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hierarchyAggregatorToolModule",
    ()=>hierarchyAggregatorToolModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$hierarchy$2d$aggregator$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/logic/hierarchy-aggregator/definition.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$hierarchy$2d$aggregator$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/logic/hierarchy-aggregator/run.ts [app-client] (ecmascript)");
;
;
const hierarchyAggregatorToolModule = {
    definition: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$hierarchy$2d$aggregator$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hierarchyAggregatorDefinition"],
    run: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$hierarchy$2d$aggregator$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runHierarchyAggregator"]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/logic/keyword-mapper/definition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "keywordMapperDefinition",
    ()=>keywordMapperDefinition
]);
const keywordMapperDefinition = {
    defaultConfig: {
        conflictStrategy: "highest_confidence",
        lowConfidenceThreshold: 0.75,
        matchFields: [
            "account",
            "label",
            "description"
        ],
        matchMode: "contains",
        unmatchedStrategy: "send_to_review"
    },
    description: "Classifies upstream rows into atomic categories using a connected Keyword Rulebook.",
    displayName: "Keyword Mapper",
    family: "Logic",
    inputRoles: [
        {
            acceptedFamilies: [
                "Source",
                "Logic"
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
        },
        {
            acceptedFamilies: [
                "Source"
            ],
            acceptedSourceKinds: [
                "keyword_rules"
            ],
            allowMultiple: true,
            description: "Keyword-to-category rules provided by a Keyword Rulebook.",
            id: "keyword_rules",
            label: "Keyword rules",
            required: true
        }
    ],
    outputRoles: [
        {
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
        },
        {
            canRouteToFamilies: [
                "Review / Validation"
            ],
            description: "Rows that did not match any keyword rule.",
            id: "unmatched_rows",
            label: "Unmatched rows",
            outputKey: "unmatchedRows",
            outputType: "unmatched_rows",
            samplePreview: "0 unmatched rows"
        },
        {
            canRouteToFamilies: [
                "Review / Validation"
            ],
            description: "Mapped rows below the configured confidence threshold.",
            id: "low_confidence_rows",
            label: "Low-confidence rows",
            outputKey: "lowConfidenceRows",
            outputType: "low_confidence_rows",
            samplePreview: "1 low-confidence row"
        },
        {
            canRouteToFamilies: [
                "Review / Validation"
            ],
            description: "Rows that matched more than one keyword rule.",
            id: "conflicts",
            label: "Conflicts",
            outputKey: "conflicts",
            outputType: "conflicts",
            samplePreview: "0 conflicts"
        },
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
    runMode: "local_mock",
    subtype: "Classification / Mapping",
    toolGroup: "mapping",
    toolId: "logic.keyword_mapper"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/logic/keyword-mapper/schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "collectRowsFromBackendInput",
    ()=>collectRowsFromBackendInput,
    "collectRulesFromBackendInput",
    ()=>collectRulesFromBackendInput,
    "parseKeywordMapperConfig",
    ()=>parseKeywordMapperConfig
]);
const KEYWORD_LIST_DELIMITER_REGEX = /[,;\n|]/;
function humanizeCategoryId(categoryId) {
    return categoryId.replaceAll("_", " ").replace(/\b\w/g, (letter)=>letter.toUpperCase());
}
function optionalString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function optionalTraceArray(value) {
    return Array.isArray(value) ? value : undefined;
}
function getSuggestedString(record, suggestedKey, fallbackKey) {
    return optionalString(record[suggestedKey]) || optionalString(record[fallbackKey]);
}
function asRecord(value) {
    return typeof value === "object" && value !== null ? value : null;
}
function asStringArray(value) {
    if (Array.isArray(value)) {
        return value.flatMap((item)=>String(item).split(KEYWORD_LIST_DELIMITER_REGEX)).map((item)=>item.trim()).filter(Boolean);
    }
    if (typeof value === "string") {
        return value.split(KEYWORD_LIST_DELIMITER_REGEX).map((item)=>item.trim()).filter(Boolean);
    }
    return [];
}
function parseNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value !== "string") {
        return null;
    }
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
}
function parseMatchFields(value) {
    const allowed = new Set([
        "account",
        "description",
        "label"
    ]);
    const fields = asStringArray(value).filter((field)=>allowed.has(field));
    return fields.length > 0 ? fields : [
        "account",
        "label",
        "description"
    ];
}
function parseConflictStrategy(value) {
    if (value === "highest_priority" || value === "highest priority wins" || value === "highest priority") {
        return "highest_priority";
    }
    if (value === "send_conflict_to_review" || value === "send conflict to review") {
        return "send_conflict_to_review";
    }
    return "highest_confidence";
}
function parseUnmatchedStrategy(value) {
    if (value === "ignore") {
        return "ignore";
    }
    if (value === "mark_as_unmapped" || value === "mark as unmapped") {
        return "mark_as_unmapped";
    }
    return "send_to_review";
}
function parseMatchMode(value) {
    if (value === "exact" || value === "starts_with" || value === "all_words") {
        return value;
    }
    if (value === "starts with") {
        return "starts_with";
    }
    if (value === "all words") {
        return "all_words";
    }
    return "contains";
}
function parseKeywordMapperConfig(config) {
    return {
        conflictStrategy: parseConflictStrategy(config.conflictStrategy),
        lowConfidenceThreshold: parseNumber(config.lowConfidenceThreshold) ?? 0.75,
        matchFields: parseMatchFields(config.matchFields),
        matchMode: parseMatchMode(config.matchMode),
        unmatchedStrategy: parseUnmatchedStrategy(config.unmatchedStrategy)
    };
}
function manualRowFromRecord(rowRecord, index) {
    return {
        account: typeof rowRecord.account === "string" ? rowRecord.account : undefined,
        amount: parseNumber(rowRecord.amount) ?? parseNumber(rowRecord.value) ?? 0,
        currency: typeof rowRecord.currency === "string" ? rowRecord.currency : undefined,
        description: typeof rowRecord.description === "string" ? rowRecord.description : undefined,
        evidenceRefs: Array.isArray(rowRecord.evidenceRefs) ? rowRecord.evidenceRefs : undefined,
        label: String(rowRecord.label || rowRecord.name || `Input row ${index + 1}`),
        rowId: String(rowRecord.rowId || rowRecord.id || `input-row-${index + 1}`),
        sourceTrace: Array.isArray(rowRecord.sourceTrace) ? rowRecord.sourceTrace : undefined
    };
}
function keywordRuleFromRecord(ruleRecord, index) {
    const exactKeywords = asStringArray(ruleRecord.exactKeywords);
    const containsKeywords = asStringArray(ruleRecord.containsKeywords);
    const hasExplicitBuckets = exactKeywords.length + containsKeywords.length > 0;
    const legacyKeywords = asStringArray(ruleRecord.keywords || ruleRecord.keyword);
    const keywords = hasExplicitBuckets ? [
        ...exactKeywords,
        ...containsKeywords
    ] : legacyKeywords;
    const categoryId = String(ruleRecord.categoryId || ruleRecord.category || ruleRecord.target || ruleRecord.subsectionId || "mapped");
    return {
        categoryId,
        categoryLabel: String(ruleRecord.categoryLabel || ruleRecord.label || humanizeCategoryId(categoryId)),
        comment: optionalString(ruleRecord.comment),
        confidence: parseNumber(ruleRecord.confidence) ?? 0.85,
        containsKeywords,
        description: optionalString(ruleRecord.description),
        evidenceRefs: Array.isArray(ruleRecord.evidenceRefs) ? ruleRecord.evidenceRefs : undefined,
        exactKeywords,
        excludeKeywords: asStringArray(ruleRecord.excludeKeywords),
        keywords,
        lineId: optionalString(ruleRecord.lineId),
        matchMode: parseMatchMode(ruleRecord.matchMode),
        priority: parseNumber(ruleRecord.priority) ?? undefined,
        ruleId: String(ruleRecord.ruleId || ruleRecord.id || `keyword-rule-${index + 1}`),
        sectionId: optionalString(ruleRecord.sectionId),
        scope: optionalString(ruleRecord.scope),
        sourceTrace: optionalTraceArray(ruleRecord.sourceTrace),
        suggestedLine: getSuggestedString(ruleRecord, "suggestedLine", "lineId"),
        suggestedSection: getSuggestedString(ruleRecord, "suggestedSection", "sectionId"),
        suggestedSubsection: getSuggestedString(ruleRecord, "suggestedSubsection", "subsectionId"),
        suggestedUse: optionalString(ruleRecord.suggestedUse),
        subsectionId: optionalString(ruleRecord.subsectionId),
        tags: asStringArray(ruleRecord.tags),
        target: optionalString(ruleRecord.target)
    };
}
function collectRowsFromBackendInput(value) {
    if (Array.isArray(value)) {
        return value.map((item)=>asRecord(item)).filter((item)=>Boolean(item)).map(manualRowFromRecord);
    }
    const record = asRecord(value);
    if (!record) {
        return [];
    }
    for (const key of [
        "rows",
        "mappedRows",
        "transformedRows"
    ]){
        const rows = record[key];
        if (Array.isArray(rows)) {
            return collectRowsFromBackendInput(rows);
        }
    }
    return [];
}
function collectRulesFromBackendInput(value) {
    if (Array.isArray(value)) {
        return value.map((item)=>asRecord(item)).filter((item)=>Boolean(item)).map(keywordRuleFromRecord).filter((rule)=>rule.keywords.length > 0 && rule.categoryId !== "mapped");
    }
    const record = asRecord(value);
    if (!record) {
        return [];
    }
    for (const key of [
        "keywordRules",
        "keyword_rules",
        "rules"
    ]){
        const rules = record[key];
        if (Array.isArray(rules)) {
            return collectRulesFromBackendInput(rules);
        }
    }
    return [];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/logic/keyword-mapper/run.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runKeywordMapper",
    ()=>runKeywordMapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/events.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/lineage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$keyword$2d$mapper$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/logic/keyword-mapper/schema.ts [app-client] (ecmascript)");
;
;
;
const DIACRITIC_REGEX = /[\u0300-\u036f]/g;
const MATCH_SEPARATOR_REGEX = /[^\p{L}\p{N}]+/gu;
function getRoleInputs(context, role) {
    return context.inputsByRole[role] || [];
}
function getRows(context) {
    return getRoleInputs(context, "data_rows").flatMap((input)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$keyword$2d$mapper$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectRowsFromBackendInput"])(input));
}
function getRules(context) {
    const fromUpstream = getRoleInputs(context, "keyword_rules").flatMap((input)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$keyword$2d$mapper$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectRulesFromBackendInput"])(input));
    if (fromUpstream.length > 0) return fromUpstream;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$keyword$2d$mapper$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectRulesFromBackendInput"])(context.config);
}
function normalize(value) {
    return value.normalize("NFD").replace(DIACRITIC_REGEX, "").toLowerCase().replace(MATCH_SEPARATOR_REGEX, " ").trim().replace(/\s+/g, " ");
}
function getFieldValues(row, fields) {
    return fields.map((field)=>row[field]).filter((value)=>typeof value === "string").map(normalize);
}
// A keyword token matches a field word if equal, or differs only by a trailing
// plural "s"/"es" (gain↔gains, dividend↔dividends) — whole-word, so "gain" never
// matches "again". Deliberately light: no aggressive stemming.
function wordEquivalent(token, word) {
    if (token === word) {
        return true;
    }
    const [shortWord, longWord] = token.length <= word.length ? [
        token,
        word
    ] : [
        word,
        token
    ];
    return longWord === `${shortWord}s` || longWord === `${shortWord}es`;
}
// all_words: every token of the (multi-word) keyword must appear as a word in the
// field value, in ANY order. This is what makes "interest income" match the GL
// label "Investment Income - Interest" that plain substring matching misses.
function matchesAllWords(fieldValue, normalizedKeyword) {
    const keywordTokens = normalizedKeyword.split(" ").filter(Boolean);
    if (keywordTokens.length === 0) {
        return false;
    }
    const fieldWords = fieldValue.split(" ").filter(Boolean);
    return keywordTokens.every((token)=>fieldWords.some((word)=>wordEquivalent(token, word)));
}
function keywordMatches({ fieldValues, keyword, mode }) {
    const normalizedKeyword = normalize(keyword);
    if (mode === "exact") {
        return fieldValues.some((value)=>value === normalizedKeyword);
    }
    if (mode === "starts_with") {
        return fieldValues.some((value)=>value.startsWith(normalizedKeyword));
    }
    if (mode === "all_words") {
        return fieldValues.some((value)=>matchesAllWords(value, normalizedKeyword));
    }
    return fieldValues.some((value)=>value.includes(normalizedKeyword));
}
function getKeywordCandidates(rule, fallbackMode) {
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
            mode: rule.matchMode || fallbackMode
        }));
}
function hasExcludedKeyword(rule, fieldValues) {
    return (rule.excludeKeywords || []).some((keyword)=>keywordMatches({
            fieldValues,
            keyword,
            mode: "contains"
        }));
}
function findMatches({ config, row, rules }) {
    const fieldValues = getFieldValues(row, config.matchFields);
    return rules.flatMap((rule)=>{
        if (hasExcludedKeyword(rule, fieldValues)) {
            return [];
        }
        const matchedKeyword = getKeywordCandidates(rule, config.matchMode).find((candidate)=>keywordMatches({
                fieldValues,
                keyword: candidate.keyword,
                mode: candidate.mode
            }));
        return matchedKeyword ? [
            {
                matchedKeyword: matchedKeyword.keyword,
                rule
            }
        ] : [];
    });
}
function chooseMatch(matches, strategy) {
    const sorted = [
        ...matches
    ].sort((a, b)=>{
        if (strategy === "highest_priority") {
            const priorityA = a.rule.priority ?? Number.MAX_SAFE_INTEGER;
            const priorityB = b.rule.priority ?? Number.MAX_SAFE_INTEGER;
            return priorityA - priorityB || b.rule.confidence - a.rule.confidence;
        }
        return b.rule.confidence - a.rule.confidence;
    });
    return sorted[0];
}
function traceForRow(row) {
    return row.sourceTrace || [];
}
function traceForRule(rule) {
    return rule.sourceTrace || [];
}
function evidenceForRow(row) {
    return row.evidenceRefs || [];
}
function evidenceForRule(rule) {
    return rule.evidenceRefs || [];
}
function createMappedRow({ matchedKeyword, row, rule }) {
    const rowSourceTrace = traceForRow(row);
    const ruleSourceTrace = traceForRule(rule);
    const mappedRow = {
        ...row,
        confidence: rule.confidence,
        evidenceRefs: [
            ...evidenceForRow(row),
            ...evidenceForRule(rule)
        ],
        categoryId: rule.categoryId,
        categoryLabel: rule.categoryLabel,
        matchedKeyword,
        matchedRuleId: rule.ruleId,
        rowSourceTrace,
        ruleId: rule.ruleId,
        ruleTrace: ruleSourceTrace,
        ruleSourceTrace,
        sourceRow: {
            ...row
        },
        sourceTrace: [
            ...rowSourceTrace,
            ...ruleSourceTrace
        ],
        status: "mapped",
        target: rule.target || rule.categoryId
    };
    if (rule.suggestedLine) {
        mappedRow.suggestedLine = rule.suggestedLine;
    }
    if (rule.suggestedSection) {
        mappedRow.suggestedSection = rule.suggestedSection;
    }
    if (rule.suggestedSubsection) {
        mappedRow.suggestedSubsection = rule.suggestedSubsection;
    }
    if (rule.lineId) {
        mappedRow.lineId = rule.lineId;
    }
    if (rule.sectionId) {
        mappedRow.sectionId = rule.sectionId;
    }
    if (rule.subsectionId) {
        mappedRow.subsectionId = rule.subsectionId;
    }
    return mappedRow;
}
function getCategoryCounts(rows) {
    return rows.reduce((counts, row)=>{
        counts[row.categoryId] = (counts[row.categoryId] || 0) + 1;
        return counts;
    }, {});
}
function getCategoryAmountTotals(rows) {
    return rows.reduce((totals, row)=>{
        totals[row.categoryId] = (totals[row.categoryId] || 0) + row.amount;
        return totals;
    }, {});
}
function averageConfidence(rows) {
    if (rows.length === 0) {
        return;
    }
    return rows.reduce((total, row)=>total + row.confidence, 0) / rows.length;
}
function createErrorResult({ context, errors }) {
    return {
        blockId: context.block.id,
        completedAt: new Date().toISOString(),
        errors,
        evidenceRefs: [],
        logs: errors.map((message)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])(message)),
        outputs: {
            conflicts: {
                conflictCount: 0,
                conflicts: []
            },
            low_confidence_rows: {
                lowConfidenceRows: [],
                rowCount: 0
            },
            mapped_rows: {
                mappedRows: [],
                rowCount: 0
            },
            mapping_summary: {
                categoryAmountTotals: {},
                categoryCounts: {},
                conflictCount: 0,
                lowConfidenceCount: 0,
                mappedCount: 0,
                ruleSourceCount: 0,
                rulesUsedCount: 0,
                totalRows: 0,
                unmatchedCount: 0
            },
            unmatched_rows: {
                rowCount: 0,
                unmatchedRows: []
            }
        },
        primaryOutputRole: "mapping_summary",
        runId: context.runId,
        sourceTrace: [],
        startedAt: context.startedAt,
        status: "error",
        toolId: "logic.keyword_mapper",
        warnings: []
    };
}
function getMissingInputErrors({ rows, rules }) {
    return [
        rows.length === 0 ? "Keyword Mapper needs Data rows input." : "",
        rules.length === 0 ? "Keyword Mapper needs Keyword rules input." : ""
    ].filter(Boolean);
}
function runKeywordMapper(context) {
    const rows = getRows(context);
    const rules = getRules(context);
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$keyword$2d$mapper$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseKeywordMapperConfig"])(context.config);
    const missingErrors = getMissingInputErrors({
        rows,
        rules
    });
    if (missingErrors.length > 0) {
        return createErrorResult({
            context,
            errors: missingErrors
        });
    }
    const mappedRows = [];
    const unmatchedRows = [];
    const conflicts = [];
    for (const row of rows){
        const matches = findMatches({
            config,
            row,
            rules
        });
        const chosenMatch = chooseMatch(matches, config.conflictStrategy);
        if (!chosenMatch) {
            if (config.unmatchedStrategy !== "ignore") {
                unmatchedRows.push({
                    ...row,
                    categoryId: "unmatched",
                    categoryLabel: "Unmatched",
                    confidence: 0.35,
                    status: "unmatched"
                });
            }
            continue;
        }
        if (matches.length > 1) {
            conflicts.push({
                label: row.label,
                matchedRuleIds: matches.map((match)=>match.rule.ruleId),
                rowId: row.rowId,
                strategy: config.conflictStrategy
            });
        }
        mappedRows.push(createMappedRow({
            matchedKeyword: chosenMatch.matchedKeyword,
            row,
            rule: chosenMatch.rule
        }));
    }
    const lowConfidenceRows = mappedRows.filter((row)=>row.confidence < config.lowConfidenceThreshold);
    for (const row of lowConfidenceRows){
        row.status = "low_confidence";
    }
    const warnings = [
        unmatchedRows.length > 0 ? `${unmatchedRows.length} row(s) were not matched by keyword rules.` : "",
        lowConfidenceRows.length > 0 ? `${lowConfidenceRows.length} mapped row(s) are below confidence ${config.lowConfidenceThreshold}.` : "",
        conflicts.length > 0 ? `${conflicts.length} row(s) matched more than one keyword rule.` : ""
    ].filter(Boolean);
    const evidenceRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dedupeEvidenceRefs"])([
        ...mappedRows.flatMap((row)=>row.evidenceRefs || []),
        ...unmatchedRows.flatMap((row)=>row.evidenceRefs || [])
    ]);
    const sourceTrace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dedupeSourceTrace"])([
        ...mappedRows.flatMap((row)=>row.sourceTrace || []),
        ...unmatchedRows.flatMap((row)=>row.sourceTrace || [])
    ]);
    const mappingSummary = {
        conflictCount: conflicts.length,
        categoryAmountTotals: getCategoryAmountTotals(mappedRows),
        categoryCounts: getCategoryCounts(mappedRows),
        lowConfidenceCount: lowConfidenceRows.length,
        mappedCount: mappedRows.length,
        rulesUsedCount: new Set(mappedRows.map((row)=>row.ruleId)).size,
        ruleSourceCount: new Set(rules.map((rule)=>rule.sourceTrace?.[0]?.sourceBlockId || rule.ruleId)).size,
        totalRows: rows.length,
        unmatchedCount: unmatchedRows.length
    };
    return {
        blockId: context.block.id,
        completedAt: new Date().toISOString(),
        confidence: averageConfidence(mappedRows),
        errors: [],
        evidenceRefs,
        logs: [
            warnings.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warning"])("Keyword mapping completed with review findings.", {
                ...mappingSummary
            }) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["info"])("Keyword mapping completed from connected Source rules.", {
                ...mappingSummary
            })
        ],
        outputs: {
            conflicts: {
                conflictCount: conflicts.length,
                conflicts
            },
            low_confidence_rows: {
                lowConfidenceRows,
                rowCount: lowConfidenceRows.length
            },
            mapped_rows: {
                mappedRows,
                rowCount: mappedRows.length
            },
            mapping_summary: {
                ...mappingSummary,
                rulesUsed: rules.map((rule)=>({
                        categoryId: rule.categoryId,
                        categoryLabel: rule.categoryLabel,
                        confidence: rule.confidence,
                        keywords: rule.keywords,
                        matchMode: rule.matchMode,
                        priority: rule.priority,
                        ruleId: rule.ruleId,
                        suggestedLine: rule.suggestedLine,
                        suggestedSection: rule.suggestedSection,
                        suggestedSubsection: rule.suggestedSubsection
                    }))
            },
            unmatched_rows: {
                rowCount: unmatchedRows.length,
                unmatchedRows
            }
        },
        primaryOutputRole: "mapped_rows",
        runId: context.runId,
        sourceTrace,
        startedAt: context.startedAt,
        status: warnings.length > 0 ? "warning" : "success",
        toolId: "logic.keyword_mapper",
        warnings
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/logic/keyword-mapper/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "keywordMapperToolModule",
    ()=>keywordMapperToolModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$keyword$2d$mapper$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/logic/keyword-mapper/definition.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$keyword$2d$mapper$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/logic/keyword-mapper/run.ts [app-client] (ecmascript)");
;
;
const keywordMapperToolModule = {
    definition: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$keyword$2d$mapper$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keywordMapperDefinition"],
    run: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$keyword$2d$mapper$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runKeywordMapper"]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/aggregation-rules/fixtures.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SAMPLE_AGGREGATION_RULES",
    ()=>SAMPLE_AGGREGATION_RULES
]);
const SAMPLE_AGGREGATION_RULES = [
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
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/aggregation-rules/definition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "aggregationRulesDefinition",
    ()=>aggregationRulesDefinition
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$aggregation$2d$rules$2f$fixtures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/aggregation-rules/fixtures.ts [app-client] (ecmascript)");
;
const aggregationRulesDefinition = {
    defaultConfig: {
        aggregationRules: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$aggregation$2d$rules$2f$fixtures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SAMPLE_AGGREGATION_RULES"],
        sourceKind: "aggregation_rules"
    },
    description: "Reads category hierarchy, calculator operations, and final-result rollup rules from a rulebook.",
    displayName: "Aggregation Rulebook",
    family: "Source",
    inputRoles: [],
    outputRoles: [
        {
            canRouteToFamilies: [
                "Logic"
            ],
            description: "Aggregation hierarchy and formula rules for downstream rollup tools.",
            id: "aggregation_rules",
            label: "Aggregation rules",
            outputKey: "aggregationRules",
            outputType: "aggregation_rules",
            samplePreview: "7 aggregation nodes"
        },
        {
            canRouteToFamilies: [
                "Logic",
                "Output",
                "Review / Validation"
            ],
            description: "Aggregation rule nodes organized as a rollup hierarchy.",
            id: "aggregation_tree",
            label: "Aggregation tree",
            outputKey: "aggregationTree",
            outputType: "aggregation_tree",
            samplePreview: "aggregation hierarchy"
        },
        {
            canRouteToFamilies: [
                "Logic",
                "Output",
                "Review / Validation"
            ],
            description: "Aggregation rulebook metadata and governance status.",
            id: "rule_metadata",
            label: "Rule metadata",
            outputKey: "ruleMetadata",
            outputType: "rule_metadata",
            samplePreview: "aggregation rule metadata"
        },
        {
            canRouteToFamilies: [
                "Logic",
                "Output",
                "Review / Validation"
            ],
            description: "Aggregation rulebook version reference.",
            id: "rule_version",
            label: "Rule version",
            outputKey: "ruleVersion",
            outputType: "rule_version",
            samplePreview: "v1"
        }
    ],
    runMode: "local_mock",
    subtype: "Aggregation Rules",
    toolGroup: "source",
    toolId: "source.aggregation_rules"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/aggregation-rules/run.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runAggregationRulesSource",
    ()=>runAggregationRulesSource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/events.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/lineage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$aggregation$2d$rules$2f$fixtures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/aggregation-rules/fixtures.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$aggregation$2d$rules$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/aggregation-rules/schema.ts [app-client] (ecmascript)");
;
;
;
;
function getRuleValuePreview(rule) {
    const operands = (rule.operands || []).map((operand)=>operand.refType === "constant" ? String(operand.value ?? 0) : `${operand.refType}:${operand.refId || ""}`);
    return [
        ...(rule.includeCategoryIds || []).map((categoryId)=>`category:${categoryId}`),
        ...rule.children.map((childId)=>`node:${childId}`),
        ...operands,
        rule.formulaExpression ? `formula:${rule.formulaExpression}` : "",
        rule.value !== undefined ? `value:${rule.value}` : ""
    ].filter(Boolean).join(", ");
}
function runAggregationRulesSource(context) {
    const rules = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$aggregation$2d$rules$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseAggregationRules"])({
        config: context.config,
        fallbackRules: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$aggregation$2d$rules$2f$fixtures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SAMPLE_AGGREGATION_RULES"]
    });
    const evidenceRefs = rules.map((rule)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEvidenceRef"])({
            block: context.block,
            label: `${rule.label} aggregation rule`,
            ruleId: rule.nodeId,
            sourceKind: "aggregation_rules",
            valuePreview: getRuleValuePreview(rule)
        }));
    const sourceTrace = evidenceRefs.map((evidenceRef)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSourceTraceRef"])({
            evidenceRef
        }));
    const aggregationRuleEvidence = Object.fromEntries(rules.map((rule)=>[
            rule.nodeId,
            evidenceRefs.filter((ref)=>ref.ruleId === rule.nodeId)
        ]));
    const aggregationRuleTrace = Object.fromEntries(rules.map((rule)=>[
            rule.nodeId,
            sourceTrace.filter((trace)=>trace.ruleId === rule.nodeId)
        ]));
    const aggregationRules = rules.map((rule)=>({
            ...rule,
            evidenceRefs: aggregationRuleEvidence[rule.nodeId],
            immutable: true,
            readOnlyEvidence: true,
            sourceTrace: aggregationRuleTrace[rule.nodeId]
        }));
    const sourceVersion = Number(context.config.sourceVersion || 1);
    const ruleVersion = String(context.config.ruleVersion || `v${sourceVersion}`);
    const aggregationTree = aggregationRules.map((rule)=>({
            children: rule.children,
            includeCategoryIds: rule.includeCategoryIds || [],
            formulaExpression: rule.formulaExpression,
            label: rule.label,
            nodeId: rule.nodeId,
            nodeType: rule.nodeType,
            operands: rule.operands || [],
            operation: rule.operation,
            resultName: rule.resultName,
            value: rule.value
        }));
    const ruleMetadata = {
        readOnlyEvidence: true,
        ruleCount: rules.length,
        ruleVersion,
        sourceId: context.block.id,
        sourceKind: "aggregation_rules",
        sourceLocator: context.config.sourceLocator,
        sourceName: context.block.label,
        sourceStatus: context.config.sourceStatus || "draft",
        sourceSubtype: context.block.subtype,
        sourceVersion,
        updatedAt: context.block.updatedAt
    };
    return {
        blockId: context.block.id,
        completedAt: new Date().toISOString(),
        errors: [],
        evidenceRefs,
        logs: [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["info"])("Aggregation Rulebook emitted governed hierarchy rules.", {
                ruleCount: rules.length
            })
        ],
        outputs: {
            aggregation_rules: {
                aggregationRuleEvidence,
                aggregationRules,
                aggregationRuleTrace,
                aggregationTree,
                immutable: true,
                readOnlyEvidence: true,
                ruleCount: rules.length,
                ruleMetadata,
                ruleVersion,
                sourceKind: "aggregation_rules"
            },
            aggregation_tree: {
                aggregationTree,
                immutable: true,
                readOnlyEvidence: true,
                sourceKind: "aggregation_rules"
            },
            rule_metadata: ruleMetadata,
            rule_version: {
                ruleVersion,
                sourceStatus: ruleMetadata.sourceStatus,
                sourceVersion
            }
        },
        primaryOutputRole: "aggregation_rules",
        runId: context.runId,
        sourceTrace,
        startedAt: context.startedAt,
        status: "success",
        toolId: "source.aggregation_rules",
        warnings: []
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/aggregation-rules/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "aggregationRulesToolModule",
    ()=>aggregationRulesToolModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$aggregation$2d$rules$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/aggregation-rules/definition.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$aggregation$2d$rules$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/aggregation-rules/run.ts [app-client] (ecmascript)");
;
;
const aggregationRulesToolModule = {
    definition: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$aggregation$2d$rules$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aggregationRulesDefinition"],
    run: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$aggregation$2d$rules$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runAggregationRulesSource"]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/calculation-rules/definition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculationRulesDefinition",
    ()=>calculationRulesDefinition
]);
const calculationRulesDefinition = {
    defaultConfig: {
        sourceKind: "calculation_rules"
    },
    description: "Emits governed formula rules for calculating named results from named values.",
    displayName: "Calculation Rules Source",
    family: "Source",
    inputRoles: [],
    outputRoles: [
        {
            canRouteToFamilies: [
                "Logic",
                "Review / Validation",
                "Output"
            ],
            description: "Formula rules consumed by the Calculation Engine.",
            id: "calculation_rules",
            label: "Calculation rules",
            outputKey: "calculationRules",
            outputType: "calculation_rules",
            samplePreview: "GROSS, NET_FAPI, NET_FAPI_CAD"
        },
        {
            canRouteToFamilies: [
                "Review / Validation",
                "Output"
            ],
            description: "Calculation rule metadata and versioning information.",
            id: "rule_metadata",
            label: "Rule metadata",
            outputKey: "ruleMetadata",
            outputType: "rule_metadata"
        },
        {
            canRouteToFamilies: [
                "Review / Validation",
                "Output"
            ],
            description: "Calculation rule source version.",
            id: "rule_version",
            label: "Rule version",
            outputKey: "ruleVersion",
            outputType: "rule_version"
        }
    ],
    runMode: "local_mock",
    subtype: "Calculation Rules",
    toolGroup: "source",
    toolId: "source.calculation_rules"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/calculation-rules/fixtures.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SAMPLE_CALCULATION_RULES",
    ()=>SAMPLE_CALCULATION_RULES
]);
const SAMPLE_CALCULATION_RULES = [
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
        calculationId: "A1",
        description: "A1 = debtForgiveness * 2",
        label: "A1",
        operands: [
            "debtForgiveness",
            2
        ],
        operation: "multiply",
        resultKey: "A1"
    },
    {
        calculationId: "A2",
        description: "A2 = priorYearG",
        label: "A2",
        operands: [
            "priorYearG"
        ],
        operation: "pass_through",
        resultKey: "A2"
    },
    {
        calculationId: "B",
        description: "B = capGains * inclusionRate",
        label: "B",
        operands: [
            "capGains",
            "inclusionRate"
        ],
        operation: "multiply",
        resultKey: "B"
    },
    {
        calculationId: "C",
        description: "C = cfaIncome",
        label: "C",
        operands: [
            "cfaIncome"
        ],
        operation: "pass_through",
        resultKey: "C"
    },
    {
        calculationId: "D",
        description: "D = businessLosses",
        label: "D",
        operands: [
            "businessLosses"
        ],
        operation: "pass_through",
        resultKey: "D"
    },
    {
        calculationId: "E",
        description: "E = faclCarryforward",
        label: "E",
        operands: [
            "faclCarryforward"
        ],
        operation: "pass_through",
        resultKey: "E"
    },
    {
        calculationId: "F",
        description: "F = prescribedAmount",
        label: "F",
        operands: [
            "prescribedAmount"
        ],
        operation: "pass_through",
        resultKey: "F"
    },
    {
        calculationId: "F1",
        description: "F1 = prescribedAmountF1",
        label: "F1",
        operands: [
            "prescribedAmountF1"
        ],
        operation: "pass_through",
        resultKey: "F1"
    },
    {
        calculationId: "G",
        description: "G = dividendDeductions",
        label: "G",
        operands: [
            "dividendDeductions"
        ],
        operation: "pass_through",
        resultKey: "G"
    },
    {
        calculationId: "H",
        description: "H = partnershipDividends",
        label: "H",
        operands: [
            "partnershipDividends"
        ],
        operation: "pass_through",
        resultKey: "H"
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
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/calculation-rules/run.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runCalculationRulesSource",
    ()=>runCalculationRulesSource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/events.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/lineage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$calculation$2d$rules$2f$fixtures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/calculation-rules/fixtures.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$calculation$2d$rules$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/calculation-rules/schema.ts [app-client] (ecmascript)");
;
;
;
;
function runCalculationRulesSource(context) {
    const rules = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$calculation$2d$rules$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseCalculationRules"])({
        config: context.config,
        fallbackRules: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$calculation$2d$rules$2f$fixtures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SAMPLE_CALCULATION_RULES"]
    });
    const evidenceRefs = rules.map((rule)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEvidenceRef"])({
            block: context.block,
            label: `${rule.label} calculation rule`,
            ruleId: rule.calculationId,
            sourceKind: "calculation_rules",
            valuePreview: rule.formulaExpression ? `${rule.resultKey} = ${rule.formulaExpression}` : `${rule.resultKey} = ${rule.operation}(${rule.operands.join(", ")})`
        }));
    const sourceTrace = evidenceRefs.map((evidenceRef)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSourceTraceRef"])({
            evidenceRef
        }));
    const calculationRuleEvidence = Object.fromEntries(rules.map((rule)=>[
            rule.calculationId,
            evidenceRefs.filter((ref)=>ref.ruleId === rule.calculationId)
        ]));
    const calculationRuleTrace = Object.fromEntries(rules.map((rule)=>[
            rule.calculationId,
            sourceTrace.filter((trace)=>trace.ruleId === rule.calculationId)
        ]));
    const calculationRules = rules.map((rule)=>({
            ...rule,
            evidenceRefs: calculationRuleEvidence[rule.calculationId],
            immutable: true,
            readOnlyEvidence: true,
            sourceTrace: calculationRuleTrace[rule.calculationId]
        }));
    const sourceVersion = Number(context.config.sourceVersion || 1);
    const ruleVersion = String(context.config.ruleVersion || `v${sourceVersion}`);
    const ruleMetadata = {
        readOnlyEvidence: true,
        ruleCount: rules.length,
        ruleVersion,
        sourceId: context.block.id,
        sourceKind: "calculation_rules",
        sourceLocator: context.config.sourceLocator,
        sourceName: context.block.label,
        sourceStatus: context.config.sourceStatus || "draft",
        sourceSubtype: context.block.subtype,
        sourceVersion,
        updatedAt: context.block.updatedAt
    };
    return {
        blockId: context.block.id,
        completedAt: new Date().toISOString(),
        errors: [],
        evidenceRefs,
        logs: [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["info"])("Calculation Rules Source emitted governed formula rules.", {
                ruleCount: rules.length
            })
        ],
        outputs: {
            calculation_rules: {
                calculationRuleEvidence,
                calculationRules,
                calculationRuleTrace,
                immutable: true,
                readOnlyEvidence: true,
                ruleCount: rules.length,
                ruleMetadata,
                ruleVersion,
                sourceKind: "calculation_rules"
            },
            rule_metadata: ruleMetadata,
            rule_version: {
                ruleVersion,
                sourceStatus: ruleMetadata.sourceStatus,
                sourceVersion
            }
        },
        primaryOutputRole: "calculation_rules",
        runId: context.runId,
        sourceTrace,
        startedAt: context.startedAt,
        status: "success",
        toolId: "source.calculation_rules",
        warnings: []
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/calculation-rules/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculationRulesToolModule",
    ()=>calculationRulesToolModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$calculation$2d$rules$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/calculation-rules/definition.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$calculation$2d$rules$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/calculation-rules/run.ts [app-client] (ecmascript)");
;
;
const calculationRulesToolModule = {
    definition: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$calculation$2d$rules$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculationRulesDefinition"],
    run: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$calculation$2d$rules$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runCalculationRulesSource"]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/currency-rate/definition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "currencyRateDefinition",
    ()=>currencyRateDefinition
]);
const currencyRateDefinition = {
    defaultConfig: {
        documentCurrency: "USD",
        fapiYear: 2025,
        overrideRate: 1.35,
        rateProvider: "bank_of_canada",
        rateType: "annual_average",
        reportingCurrency: "CAD",
        sourceKind: "currency_rate"
    },
    description: "Represents an external Bank of Canada FX rate reference with deterministic local override support.",
    displayName: "Bank of Canada FX Rate Source",
    family: "Source",
    inputRoles: [],
    outputRoles: [
        {
            canRouteToFamilies: [
                "Logic",
                "Review / Validation",
                "Output"
            ],
            description: "Exchange rate used to convert document currency.",
            id: "exchange_rate",
            label: "Exchange rate",
            outputKey: "exchangeRateInfo",
            outputType: "exchange_rate",
            samplePreview: "USD -> CAD 1.35"
        },
        {
            canRouteToFamilies: [
                "Logic",
                "Review / Validation",
                "Output"
            ],
            description: "Rate source, year, warning, and conversion metadata.",
            id: "rate_metadata",
            label: "Rate metadata",
            outputKey: "rateMetadata",
            outputType: "rate_metadata",
            samplePreview: "override"
        }
    ],
    runMode: "local_mock",
    subtype: "Currency Rate",
    toolGroup: "source",
    toolId: "source.currency_rate"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/currency-rate/schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAnnualAverageExchangeRate",
    ()=>fetchAnnualAverageExchangeRate,
    "parseCurrencyRateConfig",
    ()=>parseCurrencyRateConfig
]);
function optionalString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function parseNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value !== "string") {
        return;
    }
    const parsed = Number(value.replaceAll(",", "").trim());
    return Number.isFinite(parsed) ? parsed : undefined;
}
function parseCurrencyRateConfig(config) {
    const fapiInputs = typeof config.fapiInputs === "object" && config.fapiInputs !== null ? config.fapiInputs : {};
    const source = {
        ...config,
        ...fapiInputs
    };
    return {
        documentCurrency: optionalString(source.documentCurrency) || optionalString(source.sourceCurrency) || "USD",
        fapiYear: parseNumber(source.fapiYear),
        liveRate: parseNumber(source.liveRate) || parseNumber(source.fetchedRate) || parseNumber(source.valetRate),
        overrideReason: optionalString(source.overrideReason),
        overrideRate: parseNumber(source.overrideRate) || parseNumber(source.fxRate) || parseNumber(source.exchangeRate),
        rateProvider: optionalString(source.rateProvider) || "bank_of_canada",
        rateType: optionalString(source.rateType) || "annual_average",
        reportingCurrency: optionalString(source.reportingCurrency) || optionalString(source.targetCurrency) || "CAD"
    };
}
async function fetchAnnualAverageExchangeRate({ documentCurrency, reportingCurrency, year }) {
    if (documentCurrency === reportingCurrency) {
        return {
            rate: 1,
            rateSource: "same_currency",
            rateType: "same_currency",
            rateYear: year
        };
    }
    if (reportingCurrency !== "CAD") {
        throw new Error("The local Bank of Canada lookup currently supports rates expressed in CAD.");
    }
    const seriesName = `FX${documentCurrency}CAD`;
    const response = await fetch(`https://www.bankofcanada.ca/valet/observations/${encodeURIComponent(seriesName)}/json?start_date=${year}-01-01&end_date=${year}-12-31`);
    if (!response.ok) {
        throw new Error(`FX lookup failed with HTTP ${response.status}.`);
    }
    const payload = await response.json();
    const values = payload.observations?.map((observation)=>{
        const seriesValue = observation[seriesName];
        const rawValue = typeof seriesValue === "object" && seriesValue !== null ? seriesValue.v : seriesValue;
        return typeof rawValue === "string" ? Number(rawValue) : Number.NaN;
    }).filter((value)=>Number.isFinite(value)) || [];
    if (values.length === 0) {
        throw new Error("FX lookup response did not include a usable rate.");
    }
    const rate = values.reduce((total, value)=>total + value, 0) / values.length;
    return {
        rate,
        rateSource: "bank_of_canada_valet",
        rateType: "annual_average",
        rateYear: year,
        seriesName
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/currency-rate/run.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runCurrencyRateSource",
    ()=>runCurrencyRateSource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/events.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/lineage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$currency$2d$rate$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/currency-rate/schema.ts [app-client] (ecmascript)");
;
;
;
function getRateYear(year) {
    return year || new Date().getFullYear();
}
function runCurrencyRateSource(context) {
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$currency$2d$rate$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseCurrencyRateConfig"])(context.config);
    const documentCurrency = config.documentCurrency.toUpperCase();
    const reportingCurrency = config.reportingCurrency.toUpperCase();
    const rateYear = getRateYear(config.fapiYear);
    const sameCurrency = documentCurrency === reportingCurrency;
    const overrideRate = config.overrideRate;
    const liveRate = config.liveRate;
    const hasLiveRate = !sameCurrency && typeof liveRate === "number" && Number.isFinite(liveRate);
    const warnings = [];
    // Prefer the live Bank of Canada Valet rate when one has been fetched;
    // otherwise fall back to the workbook-provided override.
    let rate = sameCurrency ? 1 : hasLiveRate ? liveRate : overrideRate;
    let rateSource = sameCurrency ? "same_currency" : hasLiveRate ? "bank_of_canada_valet" : "override";
    let rateType = sameCurrency ? "same_currency" : hasLiveRate ? config.rateType || "annual_average" : "user_override";
    if (!(typeof rate === "number" && Number.isFinite(rate))) {
        warnings.push("No FX override was supplied. The Bank of Canada lookup path is available for later integration, but local deterministic runs require an override.");
        rate = 0;
        rateSource = "missing_override";
        rateType = "missing";
    }
    const exchangeRate = {
        conversion_applied: documentCurrency !== reportingCurrency,
        documentCurrency,
        exchange_rate: rate,
        override_reason: config.overrideReason,
        provider: config.rateProvider || "bank_of_canada",
        rate,
        rate_source: rateSource,
        rate_type: rateType,
        rate_year: rateYear,
        reportingCurrency,
        warning: warnings[0]
    };
    const fapiInputs = {
        fxRate: rate
    };
    const evidenceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEvidenceRef"])({
        block: context.block,
        label: `${documentCurrency} to ${reportingCurrency} exchange rate`,
        sourceKind: "currency_rate",
        valuePreview: `${rate}`
    });
    const sourceTrace = [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSourceTraceRef"])({
            evidenceRef
        })
    ];
    const rateMetadata = {
        fetcher: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$currency$2d$rate$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAnnualAverageExchangeRate"].name,
        live: hasLiveRate,
        provider: config.rateProvider || "bank_of_canada",
        rate_source: rateSource,
        sourceId: context.block.id,
        sourceKind: "currency_rate",
        sourceName: context.block.label,
        sourceStatus: context.config.sourceStatus || "draft",
        sourceVersion: Number(context.config.sourceVersion || 1),
        warning: warnings[0]
    };
    return {
        blockId: context.block.id,
        completedAt: new Date().toISOString(),
        errors: [],
        evidenceRefs: [
            evidenceRef
        ],
        logs: [
            warnings.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warning"])("Currency rate source emitted with warnings.", {
                ...exchangeRate
            }) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["info"])("Currency rate source emitted Bank of Canada FX reference.", {
                ...exchangeRate
            })
        ],
        outputs: {
            exchange_rate: exchangeRate,
            fapi_inputs: {
                fapiInputs
            },
            rate_metadata: rateMetadata
        },
        primaryOutputRole: "exchange_rate",
        runId: context.runId,
        sourceTrace,
        startedAt: context.startedAt,
        status: warnings.length > 0 && rateSource === "missing_override" ? "warning" : "success",
        toolId: "source.currency_rate",
        warnings
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/currency-rate/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "currencyRateToolModule",
    ()=>currencyRateToolModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$currency$2d$rate$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/currency-rate/definition.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$currency$2d$rate$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/currency-rate/run.ts [app-client] (ecmascript)");
;
;
const currencyRateToolModule = {
    definition: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$currency$2d$rate$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["currencyRateDefinition"],
    run: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$currency$2d$rate$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runCurrencyRateSource"]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/fapi-inputs/definition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fapiInputsDefinition",
    ()=>fapiInputsDefinition
]);
const fapiInputsDefinition = {
    defaultConfig: {
        documentCurrency: "USD",
        expectedResults: {},
        fatPaid: 100,
        fapiYear: 2025,
        inclusionRate: 0.5,
        reportingCurrency: "CAD",
        rtf: 1.9,
        sourceKind: "fapi_inputs"
    },
    description: "Emits workbook calculation assumptions such as inclusion rate, RTF, FAT paid, and expected results. FX rates are supplied by a separate rate source/review path.",
    displayName: "FAPI Inputs Source",
    family: "Source",
    inputRoles: [],
    outputRoles: [
        {
            canRouteToFamilies: [
                "Logic",
                "Review / Validation",
                "Output"
            ],
            description: "Calculation inputs imported from the workbook input sheet, excluding reviewed FX rate.",
            id: "fapi_inputs",
            label: "FAPI inputs",
            outputKey: "fapiInputs",
            outputType: "fapi_inputs",
            samplePreview: "inclusion 0.5, RTF 1.9, FAT paid 100"
        },
        {
            canRouteToFamilies: [
                "Review / Validation",
                "Output"
            ],
            description: "Input source, workbook sheet, version, and status metadata.",
            id: "input_metadata",
            label: "Input metadata",
            outputKey: "inputMetadata",
            outputType: "source_metadata",
            samplePreview: "FAPI Inputs sheet"
        }
    ],
    runMode: "local_mock",
    subtype: "Manual Entry",
    toolGroup: "source",
    toolId: "source.fapi_inputs"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/fapi-inputs/schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseFapiInputsConfig",
    ()=>parseFapiInputsConfig
]);
// Platform snaps RTF to one of these; default 1.9.
const ALLOWED_RTF_VALUES = [
    1.9,
    4
];
const DEFAULT_RTF_VALUE = 1.9;
function normalizeRtf(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return DEFAULT_RTF_VALUE;
    }
    return ALLOWED_RTF_VALUES.find((allowed)=>Math.abs(allowed - value) < 1e-7) ?? DEFAULT_RTF_VALUE;
}
function optionalString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function parseNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value !== "string") {
        return;
    }
    const parsed = Number(value.replaceAll(",", "").trim());
    return Number.isFinite(parsed) ? parsed : undefined;
}
function parseExpectedResults(value) {
    if (typeof value !== "object" || value === null) {
        return {};
    }
    return Object.fromEntries(Object.entries(value).map(([key, item])=>[
            key,
            parseNumber(item)
        ]).filter((entry)=>entry[1] !== undefined));
}
function parseFapiInputsConfig(config) {
    const fapiInputs = typeof config.fapiInputs === "object" && config.fapiInputs !== null ? config.fapiInputs : {};
    const source = {
        ...config,
        ...fapiInputs
    };
    return {
        documentCurrency: optionalString(source.documentCurrency) || optionalString(source.sourceCurrency),
        expectedResults: parseExpectedResults(source.expectedResults),
        fatPaid: parseNumber(source.fatPaid),
        fapiYear: parseNumber(source.fapiYear),
        inclusionRate: parseNumber(source.inclusionRate),
        reportingCurrency: optionalString(source.reportingCurrency) || optionalString(source.targetCurrency),
        rtf: normalizeRtf(parseNumber(source.rtf) ?? parseNumber(source.rtfRate)),
        // P defaults to 1 (no scaling); pure assumptions default to 0.
        pCoefficient: parseNumber(source.pCoefficient) ?? 1,
        canadianRules95_4: parseNumber(source.canadianRules95_4) ?? 0,
        priorYearG: parseNumber(source.priorYearG) ?? 0,
        // These four are normally DERIVED by classifying trial-balance rows (the
        // rollup emits them as named values). Left undefined when not explicitly
        // entered, so they don't clobber the classified value; an explicit entry
        // still overrides. See fapi-template FAPI_ROLLUP_RULES.
        debtForgiveness: parseNumber(source.debtForgiveness),
        cfaIncome: parseNumber(source.cfaIncome),
        businessLosses: parseNumber(source.businessLosses),
        faclCarryforward: parseNumber(source.faclCarryforward),
        prescribedAmount: parseNumber(source.prescribedAmount) ?? 0,
        prescribedAmountF1: parseNumber(source.prescribedAmountF1) ?? 0,
        dividendDeductions: parseNumber(source.dividendDeductions) ?? 0,
        partnershipDividends: parseNumber(source.partnershipDividends) ?? 0
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/fapi-inputs/run.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runFapiInputsSource",
    ()=>runFapiInputsSource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/events.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/lineage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$fapi$2d$inputs$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/fapi-inputs/schema.ts [app-client] (ecmascript)");
;
;
;
function runFapiInputsSource(context) {
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$fapi$2d$inputs$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseFapiInputsConfig"])(context.config);
    const sourceVersion = Number(context.config.sourceVersion || 1);
    const fapiInputs = {
        documentCurrency: config.documentCurrency,
        expectedResults: config.expectedResults || {},
        fatPaid: config.fatPaid,
        fapiYear: config.fapiYear,
        inclusionRate: config.inclusionRate,
        reportingCurrency: config.reportingCurrency,
        rtf: config.rtf,
        // Line-driving assumptions consumed by the lines engine as named values.
        pCoefficient: config.pCoefficient,
        canadianRules95_4: config.canadianRules95_4,
        debtForgiveness: config.debtForgiveness,
        priorYearG: config.priorYearG,
        cfaIncome: config.cfaIncome,
        businessLosses: config.businessLosses,
        faclCarryforward: config.faclCarryforward,
        prescribedAmount: config.prescribedAmount,
        prescribedAmountF1: config.prescribedAmountF1,
        dividendDeductions: config.dividendDeductions,
        partnershipDividends: config.partnershipDividends
    };
    const evidenceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEvidenceRef"])({
        block: context.block,
        label: "FAPI workbook calculation inputs",
        sourceKind: "fapi_inputs",
        valuePreview: `inclusion ${fapiInputs.inclusionRate ?? "n/a"}, RTF ${fapiInputs.rtf ?? "n/a"}, FAT ${fapiInputs.fatPaid ?? "n/a"}`
    });
    const sourceTrace = [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSourceTraceRef"])({
            evidenceRef
        })
    ];
    const inputMetadata = {
        importedFromWorkbook: context.config.importedFromWorkbook,
        sourceId: context.block.id,
        sourceKind: "fapi_inputs",
        sourceLocator: context.config.sourceLocator,
        sourceName: context.block.label,
        sourceStatus: context.config.sourceStatus || "draft",
        sourceVersion
    };
    return {
        blockId: context.block.id,
        completedAt: new Date().toISOString(),
        errors: [],
        evidenceRefs: [
            evidenceRef
        ],
        logs: [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["info"])("FAPI input source emitted workbook calculation assumptions.", {
                inputMetadata
            })
        ],
        outputs: {
            fapi_inputs: {
                fapiInputs
            },
            input_metadata: inputMetadata
        },
        primaryOutputRole: "fapi_inputs",
        runId: context.runId,
        sourceTrace,
        startedAt: context.startedAt,
        status: "success",
        toolId: "source.fapi_inputs",
        warnings: []
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/fapi-inputs/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fapiInputsToolModule",
    ()=>fapiInputsToolModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$fapi$2d$inputs$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/fapi-inputs/definition.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$fapi$2d$inputs$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/fapi-inputs/run.ts [app-client] (ecmascript)");
;
;
const fapiInputsToolModule = {
    definition: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$fapi$2d$inputs$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fapiInputsDefinition"],
    run: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$fapi$2d$inputs$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runFapiInputsSource"]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/keyword-rules/fixtures.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SAMPLE_KEYWORD_RULES",
    ()=>SAMPLE_KEYWORD_RULES
]);
const SAMPLE_KEYWORD_RULES = [
    {
        categoryId: "interest_income",
        categoryLabel: "Interest Income",
        confidence: 0.9,
        keywords: [
            "interest income",
            "interest earned",
            "bank interest"
        ],
        matchMode: "contains",
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
        matchMode: "contains",
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
        matchMode: "contains",
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
        matchMode: "contains",
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
        matchMode: "contains",
        ruleId: "keyword-rule-other-fapi-income",
        suggestedLine: "A"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/keyword-rules/definition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "keywordRulesDefinition",
    ()=>keywordRulesDefinition
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$keyword$2d$rules$2f$fixtures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/keyword-rules/fixtures.ts [app-client] (ecmascript)");
;
const keywordRulesDefinition = {
    defaultConfig: {
        keywordRules: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$keyword$2d$rules$2f$fixtures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SAMPLE_KEYWORD_RULES"],
        sourceKind: "keyword_rules"
    },
    description: "Reads keyword-to-category matching rules from a rulebook.",
    displayName: "Keyword Rulebook",
    family: "Source",
    inputRoles: [],
    outputRoles: [
        {
            canRouteToFamilies: [
                "Logic"
            ],
            description: "Keyword-to-category rules for downstream mapping tools.",
            id: "keyword_rules",
            label: "Keyword rules",
            outputKey: "keywordRules",
            outputType: "keyword_rules",
            samplePreview: "5 keyword rules"
        },
        {
            canRouteToFamilies: [
                "Logic",
                "Output",
                "Review / Validation"
            ],
            description: "Keyword rulebook metadata and governance status.",
            id: "rule_metadata",
            label: "Rule metadata",
            outputKey: "ruleMetadata",
            outputType: "rule_metadata",
            samplePreview: "keyword rule metadata"
        },
        {
            canRouteToFamilies: [
                "Logic",
                "Output",
                "Review / Validation"
            ],
            description: "Keyword rulebook version reference.",
            id: "rule_version",
            label: "Rule version",
            outputKey: "ruleVersion",
            outputType: "rule_version",
            samplePreview: "v1"
        }
    ],
    runMode: "local_mock",
    subtype: "Keyword Rules",
    toolGroup: "source",
    toolId: "source.keyword_rules"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/keyword-rules/schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "normalizeKeywordRule",
    ()=>normalizeKeywordRule,
    "parseKeywordRules",
    ()=>parseKeywordRules
]);
const KEYWORD_LIST_DELIMITER_REGEX = /[,;\n|]/;
function asRecord(value) {
    return typeof value === "object" && value !== null ? value : null;
}
function asStringArray(value) {
    if (Array.isArray(value)) {
        return value.flatMap((item)=>String(item).split(KEYWORD_LIST_DELIMITER_REGEX)).map((item)=>item.trim()).filter(Boolean);
    }
    if (typeof value === "string") {
        return value.split(KEYWORD_LIST_DELIMITER_REGEX).map((item)=>item.trim()).filter(Boolean);
    }
    return [];
}
function parseNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value !== "string") {
        return;
    }
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : undefined;
}
function parseMatchMode(value) {
    if (value === "exact" || value === "starts_with" || value === "all_words") {
        return value;
    }
    if (value === "starts with") {
        return "starts_with";
    }
    if (value === "all words") {
        return "all_words";
    }
    return "contains";
}
function optionalString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function humanizeCategoryId(categoryId) {
    return categoryId.replaceAll("_", " ").replace(/\b\w/g, (letter)=>letter.toUpperCase());
}
function getKeywordBuckets(record) {
    const exactKeywords = asStringArray(record.exactKeywords);
    const containsKeywords = asStringArray(record.containsKeywords);
    const excludeKeywords = asStringArray(record.excludeKeywords);
    const legacyKeywords = asStringArray(record.keywords || record.keyword);
    const hasExplicitBuckets = exactKeywords.length + containsKeywords.length > 0;
    if (hasExplicitBuckets) {
        return {
            containsKeywords,
            exactKeywords,
            excludeKeywords,
            keywords: [
                ...exactKeywords,
                ...containsKeywords
            ]
        };
    }
    if (record.matchMode === "exact") {
        return {
            containsKeywords: [],
            exactKeywords: legacyKeywords,
            excludeKeywords,
            keywords: legacyKeywords
        };
    }
    // all_words: keep the phrases in `keywords` (no exact/contains bucket) so the
    // mapper's candidate list carries the rule's matchMode ("all_words").
    if (record.matchMode === "all_words") {
        return {
            containsKeywords: [],
            exactKeywords: [],
            excludeKeywords,
            keywords: legacyKeywords
        };
    }
    return {
        containsKeywords: legacyKeywords,
        exactKeywords: [],
        excludeKeywords,
        keywords: legacyKeywords
    };
}
function normalizeKeywordRule(value, index) {
    const record = asRecord(value);
    if (!record) {
        return null;
    }
    const keywordBuckets = getKeywordBuckets(record);
    const categoryId = optionalString(record.categoryId) || optionalString(record.category) || optionalString(record.target) || optionalString(record.subsectionId);
    if (!categoryId || keywordBuckets.keywords.length === 0) {
        return null;
    }
    const categoryLabel = optionalString(record.categoryLabel) || optionalString(record.label) || humanizeCategoryId(categoryId);
    return {
        categoryId,
        categoryLabel,
        comment: optionalString(record.comment),
        containsKeywords: keywordBuckets.containsKeywords,
        confidence: parseNumber(record.confidence) ?? 0.85,
        description: optionalString(record.description),
        exactKeywords: keywordBuckets.exactKeywords,
        excludeKeywords: keywordBuckets.excludeKeywords,
        keywords: keywordBuckets.keywords,
        lineId: optionalString(record.lineId),
        matchMode: parseMatchMode(record.matchMode),
        metadata: asRecord(record.metadata) || undefined,
        priority: parseNumber(record.priority),
        ruleId: String(record.ruleId || record.id || `keyword-rule-${index + 1}`),
        sectionId: optionalString(record.sectionId),
        scope: optionalString(record.scope),
        suggestedLine: optionalString(record.suggestedLine) || optionalString(record.lineId),
        suggestedSection: optionalString(record.suggestedSection) || optionalString(record.sectionId),
        suggestedSubsection: optionalString(record.suggestedSubsection) || optionalString(record.subsectionId),
        suggestedUse: optionalString(record.suggestedUse),
        subsectionId: optionalString(record.subsectionId),
        tags: asStringArray(record.tags),
        target: optionalString(record.target)
    };
}
function parseKeywordRules({ config, fallbackRules }) {
    const ruleSource = config.keywordRules || config.rules || config.rows || config.manualRules;
    if (!Array.isArray(ruleSource)) {
        return fallbackRules.map((rule)=>({
                ...rule,
                containsKeywords: rule.containsKeywords ? [
                    ...rule.containsKeywords
                ] : undefined,
                exactKeywords: rule.exactKeywords ? [
                    ...rule.exactKeywords
                ] : undefined,
                excludeKeywords: rule.excludeKeywords ? [
                    ...rule.excludeKeywords
                ] : undefined,
                keywords: [
                    ...rule.keywords
                ]
            }));
    }
    const rules = ruleSource.map(normalizeKeywordRule).filter((rule)=>Boolean(rule));
    return rules.length > 0 ? rules : fallbackRules.map((rule)=>({
            ...rule,
            containsKeywords: rule.containsKeywords ? [
                ...rule.containsKeywords
            ] : undefined,
            exactKeywords: rule.exactKeywords ? [
                ...rule.exactKeywords
            ] : undefined,
            excludeKeywords: rule.excludeKeywords ? [
                ...rule.excludeKeywords
            ] : undefined,
            keywords: [
                ...rule.keywords
            ]
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/keyword-rules/run.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runKeywordRulesSource",
    ()=>runKeywordRulesSource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/events.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/lineage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$keyword$2d$rules$2f$fixtures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/keyword-rules/fixtures.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$keyword$2d$rules$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/keyword-rules/schema.ts [app-client] (ecmascript)");
;
;
;
;
function runKeywordRulesSource(context) {
    const rules = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$keyword$2d$rules$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseKeywordRules"])({
        config: context.config,
        fallbackRules: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$keyword$2d$rules$2f$fixtures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SAMPLE_KEYWORD_RULES"]
    });
    const evidenceRefs = rules.map((rule)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEvidenceRef"])({
            block: context.block,
            label: `${rule.categoryLabel} keyword rule`,
            ruleId: rule.ruleId,
            sourceKind: "keyword_rules",
            valuePreview: rule.keywords.join(", ")
        }));
    const sourceTrace = evidenceRefs.map((evidenceRef)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSourceTraceRef"])({
            evidenceRef
        }));
    const keywordRuleEvidence = Object.fromEntries(rules.map((rule)=>[
            rule.ruleId,
            evidenceRefs.filter((ref)=>ref.ruleId === rule.ruleId)
        ]));
    const keywordRuleTrace = Object.fromEntries(rules.map((rule)=>[
            rule.ruleId,
            sourceTrace.filter((trace)=>trace.ruleId === rule.ruleId)
        ]));
    const rulesWithTrace = rules.map((rule)=>({
            ...rule,
            evidenceRefs: keywordRuleEvidence[rule.ruleId],
            immutable: true,
            readOnlyEvidence: true,
            sourceTrace: keywordRuleTrace[rule.ruleId]
        }));
    const sourceVersion = Number(context.config.sourceVersion || 1);
    const ruleVersion = String(context.config.ruleVersion || `v${sourceVersion}`);
    const ruleMetadata = {
        readOnlyEvidence: true,
        ruleCount: rules.length,
        ruleVersion,
        sourceId: context.block.id,
        sourceKind: "keyword_rules",
        sourceLocator: context.config.sourceLocator,
        sourceName: context.block.label,
        sourceStatus: context.config.sourceStatus || "draft",
        sourceSubtype: context.block.subtype,
        sourceVersion,
        updatedAt: context.block.updatedAt
    };
    return {
        blockId: context.block.id,
        completedAt: new Date().toISOString(),
        errors: [],
        evidenceRefs,
        logs: [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["info"])("Keyword Rulebook emitted governed keyword rules.", {
                ruleCount: rules.length
            })
        ],
        outputs: {
            keyword_rules: {
                immutable: true,
                keywordRuleEvidence,
                keywordRules: rulesWithTrace,
                keywordRuleTrace,
                readOnlyEvidence: true,
                ruleCount: rules.length,
                ruleMetadata,
                ruleVersion,
                sourceKind: "keyword_rules"
            },
            rule_metadata: ruleMetadata,
            rule_version: {
                ruleVersion,
                sourceStatus: ruleMetadata.sourceStatus,
                sourceVersion
            }
        },
        primaryOutputRole: "keyword_rules",
        runId: context.runId,
        sourceTrace,
        startedAt: context.startedAt,
        status: "success",
        toolId: "source.keyword_rules",
        warnings: []
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/keyword-rules/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "keywordRulesToolModule",
    ()=>keywordRulesToolModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$keyword$2d$rules$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/keyword-rules/definition.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$keyword$2d$rules$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/keyword-rules/run.ts [app-client] (ecmascript)");
;
;
const keywordRulesToolModule = {
    definition: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$keyword$2d$rules$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keywordRulesDefinition"],
    run: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$keyword$2d$rules$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runKeywordRulesSource"]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/manual-table/fixtures.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SAMPLE_MANUAL_TABLE_ROWS",
    ()=>SAMPLE_MANUAL_TABLE_ROWS
]);
const SAMPLE_MANUAL_TABLE_ROWS = [
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/manual-table/definition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "manualTableDefinition",
    ()=>manualTableDefinition
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$manual$2d$table$2f$fixtures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/manual-table/fixtures.ts [app-client] (ecmascript)");
;
const manualTableDefinition = {
    defaultConfig: {
        rows: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$manual$2d$table$2f$fixtures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SAMPLE_MANUAL_TABLE_ROWS"],
        sourceKind: "manual_table"
    },
    description: "Reads immutable tabular Source evidence from local config.",
    displayName: "Manual Table Source",
    family: "Source",
    inputRoles: [],
    outputRoles: [
        {
            canRouteToFamilies: [
                "Logic",
                "Output"
            ],
            description: "Uploaded workbook file metadata.",
            id: "workbook_file",
            label: "Workbook file",
            outputKey: "workbookFile",
            outputType: "workbook_file",
            samplePreview: "uploaded workbook metadata"
        },
        {
            canRouteToFamilies: [
                "Logic",
                "Output"
            ],
            description: "Selected worksheet metadata.",
            id: "selected_sheet",
            label: "Selected sheet",
            outputKey: "selectedSheet",
            outputType: "selected_sheet",
            samplePreview: "selected sheet"
        },
        {
            canRouteToFamilies: [
                "Logic",
                "Output"
            ],
            description: "Selected workbook range exposed as Source evidence.",
            id: "selected_range",
            label: "Selected range",
            outputKey: "selectedRange",
            outputType: "selected_range",
            samplePreview: "A1:F16"
        },
        {
            canRouteToFamilies: [
                "Logic"
            ],
            description: "Immutable source rows with evidence references.",
            id: "rows",
            label: "Rows",
            outputKey: "rows",
            outputType: "rows",
            samplePreview: "5 source rows"
        },
        {
            canRouteToFamilies: [
                "Logic"
            ],
            description: "Selected immutable source rows exposed downstream.",
            id: "selected_rows",
            label: "Selected rows",
            outputKey: "rows",
            outputType: "table_rows",
            samplePreview: "selected source rows"
        },
        {
            canRouteToFamilies: [
                "Logic",
                "Output"
            ],
            description: "Original parsed raw rows before local normalization.",
            id: "raw_rows",
            label: "Raw rows",
            outputKey: "rawRows",
            outputType: "raw_rows",
            samplePreview: "raw uploaded rows"
        },
        {
            canRouteToFamilies: [
                "Logic",
                "Output"
            ],
            description: "Local Source file and column metadata.",
            id: "source_metadata",
            label: "Source metadata",
            outputKey: "sourceMetadata",
            outputType: "source_metadata",
            samplePreview: "source metadata"
        },
        {
            canRouteToFamilies: [
                "Logic",
                "Output"
            ],
            description: "Local source locator for the selected evidence slice.",
            id: "source_locator",
            label: "Source locator",
            outputKey: "sourceLocator",
            outputType: "source_locator",
            samplePreview: "sheet/range locator"
        }
    ],
    runMode: "local_mock",
    subtype: "Manual Entry",
    toolGroup: "source",
    toolId: "source.manual_table"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/manual-table/schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "normalizeManualTableRow",
    ()=>normalizeManualTableRow,
    "parseManualTableRows",
    ()=>parseManualTableRows
]);
const NUMBER_PATTERN = /-?\d+(\.\d+)?/;
function asRecord(value) {
    return typeof value === "object" && value !== null ? value : null;
}
function parseNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value !== "string") {
        return null;
    }
    const match = value.trim().match(NUMBER_PATTERN);
    if (!match) {
        return null;
    }
    const parsed = Number(match[0]);
    return Number.isFinite(parsed) ? parsed : null;
}
function optionalString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function optionalNumber(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
function normalizeManualTableRow(value, index) {
    const record = asRecord(value);
    if (!record) {
        return null;
    }
    const amount = parseNumber(record.amount) ?? parseNumber(record.value) ?? parseNumber(record.balance);
    if (amount === null) {
        return null;
    }
    return {
        account: optionalString(record.account) || optionalString(record.accountNumber),
        amount,
        currency: optionalString(record.currency),
        description: optionalString(record.description),
        label: String(record.label || record.name || `Source row ${index + 1}`),
        metadata: asRecord(record.metadata) || undefined,
        raw: asRecord(record.raw) || asRecord(asRecord(record.metadata)?.raw) || undefined,
        rowId: String(record.rowId || record.id || `source-row-${index + 1}`),
        rowNumber: optionalNumber(record.rowNumber)
    };
}
function parseManualTableRows({ config, fallbackRows }) {
    const rowSource = config.rows || config.manualRows || config.tableRows || config.sampleRows;
    if (!Array.isArray(rowSource)) {
        if (config.requireUpload === true) {
            return [];
        }
        return fallbackRows.map((row)=>({
                ...row
            }));
    }
    const rows = rowSource.map(normalizeManualTableRow).filter((row)=>Boolean(row));
    if (rows.length > 0) {
        return rows;
    }
    return config.requireUpload === true ? [] : fallbackRows.map((row)=>({
            ...row
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/manual-table/run.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runManualTableSource",
    ()=>runManualTableSource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/events.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/lineage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$manual$2d$table$2f$fixtures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/manual-table/fixtures.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$manual$2d$table$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/manual-table/schema.ts [app-client] (ecmascript)");
;
;
;
;
function runManualTableSource(context) {
    const rows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$manual$2d$table$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseManualTableRows"])({
        config: context.config,
        fallbackRows: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$manual$2d$table$2f$fixtures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SAMPLE_MANUAL_TABLE_ROWS"]
    });
    const sourceKind = String(context.config.sourceKind || "manual_table");
    const evidenceRefs = rows.map((row)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEvidenceRef"])({
            block: context.block,
            label: row.label,
            rowId: row.rowId,
            sourceKind,
            valuePreview: String(row.amount)
        }));
    const sourceTrace = evidenceRefs.map((evidenceRef)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSourceTraceRef"])({
            evidenceRef
        }));
    const rowsWithTrace = rows.map((row)=>({
            ...row,
            evidenceRefs: evidenceRefs.filter((evidenceRef)=>evidenceRef.rowId === row.rowId),
            immutable: true,
            readOnlyEvidence: true,
            sourceTrace: sourceTrace.filter((trace)=>trace.rowId === row.rowId)
        }));
    const sourceLocator = typeof context.config.sourceLocator === "string" ? context.config.sourceLocator : `source://${context.block.id}`;
    const sourceMetadata = {
        columns: context.config.columns,
        fileName: context.config.fileName || context.config.workbookName,
        rowCount: rows.length,
        selectedRange: context.config.selectedRange,
        selectedSheet: context.config.selectedSheet,
        sourceId: context.block.id,
        sourceKind,
        sourceLocator,
        sourceName: context.block.label,
        sourceStatus: context.config.sourceStatus || "draft",
        sourceSubtype: context.block.subtype,
        sourceVersion: context.config.sourceVersion || 1,
        uploadTimestamp: context.config.uploadTimestamp,
        updatedAt: context.block.updatedAt,
        workbookId: context.config.workbookId
    };
    const workbookFile = typeof context.config.workbookFile === "object" && context.config.workbookFile !== null ? context.config.workbookFile : {
        fileName: context.config.fileName || context.config.workbookName,
        fileSize: context.config.fileSize,
        uploadedAt: context.config.uploadTimestamp,
        workbookId: context.config.workbookId
    };
    const selectedSheet = {
        sheetCount: Array.isArray(context.config.sheets) ? context.config.sheets.length : undefined,
        sheetName: context.config.selectedSheet,
        workbookId: context.config.workbookId
    };
    const selectedRange = {
        range: context.config.selectedRange,
        rowCount: rows.length,
        selectedSheet: context.config.selectedSheet
    };
    return {
        blockId: context.block.id,
        completedAt: new Date().toISOString(),
        errors: [],
        evidenceRefs,
        logs: [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["info"])("Manual table Source emitted immutable rows.", {
                rowCount: rows.length
            })
        ],
        outputs: {
            raw_rows: {
                rawRows: rows.map((row)=>row.raw || row.metadata?.raw || row),
                rowCount: rows.length
            },
            rows: {
                immutable: true,
                readOnlyEvidence: true,
                rowCount: rows.length,
                rows: rowsWithTrace,
                sourceKind
            },
            selected_range: selectedRange,
            selected_rows: {
                immutable: true,
                readOnlyEvidence: true,
                rowCount: rows.length,
                rows: rowsWithTrace,
                selectedRange: context.config.selectedRange,
                selectedSheet: context.config.selectedSheet,
                sourceKind
            },
            selected_sheet: selectedSheet,
            workbook_file: {
                workbookFile
            },
            source_locator: {
                locator: sourceLocator,
                sourceLocator
            },
            source_metadata: sourceMetadata
        },
        primaryOutputRole: "rows",
        runId: context.runId,
        sourceTrace,
        startedAt: context.startedAt,
        status: "success",
        toolId: "source.manual_table",
        warnings: []
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/manual-table/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "manualTableToolModule",
    ()=>manualTableToolModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$manual$2d$table$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/manual-table/definition.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$manual$2d$table$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/manual-table/run.ts [app-client] (ecmascript)");
;
;
const manualTableToolModule = {
    definition: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$manual$2d$table$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["manualTableDefinition"],
    run: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$manual$2d$table$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runManualTableSource"]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/rollup-rules/definition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "rollupRulesDefinition",
    ()=>rollupRulesDefinition
]);
const rollupRulesDefinition = {
    defaultConfig: {
        sourceKind: "rollup_rules"
    },
    description: "Emits governed rollup rules that group mapped categories into subtotal buckets.",
    displayName: "Rollup Rules Source",
    family: "Source",
    inputRoles: [],
    outputRoles: [
        {
            canRouteToFamilies: [
                "Logic",
                "Review / Validation",
                "Output"
            ],
            description: "Rollup rules for summing mapped categories.",
            id: "rollup_rules",
            label: "Rollup rules",
            outputKey: "rollupRules",
            outputType: "rollup_rules",
            samplePreview: "income_bucket, expense_bucket"
        },
        {
            canRouteToFamilies: [
                "Review / Validation",
                "Output"
            ],
            description: "Rollup rule metadata and versioning information.",
            id: "rule_metadata",
            label: "Rule metadata",
            outputKey: "ruleMetadata",
            outputType: "rule_metadata"
        },
        {
            canRouteToFamilies: [
                "Review / Validation",
                "Output"
            ],
            description: "Rollup rule source version.",
            id: "rule_version",
            label: "Rule version",
            outputKey: "ruleVersion",
            outputType: "rule_version"
        }
    ],
    runMode: "local_mock",
    subtype: "Rollup Rules",
    toolGroup: "source",
    toolId: "source.rollup_rules"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/rollup-rules/fixtures.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SAMPLE_ROLLUP_RULES",
    ()=>SAMPLE_ROLLUP_RULES
]);
const SAMPLE_ROLLUP_RULES = [
    {
        description: "Adds income categories.",
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
        description: "Adds expense categories using absolute category totals.",
        includeCategoryIds: [
            "generalExpenses",
            "legalExpenses",
            "accountingExpenses"
        ],
        label: "Expense Bucket",
        operation: "sum_abs",
        rollupId: "expense_bucket"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/rollup-rules/run.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runRollupRulesSource",
    ()=>runRollupRulesSource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/events.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/runtime/lineage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$rollup$2d$rules$2f$fixtures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/rollup-rules/fixtures.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$rollup$2d$rules$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/rollup-rules/schema.ts [app-client] (ecmascript)");
;
;
;
;
function runRollupRulesSource(context) {
    const rules = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$rollup$2d$rules$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseRollupRules"])({
        config: context.config,
        fallbackRules: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$rollup$2d$rules$2f$fixtures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SAMPLE_ROLLUP_RULES"]
    });
    const evidenceRefs = rules.map((rule)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEvidenceRef"])({
            block: context.block,
            label: `${rule.label} rollup rule`,
            ruleId: rule.rollupId,
            sourceKind: "rollup_rules",
            valuePreview: `${rule.operation}: ${rule.includeCategoryIds.join(", ")}`
        }));
    const sourceTrace = evidenceRefs.map((evidenceRef)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$lineage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSourceTraceRef"])({
            evidenceRef
        }));
    const rollupRuleEvidence = Object.fromEntries(rules.map((rule)=>[
            rule.rollupId,
            evidenceRefs.filter((ref)=>ref.ruleId === rule.rollupId)
        ]));
    const rollupRuleTrace = Object.fromEntries(rules.map((rule)=>[
            rule.rollupId,
            sourceTrace.filter((trace)=>trace.ruleId === rule.rollupId)
        ]));
    const rollupRules = rules.map((rule)=>({
            ...rule,
            evidenceRefs: rollupRuleEvidence[rule.rollupId],
            immutable: true,
            readOnlyEvidence: true,
            sourceTrace: rollupRuleTrace[rule.rollupId]
        }));
    const sourceVersion = Number(context.config.sourceVersion || 1);
    const ruleVersion = String(context.config.ruleVersion || `v${sourceVersion}`);
    const ruleMetadata = {
        readOnlyEvidence: true,
        ruleCount: rules.length,
        ruleVersion,
        sourceId: context.block.id,
        sourceKind: "rollup_rules",
        sourceLocator: context.config.sourceLocator,
        sourceName: context.block.label,
        sourceStatus: context.config.sourceStatus || "draft",
        sourceSubtype: context.block.subtype,
        sourceVersion,
        updatedAt: context.block.updatedAt
    };
    return {
        blockId: context.block.id,
        completedAt: new Date().toISOString(),
        errors: [],
        evidenceRefs,
        logs: [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$runtime$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["info"])("Rollup Rules Source emitted governed rollup rules.", {
                ruleCount: rules.length
            })
        ],
        outputs: {
            rollup_rules: {
                immutable: true,
                readOnlyEvidence: true,
                rollupRuleEvidence,
                rollupRules,
                rollupRuleTrace,
                ruleCount: rules.length,
                ruleMetadata,
                ruleVersion,
                sourceKind: "rollup_rules"
            },
            rule_metadata: ruleMetadata,
            rule_version: {
                ruleVersion,
                sourceStatus: ruleMetadata.sourceStatus,
                sourceVersion
            }
        },
        primaryOutputRole: "rollup_rules",
        runId: context.runId,
        sourceTrace,
        startedAt: context.startedAt,
        status: "success",
        toolId: "source.rollup_rules",
        warnings: []
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/blocks/source/rollup-rules/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "rollupRulesToolModule",
    ()=>rollupRulesToolModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$rollup$2d$rules$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/rollup-rules/definition.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$rollup$2d$rules$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/rollup-rules/run.ts [app-client] (ecmascript)");
;
;
const rollupRulesToolModule = {
    definition: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$rollup$2d$rules$2f$definition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rollupRulesDefinition"],
    run: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$rollup$2d$rules$2f$run$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runRollupRulesSource"]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/execution/runtime/registry.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "executeTool",
    ()=>executeTool,
    "getToolDefinition",
    ()=>getToolDefinition,
    "listToolDefinitions",
    ()=>listToolDefinitions,
    "registerToolModule",
    ()=>registerToolModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$calculation$2d$engine$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/logic/calculation-engine/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$category$2d$rollup$2d$aggregator$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/logic/category-rollup-aggregator/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$hierarchy$2d$aggregator$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/logic/hierarchy-aggregator/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$keyword$2d$mapper$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/logic/keyword-mapper/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$aggregation$2d$rules$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/aggregation-rules/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$calculation$2d$rules$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/calculation-rules/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$currency$2d$rate$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/currency-rate/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$fapi$2d$inputs$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/fapi-inputs/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$keyword$2d$rules$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/keyword-rules/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$manual$2d$table$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/manual-table/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$rollup$2d$rules$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/execution/blocks/source/rollup-rules/index.ts [app-client] (ecmascript)");
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
const toolModules = new Map();
function registerToolModule(module) {
    toolModules.set(module.definition.toolId, module);
}
for (const module of [
    __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$manual$2d$table$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["manualTableToolModule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$keyword$2d$rules$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keywordRulesToolModule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$aggregation$2d$rules$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aggregationRulesToolModule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$rollup$2d$rules$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rollupRulesToolModule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$calculation$2d$rules$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculationRulesToolModule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$fapi$2d$inputs$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fapiInputsToolModule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$source$2f$currency$2d$rate$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["currencyRateToolModule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$keyword$2d$mapper$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keywordMapperToolModule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$category$2d$rollup$2d$aggregator$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categoryRollupAggregatorToolModule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$calculation$2d$engine$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculationEngineToolModule"],
    __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$execution$2f$blocks$2f$logic$2f$hierarchy$2d$aggregator$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hierarchyAggregatorToolModule"]
]){
    registerToolModule(module);
}
function getToolDefinition(toolId) {
    return toolModules.get(toolId)?.definition;
}
function listToolDefinitions() {
    return [
        ...toolModules.values()
    ].map((module)=>module.definition);
}
function executeTool(toolId, context) {
    const module = toolModules.get(toolId);
    if (!module) {
        throw new Error(`No backend tool module registered for ${toolId}.`);
    }
    return module.run(context);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=shared_workflow-engine_execution_e2be86c9._.js.map