(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CalculationEngineModeSection",
    ()=>CalculationEngineModeSection,
    "CalculationEngineRunSections",
    ()=>CalculationEngineRunSections
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/ui/select.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
// ─── Helpers ──────────────────────────────────────────────────────────────────
function asRecord(value) {
    return typeof value === "object" && value !== null ? value : {};
}
function asNumber(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}
const KNOWN_FUNCTIONS = new Set([
    "abs",
    "max",
    "min",
    "round",
    "max_subtract_zero",
    "min_multiply_cap"
]);
const DIGIT_CHARACTER_REGEX = /\d/;
const IDENTIFIER_CHARACTER_REGEX = /[A-Za-z0-9_:.@-]/;
const IDENTIFIER_START_REGEX = /[A-Za-z_]/;
const NUMBER_CHARACTER_REGEX = /[\d.]/;
const WHITESPACE_CHARACTER_REGEX = /\s/;
const OPERATOR_TOKENS = new Set([
    "+",
    "-",
    "*",
    "/"
]);
function getSingleCharacterToken(character) {
    if (character === "(" || character === ")") {
        return {
            type: "paren",
            value: character
        };
    }
    if (character === ",") {
        return {
            type: "op",
            value: ","
        };
    }
    if (OPERATOR_TOKENS.has(character)) {
        return {
            type: "op",
            value: character
        };
    }
    return null;
}
function readNumberToken(expression, startIndex) {
    let endIndex = startIndex + 1;
    while(endIndex < expression.length && NUMBER_CHARACTER_REGEX.test(expression[endIndex])){
        endIndex += 1;
    }
    return {
        nextIndex: endIndex,
        token: {
            type: "num",
            value: expression.slice(startIndex, endIndex)
        }
    };
}
function readIdentifierToken(expression, startIndex) {
    let endIndex = startIndex + 1;
    while(endIndex < expression.length && IDENTIFIER_CHARACTER_REGEX.test(expression[endIndex])){
        endIndex += 1;
    }
    const word = expression.slice(startIndex, endIndex);
    return {
        nextIndex: endIndex,
        token: {
            type: KNOWN_FUNCTIONS.has(word) ? "func" : "ref",
            value: word
        }
    };
}
function getTokenAt(expression, index) {
    const character = expression[index];
    if (WHITESPACE_CHARACTER_REGEX.test(character)) {
        return {
            nextIndex: index + 1,
            token: null
        };
    }
    const singleCharacterToken = getSingleCharacterToken(character);
    if (singleCharacterToken) {
        return {
            nextIndex: index + 1,
            token: singleCharacterToken
        };
    }
    if (DIGIT_CHARACTER_REGEX.test(character) || character === "." && DIGIT_CHARACTER_REGEX.test(expression[index + 1] ?? "")) {
        return readNumberToken(expression, index);
    }
    if (IDENTIFIER_START_REGEX.test(character)) {
        return readIdentifierToken(expression, index);
    }
    return {
        nextIndex: index + 1,
        token: null
    };
}
function tokenizeExpression(expression) {
    const tokens = [];
    let i = 0;
    while(i < expression.length){
        const { nextIndex, token } = getTokenAt(expression, i);
        if (token) {
            tokens.push(token);
        }
        i = nextIndex;
    }
    return tokens;
}
function tokensToExpression(tokens) {
    return tokens.map((t)=>t.value).join(" ");
}
function getTokenItems(tokens) {
    const counts = new Map();
    return tokens.map((token)=>{
        const baseKey = `${token.type}:${token.value}`;
        const count = (counts.get(baseKey) ?? 0) + 1;
        counts.set(baseKey, count);
        return {
            key: `${baseKey}:${count}`,
            token
        };
    });
}
function formulaToExpression(formula) {
    if (formula.formulaExpression?.trim()) {
        return formula.formulaExpression.trim();
    }
    const ops = formula.operands.map(String);
    switch(formula.operation){
        case "pass_through":
            return ops[0] ?? "";
        case "add":
            return ops.join(" + ");
        case "subtract":
            return ops.length > 1 ? `${ops[0]} - ${ops.slice(1).join(" - ")}` : ops[0] ?? "";
        case "multiply":
            return ops.join(" * ");
        case "divide":
            return ops.length > 1 ? `${ops[0]} / ${ops.slice(1).join(" / ")}` : ops[0] ?? "";
        default:
            return ops.length > 0 ? `${formula.operation}(${ops.join(", ")})` : "";
    }
}
function getFormulasFromConfig(config) {
    const raw = config.formulas ?? config.calculationRules ?? config.inlineFormulas;
    if (!Array.isArray(raw)) {
        return [];
    }
    return raw.filter((item)=>typeof item === "object" && item !== null && typeof item.calculationId === "string");
}
function hasConnectedCalculationRuleSource(block, edges) {
    return edges.some((edge)=>edge.target === block.id && (edge.data?.targetInputRole === "calculation_rules" || edge.data?.workflowEdge?.targetInputRole === "calculation_rules"));
}
function getCalculationRunModeLabel(mode) {
    if (mode === "auto:external") {
        return "Auto - using connected Calculation Rules Source";
    }
    if (mode === "auto:inline" || mode === "inline") {
        return "Auto - using inline formulas";
    }
    if (mode === "external_rules") {
        return "External Calculation Rules Source";
    }
    return mode;
}
const UPSTREAM_VALUE_GROUP_KEYS = [
    "namedValues",
    "named_values",
    "categoryTotals",
    "rollupTotals",
    "fapiInputs",
    "calculatedResults"
];
const FALLBACK_VALUE_KEYS = [
    "fatPaid",
    "rtf",
    "inclusionRate",
    "fxRate"
];
function isCalculationInputRole(role) {
    return role === "named_values" || role === "fapi_inputs" || role === "protected_inputs";
}
function addUpstreamValue({ key, result, seen, value }) {
    if (seen.has(key)) {
        return;
    }
    seen.add(key);
    result.push({
        key,
        value: asNumber(value)
    });
}
function addOutputGroups({ result, seen, sourceOutput }) {
    for (const key of UPSTREAM_VALUE_GROUP_KEYS){
        const group = asRecord(sourceOutput[key]);
        for (const [valueKey, value] of Object.entries(group)){
            addUpstreamValue({
                key: valueKey,
                result,
                seen,
                value
            });
        }
    }
}
function addFallbackValues({ result, seen }) {
    for (const key of FALLBACK_VALUE_KEYS){
        addUpstreamValue({
            key,
            result,
            seen,
            value: null
        });
    }
}
function collectUpstreamValues(block, edges, nodes, lastOutput) {
    const seen = new Set();
    const result = [];
    const incomingEdges = edges.filter((e)=>e.target === block.id);
    for (const edge of incomingEdges){
        const sourceNode = nodes.find((n)=>n.id === edge.source);
        if (!sourceNode) {
            continue;
        }
        const sourceBlock = sourceNode.data.block;
        const role = edge.data?.targetInputRole ?? edge.data?.workflowEdge?.targetInputRole;
        if (!isCalculationInputRole(role)) {
            continue;
        }
        const sourceOutput = asRecord(lastOutput[edge.source] ?? lastOutput[sourceBlock?.id ?? ""] ?? {});
        addOutputGroups({
            result,
            seen,
            sourceOutput
        });
    }
    addFallbackValues({
        result,
        seen
    });
    return result;
}
// ─── Token chip display ───────────────────────────────────────────────────────
function TokenChip({ termKeys, token, upstreamKeys }) {
    const operatorLabels = {
        "*": "×",
        "-": "−",
        "/": "÷"
    };
    const displayValue = operatorLabels[token.value] ?? token.value;
    if (token.type === "op") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex select-none items-center rounded px-1.5 py-0.5 font-bold font-mono text-foreground/60 text-xs",
            children: displayValue
        }, void 0, false, {
            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
            lineNumber: 346,
            columnNumber: 7
        }, this);
    }
    if (token.type === "paren") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex select-none items-center rounded px-1 py-0.5 font-mono text-muted-foreground text-xs",
            children: token.value
        }, void 0, false, {
            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
            lineNumber: 353,
            columnNumber: 7
        }, this);
    }
    if (token.type === "num") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex items-center rounded border border-amber-400/50 bg-amber-400/15 px-1.5 py-0.5 font-mono text-[11px] text-amber-700 dark:text-amber-400",
            children: token.value
        }, void 0, false, {
            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
            lineNumber: 360,
            columnNumber: 7
        }, this);
    }
    if (token.type === "func") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex items-center rounded border border-violet-400/50 bg-violet-400/15 px-1.5 py-0.5 font-mono text-[11px] text-violet-700 dark:text-violet-400",
            children: token.value
        }, void 0, false, {
            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
            lineNumber: 367,
            columnNumber: 7
        }, this);
    }
    // ref — colour by source
    if (termKeys.has(token.value)) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex items-center rounded border border-emerald-400/50 bg-emerald-400/15 px-1.5 py-0.5 font-mono text-[11px] text-emerald-700 dark:text-emerald-400",
            children: token.value
        }, void 0, false, {
            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
            lineNumber: 375,
            columnNumber: 7
        }, this);
    }
    if (upstreamKeys.has(token.value)) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex items-center rounded border border-sky-400/50 bg-sky-400/15 px-1.5 py-0.5 font-mono text-[11px] text-sky-700 dark:text-sky-400",
            children: token.value
        }, void 0, false, {
            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
            lineNumber: 382,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center rounded border border-muted-foreground/30 bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] text-foreground",
        children: token.value
    }, void 0, false, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
        lineNumber: 388,
        columnNumber: 5
    }, this);
}
_c = TokenChip;
// ─── Special functions catalog ────────────────────────────────────────────────
const SPECIAL_FUNCTIONS = [
    {
        display: "max(A−B, 0)",
        name: "max_subtract_zero"
    },
    {
        display: "min(A×B, C)",
        name: "min_multiply_cap"
    },
    {
        display: "abs(…)",
        name: "abs"
    },
    {
        display: "max(…)",
        name: "max"
    },
    {
        display: "min(…)",
        name: "min"
    },
    {
        display: "round(…)",
        name: "round"
    }
];
const OPERATOR_KEYS = [
    {
        label: "+",
        value: "+"
    },
    {
        label: "−",
        value: "-"
    },
    {
        label: "×",
        value: "*"
    },
    {
        label: "÷",
        value: "/"
    },
    {
        label: "(",
        value: "("
    },
    {
        label: ")",
        value: ")"
    },
    {
        label: ",",
        value: ","
    }
];
function CalculationEngineModeSection({ block, createTermRequest, disabled, edges, insertRequest, lastRunOutput, nodes, onSelectedTermIdChange, onUpdateConfig, selectedTermId }) {
    _s();
    const config = block.config;
    const mode = config.mode ?? "auto";
    const formulas = getFormulasFromConfig(config);
    const [selectedIndex, setSelectedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [tokens, setTokens] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [constantInput, setConstantInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const handledCreateRequestRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    const handledInsertRequestRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    const upstreamValues = collectUpstreamValues(block, edges, nodes, lastRunOutput);
    const upstreamKeys = new Set(upstreamValues.map((v)=>v.key));
    const allTermKeys = new Set(formulas.map((f)=>f.resultKey));
    const tokenItems = getTokenItems(tokens);
    const selectedFormula = selectedIndex !== null ? formulas[selectedIndex] ?? null : null;
    const hasExternalRules = hasConnectedCalculationRuleSource(block, edges);
    // ── Persistence helpers ──────────────────────────────────────────────────────
    const saveFormulas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalculationEngineModeSection.useCallback[saveFormulas]": (next)=>{
            onUpdateConfig("formulas", next);
        }
    }["CalculationEngineModeSection.useCallback[saveFormulas]"], [
        onUpdateConfig
    ]);
    const saveTokens = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalculationEngineModeSection.useCallback[saveTokens]": (nextTokens)=>{
            if (selectedIndex === null) {
                return;
            }
            setTokens(nextTokens);
            const expression = tokensToExpression(nextTokens);
            const next = [
                ...formulas
            ];
            next[selectedIndex] = {
                ...next[selectedIndex],
                formulaExpression: expression,
                operands: [],
                operation: "pass_through"
            };
            saveFormulas(next);
        }
    }["CalculationEngineModeSection.useCallback[saveTokens]"], [
        formulas,
        saveFormulas,
        selectedIndex
    ]);
    // ── Term selection ───────────────────────────────────────────────────────────
    const selectTerm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalculationEngineModeSection.useCallback[selectTerm]": (index)=>{
            setSelectedIndex(index);
            const formula = formulas[index];
            setTokens(tokenizeExpression(formulaToExpression(formula)));
            setConstantInput("");
            onSelectedTermIdChange?.(formula.resultKey);
        }
    }["CalculationEngineModeSection.useCallback[selectTerm]"], [
        formulas,
        onSelectedTermIdChange
    ]);
    // ── Token insertion ──────────────────────────────────────────────────────────
    const appendToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalculationEngineModeSection.useCallback[appendToken]": (token)=>{
            if (disabled) {
                return;
            }
            saveTokens([
                ...tokens,
                token
            ]);
        }
    }["CalculationEngineModeSection.useCallback[appendToken]"], [
        disabled,
        saveTokens,
        tokens
    ]);
    const appendRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalculationEngineModeSection.useCallback[appendRef]": (key)=>appendToken({
                type: "ref",
                value: key
            })
    }["CalculationEngineModeSection.useCallback[appendRef]"], [
        appendToken
    ]);
    const appendFunc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalculationEngineModeSection.useCallback[appendFunc]": (name)=>{
            if (disabled) {
                return;
            }
            saveTokens([
                ...tokens,
                {
                    type: "func",
                    value: name
                },
                {
                    type: "paren",
                    value: "("
                }
            ]);
        }
    }["CalculationEngineModeSection.useCallback[appendFunc]"], [
        disabled,
        saveTokens,
        tokens
    ]);
    const appendOp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalculationEngineModeSection.useCallback[appendOp]": (op)=>{
            const isParenLike = op === "(" || op === ")";
            appendToken({
                type: isParenLike ? "paren" : "op",
                value: op
            });
        }
    }["CalculationEngineModeSection.useCallback[appendOp]"], [
        appendToken
    ]);
    const insertConstant = ()=>{
        if (!constantInput.trim()) {
            return;
        }
        const num = Number.parseFloat(constantInput);
        if (!Number.isFinite(num)) {
            return;
        }
        appendToken({
            type: "num",
            value: constantInput.trim()
        });
        setConstantInput("");
    };
    const backspace = ()=>{
        if (disabled || tokens.length === 0) {
            return;
        }
        saveTokens(tokens.slice(0, -1));
    };
    const clearFormula = ()=>{
        if (disabled) {
            return;
        }
        saveTokens([]);
    };
    // ── Term metadata ────────────────────────────────────────────────────────────
    const updateFormulaField = (field, value)=>{
        if (disabled || selectedIndex === null) {
            return;
        }
        const next = [
            ...formulas
        ];
        const updated = {
            ...next[selectedIndex],
            [field]: value
        };
        if (field === "resultKey") {
            updated.calculationId = value;
            onSelectedTermIdChange?.(value);
        }
        next[selectedIndex] = updated;
        saveFormulas(next);
    };
    // ── Term CRUD ────────────────────────────────────────────────────────────────
    const addTerm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalculationEngineModeSection.useCallback[addTerm]": ()=>{
            if (disabled) {
                return;
            }
            const id = `TERM_${formulas.length + 1}`;
            const newFormula = {
                calculationId: id,
                formulaExpression: "",
                label: id,
                operands: [],
                operation: "pass_through",
                resultKey: id
            };
            const next = [
                ...formulas,
                newFormula
            ];
            saveFormulas(next);
            const newIndex = next.length - 1;
            setSelectedIndex(newIndex);
            setTokens([]);
            setConstantInput("");
            onSelectedTermIdChange?.(id);
        }
    }["CalculationEngineModeSection.useCallback[addTerm]"], [
        disabled,
        formulas,
        onSelectedTermIdChange,
        saveFormulas
    ]);
    const deleteTerm = (index)=>{
        if (disabled) {
            return;
        }
        const next = formulas.filter((_, i)=>i !== index);
        saveFormulas(next);
        if (selectedIndex === index) {
            setSelectedIndex(null);
            setTokens([]);
            onSelectedTermIdChange?.(null);
        } else if (selectedIndex !== null && selectedIndex > index) {
            setSelectedIndex(selectedIndex - 1);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalculationEngineModeSection.useEffect": ()=>{
            if (!selectedTermId) {
                return;
            }
            const index = formulas.findIndex({
                "CalculationEngineModeSection.useEffect.index": (formula)=>formula.resultKey === selectedTermId || formula.calculationId === selectedTermId
            }["CalculationEngineModeSection.useEffect.index"]);
            if (index >= 0 && index !== selectedIndex) {
                selectTerm(index);
            }
        }
    }["CalculationEngineModeSection.useEffect"], [
        formulas,
        selectedIndex,
        selectedTermId,
        selectTerm
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalculationEngineModeSection.useEffect": ()=>{
            if (createTermRequest === undefined || createTermRequest <= 0 || createTermRequest === handledCreateRequestRef.current) {
                return;
            }
            handledCreateRequestRef.current = createTermRequest;
            addTerm();
        }
    }["CalculationEngineModeSection.useEffect"], [
        addTerm,
        createTermRequest
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalculationEngineModeSection.useEffect": ()=>{
            if (!insertRequest || insertRequest.id === handledInsertRequestRef.current) {
                return;
            }
            handledInsertRequestRef.current = insertRequest.id;
            appendRef(insertRequest.key);
        }
    }["CalculationEngineModeSection.useEffect"], [
        appendRef,
        insertRequest
    ]);
    // ─── Render ────────────────────────────────────────────────────────────────
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "shrink-0 font-semibold text-[9px] text-muted-foreground uppercase tracking-widest",
                        children: "Mode"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                        lineNumber: 672,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                        disabled: disabled,
                        onValueChange: (v)=>onUpdateConfig("mode", v),
                        value: mode,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                className: "h-6 flex-1 text-[10px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                    lineNumber: 681,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                lineNumber: 680,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        className: "text-xs",
                                        value: "auto",
                                        children: [
                                            "Auto —",
                                            " ",
                                            hasExternalRules ? "using connected source" : "using inline formulas"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                        lineNumber: 684,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        className: "text-xs",
                                        value: "inline",
                                        children: "Inline formulas"
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                        lineNumber: 690,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        className: "text-xs",
                                        value: "external_rules",
                                        children: "External rules (require source)"
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                        lineNumber: 693,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                lineNumber: 683,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                        lineNumber: 675,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                lineNumber: 671,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-hidden rounded-lg border",
                style: {
                    minHeight: 500
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex min-w-0 flex-1 flex-col overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex shrink-0 items-center gap-2 border-b bg-muted/20 px-3 py-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "shrink-0 font-semibold text-[9px] text-muted-foreground uppercase tracking-widest",
                                    children: "Editing"
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                    lineNumber: 707,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                    disabled: disabled || formulas.length === 0,
                                    onValueChange: (value)=>{
                                        const index = formulas.findIndex((formula)=>formula.resultKey === value);
                                        if (index >= 0) {
                                            selectTerm(index);
                                        }
                                    },
                                    value: selectedFormula?.resultKey || "",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                            className: "h-7 min-w-0 flex-1 text-xs",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                placeholder: "Select a created term"
                                            }, void 0, false, {
                                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                lineNumber: 723,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                            lineNumber: 722,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                            children: formulas.map((formula)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: formula.resultKey,
                                                    children: formula.resultKey
                                                }, formula.calculationId, false, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                    lineNumber: 727,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                            lineNumber: 725,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                    lineNumber: 710,
                                    columnNumber: 13
                                }, this),
                                !disabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "flex h-7 items-center gap-1 rounded border px-2 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                                    onClick: addTerm,
                                    type: "button",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "size-3"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                            lineNumber: 742,
                                            columnNumber: 17
                                        }, this),
                                        "New"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                    lineNumber: 737,
                                    columnNumber: 15
                                }, this),
                                !disabled && selectedIndex !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "flex h-7 items-center gap-1 rounded border px-2 text-[10px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
                                    onClick: ()=>deleteTerm(selectedIndex),
                                    type: "button",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            className: "size-3"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                            lineNumber: 752,
                                            columnNumber: 17
                                        }, this),
                                        "Delete"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                    lineNumber: 747,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                            lineNumber: 706,
                            columnNumber: 11
                        }, this),
                        selectedFormula ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex shrink-0 items-center gap-2 border-b bg-muted/10 px-3 py-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            className: "h-6 w-20 font-mono text-xs",
                                            disabled: disabled,
                                            onChange: (e)=>updateFormulaField("resultKey", e.target.value),
                                            placeholder: "KEY",
                                            value: selectedFormula.resultKey
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                            lineNumber: 761,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "select-none font-light text-muted-foreground text-sm",
                                            children: "="
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                            lineNumber: 770,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            className: "h-6 flex-1 text-xs",
                                            disabled: disabled,
                                            onChange: (e)=>updateFormulaField("label", e.target.value),
                                            placeholder: "Label",
                                            value: selectedFormula.label
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                            lineNumber: 773,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                    lineNumber: 760,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "shrink-0 border-b px-3 pt-3 pb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex min-h-11 flex-wrap items-center gap-1 rounded-md border bg-background px-2 py-1.5",
                                            children: tokens.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "select-none text-[11px] text-muted-foreground italic",
                                                children: "Formula is empty"
                                            }, void 0, false, {
                                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                lineNumber: 786,
                                                columnNumber: 21
                                            }, this) : tokenItems.map(({ key, token })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TokenChip, {
                                                    termKeys: allTermKeys,
                                                    token: token,
                                                    upstreamKeys: upstreamKeys
                                                }, key, false, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                    lineNumber: 791,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                            lineNumber: 784,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 flex flex-wrap items-center gap-1",
                                            children: [
                                                OPERATOR_KEYS.map(({ label, value })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "flex h-7 min-w-7 select-none items-center justify-center rounded border bg-background px-1.5 font-mono font-semibold text-sm transition-colors hover:bg-muted disabled:opacity-40",
                                                        disabled: disabled,
                                                        onClick: ()=>appendOp(value),
                                                        type: "button",
                                                        children: label
                                                    }, value, false, {
                                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                        lineNumber: 804,
                                                        columnNumber: 21
                                                    }, this)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "ml-auto flex gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "flex h-7 items-center gap-1 rounded border bg-background px-2 text-[10px] text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40",
                                                            disabled: disabled || tokens.length === 0,
                                                            onClick: backspace,
                                                            type: "button",
                                                            children: "⌫"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                            lineNumber: 815,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "flex h-7 items-center gap-1 rounded border bg-background px-2 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-destructive disabled:opacity-40",
                                                            disabled: disabled || tokens.length === 0,
                                                            onClick: clearFormula,
                                                            type: "button",
                                                            children: "Clear"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                            lineNumber: 823,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                    lineNumber: 814,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                            lineNumber: 802,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                    lineNumber: 783,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 space-y-4 overflow-y-auto px-3 py-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "font-bold text-[9px] text-violet-600/80 uppercase tracking-widest",
                                                    children: "Functions"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                    lineNumber: 839,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap gap-1",
                                                    children: SPECIAL_FUNCTIONS.map(({ display, name })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "select-none rounded border border-violet-400/40 bg-violet-400/10 px-2 py-0.5 font-mono text-[10px] text-violet-700 transition-colors hover:bg-violet-400/25 disabled:opacity-40 dark:text-violet-400",
                                                            disabled: disabled,
                                                            onClick: ()=>appendFunc(name),
                                                            title: name,
                                                            type: "button",
                                                            children: display
                                                        }, name, false, {
                                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                            lineNumber: 844,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                    lineNumber: 842,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                            lineNumber: 838,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "font-bold text-[9px] text-amber-600/80 uppercase tracking-widest",
                                                    children: "Constant"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                    lineNumber: 860,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            className: "h-7 w-28 font-mono text-xs",
                                                            disabled: disabled,
                                                            onChange: (e)=>setConstantInput(e.target.value),
                                                            onKeyDown: (e)=>e.key === "Enter" && insertConstant(),
                                                            placeholder: "e.g. 34400",
                                                            type: "number",
                                                            value: constantInput
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                            lineNumber: 864,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "h-7 rounded border border-amber-400/40 bg-amber-400/10 px-2 font-semibold text-[10px] text-amber-700 transition-colors hover:bg-amber-400/25 disabled:opacity-40 dark:text-amber-400",
                                                            disabled: disabled || !constantInput.trim(),
                                                            onClick: insertConstant,
                                                            type: "button",
                                                            children: "Insert"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                            lineNumber: 873,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                    lineNumber: 863,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                            lineNumber: 859,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-x-3 gap-y-1 border-t pt-1",
                                            children: [
                                                {
                                                    cls: "border-sky-400/40 bg-sky-400/10 text-sky-700",
                                                    label: "Upstream"
                                                },
                                                {
                                                    cls: "border-emerald-400/40 bg-emerald-400/10 text-emerald-700",
                                                    label: "Term"
                                                },
                                                {
                                                    cls: "border-amber-400/40 bg-amber-400/10 text-amber-700",
                                                    label: "Constant"
                                                },
                                                {
                                                    cls: "border-violet-400/40 bg-violet-400/10 text-violet-700",
                                                    label: "Function"
                                                }
                                            ].map(({ cls, label })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `rounded border px-1.5 py-px font-mono text-[9px] ${cls}`,
                                                        children: label
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                        lineNumber: 905,
                                                        columnNumber: 23
                                                    }, this)
                                                }, label, false, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                    lineNumber: 904,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                            lineNumber: 885,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                    lineNumber: 836,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "select-none font-light font-mono text-3xl text-muted-foreground/40",
                                    children: "ƒ(x)"
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                    lineNumber: 917,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "max-w-40 text-muted-foreground text-xs",
                                    children: "Select a term on the left or create a new one to edit its formula."
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                    lineNumber: 920,
                                    columnNumber: 15
                                }, this),
                                !disabled && formulas.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "mt-1 flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs transition-colors hover:bg-muted",
                                    onClick: addTerm,
                                    type: "button",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "size-3"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                            lineNumber: 930,
                                            columnNumber: 19
                                        }, this),
                                        "Create first term"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                    lineNumber: 925,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                            lineNumber: 916,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                    lineNumber: 705,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                lineNumber: 701,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
        lineNumber: 669,
        columnNumber: 5
    }, this);
}
_s(CalculationEngineModeSection, "TY1e1apuY708PgfuSAqV6uFGSQA=");
_c1 = CalculationEngineModeSection;
function CalculationEngineRunSections({ lastRunOutput, resolvedMode }) {
    const calculationSummary = asRecord(lastRunOutput.calculationSummary);
    const formulaTrace = asRecord(asRecord(lastRunOutput.formula_trace).formulaTrace);
    const calculatedResults = asRecord(asRecord(lastRunOutput.calculated_results).calculatedResults);
    const warnings = Array.isArray(lastRunOutput.warnings) ? lastRunOutput.warnings : [];
    const mode = resolvedMode || calculationSummary.formulaMode || "auto";
    const modeLabel = getCalculationRunModeLabel(mode);
    const traceEntries = Object.entries(formulaTrace);
    const resultEntries = Object.entries(calculatedResults);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 rounded-md border bg-muted/20 p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-medium text-sm",
                        children: "Run summary"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                        lineNumber: 974,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "divide-y rounded border bg-background/40 text-xs",
                        children: [
                            {
                                label: "Formula mode",
                                value: modeLabel
                            },
                            {
                                label: "Formulas evaluated",
                                value: calculationSummary.calculatedCount ?? "–"
                            },
                            {
                                label: "Input values",
                                value: calculationSummary.inputCount ?? "–"
                            },
                            {
                                label: "Rules used",
                                value: calculationSummary.ruleCount ?? "–"
                            },
                            {
                                label: "Warnings",
                                value: calculationSummary.warningCount ?? "–"
                            }
                        ].map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-[9rem_1fr] gap-2 px-2 py-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-muted-foreground",
                                        children: row.label
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                        lineNumber: 999,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        children: String(row.value)
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                        lineNumber: 1000,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, row.label, true, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                lineNumber: 995,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                        lineNumber: 975,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                lineNumber: 973,
                columnNumber: 7
            }, this),
            resultEntries.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 rounded-md border bg-muted/20 p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-medium text-xs",
                        children: "Calculated results"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                        lineNumber: 1008,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "divide-y rounded border bg-background/40 text-xs",
                        children: resultEntries.map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-[9rem_1fr] gap-2 px-2 py-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-muted-foreground",
                                        children: key
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                        lineNumber: 1015,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        children: String(value)
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                        lineNumber: 1016,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, key, true, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                lineNumber: 1011,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                        lineNumber: 1009,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                lineNumber: 1007,
                columnNumber: 9
            }, this),
            traceEntries.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 rounded-md border bg-muted/20 p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-medium text-xs",
                        children: "Formula trace"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                        lineNumber: 1025,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1",
                        children: traceEntries.map(([key, traceValue])=>{
                            const trace = asRecord(traceValue);
                            const traceWarnings = Array.isArray(trace.warnings) ? trace.warnings : [];
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded border bg-background/60 p-2 text-[11px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium font-mono",
                                                children: key
                                            }, void 0, false, {
                                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                lineNumber: 1038,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: [
                                                    "= ",
                                                    String(trace.result ?? "–")
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                                lineNumber: 1039,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                        lineNumber: 1037,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-0.5 text-muted-foreground",
                                        children: String(trace.expression || trace.operation || "")
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                        lineNumber: 1043,
                                        columnNumber: 19
                                    }, this),
                                    traceWarnings.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 text-[10px] text-amber-600",
                                        children: traceWarnings.join("; ")
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                        lineNumber: 1047,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, key, true, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                                lineNumber: 1033,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                        lineNumber: 1026,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                lineNumber: 1024,
                columnNumber: 9
            }, this),
            warnings.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1 rounded-md border border-amber-500/30 bg-amber-500/10 p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-medium text-amber-700 text-xs",
                        children: "Warnings"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                        lineNumber: 1060,
                        columnNumber: 11
                    }, this),
                    warnings.map((warning)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-[11px] text-amber-800 dark:text-amber-300",
                            children: warning
                        }, warning, false, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                            lineNumber: 1062,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
                lineNumber: 1059,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx",
        lineNumber: 972,
        columnNumber: 5
    }, this);
}
_c2 = CalculationEngineRunSections;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "TokenChip");
__turbopack_context__.k.register(_c1, "CalculationEngineModeSection");
__turbopack_context__.k.register(_c2, "CalculationEngineRunSections");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CalculationEngineEditor",
    ()=>CalculationEngineEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$two$2d$panel$2d$tool$2d$shell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/two-panel-tool-shell.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$logic$2d$viewers$2f$calculation$2d$engine$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-panel.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const KNOWN_FUNCTIONS = new Set([
    "abs",
    "max",
    "min",
    "round",
    "max_subtract_zero",
    "min_multiply_cap"
]);
const DIGIT_CHARACTER_REGEX = /\d/;
const IDENTIFIER_CHARACTER_REGEX = /[A-Za-z0-9_:.@-]/;
const IDENTIFIER_START_REGEX = /[A-Za-z_]/;
const NUMBER_CHARACTER_REGEX = /[\d.]/;
const WHITESPACE_CHARACTER_REGEX = /\s/;
const OPERATOR_TOKENS = new Set([
    "+",
    "-",
    "*",
    "/"
]);
function getSingleCharacterToken(character) {
    if (character === "(" || character === ")") {
        return {
            type: "paren",
            value: character
        };
    }
    if (character === ",") return {
        type: "op",
        value: ","
    };
    if (OPERATOR_TOKENS.has(character)) return {
        type: "op",
        value: character
    };
    return null;
}
function readNumberToken(expression, startIndex) {
    let endIndex = startIndex + 1;
    while(endIndex < expression.length && NUMBER_CHARACTER_REGEX.test(expression[endIndex])){
        endIndex += 1;
    }
    return {
        nextIndex: endIndex,
        token: {
            type: "num",
            value: expression.slice(startIndex, endIndex)
        }
    };
}
function readIdentifierToken(expression, startIndex) {
    let endIndex = startIndex + 1;
    while(endIndex < expression.length && IDENTIFIER_CHARACTER_REGEX.test(expression[endIndex])){
        endIndex += 1;
    }
    const word = expression.slice(startIndex, endIndex);
    return {
        nextIndex: endIndex,
        token: {
            type: KNOWN_FUNCTIONS.has(word) ? "func" : "ref",
            value: word
        }
    };
}
function getTokenAt(expression, index) {
    const character = expression[index];
    if (WHITESPACE_CHARACTER_REGEX.test(character)) return {
        nextIndex: index + 1,
        token: null
    };
    const singleChar = getSingleCharacterToken(character);
    if (singleChar) return {
        nextIndex: index + 1,
        token: singleChar
    };
    if (DIGIT_CHARACTER_REGEX.test(character) || character === "." && DIGIT_CHARACTER_REGEX.test(expression[index + 1] ?? "")) {
        return readNumberToken(expression, index);
    }
    if (IDENTIFIER_START_REGEX.test(character)) return readIdentifierToken(expression, index);
    return {
        nextIndex: index + 1,
        token: null
    };
}
function tokenizeExpression(expression) {
    const tokens = [];
    let i = 0;
    while(i < expression.length){
        const { nextIndex, token } = getTokenAt(expression, i);
        if (token) tokens.push(token);
        i = nextIndex;
    }
    return tokens;
}
function tokensToExpression(tokens) {
    return tokens.map((t)=>t.value).join(" ");
}
function getTokenItems(tokens) {
    const counts = new Map();
    return tokens.map((token)=>{
        const baseKey = `${token.type}:${token.value}`;
        const count = (counts.get(baseKey) ?? 0) + 1;
        counts.set(baseKey, count);
        return {
            key: `${baseKey}:${count}`,
            token
        };
    });
}
function formulaToExpression(formula) {
    if (formula.formulaExpression?.trim()) return formula.formulaExpression.trim();
    const ops = formula.operands.map(String);
    switch(formula.operation){
        case "pass_through":
            return ops[0] ?? "";
        case "add":
            return ops.join(" + ");
        case "subtract":
            return ops.length > 1 ? `${ops[0]} - ${ops.slice(1).join(" - ")}` : ops[0] ?? "";
        case "multiply":
            return ops.join(" * ");
        case "divide":
            return ops.length > 1 ? `${ops[0]} / ${ops.slice(1).join(" / ")}` : ops[0] ?? "";
        default:
            return ops.length > 0 ? `${formula.operation}(${ops.join(", ")})` : "";
    }
}
function getFormulasFromConfig(config) {
    const raw = config.formulas ?? config.calculationRules ?? config.inlineFormulas;
    if (!Array.isArray(raw)) return [];
    return raw.filter((item)=>typeof item === "object" && item !== null && typeof item.calculationId === "string");
}
function hasConnectedCalculationRuleSource(block, edges) {
    return edges.some((edge)=>edge.target === block.id && (edge.data?.targetInputRole === "calculation_rules" || edge.data?.workflowEdge?.targetInputRole === "calculation_rules"));
}
function asRecord(value) {
    return typeof value === "object" && value !== null ? value : {};
}
function asNumber(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}
const UPSTREAM_VALUE_GROUP_KEYS = [
    "namedValues",
    "named_values",
    "categoryTotals",
    "rollupTotals",
    "fapiInputs",
    "calculatedResults"
];
const FALLBACK_VALUE_KEYS = [
    "fatPaid",
    "rtf",
    "inclusionRate",
    "fxRate"
];
function isCalculationInputRole(role) {
    return role === "named_values" || role === "fapi_inputs" || role === "protected_inputs";
}
function collectUpstreamValues(block, edges, nodes, lastOutput) {
    const seen = new Set();
    const result = [];
    const incomingEdges = edges.filter((e)=>e.target === block.id);
    for (const edge of incomingEdges){
        const sourceNode = nodes.find((n)=>n.id === edge.source);
        if (!sourceNode) continue;
        const sourceBlock = sourceNode.data.block;
        const role = edge.data?.targetInputRole ?? edge.data?.workflowEdge?.targetInputRole;
        if (!isCalculationInputRole(role)) continue;
        const sourceOutput = asRecord(lastOutput[edge.source] ?? lastOutput[sourceBlock?.id ?? ""] ?? {});
        for (const key of UPSTREAM_VALUE_GROUP_KEYS){
            const group = asRecord(sourceOutput[key]);
            for (const [valueKey, value] of Object.entries(group)){
                if (!seen.has(valueKey)) {
                    seen.add(valueKey);
                    result.push({
                        key: valueKey,
                        value: asNumber(value)
                    });
                }
            }
        }
    }
    for (const key of FALLBACK_VALUE_KEYS){
        if (!seen.has(key)) {
            seen.add(key);
            result.push({
                key,
                value: null
            });
        }
    }
    return result;
}
// ─── Token chip ───────────────────────────────────────────────────────────────
function TokenChip({ termKeys, token, upstreamKeys }) {
    const operatorLabels = {
        "*": "×",
        "-": "−",
        "/": "÷"
    };
    const displayValue = operatorLabels[token.value] ?? token.value;
    if (token.type === "op") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex select-none items-center rounded px-1.5 py-0.5 font-bold font-mono text-foreground/60 text-xs",
        children: displayValue
    }, void 0, false, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
        lineNumber: 210,
        columnNumber: 35
    }, this);
    if (token.type === "paren") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex select-none items-center rounded px-1 py-0.5 font-mono text-muted-foreground text-xs",
        children: token.value
    }, void 0, false, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
        lineNumber: 211,
        columnNumber: 38
    }, this);
    if (token.type === "num") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center rounded border border-amber-400/50 bg-amber-400/15 px-1.5 py-0.5 font-mono text-[11px] text-amber-700 dark:text-amber-400",
        children: token.value
    }, void 0, false, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
        lineNumber: 212,
        columnNumber: 36
    }, this);
    if (token.type === "func") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center rounded border border-violet-400/50 bg-violet-400/15 px-1.5 py-0.5 font-mono text-[11px] text-violet-700 dark:text-violet-400",
        children: token.value
    }, void 0, false, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
        lineNumber: 213,
        columnNumber: 37
    }, this);
    if (termKeys.has(token.value)) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center rounded border border-emerald-400/50 bg-emerald-400/15 px-1.5 py-0.5 font-mono text-[11px] text-emerald-700 dark:text-emerald-400",
        children: token.value
    }, void 0, false, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
        lineNumber: 214,
        columnNumber: 41
    }, this);
    if (upstreamKeys.has(token.value)) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center rounded border border-sky-400/50 bg-sky-400/15 px-1.5 py-0.5 font-mono text-[11px] text-sky-700 dark:text-sky-400",
        children: token.value
    }, void 0, false, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
        lineNumber: 215,
        columnNumber: 45
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center rounded border border-muted-foreground/30 bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] text-foreground",
        children: token.value
    }, void 0, false, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
        lineNumber: 216,
        columnNumber: 10
    }, this);
}
_c = TokenChip;
// ─── Constants ────────────────────────────────────────────────────────────────
const SPECIAL_FUNCTIONS = [
    {
        display: "max(A−B, 0)",
        name: "max_subtract_zero"
    },
    {
        display: "min(A×B, C)",
        name: "min_multiply_cap"
    },
    {
        display: "abs(…)",
        name: "abs"
    },
    {
        display: "max(…)",
        name: "max"
    },
    {
        display: "min(…)",
        name: "min"
    },
    {
        display: "round(…)",
        name: "round"
    }
];
const OPERATOR_KEYS = [
    {
        label: "+",
        value: "+"
    },
    {
        label: "−",
        value: "-"
    },
    {
        label: "×",
        value: "*"
    },
    {
        label: "÷",
        value: "/"
    },
    {
        label: "(",
        value: "("
    },
    {
        label: ")",
        value: ")"
    },
    {
        label: ",",
        value: ","
    }
];
const LEGEND = [
    {
        cls: "border-sky-400/40 bg-sky-400/10 text-sky-700",
        label: "Upstream"
    },
    {
        cls: "border-emerald-400/40 bg-emerald-400/10 text-emerald-700",
        label: "Term"
    },
    {
        cls: "border-amber-400/40 bg-amber-400/10 text-amber-700",
        label: "Constant"
    },
    {
        cls: "border-violet-400/40 bg-violet-400/10 text-violet-700",
        label: "Function"
    }
];
function CalculationEngineEditor({ block, createTermRequest, disabled, edges, fill, insertRequest, lastRunOutput, nodes, onSelectedTermIdChange, onUpdateConfig, selectedTermId }) {
    _s();
    const config = block.config;
    const mode = config.mode ?? "auto";
    const formulas = getFormulasFromConfig(config);
    const [selectedIndex, setSelectedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [tokens, setTokens] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [constantInput, setConstantInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("edit");
    const handledCreateRequestRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    const handledInsertRequestRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    const upstreamValues = collectUpstreamValues(block, edges, nodes, lastRunOutput);
    const upstreamKeys = new Set(upstreamValues.map((v)=>v.key));
    const allTermKeys = new Set(formulas.map((f)=>f.resultKey));
    const tokenItems = getTokenItems(tokens);
    const selectedFormula = selectedIndex !== null ? formulas[selectedIndex] ?? null : null;
    const hasExternalRules = hasConnectedCalculationRuleSource(block, edges);
    const saveFormulas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalculationEngineEditor.useCallback[saveFormulas]": (next)=>onUpdateConfig("formulas", next)
    }["CalculationEngineEditor.useCallback[saveFormulas]"], [
        onUpdateConfig
    ]);
    const saveTokens = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalculationEngineEditor.useCallback[saveTokens]": (nextTokens)=>{
            if (selectedIndex === null) return;
            setTokens(nextTokens);
            const expression = tokensToExpression(nextTokens);
            const next = [
                ...formulas
            ];
            next[selectedIndex] = {
                ...next[selectedIndex],
                formulaExpression: expression,
                operands: [],
                operation: "pass_through"
            };
            saveFormulas(next);
        }
    }["CalculationEngineEditor.useCallback[saveTokens]"], [
        formulas,
        saveFormulas,
        selectedIndex
    ]);
    const selectTerm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalculationEngineEditor.useCallback[selectTerm]": (index)=>{
            setSelectedIndex(index);
            const formula = formulas[index];
            setTokens(tokenizeExpression(formulaToExpression(formula)));
            setConstantInput("");
            onSelectedTermIdChange?.(formula.resultKey);
        }
    }["CalculationEngineEditor.useCallback[selectTerm]"], [
        formulas,
        onSelectedTermIdChange
    ]);
    const appendToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalculationEngineEditor.useCallback[appendToken]": (token)=>{
            if (!disabled) saveTokens([
                ...tokens,
                token
            ]);
        }
    }["CalculationEngineEditor.useCallback[appendToken]"], [
        disabled,
        saveTokens,
        tokens
    ]);
    const appendRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalculationEngineEditor.useCallback[appendRef]": (key)=>appendToken({
                type: "ref",
                value: key
            })
    }["CalculationEngineEditor.useCallback[appendRef]"], [
        appendToken
    ]);
    const appendFunc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalculationEngineEditor.useCallback[appendFunc]": (name)=>{
            if (!disabled) saveTokens([
                ...tokens,
                {
                    type: "func",
                    value: name
                },
                {
                    type: "paren",
                    value: "("
                }
            ]);
        }
    }["CalculationEngineEditor.useCallback[appendFunc]"], [
        disabled,
        saveTokens,
        tokens
    ]);
    const appendOp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalculationEngineEditor.useCallback[appendOp]": (op)=>appendToken({
                type: op === "(" || op === ")" ? "paren" : "op",
                value: op
            })
    }["CalculationEngineEditor.useCallback[appendOp]"], [
        appendToken
    ]);
    const insertConstant = ()=>{
        if (!constantInput.trim()) return;
        const num = Number.parseFloat(constantInput);
        if (!Number.isFinite(num)) return;
        appendToken({
            type: "num",
            value: constantInput.trim()
        });
        setConstantInput("");
    };
    const backspace = ()=>{
        if (!disabled && tokens.length > 0) saveTokens(tokens.slice(0, -1));
    };
    const clearFormula = ()=>{
        if (!disabled) saveTokens([]);
    };
    const updateFormulaField = (field, value)=>{
        if (disabled || selectedIndex === null) return;
        const next = [
            ...formulas
        ];
        const updated = {
            ...next[selectedIndex],
            [field]: value
        };
        if (field === "resultKey") {
            updated.calculationId = value;
            onSelectedTermIdChange?.(value);
        }
        next[selectedIndex] = updated;
        saveFormulas(next);
    };
    const addTerm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalculationEngineEditor.useCallback[addTerm]": ()=>{
            if (disabled) return;
            const id = `TERM_${formulas.length + 1}`;
            const newFormula = {
                calculationId: id,
                formulaExpression: "",
                label: id,
                operands: [],
                operation: "pass_through",
                resultKey: id
            };
            const next = [
                ...formulas,
                newFormula
            ];
            saveFormulas(next);
            const newIndex = next.length - 1;
            setSelectedIndex(newIndex);
            setTokens([]);
            setConstantInput("");
            onSelectedTermIdChange?.(id);
        }
    }["CalculationEngineEditor.useCallback[addTerm]"], [
        disabled,
        formulas,
        onSelectedTermIdChange,
        saveFormulas
    ]);
    const deleteTerm = (index)=>{
        if (disabled) return;
        const next = formulas.filter((_, i)=>i !== index);
        saveFormulas(next);
        if (selectedIndex === index) {
            setSelectedIndex(null);
            setTokens([]);
            onSelectedTermIdChange?.(null);
        } else if (selectedIndex !== null && selectedIndex > index) setSelectedIndex(selectedIndex - 1);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalculationEngineEditor.useEffect": ()=>{
            if (!selectedTermId) return;
            const index = formulas.findIndex({
                "CalculationEngineEditor.useEffect.index": (f)=>f.resultKey === selectedTermId || f.calculationId === selectedTermId
            }["CalculationEngineEditor.useEffect.index"]);
            if (index >= 0 && index !== selectedIndex) selectTerm(index);
        }
    }["CalculationEngineEditor.useEffect"], [
        formulas,
        selectedIndex,
        selectedTermId,
        selectTerm
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalculationEngineEditor.useEffect": ()=>{
            if (createTermRequest === undefined || createTermRequest <= 0 || createTermRequest === handledCreateRequestRef.current) return;
            handledCreateRequestRef.current = createTermRequest;
            addTerm();
        }
    }["CalculationEngineEditor.useEffect"], [
        addTerm,
        createTermRequest
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalculationEngineEditor.useEffect": ()=>{
            if (!insertRequest || insertRequest.id === handledInsertRequestRef.current) return;
            handledInsertRequestRef.current = insertRequest.id;
            appendRef(insertRequest.key);
        }
    }["CalculationEngineEditor.useEffect"], [
        appendRef,
        insertRequest
    ]);
    // ─── Left panel: term index ───────────────────────────────────────────────
    const leftPanel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "shrink-0 border-b px-3 py-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                    disabled: disabled,
                    onValueChange: (v)=>onUpdateConfig("mode", v),
                    value: mode,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                            className: "h-7 w-full text-[10px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                lineNumber: 401,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                            lineNumber: 400,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    className: "text-xs",
                                    value: "auto",
                                    children: [
                                        "Auto — ",
                                        hasExternalRules ? "connected source" : "inline formulas"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                    lineNumber: 404,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    className: "text-xs",
                                    value: "inline",
                                    children: "Inline formulas"
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                    lineNumber: 407,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    className: "text-xs",
                                    value: "external_rules",
                                    children: "External rules"
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                    lineNumber: 408,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                            lineNumber: 403,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                    lineNumber: 399,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                lineNumber: 398,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto",
                children: formulas.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-full flex-col items-center justify-center gap-2 p-4 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "select-none font-light font-mono text-2xl text-muted-foreground/30",
                            children: "ƒ(x)"
                        }, void 0, false, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                            lineNumber: 417,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[11px] text-muted-foreground",
                            children: "No terms yet"
                        }, void 0, false, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                            lineNumber: 418,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                    lineNumber: 416,
                    columnNumber: 11
                }, this) : formulas.map((formula, index)=>{
                    const preview = formulaToExpression(formula);
                    const isSelected = selectedIndex === index;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group flex w-full flex-col items-start gap-0.5 border-b px-3 py-2.5 text-left transition-colors hover:bg-muted/50", isSelected && "bg-muted/70"),
                        onClick: ()=>selectTerm(index),
                        type: "button",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex w-full items-center justify-between gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate font-mono font-medium text-xs",
                                        children: formula.resultKey
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                        lineNumber: 435,
                                        columnNumber: 19
                                    }, this),
                                    !disabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "invisible shrink-0 rounded p-0.5 text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive group-hover:visible",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            deleteTerm(index);
                                        },
                                        title: "Delete term",
                                        type: "button",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            className: "size-3"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                            lineNumber: 443,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                        lineNumber: 437,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                lineNumber: 434,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate text-[10px] text-muted-foreground",
                                children: preview || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                    children: "empty"
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                    lineNumber: 448,
                                    columnNumber: 31
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                lineNumber: 447,
                                columnNumber: 17
                            }, this)
                        ]
                    }, formula.calculationId, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                        lineNumber: 425,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                lineNumber: 414,
                columnNumber: 7
            }, this),
            !disabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "shrink-0 border-t px-3 py-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "flex w-full items-center justify-center gap-1.5 rounded border px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    onClick: addTerm,
                    type: "button",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "size-3"
                        }, void 0, false, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                            lineNumber: 464,
                            columnNumber: 13
                        }, this),
                        "New term"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                    lineNumber: 459,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                lineNumber: 458,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
        lineNumber: 396,
        columnNumber: 5
    }, this);
    // ─── Right panel: Edit | Summary tabs ────────────────────────────────────
    const rightPanel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex shrink-0 border-b bg-muted/10",
                children: [
                    "edit",
                    "summary"
                ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-4 py-2 text-xs font-medium transition-colors", activeTab === tab ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"),
                        onClick: ()=>setActiveTab(tab),
                        type: "button",
                        children: tab === "edit" ? "Edit" : "Summary"
                    }, tab, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                        lineNumber: 479,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                lineNumber: 477,
                columnNumber: 7
            }, this),
            activeTab === "edit" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-h-0 flex-1 flex-col overflow-hidden",
                children: selectedFormula ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex shrink-0 items-center gap-2 border-b bg-muted/10 px-3 py-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    className: "h-6 w-24 font-mono text-xs",
                                    disabled: disabled,
                                    onChange: (e)=>updateFormulaField("resultKey", e.target.value),
                                    placeholder: "KEY",
                                    value: selectedFormula.resultKey
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                    lineNumber: 502,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "select-none font-light text-muted-foreground text-sm",
                                    children: "="
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                    lineNumber: 509,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    className: "h-6 flex-1 text-xs",
                                    disabled: disabled,
                                    onChange: (e)=>updateFormulaField("label", e.target.value),
                                    placeholder: "Label",
                                    value: selectedFormula.label
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                    lineNumber: 510,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                            lineNumber: 501,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "shrink-0 border-b px-3 pt-3 pb-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex min-h-11 flex-wrap items-center gap-1 rounded-md border bg-background px-2 py-1.5",
                                    children: tokens.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "select-none text-[11px] text-muted-foreground italic",
                                        children: "Formula is empty"
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                        lineNumber: 523,
                                        columnNumber: 21
                                    }, this) : tokenItems.map(({ key, token })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TokenChip, {
                                            termKeys: allTermKeys,
                                            token: token,
                                            upstreamKeys: upstreamKeys
                                        }, key, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                            lineNumber: 526,
                                            columnNumber: 23
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                    lineNumber: 521,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 flex flex-wrap items-center gap-1",
                                    children: [
                                        OPERATOR_KEYS.map(({ label, value })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "flex h-7 min-w-7 select-none items-center justify-center rounded border bg-background px-1.5 font-mono font-semibold text-sm transition-colors hover:bg-muted disabled:opacity-40",
                                                disabled: disabled,
                                                onClick: ()=>appendOp(value),
                                                type: "button",
                                                children: label
                                            }, value, false, {
                                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                                lineNumber: 532,
                                                columnNumber: 21
                                            }, this)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-auto flex gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "flex h-7 items-center gap-1 rounded border bg-background px-2 text-[10px] text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40",
                                                    disabled: disabled || tokens.length === 0,
                                                    onClick: backspace,
                                                    type: "button",
                                                    children: "⌫"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                                    lineNumber: 543,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "flex h-7 items-center gap-1 rounded border bg-background px-2 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-destructive disabled:opacity-40",
                                                    disabled: disabled || tokens.length === 0,
                                                    onClick: clearFormula,
                                                    type: "button",
                                                    children: "Clear"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                                    lineNumber: 544,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                            lineNumber: 542,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                    lineNumber: 530,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                            lineNumber: 520,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 space-y-4 overflow-y-auto px-3 py-3",
                            children: [
                                upstreamValues.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-bold text-[9px] text-sky-600/80 uppercase tracking-widest",
                                            children: "Upstream values"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                            lineNumber: 554,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-1",
                                            children: upstreamValues.map(({ key, value })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "flex select-none items-center gap-1 rounded border border-sky-400/40 bg-sky-400/10 px-2 py-0.5 font-mono text-[10px] text-sky-700 transition-colors hover:bg-sky-400/25 disabled:opacity-40 dark:text-sky-400",
                                                    disabled: disabled,
                                                    onClick: ()=>appendRef(key),
                                                    title: value !== null ? String(value) : "no value from last run",
                                                    type: "button",
                                                    children: [
                                                        key,
                                                        value !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sky-500/70",
                                                            children: [
                                                                "= ",
                                                                value
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                                            lineNumber: 566,
                                                            columnNumber: 46
                                                        }, this)
                                                    ]
                                                }, key, true, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                                    lineNumber: 557,
                                                    columnNumber: 25
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                            lineNumber: 555,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                    lineNumber: 553,
                                    columnNumber: 19
                                }, this),
                                formulas.filter((_, i)=>i !== selectedIndex).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-bold text-[9px] text-emerald-600/80 uppercase tracking-widest",
                                            children: "Other terms"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                            lineNumber: 576,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-1",
                                            children: formulas.filter((_, i)=>i !== selectedIndex).map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "select-none rounded border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] text-emerald-700 transition-colors hover:bg-emerald-400/25 disabled:opacity-40 dark:text-emerald-400",
                                                    disabled: disabled,
                                                    onClick: ()=>appendRef(f.resultKey),
                                                    type: "button",
                                                    children: f.resultKey
                                                }, f.calculationId, false, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                                    lineNumber: 579,
                                                    columnNumber: 25
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                            lineNumber: 577,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                    lineNumber: 575,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-bold text-[9px] text-violet-600/80 uppercase tracking-widest",
                                            children: "Functions"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                            lineNumber: 595,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-1",
                                            children: SPECIAL_FUNCTIONS.map(({ display, name })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "select-none rounded border border-violet-400/40 bg-violet-400/10 px-2 py-0.5 font-mono text-[10px] text-violet-700 transition-colors hover:bg-violet-400/25 disabled:opacity-40 dark:text-violet-400",
                                                    disabled: disabled,
                                                    onClick: ()=>appendFunc(name),
                                                    title: name,
                                                    type: "button",
                                                    children: display
                                                }, name, false, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                                    lineNumber: 598,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                            lineNumber: 596,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                    lineNumber: 594,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-bold text-[9px] text-amber-600/80 uppercase tracking-widest",
                                            children: "Constant"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                            lineNumber: 614,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    className: "h-7 w-28 font-mono text-xs",
                                                    disabled: disabled,
                                                    onChange: (e)=>setConstantInput(e.target.value),
                                                    onKeyDown: (e)=>e.key === "Enter" && insertConstant(),
                                                    placeholder: "e.g. 34400",
                                                    type: "number",
                                                    value: constantInput
                                                }, void 0, false, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                                    lineNumber: 616,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "h-7 rounded border border-amber-400/40 bg-amber-400/10 px-2 font-semibold text-[10px] text-amber-700 transition-colors hover:bg-amber-400/25 disabled:opacity-40 dark:text-amber-400",
                                                    disabled: disabled || !constantInput.trim(),
                                                    onClick: insertConstant,
                                                    type: "button",
                                                    children: "Insert"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                                    lineNumber: 625,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                            lineNumber: 615,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                    lineNumber: 613,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-x-3 gap-y-1 border-t pt-2",
                                    children: LEGEND.map(({ cls, label })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `rounded border px-1.5 py-px font-mono text-[9px] ${cls}`,
                                                children: label
                                            }, void 0, false, {
                                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                                lineNumber: 640,
                                                columnNumber: 23
                                            }, this)
                                        }, label, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                            lineNumber: 639,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                    lineNumber: 637,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                            lineNumber: 550,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "select-none font-light font-mono text-3xl text-muted-foreground/40",
                            children: "ƒ(x)"
                        }, void 0, false, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                            lineNumber: 648,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "max-w-40 text-muted-foreground text-xs",
                            children: "Select a term on the left or create a new one to edit its formula."
                        }, void 0, false, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                            lineNumber: 649,
                            columnNumber: 15
                        }, this),
                        !disabled && formulas.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "mt-1 flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs transition-colors hover:bg-muted",
                            onClick: addTerm,
                            type: "button",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "size-3"
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                                    lineNumber: 652,
                                    columnNumber: 19
                                }, this),
                                "Create first term"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                            lineNumber: 651,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                    lineNumber: 647,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                lineNumber: 497,
                columnNumber: 9
            }, this),
            activeTab === "summary" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto p-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$logic$2d$viewers$2f$calculation$2d$engine$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CalculationEngineRunSections"], {
                    lastRunOutput: lastRunOutput
                }, void 0, false, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                    lineNumber: 664,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
                lineNumber: 663,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
        lineNumber: 475,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(fill ? "h-full" : "h-[560px]", "overflow-hidden rounded-md border"),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$two$2d$panel$2d$tool$2d$shell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TwoPanelToolShell"], {
            badge: "Logic",
            badgeVariant: "logic",
            defaultLeftPercent: 30,
            leftPanel: leftPanel,
            minLeftPx: 180,
            rightPanel: rightPanel,
            title: "Calculation Engine"
        }, void 0, false, {
            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
            lineNumber: 672,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx",
        lineNumber: 671,
        columnNumber: 5
    }, this);
}
_s(CalculationEngineEditor, "aZdbXG2z3bsnuDAiG1z1vp/EWiU=");
_c1 = CalculationEngineEditor;
var _c, _c1;
__turbopack_context__.k.register(_c, "TokenChip");
__turbopack_context__.k.register(_c1, "CalculationEngineEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AggregatorWorkspace",
    ()=>AggregatorWorkspace
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$rollup$2d$rulebook$2d$editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/source-viewers/rollup-rulebook-editor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$rule$2d$source$2d$editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/source-viewers/rule-source-editor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$workspace$2f$block$2d$data$2d$flow$2d$pane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function getBlockLabel(nodes, blockId) {
    const node = nodes.find((n)=>n.id === blockId);
    return node?.data?.block?.label || node?.data?.label || blockId;
}
// Returns categories from upstream Keyword Mapper / Keyword Rules blocks.
// Returns undefined when no keyword-related block is connected (enables text-input fallback).
// Returns [] when a keyword block IS connected but has no categories yet.
function getConnectedKeywordCategories(block, edges, nodes) {
    const seen = new Set();
    const result = [];
    let foundKeywordBlock = false;
    const tryBlock = (b)=>{
        const rules = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$rule$2d$source$2d$editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getKeywordRules"])(b.config || {});
        if (rules.length === 0) return;
        foundKeywordBlock = true;
        for (const rule of rules){
            const id = String(rule.categoryId || rule.category || "").trim();
            if (!id || seen.has(id)) continue;
            seen.add(id);
            result.push({
                id,
                label: String(rule.categoryLabel || rule.label || id)
            });
        }
    };
    const isKeywordRelated = (b)=>{
        const toolId = String(b.config?.toolId || "");
        const subtype = String(b.subtype || "");
        const sourceKind = String(b.config?.sourceKind || "").toLowerCase();
        return toolId === "logic.keyword_mapper" || subtype === "Classification / Mapping" || subtype === "Keyword Rules" || sourceKind.includes("keyword");
    };
    const getBlock = (nodeId)=>{
        const n = nodes.find((n)=>n.id === nodeId);
        return n?.data?.block;
    };
    for (const edge of edges.filter((e)=>e.target === block.id)){
        const src = getBlock(edge.source);
        if (!src) continue;
        if (isKeywordRelated(src)) foundKeywordBlock = true;
        tryBlock(src);
        for (const innerEdge of edges.filter((e)=>e.target === src.id)){
            const ss = getBlock(innerEdge.source);
            if (!ss) continue;
            if (isKeywordRelated(ss)) foundKeywordBlock = true;
            tryBlock(ss);
        }
    }
    if (!foundKeywordBlock) return undefined;
    return result.sort((a, b)=>a.id.localeCompare(b.id));
}
function getConnectedSources(block, edges, nodes) {
    return edges.filter((e)=>e.target === block.id && (e.data?.workflowEdge?.targetInputRole === "rollup_rules" || e.data?.targetInputRole === "rollup_rules")).flatMap((e)=>{
        const node = nodes.find((n)=>n.id === e.source);
        const nodeBlock = node?.data?.block;
        if (!node || !nodeBlock) return [];
        return [
            {
                nodeId: node.id,
                label: getBlockLabel(nodes, node.id),
                block: nodeBlock,
                edgeRole: e.data?.workflowEdge?.targetInputRole || e.data?.targetInputRole || "rollup_rules"
            }
        ];
    });
}
function ReadOnlyBanner({ label, onClear }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex shrink-0 items-center gap-2 border-b bg-amber-50 px-3 py-1.5 dark:bg-amber-950/30",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                className: "size-3.5 shrink-0 text-amber-600 dark:text-amber-400"
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "truncate text-xs text-amber-700 dark:text-amber-300",
                children: [
                    "Viewing ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                        lineNumber: 127,
                        columnNumber: 17
                    }, this),
                    " — read-only"
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            onClear && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "ml-auto shrink-0 text-[11px] text-amber-600 underline dark:text-amber-400",
                onClick: onClear,
                type: "button",
                children: "Back to own config"
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                lineNumber: 130,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
_c = ReadOnlyBanner;
function InteractiveIOStrip({ block, edges, lastRun, nodes, onExecuteStep }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [panelHeight, setPanelHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(220);
    const onResizePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InteractiveIOStrip.useCallback[onResizePointerDown]": (e)=>{
            e.preventDefault();
            const startY = e.clientY;
            const startHeight = panelHeight;
            const onMove = {
                "InteractiveIOStrip.useCallback[onResizePointerDown].onMove": (ev)=>{
                    const delta = startY - ev.clientY;
                    setPanelHeight(Math.max(140, Math.min(560, startHeight + delta)));
                }
            }["InteractiveIOStrip.useCallback[onResizePointerDown].onMove"];
            const onUp = {
                "InteractiveIOStrip.useCallback[onResizePointerDown].onUp": ()=>{
                    window.removeEventListener("pointermove", onMove);
                    window.removeEventListener("pointerup", onUp);
                }
            }["InteractiveIOStrip.useCallback[onResizePointerDown].onUp"];
            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", onUp);
        }
    }["InteractiveIOStrip.useCallback[onResizePointerDown]"], [
        panelHeight
    ]);
    const incomingCount = edges.filter((e)=>e.target === block.id).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "shrink-0 border-t bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "flex flex-1 items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/30",
                        onClick: ()=>setOpen((v)=>!v),
                        type: "button",
                        children: [
                            open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: "size-3.5 shrink-0 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                                lineNumber: 188,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                className: "size-3.5 shrink-0 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                                lineNumber: 190,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: "Connected I/O"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                                lineNumber: 192,
                                columnNumber: 11
                            }, this),
                            incomingCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground",
                                children: [
                                    incomingCount,
                                    " input",
                                    incomingCount !== 1 ? "s" : ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                                lineNumber: 194,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-auto text-[10px] opacity-60",
                                children: open ? "collapse" : "expand"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                                lineNumber: 198,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this),
                    onExecuteStep && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "mr-3 flex shrink-0 items-center gap-1.5 rounded-md border border-primary/40 px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10",
                        onClick: onExecuteStep,
                        title: "Run this step",
                        type: "button",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                className: "size-3"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                                lineNumber: 209,
                                columnNumber: 13
                            }, this),
                            "Run step"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                        lineNumber: 203,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                lineNumber: 181,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-1.5 w-full cursor-ns-resize bg-border/40 transition-colors hover:bg-primary/30 active:bg-primary/40",
                        onPointerDown: onResizePointerDown,
                        title: "Drag to resize"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                        lineNumber: 217,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex border-t",
                        style: {
                            height: panelHeight
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-1/2 shrink-0 overflow-y-auto border-r",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$workspace$2f$block$2d$data$2d$flow$2d$pane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlockDataFlowColumn"], {
                                    block: block,
                                    edges: edges,
                                    lastRun: lastRun,
                                    nodes: nodes,
                                    onExecuteStep: onExecuteStep,
                                    side: "inputs"
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                                    lineNumber: 224,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                                lineNumber: 223,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$workspace$2f$block$2d$data$2d$flow$2d$pane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlockDataFlowColumn"], {
                                    block: block,
                                    edges: edges,
                                    lastRun: lastRun,
                                    nodes: nodes,
                                    onExecuteStep: onExecuteStep,
                                    side: "outputs"
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                                    lineNumber: 234,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                                lineNumber: 233,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                        lineNumber: 222,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
        lineNumber: 180,
        columnNumber: 5
    }, this);
}
_s(InteractiveIOStrip, "lsZ2qxH/a1OXxxQOE51rgU0HFv4=");
_c1 = InteractiveIOStrip;
function AggregatorWorkspace({ block, disabled, edges, lastRun, nodes, onConfigPatch, onExecuteStep }) {
    const connectedSources = getConnectedSources(block, edges, nodes);
    const hasConnectedRulebook = connectedSources.length > 0;
    // undefined = no keyword mapper wired (show text input); [] = mapper wired but no categories yet
    const availableCategories = getConnectedKeywordCategories(block, edges, nodes);
    let workspaceContent;
    if (hasConnectedRulebook) {
        const primary = connectedSources[0];
        workspaceContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReadOnlyBanner, {
                    label: `${primary.label}${connectedSources.length > 1 ? ` +${connectedSources.length - 1} more` : ""}`
                }, void 0, false, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                    lineNumber: 278,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-h-0 flex-1 overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$rollup$2d$rulebook$2d$editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RollupRulebookEditor"], {
                        availableCategories: availableCategories,
                        config: primary.block.config || {},
                        disabled: true,
                        fill: true,
                        onConfigPatch: ()=>{}
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                        lineNumber: 282,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                    lineNumber: 281,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    } else {
        workspaceContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-0 flex-1 overflow-hidden",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$rollup$2d$rulebook$2d$editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RollupRulebookEditor"], {
                availableCategories: availableCategories,
                config: block.config || {},
                disabled: disabled,
                fill: true,
                onConfigPatch: onConfigPatch
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                lineNumber: 295,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
            lineNumber: 294,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-0 flex-1 flex-col overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-h-0 flex-1 flex-col overflow-hidden",
                children: workspaceContent
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                lineNumber: 308,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InteractiveIOStrip, {
                block: block,
                edges: edges,
                lastRun: lastRun,
                nodes: nodes,
                onExecuteStep: onExecuteStep
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
                lineNumber: 311,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/aggregator-workspace.tsx",
        lineNumber: 307,
        columnNumber: 5
    }, this);
}
_c2 = AggregatorWorkspace;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ReadOnlyBanner");
__turbopack_context__.k.register(_c1, "InteractiveIOStrip");
__turbopack_context__.k.register(_c2, "AggregatorWorkspace");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CalculationEngineWorkspace",
    ()=>CalculationEngineWorkspace
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$workspace$2f$block$2d$data$2d$flow$2d$pane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$logic$2d$viewers$2f$calculation$2d$engine$2d$editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-editor.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function getBlockLabel(nodes, blockId) {
    const node = nodes.find((n)=>n.id === blockId);
    return node?.data?.block?.label || node?.data?.label || blockId;
}
function getConnectedSources(block, edges, nodes) {
    return edges.filter((e)=>e.target === block.id && (e.data?.workflowEdge?.targetInputRole === "calculation_rules" || e.data?.targetInputRole === "calculation_rules")).flatMap((e)=>{
        const node = nodes.find((n)=>n.id === e.source);
        const nodeBlock = node?.data?.block;
        if (!node || !nodeBlock) return [];
        return [
            {
                nodeId: node.id,
                label: getBlockLabel(nodes, node.id),
                block: nodeBlock,
                edgeRole: e.data?.workflowEdge?.targetInputRole || e.data?.targetInputRole || "calculation_rules"
            }
        ];
    });
}
function ReadOnlyBanner({ label, onClear }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex shrink-0 items-center gap-2 border-b bg-amber-50 px-3 py-1.5 dark:bg-amber-950/30",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                className: "size-3.5 shrink-0 text-amber-600 dark:text-amber-400"
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "truncate text-xs text-amber-700 dark:text-amber-300",
                children: [
                    "Viewing ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                        lineNumber: 67,
                        columnNumber: 17
                    }, this),
                    " — read-only"
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            onClear && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "ml-auto shrink-0 text-[11px] text-amber-600 underline dark:text-amber-400",
                onClick: onClear,
                type: "button",
                children: "Back to own config"
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                lineNumber: 70,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
_c = ReadOnlyBanner;
function InteractiveIOStrip({ block, edges, lastRun, nodes, onExecuteStep }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [panelHeight, setPanelHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(220);
    const onResizePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InteractiveIOStrip.useCallback[onResizePointerDown]": (e)=>{
            e.preventDefault();
            const startY = e.clientY;
            const startHeight = panelHeight;
            const onMove = {
                "InteractiveIOStrip.useCallback[onResizePointerDown].onMove": (ev)=>{
                    const delta = startY - ev.clientY;
                    setPanelHeight(Math.max(140, Math.min(560, startHeight + delta)));
                }
            }["InteractiveIOStrip.useCallback[onResizePointerDown].onMove"];
            const onUp = {
                "InteractiveIOStrip.useCallback[onResizePointerDown].onUp": ()=>{
                    window.removeEventListener("pointermove", onMove);
                    window.removeEventListener("pointerup", onUp);
                }
            }["InteractiveIOStrip.useCallback[onResizePointerDown].onUp"];
            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", onUp);
        }
    }["InteractiveIOStrip.useCallback[onResizePointerDown]"], [
        panelHeight
    ]);
    const incomingCount = edges.filter((e)=>e.target === block.id).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "shrink-0 border-t bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "flex flex-1 items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/30",
                        onClick: ()=>setOpen((v)=>!v),
                        type: "button",
                        children: [
                            open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: "size-3.5 shrink-0 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                                lineNumber: 128,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                className: "size-3.5 shrink-0 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                                lineNumber: 130,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: "Connected I/O"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this),
                            incomingCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground",
                                children: [
                                    incomingCount,
                                    " input",
                                    incomingCount !== 1 ? "s" : ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                                lineNumber: 134,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-auto text-[10px] opacity-60",
                                children: open ? "collapse" : "expand"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    onExecuteStep && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "mr-3 flex shrink-0 items-center gap-1.5 rounded-md border border-primary/40 px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10",
                        onClick: onExecuteStep,
                        title: "Run this step",
                        type: "button",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                className: "size-3"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, this),
                            "Run step"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                        lineNumber: 143,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-1.5 w-full cursor-ns-resize bg-border/40 transition-colors hover:bg-primary/30 active:bg-primary/40",
                        onPointerDown: onResizePointerDown,
                        title: "Drag to resize"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                        lineNumber: 157,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex border-t",
                        style: {
                            height: panelHeight
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-1/2 shrink-0 overflow-y-auto border-r",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$workspace$2f$block$2d$data$2d$flow$2d$pane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlockDataFlowColumn"], {
                                    block: block,
                                    edges: edges,
                                    lastRun: lastRun,
                                    nodes: nodes,
                                    onExecuteStep: onExecuteStep,
                                    side: "inputs"
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                                    lineNumber: 164,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                                lineNumber: 163,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$workspace$2f$block$2d$data$2d$flow$2d$pane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlockDataFlowColumn"], {
                                    block: block,
                                    edges: edges,
                                    lastRun: lastRun,
                                    nodes: nodes,
                                    onExecuteStep: onExecuteStep,
                                    side: "outputs"
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                                    lineNumber: 174,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                                lineNumber: 173,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                        lineNumber: 162,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
        lineNumber: 120,
        columnNumber: 5
    }, this);
}
_s(InteractiveIOStrip, "lsZ2qxH/a1OXxxQOE51rgU0HFv4=");
_c1 = InteractiveIOStrip;
function CalculationEngineWorkspace({ block, createTermRequest, disabled, edges, insertRequest, lastRun, lastRunOutput, nodes, onConfigPatch, onExecuteStep, onSelectedTermIdChange, selectedTermId }) {
    const connectedSources = getConnectedSources(block, edges, nodes);
    const hasConnectedRulebook = connectedSources.length > 0;
    let workspaceContent;
    if (hasConnectedRulebook) {
        const primary = connectedSources[0];
        workspaceContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReadOnlyBanner, {
                    label: `${primary.label}${connectedSources.length > 1 ? ` +${connectedSources.length - 1} more` : ""}`
                }, void 0, false, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                    lineNumber: 226,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-h-0 flex-1 overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$logic$2d$viewers$2f$calculation$2d$engine$2d$editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CalculationEngineEditor"], {
                        block: primary.block,
                        disabled: true,
                        edges: edges,
                        fill: true,
                        lastRunOutput: {},
                        nodes: nodes,
                        onUpdateConfig: ()=>{}
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                        lineNumber: 230,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                    lineNumber: 229,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    } else {
        workspaceContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-0 flex-1 overflow-hidden",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$logic$2d$viewers$2f$calculation$2d$engine$2d$editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CalculationEngineEditor"], {
                block: block,
                createTermRequest: createTermRequest,
                disabled: disabled,
                edges: edges,
                fill: true,
                insertRequest: insertRequest,
                lastRunOutput: lastRunOutput,
                nodes: nodes,
                onSelectedTermIdChange: onSelectedTermIdChange,
                onUpdateConfig: (key, value)=>onConfigPatch({
                        [key]: value
                    }),
                selectedTermId: selectedTermId
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                lineNumber: 245,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
            lineNumber: 244,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-0 flex-1 flex-col overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-h-0 flex-1 flex-col overflow-hidden",
                children: workspaceContent
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                lineNumber: 264,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InteractiveIOStrip, {
                block: block,
                edges: edges,
                lastRun: lastRun,
                nodes: nodes,
                onExecuteStep: onExecuteStep
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
                lineNumber: 267,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace.tsx",
        lineNumber: 263,
        columnNumber: 5
    }, this);
}
_c2 = CalculationEngineWorkspace;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ReadOnlyBanner");
__turbopack_context__.k.register(_c1, "InteractiveIOStrip");
__turbopack_context__.k.register(_c2, "CalculationEngineWorkspace");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FieldBlockWorkspace",
    ()=>FieldBlockWorkspace,
    "FieldRow",
    ()=>FieldRow,
    "SourceDetailPanel",
    ()=>SourceDetailPanel,
    "extractFieldEntries",
    ()=>extractFieldEntries,
    "formatNumber",
    ()=>formatNumber,
    "getBackendOutputs",
    ()=>getBackendOutputs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutList$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/layout-list.js [app-client] (ecmascript) <export default as LayoutList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$workspace$2f$block$2d$data$2d$flow$2d$pane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
"use client";
;
;
;
// ── helpers ──────────────────────────────────────────────────────────────────
function asRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function asNumber(value) {
    return typeof value === "number" ? value : Number(value) || 0;
}
function formatNumber(value) {
    return value.toLocaleString("en-CA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
function getBackendOutputs(blockId, lastRun) {
    const log = lastRun?.logs.find((l)=>l.nodeId === blockId);
    const outer = asRecord(log?.output);
    const inner = asRecord(outer.output);
    return asRecord(inner.backendOutputs);
}
function buildTrace(sourceId, fieldBlockId, nodes, edges) {
    const steps = [];
    // Upstream blocks feeding the source block
    const incomingEdges = edges.filter((e)=>e.target === sourceId);
    for (const edge of incomingEdges){
        const upNode = nodes.find((n)=>n.id === edge.source);
        steps.push({
            id: edge.source,
            label: upNode?.data.label || edge.source,
            catalogId: upNode?.data.block?.catalogId,
            role: "upstream",
            edgeBelow: {
                fromRole: edge.data?.sourceOutputRole,
                toRole: edge.data?.targetInputRole,
                bindingLabel: edge.data?.bindingLabel
            }
        });
    }
    // Source block itself
    const sourceNode = nodes.find((n)=>n.id === sourceId);
    const fieldEdge = edges.find((e)=>e.source === sourceId && e.target === fieldBlockId);
    steps.push({
        id: sourceId,
        label: sourceNode?.data.label || sourceId,
        catalogId: sourceNode?.data.block?.catalogId,
        role: "source",
        edgeBelow: fieldEdge ? {
            fromRole: fieldEdge.data?.sourceOutputRole,
            toRole: fieldEdge.data?.targetInputRole,
            bindingLabel: fieldEdge.data?.bindingLabel
        } : undefined
    });
    // Field block (the display block)
    const fieldNode = nodes.find((n)=>n.id === fieldBlockId);
    steps.push({
        id: fieldBlockId,
        label: fieldNode?.data.label || fieldBlockId,
        catalogId: fieldNode?.data.block?.catalogId,
        role: "field"
    });
    return steps;
}
// ── data extraction ───────────────────────────────────────────────────────────
function extractFromRollupAggregator(backendOutputs) {
    const rollupTotalsBlock = asRecord(backendOutputs.rollup_totals);
    const rollupTotals = asRecord(rollupTotalsBlock.rollupTotals);
    const rollupTotalDetails = asRecord(rollupTotalsBlock.rollupTotalDetails);
    const categoryTotalsBlock = asRecord(backendOutputs.category_totals);
    const categoryTotalDetails = asRecord(categoryTotalsBlock.categoryTotalDetails);
    if (Object.keys(rollupTotals).length === 0) return [];
    return Object.entries(rollupTotals).map(([rollupId, total])=>{
        const detail = asRecord(rollupTotalDetails[rollupId]);
        const includedIds = Array.isArray(detail.includedCategoryIds) ? detail.includedCategoryIds : [];
        const subcategories = includedIds.map((catId)=>{
            const catDetail = asRecord(categoryTotalDetails[catId]);
            return {
                id: catId,
                label: String(catDetail.categoryLabel || catId),
                value: asNumber(catDetail.value),
                rowCount: asNumber(catDetail.rowCount)
            };
        });
        return {
            key: rollupId,
            label: String(detail.label || rollupId),
            value: asNumber(total),
            subcategories
        };
    });
}
function extractFromCalculationEngine(backendOutputs) {
    const calcBlock = asRecord(backendOutputs.calculated_results);
    const calculatedResults = asRecord(calcBlock.calculatedResults);
    const resultDetails = asRecord(calcBlock.resultDetails);
    const traceBlock = asRecord(backendOutputs.formula_trace);
    const formulaTrace = asRecord(traceBlock.formulaTrace);
    if (Object.keys(calculatedResults).length === 0) return [];
    return Object.entries(calculatedResults).map(([key, value])=>{
        const detail = asRecord(resultDetails[key]);
        const trace = asRecord(formulaTrace[key]);
        const inputValues = Array.isArray(trace.inputValues) ? trace.inputValues : [];
        const subcategories = inputValues.map((iv)=>({
                id: String(iv.operand),
                label: String(iv.operand),
                value: asNumber(iv.value)
            }));
        return {
            key,
            label: String(detail.label || key),
            description: String(trace.expression || detail.description || ""),
            value: asNumber(value),
            subcategories
        };
    });
}
function extractFromHierarchyAggregator(backendOutputs) {
    const finalTotalsBlock = asRecord(backendOutputs.final_totals);
    const finalTotals = asRecord(finalTotalsBlock.finalTotals);
    const categoryTotalsBlock = asRecord(backendOutputs.category_totals);
    const categoryTotalDetails = asRecord(categoryTotalsBlock.categoryTotalDetails);
    if (Object.keys(finalTotals).length === 0) return [];
    return Object.entries(finalTotals).map(([key, value])=>{
        const subcategories = Object.entries(categoryTotalDetails).map(([catId, catDetail])=>{
            const detail = asRecord(catDetail);
            return {
                id: catId,
                label: String(detail.categoryLabel || catId),
                value: asNumber(detail.value),
                rowCount: asNumber(detail.rowCount)
            };
        });
        return {
            key,
            label: key,
            value: asNumber(value),
            subcategories
        };
    });
}
function extractFromNamedValues(backendOutputs) {
    const namedValuesBlock = asRecord(backendOutputs.named_values);
    const namedValues = asRecord(namedValuesBlock.namedValues);
    return Object.entries(namedValues).map(([key, value])=>({
            key,
            label: key,
            value: asNumber(value),
            subcategories: []
        }));
}
function extractFieldEntries(backendOutputs) {
    const fromRollup = extractFromRollupAggregator(backendOutputs);
    if (fromRollup.length > 0) return fromRollup;
    const fromCalc = extractFromCalculationEngine(backendOutputs);
    if (fromCalc.length > 0) return fromCalc;
    const fromHierarchy = extractFromHierarchyAggregator(backendOutputs);
    if (fromHierarchy.length > 0) return fromHierarchy;
    return extractFromNamedValues(backendOutputs);
}
function getOperationLabel(catalogId, role) {
    if (role === "field") return "displays";
    if (!catalogId) return "";
    if (catalogId.startsWith("source:")) return "provides";
    if (catalogId === "logic:classification-mapping") return "classifies";
    if (catalogId === "logic:category-rollup-aggregator") return "aggregates";
    if (catalogId === "logic:calculation-engine") return "computes";
    if (catalogId === "logic:hierarchy-aggregator") return "aggregates";
    return "";
}
function getCategoryRows(blockId, categoryId, lastRun) {
    const outputs = getBackendOutputs(blockId, lastRun);
    const mappedRowsBlock = asRecord(outputs.mapped_rows);
    const rows = Array.isArray(mappedRowsBlock.mappedRows) ? mappedRowsBlock.mappedRows : [];
    return rows.filter((r)=>r.categoryId === categoryId).map((r)=>({
            account: r.account,
            label: r.label,
            matchedKeyword: r.matchedKeyword,
            amount: asNumber(r.amount),
            confidence: asNumber(r.confidence)
        }));
}
function SourceDetailPanel({ state, block, nodes, edges, lastRun, onClose }) {
    _s();
    const { sub, parentLabel, sourceId, initialTab } = state;
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialTab);
    const traceSteps = buildTrace(sourceId, block.id, nodes, edges);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex shrink-0 flex-col border-l bg-background",
        style: {
            width: 360
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-2 border-b px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
                                children: "Review Workspace"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 327,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-0.5 truncate font-semibold text-sm",
                                children: [
                                    sub.label !== sub.id ? sub.label : sub.id,
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-normal text-muted-foreground",
                                        children: [
                                            "— ",
                                            tab === "history" ? "History" : "Evidence"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                        lineNumber: 332,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 330,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-0.5 text-[10px] text-muted-foreground/70",
                                children: [
                                    "in ",
                                    parentLabel
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 336,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 326,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                        onClick: onClose,
                        type: "button",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "size-4"
                        }, void 0, false, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                            lineNumber: 343,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 338,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                lineNumber: 325,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex border-b",
                children: [
                    "evidence",
                    "history"
                ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors " + (tab === t ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"),
                        onClick: ()=>setTab(t),
                        type: "button",
                        children: [
                            t === "evidence" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                                className: "size-3"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 361,
                                columnNumber: 33
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                className: "size-3"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 361,
                                columnNumber: 67
                            }, this),
                            t.charAt(0).toUpperCase() + t.slice(1)
                        ]
                    }, t, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 350,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                lineNumber: 348,
                columnNumber: 7
            }, this),
            tab === "evidence" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-0 flex-1 overflow-y-auto px-4 py-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-5 border-b pb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-baseline justify-between gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-semibold text-sm",
                                        children: sub.label !== sub.id ? sub.label : sub.id
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                        lineNumber: 372,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "shrink-0 font-mono font-bold text-sm tabular-nums",
                                        children: [
                                            formatNumber(sub.value),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-normal text-muted-foreground text-xs",
                                                children: "CAD"
                                            }, void 0, false, {
                                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                lineNumber: 377,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                        lineNumber: 375,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 371,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono",
                                        children: sub.id
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                        lineNumber: 381,
                                        columnNumber: 15
                                    }, this),
                                    sub.rowCount != null && sub.rowCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "·"
                                            }, void 0, false, {
                                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                lineNumber: 384,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    sub.rowCount,
                                                    " source rows"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                lineNumber: 385,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 380,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 370,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
                        children: "Data Lineage"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 392,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute left-[7px] top-2 w-px bg-border",
                                style: {
                                    bottom: 8
                                }
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 397,
                                columnNumber: 13
                            }, this),
                            traceSteps.map((step, i)=>{
                                const isLast = i === traceSteps.length - 1;
                                const isSource = step.role === "source";
                                const isClassifier = step.catalogId === "logic:classification-mapping";
                                const isSourceBlock = step.catalogId?.startsWith("source:") ?? false;
                                const opLabel = getOperationLabel(step.catalogId, step.role);
                                // rows classified into sub.id by this block (only for classifier steps)
                                const matchedRows = isClassifier ? getCategoryRows(step.id, sub.id, lastRun) : [];
                                const shownRows = matchedRows.slice(0, 6);
                                const hiddenCount = matchedRows.length - shownRows.length;
                                // source block config detail
                                const stepNode = nodes.find((n)=>n.id === step.id);
                                const stepConfig = asRecord(stepNode?.data.block?.config ?? {});
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: isLast ? "" : "mb-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex gap-3 pl-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute left-0 top-[5px] size-3.5 rounded-full border-2 " + (isSource ? "border-violet-500 bg-violet-500" : isClassifier ? "border-amber-400 bg-amber-400" : "border-border bg-background")
                                                }, void 0, false, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                    lineNumber: 422,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 pb-0.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-medium text-sm " + (isSource || isClassifier ? "text-foreground" : "text-muted-foreground"),
                                                                    children: step.label
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                                    lineNumber: 436,
                                                                    columnNumber: 25
                                                                }, this),
                                                                opLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "rounded px-1.5 py-0.5 text-[10px] font-medium " + (isSource ? "bg-violet-500/15 text-violet-500" : isClassifier ? "bg-amber-400/15 text-amber-600" : "bg-muted text-muted-foreground"),
                                                                    children: opLabel
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                                    lineNumber: 445,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                            lineNumber: 435,
                                                            columnNumber: 23
                                                        }, this),
                                                        isSourceBlock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-1 text-[10px] text-muted-foreground",
                                                            children: stepConfig.workbookName ? String(stepConfig.workbookName) : stepConfig.sourceKind ? String(stepConfig.sourceKind).replace(/_/g, " ") : step.catalogId?.replace("source:", "") ?? ""
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                            lineNumber: 462,
                                                            columnNumber: 25
                                                        }, this),
                                                        isClassifier && shownRows.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-1.5 space-y-1",
                                                            children: [
                                                                shownRows.map((row, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "border-l-2 border-amber-300 pl-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-baseline justify-between gap-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "min-w-0 truncate text-[11px] font-medium",
                                                                                        children: row.label || row.account || "—"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                                                        lineNumber: 477,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "shrink-0 font-mono text-[11px] tabular-nums",
                                                                                        children: [
                                                                                            formatNumber(row.amount),
                                                                                            " CAD"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                                                        lineNumber: 480,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                                                lineNumber: 476,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            row.matchedKeyword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-[10px] text-muted-foreground",
                                                                                children: [
                                                                                    "keyword:",
                                                                                    " ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "font-mono text-amber-600",
                                                                                        children: [
                                                                                            "“",
                                                                                            row.matchedKeyword,
                                                                                            "”"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                                                        lineNumber: 487,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    row.account && row.label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "ml-1.5 opacity-60",
                                                                                        children: row.account
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                                                        lineNumber: 491,
                                                                                        columnNumber: 37
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                                                lineNumber: 485,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, j, true, {
                                                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                                        lineNumber: 475,
                                                                        columnNumber: 29
                                                                    }, this)),
                                                                hiddenCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "pl-2 text-[10px] text-muted-foreground/60",
                                                                    children: [
                                                                        "+",
                                                                        hiddenCount,
                                                                        " more row",
                                                                        hiddenCount !== 1 ? "s" : ""
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                                    lineNumber: 498,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                            lineNumber: 473,
                                                            columnNumber: 25
                                                        }, this),
                                                        isSource && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-1.5 border-l-2 border-violet-400 pl-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-baseline justify-between",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-mono text-[11px] text-violet-500",
                                                                            children: sub.id
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                                            lineNumber: 509,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-mono font-semibold text-[11px] tabular-nums text-violet-500",
                                                                            children: [
                                                                                formatNumber(sub.value),
                                                                                " CAD"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                                            lineNumber: 510,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                                    lineNumber: 508,
                                                                    columnNumber: 27
                                                                }, this),
                                                                sub.rowCount != null && sub.rowCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-[10px] text-violet-400/70",
                                                                    children: [
                                                                        sub.rowCount,
                                                                        " rows accumulated"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                                    lineNumber: 515,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                            lineNumber: 507,
                                                            columnNumber: 25
                                                        }, this),
                                                        step.role === "field" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-[10px] text-muted-foreground",
                                                            children: [
                                                                "in ",
                                                                parentLabel
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                            lineNumber: 523,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                            lineNumber: 420,
                                            columnNumber: 19
                                        }, this),
                                        !isLast && step.edgeBelow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative pl-6 py-1",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-0.5",
                                                children: [
                                                    step.edgeBelow.bindingLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "italic text-[10px] text-muted-foreground/60",
                                                        children: step.edgeBelow.bindingLabel
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                        lineNumber: 533,
                                                        columnNumber: 27
                                                    }, this),
                                                    (step.edgeBelow.fromRole || step.edgeBelow.toRole) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-mono text-[10px] text-muted-foreground/50",
                                                        children: [
                                                            step.edgeBelow.fromRole,
                                                            step.edgeBelow.fromRole && step.edgeBelow.toRole ? " → " : "",
                                                            step.edgeBelow.toRole
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                        lineNumber: 538,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                lineNumber: 531,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                            lineNumber: 530,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, `${step.id}-${i}`, true, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                    lineNumber: 418,
                                    columnNumber: 17
                                }, this);
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 395,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                lineNumber: 368,
                columnNumber: 9
            }, this),
            tab === "history" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                        className: "size-8 opacity-30"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 556,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs",
                        children: "No history recorded for this line"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 557,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                lineNumber: 555,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
        lineNumber: 323,
        columnNumber: 5
    }, this);
}
_s(SourceDetailPanel, "asHEMsqywa+HqWsf3uudH8SnW2A=");
_c = SourceDetailPanel;
function FieldRow({ entry, onShowEvidence, onShowHistory, activeSubId }) {
    _s1();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const hasChildren = entry.subcategories.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border-b last:border-b-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/30",
                onClick: ()=>hasChildren && setOpen((v)=>!v),
                style: {
                    cursor: hasChildren ? "pointer" : "default"
                },
                type: "button",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex w-4 shrink-0 items-center justify-center text-muted-foreground",
                        children: hasChildren ? open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                            className: "size-3.5"
                        }, void 0, false, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                            lineNumber: 592,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            className: "size-3.5"
                        }, void 0, false, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                            lineNumber: 594,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "size-3.5"
                        }, void 0, false, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                            lineNumber: 597,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 589,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-28 shrink-0 overflow-hidden truncate font-mono font-semibold text-violet-500 text-xs uppercase",
                        children: entry.key
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 600,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex min-w-0 flex-1 flex-col gap-0.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-baseline gap-1.5",
                                children: [
                                    entry.label !== entry.key && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate font-medium text-sm",
                                        children: entry.label
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                        lineNumber: 606,
                                        columnNumber: 15
                                    }, this),
                                    hasChildren && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "shrink-0 text-muted-foreground text-xs",
                                        children: [
                                            "(",
                                            entry.subcategories.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                        lineNumber: 609,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 604,
                                columnNumber: 11
                            }, this),
                            entry.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate font-normal text-muted-foreground text-xs",
                                children: entry.description
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 615,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 603,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "shrink-0 font-mono text-sm tabular-nums",
                        children: formatNumber(entry.value)
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 620,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-10 shrink-0 text-right text-muted-foreground text-xs",
                        children: "CAD"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 623,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                lineNumber: 583,
                columnNumber: 7
            }, this),
            open && hasChildren && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t bg-muted/10",
                children: entry.subcategories.map((sub)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0 " + (activeSubId === sub.id ? "bg-primary/5 border-l-2 border-l-primary" : ""),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-4 shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 639,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-28 shrink-0 overflow-hidden truncate font-mono text-muted-foreground text-xs",
                                children: sub.id
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 640,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "min-w-0 flex-1 truncate text-muted-foreground text-sm",
                                children: [
                                    sub.label !== sub.id ? sub.label : "",
                                    sub.rowCount !== undefined && sub.rowCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-1.5 text-xs opacity-60",
                                        children: [
                                            "(",
                                            sub.rowCount,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                        lineNumber: 646,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 643,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "shrink-0 font-mono text-sm tabular-nums",
                                children: formatNumber(sub.value)
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 649,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-10 shrink-0 text-right text-muted-foreground text-xs",
                                children: "CAD"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 652,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex shrink-0 items-center gap-0.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                                        onClick: ()=>onShowEvidence?.(sub),
                                        title: "Show source evidence",
                                        type: "button",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                                            className: "size-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                            lineNumber: 661,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                        lineNumber: 655,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                                        onClick: ()=>onShowHistory?.(sub),
                                        title: "Show history",
                                        type: "button",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                            className: "size-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                            lineNumber: 669,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                        lineNumber: 663,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 654,
                                columnNumber: 15
                            }, this)
                        ]
                    }, sub.id, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 630,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                lineNumber: 628,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
        lineNumber: 581,
        columnNumber: 5
    }, this);
}
_s1(FieldRow, "xG1TONbKtDWtdOTrXaTAsNhPg/Q=");
_c1 = FieldRow;
// ── Connected I/O strip (same pattern as AggregatorWorkspace) ─────────────────
function InteractiveIOStrip({ block, edges, lastRun, nodes, onExecuteStep }) {
    _s2();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [panelHeight, setPanelHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(220);
    const onResizePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InteractiveIOStrip.useCallback[onResizePointerDown]": (e)=>{
            e.preventDefault();
            const startY = e.clientY;
            const startHeight = panelHeight;
            const onMove = {
                "InteractiveIOStrip.useCallback[onResizePointerDown].onMove": (ev)=>{
                    setPanelHeight(Math.max(140, Math.min(560, startHeight + (startY - ev.clientY))));
                }
            }["InteractiveIOStrip.useCallback[onResizePointerDown].onMove"];
            const onUp = {
                "InteractiveIOStrip.useCallback[onResizePointerDown].onUp": ()=>{
                    window.removeEventListener("pointermove", onMove);
                    window.removeEventListener("pointerup", onUp);
                }
            }["InteractiveIOStrip.useCallback[onResizePointerDown].onUp"];
            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", onUp);
        }
    }["InteractiveIOStrip.useCallback[onResizePointerDown]"], [
        panelHeight
    ]);
    const incomingCount = edges.filter((e)=>e.target === block.id).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "shrink-0 border-t bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "flex flex-1 items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/30",
                        onClick: ()=>setOpen((v)=>!v),
                        type: "button",
                        children: [
                            open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: "size-3.5 shrink-0 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 727,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                className: "size-3.5 shrink-0 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 729,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: "Connected I/O"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 731,
                                columnNumber: 11
                            }, this),
                            incomingCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground",
                                children: [
                                    incomingCount,
                                    " input",
                                    incomingCount !== 1 ? "s" : ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 733,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-auto text-[10px] opacity-60",
                                children: open ? "collapse" : "expand"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 737,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 721,
                        columnNumber: 9
                    }, this),
                    onExecuteStep && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "mr-3 flex shrink-0 items-center gap-1.5 rounded-md border border-primary/40 px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10",
                        onClick: onExecuteStep,
                        title: "Run this block",
                        type: "button",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                className: "size-3"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 748,
                                columnNumber: 13
                            }, this),
                            "Run step"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 742,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                lineNumber: 720,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-1.5 w-full cursor-ns-resize bg-border/40 transition-colors hover:bg-primary/30 active:bg-primary/40",
                        onPointerDown: onResizePointerDown,
                        title: "Drag to resize"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 756,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex border-t",
                        style: {
                            height: panelHeight
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-1/2 shrink-0 overflow-y-auto border-r",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$workspace$2f$block$2d$data$2d$flow$2d$pane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlockDataFlowColumn"], {
                                    block: block,
                                    edges: edges,
                                    lastRun: lastRun,
                                    nodes: nodes,
                                    onExecuteStep: onExecuteStep,
                                    side: "inputs"
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                    lineNumber: 763,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 762,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$workspace$2f$block$2d$data$2d$flow$2d$pane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlockDataFlowColumn"], {
                                    block: block,
                                    edges: edges,
                                    lastRun: lastRun,
                                    nodes: nodes,
                                    onExecuteStep: onExecuteStep,
                                    side: "outputs"
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                    lineNumber: 773,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                lineNumber: 772,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 761,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
        lineNumber: 719,
        columnNumber: 5
    }, this);
}
_s2(InteractiveIOStrip, "lsZ2qxH/a1OXxxQOE51rgU0HFv4=");
_c2 = InteractiveIOStrip;
// ── SourceGroup header ────────────────────────────────────────────────────────
function SourceHeader({ label, subtype }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2 border-b border-t bg-muted/30 px-4 py-1.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "size-1.5 shrink-0 rounded-full bg-violet-400/70"
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                lineNumber: 794,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "min-w-0 flex-1 truncate font-medium text-xs text-muted-foreground",
                children: label
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                lineNumber: 795,
                columnNumber: 7
            }, this),
            subtype && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground",
                children: subtype
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                lineNumber: 799,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
        lineNumber: 793,
        columnNumber: 5
    }, this);
}
_c3 = SourceHeader;
function FieldBlockWorkspace({ block, edges, lastRun, nodes, onExecuteStep, compact }) {
    _s3();
    const [selectedPanel, setSelectedPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const upstreamIds = edges.filter((e)=>e.target === block.id).map((e)=>e.source);
    const sourceGroups = upstreamIds.map((upstreamId)=>{
        const sourceNode = nodes.find((n)=>n.id === upstreamId);
        const sourceLabel = sourceNode?.data.label || upstreamId;
        const sourceSubtype = sourceNode?.data.block?.subtype;
        const backendOutputs = getBackendOutputs(upstreamId, lastRun);
        return {
            sourceId: upstreamId,
            sourceLabel,
            sourceSubtype,
            entries: extractFieldEntries(backendOutputs)
        };
    }).filter((g)=>g.entries.length > 0);
    const hasRun = Boolean(lastRun);
    const hasEntries = sourceGroups.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-0 flex-1 overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-h-0 flex-1 flex-col overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-h-0 flex-1 overflow-y-auto",
                        children: !hasEntries ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center gap-3 py-16 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutList$3e$__["LayoutList"], {
                                    className: "size-8 text-muted-foreground/40"
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                    lineNumber: 856,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium text-sm text-muted-foreground",
                                            children: hasRun ? "No values to display" : "No run data yet"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                            lineNumber: 858,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-muted-foreground text-xs",
                                            children: hasRun ? "Connect this block to a Calculation Engine, Category Rollup, or Rollup & Calculation Engine." : "Run the workflow to see computed values here."
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                            lineNumber: 861,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                    lineNumber: 857,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                            lineNumber: 855,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 border-b bg-muted/20 px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-4 shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                            lineNumber: 872,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-28 shrink-0",
                                            children: "Key"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                            lineNumber: 873,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex-1",
                                            children: "Label / formula"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                            lineNumber: 874,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "shrink-0",
                                            children: "Value"
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                            lineNumber: 875,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-10 shrink-0 text-right",
                                            children: "Cur."
                                        }, void 0, false, {
                                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                            lineNumber: 876,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                    lineNumber: 871,
                                    columnNumber: 15
                                }, this),
                                sourceGroups.map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SourceHeader, {
                                                label: group.sourceLabel,
                                                subtype: group.sourceSubtype
                                            }, void 0, false, {
                                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                lineNumber: 880,
                                                columnNumber: 19
                                            }, this),
                                            group.entries.map((entry)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldRow, {
                                                    activeSubId: selectedPanel?.parentLabel === entry.label ? selectedPanel.sub.id : null,
                                                    entry: entry,
                                                    onShowEvidence: (sub)=>setSelectedPanel((prev)=>prev?.sub.id === sub.id && prev?.parentLabel === entry.label && prev?.initialTab === "evidence" ? null : {
                                                                sub,
                                                                parentLabel: entry.label,
                                                                blockLabel: group.sourceLabel,
                                                                sourceId: group.sourceId,
                                                                initialTab: "evidence"
                                                            }),
                                                    onShowHistory: (sub)=>setSelectedPanel((prev)=>prev?.sub.id === sub.id && prev?.parentLabel === entry.label && prev?.initialTab === "history" ? null : {
                                                                sub,
                                                                parentLabel: entry.label,
                                                                blockLabel: group.sourceLabel,
                                                                sourceId: group.sourceId,
                                                                initialTab: "history"
                                                            })
                                                }, `${group.sourceId}:${entry.key}`, false, {
                                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                                    lineNumber: 885,
                                                    columnNumber: 21
                                                }, this))
                                        ]
                                    }, group.sourceId, true, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                                        lineNumber: 879,
                                        columnNumber: 17
                                    }, this))
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 853,
                        columnNumber: 9
                    }, this),
                    !compact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InteractiveIOStrip, {
                        block: block,
                        edges: edges,
                        lastRun: lastRun,
                        nodes: nodes,
                        onExecuteStep: onExecuteStep
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                        lineNumber: 921,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                lineNumber: 851,
                columnNumber: 7
            }, this),
            !compact && selectedPanel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SourceDetailPanel, {
                block: block,
                edges: edges,
                lastRun: lastRun,
                nodes: nodes,
                onClose: ()=>setSelectedPanel(null),
                state: selectedPanel
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
                lineNumber: 933,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/field-block-workspace.tsx",
        lineNumber: 849,
        columnNumber: 5
    }, this);
}
_s3(FieldBlockWorkspace, "1OtVWucoqsSB7yvSUthLlYVMrHU=");
_c4 = FieldBlockWorkspace;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "SourceDetailPanel");
__turbopack_context__.k.register(_c1, "FieldRow");
__turbopack_context__.k.register(_c2, "InteractiveIOStrip");
__turbopack_context__.k.register(_c3, "SourceHeader");
__turbopack_context__.k.register(_c4, "FieldBlockWorkspace");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KeywordMapperWorkspace",
    ()=>KeywordMapperWorkspace
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$keyword$2d$rulebook$2d$editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/source-viewers/keyword-rulebook-editor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$rule$2d$source$2d$editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/source-viewers/rule-source-editor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$workspace$2f$block$2d$data$2d$flow$2d$pane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/workspace/block-data-flow-pane.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function getBlockLabel(nodes, blockId) {
    const node = nodes.find((n)=>n.id === blockId);
    return node?.data?.block?.label || node?.data?.label || blockId;
}
function getConnectedSources(block, edges, nodes) {
    return edges.filter((e)=>e.target === block.id && (e.data?.workflowEdge?.targetInputRole === "keyword_rules" || e.data?.targetInputRole === "keyword_rules")).flatMap((e)=>{
        const node = nodes.find((n)=>n.id === e.source);
        const nodeBlock = node?.data?.block;
        if (!node || !nodeBlock) return [];
        return [
            {
                nodeId: node.id,
                label: getBlockLabel(nodes, node.id),
                block: nodeBlock,
                edgeRole: e.data?.workflowEdge?.targetInputRole || e.data?.targetInputRole || "keyword_rules"
            }
        ];
    });
}
function ReadOnlyBanner({ label, onClear }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex shrink-0 items-center gap-2 border-b bg-amber-50 px-3 py-1.5 dark:bg-amber-950/30",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                className: "size-3.5 shrink-0 text-amber-600 dark:text-amber-400"
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "truncate text-xs text-amber-700 dark:text-amber-300",
                children: [
                    "Viewing ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                        lineNumber: 68,
                        columnNumber: 17
                    }, this),
                    " — read-only"
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            onClear && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "ml-auto shrink-0 text-[11px] text-amber-600 underline dark:text-amber-400",
                onClick: onClear,
                type: "button",
                children: "Back to own config"
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                lineNumber: 71,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_c = ReadOnlyBanner;
function InteractiveIOStrip({ block, edges, lastRun, nodes, onExecuteStep }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [panelHeight, setPanelHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(220);
    const onResizePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InteractiveIOStrip.useCallback[onResizePointerDown]": (e)=>{
            e.preventDefault();
            const startY = e.clientY;
            const startHeight = panelHeight;
            const onMove = {
                "InteractiveIOStrip.useCallback[onResizePointerDown].onMove": (ev)=>{
                    const delta = startY - ev.clientY;
                    setPanelHeight(Math.max(140, Math.min(560, startHeight + delta)));
                }
            }["InteractiveIOStrip.useCallback[onResizePointerDown].onMove"];
            const onUp = {
                "InteractiveIOStrip.useCallback[onResizePointerDown].onUp": ()=>{
                    window.removeEventListener("pointermove", onMove);
                    window.removeEventListener("pointerup", onUp);
                }
            }["InteractiveIOStrip.useCallback[onResizePointerDown].onUp"];
            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", onUp);
        }
    }["InteractiveIOStrip.useCallback[onResizePointerDown]"], [
        panelHeight
    ]);
    const incomingCount = edges.filter((e)=>e.target === block.id).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "shrink-0 border-t bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "flex flex-1 items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/30",
                        onClick: ()=>setOpen((v)=>!v),
                        type: "button",
                        children: [
                            open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: "size-3.5 shrink-0 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                                lineNumber: 129,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                className: "size-3.5 shrink-0 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                                lineNumber: 131,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: "Connected I/O"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                                lineNumber: 133,
                                columnNumber: 11
                            }, this),
                            incomingCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground",
                                children: [
                                    incomingCount,
                                    " input",
                                    incomingCount !== 1 ? "s" : ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                                lineNumber: 135,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-auto text-[10px] opacity-60",
                                children: open ? "collapse" : "expand"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                                lineNumber: 139,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    onExecuteStep && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "mr-3 flex shrink-0 items-center gap-1.5 rounded-md border border-primary/40 px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10",
                        onClick: onExecuteStep,
                        title: "Run this step",
                        type: "button",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                className: "size-3"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                                lineNumber: 150,
                                columnNumber: 13
                            }, this),
                            "Run step"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                        lineNumber: 144,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-1.5 w-full cursor-ns-resize bg-border/40 transition-colors hover:bg-primary/30 active:bg-primary/40",
                        onPointerDown: onResizePointerDown,
                        title: "Drag to resize"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                        lineNumber: 158,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex border-t",
                        style: {
                            height: panelHeight
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-1/2 shrink-0 overflow-y-auto border-r",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$workspace$2f$block$2d$data$2d$flow$2d$pane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlockDataFlowColumn"], {
                                    block: block,
                                    edges: edges,
                                    lastRun: lastRun,
                                    nodes: nodes,
                                    onExecuteStep: onExecuteStep,
                                    side: "inputs"
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                                    lineNumber: 165,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                                lineNumber: 164,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$workspace$2f$block$2d$data$2d$flow$2d$pane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlockDataFlowColumn"], {
                                    block: block,
                                    edges: edges,
                                    lastRun: lastRun,
                                    nodes: nodes,
                                    onExecuteStep: onExecuteStep,
                                    side: "outputs"
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                                    lineNumber: 175,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                                lineNumber: 174,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                        lineNumber: 163,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
        lineNumber: 121,
        columnNumber: 5
    }, this);
}
_s(InteractiveIOStrip, "lsZ2qxH/a1OXxxQOE51rgU0HFv4=");
_c1 = InteractiveIOStrip;
function KeywordMapperWorkspace({ block, disabled, edges, lastRun, nodes, onConfigPatch, onExecuteStep, onSelectedRuleIdChange, selectedRuleId, sourceVersion }) {
    const connectedSources = getConnectedSources(block, edges, nodes);
    const hasConnectedRulebook = connectedSources.length > 0;
    let workspaceContent;
    if (hasConnectedRulebook) {
        const primary = connectedSources[0];
        workspaceContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReadOnlyBanner, {
                    label: `${primary.label}${connectedSources.length > 1 ? ` +${connectedSources.length - 1} more` : ""}`
                }, void 0, false, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                    lineNumber: 223,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-h-0 flex-1 overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$keyword$2d$rulebook$2d$editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KeywordRulebookEditor"], {
                        disabled: true,
                        fill: true,
                        onRulesChange: ()=>{},
                        rules: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$rule$2d$source$2d$editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getKeywordRules"])(primary.block.config || {}),
                        sourceVersion: 1
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                        lineNumber: 227,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                    lineNumber: 226,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    } else {
        workspaceContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-0 flex-1 overflow-hidden",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$keyword$2d$rulebook$2d$editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KeywordRulebookEditor"], {
                disabled: disabled,
                fill: true,
                onRulesChange: (rules)=>onConfigPatch({
                        keywordRules: rules
                    }),
                onSelectedRuleIdChange: onSelectedRuleIdChange,
                rules: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$rule$2d$source$2d$editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getKeywordRules"])(block.config || {}),
                selectedRuleId: selectedRuleId,
                sourceVersion: sourceVersion
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                lineNumber: 240,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
            lineNumber: 239,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-0 flex-1 flex-col overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-h-0 flex-1 flex-col overflow-hidden",
                children: workspaceContent
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                lineNumber: 255,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InteractiveIOStrip, {
                block: block,
                edges: edges,
                lastRun: lastRun,
                nodes: nodes,
                onExecuteStep: onExecuteStep
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
                lineNumber: 258,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace.tsx",
        lineNumber: 254,
        columnNumber: 5
    }, this);
}
_c2 = KeywordMapperWorkspace;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ReadOnlyBanner");
__turbopack_context__.k.register(_c1, "InteractiveIOStrip");
__turbopack_context__.k.register(_c2, "KeywordMapperWorkspace");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HierarchyAggregatorRunSections",
    ()=>HierarchyAggregatorRunSections
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$aggregation$2d$rule$2d$modes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/source-viewers/aggregation-rule-modes.ts [app-client] (ecmascript)");
;
;
function asRecord(value) {
    return typeof value === "object" && value !== null ? value : null;
}
function asStringList(value) {
    if (Array.isArray(value)) {
        return value.map(String).filter(Boolean);
    }
    if (typeof value === "string") {
        return value.split(",").map((item)=>item.trim()).filter(Boolean);
    }
    return [];
}
function formatValue(value) {
    if (Array.isArray(value)) {
        return value.map(formatValue).join(", ");
    }
    if (value === undefined || value === null || value === "") {
        return "-";
    }
    if (typeof value === "object") {
        return JSON.stringify(value);
    }
    return String(value);
}
function formatInputValues(value) {
    const records = Array.isArray(value) ? value.map(asRecord).filter(Boolean) : [];
    if (records.length === 0) {
        return formatValue(value);
    }
    return records.map((record)=>{
        const label = record?.label || record?.refId || record?.refType || "input";
        const inputValue = record?.signedValue ?? record?.value ?? record?.amount ?? "-";
        return `${String(label)}=${String(inputValue)}`;
    }).join(", ");
}
function getNumericMapRows({ labelKey, mode, record, valueKey }) {
    if (!record) {
        return [];
    }
    return Object.entries(record).map(([key, value])=>({
            [labelKey]: key,
            mode,
            [valueKey]: value
        }));
}
function getCategoryRows(output) {
    const categoryTotals = asRecord(output.categoryTotals);
    const details = asRecord(output.categoryTotalDetails);
    if (!details || Object.keys(details).length === 0) {
        return getNumericMapRows({
            labelKey: "categoryId",
            record: categoryTotals,
            valueKey: "total"
        });
    }
    return Object.entries(details).map(([categoryId, detail])=>{
        const record = asRecord(detail);
        return {
            categoryId: record?.categoryId || categoryId,
            categoryLabel: record?.categoryLabel || categoryId,
            rowCount: record?.rowCount ?? "-",
            sourceRows: asStringList(record?.includedRows).join(", ") || "-",
            total: record?.value ?? record?.amount ?? categoryTotals?.[categoryId]
        };
    });
}
function getNodeDetailRows(output) {
    const details = asRecord(output.nodeTotalDetails);
    if (!details || Object.keys(details).length === 0) {
        return [];
    }
    const rows = [];
    for (const [nodeId, detail] of Object.entries(details)){
        const record = asRecord(detail);
        if (!record) {
            continue;
        }
        const mode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$aggregation$2d$rule$2d$modes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAggregationRuleMode"])(record);
        const formulaTrace = asRecord(record.formulaTrace);
        rows.push({
            expression: formulaTrace?.expression,
            inputRefs: asStringList(formulaTrace?.inputRefs).join(", ") || "-",
            label: record.label || nodeId,
            mode: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$aggregation$2d$rule$2d$modes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAggregationRuleModeLabel"])(record),
            nodeId: record.nodeId || nodeId,
            operation: record.operation || "-",
            result: record.value ?? record.amount ?? "-",
            resultName: record.resultName || "-",
            warnings: asStringList(record.warnings).join(", ") || "-",
            _mode: mode
        });
    }
    return rows;
}
function getRollupRows(output) {
    const detailRows = getNodeDetailRows(output).filter((row)=>row._mode === "rollup");
    if (detailRows.length > 0) {
        return detailRows;
    }
    return getNumericMapRows({
        labelKey: "nodeId",
        mode: "Rollup",
        record: asRecord(output.groupTotals),
        valueKey: "result"
    });
}
function getFormulaRows(output) {
    const detailRows = getNodeDetailRows(output).filter((row)=>row._mode !== "rollup");
    const finalRows = getNumericMapRows({
        labelKey: "resultName",
        mode: "Final result",
        record: asRecord(output.finalTotals),
        valueKey: "result"
    });
    const officialLineRows = getNumericMapRows({
        labelKey: "resultName",
        mode: "Official line",
        record: asRecord(output.officialLineValues),
        valueKey: "result"
    });
    if (detailRows.length > 0) {
        return [
            ...detailRows,
            ...officialLineRows
        ];
    }
    return [
        ...finalRows,
        ...officialLineRows
    ];
}
function getFormulaTraceRows(output) {
    const trace = asRecord(output.formulaTrace);
    if (!trace || Object.keys(trace).length === 0) {
        return [];
    }
    return Object.entries(trace).map(([nodeId, value])=>{
        const record = asRecord(value);
        return {
            computation: asStringList(record?.inputRefs).join(", ") || record?.operation || "-",
            formula: record?.expression || "-",
            inputValues: formatInputValues(record?.inputValues),
            nodeId: record?.nodeId || nodeId,
            result: record?.result ?? "-",
            warnings: asStringList(record?.warnings).join(", ") || "-"
        };
    });
}
function getWarnings(output) {
    const summary = asRecord(output.aggregationSummary);
    return asStringList(summary?.warnings);
}
function ProofTable({ compact, columns, emptyLabel, rows }) {
    if (rows.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-md bg-muted/20 p-3 text-muted-foreground text-xs",
            children: emptyLabel
        }, void 0, false, {
            fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
            lineNumber: 210,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `overflow-auto rounded-md bg-background/70 ${compact ? "max-h-56" : "max-h-72"}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            className: "w-full min-w-[720px] text-left text-xs",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                    className: "sticky top-0 bg-background",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                        className: "border-b",
                        children: columns.map((column)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: "px-2 py-1 font-medium",
                                children: column
                            }, column, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                                lineNumber: 224,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                        lineNumber: 222,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                    lineNumber: 221,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                    children: rows.map((row, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                            className: "border-b last:border-b-0",
                            children: columns.map((column)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: "max-w-72 truncate px-2 py-1",
                                    children: formatValue(row[column])
                                }, column, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                                    lineNumber: 239,
                                    columnNumber: 17
                                }, this))
                        }, String(row.nodeId || row.categoryId || row.resultName || index), false, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                            lineNumber: 232,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                    lineNumber: 230,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
            lineNumber: 220,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
        lineNumber: 217,
        columnNumber: 5
    }, this);
}
_c = ProofTable;
function Section({ children, title }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
        className: "rounded-md bg-muted/10",
        open: true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                className: "cursor-pointer select-none p-3 font-medium text-sm hover:bg-muted/20",
                children: title
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                lineNumber: 254,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 px-3 pb-3",
                children: children
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                lineNumber: 257,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
        lineNumber: 253,
        columnNumber: 5
    }, this);
}
_c1 = Section;
function HierarchyAggregatorRunSections({ compact, output }) {
    const categoryRows = getCategoryRows(output);
    const rollupRows = getRollupRows(output);
    const formulaRows = getFormulaRows(output);
    const formulaTraceRows = getFormulaTraceRows(output);
    const warnings = getWarnings(output);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                title: "Category totals",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProofTable, {
                    columns: [
                        "categoryId",
                        "categoryLabel",
                        "total",
                        "rowCount",
                        "sourceRows"
                    ],
                    compact: compact,
                    emptyLabel: "Run the Rollup & Calculation Engine to see mapped category totals.",
                    rows: categoryRows
                }, void 0, false, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                    lineNumber: 278,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                title: "Rollup / group totals",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProofTable, {
                    columns: [
                        "nodeId",
                        "label",
                        "mode",
                        "operation",
                        "inputRefs",
                        "result",
                        "warnings"
                    ],
                    compact: compact,
                    emptyLabel: "No rollup totals are available yet.",
                    rows: rollupRows
                }, void 0, false, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                    lineNumber: 293,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                lineNumber: 292,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                title: "Formula / final totals",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProofTable, {
                    columns: [
                        "nodeId",
                        "label",
                        "mode",
                        "expression",
                        "inputRefs",
                        "result",
                        "resultName"
                    ],
                    compact: compact,
                    emptyLabel: "No formula or final totals are available yet.",
                    rows: formulaRows
                }, void 0, false, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                    lineNumber: 310,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                lineNumber: 309,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                title: "Formula trace",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProofTable, {
                    columns: [
                        "nodeId",
                        "formula",
                        "inputValues",
                        "computation",
                        "result",
                        "warnings"
                    ],
                    compact: compact,
                    emptyLabel: "No formula trace is available yet.",
                    rows: formulaTraceRows
                }, void 0, false, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                    lineNumber: 327,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                lineNumber: 326,
                columnNumber: 7
            }, this),
            warnings.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                title: "Warnings",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "space-y-1 text-muted-foreground text-xs",
                    children: warnings.map((warning)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: warning
                        }, warning, false, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                            lineNumber: 346,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                    lineNumber: 344,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
                lineNumber: 343,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx",
        lineNumber: 276,
        columnNumber: 5
    }, this);
}
_c2 = HierarchyAggregatorRunSections;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ProofTable");
__turbopack_context__.k.register(_c1, "Section");
__turbopack_context__.k.register(_c2, "HierarchyAggregatorRunSections");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HierarchyAggregatorPanel",
    ()=>HierarchyAggregatorPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$aggregation$2d$rule$2d$modes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/source-viewers/aggregation-rule-modes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$aggregation$2d$rules$2d$overview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/source-viewers/aggregation-rules-overview.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$rule$2d$source$2d$editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/source-viewers/rule-source-editor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$logic$2d$viewers$2f$hierarchy$2d$aggregator$2d$run$2d$sections$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-run-sections.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function asRecord(value) {
    return typeof value === "object" && value !== null ? value : null;
}
function getBlockLabel(nodes, blockId) {
    return nodes.find((node)=>node.id === blockId)?.data.block?.label || blockId;
}
function getLatestOutput(blockId, lastRun) {
    const log = lastRun?.logs.find((item)=>item.nodeId === blockId);
    const result = asRecord(log?.output);
    return asRecord(result?.output) || result || {};
}
function getConnectedSource({ edges, nodes, roleId, targetBlockId }) {
    const edge = edges.find((item)=>item.target === targetBlockId && item.data?.workflowEdge?.targetInputRole === roleId);
    return edge ? {
        edge,
        label: getBlockLabel(nodes, edge.source),
        sourceNodeId: edge.source
    } : undefined;
}
function getBlockById(nodes, blockId) {
    if (!blockId) {
        return;
    }
    return nodes.find((node)=>node.id === blockId)?.data.block;
}
function getConnectedKeywordRules({ edges, keywordMapperNodeId, nodes }) {
    if (!keywordMapperNodeId) {
        return [];
    }
    const keywordRuleEdge = edges.find((edge)=>edge.target === keywordMapperNodeId && edge.data?.workflowEdge?.targetInputRole === "keyword_rules");
    const keywordRuleBlock = getBlockById(nodes, keywordRuleEdge?.source);
    return keywordRuleBlock ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$rule$2d$source$2d$editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getKeywordRules"])(keywordRuleBlock.config || {}) : [];
}
function ConnectionCard({ action, description, label, status, title }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-md border bg-background/70 p-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-medium text-sm",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 text-muted-foreground text-xs",
                                children: description
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full border bg-muted/30 px-2 py-0.5 text-[10px] uppercase",
                        children: status
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 text-sm",
                children: label || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground",
                    children: "Not connected"
                }, void 0, false, {
                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                    lineNumber: 118,
                    columnNumber: 19
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            action && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3",
                children: action
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                lineNumber: 120,
                columnNumber: 18
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
_c = ConnectionCard;
function HierarchyAggregatorPanel({ block, edges, lastRun, nodes, onOpenRuleSource }) {
    const output = getLatestOutput(block.id, lastRun);
    const mappedRowsConnection = getConnectedSource({
        edges,
        nodes,
        roleId: "mapped_rows",
        targetBlockId: block.id
    });
    const aggregationRulesConnection = getConnectedSource({
        edges,
        nodes,
        roleId: "aggregation_rules",
        targetBlockId: block.id
    });
    const aggregationRulesBlock = getBlockById(nodes, aggregationRulesConnection?.sourceNodeId);
    const aggregationRules = aggregationRulesBlock ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$rule$2d$source$2d$editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAggregationRules"])(aggregationRulesBlock.config || {}) : [];
    const keywordRules = getConnectedKeywordRules({
        edges,
        keywordMapperNodeId: mappedRowsConnection?.sourceNodeId,
        nodes
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4 rounded-md border bg-muted/20 p-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-semibold text-sm",
                        children: "Rollup & Calculation Engine"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-muted-foreground text-xs",
                        children: "Groups mapped categories into rollups and evaluates calculator/formula nodes to produce final totals."
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-2 lg:grid-cols-3",
                children: [
                    [
                        "1",
                        "Group rows by category"
                    ],
                    [
                        "2",
                        "Evaluate rollup and formula nodes"
                    ],
                    [
                        "3",
                        "Emit final totals and trace"
                    ]
                ].map(([step, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-md border bg-background/70 p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-muted-foreground text-xs",
                                children: [
                                    "Step ",
                                    step
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                                lineNumber: 181,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 font-medium text-sm",
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this)
                        ]
                    }, step, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                        lineNumber: 180,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                lineNumber: 174,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-3 xl:grid-cols-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-md border bg-background/70 p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-medium text-sm",
                                children: "Internal modes"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                                lineNumber: 189,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 flex flex-wrap gap-1.5 text-xs",
                                children: [
                                    "Rollup nodes",
                                    "Formula nodes",
                                    "Constants",
                                    "Final result nodes",
                                    "Official line outputs"
                                ].map((mode)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "rounded-md bg-muted/30 px-2 py-1",
                                        children: mode
                                    }, mode, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                                        lineNumber: 198,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                                lineNumber: 190,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                        lineNumber: 188,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-md border bg-background/70 p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-medium text-sm",
                                children: "Supported operations"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                                lineNumber: 205,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 flex flex-wrap gap-1.5 text-xs",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$aggregation$2d$rule$2d$modes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPORTED_AGGREGATION_OPERATIONS"].map((operation)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        className: "rounded-md bg-muted/30 px-2 py-1",
                                        children: operation
                                    }, operation, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                                        lineNumber: 208,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                                lineNumber: 206,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                        lineNumber: 204,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-md border bg-background/70 p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-medium text-sm",
                                children: "Output roles"
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                                lineNumber: 218,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 flex flex-wrap gap-1.5 text-xs",
                                children: [
                                    "category_totals",
                                    "node_totals",
                                    "group_totals",
                                    "final_totals",
                                    "official_line_values",
                                    "aggregation_tree",
                                    "included_rows_by_node",
                                    "excluded_rows",
                                    "formula_trace",
                                    "aggregation_summary"
                                ].map((role)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        className: "rounded-md bg-muted/30 px-2 py-1",
                                        children: role
                                    }, role, false, {
                                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                                        lineNumber: 232,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                                lineNumber: 219,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                        lineNumber: 217,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-3 xl:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ConnectionCard, {
                        description: "mapped_rows from Keyword Mapper.",
                        label: mappedRowsConnection?.label,
                        status: mappedRowsConnection ? "connected" : "missing",
                        title: "Mapped rows input"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ConnectionCard, {
                        action: aggregationRulesConnection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: ()=>onOpenRuleSource(aggregationRulesConnection.sourceNodeId),
                            size: "sm",
                            type: "button",
                            variant: "secondary",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                    className: "mr-2 size-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                                    lineNumber: 258,
                                    columnNumber: 17
                                }, void 0),
                                "Open rules"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                            lineNumber: 250,
                            columnNumber: 15
                        }, void 0),
                        description: "aggregation_rules from Aggregation Rulebook.",
                        label: aggregationRulesConnection?.label,
                        status: aggregationRulesConnection ? "connected" : "missing",
                        title: "Aggregation rules input"
                    }, void 0, false, {
                        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                        lineNumber: 247,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                lineNumber: 240,
                columnNumber: 7
            }, this),
            aggregationRules.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$source$2d$viewers$2f$aggregation$2d$rules$2d$overview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AggregationRulesOverview"], {
                keywordRules: keywordRules,
                nodeTotals: asRecord(output.nodeTotals) || undefined,
                rules: aggregationRules
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                lineNumber: 271,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$workflow$2d$builder$2f$ui$2f$logic$2d$viewers$2f$hierarchy$2d$aggregator$2d$run$2d$sections$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HierarchyAggregatorRunSections"], {
                compact: true,
                output: output
            }, void 0, false, {
                fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
                lineNumber: 278,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel.tsx",
        lineNumber: 165,
        columnNumber: 5
    }, this);
}
_c1 = HierarchyAggregatorPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "ConnectionCard");
__turbopack_context__.k.register(_c1, "HierarchyAggregatorPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=features_workflow-builder_ui_logic-viewers_2f1383a0._.js.map